# AGENTS.md

이 저장소는 장기 실행 코딩 에이전트(coding agent) 작업에 최적화되어 있습니다. 이 파일은 짧게 유지하십시오. 이 파일을 시스템 오브 레코드(system-of-record) 문서들로의 라우팅 계층으로 사용하되, 거대한 지시 모음으로 만들지 마십시오.

## 시작 워크플로우

코드를 변경하기 전에:

1. `pwd`로 저장소 루트를 확인한다.
2. 현재 시스템 지도와 의존성 규칙을 파악하기 위해 `ARCHITECTURE.md`를 읽는다.
3. 어떤 도메인 또는 계층이 가장 취약한지 확인하기 위해 `docs/QUALITY_SCORE.md`를 읽는다.
4. `docs/PLANS.md`를 읽고, 현재 작업 중인 활성 실행 계획(active execution plan)을 연다.
5. `docs/product-specs/`에서 관련 제품 명세(product spec)를 읽는다.
6. 이 저장소의 표준 부트스트랩(bootstrap) 및 검증(verification) 경로를 실행한다.
7. 기준 검증이 실패하면 범위를 추가하기 전에 기준을 먼저 복구한다.

## 라우팅 지도

- `ARCHITECTURE.md`: 도메인 지도, 계층 모델, 의존성 규칙
- `docs/design-docs/index.md`: 설계 결정(design decision)과 핵심 신념
- `docs/product-specs/index.md`: 현재 제품 동작과 인수 목표
- `docs/PLANS.md`: 계획 라이프사이클과 실행 계획 정책
- `docs/QUALITY_SCORE.md`: 제품 도메인 및 계층 건전성
- `docs/RELIABILITY.md`: 런타임 신호, 벤치마크, 재시작 기대치
- `docs/SECURITY.md`: 비밀(secret), 샌드박스, 데이터, 외부 행동 규칙
- `docs/FRONTEND.md`: UI 제약, 디자인 시스템 규칙, 접근성(accessibility) 검사

## 작업 계약

- 한 번에 하나의 제한된 계획 또는 기능 슬라이스로 작업한다.
- 코드 검사만으로 작업이 완료됐다고 표시하지 않는다. 실행 가능한 증거(evidence)가 필요하다.
- 동작을 변경하면, 같은 세션 내에서 일치하는 제품·계획·신뢰성 문서를 업데이트한다.
- 반복되는 리뷰 피드백이 있으면 채팅에서 재설명하는 대신 기계적인 규칙·검사·린터로 승격시킨다.
- 생성된 자료는 `docs/generated/`에, 외부 참고 자료는 `docs/references/`에 보관한다.
- 이 파일을 늘리는 것보다 작고 현재의 문서를 추가하는 것을 선호한다.

## 완료 정의

다음 모든 조건이 충족될 때만 변경이 완료된 것으로 간주한다.

- 목표 동작이 구현되었다
- 필요한 검증이 실제로 실행되었다
- 증거가 관련 계획 또는 품질 문서에서 연결되어 있다
- 영향받는 문서가 현재 상태를 유지한다
- 저장소가 표준 시작 경로에서 깔끔하게 재시작될 수 있다

## 세션 종료

세션을 종료하기 전에:

1. 활성 실행 계획을 업데이트한다.
2. 도메인 또는 계층이 의미 있게 변경된 경우 `docs/QUALITY_SCORE.md`를 업데이트한다.
3. 미뤄진 사항이 있으면 `docs/exec-plans/tech-debt-tracker.md`에 새 기술 부채(tech debt)를 기록한다.
4. 완료된 계획은 적절한 시점에 `docs/exec-plans/completed/`로 이동한다.
5. 명확한 다음 행동이 있는 재시작 가능한 상태로 저장소를 남긴다.
