# AGENTS.md —— 项目 06：运行时可观测性与调试（综合项目）

## 启动规则

1. 阅读此文件。
2. 运行 `npm install && npm run check` 验证构建。
3. 应用应可通过 `npm run dev` 启动。

## 项目说明

这是 Learn Harness Engineering 课程的综合项目。它组合了先前项目的所有功能：

- 文档导入、索引和问答
- 对话历史视图
- 用于测试的清洁状态管理

此起始项目有意采用较弱的 harness 表面。它不包含 `CLAUDE.md`、`feature_list.json`、`init.sh`、`session-handoff.md`、基准测试脚本或清理脚本。请用它作为与 `../solution/` 对比的基线。

## 待评估或改进内容

应针对以下方面，将基线与解决方案进行评估：

1. `ConversationHistory` 的完整性
2. 问答回答上的反馈按钮（点赞/点踩）
3. 结构化日志覆盖范围
4. 清洁状态重置行为
5. `../solution/` 中存在的 harness 工件与基准测试自动化

## 约定

- TypeScript 严格模式。
- 仅使用命名导出。
- IPC 通道定义在 `src/shared/types.ts` 中。
- 服务使用构造函数注入的 `PersistenceService`。
