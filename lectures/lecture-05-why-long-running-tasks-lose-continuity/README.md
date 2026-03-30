# Lecture 05. Why Long-Running Tasks Lose Continuity

## Question

Why do agent projects lose continuity across sessions, and what must a harness
persist to prevent that loss?

## Why It Matters

Long-running development is a sequence of handoffs. Each handoff can introduce
state loss, ambiguity, and duplicated effort. If continuity is weak, the agent
spends increasing time reconstructing context instead of shipping verified
behavior.

## Core Concepts

- Session boundary: a transition where a new run does not automatically inherit
  complete prior reasoning.
- Working context vs durable state: model context is transient; repository
  artifacts persist.
- Continuity artifact: an external record (file, commit, checklist, status
  entry) that supports reliable handoff.
- Reconstruction cost: time and tokens spent rediscovering project state.
- Drift: divergence between intended state and actual repository/runtime state.

## Detailed Explanation

Anthropic’s long-running harness work frames continuity as a systems problem.
Even strong models underperform when each run must infer history from partial
signals. The failure mode is not only "bad generation"; it is missing
infrastructure for handoff.

OpenAI’s harness engineering guidance reinforces the same principle from another
angle: the repository should be the operational system of record, not the chat
transcript. Continuity improves when each run leaves explicit, inspectable
artifacts that answer:

1. What is currently true?
2. What is failing or unfinished?
3. What is the next executable step?

There are two distinct strategies for managing context across sessions:

**Compaction** summarizes the current context window in place. It preserves
conversational continuity and is cheap to execute, but the summary may lose
important details. The agent continues in the same window with a compressed
view of what came before.

**Context reset** clears the window entirely and forces the agent to
reconstruct state from repository artifacts only. It provides a clean starting
point with no leftover noise, but it only works if the handoff artifacts are
complete and well-structured.

These are not interchangeable. Compaction works for short-to-medium sessions
where the conversation thread is still mostly relevant. Context resets work
better for long multi-session projects where accumulated context becomes stale
or contradictory. Anthropic's long-running harness work shows that agents
sometimes exhibit "context anxiety" — wrapping up prematurely as they approach
perceived context limits. Full context resets with structured handoff files
eliminate this problem entirely.

The choice between compaction and reset determines what your handoff artifacts
need to contain. If you rely on resets, the artifacts must be self-sufficient —
a new agent session must be able to reconstruct the full project state from
files alone. This is why feature lists, progress logs, and handoff notes are
not optional documentation; they are the mechanism that makes context resets
work.

## Examples and Artifacts

- See [`code/`](./code/README.md) for continuity failure and recovery examples.
- Typical continuity artifacts include a progress log, a feature-status file, a
  clean commit checkpoint, and a short verification record from the latest run.
- A useful handoff artifact states repository status, runtime status, blockers,
  and next action in directly testable terms.

## Readings

- Anthropic: Effective harnesses for long-running agents
- Anthropic: Harness design for long-running application development
- OpenAI: Harness engineering: leveraging Codex in an agent-first world

## Exercises

1. Run the same multi-step task in two sessions: once without continuity
   artifacts, and once with a progress log plus feature-status file. Compare
   reconstruction time.
2. Ask a fresh session to resume work using repository artifacts only (no prior
   conversation context). Record which details were recoverable and which were
   missing.
3. Design a minimal handoff template with exactly four fields. Validate whether
   a new session can safely continue work from that template.
