# AGENTS.md

This repository is optimized for long-running coding-agent work. Keep this file
short. Use it as the routing layer into the system-of-record docs, not as a
giant instruction dump.

## Startup Workflow

Before changing code:

1. Confirm the repo root with `pwd`.
2. Read `ARCHITECTURE.md` for the current system map and hard dependency rules.
3. Read `docs/QUALITY_SCORE.md` to see which domains or layers are weakest.
4. Read `docs/PLANS.md`, then open the active plan you are working from.
5. Read the relevant product spec in `docs/product-specs/`.
6. Run the standard bootstrap and verification path for this repo.
7. If baseline verification is failing, repair the baseline before adding scope.

## Routing Map

- `ARCHITECTURE.md`: domain map, layer model, dependency rules
- `docs/design-docs/index.md`: design decisions and core beliefs
- `docs/product-specs/index.md`: current product behaviors and acceptance targets
- `docs/PLANS.md`: plan lifecycle and execution-plan policy
- `docs/QUALITY_SCORE.md`: product-domain and layer health
- `docs/RELIABILITY.md`: runtime signals, benchmarks, and restart expectations
- `docs/SECURITY.md`: secrets, sandbox, data, and external-action rules
- `docs/FRONTEND.md`: UI constraints, design system rules, accessibility checks

## Working Contract

- Work from one bounded plan or feature slice at a time.
- Do not mark work done from code inspection alone; runnable evidence is
  required.
- If you change behavior, update the matching product, plan, or reliability
  docs in the same session.
- If you see repeated review feedback, promote it into a mechanical rule, check,
  or linter instead of re-explaining it in chat.
- Keep generated material in `docs/generated/` and source references in
  `docs/references/`.
- Prefer adding small, current docs over growing this file.

## Definition Of Done

A change is done only when all of the following are true:

- target behavior is implemented
- required verification actually ran
- evidence is linked from the relevant plan or quality document
- affected docs remain current
- the repository can restart cleanly from the standard startup path

## End Of Session

Before ending a session:

1. Update the active execution plan.
2. Update `docs/QUALITY_SCORE.md` if any domain or layer meaningfully changed.
3. Record new debt in `docs/exec-plans/tech-debt-tracker.md` if you deferred it.
4. Move finished plans to `docs/exec-plans/completed/` when appropriate.
5. Leave the repo in a restartable state with a clear next action.
