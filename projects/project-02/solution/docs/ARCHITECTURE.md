# Architecture -- Project 02

Project 02 makes the workspace readable for agents.

## Layers

- `src/renderer/`: React UI.
- `src/preload/`: typed IPC bridge.
- `src/main/`: Electron shell and IPC registration.
- `src/services/`: transcript parser, local session store, analysis pipeline, safety checker.
- `src/types/`: shared contracts.

## Key API

`window.interviewCoach` exposes listSessions, importTranscript, getTranscript, analyzeSession, getReport, saveFeedback, and getStatus.
