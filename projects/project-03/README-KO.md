# Project 03: Multi-session Continuity for Interview Analysis

progress log, session handoff, feature state, analysis state machine으로 면접 분석 작업을 여러 세션에 걸쳐 이어가게 합니다.

## 디렉터리 안내

| 디렉터리 | 의미 |
|------|------|
| `starter/` | Project 02에서 파생된 시작점. analysis report 생성이 아직 완성되지 않았습니다. |
| `solution/` | AnalysisReport, follow-up chain, gap, risk item, training task, progress log, session handoff가 포함된 참조 구현. |

## 포함 기능

- Interview session state machine
- analyze session command
- persisted AnalysisReport
- report status UI
- interrupted work recovery
