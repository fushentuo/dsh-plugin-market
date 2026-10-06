# dsh-plugin-market

DeepSeek Harness 社区插件市场：浏览、下载、安装与管理社区 dsh 插件。

## 功能

1. **网络连通检测**：启动即检测是否能连通 GitHub（社区数据源），在右下角图标上用绿点/红点/黄点实时显示在线、离线、检测中三种状态。
2. **可拖动窗口**：点击图标弹出一个独立窗口，拖动标题栏可移动（双击标题栏回到默认位置），拥有不透明实底背景，不会和主界面糊在一起。
3. **浏览界面**：窗口左侧栏顶部为搜索框、下方为分类，右侧展示选中插件的详情。
4. **插件详情**：右侧展示插件的简介、星标、作者、README；左侧选中的插件与右侧顶部都有「下载」入口；顶部还有「翻译」开关（用设置里的语言翻译简介与 README），以及「在 GitHub 打开」按钮（走系统浏览器打开对应仓库页）。
5. **多语言**：右上角设置里可选择界面语言——英文（默认）、中文、或按系统时区自动判断。
6. **面板外观**：设置里可调「面板不透明度」（30%–100%）与「面板背景」（暗色/亮色）。
7. **社区地址**：默认 `https://github.com/topics/dsh-plugin`；设置里提供下拉列表，也可自定义输入（GitHub topic / 用户 / 自定义 JSON 地址）。
8. **本地保存**：设置修改并点保存后写入本地（localStorage，Electron userData，重启不丢）。
9. **分类管理**：左侧分类可查看「社区插件 / 已安装的社区插件 / 自带插件 / 全部已安装」，并对已安装插件执行启用/禁用与删除。
10. **持久化与存储位置**：设置与插件启用状态都会持久保存；设置里可选择「数据存储位置」，保存时会把设置快照额外备份一份 JSON 到该目录。

## 结构

- `lib/index.js` —— 宿主半侧：注册 `/plugin-market/snapshot`（写设置快照到指定目录）与 `/plugin-market/translate`（代理翻译请求，避开浏览器 CORS）两个路由。
- `lib/client.js` —— 客户端半侧（`window.__ModuleLoader__.load` 模块格式），含全部 UI 与逻辑。
- `cordis.patch.yml` —— bundle 补丁，插入自引用 loader 行。

## 安装

本包是一个 **bundle**（`dsh.bundle.patch`）同时也是一个客户端插件（`dsh.client`）。在 DSH 中通过插件管理器安装本地路径：

```
dsh plugin install <本目录的绝对路径>
```

## 说明

- 插件列表数据来自 GitHub 的搜索/仓库 API（`api.github.com`），需要能访问 GitHub。
- 「下载/安装」调用 DSH 的插件管理器（`pluginManager.installBundle`），按仓库 git 地址安装，因此社区仓库需要是声明了 `dsh.bundle` 的合法 dsh 插件包。
- 「翻译」由宿主半侧代理调用公开翻译接口（Google 翻译公开端点，失败时回退 MyMemory），失败时保留原文并提示。
- 「在 GitHub 打开」通过 Electron 主进程的窗口打开处理转交系统浏览器（`shell.openExternal`）。
- 设置持久化在本地 `localStorage`（应用 profile / Electron userData 目录，重启不丢）；「存储位置」用于额外写一份 `dsh-plugin-market.json` 快照到指定目录。
