[English](https://walkinglabs.github.io/learn-harness-engineering/en/) · [中文](https://walkinglabs.github.io/learn-harness-engineering/zh/) · [Русский](https://walkinglabs.github.io/learn-harness-engineering/ru/) · [Tiếng Việt](https://walkinglabs.github.io/learn-harness-engineering/vi/) · [한국어](https://walkinglabs.github.io/learn-harness-engineering/ko/)

# Learn Harness Engineering

> **A project-based course on building the environment, state management, verification, and control mechanisms that make AI coding agents work reliably.**

Learn Harness Engineering is a course dedicated to the engineering of AI coding agents. We have deeply studied and synthesized the most advanced Harness Engineering theories and practices in the industry. Our core references include:

- [OpenAI: Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)
- [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Anthropic: Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [Awesome Harness Engineering](https://github.com/walkinglabs/awesome-harness-engineering)

> **Quick start?** The [`skills/harness-creator/`](./skills/) skill can help you scaffold a production-grade harness (AGENTS.md, feature lists, init.sh, verification workflows) for your own project in minutes.

---

## ✨ Visual Preview

### 🏠 Course Homepage
> A comprehensive course outline and introduction to core philosophies, providing a clear path to get started.

![Course homepage preview](./docs/public/screenshots/readme/en-home.png)

### 📖 Immersive Lectures
> Deep dives into real-world pain points and hands-on projects (like Project 01) for an immersive learning experience.

![Course lecture preview](./docs/public/screenshots/readme/en-lecture-01.png)

### 🗂️ Ready-to-Use Resource Library
> Templates and reference configurations designed to solve common pitfalls in multi-turn AI agent development, such as context loss and premature task completion.

![Resource library preview](./docs/public/screenshots/readme/en-resources.png)

## PDF Coursebooks

The repository now includes a PDF build pipeline for the course content.

- Run `npm run pdf:build` to generate English and Chinese PDFs locally.
- Output files are written to `artifacts/pdfs/`.
- Run `npm run screenshots:readme` if you want to refresh the README preview images.
- GitHub Actions workflow [`release-course-pdfs.yml`](./.github/workflows/release-course-pdfs.yml) can build the PDFs and publish them to GitHub Releases.

---

## The Model Is Smart, The Harness Makes It Reliable

There's a hard truth most people learn the hard way: **the strongest model in the world will still fail on real engineering tasks if you don't build a proper environment around it.**

You've probably seen this yourself. You give Claude or GPT a task in your repo. It starts well — reads files, writes code, looks productive. Then something goes wrong. It skips a step. It breaks a test. It says "done" but nothing actually works. You spend more time cleaning up than if you'd done it yourself.

This isn't a model problem. It's a harness problem.

The evidence is clear. Anthropic ran a controlled experiment: same model (Opus 4.5), same prompt ("build a 2D retro game editor"). Without a harness, it spent $9 in 20 minutes and produced something that didn't work. With a full harness (planner + generator + evaluator), it spent $200 in 6 hours and built a game you could actually play. The model didn't change. The harness did.

OpenAI reported the same thing with Codex: in a well-harnessed repository, the same model goes from "unreliable" to "reliable." Not a marginal improvement — a qualitative shift.

**This course teaches you how to build that environment.**

```text
                    THE HARNESS PATTERN
                    ====================

    You --> give task --> Agent reads harness files --> Agent executes
                                                        |
                                              harness governs every step:
                                              |
                                              +--> Instructions: what to do, in what order
                                              +--> Scope:       one feature at a time, no overreach
                                              +--> State:       progress log, feature list, git history
                                              +--> Verification: tests, lint, type-check, smoke runs
                                              +--> Lifecycle:   init at start, clean state at end
                                              |
                                              v
                                         Agent stops only when
                                         verification passes
```

---

## What Harness Engineering Actually Means

Harness engineering is about building a complete working environment around the model so it produces reliable results. It's not about writing better prompts. It's about designing the system the model operates inside.

A harness has five subsystems:

```text
    ┌─────────────────────────────────────────────────────────────────┐
    │                        THE HARNESS                              │
    │                                                                 │
    │   ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
    │   │ Instructions  │  │    State     │  │   Verification       │ │
    │   │              │  │              │  │                      │ │
    │   │ AGENTS.md    │  │ progress.md  │  │ tests + lint         │ │
    │   │ CLAUDE.md    │  │ feature_list │  │ type-check           │ │
    │   │ feature_list │  │ git log      │  │ smoke runs           │ │
    │   │ docs/        │  │ session hand │  │ e2e pipeline         │ │
    │   └──────────────┘  └──────────────┘  └──────────────────────┘ │
    │                                                                 │
    │   ┌──────────────┐  ┌──────────────────────────────────────┐   │
    │   │    Scope     │  │         Session Lifecycle             │   │
    │   │              │  │                                      │   │
    │   │ one feature  │  │ init.sh at start                     │   │
    │   │ at a time   │  │ clean-state checklist at end          │   │
    │   │ definition   │  │ handoff note for next session        │   │
    │   │ of done      │  │ commit only when safe to resume      │   │
    │   └──────────────┘  └──────────────────────────────────────┘   │
    │                                                                 │
    └─────────────────────────────────────────────────────────────────┘

    The MODEL decides what code to write.
    The HARNESS governs when, where, and how it writes it.
    The harness doesn't make the model smarter.
    It makes the model's output reliable.
```

Each subsystem has one job:

- **Instructions** — Tell the agent what to do, in what order, and what to read before starting. Not one giant file; a progressive disclosure structure the agent navigates on demand.
- **State** — Track what's been done, what's in progress, and what's next. Persisted to disk so the next session picks up exactly where the last one left off.
- **Verification** — Only a passing test suite counts as evidence. The agent cannot declare victory without runnable proof.
- **Scope** — Constrain the agent to one feature at a time. No overreach. No half-finishing three things. No rewriting the feature list to hide unfinished work.
- **Session Lifecycle** — Initialize at the start. Clean up at the end. Leave a clean restart path for the next session.

---

## Why This Course Exists

The question isn't "can models write code?" They can. The question is: **can they reliably complete real engineering tasks inside real repositories, over multiple sessions, without constant human supervision?**

Right now, the answer is: not without a harness.

```text
    WITHOUT HARNESS                          WITH HARNESS
    ==============                          ============

    Session 1: agent writes code            Session 1: agent reads instructions
              agent breaks tests                      agent runs init.sh
              agent says "done"                       agent works on one feature
              you fix it manually                     agent verifies before claiming done
                                                       agent updates progress log
    Session 2: agent starts fresh                    agent commits clean state
              agent has no memory
              of what happened before         Session 2: agent reads progress log
              agent re-does work                       agent picks up exactly where it left off
              or does something else entirely          agent continues the unfinished feature
              you fix it again                         you review, not rescue

    Result: you spend more time                  Result: agent does the work,
            cleaning up than if you                      you verify the result
            did it yourself
```

The questions this course actually cares about:

- Which harness designs improve task completion rates?
- Which designs reduce rework and incorrect completions?
- Which mechanisms keep long-running tasks progressing steadily?
- Which structures keep the system maintainable after multiple agent runs?

---

## Course Curriculum & Documentation

For the full course materials, please visit the **[Documentation Website](https://walkinglabs.github.io/learn-harness-engineering/)**.

The curriculum is divided into three parts:

1. **Lectures**: 12 conceptual units explaining the theory behind harness engineering.
2. **Projects**: 6 hands-on projects where you build an agentic workspace from scratch.
3. **Resource Library**: Copy-ready templates (`AGENTS.md`, `feature_list.json`, `init.sh`, etc.) to use in your own repositories today.

---

## Quick Start: Improve Your Agent Today

You don't need to read all 12 lectures before you start getting value. If you're already using a coding agent on a real project, here's how to improve it right now.

The idea is simple: instead of just writing prompts, give your agent a set of structured files that define what to do, what's been done, and how to verify the work. These files live inside your repo, so every session starts from the same state.

```text
    YOUR PROJECT ROOT
    ├── AGENTS.md              <-- the agent's operating manual
    ├── CLAUDE.md              <-- (alternative, if using Claude Code)
    ├── init.sh                <-- runs install + verify + start
    ├── feature_list.json      <-- what features exist, which are done
    ├── claude-progress.md     <-- what happened each session
    └── src/                   <-- your actual code
```

Grab the starter templates from the [Resource Library](https://walkinglabs.github.io/learn-harness-engineering/en/resources/) and drop them into your project. That's it. Four files, and your agent sessions will already be significantly more stable than running on prompts alone.

---

## Capstone Project: A Real App

All six course projects revolve around the same product: **an Electron-based personal knowledge base desktop app**.

```text
    ┌─────────────────────────────────────────────────────┐
    │               Knowledge Base Desktop App            │
    │                                                     │
    │  ┌──────────────┐  ┌──────────────────────────────┐│
    │  │ Document List │  │       Q&A Panel              ││
    │  │              │  │                              ││
    │  │ doc-001.md   │  │  Q: What is harness eng?    ││
    │  │ doc-002.md   │  │  A: The environment built    ││
    │  │ doc-003.md   │  │     around an agent model... ││
    │  │ ...          │  │     [citation: doc-002.md]   ││
    │  └──────────────┘  └──────────────────────────────┘│
    │                                                     │
    │  ┌─────────────────────────────────────────────────┐│
    │  │ Status Bar: 42 docs | 38 indexed | last sync 3m ││
    │  └─────────────────────────────────────────────────┘│
    └─────────────────────────────────────────────────────┘

    Core features:
    ├── Import local documents
    ├── Manage a document library
    ├── Process and index documents
    ├── Run AI-powered Q&A over imported content
    └── Return grounded answers with citations
```

This project was chosen because it combines strong practical value, enough real-world product complexity, and a good setting for observing before/after harness improvements.

Each course project's starter/solution is a complete copy of this Electron app at that evolutionary stage. P(N+1)'s starter is derived from P(N)'s solution — the app evolves as your harness skills grow.

---

## Learning Path

The course is designed to be done in order. Each phase builds on the last.

```text
    Phase 1: SEE THE PROBLEM              Phase 2: STRUCTURE THE REPO
    ========================              ==========================

    L01  Strong models ≠ reliable         L03  Repository as single
         execution                              source of truth
    L02  What harness actually means
                                       L04  Split instructions across
         |                                   files, not one giant file
         v
    P01  Prompt-only vs.                       |
         rules-first comparison                v
                                               P02  Agent-readable workspace


    Phase 3: CONNECT SESSIONS             Phase 4: FEEDBACK & SCOPE
    ==========================           =========================

    L05  Keep context alive               L07  Draw clear task boundaries
         across sessions
                                       L08  Feature lists as harness
    L06  Initialize before every               primitives
         agent session
                                               |
         |                                     v
         v                                     P04  Runtime feedback to
    P03  Multi-session continuity                   correct agent behavior


    Phase 5: VERIFICATION                 Phase 6: PUT IT ALL TOGETHER
    =====================                 ============================

    L09  Stop agents from                 L11  Make agent's runtime
         declaring victory early               observable

    L10  Full-pipeline run =              L12  Clean handoff at end of
         real verification                      every session

         |                                     |
         v                                     v
    P05  Agent verifies its own work       P06  Build a complete harness
                                               (capstone project)
```

Each phase takes about a week if you're going part-time. If you want to go faster, phases 1–3 can be done in a long weekend.

---

## Syllabus

### Lectures — 12 conceptual units, each answering one core question

*Read the full text for each lecture on the [Documentation Website](https://walkinglabs.github.io/learn-harness-engineering/).*

| Session | Question | Core Idea |
|---------|----------|-----------|
| [L01](./docs/lectures/lecture-01-why-capable-agents-still-fail/index.md) | Why do strong models still fail on real tasks? | The capability gap between benchmarks and real engineering |
| [L02](./docs/lectures/lecture-02-what-a-harness-actually-is/index.md) | What does "harness" actually mean? | Five subsystems: instructions, state, verification, scope, lifecycle |
| [L03](./docs/lectures/lecture-03-why-the-repository-must-become-the-system-of-record/index.md) | Why must the repo be the single source of truth? | If the agent can't see it, it doesn't exist |
| [L04](./docs/lectures/lecture-04-why-one-giant-instruction-file-fails/index.md) | Why does one giant instruction file fail? | Progressive disclosure: give a map, not an encyclopedia |
| [L05](./docs/lectures/lecture-05-why-long-running-tasks-lose-continuity/index.md) | Why do long-running tasks lose continuity? | Persist progress to disk; pick up where you left off |
| [L06](./docs/lectures/lecture-06-why-initialization-needs-its-own-phase/index.md) | Why does initialization need its own phase? | Verify the environment is healthy before the agent starts work |
| [L07](./docs/lectures/lecture-07-why-agents-overreach-and-under-finish/index.md) | Why do agents overreach and under-finish? | One feature at a time; explicit definition of done |
| [L08](./docs/lectures/lecture-08-why-feature-lists-are-harness-primitives/index.md) | Why are feature lists harness primitives? | Machine-readable scope boundaries the agent can't ignore |
| [L09](./docs/lectures/lecture-09-why-agents-declare-victory-too-early/index.md) | Why do agents declare victory too early? | Verification gaps: confidence ≠ correctness |
| [L10](./docs/lectures/lecture-10-why-end-to-end-testing-changes-results/index.md) | Why does end-to-end testing change results? | Only a full-pipeline run counts as real verification |
| [L11](./docs/lectures/lecture-11-why-observability-belongs-inside-the-harness/index.md) | Why does observability belong inside the harness? | If you can't see what the agent did, you can't fix what it broke |
| [L12](./docs/lectures/lecture-12-why-every-session-must-leave-a-clean-state/index.md) | Why must every session leave a clean state? | The next session's success depends on this session's cleanup |

### Projects — 6 hands-on projects applying lecture methods to the same Electron app

| Project | What You Do | Harness Mechanism |
|---------|------------|-------------------|
| [P01](./docs/projects/project-01-baseline-vs-minimal-harness/index.md) | Run the same task twice: prompt-only vs. rules-first | Minimal harness: AGENTS.md + init.sh + feature_list.json |
| [P02](./docs/projects/project-02-agent-readable-workspace/index.md) | Restructure the repo so the agent can read it | Agent-readable workspace + persistent state files |
| [P03](./docs/projects/project-03-multi-session-continuity/index.md) | Make the agent pick up from where it left off | Progress log + session handoff + multi-session continuity |
| [P04](./docs/projects/project-04-incremental-indexing/index.md) | Stop the agent from doing too much or too little | Runtime feedback + scope control + incremental indexing |
| [P05](./docs/projects/project-05-grounded-qa-verification/index.md) | Make the agent verify its own work | Self-verification + grounded Q&A + evidence-based completion |
| [P06](./docs/projects/project-06-runtime-observability-and-debugging/index.md) | Build a complete harness from scratch (capstone) | Full harness: all mechanisms + observability + ablation study |

```text
    PROJECT EVOLUTION
    =================

    P01  Prompt-only vs. rules-first       You see the problem
     |
     v
    P02  Agent-readable workspace           You restructure the repo
     |
     v
    P03  Multi-session continuity           You connect sessions
     |
     v
    P04  Runtime feedback & scope           You add feedback loops
     |
     v
    P05  Self-verification                  You make the agent check itself
     |
     v
    P06  Complete harness (capstone)        You build the full system

    Each project's solution becomes the next project's starter.
    The app evolves. Your harness skills grow with it.
```

### Resource Library

- [English Resource Library](https://walkinglabs.github.io/learn-harness-engineering/en/resources/) — templates, checklists, and method references
- [Chinese Resource Library](https://walkinglabs.github.io/learn-harness-engineering/zh/resources/) — 中文模板、清单和方法参考
- [Russian Resource Library](https://walkinglabs.github.io/learn-harness-engineering/ru/resources/) — шаблоны, чек-листы и справочники
- [Vietnamese Resource Library](https://walkinglabs.github.io/learn-harness-engineering/vi/resources/) — mẫu, danh sách kiểm tra và tài liệu tham khảo

---

## The Agent Session Lifecycle

One of the core ideas in this course: **the agent's session should follow a structured lifecycle, not a free-for-all.** Here's what that looks like:

```text
    AGENT SESSION LIFECYCLE
    ======================

    ┌──────────────────────────────────────────────────────────────────┐
    │  START                                                          │
    │                                                                  │
    │  1. Agent reads AGENTS.md / CLAUDE.md                           │
    │  2. Agent runs init.sh (install, verify, health check)          │
    │  3. Agent reads claude-progress.md (what happened last time)    │
    │  4. Agent reads feature_list.json (what's done, what's next)    │
    │  5. Agent checks git log (recent changes)                       │
    │                                                                  │
    │  SELECT                                                          │
    │                                                                  │
    │  6. Agent picks exactly ONE unfinished feature                   │
    │  7. Agent works only on that feature                             │
    │                                                                  │
    │  EXECUTE                                                         │
    │                                                                  │
    │  8. Agent implements the feature                                 │
    │  9. Agent runs verification (tests, lint, type-check)           │
    │  10. If verification fails: fix and re-run                      │
    │  11. If verification passes: record evidence                    │
    │                                                                  │
    │  WRAP UP                                                         │
    │                                                                  │
    │  12. Agent updates claude-progress.md                           │
    │  13. Agent updates feature_list.json                            │
    │  14. Agent records what's still broken or unverified            │
    │  15. Agent commits (only when safe to resume)                   │
    │  16. Agent leaves clean restart path for next session           │
    │                                                                  │
    └──────────────────────────────────────────────────────────────────┘

    The harness governs every transition in this lifecycle.
    The model decides what code to write at each step.
    Without the harness, step 9 becomes "agent says it looks fine."
    With the harness, step 9 is "tests pass, lint is clean, types check."
```

---

## Who This Is For

This course is for:

- Engineers already using coding agents who want better stability and quality
- Researchers or builders who want a systematic understanding of harness design
- Tech leads who need to understand how environment design affects agent performance

This course is not for:

- People looking for a zero-code AI introduction
- People who only care about prompts and don't plan to build real implementations
- Learners not prepared to let agents work inside real repositories

---

## Requirements

This is a course where you actually run coding agents.

You need at least one of these tools:

- Claude Code
- Codex
- Another IDE or CLI coding agent that supports file editing, command execution, and multi-step tasks

The course assumes you can:

- Open a local repository
- Allow the agent to edit files
- Allow the agent to run commands
- Inspect output and re-run tasks

If you don't have such a tool, you can still read the course content, but you won't be able to complete the projects as intended.

---

## Local Preview

This repository uses VitePress as a documentation viewer.

```sh
npm install
npm run docs:dev        # Dev server with hot reload
npm run docs:build      # Production build
npm run docs:preview    # Preview built site
```

Then open the local URL that VitePress outputs in your browser.

---

## Prerequisites

Required:

- Familiarity with the terminal, git, and local development environments
- Ability to read and write code in at least one common application stack
- Basic software debugging experience (reading logs, tests, and runtime behavior)
- Enough time to commit to implementation-focused coursework

Helpful but not required:

- Experience with Electron, desktop apps, or local-first tools
- Background in testing, logging, or software architecture
- Prior exposure to Codex, Claude Code, or similar coding agents

---

## Core References

Primary:

- [OpenAI: Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)
- [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Anthropic: Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)

Supplementary:

- [LangChain: The Anatomy of an Agent Harness](https://blog.langchain.com/the-anatomy-of-an-agent-harness/)
- [Thoughtworks: Harness Engineering](https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html)
- [HumanLayer: Skill Issue: Harness Engineering for Coding Agents](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents)

---

## Repository Structure

```text
learn-harness-engineering/
├── docs/                          # VitePress documentation site
│   ├── lectures/                  # 12 lectures (index.md + code/ examples)
│   │   ├── lecture-01-*/
│   │   ├── lecture-02-*/
│   │   └── ... (12 total)
│   ├── projects/                  # 6 project descriptions
│   │   ├── project-01-*/
│   │   └── ... (6 total)
│   └── resources/                 # Multilingual templates & references
│       ├── en/                    # English templates, checklists, guides
│       ├── zh/                    # Chinese templates, checklists, guides
│       ├── ru/                    # Russian templates, checklists, guides
│       └── vi/                    # Vietnamese templates, checklists, guides
├── projects/
│   ├── shared/                    # Shared Electron + TypeScript + React foundation
│   └── project-NN/               # Per-project starter/ and solution/ directories
├── skills/                        # Reusable AI agent skills
│   └── harness-creator/           # Harness engineering skill
├── package.json                   # VitePress + dev tooling
└── CLAUDE.md                      # Claude Code instructions for this repo
```

---

## How the Course Is Organized

- Each lecture focuses on one question
- The course includes 6 projects
- Every project requires the agent to do real work
- Every project compares weak vs. strong harness results
- What matters is the measured difference, not how many docs were written

---

## Acknowledgments

This course was inspired by and draws ideas from [learn-claude-code](https://github.com/shareAI-lab/learn-claude-code) — a progressive guide to building an agent from scratch, from a single loop to isolated autonomous execution.
