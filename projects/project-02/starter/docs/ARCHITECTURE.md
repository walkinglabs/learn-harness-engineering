# Architecture -- Interview Debrief Coach

Interview Debrief Coach is an Electron desktop app with a strict boundary between renderer UI, preload IPC bridge, main-process handlers, and service-layer analysis logic.

## Layers

- `src/renderer/`: React UI for interview sessions, transcript timeline, debrief report, evidence chips, and feedback controls.
- `src/preload/`: exposes `window.interviewCoach` through `contextBridge`.
- `src/main/`: creates the BrowserWindow and registers IPC handlers.
- `src/services/`: parses transcripts, stores sessions, segments question chains, analyzes gaps and risks, checks safety boundaries, and writes local data.
- `src/types/`: shared interview, transcript, and analysis models.

## IPC API

```ts
window.interviewCoach.listSessions()
window.interviewCoach.importTranscript(input)
window.interviewCoach.getTranscript(sessionId)
window.interviewCoach.analyzeSession(sessionId)
window.interviewCoach.getReport(sessionId)
window.interviewCoach.saveFeedback(input)
```

Renderer code must not read the filesystem directly.
