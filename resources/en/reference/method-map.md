# Method Map

This table maps the most common long-running coding-agent failure modes to the
artifact or operating rule that usually fixes them first.

| Failure mode | What it looks like in practice | Primary fix | Supporting artifact |
| --- | --- | --- | --- |
| Cold-start confusion | A new session spends most of its time rediscovering setup and status | Make the repository the system of record | `claude-progress.md` |
| Scope sprawl | The agent starts several features and finishes none of them cleanly | Restrict active scope | `feature_list.json` |
| Premature completion | The agent claims done after code edits but before runnable proof | Bind completion to evidence | `clean-state-checklist.md` |
| Fragile startup | Every session re-learns how to boot the project | Standardize setup and verification | `init.sh` |
| Weak handoff | The next session cannot tell what is verified, broken, or next | End with an explicit handoff | `session-handoff.md` |
| Subjective review | Review quality depends on taste or memory | Score output with fixed categories | `evaluator-rubric.md` |

## Operating Principle

Add the smallest artifact that directly addresses the observed failure mode.
Avoid solving every reliability problem by dumping more text into one global
instruction file.
