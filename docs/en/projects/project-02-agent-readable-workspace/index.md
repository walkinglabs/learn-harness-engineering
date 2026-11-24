[中文版本 →](../../../zh/projects/project-02-agent-readable-workspace/)

> Related lectures: [Lecture 03. Make the repository your single source of truth](./../../lectures/lecture-03-why-the-repository-must-become-the-system-of-record/index.md) · [Lecture 04. Split instructions across files](./../../lectures/lecture-04-why-one-giant-instruction-file-fails/index.md)
> Template files: [templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/en/resources/templates/)

# Project 02. Make the Project Readable and Pick Up Where You Left Off

## What You Do

Add "readability" to the repo so a new agent can quickly understand the project structure, know the current progress, and pick up work. Specifically: implement document import, document detail view, and local persistence, completed across two sessions.

You run it twice from the same starting code in `starter/`: first with the
starter's own thin harness and no `session-handoff.md`, second with the
handoff-oriented `AGENTS.md` from `solution/` and a `session-handoff.md` written
at the end of Session A. Each run has two sessions, and the second one has to
pick up work the first left unfinished. The [Run Protocol](#run-protocol) below
keeps the code, prompt, agent, and stopping point identical, so the comparison isolates the harness: the rules in `AGENTS.md` plus the handoff note.

## Tools

- Claude Code or Codex
- Git
- Node.js + Electron

## Harness Mechanism

Agent-readable workspace + persistent state files

## Use the Checked-In Project

Repository path: [`projects/project-02/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02)

| Directory | What it contains | What to compare |
|------|------|------|
| [`starter/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/starter) | Project 01 code plus incomplete document import, detail view, and persistence. The docs exist but are intentionally thinner, and there is no `session-handoff.md`. | How much rediscovery a second agent session does. |
| [`solution/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/solution) | The same slice completed, with expanded docs under [`projects/project-02/solution/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/solution) (plus [`feature_list.json`](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/solution/feature_list.json) and [`session-handoff.md`](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/solution/session-handoff.md)). | Whether a fresh session can resume from repo state without oral context. |

The product features are document import, full document detail/content loading,
and persistence across restart. The harness feature is the handoff-readable
workspace.

## Run Protocol

Only the harness may differ between the two runs. The code, the task prompt, the agent, and the point where Session A stops stay identical. Session A covers document import and the detail view; Session B covers persistence, as in the [project README](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/README.md).

1. Prepare two isolated working directories, for example `p02-baseline/` and `p02-improved/`. Run one at a time: both sessions, archive the results, then delete the directory before starting the other. Do not separate the runs with git branches. A coding agent can read other branches and sibling directories, and if the weak run can see the strong run's files the comparison is contaminated (the same rule as Project 01).
2. Copy [`projects/project-02/starter/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/starter) into both directories. This is the shared starting point: it is derived from the Project 01 solution, so the Project 01 features already pass and the three Project 02 features are `not-started` in its `feature_list.json`. If you would rather build on your own Project 01 result, copy that same snapshot into both directories instead. What matters is that both runs start from identical code.
3. Use the same task prompt in both runs, for example: "Implement document import through a file picker, a document detail view that loads the full content, and persistence so imported documents survive an app restart."
4. Do not copy `solution/docs/`, `solution/feature_list.json`, or `solution/session-handoff.md` into either directory. They describe the finished import and content-retrieval flows and mark every feature `pass`, which would hand the agent the answer. In both runs, leave `starter/docs/ARCHITECTURE.md`, `starter/docs/PRODUCT.md`, and `feature_list.json` exactly as `starter/` ships them.

### First Run (Weak Harness)

In `p02-baseline/`, keep the starter's harness as shipped: its short `AGENTS.md`, its `docs/`, and its `feature_list.json`, with no `session-handoff.md`. Do not delete these files. The weak harness is the thin one, not an empty one.

**Session A:**

1. Start the agent with the task prompt.
2. Stop the session yourself once document import and the detail view both work, but before persistence is done. "Works" means you launched the app, imported a `.txt` or `.md` file through the file picker, saw it in the document list, and opened it to see its full content; imported documents are still lost after a restart. Use the same criterion in the second run.
3. Do not ask for a handoff note or any other summary file.

**Session B:**

1. Open a fresh agent session in the same directory and say only "Continue the work."
2. Record how long the agent takes to make its first meaningful code change, and every time it re-discovers something Session A already knew (architecture, commands, which feature is half done).

### Second Run (Strong Harness)

In `p02-improved/`, before Session A, replace `AGENTS.md` with [`solution/AGENTS.md`](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/solution/AGENTS.md). It adds startup rules, a docs hierarchy, a rule to update the docs, a definition of done that requires evidence in `feature_list.json`, and a Session Handoff section. Change nothing else. Because `AGENTS.md` carries more than the handoff rule, this run measures the whole harness; a difference in Session B cannot be attributed to the handoff note alone. To isolate the handoff, add a third run that keeps the starter `AGENTS.md` and adds only the Session Handoff section.

**Session A:**

1. Start the agent with the same task prompt.
2. Stop at the same point as in the first run (import and detail view working, persistence not done).
3. Before closing the session, have the agent write `session-handoff.md` at the repo root, following the [session handoff template](./../../resources/templates/session-handoff.md): what is verified, what changed, what is broken or unverified, and the next best step. [`solution/session-handoff.md`](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/solution/session-handoff.md) is a finished example. It reports every feature as done, so do not copy it.

**Session B:**

1. Open a fresh agent session in the same directory and say only "Continue the work." The instruction to read `session-handoff.md` comes from `AGENTS.md`, not from your prompt.
2. Record the same measurements as in the first run.

## How to Measure Results

| Metric | Description |
|------|------|
| Session B pickup time | Time from the start of Session B to the first meaningful code change |
| Rediscovery count | How many times the agent re-learned architecture, commands, or state that already existed |
| Handoff quality | Whether the handoff note is complete, accurate, and actionable (second run only) |
| Repeated work | How much of Session B redoes what Session A already finished |
| Final completion | Whether all three features are complete at the end |

## What to Submit

- Weak-harness run record: Session A and Session B transcripts or logs
- Strong-harness run record: the same, plus the `AGENTS.md` you used and the `session-handoff.md` the agent wrote
- A comparison note: pickup speed and context-recovery quality
