# Interview Analysis Model

## Inputs

- Transcript turns with `id`, `speaker`, `timestamp`, and `text`.
- Interview metadata: role, interview type, target competencies, and optional project context.
- Gold fixture expectations for parser, segmentation, report shape, and safety checks.

## Pipeline

1. Parse transcript turns.
2. Segment interviewer questions and follow-up chains.
3. Extract candidate claims, examples, tradeoffs, and uncertainty markers.
4. Score speech clarity: filler density, answer length, repetition, and incomplete answers.
5. Identify technical gaps: missing constraints, missing failure modes, shallow tradeoffs.
6. Identify project evidence gaps: claims without examples, metrics, ownership, or outcome.
7. Generate risk flags with transcript evidence.
8. Generate a training plan tied to the highest-impact gaps.
9. Run safety boundary checks before returning the report.

## Output Contract

Every report must include:

- `summary`
- `questionChains`
- `speechIssues`
- `technicalGaps`
- `projectEvidenceGaps`
- `riskFlags`
- `trainingPlan`
- `evidence`
- `safetyReview`

Every finding must include one or more transcript turn IDs.

