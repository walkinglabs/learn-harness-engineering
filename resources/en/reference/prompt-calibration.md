# Prompt Calibration

Root instructions should define the operating frame, not every possible move.

## Keep In The Root File

- repository purpose and scope
- startup path
- verification path
- non-negotiable constraints
- required state artifacts
- end-of-session rules

## Move Out Of The Root File

- long historical edge cases
- topic-specific implementation details
- local architecture notes that belong near the code
- examples that only apply to one subsystem

## Working Rule

The root file should help a fresh session orient itself quickly. If the file is
becoming a dumping ground for every past failure, split the detail into smaller
documents and link to them instead.
