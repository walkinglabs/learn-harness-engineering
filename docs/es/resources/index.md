# Biblioteca de recursos en español

Esta carpeta convierte los métodos del curso en plantillas listas para copiar y referencias compactas que puedes usar en un repositorio real.

## Cuándo usarla

Empieza aquí cuando quieras que Codex, Claude Code u otro agente de programación trabaje durante varias sesiones sin tener que redescubrir constantemente el setup, el estado y el alcance.

Es especialmente útil cuando:

- el trabajo abarca varias sesiones
- hay muchas funciones y es fácil dejarlas a medias
- los agentes tienden a declarar victoria demasiado pronto
- los pasos de arranque se redescubren cada vez

## Empieza aquí

Para una configuración mínima, empieza con:

- instrucciones raíz: [`templates/AGENTS.md`](./templates/AGENTS.md) o [`templates/CLAUDE.md`](./templates/CLAUDE.md)
- estado de funciones: [`templates/feature_list.json`](./templates/index.md#feature-list-json)
- registro de progreso: [`templates/claude-progress.md`](./templates/claude-progress.md)
- referencia del script de arranque: `docs/es/resources/templates/init.sh`

Luego añade:

- handoff de sesión: [`templates/session-handoff.md`](./templates/session-handoff.md)
- checklist de salida limpia: [`templates/clean-state-checklist.md`](./templates/clean-state-checklist.md)
- rúbrica de evaluación: [`templates/evaluator-rubric.md`](./templates/evaluator-rubric.md)

Si quieres una estructura de repositorio más completa al estilo OpenAI del artículo "Harness engineering", usa el paquete avanzado:

- [`openai-advanced/index.md`](./openai-advanced/index.md)

## Estructura de la biblioteca

- [`templates/`](./templates/index.md): plantillas para copiar en un repositorio real
- [`reference/`](./reference/index.md): notas de método, flujo de arranque y mapas de modos de fallo
- [`openai-advanced/`](./openai-advanced/index.md): esqueleto avanzado de repositorio, documentos system-of-record y plantillas de gobernanza agent-first

## Paquete mínimo recomendado

- `AGENTS.md` o `CLAUDE.md`
- `feature_list.json`
- `claude-progress.md`
- `init.sh`

Estos cuatro archivos bastan para hacer que la mayoría de los flujos con agentes sean notablemente más estables.

Cuando el repositorio crezca hasta convertirse en un sistema de larga duración con varios dominios, planes activos, puntuación de calidad y políticas de fiabilidad, pasa al paquete [`openai-advanced/`](./openai-advanced/index.md) en lugar de estirar demasiado el paquete mínimo.
