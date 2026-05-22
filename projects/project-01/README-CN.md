# Project 01：Prompt-only vs Rules-first for Interview Debrief Apps

对比两种方式：只给 agent 一句“做个面试复盘 App”，以及给 agent 一个最小 harness（AGENTS.md、init.sh、feature_list.json、fixture transcript）。

## 目录说明

| 目录 | 含义 |
|------|------|
| `starter/` | 弱 harness 起点：极简 Electron app、模糊任务说明、sample transcript。 |
| `solution/` | 参考实现：同一产品目标，但补齐 AGENTS.md、init.sh、feature_list.json、parser test、静态 debrief UI 和 progress log。 |

## 使用方式

```sh
cd starter
npm install
# 把 task-prompt.md 交给 Claude Code / Codex。
# 让 agent 完成：窗口启动、面试会话列表、transcript timeline、debrief summary。

cd ../solution
npm install
# 要求 agent 先读 AGENTS.md，再按规则完成同一任务。
```

## 覆盖功能

- Electron 窗口能启动
- UI 显示固定 interview session
- UI 显示 sample timestamped transcript
- UI 显示静态 debrief summary
- 不接真实 LLM，不接真实音频转写
