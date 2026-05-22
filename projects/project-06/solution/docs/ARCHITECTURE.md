# Architecture -- Complete Interview Debrief Harness

## Layers

- Renderer: React UI for sessions, timeline, report, feedback.
- Preload: typed `window.interviewCoach` bridge.
- Main: Electron shell and IPC registration.
- Services: parser, session store, question-chain segmentation, gap analyzers, risk analyzer, training-plan generator, safety checker, logger.
- Types: interview, transcript, and analysis contracts.

Renderer never reads the filesystem directly. Services never import Electron or React.
