# Análise do design de harness do Pi

O [Pi](https://pi.dev/) — pacote npm `@earendil-works/pi-coding-agent` — se apresenta como um "minimal agent harness", ou seja, um agent harness minimalista. Vale examinar essa frase: ele não afirma ser "o coding agent mais poderoso" nem "a melhor ferramenta de programação com IA"; sua identidade está firmemente centrada na palavra **harness**.

Neste artigo, usamos o framework dos cinco subsistemas do curso — instruções, ferramentas, ambiente, estado e feedback — para analisar Pi e entender as diferenças fundamentais entre sua filosofia e as de Claude Code e Codex. A resposta, de antemão, é: **a filosofia do Pi é "minimizar o núcleo + tornar as extensões programáveis". Ele leva a engenharia de contexto para além do prompt de sistema e permite que o usuário — ou até o próprio Pi — modifique o harness, em vez de decidir o harness por você.**

## Posicionamento em uma frase

Pi é um núcleo minimalista: seu posicionamento oficial mantém o núcleo deliberadamente pequeno e devolve a você o poder de decisão. Nas palavras da [página inicial do pi.dev](https://pi.dev/): "Ask Pi to build what you want, or install a package that does it your way". Ele divide o harness em quatro camadas personalizáveis:

- **Extensões (Extensions)**: hooks TypeScript ligados aos eventos do ciclo de vida do Pi; a superfície programável no nível do runtime.
- **Skills**: pacotes de capacidade carregados sob demanda, contendo instruções e ferramentas, com divulgação progressiva (progressive disclosure).
- **Templates de prompt (Prompt templates)**: prompts reutilizáveis em Markdown, expandidos ao digitar `/name`.
- **Temas (Themes)**: aparência da TUI.

Essa organização em camadas já é, por si só, um design de harness: **o que o modelo pode ver e quando pode ver é inteiramente controlado por regras e extensões, em vez de ficar fixo no núcleo.**

## Loop central

Como todo coding agent, Pi é essencialmente um loop while de "raciocínio → execução de ferramenta → observação → novo raciocínio". O que merece atenção não é o loop em si, mas o tratamento que Pi dá à sua camada externa: ele amplia o gerenciamento de contexto da "compactação" dentro do loop para o "controle" fora dele.

O runtime do Pi expõe interfaces programáveis. Na seção Programmatic Usage do [README do código-fonte](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md), além da TUI interativa, há modos de impressão/JSON para scripts, protocolo RPC e incorporação via SDK. Assim, o mesmo harness pode ser conduzido passo a passo por uma pessoa ou automaticamente por CI/CD ou outro programa. Isso corresponde ao pré-requisito da décima terceira aula, "engenharia de loops", para passar da condução manual ao loop automatizado: um harness que só pode ser conduzido por interação humana jamais entrará em um loop automático.

## Subsistema de instruções: AGENTS.md e SYSTEM.md

Pi trata "instruções" com moderação, mas sua hierarquia é clara:

- **AGENTS.md**: a seção Project Context Files do [README do código-fonte](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md) especifica a ordem de carregamento: `~/.pi/agent/AGENTS.md` global → percurso ascendente pelos diretórios pais → `./AGENTS.md` do diretório atual, com compatibilidade também com CLAUDE.md. É a aplicação de "o repositório como fonte da verdade": instruções são arquivos, não lembretes na caixa de conversa.
- **SYSTEM.md**: segundo a [documentação oficial do pi.dev](https://pi.dev/docs/usage/project-context), o prompt de sistema padrão pode ser substituído (replace) ou complementado (append) por projeto. Essa é a única entrada oficial para alterar o "prompt de sistema" e também a camada de "autodescrição do ambiente" do Pi.

Pi enfatiza oficialmente que seu prompt de sistema é **minimalista**. Por trás disso há uma escolha explícita: o núcleo não é preenchido com longas regras de "se... então..."; em vez disso, oferece pontos de extensão para que regras apareçam como Skills e extensões somente quando necessárias. Isso corresponde diretamente à quarta aula, "por que um único arquivo gigante de instruções falha". Com "núcleo minimalista + arquivos separados + carregamento sob demanda", Pi evita naturalmente o problema das instruções gigantescas.

## Estado e contexto: onde Pi vai mais longe nos detalhes

A engenharia de contexto do Pi merece atenção especial, pois transforma conceitos do curso como "continuidade de contexto" e "prevenção da degradação do contexto" em mecanismos concretos:

**1. Compactação (Compaction) programável.** Ao se aproximar do limite de contexto, mensagens antigas são automaticamente resumidas. A [documentação oficial do pi.dev](https://pi.dev/docs/usage/sessions) explica que a própria estratégia de compactação é **personalizável**: uma extensão pode implementar compactação por tópico, resumos cientes do código ou até usar outro modelo para resumir. O README do código-fonte também apresenta detalhes do mecanismo padrão: a compactação automática é acionada em duas situações — recuperação após estouro do contexto ou superação do limite de retenção —, preserva aproximadamente os 20 mil tokens mais recentes no ponto de corte e resume as mensagens anteriores como um "context handoff", compactado sucessivamente em cadeia. Portanto, Pi não trata "como compactar" como uma constante imutável, mas como parte do harness.

**2. Contexto dinâmico (Dynamic context).** A [documentação oficial do pi.dev](https://pi.dev/docs/usage/extensions) diz que extensões podem injetar mensagens antes de cada rodada de raciocínio, filtrar o histórico, implementar RAG e construir memória de longo prazo. Isso vai além de "compactar quando o contexto ficar cheio": permite decidir o que entra e o que fica de fora antes mesmo de chegar à janela. Para os conceitos do curso de "tornar observável e depurável a execução do agent" e "manter a continuidade do contexto", Pi transfere ambos para a superfície de extensões.

**3. Árvore de sessões (Session tree).** A [página inicial do pi.dev](https://pi.dev/) afirma que "sessions are stored as trees": com `/tree`, é possível voltar a qualquer ponto do histórico e continuar dali, enquanto todas as ramificações permanecem no mesmo arquivo. Isso resolve a "ruptura de contexto entre sessões", enfatizada repetidamente no curso, não com um resumo forçado, mas por meio da reprodução estruturada do histórico. As ramificações podem ser exportadas como HTML ou enviadas como gist para compartilhamento, resolvendo também a observabilidade.

## Subsistema de ferramentas: Skills e extensões

As "ferramentas" do Pi possuem duas camadas:

- **Skills**: a seção Skills do [README do código-fonte](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md) fornece uma definição clara: "self-contained capability packages that the agent loads on-demand", ou seja, pacotes de capacidade autocontidos, carregados sob demanda, com instruções e ferramentas e compatíveis com o padrão Agent Skills. A divulgação progressiva faz os detalhes de uma Skill entrarem no contexto somente quando ela é ativada, **sem saturar o cache de prompts (prompt cache)**. É um design de harness orientado a custos: cada token adicional no contexto é cobrado a cada inferência; carregar Skills sob demanda é outra forma de dizer "forneça um mapa, não um manual".
- **Extensões (Extensions)**: hooks TypeScript ligados a eventos integrados do ciclo de vida. A seção Hooks do [README do código-fonte](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md) oferece exemplos oficiais: interceptar comandos perigosos como barreira de permissão, criar checkpoints do estado do código ao trocar de tarefa, proteger caminhos — proibindo a escrita em `.env`, por exemplo —, modificar a saída de ferramentas antes de entregá-la ao modelo e injetar mensagens externas, por observação de arquivos/Webhook/CI, para despertar o agent. Essas APIs de hooks também são exportadas por `@mariozechner/pi-coding-agent/hooks`. O harness da comunidade [pi-agent-harness](https://github.com/LabidySabidy/pi-agent-harness) encapsula ainda mais essa superfície em extensões prontas, como skill-router, session-summary, extract-patterns e telemetry.

As extensões são a decisão de design mais importante do Pi: **ele não oferece apenas alguns controles; expõe toda a superfície de eventos interna do runtime.** Quer adicionar memória? Injete-a em `agent/pre-step`. Quer registrar comportamentos? Assine eventos de sessão. Quer alterar a requisição ao modelo? Use um hook em `agent/request`. Você pode fazer o próprio Pi modificar seu harness — algo mais próximo da definição de "harness programável" do que qualquer opção de configuração.

## Feedback e validação: até o "aprendizado" vira harness

Pi não traz uma barreira de testes obrigatória integrada — cabe ao usuário registrar os comandos de validação em AGENTS.md. Porém, o harness da comunidade [pi-agent-harness](https://github.com/LabidySabidy/pi-agent-harness) estrutura o "loop de feedback" por extensões, e a seção Hooks do README oficial fornece uma base semelhante:

- **session-summary** (extensão do pi-agent-harness): mantém entradas contínuas em `PROGRESS.md` — o subsistema de estado do curso para acompanhar o progresso de tarefas longas.
- **extract-patterns** (extensão do pi-agent-harness): coleta nas sessões possíveis lições aprendidas e as consolida em `LESSONS.md` — transformando a "passagem de contexto antes do fim de cada sessão" de convenção em mecanismo.
- **telemetry** (extensão do pi-agent-harness): registra uso de tokens, custos e outros dados — observabilidade.

O mesmo repositório da comunidade confirma ainda mais esse padrão: `VISION.md` (objetivo), `PROGRESS.md` (progresso), `LESSONS.md` (experiências) e `STANDARDS.md` (padrões), todos arquivos Markdown persistidos entre sessões. É exatamente a estratégia recomendada pelo curso — "repositório como fonte da verdade + arquivo de progresso + mecanismo de passagem de contexto" — transformada em uma camada pronta para uso pelas extensões do Pi.

## Mapeamento para o framework do curso

Avaliação do Pi pelos cinco subsistemas do curso — subjetiva, para fins de comparação:

| Subsistema | Implementação no Pi | Avaliação |
| --- | --- | --- |
| Instruções | Carregamento hierárquico de AGENTS.md + SYSTEM.md | Hierarquia clara, mas as regras precisam ser escritas pelo usuário |
| Ferramentas | Skills sob demanda + hooks de extensão em todo o ciclo de vida | Extremamente robusto; transforma o sistema de ferramentas em uma superfície programável |
| Ambiente | Autodescrição via SYSTEM.md; runtime declarado pelo usuário em AGENTS.md | Mecanismo aberto, mas reprodutibilidade depende da descrição do usuário |
| Estado | Árvore de sessões + compactação personalizável + PROGRESS.md | Extremamente robusto; continuidade entre sessões e recuperação são centrais |
| Feedback | Comandos de validação definidos pelo usuário; session-summary / extract-patterns como mecanismos | O mecanismo é fornecido; o conteúdo depende do usuário |

A escolha do Pi contrasta claramente com Claude Code e Codex: Claude Code incorpora "memória, permissões e subagents" ao núcleo, pronto para uso; Codex torna "normas do repositório e isolamento do ambiente" os padrões; Pi escolhe **não decidir nada por você** — transforma o poder de decisão em pontos de extensão. O custo é que você precisa escrever suas próprias extensões ou instalar pacotes criados por terceiros.

## Designs que vale a pena adotar

1. **Torne a estratégia de compactação conectável**. "Como compactar o contexto" não deve ser um parâmetro fixo no harness, mas uma interface de estratégia substituível.
2. **Use uma árvore de sessões no lugar de resumos rígidos**. A recuperação entre sessões não precisa depender de "um resumo da rodada anterior"; a reprodução estruturada do histórico costuma formar um subsistema de estado mais confiável.
3. **Favoreça o cache de prompts**. Carregue Skills sob demanda e não insira todas as regras de uma vez no prompt de sistema: isso é engenharia de contexto e também engenharia de custos.
4. **Permita que o agent modifique seu próprio harness**. Se a superfície de extensão do harness for aberta o bastante, a própria "otimização do comportamento do agent" poderá ser parcialmente automatizada pelo agent.

## Fontes de referência (originais / código-fonte)

Cada afirmação pode ser rastreada até os textos originais ou o código-fonte abaixo, evitando paráfrases baseadas apenas em lembranças:

- **Site oficial pi.dev**: posicionamento "Ask Pi to build what you want, or install a package that does it your way", quatro camadas personalizáveis e árvore de sessões — "sessions are stored as trees", `/tree`, armazenamento em um único arquivo, exportação em HTML e compartilhamento como gist.<br/>https://pi.dev/
- **Documentação oficial pi.dev · Sessions**: compactação conectável — por tópico, ciente de código ou com outro modelo de resumo — e descrição dos mecanismos de compactação automática e injeção dinâmica de contexto.<br/>https://pi.dev/docs/usage/sessions
- **Documentação oficial pi.dev · Extensions**: extensões podem injetar mensagens antes de cada rodada, filtrar o histórico, implementar RAG e construir memória de longo prazo.<br/>https://pi.dev/docs/usage/extensions
- **Documentação oficial pi.dev · Project Context**: semântica replace / append de SYSTEM.md.<br/>https://pi.dev/docs/usage/project-context
- **README do código-fonte do Pi Coding Agent** (badlogic/pi-mono): carregamento de AGENTS.md em três níveis — global → diretórios pais → diretório atual —, condições de ativação de `/compact` e da compactação automática, ponto de corte de 20 mil tokens, Skills sob demanda e padrão Agent Skills, ciclo de vida de Hooks e quatro casos oficiais de uso, Programmatic Usage (JSON / RPC / SDK).<br/>https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md
- **Repositório da comunidade pi-agent-harness**: extensões skill-router / session-summary / extract-patterns / telemetry e sistema de arquivos VISION.md / PROGRESS.md / LESSONS.md / STANDARDS.md.<br/>https://github.com/LabidySabidy/pi-agent-harness

Material relacionado: [Aula 2 · O que exatamente é um Harness](../../lectures/lecture-02-what-a-harness-actually-is/) ｜ [Aula 5 · Manter a continuidade de contexto em tarefas entre sessões](../../lectures/lecture-05-why-long-running-tasks-lose-continuity/) ｜ [Aula 13 · Da condução manual ao loop automatizado](../../lectures/lecture-13-loop-engineering/)
