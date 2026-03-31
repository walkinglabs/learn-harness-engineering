# Harness Components Example

For a coding agent working in a local repository:

- Model:
  the LLM itself

- Harness:
  - system prompt
  - AGENTS.md
  - bash tool
  - file read/write tools
  - git access
  - local filesystem
  - startup scripts
  - test commands
  - stop hooks
  - lint checks
  - evaluator loop

If you change any of the above harness pieces, you change the effective agent.
