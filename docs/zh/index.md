# 欢迎来到 Learn Harness Engineering

系统学习如何通过环境、状态、验证与控制机制，让 Codex 和 Claude Code 完成真实工程任务。

## 核心观点

以后让模型干活，人只需要定好规则和边界。这就是 harness。

**为什么这个重要：** 模型很强，但不代表它能自动靠谱地完成真实工程任务。它需要一套明确的规则来约束自己的行为范围，需要清晰的交接机制来维持长时任务的连续性，需要验证手段来确认自己做对了。

我们不是在尝试"让模型本身更聪明"，而是在研究：怎么给模型搭建一个靠谱的工作环境，让同一个模型做出更可靠的工作。

## 快速开始

不必先把所有 lecture 读完。如果你想先上手，可以直接去资料库参考这些文件，然后按自己的项目改一版。

中文版本：

- 入口：[中文资料库](/zh/resources/)
- 根指令文件：[`AGENTS.md`](/zh/resources/templates/AGENTS.md) 或 [`CLAUDE.md`](/zh/resources/templates/CLAUDE.md)
- 功能状态文件：[`feature_list.json`](/zh/resources/templates/feature_list.json)
- 进度记录文件：[`claude-progress.md`](/zh/resources/templates/claude-progress.md)
- 会话交接文件：[`session-handoff.md`](/zh/resources/templates/session-handoff.md)
- 收尾检查清单：[`clean-state-checklist.md`](/zh/resources/templates/clean-state-checklist.md)
- 评审模板：[`evaluator-rubric.md`](/zh/resources/templates/evaluator-rubric.md)
- 启动脚本参考：`docs/zh/resources/templates/init.sh`

推荐最小起步组合：

- `AGENTS.md` 或 `CLAUDE.md`
- `feature_list.json`
- `claude-progress.md`
- `init.sh`

先把这四样放进你的项目里，再开始让 agent 真正干活，效果会比只写一段大 prompt 稳定得多。

## 适合谁

这门课适合：

- 已经在使用 coding agent、希望提升稳定性和质量的工程师
- 想系统理解 harness 设计的研究者或构建者
- 需要理解"环境设计如何影响 agent 表现"的技术负责人

这门课不适合：

- 只想要一个零代码 AI 入门的人
- 只关心 prompt，而不打算做真实实现的人
- 不准备让 agent 在真实仓库里工作的学习者

## 环境要求

这是一门真正需要动手跑 coding agent 的课程。

你至少需要具备一个这类工具：

- Claude Code
- Codex
- 其他支持文件编辑、命令执行、多步任务的 IDE / CLI coding agent

课程默认你可以：

- 打开本地仓库
- 允许 agent 编辑文件
- 允许 agent 运行命令
- 检查输出并重复执行任务

如果你没有这类工具，仍然可以阅读课程内容，但无法按预期完成课程 project。

## 核心参考资料

主参考：

- [OpenAI: Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)
- [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Anthropic: Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)

辅助参考：

- [LangChain: The Anatomy of an Agent Harness](https://blog.langchain.com/the-anatomy-of-an-agent-harness/)
- [Thoughtworks: Harness Engineering](https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html)
- [HumanLayer: Skill Issue: Harness Engineering for Coding Agents](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents)
