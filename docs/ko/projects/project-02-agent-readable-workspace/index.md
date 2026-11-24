[English Version →](../../../en/projects/project-02-agent-readable-workspace/)

> 관련 강의: [강의 03. 저장소를 단일 진실 원천으로 만들기](./../../lectures/lecture-03-why-the-repository-must-become-the-system-of-record/index.md) · [강의 04. 지침을 여러 파일로 분리하기](./../../lectures/lecture-04-why-one-giant-instruction-file-fails/index.md)
> 템플릿 파일: [templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/ko/resources/templates/)

# 프로젝트 02. 프로젝트를 읽기 쉽게 만들고 중단된 곳에서 재개하기

## 해야 할 일

새로운 에이전트(agent)가 프로젝트 구조를 빠르게 파악하고, 현재 진행 상황을 이해하며, 작업을 이어받을 수 있도록 저장소에 "가독성(readability)"을 추가합니다. 구체적으로는 문서 임포트(import), 문서 상세 보기, 로컬 퍼시스턴스(persistence)를 구현하며, 두 세션에 걸쳐 완성합니다.

같은 `starter/` 코드에서 두 번 시작합니다. 첫 번째는 starter에 기본으로 포함된 간소한 하네스를 그대로 두고 `session-handoff.md`를 만들지 않습니다. 두 번째는 `solution/`의 인수인계 규칙이 포함된 `AGENTS.md`를 사용하고 세션 A가 끝날 때 `session-handoff.md`를 작성합니다. 각 실행은 두 세션으로 구성되며, 두 번째 세션이 첫 번째 세션에서 끝내지 못한 작업을 이어받습니다. 코드, 프롬프트, 에이전트, 세션 A의 중단 지점을 통일하고 `AGENTS.md`의 규칙과 인수인계 기록을 합친 하네스의 차이를 비교합니다.

에이전트는 컨텍스트 윈도(context window)가 초기화되면 이전 작업 흐름을 기억하지 못합니다. 세션 핸드오프(session handoff) 파일을 통해 이전 세션의 상태(state)를 영속화하면, 새 세션의 에이전트도 동일한 진행 지점에서 출발할 수 있습니다.

## 도구

- Claude Code 또는 Codex
- Git
- Node.js + Electron

## 하네스 메커니즘

에이전트 가독성 있는 작업 공간 + 영속 상태 파일(persistent state files)

## 저장소에 포함된 프로젝트 사용하기

저장소 경로: [`projects/project-02/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02)

| 디렉터리 | 내용 | 비교할 것 |
|------|------|------|
| [`starter/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/starter) | Project 01 코드에 문서 가져오기, 상세 보기, 지속성이 아직 완성되지 않은 상태입니다. 문서는 있지만 더 얇고 `session-handoff.md`가 없습니다. | 두 번째 에이전트 세션이 얼마나 많은 컨텍스트를 다시 찾아야 하는지. |
| [`solution/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/solution) | 같은 제품 범위가 완성되어 있고, [`projects/project-02/solution/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/solution) 아래에 인수인계 문서와 [`feature_list.json`](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/solution/feature_list.json), [`session-handoff.md`](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/solution/session-handoff.md)가 있습니다. | 새 세션이 저장소 상태만 보고 이어갈 수 있는지. |

`solution/`은 참고용이며 두 실행의 시작점이 아닙니다. 강한 하네스 쪽에서는 여기서 `AGENTS.md`만 가져옵니다.

## 실행 절차

두 실행에서 달라지는 것은 하네스뿐입니다. 시작 코드, 작업 프롬프트, 에이전트, 세션 A의 중단 지점은 같아야 합니다. [프로젝트 README](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/README.md)와 같이 세션 A에서는 문서 가져오기와 상세 보기를, 세션 B에서는 영속화를 구현합니다.

1. `p02-baseline/`과 `p02-improved/`처럼 서로 격리된 작업 디렉터리 두 개를 준비합니다. 한 번에 한 실행만 진행합니다. 두 세션을 마치면 결과를 보관하고 그 실행의 작업 디렉터리를 삭제한 뒤 다른 실행을 시작합니다. Git 브랜치로 두 실행을 나누지 마세요. 코딩 에이전트는 다른 브랜치나 같은 상위 디렉터리 아래의 파일을 읽을 수 있으므로, 약한 하네스 쪽에서 강한 하네스의 파일이 보이면 비교가 오염됩니다(Project 01과 같은 규칙입니다).
2. 두 디렉터리에 [`projects/project-02/starter/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/starter)를 복사합니다. Project 01의 완성본을 바탕으로 하므로 Project 01 기능은 이미 검증을 통과했으며, Project 02의 세 기능은 `feature_list.json`에서 `not-started` 상태입니다. 직접 구현한 Project 01 결과를 쓰고 싶다면 동일한 스냅샷을 두 디렉터리에 복사합니다. 두 실행의 시작 코드가 완전히 같아야 합니다.
3. 두 실행에 같은 작업 프롬프트를 사용합니다. 예: "파일 선택기로 문서를 가져오고 상세 보기에서 전체 내용을 표시하며, 앱을 재시작한 뒤에도 가져온 문서가 남도록 구현하세요."
4. 어느 쪽에도 `solution/docs/`, `solution/feature_list.json`, `solution/session-handoff.md`를 복사하지 마세요. 이미 구현된 가져오기와 내용 로드 흐름을 설명하고 모든 기능을 `pass`로 표시하므로 정답을 미리 주게 됩니다. 두 실행 모두 starter의 `docs/ARCHITECTURE.md`, `docs/PRODUCT.md`, `feature_list.json`을 그대로 둡니다.

### 첫 번째 실행 (약한 하네스)

`p02-baseline/`에서는 starter의 짧은 `AGENTS.md`, `docs/`, `feature_list.json`을 그대로 두고 `session-handoff.md`는 만들지 않습니다. 기존 파일을 삭제하지 마세요. 약한 하네스는 간소한 것이지 비어 있는 것이 아닙니다.

**세션 A:**

1. 작업 프롬프트로 에이전트를 시작합니다.
2. 문서 가져오기와 상세 보기가 동작하지만 영속화가 완료되기 전에 직접 세션을 중단합니다. 앱을 실행하고 파일 선택기에서 `.txt` 또는 `.md` 파일을 가져와 목록에 나타나는지, 열어서 전체 내용을 볼 수 있는지 확인합니다. 앱을 재시작하면 가져온 문서는 아직 사라져야 합니다. 두 번째 실행에도 같은 종료 기준을 적용합니다.
3. 인수인계 기록이나 다른 요약 파일을 작성해 달라고 요청하지 않습니다.

**세션 B:**

1. 같은 디렉터리에서 새 에이전트 세션을 열고 "작업을 계속하세요"라고만 말합니다.
2. 첫 번째 의미 있는 코드 변경까지 걸린 시간과, 세션 A에서 이미 알았던 정보(구조, 명령, 작업 중이던 기능 등)를 다시 찾아낸 횟수를 기록합니다.

### 두 번째 실행 (강한 하네스)

`p02-improved/`에서 세션 A를 시작하기 전에 `AGENTS.md`를 [`solution/AGENTS.md`](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/solution/AGENTS.md)로 교체합니다. 이 파일에는 시작 규칙, 문서 우선순위와 갱신 규칙, `feature_list.json`에 증거를 남겨야 하는 완료 기준, 세션 인수인계 절이 있습니다. 다른 파일은 바꾸지 않습니다. `AGENTS.md`에는 인수인계 외에도 여러 규칙이 있으므로, 하네스 전체를 비교하는 것이며 세션 B의 차이를 인수인계 기록만의 효과로 볼 수는 없습니다. 인수인계 효과만 보려면 starter의 `AGENTS.md`에 인수인계 절만 추가한 세 번째 실행을 진행하세요.

**세션 A:**

1. 같은 작업 프롬프트로 에이전트를 시작합니다.
2. 첫 실행과 같은 지점에서 멈춥니다(가져오기와 상세 보기는 동작하고 영속화는 미완성).
3. 세션을 닫기 전에 에이전트에게 저장소 루트에 `session-handoff.md`를 작성하게 합니다. [세션 인수인계 템플릿](./../../resources/templates/session-handoff.md)에 따라 검증한 내용, 변경 사항, 고장 났거나 검증하지 않은 부분, 다음 우선 작업을 적습니다. [완성본 예시](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/solution/session-handoff.md)는 모든 기능이 완료된 상태이므로 복사하지 않습니다.

**세션 B:**

1. 같은 디렉터리에서 새 에이전트 세션을 열고 "작업을 계속하세요"라고만 말합니다. `session-handoff.md`를 읽으라는 지시는 프롬프트가 아닌 `AGENTS.md`에서 옵니다.
2. 첫 번째 실행과 같은 지표를 기록합니다.

## 결과 측정 방법

| 지표 | 설명 |
|------|------|
| 세션 B의 작업 재개 시간 | 세션 시작부터 첫 번째 의미 있는 코드 변경까지 걸린 시간 |
| 재발견 횟수 | 이미 알려져 있던 구조, 명령, 상태 등을 에이전트가 다시 찾은 횟수 |
| 인수인계 품질 | 기록이 완전하고 정확하며 다음 작업에 바로 쓸 수 있는지(두 번째 실행만 해당) |
| 중복 작업 | 세션 B에서 세션 A의 완료 작업을 얼마나 다시 했는지 |
| 최종 완료 여부 | 세 기능을 모두 완료했는지 |

## 제출물

- 약한 하네스 실행 기록: 세션 A와 B의 대화 기록 또는 로그
- 강한 하네스 실행 기록: 같은 로그와 함께 사용한 `AGENTS.md`, 에이전트가 작성한 `session-handoff.md`
- 비교 메모: 작업 재개 속도와 컨텍스트 복구 품질
