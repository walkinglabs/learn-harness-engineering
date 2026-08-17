# AGENTS.md

此项目 05 变体展示了用于 `ConversationHistory` 的生成器加评估器模式。它包含已完成的代码和评估器量规，但不包含完整的综合项目 harness 文件。

## 启动工作流

编写代码前：

1. 用 `pwd` 确认工作目录。
2. 阅读 `docs/ARCHITECTURE.md`，了解 Electron 层级边界。
3. 阅读 `evaluator-rubric.md`，了解此变体的修订证据要求。
4. 阅读 `clean-state-checklist.md`。
5. 若缺少依赖，运行 `npm install`。
6. 运行 `npm run check`。
7. 运行 `bash scripts/check-architecture.sh`。

若基线验证已失败，先修复它。不要在损坏的初始状态上叠加新的功能工作。

## 工作规则

- 每次只处理一个功能。
- 不要仅因添加了代码就将功能标记为完成。
- 除非阻塞项迫使你进行范围狭窄的支持性修复，否则变更应保持在所选功能范围内。
- 实现期间不要悄然改变验证规则。
- 相比聊天摘要，优先保留持久的仓库工件。

## 运行时可观测性

所有服务通过 `src/services/logger.ts` 使用结构化日志。日志输出为 JSON 格式，包含时间戳、级别、服务名称和消息。日志级别：DEBUG、INFO、WARN、ERROR。

调试时，检查以下日志：
- 启动时的服务初始化事件
- IPC 通道调用及其参数
- 索引分块数量和内容长度
- 问答置信度分数和引用数量

## 架构约束

以下层级边界由 `scripts/check-architecture.sh` 强制执行：

- **渲染进程**不得导入 `fs`、`path` 或任何 Node.js 核心模块。
- **服务**不得导入 Electron IPC 或渲染进程专用模块。
- **预加载脚本**只能通过 contextBridge 暴露带类型的 API。

提交前运行 `bash scripts/check-architecture.sh`。

## 必需工件

- `AGENTS.md`：本项目的操作规则
- `docs/ARCHITECTURE.md`：层级边界和数据流
- `scripts/check-architecture.sh`：边界防护脚本
- `clean-state-checklist.md`：提交前的仓库健康检查
- `evaluator-rubric.md`：此变体的质量与修订证据

不要假定此变体存在 `feature_list.json`、`claude-progress.md`、`init.sh` 或 `session-handoff.md`。

## 完成定义

当且仅当下列条件全部满足时，一个功能才算完成：

- 目标行为已实现
- 所需验证已实际运行
- 证据已记录在 `evaluator-rubric.md` 或最终摘要中
- 仓库可从标准启动路径重新开始工作
- `scripts/check-architecture.sh` 通过且无违规项

## 会话结束

结束会话前：

1. 在最终摘要中记录任何未解决风险或阻塞项。
2. 运行 `npm run check`。
3. 运行 `bash scripts/check-architecture.sh`。
4. 工作处于安全状态后，以描述性信息提交。
5. 保持仓库足够整洁，使下一会话可运行启动工作流。
