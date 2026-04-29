[English](./README.md) · [中文版](./README-CN.md) · **한국어**

# 스킬(Skills)

이 디렉터리에는 Learn Harness Engineering 프로젝트를 위한 재사용 가능한 AI 에이전트(agent) 스킬(skill)이 포함되어 있습니다. 각 스킬은 AI 코딩 에이전트(Claude Code, Codex, Cursor, Windsurf 등)가 로드하여 특화된 작업을 수행할 수 있는 독립적인 프롬프트(prompt) 템플릿입니다.

스킬은 에이전트가 복잡한 작업 흐름을 모듈화된 방식으로 처리할 수 있게 해주는 하네스(harness)의 핵심 구성 요소입니다. SKILL.md 파일을 진입점으로 하는 구조화된 형식을 따릅니다.

## 사용 가능한 스킬

### harness-creator

AI 코딩 에이전트를 위한 프로덕션 하네스 엔지니어링 스킬입니다. 에이전트 하네스 파일(AGENTS.md, 기능 목록, 검증 워크플로우, 세션 연속성(session continuity) 메커니즘)을 생성하고 평가하며 개선하는 데 도움을 줍니다.

- **5가지 참고 패턴**: 메모리 영속성(Memory Persistence), 컨텍스트 엔지니어링(Context Engineering), 도구 레지스트리(Tool Registry), 다중 에이전트 조율(Multi-Agent Coordination), 라이프사이클 및 부트스트랩(Lifecycle & Bootstrap)
- **템플릿**: AGENTS.md, feature-list.json, init.sh, progress.md
- **5개의 내장 평가(eval) 테스트 케이스**
- **이중 언어**: 영어 + 中文

전체 문서는 [harness-creator/README.md](harness-creator/README.md)를 참조하십시오.

## harness-creator 구축 방법

`harness-creator` 스킬은 **skill-creator** 방법론을 사용하여 개발되었습니다. skill-creator는 에이전트 스킬을 생성하고 테스트하고 반복하기 위한 Anthropic의 공식 메타 스킬입니다. skill-creator는 내장된 평가 실행기, 채점기, 벤치마크 뷰어를 갖춘 구조화된 워크플로우(초안 → 테스트 → 평가 → 반복)를 제공합니다.

이처럼 스킬 자체를 스킬로 만드는 접근 방식은 하네스 엔지니어링의 재귀적 특성을 보여줍니다. 에이전트를 위한 도구를 에이전트가 검증하는 구조입니다.

- **skill-creator 소스**: [anthropics/skills — skill-creator](https://github.com/anthropics/skills/tree/main/skills/skill-creator)
- **Anthropic Claude Code 스킬 문서**: [anthropics/claude-code — plugin-dev/skills](https://github.com/anthropics/claude-code/tree/main/plugins/plugin-dev/skills)

## 디렉터리 구조

```
skills/
├── README.md                    # 영어 버전 (이 파일의 원본)
├── README-CN.md                 # 중국어 버전
├── README-KO.md                 # 한국어 버전 (이 파일)
└── harness-creator/             # 하네스 엔지니어링 스킬
    ├── SKILL.md                 # 주요 스킬 정의 (이중 언어)
    ├── SKILL.md.en              # 영어 전용 버전
    ├── README.md                # 상세 문서
    ├── metadata.json            # 스킬 메타데이터 및 트리거
    ├── evals/                   # 테스트 케이스
    ├── templates/               # 스캐폴드(scaffold) 템플릿
    └── references/              # 심층 패턴 문서
```

## 스킬 동작 방식

각 스킬은 표준 구조를 따릅니다.

1. **SKILL.md** — 진입점. YAML 프론트매터(frontmatter)(이름, 트리거를 위한 설명)와 에이전트를 위한 마크다운 지시사항이 포함됩니다.
2. **references/** — 필요에 따라 컨텍스트로 로드되는 추가 문서.
3. **templates/** — 스킬이 사용자를 위해 생성할 수 있는 시작 템플릿.

스킬은 점진적 공개(progressive disclosure)를 사용합니다. 에이전트는 처음에 이름과 설명만 보고, 트리거되면 전체 SKILL.md 본문을 로드하며, 필요할 때만 번들된 리소스를 읽습니다.

이 접근 방식은 컨텍스트 윈도(context window)를 효율적으로 사용하기 위한 것입니다. 에이전트가 항상 모든 정보를 가지고 시작하는 것이 아니라, 필요한 시점에 필요한 정보를 로드합니다.

## 보안 감사

이 디렉터리의 모든 파일은 보안 감사를 마쳤습니다.

- 백도어, 숨겨진 URL, 인코딩된 페이로드 없음
- 데이터 유출 또는 하드코딩된 자격 증명 없음
- 명령 주입 취약점 없음
- `init.sh`는 표준 npm 라이프사이클 명령만 실행

## 라이선스

MIT
