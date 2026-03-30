# Lecture 10. Why End-to-End Testing Changes Results

## Question

Why do end-to-end tests change agent outcomes even when unit tests pass?

## Why It Matters

Unit and lint checks validate local behavior, but many high-cost failures occur
across component boundaries. In agent workflows, end-to-end testing is the main
mechanism for verifying that architecture constraints and user-facing flows hold
together as a system.

## Core Concepts

- End-to-end tests validate cross-layer contracts, not isolated functions.
- Architecture boundaries must be enforced as executable rules.
- Repeated review comments can be promoted into harness checks.
- Remediation-oriented failures improve future agent behavior.
- Linter and test error messages should be written for agents, not just humans.

## Detailed Explanation

OpenAI’s harness approach emphasizes mechanical enforcement of important
invariants. In practice, this means a rule should run automatically whenever
changes are proposed, rather than relying on manual detection during review.
End-to-end tests provide this enforcement at system level.

Anthropic’s long-running harness lessons reinforce the same point: verification
must match the scope of the task. If a task modifies user workflows or process
boundaries, unit-only verification is under-scoped. The harness should require
end-to-end evidence before accepting completion.

For Electron-style applications, boundary defects often appear only in integrated
execution:

1. Renderer code reaches directly into filesystem APIs.
2. Preload contracts are bypassed.
3. Service-layer rules are duplicated in UI components.
4. Logging is missing at process boundaries, reducing diagnosability.

End-to-end tests surface these interactions and convert architecture intent into
observable pass/fail criteria.

One particularly effective pattern from OpenAI's harness practice: **write
linter error messages for the agent, not just for humans.** When a custom
linter catches an architecture violation, the error message should include a
short remediation instruction that tells the agent exactly what to do. For
example, instead of `"Direct filesystem access in renderer"`, the message might
read `"Direct filesystem access in renderer. All file operations must go through
the preload bridge. Move this call to preload/file-ops.ts and invoke it via
window.api."`. This pattern converts structural rules into self-correcting
feedback loops — the agent sees the error and immediately knows the fix.

## Examples and Artifacts

- [`code/architecture-rules.md`](./code/architecture-rules.md): boundary rules
  that should be testable and enforceable.
- [`code/review-feedback-to-rule.md`](./code/review-feedback-to-rule.md): example
  of converting recurring review feedback into automation.
- [`code/README.md`](./code/README.md): index of lecture artifacts.

## Readings

Primary:
- OpenAI: *Harness engineering: leveraging Codex in an agent-first world*
- Anthropic: *Harness design for long-running application development*

Secondary:
- Thoughtworks: *Harness Engineering*

## Exercises

1. Select one user flow that spans renderer, preload, and service layers. Write
   an end-to-end test plan that fails if any boundary rule in
   [`code/architecture-rules.md`](./code/architecture-rules.md) is violated.
2. Identify one repeated code review comment in your project and formalize it as
   a rule, following the pattern in
   [`code/review-feedback-to-rule.md`](./code/review-feedback-to-rule.md).
3. Compare two task runs: one with unit-only verification and one with unit plus
   end-to-end verification. Record differences in escaped defects.
