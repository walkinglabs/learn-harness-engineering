# OpenAI 고급 팩(Advanced Pack)

이 폴더는 OpenAI의 "Harness engineering: leveraging Codex in an agent-first world" 문서에서 설명하는 보다 견고한 저장소(repository) 구조를 복사해서 바로 사용할 수 있는 스타터 파일로 패키징한 것입니다.

기본적인 하네스(harness)가 더 이상 충분하지 않고 다음과 같은 것들이 필요할 때 이 팩을 사용하십시오.

- 라우팅 스타일의 간결한 `AGENTS.md`
- 저장소 내 지속형 시스템 오브 레코드(system-of-record) 문서
- 활성 및 완료된 실행 계획(execution plan)
- 명시적인 제품, 신뢰성(reliability), 보안(security), 프론트엔드 정책 파일
- 제품 도메인과 아키텍처 계층별 품질 점수 관리
- 에이전트(agent) 친화적 참고 자료 폴더
- 아키텍처, 지식 포착(knowledge capture), 런타임 검증을 위한 표준 작업 절차(SOP)

## 포함된 스타터 레이아웃

[`repo-template/`](./repo-template/index.md) 아래에 있는 스타터 팩은 아래와 같은 구조를 반영합니다.

```text
AGENTS.md
ARCHITECTURE.md
docs/
├── design-docs/
│   ├── index.md
│   └── core-beliefs.md
├── exec-plans/
│   ├── active/
│   ├── completed/
│   └── tech-debt-tracker.md
├── generated/
│   └── db-schema.md
├── product-specs/
│   ├── index.md
│   └── new-user-onboarding.md
├── references/
│   ├── design-system-reference-llms.txt
│   ├── nixpacks-llms.txt
│   └── uv-llms.txt
├── DESIGN.md
├── FRONTEND.md
├── PLANS.md
├── PRODUCT_SENSE.md
├── QUALITY_SCORE.md
├── RELIABILITY.md
└── SECURITY.md
```

## 도입 방법

1. 저장소가 아직 작다면 최소 팩(minimal pack)부터 시작하십시오.
2. 더 강한 구조가 필요해지면 [`repo-template/`](./repo-template/index.md)의 파일들을 자신의 저장소에 복사하십시오.
3. `AGENTS.md`는 짧게 유지하십시오. 이 파일을 깊이 있는 문서들로의 라우터로 취급하되, 백과사전처럼 쓰지 마십시오.
4. 품질·신뢰성·계획 문서는 별도의 정리 날을 따로 잡지 말고 일상적인 작업의 일부로 업데이트하십시오.
5. 생성된 산출물(artifact)과 외부 참고 자료를 명시적으로 관리하여 에이전트가 채팅 기록에 의존하지 않고 찾을 수 있도록 하십시오.

## SOP 라이브러리

[`sops/`](./sops/index.md) 폴더는 원문 문서의 다이어그램을 단계별 운영 절차(표준 작업 절차, SOP)로 변환한 것입니다.

- 계층형 도메인 아키텍처(layered domain architecture) 설정
- 보이지 않는 지식을 저장소에 인코딩하기
- 로컬 관측 가능성(observability) 스택과 피드백 루프(feedback loop) 워크플로우
- UI 작업을 위한 Chrome DevTools 검증 루프(validation loop)

## 설계 원칙

- 짧은 진입점, 더 깊이 연결된 문서들
- 시스템 오브 레코드로서의 저장소
- 기계적 검사가 기억에 의존하는 규칙보다 낫다
- 계획과 품질 이력은 코드 옆에 존재한다
- 정리와 단순화는 일급(first-class) 책임이다

이 팩은 의도적으로 견해가 담겨 있지만, 그럼에도 맹목적으로 복사하지 않고 자신의 프로젝트에 맞게 조정해서 사용해야 합니다.
