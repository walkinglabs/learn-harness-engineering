# harness-creator

Harness для coding agents, пов'язаний із вимогами: спочатку discovery та reviewed
`project-model.json`, потім capability-derived features, verification і evidence.

```bash
node skills/harness-creator/scripts/discover-project.mjs --target /path/to/project
node skills/harness-creator/scripts/create-harness.mjs --target /path/to/project --scaffold-only
node skills/harness-creator/scripts/create-harness.mjs --target /path/to/project
node skills/harness-creator/scripts/validate-harness.mjs --target /path/to/project
```

Без reviewed project model creation відмовляється генерувати авторитетний harness. Structural
score не доводить semantic correctness; потрібні domain review та representative agent runs.

Повна актуальна документація: [`README.md`](README.md) і [`SKILL.md`](SKILL.md).
