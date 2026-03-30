# English Resource Library

This folder turns the course methods into copy-ready templates and compact
references you can use in a real repository.

## When To Use It

Start here when you want Codex, Claude Code, or another coding agent to work
across multiple sessions without constantly re-deriving setup, status, and
scope.

It is especially useful when:

- work spans multiple sessions
- features are numerous and easy to leave half-finished
- agents tend to declare victory too early
- startup steps are rediscovered every time

## Start Here

For a minimal setup, begin with:

- root instructions: [`templates/AGENTS.md`](./templates/AGENTS.md) or [`templates/CLAUDE.md`](./templates/CLAUDE.md)
- feature state: [`templates/feature_list.json`](./templates/feature_list.json)
- progress log: [`templates/claude-progress.md`](./templates/claude-progress.md)
- bootstrap script reference: `resources/en/templates/init.sh`

Then add:

- session handoff: [`templates/session-handoff.md`](./templates/session-handoff.md)
- clean-exit checklist: [`templates/clean-state-checklist.md`](./templates/clean-state-checklist.md)
- evaluator rubric: [`templates/evaluator-rubric.md`](./templates/evaluator-rubric.md)

## Library Structure

- [`templates/`](./templates/README.md): templates to copy into a real repo
- [`reference/`](./reference/README.md): method notes, startup flow, and failure-mode maps

## Recommended Minimal Pack

- `AGENTS.md` or `CLAUDE.md`
- `feature_list.json`
- `claude-progress.md`
- `init.sh`

Those four files are enough to make most agent workflows noticeably more stable.
