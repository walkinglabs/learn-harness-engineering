# Learn Harness Engineering

> 这是一门项目制课程：系统学习如何通过环境、状态、验证与控制机制，让 Codex 和 Claude Code 更可靠地工作。

[English Version](./README.md)

本课程仍在持续建设中，内容后续可能会调整。

## 课程概览

Harness engineering 指的是：围绕模型搭建一整套工作环境，让它干活更靠谱。这不只是写提示词，还包括：

- 代码放哪、怎么组织
- 什么能干、什么干不了
- 任务做到哪了、下次怎么接上
- 做完怎么验证对不对
- 出了问题怎么排查
- 哪些规矩必须遵守
- 怎么保持干净、不留烂摊子

这门课是**强实践导向**的。我们不会只停留在"概念解释"，而是会让 Codex 或 Claude Code 在同一个不断演化的 Electron 应用上反复工作，并比较弱 harness 与强 harness 的差异。

课程真正关心的问题是：

- 哪些 harness 设计会提升任务完成率？
- 哪些设计会减少返工和错误完成？
- 哪些机制能让长时任务更稳定地持续推进？
- 哪些结构能让系统在多轮 agent 运行后仍然可维护？

## 核心观点

以后让模型干活，人只需要定好规则和边界——这就是 harness。

**这事的关键：** 模型很强，但不代表它能自动靠谱地完成真实工程任务。它需要一套明确的规则来约束自己的行为范围、需要清晰的交接机制来维持长时任务的连续性、需要验证手段来确认自己做对了。

我们不是在尝试"让模型本身更聪明"，而是研究：怎么给模型搭建一个靠谱的工作环境，让同一个模型做出更可靠的工作。

## 快速开始

不用读完 12 个讲义再动手。如果你已经在用 coding agent 做项目，下面这些能立刻改善效果。

思路很简单：不是光写提示词，而是在仓库里放一组结构化的文件——告诉 agent 该做什么、做完了什么、怎么验证。这些文件就放在项目里，每次会话都从同一个状态开始。

**第一步.** 把根指令文件复制到项目根目录：

- [`AGENTS.md`](./resources/zh/templates/AGENTS.md) 通用版，或者 [`CLAUDE.md`](./resources/zh/templates/CLAUDE.md) 如果你用 Claude Code
- 把里面的命令、路径和规则换成你自己项目的

**第二步.** 把启动脚本复制进去：

- [`init.sh`](./resources/zh/templates/init.sh) —— 一条命令完成依赖安装、验证和启动
- 把 `INSTALL_CMD`、`VERIFY_CMD`、`START_CMD` 换成你自己的

**第三步.** 把进度日志复制进去：

- [`claude-progress.md`](./resources/zh/templates/claude-progress.md) —— 每轮会话记录做了什么、验证了什么、下一步是什么
- agent 每次开工会先读这个文件，从上次停下的地方继续

**第四步.** 把功能清单复制进去：

- [`feature_list.json`](./resources/zh/templates/feature_list.json) —— 机器可读的功能列表，每个功能有状态、验证步骤和证据
- 把示例功能换成你自己的

四个文件，最小起步就够了。比光靠一段提示词稳定得多。

等项目变复杂了，再补这些：

- [`session-handoff.md`](./resources/zh/templates/session-handoff.md) —— 会话之间的交接摘要
- [`clean-state-checklist.md`](./resources/zh/templates/clean-state-checklist.md) —— 每次会话结束前的清理清单
- [`evaluator-rubric.md`](./resources/zh/templates/evaluator-rubric.md) —— 评审 agent 产出质量的评分表

每个文件的详细用法写在 [中文模板指南](./resources/zh/templates/README.md)。英文版见 [English template guide](./resources/en/templates/README.md)。

## 课程大纲

### 讲义

- [Lecture 01. 模型能力强，不等于执行可靠](./lectures/lecture-01-why-capable-agents-still-fail/README.md)
- [Lecture 02. Harness 的定义](./lectures/lecture-02-what-a-harness-actually-is/README.md)
- [Lecture 03. 让代码仓库成为唯一的事实来源](./lectures/lecture-03-why-the-repository-must-become-the-system-of-record/README.md)
- [Lecture 04. 把指令拆分到不同文件里](./lectures/lecture-04-why-one-giant-instruction-file-fails/README.md)
- [Lecture 05. 让跨会话的任务保持上下文连续](./lectures/lecture-05-why-long-running-tasks-lose-continuity/README.md)
- [Lecture 06. 让 agent 每次工作前先初始化](./lectures/lecture-06-why-initialization-needs-its-own-phase/README.md)
- [Lecture 07. 给 agent 划清每次任务的边界](./lectures/lecture-07-why-agents-overreach-and-under-finish/README.md)
- [Lecture 08. 用功能清单约束 agent 该做什么](./lectures/lecture-08-why-feature-lists-are-harness-primitives/README.md)
- [Lecture 09. 防止 agent 提前宣告完成](./lectures/lecture-09-why-agents-declare-victory-too-early/README.md)
- [Lecture 10. 跑通完整流程才算真正验证](./lectures/lecture-10-why-end-to-end-testing-changes-results/README.md)
- [Lecture 11. 让 agent 的运行过程可观测](./lectures/lecture-11-why-observability-belongs-inside-the-harness/README.md)
- [Lecture 12. 每次会话结束前都做好交接](./lectures/lecture-12-why-every-session-must-leave-a-clean-state/README.md)

### 项目

- [Project 01. 只写提示词让 agent 做，和定好规则再让它做，差多少](./projects/project-01-baseline-vs-minimal-harness/README.md)
- [Project 02. 让 agent 看懂项目、接住上次的工作](./projects/project-02-agent-readable-workspace/README.md)
- [Project 03. 让 agent 关掉再打开还能接着干](./projects/project-03-multi-session-continuity/README.md)
- [Project 04. 用运行反馈修正 agent 的行为](./projects/project-04-incremental-indexing/README.md)
- [Project 05. 让 agent 自己检查自己做的对不对](./projects/project-05-grounded-qa-verification/README.md)
- [Project 06. 搭建一套完整的 agent 工作环境](./projects/project-06-runtime-observability-and-debugging/README.md)

### 资料库

- [Resource Library 总览](./resources/README.md)
- [中文资料库](./resources/zh/README.md)
- [English Resource Library](./resources/en/README.md)

## 学习路径推荐

这门课按顺序来效果最好，每一阶段都建立在前一个的基础上。

**第一阶段 — 先看到问题。** 读 Lecture 01-02，做 Project 01。你会跑两次同样的任务：一次只给提示词，一次加了最基本的规则。差距一目了然。

**第二阶段 — 让项目对 agent 友好。** Lecture 03-04，Project 02。你会重组项目结构，让 agent 能读懂，并且加上跨会话的持久文件。

**第三阶段 — 让会话接得上。** Lecture 05-06，Project 03。这里开始有意思了——让 agent 在你关掉会话后重新打开，还能从上次停下的地方接着干。

**第四阶段 — 加上反馈和范围控制。** Lecture 07-08，Project 04。防止 agent 做多了或做少了，用运行反馈让它保持在正轨上。

**第五阶段 — 验证和自查。** Lecture 09-10，Project 05。让 agent 学会验证自己的工作，而不是做完就说"好了"。

**第六阶段 — 全部串起来。** Lecture 11-12，Project 06。这是 capstone。你将从零开始搭建一套完整的 harness，把前面学的全用上。

每个阶段大约一周（兼职节奏）。想快的话，前三个阶段一个周末就能跑完。

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

## 本地预览

本仓库使用 VitePress 作为文档查看器。

```sh
npm install
npm run docs:dev
```

然后在浏览器里打开 VitePress 输出的本地地址即可。

## 先修要求

必需：

- 熟悉终端、git 和本地开发环境
- 至少会读写一种常见应用栈中的代码
- 有基本的软件调试经验，知道如何看日志、测试和运行行为
- 能投入足够时间完成偏实现型的课程任务

有帮助但非强制：

- 用过 Electron、桌面应用或本地优先工具
- 有测试、日志、软件架构方面的经验
- 已经接触过 Codex、Claude Code 或类似 coding agent

## 核心参考资料

主参考：

- [OpenAI: Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)
- [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Anthropic: Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)

辅助参考：

- [LangChain: The Anatomy of an Agent Harness](https://blog.langchain.com/the-anatomy-of-an-agent-harness/)
- [Thoughtworks: Harness Engineering](https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html)
- [HumanLayer: Skill Issue: Harness Engineering for Coding Agents](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents)

## 贯穿项目

本课程的大多数 project 都围绕同一个产品展开：

- 一个基于 Electron 的个人知识库桌面应用

核心目标包括：

- 导入本地文档
- 管理文档库
- 处理与索引文档
- 对导入内容发起 AI 问答
- 返回带引用的 grounded 回答

之所以选择这个项目，是因为它同时具备：

- 很强的实际价值感
- 足够真实的产品复杂度
- 很适合观察 harness 优化前后的效果差异

## 课程作业形式

本课程包含两类内容：

- **Lectures**：12 个概念单元，每个单元只回答一个核心问题
- **Projects**：6 个实践项目，把 lecture 里的方法落实到同一个 Electron 应用上

每个 project 都要求你：

- 让 Codex 或 Claude Code 执行真实任务
- 比较弱 harness 与强 harness 的差别
- 观察可靠性、连续性、验证质量、可维护性的变化

最后一个 project 同时也是整个课程的 capstone harness。

## 课程组织方式

- 每个 lecture 聚焦一个问题
- 整门课配套 6 个 project
- 每个 project 都要求 agent 真正干活
- 每个 project 都要做弱 harness / 强 harness 对照
- 我们关心的是效果变化，而不是"写了多少说明文档"

## 仓库结构

- `lectures/` - 全部讲义
- `projects/` - 全部实践项目，包括 capstone
- `resources/` - 中英双语的可复用模板、检查清单和方法参考

每个 lecture 都带一个 `code/` 目录，用来放小型真实示例和 supporting artifacts。
