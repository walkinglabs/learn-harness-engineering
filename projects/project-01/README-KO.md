# Project 01: Prompt-only vs Rules-first for Interview Debrief Apps

에이전트에게 "면접 debrief 앱을 만들어라"라는 한 문장만 주는 경우와, AGENTS.md, init.sh, feature_list.json, fixture transcript가 있는 최소 하네스를 주는 경우를 비교합니다.

## 디렉터리 안내

| 디렉터리 | 의미 |
|------|------|
| `starter/` | 약한 하네스 시작점: 최소 Electron 앱, 모호한 작업 프롬프트, sample transcript. |
| `solution/` | 참조 구현: 같은 제품 목표에 AGENTS.md, init.sh, feature_list.json, parser test, 정적 debrief UI, progress log를 추가한 버전. |

## 포함 기능

- Electron 창 시작
- 고정 interview session 표시
- sample timestamped transcript 표시
- 정적 debrief summary 표시
- 실제 LLM 또는 실제 audio transcription 없음
