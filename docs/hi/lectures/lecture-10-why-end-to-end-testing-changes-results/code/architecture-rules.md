# Electron Architecture Rules

- Renderer code may not directly access the filesystem.
- Preload is the only bridge between renderer and Electron main.
- Retrieval and indexing logic live in service modules, not UI components.
- Logging should be structured and emitted from service boundaries.
