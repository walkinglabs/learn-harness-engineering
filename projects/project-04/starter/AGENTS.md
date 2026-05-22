# AGENTS.md -- Project 04: Runtime Feedback and Structural Control

## Project

Interview Debrief Coach - Electron + TypeScript + React desktop app for transcript import, interview analysis, timestamped evidence, and training plans.

## Commands

- `npm run dev` - Build and launch the app
- `npm run check` - Type-check the codebase
- `npm run test` - Run tests

## Rules

- Work on one feature at a time.
- Use fixtures to reproduce transcript parser, segmentation, or analysis bugs.
- Run `npm run check` before committing.
- Renderer must use `window.interviewCoach`; it must not use Node filesystem APIs.
- Safety boundary violations are product bugs.
