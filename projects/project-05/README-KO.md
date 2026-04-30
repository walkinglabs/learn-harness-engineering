[English](./README.md) · **한국어**

# 프로젝트 05: 평가기 루프와 3역할 업그레이드

역할 분리(단일 역할 / 생성기+평가기 / 계획기+생성기+평가기)가 구현 품질을 어떻게 변화시키는지 측정합니다.

에이전트 시스템에서 역할 분리는 중요한 품질 향상 기법입니다. 한 에이전트가 작업을 수행하는 동시에 자신의 작업을 평가하는 것은 이해충돌을 일으킵니다. 별도의 평가기 역할을 도입하면 더 객관적인 품질 검증이 가능합니다. 이 프로젝트는 세 가지 구성 방식을 직접 비교합니다.

## 디렉터리 설명

| 디렉터리 | 의미 |
|----------|------|
| `starter/` | **시작점** — P4 풀이(solution) 기반으로, 다중 턴 문답 이력 기능이 구현 대기 중입니다. |
| `solution/single-role/` | **변체 A** — 단일 에이전트가 모든 작업(계획 + 구현 + 자체 검토)을 수행합니다. 기본 품질. |
| `solution/gen-eval/` | **변체 B** — 생성기(generator) + 평가기(evaluator) 패턴. 수정 증거가 있으며 더 높은 품질. |
| `solution/plan-gen-eval/` | **변체 C** — 계획기(planner) + 생성기 + 평가기. 스프린트 계약(sprint contract)과 채점 기준(rubric)이 있는 최고 품질. |

## 사용 방법

```sh
# 세 변체는 각자 독립적으로 실행
cd solution/single-role && npm install  # 단일 역할 모드
cd solution/gen-eval && npm install     # 생성+평가 모드
cd solution/plan-gen-eval && npm install # 완전한 3역할 모드

# 세 변체의 다음을 비교:
# - 코드 품질 (evaluator-rubric.md 점수)
# - 발견된 결함 수
# - 필요한 재작업 정도
```

## 이 프로젝트에서 다루는 기능

- 다중 턴 문답 이력 (대화형 UI)
- 스프린트 계약(sprint contract)
- 평가기 채점 기준(evaluator rubric) 조정

## 관련 강의

- [강의 09: 에이전트가 너무 일찍 완료를 선언하지 못하도록 막는 방법](../../docs/lectures/lecture-09-why-agents-declare-victory-too-early/index.md)
- [강의 10: 전체 파이프라인 실행만이 진정한 검증인 이유](../../docs/lectures/lecture-10-why-end-to-end-testing-changes-results/index.md)
