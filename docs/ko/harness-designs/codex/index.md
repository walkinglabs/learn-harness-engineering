# Codex의 harness 설계 분석

OpenAI의 [Codex](https://openai.com/index/harness-engineering/)는 네 제품 중 "harness의 근본 원칙"과 가장 깊이 결합되어 있을 수 있습니다. 이 분야 전체의 이름을 정의한 《Harness Engineering》은 OpenAI 팀이 Codex로 제품을 만들며 얻은 경험을 정리한 글이기 때문입니다. 따라서 Codex의 harness 설계를 분석하는 것은 상당 부분 그 글의 배경이 된 엔지니어링 실천을 분석하는 일입니다.

Codex의 철학은 한 문장으로 압축할 수 있습니다. **저장소가 사실의 원천(repository as the system of record)이고, AGENTS.md는 디렉터리 페이지일 뿐이며, 엔지니어링의 가치는 환경을 설계하고 의도를 표현하며 피드백 루프를 구축하는 데 있습니다.**

## 한 문장으로 정의하기

OpenAI 팀은 Codex를 사용해 몇 주 만에 최종적으로 100만 줄이 넘는 규모가 된 제품을 출시했으며, **모든 코드 줄을 Codex가 작성했습니다**(원문은 [Harness Engineering](https://openai.com/index/harness-engineering/)의 "Designing for growth" 섹션 참고). 이들의 실천은 엔지니어의 역할이 "코드 작성"에서 "harness 설계"로 바뀔 때 시스템을 어떻게 구성해야 하는지에 답합니다. Codex CLI 자체는 Rust로 구현된 오픈 소스 단일 바이너리([github.com/openai/codex](https://github.com/openai/codex))이지만, harness에 대한 Codex의 기여는 화려한 확장 지점보다 **규약(convention)**과 **컨텍스트 엔지니어링**에 집중되어 있습니다.

## 명령 하위 시스템: AGENTS.md는 백과사전이 아니라 디렉터리 페이지

이는 harness 이론에 가장 큰 영향을 미친 Codex의 설계 원칙입니다.

> 하나의 거대한 명령 파일은 커버리지, 업데이트 상태, 소유권, 교차 링크를 기계적으로 검사하기 어렵고 현실과 어긋나는 일을 피할 수 없습니다. 따라서 우리는 AGENTS.md를 백과사전으로 보지 않고 **디렉터리 페이지**로 봅니다. 코드베이스 지식은 구조화된 문서 안에 있고, AGENTS.md는 그 문서들을 가리킵니다.

(위 내용은 [《Harness Engineering》 원문](https://openai.com/index/harness-engineering/)의 "AGENTS.md should be a directory page" 섹션을 직접 옮긴 것입니다.)

강의 4는 "하나의 거대한 명령 파일이 실패한다"고 설명합니다. Codex는 그 정답을 직접 제시합니다. AGENTS.md를 약 100줄로 제한하고(원문은 약 100줄을 권장하며, 상한에 가까워지면 `docs/`로 분리), 담을 수 없는 내용은 `docs/` 디렉터리로 나누어 agent가 필요할 때 읽게 합니다. 이것이 "설명서가 아니라 지도를 제공하라"는 원칙의 권위 있는 출처입니다.

함께 적용되는 원칙은 **구현을 세세하게 관리하지 말고 불변 조건을 실행하라**(원문: "don't micromanage the implementation；focus on invariants")입니다. AGENTS.md에는 어길 수 없는 강제 제약과 검증 명령만 작성하고, 구체적인 구현 방법은 모델에 맡깁니다. 이는 강의 2의 "세세한 지시가 아니라 제약"과 직접 대응합니다.

## 컨텍스트 하위 시스템: Write-Select-Compress-Isolate

Codex의 컨텍스트 엔지니어링은 네 가지 전략으로 요약할 수 있습니다. 이는 "context engineering"이 독립된 학문으로 자리 잡은 뒤 커뮤니티가 정리하여 Codex에 다시 매핑한 프레임워크입니다(출처: [Context Engineering for Codex CLI](https://codex.danielvaughan.com/2026/06/10/context-engineering-codex-cli-write-select-compress-isolate-june-2026/)).

- **Write(밖으로 쓰기)**: 컨텍스트를 창 바깥에 영속화합니다. 결론은 문서에, 상태는 파일에 기록하고 대화 안에만 두지 않습니다. "저장소가 사실의 원천"이라는 원칙에 대응합니다.
- **Select(안으로 선택하기)**: 필요한 token만 창으로 가져옵니다. 전체 저장소를 밀어 넣지 않고 AGENTS.md가 길을 안내하며 파일은 필요할 때 읽습니다.
- **Compress(compaction)**: 정말 중요한 것만 남깁니다. Codex는 자동 compaction과 수동 `/compact`를 제공하며 `compact_prompt`를 맞춤 설정할 수 있습니다([Context Engineering for Codex CLI](https://codex.danielvaughan.com/2026/06/10/context-engineering-codex-cli-write-select-compress-isolate-june-2026/) 참고).
- **Isolate(격리)**: 컨텍스트를 서로 다른 경계로 나눕니다. subagent로 서로 다른 작업의 컨텍스트를 격리하면, 프런트엔드 subagent는 백엔드의 데이터베이스 schema를 전혀 보지 않습니다.

Codex에는 매우 세밀한 환경 컨텍스트 설계도 있습니다. 커뮤니티의 [codex-harness-internals](https://github.com/AlexKenbo/codex-harness-internals) 소스 분석에 따르면, `build_environment_update_item`은 매번 전체 시스템 컨텍스트를 다시 붙이지 않고 환경이 바뀔 때만 **변경된 필드**(CWD, git 브랜치, 파일 시스템)를 출력합니다. 이는 "컨텍스트에 중복 token을 쌓아 두지 않는다"는 엔지니어링 세부 사항입니다.

## 도구와 경계: worktree 격리 + subagent

Codex에는 두 가지 핵심 harness 메커니즘이 있습니다.

**1. git worktree로 환경 격리.** [《Harness Engineering》 원문](https://openai.com/index/harness-engineering/)의 "Environment" 섹션에 따르면 각 작업은 독립된 git worktree에서 실행되며, 로컬 관찰 가능성 스택(로그, 메트릭, 트레이스)을 결합해 각 변경 사항을 독립된 환경에서 검증합니다. 이는 강의 7 "agent의 각 작업 경계를 명확히 정하기"를 물리적으로 구현한 것입니다. 프롬프트로 경계를 지켜 달라고 간청하지 않고 환경 격리로 강제합니다. 여기서는 환경(environment) 하위 시스템을 강제로 격리합니다.

**2. 커널 수준 subagent.** Codex의 `spawn_agent` / `wait_agent`는 커널 수준 도구입니다. 모델이 명시적으로 subagent를 생성하고, 독립된 session 기록과 도구 세트를 제공한 뒤 결과를 기다립니다. subagent는 부모의 AGENTS.md 명령을 상속하지만 **자신의 컨텍스트**에서 실행됩니다. 설정은 `.codex/agents/*.toml`에 두며 서로 다른 모델과 명령을 지정할 수 있습니다(세부 사항은 [Context Engineering for Codex CLI](https://codex.danielvaughan.com/2026/06/10/context-engineering-codex-cli-write-select-compress-isolate-june-2026/)의 Sub-agents 섹션 참고). 이는 "컨텍스트 격리"를 직접 구현하며, 강의 12의 "인계" 정신도 반영합니다. 각 subagent는 명확한 경계가 있는 하나의 작업 단위입니다.

## 피드백 하위 시스템: 규약에 검증 명령 작성하기

OpenAI의 실천에서 가장 강조하는 점은 AGENTS.md에 검증 명령을 명시해 "올바르게 수행했는지 확인하는 방법"을 저장소의 일부로 만드는 것입니다. Codex의 엔지니어링 흐름에서는 테스트, CI, 문서, 관찰 가능성 설정을 모두 Codex가 생성하며, 모두 "실행 가능한 검증 경로"입니다. 강력하지만 신뢰할 수 없는 모델의 해법은 모델이 알아서 잘하기를 기도하는 것이 아니라 **검증 경로를 harness의 기본 구성 요소로 만드는 것**입니다.

승인 정책(approval policies)과 계획 모드(plan mode)는 피드백의 또 다른 방향입니다. 고위험 작업을 실행하기 전에 계획을 작성하고 승인을 요청함으로써 "작업 경계"와 "인간의 결정권"을 런타임 제어로 만듭니다.

## 강의 프레임워크에 매핑하기

| 하위 시스템 | Codex의 구현 | 평가 |
| --- | --- | --- |
| 명령 | AGENTS.md 디렉터리 페이지 + docs/ 분할 + 불변 조건 실행 | "설명서가 아니라 지도를 제공하라"를 정의한 교과서적 구현 |
| 도구 | worktree 격리 + spawn_agent subagent | 환경으로 경계를 강제 격리하므로 매우 강력함 |
| 환경 | 독립 worktree + 관찰 가능성 스택 | worktree 격리가 대표 특징 |
| 상태 | Write 전략(상태를 파일/문서에 기록) | 내장 메모리가 아니라 규약에 의존 |
| 피드백 | 검증 명령을 규약에 포함 + 승인 정책 + plan mode | 피드백 경로를 기본값으로 만든 참고할 만한 구현 |

Codex와 Claude Code의 대비는 흥미롭습니다. Claude Code는 메모리, permissions, subagent를 모두 커널에 넣는 "덧셈"이고, Codex는 커널을 최대한 절제하고 더 많은 책임을 저장소 규약과 컨텍스트 엔지니어링에 두는 "뺄셈"입니다. 커뮤니티에서 "Codex의 harness 철학이 코드보다 더 가치 있다"고 자주 말하는 이유이기도 합니다.

## 참고할 만한 설계

1. **AGENTS.md를 디렉터리 페이지로 작성하세요.** 약 100줄로 제한하고 docs/의 세부 내용을 가리키며 기계적으로 검사할 수 있게 하세요.
2. **불변 조건만 작성하고 구현을 세세하게 관리하지 마세요.** 강제 제약 + 검증 명령을 제공하고 나머지는 모델에 맡기세요.
3. **worktree로 환경을 격리하세요.** 작업 경계는 프롬프트의 간청이 아니라 환경으로 강제합니다.
4. **환경 컨텍스트는 변경분만 전달하세요.** 매번 전체 시스템 컨텍스트를 반복해서 붙이지 말고 변경된 필드만 출력하세요.
5. **subagent로 컨텍스트를 격리하세요.** 작업과 컨텍스트를 함께 분리해 하위 작업이 메인 루프를 오염시키지 않게 하세요.

## 참고 자료(원문 / 소스 코드)

각 주장은 인상에 의존한 전달을 피하기 위해 아래 원문이나 소스 코드로 거슬러 올라갈 수 있습니다.

- **OpenAI 《Harness Engineering》**: AGENTS.md 디렉터리 페이지와 약 100줄 권장, executive invariants / don't micromanage, worktree 격리 + 관찰 가능성 스택, 검증 명령의 규약화, 100만 줄이 넘는 제품 사례, 승인 정책과 plan mode. 이 글의 모든 핵심 주장의 주된 출처.<br/>https://openai.com/index/harness-engineering/
- **OpenAI 공식 《AGENTS.md》 규약**(여러 도구에서 사용하는 규약의 표준인 AGENTS.md):<br/>https://openai.com/index/agents-md/
- **Codex CLI 오픈 소스 저장소**(Rust로 구현한 단일 바이너리):<br/>https://github.com/openai/codex
- **Context Engineering for Codex CLI**(커뮤니티): Write-Select-Compress-Isolate 프레임워크, `/compact`와 `compact_prompt`, `spawn_agent` / `wait_agent` subagent와 `.codex/agents/*.toml` 설정.<br/>https://codex.danielvaughan.com/2026/06/10/context-engineering-codex-cli-write-select-compress-isolate-june-2026/
- **codex-harness-internals**(커뮤니티 소스 분석): `build_environment_update_item`의 증분 환경 컨텍스트 등 구현 세부 사항.<br/>https://github.com/AlexKenbo/codex-harness-internals

관련 강의: [강의 3 · 코드 저장소를 유일한 사실의 원천으로 만들기](../../lectures/lecture-03-why-the-repository-must-become-the-system-of-record/) ｜ [강의 4 · 명령을 여러 파일로 분리하기](../../lectures/lecture-04-why-one-giant-instruction-file-fails/) ｜ [강의 7 · agent의 각 작업 경계를 명확히 정하기](../../lectures/lecture-07-why-agents-overreach-and-under-finish/)
