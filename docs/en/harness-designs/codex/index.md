# Breaking Down Codex's Harness Design

OpenAI's [Codex](https://openai.com/index/harness-engineering/) may be the product most deeply tied to "harness fundamentals" among these four. The article that named the entire field, Harness Engineering, was itself a summary of the OpenAI team's experience building a product with Codex. Breaking down Codex's harness design therefore largely means examining the engineering practices behind that article.

Codex's philosophy can be summarized in one sentence: **the repository is the system of record, AGENTS.md is only a directory page, and engineering value lies in designing environments, expressing intent, and building feedback loops.**

## In One Sentence

The OpenAI team used Codex to deliver a product that ultimately grew to more than a million lines of code in a matter of weeks, and **every line of code was written by Codex** (see the "Designing for growth" section of [Harness Engineering](https://openai.com/index/harness-engineering/)). Their experience answers a question: how should a system be organized when the engineer's role shifts from "writing code" to "designing the harness"? Codex CLI itself is an open-source monolithic binary implemented in Rust ([github.com/openai/codex](https://github.com/openai/codex)), but its primary contribution to harness design lies in **conventions** and **context engineering**, not flashy extension points.

## Instruction Subsystem: AGENTS.md Is a Directory Page, Not an Encyclopedia

This is Codex's most influential contribution to harness theory:

> A single giant instruction file is difficult to check mechanically for coverage, freshness, ownership, and cross-links, so drift is inevitable. We therefore stopped treating AGENTS.md as an encyclopedia and began treating it as a **directory page**. Codebase knowledge lives in structured documentation, and AGENTS.md points to it.

(The passage above is a direct paraphrase of the "AGENTS.md should be a directory page" section in [Harness Engineering](https://openai.com/index/harness-engineering/).)

Lecture 4 says that "one giant instruction file fails," and Codex provides the direct answer: keep AGENTS.md to roughly 100 lines (the original recommends about 100 lines and moving content to `docs/` as it approaches the limit). If it does not fit, split it into the `docs/` directory and let the agent read files on demand. This is the authoritative source for "give the map, not the manual."

The accompanying principle is to **enforce invariants, not micromanage implementation** (in the original: "don't micromanage the implementation; focus on invariants"). AGENTS.md should contain only inviolable constraints and verification commands, leaving the implementation details to the model. This maps directly to Lecture 2's "constraints rather than micromanagement."

## Context Subsystem: Write-Select-Compress-Isolate

Codex's context engineering can be summarized as four strategies. This framework was developed by the community after "context engineering" emerged as a distinct discipline and then mapped back onto Codex (see [Context Engineering for Codex CLI](https://codex.danielvaughan.com/2026/06/10/context-engineering-codex-cli-write-select-compress-isolate-june-2026/) for the framework):

- **Write**: Persist context outside the window—write conclusions into documentation and state into files instead of leaving them in the conversation. This corresponds to "the repository as the system of record."
- **Select**: Pull only the necessary tokens into the window—let AGENTS.md point the way and read files on demand instead of loading the whole repository.
- **Compress**: Preserve what truly matters—Codex supports automatic compaction and manual `/compact`, with a customizable `compact_prompt` (see [Context Engineering for Codex CLI](https://codex.danielvaughan.com/2026/06/10/context-engineering-codex-cli-write-select-compress-isolate-june-2026/)).
- **Isolate**: Divide context across different boundaries—use subagents to isolate the context of different tasks, so a frontend subagent never sees the backend database schema.

Codex also has a fine-grained environment-context design. Community source analysis in [codex-harness-internals](https://github.com/AlexKenbo/codex-harness-internals) shows that `build_environment_update_item` outputs only **changed fields** (CWD, git branch, file system) when the environment changes, rather than pasting the full system context into every turn. This is an engineering detail that avoids keeping duplicate tokens in the context.

## Tools and Boundaries: Worktree Isolation + Subagents

Codex has two core harness mechanisms:

**1. Environment isolation with git worktrees.** The "Environment" section of [Harness Engineering](https://openai.com/index/harness-engineering/) states that every task runs in an independent git worktree, paired with a local observability stack (logs, metrics, and traces), so every change can be verified in an isolated environment. This is the physical implementation of Lecture 7's "setting clear boundaries for every agent task": the boundary is enforced through environment isolation, not requested through instructions. Here, the environment subsystem becomes hard isolation.

**2. Core-level subagents.** Codex's `spawn_agent` / `wait_agent` are core tools: the model explicitly creates a subagent, gives it independent session history and a tool set, and waits for the result. Subagents inherit AGENTS.md instructions from their parent, but run in **their own context**. Configuration lives in `.codex/agents/*.toml`, where different models and instructions can be specified (for details, see the Sub-agents section of [Context Engineering for Codex CLI](https://codex.danielvaughan.com/2026/06/10/context-engineering-codex-cli-write-select-compress-isolate-june-2026/)). This is a direct implementation of "context isolation" and also embodies the spirit of Lecture 12 on handoffs: every subagent is a work unit with clear boundaries.

## Feedback Subsystem: Put Verification Commands in the Specification

One of the strongest emphases in OpenAI's practice is to list verification commands explicitly in AGENTS.md, making "how to confirm the work is correct" part of the repository. In the Codex engineering workflow, tests, CI, documentation, and observability configuration are all generated by Codex, and every one of them provides an "executable verification path." The answer to powerful but unreliable models is not to hope the model behaves responsibly; it is to make **verification paths a default component of the harness**.

Approval policies and plan mode provide feedback in the other direction: before high-risk operations execute, the system first produces a plan and requests approval, turning "task boundaries" and "human decision-making authority" into runtime controls.

## Mapping to the Course Framework

| Subsystem | Codex's Implementation | Assessment |
| --- | --- | --- |
| Instructions | AGENTS.md directory page + split docs/ + enforced invariants | Textbook-quality; defines "give the map, not the manual" |
| Tools | Worktree isolation + spawn_agent subagents | Strong boundaries enforced through environment isolation |
| Environment | Independent worktrees + observability stack | Worktree isolation is its signature feature |
| State | Write strategy (state written to files/documentation) | Relies on conventions rather than built-in memory |
| Feedback | Verification commands in the specification + approval policies + plan mode | Makes feedback paths the default; worth adopting |

The contrast between Codex and Claude Code is revealing. Claude Code uses "addition," putting memory, permissions, and subagents into the core. Codex uses "subtraction," keeping the core restrained and placing more responsibility on repository conventions and context engineering. This is why the community often says that "Codex's harness philosophy is more valuable than its code."

## Designs Worth Adopting

1. **Write AGENTS.md as a directory page**: Keep it to roughly 100 lines, point to details in docs/, and make it mechanically checkable.
2. **Specify only invariants; do not micromanage implementation**: Hard constraints + verification commands, with the rest left to the model.
3. **Use worktrees for environment isolation**: Enforce task boundaries through the environment, not through pleas in instructions.
4. **Send only environment-context deltas**: Output only changed fields on each turn instead of repeatedly pasting the full system context.
5. **Use subagents for context isolation**: Split the context along with the task so subtasks do not pollute the main loop.

## References (Original Sources / Source Code)

Every claim can be traced back to the original sources or source code below, avoiding secondhand recollections:

- **OpenAI, Harness Engineering**: The AGENTS.md directory page and roughly 100-line recommendation, enforce invariants / don't micromanage, worktree isolation + observability stack, verification commands in the specification, the million-line product case study, approval policies, and plan mode. The primary source for every core claim in this article.<br/>https://openai.com/index/harness-engineering/
- **OpenAI, AGENTS.md** (the standard for AGENTS.md as a cross-tool convention):<br/>https://openai.com/index/agents-md/
- **Codex CLI** (a monolithic binary implemented in Rust):<br/>https://github.com/openai/codex
- **Context Engineering for Codex CLI** (community): The Write-Select-Compress-Isolate framework, `/compact` and `compact_prompt`, `spawn_agent` / `wait_agent` subagents, and `.codex/agents/*.toml` configuration.<br/>https://codex.danielvaughan.com/2026/06/10/context-engineering-codex-cli-write-select-compress-isolate-june-2026/
- **codex-harness-internals** (community source analysis): Implementation details such as incremental environment context from `build_environment_update_item`.<br/>https://github.com/AlexKenbo/codex-harness-internals

Related lectures: [Lecture 3 · Why the Repository Must Become the System of Record](../../lectures/lecture-03-why-the-repository-must-become-the-system-of-record/) ｜ [Lecture 4 · Why One Giant Instruction File Fails](../../lectures/lecture-04-why-one-giant-instruction-file-fails/) ｜ [Lecture 7 · Why Agents Overreach and Under-Finish](../../lectures/lecture-07-why-agents-overreach-and-under-finish/)
