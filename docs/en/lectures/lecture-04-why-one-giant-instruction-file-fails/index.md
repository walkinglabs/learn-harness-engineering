[中文版本 →](/zh/lectures/lecture-04-why-one-giant-instruction-file-fails/)

> Code examples: [code/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/en/lectures/lecture-04-why-one-giant-instruction-file-fails/code/)
> Practice project: [Project 02. Agent-readable workspace](./../../projects/project-02-agent-readable-workspace/index.md)

# Lecture 04. Split Instructions Across Files, Not One Giant File

## What Problem Does This Lecture Solve?

You got serious about harness engineering, created an `AGENTS.md`, and packed every rule, constraint, and lesson learned you could think of into it. Three months later it's bloated to 600 lines. And now the agent performs worse — on simple bug fixes it spends tons of context processing irrelevant deployment instructions; critical security constraints buried at line 300 get ignored outright; three contradictory code style rules means the agent picks one at random each time.

This is the "giant instruction file" trap. This lecture explains why "more information" does NOT equal "better performance," and how to split instructions into a structured file network.

## Core Concepts

- **Instruction Bloat**: When an instruction file occupies more than 10-15% of the context window, it starts crowding out budget for code reading and task reasoning. A 600-line `AGENTS.md` might consume 10,000-20,000 tokens — that's 8-15% of a 128K window eaten before the agent even starts.
- **Lost in the Middle Effect**: Liu et al.'s 2023 research proved that LLMs use information in the middle of long texts significantly less effectively than information at the beginning or end. A critical constraint buried at line 300 of a 600-line file has a very high probability of being effectively ignored.
- **Instruction Signal-to-Noise Ratio (SNR)**: The proportion of instructions in a file that are relevant to the current task. Being forced to read 50 lines of deployment instructions during a bug fix — that's low SNR.
- **Routing File**: A short entry file whose core function is pointing the agent to more detailed docs, not containing everything itself. 50-200 lines is plenty.
- **Progressive Disclosure**: Give overview information first, detailed information when needed. Good harness design is like good UI design — don't dump all options on the user at once.
- **Priority Ambiguity**: When all instructions appear in the same format and location, the agent can't distinguish non-negotiable hard constraints from suggestive soft guidelines.

## Why This Happens

The most common vicious cycle goes like this: the agent makes a mistake → you say "add a rule to prevent this" → add it to AGENTS.md → it works temporarily → agent makes a different mistake → add another rule → repeat → file bloats out of control.

This isn't your fault. It's a very natural reaction — "add a rule" each time something goes wrong feels reasonable. But the cumulative effect is disastrous. Let's look at what goes wrong specifically:

**Context budget crowding.** The agent's context window is finite. Say your agent has a 200K token window (standard for Claude). A bloated instruction file might eat 10-20K tokens. Seems like there's still plenty of room? But a complex task might need to read dozens of source files, tool execution output also takes context, and conversation history accumulates. By the time the agent needs to understand the code, the budget is already tight.

**Lost in the middle.** The "Lost in the Middle" paper (Liu et al., 2023) clearly demonstrated that LLMs utilize information in the middle of long texts significantly less effectively than at the beginning or end. Your AGENTS.md is 600 lines, and line 15 says "all database queries must use parameterized queries" — that's a security hard constraint. But line 15 in a 600-line file is actually near the top. What if that rule was at line 300? The agent would almost certainly ignore it.

**Priority conflicts.** The file mixes non-negotiable hard constraints ("never use eval()"), important design guidelines ("prefer functional style"), and a specific historical lesson ("fixed a WebSocket memory leak last week, watch for similar patterns"). These three rules have completely different importance levels, but they look identical in the file. The agent has no reliable signal to distinguish their relative importance.

**Maintenance decay.** Large files are inherently hard to maintain. Outdated instructions rarely get deleted — because the consequences of deletion are uncertain ("maybe something else depends on this rule?"), while adding new instructions is free. The result: the file only grows, never shrinks, and SNR continuously declines. This is exactly like technical debt accumulation in software.

**Contradiction accumulation.** Instructions added at different times start contradicting each other — one says "use TypeScript strict mode," another says "some legacy files allow any types." The agent randomly picks one to follow each time.

Both OpenAI and Anthropic implicitly support the splitting approach. OpenAI says entry files should be "short and routing-oriented," Anthropic says long-running agent control information should be "concise and high-priority." Both are saying the same thing: don't stuff everything into one file.

## How to Do It Right

Split the giant file into a three-layer structure:

**Layer 1: Routing file** (`AGENTS.md`, 50-200 lines). Only include:
- Project overview (one or two sentences)
- First-run commands (`make setup && make test`)
- Global hard constraints (no more than 15 non-negotiable rules)
- Links to topic documents (one-line description + applicability condition)

```markdown
# AGENTS.md

## Project Overview
Python 3.11 FastAPI backend, PostgreSQL 15 database.

## Quick Start
- Install: `make setup`
- Test: `make test`
- Full verification: `make check`

## Hard Constraints
- All APIs must use OAuth 2.0 authentication
- All database queries must use SQLAlchemy 2.0 syntax
- All PRs must pass pytest + mypy --strict + ruff check

## Topic Docs
- [API Design Patterns](docs/api-patterns.md) — Required reading when adding endpoints
- [Database Rules](docs/database-rules.md) — Required when modifying database operations
- [Testing Standards](docs/testing-standards.md) — Reference when writing tests
```

**Layer 2: Topic documents** (50-150 lines each, organized by subject). Place them in `docs/` or next to the corresponding module directory. Each document covers one specific topic and is only read when needed.

**Layer 3: Inline in code.** Some information is better placed directly in the code — type definitions, interface comments, explanations in config files. The agent naturally sees these when reading code.

**Pruning rules**: Every instruction should have:
- A clear source: "Why was this rule added?"
- A clear applicability condition: "When is this rule needed?"
- A clear expiry condition: "Under what circumstances can this rule be removed?"

Audit regularly, remove outdated, redundant, and contradictory entries. Manage your instructions like you manage code dependencies.

**Placement matters**: If an instruction must be in the routing file, put it at the top or bottom — never the middle. This leverages the "lost in the middle" effect to ensure important information isn't missed. But the better approach is to move instructions to topic documents for on-demand loading.

## Real-World Example

A SaaS team's `AGENTS.md` ballooned from 50 lines to 600. Contents mixed tech stack versions, coding standards, historical bug fix notes, API usage guides, deployment procedures, and team members' personal preferences.

Agent performance started declining noticeably: during simple bug fixes the agent spent lots of context processing irrelevant deployment instructions; the security constraint "all database queries must use parameterized queries" was buried at line 300 and frequently ignored; three contradictory code style rules caused random agent behavior.

The team executed a refactor:
1. `AGENTS.md` trimmed to 80 lines: only project overview, run commands, and 15 global hard constraints
2. Created topic documents: `docs/api-patterns.md` (120 lines), `docs/database-rules.md` (60 lines), `docs/testing-standards.md` (80 lines)
3. Added topic document links in the routing file
4. Historical notes either converted to test cases or deleted

After refactoring: same task set success rate went from 45% to 72%. Security constraint compliance went from 60% to 95% (moved from file middle to routing file top).

## Key Takeaways

- "Add a rule" is short-term pain relief, long-term poison. Before adding a rule, ask: would this be better in a topic document?
- The entry file is a router, not an encyclopedia. 50-200 lines with overview, hard constraints, and links only.
- Leverage the "lost in the middle" effect: important info goes at the top or bottom; unimportant info moves to topic documents.
- Manage instruction bloat like technical debt. Regular audits, every instruction needs a source, applicability condition, and expiry condition.
- After splitting, SNR improves and the agent spends more context budget on actual tasks instead of processing irrelevant instructions.

## Further Reading

- [OpenAI: Harness Engineering](https://openai.com/index/harness-engineering/)
- [Anthropic: Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Lost in the Middle: How Language Models Use Long Contexts](https://arxiv.org/abs/2307.03172)
- [HumanLayer: Harness Engineering for Coding Agents](https://humanlayer.dev/articles/harness-engineering-for-coding-agents/)
- [Nielsen Norman Group: Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/)

## Exercises

1. **SNR audit**: Take your current entry instruction file and list all instruction entries. Pick 5 different common task types and mark whether each instruction is relevant to that task. Calculate SNR for each task type. Instructions that are noise for most tasks should move to topic documents.

2. **Progressive disclosure refactor**: If you have an instruction file over 300 lines, split it into: (a) a routing file under 100 lines, (b) 3-5 topic documents. Run the same set of tasks (at least 5) before and after, compare success rates.

3. **Lost in the middle verification**: In a long instruction file, place a critical constraint at the top, middle, and bottom respectively, running the same task set each time (at least 5 runs per position). See if there's a difference in compliance rate. You might be surprised by how strong the position effect is.
