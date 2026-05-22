# Memory and Persistence Pattern

## Problem

Without persistent memory, an agent loses all user preferences, project context, and behavioral feedback the moment a session ends. Users must repeat corrections every session ("use bun, not npm"), and the agent cannot accumulate the working knowledge that makes it genuinely useful over time.

## Golden Rules

### Separate layers by scope and durability

- **Instruction memory** (human-curated, version-controlled): AGENTS.md, CLAUDE.md, project conventions
- **Auto-memory** (agent-written, persistent): Progress logs, session handoffs, discovered patterns
- **Session extraction** (background-derived): Automatic transcript analysis at session end

### Two-step save invariant

Every memory write is a two-step operation:
1. Write the full content to a dedicated topic file
2. Append a one-line pointer to the index

If the process crashes between steps, the worst outcome is an orphaned topic file — the index remains consistent.

### Local overrides win — always

When the same topic is addressed at multiple scopes, the most-local instruction takes priority:

```
Organization-wide → User-level → Project-level → Local override
     ↓                  ↓              ↓              ↓
   sets floor      narrows it    narrows further   final say
```

### The index is bounded always-on context; topic files are on-demand detail

- **Index**: Hard-capped at ~200 lines / 25KB, one line per entry
- **Topic files**: Unlimited detail, loaded on demand

## When To Use

- Your agent persists across sessions and must recall user preferences or project context
- Multiple scopes of instruction coexist and need clear priority ordering
- The agent should learn from sessions without manual curation
- You need background extraction that doesn't block the user

## Tradeoffs

| Decision | Benefit | Cost |
|---|---|---|
| Layered memory | Each scope can be shared, audited, overridden independently | More files to discover at startup |
| Local-wins priority | Users can override without touching shared files | Global rule can be silently overridden |
| Bounded index with on-demand topics | Constant context cost regardless of memory volume | Agent must perform extra retrieval step |
| Background extraction | No latency added to user responses | Race window between extraction and next turn |

## Implementation Patterns

1. **Define memory directory** idempotently at startup (e.g., `.claude/memory/`)
2. **Create index file** with hard caps enforced at read time
3. **Implement two-step save**: topic file first, then index update
4. **Fire background extraction** only after final response with no pending tool calls
5. **Enforce mutual exclusion**: if main agent wrote to memory, skip extraction that turn
6. **Build review mechanism** for cross-layer promotion proposals

## Gotchas

1. **Index truncation is silent until it fires** — keep entries short
2. **Priority ordering is counterintuitive** — local beats project beats user beats org
3. **Extraction timing creates a race window** — user can start next turn before extraction completes
4. **Derivable content doesn't belong in memory** — architecture and code patterns are re-derivable from the codebase
5. **Orphaned topic files accumulate** — periodic cleanup recommended

## Related Patterns

- [Context Engineering](context-engineering-pattern.md) — How to manage context budget across layers
- [Lifecycle & Bootstrap](lifecycle-bootstrap-pattern.md) — How initialization loads memory

## Template: Progress Log Structure

```markdown
# Session Progress Log

## Current State (Last Updated: YYYY-MM-DD HH:MM)

**Active Feature:** feat-003 - Evidence-grounded debrief report
**Status:** In Progress (60% complete)

### What's Done
- [x] Transcript parsing pipeline
- [x] Question-chain segmentation
- [ ] Debrief report generator (in progress)

### What's In Progress
- Implementing debrief report IPC handler
- Need to decide: streaming vs batch response

### Blockers
- Waiting on decision: evidence reference format (turn IDs vs inline excerpts)

### Next Session Should
1. Complete debrief report handler
2. Add transcript evidence formatting
3. Test end-to-end flow
```

## Evidence

This pattern is grounded in production agent runtimes including Claude Code's memory system, which implements:
- Four-level instruction hierarchy (org/user/project/local)
- Four-type auto-memory taxonomy (user/feedback/project/reference)
- Background session extraction with mutual exclusion
- Team-shared memory as an extension layer
