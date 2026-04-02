[中文版本 →](../../../zh/lectures/lecture-12-why-every-session-must-leave-a-clean-state/)

> Code examples: [code/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/en/lectures/lecture-12-why-every-session-must-leave-a-clean-state/code/)
> Practice project: [Project 06. Complete harness (Capstone)](./../../projects/project-06-runtime-observability-and-debugging/index.md)

# Lecture 12. Clean Handoff at the End of Every Session

## What Problem Does This Lecture Solve?

Your agent runs all afternoon, modifies 20 files, commits the code, session ends. The next agent session starts and immediately discovers: build is broken, tests are red, temporary debug files are everywhere, the feature list wasn't updated, and progress is completely unclear. The new session spends its first 30 minutes just figuring out "what did the last session actually do."

Both OpenAI and Anthropic state clearly: **long-term reliability depends on operational discipline, not just single-run success.** The quality of state at session exit directly determines the next session's efficiency. Think of it like Git best practices — every commit should be an atomic, compilable change, not a pile of half-finished code.

## Core Concepts

- **Clean state**: The system satisfies five conditions at session end — build passes, tests pass, progress recorded, no stale artifacts, startup path available. Missing any one means the session isn't "done."
- **Session integrity**: Analogous to database transactions — either fully commit and leave a clean state, or roll back to the last consistent state. No middle ground.
- **Quality document**: An active artifact that continuously records quality ratings for each module. Not a one-time assessment, but a tracker showing whether the codebase is getting stronger or weaker over time.
- **Cleanup loop**: A regular maintenance session aimed at systematically reducing entropy in the codebase. Not an emergency fix, but routine operations.
- **Harness simplification**: As model capabilities improve, periodically remove harness components that are no longer necessary. A constraint essential today may be unnecessary overhead in three months.
- **Idempotent cleanup**: Cleanup operations produce the same result regardless of how many times they run. Ensures cleanup remains safe even in failure-retry scenarios.

## Why This Happens

### Entropy Growth Is the Default State

Lehman's laws of software evolution tell us: systems undergoing continuous change will inevitably increase in complexity unless actively managed. This is especially true for AI coding agents — every session introduces changes, and without cleanup at exit, technical debt accumulates exponentially.

Real data is telling. A project developed with agents for 12 weeks, without cleanup strategy:

- Week 1: Build pass rate 100%, test pass rate 100%, new session startup 5 min
- Week 4: Build 95%, tests 92%, startup 15 min
- Week 8: Build 82%, tests 78%, startup 35 min
- Week 12: Build 68%, tests 61%, startup 60+ min

Same project with a cleanup strategy:

- Week 1: 100%, 100%, 5 min
- Week 12: 97%, 95%, 9 min

After 12 weeks: build pass rate differs by 29 percentage points, new session startup time differs by 85%. This is not theoretical — it's an observed difference.

### Five Dimensions of Clean State

Clean state isn't just "the code compiles." It's five dimensions evaluated together:

**Build dimension**: Does the code build without errors? This is the most basic — the next session shouldn't have to fix build errors first.

**Test dimension**: Do all tests pass? Including tests that existed before the session — the session is responsible for not breaking existing functionality. And it should be verified in CI, not just "works on my machine."

**Progress dimension**: Is current progress recorded in a machine-readable artifact? Completed subtasks with their passing criteria, in-progress but incomplete subtasks with current state, not-yet-started subtasks. Good progress records reduce 60-80% of session startup diagnostic time.

**Artifact dimension**: Are there stale or ambiguous temporary artifacts? Debug logs, temporary files, commented-out code, TODO markers — all of these increase cognitive load for the next session.

**Startup dimension**: Is the standard startup path available? Can the next session start working without manual intervention? Environment initialization, codebase loading, context acquisition, task selection — these paths must not be broken.

### "Clean Up Later" Means Never Clean Up

The most common mental trap is "no time to clean up this session, I'll do it next time." But the next agent session doesn't know what you left behind — it sees a mess of code and uncertain state. It'll spend significant time inferring "which parts of this code are intentional and which are temporary."

Worse, every session has its own task objectives. The new session is there to do new work, not clean up the previous session's mess. It'll ignore the chaos and start new work on top of it, introducing more chaos on top of chaos. This is entropy's positive feedback loop.

## How to Do It Right

### 1. Clean State as a Completion Requirement

Define explicitly in the harness: **session completion = task passes verification AND clean state check passes.** Missing either one means the session isn't complete. Write in CLAUDE.md:

```
## Session Exit Checklist
- [ ] Build passes (npm run build)
- [ ] All tests pass (npm test)
- [ ] Feature list updated
- [ ] No debug code remaining (console.log, debugger, TODO)
- [ ] Standard startup path available (npm run dev)
```

### 2. Dual-Mode Cleanup Strategy

Combine two cleanup modes:

**Immediate cleanup (at end of every session)**: Clean up temporary artifacts created during the session, update feature list state, ensure build and tests pass. This is "reference counting" cleanup.

**Periodic cleanup (weekly)**: Full-system scan — handle accumulated structural issues, update quality documents, run benchmark tests to detect drift. This is "tracing" cleanup.

### 3. Maintain a Quality Document

A quality document is an active artifact that continuously scores each module:

```markdown
# Quality Document

## User Authentication Module (Quality: A)
- Verification passing: Yes
- Agent understandable: Yes
- Test stability: Stable
- Architecture boundaries: Compliant
- Code conventions: Followed

## Payment Module (Quality: C)
- Verification passing: Partial (payment callback untested)
- Agent understandable: Difficult (logic spread across 3 files)
- Test stability: Unstable (2 flaky tests)
- Architecture boundaries: Violations present
- Code conventions: Partially followed
```

New sessions read this document and immediately know where to prioritize. Fix the lowest-scoring module first.

### 4. Periodically Simplify the Harness

An important insight from Anthropic: **every harness component exists because the model can't reliably do something on its own. But as models improve, these assumptions become outdated.** A constraint essential three months ago may be unnecessary overhead today.

Recommended practice: Every month, pick one harness component, temporarily disable it, and run benchmark tasks. If results don't degrade, remove it permanently. If they do, restore it or replace with a lighter alternative.

### 5. Cleanup Operations Must Be Idempotent

Cleanup scripts should be safe to run repeatedly:

```bash
# Idempotent cleanup operations
rm -f /tmp/debug-*.log  # -f ensures no error when files don't exist
git checkout -- .env.local  # Restore to known state
npm run test  # Verify cleanup didn't break anything
```

## Real-World Case

An Electron app developed with agents over 12 weeks, comparing two approaches:

**Without cleanup strategy** (control group): Week 12, build pass rate 68%, test pass rate 61%, new session startup 60+ min, stale artifacts 103.

**With cleanup strategy** (experimental group): Full clean-state check at every session end + weekly cleanup loop. Week 12, build pass rate 97%, test pass rate 95%, new session startup 9 min, stale artifacts 11.

By week 12, the experimental group's build pass rate is 29 percentage points higher, test pass rate 34 points higher, and new session startup time 85% lower.

## Key Takeaways

- **Clean state is a necessary condition for session completion** — not optional housekeeping, but part of the "definition of done."
- **All five dimensions are required** — build, tests, progress, artifacts, startup — each must be explicitly checked.
- **Quality documents make codebase health trackable** — you can only fix what you know is degrading.
- **Periodically simplify the harness** — as model capabilities improve, remove constraints that are no longer needed.
- **"Clean up later" equals never cleaning up** — entropy growth is the default; only active cleanup counteracts it.

## Further Reading

- [Clean Code - Robert C. Martin](https://www.goodreads.com/book/show/3735293-clean-code) — Systematic principles of code cleanliness
- [Harness Engineering - OpenAI](https://openai.com/index/harness-engineering/) — Reproducibility as a core harness design requirement
- [Effective Harnesses - Anthropic](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) — The critical role of clean session exits for long-term reliability
- [Programs, Life Cycles, and Laws of Software Evolution - Lehman](https://ieeexplore.ieee.org/document/1702314) — Software evolution laws proving system complexity inevitably grows without active maintenance

## Exercises

1. **Clean State Checklist**: Design a session exit checklist for your codebase covering all five dimensions. Apply it across 5 consecutive sessions and record violations per dimension.

2. **Benchmark Comparison**: Use a fixed task set with two harness variants (with/without clean state requirements). Compare completion rate, retry count, and defect escape rate.

3. **Harness Simplification Practice**: Pick one harness component, temporarily disable it, and run benchmark tasks. Compare results with and without it. Decide whether to keep, remove, or replace.
