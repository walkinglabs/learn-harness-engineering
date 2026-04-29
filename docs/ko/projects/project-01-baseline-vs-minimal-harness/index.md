[English Version →](../../../en/projects/project-01-baseline-vs-minimal-harness/)

> 관련 강의: [강의 01. 강력한 모델이 곧 신뢰할 수 있는 실행을 의미하지는 않습니다](./../../lectures/lecture-01-why-capable-agents-still-fail/index.md) · [강의 02. 하네스가 실제로 의미하는 것](./../../lectures/lecture-02-what-a-harness-actually-is/index.md)
> 템플릿 파일: [templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/en/resources/templates/)

# 프로젝트 01. 프롬프트 단독 vs. 규칙 우선(Rules-First): 차이는 얼마나 클까

## 해야 할 일

최소한의 Electron 지식 베이스 앱 쉘(shell)을 구축합니다. 왼쪽에 문서 목록이 있고, 오른쪽에 Q&A 패널이 있으며, 로컬 데이터 디렉터리가 포함된 창입니다. 작업 자체는 복잡하지 않습니다. 복잡한 것은 에이전트(agent)가 이 작업을 완료하도록 만드는 방법입니다.

두 번 실행합니다. 첫 번째: 프롬프트만 사용하고 사전 준비 없이 진행합니다. 두 번째: `AGENTS.md`, `init.sh`, `feature_list.json`을 저장소에 미리 배치한 상태로 진행합니다. 그런 다음 비교합니다.

이 프로젝트의 핵심은 코드를 작성하는 것이 아닙니다. "규칙을 먼저 준비하는 데 15분을 쓰는 것"과 "에이전트를 그냥 실행시키는 것" 사이의 격차가 얼마나 큰지 파악하는 것입니다.

에이전트에게 규칙(rule)과 초기화(initialization) 단서를 제공하면 작업 범위를 스스로 파악하고 불필요한 탐색을 줄일 수 있습니다. 이처럼 최소한의 하네스만으로도 에이전트의 출발점과 결과 품질이 크게 달라집니다.

## 도구

- Claude Code 또는 Codex (하나를 선택하여 두 번의 실행 모두 동일하게 사용)
- Git (브랜치 관리 및 비교)
- Node.js + Electron (프로젝트 스택)
- 타이머 (각 실행의 소요 시간 기록)

## 하네스 메커니즘

최소 하네스(minimal harness): `AGENTS.md` + `init.sh` + `feature_list.json`
