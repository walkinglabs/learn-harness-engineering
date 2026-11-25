# Concurrent Session Coordination Pattern

## Problem

`claude-progress.md` and session handoff assume sessions run **one after another**:
the next session reads what the last one wrote. Once two or more agent sessions run
**at the same time** in the same workspace (one fixing a bug, one reviewing a PR, one
writing docs), that assumption fails:

- Both sessions rewrite the same progress file; the last write wins and the other
  session's state is lost.
- Both edit the same file; one silently overwrites the other.
- Neither knows what the other is doing, so they duplicate work or undo each other.
- A session that wants something from another (release a file, hand over a task) has
  no channel except the human.

Worktrees isolate the code checkout, but not the shared state around it: the
orchestrator's notes, the progress log, the task list.

## Golden Rules

### Never Share One Mutable File Between Concurrent Writers

Split state by who writes it:

| State | Shape | Why it is safe |
|---|---|---|
| What *this* session is doing | One file per session: `workspaces/<session-id>.md` | Only its owner writes it |
| What happened today | Append-only log: `log/YYYY-MM-DD.md`, one line per meaningful unit | Appends do not clobber each other |
| Who is editing what | One lock file per (session, file): `locks/<session-id>--<file-slug>.lock` | Created and deleted by the owner only |
| Requests between sessions | One file per message; read receipts as separate empty marker files | Reading never edits the message |

### Push State Into Context; Don't Rely on the Agent to Poll

Agents forget to check shared state. Use hooks to inject it:

- **SessionStart:** this session's workspace, the tail of today's log, locks held by
  other live sessions, unread messages.
- **UserPromptSubmit:** a short header (active task, foreign locks, unread count) on
  every prompt, so a message sent a minute ago reaches a running session on its next
  turn.
- **SessionEnd:** release this session's locks and write "where I left off".

### Locks Are Advisory; the Human Decides

A `PreToolUse` hook on edit tools claims a lock before the edit and checks for a
conflicting lock held by another session. On conflict it blocks the edit and tells the
agent who holds it and for which task. The agent surfaces the conflict to the human, or
messages the owner, and never deletes another session's lock.

### Judge Liveness by Heartbeat, Not Lock Age Alone

Every hook run writes a heartbeat for its session. A lock whose owner has no recent
heartbeat (for example 15 minutes) is dead and may be reclaimed automatically; a lock
older than a hard TTL (for example 60 minutes) is stale. A long-running but live
session keeps its locks.

### Session State Is Scratch, Not the Record

Session workspaces and the daily log are machine-local working memory. Decisions,
designs and procedures still go to the repo (task notes, `DECISIONS.md`, skills). The
session log links to them instead of restating them, and committed files never link
into session state.

## When To Use

- Two or more agent sessions regularly run at once in the same workspace.
- You have seen lost progress-file updates or two agents editing one file.
- Sessions need to hand work to each other without routing everything through you.

Not needed for a single agent working session by session: `claude-progress.md` plus
session handoff is enough.

## Tradeoffs

| Benefit | Cost |
|---|---|
| No lost state between concurrent sessions | A hook runs on every prompt and edit (keep each under ~100 ms) |
| Edit conflicts caught before they happen | Stale locks need TTL and liveness rules |
| Sessions can message each other | Machine-local: does not coordinate across machines |

## Implementation Sketch

```text
state/
├── workspaces/<session-id>.md      # task, last action, where I left off, blockers
├── log/2026-01-15.md               # "- 10:32 — fixed retry bug in worker; tests green (<session-id>)"
├── locks/<session-id>--src-api-ts.lock
├── heartbeats/<session-id>         # mtime = last hook run
└── messages/
    ├── <timestamp>-<from>-<to>.msg.json
    └── .acks/<message-id>--<reader-id>
```

Session id: derive it once per session from the agent's session id (plus hostname) and
cache it, so every hook run in that session uses the same id and a human can address
it by a short prefix.

Lock claim in a `PreToolUse` hook, in outline:

```bash
file_slug=$(printf '%s' "$target_path" | tr '/.' '--')
for lock in state/locks/*--"$file_slug".lock; do
  [ -e "$lock" ] || continue
  owner=${lock##*/}; owner=${owner%%--*}
  [ "$owner" = "$SESSION_ID" ] && continue
  if is_live "$owner" && ! is_stale "$lock"; then
    echo "File is locked by $owner ($(task_of "$owner")). Ask the user or message the owner." >&2
    exit 2                                   # block the edit
  fi
  rm -f "$lock"                              # dead owner or stale lock: reclaim
done
touch "state/locks/$SESSION_ID--$file_slug.lock"
```

## Gotchas

- **Read-only tools must not claim locks.** Only edit and write tools do; otherwise
  every search blocks other sessions.
- **Clean up on exit, but don't depend on it.** Sessions crash; liveness and TTL rules
  are what actually clear abandoned locks. A periodic `gc` removes old messages, orphan
  read receipts and dead sessions' files.
- **Keep messages short and actionable** ("release `src/api.ts`?", "I'm taking the PR
  review"). Long context belongs in a task note that the message links to.
- **Do not put secrets or customer data in session state.** It is plain text on disk
  and easily copied into a prompt.
