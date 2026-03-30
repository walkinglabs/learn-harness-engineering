# Lecture 11. Why Observability Belongs Inside the Harness

## Question

Why should observability be treated as a built-in harness capability rather than
an optional debugging tool?

## Why It Matters

Without observability, agents cannot reliably distinguish correct execution from
plausible but incorrect output. OpenAI and Anthropic both describe reliability
as an evidence problem: the harness must expose runtime behavior and evaluation
signals in forms that can guide the next decision.

## Core Concepts

- Runtime observability includes logs, traces, process events, and health checks.
- Workflow observability includes plans, rubrics, and explicit acceptance
  criteria.
- Separate planner, generator, and evaluator roles require shared evidence.
- Observable artifacts enable correction loops across long-running sessions.

## Detailed Explanation

OpenAI frames the harness as the mechanism that turns model reasoning into
verifiable engineering work. This requires direct feedback from execution, not
only inspection of generated code. Runtime visibility answers questions such as
whether a flow executed, where it failed, and which boundary caused the failure.

Anthropic extends this to multi-role workflows. When planner, generator, and
evaluator roles are used, each role needs access to structured artifacts:
contracts, rubrics, and measurable outcomes. If these artifacts are missing,
evaluation becomes subjective and retries become inefficient.

Observability therefore has two layers:

1. System layer: application runtime signals.
2. Process layer: harness decision artifacts used for evaluation and handoff.

The two layers should be designed together. Runtime signals explain behavior,
while process artifacts explain why a change should be accepted or rejected.

### Sprint Contracts

When multiple roles collaborate — planner, generator, evaluator — the point
where work begins is a common failure surface. If the generator and evaluator
have different expectations about what "done" looks like, evaluation becomes
subjective and revision loops become wasteful.

Anthropic's harness practice introduces **sprint contracts** to solve this.
Before any code is written, the generator and evaluator negotiate a short
written agreement that specifies:

1. What will be built in this sprint.
2. How success will be verified (specific tests or checks).
3. What is explicitly out of scope.

The contract is a file in the repository. Both roles read it before starting.
If they disagree on the terms, they iterate on the contract first. This
front-loads alignment and prevents the common pattern where the generator
builds something the evaluator immediately rejects for predictable reasons.

Sprint contracts are especially valuable when the evaluator is a separate
agent. Without a contract, the evaluator's review criteria are implicit and
may shift between runs. With a contract, the evaluator grades against an
explicit, pre-agreed standard.

## Examples and Artifacts

- [`code/sprint-contract.md`](./code/sprint-contract.md): explicit goal and
  completion criteria for a bounded upgrade.
- [`code/evaluator-rubric.md`](./code/evaluator-rubric.md): scoring framework for
  grounded quality assessment.
- [`code/README.md`](./code/README.md): index of lecture artifacts.

## Readings

Primary:
- OpenAI: *Harness engineering: leveraging Codex in an agent-first world*
- Anthropic: *Harness design for long-running application development*

Secondary:
- HumanLayer: *Skill Issue: Harness Engineering for Coding Agents*

## Exercises

1. Add one runtime signal and one process artifact to an existing task. Measure
   whether evaluator confidence improves on first pass.
2. Use [`code/evaluator-rubric.md`](./code/evaluator-rubric.md) to score two
   outputs for the same task. Compare where disagreement appears and why.
3. Write a sprint contract using
   [`code/sprint-contract.md`](./code/sprint-contract.md), then run a task and
   record which required signals were missing at review time.
