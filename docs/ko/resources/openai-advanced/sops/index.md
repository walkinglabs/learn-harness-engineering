# OpenAI 고급 표준 작업 절차(SOP)

이 표준 작업 절차(SOP, Standard Operating Procedure) 모음은 원문 문서의 운영 패턴을 직접 따르거나 응용할 수 있는 구체적인 실행 지침서(playbook)로 변환한 것입니다.

SOP란 반복 가능한 작업을 일관되게 실행할 수 있도록 단계별로 정리한 절차 문서로, 팀의 암묵지를 명시적인 지식으로 전환하는 데 핵심 역할을 합니다.

## 포함된 표준 작업 절차

- [`layered-domain-architecture.md`](./layered-domain-architecture.md):
  명시적인 계층과 횡단 관심사(cross-cutting) 경계를 설정한다
- [`encode-knowledge-into-repo.md`](./encode-knowledge-into-repo.md):
  채팅·문서·메모리에 있는 보이지 않는 지식을 저장소 로컬 파일로 옮긴다
- [`observability-feedback-loop.md`](./observability-feedback-loop.md):
  에이전트에게 로그·메트릭·트레이스와 반복 가능한 디버그 루프를 제공한다
- [`chrome-devtools-validation-loop.md`](./chrome-devtools-validation-loop.md):
  브라우저 자동화와 스냅샷을 활용하여 UI 동작을 깔끔해질 때까지 검증한다

## 사용 방법

1. 현재 병목 지점에 맞는 표준 작업 절차를 선택하십시오.
2. 체크리스트를 사용하여 누락된 산출물이나 툴링을 갖추십시오.
3. 결과로 나온 규칙들을 복사한 `repo-template/` 문서들에 인코딩하십시오.
4. 반복되는 리뷰 의견은 검사·스크립트·가드레일(guardrail)로 전환하십시오.

이 절차들을 맹목적으로 따르지 않아도 됩니다. 이것들은 하네스(harness)를 더 명료하고, 강제 가능하며, 반복 가능하게 만들기 위한 것입니다.
