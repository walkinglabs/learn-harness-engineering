# Análise do design do DeepSeek Harness

O [DeepSeek Harness](https://deepseek.com/harness) — comando `dsh`, repositório `deepseek-ai/deepseek-harness` — foi lançado em agosto de 2026 como Developer Preview. Sua definição oficial é direta: **Agent = Model + Environment + Tools + State** — modelo, ambiente, ferramentas e estado.

Se a análise dos três produtos anteriores pergunta "como um harness deve ser projetado", o DeepSeek Harness faz uma pergunta mais radical: **o harness pode se separar de um modelo específico e tornar-se um runtime independente?** A resposta é sim, e a ideia é levada ao extremo. Nas palavras da [documentação de arquitetura](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md): *Every part of the product is a plugin, including the model adapter, the tool registry, the session log, and the agent loop itself* (cada parte do produto é um plugin, incluindo o adaptador do modelo, o registro de ferramentas, o log da sessão e até o próprio loop do agent).

Neste artigo, analisamos três aspectos: o núcleo baseado em plugins, as interfaces de capacidade (capability seam), o pipeline de eventos e a mais forte de suas restrições de engenharia: "Model-visible means logged".

## Posicionamento em uma frase

A estrutura tradicional de um coding agent é "LLM + loop de agent fixo + conjunto fixo de ferramentas". A estrutura do DeepSeek Harness é "modelo + núcleo de plugins (Cordis)". O núcleo cuida apenas de carregar e descarregar plugins, gerenciar dependências e fornecer o mecanismo de eventos; **ele não possui nenhuma capacidade específica de agent**. Nas palavras da [documentação de arquitetura](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md): "There is no privileged core to patch" (não existe um núcleo privilegiado que precise ser alterado) e "you extend dsh by mounting a plugin beside the others" (para estender dsh, basta montar um plugin ao lado dos demais, sem alterar o núcleo). Isso significa que nem o loop do agent é sagrado ou imutável: você pode combinar o modelo do DeepSeek, os subagents do Claude Code, um sandbox remoto, memória personalizada, um loop próprio e uma UI própria para formar um agent inteiramente novo.

É a aplicação mais completa da frase do curso "tudo além dos pesos do modelo é harness": se o harness é independente, que ele se torne um sistema operacional independente.

## Núcleo da arquitetura 1: interfaces de capacidade (Capability Seam)

O DeepSeek Harness representa "capacidades" por meio de Service e divide quase todas elas em três camadas:

```
Service Definition
        ↓
Service Provider
        ↓
Consumer
```

Tomando o sistema de arquivos como exemplo: sob `FS Service`, existem vários Provider — Local FS, E2B FS e Remote FS — expostos de maneira uniforme como file tools. Shell, Subprocess, Sandbox, Web, LLM e SubAgent seguem a mesma estrutura. Essa arquitetura de três camadas não é uma interpretação nossa. A seção [Capability seams da documentação de arquitetura](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md) diz: *a seam is a swappable capability with three roles: a Service Definition declaring the interface, a Service Provider implementing it, and a Consumer using it, commonly a model-facing tool* (uma interface de capacidade é uma capacidade substituível com três papéis: um Service Definition que declara a interface, um Service Provider que a implementa e um Consumer que a utiliza, normalmente uma ferramenta exposta ao modelo).

Isso resolve uma questão antiga da engenharia de harness: **um agent deve depender de uma "ferramenta específica" ou de uma "interface de capacidade"?** O DeepSeek Harness escolhe a segunda opção. Para o curso, isso significa que o "subsistema de ferramentas" é padronizado como uma interface: trocar o Provider não altera a aparência da ferramenta para o modelo, mas muda completamente o ambiente.

## Núcleo da arquitetura 2: pipeline de eventos (Event Pipeline)

Internamente, o DeepSeek Harness não é um simples "LLM → ferramenta → LLM", mas um pipeline de eventos no qual cada etapa é um ponto que pode ser observado por plugins:

```
turn/start → claim input → assemble（system prompt / context / tools）
  → agent/pre-step → step/start → LLM request（agent/request）→ llm/stream
  → assistant/message → tool/call
  → tools/pre-execute（permission / guard / policy / hook）
  → tools/execute → tools/post-execute → tool/result → step/end → next turn
```

(O pipeline acima é uma transcrição da seção [Turn flow da documentação de arquitetura](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md): `turn/*`, `step/*`, `user/message`, `assistant/*` e `tool/*` são eventos persistentes de sessão; `agent/pre-step`, `agent/request`, `llm/stream` e `tools/*` são pontos de extensão observáveis por plugins.)

A maior vantagem desse design é que **muitas funcionalidades não exigem nenhuma alteração no loop do agent**. Quer fazer uma verificação de segurança antes de executar uma ferramenta? Observe `tools/pre-execute`. Quer adicionar memória? Injete-a em `agent/pre-step`. Quer registrar comportamentos? Assine eventos da sessão. Quer alterar a requisição ao modelo? Use um hook em `agent/request`. Quer decidir se o raciocínio deve continuar? Observe `agent/turn-stopping`.

Comparado à décima primeira aula, "tornar observável o processo de execução do agent", o DeepSeek Harness vai além: em vez de apenas "adicionar logs", ele transforma **cada etapa do loop em um ponto de evento**, permitindo que observabilidade, permissões, memória e políticas sejam conectadas ao loop como observadores, em vez de ficarem embutidas nele.

## Núcleo da arquitetura 3: Session Event Log e "Model-visible means logged"

O DeepSeek Harness possui um **Session Event Log append-only (log de eventos de sessão somente para anexação)** e estabelece uma forte restrição de engenharia. Nas palavras da seção [Session log da documentação de arquitetura](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md):

> **Model-visible means logged.** Anything that reaches a model request must be reconstructable from the log, and a runtime invariant asserts it.

(Tudo o que o modelo vê deve ser registrado. Qualquer coisa que chegue a uma requisição ao modelo precisa poder ser reconstruída a partir do log, e um invariante de runtime impõe essa regra.)

Em outras palavras, observabilidade não é um log acrescentado depois, mas uma restrição fundamental do harness: tudo que entra no contexto do modelo deve, por padrão, deixar um registro. Isso corresponde diretamente à ideia da aula final de que "a observabilidade pertence ao interior do harness" e transforma o design de armazenamento "append-only" em princípio: logs são apenas acrescentados, nunca sobrescritos, e o estado da sessão pode ser reproduzido.

## Mapeamento para o framework do curso

| Subsistema | Implementação no DeepSeek Harness | Avaliação |
| --- | --- | --- |
| Instruções | Baseada em plugins; regras/Skills são injetadas como plugins | Extremamente livre, mas sem uma convenção integrada como CLAUDE.md |
| Ferramentas | Interface de capacidade Service Definition → Provider → Consumer | Padronização máxima do subsistema de ferramentas |
| Ambiente | Sandbox/FS/Shell com Provider substituíveis, incluindo E2B remoto | Ambiente totalmente substituível |
| Estado | Session Event Log append-only + Model-visible means logged | Observabilidade como restrição fundamental |
| Feedback | permission / guard / policy / hook em tools/pre-execute | Mecanismo de feedback orientado a eventos |

A diferença fundamental entre o DeepSeek Harness e os outros três produtos é que Pi, Claude Code e Codex otimizam o harness dentro de "um agent específico", enquanto o DeepSeek Harness define o harness como **um sistema operacional independente do modelo**, no qual o próprio agent é apenas um aplicativo substituível. O custo também é evidente: mais liberdade implica maior custo de configuração. Esse é o outro lado inerente do design de "harness como OS" — e, na fase de Developer Preview, o posicionamento ainda é de experimentação inicial, com mecanismos em evolução.

## Designs que vale a pena adotar

1. **Transforme cada etapa do loop em um ponto de evento**: conecte permissões, memória, políticas e logs como observadores do loop, em vez de embuti-los nele.
2. **Padronize interfaces de capacidade**: dependa de "interfaces de capacidade", não de "ferramentas específicas", para substituir todo o ambiente sem alterar a superfície de ferramentas vista pelo modelo.
3. **Model-visible means logged**: tudo que o modelo vê deve ser registrado; transforme observabilidade de "diferencial" em "restrição fundamental".
4. **Log de sessão append-only**: estado reproduzível e passagem de contexto confiável como garantia de engenharia de que "cada sessão deixa um estado limpo".

## Fontes de referência (originais / código-fonte)

Cada afirmação pode ser rastreada até os textos originais ou o código-fonte abaixo, evitando paráfrases baseadas apenas em lembranças:

- **Site oficial do DeepSeek Harness**: definição "Agent = Model + Environment + Tools + State", posicionamento como Developer Preview e comando `dsh`.<br/>https://deepseek.com/harness
- **Repositório deepseek-ai/deepseek-harness** (comando `dsh`, licença MIT):<br/>https://github.com/deepseek-ai/deepseek-harness
- **Documentação de arquitetura architecture.md**: principal fonte deste artigo — "Every part of the product is a plugin", "There is no privileged core to patch", pipeline de eventos Turn flow, os três papéis de Capability seams, "Model-visible means logged" e seu invariante de runtime, Session Event Log append-only, interfaces de capacidade fs/tools/telemetry e subsistemas `ctx.*`.<br/>https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md
- **Documentos complementares de arquitetura**: introdução ao núcleo Cordis (plugins contribute services, typed events, reversible effects), detalhes das interfaces de capacidade e subsistema Session.<br/>https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-primer.md ｜ https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/capability-seams.md ｜ https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/subsystems/session.md

Material relacionado: [Aula 11 · Tornar observável o processo de execução do agent](../../lectures/lecture-11-why-observability-belongs-inside-the-harness/) ｜ [Aula 12 · Preparar a passagem de contexto antes do fim de cada sessão](../../lectures/lecture-12-why-every-session-must-leave-a-clean-state/) ｜ [Aula 2 · O que exatamente é um Harness](../../lectures/lecture-02-what-a-harness-actually-is/)
