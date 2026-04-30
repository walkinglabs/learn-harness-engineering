# 한국어 리소스 라이브러리 (Resource Library)

이 폴더는 강의에서 소개한 메서드(method)를 실제 저장소에 바로 복사해 사용할 수 있는 템플릿(template)과 간결한 참고 자료로 구체화한 것입니다. 에이전트(agent)가 여러 세션에 걸쳐 일관성 있게 작동하려면 별도의 설정·상태·범위를 매번 재도출하는 대신, 이 자료들을 기반으로 삼아야 합니다.

## 언제 사용하는가

Codex, Claude Code 또는 다른 코딩 에이전트가 여러 세션에 걸쳐 작업할 때 시작점으로 활용하십시오.

특히 다음 상황에서 유용합니다.

- 작업이 여러 세션에 걸쳐 진행될 때
- 기능(feature)이 많아 반쯤 완성된 채 방치되기 쉬울 때
- 에이전트가 지나치게 일찍 완료를 선언하는 경향이 있을 때
- 시작 단계를 매번 새로 발견해야 할 때

## 시작하기

최소 설정을 위해 먼저 다음 파일부터 시작하십시오.

- 루트 지침: [`templates/AGENTS.md`](./templates/AGENTS.md) 또는 [`templates/CLAUDE.md`](./templates/CLAUDE.md)
- 기능 상태: [`templates/feature_list.json`](./templates/feature_list.json)
- 진행 로그: [`templates/claude-progress.md`](./templates/claude-progress.md)
- 부트스트랩(bootstrap) 스크립트 참고: `docs/ko/resources/templates/init.sh`

그다음 다음 파일을 추가하십시오.

- 세션 핸드오프(session handoff): [`templates/session-handoff.md`](./templates/session-handoff.md)
- 클린 상태(clean state) 체크리스트: [`templates/clean-state-checklist.md`](./templates/clean-state-checklist.md)
- 평가자(evaluator) 루브릭(rubric): [`templates/evaluator-rubric.md`](./templates/evaluator-rubric.md)

"Harness engineering" 포스트에 나오는 OpenAI 스타일의 완전한 저장소 구조를 원한다면 고급 팩을 사용하십시오.

- [`openai-advanced/index.md`](./openai-advanced/index.md)

## 라이브러리 구조

- [`templates/`](./templates/index.md): 실제 저장소에 복사할 수 있는 템플릿
- [`reference/`](./reference/index.md): 메서드 노트, 시작 흐름, 실패 유형 맵
- [`openai-advanced/`](./openai-advanced/index.md): 고급 저장소 스켈레톤(skeleton), 시스템 오브 레코드(SoR) 문서, 에이전트 우선 거버넌스 템플릿

## 권장 최소 팩

- `AGENTS.md` 또는 `CLAUDE.md`
- `feature_list.json`
- `claude-progress.md`
- `init.sh`

이 네 파일만으로도 대부분의 에이전트 워크플로우를 눈에 띄게 안정화할 수 있습니다.

저장소가 여러 도메인, 활성 계획(plan), 품질 점수, 안정성 정책을 갖춘 장기 시스템으로 발전하면, 최소 팩을 무리하게 늘리는 대신 [`openai-advanced/`](./openai-advanced/index.md) 팩으로 전환하십시오.
