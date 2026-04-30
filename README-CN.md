[English](https://walkinglabs.github.io/learn-harness-engineering/en/) · [中文](https://walkinglabs.github.io/learn-harness-engineering/zh/) · [Русский](https://walkinglabs.github.io/learn-harness-engineering/ru/) · [Tiếng Việt](https://walkinglabs.github.io/learn-harness-engineering/vi/) · [한국어](https://walkinglabs.github.io/learn-harness-engineering/ko/)

# Learn Harness Engineering

> **这是一门项目制课程：系统学习如何通过环境、状态、验证与控制机制，让 AI 编程智能体（Coding Agents）更可靠地工作。**

Learn Harness Engineering 是一门专注于 AI 编程智能体工程化落地的课程。本课程深度研究并总结了业内最前沿的 Harness Engineering（工具马具/脚手架工程）理论与实践，参考资料包括：

- [OpenAI: Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)
- [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Anthropic: Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [Awesome Harness Engineering](https://github.com/walkinglabs/awesome-harness-engineering)

[**官方网站及文档 (English & 中文)**](https://walkinglabs.github.io/learn-harness-engineering/) | [**English README**](./README.md)

> **快速上手？** [`skills/harness-creator/`](./skills/) 技能可以帮你在几分钟内为自己的项目搭建一套生产级的 harness（AGENTS.md、功能清单、init.sh、验证工作流）。

---

## ✨ 界面速览

### 🏠 课程主页
> 包含完整的课程大纲与核心理念介绍，清晰的学习路径助你快速入门。

![课程主页预览](./docs/public/screenshots/readme/zh-home.png)

### 📖 沉浸式讲义
> 结合真实痛点与实战项目（如 Project 01）的深度解析，提供沉浸式的阅读与学习体验。

![课程讲义预览](./docs/public/screenshots/readme/zh-lecture-01.png)

### 🗂️ 开箱即用的资料库
> 整理了可直接复用的中文模板与参考配置，专治 AI Agent 在多轮开发中的“做一半停下”、“上下文断裂”等疑难杂症。

![扩展资料库预览](./docs/public/screenshots/readme/zh-resources.png)

## PDF 构建与 Release 流水线

仓库里现在已经补上了课程 PDF 的构建链路。

- 本地执行 `npm run pdf:build`，会生成中英文两份课程 PDF。
- 输出目录是 `artifacts/pdfs/`。
- 如果需要刷新 README 里的截图，执行 `npm run screenshots:readme`。
- GitHub Actions 工作流 [`release-course-pdfs.yml`](./.github/workflows/release-course-pdfs.yml) 可以自动构建 PDF，并把产物上传到 GitHub Release。

---

## 模型很强，但 Harness 让它靠谱

有一个很多人交过学费才明白的事实：**世界上最强的模型，如果没有一个合适的工作环境，依然会在真实工程任务中翻车。**

你多半见过这种情况。你给 Claude 或 GPT 一个任务，它看起来干得不错——读文件、写代码、很努力。然后出问题了。它跳过了一个步骤。它搞坏了一个测试。它说"完成了"但实际上什么都没跑通。你花在收拾烂摊子上的时间比自己做还多。

这不是模型的问题，这是 harness 的问题。

证据很明确。Anthropic 做过一组对照实验：同一个模型（Opus 4.5），同一段提示词（"做一个 2D 复古游戏编辑器"）。没有 harness 的情况下，20 分钟花了 $9，结果游戏核心功能跑不起来。加上完整 harness（planner + generator + evaluator 三 agent 架构），6 小时花了 $200，做出来的游戏可以正常游玩。模型没换，换的是 harness。

OpenAI 用 Codex 也得出了同样结论：在一个 harness 搭得好的仓库里，同一个模型从"不可靠"变成"可靠"——不是"好了一点"，是质变。

**这门课教你怎么搭建那个环境。**

```text
                       HARNESS 模式
                       ============

    你 --> 给出任务 --> agent 读取 harness 文件 --> agent 开始执行
                                                    |
                                          harness 管控每一步：
                                          |
                                          +--> 指令：做什么、按什么顺序
                                          +--> 范围：一次一个功能，不越界
                                          +--> 状态：进度日志、功能清单、git 历史
                                          +--> 验证：测试、lint、类型检查、冒烟测试
                                          +--> 周期：开工时初始化，结束时留交接
                                          |
                                          v
                                     agent 只在验证通过后
                                     才会停下来
```

---

## Harness Engineering 到底是什么

Harness engineering 是围绕模型搭建一整套工作环境，让它产出可靠的结果。不只是写更好的提示词，而是设计模型运行所在的系统。

一个 harness 包含五个子系统：

```text
    ┌─────────────────────────────────────────────────────────────────┐
    │                          HARNESS                                │
    │                                                                 │
    │   ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
    │   │    指令       │  │     状态     │  │       验证           │ │
    │   │              │  │              │  │                      │ │
    │   │ AGENTS.md    │  │ progress.md  │  │ tests + lint         │ │
    │   │ CLAUDE.md    │  │ feature_list │  │ type-check           │ │
    │   │ feature_list │  │ git log      │  │ smoke runs           │ │
    │   │ docs/        │  │ session hand │  │ e2e pipeline         │ │
    │   └──────────────┘  └──────────────┘  └──────────────────────┘ │
    │                                                                 │
    │   ┌──────────────┐  ┌──────────────────────────────────────┐   │
    │   │     范围      │  │          会话生命周期                 │   │
    │   │              │  │                                      │   │
    │   │ 一次一个     │  │ 开工时跑 init.sh                    │   │
    │   │ 功能         │  │ 结束时跑清理检查清单                │   │
    │   │ 显式的完成   │  │ 给下次会话留交接笔记                │   │
    │   │ 定义         │  │ 只在可以安全恢复时才 commit         │   │
    │   └──────────────┘  └──────────────────────────────────────┘   │
    │                                                                 │
    └─────────────────────────────────────────────────────────────────┘

    模型决定写什么代码。
    Harness 管控什么时候写、在哪里写、怎么写。
    Harness 不会让模型变聪明。
    它让模型的产出变可靠。
```

每个子系统各司其职：

- **指令** — 告诉 agent 做什么、按什么顺序、开工前先读什么。不是一个巨大的文件，而是渐进式展开的结构，agent 按需导航。
- **状态** — 跟踪做了什么、正在做什么、下一步是什么。持久化到磁盘，下次会话从上次停下的地方继续。
- **验证** — 只有通过的测试套件才算数。agent 不能没有可运行的证据就说"做完了"。
- **范围** — 约束 agent 一次只做一个功能。不多做，不少做，不偷偷改功能清单掩盖未完成的工作。
- **会话生命周期** — 开始时初始化，结束时清理，给下次会话留一条干净的重启路径。

---

## 为什么要有这门课

问题不是"模型能不能写代码"。能写。问题是：**能不能在真实的仓库里，跨越多次会话，不需要人一直盯着，就可靠地完成真实的工程任务？**

现在的答案是：没有 harness 就不行。

```text
    没有 HARNESS                            有 HARNESS
    ==============                          ===========

    会话 1: agent 写代码                     会话 1: agent 读指令
            agent 搞坏测试                           agent 跑 init.sh
            agent 说"做完了"                         agent 一次只做一个功能
            你手动修复                                agent 验证后才说完成
                                                      agent 更新进度日志
    会话 2: agent 从头开始                           agent 干净地 commit
            agent 没有上次
            的记忆                            会话 2: agent 读进度日志
            agent 重新做一遍                           agent 从上次停下的地方继续
            或者做了完全不同的东西                      agent 继续未完成的功能
            你再修一次                                 你是审查，不是救火

    结果：你花的时间比                      结果：agent 干活，
          自己做还多                                你验证结果
```

课程真正关心的问题：

- 哪些 harness 设计会提升任务完成率？
- 哪些设计会减少返工和错误完成？
- 哪些机制能让长时任务更稳定地持续推进？
- 哪些结构能让系统在多轮 agent 运行后仍然可维护？

---

## 课程大纲与文档

关于完整的课程内容，请直接访问 **[官方文档站点 (VitePress)](https://walkinglabs.github.io/learn-harness-engineering/zh/)**。

本课程分为三个主要部分：

1. **讲义 (Lectures)**：12 个概念单元，深度解析 Harness 设计的理论基础。
2. **项目 (Projects)**：6 个循序渐进的实战项目，带你从零开始搭建可靠的 Agent 工作环境。
3. **资料库 (Resource Library)**：开箱即用的中英文模板（如 `AGENTS.md`、`feature_list.json`、`init.sh`），今天就可以直接复制到你自己的项目中使用。

---

## 快速开始：今天就能改善你的 agent

不用读完 12 个讲义再动手。如果你已经在用 coding agent 做项目，下面这些能立刻改善效果。

思路很简单：不是光写提示词，而是在仓库里放一组结构化的文件——告诉 agent 该做什么、做完了什么、怎么验证。这些文件就放在项目里，每次会话都从同一个状态开始。

```text
    你的项目根目录
    ├── AGENTS.md              <-- agent 的操作手册
    ├── CLAUDE.md              <-- （备选，如果你用 Claude Code）
    ├── init.sh                <-- 一条命令完成安装 + 验证 + 启动
    ├── feature_list.json      <-- 有哪些功能、哪些已完成
    ├── claude-progress.md     <-- 每次会话做了什么
    └── src/                   <-- 你的代码
```

**第一步.** 直接前往 [资料库](https://walkinglabs.github.io/learn-harness-engineering/zh/resources/) 拿到上述文件的模板代码，然后放进你的项目根目录。

就这么简单。四个文件，最小起步就够了。你的 Agent 表现会比光靠一段提示词稳定得多。

---

## 贯穿项目：一个真实的应用

全部 6 个课程项目都围绕同一个产品：**一个基于 Electron 的个人知识库桌面应用**。

```text
    ┌─────────────────────────────────────────────────────┐
    │                知识库桌面应用                         │
    │                                                     │
    │  ┌──────────────┐  ┌──────────────────────────────┐│
    │  │  文档列表     │  │        问答面板              ││
    │  │              │  │                              ││
    │  │ doc-001.md   │  │  问：什么是 harness eng？    ││
    │  │ doc-002.md   │  │  答：围绕 agent 模型搭建的   ││
    │  │ doc-003.md   │  │      工作环境...             ││
    │  │ ...          │  │      [引用：doc-002.md]      ││
    │  └──────────────┘  └──────────────────────────────┘│
    │                                                     │
    │  ┌─────────────────────────────────────────────────┐│
    │  │ 状态栏：42 篇文档 | 38 篇已索引 | 上次同步 3分钟 ││
    │  └─────────────────────────────────────────────────┘│
    └─────────────────────────────────────────────────────┘

    核心功能：
    ├── 导入本地文档
    ├── 管理文档库
    ├── 处理与索引文档
    ├── 对导入内容发起 AI 问答
    └── 返回带引用且可追溯的回答
```

选择这个项目是因为它同时具备：很强的实际价值感、足够真实的产品复杂度、以及很适合观察 harness 优化前后的效果差异。

每个课程项目的 starter/solution 是这个 Electron 应用在对应演化阶段的完整副本。P(N+1) 的 starter 从 P(N) 的 solution 衍生而来——应用跟着你的 harness 技能一起进化。

---

## 学习路径

这门课按顺序来效果最好，每一阶段都建立在前一个的基础上。

```text
    阶段 1：看到问题                         阶段 2：组织仓库
    ===================                     ===================

    L01  模型强 ≠ 执行可靠                   L03  仓库作为唯一
                                                     事实来源
    L02  Harness 到底是什么
                                           L04  把指令拆分到
         |                                      不同文件里
         v
    P01  只写提示词                                |
         vs 定好规则                                v
                                                   P02  agent 可读的工作空间


    阶段 3：连接会话                         阶段 4：反馈与范围
    ===================                     ===================

    L05  让跨会话任务                         L07  划清任务边界
         保持连续
                                           L08  功能清单作为
    L06  每次开工前                               harness 原语
         先初始化
                                                 |
         |                                       v
         v                                       P04  运行反馈修正
    P03  多会话连续性                                  agent 行为


    阶段 5：验证                             阶段 6：全部串起来
    ===================                     ===================

    L09  防止 agent 提前                     L11  让 agent 运行
         宣告完成                                   过程可观测

    L10  跑通完整流程                        L12  每次会话结束
         才算真的验证                               前做好交接

         |                                       |
         v                                       v
    P05  agent 自己验证工作                    P06  搭建完整 harness
                                                   （综合项目）
```

每个阶段大约一周（兼职节奏）。想快的话，前三个阶段一个周末就能跑完。

---

## 课程大纲

### 讲义 — 12 个概念单元，每个只回答一个核心问题

*点击访问 [文档站点](https://walkinglabs.github.io/learn-harness-engineering/zh/) 阅读全部讲义。*

| 讲义 | 核心问题 | 关键概念 |
| ---- | -------- | -------- |
| [L01](./docs/zh/lectures/lecture-01-why-capable-agents-still-fail/index.md) | 模型能力强，不等于执行可靠 | 基准测试与真实工程之间的能力鸿沟 |
| [L02](./docs/zh/lectures/lecture-02-what-a-harness-actually-is/index.md) | Harness 到底是什么 | 五个子系统：指令、状态、验证、范围、生命周期 |
| [L03](./docs/zh/lectures/lecture-03-why-the-repository-must-become-the-system-of-record/index.md) | 让仓库成为唯一事实来源 | agent 看不到的东西，对它来说就不存在 |
| [L04](./docs/zh/lectures/lecture-04-why-one-giant-instruction-file-fails/index.md) | 为什么一个巨大的指令文件会失败 | 渐进式展开：给地图，不给百科全书 |
| [L05](./docs/zh/lectures/lecture-05-why-long-running-tasks-lose-continuity/index.md) | 为什么长时任务会丢失上下文 | 把进度持久化到磁盘，从停下的地方继续 |
| [L06](./docs/zh/lectures/lecture-06-why-initialization-needs-its-own-phase/index.md) | 为什么初始化需要单独一个阶段 | agent 开始工作前先验证环境是否健康 |
| [L07](./docs/zh/lectures/lecture-07-why-agents-overreach-and-under-finish/index.md) | 为什么 agent 会多做或少做 | 一次一个功能，显式的完成定义 |
| [L08](./docs/zh/lectures/lecture-08-why-feature-lists-are-harness-primitives/index.md) | 为什么功能清单是 harness 原语 | 机器可读的范围边界，agent 无法忽略 |
| [L09](./docs/zh/lectures/lecture-09-why-agents-declare-victory-too-early/index.md) | 为什么 agent 会提前宣告完成 | 验证缺口：自信 ≠ 正确 |
| [L10](./docs/zh/lectures/lecture-10-why-end-to-end-testing-changes-results/index.md) | 为什么端到端测试会改变结果 | 只有跑通完整流程才算真正验证 |
| [L11](./docs/zh/lectures/lecture-11-why-observability-belongs-inside-the-harness/index.md) | 为什么可观测性属于 harness | 看不到 agent 做了什么，就修不了它搞坏的东西 |
| [L12](./docs/zh/lectures/lecture-12-why-every-session-must-leave-a-clean-state/index.md) | 为什么每次会话都要留干净状态 | 下次会话的成功，取决于这次会话的清理 |

### 项目 — 6 个实践项目，把讲义方法落实到同一个 Electron 应用上

| 项目 | 你要做什么 | Harness 机制 |
| ---- | ---------- | ------------ |
| [P01](./docs/zh/projects/project-01-baseline-vs-minimal-harness/index.md) | 跑两次同样的任务：只写提示词 vs 定好规则 | 最小 harness：AGENTS.md + init.sh + feature_list.json |
| [P02](./docs/zh/projects/project-02-agent-readable-workspace/index.md) | 重组项目结构，让 agent 能读懂 | agent 可读的工作空间 + 持久化状态文件 |
| [P03](./docs/zh/projects/project-03-multi-session-continuity/index.md) | 让 agent 关掉再打开还能接着干 | 进度日志 + 会话交接 + 多会话连续性 |
| [P04](./docs/zh/projects/project-04-incremental-indexing/index.md) | 防止 agent 做多了或做少了 | 运行反馈 + 范围控制 + 增量索引 |
| [P05](./docs/zh/projects/project-05-grounded-qa-verification/index.md) | 让 agent 自己验证自己的工作 | 自验证 + 带引用的问答 + 基于证据的完成判定 |
| [P06](./docs/zh/projects/project-06-runtime-observability-and-debugging/index.md) | 从零搭建一套完整的 harness（综合项目） | 完整 harness：全部机制 + 可观测性 + 消融实验 |

```text
    项目演进
    ========

    P01  只写提示词 vs 定好规则            你看到问题
     |
     v
    P02  agent 可读的工作空间               你重组仓库
     |
     v
    P03  多会话连续性                       你连接会话
     |
     v
    P04  运行反馈与范围控制                  你加上反馈循环
     |
     v
    P05  自验证                             你让 agent 检查自己
     |
     v
    P06  完整 harness（综合项目）            你搭建完整系统

    每个项目的 solution 成为下一个项目的 starter。
    应用跟着你的 harness 技能一起进化。
```

### 资料库

- [中文资料库](https://walkinglabs.github.io/learn-harness-engineering/zh/resources/) — 中文模板、清单和方法参考
- [英文资料库](https://walkinglabs.github.io/learn-harness-engineering/en/resources/) — English templates, checklists, and method references

---

## Agent 会话生命周期

这门课的一个核心理念：**agent 的会话应该遵循结构化的生命周期，而不是自由发挥。** 它长这样：

```text
    AGENT 会话生命周期
    =================

    ┌──────────────────────────────────────────────────────────────────┐
    │  开工                                                           │
    │                                                                  │
    │  1. agent 读取 AGENTS.md / CLAUDE.md                            │
    │  2. agent 运行 init.sh（安装、验证、健康检查）                   │
    │  3. agent 读取 claude-progress.md（上次做了什么）               │
    │  4. agent 读取 feature_list.json（做完哪些、接下来做哪个）      │
    │  5. agent 检查 git log（最近的改动）                             │
    │                                                                  │
    │  选择                                                            │
    │                                                                  │
    │  6. agent 选定且只选一个未完成的功能                              │
    │  7. agent 只做这一个功能                                         │
    │                                                                  │
    │  执行                                                            │
    │                                                                  │
    │  8. agent 实现这个功能                                           │
    │  9. agent 运行验证（测试、lint、类型检查）                       │
    │  10. 如果验证失败：修复后重跑                                    │
    │  11. 如果验证通过：记录证据                                      │
    │                                                                  │
    │  收尾                                                            │
    │                                                                  │
    │  12. agent 更新 claude-progress.md                               │
    │  13. agent 更新 feature_list.json                                │
    │  14. agent 记录还没做完和还没验证的东西                          │
    │  15. agent commit（只在可以安全恢复时）                           │
    │  16. agent 给下次会话留干净的重启路径                            │
    │                                                                  │
    └──────────────────────────────────────────────────────────────────┘

    Harness 管控这个生命周期里的每一次状态转换。
    模型决定每一步写什么代码。
    没有 harness 时，第 9 步变成"agent 说看起来没问题"。
    有 harness 时，第 9 步是"测试通过、lint 干净、类型检查通过"。
```

---

## 适合谁

这门课适合：

- 已经在使用 coding agent、希望提升稳定性和质量的工程师
- 想系统理解 harness 设计的研究者或构建者
- 需要理解"环境设计如何影响 agent 表现"的技术负责人

这门课不适合：

- 只想要一个零代码 AI 入门的人
- 只关心 prompt，而不打算做真实实现的人
- 不准备让 agent 在真实仓库里工作的学习者

---

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

如果你没有这类工具，仍然可以阅读课程内容，但无法按预期完成课程项目。

---

## 本地预览

本仓库使用 VitePress 作为文档查看器。

```sh
npm install
npm run docs:dev        # 开发服务器（热更新）
npm run docs:build      # 生产构建
npm run docs:preview    # 预览构建结果
```

然后在浏览器里打开 VitePress 输出的本地地址即可。

---

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

---

## 核心参考资料

主参考：

- [OpenAI: Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)
- [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Anthropic: Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)

辅助参考：

- [LangChain: The Anatomy of an Agent Harness](https://blog.langchain.com/the-anatomy-of-an-agent-harness/)
- [Thoughtworks: Harness Engineering](https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html)
- [HumanLayer: Skill Issue: Harness Engineering for Coding Agents](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents)

---

## 仓库结构

```text
learn-harness-engineering/
├── docs/                          # VitePress 文档站
│   ├── index.md                   # 语言选择页（中文 / English）
│   ├── zh/                        # 中文完整内容
│   │   ├── lectures/              # 12 个讲义（index.md + code/ 示例）
│   │   ├── projects/              # 6 个项目
│   │   └── resources/             # 模板、参考、高级资源包
│   └── en/                        # 英文完整内容
│       ├── lectures/              # 12 lectures
│       ├── projects/              # 6 projects
│       └── resources/             # templates, references, advanced pack
├── projects/
│   ├── shared/                    # Electron + TypeScript + React 共享基础
│   └── project-NN/               # 每个项目的 starter/ 和 solution/
├── skills/                        # 可复用的 AI agent 技能
│   └── harness-creator/           # Harness 工程技能
├── package.json                   # VitePress + 开发工具
└── CLAUDE.md                      # Claude Code 指令文件
```

---

## 课程组织方式

- 每个讲义聚焦一个问题
- 整门课配套 6 个项目
- 每个项目都要求 agent 真正干活
- 每个项目都要做弱 harness / 强 harness 对照
- 我们关心的是效果变化，而不是"写了多少说明文档"

---

## 致谢

本课程的灵感和部分思路来自 [learn-claude-code](https://github.com/shareAI-lab/learn-claude-code) —— 一个从零开始搭建 agent 的渐进式教程，从单个循环到隔离的自主执行。
