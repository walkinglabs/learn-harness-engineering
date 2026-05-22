# Architecture -- Project 01

Minimal Electron Interview Debrief Coach:

- `src/main/` creates the BrowserWindow and registers IPC.
- `src/preload/` exposes `window.interviewCoach`.
- `src/renderer/` renders sessions, transcript timeline, and debrief report.
- `src/services/` parses transcripts and generates deterministic evidence-grounded analysis.
- `src/types/` defines interview, transcript, and analysis models.
