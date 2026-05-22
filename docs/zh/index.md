# 欢迎来到 Learn Interview Harness Engineering

Learn Interview Harness Engineering 是一门项目制课程：通过构建一个真实的 **Interview Debrief Coach**，学习如何让 AI 编程智能体在真实仓库里稳定、可验证、可恢复地工作。这个贯穿产品是一个本地优先的 Electron 面试复盘桌面应用，用户导入面试录音或带时间戳 transcript 后，系统会切分问题链，生成带时间戳证据的复盘报告，并给出训练建议。

课程保留 harness engineering 的教学骨架：12 个讲义、6 个实战项目、starter/solution、资源模板、功能清单、进度日志、benchmark、cleanup scanner 和 session handoff。参考资料包括：
- [OpenAI: Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)
- [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Anthropic: Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [Awesome Harness Engineering](https://github.com/walkinglabs/awesome-harness-engineering)

通过系统的环境设计、状态管理、验证与控制机制，本课程旨在帮助你让 Codex 和 Claude Code 等 AI Agent 能够真正可靠地完成真实工程任务。

安全边界：这个应用只服务于候选人的面试后复盘，不做候选人排名，不给录用/拒绝建议，不推断受保护特征，不做情绪识别、人格判断或测谎判断。

## 开始学习

选择适合你的学习路径。本课程分为理论讲义、实战项目和开箱即用的资料库。

<div class="card-grid">
  <a href="./lectures/lecture-01-why-capable-agents-still-fail/" class="card">
    <h3>讲义</h3>
    <p>理解为什么强大的模型依然会失败，掌握构建有效 Harness 的理论基础。</p>
  </a>
  <a href="./projects/" class="card">
    <h3>项目</h3>
    <p>动手实践，从零开始演进 Interview Debrief Coach 应用和它的 harness。</p>
  </a>
  <a href="./resources/" class="card">
    <h3>资料库</h3>
    <p>开箱即用的模板（AGENTS.md、feature_list.json 等），可直接复制到你自己的代码仓库中。</p>
  </a>
</div>

## Harness 的核心机制

Harness 的本质不是“让模型变聪明”，而是给模型建立一套闭环的**工作系统**。你可以通过下面的简单图示理解它的核心运作流：

```mermaid
graph TD
    A["明确目标<br/>AGENTS.md"] --> B("初始化检查<br/>init.sh")
    B --> C{"运行任务<br/>AI Agent"}
    C -->|遇到障碍| D["运行反馈<br/>CLI / Logs"]
    D -->|自动修复| C
    C -->|代码完成| E{"验证与评审<br/>Test & QA"}
    E -->|未通过| D
    E -->|通过| F["清理与交接<br/>claude-progress.md"]
    
    classDef primary fill:#D95C41,stroke:#C14E36,color:#fff,font-weight:bold;
    classDef process fill:#F4F3EE,stroke:#D1D1D1,color:#1A1A1A;
    classDef check fill:#EAE8E1,stroke:#B3B3B3,color:#1A1A1A;
    
    class A,F primary;
    class B,D process;
    class C,E check;
```

## 你将学到什么

你将在本课程中掌握以下核心概念：

<ul class="index-list">
  <li>用明确的规则和边界<strong>约束 Agent 的行为</strong>。</li>
  <li>在跨会话的长时任务中<strong>保持上下文连续性</strong>。</li>
  <li><strong>防止 Agent 提前宣告</strong>任务完成。</li>
  <li>让 Agent 学会通过完整的流水线测试来<strong>验证自己的工作</strong>。</li>
  <li>让 Agent 的运行过程<strong>可观测、可调试</strong>。</li>
  <li>构建<strong>证据可追溯的 AI 功能</strong>：每条复盘分析都能跳回 transcript 时间戳证据。</li>
</ul>

## 下一步

了解核心概念后，可以通过以下内容深入学习：

<ul class="index-list">
  <li><a href="./lectures/lecture-01-why-capable-agents-still-fail/">L01. 模型能力强，不等于执行可靠</a>：从理论开始。</li>
  <li><a href="./projects/project-01-baseline-vs-minimal-harness/">P01. 提示词 vs 规则驱动</a>：完成你的第一个对比实战任务。</li>
  <li><a href="./resources/templates/">中文模板</a>：获取最小 Harness 模板包（AGENTS.md、feature_list.json 等），直接用于你的项目。</li>
</ul>
