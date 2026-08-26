<p align="center">
  <a href="../../README.md"><img alt="English" src="https://img.shields.io/badge/EN-English-blue?style=flat-square"></a>
  <a href="../zh-CN/README.md"><img alt="简体中文" src="https://img.shields.io/badge/ZH-简体中文-red?style=flat-square"></a>
  <a href="../zh-TW/README.md"><img alt="繁體中文" src="https://img.shields.io/badge/ZH--TW-繁體中文-orange?style=flat-square"></a>
  <a href="../ja-JP/README.md"><img alt="日本語" src="https://img.shields.io/badge/JA-日本語-green?style=flat-square"></a>
  <a href="../ko-KR/README.md"><img alt="한국어" src="https://img.shields.io/badge/KO-한국어-blueviolet?style=flat-square"></a>
  <a href="../es-ES/README.md"><img alt="Español" src="https://img.shields.io/badge/ES-Español-yellow?style=flat-square"></a>
  <a href="../fr-FR/README.md"><img alt="Français" src="https://img.shields.io/badge/FR-Français-007EC6?style=flat-square"></a>
  <a href="../ru-RU/README.md"><img alt="Русский" src="https://img.shields.io/badge/RU-Русский-informational?style=flat-square"></a>
  <a href="../de-DE/README.md"><img alt="Deutsch" src="https://img.shields.io/badge/DE-Deutsch-2EA043?style=flat-square"></a>
  <a href="../ar-SA/README.md"><img alt="العربية" src="https://img.shields.io/badge/AR-العربية-success?style=flat-square"></a>
  <a href="../vi-VN/README.md"><img alt="Tiếng Việt" src="https://img.shields.io/badge/VI-Tiếng_Việt-cc6699?style=flat-square"></a>
  <a href="../uz-UZ/README.md"><img alt="Oʻzbekcha" src="https://img.shields.io/badge/UZ-Oʻzbekcha-1A8BBA?style=flat-square"></a>
  <a href="../tr-TR/README.md"><img alt="Türkçe" src="https://img.shields.io/badge/TR-Türkçe-E30A17?style=flat-square"></a>
  <a href="../pt-BR/README.md"><img alt="Português-BR" src="https://img.shields.io/badge/PT--BR-Português-1A8BBA?style=flat-square"></a>
  <a href="../uk-UA/README.md"><img alt="Українська" src="https://img.shields.io/badge/UK-Українська-0057B7?style=flat-square"></a>
</p>

# Learn Harness Engineering

> **一门基于项目的课程，教你构建让 AI 编程代理可靠工作的环境、状态管理、验证和控制机制。**

Learn Harness Engineering 是一门专注于 AI 编程代理工程化的课程。我们深入研究和综合了业界最先进的 Harness Engineering 理论与实践。我们的核心参考资料包括：

> **🆕 2026 年 8 月更新：前沿 Harness 拆解**——新增栏目，包含 4 篇拆解：
>
> - **新栏目** [前沿 Harness 拆解](../../docs/zh/harness-designs/index.md)——运用课程的五子系统框架（指令、工具、环境、状态、反馈），逆向拆解四款前沿产品如何构建真实的 Harness。
> - **Pi** [Pi 如何构建其 Harness](../../docs/zh/harness-designs/pi/index.md)——极简内核、可编程扩展，以及“让 Pi 构建你想要的东西”背后的上下文工程。
> - **Claude Code** [Claude Code 如何构建其 Harness](../../docs/zh/harness-designs/claude-code/index.md)——四层记忆、五级压缩、钩子和子代理隔离。
> - **Codex** [Codex 如何构建其 Harness](../../docs/zh/harness-designs/codex/index.md)——将仓库作为事实来源、将 AGENTS.md 作为目录页，以及 worktree 隔离。
> - **DeepSeek** [DeepSeek 如何构建其 Harness](../../docs/zh/harness-designs/deepseek/index.md)——“万物皆插件”、能力接缝和事件管线。
> - **全部 15 种语言**——完整覆盖所有受支持语言的翻译。
>
> **核心观点：** 课程为你提供框架；这些拆解则展示相同的原则如何在生产级 Harness 中真正落地。
>
> **🆕 2026 年 8 月更新：图工程（Graph Engineering）**——新增 1 讲 + 1 个项目：
>
> - **第十四讲** [从单循环到图工程](../../docs/zh/lectures/lecture-14-graph-engineering/index.md)：为什么单循环必然长成图——四层叠加（prompt → context → loop → graph）及 harness 在其中的位置、图的四个零件（节点、边、共享状态、路由）、为什么 loop 内的检查点救不了规模上的三种结构性失败（Goodhart、向上失明、冲突）、框架无关的六步构建你的第一张图、Graph 与 Workflow 的区别、锚、发布前 vs 发布后的开源项目现状、编排税，以及什么时候真的值得画图。
> - **项目 08** [把你的工作流画成一张图](../../docs/zh/projects/project-08-graph-engineering-first-graph/index.md)：三个递进实验——把 maker-checker loop 画成显式图、加并行 fan-out/fan-in 节点、加条件回退边和人工审批节点。
>
> **核心观点：** Loop 是只有一个节点的图。当任务需要分工、并行、共享状态、验证和恢复时——它就不再是 loop，而是图了。
>
> **🆕 2026 年 7 月更新：循环工程（Loop Engineering）**——新增 1 讲 + 1 个项目 + 代码模板：
>
> - **第十三讲** [为什么你需要停止亲自提示你的代理](../../docs/zh/lectures/lecture-13-loop-engineering/index.md)：从 `/goal` 到循环工程的六个原语（automations、worktrees、skills、connectors、sub-agents、external state）、生成器/评估器分离、四种沉默成本，以及逐步构建你的第一个循环。
> - **项目 07** [构建你的第一个自动循环](../../docs/zh/projects/project-07-loop-engineering-first-loop/index.md)：三个递进实验——目标循环、定时循环、制造者-检查者循环。对比手动 vs. 自动化、衡量干预减少、学会跳出循环。
> - **代码模板**：`goal-template.md`、`loop-state-template.md`、`maker-prompt.md`、`checker-prompt.md`——即插即用的循环构建模板。
>
> **核心观点：** Harness 工程造车。循环工程设计它行驶的道路——而你要从车外设计这条路。

- [OpenAI: Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)
- [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Anthropic: Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [Awesome Harness Engineering](https://github.com/walkinglabs/awesome-harness-engineering)

> **快速开始？** [`skills/harness-creator/`](../../skills/harness-creator/) 技能可以帮助你在几分钟内为自己的项目搭建生产级别的 Harness（AGENTS.md、功能列表、init.sh、验证工作流）。

---

## 目录

- [视觉预览](#视觉预览)
- [Harness Engineering 到底是什么意思](#harness-engineering-到底是什么意思)
- [快速开始：今天就改善你的代理](#快速开始-今天就改善你的代理)
- [毕业项目：一个真实的应用](#毕业项目-一个真实的应用)
- [学习路径](#学习路径)
- [课程大纲](#课程大纲)
- [技能](#技能)
- [其他课程](#其他课程)

---

## 视觉预览

### 课程主页
> 全面的课程大纲和核心理念介绍，为你提供清晰的学习起点。

![课程主页预览](../../docs/public/screenshots/readme/zh-home.png)

### 沉浸式讲座
> 深入剖析真实痛点，配合动手项目（如项目 01），带来沉浸式学习体验。

![课程讲座预览](../../docs/public/screenshots/readme/zh-lecture-01.png)

### 即用资源库
> 专为解决多轮 AI 代理开发中的常见问题而设计的模板和参考配置，例如上下文丢失和过早完成任务。

![资源库预览](../../docs/public/screenshots/readme/zh-resources.png)

## PDF 课程手册

本仓库包含课程内容的 PDF 构建流水线。

- 运行 `npm run pdf:build` 可在本地生成英文和中文 PDF。
- 输出文件写入 `artifacts/pdfs/` 目录。
- 如果你想刷新 README 预览图片，可运行 `npm run screenshots:readme`。
- GitHub Actions 工作流 [`release-course-pdfs.yml`](../../.github/workflows/release-course-pdfs.yml) 可以构建 PDF 并发布到 GitHub Releases。

---

## 模型很聪明，Harness 让它可靠

大多数人都曾付出过惨痛代价才认识到一个残酷的事实：**世界上最强大的模型，如果你不为它构建合适的环境，它在真正的工程任务上依然会失败。**

你可能亲身经历过。你给 Claude 或 GPT 一个仓库中的任务。开始一切顺利——读文件、写代码、看起来很高效。然后出了问题。它跳过了一个步骤。它破坏了一个测试。它说"完成了"，但实际上什么都不能用。你花在清理上的时间比自己做还多。

这不是模型的问题。这是 Harness 的问题。

证据很明确。Anthropic 做了一个对照实验：同一个模型（Opus 4.5），同一个提示词（"构建一个 2D 复古游戏编辑器"）。没有 Harness 时，它在 20 分钟内花了 9 美元，产出了一个不能用的东西。有了完整的 Harness（规划器 + 生成器 + 评估器），它在 6 小时内花了 200 美元，构建了一个你真的能玩的游戏。模型没有变。变的是 Harness。

OpenAI 在 Codex 上也报告了同样的事情：在一个良好 Harness 的仓库中，同一个模型从"不可靠"变成了"可靠"。这不是边际提升——这是质变。

**这门课程教你如何构建那个环境。**

```text
                    HARNESS 模式
                    =============

    你 --> 给出任务 --> 代理读取 harness 文件 --> 代理执行
                                                        |
                                              harness 管控每一个步骤：
                                              |
                                              +--> 指令：做什么，按什么顺序
                                              +--> 范围：一次一个功能，不越界
                                              +--> 状态：进度日志、功能列表、git 历史
                                              +--> 验证：测试、lint、类型检查、冒烟测试
                                              +--> 生命周期：开始时初始化，结束时清理状态
                                              |
                                              v
                                         代理只在验证通过时
                                         才会停止
```

---

## Harness Engineering 到底是什么意思

Harness Engineering 是围绕模型构建一个完整的工作环境，使其产生可靠的结果。它不是关于写更好的提示词。它是关于设计模型运行其中的系统。

一个 Harness 有五个子系统：

```text
    ┌─────────────────────────────────────────────────────────────────┐
    │                        HARNESS 系统                              │
    │                                                                 │
    │   ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
    │   │     指令      │  │     状态     │  │       验证           │ │
    │   │              │  │              │  │                      │ │
    │   │ AGENTS.md    │  │ progress.md  │  │ 测试 + lint          │ │
    │   │ CLAUDE.md    │  │ feature_list │  │ 类型检查             │ │
    │   │ feature_list │  │ git log      │  │ 冒烟测试             │ │
    │   │ docs/        │  │ 会话交接     │  │ 端到端流水线         │ │
    │   └──────────────┘  └──────────────┘  └──────────────────────┘ │
    │                                                                 │
    │   ┌──────────────┐  ┌──────────────────────────────────────┐   │
    │   │     范围      │  │         会话生命周期                  │   │
    │   │              │  │                                      │   │
    │   │ 一次一个功能  │  │ 开始时运行 init.sh                   │   │
    │   │ 明确完成的    │  │ 结束时执行清理检查清单               │   │
    │   │ 定义          │  │ 为下一次会话留下交接说明             │   │
    │   │              │  │ 只在安全可恢复时才提交               │   │
    │   └──────────────┘  └──────────────────────────────────────┘   │
    │                                                                 │
    └─────────────────────────────────────────────────────────────────┘

    模型决定写什么代码。
    HARNESS 管控何时、何地以及如何写。
    Harness 不会让模型更聪明。
    它让模型的输出更可靠。
```

每个子系统各司其职：

- **指令**——告诉代理做什么、按什么顺序、开始前读什么。不是一个巨大的文件，而是一个渐进式披露结构，代理按需导航。
- **状态**——追踪已完成的工作、正在进行的工作和下一步。持久化到磁盘，使下一次会话可以准确地从上次离开的地方继续。
- **验证**——只有通过的测试套件才算数。代理不能在没有可运行证据的情况下宣布完成。
- **范围**——将代理限制在一次只做一个功能。不越界。不同时做三个半成品。不重写功能列表来掩盖未完成的工作。
- **会话生命周期**——开始时初始化。结束时清理。为下一次会话留下干净的重启路径。

---

## 为什么会有这门课程

问题不是"模型能不能写代码？"它们能。问题是：**它们能否在没有持续人工监督的情况下，在真实的仓库中、跨多个会话、可靠地完成真正的工程任务？**

目前，答案是：没有 Harness 就不行。

```text
    没有 HARNESS                           有 HARNESS
    ==============                         ===========

    会话 1：代理写代码                     会话 1：代理读取指令
             代理破坏了测试                          代理运行 init.sh
             代理说"完成了"                          代理只做一个功能
             你手动修复                              代理在声明完成前先验证
                                                     代理更新进度日志
    会话 2：代理从零开始                            代理提交干净的状态
             代理不记得之前
             发生了什么                       会话 2：代理读取进度日志
             代理重做已完成的工作                       代理准确从上次离开处继续
             或者做完全不同的事情                       代理继续未完成的功能
             你再次修复                                你是审查者，不是救援者

    结果：你花的时间比                       结果：代理完成工作，
          自己做还多                                你验证结果
```

这门课程真正关心的问题：

- 哪些 Harness 设计能提高任务完成率？
- 哪些设计能减少返工和错误完成？
- 哪些机制能让长时间运行的任务稳步推进？
- 哪些结构能让系统在多次代理运行后仍然可维护？

---

## 课程内容与文档

完整的课程材料，请访问**[文档网站](https://walkinglabs.github.io/learn-harness-engineering/)**。

课程分为三个部分：

1. **讲座**：14 个概念单元，讲解 Harness Engineering 背后的理论。
2. **项目**：8 个动手项目，你将从零构建一个代理工作空间。
3. **资源库**：可直接使用的模板（`AGENTS.md`、`feature_list.json`、`init.sh` 等），今天就能用在你自己的仓库中。

---

## 快速开始：今天就改善你的代理

你不需要先读完所有 14 个讲座才能开始获得价值。如果你已经在真实项目中使用编程代理，以下是如何立刻改善它。

思路很简单：与其只写提示词，不如给你的代理一组结构化文件，定义做什么、已做了什么、以及如何验证工作。这些文件存在于你的仓库中，所以每次会话都从相同的状态开始。

```text
    你的项目根目录
    ├── AGENTS.md              <-- 代理的操作手册
    ├── CLAUDE.md              <-- （替代方案，如果你使用 Claude Code）
    ├── init.sh                <-- 运行安装 + 验证 + 启动
    ├── feature_list.json      <-- 哪些功能存在，哪些已完成
    ├── claude-progress.md     <-- 每次会话发生了什么
    └── src/                   <-- 你的实际代码
```

从[资源库](https://walkinglabs.github.io/learn-harness-engineering/en/resources/)获取入门模板，放入你的项目。就这样。四个文件，你的代理会话就会比仅靠提示词稳定得多。

---

## 毕业项目：一个真实的应用

全部八个课程项目围绕同一个产品展开：**一个基于 Electron 的个人知识库桌面应用**。

```text
    ┌─────────────────────────────────────────────────────┐
    │               知识库桌面应用                         │
    │                                                     │
    │  ┌──────────────┐  ┌──────────────────────────────┐│
    │  │  文档列表     │  │       问答面板               ││
    │  │              │  │                              ││
    │  │ doc-001.md   │  │  问：什么是 Harness Eng？    ││
    │  │ doc-002.md   │  │  答：围绕代理模型构建的       ││
    │  │ doc-003.md   │  │     环境...                  ││
    │  │ ...          │  │     [引用: doc-002.md]       ││
    │  └──────────────┘  └──────────────────────────────┘│
    │                                                     │
    │  ┌─────────────────────────────────────────────────┐│
    │  │ 状态栏：42 篇文档 | 38 篇已索引 | 上次同步 3 分钟前 ││
    │  └─────────────────────────────────────────────────┘│
    └─────────────────────────────────────────────────────┘

    核心功能：
    ├── 导入本地文档
    ├── 管理文档库
    ├── 处理和索引文档
    ├── 基于导入内容运行 AI 驱动的问答
    └── 返回带引用的有据答案
```

选择这个项目是因为它兼具实用价值、足够的真实产品复杂度，以及一个适合观察 Harness 改进前后对比的良好场景。

每个课程项目的 starter/solution 都是此 Electron 应用在相应进化阶段的完整副本。P(N+1) 的 starter 派生自 P(N) 的 solution——随着你的 Harness 技能增长，应用也在进化。

---

## 学习路径

课程按顺序设计。每个阶段建立在前一个之上。

```text
    阶段 1：看到问题                        阶段 2：结构化仓库
    =======================                 ==========================

    L01  强模型 ≠ 可靠执行                   L03  仓库作为唯一的
                                                真实来源
    L02  Harness 到底意味着什么
                                       L04  将指令分散到多个文件，
                                                而不是一个巨大文件
         |
         v                                       |
    P01  仅提示词 vs.                               v
         规则优先对比
                                               P02  代理可读的工作空间


    阶段 3：连接会话                        阶段 4：反馈与范围
    ==========================              =========================

    L05  让上下文跨会话保持活跃              L07  划清任务边界

    L06  每次代理会话前初始化                L08  功能列表作为 Harness
                                                基本单元
         |                                       |
         v                                       v
    P03  多会话连续性                          P04  运行时反馈
                                                  纠正代理行为


    阶段 5：验证                            阶段 6：整合一切
    =====================                    ============================

    L09  阻止代理过早                        L11  让代理的运行时
         宣布完成                                 可观测

    L10  完整流水线运行 =                     L12  每次会话结束时
         真正的验证                               干净交接
         |                                       |
         v                                       v
    P05  代理验证自己的工作                   P06  构建完整的 Harness
                                                （毕业项目）

    阶段 7：自动化循环
    ==========================
    L13  停止提示你的代理——
         改为设计循环
         |
         v
    P07  构建你的第一个自动循环
         （目标循环、定时循环、制造者-检查者）

    阶段 8：结构化系统
    =============================
    L14  把系统画成一张图——
         节点、边、共享状态、路由
         |
         v
    P08  把你的工作流画成一张图
         （显式图、并行 fan-out/fan-in、
          回退边、人机协同）
```

如果你是业余时间学习，每个阶段大约需要一周。如果你想加快速度，阶段 1-3 可以在一个长周末完成。

---

## 课程大纲

### 讲座——14 个概念单元，每个回答一个核心问题

*在[文档网站](https://walkinglabs.github.io/learn-harness-engineering/)上阅读每讲完整文本。*

| 讲次 | 问题 | 核心观点 |
|------|------|----------|
| [L01](../../docs/zh/lectures/lecture-01-why-capable-agents-still-fail/index.md) | 为什么强模型在真实任务上仍然会失败？ | 基准测试与真实工程之间的能力差距 |
| [L02](../../docs/zh/lectures/lecture-02-what-a-harness-actually-is/index.md) | "Harness" 到底是什么意思？ | 五个子系统：指令、状态、验证、范围、生命周期 |
| [L03](../../docs/zh/lectures/lecture-03-why-the-repository-must-become-the-system-of-record/index.md) | 为什么仓库必须是唯一的真实来源？ | 如果代理看不到它，它就不存在 |
| [L04](../../docs/zh/lectures/lecture-04-why-one-giant-instruction-file-fails/index.md) | 为什么一个巨大的指令文件会失败？ | 渐进式披露：给一张地图，不是一本百科全书 |
| [L05](../../docs/zh/lectures/lecture-05-why-long-running-tasks-lose-continuity/index.md) | 为什么长时间运行的任务会失去连续性？ | 将进度持久化到磁盘；从上次离开处继续 |
| [L06](../../docs/zh/lectures/lecture-06-why-initialization-needs-its-own-phase/index.md) | 为什么初始化需要单独的阶段？ | 在代理开始工作前验证环境是否健康 |
| [L07](../../docs/zh/lectures/lecture-07-why-agents-overreach-and-under-finish/index.md) | 为什么代理会越界和欠完成？ | 一次一个功能；明确的完成定义 |
| [L08](../../docs/zh/lectures/lecture-08-why-feature-lists-are-harness-primitives/index.md) | 为什么功能列表是 Harness 基本单元？ | 代理无法忽视的机器可读范围边界 |
| [L09](../../docs/zh/lectures/lecture-09-why-agents-declare-victory-too-early/index.md) | 为什么代理过早宣布完成？ | 验证缺口：信心 ≠ 正确 |
| [L10](../../docs/zh/lectures/lecture-10-why-end-to-end-testing-changes-results/index.md) | 为什么端到端测试能改变结果？ | 只有完整的流水线运行才算真正的验证 |
| [L11](../../docs/zh/lectures/lecture-11-why-observability-belongs-inside-the-harness/index.md) | 为什么可观测性应该属于 Harness？ | 如果你看不到代理做了什么，你就无法修复它破坏的东西 |
| [L12](../../docs/zh/lectures/lecture-12-why-every-session-must-leave-a-clean-state/index.md) | 为什么每次会话都必须留下干净的状态？ | 下一次会话的成功取决于这一次会话的清理 |

### 项目——6 个动手项目，将讲座方法应用到同一个 Electron 应用上
| [L13](../../docs/zh/lectures/lecture-13-loop-engineering/index.md) | 为什么你需要停止亲自提示你的代理？ | 从手动驱动到自动循环——目标循环、定时循环、制造者-检查者分离 |
| [L14](../../docs/zh/lectures/lecture-14-graph-engineering/index.md) | 为什么单循环会演变成图？ | 从单循环到图工程——节点、边、共享状态、路由，以及何时真正值得画图 |

### 项目——8 个动手项目，将讲座方法应用到同一个 Electron 应用上

| 项目 | 你要做什么 | Harness 机制 |
|------|-----------|--------------|
| [P01](../../docs/zh/projects/project-01-baseline-vs-minimal-harness/index.md) | 同一个任务运行两次：仅提示词 vs. 规则优先 | 最小 Harness：AGENTS.md + init.sh + feature_list.json |
| [P02](../../docs/zh/projects/project-02-agent-readable-workspace/index.md) | 重构仓库使代理可读 | 代理可读工作空间 + 持久化状态文件 |
| [P03](../../docs/zh/projects/project-03-multi-session-continuity/index.md) | 让代理从上次离开处继续 | 进度日志 + 会话交接 + 多会话连续性 |
| [P04](../../docs/zh/projects/project-04-incremental-indexing/index.md) | 阻止代理做得太多或太少 | 运行时反馈 + 范围控制 + 增量索引 |
| [P05](../../docs/zh/projects/project-05-grounded-qa-verification/index.md) | 让代理验证自己的工作 | 自验证 + 有据问答 + 基于证据的完成 |
| [P06](../../docs/zh/projects/project-06-runtime-observability-and-debugging/index.md) | 从零构建完整的 Harness（毕业项目） | 完整 Harness：所有机制 + 可观测性 + 消融实验 |
| [P07](../../docs/zh/projects/project-07-loop-engineering-first-loop/index.md) | 构建你的第一个自动循环 | 目标循环、定时循环、制造者-检查者分离、循环状态管理 |
| [P08](../../docs/zh/projects/project-08-graph-engineering-first-graph/index.md) | 把你的工作流画成一张图 | 显式的节点/边/状态/路由、并行 fan-out/fan-in、回退边、人机协同审批 |

```text
    项目演进
    =================

    P01  仅提示词 vs. 规则优先              你看到问题
     |
     v
    P02  代理可读工作空间                    你重构仓库
     |
     v
    P03  多会话连续性                        你连接会话
     |
     v
    P04  运行时反馈与范围                    你添加反馈循环
     |
     v
    P05  自验证                              你让代理检查自己
     |
     v
    P06  完整 Harness（毕业项目）             你构建完整系统
     |
     v
    P07  你的第一个自动循环                   你跳出循环
     |
     v
    P08  把你的工作流画成一张图               你把系统画成图

    每个项目的 solution 成为下一个项目的 starter。
    应用在演进。你的 Harness 技能随之增长。
```

### 资源库

- [English](https://walkinglabs.github.io/learn-harness-engineering/en/resources/) — templates, checklists, and method references
- [简体中文](https://walkinglabs.github.io/learn-harness-engineering/zh/resources/) — 中文模板、清单和方法参考
- [繁體中文](https://walkinglabs.github.io/learn-harness-engineering/zh-TW/resources/) — 繁體中文範本、清單和方法參考
- [日本語](https://walkinglabs.github.io/learn-harness-engineering/ja/resources/) — テンプレート、チェックリスト、方法リファレンス
- [한국어](https://walkinglabs.github.io/learn-harness-engineering/ko/resources/) — 템플릿, 체크리스트, 방법 참고 자료
- [Español](https://walkinglabs.github.io/learn-harness-engineering/es/resources/) — plantillas, listas de verificación y referencias
- [Français](https://walkinglabs.github.io/learn-harness-engineering/fr/resources/) — modèles, listes de contrôle et références
- [Русский](https://walkinglabs.github.io/learn-harness-engineering/ru/resources/) — шаблоны, чек-листы и справочники
- [Deutsch](https://walkinglabs.github.io/learn-harness-engineering/de/resources/) — Vorlagen, Checklisten und Referenzen
- [العربية](https://walkinglabs.github.io/learn-harness-engineering/ar/resources/) — قوالب، قوائم تحقق ومراجع
- [Tiếng Việt](https://walkinglabs.github.io/learn-harness-engineering/vi/resources/) — mẫu, danh sách kiểm tra và tài liệu tham khảo
- [Oʻzbekcha](https://walkinglabs.github.io/learn-harness-engineering/uz/resources/) — andozalar, tekshiruv roʻyxatlari va maʼlumotnomalar
- [Türkçe](https://walkinglabs.github.io/learn-harness-engineering/tr/resources/) — şablonlar, kontrol listeleri ve referanslar
- [Português (BR)](https://walkinglabs.github.io/learn-harness-engineering/pt-BR/resources/) — modelos, listas de verificação e referências de métodos

---

## 代理会话生命周期

这门课程的核心观点之一：**代理的会话应该遵循结构化的生命周期，而不是放任自流。** 如下所示：

```text
    代理会话生命周期
    ======================

    ┌──────────────────────────────────────────────────────────────────┐
    │  启动                                                           │
    │                                                                  │
    │  1. 代理读取 AGENTS.md / CLAUDE.md                              │
    │  2. 代理运行 init.sh（安装、验证、健康检查）                     │
    │  3. 代理读取 claude-progress.md（上次发生了什么）                │
    │  4. 代理读取 feature_list.json（哪些完成，哪些待做）             │
    │  5. 代理检查 git log（最近的变更）                               │
    │                                                                  │
    │  选择                                                            │
    │                                                                  │
    │  6. 代理精确选择一个未完成的功能                                 │
    │  7. 代理只做那个功能                                             │
    │                                                                  │
    │  执行                                                            │
    │                                                                  │
    │  8. 代理实现功能                                                 │
    │  9. 代理运行验证（测试、lint、类型检查）                         │
    │  10. 如果验证失败：修复并重新运行                                │
    │  11. 如果验证通过：记录证据                                      │
    │                                                                  │
    │  收尾                                                            │
    │                                                                  │
    │  12. 代理更新 claude-progress.md                                 │
    │  13. 代理更新 feature_list.json                                  │
    │  14. 代理记录仍然有问题或未验证的内容                           │
    │  15. 代理提交（仅在安全可恢复时）                                │
    │  16. 代理为下一次会话留下干净的重启路径                          │
    │                                                                  │
    └──────────────────────────────────────────────────────────────────┘

    Harness 管控这个生命周期中的每一次转换。
    模型决定每一步写什么代码。
    没有 Harness，第 9 步变成"代理说看起来没问题"。
    有了 Harness，第 9 步是"测试通过，lint 干净，类型检查通过"。
```

---

## 适合谁

本课程适合：

- 已经在使用编程代理、希望获得更好稳定性和质量的工程师
- 希望系统理解 Harness 设计的研究者或构建者
- 需要了解环境设计如何影响代理性能的技术负责人

本课程不适合：

- 寻找零代码 AI 入门的人
- 只关心提示词、不打算构建实际实现的人
- 不准备让代理在真实仓库中工作的学习者

---

## 环境要求

这是一门你需要实际运行编程代理的课程。

你至少需要以下工具之一：

- Claude Code
- Codex
- 其他支持文件编辑、命令执行和多步骤任务的 IDE 或 CLI 编程代理

本课程假设你能够：

- 打开本地仓库
- 允许代理编辑文件
- 允许代理运行命令
- 检查输出并重新运行任务

如果你没有这样的工具，你仍然可以阅读课程内容，但无法按设计完成项目。

---

## 本地预览

本仓库使用 VitePress 作为文档查看器。

```sh
npm install
npm run docs:dev        # 带热重载的开发服务器
npm run docs:build      # 生产构建
npm run docs:preview    # 预览构建后的站点
```

然后在浏览器中打开 VitePress 输出的本地 URL。

---

## 先决条件

必需：

- 熟悉终端、git 和本地开发环境
- 能够使用至少一种常见应用技术栈读写代码
- 基本的软件调试经验（阅读日志、测试和运行时行为）
- 足够的时间投入到以实现为核心的课程中

有帮助但非必需：

- 有 Electron、桌面应用或本地优先工具的经验
- 有测试、日志或软件架构方面的背景
- 之前接触过 Codex、Claude Code 或类似的编程代理

---

## 核心参考

主要参考：

- [OpenAI: Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)
- [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Anthropic: Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [OpenAI: Unrolling the Codex agent loop](https://openai.com/index/unrolling-the-codex-agent-loop/)
- [Anthropic: Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- [LangChain: Improving Deep Agents with harness engineering](https://www.langchain.com/blog/improving-deep-agents-with-harness-engineering)
- [Thoughtworks / Martin Fowler: Harness engineering for coding agent users](https://martinfowler.com/articles/harness-engineering.html)
- [Cursor: Continually improving our agent harness](https://cursor.com/blog/continually-improving-agent-harness)

完整分层参考列表请见 [`docs/zh/resources/reference/`](../../docs/zh/resources/reference/index.md)。

---

## 仓库结构

```text
learn-harness-engineering/
├── docs/                          # VitePress 文档站点
│   ├── lectures/                  # 14 个讲座（index.md + code/ 示例）
│   │   ├── lecture-01-*/
│   │   ├── lecture-02-*/
│   │   └── ... （共 14 个）
│   ├── projects/                  # 8 个项目描述
│   │   ├── project-01-*/
│   │   └── ... （共 8 个）
│   └── resources/                 # 多语言模板和参考
│       ├── en/                    # 英文模板、检查清单、指南
│       ├── zh/                    # 中文模板、检查清单、指南
│       ├── ru/                    # 俄文模板、检查清单、指南
│       └── vi/                    # 越南文模板、检查清单、指南
├── projects/
│   ├── shared/                    # 共享的 Electron + TypeScript + React 基础
│   └── project-NN/               # 每个项目的 starter/ 和 solution/ 目录
├── skills/                        # 可复用的 AI 代理技能
│   └── harness-creator/           # Harness Engineering 技能
├── package.json                   # VitePress + 开发工具
└── CLAUDE.md                      # 本仓库的 Claude Code 指令
```

---

## 课程组织方式

- 每个讲座聚焦一个问题
- 课程包含 8 个项目
- 每个项目都要求代理做真实的工作
- 每个项目都比较弱 Harness 和强 Harness 的结果
- 重要的是可测量的差异，不是写了多少文档

---

## 技能

本仓库还包含可复用的 AI 代理技能，你可以直接安装到你的 IDE 或代理工作空间中。

- [**harness-creator**](../../skills/harness-creator/)：一个帮助你在几分钟内为自己的项目搭建生产级别 Harness 的技能。

---

## 其他课程

我们的团队还创建了其他课程！欢迎查看：

[![Hands-on Modern RL](https://img.shields.io/badge/HANDS--ON_MODERN_RL-0052cc?style=for-the-badge)](https://github.com/walkinglabs/hands-on-modern-rl)

**Hands-on Modern RL**：一个开源的动手课程，从基础强化学习概念到 LLM 对齐、RLVR 和高级 Agentic 系统，架起理论与实践的桥梁。

---

## Star 历史

[![Star History Chart](https://star-history.dera.page/svg?repos=walkinglabs/learn-harness-engineering&type=date&legend=top-left)](https://star-history.dera.page/#walkinglabs/learn-harness-engineering&type=date&legend=top-left)

---

## 致谢

本课程受到 [learn-claude-code](https://github.com/shareAI-lab/learn-claude-code) 的启发并借鉴了其中的理念——那是一份从单循环到隔离自主执行的渐进式代理构建指南。
