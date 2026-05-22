# AGENTS.md -- Project 04 Runtime Feedback

## Startup

1. Run `npm install && npm run check && npm run test`.
2. Use fixtures to reproduce parser, timestamp, speaker alias, or segmentation defects.
3. Run architecture checks before marking work complete.

## Rules

- Logs must identify import, parse, segment, analyze, safety-check, and feedback-save stages.
- Renderer must not import Node core modules.
- Services must not import Electron or React.
- Safety boundary failures are defects.
