---
title: 한국어 용어집 (Glossary)
description: Learn Harness Engineering 한국어판 전반에서 사용되는 핵심 용어의 한·영 대응표와 정의입니다.
---

# 한국어 용어집 (Glossary)

이 문서는 한국어판 전체에서 일관된 번역어를 보장하기 위한 단일 진실 원천(Single Source of Truth)입니다. 각 강의·프로젝트·리소스 문서에서 처음 등장하는 전문 용어는 본 용어집의 표기를 따릅니다.

## 표기 규칙 (Convention)

- **첫 등장 형식**: 본문에서 처음 나오는 전문 용어는 `한국어(English)` 형태로 병기합니다. 예: `하네스(harness)`, `에이전트(agent)`.
- **두 번째 이후**: 한국어만 사용하되, 문맥상 모호하면 다시 영어를 병기할 수 있습니다.
- **고유명사·도구명**: `Claude Code`, `Codex`, `VitePress`, `GitHub Actions` 등은 영어 그대로 둡니다.
- **시스템 토큰**: `BLOCKING`, `HARD`, `[CP]`, `@plan-writer`, `Skill("...")` 등 코드·프롬프트에서 의미를 갖는 토큰은 번역하지 않습니다.
- **명령어·파일 경로**: `npm run docs:build`, `docs/.vitepress/config.mts` 등은 영어로 유지합니다.

## 핵심 개념 (Core Concepts)

| English | 한국어 | 정의 |
|---------|--------|------|
| Harness | 하네스 | AI 코딩 에이전트가 안정적으로 동작하도록 환경·상태·검증·제어를 묶어서 제공하는 외골격(스캐폴딩) 시스템. 본 강의의 중심 개념. |
| Harness Engineering | 하네스 엔지니어링 | 하네스를 설계·구축·유지보수하는 공학적 실천 분야. |
| Agent | 에이전트 | 자율적으로 작업을 수행하는 AI 소프트웨어 단위. 본 강의에서는 주로 코딩 에이전트(coding agent)를 가리킵니다. |
| Coding Agent | 코딩 에이전트 | 코드 작성·리팩터·테스트 등 개발 작업을 수행하는 AI 에이전트. |
| State | 상태 | 에이전트가 다음 행동을 결정할 때 참조하는 영속 데이터(작업 진행 로그, 기능 목록, git 히스토리, 체크리스트 등). |
| Context | 컨텍스트 | 에이전트가 한 번의 추론에 사용하는 입력 정보의 집합. 모델의 컨텍스트 윈도(context window)에 담긴 내용. |
| Context Window | 컨텍스트 윈도 | LLM이 한 번에 처리할 수 있는 토큰의 최대 길이. |
| Repository as System of Record | 시스템 오브 레코드(SoR)로서의 저장소 | 작업 결과·결정·근거를 모두 git 저장소에 영속화하여 신뢰의 단일 원천으로 삼는 원칙. |

## 작업·산출물 (Work and Deliverables)

| English | 한국어 | 정의 |
|---------|--------|------|
| Deliverable | 산출물 | 작업의 결과로 만들어지는 파일·문서·코드 등 검증 가능한 실체. |
| Specification | 명세 | 작업의 입력·동작·출력을 명확히 정의한 문서. `spec`로 줄여 쓰기도 합니다. |
| Plan | 계획 | 명세를 만족시키기 위한 단계별 작업 순서와 책임 배분 문서. |
| TODO Checklist | TODO 체크리스트 | 계획을 실행 가능한 단위 작업으로 분해한 체크박스 목록. |
| Commit | 커밋 | git에서 변경 사항을 영속화하는 단위. |
| Branch | 브랜치 | 독립적인 작업 흐름을 유지하기 위한 git 분기. |
| Worktree | 워크트리 | 같은 저장소에서 여러 작업 흐름을 동시에 진행하기 위한 별도 작업 디렉터리. |
| Pull Request (PR) | 풀 리퀘스트(PR) | 한 브랜치의 변경 사항을 다른 브랜치로 병합 요청하는 GitHub의 협업 단위. |

## 검증과 품질 (Verification and Quality)

| English | 한국어 | 정의 |
|---------|--------|------|
| Verification | 검증 | 산출물이 명세를 만족하는지 객관적 증거로 확인하는 절차. |
| Validation | 유효성 검사 | 입력값이 제약을 만족하는지 확인하는 절차. 검증보다 좁은 의미. |
| Critique | 비평(크리틱) | 계획·설계·산출물의 약점을 사전에 발견하기 위한 적대적(adversarial) 검토. |
| Review | 리뷰 | 코드·문서를 동료 또는 에이전트가 읽고 피드백을 남기는 절차. |
| Test | 테스트 | 코드의 동작을 자동으로 확인하는 검증 수단(단위·통합·E2E 등). |
| TDD (Test-Driven Development) | 테스트 주도 개발 | RED→GREEN→IMPROVE 순서로 테스트를 먼저 쓴 뒤 구현하는 방식. |
| Acceptance Criteria | 인수 기준 | 작업이 완료되었다고 인정받기 위해 만족해야 할 객관적 조건. |
| Quality Gate | 품질 게이트 | 다음 단계로 진행하기 전에 통과해야 하는 자동·수동 검사 묶음. |
| Lint | 린트 | 정적 분석으로 스타일·잠재적 오류를 검출하는 도구(예: `ruff`, `eslint`). |
| Type Check | 타입 검사 | 정적 타입 시스템으로 타입 오류를 사전에 감지하는 절차(예: `pyright`, `tsc --noEmit`). |

## 하네스 구성 요소 (Harness Components)

| English | 한국어 | 정의 |
|---------|--------|------|
| Skill | 스킬 | 특정 작업 흐름을 묘사한 재사용 가능한 프롬프트 모듈. 에이전트가 필요할 때 로드합니다. |
| Hook | 훅 | 에이전트의 라이프사이클(예: 도구 호출 전/후, 세션 시작) 시점에 실행되는 사용자 정의 스크립트. |
| Rule | 규칙 | 에이전트가 항상 따라야 하는 정책·제약을 모아 둔 마크다운 문서. |
| Subagent / Agent (role) | 서브에이전트 / 역할 에이전트 | 메인 세션이 위임할 수 있는 전문 역할(예: `@api-implement`, `@code-review`). |
| Orchestration | 오케스트레이션 | 여러 에이전트·도구·검사를 정해진 순서로 묶어 실행하는 상위 흐름 제어. |
| Permission | 권한 | 에이전트가 특정 도구·파일·명령을 사용할 수 있는지 제어하는 설정. |
| Preflight | 사전 점검(프리플라이트) | 본 작업을 시작하기 전에 환경·전제 조건이 갖춰졌는지 확인하는 단계. |
| Guardrail | 가드레일 | 에이전트가 위험한 행동을 하지 못하도록 막는 정책·검증 장치. |
| Telemetry | 텔레메트리 | 에이전트 실행 중에 수집하는 측정 지표(이벤트 로그·지연 시간·실패율 등). |

## 실패와 복구 (Failure and Recovery)

| English | 한국어 | 정의 |
|---------|--------|------|
| Fail-loud | 실패-크게(fail-loud) | 오류가 발생하면 즉시 눈에 띄게 알리는 정책. 침묵 실패의 반대. |
| Silent Failure | 무음(無音) 실패 | 오류가 났는데 아무런 신호 없이 다음 단계로 진행되는 현상. |
| Continuity | 연속성 | 장시간 작업 중에도 컨텍스트·상태가 유지되어 끊기지 않는 성질. |
| Handoff | 핸드오프 | 한 세션 또는 한 에이전트에서 다음 세션·에이전트로 작업을 인계하는 행위. |
| Session Handoff | 세션 핸드오프 | 컨텍스트가 잘릴 위험이 있을 때 다음 세션이 이어 받을 수 있도록 상태를 영속화하는 패턴. |
| Checkpoint | 체크포인트 | 복구 가능한 진행 지점에서 상태를 영속화한 시점. |
| Rollback | 롤백 | 특정 시점으로 상태를 되돌리는 행위. |

## 초기화와 컨벤션 (Initialization and Conventions)

| English | 한국어 | 정의 |
|---------|--------|------|
| Initialization | 초기화 | 새 프로젝트나 작업 환경에서 하네스를 설정하는 단계. |
| Onboarding | 온보딩 | 새 구성원(사람 또는 에이전트)이 프로젝트 컨벤션을 학습·적용하도록 돕는 절차. |
| Convention | 컨벤션 | 팀이 합의한 명명·구조·작업 방식의 표준. |
| Bootstrap | 부트스트랩 | 빈 상태에서 동작 가능한 최소 환경을 갖추는 일. |
| Scaffold | 스캐폴딩 | 작업 시작점이 될 디렉터리·파일 구조를 미리 생성해 주는 도구·패턴. |

## 도구 및 생태계 (Tools and Ecosystem)

| English | 한국어(또는 그대로) | 비고 |
|---------|---------------------|------|
| Claude Code | Claude Code | 그대로 사용. Anthropic의 코딩 에이전트 CLI. |
| Codex | Codex | 그대로 사용. OpenAI의 코딩 에이전트 CLI. |
| Cursor | Cursor | 그대로 사용. AI 코드 에디터. |
| VitePress | VitePress | 그대로 사용. 마크다운 기반 정적 사이트 생성기. |
| MCP (Model Context Protocol) | MCP(모델 컨텍스트 프로토콜) | 에이전트가 외부 도구·리소스를 발견·호출하기 위한 표준. |
| LSP (Language Server Protocol) | LSP(언어 서버 프로토콜) | 에디터와 언어 도구가 코드 정보를 주고받는 표준. |
| GitHub Actions | GitHub Actions | 그대로 사용. GitHub의 CI/CD 시스템. |
| LangGraph | LangGraph | 그대로 사용. 상태 그래프 기반 에이전트 프레임워크. |

## 보존 토큰 (Untranslated Tokens)

다음 토큰은 한국어판 본문에서도 절대 번역하지 않고 영어 그대로 유지합니다.

- 시스템 의미 토큰: `BLOCKING`, `HARD`, `[CP]`, `RED`, `GREEN`, `IMPROVE`, `DONE`, `RETRY`, `BLOCKED`
- 에이전트 식별자: `@plan-writer`, `@code-review`, `@doc-writer`, `@ui-implement` 등 모든 `@agent-name`
- 스킬 호출: `Skill("omb-doc")`, `Skill("omb-tdd")` 등 모든 `Skill("...")` 형태
- 파일 경로·명령어: `docs/.vitepress/config.mts`, `npm run docs:build`, `git commit -m "..."` 등
- frontmatter 키: `title`, `description`, `layout` 등 `---` 블록 내부의 영어 키 이름

## 향후 갱신 (Maintenance)

강의 번역 중 새 용어가 발견되면 본 문서에 즉시 추가하고, 후속 강의 번역 시 갱신본을 입력으로 사용합니다(계획 Task #16b 참조).
