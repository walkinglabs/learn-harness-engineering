# 품질 문서 (Quality Document)

각 제품 도메인(product domain)과 아키텍처(architecture) 레이어(layer)에 대한 품질 스냅샷(snapshot)입니다. 에이전트(agent)와 사람 모두 이 문서를 사용하여 코드베이스(codebase)에서 강한 부분과 보완이 필요한 부분을 빠르게 파악할 수 있습니다.

이 문서는 개별 세션 산출물이 아닌 프로젝트 전체의 건전성을 시간에 따라 추적한다는 점에서 평가자 루브릭(evaluator rubric)과 구분됩니다.

**업데이트 주기:** 각 중요한 세션 후, 또는 새 작업 단계 시작 전.

**등급 기준:**

- **A**: 모든 검증(verification) 통과, 클린(clean) 아키텍처, 에이전트 가독성(agent-legible), 안정적인 테스트
- **B**: 검증 통과, 대체로 클린, 가독성 또는 테스트 커버리지에 사소한 격차 있음
- **C**: 부분적으로 작동, 알려진 격차, 일부 코드 영역이 에이전트가 이해하기 어려움
- **D**: 작동하지 않거나, 주요 구조적 문제 있음

---

## 제품 도메인 (Product Domains)

| 도메인 (Domain) | 등급 (Grade) | 검증 (Verification) | 에이전트 가독성 (Agent Legibility) | 테스트 안정성 (Test Stability) | 주요 격차 (Key Gaps) | 마지막 업데이트 (Last Updated) |
|--------|-------|-------------|-----------------|---------------|----------|-------------|
| Document Import | - | - | - | - | - | - |
| Document Management | - | - | - | - | - | - |
| Document Indexing | - | - | - | - | - | - |
| Q&A Flow | - | - | - | - | - | - |
| Grounded Answers | - | - | - | - | - | - |

## 아키텍처 레이어 (Architectural Layers)

| 레이어 (Layer) | 등급 (Grade) | 경계 적용 (Boundary Enforcement) | 에이전트 가독성 (Agent Legibility) | 주요 격차 (Key Gaps) | 마지막 업데이트 (Last Updated) |
|-------|-------|---------------------|-----------------|----------|-------------|
| Main Process | - | - | - | - | - |
| Preload | - | - | - | - | - |
| Renderer | - | - | - | - | - |
| Services | - | - | - | - | - |

## 변경 이력 (Change History)

### YYYY-MM-DD

- Changes:
- Domains promoted:
- Demoted:
- New gaps identified:
- Gaps closed:
