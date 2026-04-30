# 초기화 에이전트 플레이북 (Initializer Agent Playbook)

저장소에서 첫 번째 본격적인 세션, 즉 점진적인 기능 작업이 시작되기 전에 이 플레이북(playbook)을 사용하십시오. 초기화(initialization)는 이후 모든 세션이 안정적으로 작동할 수 있는 기반을 마련하는 단계입니다.

## 목표 (Goal)

이후 세션이 시작 명령, 현재 상태, 작업 경계를 재도출하지 않고도 동작을 구현할 수 있도록 안정적인 운영 환경(operating surface)을 만드는 것입니다.

## 필수 산출물 (Required Outputs)

초기화 에이전트(agent)는 최소한 다음 산출물을 남겨야 합니다.

- `AGENTS.md` 또는 `CLAUDE.md` 와 같은 루트 지침 파일
- `feature_list.json` 과 같은 기계 가독 기능 목록
- `claude-progress.md` 와 같은 지속적인 진행 산출물
- `init.sh` 와 같은 표준 시작 헬퍼(helper)
- 기준선(baseline) 스캐폴드(scaffold)를 캡처하는 초기 안전 커밋(commit)

## 체크리스트 (Checklist)

1. 표준 시작 경로를 정의합니다.
2. 표준 검증(verification) 경로를 정의합니다.
3. 진행 로그(progress log)를 생성하고 시작 상태를 기록합니다.
4. 작업을 상태(status)가 있는 명시적인 기능으로 분해합니다.
5. 첫 번째 클린(clean) 기준선 커밋(commit)을 생성합니다.

## 성공 테스트 (Success Test)

이전 채팅 컨텍스트(context) 없는 새 세션이 다음 질문에 답할 수 있어야 합니다.

- 이 저장소가 무엇을 하는지
- 어떻게 시작하는지
- 어떻게 검증(verify)하는지
- 무엇이 미완성인지
- 다음으로 최선의 행동은 무엇인지
