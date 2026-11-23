# Análise do design de harness do Codex

O [Codex](https://openai.com/index/harness-engineering/), da OpenAI, talvez seja, entre os quatro produtos, o mais profundamente ligado aos princípios fundamentais de harness. Afinal, o artigo Harness Engineering, que deu nome a todo esse campo, nasceu das experiências da equipe da OpenAI ao desenvolver produtos com Codex. Portanto, analisar o design de harness do Codex é, em grande medida, analisar as práticas de engenharia por trás desse artigo.

A filosofia do Codex pode ser resumida em uma frase: **o repositório é a fonte da verdade (repository as the system of record), AGENTS.md é apenas uma página de índice, e o valor da engenharia está em projetar o ambiente, expressar a intenção e construir loops de feedback.**

## Posicionamento em uma frase

A equipe da OpenAI usou Codex para entregar, em poucas semanas, um produto que chegou a ter mais de um milhão de linhas de código, **todas escritas pelo Codex** (veja a seção "Designing for growth" de [Harness Engineering](https://openai.com/index/harness-engineering/)). Essa prática respondeu a uma pergunta: quando o papel do engenheiro deixa de ser "escrever código" e passa a ser "projetar o harness", como o sistema deve ser organizado? O Codex CLI em si é um binário monolítico de código aberto, implementado em Rust ([github.com/openai/codex](https://github.com/openai/codex)), mas sua principal contribuição para harness está nas **convenções (convention)** e na **engenharia de contexto**, e não em pontos de extensão sofisticados.

## Subsistema de instruções: AGENTS.md é uma página de índice, não uma enciclopédia

Esta é a decisão de design do Codex que mais influenciou a teoria de harness:

> Um único arquivo gigante de instruções dificulta verificações automatizadas — cobertura, atualização, propriedade e referências cruzadas — e inevitavelmente acaba divergindo da realidade. Por isso, deixamos de tratar AGENTS.md como uma enciclopédia e passamos a tratá-lo como uma **página de índice**. O conhecimento da base de código fica em documentação estruturada, e AGENTS.md aponta para ela.

(O texto acima é uma paráfrase direta da seção "AGENTS.md should be a directory page" de [Harness Engineering](https://openai.com/index/harness-engineering/).)

A quarta aula explica por que "um único arquivo gigante de instruções falha", e o Codex oferece uma resposta direta: mantenha AGENTS.md em torno de 100 linhas — o texto original recomenda aproximadamente 100 e sugere mover o conteúdo para `docs/` quando esse limite se aproxima — e divida os detalhes no diretório `docs/` para que o agent os leia sob demanda. Essa é a principal referência para a ideia de "fornecer um mapa, não um manual".

O princípio complementar é **impor invariantes, sem microgerenciar a implementação** (no original: "don't micromanage the implementation; focus on invariants"): AGENTS.md contém apenas restrições rígidas que não podem ser violadas e comandos de validação; a implementação fica a cargo do modelo. Isso corresponde diretamente a "restrições, não microgerenciamento", da segunda aula.

## Subsistema de contexto: Write-Select-Compress-Isolate

A engenharia de contexto do Codex pode ser resumida em quatro estratégias. Esse framework foi elaborado pela comunidade depois que "context engineering" se consolidou como disciplina própria e então mapeado de volta para o Codex (veja [Context Engineering for Codex CLI](https://codex.danielvaughan.com/2026/06/10/context-engineering-codex-cli-write-select-compress-isolate-june-2026/)):

- **Write (escrever para fora)**: persistir o contexto fora da janela — registrar conclusões na documentação e o estado em arquivos, em vez de deixá-los na conversa. Corresponde ao princípio de que "o repositório é a fonte da verdade".
- **Select (selecionar para dentro)**: trazer para a janela apenas os tokens necessários — AGENTS.md indica o caminho e os arquivos são lidos sob demanda, em vez de inserir todo o repositório no contexto.
- **Compress (compactar)**: preservar o que realmente importa — Codex oferece compactação automática e `/compact` manual, com possibilidade de personalizar `compact_prompt` (veja [Context Engineering for Codex CLI](https://codex.danielvaughan.com/2026/06/10/context-engineering-codex-cli-write-select-compress-isolate-june-2026/)).
- **Isolate (isolar)**: separar o contexto em limites distintos — usar subagents para isolar o contexto de tarefas diferentes; um subagent de frontend nunca vê o schema do banco de dados do backend.

Codex também possui um detalhe refinado no contexto do ambiente: a análise de código-fonte do [codex-harness-internals](https://github.com/AlexKenbo/codex-harness-internals) feita pela comunidade mostra que `build_environment_update_item` emite apenas os **campos alterados** — CWD, branch do git e sistema de arquivos — quando o ambiente muda, em vez de repetir todo o contexto do sistema a cada rodada. É um detalhe de engenharia para "não manter tokens repetidos no contexto".

## Ferramentas e limites: isolamento com worktree + subagents

Codex possui dois mecanismos centrais de harness:

**1. Isolamento do ambiente com git worktree.** A seção "Environment" de [Harness Engineering](https://openai.com/index/harness-engineering/) explica que cada tarefa é executada em uma git worktree independente, junto com uma stack local de observabilidade — logs, métricas e traces — para validar cada mudança em um ambiente isolado. É a implementação física de "definir claramente os limites de cada tarefa do agent", da sétima aula: o limite não depende de um pedido em uma instrução, mas é imposto pelo isolamento do ambiente. Aqui, o subsistema de ambiente torna-se um isolamento rígido.

**2. Subagents no nível do núcleo.** `spawn_agent` / `wait_agent`, do Codex, são ferramentas do núcleo: o modelo cria explicitamente subagents, fornece a cada um um histórico de sessão e um conjunto de ferramentas independentes e aguarda os resultados. Os subagents herdam as instruções AGENTS.md do agente pai, mas são executados em **seu próprio contexto**. A configuração fica em `.codex/agents/*.toml`, onde é possível especificar modelos e instruções diferentes (veja a seção Sub-agents de [Context Engineering for Codex CLI](https://codex.danielvaughan.com/2026/06/10/context-engineering-codex-cli-write-select-compress-isolate-june-2026/)). Essa é uma implementação direta do "isolamento de contexto" e também representa o espírito da "passagem de contexto" da décima segunda aula: cada subagent é uma unidade de trabalho com limites claros.

## Subsistema de feedback: comandos de validação incorporados às normas

Um dos pontos mais enfatizados pela OpenAI é registrar explicitamente os comandos de validação em AGENTS.md, fazendo de "como confirmar que está correto" uma parte do repositório. No fluxo de engenharia do Codex, testes, CI, documentação e configuração de observabilidade são todos gerados pelo Codex e constituem "caminhos executáveis de validação". A solução para um modelo capaz, mas não confiável, não é esperar que ele aja corretamente por conta própria, e sim tornar **o caminho de validação um componente padrão do harness**.

As políticas de aprovação (approval policies) e o modo de planejamento (plan mode) oferecem feedback em outra direção: antes de operações de alto risco, exige-se um plano e uma aprovação, transformando os "limites da tarefa" e o "poder de decisão humano" em controles de runtime.

## Mapeamento para o framework do curso

| Subsistema | Implementação no Codex | Avaliação |
| --- | --- | --- |
| Instruções | AGENTS.md como página de índice + divisão em docs/ + imposição de invariantes | Exemplar; definiu a ideia de "fornecer um mapa, não um manual" |
| Ferramentas | Isolamento com worktree + subagents via spawn_agent | Limites impostos pelo ambiente; muito robusto |
| Ambiente | worktree independente + stack de observabilidade | O isolamento com worktree é sua marca registrada |
| Estado | Estratégia Write (estado registrado em arquivos/documentos) | Depende de convenções, não de memória integrada |
| Feedback | Comandos de validação nas normas + políticas de aprovação + plan mode | Caminhos de feedback padronizados; vale a pena adotar |

A comparação entre Codex e Claude Code é interessante: Claude Code segue a "adição", incorporando memória, permissões e subagents ao núcleo; Codex segue a "subtração", mantendo o núcleo contido e transferindo mais responsabilidade para as convenções do repositório e a engenharia de contexto. É por isso que a comunidade costuma dizer que "a filosofia de harness do Codex vale mais do que seu código".

## Designs que vale a pena adotar

1. **Escreva AGENTS.md como uma página de índice**: mantenha-o em torno de 100 linhas, aponte para os detalhes em docs/ e permita verificações automatizadas.
2. **Registre apenas invariantes, sem microgerenciar a implementação**: restrições rígidas + comandos de validação; deixe o restante para o modelo.
3. **Use worktree para isolar ambientes**: imponha os limites da tarefa pelo ambiente, não por pedidos em instruções.
4. **Transmita apenas incrementos do contexto do ambiente**: em cada rodada, emita somente os campos alterados, sem repetir todo o contexto do sistema.
5. **Use subagents para isolar o contexto**: ao dividir tarefas, divida também o contexto para não contaminar o loop principal.

## Fontes de referência (originais / código-fonte)

Cada afirmação pode ser rastreada até os textos originais ou o código-fonte abaixo, evitando paráfrases baseadas apenas em lembranças:

- **OpenAI, Harness Engineering**: AGENTS.md como página de índice e recomendação de cerca de 100 linhas; execute invariants / don't micromanage; isolamento com worktree + stack de observabilidade; comandos de validação nas normas; caso do produto com mais de um milhão de linhas; políticas de aprovação e plan mode. Principal fonte de todas as afirmações centrais deste artigo.<br/>https://openai.com/index/harness-engineering/
- **Especificação oficial AGENTS.md da OpenAI** (AGENTS.md como convenção padrão entre ferramentas):<br/>https://openai.com/index/agents-md/
- **Repositório de código aberto do Codex CLI** (binário monolítico implementado em Rust):<br/>https://github.com/openai/codex
- **Context Engineering for Codex CLI** (comunidade): framework Write-Select-Compress-Isolate, `/compact` e `compact_prompt`, subagents `spawn_agent` / `wait_agent` e configuração `.codex/agents/*.toml`.<br/>https://codex.danielvaughan.com/2026/06/10/context-engineering-codex-cli-write-select-compress-isolate-june-2026/
- **codex-harness-internals** (análise de código-fonte pela comunidade): detalhes de implementação, como o contexto incremental do ambiente em `build_environment_update_item`.<br/>https://github.com/AlexKenbo/codex-harness-internals

Material relacionado: [Aula 3 · Transformar o repositório na única fonte da verdade](../../lectures/lecture-03-why-the-repository-must-become-the-system-of-record/) ｜ [Aula 4 · Dividir instruções em arquivos diferentes](../../lectures/lecture-04-why-one-giant-instruction-file-fails/) ｜ [Aula 7 · Definir claramente os limites de cada tarefa do agent](../../lectures/lecture-07-why-agents-overreach-and-under-finish/)
