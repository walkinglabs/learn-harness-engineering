# Análise do design de harness do Claude Code

Em [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents), a Anthropic afirma claramente que a confiabilidade vem do harness, não do modelo, e que o agent precisa ser restringido "fora do modelo". Claude Code é a materialização dessa ideia em um produto, e a própria Anthropic o classifica diretamente como um **agentic harness**. Não se trata de linguagem de marketing: Claude Code talvez seja hoje o harness analisado publicamente em maior profundidade. Seu código-fonte é aberto, os relatórios da comunidade são detalhados, e quase todos os mecanismos centrais do curso — memória em camadas, compactação de contexto, permissões, hooks, subagents e persistência de sessões — foram transformados em uma implementação completa de produto.

Neste artigo, usamos o framework dos cinco subsistemas do curso para analisar Claude Code, concentrando-nos em como ele implementa conceitos fundamentais de harness como "gerenciamento de contexto", "prevenção de declarações prematuras de conclusão" e "restrições determinísticas".

## Posicionamento em uma frase

O núcleo do Claude Code é um loop while simples: chamar o modelo, executar ferramentas, observar os resultados e chamar o modelo novamente. Porém, **a maior parte do código não está nesse loop, e sim nos sistemas que o cercam** — sistema de permissões, pipeline de compactação de contexto, mecanismos de extensão, orquestração de subagents e armazenamento de sessões. Essa é a essência do harness: o loop é o esqueleto; tudo ao redor dele é o que determina a confiabilidade.

## Subsistema de instruções: memória em camadas

O sistema de memória do Claude Code é sua contribuição mais direta à teoria de harness e corresponde às aulas sobre "o repositório como fonte da verdade" e "continuidade de contexto entre sessões". A documentação oficial [How Claude remembers your project](https://code.claude.com/docs/en/memory) explica que cada sessão começa com uma janela de contexto nova e transporta conhecimento entre sessões por dois mecanismos: arquivos CLAUDE.md — instruções escritas por você — e auto memory — notas escritas pelo próprio Claude.

Quanto ao escopo, a documentação oficial divide os arquivos CLAUDE.md em quatro categorias, da mais ampla para a mais específica na ordem de carregamento:

- **Política organizacional**: gerenciada centralmente por IT/DevOps, como `/etc/claude-code/CLAUDE.md`, com normas corporativas.
- **Nível do usuário `~/.claude/CLAUDE.md`**: preferências e regras pessoais válidas em vários projetos.
- **Nível do projeto `./CLAUDE.md` ou `./.claude/CLAUDE.md`**: fonte da verdade do projeto, com estrutura de engenharia, stack tecnológica e comandos de validação, compartilhada no repositório.
- **Nível local `./CLAUDE.local.md`**: preferências pessoais dentro do projeto, normalmente adicionadas ao `.gitignore` e não versionadas.

Há ainda dois mecanismos:

- **Carregamento sob demanda por subdiretório**: CLAUDE.md em subdiretórios não é carregado na inicialização, mas entra no contexto quando Claude lê arquivos daquele diretório.
- **Memória automática (auto memory)**: Claude registra ativamente notas a partir de suas correções e preferências; elas são compartilhadas por repositório, funcionam entre worktree e carregam no máximo as primeiras 200 linhas ou 25KB por sessão.

Esses quatro escopos formam uma **hierarquia de instruções**: segundo a documentação oficial, "quanto mais específica a instrução, mais tarde ela entra no contexto" — instruções do projeto aparecem depois das instruções do usuário. O valor disso está em não obrigar o modelo a absorver um arquivo gigantesco de instruções no início de cada conversa, mas carregar as informações mais próximas conforme o escopo. Essa é a resposta, transformada em produto, à quarta aula: "por que um único arquivo gigante de instruções falha".

## Subsistema de contexto: pipeline de compactação em cinco níveis

O gerenciamento de contexto do Claude Code usa um **pipeline de compactação em cinco níveis** (five-layer compaction pipeline), e não um simples "resumir quando ficar cheio". Esse detalhe arquitetural vem da análise de código-fonte [Dive into Claude Code](https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf), do VILA Lab. A quinta aula explica como tarefas longas perdem continuidade; a solução do Claude Code é um funil de vários níveis: primeiro realiza poda sem perdas, removendo resultados redundantes de ferramentas; depois faz uma extração estruturada; e só no fim usa resumos com perdas produzidos por LLM, com mecanismos de interrupção para evitar compactação excessiva.

O design é complementado pelo armazenamento de sessões: **armazenamento orientado a anexação (append-oriented storage)**, no qual todo o histórico é acrescentado a `history.jsonl`, com suporte a restauração via `/resume` e ramificações fork. Isso garante a "passagem de contexto antes do fim de cada sessão" — não por uma memória excepcional, mas porque a camada de armazenamento é incremental e reproduzível.

## Subsistema de ferramentas: quatro mecanismos de extensão

Claude Code divide sua superfície de extensão em quatro categorias, cada uma destinada a um tipo de problema. Essa é uma das partes mais valiosas de seu design:

- **Skills**: conforme a [documentação oficial](https://code.claude.com/docs/en/skills), conhecimento procedimental descrito em `SKILL.md`, carregado automaticamente por palavras de ativação e com divulgação progressiva. Adequado ao conhecimento especializado sobre "como fazer algo".
- **MCP**: o protocolo JSON-RPC da [documentação oficial](https://code.claude.com/docs/en/mcp) conecta sistemas externos e serve como interface padrão para que "as mãos do modelo alcancem o mundo externo".
- **Hooks**: scripts determinísticos da [documentação oficial](https://code.claude.com/docs/en/hooks), associados a eventos do ciclo de vida como `PreToolUse`, `PostToolUse` e `Stop`.
- **Plugins / subagents (Subagents)**: a [documentação oficial](https://code.claude.com/docs/en/sub-agents) descreve como delegar tarefas complexas a agents especializados.

A decisão central é a **separação de responsabilidades**: CLAUDE.md trata de "o que é", Skills de "como fazer", MCP de "aonde conectar" e hooks de "quando impor". Se uma equipe misturar essas camadas — por exemplo, escrever em CLAUDE.md algo que deveria ser feito por MCP — surgirá o vazamento de contexto discutido no curso.

## Feedback e validação: restrições determinísticas + divisão entre humano e máquina

A décima aula ensina que "a validação só é real quando o fluxo completo funciona". Claude Code implementa isso em duas frentes:

**1. Sistema de permissões (restrições determinísticas).** As permissões do Claude Code não "perguntam sobre tudo": são sete modos mais um classificador baseado em ML. Operações de baixo risco são liberadas; as de alto risco são consultadas ou negadas conforme a política — veja os detalhes arquiteturais na [análise do VILA Lab](https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf). Assim, "definir claramente os limites do agent", da sétima aula, torna-se uma imposição do runtime, não um pedido no prompt.

**2. Hooks (prevenção de conclusão prematura).** Um hook `PostToolUse` pode executar verificações obrigatórias depois do uso de uma ferramenta e inserir o resultado de volta no contexto; um hook `Stop` intervém quando o agent declara que terminou. Isso separa "quem faz" de "quem verifica". A [Anthropic observou explicitamente no artigo sobre harness](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) que agents elogiam o próprio trabalho com confiança ("confidently praised their work"). Por isso, hooks injetam verificações **determinísticas**, em vez de confiar na autoavaliação do modelo.

**3. Subagents (isolamento de contexto).** O histórico de conversa de cada subagent fica em um arquivo sidechain separado e **não aumenta o contexto do agent pai** — veja a [análise do VILA Lab](https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf). Isso combina "limites de tarefa" e "isolamento de contexto": ao dividir a tarefa, também se isola a contaminação do contexto.

## Observabilidade e persistência de sessões

Os logs do Claude Code formam um registro completo orientado a anexação (history.jsonl). Comandos explícitos como `/compact`, `/clear` e `/init` permitem gerenciar ativamente o estado do contexto, sem esperar passivamente que ele fique cheio. `/init` transforma "inicializar o agent antes de cada trabalho", da sexta aula, em um comando: segundo a [documentação oficial](https://code.claude.com/docs/en/memory), ele analisa automaticamente a base de código e gera um CLAUDE.md inicial com comandos de build, instruções de teste e convenções de engenharia.

## Mapeamento para o framework do curso

| Subsistema | Implementação no Claude Code | Avaliação |
| --- | --- | --- |
| Instruções | Escopos em camadas (organização/usuário/projeto/local) + memória automática | Memória em camadas como implementação de referência |
| Ferramentas | Quatro tipos de extensão: Skills + MCP + hooks + subagents | Responsabilidades bem definidas; um destaque central |
| Ambiente | Configurações do projeto + settings.json | Depende da autodescrição do usuário em CLAUDE.md |
| Estado | Armazenamento de sessões orientado a anexação + compactação em cinco níveis + resume/fork | Muito robusto; referência para continuidade em tarefas longas |
| Feedback | Classificador de permissões + verificações obrigatórias em hooks PostToolUse | Transforma a prevenção de conclusão prematura em mecanismo determinístico |

## Designs que vale a pena adotar

1. **Organize instruções em camadas de escopo**, em vez de empilhá-las em um único arquivo. CLAUDE.md no nível do diretório é uma implementação elegante de "carregamento próximo ao uso".
2. **Use um funil de compactação em níveis**: primeiro sem perdas, depois com perdas; não comece resumindo tudo.
3. **Use hooks para verificações determinísticas**: evite conclusões prematuras por imposição do runtime, não por pedidos no prompt.
4. **Isole o contexto dos subagents**: ao dividir tarefas, divida também o contexto para que as subtarefas não contaminem o loop principal.
5. **Use armazenamento de sessões orientado a anexação e reproduzível**: a passagem de contexto é garantida pela camada de armazenamento, não pela memória.

## Fontes de referência (originais / código-fonte)

Cada afirmação pode ser rastreada até os textos originais ou o código-fonte abaixo, evitando paráfrases baseadas apenas em lembranças:

- **Documentação oficial do Claude Code · Memory**: contexto novo em cada sessão, quatro escopos de CLAUDE.md, carregamento sob demanda por subdiretório, auto memory (200 linhas / 25KB) e geração de CLAUDE.md com `/init`.<br/>https://code.claude.com/docs/en/memory
- **Documentação oficial do Claude Code · Skills / MCP / Hooks / Sub-agents**: definições dos quatro mecanismos de extensão e eventos PreToolUse / PostToolUse / Stop.<br/>https://code.claude.com/docs/en/skills ｜ https://code.claude.com/docs/en/mcp ｜ https://code.claude.com/docs/en/hooks ｜ https://code.claude.com/docs/en/sub-agents
- **VILA Lab, Dive into Claude Code** (análise de código-fonte): pipeline de compactação em cinco níveis, sete modos de permissão + classificador de ML, subagents sidechain e armazenamento orientado a anexação em history.jsonl.<br/>https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf
- **Anthropic, Effective harnesses for long-running agents**: origem das ideias de que "a confiabilidade vem do harness, não do modelo", de que o agent elogia o próprio trabalho com confiança e de usar hooks para validação.<br/>https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- **Guia Claude Code Full Stack** (comunidade; camadas CLAUDE.md / Skills / MCP / Subagents / Hooks): leitura complementar sobre a separação de responsabilidades entre os mecanismos de extensão.<br/>https://jsmanifest.com/claude-code-full-stack-guide

Material relacionado: [Aula 3 · Transformar o repositório na única fonte da verdade](../../lectures/lecture-03-why-the-repository-must-become-the-system-of-record/) ｜ [Aula 9 · Impedir que o agent declare vitória cedo demais](../../lectures/lecture-09-why-agents-declare-victory-too-early/) ｜ [Aula 10 · A validação só é real quando o fluxo completo funciona](../../lectures/lecture-10-why-end-to-end-testing-changes-results/)
