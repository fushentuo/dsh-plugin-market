window.__ModuleLoader__.load({
  id: "@deepseek-ai/dsh-plugin-market",
  factory: function (require) {
    "use strict";
    var module = { exports: {} };
    var exports = module.exports;

    var React = require("react");

    // ---------------------------------------------------------------------
    // Constants
    // ---------------------------------------------------------------------
    var NS = "plugin-market";
    var DEFAULT_ADDRESS = "https://github.com/topics/dsh-plugin";
    var GITHUB_API = "https://api.github.com";

    // ---------------------------------------------------------------------
    // i18n dictionary
    // ---------------------------------------------------------------------
    var I18N = {
      en: {
        title: "Plugin Market",
        netOnline: "GitHub connected",
        netOffline: "GitHub unreachable",
        netChecking: "Checking…",
        search: "Search plugins…",
        settings: "Settings",
        close: "Close",
        catCommunity: "Community",
        catInstalledCommunity: "Installed community",
        catBuiltin: "Built-in",
        catAllInstalled: "All installed",
        download: "Install",
        installed: "Installed",
        installing: "Installing…",
        restart: "Restart required",
        enable: "Enable",
        disable: "Disable",
        remove: "Remove",
        retry: "Retry",
        empty: "Nothing here",
        loading: "Loading…",
        description: "About",
        readme: "README",
        author: "Author",
        language: "Interface language",
        langEn: "English",
        langZh: "中文",
        langAuto: "Auto (timezone)",
        communityAddress: "Community source",
        customAddress: "Custom address",
        storageLocation: "Storage location",
        pickLocation: "Choose folder",
        save: "Save",
        saved: "Saved",
        selectHint: "Select a plugin on the left",
        fetchError: "Failed to load",
        noReadme: "No README",
        defaultLocation: "App profile (default)",
        installedEnabled: "Enabled",
        installedDisabled: "Disabled",
        builtinTag: "built-in",
        communityTag: "community",
        panelAppearance: "Panel appearance",
        panelOpacity: "Panel opacity",
        panelTheme: "Panel background",
        themeDark: "Dark",
        themeLight: "Light",
        translate: "Translate",
        translating: "Translating…",
        translateOff: "Original",
        translateFailed: "Translation unavailable",
        openInBrowser: "Open on GitHub",
        dragHint: "Drag the title bar to move · double-click to re-center"
      },
      zh: {
        title: "插件市场",
        netOnline: "已连接 GitHub",
        netOffline: "无法连接 GitHub",
        netChecking: "检测中…",
        search: "搜索插件…",
        settings: "设置",
        close: "关闭",
        catCommunity: "社区插件",
        catInstalledCommunity: "已安装的社区插件",
        catBuiltin: "自带插件",
        catAllInstalled: "全部已安装",
        download: "下载",
        installed: "已安装",
        installing: "安装中…",
        restart: "需要重启应用生效",
        enable: "启用",
        disable: "禁用",
        remove: "删除",
        retry: "重试",
        empty: "暂无内容",
        loading: "加载中…",
        description: "简介",
        readme: "说明",
        author: "作者",
        language: "界面语言",
        langEn: "英文",
        langZh: "中文",
        langAuto: "按系统时区",
        communityAddress: "社区地址",
        customAddress: "自定义地址",
        storageLocation: "数据存储位置",
        pickLocation: "选择目录",
        save: "保存",
        saved: "已保存",
        selectHint: "从左侧选择一个插件查看详情",
        fetchError: "获取失败",
        noReadme: "无说明",
        defaultLocation: "应用默认目录",
        installedEnabled: "已启用",
        installedDisabled: "已禁用",
        builtinTag: "自带",
        communityTag: "社区",
        panelAppearance: "面板外观",
        panelOpacity: "面板不透明度",
        panelTheme: "面板背景",
        themeDark: "暗色",
        themeLight: "亮色",
        translate: "翻译",
        translating: "翻译中…",
        translateOff: "显示原文",
        translateFailed: "翻译服务不可用",
        openInBrowser: "在 GitHub 打开",
        dragHint: "拖动标题栏移动 · 双击标题栏回到中央"
      }
    };

    function autoLang() {
      try {
        var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
        if (/(Asia\/|China|Shanghai|Hong_Kong|Taipei|Macau)/.test(tz)) return "zh";
        var nav = (navigator.language || "").toLowerCase();
        if (nav.indexOf("zh") === 0) return "zh";
      } catch (e) { /* ignore */ }
      return "en";
    }

    function resolveLang(settings) {
      if (settings && (settings.language === "en" || settings.language === "zh")) return settings.language;
      return autoLang();
    }

    // ---------------------------------------------------------------------
    // CSS
    // ---------------------------------------------------------------------
    var CSS_TEXT = [
      ".pm-fab{position:fixed;right:24px;bottom:84px;z-index:99990;pointer-events:auto}",
      ".pm-fab-btn{width:44px;height:44px;border-radius:50%;border:1px solid var(--dsw-alias-border-l2,rgba(255,255,255,.16));background:var(--dsw-alias-bg-layer-1,rgba(40,40,44,.92));color:var(--dsw-alias-label-primary,#eee);display:inline-flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 6px 18px rgba(0,0,0,.35);position:relative}",
      ".pm-dot{position:absolute;top:-1px;right:-1px;width:12px;height:12px;border-radius:50%;border:2px solid var(--dsw-alias-bg-layer-1,#28282c)}",
      ".pm-dot-on{background:#22c55e}.pm-dot-off{background:#ef4444}.pm-dot-check{background:#eab308}",
      // Draggable window
      ".pm-panel{position:fixed;left:70px;top:56px;width:min(1000px,93vw);height:min(660px,86vh);z-index:99991;border:1px solid var(--pm-border);border-radius:14px;display:flex;flex-direction:column;box-shadow:0 24px 70px rgba(0,0,0,.55);overflow:hidden;color:var(--pm-fg);font-family:var(--dsw-font-family,system-ui)}",
      ".pm-header{display:flex;align-items:center;gap:10px;padding:12px 14px;border-bottom:1px solid var(--pm-border);cursor:move;user-select:none;flex-shrink:0}",
      ".pm-title{font-size:15px;font-weight:600;flex:1;margin:0}",
      ".pm-header-btn{width:30px;height:30px;border-radius:8px;border:1px solid var(--pm-border);background:transparent;color:var(--pm-fg);display:inline-flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0}",
      ".pm-header-btn:hover{background:var(--pm-item)}",
      ".pm-body{flex:1;display:flex;min-height:0}",
      ".pm-sidebar{width:290px;flex-shrink:0;border-right:1px solid var(--pm-border);display:flex;flex-direction:column;min-height:0}",
      ".pm-search{padding:10px 12px;border-bottom:1px solid var(--pm-border)}",
      ".pm-search input{width:100%;box-sizing:border-box;padding:8px 10px;border-radius:8px;border:1px solid var(--pm-border);background:var(--pm-item);color:var(--pm-fg);font:inherit;font-size:13px;outline:none}",
      ".pm-cats{display:flex;flex-wrap:wrap;gap:6px;padding:10px 12px;border-bottom:1px solid var(--pm-border)}",
      ".pm-cat{padding:5px 10px;border-radius:14px;border:1px solid var(--pm-border);background:transparent;color:var(--pm-sub);font-size:12px;cursor:pointer}",
      ".pm-cat.pm-cat-on{background:#4d6bfe;border-color:transparent;color:#fff}",
      ".pm-list{flex:1;overflow-y:auto;min-height:0}",
      ".pm-item{display:flex;align-items:center;gap:8px;padding:9px 12px;cursor:pointer;border-bottom:1px solid var(--pm-border)}",
      ".pm-item:hover{background:var(--pm-item)}",
      ".pm-item.pm-item-on{background:rgba(77,107,254,.18)}",
      ".pm-item-avatar{width:28px;height:28px;border-radius:6px;background:var(--pm-item);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:12px;color:var(--pm-sub);overflow:hidden}",
      ".pm-item-avatar img{width:100%;height:100%;object-fit:cover}",
      ".pm-item-main{flex:1;min-width:0}",
      ".pm-item-name{font-size:13px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
      ".pm-item-desc{font-size:11px;color:var(--pm-sub);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
      ".pm-item-state{font-size:10px;padding:2px 6px;border-radius:8px;flex-shrink:0}",
      ".pm-state-on{background:rgba(34,197,94,.18);color:#22c55e}.pm-state-off{background:rgba(120,120,128,.18);color:var(--pm-sub)}",
      ".pm-item-icon{width:26px;height:26px;border-radius:6px;border:none;background:transparent;color:var(--pm-sub);cursor:pointer;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0}",
      ".pm-item-icon:hover{background:#4d6bfe;color:#fff}",
      ".pm-detail{flex:1;display:flex;flex-direction:column;min-width:0;min-height:0}",
      ".pm-detail-header{display:flex;align-items:center;gap:8px;padding:14px 18px;border-bottom:1px solid var(--pm-border);flex-shrink:0}",
      ".pm-detail-title{font-size:16px;font-weight:600;flex:1;margin:0;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".pm-detail-body{flex:1;overflow-y:auto;padding:16px 18px;min-height:0}",
      ".pm-detail-meta{display:flex;align-items:center;gap:14px;margin-bottom:12px;font-size:12px;color:var(--pm-sub);flex-wrap:wrap}",
      ".pm-detail-section{font-size:11px;color:var(--pm-sub);margin:14px 0 6px;text-transform:uppercase;letter-spacing:.05em}",
      ".pm-detail-text{font-size:13px;line-height:20px;white-space:pre-wrap;word-break:break-word}",
      ".pm-readme{font-size:12.5px;line-height:20px;white-space:pre-wrap;word-break:break-word;background:var(--pm-item);border:1px solid var(--pm-border);border-radius:10px;padding:14px}",
      ".pm-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;border-radius:8px;border:1px solid var(--pm-border);background:var(--pm-item);color:var(--pm-fg);padding:7px 13px;font-size:12.5px;cursor:pointer;flex-shrink:0}",
      ".pm-btn:hover{background:rgba(127,127,140,.22)}",
      ".pm-btn-primary{background:#4d6bfe;border-color:#4d6bfe;color:#fff}",
      ".pm-btn-primary:hover{background:#3d5bf0}",
      ".pm-btn-danger{background:#c0392b;border-color:#c0392b;color:#fff}",
      ".pm-btn-danger:hover{background:#a93226}",
      ".pm-btn-on{background:#4d6bfe;border-color:#4d6bfe;color:#fff}",
      ".pm-btn:disabled{opacity:.5;cursor:default}",
      ".pm-empty,.pm-loading{padding:26px 16px;text-align:center;font-size:13px;color:var(--pm-sub)}",
      ".pm-notice{padding:9px 14px;font-size:12px;border-top:1px solid var(--pm-border);flex-shrink:0}",
      ".pm-notice-info{color:#60a5fa}.pm-notice-error{color:#f87171}.pm-notice-ok{color:#22c55e}",
      ".pm-settings{flex:1;overflow-y:auto;padding:18px 22px}",
      ".pm-field{margin-bottom:18px}",
      ".pm-field-label{display:block;font-size:13px;font-weight:500;margin-bottom:8px}",
      ".pm-field-hint{font-size:11px;color:var(--pm-sub);margin-top:6px}",
      ".pm-select,.pm-input{width:100%;box-sizing:border-box;padding:8px 10px;border-radius:8px;border:1px solid var(--pm-border);background:var(--pm-item);color:var(--pm-fg);font:inherit;font-size:13px;outline:none}",
      ".pm-radio{display:flex;align-items:center;gap:8px;padding:6px 0;font-size:13px;cursor:pointer}",
      ".pm-radio input{margin:0}",
      ".pm-row{display:flex;gap:8px;align-items:center}",
      ".pm-slider{width:100%;accent-color:#4d6bfe}",
      ".pm-settings-actions{display:flex;gap:10px;margin-top:20px}"
    ].join("\n");

    // ---------------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------------
    function clamp(n, min, max) { return Math.min(max, Math.max(min, n)); }

    function b64DecodeUtf8(b64) {
      try {
        var bin = atob(String(b64).replace(/\s/g, ""));
        var bytes = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        return new TextDecoder("utf-8").decode(bytes);
      } catch (e) { return null; }
    }

    function normalizeRepo(item) {
      if (!item || !item.full_name) return null;
      return {
        id: item.full_name,
        name: item.name || item.full_name.split("/")[1],
        fullName: item.full_name,
        description: item.description || "",
        htmlUrl: item.html_url || ("https://github.com/" + item.full_name),
        stars: item.stargazers_count || 0,
        owner: (item.owner && item.owner.login) || item.full_name.split("/")[0],
        avatar: (item.owner && item.owner.avatar_url) || "",
        topics: item.topics || []
      };
    }

    function normalizeList(data) {
      var items = Array.isArray(data) ? data : (data && Array.isArray(data.items)) ? data.items : [];
      var out = [];
      for (var i = 0; i < items.length; i++) {
        var n = normalizeRepo(items[i]);
        if (n) out.push(n);
      }
      return out;
    }

    function parseSource(address) {
      var a = String(address || "").trim();
      if (!a) a = DEFAULT_ADDRESS;
      var topicMatch = a.match(/github\.com\/topics\/([^\/?#]+)/i);
      if (topicMatch) {
        return {
          url: GITHUB_API + "/search/repositories?q=topic:" + encodeURIComponent(topicMatch[1]) + "&per_page=100&sort=stars&order=desc"
        };
      }
      var userMatch = a.match(/github\.com\/([^\/?#]+)\/?$/i);
      if (userMatch && userMatch[1] !== "topics" && userMatch[1] !== "search") {
        return { url: GITHUB_API + "/users/" + encodeURIComponent(userMatch[1]) + "/repos?per_page=100&sort=updated" };
      }
      if (/^https?:\/\//i.test(a)) return { url: a };
      return { url: GITHUB_API + "/search/repositories?q=" + encodeURIComponent(a) + "&per_page=100&sort=stars&order=desc" };
    }

    function fetchJson(url, signal) {
      return fetch(url, { headers: { "Accept": "application/vnd.github+json" }, signal: signal })
        .then(function (r) {
          if (!r.ok) throw new Error("HTTP " + r.status);
          return r.json();
        });
    }

    // Open an external URL: the Electron shell's window-open handler forwards
    // https URLs to the system browser (shell.openExternal).
    function openExternal(url) {
      if (!url) return;
      try {
        var win = window.open(url, "_blank", "noopener,noreferrer");
        if (win) return;
      } catch (e) { /* fall through */ }
      try {
        var a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        document.body.appendChild(a);
        a.click();
        a.remove();
      } catch (e2) { /* ignore */ }
    }

    // ---------------------------------------------------------------------
    // Settings persistence (localStorage — Electron userData, survives restart)
    // ---------------------------------------------------------------------
    var STORAGE_KEY = "dsh-plugin-market:settings:v1";

    function defaultSettings() {
      return {
        language: "en",
        communityAddress: DEFAULT_ADDRESS,
        storageLocation: "",
        panelOpacity: 100,
        panelTheme: "dark"
      };
    }

    function loadSettings() {
      var base = defaultSettings();
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return base;
        var p = JSON.parse(raw);
        return {
          language: (p.language === "zh" || p.language === "auto") ? p.language : "en",
          communityAddress: p.communityAddress || DEFAULT_ADDRESS,
          storageLocation: p.storageLocation || "",
          panelOpacity: typeof p.panelOpacity === "number" ? clamp(p.panelOpacity, 30, 100) : 100,
          panelTheme: p.panelTheme === "light" ? "light" : "dark"
        };
      } catch (e) { return base; }
    }

    function saveSettings(s) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); return true; } catch (e) { return false; }
    }

    function saveSettingsAndBackup(s) {
      saveSettings(s);
      if (s.storageLocation) {
        fetch("/plugin-market/snapshot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ location: s.storageLocation, settings: s })
        }).catch(function () { /* backup best-effort */ });
      }
    }

    // ---------------------------------------------------------------------
    // Client plugin
    // ---------------------------------------------------------------------
    var inject = ["slots", "remote", "remote.pluginManager", "remote.directoryPicker"];

    function apply(ctx) {
      if (typeof document === "undefined") return;

      var style = document.createElement("style");
      style.dataset.plugin = NS;
      style.textContent = CSS_TEXT;
      document.head.appendChild(style);
      ctx.effect(function () {
        return function () { if (style.parentNode) style.parentNode.removeChild(style); };
      }, NS + ": stylesheet");

      function MarketControl() {
        var settings = loadSettings();
        var lang = resolveLang(settings);
        var t = I18N[lang] || I18N.en;

        var stateTuple = React.useState({
          open: false,
          view: "browser",
          settings: settings,
          net: "checking",
          community: [],
          communityStatus: "idle",
          installed: [],
          plugins: [],
          category: "community",
          search: "",
          selected: null,
          detail: null,
          detailStatus: "idle",
          readme: null,
          installing: null,
          notice: null,
          translate: false,
          translating: false,
          translated: null
        });
        var state = stateTuple[0];
        var setState = stateTuple[1];

        var posTuple = React.useState({ x: null, y: null });
        var pos = posTuple[0];
        var setPos = posTuple[1];
        var panelRef = React.useRef(null);
        var genRef = React.useRef(0);

        function patch(part) {
          setState(function (s) {
            var next = {};
            for (var k in s) next[k] = s[k];
            for (var k2 in part) next[k2] = part[k2];
            return next;
          });
        }

        function effectiveT() {
          return I18N[resolveLang(state.settings)] || I18N.en;
        }

        // ---- data loading ----
        function loadInstalled() {
          Promise.all([
            ctx.remote.pluginManager.listBundles(),
            ctx.remote.pluginManager.listPlugins()
          ]).then(function (results) {
            var bundles = results[0];
            var plugins = results[1];
            var part = {};
            if (bundles && bundles.ok) part.installed = bundles.value || [];
            if (plugins && plugins.ok) part.plugins = plugins.value || [];
            patch(part);
          }).catch(function () { /* ignore */ });
        }

        function loadCommunity() {
          var gen = ++genRef.current;
          var src = parseSource(state.settings.communityAddress);
          var controller = new AbortController();
          var timeout = setTimeout(function () { controller.abort(); }, 20000);
          patch({ communityStatus: "loading" });
          fetchJson(src.url, controller.signal)
            .then(function (data) {
              clearTimeout(timeout);
              if (gen !== genRef.current) return;
              patch({ community: normalizeList(data), communityStatus: "idle" });
            })
            .catch(function () {
              clearTimeout(timeout);
              if (gen !== genRef.current) return;
              patch({ communityStatus: "error" });
            });
        }

        function checkNetwork() {
          patch({ net: "checking" });
          var controller = new AbortController();
          var timeout = setTimeout(function () { controller.abort(); }, 8000);
          fetch(GITHUB_API + "/rate_limit", { signal: controller.signal })
            .then(function (r) { clearTimeout(timeout); patch({ net: r.ok ? "online" : "offline" }); })
            .catch(function () { clearTimeout(timeout); patch({ net: "offline" }); });
        }

        function selectPlugin(p) {
          patch({ selected: p.fullName, detail: p, detailStatus: "loading", readme: null, translated: null, translate: false });
          var controller = new AbortController();
          var timeout = setTimeout(function () { controller.abort(); }, 20000);
          fetch(GITHUB_API + "/repos/" + encodeURIComponent(p.fullName) + "/readme", { headers: { "Accept": "application/vnd.github+json" }, signal: controller.signal })
            .then(function (r) { return r.ok ? r.json() : null; })
            .then(function (j) {
              clearTimeout(timeout);
              patch({ detailStatus: "idle", readme: (j && j.content) ? b64DecodeUtf8(j.content) : null });
            })
            .catch(function () {
              clearTimeout(timeout);
              patch({ detailStatus: "idle", readme: null });
            });
        }

        // ---- translation ----
        function translateOne(text, target) {
          if (!text) return Promise.resolve(null);
          return fetch("/plugin-market/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: String(text).slice(0, 4500), target: target })
          }).then(function (r) { return r.json(); })
            .then(function (j) { return (j && j.ok && j.translated) ? j.translated : null; })
            .catch(function () { return null; });
        }

        function runTranslate() {
          var p = state.detail;
          if (!p) return;
          var tt = effectiveT();
          var target = (resolveLang(state.settings) === "zh") ? "zh-CN" : "en";
          patch({ translating: true, notice: null });
          Promise.all([
            translateOne(p.description || "", target),
            translateOne(state.readme || "", target)
          ]).then(function (out) {
            var any = !!(out[0] || out[1]);
            patch({
              translating: false,
              translated: any ? { description: out[0] || p.description, readme: out[1] || state.readme } : null,
              notice: any ? null : { kind: "error", text: tt.translateFailed }
            });
          });
        }

        function toggleTranslate() {
          var on = !state.translate;
          patch({ translate: on });
          if (on) runTranslate();
        }

        // ---- plugin management ----
        function doInstall(p) {
          patch({ installing: p.fullName, notice: null });
          var requestId = (typeof crypto !== "undefined" && crypto.randomUUID) ? crypto.randomUUID() : ("id" + Date.now().toString(36));
          ctx.remote.pluginManager.installBundle(p.htmlUrl, { enabled: true, requestId: requestId })
            .then(function (result) {
              if (result.ok) {
                var app = result.value && result.value.application;
                patch({
                  installing: null,
                  notice: app === "restart-required"
                    ? { kind: "info", text: effectiveT().restart }
                    : { kind: "ok", text: p.name + " · " + effectiveT().installed }
                });
              } else {
                patch({ installing: null, notice: { kind: "error", text: (result.error && result.error.message) || effectiveT().fetchError } });
              }
              loadInstalled();
            })
            .catch(function () { patch({ installing: null, notice: { kind: "error", text: effectiveT().fetchError } }); });
        }

        function setEnabled(name, enabled) {
          patch({ notice: null });
          ctx.remote.pluginManager.setBundleEnabled(name, enabled)
            .then(function (result) {
              if (result.ok) {
                var app = result.value && result.value.application;
                if (app === "restart-required") patch({ notice: { kind: "info", text: effectiveT().restart } });
              } else {
                patch({ notice: { kind: "error", text: (result.error && result.error.message) || effectiveT().fetchError } });
              }
              loadInstalled();
            })
            .catch(function () { patch({ notice: { kind: "error", text: effectiveT().fetchError } }); });
        }

        function doRemove(name) {
          patch({ notice: null });
          ctx.remote.pluginManager.removeBundle(name)
            .then(function (result) {
              if (result.ok) {
                patch({ notice: { kind: "ok", text: name + " · " + effectiveT().remove }, selected: null, detail: null, readme: null });
              } else {
                patch({ notice: { kind: "error", text: (result.error && result.error.message) || effectiveT().fetchError } });
              }
              loadInstalled();
            })
            .catch(function () { patch({ notice: { kind: "error", text: effectiveT().fetchError } }); });
        }

        // ---- drag ----
        function startDrag(e) {
          if (e.button !== 0) return;
          if (e.target && e.target.closest && e.target.closest("button")) return;
          e.preventDefault();
          var panel = panelRef.current;
          if (!panel) return;
          var rect = panel.getBoundingClientRect();
          var startX = e.clientX;
          var startY = e.clientY;
          var origX = rect.left;
          var origY = rect.top;
          setPos({ x: origX, y: origY });
          function onMove(ev) {
            var w = panel.offsetWidth || 400;
            var h = panel.offsetHeight || 200;
            setPos({
              x: clamp(origX + ev.clientX - startX, -(w - 120), window.innerWidth - 120),
              y: clamp(origY + ev.clientY - startY, 0, Math.max(0, window.innerHeight - 40))
            });
          }
          function onUp() {
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseup", onUp);
          }
          document.addEventListener("mousemove", onMove);
          document.addEventListener("mouseup", onUp);
        }

        function recenter() {
          setPos({ x: null, y: null });
        }

        // ---- bootstrap ----
        React.useEffect(function () {
          checkNetwork();
          loadInstalled();
          loadCommunity();
          var off = ctx.remote.$on("plugin-manager/changed", function () { loadInstalled(); });
          return function () { if (typeof off === "function") off(); };
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        // ---- derived list ----
        var q = state.search.trim().toLowerCase();
        var list = [];
        if (state.category === "community") list = state.community;
        else if (state.category === "installed-community") list = state.installed.filter(function (b) { return b.installed === true; });
        else if (state.category === "builtin") list = state.installed.filter(function (b) { return b.installed === false; });
        else list = state.installed;
        if (q) {
          list = list.filter(function (item) {
            var name = (item.fullName || item.name || item.moduleName || "").toLowerCase();
            var desc = (item.description || "").toLowerCase();
            return name.indexOf(q) >= 0 || desc.indexOf(q) >= 0;
          });
        }

        function installedInfo(item) {
          if (item.fullName) {
            for (var i = 0; i < state.installed.length; i++) {
              var b = state.installed[i];
              if (b.name === item.fullName || b.name === item.name || b.name.indexOf(item.name) >= 0) return b;
            }
            return null;
          }
          return item;
        }

        function catButton(value, text) {
          return React.createElement("button", {
            type: "button",
            className: "pm-cat" + (state.category === value ? " pm-cat-on" : ""),
            onClick: function () { patch({ category: value, selected: null, detail: null, readme: null, translated: null, translate: false }); }
          }, text);
        }

        function svg(children, size) {
          return React.createElement("svg", { width: size || 20, height: size || 20, viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" }, children);
        }
        function storeIcon() {
          return svg([
            React.createElement("path", { key: "a", d: "M4 6h16M4 12h16M4 18h10", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" }),
            React.createElement("circle", { key: "b", cx: 19, cy: 18, r: 2.5, stroke: "currentColor", strokeWidth: 2 })
          ]);
        }
        function downloadIcon() {
          return svg([React.createElement("path", { key: "d", d: "M12 4v11m0 0l-4-4m4 4l4-4M5 19h14", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" })], 16);
        }
        function settingsIcon() {
          return svg([
            React.createElement("circle", { key: "c", cx: 12, cy: 12, r: 3, stroke: "currentColor", strokeWidth: 2 }),
            React.createElement("path", { key: "p", d: "M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1L7 17M17 7l2.1-2.1", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" })
          ], 18);
        }
        function trashIcon() {
          return svg([React.createElement("path", { key: "t", d: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" })], 14);
        }

        function renderListItem(item) {
          var isCommunity = !!item.fullName;
          var info = installedInfo(item);
          var enabled = info && info.enabled !== false;
          var selected = state.selected === (item.fullName || item.id || item.name || item.moduleName);
          return React.createElement("div", {
            key: item.fullName || item.id || item.name || item.moduleName,
            className: "pm-item" + (selected ? " pm-item-on" : ""),
            onClick: function () {
              if (isCommunity) selectPlugin(item);
              else patch({ selected: item.name || item.moduleName, detail: null, readme: null, translated: null, translate: false });
            }
          },
            React.createElement("div", { className: "pm-item-avatar" },
              item.avatar ? React.createElement("img", { src: item.avatar, alt: "" }) : (item.owner || item.name || "?").slice(0, 1).toUpperCase()
            ),
            React.createElement("div", { className: "pm-item-main" },
              React.createElement("div", { className: "pm-item-name" }, item.name || item.fullName || item.moduleName),
              React.createElement("div", { className: "pm-item-desc" }, item.description || item.moduleName || "")
            ),
            isCommunity
              ? (info
                  ? React.createElement("span", { className: "pm-item-state " + (enabled ? "pm-state-on" : "pm-state-off") }, enabled ? t.installedEnabled : t.installedDisabled)
                  : (state.installing === item.fullName
                      ? React.createElement("span", { className: "pm-item-state pm-state-off" }, t.installing)
                      : React.createElement("button", { type: "button", className: "pm-item-icon", title: t.download, onClick: function (e) { e.stopPropagation(); doInstall(item); } }, downloadIcon())))
              : (item.removable === true
                  ? React.createElement("button", { type: "button", className: "pm-item-icon", title: t.remove, onClick: function (e) { e.stopPropagation(); doRemove(item.name); } }, trashIcon())
                  : null)
          );
        }

        function renderSidebar() {
          return React.createElement("div", { className: "pm-sidebar" },
            React.createElement("div", { className: "pm-search" },
              React.createElement("input", { type: "text", placeholder: t.search, value: state.search, onChange: function (e) { patch({ search: e.target.value }); } })
            ),
            React.createElement("div", { className: "pm-cats" },
              catButton("community", t.catCommunity),
              catButton("installed-community", t.catInstalledCommunity),
              catButton("builtin", t.catBuiltin),
              catButton("all", t.catAllInstalled)
            ),
            React.createElement("div", { className: "pm-list" },
              state.category === "community" && state.communityStatus === "loading"
                ? React.createElement("div", { className: "pm-loading" }, t.loading)
                : state.category === "community" && state.communityStatus === "error"
                  ? React.createElement("div", { className: "pm-empty" },
                      t.fetchError + " ",
                      React.createElement("button", { type: "button", className: "pm-btn", onClick: loadCommunity }, t.retry)
                    )
                  : list.length === 0
                    ? React.createElement("div", { className: "pm-empty" }, t.empty)
                    : list.map(renderListItem)
            )
          );
        }

        function renderDetail() {
          if (state.category !== "community" && state.selected) {
            var inst = null;
            for (var i = 0; i < state.installed.length; i++) {
              if ((state.installed[i].name || state.installed[i].moduleName) === state.selected) { inst = state.installed[i]; break; }
            }
            if (inst) return renderInstalledDetail(inst);
          }
          if (!state.detail) {
            return React.createElement("div", { className: "pm-detail" },
              React.createElement("div", { className: "pm-detail-body" },
                React.createElement("div", { className: "pm-empty" }, t.selectHint)
              )
            );
          }
          var p = state.detail;
          var info = installedInfo(p);
          var isInstalling = state.installing === p.fullName;
          var desc = (state.translate && state.translated && state.translated.description) ? state.translated.description : p.description;
          var readme = (state.translate && state.translated && state.translated.readme) ? state.translated.readme : state.readme;
          return React.createElement("div", { className: "pm-detail" },
            React.createElement("div", { className: "pm-detail-header" },
              React.createElement("div", { className: "pm-detail-title" }, p.fullName),
              React.createElement("button", {
                type: "button",
                className: "pm-btn" + (state.translate ? " pm-btn-on" : ""),
                disabled: state.translating,
                title: t.translate,
                onClick: toggleTranslate
              }, state.translating ? t.translating : t.translate),
              info
                ? React.createElement("span", { className: "pm-btn", style: { opacity: .6 } }, t.installed)
                : React.createElement("button", { type: "button", className: "pm-btn pm-btn-primary", disabled: isInstalling, onClick: function () { doInstall(p); } },
                    isInstalling ? t.installing : t.download
                  )
            ),
            React.createElement("div", { className: "pm-detail-body" },
              React.createElement("div", { className: "pm-detail-meta" },
                React.createElement("span", {}, "⭐ " + p.stars),
                React.createElement("span", {}, t.author + ": " + p.owner),
                React.createElement("button", {
                  type: "button",
                  className: "pm-btn",
                  onClick: function () { openExternal(p.htmlUrl); }
                }, t.openInBrowser),
                React.createElement("span", { style: { userSelect: "all", fontSize: 11, opacity: .75 } }, p.htmlUrl)
              ),
              React.createElement("div", { className: "pm-detail-section" }, t.description),
              React.createElement("div", { className: "pm-detail-text" }, desc || t.noReadme),
              React.createElement("div", { className: "pm-detail-section" }, t.readme),
              state.detailStatus === "loading"
                ? React.createElement("div", { className: "pm-loading" }, t.loading)
                : React.createElement("div", { className: "pm-readme" }, readme || t.noReadme)
            )
          );
        }

        function renderInstalledDetail(inst) {
          var enabled = inst.enabled !== false;
          var removable = inst.removable === true;
          var name = inst.name || inst.moduleName;
          return React.createElement("div", { className: "pm-detail" },
            React.createElement("div", { className: "pm-detail-header" },
              React.createElement("div", { className: "pm-detail-title" }, name),
              removable
                ? React.createElement("button", { type: "button", className: "pm-btn " + (enabled ? "" : "pm-btn-primary"), onClick: function () { setEnabled(name, !enabled); } }, enabled ? t.disable : t.enable)
                : null,
              removable
                ? React.createElement("button", { type: "button", className: "pm-btn pm-btn-danger", onClick: function () { doRemove(name); } }, t.remove)
                : null
            ),
            React.createElement("div", { className: "pm-detail-body" },
              React.createElement("div", { className: "pm-detail-meta" },
                React.createElement("span", { className: "pm-item-state " + (enabled ? "pm-state-on" : "pm-state-off") }, enabled ? t.installedEnabled : t.installedDisabled),
                React.createElement("span", {}, removable ? t.communityTag : t.builtinTag),
                inst.version ? React.createElement("span", {}, "v" + inst.version) : null
              ),
              React.createElement("div", { className: "pm-detail-section" }, t.description),
              React.createElement("div", { className: "pm-detail-text" }, inst.description || "")
            )
          );
        }

        function SettingsView() {
          var s = state.settings;
          var lt = effectiveT();
          function update(part) {
            var next = {};
            for (var k in s) next[k] = s[k];
            for (var k2 in part) next[k2] = part[k2];
            patch({ settings: next });
          }
          function pickDir() {
            ctx.remote.directoryPicker.pick().then(function (dir) {
              if (dir) update({ storageLocation: dir });
            }).catch(function () { /* ignore */ });
          }
          var isDefault = s.communityAddress === DEFAULT_ADDRESS || s.communityAddress.indexOf("github.com/topics/dsh-plugin") >= 0;
          return React.createElement("div", { className: "pm-settings" },
            // language
            React.createElement("div", { className: "pm-field" },
              React.createElement("label", { className: "pm-field-label" }, lt.language),
              React.createElement("label", { className: "pm-radio" }, React.createElement("input", { type: "radio", name: "pm-lang", checked: s.language === "en", onChange: function () { update({ language: "en" }); } }), lt.langEn),
              React.createElement("label", { className: "pm-radio" }, React.createElement("input", { type: "radio", name: "pm-lang", checked: s.language === "zh", onChange: function () { update({ language: "zh" }); } }), lt.langZh),
              React.createElement("label", { className: "pm-radio" }, React.createElement("input", { type: "radio", name: "pm-lang", checked: s.language === "auto", onChange: function () { update({ language: "auto" }); } }), lt.langAuto)
            ),
            // panel appearance
            React.createElement("div", { className: "pm-field" },
              React.createElement("label", { className: "pm-field-label" }, lt.panelAppearance),
              React.createElement("div", { className: "pm-row" },
                React.createElement("span", { style: { flex: 1, fontSize: 12 } }, lt.panelOpacity),
                React.createElement("span", { style: { fontSize: 12, minWidth: 40, textAlign: "right", fontVariantNumeric: "tabular-nums" } }, s.panelOpacity + "%")
              ),
              React.createElement("input", { type: "range", className: "pm-slider", min: "30", max: "100", step: "1", value: s.panelOpacity, onChange: function (e) { update({ panelOpacity: clamp(Number(e.target.value) || 100, 30, 100) }); } }),
              React.createElement("div", { className: "pm-row", style: { marginTop: 10 } },
                React.createElement("label", { className: "pm-radio", style: { flex: 1 } }, React.createElement("input", { type: "radio", name: "pm-theme", checked: s.panelTheme !== "light", onChange: function () { update({ panelTheme: "dark" }); } }), lt.themeDark),
                React.createElement("label", { className: "pm-radio", style: { flex: 1 } }, React.createElement("input", { type: "radio", name: "pm-theme", checked: s.panelTheme === "light", onChange: function () { update({ panelTheme: "light" }); } }), lt.themeLight)
              )
            ),
            // community address
            React.createElement("div", { className: "pm-field" },
              React.createElement("label", { className: "pm-field-label" }, lt.communityAddress),
              React.createElement("select", { className: "pm-select", value: isDefault ? DEFAULT_ADDRESS : "custom", onChange: function (e) {
                if (e.target.value === DEFAULT_ADDRESS) update({ communityAddress: DEFAULT_ADDRESS });
                else update({ communityAddress: "" });
              } },
                React.createElement("option", { value: DEFAULT_ADDRESS }, DEFAULT_ADDRESS),
                React.createElement("option", { value: "custom" }, lt.customAddress)
              ),
              isDefault ? null : React.createElement("input", { className: "pm-input", style: { marginTop: 8 }, type: "text", placeholder: lt.customAddress, value: s.communityAddress, onChange: function (e) { update({ communityAddress: e.target.value }); } }),
              React.createElement("div", { className: "pm-field-hint" }, "GitHub topic / user URL，或自定义 JSON 地址")
            ),
            // storage location
            React.createElement("div", { className: "pm-field" },
              React.createElement("label", { className: "pm-field-label" }, lt.storageLocation),
              React.createElement("div", { className: "pm-row" },
                React.createElement("span", { style: { flex: 1, fontSize: 12, wordBreak: "break-all" } }, s.storageLocation || lt.defaultLocation),
                React.createElement("button", { type: "button", className: "pm-btn", onClick: pickDir }, lt.pickLocation)
              ),
              React.createElement("div", { className: "pm-field-hint" }, "设置始终保存在应用 profile（磁盘持久），所选目录用于额外备份快照")
            ),
            React.createElement("div", { className: "pm-settings-actions" },
              React.createElement("button", { type: "button", className: "pm-btn pm-btn-primary", onClick: function () {
                saveSettingsAndBackup(s);
                patch({ view: "browser", notice: { kind: "ok", text: lt.saved } });
              } }, lt.save),
              React.createElement("button", { type: "button", className: "pm-btn", onClick: function () { patch({ view: "browser" }); } }, lt.close)
            )
          );
        }

        function renderPanel() {
          if (!state.open) return null;
          var settings = state.settings;
          var light = settings.panelTheme === "light";
          var op = (typeof settings.panelOpacity === "number" ? settings.panelOpacity : 100) / 100;
          var bgRgb = light ? "250,250,252" : "22,22,25";
          var panelStyle = {
            background: "rgba(" + bgRgb + "," + op + ")",
            color: light ? "#1a1a1c" : "#e8e8ea",
            "--pm-fg": light ? "#1a1a1c" : "#e8e8ea",
            "--pm-sub": light ? "#5c5c66" : "#9a9aa2",
            "--pm-border": light ? "rgba(0,0,0,.14)" : "rgba(255,255,255,.13)",
            "--pm-item": light ? "rgba(0,0,0,.05)" : "rgba(255,255,255,.06)"
          };
          if (pos.x != null) { panelStyle.left = pos.x + "px"; panelStyle.top = pos.y + "px"; }
          var netText = state.net === "online" ? t.netOnline : state.net === "offline" ? t.netOffline : t.netChecking;
          return React.createElement("div", { className: "pm-panel", ref: panelRef, style: panelStyle },
            React.createElement("div", { className: "pm-header", onMouseDown: startDrag, onDoubleClick: recenter, title: t.dragHint },
              React.createElement("h2", { className: "pm-title" }, t.title),
              React.createElement("span", { className: "pm-item-state " + (state.net === "online" ? "pm-state-on" : state.net === "offline" ? "pm-state-off" : "") }, netText),
              React.createElement("button", { type: "button", className: "pm-header-btn", title: t.settings, onClick: function () { patch({ view: state.view === "settings" ? "browser" : "settings" }); } }, settingsIcon()),
              React.createElement("button", { type: "button", className: "pm-header-btn", title: t.close, onClick: function () { patch({ open: false }); } }, "✕")
            ),
            state.view === "settings"
              ? SettingsView()
              : React.createElement("div", { className: "pm-body" }, renderSidebar(), renderDetail()),
            state.notice
              ? React.createElement("div", { className: "pm-notice pm-notice-" + state.notice.kind }, state.notice.text)
              : null
          );
        }

        return React.createElement("div", { className: "pm-fab" },
          renderPanel(),
          React.createElement("button", {
            type: "button",
            className: "pm-fab-btn",
            title: t.title,
            "aria-label": t.title,
            "aria-expanded": state.open,
            onClick: function () { patch({ open: !state.open }); }
          },
            storeIcon(),
            React.createElement("span", { className: state.net === "online" ? "pm-dot pm-dot-on" : state.net === "offline" ? "pm-dot pm-dot-off" : "pm-dot pm-dot-check" })
          )
        );
      }

      ctx.slots.inject("shell.overlay", function () {
        return ctx.slots.register(
          { name: "shell.overlay", id: "plugin-market", order: 600, label: "插件市场" },
          MarketControl
        );
      });
    }

    exports.inject = inject;
    exports.apply = apply;
    return module.exports;
  }
});
