# Learn Harness Engineering

> 这是一门项目制课程：系统学习如何通过环境、状态、验证与控制机制，让 Codex 和 Claude Code 更可靠地工作。

本课程仍在持续建设中，内容后续可能会调整。

英文入口见：[English Home](/en/)

## 课程概览

Harness engineering 指的是：围绕模型搭建一整套工作环境，让它干活更靠谱。这不只是写提示词，还包括：

- 代码放哪、怎么组织
- 什么能干、什么干不了
- 任务做到哪了、下次怎么接上
- 做完怎么验证对不对
- 出了问题怎么排查
- 哪些规矩必须遵守
- 怎么保持干净、不留烂摊子

这门课是**强实践导向**的。我们不会只停留在“概念解释”，而是会让 Codex 或 Claude Code 在同一个不断演化的 Electron 应用上反复工作，并比较弱 harness 与强 harness 的差异。

课程真正关心的问题是：

- 哪些 harness 设计会提升任务完成率？
- 哪些设计会减少返工和错误完成？
- 哪些机制能让长时任务更稳定地持续推进？
- 哪些结构能让系统在多轮 agent 运行后仍然可维护？

## 核心观点

以后让模型干活，人只需要定好规则和边界。这就是 harness。

**为什么这个重要：** 模型很强，但不代表它能自动靠谱地完成真实工程任务。它需要一套明确的规则来约束自己的行为范围，需要清晰的交接机制来维持长时任务的连续性，需要验证手段来确认自己做对了。

我们不是在尝试“让模型本身更聪明”，而是在研究：怎么给模型搭建一个靠谱的工作环境，让同一个模型做出更可靠的工作。

## 课程大纲

### 讲义

> 讲义正文目前仍以英文为主，中文先提供导览和说明。

- [Lecture 01. 为什么强模型依然会失败](/lectures/lecture-01-why-capable-agents-still-fail/)
- [Lecture 02. 什么才算 harness](/lectures/lecture-02-what-a-harness-actually-is/)
- [Lecture 03. 为什么仓库必须成为唯一事实来源](/lectures/lecture-03-why-the-repository-must-become-the-system-of-record/)
- [Lecture 04. 为什么一个巨大的 instruction 文件会失败](/lectures/lecture-04-why-one-giant-instruction-file-fails/)
- [Lecture 05. 为什么长时任务会失去连续性](/lectures/lecture-05-why-long-running-tasks-lose-continuity/)
- [Lecture 06. 为什么初始化必须是独立阶段](/lectures/lecture-06-why-initialization-needs-its-own-phase/)
- [Lecture 07. 为什么任务边界必须被显式化](/lectures/lecture-07-why-agents-overreach-and-under-finish/)
- [Lecture 08. 为什么验证必须外部化](/lectures/lecture-08-why-feature-lists-are-harness-primitives/)
- [Lecture 09. 为什么运行时反馈必须进入 harness](/lectures/lecture-09-why-agents-declare-victory-too-early/)
- [Lecture 10. 为什么完整验证才算真的验证](/lectures/lecture-10-why-end-to-end-testing-changes-results/)
- [Lecture 11. 为什么可观测性必须进入 harness](/lectures/lecture-11-why-observability-belongs-inside-the-harness/)
- [Lecture 12. 为什么每次会话都必须干净收尾](/lectures/lecture-12-why-every-session-must-leave-a-clean-state/)

### 项目

> 项目正文目前仍以英文为主，中文先提供导览和学习路径。

- [Project 01. 基线提示词 vs 最小 harness](/projects/project-01-baseline-vs-minimal-harness/)
- [Project 02. 让项目对 agent 可读，并接住上次的工作](/projects/project-02-agent-readable-workspace/)
- [Project 03. 让 agent 在会话重启后继续推进](/projects/project-03-multi-session-continuity/)
- [Project 04. 用运行时反馈修正 agent 的行为](/projects/project-04-incremental-indexing/)
- [Project 05. 让 agent 学会评审并验证自己的工作](/projects/project-05-grounded-qa-verification/)
- [Project 06. 基准测试、清理与综合 harness](/projects/project-06-runtime-observability-and-debugging/)

### 资料库

- [资料库总览](/resources/)
- [中文资料库](/resources/zh/)
- [英文资料库](/resources/en/)

## 快速开始

不必先把所有 lecture 读完。如果你想先上手，可以直接去资料库参考这些文件，然后按自己的项目改一版。

中文版本：

- 入口：[中文资料库](/resources/zh/)
- 根指令文件：[`AGENTS.md`](/resources/zh/templates/AGENTS.md) 或 [`CLAUDE.md`](/resources/zh/templates/CLAUDE.md)
- 功能状态文件：[`feature_list.json`](/resources/zh/templates/feature_list.json)
- 进度记录文件：[`claude-progress.md`](/resources/zh/templates/claude-progress.md)
- 会话交接文件：[`session-handoff.md`](/resources/zh/templates/session-handoff.md)
- 收尾检查清单：[`clean-state-checklist.md`](/resources/zh/templates/clean-state-checklist.md)
- 评审模板：[`evaluator-rubric.md`](/resources/zh/templates/evaluator-rubric.md)
- 启动脚本参考：`docs/resources/zh/templates/init.sh`

英文版本：

- 入口：[English Home](/en/)
- 资料库：[英文资料库](/resources/en/)
- 根指令文件：[`AGENTS.md`](/resources/en/templates/AGENTS.md) 或 [`CLAUDE.md`](/resources/en/templates/CLAUDE.md)
- 功能状态文件：[`feature_list.json`](/resources/en/templates/feature_list.json)
- 进度记录文件：[`claude-progress.md`](/resources/en/templates/claude-progress.md)
- 会话交接文件：[`session-handoff.md`](/resources/en/templates/session-handoff.md)
- 收尾检查清单：[`clean-state-checklist.md`](/resources/en/templates/clean-state-checklist.md)
- 评审模板：[`evaluator-rubric.md`](/resources/en/templates/evaluator-rubric.md)

推荐最小起步组合：

- `AGENTS.md` 或 `CLAUDE.md`
- `feature_list.json`
- `claude-progress.md`
- `init.sh`

先把这四样放进你的项目里，再开始让 agent 真正干活，效果会比只写一段大 prompt 稳定得多。

## 建议学习节奏

这门课适合按 6 个单元推进：

- **单元 1**：Lecture 01-02 + Project 01
- **单元 2**：Lecture 03-04 + Project 02
- **单元 3**：Lecture 05-06 + Project 03
- **单元 4**：Lecture 07-08 + Project 04
- **单元 5**：Lecture 09-10 + Project 05
- **单元 6**：Lecture 11-12 + Project 06

如果你想慢一点，也可以把每个单元当成一周来学。

## 适合谁

这门课适合：

- 已经在使用 coding agent、希望提升稳定性和质量的工程师
- 想系统理解 harness 设计的研究者或构建者
- 需要理解“环境设计如何影响 agent 表现”的技术负责人

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

## 本地预览

本仓库使用 VitePress 作为文档查看器。

```sh
npm install
npm run docs:dev
```

然后在浏览器里打开 VitePress 输出的本地地址即可。
