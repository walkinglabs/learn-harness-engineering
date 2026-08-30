# harness-creator

A compact skill for building and auditing requirement-linked harnesses around AI coding agents.

It adds a sourced project-model foundation before the five execution subsystems: instructions, state, verification, scope boundaries, and lifecycle handoff.

## Install

```bash
npx skills add walkinglabs/learn-harness-engineering --skill harness-creator
```

Or copy `skills/harness-creator/` into your skill path.

## Use

```bash
node skills/harness-creator/scripts/discover-project.mjs --target /path/to/project
node skills/harness-creator/scripts/create-harness.mjs --target /path/to/project --scaffold-only
node skills/harness-creator/scripts/create-harness.mjs --target /path/to/project
node skills/harness-creator/scripts/validate-harness.mjs --target /path/to/project
node skills/harness-creator/scripts/run-benchmark.mjs --target /path/to/project --html /path/to/report.html
```

The scripts use only Node.js built-in modules. Creation refuses to emit an authoritative harness until `project-model.json` is reviewed.

## What It Creates

- `project-model.json` and schema
- `AGENTS.md` or `CLAUDE.md`
- capability-derived `feature_list.json` and schema
- `progress.md`
- `init.sh`
- `session-handoff.md`
- a repository-local project-contract validator

`create-harness.mjs` detects common project types and package managers. It supports Node/npm/pnpm/yarn/bun, Python, Go, Rust, Maven, Gradle, and .NET at a basic verification-command level.

## What It Checks

`validate-harness.mjs` scores the project model, five harness subsystems, and traceability:

1. Project model
2. Instructions
3. State
4. Verification
5. Scope
6. Lifecycle
7. Traceability

The score checks structural and referential integrity. It cannot establish semantic truth and does not replace domain review or real before/after agent-session testing.

## Status

- [x] Minimal harness scaffolding
- [x] Five-subsystem validation
- [x] HTML assessment report
- [x] Structural benchmark report
- [x] 16 eval cases
- [x] Generic verification detection for common stacks
- [x] Discovery-before-generation workflow
- [x] Sourced project model and uncertainty states
- [x] Requirement-to-evidence traceability validation
- [x] Capability-derived feature state
- [ ] Optional real before/after agent-session replay

## Files

```text
harness-creator/
├── SKILL.md
├── agents/openai.yaml
├── scripts/
│   ├── create-harness.mjs
│   ├── discover-project.mjs
│   ├── validate-harness.mjs
│   ├── render-assessment-html.mjs
│   ├── run-benchmark.mjs
│   ├── lib/harness-utils.mjs
│   └── runtime/
│       ├── project-contract.mjs
│       └── validate-project-contract.mjs
├── templates/
│   ├── agents.md
│   ├── project-model.schema.json
│   ├── feature-list.schema.json
│   ├── init.sh
│   ├── progress.md
│   └── session-handoff.md
├── references/
└── evals/evals.json
```

## Boundaries

This skill is for harness engineering, not model selection, prompt tuning alone, or app architecture. Keep project-specific facts in the target repository.
