[English](./README.md) · **한국어**

# 프로젝트 02: 에이전트 가독형 워크스페이스

저장소(repository) 가독성과 명시적 연속성(continuity) 산출물이 어떻게 교차 세션 개발에서 컨텍스트(context) 손실을 줄이는지 시연합니다.

에이전트가 새 세션을 시작할 때 가장 먼저 하는 일은 저장소를 읽는 것입니다. 저장소가 에이전트 친화적으로 구성되어 있지 않으면, 에이전트는 이전 세션에서 무슨 일이 있었는지 파악하는 데 많은 시간을 소비합니다. 이 프로젝트는 그 차이를 직접 측정합니다.

## 디렉터리 설명

| 디렉터리 | 의미 |
|----------|------|
| `starter/` | **시작점** — P1 풀이(solution) 기반 코드로, 문서 가져오기(import), 상세 보기, 영속성(persistence) 기능이 구현 대기 중입니다. 하네스가 약합니다. AGENTS.md가 단순하고 세션 핸드오프(session-handoff)가 없습니다. |
| `solution/` | **참고 구현** — 모든 새 기능이 구현되어 있으며 완전한 워크스페이스 문서(ARCHITECTURE.md, PRODUCT.md, session-handoff.md)를 갖추고 있습니다. |

## 사용 방법

```sh
# 완료하려면 최소 2개의 에이전트 세션이 필요합니다
cd starter
npm install
# 세션 A: 문서 가져오기 및 상세 보기 구현
# 세션 B: 영속성 구현 (에이전트가 컨텍스트를 빠르게 복원하는지 관찰)

cd ../solution
npm install
# 완전한 하네스로 재실행하여 세션 복원 속도를 비교
```

## 이 프로젝트에서 다루는 기능

- 문서 가져오기 흐름 (파일 선택기 + IPC 전송)
- 문서 상세 보기 (메타데이터 + 내용 표시)
- 기본 영속성 (가져온 문서가 재시작 후에도 유지)

## 관련 강의

- [강의 03: 저장소가 왜 단일 진실 원천이어야 하는가](../../docs/lectures/lecture-03-why-the-repository-must-become-the-system-of-record/index.md)
- [강의 04: 왜 하나의 거대한 지시 파일이 실패하는가](../../docs/lectures/lecture-04-why-one-giant-instruction-file-fails/index.md)
