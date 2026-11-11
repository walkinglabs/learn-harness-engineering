# DeepSeek Harness 설계 분석

[DeepSeek Harness](https://deepseek.com/harness)(명령 이름 `dsh`, 저장소 `deepseek-ai/deepseek-harness`)는 2026년 8월 Developer Preview로 출시되었으며, 공식 정의는 매우 직접적입니다. **Agent = Model + Environment + Tools + State**, 즉 모델, 환경, 도구, 상태의 네 가지 요소입니다.

앞선 세 제품의 분석이 "harness를 어떻게 설계해야 하는가"를 묻는다면, DeepSeek Harness는 더 급진적인 질문을 던집니다. **harness가 특정 모델에서 벗어나 독립적인 런타임이 될 수 있는가?** 대답은 그렇다는 것이며, 이를 극한까지 구현했습니다. [아키텍처 문서](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md)의 원문은 다음과 같습니다. *Every part of the product is a plugin, including the model adapter, the tool registry, the session log, and the agent loop itself*(모델 어댑터, 도구 레지스트리, session 로그, 심지어 agent 루프 자체까지 제품의 모든 부분이 plugin입니다).

이 글에서는 plugin 기반 커널, 능력 접합부(capability seam), 이벤트 파이프라인, 그리고 "Model-visible means logged"라는 가장 강력한 엔지니어링 제약을 중점적으로 분석합니다.

## 한 문장으로 정의하기

전통적인 coding agent의 구조는 "LLM + 고정된 agent 루프 + 고정된 도구 세트"입니다. DeepSeek Harness의 구조는 "모델 + plugin 커널(Cordis)"입니다. 커널은 plugin 로드, 언로드, 의존성, 이벤트 메커니즘만 담당하며 **agent의 구체적인 능력을 하나도 소유하지 않습니다**. [아키텍처 문서](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md)의 원문은 "There is no privileged core to patch"(패치해야 할 특권 커널이 없음), "you extend dsh by mounting a plugin beside the others"(커널을 수정하지 않고 다른 plugin 옆에 하나를 마운트해 dsh를 확장함)입니다. 즉, agent 루프 자체도 수정할 수 없는 성역이 아닙니다. DeepSeek 모델에 Claude Code의 subagent를 연결하고, 원격 sandbox와 맞춤형 메모리를 추가하고, 사용자 정의 루프와 UI로 교체해 완전히 새로운 agent를 구성할 수 있습니다.

이는 "모델 가중치 바깥의 모든 것이 harness"라는 강의의 문장을 가장 철저히 실천한 것입니다. harness가 독립적이라면, 아예 독립된 운영 체제로 만드는 것입니다.

## 아키텍처 핵심 1: 능력 접합부(Capability Seam)

DeepSeek Harness는 "능력"을 Service로 표현하며, 거의 모든 능력을 세 계층으로 나눕니다.

```
Service Definition
        ↓
Service Provider
        ↓
Consumer
```

파일 시스템을 예로 들면, `FS Service` 아래에 Local FS, E2B FS, Remote FS 등의 Provider가 있고 위쪽에는 통일된 file tools로 노출됩니다. Shell, Subprocess, Sandbox, Web, LLM, SubAgent도 같은 구조를 사용합니다. 이 3계층 구조는 여기서 요약한 것이 아닙니다. [아키텍처 문서 · Capability seams](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md)의 원문은 *a seam is a swappable capability with three roles: a Service Definition declaring the interface, a Service Provider implementing it, and a Consumer using it, commonly a model-facing tool*(능력 접합부는 교체 가능한 능력으로서 세 가지 역할, 즉 인터페이스를 선언하는 Service Definition, 이를 구현하는 Service Provider, 이를 사용하는 Consumer로 구성되며, Consumer는 일반적으로 모델에 노출되는 도구임)입니다.

이는 harness 엔지니어링의 오랜 문제를 해결합니다. **agent는 "구체적인 도구"에 의존해야 하는가, "능력 인터페이스"에 의존해야 하는가?** DeepSeek Harness는 후자를 선택합니다. 강의 관점에서 보면 "도구 하위 시스템"을 인터페이스로 표준화한 것입니다. Provider를 교체해도 모델에 노출되는 도구의 모습은 그대로지만 환경은 완전히 달라집니다.

## 아키텍처 핵심 2: 이벤트 파이프라인(Event Pipeline)

DeepSeek Harness 내부는 단순한 "LLM → 도구 → LLM"이 아니라 이벤트 파이프라인이며, 각 단계가 plugin이 수신할 수 있는 이벤트 지점입니다.

```
turn/start → claim input → assemble（system prompt / context / tools）
  → agent/pre-step → step/start → LLM request（agent/request）→ llm/stream
  → assistant/message → tool/call
  → tools/pre-execute（permission / guard / policy / hook）
  → tools/execute → tools/post-execute → tool/result → step/end → next turn
```

(위 파이프라인은 [아키텍처 문서 · Turn flow](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md) 섹션을 옮긴 것입니다. `turn/*`, `step/*`, `user/message`, `assistant/*`, `tool/*`는 영속화되는 session 이벤트이며, `agent/pre-step`, `agent/request`, `llm/stream`, `tools/*`는 plugin이 수신할 수 있는 확장 지점입니다.)

이 설계의 가장 큰 장점은 **많은 기능이 agent 루프 자체를 수정하지 않아도 된다는 것**입니다. 도구 실행 전 안전 검사를 수행하고 싶다면 `tools/pre-execute`를 수신합니다. 메모리를 추가하려면 `agent/pre-step`에서 주입합니다. 동작을 기록하려면 session 이벤트를 구독합니다. 모델 요청을 수정하려면 `agent/request`에 hooks를 겁니다. 추론을 계속할지 결정하려면 `agent/turn-stopping`을 수신합니다.

강의 11 "agent 실행 과정을 관찰 가능하게 만들기"와 비교하면 DeepSeek Harness는 더 멀리 나아갑니다. 단순히 "로그를 추가"하는 것이 아니라 **루프의 모든 단계를 이벤트 지점으로 만들고**, 관찰, permissions, 메모리, 정책을 루프에 하드코딩하지 않고 모두 listener로 연결합니다.

## 아키텍처 핵심 3: Session Event Log와 "Model-visible means logged"

DeepSeek Harness에는 **append-only Session Event Log**가 있으며, 매우 강력한 엔지니어링 제약을 정했습니다. [아키텍처 문서 · Session log](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md)의 원문은 다음과 같습니다.

> **Model-visible means logged.** Anything that reaches a model request must be reconstructable from the log, and a runtime invariant asserts it.

(모델이 볼 수 있는 것은 모두 기록되어야 합니다. 모델 요청에 들어가는 모든 것은 로그에서 재구성할 수 있어야 하며, 런타임 불변 조건이 이를 강제합니다.)

즉, 관찰 가능성은 사후에 추가하는 로그가 아니라 harness의 제1원칙입니다. 모델 컨텍스트에 들어가는 모든 내용은 기본적으로 로그를 남겨야 합니다. 이는 마지막 강의의 "관찰 가능성은 harness 내부에 속한다"는 내용과 직접 맞닿아 있으며, "append-only" 저장소 설계를 원칙으로 만듭니다. 로그는 덮어쓰지 않고 추가만 하므로 session 상태를 재생할 수 있습니다.

## 강의 프레임워크에 매핑하기

| 하위 시스템 | DeepSeek Harness의 구현 | 평가 |
| --- | --- | --- |
| 명령 | plugin 기반이며 규칙/스킬을 모두 plugin 형태로 주입 | 매우 자유롭지만 "CLAUDE.md" 같은 내장 규약은 없음 |
| 도구 | Service Definition → Provider → Consumer 능력 접합부 | 도구 하위 시스템 표준화의 극치 |
| 환경 | sandbox/FS/Shell의 Provider를 모두 교체 가능(원격 E2B 포함) | 환경이 완전히 교체 가능함 |
| 상태 | append-only Session Event Log + Model-visible means logged | 관찰 가능성이 제1원칙 |
| 피드백 | tools/pre-execute의 permission / guard / policy / hook | 피드백 메커니즘을 이벤트화함 |

DeepSeek Harness와 나머지 세 제품의 근본적인 차이는 다음과 같습니다. Pi, Claude Code, Codex가 모두 "하나의 구체적인 agent" 안에서 harness를 최적화한다면, DeepSeek Harness는 harness를 **모델과 독립된 운영 체제**로 정의하며 agent 자체는 이 OS에서 교체 가능한 하나의 애플리케이션일 뿐입니다. 대가도 분명합니다. 높은 자유도는 높은 설정 비용을 의미하며, 이는 "harness가 곧 OS"인 설계에 본질적으로 따르는 이면입니다(Developer Preview 단계 역시 "먼저 체험해 보는 단계이며 메커니즘이 아직 발전 중"이라는 포지셔닝입니다).

## 참고할 만한 설계

1. **루프의 모든 단계를 이벤트 지점으로 만드세요.** permissions, 메모리, 정책, 로그를 루프에 하드코딩하지 말고 listener로 연결하세요.
2. **능력 접합부를 표준화하세요.** "구체적인 도구"가 아니라 "능력 인터페이스"에 의존하면 모델이 보는 도구 표면에 영향을 주지 않고 환경 전체를 교체할 수 있습니다.
3. **Model-visible means logged.** 모델이 볼 수 있는 것은 모두 기록하여 관찰 가능성을 "가산점"이 아니라 "제1원칙"으로 만드세요.
4. **append-only session 로그를 사용하세요.** 상태를 재생할 수 있고 인계가 신뢰할 만해집니다. 이는 "각 session에 클린 상태를 남기기"를 엔지니어링으로 보장합니다.

## 참고 자료(원문 / 소스 코드)

각 주장은 인상에 의존한 전달을 피하기 위해 아래 원문이나 소스 코드로 거슬러 올라갈 수 있습니다.

- **DeepSeek Harness 공식 사이트**: 제품 정의 "Agent = Model + Environment + Tools + State", Developer Preview 포지셔닝과 `dsh` 명령.<br/>https://deepseek.com/harness
- **deepseek-ai/deepseek-harness 저장소**(`dsh` 명령, MIT 라이선스):<br/>https://github.com/deepseek-ai/deepseek-harness
- **아키텍처 문서 architecture.md**: 이 글의 가장 핵심적인 출처. "Every part of the product is a plugin", "There is no privileged core to patch", Turn flow 이벤트 파이프라인, Capability seams의 3계층 역할, "Model-visible means logged"와 런타임 불변 조건, append-only Session Event Log, fs/tools/telemetry 등의 능력 접합부와 `ctx.*` 하위 시스템.<br/>https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md
- **아키텍처 문서 · 관련 하위 문서**: Cordis 커널 소개(plugins contribute services, typed events, reversible effects), 능력 접합부 세부 사항, Session 하위 시스템.<br/>https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-primer.md ｜ https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/capability-seams.md ｜ https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/subsystems/session.md

관련 강의: [강의 11 · agent 실행 과정을 관찰 가능하게 만들기](../../lectures/lecture-11-why-observability-belongs-inside-the-harness/) ｜ [강의 12 · 각 session이 끝나기 전에 인계 완료하기](../../lectures/lecture-12-why-every-session-must-leave-a-clean-state/) ｜ [강의 2 · Harness란 정확히 무엇인가](../../lectures/lecture-02-what-a-harness-actually-is/)
