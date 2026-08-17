# AGENTS.md —— 项目 01：基线与最小 Harness 对比

## 启动规则

在编写任何代码前，按顺序完成以下步骤：

1. **完整阅读此文件。**它定义了本项目的边界与约定。
2. **阅读 `docs/ARCHITECTURE.md`**，了解 Electron 层级结构。
3. **阅读 `docs/PRODUCT.md`**，了解功能需求。
4. **运行 `bash init.sh`**，确认项目可正常构建。如失败，先修复构建错误再继续。
5. **阅读 `feature_list.json`**，查看所有功能的当前状态。

## Electron 层级边界

本项目有四个严格的层级。代码必须遵守这些边界：

### 主进程（`src/main/`）
- 负责 `BrowserWindow` 生命周期和 IPC 注册。
- 可以导入服务，但绝不导入渲染进程代码。
- 所有文件系统访问均在此处通过服务进行。

### 预加载脚本（`src/preload/`）
- 是主进程与渲染进程之间**唯一**的桥梁。
- 使用 `contextBridge.exposeInMainWorld` 暴露带类型的 API。
- 绝不导入 React 或渲染进程代码。

### 渲染进程（`src/renderer/`）
- React + TypeScript UI 层。
- 仅通过 `window.knowledgeBase` API 与主进程通信。
- 绝不导入 Node.js 模块（`fs`、`path`、`electron`）。
- 使用 `types.d.ts` 中的类型声明。

### 服务（`src/services/`）
- 在主进程中运行的纯 TypeScript 业务逻辑。
- 服务可从 `src/shared/` 导入，但绝不从 `src/renderer/` 导入。
- 每个服务通过构造函数注入接收 `PersistenceService`。

## 约定

- 启用 TypeScript 严格模式。不得使用 `any`，除非附带注释说明原因。
- 使用命名导出（不使用默认导出）。
- IPC 通道名称仅在 `src/shared/types.ts`（`IPC_CHANNELS`）中定义一次。
- 所有异步操作均返回 Promise；渲染进程中绝不使用同步 I/O。

## 完成定义

当且仅当下列条件全部满足时，一个功能才算“完成”：

1. TypeScript 无错误编译（`npm run check`）。
2. 应用已启动且窗口可见（`npm run dev`）。
3. 该功能在 `feature_list.json` 中的状态为 `"pass"`，并包含证据。
4. 代码遵守上述 Electron 层级边界。
5. 正常运行期间没有控制台错误。

## 使用功能列表

`feature_list.json` 是项目进度的唯一事实来源：

- 每项功能都有一个 `status`：`"pass"`、`"fail"` 或 `"not-started"`。
- 实现某功能时，将其状态更新为 `"pass"` 并添加证据。
- 若功能被阻塞，将状态设为 `"fail"` 并说明原因。
- 绝不从列表中删除功能。
