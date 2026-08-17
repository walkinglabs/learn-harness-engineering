# AGENTS.md —— 项目 06：运行时可观测性与调试（综合项目）

## 启动规则

在编写任何代码前，按顺序完成以下步骤：

1. **完整阅读此文件。**它定义了本项目的边界与约定。
2. 若使用 Claude Code，**阅读 `CLAUDE.md`** 获取快速参考。
3. **阅读 `docs/ARCHITECTURE.md`**，了解完整的 Electron 层级结构和数据流。
4. **阅读 `docs/PRODUCT.md`**，了解完整的功能需求。
5. **阅读 `docs/RELIABILITY.md`**，了解日志、可观测性和清洁状态要求。
6. **运行 `bash init.sh`**，确认项目可正常构建和初始化。
7. **阅读 `feature_list.json`**，查看所有功能的当前状态。

## 项目背景

这是 Learn Harness Engineering 课程的**综合项目**。它将项目 01–05 的所有功能组合为一个完整产品：

- 具有验证功能的文档导入
- 带进度跟踪的文本索引
- 带引用的有据可查问答
- 聊天式显示的对话历史
- 用于运行时可观测性的结构化日志
- 收集问答回答反馈
- 用于测试的清洁状态重置
- 用于性能测量的基准测试脚本
- 用于检测过时工件的清理扫描器

## 文档层级

`docs/` 目录按便于智能体阅读的方式组织：

```
docs/
  ARCHITECTURE.md   -- Electron 层、数据流、完整管线
  PRODUCT.md        -- 功能需求与面向用户的行为
  RELIABILITY.md    -- 日志、可观测性、清洁状态、基准测试
```

添加新功能时，先更新相关文档再编写代码。

## Electron 层级边界

### 主进程（`src/main/`）
- 负责 BrowserWindow 生命周期和 IPC 注册。
- 所有文件系统访问均在此处通过服务进行。
- 为所有 IPC 事件记录结构化日志。

### 预加载脚本（`src/preload/`）
- 是主进程与渲染进程之间**唯一**的桥梁。
- 使用 `contextBridge.exposeInMainWorld` 暴露带类型的 API。
- 暴露命名空间：documents、indexing、qa、feedback、app。

### 渲染进程（`src/renderer/`）
- React + TypeScript UI 层。
- 仅通过 `window.knowledgeBase` API 通信。
- 绝不导入 Node.js 模块。

### 服务（`src/services/`）
- 主进程中的纯 TypeScript 业务逻辑。
- 通过构造函数注入 `PersistenceService`。
- 所有服务均使用 `logger.forService()` 输出结构化 JSON 日志。

## 约定

- TypeScript 严格模式。不得使用 `any`，除非附带注释说明原因。
- 仅使用命名导出。
- IPC 通道仅在 `src/shared/types.ts` 中定义一次。
- 新 IPC 通道遵循 `namespace:action` 模式。
- 所有服务方法都必须以 INFO 级别记录重大事件。
- 对常规数据访问使用 DEBUG 级别。
- 对缺失但不关键的数据使用 WARN 级别。
- 对失败使用 ERROR 级别。

## 完成定义

一个功能在满足下列条件时才算“完成”：

1. TypeScript 无错误编译（`npm run check`）。
2. 应用已启动且窗口可见。
3. 该功能在 `feature_list.json` 中的状态为 `"pass"`，并包含证据。
4. 代码遵守 Electron 层级边界。
5. 结构化日志覆盖所有服务操作。
6. `docs/ARCHITECTURE.md` 和/或 `docs/PRODUCT.md` 已更新。
7. `clean-state-checklist.md` 的所有检查均通过。

## 会话交接

恢复工作时，阅读 `session-handoff.md` 获取上次会话的上下文。结束会话时，更新它并记录：

- 已完成的事项
- 剩余事项
- 任何阻塞项或已做决策
- 被修改的文件
- 如适用，记录基准测试结果

## 清洁状态

每次重要测试周期前：

1. 运行 `bash scripts/cleanup-scanner.sh` 检查过时工件。
2. 使用应用内 Reset 按钮或 `RESET_DATA` IPC 清除所有数据。
3. 验证 `clean-state-checklist.md` 中的检查全部通过。
4. 运行 `bash scripts/benchmark.sh` 测量性能。
