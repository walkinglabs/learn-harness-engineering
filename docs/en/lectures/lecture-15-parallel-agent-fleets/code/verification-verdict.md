# Structured Verification Verdict

Use this as the closing contract for a checker (verifier) node. The checker
ends its final message with **either**:

- the standalone completion marker `VERIFIED_COMPLETE` — only when every
  requirement in the *currently accepted scope* has concrete evidence; **or**
- one line `VERIFICATION_RESULT` followed by the JSON below.

## Checker instructions (paste into the verifier prompt)

```markdown
Verify the CURRENT ACCEPTED SCOPE, derived from the request and the newest user instructions.

- Newer user instructions override older ones, including scope reductions.
  "Ship what we have, the rest can come later" defers the rest: record it as deferred,
  do not implement it, and do not treat it as a blocker.
- Never invent a deferral because work is hard or evidence is missing.
- Map each in-scope requirement to concrete evidence (file, test, command output).
- Check committed AND uncommitted changes. A clean git status or an old commit is not evidence.
- Run every check in the FOREGROUND and wait for it to finish. A command still running when
  your turn ends will never report back. "Started the tests" is not evidence.
- Reuse results from earlier in this task only if the files they checked have not changed.
- Missing credentials, real-world metrics, or third-party approval are EXTERNAL, not broken code.
- If everything accepted is verified, end with the line VERIFIED_COMPLETE.
- Otherwise end with VERIFICATION_RESULT {json} using the schema below. Keep gap ids stable
  across follow-ups so progress on each gap can be tracked.
```

## Schema

```json
{
  "completed": ["<requirement> — <evidence>"],
  "actionable": [{ "id": "<stable-kebab-id>", "action": "<specific fix and how to validate it>" }],
  "external": ["<in-scope prerequisite outside the agent's control, and the evidence needed>"],
  "unknown": ["<question only a human can answer>"],
  "deferred": [{ "item": "<deferred work>", "instruction": "<the user instruction that deferred it>" }]
}
```

## Routing table

| Bucket | Next node | Retried automatically? |
|---|---|---|
| `VERIFIED_COMPLETE` | Human review gate | — |
| `actionable` (non-empty) | Back to the **maker** thread (never the checker's) | Yes, up to the chain cap |
| `external` | Human inbox | No |
| `unknown` | Human inbox | No |
| `deferred` | Recorded on the task / progress file | **Never** |
| Cap reached with `actionable` remaining | Human review gate, with the remaining gaps | No |

## Example

```text
VERIFICATION_RESULT {"completed":["Login validates email — login.spec.ts passes (12/12)"],
"actionable":[{"id":"csv-export-empty-rows","action":"Skip empty rows in exportCsv; add a test with two blank rows"}],
"external":["Refund path needs payment-sandbox credentials to exercise end to end"],
"unknown":[],
"deferred":[{"item":"Bulk import","instruction":"User: 'ship what we have, bulk import can come later'"}]}
```
