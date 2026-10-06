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
        categories: "Categories",
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
        refresh: "Refresh",
        empty: "Nothing here",
        loading: "Loading…",
        description: "About",
        readme: "README",
        stars: "Stars",
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
        retry: "Retry",
        defaultLocation: "App profile (default)",
        installedEnabled: "Enabled",
        installedDisabled: "Disabled",
        builtinTag: "built-in",
        communityTag: "community"
      },
      zh: {
        title: "插件市场",
        netOnline: "已连接 GitHub",
        netOffline: "无法连接 GitHub",
        netChecking: "检测中…",
        search: "搜索插件…",
        settings: "设置",
        close: "关闭",
        categories: "分类",
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
        refresh: "刷新",
        empty: "暂无内容",
        loading: "加载中…",
        description: "简介",
        readme: "说明",
        stars: "星标",
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
        retry: "重试",
        defaultLocation: "应用默认目录",
        installedEnabled: "已启用",
        installedDisabled: "已禁用",
        builtinTag: "自带",
        communityTag: "社区"
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
      ".pm-panel{position:fixed;top:0;right:0;bottom:0;width:min(1080px,96vw);z-index:99991;background:var(--dsw-alias-bg-overlay,#1c1c1f);color:var(--dsw-alias-label-primary,#eee);border-left:1px solid var(--dsw-alias-border-l2,rgba(255,255,255,.14));display:flex;flex-direction:column;box-shadow:-12px 0 40px rgba(0,0,0,.4);font-family:var(--dsw-font-family,system-ui)}",
      ".pm-header{display:flex;align-items:center;gap:10px;padding:14px 16px;border-bottom:1px solid var(--dsw-alias-border-l2,rgba(255,255,255,.1))}",
      ".pm-title{font-size:15px;font-weight:600;flex:1;margin:0}",
      ".pm-header-btn{width:32px;height:32px;border-radius:8px;border:1px solid var(--dsw-alias-border-l2,rgba(255,255,255,.14));background:var(--dsw-alias-bg-layer-1,rgba(255,255,255,.06));color:var(--dsw-alias-label-primary,#eee);display:inline-flex;align-items:center;justify-content:center;cursor:pointer}",
      ".pm-header-btn:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(255,255,255,.12))}",
      ".pm-body{flex:1;display:flex;min-height:0}",
      ".pm-sidebar{width:300px;flex-shrink:0;border-right:1px solid var(--dsw-alias-border-l2,rgba(255,255,255,.1));display:flex;flex-direction:column;min-height:0}",
      ".pm-search{padding:10px 12px;border-bottom:1px solid var(--dsw-alias-border-l2,rgba(255,255,255,.08))}",
      ".pm-search input{width:100%;box-sizing:border-box;padding:8px 10px;border-radius:8px;border:1px solid var(--dsw-alias-border-l2,rgba(255,255,255,.14));background:var(--dsw-alias-bg-layer-1,rgba(255,255,255,.05));color:var(--dsw-alias-label-primary,#eee);font:inherit;font-size:13px;outline:none}",
      ".pm-cats{display:flex;flex-wrap:wrap;gap:6px;padding:10px 12px;border-bottom:1px solid var(--dsw-alias-border-l2,rgba(255,255,255,.08))}",
      ".pm-cat{padding:5px 10px;border-radius:14px;border:1px solid var(--dsw-alias-border-l2,rgba(255,255,255,.14));background:transparent;color:var(--dsw-alias-label-secondary,#bbb);font-size:12px;cursor:pointer}",
      ".pm-cat.pm-cat-on{background:var(--dsw-alias-brand-primary,#4d6bfe);border-color:transparent;color:#fff}",
      ".pm-list{flex:1;overflow-y:auto;min-height:0}",
      ".pm-item{display:flex;align-items:center;gap:8px;padding:10px 12px;cursor:pointer;border-bottom:1px solid rgba(255,255,255,.04)}",
      ".pm-item:hover{background:rgba(255,255,255,.05)}",
      ".pm-item.pm-item-on{background:var(--dsw-alias-interactive-bg-hover,rgba(255,255,255,.09))}",
      ".pm-item-avatar{width:28px;height:28px;border-radius:6px;background:var(--dsw-alias-bg-layer-2,rgba(255,255,255,.1));flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:12px;color:var(--dsw-alias-label-secondary,#bbb);overflow:hidden}",
      ".pm-item-avatar img{width:100%;height:100%;object-fit:cover}",
      ".pm-item-main{flex:1;min-width:0}",
      ".pm-item-name{font-size:13px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
      ".pm-item-desc{font-size:11px;color:var(--dsw-alias-label-secondary,#999);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
      ".pm-item-state{font-size:10px;padding:2px 6px;border-radius:8px;flex-shrink:0}",
      ".pm-state-on{background:rgba(34,197,94,.16);color:#22c55e}.pm-state-off{background:rgba(120,120,128,.16);color:#aaa}",
      ".pm-item-icon{width:26px;height:26px;border-radius:6px;border:none;background:transparent;color:var(--dsw-alias-label-secondary,#bbb);cursor:pointer;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0}",
      ".pm-item-icon:hover{background:var(--dsw-alias-brand-primary,#4d6bfe);color:#fff}",
      ".pm-detail{flex:1;display:flex;flex-direction:column;min-width:0;min-height:0}",
      ".pm-detail-header{display:flex;align-items:center;gap:12px;padding:16px 20px;border-bottom:1px solid var(--dsw-alias-border-l2,rgba(255,255,255,.1))}",
      ".pm-detail-title{font-size:17px;font-weight:600;flex:1;margin:0;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".pm-detail-body{flex:1;overflow-y:auto;padding:16px 20px;min-height:0}",
      ".pm-detail-meta{display:flex;gap:16px;margin-bottom:14px;font-size:12px;color:var(--dsw-alias-label-secondary,#aaa)}",
      ".pm-detail-section{font-size:12px;color:var(--dsw-alias-label-secondary,#aaa);margin:14px 0 6px;text-transform:uppercase;letter-spacing:.04em}",
      ".pm-detail-text{font-size:13px;line-height:20px;color:var(--dsw-alias-label-primary,#ddd);white-space:pre-wrap;word-break:break-word}",
      ".pm-readme{font-size:12.5px;line-height:20px;color:var(--dsw-alias-label-primary,#ddd);white-space:pre-wrap;word-break:break-word;background:var(--dsw-alias-bg-layer-1,rgba(255,255,255,.04));border:1px solid var(--dsw-alias-border-l2,rgba(255,255,255,.1));border-radius:10px;padding:14px}",
      ".pm-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;border-radius:8px;border:1px solid var(--dsw-alias-border-l2,rgba(255,255,255,.16));background:var(--dsw-alias-bg-layer-1,rgba(255,255,255,.08));color:var(--dsw-alias-label-primary,#eee);padding:8px 14px;font-size:13px;cursor:pointer}",
      ".pm-btn:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(255,255,255,.12))}",
      ".pm-btn-primary{background:var(--dsw-alias-brand-primary,#4d6bfe);border-color:transparent;color:#fff}",
      ".pm-btn-primary:hover{background:#3d5bf0}",
      ".pm-btn-danger{background:rgba(220,80,80,.85);border-color:transparent;color:#fff}",
      ".pm-btn:disabled{opacity:.5;cursor:default}",
      ".pm-empty,.pm-loading{padding:28px 16px;text-align:center;font-size:13px;color:var(--dsw-alias-label-secondary,#999)}",
      ".pm-notice{padding:10px 16px;font-size:12px;border-top:1px solid var(--dsw-alias-border-l2,rgba(255,255,255,.08))}",
      ".pm-notice-info{color:#60a5fa}.pm-notice-error{color:#f87171}.pm-notice-ok{color:#22c55e}",
      ".pm-settings{flex:1;overflow-y:auto;padding:18px 22px}",
      ".pm-field{margin-bottom:20px}",
      ".pm-field-label{display:block;font-size:13px;font-weight:500;margin-bottom:8px}",
      ".pm-field-hint{font-size:11px;color:var(--dsw-alias-label-secondary,#999);margin-top:6px}",
      ".pm-select,.pm-input{width:100%;box-sizing:border-box;padding:8px 10px;border-radius:8px;border:1px solid var(--dsw-alias-border-l2,rgba(255,255,255,.14));background:var(--dsw-alias-bg-layer-1,rgba(255,255,255,.05));color:var(--dsw-alias-label-primary,#eee);font:inherit;font-size:13px;outline:none}",
      ".pm-radio{display:flex;align-items:center;gap:8px;padding:7px 0;font-size:13px;cursor:pointer}",
      ".pm-radio input{margin:0}",
      ".pm-row{display:flex;gap:8px;align-items:center}",
      ".pm-settings-actions{display:flex;gap:10px;margin-top:24px}"
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

    // Parse a community address into a fetch URL + kind.
    function parseSource(address) {
      var a = String(address || "").trim();
      if (!a) a = DEFAULT_ADDRESS;
      var topicMatch = a.match(/github\.com\/topics\/([^\/?#]+)/i);
      if (topicMatch) {
        return {
          kind: "topic",
          label: "topic:" + topicMatch[1],
          url: GITHUB_API + "/search/repositories?q=topic:" + encodeURIComponent(topicMatch[1]) + "&per_page=100&sort=stars&order=desc"
        };
      }
      var userMatch = a.match(/github\.com\/([^\/?#]+)\/?$/i);
      if (userMatch && userMatch[1] !== "topics" && userMatch[1] !== "search") {
        return {
          kind: "user",
          label: "user:" + userMatch[1],
          url: GITHUB_API + "/users/" + encodeURIComponent(userMatch[1]) + "/repos?per_page=100&sort=updated"
        };
      }
      // Fallback: treat as a raw JSON URL or a search query.
      if (/^https?:\/\//i.test(a)) {
        return { kind: "raw", label: a, url: a };
      }
      return {
        kind: "search",
        label: a,
        url: GITHUB_API + "/search/repositories?q=" + encodeURIComponent(a) + "&per_page=100&sort=stars&order=desc"
      };
    }

    function fetchJson(url, signal) {
      return fetch(url, { headers: { "Accept": "application/vnd.github+json" }, signal: signal })
        .then(function (r) {
          if (!r.ok) throw new Error("HTTP " + r.status);
          return r.json();
        });
    }

    // ---------------------------------------------------------------------
    // Settings persistence (localStorage — Electron userData, survives restart)
    // ---------------------------------------------------------------------
    var STORAGE_KEY = "dsh-plugin-market:settings:v1";

    function loadSettings() {
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { language: "en", communityAddress: DEFAULT_ADDRESS, storageLocation: "" };
        var p = JSON.parse(raw);
        return {
          language: (p.language === "zh" || p.language === "auto") ? p.language : "en",
          communityAddress: p.communityAddress || DEFAULT_ADDRESS,
          storageLocation: p.storageLocation || ""
        };
      } catch (e) {
        return { language: "en", communityAddress: DEFAULT_ADDRESS, storageLocation: "" };
      }
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

      // Inject stylesheet.
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
          net: "checking",
          community: [],
          communityStatus: "idle",
          communityError: null,
          installed: [],
          plugins: [],
          category: "community",
          search: "",
          selected: null,
          detail: null,
          detailStatus: "idle",
          installing: null,
          notice: null
        });
        var state = stateTuple[0];
        var setState = stateTuple[1];

        function patch(part) {
          setState(function (s) {
            var next = {};
            for (var k in s) next[k] = s[k];
            for (var k2 in part) next[k2] = part[k2];
            return next;
          });
        }

        var genRef = React.useRef(0);

        function loadInstalled() {
          Promise.all([
            ctx.remote.pluginManager.listBundles(),
            ctx.remote.pluginManager.listPlugins()
          ]).then(function (results) {
            var bundles = results[0];
            var plugins = results[1];
            if (bundles.ok) patch({ installed: bundles.value || [] });
            if (plugins.ok) patch({ plugins: plugins.value || [] });
          }).catch(function () { /* ignore */ });
        }

        function loadCommunity() {
          var gen = ++genRef.current;
          var src = parseSource(settings.communityAddress);
          var controller = new AbortController();
          var timeout = setTimeout(function () { controller.abort(); }, 20000);
          patch({ communityStatus: "loading", communityError: null });
          fetchJson(src.url, controller.signal)
            .then(function (data) {
              clearTimeout(timeout);
              if (gen !== genRef.current) return;
              patch({ community: normalizeList(data), communityStatus: "idle" });
            })
            .catch(function (e) {
              clearTimeout(timeout);
              if (gen !== genRef.current) return;
              patch({ communityStatus: "error", communityError: e && e.message ? e.message : "error" });
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
          patch({ selected: p.fullName, detail: p, detailStatus: "loading" });
          var controller = new AbortController();
          var timeout = setTimeout(function () { controller.abort(); }, 20000);
          fetch(GITHUB_API + "/repos/" + encodeURIComponent(p.fullName) + "/readme", { headers: { "Accept": "application/vnd.github+json" }, signal: controller.signal })
            .then(function (r) {
              if (!r.ok) return null;
              return r.json();
            })
            .then(function (j) {
              clearTimeout(timeout);
              patch({ detail: p, detailStatus: "idle", readme: (j && j.content) ? b64DecodeUtf8(j.content) : null });
            })
            .catch(function () {
              clearTimeout(timeout);
              patch({ detail: p, detailStatus: "idle", readme: null });
            });
        }

        function doInstall(p) {
          patch({ installing: p.fullName, notice: null });
          var requestId = (typeof crypto !== "undefined" && crypto.randomUUID) ? crypto.randomUUID() : ("id" + Date.now().toString(36));
          ctx.remote.pluginManager.installBundle(p.htmlUrl, { enabled: true, requestId: requestId })
            .then(function (result) {
              if (result.ok) {
                var app = result.value && result.value.application;
                if (app === "restart-required") {
                  patch({ installing: null, notice: { kind: "info", text: t.restart } });
                } else {
                  patch({ installing: null, notice: { kind: "ok", text: p.name + " " + t.installed } });
                }
              } else {
                var msg = (result.error && result.error.message) || t.fetchError;
                patch({ installing: null, notice: { kind: "error", text: msg } });
              }
              loadInstalled();
            })
            .catch(function (e) {
              patch({ installing: null, notice: { kind: "error", text: e && e.message ? e.message : t.fetchError } });
            });
        }

        function setEnabled(name, enabled) {
          patch({ notice: null });
          ctx.remote.pluginManager.setBundleEnabled(name, enabled)
            .then(function (result) {
              if (result.ok) {
                var app = result.value && result.value.application;
                if (app === "restart-required") patch({ notice: { kind: "info", text: t.restart } });
              } else {
                patch({ notice: { kind: "error", text: (result.error && result.error.message) || t.fetchError } });
              }
              loadInstalled();
            })
            .catch(function () { patch({ notice: { kind: "error", text: t.fetchError } }); });
        }

        function doRemove(name) {
          patch({ notice: null });
          ctx.remote.pluginManager.removeBundle(name)
            .then(function (result) {
              if (result.ok) {
                patch({ notice: { kind: "ok", text: name + " " + t.remove }, selected: null, detail: null, readme: null });
              } else {
                patch({ notice: { kind: "error", text: (result.error && result.error.message) || t.fetchError } });
              }
              loadInstalled();
            })
            .catch(function () { patch({ notice: { kind: "error", text: t.fetchError } }); });
        }

        // Bootstrap: network check + installed list + community list.
        React.useEffect(function () {
          checkNetwork();
          loadInstalled();
          loadCommunity();
          ctx.remote.$on("plugin-manager/changed", function () { loadInstalled(); });
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        // Filtered list based on category + search.
        var q = state.search.trim().toLowerCase();
        var list = [];
        if (state.category === "community") {
          list = state.community;
        } else if (state.category === "installed-community") {
          list = state.installed.filter(function (b) { return b.installed === true; });
        } else if (state.category === "builtin") {
          list = state.installed.filter(function (b) { return b.installed === false; });
        } else {
          list = state.installed;
        }
        if (q) {
          list = list.filter(function (item) {
            var name = (item.fullName || item.name || item.moduleName || "").toLowerCase();
            var desc = (item.description || "").toLowerCase();
            return name.indexOf(q) >= 0 || desc.indexOf(q) >= 0;
          });
        }

        function installedInfo(item) {
          // For community items, check if a bundle whose name matches the repo is installed.
          if (item.fullName) {
            var hit = null;
            for (var i = 0; i < state.installed.length; i++) {
              var b = state.installed[i];
              if (b.name === item.fullName || b.name === item.name || b.name.indexOf(item.name) >= 0) { hit = b; break; }
            }
            return hit;
          }
          return item;
        }

        function catButton(value, text) {
          return React.createElement("button", {
            type: "button",
            className: "pm-cat" + (state.category === value ? " pm-cat-on" : ""),
            onClick: function () { patch({ category: value, selected: null, detail: null, readme: null }); }
          }, text);
        }

        function iconSvg(size, path) {
          return React.createElement("svg", { width: size || 20, height: size || 20, viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" }, path);
        }

        function storeIcon() {
          return React.createElement("svg", { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" },
            React.createElement("path", { d: "M4 6h16M4 12h16M4 18h10", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" }),
            React.createElement("circle", { cx: 19, cy: 18, r: 2.5, stroke: "currentColor", strokeWidth: 2 })
          );
        }
        function downloadIcon() {
          return React.createElement("svg", { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" },
            React.createElement("path", { d: "M12 4v11m0 0l-4-4m4 4l4-4M5 19h14", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" })
          );
        }
        function settingsIcon() {
          return React.createElement("svg", { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" },
            React.createElement("circle", { cx: 12, cy: 12, r: 3, stroke: "currentColor", strokeWidth: 2 }),
            React.createElement("path", { d: "M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1L7 17M17 7l2.1-2.1", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" })
          );
        }
        function trashIcon() {
          return React.createElement("svg", { width: 14, height: 14, viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" },
            React.createElement("path", { d: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" })
          );
        }

        function renderListItem(item) {
          var isCommunity = !!item.fullName;
          var info = installedInfo(item);
          var installed = !!info;
          var enabled = info && info.enabled !== false;
          var selected = state.selected === (item.fullName || item.id || item.name);
          return React.createElement("div", {
            key: item.fullName || item.id || item.name || item.moduleName,
            className: "pm-item" + (selected ? " pm-item-on" : ""),
            onClick: function () {
              if (isCommunity) selectPlugin(item);
              else patch({ selected: item.id || item.name || item.moduleName, detail: null, readme: null, detailStatus: "idle" });
            }
          },
            React.createElement("div", { className: "pm-item-avatar" },
              item.avatar ? React.createElement("img", { src: item.avatar, alt: "" }) : (item.owner || item.name || "").slice(0, 1).toUpperCase()
            ),
            React.createElement("div", { className: "pm-item-main" },
              React.createElement("div", { className: "pm-item-name" }, item.name || item.fullName || item.moduleName),
              React.createElement("div", { className: "pm-item-desc" }, item.description || item.moduleName || "")
            ),
            isCommunity
              ? (installed
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
                  ? React.createElement("div", { className: "pm-empty" }, t.fetchError + " · ", React.createElement("button", { type: "button", className: "pm-btn", onClick: loadCommunity }, t.retry))
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
              if ((state.installed[i].id || state.installed[i].name || state.installed[i].moduleName) === state.selected) { inst = state.installed[i]; break; }
            }
            if (!inst) {
              for (var j = 0; j < state.plugins.length; j++) {
                if (state.plugins[j].entryId === state.selected) { inst = state.plugins[j]; break; }
              }
            }
            if (inst) {
              return renderInstalledDetail(inst);
            }
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
          var isInstalled = !!info;
          var isInstalling = state.installing === p.fullName;
          return React.createElement("div", { className: "pm-detail" },
            React.createElement("div", { className: "pm-detail-header" },
              React.createElement("div", { className: "pm-detail-title" }, p.fullName),
              isInstalled
                ? React.createElement("span", { className: "pm-btn", style: { opacity: .6 } }, t.installed)
                : React.createElement("button", { type: "button", className: "pm-btn pm-btn-primary", disabled: isInstalling, onClick: function () { doInstall(p); } },
                    isInstalling ? t.installing : t.download
                  )
            ),
            React.createElement("div", { className: "pm-detail-body" },
              React.createElement("div", { className: "pm-detail-meta" },
                React.createElement("span", {}, "⭐ " + p.stars),
                React.createElement("span", {}, t.author + ": " + p.owner),
                p.htmlUrl ? React.createElement("a", { href: p.htmlUrl, target: "_blank", rel: "noreferrer", style: { color: "var(--dsw-alias-brand-primary,#4d6bfe)" } }, "GitHub") : null
              ),
              React.createElement("div", { className: "pm-detail-section" }, t.description),
              React.createElement("div", { className: "pm-detail-text" }, p.description || t.noReadme),
              React.createElement("div", { className: "pm-detail-section" }, t.readme),
              state.detailStatus === "loading"
                ? React.createElement("div", { className: "pm-loading" }, t.loading)
                : React.createElement("div", { className: "pm-readme" }, state.readme || t.noReadme)
            )
          );
        }

        function renderInstalledDetail(inst) {
          var enabled = inst.enabled !== false;
          var removable = inst.removable === true;
          var name = inst.name || inst.moduleName || inst.id;
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
                removable ? React.createElement("span", {}, t.communityTag) : React.createElement("span", {}, t.builtinTag),
                inst.version ? React.createElement("span", {}, "v" + inst.version) : null
              ),
              React.createElement("div", { className: "pm-detail-section" }, t.description),
              React.createElement("div", { className: "pm-detail-text" }, inst.description || "")
            )
          );
        }

        function SettingsView() {
          var s = state.settings || settings;
          var localLang = resolveLang(s);
          var localT = I18N[localLang] || I18N.en;
          function updateSettings(part) {
            var next = {};
            for (var k in s) next[k] = s[k];
            for (var k2 in part) next[k2] = part[k2];
            setState(function (st) { var n = {}; for (var kk in st) n[kk] = st[kk]; n.settings = next; return n; });
          }
          function pickDir() {
            ctx.remote.directoryPicker.pick().then(function (dir) {
              if (dir) updateSettings({ storageLocation: dir });
            }).catch(function () { /* ignore */ });
          }
          return React.createElement("div", { className: "pm-settings" },
            React.createElement("div", { className: "pm-field" },
              React.createElement("label", { className: "pm-field-label" }, localT.language),
              React.createElement("label", { className: "pm-radio" }, React.createElement("input", { type: "radio", name: "lang", checked: s.language === "en", onChange: function () { updateSettings({ language: "en" }); } }), localT.langEn),
              React.createElement("label", { className: "pm-radio" }, React.createElement("input", { type: "radio", name: "lang", checked: s.language === "zh", onChange: function () { updateSettings({ language: "zh" }); } }), localT.langZh),
              React.createElement("label", { className: "pm-radio" }, React.createElement("input", { type: "radio", name: "lang", checked: s.language === "auto", onChange: function () { updateSettings({ language: "auto" }); } }), localT.langAuto)
            ),
            React.createElement("div", { className: "pm-field" },
              React.createElement("label", { className: "pm-field-label" }, localT.communityAddress),
              React.createElement("select", { className: "pm-select", value: (s.communityAddress === DEFAULT_ADDRESS || s.communityAddress.indexOf("github.com/topics/dsh-plugin") >= 0) ? DEFAULT_ADDRESS : "custom", onChange: function (e) {
                if (e.target.value === DEFAULT_ADDRESS) updateSettings({ communityAddress: DEFAULT_ADDRESS });
                else updateSettings({ communityAddress: "" });
              } },
                React.createElement("option", { value: DEFAULT_ADDRESS }, DEFAULT_ADDRESS),
                React.createElement("option", { value: "custom" }, localT.customAddress)
              ),
              (s.communityAddress !== DEFAULT_ADDRESS && s.communityAddress.indexOf("github.com/topics/dsh-plugin") < 0)
                ? React.createElement("input", { className: "pm-input", style: { marginTop: 8 }, type: "text", placeholder: localT.customAddress, value: s.communityAddress, onChange: function (e) { updateSettings({ communityAddress: e.target.value }); } })
                : null,
              React.createElement("div", { className: "pm-field-hint" }, "GitHub topic / user URL，或自定义 JSON 地址")
            ),
            React.createElement("div", { className: "pm-field" },
              React.createElement("label", { className: "pm-field-label" }, localT.storageLocation),
              React.createElement("div", { className: "pm-row" },
                React.createElement("span", { className: "pm-detail-text", style: { flex: 1 } }, s.storageLocation || localT.defaultLocation),
                React.createElement("button", { type: "button", className: "pm-btn", onClick: pickDir }, localT.pickLocation)
              ),
              React.createElement("div", { className: "pm-field-hint" }, "设置始终保存在应用 profile（磁盘持久），所选目录用于额外备份快照")
            ),
            React.createElement("div", { className: "pm-settings-actions" },
              React.createElement("button", { type: "button", className: "pm-btn pm-btn-primary", onClick: function () { saveSettingsAndBackup(s); patch({ settings: s, view: "browser", notice: { kind: "ok", text: localT.saved } }); } }, localT.save),
              React.createElement("button", { type: "button", className: "pm-btn", onClick: function () { patch({ view: "browser" }); } }, localT.close)
            )
          );
        }

        function renderPanel() {
          if (!state.open) return null;
          var dotClass = state.net === "online" ? "pm-dot pm-dot-on" : state.net === "offline" ? "pm-dot pm-dot-off" : "pm-dot pm-dot-check";
          var netText = state.net === "online" ? t.netOnline : state.net === "offline" ? t.netOffline : t.netChecking;
          return React.createElement("div", { className: "pm-panel" },
            React.createElement("div", { className: "pm-header" },
              React.createElement("h2", { className: "pm-title" }, t.title),
              React.createElement("span", { className: "pm-item-state " + (state.net === "online" ? "pm-state-on" : state.net === "offline" ? "pm-state-off" : "") }, netText),
              React.createElement("button", { type: "button", className: "pm-header-btn", title: t.settings, onClick: function () { patch({ view: state.view === "settings" ? "browser" : "settings" }); } }, settingsIcon()),
              React.createElement("button", { type: "button", className: "pm-header-btn", title: t.close, onClick: function () { patch({ open: false }); } }, React.createElement("span", {}, "✕"))
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
