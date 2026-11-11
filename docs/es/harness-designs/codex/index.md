# Análisis del diseño del harness de Codex

[Codex](https://openai.com/index/harness-engineering/) de OpenAI quizá sea, de estos cuatro productos, el más ligado a los principios fundamentales del harness: el artículo «Harness Engineering», que dio nombre a todo el campo, resume precisamente la experiencia del equipo de OpenAI al desarrollar un producto con Codex. Por eso, analizar el diseño del harness de Codex equivale en gran medida a analizar las prácticas de ingeniería que hay detrás de ese artículo.

La filosofía de Codex puede resumirse en una frase: **el repositorio es la fuente de verdad (repository as the system of record), AGENTS.md solo es una página de índice y el valor de la ingeniería reside en diseñar el entorno, expresar la intención y construir ciclos de retroalimentación.**

## En una frase

El equipo de OpenAI usó Codex para entregar en pocas semanas un producto que acabó superando el millón de líneas de código, y **Codex escribió cada una de ellas** —consulta la sección «Designing for growth» de [Harness Engineering](https://openai.com/index/harness-engineering/)—. Su experiencia responde a una pregunta: cuando el papel del ingeniero cambia de «escribir código» a «diseñar el harness», ¿cómo debe organizarse el sistema? Codex CLI es un binario monolítico open source implementado en Rust —[github.com/openai/codex](https://github.com/openai/codex)—, pero su contribución al harness reside principalmente en las **convenciones (convention)** y la **ingeniería de contexto**, no en puntos de extensión llamativos.

## Subsistema de instrucciones: AGENTS.md es una página de índice, no una enciclopedia

Esta es la decisión de diseño de Codex que más ha influido en la teoría del harness:

> Un único archivo de instrucciones gigante dificulta las comprobaciones mecánicas —cobertura, estado de actualización, propiedad y enlaces cruzados—, por lo que es inevitable que se aleje de la realidad. Dejamos de considerar AGENTS.md una enciclopedia y pasamos a tratarlo como una **página de índice**. El conocimiento del codebase reside en documentación estructurada y AGENTS.md apunta hacia ella.

(Lo anterior es una paráfrasis directa de la sección «AGENTS.md should be a directory page» del texto original [Harness Engineering](https://openai.com/index/harness-engineering/).)

La cuarta lección explica que «un único archivo de instrucciones gigante falla», y Codex ofrece una respuesta directa: mantener AGENTS.md en unas 100 líneas —el artículo original recomienda alrededor de 100; al acercarse al límite, dividirlo en `docs/`—, y trasladar lo que no quepa al directorio `docs/` para que el agent lo lea bajo demanda. Es la fuente autorizada de «dar un mapa, no un manual».

El principio complementario es **imponer invariantes sin microgestionar la implementación** —en el original: «don't micromanage the implementation; focus on invariants»—. AGENTS.md solo contiene restricciones estrictas que no pueden violarse y comandos de verificación; el modelo decide cómo implementar los detalles. Se corresponde directamente con «restringir, no microgestionar» de la segunda lección.

## Subsistema de contexto: Write-Select-Compress-Isolate

La ingeniería de contexto de Codex puede resumirse en cuatro estrategias. Es el marco que la comunidad articuló al consolidarse «context engineering» como disciplina y que posteriormente aplicó a Codex —consulta [Context Engineering for Codex CLI](https://codex.danielvaughan.com/2026/06/10/context-engineering-codex-cli-write-select-compress-isolate-june-2026/)—:

- **Write (escribir fuera)**: persistir el contexto fuera de la ventana; escribir las conclusiones en documentos y el estado en archivos, en vez de dejarlos en la conversación. Se corresponde con «el repositorio como fuente de verdad».
- **Select (seleccionar hacia dentro)**: introducir en la ventana solo los tokens necesarios; AGENTS.md indica el camino y los archivos se leen bajo demanda, en lugar de insertar todo el repositorio.
- **Compress (comprimir)**: conservar lo verdaderamente importante. Codex ofrece compaction automática y `/compact` manual, y permite personalizar `compact_prompt` —consulta [Context Engineering for Codex CLI](https://codex.danielvaughan.com/2026/06/10/context-engineering-codex-cli-write-select-compress-isolate-june-2026/)—.
- **Isolate (aislar)**: dividir el contexto según diferentes límites. Los subagents aíslan el contexto de distintas tareas; un subagent de frontend nunca ve el schema de la base de datos del backend.

Codex incluye además un diseño muy preciso para el contexto del entorno: el análisis del código fuente de la comunidad [codex-harness-internals](https://github.com/AlexKenbo/codex-harness-internals) muestra que `build_environment_update_item` solo emite los **campos modificados** —CWD, rama git y sistema de archivos— cuando cambia el entorno, en vez de pegar en cada ronda todo el contexto del sistema. Es un detalle de ingeniería que evita «alimentar el contexto con tokens repetidos».

## Herramientas y límites: aislamiento mediante worktree + subagents

Codex tiene dos mecanismos esenciales de harness:

**1. Aislamiento del entorno mediante git worktree.** La sección «Environment» del texto original [Harness Engineering](https://openai.com/index/harness-engineering/) explica que cada tarea se ejecuta en un git worktree independiente, acompañado de un stack local de observabilidad —logs, métricas y trazas—, para verificar cada cambio en un entorno aislado. Es la implementación física de «definir claramente los límites de cada tarea del agent» de la séptima lección: el límite no se establece mediante una petición en las instrucciones, sino que lo impone el aislamiento del entorno. El subsistema de entorno se convierte aquí en un aislamiento estricto.

**2. Subagents en el núcleo.** `spawn_agent` y `wait_agent` son herramientas del núcleo de Codex: el modelo crea explícitamente subagents, les asigna un historial de session y un conjunto de herramientas independientes, y espera sus resultados. Los subagents heredan las instrucciones AGENTS.md del padre, pero se ejecutan en **su propio contexto**. La configuración reside en `.codex/agents/*.toml` y puede indicar modelos e instrucciones distintos —consulta la sección Sub-agents de [Context Engineering for Codex CLI](https://codex.danielvaughan.com/2026/06/10/context-engineering-codex-cli-write-select-compress-isolate-june-2026/)—. Es una implementación directa del «aislamiento del contexto» y también del espíritu del «handoff» de la duodécima lección: cada subagent es una unidad de trabajo con límites claros.

## Subsistema de retroalimentación: comandos de verificación dentro de las normas

Una de las ideas más destacadas de la práctica de OpenAI es incluir explícitamente los comandos de verificación en AGENTS.md y convertir «cómo confirmar que está bien» en parte del repositorio. En el proceso de ingeniería de Codex, el testing, CI, la documentación y la configuración de observabilidad son generados por Codex y constituyen «rutas de verificación ejecutables». La respuesta a que los modelos capaces no sean fiables no consiste en esperar que el modelo actúe correctamente por voluntad propia, sino en hacer que **la ruta de verificación sea un componente predeterminado del harness**.

Las approval policies y plan mode llevan la retroalimentación en otra dirección: antes de ejecutar una operación de alto riesgo, se presenta un plan y se solicita aprobación, incorporando los «límites de la tarea» y el «poder de decisión humano» al control del runtime.

## Correspondencia con el marco del curso

| Subsistema | Implementación de Codex | Evaluación |
| --- | --- | --- |
| Instrucciones | AGENTS.md como página de índice + división en docs/ + invariantes impuestos | De manual; define «dar el mapa, no el manual» |
| Herramientas | Aislamiento mediante worktree + subagents con spawn_agent | Límites sólidos impuestos mediante el aislamiento del entorno |
| Entorno | Worktrees independientes + stack de observabilidad | El aislamiento mediante worktree es su seña distintiva |
| Estado | Estrategia Write (el estado se escribe en archivos/documentación) | Depende de convenciones en lugar de memoria integrada |
| Retroalimentación | Comandos de verificación en la especificación + approval policies + plan mode | Convierte las rutas de retroalimentación en la opción predeterminada; merece la pena adoptarlo |

La comparación entre Codex y Claude Code es interesante: Claude Code aplica la «adición», integrando en el núcleo memoria, permissions y subagents; Codex aplica la «sustracción», mantiene el núcleo lo más contenido posible y deposita más responsabilidad en las convenciones del repositorio y la ingeniería de contexto. Por eso la comunidad suele decir que «la filosofía del harness de Codex vale más que su código».

## Diseños que merece la pena adoptar

1. **Escribir AGENTS.md como página de índice**: mantenerlo en unas 100 líneas, apuntar a los detalles de docs/ y permitir comprobaciones mecánicas.
2. **Escribir solo invariantes, sin microgestionar la implementación**: restricciones estrictas + comandos de verificación; dejar el resto al modelo.
3. **Usar worktree para aislar el entorno**: imponer los límites de la tarea mediante el entorno, no mediante peticiones en las instrucciones.
4. **Transmitir solo los cambios del contexto del entorno**: emitir en cada ronda únicamente los campos modificados, sin pegar repetidamente todo el contexto del sistema.
5. **Usar subagents para aislar el contexto**: dividir el contexto al dividir la tarea para que las subtareas no contaminen el ciclo principal.

## Fuentes de referencia (texto original / código fuente)

Todas las afirmaciones pueden rastrearse hasta los textos originales o el código fuente siguientes, evitando las descripciones basadas en impresiones:

- **OpenAI «Harness Engineering»**: página de índice AGENTS.md y recomendación de unas 100 líneas, executive invariants / don't micromanage, aislamiento mediante worktree + stack de observabilidad, comandos de verificación dentro de las normas, caso del producto de más de un millón de líneas, approval policies y plan mode. Es la fuente principal de todas las afirmaciones esenciales de este artículo.<br/>https://openai.com/index/harness-engineering/
- **Especificación oficial de OpenAI «AGENTS.md»** (AGENTS.md como estándar de convenciones entre herramientas):<br/>https://openai.com/index/agents-md/
- **Repositorio open source de Codex CLI** (binario monolítico implementado en Rust):<br/>https://github.com/openai/codex
- **Context Engineering for Codex CLI** (comunidad): marco Write-Select-Compress-Isolate, `/compact` y `compact_prompt`, subagents `spawn_agent` / `wait_agent` y configuración `.codex/agents/*.toml`.<br/>https://codex.danielvaughan.com/2026/06/10/context-engineering-codex-cli-write-select-compress-isolate-june-2026/
- **codex-harness-internals** (análisis comunitario del código fuente): detalles de implementación como el contexto incremental del entorno en `build_environment_update_item`.<br/>https://github.com/AlexKenbo/codex-harness-internals

Lecciones relacionadas: [Lección 03. Convierte el repositorio en la única fuente de verdad](../../lectures/lecture-03-why-the-repository-must-become-the-system-of-record/) ｜ [Lección 04. Divide las instrucciones entre archivos](../../lectures/lecture-04-why-one-giant-instruction-file-fails/) ｜ [Lección 07. Define claramente los límites de cada tarea del agent](../../lectures/lecture-07-why-agents-overreach-and-under-finish/)
