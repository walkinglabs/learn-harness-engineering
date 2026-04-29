[English](./README.md) · **한국어**

# 프로젝트 01: 기준선 대 최소 하네스

약한 하네스(harness)(프롬프트에만 의존)와 명시적 하네스(규칙 파일 + 검증(verification) 메커니즘)가 AI 코딩 에이전트의 작업 완료율에 미치는 영향을 비교합니다.

이 프로젝트는 본 강의의 출발점입니다. 하네스의 유무에 따른 차이를 직접 눈으로 확인하는 것이 목적입니다. 동일한 작업을 두 가지 조건에서 실행하고 결과를 측정하십시오.

## 디렉터리 설명

| 디렉터리 | 의미 |
|----------|------|
| `starter/` | **시작점** — 모호한 `task-prompt.md` 하나만 있으며 AGENTS.md, feature_list.json이 없습니다. 에이전트에게 제공하는 "약한 하네스" 버전입니다. |
| `solution/` | **참고 구현** — 동일한 앱 코드이지만 완전한 하네스 파일(AGENTS.md, feature_list.json, init.sh, claude-progress.md)을 갖추고 있습니다. "명시적 하네스" 버전입니다. |

## 사용 방법

```sh
# 1. starter(약한 하네스)로 에이전트 작업을 한 번 실행
cd starter
npm install
# task-prompt.md의 내용을 Claude Code / Codex에게 프롬프트로 제공
# 에이전트가 창 시작, 문서 목록, 문답 패널, 데이터 디렉터리 완료를 시도하도록 함

# 2. solution(명시적 하네스)으로 한 번 더 실행
cd ../solution
npm install
# 에이전트가 AGENTS.md를 읽고 규칙에 따라 동일한 작업을 수행하도록 함

# 3. 두 결과를 비교
# - 작업이 완료되었는가?
# - 몇 번이나 재시도가 필요했는가?
# - 에이전트가 조기에 "완료"를 선언했는가?
```

## 이 프로젝트에서 다루는 기능

- Electron 창 성공적으로 시작
- UI에 문서 목록 영역 표시
- UI에 문답 패널 표시
- 앱이 로컬 데이터 디렉터리를 생성하고 사용

## 관련 강의

- [강의 01: 강력한 모델이 왜 여전히 실패하는가](../../docs/lectures/lecture-01-why-capable-agents-still-fail/index.md)
- [강의 02: 하네스가 실제로 무엇인가](../../docs/lectures/lecture-02-what-a-harness-actually-is/index.md)
