---
name: harness-creator
description: >-
  Harness engineering for AI coding agents — five subsystems, memory persistence,
  session continuity, verification workflows, scope control, lifecycle management.
when_to_use: >-
  Use whenever: building harness from scratch, improving agent reliability, agent forgets
  between sessions, agent overreach or scope creep, broken tests after agent work,
  multi-session continuity needed, verification gaps, audit harness quality, benchmark
  effectiveness, create AGENTS.md/CLAUDE.md, design feature tracking, session handoff.
license: MIT
---

# Harness Creator

Production harness engineering for AI coding agents.

**For:** Engineers building or extending coding-agent runtimes, custom agents, multi-session workflows, or anyone who wants their agent to work reliably across sessions.

**Not for:** Prompt engineering, model selection, generic software architecture, or one-off agent tasks.

All principles are grounded in the Learn Harness Engineering framework and production agent runtime decisions.

---

# Harness Creator（中文版）

面向 AI 编程代理的生产级 Harness 工程技能。

**适用人群：** 构建或扩展编程代理运行时、自定义代理、多会话工作流的工程师，或任何希望代理跨会话可靠工作的人。

**不适用场景：** 提示工程、模型选择、通用软件架构或一次性代理任务。

所有原则均基于 Learn Harness Engineering 框架和生产代理运行时决策。

---

## Choose Your Problem

| If you want to... | Read |
|---|---|
| Make the agent remember corrections and project rules between sessions | [Memory Persistence](references/memory-persistence-pattern.md) |
| Package reusable workflows and domain knowledge | [Skill Runtime](references/skill-runtime-pattern.md) |
| Let the agent work powerfully but not dangerously | [Tool Registry & Safety](references/tool-registry-pattern.md) |
| Give the agent the right context at the right cost | [Context Engineering](references/context-engineering-pattern.md) |
| Split work across multiple agents without chaos | [Multi-agent Coordination](references/multi-agent-pattern.md) |
| Extend behavior with hooks, background tasks, startup logic | [Lifecycle & Bootstrap](references/lifecycle-bootstrap-pattern.md) |
| Build the complete 5-subsystem harness | [Five Subsystems Guide](#the-five-subsystem-harness-framework) |

**Before you start building:** Read the [Gotchas](#gotchas) — these are the non-obvious failure modes that cost the most time.

---

## 选择你要解决的问题

| 如果你想... | 阅读 |
|---|---|
| 让代理在会话之间记住修正和项目规则 | [记忆持久化](references/memory-persistence-pattern.md) |
| 打包可重复使用的工作流和领域知识 | [技能运行时](references/skill-runtime-pattern.md) |
| 让代理强大但安全地工作 | [工具注册与安全](references/tool-registry-pattern.md) |
| 以合适的成本给代理合适的上下文 | [上下文工程](references/context-engineering-pattern.md) |
| 在多个代理之间分配工作而不混乱 | [多代理协调](references/multi-agent-pattern.md) |
| 使用 hooks、后台任务、启动逻辑扩展行为 | [生命周期与引导](references/lifecycle-bootstrap-pattern.md) |
| 构建完整的 5 子系统 harness | [五子系统指南](#the-five-subsystem-harness-framework) |

**开始构建之前：** 阅读 [陷阱](references/gotchas.md) — 这些是最耗时的非明显失败模式。

---

## The Five-Subsystem Harness Framework

**Every harness consists of five subsystems:**

1. **Instructions (Recipe Shelf)**: AGENTS.md, CLAUDE.md, docs/ hierarchy
2. **State (Prep Station)**: feature_list.json, progress.md, session-handoff.md
3. **Verification (Quality Check Window)**: Verification commands, test suites, type checks
4. **Scope (Task Boundaries)**: One-feature-at-a-time policies, definition of done
5. **Lifecycle (Session Management)**: init.sh, clean-state checklists, handoff procedures

**When creating or improving a harness, systematically address each subsystem.**

---

## Creating a Harness

### Phase 1: Context Gathering

Start by understanding the user's situation:

1. **What project is this for?** (tech stack, size, complexity)
2. **What agent tool are they using?** (Claude Code, Codex, Cursor, etc.)
3. **What exists already?** (any AGENTS.md, progress tracking, verification?)
4. **What problems are they experiencing?** (agent overreach, lost context, broken tests?)
5. **What's the team's tolerance for structure?** (minimal vs. comprehensive)

If the user hasn't provided this context, ask before proceeding.

### Phase 2: Harness Assessment (Existing Projects)

If the user has an existing harness, assess it using the five-tuple framework:

For each subsystem, score 1-5:
- **5**: Exemplary, documented, consistently followed
- **4**: Good, mostly complete, occasional gaps
- **3**: Adequate, covers basics, missing polish
- **2**: Weak, incomplete, inconsistently applied
- **1**: Missing or actively harmful

Identify the lowest-scoring subsystem — that's the bottleneck. Focus improvement efforts there first.

### Phase 3: Design

Based on the assessment, design the harness components:

**Instructions:**
- Create a short AGENTS.md (~50-100 lines) as the routing layer
- Link to detailed docs in docs/ directory (ARCHITECTURE.md, PRODUCT.md, etc.)
- Define startup workflow: what the agent reads before coding

**State:**
- Create feature_list.json with feature definitions and status tracking
- Create or update progress.md for session continuity
- Design session-handoff.md template if needed

**Verification:**
- List explicit verification commands in AGENTS.md
- Ensure init.sh runs verification
- Design quality score tracking if appropriate

**Scope:**
- Define one-feature-at-a-time policy
- Document feature dependencies
- Create definition of done checklist

**Lifecycle:**
- Create init.sh for initialization
- Design clean-state checklist
- Document session handoff procedure

### Phase 4: Implementation

Create the harness files. Use bundled scripts where available:

```bash
# Use bundled scripts from scripts/ directory
# (See scripts/ section for available tools)
```

### Phase 5: Testing and Benchmarking

Test the harness with real agent sessions:

1. **Baseline**: Run a representative task without the harness
2. **With Harness**: Run the same task with the harness
3. **Measure**: Success rate, time, token usage, rework
4. **Compare**: Quantify the improvement

For rigorous benchmarking, see the "Running Benchmarks" section below.

---

## Harness File Templates

### AGENTS.md Structure

A minimal AGENTS.md should include:

```markdown
# AGENTS.md

[One-sentence project purpose]

## Startup Workflow

Before writing code:
1. [Step 1: e.g., Read this file]
2. [Step 2: e.g., Read ARCHITECTURE.md]
3. [Step 3: e.g., Run ./init.sh]
4. [Step 4: e.g., Read feature_list.json]

## Working Rules

- [Rule 1: e.g., One feature at a time]
- [Rule 2: e.g., Verification required before claiming done]
- [Rule 3: e.g., Update progress before ending session]

## Required Artifacts

- `feature_list.json`: Feature state tracker
- `progress.md`: Session continuity log
- `init.sh`: Standard startup and verification

## Definition of Done

A feature is done when:
- [ ] Implementation complete
- [ ] Verification passed
- [ ] Evidence recorded
- [ ] Repository restartable

## End of Session

Before ending:
1. Update progress.md
2. Update feature_list.json
3. Record blockers/risks
4. Commit with descriptive message
5. Leave clean restart path
```

### feature_list.json Structure

```json
{
  "features": [
    {
      "id": "feat-001",
      "name": "Transcript Import",
      "description": "Allow users to import timestamped interview transcripts",
      "dependencies": [],
      "status": "done",
      "evidence": "tests pass, manual verification on 2024-01-15"
    },
    {
      "id": "feat-002",
      "name": "Question-Chain Segmentation",
      "description": "Split interviewer follow-ups and candidate answers into evidence-backed chains",
      "dependencies": ["feat-001"],
      "status": "in-progress",
      "evidence": ""
    }
  ]
}
```

### init.sh Structure

```bash
#!/bin/bash
set -e

echo "=== Installing dependencies ==="
npm install

echo "=== Running type check ==="
npm run check

echo "=== Running tests ==="
npm test

echo "=== Building application ==="
npm run build

echo "=== Verification complete ==="
```

---

## Running Benchmarks

To measure harness effectiveness:

### Step 1: Define Representative Tasks

Pick 2-3 tasks that are:
- Real work the user would actually do
- Challenging enough to fail without proper harness
- Verifiable (clear success criteria)

### Step 2: Run Comparative Sessions

For each task:
- **Without Harness**: Run the task on a clean repo copy
- **With Harness**: Run the same task with the harness in place

Record:
- Success/failure
- Time taken
- Token usage
- Rework required
- Session restarts needed

### Step 3: Aggregate Results

Calculate:
- Success rate improvement
- Time efficiency change
- Token efficiency change
- Qualitative feedback

### Step 4: Iterate

Use results to identify:
- Which harness components add most value
- Which components are over-engineered
- Where to focus improvement efforts

---

## Bundled Resources

### References (Deep-Dive Patterns)

| Document | Covers |
|----------|--------|
| [Memory Persistence](references/memory-persistence-pattern.md) | Four-level instruction hierarchy, auto-memory taxonomy, background extraction |
| [Context Engineering](references/context-engineering-pattern.md) | Select / Compress / Isolate / Write operations, budget management |
| [Tool Registry](references/tool-registry-pattern.md) | Fail-closed registration, per-call concurrency, permission pipeline |
| [Multi-Agent](references/multi-agent-pattern.md) | Coordinator / Fork / Swarm patterns, context sharing |
| [Lifecycle & Bootstrap](references/lifecycle-bootstrap-pattern.md) | Hook system, long-running tasks, dependency-ordered init |
| [Gotchas](references/gotchas.md) | 15 non-obvious failure modes with fixes |

### Templates

- `templates/agents.md` — AGENTS.md / CLAUDE.md skeleton
- `templates/feature-list.json` — Feature state tracker
- `templates/init.sh` — Standard initialization script
- `templates/progress.md` — Session progress log
- `templates/session-handoff.md` — Session handoff template

### Scripts (Optional)

- `scripts/create-harness.ts` — Generate harness files from templates
- `scripts/validate-harness.ts` — Check harness completeness
- `scripts/run-benchmark.ts` — Execute harness effectiveness comparison

---

## Gotchas

Non-obvious principles that will cause bugs if you violate them:

1. **Memory index caps fire silently** — Long entries invisible once cap hit. Keep hooks to one line.
2. **Priority ordering counterintuitive** — Local beats project beats user beats org. Test full stack.
3. **Extraction timing creates race window** — User can start next turn before background extraction completes.
4. **Derivable content doesn't belong in memory** — Architecture and code patterns are in the repo already.
5. **Concurrent classification is per-call, not per-tool** — Same tool safe for some inputs, unsafe for others.
6. **Permission evaluation has side effects** — Tracks denials, transforms modes, updates state.
7. **Most async work skips "pending" state** — Work units register directly as "running".
8. **Fork children must not fork** — Recursive guard preserves single-level invariant.
9. **Context builders memoized but manually invalidated** — Add invalidation or face staleness.
10. **Hook trust all-or-nothing** — One untrusted hook disables entire extension system.
11. **Eviction requires notification** — Terminal work unit only GC-eligible after parent notified.
12. **Skill listing budgets tight** — Front-load distinctive trigger language, tails get cut.

**Full guide**: [Gotchas](references/gotchas.md) — 15 failure modes with fixes.

## 陷阱（Gotchas）

违反这些非明显原则会导致 bug：

1. **记忆索引上限静默触发** — 条目过长超上限后不可见。保持钩子单行。
2. **优先级顺序反直觉** — 本地胜过项目胜过用户胜过组织。测试完整栈。
3. **提取时序产生竞争窗口** — 用户可在后台提取完成前开始下一轮。
4. **可推导内容不应存入记忆** — 架构和代码模式已在仓库中。
5. **并发分类按调用而非按工具** — 同一工具对某些输入安全，对其他不安全。
6. **权限评估有副作用** — 跟踪拒绝、转换模式、更新状态。
7. **大多数异步工作跳过"pending"状态** — 工作单元直接注册为"运行中"。
8. **Fork 子节点不能 Fork** — 递归防护保持单层不变量。
9. **上下文构建器缓存但手动失效** — 添加失效或面对过时。
10. **Hook 信任全有或全无** — 一个不可信 hook 禁用整个扩展系统。
11. **驱逐需要通知** — 终端工作单元仅在父节点通知后可 GC。
12. **Skill 列表预算紧张** — 前置独特触发语言，尾部被截断。

**完整指南**：[陷阱](references/gotchas.md) — 15 种失败模式及修复方法。

---

## When to Use This Skill

Use this skill when:

- User says "I need to set up AGENTS.md for my project"
- User wants to improve their agent's reliability
- User is experiencing agent failures, lost context, or broken work
- User asks "how do I make my agent work better?"
- User wants to benchmark harness effectiveness
- User needs templates for harness files
- User is following the Learn Harness Engineering course

---

## Communication Style

- Explain harness concepts in practical terms (kitchen analogy works well)
- Focus on measurable outcomes, not theoretical perfection
- Start minimal, add structure as needed
- Show before/after comparisons to build confidence
- Acknowledge tradeoffs (more structure = more reliability but more upfront work)

---

## Getting Started

### If the user is new to harness engineering:

1. **Start with assessment**: Run the five-tuple assessment on their current setup
2. **Pick lowest-scoring subsystem**: Focus improvement efforts there first
3. **Create minimal viable harness**: AGENTS.md + init.sh + feature_list.json
4. **Test with real task**: Measure before/after improvement

### If the user is experienced:

1. **Ask what specific problem**: Don't assume — let them describe the pain point
2. **Understand harness maturity**: What exists already? What's working?
3. **Design targeted improvements**: Use reference patterns for guidance
4. **Optionally run benchmarks**: Quantify impact with before/after comparison

---

## When NOT to Use This Skill

This skill is about the **harness** around an agent, not:
- Prompt engineering or system prompt design
- Model selection or fine-tuning
- Generic software architecture (MVC, microservices)
- Chat UIs or conversational interfaces
- LLM API integration basics

If your question is about the model itself rather than the system around it, this skill does not apply.

---

## Further Resources

- [Learn Harness Engineering Documentation](https://walkinglabs.github.io/learn-harness-engineering/)
- [OpenAI: Harness Engineering](https://openai.com/index/harness-engineering/)
- [Anthropic: Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents/)
- [Anthropic: Harness Design for Long-Running Apps](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [Awesome Harness Engineering](https://github.com/walkinglabs/awesome-harness-engineering)
- [Agentic Harness Patterns Skill](https://github.com/keli-wen/agentic-harness-patterns-skill) — Reference implementation for pattern extraction

---

## Further Resources

- [Learn Harness Engineering Documentation](https://walkinglabs.github.io/learn-harness-engineering/)
- [OpenAI: Harness Engineering](https://openai.com/index/harness-engineering/)
- [Anthropic: Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents/)
- [Awesome Harness Engineering](https://github.com/walkinglabs/awesome-harness-engineering)
