# {{AGENT_FILE_NAME}}

{{PROJECT_PURPOSE}}

## Authority

`project-model.json` is the project contract. `feature_list.json` is derived execution state.
When prose, feature state, and the project contract disagree, stop the affected feature and
record the conflict as an unknown; do not silently choose one.

## Startup Workflow

Before writing code:

1. Confirm the working directory with `pwd`.
2. Read this file and `project-model.json`.
3. Read only the sources referenced by the active requirement and capability.
4. Read `feature_list.json`, `progress.md`, and `session-handoff.md`.
5. Run `./init.sh`; a failing project-contract check blocks implementation.

## Working Rules

- **One feature at a time:** work one feature and its declared boundaries.
- **Requirement linked:** every behavior change names its requirement and acceptance criterion.
- **Uncertainty explicit:** `unknown` and `needs-decision` remain blocked until resolved; an inference stays labelled `inferred`.
- **Verification observed:** execute the linked verification procedure and record its artifact before claiming done.
- **Stay in scope:** discoveries outside the active capability become model or feature updates, not extra implementation.

## Definition of Done

A feature is done only when:

- every linked requirement is `confirmed` or explicitly accepted as `inferred`;
- every linked acceptance criterion has a verification entry;
- every linked verification has observed evidence for this tree or artifact;
- dependencies are done and blockers are empty;
- `./init.sh` exits zero.

Passing generic tests is engineering evidence, not proof that the project contract is correct.
Semantic truth still requires review by someone who understands the domain and source material.

## End of Session

1. Update feature status and attach observed evidence by `verificationRef`.
2. Record new unknowns, decisions, changed sources, and traceability gaps.
3. Update `progress.md` and `session-handoff.md` with the exact next action.
4. Leave the repository restartable through `./init.sh`.

## Verification Commands

```bash
{{PRIMARY_VERIFICATION_COMMAND}}
```

Required engineering checks:
{{VERIFICATION_COMMANDS}}
