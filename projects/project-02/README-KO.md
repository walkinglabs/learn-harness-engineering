# Project 02: Agent-readable Interview Workspace

에이전트가 제품 정의, transcript 형식, 데이터 모델, 분석 모델, 안전 경계, 아키텍처 규칙을 저장소 문서에서 읽도록 만듭니다.

## 디렉터리 안내

| 디렉터리 | 의미 |
|------|------|
| `starter/` | Project 01에서 파생된 시작점. transcript import와 persistence를 보강해야 합니다. |
| `solution/` | 제품 문서, 아키텍처 문서, transcript parser, session store, handoff가 포함된 참조 구현. |

## 포함 기능

- timestamped transcript import
- timestamp / speaker / utterance parsing
- InterviewSession 로컬 저장
- 재시작 후 session 유지
- parse errors를 UI에 표시
