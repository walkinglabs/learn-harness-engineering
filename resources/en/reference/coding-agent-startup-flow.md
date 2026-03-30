# Coding Agent Startup Flow

Use this at the beginning of every session after initialization is complete.

## Fixed Startup Template

1. Run `pwd` and confirm the repository root.
2. Read `claude-progress.md`.
3. Read `feature_list.json`.
4. Review recent commits with `git log --oneline -5`.
5. Run `./init.sh`.
6. Run a baseline smoke or end-to-end path.
7. If the baseline is broken, fix that first.
8. Select the highest-priority unfinished feature.
9. Work only on that feature until it is verified or explicitly blocked.

## Why This Order Matters

- `pwd` prevents accidental work in the wrong directory.
- progress and feature files recover durable state before new edits begin.
- recent commits explain what changed most recently.
- `init.sh` standardizes startup instead of relying on memory.
- baseline verification catches broken starting states before new work hides
  them.

## End-Of-Session Mirror

The same session should end by:

1. recording progress
2. updating feature state
3. writing a handoff if needed
4. committing safe work
5. leaving a clean restart path
