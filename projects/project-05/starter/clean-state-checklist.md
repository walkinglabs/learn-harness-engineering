# Clean State Checklist

Run this checklist before committing and at the end of each session.

## Build

- [ ] `npm run check` passes with no type errors
- [ ] `npm run test` passes
- [ ] `npm run build` completes successfully

## Architecture

- [ ] Renderer uses only `window.interviewCoach`
- [ ] Renderer has no `fs` or `path` imports
- [ ] Services do not import Electron IPC or React modules
- [ ] IPC channel names live in `src/shared/types.ts`

## Product

- [ ] Transcript import works
- [ ] Parser reports invalid lines as parse errors
- [ ] Analysis report has timestamped evidence for every risk item
- [ ] Training tasks link back to source risk items
- [ ] Feedback can be saved for report items

## Safety

- [ ] No hiring decision language
- [ ] No lie-detection language
- [ ] No emotion or personality judgment
- [ ] No protected-trait inference

## Repository

- [ ] No unintended files in git status
- [ ] No sensitive data staged
- [ ] Feature state reflects actual verification
