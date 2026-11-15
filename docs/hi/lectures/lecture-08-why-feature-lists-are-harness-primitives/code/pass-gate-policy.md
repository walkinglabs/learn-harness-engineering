# Pass Gate Policy

A feature may only move from `passes: false` to `passes: true` when:

- the expected workflow has been exercised
- the evidence of success is recorded
- no blocking error is present in the tested path
- the implementation does not leave the app in a broken or ambiguous state
