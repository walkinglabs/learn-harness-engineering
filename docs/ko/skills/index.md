# 스킬 (Skills)

이 디렉터리에는 본 강의와 함께 제공되는 번들(bundled) AI 에이전트(agent) 스킬(skill)이 포함되어 있습니다. 스킬은 AI 코딩 에이전트(Claude Code, Codex, Cursor, Windsurf 등)가 특수한 작업을 수행하기 위해 로드(load)할 수 있는 자기 완결적 프롬프트 템플릿(template)입니다.

## harness-creator

AI 코딩 에이전트를 위한 프로덕션(production) 등급의 하네스 엔지니어링(harness engineering) 스킬입니다. 다섯 가지 핵심 하네스(harness) 서브시스템(subsystem)인 지침(instructions), 상태(state), 검증(verification), 범위(scope), 세션 라이프사이클(session lifecycle)을 생성·평가·개선하도록 돕습니다.

### 기능 (What It Does)

- **처음부터 하네스 생성** — AGENTS.md, 기능 목록(feature list), 검증(verification) 워크플로우
- **기존 하네스 개선** — 다섯 가지 서브시스템 평가와 우선순위화된 개선 사항
- **세션 연속성(continuity) 설계** — 메모리(memory) 영속화, 진행 추적, 핸드오프(handoff) 절차
- **프로덕션 패턴 적용** — 메모리, 컨텍스트 엔지니어링(context engineering), 도구 안전성, 멀티 에이전트(multi-agent) 조율

### 빠른 시작 (Quick Start)

스킬 파일은 저장소의 [`skills/harness-creator/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/skills/harness-creator)에 위치합니다.

Claude Code와 함께 사용하려면 `harness-creator/` 디렉터리를 프로젝트의 스킬 경로에 복사하거나, 에이전트가 SKILL.md 파일을 가리키도록 설정하십시오.

### 참고 패턴 (Reference Patterns)

이 스킬에는 6가지 심층 참고 문서가 포함됩니다.

| 패턴 (Pattern) | 사용 시점 (When to Use) |
|---------|-------------|
| Memory Persistence | 에이전트가 세션 간에 기억을 잃을 때 |
| Context Engineering | 컨텍스트 예산 관리, JIT 로딩 |
| Tool Registry | 도구 안전성, 동시성 제어 |
| Multi-Agent Coordination | 병렬화, 특수화 워크플로우 |
| Lifecycle & Bootstrap | 훅(hook), 백그라운드 작업, 초기화(initialization) |
| Gotchas | 15가지 비자명한 실패 유형과 수정 방법 |

### 템플릿 (Templates)

이 스킬에는 바로 사용할 수 있는 템플릿이 포함되어 있습니다.

- `agents.md` — 작업 규칙이 있는 AGENTS.md 스캐폴드(scaffold)
- `feature-list.json` — JSON Schema와 기능 목록 예시
- `init.sh` — 표준 초기화(initialization) 스크립트
- `progress.md` — 세션 진행 로그 템플릿

### 이 스킬이 만들어진 방법 (How This Skill Was Built)

`harness-creator`는 **skill-creator** 방법론을 사용하여 개발되었습니다. 이는 에이전트 스킬을 생성·테스트·반복하기 위한 Anthropic의 공식 메타 스킬입니다. skill-creator는 구조화된 워크플로우(draft → test → evaluate → iterate)를 내장된 평가 러너(eval runner), 채점기(grader), 벤치마크 뷰어(benchmark viewer)와 함께 제공합니다.

- **skill-creator 소스**: [anthropics/skills — skill-creator](https://github.com/anthropics/skills/tree/main/skills/skill-creator)
- **Claude Code 스킬 문서**: [anthropics/claude-code — plugin-dev/skills](https://github.com/anthropics/claude-code/tree/main/plugins/plugin-dev/skills)
