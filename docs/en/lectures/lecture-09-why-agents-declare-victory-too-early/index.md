[中文版本 →](../../../zh/lectures/lecture-09-why-agents-declare-victory-too-early/)

> Code examples: [code/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/en/lectures/lecture-09-why-agents-declare-victory-too-early/code/)
> Practice project: [Project 05. Self-verification and role separation](./../../projects/project-05-grounded-qa-verification/index.md)

# Lecture 09. Stop Agents from Declaring Victory Early

## What Problem Does This Lecture Solve?

You ask the agent to implement a "password reset" feature. It modifies the database schema, writes the API endpoint, adds email templates, runs the unit tests (all green), and confidently tells you "done." But when you actually test it — the reset link can't be sent (email service config missing), the database migration fails halfway through (schema inconsistency), and the end-to-end flow was never exercised once.

This isn't a random event. Guo et al.'s classic 2017 ICML paper proved that **modern neural networks are systematically overconfident** — the model's reported confidence significantly exceeds its actual accuracy. AI coding agents are no different: they "feel" done when they're far from it. Your harness must replace the agent's "feeling" with externalized, execution-based verification.

## Core Concepts

- **Premature completion declaration**: The agent asserts the task is done, but correctness specifications remain unsatisfied. Core issue: the agent judges based on local code-level confidence; system-level correctness requires global verification.
- **Confidence calibration gap**: The systematic difference between the agent's self-reported completion confidence and actual completion quality. For complex multi-file tasks, this gap is significantly positive — agents are always more confident than they should be.
- **Termination criteria**: A set of explicit, executable judgment conditions defined in the harness. The agent must satisfy all conditions before declaring completion. "Done" transforms from a subjective judgment to an objective determination.
- **Verification-Validation dual gate**: First layer (verification) checks "does the code correctly implement the specified behavior"; second layer (validation) checks "does the system-level behavior meet end-to-end requirements." Both must pass.
- **Runtime feedback signals**: Logs, process states, health checks from program execution. These are the harness's objective basis for judging completion quality — not optional debugging tools.
- **Completion priority constraint**: Verify functional correctness first, then performance, then style. No refactoring allowed until core functionality is verified.

## Why This Happens

### The Four-Step Slippery Slope of Agent Completion

Premature completion declarations almost always follow the same sequence:

1. **Local code looks fine**: Syntax is correct, logic seems reasonable. No obvious errors at the static inspection level.
2. **Runtime behavior insufficiently observed**: The harness didn't require comprehensive execution verification, so the agent skipped actually running the code or only ran partial tests.
3. **Verification skipped or incomplete**: Ran unit tests but skipped integration tests, or ran tests without checking coverage adequacy.
4. **Completion assertion based on insufficient evidence**: "The code looks fine" is treated as evidence of "feature complete."

Every step loses information. From task specification to code implementation to runtime behavior, each transition can introduce bias, and every skipped verification widens the information asymmetry.

### Unit Tests Passing != Task Complete

This is the most common trap. The agent writes code, runs unit tests, all green, then says "done." But unit tests are designed to isolate the unit under test and mock dependencies — exactly the philosophy that makes them unable to detect cross-component issues:

- **Interface mismatch**: A calls B with correctly-formatted parameters, but B's actual behavior doesn't match A's assumptions. Each unit test passes separately; together they break.
- **State propagation errors**: A database migration changed the table structure, but the cache layer still holds entries with the old structure. Unit tests don't test cross-layer state.
- **Environment dependency**: Code behaves correctly in the test environment (everything mocked) but fails in the real environment due to config differences, network latency, or unavailable services.

### "Refactoring While You're at It" Poisons Completion

Claude Code has a common behavior pattern: it starts refactoring code, optimizing performance, or improving style before the core functionality has passed verification. Knuth's "premature optimization is the root of all evil" takes on new meaning for agents — refactoring changes the boundary between verified and unverified code, potentially breaking code paths that were implicitly correct.

## How to Do It Right

### 1. Externalize Termination Judgment

Completion judgment shouldn't be made by the agent itself. The harness independently executes termination checks, taking runtime signals as input — not the agent's confidence. Write in CLAUDE.md:

```
## Definition of Done
- Feature complete = end-to-end verification passes, NOT "code is written"
- Required verification levels:
  1. Unit tests pass
  2. Integration tests pass
  3. End-to-end flow verification passes
- Don't proceed to level 2 until level 1 passes
- Don't proceed to level 3 until level 2 passes
```

### 2. Build a Three-Layer Termination Check

- **Layer 1: Syntax and static analysis**. Lowest cost, least information, but must pass.
- **Layer 2: Runtime behavior verification**. Test execution, application startup checks, critical path verification. This is the core completion evidence.
- **Layer 3: System-level validation**. End-to-end tests, integration verification, user scenario simulation. The last line of defense against premature declarations.

### 3. Design Error Messages for Agents

OpenAI's Codex practice highlights a particularly effective pattern: **error messages written for agents should include repair guidance.** Don't use `"Test failed"` — use `"Test failed: POST /api/reset-password returned 500. Check that the email service config exists in environment variables. The template file should be at templates/reset-email.html."` This specific, actionable feedback lets the agent self-correct without human intervention.

### 4. Concrete Forms of Runtime Signals

Effective runtime signals include:

- Did the application successfully start and reach a ready state?
- Do critical feature paths execute successfully at runtime?
- Are database writes, file operations, and other side effects correct?
- Are temporary resources cleaned up?

## Real-World Case

**Task**: Implement user password reset. Involves database operations, email sending, and API endpoint modifications.

**Premature declaration path**: Agent modifies the database schema, writes the API endpoint, adds email templates, runs unit tests (all pass), declares complete.

**Actual defects**: (1) End-to-end flow untested — actual sending and verification of reset links never confirmed. (2) Database migration fails after partial execution, leaving inconsistent schema. (3) Email service config missing in the target environment.

**Harness intervention**: Termination check enforces — (1) start full application and verify reset endpoint is accessible; (2) execute complete reset flow; (3) verify database state consistency. All defects caught within the session, saving 5-10x the cost of finding them later.

## Key Takeaways

- **Agents are systematically overconfident** — the confidence calibration gap is real and measurable, not a subjective impression.
- **Completion judgment must be externalized** — the harness verifies independently; don't trust the agent's "feeling."
- **All three verification layers are essential** — syntax passes, behavior passes, system passes, layer by layer.
- **Error messages should be designed for agents** — include specific repair steps so the agent can self-correct.
- **No refactoring until core functionality verification passes** — the completion priority constraint is key to preventing premature optimization.

## Further Reading

- [On Calibration of Modern Neural Networks - Guo et al.](https://arxiv.org/abs/1706.04599) — Proves modern deep networks are systematically overconfident
- [Building Effective Agents - Anthropic](https://www.anthropic.com/research/building-effective-agents) — The critical role of runtime evidence in completion judgment
- [Harness Engineering - OpenAI](https://openai.com/index/harness-engineering/) — Premature completion as one of the main agent failure modes
- [The Art of Software Testing - Myers](https://www.goodreads.com/book/show/137543.The_Art_of_Software_Testing) — Classic reference on test method layers and effectiveness

## Exercises

1. **Termination Check Design**: Design a complete termination check for a task involving database migration and API modifications. List the runtime signals needed and pass/fail criteria for each. Run it on a real task and record what hidden issues it uncovers.

2. **Calibration Gap Measurement**: Pick 10 coding tasks of different types. Record the agent's self-reported completion confidence and actual completion quality. Calculate the gap and analyze its relationship with task complexity.

3. **Multi-Layer Defense Experiment**: Run three configurations on the same task set — (a) static analysis only, (b) plus unit tests, (c) full three-layer check. Compare premature declaration rates and uncaught defect counts.
