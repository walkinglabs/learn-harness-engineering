# Claude Code의 harness 설계 분석

Anthropic은 《[Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)》에서 신뢰성은 모델이 아니라 harness에서 나오며, agent는 "모델 바깥"에서 제약되어야 한다고 분명히 말합니다. Claude Code는 이 아이디어를 제품화한 사례이며, Anthropic도 이를 **agentic harness** 범주에 직접 포함합니다. 이는 마케팅 문구가 아닙니다. Claude Code는 현재 공개적으로 가장 철저히 분석된 harness일 수 있습니다. 소스 코드가 공개되어 있고 커뮤니티 연구 보고서도 상세하며, 강의에 나오는 거의 모든 핵심 메커니즘(계층형 메모리, 컨텍스트 compaction, permissions, hooks, subagent, session 영속화)을 완전한 제품 구현으로 만들었습니다.

이 글에서는 강의의 다섯 가지 하위 시스템 프레임워크로 Claude Code를 분석하고, "컨텍스트 관리", "조기 완료 선언 방지", "결정론적 제약"이라는 harness의 근본 개념을 어떻게 구현했는지 중점적으로 살펴봅니다.

## 한 문장으로 정의하기

Claude Code의 핵심은 모델 호출, 도구 실행, 결과 관찰, 모델 재호출을 반복하는 단순한 while 루프입니다. 그러나 **코드 대부분은 이 루프 안이 아니라 루프를 둘러싼 시스템에 있습니다**. permissions 시스템, 컨텍스트 compaction 파이프라인, 확장 메커니즘, subagent 오케스트레이션, session 저장소가 그것입니다. 이것이 harness의 본질입니다. 루프는 골격일 뿐이며, 골격 바깥의 모든 것이 신뢰성을 결정합니다.

## 명령 하위 시스템: 계층형 메모리 체계

Claude Code의 메모리 시스템은 harness 이론에 대한 가장 직접적인 기여이며, 강의의 "저장소가 사실의 원천"과 "session 간 컨텍스트 연속성"에 대응합니다. [공식 문서 《How Claude remembers your project》](https://code.claude.com/docs/en/memory)는 각 session이 완전히 새로운 컨텍스트 창에서 시작하며, 두 가지 메커니즘으로 session 간 지식을 전달한다고 명시합니다. 바로 CLAUDE.md 파일(사용자가 작성한 명령)과 auto memory(Claude가 직접 작성한 메모)입니다.

공식 문서는 범위에 따라 CLAUDE.md 파일을 네 종류로 구분합니다(로드 순서상 넓은 범위에서 좁은 범위 순).

- **조직 정책 수준**: IT/DevOps가 일괄 관리하며(예: `/etc/claude-code/CLAUDE.md`) 회사 수준 규범을 담습니다.
- **사용자 수준 `~/.claude/CLAUDE.md`**: 여러 프로젝트에 적용되는 개인 선호와 규칙입니다.
- **프로젝트 수준 `./CLAUDE.md` 또는 `./.claude/CLAUDE.md`**: 프로젝트 수준의 사실 원천으로, 엔지니어링 구조, 기술 스택, 검증 명령을 담고 저장소에서 공유합니다.
- **로컬 수준 `./CLAUDE.local.md`**: 프로젝트 안의 개인 선호를 담으며, 일반적으로 `.gitignore`에 추가해 커밋하지 않습니다.

이 외에도 두 가지 메커니즘이 있습니다.

- **하위 디렉터리 수준의 필요 시 로드**: 하위 디렉터리의 CLAUDE.md는 시작할 때 로드하지 않고, Claude가 해당 디렉터리의 파일을 읽을 때 컨텍스트에 들어갑니다.
- **자동 메모리(auto memory)**: Claude가 사용자의 수정과 선호를 바탕으로 능동적으로 메모를 작성합니다. 저장소 단위로 공유되고 여러 worktree에 적용되며, 각 session에서는 최대 첫 200줄 또는 25KB를 로드합니다.

이 네 가지 범위는 하나의 **명령 계층**을 이룹니다. 공식 문서에 따르면 "더 구체적인 명령일수록 컨텍스트에 더 늦게 들어갑니다"(프로젝트 명령은 사용자 명령 뒤에 나타남). 그 가치는 모델이 대화를 시작할 때마다 하나의 거대한 명령 문서를 전부 소화하는 대신, 범위에 따라 가까운 곳의 명령을 로드하는 데 있습니다. 이는 강의 4 "왜 하나의 거대한 명령 파일이 실패하는가"에 대한 제품화된 답입니다.

## 컨텍스트 하위 시스템: 5단계 compaction 파이프라인

Claude Code는 컨텍스트를 단순히 "가득 차면 요약"하는 것이 아니라 **5단계 compaction 파이프라인**(five-layer compaction pipeline)으로 관리합니다. 이 아키텍처의 세부 사항은 [VILA Lab의 《Dive into Claude Code》](https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf)가 소스 코드 수준에서 분석한 내용입니다. 강의 5에서는 "장기 작업이 연속성을 잃는 이유"를 다룹니다. Claude Code의 해법은 다단계 깔때기입니다. 먼저 무손실 가지치기(중복된 도구 결과 제거)를 수행하고, 그다음 구조화된 정제를 거친 뒤, 마지막에야 손실이 있는 LLM 요약을 사용하며, 과도한 compaction을 막는 회로 차단 메커니즘도 함께 둡니다.

여기에 **추가 지향 session 저장소(append-oriented storage)** 설계가 결합됩니다. 모든 기록을 `history.jsonl`에 추가하고 `/resume` 복구와 fork 브랜치를 지원합니다. 이로써 "각 session이 끝나기 전에 인계를 잘한다"는 것을 보장합니다. 기억력이 좋아서가 아니라 저장 계층이 추가 지향적이고 재생 가능하기 때문입니다.

## 도구 하위 시스템: 네 가지 확장 메커니즘

Claude Code는 확장 표면을 네 종류로 나누며, 각각 서로 다른 문제를 해결합니다. 이 부분은 설계에서 가장 참고할 만합니다.

- **스킬(Skills)**: [공식 문서](https://code.claude.com/docs/en/skills)의 정의에 따르면 `SKILL.md`에 기술된 절차적 지식이며, 트리거 단어에 따라 자동으로 로드되고 점진적 공개를 사용합니다. "어떤 일을 하는 방법"에 관한 도메인 지식에 적합합니다.
- **MCP**: [공식 문서](https://code.claude.com/docs/en/mcp)의 JSON-RPC 프로토콜로 외부 시스템에 연결하며, "모델의 손이 외부 세계에 닿게 하는" 표준 인터페이스입니다.
- **Hooks**: [공식 문서](https://code.claude.com/docs/en/hooks)에 설명된 대로 `PreToolUse`, `PostToolUse`, `Stop` 등의 생명주기 이벤트에 연결되는 결정론적 스크립트입니다.
- **Plugin / Subagents**: [공식 문서](https://code.claude.com/docs/en/sub-agents)에 따라 복잡한 작업을 전문화된 agent에게 나누어 맡깁니다.

핵심 설계는 **책임 분리**입니다. CLAUDE.md는 "무엇인가"를, 스킬은 "어떻게 하는가"를, MCP는 "어디에 연결하는가"를, hooks는 "언제 강제하는가"를 담당합니다. 팀이 이 계층을 뒤섞으면(예: MCP가 해야 할 일을 CLAUDE.md에 작성) 강의에서 설명한 컨텍스트 누수가 발생합니다.

## 피드백과 검증: 결정론적 제약 + 인간과 기계의 역할 분담

강의 10은 "전체 흐름을 실행해야 진짜 검증이다"라고 설명합니다. Claude Code는 이에 대응해 두 갈래의 메커니즘을 사용합니다.

**1. Permissions 시스템(결정론적 제약).** Claude Code의 permissions는 "모든 것을 한 번씩 묻는" 방식이 아니라 일곱 가지 모드와 ML 기반 분류기로 구성됩니다. 저위험 작업은 허용하고 고위험 작업은 정책에 따라 질문하거나 거부합니다(아키텍처 세부 사항은 [VILA Lab 분석](https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf) 참고). 이는 "agent의 경계를 명확히 정하기"(강의 7)를 프롬프트로 간청하는 대신 런타임에서 강제한 것입니다.

**2. Hooks(조기 완료 선언 방지).** `PostToolUse` hooks는 도구 실행 후 검사를 강제로 실행하고 결과를 컨텍스트에 기록할 수 있으며, `Stop` hooks는 agent가 완료를 선언할 때 개입합니다. 이는 "작업하는 역할과 검사하는 역할의 분리"입니다. [Anthropic은 harness 글에서](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) agent가 자신의 작업을 자신 있게 칭찬("confidently praised their work")하는 현상을 명확히 관찰했습니다. 따라서 모델의 자기 평가를 신뢰하는 대신 hooks로 **결정론적** 검사를 주입합니다.

**3. Subagent(컨텍스트 격리).** 각 subagent의 대화 기록은 독립된 sidechain 파일에 저장되어 **부모 agent의 컨텍스트를 부풀리지 않습니다**([VILA Lab 분석](https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf) 참고). 이는 "작업 경계"와 "컨텍스트 격리"를 결합한 것입니다. 작업을 나누는 동시에 컨텍스트 오염도 격리합니다.

## 관찰 가능성과 session 영속화

Claude Code의 로그는 추가 방식의 완전한 기록(history.jsonl)이며, `/compact`, `/clear`, `/init` 같은 명시적 명령을 제공하므로 컨텍스트가 가득 찰 때까지 수동적으로 기다리지 않고 상태를 능동적으로 관리할 수 있습니다. `/init`은 "agent가 매번 작업 전에 먼저 초기화하게 하기"(강의 6)를 하나의 명령으로 구현합니다. [공식 문서](https://code.claude.com/docs/en/memory)에 따르면 이 명령은 코드베이스를 자동으로 분석하고 빌드 명령, 테스트 설명, 엔지니어링 규약을 포함한 초기 CLAUDE.md를 생성합니다.

## 강의 프레임워크에 매핑하기

| 하위 시스템 | Claude Code의 구현 | 평가 |
| --- | --- | --- |
| 명령 | 범위별 계층화(조직/사용자/프로젝트/로컬) + 자동 메모리 | 계층형 메모리의 모범 구현 |
| 도구 | 스킬 + MCP + hooks + subagent의 네 가지 확장 | 책임 구분이 명확하며 핵심 강점 |
| 환경 | 프로젝트 내 설정 + settings.json | CLAUDE.md에서 사용자가 직접 설명하는 데 의존 |
| 상태 | 추가 지향 session 저장소 + 5단계 compaction + resume/fork | 매우 강력하며 장기 작업 연속성의 참고 구현 |
| 피드백 | permissions 분류기 + PostToolUse hooks 강제 검사 | "조기 완료 선언 방지"를 결정론적 메커니즘으로 만듦 |

## 참고할 만한 설계

1. **명령을 한 파일에 쌓지 말고 범위별로 계층화하세요.** 디렉터리 수준 CLAUDE.md는 "가까운 곳에서 로드"하는 훌륭한 구현입니다.
2. **Compaction은 단계별 깔때기입니다.** 무손실 처리를 먼저 하고 손실 처리를 나중에 하며, 처음부터 전체 내용을 요약하지 마세요.
3. **Hooks로 결정론적 검사를 수행하세요.** 조기 완료 선언을 막는 것은 프롬프트의 간청이 아니라 런타임 강제입니다.
4. **Subagent의 컨텍스트를 격리하세요.** 작업과 컨텍스트를 함께 분리해 하위 작업 결과가 메인 루프를 오염시키지 않게 하세요.
5. **Session 저장소는 추가 지향적으로 만들고 재생 가능하게 하세요.** 인계는 기억이 아니라 저장 계층으로 보장합니다.

## 참고 자료(원문 / 소스 코드)

각 주장은 인상에 의존한 전달을 피하기 위해 아래 원문이나 소스 코드로 거슬러 올라갈 수 있습니다.

- **Claude Code 공식 문서 · Memory**: 각 session의 새로운 컨텍스트, CLAUDE.md의 네 가지 범위, 하위 디렉터리 필요 시 로드, auto memory(200줄 / 25KB), `/init`의 CLAUDE.md 생성.<br/>https://code.claude.com/docs/en/memory
- **Claude Code 공식 문서 · Skills / MCP / Hooks / Sub-agents**: 네 가지 확장 메커니즘과 이벤트(PreToolUse / PostToolUse / Stop)의 정의.<br/>https://code.claude.com/docs/en/skills ｜ https://code.claude.com/docs/en/mcp ｜ https://code.claude.com/docs/en/hooks ｜ https://code.claude.com/docs/en/sub-agents
- **VILA Lab 《Dive into Claude Code》**(소스 코드 수준 분석 보고서): 5단계 compaction 파이프라인, 일곱 가지 permissions 모드 + ML 분류기, sidechain subagent, 추가 지향 session 저장소 history.jsonl.<br/>https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf
- **Anthropic 《Effective harnesses for long-running agents》**: "신뢰성은 모델이 아니라 harness에서 나온다", agent가 자신의 작업을 자신 있게 칭찬한다는 관찰, hooks를 이용한 검증 등의 출처.<br/>https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- **Claude Code Full Stack 가이드**(커뮤니티, CLAUDE.md / Skills / MCP / Subagents / Hooks 계층): 확장 메커니즘의 책임 분리에 관한 추가 읽을거리.<br/>https://jsmanifest.com/claude-code-full-stack-guide

관련 강의: [강의 3 · 코드 저장소를 유일한 사실의 원천으로 만들기](../../lectures/lecture-03-why-the-repository-must-become-the-system-of-record/) ｜ [강의 9 · agent의 조기 완료 선언 방지하기](../../lectures/lecture-09-why-agents-declare-victory-too-early/) ｜ [강의 10 · 전체 흐름을 실행해야 진짜 검증이다](../../lectures/lecture-10-why-end-to-end-testing-changes-results/)
