# Breaking Down Claude Code's Harness Design

In [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents), Anthropic states clearly that reliability comes from the harness, not the model, and that agents need constraints "outside the model." Claude Code is a productized example of this idea; Anthropic itself explicitly classifies it as an **agentic harness**. This is not marketing language—Claude Code may be the most thoroughly examined public harness today: its source code is open, community research reports are detailed, and it turns nearly every core mechanism in the course lectures—layered memory, context compaction, permissions, hooks, subagents, and session persistence—into a complete product implementation.

In this article, we use the course's five-subsystem framework to break down Claude Code, focusing on how it implements foundational harness concepts such as "context management," "preventing premature declarations of completion," and "deterministic constraints."

## In One Sentence

At the core of Claude Code is a simple while loop: call the model, execute a tool, observe the result, and call the model again. But **most of the code is not in that loop; it is in the systems surrounding the loop**—the permission system, context compaction pipeline, extension mechanisms, subagent orchestration, and session storage. This is the essence of a harness: the loop is the skeleton, but everything around the skeleton determines reliability.

## Instruction Subsystem: A Layered Memory System

Claude Code's memory system is its most direct contribution to harness theory, corresponding to the course lectures on "the repository as the system of record" and "cross-session context continuity." The official documentation, [How Claude remembers your project](https://code.claude.com/docs/en/memory), states clearly that every session starts with a fresh context window and carries knowledge across sessions through two mechanisms: CLAUDE.md files (instructions you write) and auto memory (notes Claude writes itself).

In terms of scope, the official documentation divides CLAUDE.md files into four categories (loaded from broadest to most specific):

- **Organization policy level**: Centrally managed by IT/DevOps (for example, `/etc/claude-code/CLAUDE.md`) for company-wide standards.
- **User-level `~/.claude/CLAUDE.md`**: Personal preferences and rules that apply across projects.
- **Project-level `./CLAUDE.md` or `./.claude/CLAUDE.md`**: The project-level system of record for architecture, technology stack, and verification commands, shared with the repository.
- **Local-level `./CLAUDE.local.md`**: Personal preferences within a project, usually added to `.gitignore` rather than committed.

There are also two additional mechanisms:

- **On-demand loading at the subdirectory level**: CLAUDE.md files in subdirectories are not loaded at startup; they enter the context only when Claude reads files in that directory.
- **Auto memory**: Claude proactively writes notes based on your corrections and preferences. These notes are shared by repository, apply across worktrees, and load at most the first 200 lines or 25KB per session.

These four scopes form an **instruction hierarchy**: the official documentation says that "more specific instructions appear later in the context" (project instructions appear after user instructions). The value is that the model does not have to digest an entire giant instruction file at the beginning of every conversation; instructions are loaded close to where they apply, according to scope. This is the productized answer to Lecture 4, "Why One Giant Instruction File Fails."

## Context Subsystem: A Five-Layer Compaction Pipeline

According to VILA Lab's source-level analysis of Claude Code v2.1.88, [Dive into Claude Code](https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf), the system used a **five-layer compaction pipeline** at that time, not simply by "summarizing when it gets full." Lecture 5 explains how long-running tasks lose continuity; Claude Code's answer is a multi-stage funnel: first apply lossless pruning (removing redundant tool results), then perform structured distillation, and only then use lossy LLM summaries, with circuit breakers to prevent excessive compaction.

This is paired with the design of session storage: **append-oriented storage**. All history is appended to `history.jsonl`, with `/resume` recovery and fork branches. This ensures that "every session leaves a good handoff before ending"—not because the system has a good memory, but because the storage layer is append-oriented and replayable.

## Tool Subsystem: Four Extension Mechanisms

Claude Code divides its extension surface into four categories, each solving a different kind of problem. This is the part of its design most worth adopting:

- **Skills**: Defined in the [official documentation](https://code.claude.com/docs/en/skills) as procedural knowledge described by `SKILL.md`, loaded automatically based on triggers through progressive disclosure. They are suited to domain knowledge about "how to do something."
- **MCP**: The JSON-RPC protocol in the [official documentation](https://code.claude.com/docs/en/mcp) connects external systems, providing a standard interface through which "the model can reach the outside world."
- **Hooks**: Deterministic scripts attached to lifecycle events such as `PreToolUse`, `PostToolUse`, and `Stop`, as described in the [official documentation](https://code.claude.com/docs/en/hooks).
- **Plugins / Subagents**: The [official documentation](https://code.claude.com/docs/en/sub-agents) describes delegating complex tasks to specialized agents.

The key design is **separation of responsibilities**: CLAUDE.md manages "what," Skills manage "how," MCP manages "where to connect," and hooks manage "when to enforce." If a team mixes these layers—for example, putting work that belongs in MCP into CLAUDE.md—it creates the context leakage described in the course.

## Feedback and Verification: Deterministic Constraints + Human-Agent Division of Labor

Lecture 10 explains that "verification only counts when the complete flow works." Claude Code implements this through two tracks:

**1. Permission system (deterministic constraints).** Claude Code's permissions do not simply "ask about everything." According to VILA Lab's analysis of v2.1.88, the system combined seven modes with an ML-based classifier at that time: low-risk operations are allowed, while high-risk operations are either confirmed or denied according to policy (for architectural details, see the [VILA Lab analysis](https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf)). Note that permission-mode naming has changed since v2.1.88: current Anthropic docs ([permission modes](https://code.claude.com/docs/en/permission-modes)) list Manual (formerly "default", relabeled in v2.1.200+), Plan, acceptEdits, Auto, dontAsk, and bypassPermissions. This turns "setting clear task boundaries for the agent" (Lecture 7) into runtime enforcement instead of a plea in a prompt.

**2. Hooks (preventing premature declarations of completion).** `PostToolUse` hooks can force checks to run after tool execution and write the results back into the context; `Stop` hooks intervene when the agent declares completion. This separates "the one doing the work" from "the one checking the work." [Anthropic explicitly observed in its harness article](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) that agents "confidently praised their work," so hooks inject **deterministic** checks instead of trusting the model's self-evaluation.

**3. Subagents (context isolation).** Each subagent's conversation history is stored in a separate sidechain file and **does not inflate the parent agent's context** (see the [VILA Lab analysis](https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf)). This combines "task boundaries" with "context isolation": splitting a task also isolates context pollution.

## Observability and Session Persistence

Claude Code's logs are complete append-oriented records (history.jsonl). Together with explicit commands such as `/compact`, `/clear`, and `/init`, this lets you manage context state proactively instead of passively waiting for it to fill up. `/init` even turns "initialize before the agent starts each task" (Lecture 6) into a command. The [official documentation](https://code.claude.com/docs/en/memory) says it automatically analyzes the codebase and generates an initial CLAUDE.md containing build commands, test instructions, and engineering conventions.

## Mapping to the Course Framework

| Subsystem | Claude Code's Implementation | Assessment |
| --- | --- | --- |
| Instructions | Layered scopes (organization/user/project/local) + auto memory | Layered memory is the benchmark implementation |
| Tools | Four extension types: Skills + MCP + hooks + subagents | Clear separation of responsibilities is a core strength |
| Environment | In-project settings + settings.json | Relies on users to describe the environment in CLAUDE.md |
| State | Append-oriented session storage + five-layer compaction (per VILA v2.1.88 analysis) + resume/fork | Extremely strong; a reference implementation for long-running task continuity |
| Feedback | Permission classifier + mandatory checks through PostToolUse hooks | Turns "prevent premature declarations of completion" into a deterministic mechanism |

## Designs Worth Adopting

1. **Layer instructions by scope** instead of piling them into a single file. Directory-level CLAUDE.md files are an elegant implementation of "load close to where instructions apply."
2. **Compaction should be a staged funnel**: lossless before lossy; do not start by summarizing everything.
3. **Use hooks for deterministic checks**: preventing premature declarations of completion requires runtime enforcement, not pleas in prompts.
4. **Isolate subagent context**: split the context when splitting a task so subtask results do not pollute the main loop.
5. **Make session storage append-oriented and replayable**: handoffs depend on the storage layer, not memory.

## References

Every claim can be traced back to the sources below, avoiding secondhand recollections.

### Official Anthropic documentation

- **Claude Code · Memory**: A fresh context for every session, the four CLAUDE.md scopes, on-demand loading by subdirectory, auto memory (200 lines / 25KB), and `/init` generation of CLAUDE.md.<br/>https://code.claude.com/docs/en/memory
- **Claude Code · Skills / MCP / Hooks / Sub-agents**: Definitions of the four extension mechanisms and their events (PreToolUse / PostToolUse / Stop).<br/>https://code.claude.com/docs/en/skills | https://code.claude.com/docs/en/mcp | https://code.claude.com/docs/en/hooks | https://code.claude.com/docs/en/sub-agents
- **Claude Code · Permission modes**: Current mode names Manual (formerly "default", relabeled in v2.1.200+), Plan, acceptEdits, Auto, dontAsk, and bypassPermissions.<br/>https://code.claude.com/docs/en/permission-modes
- **Anthropic, Effective harnesses for long-running agents**: The source for the claims that "reliability comes from the harness rather than the model," that agents "confidently praised their work," and that hooks should be used for verification.<br/>https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents

### Independent/community research

The sources in this group reflect a specific historical version (Claude Code v2.1.88 at the time of the VILA Lab analysis) and may not match current behavior.

- **VILA Lab, Dive into Claude Code** (source-level analysis of v2.1.88): The five-layer compaction pipeline, seven permission modes + ML classifier, sidechain subagents, and append-oriented session storage in history.jsonl.<br/>https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf
- **Claude Code Full Stack Guide** (community guide to the CLAUDE.md / Skills / MCP / Subagents / Hooks layers): Supplementary reading on the separation of responsibilities among extension mechanisms.<br/>https://jsmanifest.com/claude-code-full-stack-guide

Related lectures: [Lecture 3 · Why the Repository Must Become the System of Record](../../lectures/lecture-03-why-the-repository-must-become-the-system-of-record/) ｜ [Lecture 9 · Why Agents Declare Victory Too Early](../../lectures/lecture-09-why-agents-declare-victory-too-early/) ｜ [Lecture 10 · Why End-to-End Testing Changes Results](../../lectures/lecture-10-why-end-to-end-testing-changes-results/)
