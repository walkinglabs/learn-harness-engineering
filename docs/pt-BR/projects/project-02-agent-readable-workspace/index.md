[中文版本 →](../../../zh/projects/project-02-agent-readable-workspace/)

> Aulas relacionadas: [Aula 03. Faça do repositório sua única fonte de verdade.](./../../lectures/lecture-03-why-the-repository-must-become-the-system-of-record/index.md) · [Aula 04. Dividir instruções entre arquivos.](./../../lectures/lecture-04-why-one-giant-instruction-file-fails/index.md)
> Arquivos de template: [templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/pt-BR/resources/templates/)

# Projeto 02. Torne o Projeto Legível e Continue de Onde Você Parou

## O Que Você Vai Fazer

Adicione “legibilidade” ao repositório para que um novo agente consiga entender rapidamente a estrutura do projeto, identificar o progresso atual e continuar o trabalho. Especificamente: implemente importação de documentos, visualização de detalhes do documento e persistência local, concluindo tudo ao longo de duas sessões.

Faça duas rodadas com o mesmo código inicial de `starter/`. Na primeira, mantenha o harness enxuto, sem `session-handoff.md`. Na segunda, use o `AGENTS.md` de `solution/` e gere o arquivo de passagem de contexto ao final da sessão A. Em ambas, a segunda sessão retoma o trabalho da primeira. O protocolo mantém iguais o código, o prompt, o agente e o ponto de parada para comparar o conjunto das regras e da passagem de contexto.

## Ferramentas

- Claude Code ou Codex
- Git
- Node.js + Electron
- Editor de texto (para escrever a documentação)

## Mecanismo do Harness

Workspace legível por agentes + arquivos persistentes de estado

## Utilize o Projeto Versionado

Caminho do repositório: [`projects/project-02/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02)

| Diretório | O que contém | O que comparar |
|------|------|------|
| [`starter/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/starter) | Código do Projeto 01 com importação de documentos, visualização de detalhes e persistência ainda incompletos. A documentação existe, mas é intencionalmente mais enxuta, e não há `session-handoff.md`. | Quanto trabalho de redescoberta uma segunda sessão do agente precisa realizar. |
| [`solution/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/solution) | O mesmo recorte concluído, com documentação expandida em [`projects/project-02/solution/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/solution) (além de [`feature_list.json`](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/solution/feature_list.json) e [`session-handoff.md`](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/solution/session-handoff.md)). | Apenas para consulta: na segunda rodada, use daqui somente `AGENTS.md`, não o código concluído nem os resultados. |

As funcionalidades do produto são: importação de documentos, carregamento completo de detalhes/conteúdo do documento e persistência após reiniciar o aplicativo. A funcionalidade do harness é o workspace legível para handoff.

## Protocolo de execução

Só o harness muda entre as rodadas. A sessão A cobre a importação e a visualização de detalhes; a sessão B, a persistência. Consulte o [README do projeto](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/README.md).

1. Prepare dois diretórios de trabalho isolados, por exemplo `p02-baseline/` e `p02-improved/`. Faça as duas sessões de uma rodada, arquive os resultados e retire o diretório antes de começar a outra. Não use branches do Git para isolar as rodadas: um agente pode acessar outras branches ou diretórios vizinhos e encontrar os arquivos da outra rodada.
2. Copie o [mesmo `starter/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/starter) para os dois diretórios. Ele deriva da solução do Projeto 01, cujas funcionalidades já passam nas verificações. Em `feature_list.json`, as três do Projeto 02 estão como `not-started`. Se preferir partir do seu próprio Projeto 01, copie a mesma versão nos dois diretórios.
3. Use o mesmo prompt nas duas rodadas: «Implemente a importação de documentos por um seletor de arquivos, uma visualização de detalhes que carregue todo o conteúdo e a persistência dos documentos importados após reiniciar o aplicativo.»
4. Não copie `solution/docs/`, `solution/feature_list.json` nem `solution/session-handoff.md`: eles descrevem a implementação pronta ou marcam tudo como `pass`. Mantenha intactos no início das duas rodadas `starter/docs/ARCHITECTURE.md`, `starter/docs/PRODUCT.md` e o `feature_list.json` de `starter/`.

### Primeira rodada (harness enxuto)

Em `p02-baseline/`, mantenha o `AGENTS.md` curto, `docs/` e `feature_list.json` do starter. Não apague esses arquivos nem crie `session-handoff.md`.

**Sessão A:**

1. Inicie o agente com o prompt da tarefa.
2. Encerre a sessão quando você conseguir abrir o aplicativo, importar um `.txt` ou `.md` pelo seletor, vê-lo na lista e abrir o conteúdo completo, mas ainda perder o documento ao reiniciar. Use o mesmo critério na segunda rodada.
3. Não solicite uma nota de passagem de contexto nem outro resumo.

**Sessão B:**

1. Abra uma sessão nova do agente no mesmo diretório e diga apenas «Continue o trabalho.»
2. Registre o tempo até a primeira alteração de código significativa e cada redescoberta de informações da sessão A, como arquitetura, comandos ou funcionalidades pendentes.

### Segunda rodada (harness reforçado)

Em `p02-improved/`, antes da sessão A, substitua `AGENTS.md` por [`solution/AGENTS.md`](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/solution/AGENTS.md). Não altere mais nada no ponto de partida. O arquivo acrescenta regras de início, hierarquia e atualização da documentação, critérios de conclusão com evidências em `feature_list.json` e regras de passagem de contexto. Esta rodada mede o harness completo, não o efeito isolado da nota. Para isolar esse efeito, faça uma terceira rodada com o `AGENTS.md` do starter e apenas a seção de passagem de contexto.

**Sessão A:**

1. Inicie o agente com o mesmo prompt.
2. Encerre a implementação no mesmo ponto: importação e detalhes funcionando, persistência pendente.
3. Antes de encerrar a sessão, peça ao agente que escreva `session-handoff.md` na raiz do repositório seguindo o [modelo de passagem de contexto](./../../resources/templates/session-handoff.md): o que foi verificado, o que mudou, o que está quebrado ou não verificado e qual é o próximo passo. [`solution/session-handoff.md`](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/solution/session-handoff.md) descreve um projeto concluído; use como referência, sem copiar.

**Sessão B:**

1. Abra uma sessão nova do agente no mesmo diretório e diga apenas «Continue o trabalho.» A instrução de ler `session-handoff.md` vem de `AGENTS.md`, não do prompt.
2. Registre as mesmas medidas da primeira rodada.

## Como medir os resultados

| Métrica | Descrição |
|------|------|
| Tempo de retomada na sessão B | Do início até a primeira alteração de código significativa |
| Redescobertas | Vezes em que o agente reaprende arquitetura, comandos ou estado já conhecidos |
| Qualidade da passagem de contexto | Se a nota é completa, precisa e permite agir (apenas na segunda rodada) |
| Retrabalho | Quanto do que já foi concluído em A é refeito em B |
| Conclusão final | Se as três funcionalidades estão prontas ao final |

## O que entregar

- Logs ou transcrições das sessões A e B com o harness enxuto.
- Os mesmos registros para o harness reforçado, mais o `AGENTS.md` usado e o `session-handoff.md` escrito pelo agente.
- Uma nota comparando a velocidade de retomada e a qualidade da recuperação de contexto.
