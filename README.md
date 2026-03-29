# Learn Harness Engineering

> A project-based course on designing the environments, state, verification, and control systems that make Codex and Claude Code reliable.

This course is under active construction, and contents are subject to change.

## Course Overview

Harness engineering is the practice of building the environment around a model
so that it can do useful, reliable, long-running work. That environment
includes repository knowledge, tool surfaces, working-state artifacts,
verification loops, observability, structural constraints, and maintenance
mechanisms.

This course is implementation-heavy. Instead of studying harnesses only as
theory, students will repeatedly use Codex or Claude Code on the same evolving
Electron application and compare weaker harnesses against stronger ones. The
goal is not to admire agent output in isolation, but to understand which
harness decisions produce better task completion, better recovery, and better
long-term maintainability.

## Course Premise

This course starts from a simple idea:

**Strong models still fail when the harness around them is weak.**

We are not trying to make the model smarter. We are trying to make the same
model work better by improving what surrounds it.

## Who This Course Is For

This course is for:

- engineers who already use coding agents and want better reliability
- researchers or builders who want a concrete mental model of harness design
- technical leads who want to understand how environment design changes agent
  behavior

This course is not for:

- readers looking for a no-code introduction to AI
- people who want a prompt-only workflow without hands-on implementation
- learners who do not plan to run a coding agent against a real repository

## Required Setup

This is a hands-on course for people who can actually run a coding agent against
real projects.

You should have access to at least one coding tool such as:

- Claude Code
- Codex
- Another IDE or CLI coding agent with file editing, shell execution, and
  multi-step task support

The course assumes you can:

- open a local repository
- let an agent edit files
- let an agent run commands
- inspect outputs and rerun tasks

Without an IDE or CLI coding agent, you can still read the course, but you will
not be able to complete the practical projects as intended.

## Quick Start

This repository uses VitePress as its document launcher.

```sh
npm install
npm run docs:dev
```

Then open the local URL printed by VitePress in your browser.

## Prerequisites

- Comfort using the terminal, git, and local development environments
- Ability to read and modify application code in at least one common stack
- Some experience debugging software using logs, tests, and runtime behavior
- Enough time for hands-on implementation work

Helpful but not strictly required:

- Prior experience with Electron, desktop apps, or local-first tools
- Prior experience with testing, logging, and software architecture
- Prior use of Codex, Claude Code, or similar coding agents

## Core Sources

Primary:

- [OpenAI: Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)
- [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Anthropic: Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)

Supporting:

- [LangChain: The Anatomy of an Agent Harness](https://blog.langchain.com/the-anatomy-of-an-agent-harness/)
- [Thoughtworks: Harness Engineering](https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html)
- [HumanLayer: Skill Issue: Harness Engineering for Coding Agents](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents)

## Running Project

Most studios in this course use the same product:

- A desktop personal knowledge base built with Electron

Core product goals:

- Import local documents
- Manage a document library
- Process and index documents
- Ask AI questions about the imported content
- Return source-grounded citations

This project is useful, product-shaped, and complex enough to make harness
improvements visible.

## Coursework

The course has two kinds of work:

- **Lectures**: 12 short conceptual units, each centered on one question
- **Projects**: 6 practical projects that apply those ideas to the same
  evolving Electron knowledge app

Each project asks students to:

- run Codex or Claude Code on a real task
- compare a weaker harness against a stronger harness
- observe changes in reliability, continuity, verification, and maintainability

The final project functions as the capstone harness for the course.

## How the Course Works

- Each lecture focuses on one question.
- The course is paired with six practical projects.
- Every project uses Codex or Claude Code to do real work.
- Every project compares a weaker harness against a stronger harness.
- The point is to see performance differences, not just to write notes.

## Repository Layout

- `lectures/` - All lecture notes
- `projects/` - All practical projects, including the capstone

Each lecture includes a `code/` folder for real examples and small supporting
artifacts.

## Suggested Schedule

This course works well as a six-unit sequence:

- **Unit 1**: Lectures 01-02 + Project 01
- **Unit 2**: Lectures 03-04 + Project 02
- **Unit 3**: Lectures 05-06 + Project 03
- **Unit 4**: Lectures 07-08 + Project 04
- **Unit 5**: Lectures 09-10 + Project 05
- **Unit 6**: Lectures 11-12 + Project 06

You can also study it at a slower pace by treating each unit as one week of
work.

## Course Map

### Lectures

- [Lecture 01. Why capable agents still fail](./lectures/lecture-01-why-capable-agents-still-fail/README.md)
- [Lecture 02. What a harness actually is](./lectures/lecture-02-what-a-harness-actually-is/README.md)
- [Lecture 03. Why the repository must become the system of record](./lectures/lecture-03-why-the-repository-must-become-the-system-of-record/README.md)
- [Lecture 04. Why one giant instruction file fails](./lectures/lecture-04-why-one-giant-instruction-file-fails/README.md)
- [Lecture 05. Why long-running tasks lose continuity](./lectures/lecture-05-why-long-running-tasks-lose-continuity/README.md)
- [Lecture 06. Why initialization needs its own phase](./lectures/lecture-06-why-initialization-needs-its-own-phase/README.md)
- [Lecture 07. Why scope must be made explicit](./lectures/lecture-07-why-agents-overreach-and-under-finish/README.md)
- [Lecture 08. Why verification must be externalized](./lectures/lecture-08-why-feature-lists-are-harness-primitives/README.md)
- [Lecture 09. Why runtime feedback belongs inside the harness](./lectures/lecture-09-why-agents-declare-victory-too-early/README.md)
- [Lecture 10. Why structure and taste must be enforced](./lectures/lecture-10-why-end-to-end-testing-changes-results/README.md)
- [Lecture 11. Why advanced harnesses split roles](./lectures/lecture-11-why-observability-belongs-inside-the-harness/README.md)
- [Lecture 12. Why harnesses must be measured and maintained over time](./lectures/lecture-12-why-every-session-must-leave-a-clean-state/README.md)

### Projects

- [Project 01. Baseline vs minimal harness](./projects/project-01-baseline-vs-minimal-harness/README.md)
- [Project 02. Agent-readable workspace and continuity scaffold](./projects/project-02-agent-readable-workspace/README.md)
- [Project 03. Scope control and grounded verification](./projects/project-03-multi-session-continuity/README.md)
- [Project 04. Runtime feedback and structural control](./projects/project-04-incremental-indexing/README.md)
- [Project 05. Evaluator loops and three-role upgrades](./projects/project-05-grounded-qa-verification/README.md)
- [Project 06. Benchmark, cleanup, and capstone harness](./projects/project-06-runtime-observability-and-debugging/README.md)

## How to Use This Repository

1. Read the course README to understand the overall structure.
2. Work through the lectures in order.
3. Use the six numbered projects as the practical track.
4. Keep small examples inside each lecture `code/` folder.
5. Use the final project as the capstone harness.
