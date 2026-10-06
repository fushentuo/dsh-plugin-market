import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// 宿主半侧：
//  1) /plugin-market/snapshot  —— 把设置快照写到用户选择的存储目录
//  2) /plugin-market/translate —— 代理翻译请求（宿主侧发起，避开浏览器 CORS）
const SNAPSHOT_PATH = "/plugin-market/snapshot";
const TRANSLATE_PATH = "/plugin-market/translate";

function sendJson(res, status, payload) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 2_000_000) req.destroy();
    });
    req.on("end", () => resolve(body));
    req.on("error", () => resolve(""));
  });
}

async function tryGoogle(text, target) {
  const url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl="
    + encodeURIComponent(target) + "&dt=t&q=" + encodeURIComponent(text);
  const response = await fetch(url, { signal: AbortSignal.timeout(12000) });
  if (!response.ok) return null;
  const data = await response.json();
  if (Array.isArray(data) && Array.isArray(data[0])) {
    const out = data[0].map((segment) => (segment && segment[0]) ? segment[0] : "").join("");
    return out || null;
  }
  return null;
}

async function tryMyMemory(text, target) {
  const url = "https://api.mymemory.translated.net/get?q=" + encodeURIComponent(text)
    + "&langpair=auto|" + encodeURIComponent(target);
  const response = await fetch(url, { signal: AbortSignal.timeout(12000) });
  if (!response.ok) return null;
  const data = await response.json();
  const out = data && data.responseData && data.responseData.translatedText;
  return out || null;
}

async function translateText(text, target) {
  for (const attempt of [tryGoogle, tryMyMemory]) {
    try {
      const out = await attempt(text, target);
      if (out) return out;
    } catch (error) {
      // try the next provider
    }
  }
  return null;
}

export function apply(ctx) {
  ctx.inject(["webServer"], (child) => {
    child.effect(() => {
      const disposeSnapshot = child.webServer.register({
        kind: "exact",
        path: SNAPSHOT_PATH,
        handler: (req, res) => {
          if (req.method !== "POST") return sendJson(res, 405, { ok: false, error: "method-not-allowed" });
          readBody(req).then((body) => {
            try {
              const payload = JSON.parse(body || "{}");
              const location = payload.location;
              if (!location) return sendJson(res, 400, { ok: false, error: "missing-location" });
              mkdirSync(location, { recursive: true });
              writeFileSync(
                join(location, "dsh-plugin-market.json"),
                JSON.stringify({ ...(payload.settings || {}), savedAt: new Date().toISOString() }, null, 2),
                "utf8"
              );
              sendJson(res, 200, { ok: true });
            } catch (error) {
              sendJson(res, 400, { ok: false, error: String((error && error.message) || error) });
            }
          });
        }
      });

      const disposeTranslate = child.webServer.register({
        kind: "exact",
        path: TRANSLATE_PATH,
        handler: (req, res) => {
          if (req.method !== "POST") return sendJson(res, 405, { ok: false, error: "method-not-allowed" });
          readBody(req).then(async (body) => {
            try {
              const payload = JSON.parse(body || "{}");
              const text = String(payload.text || "").slice(0, 4500);
              const target = String(payload.target || "en");
              if (!text) return sendJson(res, 200, { ok: true, translated: null });
              const translated = await translateText(text, target);
              sendJson(res, 200, { ok: true, translated });
            } catch (error) {
              sendJson(res, 400, { ok: false, error: String((error && error.message) || error) });
            }
          });
        }
      });

      return () => {
        disposeSnapshot();
        disposeTranslate();
      };
    }, "plugin-market: routes");
  });
}
