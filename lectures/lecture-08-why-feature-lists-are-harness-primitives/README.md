# Lecture 08. Why Verification Must Be Externalized

## Guiding Question

Why can’t agents be trusted to decide for themselves when work is complete?

## Why This Matters

Strong completion claims require external verification. Without explicit gates,
agents will often mark work complete based on partial or misleading signals.

## Core Ideas

- “Looks done” is not a useful standard.
- Pass states should be tied to explicit verification.
- End-to-end testing catches failure modes invisible to code-only checks.
- External evaluation and back-pressure improve convergence.

## Primary Readings

- Anthropic: Effective harnesses for long-running agents
- Anthropic: Harness design for long-running application development

## Code

See [`code/`](./code/README.md) for pass-state and verification examples.
