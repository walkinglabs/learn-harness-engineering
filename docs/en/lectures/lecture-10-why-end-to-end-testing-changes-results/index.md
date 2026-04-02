[中文版本 →](../../../zh/lectures/lecture-10-why-end-to-end-testing-changes-results/)

> Code examples: [code/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/en/lectures/lecture-10-why-end-to-end-testing-changes-results/code/)
> Practice project: [Project 05. Self-verification and role separation](./../../projects/project-05-grounded-qa-verification/index.md)

# Lecture 10. Only a Full-Pipeline Run Counts as Real Verification

## What Problem Does This Lecture Solve?

You ask the agent to add a file export feature to an Electron app. It writes the renderer component, preload script, and service layer logic. Unit tests for each component pass. The agent says "done." You click the export button — wrong file path format, progress bar doesn't respond, memory leak on large files. Five component boundary defects, and unit tests caught zero of them.

Google's test pyramid tells us: lots of unit tests form the base, but if you stop there, you'll systematically miss component interaction issues. For AI coding agents, this problem is worse — agents tend to run the fastest tests and then declare completion. **Only end-to-end tests provide a stronger proof of system-level defect absence** than unit tests alone.

## Core Concepts

- **Component boundary defects**: Components A and B each pass unit tests individually, but their interaction produces incorrect behavior. This is the defect category end-to-end tests excel at catching.
- **Test adequacy gradient**: Defects detectable by unit tests <= defects detectable by integration tests <= defects detectable by end-to-end tests. Each layer up strengthens detection capability.
- **Architecture boundary enforcement rules**: Turn architecture document rules (like "renderer process can't directly access the filesystem") into executable automated checks.
- **Review feedback promotion**: Transform recurring code review comments into automated tests. Each newly captured defect category adds a permanent defense line — the harness automatically gets stronger over time.
- **Agent-oriented error messages**: Failure messages don't just say "what went wrong" — they tell the agent exactly how to fix it. This turns test failures into self-correcting feedback loops.

## Why This Happens

### Unit Tests' Blind Spots

Unit tests are designed around isolation — mock dependencies, focus on the unit under test. This philosophy makes unit tests fast and precise, but creates systematic blind spots:

**Interface mismatch**: The renderer passes relative file paths to the preload script, but the preload expects absolute paths. Each unit test uses mocks, each passes. Only an end-to-end run reveals the mismatch.

**State propagation errors**: A database migration changed the table structure, but the ORM's cache layer still holds entries with the old structure. Unit tests create fresh mock environments for each test and never expose this cross-layer state inconsistency.

**Resource lifecycle issues**: File handles, database connections, and network sockets are acquired and released across multiple components. Unit tests create and destroy independent resources per test, never exposing resource races or leaks.

**Environment dependency**: Code behaves correctly in the test environment (everything mocked) but fails in the real environment due to config differences, network latency, or service unavailability.

### End-to-End Testing Changes Agent Behavior Too

When the agent knows its work will be verified by end-to-end tests, its coding behavior changes:

1. **Considers component interactions**: Writes code thinking "how does this interface connect with upstream" rather than focusing only on individual functions.
2. **Respects architecture boundaries**: In systems with architecture constraints, end-to-end tests force the agent to respect boundary rules.
3. **Handles error paths**: End-to-end tests typically include failure scenarios, forcing the agent to think about error handling.

OpenAI's Codex engineering practice emphasizes: **error messages written for agents must include repair guidance.** Don't write `"Direct filesystem access in renderer"` — write `"Direct filesystem access in renderer. All file operations must go through the preload bridge. Move this call to preload/file-ops.ts and invoke it via window.api."` This turns architecture rules into a self-correcting loop.

### Review Feedback Promotion: Making the Harness Stronger Over Time

Human reviewers often give the same type of feedback repeatedly. Review feedback promotion turns this pattern into system improvement:

1. Identify recurring comment types in code review logs
2. Transform comments into executable regex patterns, AST patterns, or runtime assertions
3. Write automated checks with agent-oriented error messages
4. Integrate into the harness verification flow
5. Validate effectiveness with benchmark tasks

Every captured defect category adds a permanent defense line. The harness automatically strengthens over time.

## How to Do It Right

### 1. The Harness Must Include an End-to-End Layer

In your verification flow, make it explicit: for tasks involving cross-component modifications, end-to-end test passing is a prerequisite for completion. Write in CLAUDE.md:

```
## Verification Levels
- Level 1: Unit tests (must pass)
- Level 2: Integration tests (must pass)
- Level 3: End-to-end tests (must pass for cross-component changes)
- Skipping any required level = task not complete
```

### 2. Make Architecture Rules Executable

Every architecture constraint should have a corresponding test or lint rule:

```bash
# Check if renderer process directly calls Node.js APIs
grep -r "require('fs')" src/renderer/ && exit 1 || echo "OK: no direct fs access in renderer"
```

### 3. Design Agent-Oriented Error Messages

Failure messages should include three elements: what went wrong, why, and how to fix it:

```
ERROR: Found direct import of 'fs' in src/renderer/App.tsx:12
WHY: Renderer process has no access to Node.js APIs for security
FIX: Move file operations to src/preload/file-ops.ts and call via window.api.readFile()
```

### 4. Establish a Review Feedback Promotion Process

Every time a new type of agent error is found in code review, turn it into an automated check. A month later, your harness will be significantly stronger than it was at the start.

## Real-World Case

**Task**: Implement file export in an Electron app. Involves renderer UI, preload script filesystem proxy, service layer data transformation.

**Unit tests pass**: Renderer component tests (pass, mocked file operations), preload script tests (pass, mocked filesystem), service layer tests (pass, mocked data source). Agent declares complete.

**Defects revealed by end-to-end tests**:

| Defect | Description | Unit Tests | E2E Tests |
|--------|-------------|------------|-----------|
| Interface mismatch | File path format inconsistency | Not caught | Caught |
| State propagation | Export progress not sent back to UI via IPC | Not caught | Caught |
| Resource leak | File handle not released for large exports | Not caught | Caught |
| Permission issue | Different permissions in packaged environment | Not caught | Caught |
| Error propagation | Service layer exceptions not reaching UI layer | Not caught | Caught |

All 5 defects caught by end-to-end tests; zero caught by unit tests. Cost: test time increased from 2 seconds to 15 seconds — perfectly acceptable in an agent workflow.

## Key Takeaways

- **Unit tests are systematically blind to component boundary defects** — their isolation design is exactly what prevents them from detecting interaction issues.
- **End-to-end testing doesn't just detect defects — it changes how the agent codes** — more attention to integration and boundaries.
- **Architecture rules must be executable** — not written in docs waiting for someone to read, but automatically checked on every change.
- **Error messages should be designed for agents** — include concrete "how to fix" steps to form a self-correcting loop.
- **Review feedback promotion makes the harness automatically stronger** — every captured defect category becomes a permanent defense line.

## Further Reading

- [How Google Tests Software - Whittaker et al.](https://www.goodreads.com/book/show/13563030-how-google-tests-software) — The classic source for the test pyramid model
- [Harness Engineering - OpenAI](https://openai.com/index/harness-engineering/) — Engineering practices for automated architecture constraint enforcement
- [Chaos Engineering - Netflix (Basiri et al.)](https://ieeexplore.ieee.org/document/7466237) — Proactively injecting failures to verify system resilience
- [QuickCheck - Claessen & Hughes](https://www.cs.tufts.edu/~nr/cs257/archive/john-hughes/quick.pdf) — Property-based testing, between example tests and formal verification

## Exercises

1. **Cross-Component Defect Detection**: Pick a modification task involving at least three components. Run only unit tests first and record results, then run end-to-end tests. Analyze each additionally discovered defect's cross-layer interaction type.

2. **Architecture Rule Automation**: Pick an architecture constraint from your project and turn it into an executable check (with agent-oriented error messages). Integrate into the harness and validate with a benchmark task.

3. **Review Feedback Promotion**: Find a recurring comment type from code review history and follow the five-step process to turn it into an automated check. Compare occurrence frequency before and after promotion.
