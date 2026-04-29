[English](./README.md) · **한국어**

# 프로젝트 06: 런타임 가관측성과 디버깅 (캡스톤)

강의 졸업 프로젝트: 완전한 하네스(harness)를 구축하고 벤치마크(benchmark) 테스트를 수행하며, 정리(cleanup) 루프를 실행하여 품질 유지 가능성을 검증합니다.

이 프로젝트는 강의 전체를 종합하는 캡스톤(capstone)입니다. 이전 다섯 프로젝트에서 배운 모든 하네스 메커니즘을 하나의 완전한 시스템으로 통합합니다. 완성된 하네스는 미래의 에이전트 세션이 안정적으로 작업을 이어받을 수 있는 기반을 제공해야 합니다.

## 디렉터리 설명

| 디렉터리 | 의미 |
|----------|------|
| `starter/` | **시작점** — 완전한 제품 코드이지만 하네스가 의도적으로 약화되어 있습니다(기본 AGENTS.md만 있고, feature_list.json, session-handoff, clean-state-checklist가 없음). |
| `solution/` | **참고 구현** — 최대 하네스: 모든 산출물 파일이 완비되어 있고, 품질 문서 점수가 높으며, 벤치마크 스크립트와 정리 스캐너가 포함되어 있습니다. |

## 사용 방법

```sh
cd starter
npm install
# 약한 하네스로 벤치마크 스위트를 실행하고 결과를 기록

cd ../solution
npm install
# 완전한 하네스로 동일한 벤치마크를 실행
# 정리 루프 실행
# quality-document.md의 점수 변화를 비교

# 벤치마크 실행
./scripts/benchmark.sh

# 정리 스캔 실행
./scripts/cleanup-scanner.sh
```

## 이 프로젝트에서 다루는 기능

- 문서 가져오기
- 인덱스 구축 또는 갱신
- 인용이 포함된 문답
- 런타임 피드백(feedback)
- 읽기 가능하고 재시작 가능한 저장소 상태

## 관련 강의

- [강의 11: 에이전트의 런타임을 가관측하게 만드는 방법](../../docs/lectures/lecture-11-why-observability-belongs-inside-the-harness/index.md)
- [강의 12: 모든 세션이 왜 깨끗한 상태를 남겨야 하는가](../../docs/lectures/lecture-12-why-every-session-must-leave-a-clean-state/index.md)
