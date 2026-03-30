# Learn Harness Engineering

> A project-based course on building the environment, state management, verification, and control mechanisms that make Codex and Claude Code work more reliably.

This course is a work in progress. Content may change as it evolves.

[中文版本](./README-CN.md)

## Overview

Harness engineering is about building a complete working environment around the model so it produces reliable results. It's not just about writing prompts. It also covers:

- Where code lives and how it's organized
- What the agent is and isn't allowed to do
- How to track task progress and pick up where you left off
- How to verify that work was done correctly
- How to diagnose problems when they arise
- What rules must always be followed
- How to leave things clean after each session

This course is **hands-on**. We won't stop at concepts. You'll have Codex or Claude Code work repeatedly on the same evolving Electron application, comparing weak harnesses against strong ones.

The questions this course actually cares about:

- Which harness designs improve task completion rates?
- Which designs reduce rework and incorrect completions?
- Which mechanisms keep long-running tasks progressing steadily?
- Which structures keep the system maintainable after multiple agent runs?

## Core Thesis

When you let models do work, the human's job is to define the rules and boundaries. That's the harness.

**The key point:** Models are powerful, but that doesn't mean they can reliably complete real engineering tasks on their own. They need explicit rules to constrain their scope, clear handoff mechanisms to maintain continuity across long tasks, and verification methods to confirm they did the work correctly.

We're not trying to "make the model smarter." We're studying how to build a reliable working environment around the model so the same model produces more reliable output.

## Quick Start

You don't need to read all 12 lectures before you start getting value from this course. If you're already using a coding agent on a real project, here's how to improve it right now.

The idea is simple: instead of just writing prompts, give your agent a set of structured files that define what to do, what's been done, and how to verify the work. These files live inside your repo, so every session starts from the same state.

**Step 1.** Copy the root instruction file into your project root:

- [`AGENTS.md`](./resources/en/templates/AGENTS.md) for most agents, or [`CLAUDE.md`](./resources/en/templates/CLAUDE.md) if you're using Claude Code
- Edit the commands, paths, and rules to match your project

**Step 2.** Copy the startup script:

- [`init.sh`](./resources/en/templates/init.sh) — runs dependency install, verification, and startup in one shot
- Replace the `INSTALL_CMD`, `VERIFY_CMD`, and `START_CMD` with your actual commands

**Step 3.** Copy the progress log:

- [`claude-progress.md`](./resources/en/templates/claude-progress.md) — records what was done each session, what's verified, and what's next
- The agent reads this at the start of every session to pick up where it left off

**Step 4.** Copy the feature list:

- [`feature_list.json`](./resources/en/templates/feature_list.json) — a machine-readable list of features with status, verification steps, and evidence
- Replace the example features with your own

That's it for the minimum setup. Four files, and your agent sessions will already be more stable than running on prompts alone.

When your project gets more complex, add these:

- [`session-handoff.md`](./resources/en/templates/session-handoff.md) — compact handoff note between sessions
- [`clean-state-checklist.md`](./resources/en/templates/clean-state-checklist.md) — checklist to run before ending each session
- [`evaluator-rubric.md`](./resources/en/templates/evaluator-rubric.md) — scorecard for reviewing agent output quality

Each file has detailed usage instructions in the [English template guide](./resources/en/templates/README.md). Chinese versions are available in [中文模板指南](./resources/zh/templates/README.md).

## Syllabus

### Lectures

- [Lecture 01. Strong models don't mean reliable execution](./lectures/lecture-01-why-capable-agents-still-fail/README.md)
- [Lecture 02. What harness actually means](./lectures/lecture-02-what-a-harness-actually-is/README.md)
- [Lecture 03. Make the repository your single source of truth](./lectures/lecture-03-why-the-repository-must-become-the-system-of-record/README.md)
- [Lecture 04. Split instructions across files, not one giant file](./lectures/lecture-04-why-one-giant-instruction-file-fails/README.md)
- [Lecture 05. Keep context alive across sessions](./lectures/lecture-05-why-long-running-tasks-lose-continuity/README.md)
- [Lecture 06. Initialize before every agent session](./lectures/lecture-06-why-initialization-needs-its-own-phase/README.md)
- [Lecture 07. Draw clear task boundaries for agents](./lectures/lecture-07-why-agents-overreach-and-under-finish/README.md)
- [Lecture 08. Use feature lists to constrain what the agent does](./lectures/lecture-08-why-feature-lists-are-harness-primitives/README.md)
- [Lecture 09. Stop agents from declaring victory early](./lectures/lecture-09-why-agents-declare-victory-too-early/README.md)
- [Lecture 10. Only a full-pipeline run counts as real verification](./lectures/lecture-10-why-end-to-end-testing-changes-results/README.md)
- [Lecture 11. Make the agent's runtime observable](./lectures/lecture-11-why-observability-belongs-inside-the-harness/README.md)
- [Lecture 12. Clean handoff at the end of every session](./lectures/lecture-12-why-every-session-must-leave-a-clean-state/README.md)

### Projects

- [Project 01. Prompt-only vs. rules-first: how much difference does it make](./projects/project-01-baseline-vs-minimal-harness/README.md)
- [Project 02. Make the project readable and pick up where you left off](./projects/project-02-agent-readable-workspace/README.md)
- [Project 03. Keep the agent working across session restarts](./projects/project-03-multi-session-continuity/README.md)
- [Project 04. Use runtime feedback to correct agent behavior](./projects/project-04-incremental-indexing/README.md)
- [Project 05. Make the agent verify its own work](./projects/project-05-grounded-qa-verification/README.md)
- [Project 06. Build a complete agent harness](./projects/project-06-runtime-observability-and-debugging/README.md)

### Resource Library

- [Resource Library Overview](./resources/README.md)
- [Chinese Resource Library](./resources/zh/README.md)
- [English Resource Library](./resources/en/README.md)

## Recommended Learning Path

This course is designed to be done in order. Each phase builds on the last.

**Phase 1 — See the problem.** Read lectures 1 and 2, then do project 1. You'll run the same task twice: once with just a prompt, once with a minimal harness. The difference will be obvious.

**Phase 2 — Make the repo work for the agent.** Lectures 3 and 4, project 2. You'll restructure the repo so the agent can read it, and add files that survive between sessions.

**Phase 3 — Keep sessions connected.** Lectures 5 and 6, project 3. This is where things get interesting — you'll make the agent pick up from where it left off, even after you close the session.

**Phase 4 — Add feedback and scope control.** Lectures 7 and 8, project 4. You'll stop the agent from doing too much or too little, and use runtime feedback to keep it on track.

**Phase 5 — Verification and self-check.** Lectures 9 and 10, project 5. The agent learns to verify its own work instead of just saying "done."

**Phase 6 — Put it all together.** Lectures 11 and 12, project 6. This is the capstone. You'll build a complete harness from scratch, using everything you've learned.

Each phase takes about a week if you're going part-time. If you want to go faster, phases 1-3 can be done in a long weekend.

## Who This Is For

This course is for:

- Engineers already using coding agents who want better stability and quality
- Researchers or builders who want a systematic understanding of harness design
- Tech leads who need to understand how environment design affects agent performance

This course is not for:

- People looking for a zero-code AI introduction
- People who only care about prompts and don't plan to build real implementations
- Learners not prepared to let agents work inside real repositories

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

## Local Preview

This repository uses VitePress as a documentation viewer.

```sh
npm install
npm run docs:dev
```

Then open the local URL that VitePress outputs in your browser.

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

## Core References

Primary:

- [OpenAI: Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)
- [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Anthropic: Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)

Supplementary:

- [LangChain: The Anatomy of an Agent Harness](https://blog.langchain.com/the-anatomy-of-an-agent-harness/)
- [Thoughtworks: Harness Engineering](https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html)
- [HumanLayer: Skill Issue: Harness Engineering for Coding Agents](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents)

## Capstone Project

Most projects in this course revolve around the same product:

- An Electron-based personal knowledge base desktop app

Core goals include:

- Importing local documents
- Managing a document library
- Processing and indexing documents
- Running AI-powered Q&A over imported content
- Returning grounded answers with citations

This project was chosen because it combines:

- Strong practical value
- Enough real-world product complexity
- A good setting for observing before/after harness improvements

## Course Format

This course has two types of content:

- **Lectures**: 12 conceptual units, each answering one core question
- **Projects**: 6 hands-on projects that apply lecture methods to the same Electron app

Each project requires you to:

- Have Codex or Claude Code execute real tasks
- Compare weak vs. strong harnesses
- Observe changes in reliability, continuity, verification quality, and maintainability

The final project also serves as the course's capstone harness.

## How the Course Is Organized

- Each lecture focuses on one question
- The course includes 6 projects
- Every project requires the agent to do real work
- Every project compares weak vs. strong harness results
- What matters is the measured difference, not how many docs were written

## Repository Structure

- `lectures/` - All lectures
- `projects/` - All hands-on projects, including the capstone
- `resources/` - Bilingual reusable templates, checklists, and method references

Each lecture includes a `code/` directory for small real-world examples and supporting artifacts.
