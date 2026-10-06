import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// 宿主半侧：注册一个 HTTP 路由，供客户端把“设置快照”写到用户选择的存储目录。
// 权威设置副本在客户端 localStorage（Electron userData，重启不丢）；此路由只是额外备份。
const SNAPSHOT_PATH = "/plugin-market/snapshot";

export function apply(ctx) {
  ctx.inject(["webServer"], (child) => {
    child.effect(() => child.webServer.register({
      kind: "exact",
      path: SNAPSHOT_PATH,
      handler: (req, res) => {
        if (req.method !== "POST") {
          res.writeHead(405, { "content-type": "application/json" });
          res.end(JSON.stringify({ ok: false, error: "method-not-allowed" }));
          return;
        }
        let body = "";
        req.on("data", (chunk) => { body += chunk; });
        req.on("end", () => {
          try {
            const payload = JSON.parse(body || "{}");
            const location = payload.location;
            const settings = payload.settings || {};
            if (!location) {
              res.writeHead(400, { "content-type": "application/json" });
              res.end(JSON.stringify({ ok: false, error: "missing-location" }));
              return;
            }
            mkdirSync(location, { recursive: true });
            writeFileSync(
              join(location, "dsh-plugin-market.json"),
              JSON.stringify({ ...settings, savedAt: new Date().toISOString() }, null, 2),
              "utf8"
            );
            res.writeHead(200, { "content-type": "application/json" });
            res.end(JSON.stringify({ ok: true }));
          } catch (error) {
            res.writeHead(400, { "content-type": "application/json" });
            res.end(JSON.stringify({ ok: false, error: String((error && error.message) || error) }));
          }
        });
      }
    }), "plugin-market: snapshot route");
  });
}
