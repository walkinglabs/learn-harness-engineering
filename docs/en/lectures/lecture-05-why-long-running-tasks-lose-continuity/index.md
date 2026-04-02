[中文版本 →](../../../zh/lectures/lecture-05-why-long-running-tasks-lose-continuity/)

> Code examples: [code/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/en/lectures/lecture-05-why-long-running-tasks-lose-continuity/code/)
> Practice project: [Project 03. Multi-session continuity](./../../projects/project-03-multi-session-continuity/index.md)

# Lecture 05. Keep Context Alive Across Sessions

You ask Claude Code to implement a complete feature. It runs for 30 minutes, does most of the work, but context is running low. You start a new session to continue — and discover it doesn't remember what decisions were made last time, why option A was chosen over option B, which files were already modified, or what state the tests are in. It spends 15 minutes re-exploring the project, and might be inconsistent with the previous approach.

Imagine if you were a craftsman who forgot everything each morning upon waking. You'd have to reacquaint yourself with the entire construction site — which wall is half-built, why red bricks were chosen over blue ones, where the plumbing runs got to. Worse, you might tear out a window that was already installed yesterday, simply because you didn't remember it was done.

This is exactly the predicament AI coding agents face in cross-session tasks. This lecture explains why agents "black out" during long tasks, and how structured state persistence can make them like a craftsman who keeps a reliable daily journal — still amnesiac, but the journal remembers everything.

## Context Windows: Not Infinite

Context windows are finite. This isn't solvable by model upgrades — even if window sizes grow to 1M tokens, complex tasks will still exhaust them. Because agents aren't just generating code; they're understanding codebases, tracking their own decision history, processing tool output, and maintaining conversation context. All this information grows faster than window expansion.

A deeper problem: information the agent produces isn't uniformly important. Intermediate reasoning steps contain the "why" of decisions — why option B was chosen over A, why this library instead of that one, why a particular optimization was skipped. The final output only contains the "what" — the code itself. Compaction strategies usually preserve the latter but lose the former. The next session sees the code but doesn't know why it's written that way, and might "optimize" away a deliberate design decision.

Anthropic discovered something fascinating in their long-running agent research: when agents sense context is running low, they exhibit "premature convergence" behavior — rushing to finish current work, skipping verification steps, or choosing a simple solution over the optimal one. It's like realizing time is running out on an exam and quickly guessing on the remaining multiple-choice questions. Anthropic calls this "context anxiety."

## Session Continuity Flow

Without continuity artifacts, every new session is a disaster:

```mermaid
flowchart LR
    S1["Session 1<br/>feature is half done"] --> End1["Context is nearly full<br/>session ends"]
    End1 --> S2["Session 2 starts fresh"]
    S2 --> Guess["Re-read folders, rerun tests,<br/>guess why the code was written this way"]
    Guess --> Drift["Work gets repeated<br/>and recovery is slow"]
```

With continuity artifacts, new sessions can pick up quickly:

```mermaid
flowchart LR
    Work["Session 1 work"] --> Progress["PROGRESS.md<br/>done / in progress / next step"]
    Work --> Decisions["DECISIONS.md<br/>why this approach was chosen"]
    Work --> Verify["Verification notes<br/>which tests pass and fail"]
    Work --> Commit["Git checkpoint<br/>exact repo state"]

    Progress --> Rebuild["Session 2 rebuild"]
    Decisions --> Rebuild
    Verify --> Rebuild
    Commit --> Rebuild

    Rebuild --> Resume["New session picks up quickly"]
```

## Core Concepts

- **Context windows are finite**: No matter what window size is claimed (128K, 200K, 1M), long tasks will eventually exhaust them. After exhaustion, either compaction (losing information) or reset (new session) is required. Both lose something.
- **Continuity artifacts**: Persisted state files that let a new session unambiguously resume where the last one left off. The basic form: progress log + verification record + next actions. That craftsman's journal.
- **Rebuild cost**: The time a new session needs to reach an executable state. Good harnesses can compress rebuild cost from 15 minutes to 3 minutes.
- **Drift**: The gap between the agent's understanding and the actual state of the code repository. Every session boundary introduces drift; without control, it compounds.
- **Context anxiety**: A phenomenon observed by Anthropic — agents exhibit premature convergence behavior when approaching perceived context limits, ending tasks early to avoid information loss. It's an irrational resource anxiety.
- **Compaction vs reset**: Compaction summarizes context within the same session (keeps "what," may lose "why"); reset opens a new session rebuilding from persisted state (clean but depends on artifact completeness).

## What Happens When Continuity Breaks

The previous session spent significant context budget analyzing three approaches and choosing option B. This session's agent doesn't know about that analysis and might re-decide based on incomplete information — potentially choosing option A. Like the amnesiac craftsman who doesn't remember why red bricks were chosen, looks at the blue ones today and thinks they're prettier, and tears down yesterday's wall to rebuild.

Even worse is duplicate work. The agent isn't sure whether certain work was already completed and does it again. Or worse — does half of it, discovers a conflict with the existing implementation, and has to rework. On a construction site, two teams can't build the same wall simultaneously — but without progress records, the new crew has no idea someone is already working on it.

Over several sessions, the implementation direction may have silently drifted from the original requirements. Each new session has a slightly different understanding of the project goals. Like a game of telephone — after ten people pass the message, "pick me up a coffee" might become "buy me a coffee machine."

There's also the verification gap. The previous session's verification results (which tests pass, which fail, why they fail) weren't recorded. The new session has to re-run all verification to understand the current state. Every session re-diagnoses from scratch, every time wasting precious context.

Both OpenAI and Anthropic emphasize structured state persistence in their documentation. OpenAI's harness engineering article treats the repository as an "operational record" — every operation's results should leave traceable evidence in the repo. Anthropic's long-running agents documentation specifically recommends "handoff files" — structured documents containing current state, known issues, and next actions.

## A Journal for the Amnesiac Craftsman

Core approach: **Treat the agent like a brilliant engineer with amnesia.** Before it "clocks out," it must write down critical information so the next "shift" agent can pick up quickly.

**Tool 1: Progress file (PROGRESS.md).** The most basic continuity artifact — the core of the journal:

```markdown
# Project Progress

## Current State
- Latest commit: abc1234 (feat: add user preferences endpoint)
- Test status: 42/43 passing (test_pagination_edge_case failing)
- Lint: passing

## Completed
- [x] User model and database migration
- [x] Basic CRUD endpoints
- [x] Auth middleware integration

## In Progress
- [ ] Pagination feature (90% - edge case test failing)

## Known Issues
- test_pagination_edge_case returns 500 on empty result sets
- Need to confirm whether deleted users should appear in listings

## Next Steps
1. Fix pagination edge case bug
2. Add "include deleted users" query parameter
3. Update API documentation
```

**Tool 2: Decision log (DECISIONS.md).** Record important design decisions and reasons. No need for detailed design documents — just "what decision, why, when" — the memos in the journal:

```markdown
# Design Decisions

## 2024-01-15: Use Redis for user preferences caching
- Reason: High read frequency (every API call), small data size
- Rejected alternative: PostgreSQL materialized view (high change frequency makes maintenance cost not worthwhile)
- Constraint: Cache TTL of 5 minutes, active invalidation on write
```

**Tool 3: Git commits as checkpoints.** Commit after completing each atomic unit of work. Commit messages should explain what was done and why. These are free, automatically versioned state snapshots.

**Tool 4: init.sh or harness initialization flow.** Specify in `AGENTS.md` the "clock-in" and "clock-out" routines:

```markdown
## At session start (clock in)
1. Read PROGRESS.md for current state
2. Read DECISIONS.md for important decisions
3. Run make check to confirm repo is in consistent state
4. Continue from PROGRESS.md "Next Steps" section

## Before session end (clock out)
1. Update PROGRESS.md
2. Run make check to confirm consistent state
3. Commit all completed work
```

**Mixed strategy**: Not every task needs a context reset. Short tasks (under 30 minutes) can complete within one session. Long tasks (spanning sessions) must use progress files and decision logs for continuity. Decision criterion: if a task needs more than 60% of the window, start preparing handoff.

### Deep Dive on Context Anxiety

Anthropic's March 2026 research further revealed the specific manifestations of context anxiety: on Sonnet 4.5, when context approaches the window limit, the agent shows strong "premature convergence" behavior. It's like realizing time is almost up on an exam and quickly filling in random answers on the multiple choice.

Two strategies address this:

**Compaction**: Summarizing early conversation within the same session. Advantage: maintains continuity, the agent can see "what." Disadvantage: "why" is often lost in summaries — why option B was chosen over A, why a particular optimization was skipped. More critically, compaction doesn't eliminate context anxiety — the agent knows context was once large, and psychologically still tends to rush to closure.

**Context reset**: Completely clearing context, opening a new session, rebuilding from persisted artifacts. Advantage: clean mental state — the new session has no "I'm running out of time" anxiety. Disadvantage: depends on the completeness of handoff artifacts. If the journal is missing critical information, the new session may waste time going in the wrong direction.

Anthropic's actual data: for Sonnet 4.5, context anxiety is severe enough that compaction alone isn't sufficient — context reset becomes a critical component of harness design. But for Opus 4.5, this behavior is greatly diminished, and compaction can manage context without relying on resets. This means: **harness design needs specific understanding of the target model, not a one-size-fits-all template.**

> Source: [Anthropic: Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)

## Real-World Example

An agent was tasked with implementing a blog system with user authentication — 12 feature points, estimated 5 sessions needed.

**Baseline without the journal**: Session 1 implemented the user model and basic routes. Session 2 started without the agent remembering the auth middleware's interface contract, spending ~15 minutes inferring the previous design intent. By session 3, accumulated drift caused the agent to start reimplementing already-completed features. By session 5, the repo contained lots of redundant code but the core auth feature still hadn't passed end-to-end tests. Only 7 of 12 feature points completed, 3 with hidden correctness issues. Like the craftsman who never writes in his journal — by day five, the construction site is chaos, some walls built twice, some that should have been built never started.

**With the journal**: Using progress files, decision logs, verification records, and git checkpoints. State report updated automatically at each session end. Session 2's rebuild cost dropped to ~3 minutes. By session 5, all 12 feature points completed and verified.

Quantitative comparison: rebuild time reduced ~78%, feature completion rate from 58% to 100%, hidden defect rate from 43% down to 8%. The craftsman is still amnesiac, but with the journal, each day starts from where yesterday stopped, not from zero.

## Key Takeaways

- Context windows are a finite resource. Long tasks will span sessions, and sessions will lose information — like the craftsman who forgets each day, this is objective reality.
- The solution isn't bigger windows — it's better state persistence. Progress files + decision logs + git checkpoints — give the amnesiac craftsman a reliable journal.
- Treat the agent like an engineer with amnesia: before "clocking out," write down what was done, why, and what's next.
- Rebuild cost is the key metric. Good harnesses should get new sessions to an executable state within 3 minutes.
- Mixed strategy: short tasks within sessions, long tasks with structured artifacts for continuity.

## Further Reading

- [Anthropic: Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [OpenAI: Harness Engineering](https://openai.com/index/harness-engineering/)
- [Lost in the Middle: How Language Models Use Long Contexts](https://arxiv.org/abs/2307.03172)
- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code)
- [HumanLayer: Harness Engineering for Coding Agents](https://humanlayer.dev/articles/harness-engineering-for-coding-agents/)

## Exercises

1. **Continuity loss measurement**: Pick a development task needing at least 3 sessions. Without providing any continuity artifacts, record at each session start how much context the agent spends "figuring out what happened last time." After each session, create a progress file and let the next session start from it. Compare rebuild costs with and without progress files.

2. **Handoff template design**: Design a minimal handoff template with four fields: repo state (commit hash), runtime state (test pass rate), blockers, next actions. Let a completely fresh agent session restore project state using only this template. Record ambiguities encountered during restoration, iterate to improve the template.

3. **Mixed strategy experiment**: In a 5-session development task, compare three strategies: (a) always start fresh sessions + progress files, (b) do as much as possible in one session (context compaction), (c) mixed strategy (short tasks in-session, long tasks across sessions + progress files). Compare rebuild time, feature completion rate, and decision consistency.
