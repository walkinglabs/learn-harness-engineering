# AGENTS.md —— 项目 03：通过范围控制实现多会话连续性

## 启动规则

在编写任何代码前，按顺序完成以下步骤：

1. **完整阅读此文件。**它定义了本项目的边界与约定。
2. **阅读 `docs/ARCHITECTURE.md`**，了解 Electron 层级结构、分块与问答流程。
3. **阅读 `docs/PRODUCT.md`**，了解功能需求。
4. **运行 `npm install && npm run check`**，确认项目可正常构建。
5. **阅读 `feature_list.json`**，查看所有功能的当前状态。

## 每次只处理一个功能的政策

**这是项目 03 的核心纪律。**

实现功能时，必须遵循下列流程：

1. 从 `feature_list.json` 中选择**恰好一个**状态为 `"not-started"` 的功能。
2. **只实现该功能。**不要改动与所选功能无关的代码。
3. 运行 `npm run check` 并测试行为，**验证功能正常**。
4. **更新 `feature_list.json`**：将功能状态设为 `"pass"` 并添加证据。
5. **提交变更**，提交信息须引用该功能 ID。
6. **仅在此之后**，才能转向下一个功能。

违反此政策——在一次工作中实现多个功能，或编辑当前功能范围外的文件——是本项目中最常见的 bug 和回归原因。

### 功能依赖

```
metadata-extraction  -->  document-chunking  -->  indexing-status-ui
                                                  |
                                                  v
                                           grounded-qa
```

- `metadata-extraction` 必须先于 `document-chunking` 完成（分块需要元数据）。
- `document-chunking` 必须先于 `indexing-status-ui` 完成（状态跟踪分块）。
- `document-chunking` 必须先于 `grounded-qa` 完成（问答需要已索引的分块）。
- 分块完成后，`indexing-status-ui` 与 `grounded-qa` 的完成顺序不限。

## 文档层级

`docs/` 目录按便于智能体阅读的方式组织：

```
docs/
  ARCHITECTURE.md   -- Electron 层、数据流、分块管线、问答流程
  PRODUCT.md        -- 功能需求与面向用户的行为
```

添加新功能时，先更新相关文档再编写代码。

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
- 新 IPC 通道遵循 `namespace:action` 模式。

## 清洁状态检查清单

在宣布项目完成前，验证 `clean-state-checklist.md` 中的每一项。

## 会话交接

恢复工作时，阅读 `session-handoff.md` 获取上次会话的上下文。结束会话时，更新它并记录：

- 已完成的事项
- 剩余事项
- 任何阻塞项或已做决策
- 被修改的文件
