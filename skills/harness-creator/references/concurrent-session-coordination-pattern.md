# Concurrent Session Coordination Pattern

## Problem

`claude-progress.md` and session handoff assume sessions run **one after another**:
the next session reads what the last one wrote. Once two or more agent sessions run
**at the same time** in the same workspace (one fixing a bug, one reviewing a PR, one
writing docs), that assumption fails:

- Both sessions rewrite the same progress file; the last write wins and the other
  session's state is lost.
- Two sessions edit the same file; one silently overwrites the other.
- Neither knows what the other is doing, so they duplicate work or undo each other.

## Default: Separate State, One Writer per File

Start here. For most setups this is enough.

### One Progress File per Session, One Append-Only Shared Log

Split state by who writes it, so no file has two concurrent writers:

| State | Shape | Why it is safe |
|---|---|---|
| What *this* session is doing | One file per session: `progress/<session-id>.md` | Only its owner writes it |
| What happened today | Append-only log: `log/YYYY-MM-DD.md`, one line per meaningful unit | Appends do not clobber each other |

A session reads its own progress file at startup and the shared log for context. Any
human-facing summary is built from these, never kept as one more file that every
session rewrites.

### Same Files Touched: One Writer, or Separate Worktrees

Decide who writes before the work starts, not after a conflict:

- **One writer, one reviewer.** When two tasks touch the same files, the lead agent
  assigns one session to write them and gives the other a review or read-only role.
- **Separate worktrees.** When both tasks really must change the same code in
  parallel, give each its own `git worktree` and let the merge resolve it.

### Session State Is Scratch, Not the Record

Per-session progress and the shared log are working memory. Decisions, designs and
procedures still go to the repo (task notes, `DECISIONS.md`, skills). The log links to
them instead of restating them.

## Optional: No Lead Agent, Shared Checkout

The default relies on someone being able to assign a single writer. That breaks down in
one specific setup: a developer opens **several independent sessions** in separate
terminals, with no lead agent, and they edit files that live in **one shared checkout**
that is not split into worktrees (typically the instruction files, skills and task notes
of the harness repo itself). No session is in a position to assign writers, so each one
needs a way to find out that another is editing a file right now.

Only in that case, add coordination on top of the default:

- **Advisory edit locks.** A `PreToolUse` hook on edit tools claims a lock file per
  (session, file) before the edit and checks for a lock held by another session. On a
  conflict it blocks the edit and tells the agent who holds it and for which task; the
  agent asks the human or the owner, and never deletes another session's lock.
- **Liveness by heartbeat.** Every hook run records a heartbeat for its session. A lock
  whose owner has no recent heartbeat (for example 15 minutes) is dead and may be
  reclaimed; a lock older than a hard TTL (for example 60 minutes) is stale. A slow but
  live session keeps its locks.
- **Session messages.** One file per message, with read receipts as separate empty
  marker files, so reading never edits the message ("release `SKILL.md`?", "I'm taking
  the PR review").
- **Push state into context.** Agents forget to poll. A `SessionStart` hook shows
  locks held by other live sessions and unread messages; a `UserPromptSubmit` hook adds
  a one-line header each turn; `SessionEnd` releases the session's locks.

This is a choice for that setup, not part of the recommended harness. With a lead agent,
or with every parallel task in its own worktree, skip it.

## When To Use

- **Default section:** two or more agent sessions regularly run at once in the same
  workspace, or you have seen lost progress-file updates.
- **Optional section:** additionally, there is no lead agent and the sessions edit files
  in one shared checkout.

Not needed for a single agent working session by session: `claude-progress.md` plus
session handoff is enough.

## Tradeoffs

| Approach | Benefit | Cost |
|---|---|---|
| Per-session progress + shared log | No lost state; no extra machinery | Someone still has to assign writers for shared files |
| Lead agent assigns one writer | Conflicts prevented by design | Needs a lead agent and a task split up front |
| Separate worktrees | Parallel edits to the same code | Merge work later; does not cover files outside the checkout |
| Advisory locks + heartbeats (optional) | Works without a lead agent | A hook on every edit and prompt (keep each under ~100 ms); stale-lock rules; machine-local only |

## Implementation Sketch

Default:

```text
state/
├── progress/<session-id>.md        # task, last action, where I left off, blockers
└── log/2026-01-15.md               # "- 10:32 — fixed retry bug in worker; tests green (<session-id>)"
```

Session id: derive it once per session from the agent's session id (plus hostname) and
cache it, so every hook run in that session uses the same id and a human can address it
by a short prefix.

Optional additions for the no-lead, shared-checkout case:

```text
state/
├── locks/<session-id>--<file-slug>.lock
├── heartbeats/<session-id>         # mtime = last hook run
└── messages/
    ├── <timestamp>-<from>-<to>.msg.json
    └── .acks/<message-id>--<reader-id>
```

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

- **Never give a shared summary file to every session.** It is the progress-file
  problem again in a new place; build summaries from the per-session files.
- **Do not put secrets or customer data in session state.** It is plain text on disk and
  easily copied into a prompt.
- If you add the optional locks:
  - **Read-only tools must not claim locks.** Only edit and write tools do; otherwise
    every search blocks other sessions.
  - **Clean up on exit, but don't depend on it.** Sessions crash; liveness and TTL rules
    are what clear abandoned locks.
  - **Keep messages short and actionable.** Long context belongs in a task note that
    the message links to.
