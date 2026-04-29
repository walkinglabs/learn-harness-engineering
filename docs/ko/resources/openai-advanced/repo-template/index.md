# 고급 저장소 템플릿(Advanced Repo Template)

최소한의 하네스(harness)만으로는 부족하고, OpenAI 스타일의 에이전트 우선(agent-first) 문서 체계가 필요할 때 이 스타터를 실제 저장소에 복사하십시오.

저장소 템플릿(repo template)이란 에이전트와 인간 모두가 프로젝트 컨텍스트를 빠르게 파악하고, 점진적으로 더 깊은 정보를 탐색할 수 있도록 구조화된 스타터 파일 모음입니다.

## 복사 순서

1. `AGENTS.md`와 `ARCHITECTURE.md`를 저장소 루트에 복사한다.
2. 전체 `docs/` 트리를 복사한다.
3. `docs/PRODUCT_SENSE.md`, `docs/QUALITY_SCORE.md`, `docs/RELIABILITY.md`를 가장 먼저 채운다.
4. `docs/exec-plans/active/` 아래에 첫 번째 활성 계획(active plan)을 추가한다.
5. 진입점 파일은 짧게 유지하고 세부 사항은 연결된 문서로 라우팅한다.

## 이 템플릿이 최적화하는 것

- 지속형 저장소 로컬 컨텍스트
- 하나의 거대한 지시 파일 대신 점진적 공개(progressive disclosure)
- 명시적인 계획 라이프사이클
- 시간에 따른 품질 추적
- 에이전트와 사람 모두 읽기 쉬운 경계

여기 있는 모든 파일을 스타터로 취급하십시오. 실제로 사용하기 전에 플레이스홀더, 예시, 샘플 명령어를 실제 프로젝트 내용으로 교체하십시오.
