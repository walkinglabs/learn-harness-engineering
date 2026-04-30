[English](./README.md) · **한국어**

# 프로젝트 03: 범위 제어와 근거 기반 검증

명시적 범위(scope) 제어와 검증(verification) 게이트가 구현 정확도를 향상시키는지 평가합니다.

에이전트는 여러 기능을 동시에 구현하려는 경향이 있습니다. 이를 범위 이탈(scope drift)이라고 합니다. 이 프로젝트는 "한 번에 하나의 기능" 전략을 명시적으로 적용했을 때 산출물 품질이 어떻게 달라지는지 측정합니다.

## 디렉터리 설명

| 디렉터리 | 의미 |
|----------|------|
| `starter/` | **시작점** — P2 풀이(solution) 기반으로, 문서 청킹(chunking), 메타데이터 추출, 인덱스 상태, 기본 문답 기능이 구현 대기 중입니다. 한 번에 하나의 기능 전략 제약이 없습니다. |
| `solution/` | **참고 구현** — 모든 기능이 구현되어 있으며, AGENTS.md에 "한 번에 하나의 기능" 전략이 포함되어 있고, feature_list.json이 실패→통과 전환 과정과 검증 증거를 보여줍니다. |

## 사용 방법

```sh
cd starter
npm install
# 에이전트가 여러 기능을 동시에 구현하려 하는지 관찰 (범위 이탈)

cd ../solution
npm install
# 범위 제어를 적용하여 재실행, 기능 구현 정확도 비교
```

## 이 프로젝트에서 다루는 기능

- 문서 청킹 (단락 인식, 약 500자)
- 메타데이터 추출 (단어 수, 줄 수, 단락 수)
- 인덱스 상태가 UI에 표시
- 출처 인용(citation)이 포함된 기본 문답 흐름

## 관련 강의

- [강의 05: 세션 간 컨텍스트를 유지하는 방법](../../docs/lectures/lecture-05-why-long-running-tasks-lose-continuity/index.md)
- [강의 06: 모든 에이전트 세션 전에 초기화가 필요한 이유](../../docs/lectures/lecture-06-why-initialization-needs-its-own-phase/index.md)
