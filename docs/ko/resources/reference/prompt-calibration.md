# 프롬프트 보정 (Prompt Calibration)

루트 지침(root instructions)은 가능한 모든 행동을 나열하는 것이 아니라 운영 프레임(operating frame)을 정의해야 합니다. 파일이 지나치게 커지면 에이전트(agent)가 중요한 정보를 찾기 어려워지고, 유지보수도 까다로워집니다.

## 루트 파일에 유지할 내용 (Keep In The Root File)

- 저장소 목적과 범위
- 시작 경로(startup path)
- 검증(verification) 경로
- 타협 불가 제약(non-negotiable constraints)
- 필수 상태 산출물(required state artifacts)
- 세션 종료 규칙

## 루트 파일에서 이동할 내용 (Move Out Of The Root File)

- 오래된 히스토리(history) 엣지 케이스(edge cases)
- 주제별 구현 세부 사항
- 코드 근처에 있어야 할 로컬 아키텍처(architecture) 노트
- 하나의 서브시스템(subsystem)에만 적용되는 예시

## 작업 규칙 (Working Rule)

루트 파일은 새 세션이 빠르게 방향을 잡도록 도와야 합니다. 파일이 과거 모든 실패 사례를 덤핑(dumping)하는 장소가 되고 있다면, 세부 내용을 더 작은 문서로 분리하고 대신 링크를 사용하십시오.
