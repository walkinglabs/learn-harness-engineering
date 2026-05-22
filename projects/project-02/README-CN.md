# Project 02：Agent-readable Interview Workspace

让 agent 从仓库文档中读取产品定义、transcript 格式、数据模型、分析模型、安全边界和架构规则，而不是靠猜。

## 目录说明

| 目录 | 含义 |
|------|------|
| `starter/` | 从 Project 01 衍生的起点，transcript import 和 persistence 仍需加固。 |
| `solution/` | 参考实现：包含产品文档、架构文档、transcript parser、session store 和 handoff。 |

## 覆盖功能

- 导入带时间戳 transcript
- 解析 timestamp / speaker / utterance
- 本地保存 InterviewSession
- 重启后保留历史 session
- UI 显示 parse errors，不静默失败
