# AGENTS.md —— 项目 02：便于智能体阅读的工作区

## 启动规则

在编写任何代码前，按顺序完成以下步骤：

1. **完整阅读此文件。**它定义了本项目的边界与约定。
2. **阅读 `docs/ARCHITECTURE.md`**，了解 Electron 层级结构和导入流程。
3. **阅读 `docs/PRODUCT.md`**，了解功能需求。
4. **运行 `npm install && npm run check`**，确认项目可正常构建。
5. **阅读 `feature_list.json`**，查看所有功能的当前状态。

## 文档层级

`docs/` 目录按便于智能体阅读的方式组织：

```
docs/
  ARCHITECTURE.md   -- Electron 层、数据流、导入管线
  PRODUCT.md        -- 功能需求与面向用户的行为
```

添加新功能时，先更新相关文档再编写代码。这有助于智能体了解不同会话之间的变更。

## Electron 层级边界

### 主进程（`src/main/`）
- 负责 BrowserWindow 生命周期和 IPC 注册。
- 所有文件系统访问均在此处通过服务进行。

### 预加载脚本（`src/preload/`）
- 是主进程与渲染进程之间**唯一**的桥梁。
- 使用 `contextBridge.exposeInMainWorld` 暴露带类型的 API。

### 渲染进程（`src/renderer/`）
- React + TypeScript UI 层。
- 仅通过 `window.knowledgeBase` API 通信。
- 绝不导入 Node.js 模块。

### 服务（`src/services/`）
- 主进程中的纯 TypeScript 业务逻辑。
- 通过构造函数注入 `PersistenceService`。

## 约定

- TypeScript 严格模式。不得使用 `any`，除非附带注释说明原因。
- 仅使用命名导出。
- IPC 通道仅在 `src/shared/types.ts` 中定义一次。
- 新 IPC 通道遵循 `namespace:action` 模式（例如 `documents:get-content`）。

## 完成定义

一个功能在满足下列条件时才算“完成”：

1. TypeScript 无错误编译（`npm run check`）。
2. 应用已启动且窗口可见。
3. 该功能在 `feature_list.json` 中的状态为 `"pass"`，并包含证据。
4. 代码遵守 Electron 层级边界。
5. `docs/ARCHITECTURE.md` 和/或 `docs/PRODUCT.md` 已更新以反映变更。

## 会话交接

恢复工作时，阅读 `session-handoff.md` 获取上次会话的上下文。结束会话时，更新它并记录：

- 已完成的事项
- 剩余事项
- 任何阻塞项或已做决策
- 被修改的文件
