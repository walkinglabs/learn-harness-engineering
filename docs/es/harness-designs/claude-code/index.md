# Análisis del diseño del harness de Claude Code

Anthropic afirma explícitamente en «[Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)» que la fiabilidad procede del harness, no del modelo, y que el agent necesita restricciones «fuera del modelo». Claude Code es la materialización de esta idea, y la propia Anthropic lo clasifica directamente como un **agentic harness**. No es lenguaje de marketing: Claude Code quizá sea el harness con el análisis público más exhaustivo hasta la fecha. Su código fuente es público, los informes de investigación de la comunidad son detallados y casi todos los mecanismos esenciales de las lecciones —memoria por capas, compaction del contexto, permissions, hooks, subagents y persistencia de sessions— cuentan con una implementación completa como producto.

En este artículo analizamos Claude Code mediante el marco de cinco subsistemas del curso, prestando especial atención a cómo materializa conceptos fundamentales del harness como la «gestión del contexto», la «prevención de declaraciones prematuras de finalización» y las «restricciones deterministas».

## En una frase

El núcleo de Claude Code es un sencillo ciclo while: invocar el modelo, ejecutar herramientas, observar los resultados y volver a invocar el modelo. Sin embargo, **la inmensa mayoría del código no está en ese ciclo, sino en el sistema que lo rodea**: el sistema de permissions, la pipeline de compaction del contexto, los mecanismos de extensión, la orquestación de subagents y el almacenamiento de sessions. Esta es la esencia del harness: el ciclo es el esqueleto; todo lo que lo rodea determina la fiabilidad.

## Subsistema de instrucciones: un sistema de memoria por capas

El sistema de memoria de Claude Code es su contribución más directa a la teoría del harness y se corresponde con las lecciones «el repositorio como fuente de verdad» y «continuidad del contexto entre sessions». La documentación oficial, [How Claude remembers your project](https://code.claude.com/docs/en/memory), explica claramente que cada session empieza con una ventana de contexto nueva y que el conocimiento se transfiere entre sessions mediante dos mecanismos: los archivos CLAUDE.md —instrucciones escritas por ti— y auto memory —notas escritas por Claude—.

En cuanto al alcance, la documentación oficial divide los archivos CLAUDE.md en cuatro categorías, desde la más amplia hasta la más específica según el orden de carga:

- **Política de organización**: gestionada de forma centralizada por IT/DevOps —por ejemplo, `/etc/claude-code/CLAUDE.md`— para las normas de toda la empresa.
- **Nivel de usuario `~/.claude/CLAUDE.md`**: preferencias y reglas personales comunes a distintos proyectos.
- **Nivel de proyecto `./CLAUDE.md` o `./.claude/CLAUDE.md`**: fuente de verdad del proyecto —estructura de ingeniería, stack tecnológico y comandos de verificación— compartida con el repositorio.
- **Nivel local `./CLAUDE.local.md`**: preferencias personales dentro de un proyecto, normalmente incluidas en `.gitignore` y no enviadas al repositorio.

Además, existen otros dos mecanismos:

- **Carga bajo demanda por subdirectorio**: los CLAUDE.md de los subdirectorios no se cargan al arrancar, sino que entran en el contexto cuando Claude lee un archivo de ese directorio.
- **Auto memory**: Claude toma notas activamente a partir de tus correcciones y preferencias; se comparte por repositorio, funciona entre worktree y cada session carga como máximo las primeras 200 líneas o 25 KB.

Estos cuatro alcances forman una **jerarquía de instrucciones**: la documentación oficial explica que «las instrucciones más específicas entran más tarde en el contexto» —las instrucciones del proyecto aparecen después de las del usuario—. Su valor reside en no obligar al modelo a procesar un enorme archivo de instrucciones al comienzo de cada conversación, sino cargar la información cercana según su alcance. Es la respuesta de producto a la cuarta lección, «Por qué falla un único archivo de instrucciones gigante».

## Subsistema de contexto: pipeline de compaction de cinco niveles

Claude Code gestiona el contexto mediante una **pipeline de compaction de cinco niveles** (five-layer compaction pipeline), no con un simple «resumen cuando se llena». Este detalle arquitectónico procede del análisis del código fuente de [Dive into Claude Code, de VILA Lab](https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf). La quinta lección explica que «las tareas largas pierden continuidad»; Claude Code responde mediante un embudo de varios niveles: primero aplica poda sin pérdida —elimina resultados redundantes de herramientas—, después realiza una extracción estructurada y solo al final recurre a un resumen con pérdida mediante un LLM, acompañado de un mecanismo de circuit breaker que evita una compaction excesiva.

Esto se combina con el diseño del almacenamiento de sessions: **almacenamiento de sessions orientado a append (append-oriented storage)**. Todo el historial se añade a `history.jsonl`, y `/resume` permite recuperarlo y crear ramas mediante fork. Así se garantiza «preparar el handoff antes de que termine cada session», no gracias a una buena memoria, sino porque la capa de almacenamiento es append-only y reproducible.

## Subsistema de herramientas: cuatro mecanismos de extensión

Claude Code divide la superficie de extensión en cuatro categorías, cada una destinada a un tipo de problema. Es una de las partes de su diseño que más merece la pena adoptar:

- **Skills**: la [documentación oficial](https://code.claude.com/docs/en/skills) las define como conocimiento procedimental descrito por `SKILL.md`, cargado automáticamente mediante palabras de activación y progressive disclosure. Son adecuadas para el conocimiento especializado sobre «cómo hacer algo».
- **MCP**: el protocolo JSON-RPC de la [documentación oficial](https://code.claude.com/docs/en/mcp) conecta sistemas externos; es la interfaz estándar que permite que «las manos del modelo alcancen el mundo exterior».
- **Hooks**: la [documentación oficial](https://code.claude.com/docs/en/hooks) los define como scripts deterministas conectados a eventos del ciclo de vida como `PreToolUse`, `PostToolUse` y `Stop`.
- **Plugins / Subagents**: la [documentación oficial](https://code.claude.com/docs/en/sub-agents) permite delegar tareas complejas en agents especializados.

La decisión esencial es la **separación de responsabilidades**: CLAUDE.md gestiona «qué es», las Skills «cómo hacerlo», MCP «a qué conectarse» y los Hooks «cuándo imponerlo». Si un equipo mezcla estas capas —por ejemplo, escribe en CLAUDE.md aquello que debería hacer MCP—, aparece la fuga de contexto descrita en el curso.

## Retroalimentación y verificación: restricciones deterministas + división del trabajo humano-agent

La décima lección explica que «solo completar el flujo de extremo a extremo constituye una verificación real». Claude Code implementa un mecanismo de doble vía:

**1. Sistema de permissions (restricciones deterministas).** Las permissions de Claude Code no consisten en «preguntarlo todo», sino en siete modos y un clasificador basado en ML: las operaciones de bajo riesgo se permiten, mientras que las de alto riesgo se consultan o rechazan según la política —consulta los detalles arquitectónicos en el [análisis de VILA Lab](https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf)—. Así, «definir claramente los límites del agent» —séptima lección— se convierte en una imposición del runtime en vez de una petición escrita en el prompt.

**2. Hooks (prevención de declaraciones prematuras de finalización).** Un hook `PostToolUse` puede ejecutar comprobaciones obligatorias tras usar una herramienta y escribir el resultado en el contexto; un hook `Stop` interviene cuando el agent declara que ha terminado. Así se separa «quien trabaja» de «quien comprueba»: [Anthropic observó explícitamente en su artículo sobre harness](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) que los agents elogiaban con seguridad su propio trabajo —«confidently praised their work»—, por lo que los hooks inyectan comprobaciones **deterministas** en lugar de confiar en la autoevaluación del modelo.

**3. Subagents (aislamiento del contexto).** El historial de conversación de cada subagent se guarda en un archivo sidechain independiente y **no amplía el contexto del agent padre** —consulta el [análisis de VILA Lab](https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf)—. Es la combinación de «límites de la tarea» y «aislamiento del contexto»: al mismo tiempo que se divide la tarea, también se aísla la contaminación del contexto.

## Observabilidad y persistencia de sessions

Los logs de Claude Code son registros completos append-only en history.jsonl. Junto con comandos explícitos como `/compact`, `/clear` y `/init`, permiten gestionar activamente el estado del contexto en vez de esperar pasivamente a que se llene. `/init` convierte «inicializar el agent antes de cada trabajo» —sexta lección— en un comando: según la [documentación oficial](https://code.claude.com/docs/en/memory), analiza automáticamente el codebase y genera un CLAUDE.md inicial con comandos de build, instrucciones de testing y convenciones de ingeniería.

## Correspondencia con el marco del curso

| Subsistema | Implementación de Claude Code | Evaluación |
| --- | --- | --- |
| Instrucciones | Ámbitos por capas (organización/usuario/proyecto/local) + auto memory | La memoria por capas es la implementación de referencia |
| Herramientas | Cuatro tipos de extensión: Skills + MCP + hooks + subagents | La separación clara de responsabilidades es una fortaleza esencial |
| Entorno | Ajustes dentro del proyecto + settings.json | Depende de que los usuarios describan el entorno en CLAUDE.md |
| Estado | Almacenamiento append-only de sessions + compaction de cinco niveles + resume/fork | Muy potente; una implementación de referencia para la continuidad de tareas largas |
| Retroalimentación | Clasificador de permissions + comprobaciones obligatorias mediante hooks PostToolUse | Convierte la «prevención de declaraciones prematuras de finalización» en un mecanismo determinista |

## Diseños que merece la pena adoptar

1. **Organizar las instrucciones por alcance** en lugar de amontonarlas en un único archivo. Los CLAUDE.md por directorio son una implementación elegante de «cargar desde el lugar más cercano».
2. **Usar un embudo de compaction por niveles**: primero sin pérdida y después con pérdida; no empezar resumiendo todo el texto.
3. **Usar hooks para comprobaciones deterministas**: evitar las declaraciones prematuras de finalización depende de una imposición del runtime, no de una petición en el prompt.
4. **Aislar el contexto de los subagents**: dividir el contexto al dividir la tarea para que los resultados de las subtareas no contaminen el ciclo principal.
5. **Almacenar las sessions mediante append + reproducción**: el handoff no depende de la memoria, sino de las garantías de la capa de almacenamiento.

## Fuentes de referencia (texto original / código fuente)

Todas las afirmaciones pueden rastrearse hasta los textos originales o el código fuente siguientes, evitando las descripciones basadas en impresiones:

- **Documentación oficial de Claude Code · Memory**: contexto nuevo en cada session, cuatro alcances de CLAUDE.md, carga bajo demanda por subdirectorio, auto memory —200 líneas / 25 KB— y generación de CLAUDE.md mediante `/init`.<br/>https://code.claude.com/docs/en/memory
- **Documentación oficial de Claude Code · Skills / MCP / Hooks / Sub-agents**: definición de los cuatro mecanismos de extensión y sus eventos —PreToolUse / PostToolUse / Stop—.<br/>https://code.claude.com/docs/en/skills ｜ https://code.claude.com/docs/en/mcp ｜ https://code.claude.com/docs/en/hooks ｜ https://code.claude.com/docs/en/sub-agents
- **VILA Lab «Dive into Claude Code»** (informe de análisis del código fuente): pipeline de compaction de cinco niveles, siete modos de permissions + clasificador ML, subagents sidechain y almacenamiento append-only de sessions en history.jsonl.<br/>https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf
- **Anthropic «Effective harnesses for long-running agents»**: fuente de las ideas de que «la fiabilidad procede del harness, no del modelo», que los agents elogian con seguridad su propio trabajo y que deben usarse hooks para la verificación.<br/>https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- **Guía Claude Code Full Stack** (comunidad; capas CLAUDE.md / Skills / MCP / Subagents / Hooks): lectura complementaria sobre la separación de responsabilidades entre mecanismos de extensión.<br/>https://jsmanifest.com/claude-code-full-stack-guide

Lecciones relacionadas: [Lección 03. Convierte el repositorio en la única fuente de verdad](../../lectures/lecture-03-why-the-repository-must-become-the-system-of-record/) ｜ [Lección 09. Evita que el agent declare la victoria demasiado pronto](../../lectures/lecture-09-why-agents-declare-victory-too-early/) ｜ [Lección 10. Solo el flujo completo constituye una verificación real](../../lectures/lecture-10-why-end-to-end-testing-changes-results/)
