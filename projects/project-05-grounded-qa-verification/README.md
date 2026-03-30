# Project 05. Evaluator Loops and Three-Role Upgrades

## Objective

Measure how role separation (generator and evaluator, then planner, generator,
and evaluator) changes implementation quality on a substantial product upgrade.

## Learning Goals

- Separate generation from evaluation to improve error detection.
- Apply a rubric-driven review loop instead of subjective quality checks.
- Compare coordination overhead versus output quality across harness designs.

## Task

Choose one substantial upgrade and keep it fixed across all runs:

- Multi-turn Q&A history.
- Citation panel redesign.
- Document collections and filtering.
- Indexing recovery with richer Q&A behavior.

Run three harness variants on the same upgrade scope.

## Baseline Harness Setup

Run 1 uses a single-role harness:

- One agent plans, implements, and self-judges.
- No external evaluator rubric is required.

## Improved Harness Setup

Run 2 and Run 3 use upgraded role separation:

- Run 2: `generator + evaluator`.
- Run 3: `planner + generator + evaluator`.
- Evaluator must score output with the same rubric in both improved runs.

## Procedure

### Sprint Contract

Before any code is written, the generator and evaluator must negotiate a sprint
contract — a short written agreement specifying what will be built, how success
will be verified, and what is explicitly out of scope. The contract lives in the
repository as a file both roles can read.

This step matters because it front-loads alignment. Without a contract, the
evaluator's criteria are implicit and may shift during review. With a contract,
the evaluator grades against an explicit, pre-agreed standard.

Template: [`code/sprint-contract.md`](../../lectures/lecture-11-why-observability-belongs-inside-the-harness/code/sprint-contract.md)

### Evaluator Tuning

An out-of-the-box evaluator agent is a poor QA agent — it identifies issues
then talks itself into approving. The evaluator rubric requires iterative tuning:

1. Run the evaluator on a completed sprint.
2. Compare the evaluator's scores against your own human judgment.
3. Where they diverge, update the rubric to be more specific about what
   constitutes a pass or fail.
4. Re-run the evaluator on the same output and check alignment.
5. Repeat until the evaluator's judgment consistently matches human review.

Plan for 3-5 tuning rounds before the evaluator produces reliable scores. Record
each tuning iteration in the deliverables.

### Execution Steps

1. Select upgrade scope and define acceptance criteria before coding.
2. Write a sprint contract with the generator and evaluator agreeing on scope,
   verification, and exclusions.
3. Start three branches from the same commit:
   `p05-single`, `p05-gen-eval`, `p05-plan-gen-eval`.
4. Run each branch with Codex or Claude Code using comparable model and budget.
5. Use the same evaluator rubric for all three final outputs.
6. In improved runs, require at least one revision round after evaluator
   feedback.
7. Verify behavior with runnable evidence and record unresolved defects.
8. Tune the evaluator rubric across at least two iterations, recording what
   changed and why.
9. Compare quality and effort across the three harness variants.

## What to Measure

- Scope definition quality before coding starts.
- Number and severity of defects caught before final handoff.
- Rubric score by category (correctness, reliability, maintainability, UX).
- Rework required after review.
- Final robustness of the upgraded product slice.
- Evaluator tuning iterations: how many rounds before evaluator judgment aligned
  with human review.
- Sprint contract effectiveness: did the contract reduce ambiguity in evaluation?

## Deliverables

- Sprint contract document.
- Evaluator rubric tuning log (before/after for each tuning iteration).
- Single-role run record (prompt, transcript/log, runnable evidence).
- Generator-evaluator run record (including rubric and revision notes).
- Planner-generator-evaluator run record (including rubric and revisions).
- One comparison note summarizing quality gains and coordination costs.
