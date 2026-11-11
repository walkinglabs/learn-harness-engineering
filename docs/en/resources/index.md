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
- feature state: [`templates/feature_list.json`](./templates/#feature-list-json)
- progress log: [`templates/claude-progress.md`](./templates/claude-progress.md)

The filename is a historical course convention. This is a generic,
repository-local session progress log: any coding agent can use it, but agents
only read or update it when their instructions explicitly tell them to do so.
- bootstrap script reference: `docs/en/resources/templates/init.sh`

Then add:

- session handoff: [`templates/session-handoff.md`](./templates/session-handoff.md)
- clean-exit checklist: [`templates/clean-state-checklist.md`](./templates/clean-state-checklist.md)
- evaluator rubric: [`templates/evaluator-rubric.md`](./templates/evaluator-rubric.md)

If you want the fuller OpenAI-style repository structure from the
"Harness engineering" post, use the advanced pack:

- [`openai-advanced/index.md`](./openai-advanced/index.md)

## Library Structure

- [`templates/`](./templates/index.md): templates to copy into a real repo
- [`reference/`](./reference/index.md): method notes, startup flow, and failure-mode maps
- [`openai-advanced/`](./openai-advanced/index.md): advanced repo skeleton,
  system-of-record docs, and agent-first governance templates

## Recommended Minimal Pack

- `AGENTS.md` or `CLAUDE.md`
- `feature_list.json`
- `claude-progress.md` (generic session progress log; historical filename)
- `init.sh`

Those four files are enough to make most agent workflows noticeably more stable.

When the repo grows into a longer-running system with multiple domains, active
plans, quality scoring, and reliability policies, move up to the
[`openai-advanced/`](./openai-advanced/index.md) pack instead of stretching the
minimal pack too far.
