# Goal Loop Template

> Write your goal as a document like this, then hand it to `/goal` or a maker agent.
> The more specific and verifiable, the higher the loop quality.

## Goal

<!-- One sentence describing what to do -->

Implement the XX feature with complete unit test coverage.

## Acceptance Criteria

<!-- Machine-verifiable completion conditions — each one can be checked with a command -->

- [ ] `npm test` passes fully
- [ ] Coverage report shows XX module coverage ≥ 80%
- [ ] `npm run lint` has zero errors
- [ ] TypeScript type check passes (`npx tsc --noEmit`)
- [ ] All new code follows project coding standards

## Scope

<!-- Be explicit about what NOT to touch -->

### Fair game

- All files under `src/xx/`
- Test files under `tests/`
- Related type definition files

### Hands off

- `src/main.ts` entry file
- Database schema migrations
- Dependency versions in `package.json` (unless explicitly needed)
- CI/CD config files

## Verification Method

<!-- How to verify after each step -->

1. After implementation, run these commands in order:
   1. `npx tsc --noEmit` — type check
   2. `npm run lint` — code style
   3. `npm test` — unit tests
   4. `npx vitest --coverage` — coverage check

2. Fix any failures before moving to the next step.
3. When everything passes, run the full end-to-end test suite (if available).

## Stop Conditions

- All acceptance criteria pass ✅
- Max turns reached: 20
- No progress for 3 consecutive rounds (same error keeps appearing)
- Blocking issue that cannot be resolved independently (e.g., missing dependency, environment problem)

## How to Work

1. Read `AGENTS.md` and `feature_list.json` first to understand the project structure and existing features.
2. Write out the design approach before touching code.
3. Verify after each sub-task is done.
4. If stuck for more than 2 rounds, switch approach or simplify.
5. Update progress at the end of each round.
