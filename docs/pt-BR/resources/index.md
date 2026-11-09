# Biblioteca de Recursos em Português

Esta pasta transforma os métodos do curso em modelos prontos para copiar e referências compactas que você pode usar em um repositório real.

## Quando Usar

Comece por aqui quando quiser que o Codex, Claude Code ou outro agente de codificação trabalhe em várias sessões sem precisar redefinir constantemente a configuração, o status e o escopo.

É especialmente útil quando:

- O trabalho abrange várias sessões
- Os recursos são numerosos e fáceis de serem deixados inacabados
- Os agentes tendem a declarar vitória cedo demais
- As etapas de inicialização precisam ser redescobertas toda vez

## Comece Aqui

Para uma configuração mínima, comece com:

- Instruções de raiz: [`templates/AGENTS.md`](./templates/AGENTS.md) ou [`templates/CLAUDE.md`](./templates/CLAUDE.md)
- Estado dos recursos: [`templates/feature_list.json`](./templates/index.md#feature-list-json)
- Log de progresso: [`templates/claude-progress.md`](./templates/claude-progress.md)
- Referência do script de inicialização (bootstrap): `docs/en/resources/templates/init.sh`

Depois adicione:

- Entrega de sessão (handoff): [`templates/session-handoff.md`](./templates/session-handoff.md)
- Checklist de saída limpa: [`templates/clean-state-checklist.md`](./templates/clean-state-checklist.md)
- Rúbrica do avaliador: [`templates/evaluator-rubric.md`](./templates/evaluator-rubric.md)

Se você deseja a estrutura de repositório mais completa no estilo OpenAI da postagem "Harness engineering", use o pacote avançado:

- [`openai-advanced/index.md`](./openai-advanced/index.md)

## Estrutura da Biblioteca

- [`templates/`](./templates/index.md): modelos para copiar em um repositório real
- [`reference/`](./reference/index.md): notas de método, fluxo de inicialização e mapas de modos de falha
- [`openai-advanced/`](./openai-advanced/index.md): esqueleto de repositório avançado, documentos de sistema de registro e modelos de governança focados em agentes

## Pacote Mínimo Recomendado

- `AGENTS.md` ou `CLAUDE.md`
- `feature_list.json`
- `claude-progress.md`
- `init.sh`

Esses quatro arquivos são suficientes para tornar a maioria dos fluxos de trabalho de agentes visivelmente mais estáveis.

Quando o repositório crescer para um sistema de longa duração com múltiplos domínios, planos ativos, pontuação de qualidade e políticas de confiabilidade, mude para o pacote [`openai-advanced/`](./openai-advanced/index.md) em vez de forçar demais o pacote mínimo.
