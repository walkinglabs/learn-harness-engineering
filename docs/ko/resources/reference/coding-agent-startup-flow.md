# 코딩 에이전트 시작 흐름 (Coding Agent Startup Flow)

초기화(initialization)가 완료된 후 모든 세션 시작 시 이 흐름을 사용하십시오. 이 고정된 순서를 따르면 에이전트(agent)가 상태를 재발견하는 데 시간을 낭비하지 않고 즉시 작업에 집중할 수 있습니다.

## 고정된 시작 템플릿 (Fixed Startup Template)

1. `pwd`를 실행하여 저장소 루트를 확인합니다.
2. `claude-progress.md`를 읽습니다.
3. `feature_list.json`을 읽습니다.
4. `git log --oneline -5`로 최근 커밋(commit)을 검토합니다.
5. `./init.sh`를 실행합니다.
6. 기준선(baseline) 스모크(smoke) 또는 엔드-투-엔드(end-to-end) 경로를 실행합니다.
7. 기준선이 손상된 경우 먼저 수정합니다.
8. 가장 높은 우선순위의 미완성 기능을 선택합니다.
9. 검증이 완료되거나 명시적으로 차단될 때까지 그 기능만 작업합니다.

## 이 순서가 중요한 이유 (Why This Order Matters)

- `pwd`는 잘못된 디렉터리에서 실수로 작업하는 것을 방지합니다.
- 진행 및 기능 파일은 새 편집이 시작되기 전에 지속적인 상태(durable state)를 복구합니다.
- 최근 커밋(commit)은 가장 최근에 변경된 것을 설명합니다.
- `init.sh`는 메모리에 의존하는 대신 시작을 표준화합니다.
- 기준선(baseline) 검증은 새 작업이 이를 숨기기 전에 손상된 시작 상태를 잡아냅니다.

## 세션 종료 미러 (End-Of-Session Mirror)

같은 세션은 다음으로 종료되어야 합니다.

1. 진행 상태 기록
2. 기능 상태 업데이트
3. 필요 시 핸드오프(handoff) 작성
4. 안전한 작업 커밋(commit)
5. 클린(clean)한 재시작 경로 유지
