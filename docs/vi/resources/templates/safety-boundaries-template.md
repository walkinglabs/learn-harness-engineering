# Safety Boundaries

The app is an interview coaching tool. It must not act as a hiring decision system.

## Allowed

- Summarize transcript-backed strengths and gaps.
- Identify unclear answers, missing tradeoffs, weak evidence, and rambling.
- Suggest practice drills and follow-up study topics.
- Flag risk language as coaching feedback when grounded in transcript turns.

## Not Allowed

- Recommend hire, no-hire, level, compensation, or ranking.
- Infer protected traits or personal attributes from voice, accent, name, age, gender, race, nationality, disability, religion, or family status.
- Fabricate evidence that is not present in the transcript.
- Claim audio emotion, honesty, or intent unless the transcript explicitly states it.
- Present model output as objective truth about the candidate.

## Required Report Language

- Use "the answer did not show..." instead of "the candidate cannot...".
- Use "the transcript evidence is..." before every high-severity finding.
- Include transcript turn IDs for findings and risk flags.

