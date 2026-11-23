# Pi의 harness 설계 분석

[Pi](https://pi.dev/)(npm 패키지 `@earendil-works/pi-coding-agent`)는 스스로를 "minimal agent harness", 즉 극도로 단순한 agent harness라고 부릅니다. 이 표현은 뜯어볼 가치가 있습니다. "가장 강력한 coding agent"나 "가장 쓰기 좋은 AI 프로그래밍 도구"를 자처하지 않고, 자신의 위치를 **harness**라는 단어에 확실히 고정했기 때문입니다.

이 글에서는 강의의 다섯 가지 하위 시스템 프레임워크(명령, 도구, 환경, 상태, 피드백)로 Pi를 분석하고, 그 설계 철학이 Claude Code 및 Codex와 근본적으로 어떻게 다른지 살펴봅니다. 결론부터 말하면, **Pi의 철학은 "커널 최소화 + 확장의 프로그래밍 가능화"입니다. 컨텍스트 엔지니어링을 시스템 프롬프트 바깥에 구현하여 Pi가 사용자를 대신해 harness를 결정하는 것이 아니라, 사용자(심지어 Pi 자신까지)가 harness를 수정하게 합니다.**

## 한 문장으로 정의하기

Pi는 극도로 단순한 커널입니다. 공식 포지셔닝은 의도적으로 커널을 작게 만들고 결정권을 사용자에게 돌려줍니다. [pi.dev 홈페이지](https://pi.dev/)의 원문은 "Ask Pi to build what you want, or install a package that does it your way"입니다. Pi는 harness를 네 가지 맞춤형 계층으로 나눕니다.

- **확장(Extensions)**: Pi 생명주기 이벤트에 연결되는 TypeScript hooks로, 런타임(runtime) 수준의 프로그래밍 가능한 표면입니다.
- **스킬(Skills)**: 필요할 때 로드하는 능력 패키지로, 명령과 도구를 포함하며 점진적 공개(progressive disclosure)를 따릅니다.
- **프롬프트 템플릿(Prompt templates)**: 재사용 가능한 Markdown 프롬프트로, `/name`을 입력하면 펼쳐집니다.
- **테마(Themes)**: TUI의 외형입니다.

이 계층화 방식 자체가 하나의 harness 설계입니다. **"모델이 무엇을 볼 수 있는가, 언제 볼 수 있는가"를 커널에 하드코딩하지 않고 규칙과 확장에 완전히 맡깁니다.**

## 핵심 루프

Pi는 모든 coding agent와 마찬가지로 본질적으로 "추론 → 도구 실행 → 관찰 → 다시 추론"을 반복하는 while 루프입니다. 주목할 점은 루프 자체가 아니라 Pi가 루프 바깥을 다루는 방식입니다. 컨텍스트 관리를 루프 내부의 "compaction"에서 루프 외부의 "제어"로 확장합니다.

Pi의 런타임은 외부에 프로그래밍 가능한 인터페이스를 노출합니다. [소스 README의 Programmatic Usage](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md)를 보면 대화형 TUI뿐 아니라 스크립트 방식의 print/JSON 모드, RPC 프로토콜, SDK 임베딩도 지원합니다. 따라서 같은 harness를 사람이 한 단계씩 구동할 수도 있고 CI/CD나 다른 프로그램이 자동으로 구동할 수도 있습니다. 이는 강의 13 "루프 엔지니어링"에서 설명하는 "수동 구동에서 자동 루프로" 전환하기 위한 전제에 해당합니다. harness를 사람의 상호작용으로만 구동할 수 있다면 영원히 자동 루프에 진입할 수 없습니다.

## 명령 하위 시스템: AGENTS.md와 SYSTEM.md

Pi는 "명령"을 절제된 방식으로 다루지만 계층은 명확합니다.

- **AGENTS.md**: [소스 README의 Project Context Files](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md)에 로드 순서가 명시되어 있습니다. 전역 `~/.pi/agent/AGENTS.md` → 상위 디렉터리를 단계별로 탐색 → 현재 디렉터리 `./AGENTS.md` 순이며 CLAUDE.md도 호환합니다. 이는 "저장소가 사실의 원천"이라는 원칙을 실천한 것입니다. 명령은 채팅창의 당부가 아니라 파일입니다.
- **SYSTEM.md**: [pi.dev 공식 문서](https://pi.dev/docs/usage/project-context)에 따르면 프로젝트별로 기본 시스템 프롬프트를 교체(replace)하거나 덧붙일(append) 수 있습니다. 이는 Pi가 "시스템 프롬프트" 수정을 허용하는 유일한 공식 진입점이자 "환경 자기 설명" 계층입니다.

Pi는 공식적으로 시스템 프롬프트 자체가 **극도로 단순하다**고 강조합니다. 그 뒤에는 명확한 선택이 있습니다. 커널에 "만약……이라면……" 같은 긴 규칙을 채워 넣지 않고 확장 지점을 남겨, 규칙이 필요할 때만 스킬과 확장의 형태로 나타나게 합니다. 이는 강의 4 "왜 하나의 거대한 명령 파일이 실패하는가"와 직접 맞닿아 있습니다. Pi는 "극도로 단순한 커널 + 파일 분할 + 필요할 때 로드"하는 방식으로 거대한 명령 파일의 문제를 자연스럽게 피합니다.

## 상태와 컨텍스트: Pi가 가장 세밀하게 분해한 부분

Pi의 컨텍스트 엔지니어링은 특히 자세히 살펴볼 가치가 있습니다. 강의에서 설명한 "컨텍스트 연속성"과 "컨텍스트 부패 방지" 같은 개념을 구체적인 메커니즘으로 구현했기 때문입니다.

**1. Compaction을 프로그래밍 가능하게 만든다.** 컨텍스트 상한에 가까워지면 오래된 메시지를 자동으로 요약합니다. [pi.dev 공식 문서](https://pi.dev/docs/usage/sessions)에 따르면 compaction 전략 자체를 **맞춤 설정**할 수 있습니다. 확장을 이용해 주제 기반 compaction, 코드 인식형 요약을 구현하거나, 아예 다른 모델로 요약할 수도 있습니다. 소스 README에는 기본 메커니즘의 세부 사항도 나옵니다. 자동 compaction은 두 경우(컨텍스트 오버플로 복구 / 보존 임계값 초과)에 트리거되며, 분할 지점은 최근 약 2만 token을 유지하고 그 이전 메시지는 "context handoff"로 요약되어 단계별로 연쇄 compaction됩니다. 즉, Pi는 "어떻게 compaction할 것인가"를 변경할 수 없는 상수가 아니라 harness의 일부로 봅니다.

**2. 동적 컨텍스트(Dynamic context).** [pi.dev 공식 문서](https://pi.dev/docs/usage/extensions)에 따르면 확장은 매 추론 전에 메시지를 주입하고, 메시지 기록을 필터링하고, RAG를 구현하고, 장기 메모리를 구축할 수 있습니다. 이는 "컨텍스트가 가득 차면 compaction한다"는 수준보다 한발 더 나아갑니다. 컨텍스트가 창에 들어오기 전에 무엇을 넣고 뺄지 결정할 수 있게 합니다. 강의의 "agent 실행 과정을 관찰하고 디버깅할 수 있게 하기"와 "컨텍스트 연속성 유지하기"에 대응하며, Pi는 이 두 가지를 확장 표면으로 내려보냈습니다.

**3. Session 트리(Session tree).** [pi.dev 홈페이지](https://pi.dev/)에는 "sessions are stored as trees"라고 명시되어 있습니다. `/tree`로 임의의 과거 노드로 돌아가 계속 진행할 수 있고, 모든 브랜치는 같은 파일에 보관됩니다. 이는 강의에서 반복해서 강조한 "session 간 컨텍스트 단절" 문제를 해결합니다. 요약으로 억지로 이어 붙이는 대신 구조화된 기록 재생을 사용합니다. 브랜치를 HTML로 내보내거나 gist에 업로드해 공유할 수도 있어 관찰 가능성까지 함께 해결합니다.

## 도구 하위 시스템: 스킬과 확장

Pi의 "도구"는 두 계층으로 나뉩니다.

- **스킬(Skills)**: [소스 README의 Skills 섹션](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md)에서는 "self-contained capability packages that the agent loads on-demand", 즉 agent가 필요할 때 로드하는 독립형 능력 패키지로 명확히 정의합니다. 명령과 도구를 포함하고 Agent Skills 표준을 따릅니다. 점진적 공개를 사용하면 스킬이 트리거될 때만 상세 내용이 컨텍스트에 들어가므로 **프롬프트 캐시(prompt cache)를 터뜨리지 않습니다**. 이는 비용 관점의 harness 설계입니다. 컨텍스트에 token이 하나 늘 때마다 추론할 때마다 비용을 지불해야 합니다. 스킬을 필요할 때 로드하도록 만드는 것은 "설명서가 아니라 지도를 제공하라"는 원칙의 또 다른 표현입니다.
- **확장(Extensions)**: 내장 생명주기 이벤트에 연결되는 TypeScript hooks입니다. [소스 README의 Hooks 섹션](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md)은 공식 활용 사례로 위험한 명령 가로채기(permissions gate), 작업 전환 시 코드 상태 checkpoint, 경로 보호(`.env` 등에 쓰기 금지), 도구 출력을 수정한 뒤 모델에 전달하기, 외부(파일 감시/Webhook/CI)에서 메시지를 주입해 agent 깨우기를 제시합니다. 이 hooks API는 `@mariozechner/pi-coding-agent/hooks`에서도 내보냅니다. 커뮤니티 harness인 [pi-agent-harness](https://github.com/LabidySabidy/pi-agent-harness)는 hooks 표면을 skill-router, session-summary, extract-patterns, telemetry 등의 준비된 확장으로 한 번 더 감쌉니다.

확장은 Pi의 가장 중요한 설계 결정입니다. **"사용자에게 몇 가지 스위치를 제공"하는 것이 아니라, 런타임 내부의 이벤트 표면 전체를 노출합니다.** 메모리를 추가하고 싶다면 `agent/pre-step`에 주입합니다. 동작을 기록하고 싶다면 session 이벤트를 구독합니다. 모델 요청을 바꾸고 싶다면 `agent/request`에 hooks를 겁니다. Pi가 자신의 harness를 스스로 수정하게 할 수도 있습니다. 이는 어떤 "설정 항목"보다도 "프로그래밍 가능한 harness"의 정의에 가깝습니다.

## 피드백과 검증: "학습"도 harness로 만들기

Pi 자체에는 강제 테스트 gate가 내장되어 있지 않습니다. 검증 명령은 사용자가 AGENTS.md에 작성해야 합니다. 하지만 커뮤니티 harness인 [pi-agent-harness](https://github.com/LabidySabidy/pi-agent-harness)는 확장을 이용해 "피드백 루프"를 구조화했으며, 공식 README의 Hooks 섹션도 비슷한 메커니즘의 기반을 제공합니다.

- **session-summary**(pi-agent-harness 확장): 순환되는 `PROGRESS.md` 항목을 유지합니다. 이는 강의의 상태 하위 시스템, 즉 장기 작업 진행 추적에 해당합니다.
- **extract-patterns**(pi-agent-harness 확장): session에서 교훈 후보를 수집해 `LESSONS.md`에 축적합니다. "각 session이 끝나기 전에 인계를 잘한다"는 약속을 메커니즘으로 바꿉니다.
- **telemetry**(pi-agent-harness 확장): token 사용량과 비용 등을 기록합니다. 즉, 관찰 가능성입니다.

같은 커뮤니티 저장소는 이 패턴을 한 단계 더 검증합니다. `VISION.md`(목표), `PROGRESS.md`(진행 상황), `LESSONS.md`(경험), `STANDARDS.md`(표준)가 모두 Markdown 파일로 존재하며 session 간에 영속화됩니다. 강의에서 권장하는 "저장소가 사실의 원천 + 진행 상황 파일 + 인계 메커니즘"과 정확히 같은 방식이며, Pi의 확장 메커니즘으로 즉시 사용할 수 있는 계층이 되었습니다.

## 강의 프레임워크에 매핑하기

강의의 다섯 가지 하위 시스템으로 Pi를 평가하면 다음과 같습니다(주관적인 비교용 평가입니다).

| 하위 시스템 | Pi의 구현 | 평가 |
| --- | --- | --- |
| 명령 | AGENTS.md 계층형 로드 + SYSTEM.md | 계층은 명확하지만 규칙 자체는 사용자가 작성해야 함 |
| 도구 | 스킬 필요 시 로드 + 전체 생명주기 확장 hooks | 매우 강력하며 도구 시스템을 프로그래밍 가능한 표면으로 만듦 |
| 환경 | SYSTEM.md로 환경을 자기 설명하고, 런타임 환경은 사용자가 AGENTS.md에 선언 | 메커니즘은 개방되어 있지만 재현성은 사용자의 설명에 의존 |
| 상태 | session 트리 + 맞춤형 compaction + PROGRESS.md | 매우 강력하며 session 간 연속성과 복구 가능성이 핵심 |
| 피드백 | 검증 명령은 사용자가 정의하고 session-summary / extract-patterns로 메커니즘화 | 메커니즘은 제공하지만 내용은 사용자가 작성 |

Pi의 선택은 Claude Code / Codex와 뚜렷하게 대비됩니다. Claude Code는 "메모리, permissions, subagent"를 모두 커널에 내장해 즉시 사용할 수 있게 하고, Codex는 "저장소 규약, 환경 격리"를 기본값으로 만듭니다. 반면 Pi는 **어떤 것도 대신 결정하지 않습니다**. 결정권을 확장 지점으로 만듭니다. 그 대가로 직접 확장을 작성하거나 다른 사람이 작성한 패키지를 설치해야 합니다.

## 참고할 만한 설계

1. **Compaction 전략을 교체 가능하게 만드세요.** harness에서 "컨텍스트를 어떻게 compaction할 것인가"는 하드코딩된 매개변수가 아니라 교체 가능한 전략 인터페이스여야 합니다.
2. **Session 트리로 단순 요약을 대체하세요.** session 간 복구가 꼭 "지난번 요약"에 의존할 필요는 없습니다. 구조화된 기록 재생이 더 신뢰할 만한 상태 하위 시스템인 경우가 많습니다.
3. **프롬프트 캐시에 친화적으로 만드세요.** 스킬은 필요할 때 로드하고 모든 규칙을 시스템 프롬프트에 한꺼번에 넣지 마세요. 이는 컨텍스트 엔지니어링이자 비용 엔지니어링입니다.
4. **agent가 자신의 harness를 수정할 수 있게 하세요.** harness의 확장 표면이 충분히 열려 있다면 "agent 동작 최적화" 자체를 agent가 반자동으로 수행할 수 있습니다.

## 참고 자료(원문 / 소스 코드)

각 주장은 인상에 의존한 전달을 피하기 위해 아래 원문이나 소스 코드로 거슬러 올라갈 수 있습니다.

- **pi.dev 공식 사이트**: 포지셔닝 원문 "Ask Pi to build what you want, or install a package that does it your way", 네 가지 맞춤형 계층, session 트리("sessions are stored as trees", `/tree`, 단일 파일 저장, HTML 내보내기 / gist 공유).<br/>https://pi.dev/
- **pi.dev 공식 문서 · Sessions**: 교체 가능한 compaction(topic-based / code-aware / 요약 모델 교체), 자동 compaction과 동적 컨텍스트 주입 메커니즘 설명.<br/>https://pi.dev/docs/usage/sessions
- **pi.dev 공식 문서 · Extensions**: 확장이 매 추론 전에 메시지를 주입하고 기록을 필터링하며 RAG와 장기 메모리를 구현하는 방법.<br/>https://pi.dev/docs/usage/extensions
- **pi.dev 공식 문서 · Project Context**: SYSTEM.md의 replace / append 의미.<br/>https://pi.dev/docs/usage/project-context
- **Pi Coding Agent 소스 README**(badlogic/pi-mono): AGENTS.md 3단계 로드 순서(전역 → 상위 디렉터리 → 현재 디렉터리), `/compact`와 자동 compaction의 트리거 조건 및 2만 token 분할 지점, 필요 시 Skills 로드와 Agent Skills 표준, Hooks 생명주기와 네 가지 공식 활용 사례, Programmatic Usage(JSON / RPC / SDK).<br/>https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md
- **pi-agent-harness 커뮤니티 저장소**: skill-router / session-summary / extract-patterns / telemetry 확장, VISION.md / PROGRESS.md / LESSONS.md / STANDARDS.md 파일 체계.<br/>https://github.com/LabidySabidy/pi-agent-harness

관련 강의: [강의 2 · Harness란 정확히 무엇인가](../../lectures/lecture-02-what-a-harness-actually-is/) ｜ [강의 5 · session 간 작업의 컨텍스트 연속성 유지하기](../../lectures/lecture-05-why-long-running-tasks-lose-continuity/) ｜ [강의 13 · 수동 구동에서 자동 루프로](../../lectures/lecture-13-loop-engineering/)
