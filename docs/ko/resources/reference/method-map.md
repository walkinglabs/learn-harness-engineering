# 메서드 맵 (Method Map)

이 표는 장기 코딩 에이전트(agent) 작업에서 자주 발생하는 실패 유형(failure mode)을, 보통 가장 먼저 이를 해결하는 산출물(artifact) 또는 운영 규칙(operating rule)에 매핑합니다. 새로운 문제를 발견했을 때 전역 지침 파일에 더 많은 텍스트를 덧붙이는 대신, 해당 실패 유형에 직접 대응하는 최소한의 산출물을 추가하는 원칙을 따릅니다.

| 실패 유형 (Failure mode) | 실제 현상 (What it looks like in practice) | 주요 수정 방법 (Primary fix) | 보조 산출물 (Supporting artifact) |
| --- | --- | --- | --- |
| 콜드 스타트 혼란 (Cold-start confusion) | 새 세션이 대부분의 시간을 설정 및 상태를 재발견하는 데 사용함 | 저장소를 시스템 오브 레코드(system of record)로 만들기 | `claude-progress.md` |
| 범위 확산 (Scope sprawl) | 에이전트가 여러 기능을 시작하지만 어느 것도 깔끔하게 마무리하지 못함 | 활성 범위 제한 | `feature_list.json` |
| 섣부른 완료 선언 (Premature completion) | 에이전트가 코드 편집 후, 실행 가능한 증거(runnable proof) 없이 완료를 주장함 | 완료를 증거에 연결 | `clean-state-checklist.md` |
| 취약한 시작 (Fragile startup) | 모든 세션이 프로젝트를 부팅하는 방법을 다시 배움 | 설정 및 검증 표준화 | `init.sh` |
| 약한 핸드오프(Weak handoff) | 다음 세션이 무엇이 검증되었고, 손상되었고, 다음에 무엇을 할지 알 수 없음 | 명시적인 핸드오프(handoff)로 종료 | `session-handoff.md` |
| 주관적 리뷰 (Subjective review) | 리뷰 품질이 취향이나 기억에 의존함 | 고정된 카테고리로 산출물 점수화 | `evaluator-rubric.md` |

## 운영 원칙 (Operating Principle)

관찰된 실패 유형(failure mode)을 직접 해결하는 최소한의 산출물을 추가하십시오. 하나의 전역 지침 파일에 더 많은 텍스트를 덤핑(dumping)하여 모든 신뢰성 문제를 해결하려 하지 마십시오.
