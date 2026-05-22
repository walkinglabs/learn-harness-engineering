# Architecture -- Project 04

Project 04 adds runtime feedback and structural control.

## Required Boundaries

- Renderer -> preload via `window.interviewCoach`
- Preload -> main via typed IPC channels
- Main -> services for business logic
- Services stay independent of Electron and React

## Runtime Events

Log import, parse, segment, analyze, safety-check, persistence, and feedback events with structured fields.
