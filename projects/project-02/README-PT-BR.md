# Projeto 02: Workspace Legível por Agentes

Demonstre como a legibilidade do repositório e artefatos explícitos de continuidade reduzem a perda de contexto durante o desenvolvimento em múltiplas sessões.

## Guia de Diretórios

| Diretório | Significado |
|------|------|
| `starter/` | **Ponto de partida**: baseado na solução do P1, com importação de documentos, visualização de detalhes e persistência ainda pendentes de implementação. O harness é fraco: o `AGENTS.md` é mínimo e não existe um handoff de sessão. |
| `solution/` | **Implementação de referência**: todos os novos recursos estão implementados, com documentação completa do workspace (`ARCHITECTURE.md`, `PRODUCT.md`, `session-handoff.md`). |

## Como Usar

Copie `starter/` para dois diretórios de trabalho isolados, não para duas branches. Use uma cópia por vez e arquive seus resultados fora do alcance do próximo agente. Execute `npm install` em cada cópia e use o mesmo agente e o mesmo prompt de tarefa.

1. **Execução de referência:** Mantenha o harness original do starter, incluindo `docs/` e `feature_list.json`, sem criar uma nota de handoff.
2. **Execução aprimorada:** Antes de começar, substitua apenas `AGENTS.md` pelo [`solution/AGENTS.md`](./solution/AGENTS.md). Ao final da Sessão A, peça que o agente escreva seu próprio `session-handoff.md`. Não copie o código, a documentação, a lista de funcionalidades ou a nota de handoff da solução pronta.
3. **Nas duas execuções:** Encerre a Sessão A quando a importação e a exibição do conteúdo completo funcionarem, mas os documentos importados ainda desaparecerem após reiniciar. Inicie uma nova Sessão B dizendo apenas «Continue o trabalho» e implemente a persistência.

Compare o tempo até a primeira alteração significativa na Sessão B, a redescoberta de informações, o retrabalho e a conclusão das funcionalidades. O teste compara as regras do harness e a nota de handoff em conjunto, não a nota isoladamente.

[Protocolo completo e requisitos de entrega](../../docs/pt-BR/projects/project-02-agent-readable-workspace/index.md)

## Contrato Exato da Tarefa

Comece a partir de `starter/`. O starter já contém o shell do Projeto 01 e um
harness mínimo. O trabalho é adicionar o recorte de produto do Projeto 02 e a
documentação do workspace que permite que uma segunda sessão recupere o contexto rapidamente.

| Funcionalidade / artefato | Estado no Starter | Evidência da Solution |
|------|------|------|
| Importação de documentos | O fluxo de importação está incompleto entre renderer, preload, IPC e `DocumentService` | `src/renderer/components/ImportPanel.tsx`, `src/main/ipc-handlers.ts`, `src/services/document-service.ts` |
| Detalhes do documento | O painel de detalhes não carrega nem renderiza o conteúdo completo do arquivo via IPC | `src/renderer/components/DocumentDetail.tsx`, `IPC_CHANNELS.GET_DOCUMENT_CONTENT` |
| Persistência básica | Documentos importados não são totalmente restaurados após reinicialização | `src/services/persistence-service.ts`, tratamento de `documents-meta.json` |
| Estado legível pelo agente | Não existe arquivo final de handoff no starter | `session-handoff.md`, `docs/ARCHITECTURE.md` expandido, `docs/PRODUCT.md` expandido |

## Funcionalidades Cobertas

- Fluxo de importação de documentos (seletor de arquivos mais transferência via IPC)
- Visualização de detalhes do documento (metadados mais exibição do conteúdo)
- Persistência básica (documentos importados permanecem após reinicialização)

## Aulas Relacionadas

- [Aula 03: Por Que o Repositório Deve se Tornar a Fonte Oficial da Verdade](../../docs/pt-BR/lectures/lecture-03-why-the-repository-must-become-the-system-of-record/index.md)
- [Aula 04: Por Que Um Único Arquivo Gigante de Instruções Falha](../../docs/pt-BR/lectures/lecture-04-why-one-giant-instruction-file-fails/index.md)
