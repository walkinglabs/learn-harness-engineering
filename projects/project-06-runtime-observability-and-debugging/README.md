# Project 06. Benchmark, Cleanup, and Capstone Harness

## Objective

Build and benchmark the course capstone harness, then perform a cleanup cycle
to verify that quality can be maintained over repeated runs.

## Learning Goals

- Run a controlled benchmark on a fixed multi-feature task suite.
- Quantify harness impact on reliability, retries, and defect rate.
- Practice post-run cleanup as a first-class harness responsibility.

## Task

Use a fixed task set that covers the full product slice:

- Import documents.
- Build or refresh an index.
- Answer grounded questions with citations.
- Provide runtime feedback sufficient for debugging.
- Preserve a readable, restartable repository state.

Execute baseline, improved, and post-cleanup rerun comparisons.

## Baseline Harness Setup

Run 1 must use an earlier weaker harness from this course:

- Limited continuity artifacts.
- Weak or partial verification discipline.
- Reduced runtime observability and enforcement.

## Improved Harness Setup

Run 2 must use the strongest harness assembled in the course:

- Continuity artifacts and startup scaffolding.
- Explicit scope and verification gates.
- Runtime signals and structural constraints.
- Evaluator or multi-role review where applicable.
- Quality document tracking per-domain and per-layer grades.

## Procedure

1. Create a quality document using the template in
   `resources/en/templates/quality-document.md` (or `resources/zh/templates/`).
   Fill in initial grades for all product domains and architectural layers based
   on the current codebase state.
2. Define one fixed benchmark task suite and one scoring sheet before running
   any agent session.
3. Start from one common commit and branch into `p06-baseline` and
   `p06-improved`.
4. Run baseline and improved sessions with Codex or Claude Code using the same
   model and comparable budget.
5. Score both runs immediately after execution.
6. Update the quality document after each run, recording grade changes per
   domain and layer.
7. On the improved branch, perform a cleanup pass targeting entropy, dead code,
   unclear docs, and unstable run paths.
8. Rerun the same benchmark task suite after cleanup and rescore.
9. Update the quality document one final time.
10. Compare three quality document snapshots (baseline, improved, post-cleanup)
    alongside benchmark scores.
11. **Harness simplification pass:** Remove one harness component (for example,
    the sprint contract, or the explicit scope gate). Rerun the benchmark. If
    outcomes do not degrade, the component was unnecessary overhead. If they do,
    restore it. Record the result.

## What to Measure

- Benchmark completion rate.
- Number of retries required per task.
- Defect count before human intervention.
- Cleanup effort (time and files touched).
- Post-cleanup legibility and restart success.
- Quality document grade changes across the three snapshots.
- Harness simplification result: which components were removable, which were load-bearing.

## Deliverables

- Quality document with three snapshots (baseline, improved, post-cleanup).
- Baseline benchmark record with scores and evidence.
- Improved benchmark record with scores and evidence.
- Cleanup run record with before/after score delta.
- Harness simplification log: component removed, benchmark result, decision.
- Final capstone comparison summary with key lessons learned.
