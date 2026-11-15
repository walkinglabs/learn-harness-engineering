# Example: Turning Review Feedback into a Rule

Repeated review comment:

> Do not call filesystem utilities from the renderer. Use the preload bridge.

Promoted harness rule:

- add a lint or import rule preventing `fs` usage in renderer code
- add remediation text explaining the preload boundary
