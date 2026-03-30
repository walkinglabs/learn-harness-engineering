# 中文资料库

这个文件夹把课程里的方法整理成可以直接参考和复用的材料，不是再讲一遍概念，而是尽量回答两个问题：

- 我现在应该先抄哪些文件
- 这些文件分别解决什么问题

## 适合什么时候用

当你准备让 Codex、Claude Code 或其他 coding agent 在一个仓库里持续工作时，就可以从这里开始。它特别适合这些场景：

- 多轮会话开发，担心上下文断裂
- 功能多，容易出现做一半就停的半成品
- 常常提前宣布完成，但实际没测透
- 每次开工都要重新摸索启动方式

## 从这里开始

如果你想先搭一个最小可用版本，优先看这些文件：

- 根指令文件：[`templates/AGENTS.md`](./templates/AGENTS.md) 或 [`templates/CLAUDE.md`](./templates/CLAUDE.md)
- 功能状态文件：[`templates/feature_list.json`](./templates/feature_list.json)
- 进度日志：[`templates/claude-progress.md`](./templates/claude-progress.md)
- 启动脚本参考：`resources/zh/templates/init.sh`

然后按需要补上：

- 会话交接模板：[`templates/session-handoff.md`](./templates/session-handoff.md)
- 收尾检查清单：[`templates/clean-state-checklist.md`](./templates/clean-state-checklist.md)
- 评审模板：[`templates/evaluator-rubric.md`](./templates/evaluator-rubric.md)

## 资料库结构

- [`templates/`](./templates/README.md)：可以直接复制到真实仓库里的模板
- [`reference/`](./reference/README.md)：方法说明、启动流程和问题对照表

## 推荐最小组合

- `AGENTS.md` 或 `CLAUDE.md`
- `feature_list.json`
- `claude-progress.md`
- `init.sh`

先把这四样放进项目里，再开始让 agent 持续工作，通常就已经能明显降低返工和瞎猜。
