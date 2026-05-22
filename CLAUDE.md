# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Learn Interview Harness Engineering is a project-based course on building reliable coding environments for AI agents through a real Electron AI Interview Debrief Coach app. The repo contains a VitePress documentation site plus hands-on project code.

## Commands

```sh
# Documentation site
npm install
npm run docs:dev        # Dev server with hot reload (VitePress)
npm run docs:build      # Production build
npm run docs:preview    # Preview built site

# Run lecture code examples
npx tsx docs/lectures/<lecture-dir>/code/<file>.ts

# Project Electron apps (from each project directory)
cd projects/project-NN/starter  # or solution/
npm install
npm run dev              # Build + launch Electron (via scripts/dev.js)
npm run check            # Type-check both tsconfig.json and tsconfig.node.json
npm run test             # Vitest run (single run)
npm run test:watch       # Vitest watch mode
```

## Repository Structure

- `docs/` — VitePress documentation site (lectures, projects, resources)
- `docs/.vitepress/config.mts` — Nav/sidebar config for all published locales
- `docs/<locale>/lectures/` — 12 lectures, each with `index.md` + `code/` examples
- `docs/<locale>/projects/` — 6 project descriptions
- `docs/<locale>/resources/` — templates, references, OpenAI advanced pack
- `projects/shared/` — Shared Electron + TypeScript + React foundation
- `projects/project-NN/` — Per-project `starter/` and `solution/` directories

## Architecture

The course revolves around an Electron Interview Debrief Coach desktop app that evolves across 6 projects:
- **Main process** (`src/main/`): Window management, IPC handlers, service initialization
- **Preload** (`src/preload/`): contextBridge exposing typed API to renderer
- **Renderer** (`src/renderer/`): React UI with interview sessions, transcript timeline, debrief report panel, and status bar
- **Services** (`src/services/`): transcript import/parsing, session persistence, deterministic analysis, feedback, and local storage services
- **Shared types** (`src/shared/types.ts` or `src/types/` after migration): Cross-boundary interview, transcript, analysis, and IPC interfaces

Each project's starter/solution is a complete copy of the Electron app at that evolutionary stage. P(N+1) starter is derived from P(N) solution. The shared foundation is in `projects/shared/`.

## Key Patterns

- IPC channels defined as constants in `src/shared/types.ts` (IPC_CHANNELS) — single source of truth
- All data stored locally as JSON/text files (no database)
- Transcript import is the primary path; audio upload must use a mock transcription service in tests
- Analysis reports must cite timestamped transcript evidence
- Safety boundary: do not build candidate ranking, hire/reject recommendations, automated screening, protected-trait inference, emotion recognition, personality judgment, lie detection, or mental-state inference from voice
- Harness files in project roots: AGENTS.md, CLAUDE.md, feature_list.json, init.sh, claude-progress.md
- Progressive disclosure: short AGENTS.md entrypoint linking to focused docs
- Each project has two tsconfigs: `tsconfig.json` (renderer) and `tsconfig.node.json` (main/preload)

## Bilingual Content

Primary content exists in multiple locale folders under `docs/<locale>/`. Keep product framing, safety boundaries, project names, and harness artifacts consistent across locales when editing global course pages.
