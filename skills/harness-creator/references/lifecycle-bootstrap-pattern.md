# Lifecycle and Bootstrap Pattern

## Problem

Agent runtimes need extensibility without compromising safety:

- **Hooks** — Extend behavior at lifecycle moments (pre/post tool execution, session start/end)
- **Background tasks** — Track long-running work without blocking the main agent
- **Bootstrap** — Structure initialization across multiple entry modes (CLI, server, SDK)

But uncontrolled extensibility creates:
- Security holes from untrusted hooks
- Resource leaks from tasks that never complete
- Race conditions in initialization

## Golden Rules

### Hook Trust is All-or-Nothing

If the workspace is untrusted, **all hooks skip** — not just suspicious ones. Session-scoped hooks are ephemeral and cleaned on session end.

```typescript
// Example: Hook dispatch with trust gate
async function dispatchHook(
  hookType: HookType,
  context: HookContext
): Promise<HookResult[]> {
  
  // Trust gate: if workspace untrusted, skip ALL hooks
  if (!context.trustBoundary.crossed) {
    logger.warn('Untrusted workspace, skipping hooks');
    return [];
  }
  
  // Session-scoped hooks ephemeral — cleanup on session end
  const sessionHooks = context.hooks.getByScope('session');
  const projectHooks = context.hooks.getByScope('project');
  
  return await Promise.all([
    ...sessionHooks.map(h => h.execute(context)),
    ...projectHooks.map(h => h.execute(context)),
  ]);
}
```

### Long-Running Work: Typed State Machines with Two-Phase Eviction

Each work unit gets:
1. **Typed, prefixed ID** (e.g., `extractor-001`, `benchmark-002`)
2. **Strict lifecycle** (running → completed | failed | killed)
3. **Disk-backed output** (not just in-memory)

Eviction is two-phase:
1. **Disk output** cleaned eagerly at terminal state
2. **In-memory records** cleaned lazily after parent notified

### Bootstrap: Dependency-Ordered, Memoized Stages

Multiple entry modes (CLI, server, SDK) share the same bootstrap path:

```
Stage 1: Create minimal context (no trust required)
  ↓
Stage 2: Load tools (read-only safe)
  ↓
Stage 3: Trust boundary crossed (user grants consent)
  ↓
Stage 4: Load security-sensitive subsystems (telemetry, secret env vars)
```

**Critical inflection**: Security-sensitive subsystems must not activate before trust is established.

## When To Use

- You need to extend agent behavior without modifying core code
- You need to track long-running background work
- You need structured initialization across multiple entry modes
- You need hooks at lifecycle moments (pre/post tool, session start/end)

## Tradeoffs

| Decision | Benefit | Cost |
|---|---|---|
| All-or-nothing hook trust | Simple security boundary | One untrusted hook disables entire extension system |
| Disk-backed task output | Memory constant regardless of concurrent work | I/O latency proportional to work units |
| Dependency-ordered bootstrap | Multiple entry modes share path | Initial startup sequential (can't parallelize stages) |
| Memoized stages | Re-init is fast | Must carefully invalidate memoization on config change |

## Implementation Patterns

### Hook Lifecycle

Six hook types dispatched at defined moments:

```typescript
interface HookRegistry {
  // Session lifecycle
  onSessionStart: (context: SessionContext) => Promise<void>;
  onSessionEnd: (context: SessionContext) => Promise<void>;
  
  // Tool execution
  preToolExecute: (context: ToolContext) => Promise<ToolContext>;
  postToolExecute: (context: ToolResult) => Promise<ToolResult>;
  
  // Prompt submission
  prePromptSubmit: (context: PromptContext) => Promise<PromptContext>;
  postPromptSubmit: (context: ResponseContext) => Promise<ResponseContext>;
}

// Usage: Register hooks via config
// /update-config hooks.preToolExecute = "scripts/audit-tool-call.js"
```

### Long-Running Task Tracking

```typescript
interface TaskRegistry {
  // Typed prefixed IDs
  registerWork(
    type: 'transcript-parse' | 'benchmark' | 'debrief-analysis',
    outputType: 'json' | 'text' | 'file'
  ): string; // Returns typed ID: `extraction-001`
  
  // Strict state machine
  updateState(
    taskId: string,
    state: 'running' | 'completed' | 'failed' | 'killed',
    output?: any
  ): void;
  
  // Two-phase eviction
  evictTask(taskId: string): void;
  // 1. Clean disk output (eager, at terminal state)
  // 2. Clean in-memory record (lazy, after parent notified)
}
```

### Bootstrap Sequence

```typescript
// Example: Dependency-ordered initialization
class AgentBootstrap {
  private stages = new Map<string, Stage>();
  private memoizedCallers = new Map<string, any>();
  
  async bootstrap(entryMode: 'cli' | 'server' | 'sdk'): Promise<AgentContext> {
    
    // Stage 1: Minimal context (no trust required)
    await this.runStage('minimal-context', async () => {
      return {
        cwd: process.cwd(),
        entryMode,
        trustBoundary: { crossed: false },
      };
    });
    
    // Stage 2: Load tools (read-only safe)
    await this.runStage('load-tools', async (context) => {
      context.tools = await this.loadSafeTools();
      return context;
    });
    
    // Stage 3: Trust boundary (user grants consent)
    await this.runStage('trust-boundary', async (context) => {
      const consent = await this.requestConsent();
      context.trustBoundary = { crossed: consent };
      return context;
    });
    
    // Stage 4: Security-sensitive subsystems (requires trust)
    if (context.trustBoundary.crossed) {
      await this.runStage('load-sensitive', async (context) => {
        context.telemetry = await this.loadTelemetry();
        context.secretEnvVars = await this.loadSecrets();
        return context;
      });
    }
    
    return context;
  }
  
  private async runStage(
    name: string,
    fn: (context: AgentContext) => Promise<AgentContext>
  ): Promise<void> {
    // Memoized: skip if already run
    if (this.stages.has(name) && this.stages.get(name).complete) {
      return;
    }
    
    // Run stage
    const stage = { name, complete: false, running: true };
    this.stages.set(name, stage);
    
    try {
      await fn(this.context);
      stage.complete = true;
    } finally {
      stage.running = false;
    }
  }
}
```

## Gotchas

1. **Hook trust is all-or-nothing** — One untrusted hook disables entire extension system
2. **Most async work skips "pending" state** — Work units register directly as "running"
3. **Eviction requires notification** — Terminal work unit only GC-eligible after parent notified
4. **Fast-path dispatch** — Memoized callers must handle concurrent calls without re-running stages
5. **Hook types must be disjoint** — Don't create overlapping hook scopes

## Related Patterns

- [Tool Registry](tool-registry-pattern.md) — How tools are registered at bootstrap
- [Memory Persistence](memory-persistence-pattern.md) — How memory is loaded at init

## Template: Bootstrap Checklist

Before declaring bootstrap complete:

```markdown
## Bootstrap Verification

### Stage 1: Minimal Context
- [ ] Working directory confirmed
- [ ] Entry mode determined (cli / server / sdk)
- [ ] Trust boundary NOT crossed (no secrets loaded)

### Stage 2: Tools Loaded
- [ ] Read-only tools registered (read, search, glob)
- [ ] Write tools NOT yet registered (edit, shell)
- [ ] Tool permissions set to default (ask / deny)

### Stage 3: Trust Boundary
- [ ] User consent requested (interactive or config flag)
- [ ] Consent recorded in session state
- [ ] Security audit logged

### Stage 4: Sensitive Subsystems
- [ ] Telemetry initialized (if consent given)
- [ ] Secret env vars loaded (if consent given)
- [ ] Write tools registered (edit, shell, exec)
- [ ] Hook system enabled (if workspace trusted)

### Stage 5: Background Tasks
- [ ] Task registry initialized
- [ ] Cleanup handlers registered
- [ ] Drain-on-shutdown configured

## If Any Stage Fails

- Bootstrap halts immediately
- Session remains in safe mode (read-only)
- Error logged with stage name and failure reason
```

## Evidence

Lifecycle and bootstrap patterns are observed in production runtimes where:
- Hook dispatch is all-or-nothing based on workspace trust
- Long-running tasks use typed prefixed IDs and disk-backed output
- Bootstrap is dependency-ordered with memoized stages
- Trust boundary is explicit inflection point for security-sensitive subsystems
