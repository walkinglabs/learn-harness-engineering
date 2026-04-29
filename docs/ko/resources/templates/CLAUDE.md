# CLAUDE.md

이 파일은 하네스(harness) 리소스 라이브러리에 포함된 샘플 템플릿입니다. 실제 프로젝트에 복사한 뒤 프로젝트 고유의 명령어와 경로로 수정하여 사용하십시오. `AGENTS.md`와 구조는 동일하며 Claude Code의 지침 스타일에 맞게 형식화된 버전입니다.

여러분은 장기 구현 작업을 위해 설계된 저장소에서 작업하고 있습니다. 속도보다 신뢰성 있는 완료, 세션 간 연속성(continuity), 명시적인 검증(verification)을 우선하십시오.

## 운영 루프 (Operating Loop)

모든 세션 시작 시:

1. `pwd`를 실행하여 예상된 저장소 루트에 있는지 확인합니다.
2. `claude-progress.md`를 읽습니다.
3. `feature_list.json`을 읽습니다.
4. `git log --oneline -5`로 최근 커밋(commit)을 검토합니다.
5. `./init.sh`를 실행합니다.
6. 기준선(baseline) 스모크(smoke) 또는 엔드-투-엔드(end-to-end) 경로가 이미 손상되었는지 확인합니다.

그런 다음 미완성 기능 하나를 정확히 선택하고, 검증이 완료되거나 차단되었다고 명시적으로 문서화할 때까지 그 기능만 작업하십시오.

## 규칙 (Rules)

- 한 번에 하나의 활성 기능만.
- 실행 가능한 증거(evidence) 없이 완료를 주장하지 않습니다.
- 미완성 작업을 숨기기 위해 기능 목록을 재작성하지 않습니다.
- 작업이 완료된 것처럼 보이게 하기 위해 테스트를 제거하거나 약화시키지 않습니다.
- 시스템 오브 레코드(system of record)로서 저장소 산출물(repository artifacts)을 사용합니다.

## 필수 파일 (Required Files)

- `feature_list.json`
- `claude-progress.md`
- `init.sh`
- `session-handoff.md` — 간결한 핸드오프(handoff)가 유용할 때

## 완료 게이트 (Completion Gate)

필요한 검증이 성공하고 결과가 기록된 후에만 기능을 `passing`으로 이동할 수 있습니다.

## 중단하기 전에 (Before You Stop)

1. 진행 로그(progress log)를 업데이트합니다.
2. 기능 상태(feature state)를 업데이트합니다.
3. 여전히 손상되거나 미검증된 것을 기록합니다.
4. 저장소가 재개 가능한 상태가 되면 커밋합니다.
5. 다음 세션을 위한 클린(clean)한 재시작 경로를 남겨 둡니다.
