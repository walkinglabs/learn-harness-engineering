# Harness Creator Scripts

These scripts provide a minimal CLI layer for the `harness-creator` skill. They are intentionally conservative: they generate harness files, validate harness completeness, and record benchmark evidence, but they do not run or control coding agents directly.

## `create-harness.ts`

Generate a starter harness in a target project directory.

```bash
npx tsx skills/harness-creator/scripts/create-harness.ts --target ./my-project
```

Options:

- `--target <path>`: Target project directory. Defaults to the current directory.
- `--project-name <name>`: Project name used in generated fallback files.
- `--force`: Overwrite existing harness files.
- `--help`: Show usage.

Generated files:

- `AGENTS.md`
- `feature_list.json`
- `init.sh`
- `progress.md`
- `session-handoff.md`
- `clean-state-checklist.md`

## `validate-harness.ts`

Check whether a target project has the expected harness files and basic state rules.

```bash
npx tsx skills/harness-creator/scripts/validate-harness.ts --target ./my-project
```

The validator checks for:

- Required harness files
- Executable `init.sh`
- Valid `feature_list.json`
- At most one active `in_progress` / `in-progress` feature
- Evidence on completed `passing` / `done` features
- Core `AGENTS.md` sections

## `run-benchmark.ts`

Create a benchmark evidence folder and optionally run a verification command.

```bash
npx tsx skills/harness-creator/scripts/run-benchmark.ts \
  --target ./my-project \
  --name "debug guard experiment" \
  --verify-cmd "./init.sh"
```

Output is written under:

```text
artifacts/harness-benchmarks/<timestamp>-<benchmark-name>/
```

Generated files:

- `benchmark-result.json`
- `benchmark-report.md`
- `baseline-notes.md`
- `harness-notes.md`

## Design boundary

`run-benchmark.ts` does not run Claude Code, Codex, Hermes, or other agents. It records the evidence scaffold for comparing a baseline run against a harnessed run. This keeps the script portable and avoids coupling the skill to a specific agent runtime.
