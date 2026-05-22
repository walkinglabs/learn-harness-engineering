# Context Engineering Pattern

## Problem

Agents fail when context is managed poorly:
- **Too much context** → Session startup is slow, token costs explode, model gets lost in details
- **Too little context** → Agent makes wrong assumptions, reinvents wheels, violates conventions
- **Wrong context** → Agent focuses on low-level details, misses architectural constraints

Context is not a dump. It's a budget that must be managed with explicit operations.

## Golden Rules

### Four Context Operations

Every token in the window should earn its place through one of four operations:

1. **SELECT** — Load context just-in-time, not all-at-once
2. **WRITE** — Agent writes back to persistent storage (memory, state, rules)
3. **COMPRESS** — Reactive compaction of older turns mid-session
4. **ISOLATE** — Delegated work must not pollute parent context

### Progressive Disclosure

Three-tier loading:

```
Tier 1: Metadata (always present, cheap)
  → Feature list, memory index, session status
  
Tier 2: Instructions (loaded on activation)
  → AGENTS.md, skill bodies, style guides
  
Tier 3: Resources (loaded on demand)
  → Architecture docs, API references, examples
```

### Memoize Expensive Builders, Invalidate Explicitly

Context builders (e.g., "load all recent git commits") should be memoized to avoid redundant work, but **must** be invalidated at known mutation points — not reactively. Every mutation point must clear its corresponding cache.

## When To Use

- Agent performance degrades in long sessions
- Startup is slow due to eager context loading
- Delegated work pollutes the parent context
- Token costs are unpredictable

## Tradeoffs

| Decision | Benefit | Cost |
|---|---|---|
| JIT loading | Fast startup, low idle cost | Agent can't reason about skills until activated |
| Hard caps per block | Predictable token budget | May truncate useful context |
| Manual cache invalidation | No reactive staleness | Developer must add invalidation at each mutation |
| Isolation for delegation | Clean parent context | Child can't see parent's accumulated context |

## Implementation Patterns

### Select Pattern

```markdown
## Startup Context (Loaded Immediately)

- Repository root path
- Tech stack (one line)
- Active feature ID from feature_list.json

## On-Demand Context (Loaded When Triggered)

- Skill: Read when skill activates
- Architecture docs: Read when implementing new feature
- API reference: Read when calling external services
```

**Key moves:**
- Audit current context cost per turn
- Apply hard caps to every variable-length block
- Add truncation recovery pointers ("call list_files for full output")

### Compress Pattern

Long sessions exhaust the window. Reactive compaction:

1. **Trigger**: Context usage exceeds threshold (e.g., 80%)
2. **Summarize**: Older turns (first 50% by token count)
3. **Preserve**: Recent context (last 20% of turns)
4. **Label**: Mark snapshot as "compacted at turn N"

```markdown
## Session Summary (Turns 1-15, compacted)

**Goal**: Implement evidence-grounded interview debrief report
**Decisions made**:
- Use streaming response for UX
- Evidence format: transcript turn IDs with short inline references
**Key files created**:
- src/services/debrief-report-service.ts
- src/shared/types.ts (extended with DebriefReport)
```

### Isolate Pattern

Delegated work must not pollute parent context:

| Pattern | Context Sharing | Best For |
|---|---|---|
| **Coordinator** (zero inheritance) | None — workers start fresh | Complex multi-phase tasks |
| **Fork** (full inheritance) | Full — single-level only | Quick parallel splits |
| **Swarm** (peer-to-peer) | Shared task list | Long-running independent work |

**Key constraint**: Fork is single-level only — recursive forks multiply context cost exponentially.

## Gotchas

1. **Most async work skips "pending" state** — work units register directly as "running"
2. **Context builders are memoized but manually invalidated** — add invalidation or face staleness
3. **Truncation is silent until it fires** — hard caps enforced at read time
4. **Isolation boundary must be enforced at call time** — don't just remove tools from prompt

## Related Patterns

- [Memory Persistence](memory-persistence-pattern.md) — How memory layers interact with context
- [Multi-agent Coordination](multi-agent-pattern.md) — Context sharing across agents

## Template: Context Budget

```markdown
## Context Budget (Session)

| Category | Budget | Current | Status |
|----------|--------|---------|--------|
| System prompt | 2,000 | 1,850 | ✓ |
| Instruction files | 3,000 | 2,400 | ✓ |
| Memory index | 1,000 | 600 | ✓ |
| Session history | 10,000 | 4,200 | ✓ |
| Working context | 15,000 | 3,100 | ✓ |
| **Total** | **31,000** | **12,150** | 39% used |

**Compaction trigger**: 80% (24,800 tokens)
**Next action**: Trigger compaction at 24,800 tokens
```

## Evidence

Context engineering patterns are observed in production agent runtimes where:
- Context budgets are explicit, not implicit
- Progressive disclosure reduces startup latency by 60-80%
- Manual cache invalidation prevents subtle staleness bugs
- Isolation patterns enable reliable multi-agent coordination
