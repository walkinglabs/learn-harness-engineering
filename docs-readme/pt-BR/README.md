<p align="center">
  <a href="README.md"><img alt="English" src="https://img.shields.io/badge/EN-English-blue?style=flat-square"></a>
  <a href="docs-readme/zh-CN/README.md"><img alt="简体中文" src="https://img.shields.io/badge/ZH-简体中文-red?style=flat-square"></a>
  <a href="docs-readme/zh-TW/README.md"><img alt="繁體中文" src="https://img.shields.io/badge/ZH--TW-繁體中文-orange?style=flat-square"></a>
  <a href="docs-readme/ja-JP/README.md"><img alt="日本語" src="https://img.shields.io/badge/JA-日本語-green?style=flat-square"></a>
  <a href="docs-readme/ko-KR/README.md"><img alt="한국어" src="https://img.shields.io/badge/KO-한국어-blueviolet?style=flat-square"></a>
  <a href="docs-readme/es-ES/README.md"><img alt="Español" src="https://img.shields.io/badge/ES-Español-yellow?style=flat-square"></a>
  <a href="docs-readme/fr-FR/README.md"><img alt="Français" src="https://img.shields.io/badge/FR-Français-007EC6?style=flat-square"></a>
  <a href="docs-readme/ru-RU/README.md"><img alt="Русский" src="https://img.shields.io/badge/RU-Русский-informational?style=flat-square"></a>
  <a href="docs-readme/de-DE/README.md"><img alt="Deutsch" src="https://img.shields.io/badge/DE-Deutsch-2EA043?style=flat-square"></a>
  <a href="docs-readme/ar-SA/README.md"><img alt="العربية" src="https://img.shields.io/badge/AR-العربية-success?style=flat-square"></a>
  <a href="docs-readme/vi-VN/README.md"><img alt="Tiếng Việt" src="https://img.shields.io/badge/VI-Tiếng_Việt-cc6699?style=flat-square"></a>
  <a href="docs-readme/uz-UZ/README.md"><img alt="Oʻzbekcha" src="https://img.shields.io/badge/UZ-Oʻzbekcha-1A8BBA?style=flat-square"></a>
  <a href="docs-readme/tr-TR/README.md"><img alt="Türkçe" src="https://img.shields.io/badge/TR-Türkçe-E30A17?style=flat-square"></a>
  <a href="docs-readme/pt-BR/README.md"><img alt="Português-BR" src="https://img.shields.io/badge/PT--BR-Português-1A8BBA?style=flat-square"></a>
  <a href="docs-readme/uk-UA/README.md"><img alt="Українська" src="https://img.shields.io/badge/UK-Українська-0057B7?style=flat-square"></a>
</p>

<h1 align="center">Aprenda Engenharia de Harness</h1>

<p align="center"><strong>Um curso baseado em projetos sobre a construção do ambiente, gerenciamento de estado, verificação e mecanismos de controle que fazem os agentes de codificação de IA funcionarem de forma confiável.</strong></p>

<p align="center">
  <img src="https://img.shields.io/badge/Aulas-14-blue?style=flat-square" alt="14 Aulas">
  <img src="https://img.shields.io/badge/Projetos-8-green?style=flat-square" alt="8 Projetos">
  <img src="https://img.shields.io/badge/Idiomas-15-yellow?style=flat-square" alt="15 Idiomas">
  <img src="https://img.shields.io/badge/Licença-MIT-lightgrey?style=flat-square" alt="Licença MIT">
</p>

> 🌍 Este curso está disponível em **15 idiomas**: Inglês, 简体中文, 繁體中文, 日本語, 한국어, Español, Français, Русский, Deutsch, العربية, Tiếng Việt, Oʻzbekcha, Türkçe, Português (BR) e Українська. Escolha seu idioma nos emblemas acima.

Aprenda Engenharia de Harness é um curso dedicado à engenharia de agentes de codificação de IA. Estudamos profundamente e sintetizamos as teorias e práticas mais avançadas de Engenharia de Harness na indústria. Nossas referências principais incluem:

> **🆕 Atualização de agosto de 2026: Análises de Design de Harness de Fronteira** — nova seção com 4 análises:
>
> - **Nova seção** [Análises de Design de Harness de Fronteira](../../docs/pt-BR/harness-designs/index.md) — aplique o framework de cinco subsistemas do curso (instruções, ferramentas, ambiente, estado e feedback) para fazer engenharia reversa de como quatro produtos de fronteira constroem harnesses reais.
> - **Pi** [Como o Pi constrói seu harness](../../docs/pt-BR/harness-designs/pi/index.md) — um kernel mínimo, expansão programável e a engenharia de contexto por trás de “peça ao Pi para construir o que você quiser”.
> - **Claude Code** [Como o Claude Code constrói seu harness](../../docs/pt-BR/harness-designs/claude-code/index.md) — memória em quatro camadas, compactação em cinco níveis, hooks e isolamento de subagentes.
> - **Codex** [Como o Codex constrói seu harness](../../docs/pt-BR/harness-designs/codex/index.md) — o repositório como fonte da verdade, AGENTS.md como página de diretório e isolamento por worktree.
> - **DeepSeek** [Como o DeepSeek constrói seu harness](../../docs/pt-BR/harness-designs/deepseek/index.md) — “tudo é um plugin”, pontos de separação entre capacidades e um pipeline de eventos.
> - **Todos os 15 idiomas** — cobertura completa de tradução em todos os idiomas suportados.
>
> **Ideia central:** o curso oferece um framework; estas análises mostram como os mesmos princípios realmente se manifestam em harnesses de produção.
>
> **🆕 Atualização de agosto de 2026: Engenharia de Grafos (Graph Engineering)** — adicionados 1 aula + 1 projeto:
>
> - **Aula 14** [Do Loop Único à Engenharia de Grafos](../../docs/pt-BR/lectures/lecture-14-graph-engineering/index.md): por que um único loop inevitavelmente vira um grafo — as quatro camadas empilhadas (prompt → context → loop → graph) e onde o harness se encaixa, as quatro peças do grafo (nós, arestas, estado compartilhado, roteamento), por que os checkpoints dentro de um loop não resolvem os três modos de falha estrutural em escala (Goodhart, cegueira para cima, conflito), os seis passos independentes de framework para construir seu primeiro grafo, a diferença entre Grafo e Workflow, as âncoras, o cenário dos projetos open source antes vs. depois do lançamento, o imposto de orquestração e quando realmente vale a pena desenhar um grafo.
> - **Projeto 08** [Desenhe Seu Fluxo de Trabalho como um Grafo](../../docs/pt-BR/projects/project-08-graph-engineering-first-graph/index.md): três experimentos progressivos — desenhar o maker-checker loop como um grafo explícito, adicionar um nó de fan-out/fan-in paralelo e adicionar uma aresta de rollback condicional e um nó de aprovação humana.
>
> **Ideia central:** um loop é um grafo com um único nó. Quando a tarefa exige divisão de trabalho, paralelismo, estado compartilhado, verificação e recuperação — ela não é mais um loop, é um grafo.
>
> **🆕 Atualização de julho de 2026: Engenharia de Loops (Loop Engineering)** — adicionados 1 aula + 1 projeto + modelos de código:
>
> - **Aula 13** [Por Que Você Precisa Parar de Dar Prompt ao Seu Agente](../../docs/pt-BR/lectures/lecture-13-loop-engineering/index.md): de `/goal` aos seis primitivos da engenharia de loops (automations, worktrees, skills, connectors, sub-agents, external state), a separação gerador/avaliador, os quatro custos silenciosos e a construção passo a passo do seu primeiro loop.
> - **Projeto 07** [Construa Seu Primeiro Loop Automatizado](../../docs/pt-BR/projects/project-07-loop-engineering-first-loop/index.md): três experimentos progressivos — loop baseado em objetivo, loop baseado em tempo e loop maker-checker. Compare manual vs. automatizado, meça a redução de intervenção e aprenda a sair do loop.
> - **Modelos de código**: `goal-template.md`, `loop-state-template.md`, `maker-prompt.md`, `checker-prompt.md` — modelos prontos para construir loops.
>
> **Ideia central:** a Engenharia de Harness constrói o carro. A Engenharia de Loops projeta a estrada por onde ele roda — e você projeta essa estrada de fora do carro.

- [OpenAI: Engenharia de Harness: aproveitando o Codex em um mundo focado em agentes](https://openai.com/index/harness-engineering/)
- [Anthropic: Harnesses eficazes para agentes de longa duração](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Anthropic: Design de Harness para desenvolvimento de aplicativos de longa duração](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [Awesome Harness Engineering](https://github.com/walkinglabs/awesome-harness-engineering)

> **Início rápido?** A skill [`skills/harness-creator/`](../../skills/harness-creator/) pode ajudá-lo a estruturar um harness de nível de produção (AGENTS.md, listas de recursos, init.sh, fluxos de verificação) para seu próprio projeto em minutos.

---

## Índice

- [✨ Prévia Visual](#-prévia-visual)
- [O que Realmente Significa Engenharia de Harness](#o-que-realmente-significa-engenharia-de-harness)
- [Início Rápido: Melhore Seu Agente Hoje](#início-rápido-melhore-seu-agente-hoje)
- [Projeto Final: Um Aplicativo Real](#projeto-final-um-aplicativo-real)
- [Trilha de Aprendizagem](#trilha-de-aprendizagem)
- [Ementa](#ementa)
- [Skills](#skills)
- [Outros Cursos](#outros-cursos)

---

## ✨ Prévia Visual

### 🏠 Página Inicial do Curso
> Um esboço abrangente do curso e introdução às filosofias centrais, fornecendo um caminho claro para começar.

![Prévia da página inicial do curso](../../docs/public/screenshots/readme/pt-BR-home.png)

### 📖 Aulas Imersivas
> Mergulhos profundos em pontos problemáticos do mundo real e projetos práticos (como o Projeto 01) para uma experiência de aprendizado imersiva.

![Prévia da aula do curso](../../docs/public/screenshots/readme/pt-BR-lecture-01.png)

### 🗂️ Biblioteca de Recursos Pronta para Uso
> Modelos e configurações de referência projetados para resolver armadilhas comuns no desenvolvimento de agentes de IA de múltiplos turnos, como perda de contexto e conclusão prematura de tarefas.

![Prévia da biblioteca de recursos](../../docs/public/screenshots/readme/pt-BR-resources.png)

## Livros de Curso em PDF

O repositório agora inclui um pipeline de construção de PDF para o conteúdo do curso.

- Execute `npm run pdf:build` para gerar localmente os livros do curso em PDF configurados atualmente.
- Os arquivos de saída são gravados em `artifacts/pdfs/`.
- Execute `npm run screenshots:readme` se desejar atualizar as imagens de prévia do README.
- O fluxo de trabalho do GitHub Actions [`release-course-pdfs.yml`](../../.github/workflows/release-course-pdfs.yml) pode construir os PDFs e publicá-los no GitHub Releases.

---

## O Modelo é Inteligente, o Harness o Torna Confiável

Existe uma verdade dura que a maioria das pessoas aprende da maneira mais difícil: **o modelo mais forte do mundo ainda falhará em tarefas de engenharia reais se você não construir um ambiente adequado ao redor dele.**

Você provavelmente já viu isso. Você dá ao Claude ou ao GPT uma tarefa em seu repositório. Ele começa bem — lê arquivos, escreve código, parece produtivo. De repente, algo dá errado. Ele pula uma etapa. Ele quebra um teste. Ele diz "concluído", mas nada realmente funciona. Você gasta mais tempo limpando a bagunça do que se tivesse feito você mesmo.

Isso não é um problema do modelo. É um problema do harness.

A evidência é clara. A Anthropic realizou um experimento controlado: mesmo modelo (Opus 4.5), mesmo prompt ("construa um editor de jogos retrô 2D"). Sem um harness, ele gastou US$ 9 em 20 minutos e produziu algo que não funcionava. Com um harness completo (planejador + gerador + avaliador), ele gastou US$ 200 em 6 horas e construiu um jogo que você realmente podia jogar. O modelo não mudou. O harness mudou.

A OpenAI relatou a mesma coisa com o Codex: em um repositório bem estruturado com um harness, o mesmo modelo passa de "não confiável" para "confiável". Não é uma melhoria marginal — é uma mudança qualitativa.

**Este curso ensina como construir esse ambiente.**

```text
                    O PADRÃO DO HARNESS
                    ====================

    Você --> dá a tarefa --> Agente lê os arquivos do harness --> Agente executa
                                                                 |
                                              o harness governa cada etapa:
                                              |
                                              +--> Instruções: o que fazer, em que ordem
                                              +--> Escopo:     um recurso por vez, sem excessos
                                              +--> Estado:     log de progresso, lista de recursos, histórico do git
                                              +--> Verificação: testes, lint, verificação de tipos, smoke runs
                                              +--> Ciclo de vida: inicialização no início, estado limpo no fim
                                              |
                                              v
                                         Agente para apenas quando a
                                         verificação é aprovada
```

---

## O que Realmente Significa Engenharia de Harness

Engenharia de harness trata de construir um ambiente de trabalho completo ao redor do modelo para que ele produza resultados confiáveis. Não se trata de escrever prompts melhores. Trata-se de projetar o sistema dentro do qual o modelo opera.

Um harness possui cinco subsistemas:

```text
    ┌────────────────────────────────────────────────────────────────┐
    │                          O HARNESS                             │
    │                                                                │
    │   ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐   │
    │   │ Instruções   │  │    Estado    │  │   Verificação      │   │
    │   │              │  │              │  │                    │   │
    │   │ AGENTS.md    │  │ progress.md  │  │ testes + lint      │   │
    │   │ CLAUDE.md    │  │ feature_list │  │ verificação tipos  │   │
    │   │ feature_list │  │ git log      │  │ smoke runs         │   │
    │   │ docs/        │  │ session hand │  │ pipeline e2e       │   │
    │   └──────────────┘  └──────────────┘  └────────────────────┘   │
    │                                                                │
    │   ┌──────────────┐  ┌──────────────────────────────────────┐   │
    │   │   Escopo     │  │         Ciclo de Vida da Sessão      │   │
    │   │              │  │                                      │   │
    │   │ um recurso   │  │ init.sh no início                    │   │
    │   │ por vez      │  │ checklist de estado limpo no fim     │   │
    │   │ definição de │  │ nota de entrega para a próxima sessão │   │
    │   │ concluído    │  │ commit apenas quando seguro retomar   │   │
    │   └──────────────┘  └──────────────────────────────────────┘   │
    │                                                                │
    └────────────────────────────────────────────────────────────────┘

    O MODELO decide qual código escrever.
    O HARNESS governa quando, onde e como ele o escreve.
    O harness não torna o modelo mais inteligente.
    Ele torna a saída do modelo confiável.
```

Cada subsistema tem uma função:

- **Instruções** — Dizem ao agente o que fazer, em que ordem e o que ler antes de começar. Não é um único arquivo gigante; é uma estrutura de divulgação progressiva pela qual o agente navega sob demanda.
- **Estado** — Rastreia o que foi feito, o que está em andamento e o que vem a seguir. Persistido no disco para que a próxima sessão recomece exatamente de onde a última parou.
- **Verificação** — Apenas uma suíte de testes aprovada conta como evidência. O agente não pode declarar vitória sem uma prova executável.
- **Escopo** — Restringe o agente a um recurso por vez. Sem excessos. Sem deixar três coisas pela metade. Sem reescrever a lista de recursos para esconder trabalho inacabado.
- **Ciclo de Vida da Sessão** — Inicializa no início. Limpa no fim. Deixa um caminho de reinicialização limpo para a próxima sessão.

---

## Por que Este Curso Existe

A questão não é "os modelos podem escrever código?". Eles podem. A questão é: **eles podem concluir de forma confiável tarefas de engenharia reais dentro de repositórios reais, ao longo de múltiplas sessões, sem supervisão humana constante?**

No momento, a resposta é: não sem um harness.

```text
    SEM HARNESS                                COM HARNESS
    ===========                                ===========

    Sessão 1: agente escreve código            Sessão 1: agente lê instruções
               agente quebra testes                       agente executa init.sh
               agente trabalha em um recurso
               você corrige manualmente                   agente verifica antes de concluir
                                                          agente atualiza log de progresso
    Sessão 2: agente começa do zero                       agente commita estado limpo
               agente não tem memória
               do que aconteceu antes          Sessão 2: agente lê log de progresso
               agente refaz o trabalho                    agente recomeça de onde parou
               ou faz algo totalmente diferente           agente continua o recurso inacabado
               você corrige novamente                     você revisa, não resgata

    Resultado: você gasta mais tempo           Resultado: o agente faz o trabalho,
               limpando do que se                         você verifica o resultado
               tivesse feito você mesmo
```

As perguntas com as quais este curso realmente se preocupa:

- Quais designs de harness melhoram as taxas de conclusão de tarefas?
- Quais designs reduzem o retrabalho e as conclusões incorretas?
- Quais mecanismos mantêm as tarefas de longa duração progredindo de forma constante?
- Quais estruturas mantêm o sistema sustentável após múltiplas execuções do agente?

---

## Currículo do Curso e Documentação

Para os materiais completos do curso, visite o **[Site de Documentação](https://walkinglabs.github.io/learn-harness-engineering/)**.

O currículo está dividido em três partes:

1. **Aulas**: 14 unidades conceituais explicando a teoria por trás da engenharia de harness.
2. **Projetos**: 8 projetos práticos onde você constrói um espaço de trabalho agentic do zero.
3. **Biblioteca de Recursos**: Modelos prontos para copiar (`AGENTS.md`, `feature_list.json`, `init.sh`, etc.) para usar em seus próprios repositórios hoje.

---

## Início Rápido: Melhore Seu Agente Hoje

Você não precisa ler todas as 14 aulas antes de começar a obter valor. Se você já está usando um agente de codificação em um projeto real, veja como melhorá-lo agora mesmo.

A ideia é simples: em vez de apenas escrever prompts, dê ao seu agente um conjunto de arquivos estruturados que definem o que fazer, o que foi feito e como verificar o trabalho. Esses arquivos vivem dentro do seu repositório, para que cada sessão comece do mesmo estado.

```text
    RAIZ DO SEU PROJETO
    ├── AGENTS.md              <-- o manual de operação do agente
    ├── CLAUDE.md              <-- (alternativa, se usar Claude Code)
    ├── init.sh                <-- executa install + verify + start
    ├── feature_list.json      <-- quais recursos existem, quais estão prontos
    ├── claude-progress.md     <-- o que aconteceu em cada sessão
    └── src/                   <-- seu código real
```

Pegue os modelos iniciais da [Biblioteca de Recursos](https://walkinglabs.github.io/learn-harness-engineering/pt-BR/resources/) e coloque-os em seu projeto. É isso. Quatro arquivos, e suas sessões de agente já serão significativamente mais estáveis do que rodando apenas com prompts.

---

## Projeto Final: Um Aplicativo Real

Todos os oito projetos do curso giram em torno do mesmo produto: **um aplicativo de desktop de base de conhecimento pessoal baseado em Electron**.

```text
    ┌──────────────────────────────────────────────────────┐
    │       App de Desktop de Base de Conhecimento         │
    │                                                      │
    │  ┌──────────────┐  ┌──────────────────────────────┐  │
    │  │ Lista de Doc │  │       Painel de Q&A          │  │
    │  │              │  │                              │  │
    │  │ doc-001.md   │  │  P: O que é eng. de harness? │  │
    │  │ doc-002.md   │  │  R: O ambiente construído    │  │
    │  │ doc-003.md   │  │     ao redor de um modelo... │  │
    │  │ ...          │  │     [citação: doc-002.md]    │  │
    │  └──────────────┘  └──────────────────────────────┘  │
    │                                                      │
    │  ┌─────────────────────────────────────────────────┐ │
    │  │ Barra Status: 42 docs | 38 indexados | sinc 3m  │ │
    │  └─────────────────────────────────────────────────┘ │
    └──────────────────────────────────────────────────────┘

    Recursos principais:
    ├── Importar documentos locais
    ├── Gerenciar uma biblioteca de documentos
    ├── Processar e indexar documentos
    ├── Executar Q&A com IA sobre o conteúdo importado
    └── Retornar respostas fundamentadas com citações
```

Este projeto foi escolhido porque combina um forte valor prático, complexidade de produto do mundo real suficiente e um bom cenário para observar as melhorias de harness antes e depois.

O ponto de partida/solução de cada projeto do curso é uma cópia completa deste aplicativo Electron nesse estágio evolutivo. O ponto de partida do P(N+1) é derivado da solução do P(N) — o aplicativo evolui conforme suas habilidades de harness crescem.

---

## Trilha de Aprendizado

O curso foi projetado para ser realizado em ordem. Cada fase se baseia na anterior.

```text
    Fase 1: ENTENDA O PROBLEMA            Fase 2: ESTRUTURE O REPOSITÓRIO
    ==========================           ===============================

    L01  Modelos poderosos ≠ execução    L03  Repositório como fonte
         confiável                             única da verdade
    L02  O que realmente significa
         harness                          L04  Divida as instruções em
                                               vários arquivos, não em
         |                                     um único arquivo gigante
         v
    P01  Comparação entre                     |
         apenas prompt vs.                    v
         abordagem orientada por regras  P02  Workspace legível por agentes


    Fase 3: CONECTE AS SESSÕES           Fase 4: FEEDBACK E ESCOPO
    ==========================           =========================

    L05  Mantenha o contexto ativo       L07  Defina limites claros
         entre sessões                        para as tarefas

    L06  Inicialize antes de cada        L08  Listas de funcionalidades
         sessão do agente                     como primitivas de harness

         |                                    |
         v                                    v
    P03  Continuidade entre múltiplas    P04  Feedback em tempo de
         sessões                              execução para corrigir
                                               o comportamento do agente


    Fase 5: VERIFICAÇÃO                  Fase 6: JUNTE TUDO
    ====================                 ==================

    L09  Impedir que agentes             L11  Tornar o comportamento
         declarem vitória cedo                do agente observável
         demais
                                         L12  Encerramento organizado ao
    L10  Executar o pipeline completo =       final de cada sessão
         verificação real
                                              |
         |                                    v
         v                               P06  Construir um harness
    P05  O agente verifica o próprio          completo (projeto final)
         trabalho

    Fase 7: AUTOMATIZE O LOOP
    ==========================
    L13  Pare de dar prompt ao seu agente —
         projete loops em vez disso
         |
         v
    P07  Construa seu primeiro loop automatizado
         (loop baseado em objetivo, baseado em tempo,
         maker-checker)

    Fase 8: ESTRUTURE O SISTEMA
    =============================
    L14  Desenhe o sistema como um grafo —
         nós, arestas, estado compartilhado, roteamento
         |
         v
    P08  Desenhe seu fluxo de trabalho como um grafo
         (grafo explícito, fan-out/fan-in paralelo,
          aresta de rollback, humano no loop)
```

Cada fase leva cerca de uma semana se você estiver estudando em meio período. Se quiser avançar mais rápido, as fases 1–3 podem ser concluídas em um fim de semana prolongado.

---

## Ementa

### Aulas — 14 unidades conceituais, cada uma respondendo a uma pergunta central

*Leia o texto completo de cada aula no [Site de Documentação](https://walkinglabs.github.io/learn-harness-engineering/).*

| Sessão | Pergunta | Ideia Central |
|---------|----------|-----------|
| [L01](../../docs/pt-BR/lectures/lecture-01-why-capable-agents-still-fail/index.md) | Por que modelos fortes ainda falham em tarefas reais? | A lacuna de capacidade entre benchmarks e engenharia real |
| [L02](../../docs/pt-BR/lectures/lecture-02-what-a-harness-actually-is/index.md) | O que "harness" realmente significa? | Cinco subsistemas: instruções, estado, verificação, escopo, ciclo de vida |
| [L03](../../docs/pt-BR/lectures/lecture-03-why-the-repository-must-become-the-system-of-record/index.md) | Por que o repositório deve ser a única fonte de verdade? | Se o agente não consegue ver, não existe |
| [L04](../../docs/pt-BR/lectures/lecture-04-why-one-giant-instruction-file-fails/index.md) | Por que um único arquivo de instrução gigante falha? | Divulgação progressiva: forneça um mapa, não uma enciclopédia |
| [L05](../../docs/pt-BR/lectures/lecture-05-why-long-running-tasks-lose-continuity/index.md) | Por que tarefas de longa duração perdem a continuidade? | Persista o progresso no disco; recomece de onde parou |
| [L06](../../docs/pt-BR/lectures/lecture-06-why-initialization-needs-its-own-phase/index.md) | Por que a inicialização precisa de sua própria fase? | Verifique se o ambiente está saudável antes do agente começar o trabalho |
| [L07](../../docs/pt-BR/lectures/lecture-07-why-agents-overreach-and-under-finish/index.md) | Por que os agentes se excedem e não terminam o que começaram? | Um recurso por vez; definição explícita de concluído |
| [L08](../../docs/pt-BR/lectures/lecture-08-why-feature-lists-are-harness-primitives/index.md) | Por que as listas de recursos são primitivas de harness? | Limites de escopo legíveis por máquina que o agente não pode ignorar |
| [L09](../../docs/pt-BR/lectures/lecture-09-why-agents-declare-victory-too-early/index.md) | Por que os agentes declaram vitória cedo demais? | Lacunas de verificação: confiança ≠ correção |
| [L10](../../docs/pt-BR/lectures/lecture-10-why-end-to-end-testing-changes-results/index.md) | Por que o teste de ponta a ponta muda os resultados? | Apenas uma execução de pipeline completa conta como verificação real |
| [L11](../../docs/pt-BR/lectures/lecture-11-why-observability-belongs-inside-the-harness/index.md) | Por que a observabilidade pertence ao harness? | Se você não pode ver o que o agente fez, não pode consertar o que ele quebrou |
| [L12](../../docs/pt-BR/lectures/lecture-12-why-every-session-must-leave-a-clean-state/index.md) | Por que cada sessão deve deixar um estado limpo? | O sucesso da próxima sessão depende da limpeza desta sessão |
| [L13](../../docs/pt-BR/lectures/lecture-13-loop-engineering/index.md) | Por que você precisa parar de dar prompt ao seu agente? | Do prompting manual aos loops autônomos — loop baseado em objetivo, loop baseado em tempo, separação maker-checker |
| [L14](../../docs/pt-BR/lectures/lecture-14-graph-engineering/index.md) | Por que um único loop evolui para um grafo? | Do loop único à engenharia de grafos — nós, arestas, estado compartilhado, roteamento e quando realmente vale a pena desenhar

### Projetos — 8 projetos práticos aplicando os métodos das aulas ao mesmo aplicativo Electron

| Projeto | O Que Você Faz | Mecanismo de Harness |
|---------|------------|-------------------|
| [P01](../../docs/pt-BR/projects/project-01-baseline-vs-minimal-harness/index.md) | Execute a mesma tarefa duas vezes: apenas prompt vs. regras primeiro | Harness mínimo: AGENTS.md + init.sh + feature_list.json |
| [P02](../../docs/pt-BR/projects/project-02-agent-readable-workspace/index.md) | Reestruture o repositório para que o agente possa lê-lo | Espaço de trabalho legível pelo agente + arquivos de estado persistentes |
| [P03](../../docs/pt-BR/projects/project-03-multi-session-continuity/index.md) | Faça o agente recomeçar de onde parou | Log de progresso + entrega de sessão + continuidade multi-sessão |
| [P04](../../docs/pt-BR/projects/project-04-incremental-indexing/index.md) | Impeça o agente de fazer demais ou de menos | Feedback de tempo de execução + controle de escopo + indexação incremental |
| [P05](../../docs/pt-BR/projects/project-05-grounded-qa-verification/index.md) | Faça o agente verificar seu próprio trabalho | Autoverificação + Q&A fundamentado + conclusão baseada em evidências |
| [P06](../../docs/pt-BR/projects/project-06-runtime-observability-and-debugging/index.md) | Construa um harness completo do zero (projeto final) | Harness completo: todos os mecanismos + observabilidade + estudo de ablação |
| [P07](../../docs/pt-BR/projects/project-07-loop-engineering-first-loop/index.md) | Construa seu primeiro loop automatizado | Loop baseado em objetivo, loop baseado em tempo, separação maker-checker, gerenciamento de estado do loop |
| [P08](../../docs/pt-BR/projects/project-08-graph-engineering-first-graph/index.md) | Desenhe seu fluxo de trabalho como um grafo | Nós/arestas/estado/roteamento explícitos, fan-out/fan-in paralelo, aresta de rollback, aprovação humana |

```text
    EVOLUÇÃO DO PROJETO
    ===================

    P01  Apenas prompt vs. regras primeiro    Você vê o problema
     |
     v
    P02  Espaço de trabalho legível pelo agente Você reestrutura o repositório
     |
     v
    P03  Continuidade multi-sessão             Você conecta as sessões
     |
     v
    P04  Feedback e escopo em tempo real       Você adiciona loops de feedback
     |
     v
    P05  Autoverificação                       Você faz o agente se verificar
     |
     v
    P06  Harness completo (projeto final)      Você constrói o sistema completo
     |
     v
    P07  Seu primeiro loop automatizado        Você sai do loop
     |
     v
    P08  Desenhe seu fluxo de trabalho         Você desenha o sistema
         como um grafo

    A solução de cada projeto torna-se o ponto de partida do próximo projeto.
    O aplicativo evolui. Suas habilidades de harness crescem com ele.
```

### Biblioteca de Recursos

- [English](https://walkinglabs.github.io/learn-harness-engineering/en/resources/) — modelos, checklists e referências de métodos
- [简体中文](https://walkinglabs.github.io/learn-harness-engineering/zh/resources/) — 中文模板、清单和方法参考
- [繁體中文](https://walkinglabs.github.io/learn-harness-engineering/zh-TW/resources/) — 繁體中文範本、清單和方法參考
- [日本語](https://walkinglabs.github.io/learn-harness-engineering/ja/resources/) — テンプレート、チェックリスト、方法リファレンス
- [한국어](https://walkinglabs.github.io/learn-harness-engineering/ko/resources/) — 템플릿, 체크리스트, 방법 참고 자료
- [Español](https://walkinglabs.github.io/learn-harness-engineering/es/resources/) — plantillas, listas de verificación y referencias
- [Français](https://walkinglabs.github.io/learn-harness-engineering/fr/resources/) — modèles, listes de contrôle et références
- [Русский](https://walkinglabs.github.io/learn-harness-engineering/ru/resources/) — шаблоны, чек-листы и справочники
- [Deutsch](https://walkinglabs.github.io/learn-harness-engineering/de/resources/) — Vorlagen, Checklisten und Referenzen
- [العربية](https://walkinglabs.github.io/learn-harness-engineering/ar/resources/) — قوالب، قوائم تحقق ومراجع
- [Tiếng Việt](https://walkinglabs.github.io/learn-harness-engineering/vi/resources/) — mẫu, danh sách kiểm tra và tài liệu tham khảo
- [Oʻzbekcha](https://walkinglabs.github.io/learn-harness-engineering/uz/resources/) — andozalar, tekshiruv roʻyxatlari va maʼlumotnomalar
- [Türkçe](https://walkinglabs.github.io/learn-harness-engineering/tr/resources/) — şablonlar, kontrol listeleri ve referanslar
- [Português (BR)](https://walkinglabs.github.io/learn-harness-engineering/pt-BR/resources/) — modelos, listas de verificação e referências de métodos

---

## O Ciclo de Vida de uma Sessão de Agente

Uma das ideias centrais deste curso: **a sessão do agente deve seguir um ciclo de vida estruturado, e não funcionar sem regras ou organização.** Veja como isso funciona:

```text
    CICLO DE VIDA DE UMA SESSÃO DE AGENTE
    =====================================

    ┌──────────────────────────────────────────────────────────────────┐
    │  INÍCIO                                                         │
    │                                                                  │
    │  1. O agente lê AGENTS.md / CLAUDE.md                            │
    │  2. O agente executa init.sh (instalação, verificação,           │
    │     checagem de integridade)                                     │
    │  3. O agente lê claude-progress.md (o que aconteceu na última    │
    │     sessão)                                                      │
    │  4. O agente lê feature_list.json (o que foi concluído e o que   │
    │     vem a seguir)                                                │
    │  5. O agente verifica o git log (alterações recentes)            │
    │                                                                  │
    │  SELECIONAR                                                      │
    │                                                                  │
    │  6. O agente escolhe exatamente UMA funcionalidade não concluída │
    │  7. O agente trabalha apenas nessa funcionalidade               │
    │                                                                  │
    │  EXECUTAR                                                        │
    │                                                                  │
    │  8. O agente implementa a funcionalidade                         │
    │  9. O agente executa as verificações (testes, lint,              │
    │     verificação de tipos)                                        │
    │  10. Se a verificação falhar: corrigir e executar novamente      │
    │  11. Se a verificação passar: registrar evidências               │
    │                                                                  │
    │  ENCERRAMENTO                                                    │
    │                                                                  │
    │  12. O agente atualiza claude-progress.md                        │
    │  13. O agente atualiza feature_list.json                         │
    │  14. O agente registra o que ainda está quebrado ou não foi      │
    │      verificado                                                  │
    │  15. O agente faz commit (somente quando for seguro retomar)     │
    │  16. O agente deixa um caminho de reinício limpo para a próxima  │
    │      sessão                                                      │
    │                                                                  │
    └──────────────────────────────────────────────────────────────────┘
```

    O harness governa cada transição desse ciclo de vida.
    O modelo decide qual código escrever em cada etapa.
    Sem o harness, a etapa 9 se torna: "o agente diz que parece estar tudo certo."
    Com o harness, a etapa 9 se torna: "os testes passaram, o lint está limpo e a verificação de tipos foi concluída com sucesso."

---

## Para Quem Este Curso É Indicado

Este curso é voltado para:

- Engenheiros que já utilizam agentes de programação e desejam maior estabilidade e qualidade
- Pesquisadores ou criadores que desejam uma compreensão sistemática sobre design de harness
- Tech leads que precisam entender como o design do ambiente afeta o desempenho dos agentes

Este curso não é indicado para:

- Pessoas que procuram uma introdução à IA sem código
- Pessoas que se preocupam apenas com prompts e não pretendem construir implementações reais
- Alunos que não estão dispostos a permitir que agentes trabalhem dentro de repositórios reais

---

## Requisitos

Este é um curso em que você realmente executará agentes de programação.

Você precisará de pelo menos uma destas ferramentas:

- Claude Code
- Codex
- Outro agente de programação para IDE ou CLI que ofereça suporte à edição de arquivos, execução de comandos e tarefas de múltiplas etapas

O curso pressupõe que você seja capaz de:

- Abrir um repositório local
- Permitir que o agente edite arquivos
- Permitir que o agente execute comandos
- Inspecionar saídas e executar tarefas novamente

Se você não tiver uma ferramenta desse tipo, ainda poderá ler o conteúdo do curso, mas não conseguirá concluir os projetos da forma como foram planejados.

---

## Visualização Local

Este repositório utiliza o VitePress como visualizador de documentação.

```sh
npm install
npm run docs:dev        # Servidor de desenvolvimento com recarregamento automático
npm run docs:build      # Build de produção
npm run docs:preview    # Visualizar o site gerado
```

Em seguida, abra no navegador a URL local exibida pelo VitePress.

---

## Pré-requisitos

Obrigatórios:

- Familiaridade com terminal, Git e ambientes de desenvolvimento locais
- Capacidade de ler e escrever código em pelo menos uma stack de aplicações comum
- Experiência básica com depuração de software (leitura de logs, testes e comportamento em tempo de execução)
- Tempo suficiente para se dedicar a um curso com foco em implementação prática

Úteis, mas não obrigatórios:

- Experiência com Electron, aplicações desktop ou ferramentas local-first
- Conhecimento em testes, logging ou arquitetura de software
- Experiência prévia com Codex, Claude Code ou agentes de programação semelhantes

---

## Referências Principais

Primárias:

- [OpenAI: Engenharia de Harness: aproveitando o Codex em um mundo focado em agentes](https://openai.com/index/harness-engineering/)
- [Anthropic: Harnesses eficazes para agentes de longa duração](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Anthropic: Design de Harness para desenvolvimento de aplicativos de longa duração](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [OpenAI: Desdobrando o loop do agente Codex](https://openai.com/index/unrolling-the-codex-agent-loop/)
- [Anthropic: Desmistificando avaliações (evals) para agentes de IA](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- [LangChain: Melhorando agentes avançados com harness engineering](https://www.langchain.com/blog/improving-deep-agents-with-harness-engineering)
- [Thoughtworks / Martin Fowler: Harness engineering para usuários de agentes de programação](https://martinfowler.com/articles/harness-engineering.html)
- [Cursor: Melhorando continuamente nosso harness de agentes](https://cursor.com/blog/continually-improving-agent-harness)

Veja a lista completa de referências em camadas em [`docs/pt-BR/resources/reference/`](../../docs/pt-BR/resources/reference/index.md).

---

## Estrutura do Repositório

```text
learn-harness-engineering/
├── docs/                          # Site de documentação VitePress
│   ├── lectures/                  # 14 aulas (index.md + exemplos de código)
│   │   ├── lecture-01-*/
│   │   └── ... (14 no total)
│   ├── projects/                  # Descrições de 8 projetos
│   │   ├── project-01-*/
│   │   └── ... (8 no total)
│   └── resources/                 # Modelos e referências multilíngues (14 idiomas)
│       ├── en/
│       └── ... (14 no total)
├── projects/
│   ├── shared/                    # Base compartilhada Electron + TypeScript + React
│   └── project-NN/                # Diretórios starter/ e solution/ por projeto
├── skills/                        # Skills reutilizáveis de agentes de IA
│   └── harness-creator/           # Skill de engenharia de harness
├── package.json                   # VitePress + ferramentas de desenvolvimento
└── CLAUDE.md                      # Instruções do Claude Code para este repositório
```

---

## Como o Curso está Organizado

- Cada aula foca em uma pergunta.
- O curso inclui 8 projetos.
- Cada projeto exige que o agente faça um trabalho real.
- Cada projeto compara os resultados de um harness fraco vs. forte.
- O que importa é a diferença medida, não quantos documentos foram escritos.

---

## Skills

Este repositório também inclui skills reutilizáveis de agentes de IA que você pode instalar diretamente em seu IDE ou espaço de trabalho de agente.

- [**harness-creator**](../../skills/harness-creator/): Uma skill que ajuda você a estruturar um harness de nível de produção para seu próprio projeto em minutos.

---

## Outros Cursos

Nossa equipe também criou outros cursos! Confira-os:

[![Hands-on Modern RL](https://img.shields.io/badge/HANDS--ON_MODERN_RL-0052cc?style=for-the-badge)](https://github.com/walkinglabs/hands-on-modern-rl)

**Hands-on Modern RL**: Um currículo prático de código aberto que preenche a lacuna entre os conceitos básicos de RL e o alinhamento de LLM, RLVR e sistemas Agentic avançados.

[![Modern LLM Notebook](https://img.shields.io/badge/MODERN_LLM_NOTEBOOK-0052cc?style=for-the-badge)](https://github.com/walkinglabs/modern-llm-notebook)

**Modern LLM Notebook**: Um curso prático para construir LLMs modernos do zero em PyTorch, com 23 Jupyter Notebooks executáveis cobrindo tokenizadores, atenção, MoE, RLHF, inferência, avaliação e destilação.

---

## Star History

[![Star History Chart](https://star-history.dera.page/svg?repos=walkinglabs/learn-harness-engineering&type=date&legend=top-left)](https://star-history.dera.page/#walkinglabs/learn-harness-engineering&type=date&legend=top-left)

---

## Agradecimentos

Este curso foi inspirado e extrai ideias de [learn-claude-code](https://github.com/shareAI-lab/learn-claude-code) — um guia progressivo para construir um agente do zero, de um único loop à execução autônoma isolada.
