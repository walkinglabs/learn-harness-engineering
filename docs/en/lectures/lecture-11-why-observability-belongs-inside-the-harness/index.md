[中文版本 →](/zh/lectures/lecture-11-why-observability-belongs-inside-the-harness/)

> Code examples: [code/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/en/lectures/lecture-11-why-observability-belongs-inside-the-harness/code/)
> Practice project: [Project 06. Complete harness (Capstone)](./../../projects/project-06-runtime-observability-and-debugging/index.md)

# Lecture 11. Make the Agent's Runtime Observable

## What Problem Does This Lecture Solve?

You ask an agent to implement a feature. It runs for 20 minutes, modifies a bunch of files, then tells you "done, but two tests are failing." You ask why they're failing — "not sure, might be a timing issue." You ask which critical paths it changed — "let me look at the code..."

This isn't about the agent lacking capability. It's about your harness not providing enough observability. **Without observability, agents make decisions under uncertainty, evaluations become subjective judgments, and retries become blind wandering.** Both OpenAI and Anthropic define reliability as an evidence problem — the harness must expose runtime behavior and evaluation signals in a form that can guide the next decision.

## Core Concepts

- **Runtime observability**: System-level signals — logs, traces, process events, health checks. Answers "what did the system do."
- **Process observability**: Visibility into harness decision artifacts — plans, scoring rubrics, acceptance criteria. Answers "why should this change be accepted."
- **Task trace**: A complete decision-path record from task start to completion, analogous to request tracing in distributed systems. Every step the agent takes, with context, is recorded.
- **Sprint contract**: A short-term agreement negotiated before coding begins — specifying task scope, verification standards, and exclusions. The core tool for process observability.
- **Evaluator rubric**: Transforms quality evaluation from subjective judgment into evidence-based structured scoring. Makes different evaluators produce similar results for the same output.
- **Layered observability**: System-layer and process-layer observability designed simultaneously and reinforcing each other. Runtime signals explain behavior; process artifacts explain intent.

## Why This Happens

### The Real Cost of Missing Observability

When a harness lacks observability, four types of problems systematically appear:

**Cannot distinguish "correct" from "looks correct"**: A function looks perfectly right during code review — correct syntax, sound logic. But at runtime, an edge case handling error produces incorrect results under specific inputs. Only runtime traces can reveal that the actual execution path deviated from expectations.

**Evaluation becomes mysticism**: Without scoring rubrics and acceptance criteria, evaluators (human or agent) rely on implicit assumptions. The same output might get wildly different evaluations from different assessors. Quality assessment becomes non-reproducible.

**Retries become blind guesses**: When the agent doesn't know why something failed, retry direction is random. It might try repeatedly in the wrong direction — fixing unrelated code paths while ignoring the actual failure root cause. Every blind retry costs tokens and time.

**Session handoff information cliff**: When incomplete work is handed to the next session, missing observability means the new session must diagnose system state from scratch. Anthropic's long-running agent observations show this redundant diagnosis can consume 30-50% of total session time.

### A Real Claude Code Scenario

Imagine a harness using a "planner-generator-evaluator" three-role workflow, executing an "add dark mode to the app" task.

**Without observability**: The planner outputs a vague description. The generator implements dark mode based on that vagueness, but it doesn't match the planner's implicit expectations. The evaluator rejects based on their own implicit standards but can't articulate what's specifically wrong. The generator retries blindly based on vague rejection reasons. The cycle repeats 3-4 times, taking about 45 minutes, producing a barely acceptable output.

**With full observability**: The planner outputs a sprint contract — listing which components to modify, verification standards for each, and exclusions (no print styles). The generator implements according to the contract. Runtime observability records each component's style loading and application process. The evaluator uses a scoring rubric to evaluate dimension by dimension, with specific evidence citations. One iteration produces a high-quality result, in about 15 minutes.

3x efficiency difference. The only change is observability.

### Why Agents Can't Solve This Themselves

You might be thinking: "Can't the agent just print its own logs?" The problems are:

1. The agent doesn't know what it doesn't know — it won't proactively record signals it doesn't realize it needs.
2. Log formats are inconsistent — different sessions use different log formats, making systematic analysis impossible.
3. Process observability can't be solved by logs — sprint contracts and scoring rubrics are structured artifacts that need harness-level support.

## How to Do It Right

### 1. Build Runtime Signal Collection into the Harness

Don't rely on the agent to print its own logs. The harness should automatically collect these signals:

- **Application lifecycle**: Startup, ready, running, shutdown phase states
- **Feature path execution**: Records of critical path execution, including entry points, checkpoints, and exits
- **Data flow**: Records of data flowing between components
- **Resource utilization**: Abnormal resource usage patterns (e.g., continuously growing memory)
- **Errors and exceptions**: Full error context, not just error messages

### 2. Implement Sprint Contracts

Before each task starts, the generator and evaluator (which may be different invocations of the same agent) negotiate a contract:

```markdown
# Sprint Contract: Dark Mode Support

## Scope
- Modify the theme toggle component
- Update global CSS variables
- Add dark mode tests

## Verification Standards
- Visual regression tests pass for each component
- Main flow end-to-end tests pass
- No flash of unstyled content (FOUC)

## Exclusions
- Not handling print styles
- Not handling third-party component dark mode
```

### 3. Establish an Evaluator Rubric

Turn "is it good or not" into quantifiable scoring:

```markdown
# Scoring Rubric

| Dimension | A | B | C | D |
|-----------|---|---|---|---|
| Code correctness | All tests pass | Main flow passes | Partial pass | Build fails |
| Architecture compliance | Fully compliant | Minor deviations | Obvious deviations | Serious violations |
| Test coverage | Main + edge cases | Main flow only | Only skeleton | No tests |
```

### 4. Standardize with OpenTelemetry

Create a trace for each harness session, a span for each task, and sub-spans for each verification step. Use standard attributes to annotate key information. This way observability data integrates with standard toolchains (Jaeger, Zipkin).

## Real-World Case

A harness using a planner-generator-evaluator workflow, executing "add dark mode support":

**Unobservable version**: 3-4 rounds of blind retries, 45 minutes, barely acceptable output. Evaluator says "it doesn't feel right" but can't say what specifically. Generator wastes significant time in wrong directions.

**Fully observable version**:
- Sprint contract clarifies scope, standards, and exclusions
- Runtime traces record each component's style loading process
- Scoring rubric provides dimension-by-dimension structured evaluation
- One iteration produces high-quality results, 15 minutes

3x efficiency improvement, more stable quality, reproducible evaluations.

## Key Takeaways

- **Observability is a harness architecture property** — not a feature added after the fact, but a core capability that must be considered during design.
- **Both observability layers are essential** — runtime signals explain "what happened," process artifacts explain "why it was done this way."
- **Sprint contracts front-load alignment** — preventing "the generator built something the evaluator immediately rejects for foreseeable reasons."
- **Scoring rubrics make evaluation reproducible** — different evaluators produce similar scores for the same output.
- **Missing observability wastes 30-50% of session time on redundant diagnosis.**

## Further Reading

- [Observability Engineering - Charity Majors](https://www.honeycomb.io/blog/observability-engineering-book) — Theory and practice framework for modern observability engineering
- [Dapper - Google (Sigelman et al.)](https://research.google/pubs/pub36356/) — Groundbreaking practice in large-scale distributed tracing
- [Harness Design - Anthropic](https://www.anthropic.com/engineering/harness-design-long-running-apps) — Introducing sprint contracts and evaluator rubrics
- [Site Reliability Engineering - Google](https://sre.google/sre-book/table-of-contents/) — Systematic application of observability in production systems

## Exercises

1. **Observability Gap Analysis**: Audit your current harness for system-layer and process-layer observability. Find system states that can't be distinguished from existing signals, and propose additions.

2. **Sprint Contract Practice**: Write a sprint contract for a real task. Have the agent execute according to the contract, and compare efficiency and quality with and without the contract.

3. **Task Trace Construction**: Record every step of an agent's operations during a complete coding task. Annotate with OpenTelemetry semantic conventions. Analyze information bottlenecks in the trace — which steps lack sufficient signal support for decisions.
