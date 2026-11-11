# Análisis del diseño del harness de Pi

[Pi](https://pi.dev/) (paquete npm `@earendil-works/pi-coding-agent`) se define como «minimal agent harness»: un agent harness minimalista. Merece la pena detenerse en estas palabras: no afirma ser «el coding agent más potente» ni «la mejor herramienta de programación con IA», sino que fija su identidad precisamente en el término **harness**.

En este artículo usamos el marco de cinco subsistemas del curso —instrucciones, herramientas, entorno, estado y retroalimentación— para analizar Pi y entender en qué se diferencia fundamentalmente su filosofía de las de Claude Code y Codex. Adelantamos la conclusión: **la filosofía de Pi consiste en «minimizar el núcleo + hacer programables las extensiones», llevar la ingeniería de contexto más allá del system prompt y permitir que el usuario —o incluso el propio Pi— modifique el harness, en lugar de dejar que Pi decida el harness por ti.**

## En una frase

Pi es un núcleo minimalista: su definición oficial reduce deliberadamente el núcleo y te devuelve el poder de decisión. En palabras de la [página principal de pi.dev](https://pi.dev/): «Ask Pi to build what you want, or install a package that does it your way». Divide el harness en cuatro capas personalizables:

- **Extensions**: hooks de TypeScript conectados a los eventos del ciclo de vida de Pi; constituyen la superficie programable del runtime.
- **Skills**: paquetes de capacidades cargados bajo demanda, con instrucciones y herramientas, mediante progressive disclosure.
- **Prompt templates**: prompts reutilizables en Markdown que se despliegan al escribir `/name`.
- **Themes**: la apariencia de la TUI.

Esta organización por capas es en sí misma un diseño de harness: **las reglas y extensiones deciden por completo «qué puede ver el modelo y cuándo puede verlo», en vez de codificarlo de forma rígida en el núcleo.**

## El ciclo esencial

Como todos los coding agents, Pi es esencialmente un ciclo while de «razonamiento → ejecución de herramientas → observación → nuevo razonamiento». Lo interesante no es el ciclo en sí, sino cómo trata Pi su capa exterior: amplía la gestión del contexto desde la «compaction» dentro del ciclo hasta el «control» fuera de él.

El runtime de Pi expone una interfaz programable. El apartado [Programmatic Usage del README del código fuente](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md) ofrece, además de una TUI interactiva, modos programables de impresión y JSON, un protocolo RPC y la integración mediante SDK. Esto permite que un mismo harness sea dirigido paso a paso por una persona o automáticamente por CI/CD u otro programa. Es el requisito previo de «pasar de la conducción manual al ciclo automatizado» de la lección trece: si un harness solo puede ser dirigido mediante interacción humana, nunca podrá entrar en un ciclo automático.

## Subsistema de instrucciones: AGENTS.md y SYSTEM.md

Pi trata las «instrucciones» con moderación, pero con una jerarquía clara:

- **AGENTS.md**: el apartado [Project Context Files del README del código fuente](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md) especifica claramente el orden de carga: `~/.pi/agent/AGENTS.md` global → recorrido ascendente por los directorios padre → `./AGENTS.md` del directorio actual (también es compatible con CLAUDE.md). Así se materializa «el repositorio como fuente de verdad»: las instrucciones son archivos, no recordatorios en el chat.
- **SYSTEM.md**: la [documentación oficial de pi.dev](https://pi.dev/docs/usage/project-context) indica que el system prompt predeterminado puede reemplazarse o ampliarse por proyecto. Esta es la única vía formal que ofrece Pi para modificar el «system prompt», y también su capa de «autodescripción del entorno».

Pi subraya que su propio system prompt es **minimalista**. Detrás hay una decisión explícita: el núcleo no se llena con extensas reglas de «si… entonces…», sino que deja puntos de extensión para que las reglas aparezcan como Skills y Extensions solo cuando sean necesarias. Esto enlaza directamente con la cuarta lección, «Por qué falla un único archivo de instrucciones gigante»: Pi evita de forma natural ese problema mediante «núcleo minimalista + archivos separados + carga bajo demanda».

## Estado y contexto: donde Pi llega más lejos

La ingeniería de contexto de Pi merece especial atención porque convierte conceptos del curso como «continuidad del contexto» y «prevención de la corrupción del contexto» en mecanismos concretos:

**1. Compaction programable.** Cuando se aproxima al límite del contexto, resume automáticamente los mensajes antiguos. La [documentación oficial de pi.dev](https://pi.dev/docs/usage/sessions) explica que la propia estrategia de compaction es **personalizable**: una extensión puede implementar compaction por temas, resúmenes sensibles al código o incluso usar otro modelo para resumir. El README del código fuente también muestra detalles del mecanismo predeterminado: la compaction automática se activa en dos situaciones —recuperación tras desbordamiento del contexto o superación del umbral de conservación—, el punto de corte mantiene aproximadamente los 20 000 tokens más recientes y los mensajes anteriores se resumen como un «context handoff» mediante compaction encadenada por niveles. Pi no considera «cómo hacer compaction» una constante inmutable, sino una parte del harness.

**2. Contexto dinámico (Dynamic context).** La [documentación oficial de pi.dev](https://pi.dev/docs/usage/extensions) explica que las extensiones pueden inyectar mensajes antes de cada ronda de razonamiento, filtrar el historial, implementar RAG y construir memoria a largo plazo. Esto va más allá de «esperar a que el contexto se llene para hacer compaction»: permite decidir qué entra y qué no entra antes de que el contexto llegue a la ventana. En relación con «hacer observable y depurable la ejecución del agent» y «mantener la continuidad del contexto», Pi traslada ambos mecanismos a la superficie de extensiones.

**3. Árbol de sessions (Session tree).** La [página principal de pi.dev](https://pi.dev/) afirma explícitamente que «sessions are stored as trees»: `/tree` permite volver a cualquier nodo histórico y continuar desde él, y todas las ramas se guardan en un único archivo. Así se resuelve el problema, repetido a lo largo del curso, de la «ruptura del contexto entre sessions»: no mediante la unión forzada de resúmenes, sino mediante la reproducción de un historial estructurado. Las ramas se pueden exportar a HTML o subir como gist para compartirlas, lo que también aporta observabilidad.

## Subsistema de herramientas: Skills y Extensions

Las «herramientas» de Pi se dividen en dos capas:

- **Skills**: el apartado [Skills del README del código fuente](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md) las define con precisión como «self-contained capability packages that the agent loads on-demand»: paquetes autónomos de capacidades, con instrucciones y herramientas, que siguen el estándar Agent Skills. Mediante progressive disclosure, los detalles de la Skill solo entran en el contexto cuando se activa, **sin saturar la prompt cache**. Es un diseño de harness orientado al coste: cada token adicional del contexto se paga en cada inferencia; cargar las Skills bajo demanda es otra forma de «dar un mapa, no un manual».
- **Extensions**: hooks de TypeScript conectados a los eventos integrados del ciclo de vida. El apartado [Hooks del README del código fuente](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md) ofrece cuatro usos oficiales de ejemplo: interceptar comandos peligrosos mediante permissions gates, crear un checkpoint del estado del código al cambiar de tarea, proteger rutas —por ejemplo, prohibir escribir en `.env`—, modificar la salida de una herramienta antes de entregarla al modelo e inyectar mensajes desde el exterior —mediante vigilancia de archivos, Webhook o CI— para despertar al agent. Estas API de hooks también se exportan desde `@mariozechner/pi-coding-agent/hooks`. El harness de la comunidad [pi-agent-harness](https://github.com/LabidySabidy/pi-agent-harness) lleva esta superficie aún más lejos y ofrece extensiones listas para usar como skill-router, session-summary, extract-patterns y telemetry.

Las Extensions son la decisión de diseño más importante de Pi: **no se limita a «dar al usuario unos cuantos interruptores», sino que expone toda la superficie de eventos internos del runtime.** ¿Quieres añadir memoria? Inyéctala en `agent/pre-step`. ¿Quieres registrar el comportamiento? Suscríbete a los eventos de session. ¿Quieres modificar la solicitud al modelo? Conecta un hook a `agent/request`. Puedes hacer que Pi modifique su propio harness, algo más cercano a la definición de «harness programable» que cualquier conjunto de opciones de configuración.

## Retroalimentación y verificación: convertir también el «aprendizaje» en harness

Pi no incluye de serie un control de pruebas obligatorio —el usuario debe escribir los comandos de verificación en AGENTS.md—, pero el harness de la comunidad [pi-agent-harness](https://github.com/LabidySabidy/pi-agent-harness) usa Extensions para estructurar el «ciclo de retroalimentación», y el apartado Hooks del README oficial aporta mecanismos similares:

- **session-summary** (extensión de pi-agent-harness): mantiene entradas continuas en `PROGRESS.md`; es el subsistema de estado del curso aplicado al seguimiento del progreso de tareas largas.
- **extract-patterns** (extensión de pi-agent-harness): recopila posibles lecciones aprendidas de las sessions y las consolida en `LESSONS.md`; convierte «dejar listo el handoff antes de que termine cada session» de una convención en un mecanismo.
- **telemetry** (extensión de pi-agent-harness): registra el uso de tokens, el coste y otros datos; es observabilidad.

El mismo repositorio comunitario lleva aún más lejos este patrón: `VISION.md` —objetivo—, `PROGRESS.md` —progreso—, `LESSONS.md` —experiencia— y `STANDARDS.md` —estándares— son archivos Markdown persistentes entre sessions. Es exactamente el patrón recomendado por el curso de «repositorio como fuente de verdad + archivo de progreso + mecanismo de handoff», convertido en una capa lista para usar gracias al sistema de Extensions de Pi.

## Correspondencia con el marco del curso

Evaluación de Pi según los cinco subsistemas del curso —subjetiva y pensada para la comparación—:

| Subsistema | Implementación de Pi | Evaluación |
| --- | --- | --- |
| Instrucciones | Carga jerárquica de AGENTS.md + SYSTEM.md | Jerarquía clara, pero los usuarios deben escribir las reglas |
| Herramientas | Skills bajo demanda + hooks de Extensions para todo el ciclo de vida | Muy potente; convierte el sistema de herramientas en una superficie programable |
| Entorno | SYSTEM.md para la autodescripción del entorno; los usuarios declaran el entorno de ejecución en AGENTS.md | El mecanismo es abierto, pero la reproducibilidad depende de las descripciones escritas por los usuarios |
| Estado | Árbol de sessions + compaction personalizable + PROGRESS.md | Muy potente; la continuidad entre sessions y la recuperabilidad son fundamentales |
| Retroalimentación | Comandos de verificación definidos por el usuario; mecanismos estructurados de session-summary / extract-patterns | Se proporciona el mecanismo; los usuarios aportan el contenido |

La elección de Pi contrasta claramente con Claude Code y Codex: Claude Code integra en el núcleo la «memoria, permissions y subagents» para que funcionen de inmediato; Codex convierte las «convenciones del repositorio y el aislamiento del entorno» en valores predeterminados; Pi opta por **no decidir nada por ti** y convierte cada decisión en un punto de extensión. El precio es que tendrás que escribir tus propias Extensions o instalar paquetes creados por otros.

## Diseños que merece la pena adoptar

1. **Hacer conectable la estrategia de compaction.** En tu harness, «cómo se compacta el contexto» no debería ser un parámetro rígido, sino una interfaz de estrategia reemplazable.
2. **Usar un árbol de sessions en lugar de resúmenes forzados.** La recuperación entre sessions no siempre tiene que depender de «un resumen de la ronda anterior»; reproducir un historial estructurado suele constituir un subsistema de estado más fiable.
3. **Ser compatible con la prompt cache.** Carga las Skills bajo demanda y no introduzcas todas las reglas a la vez en el system prompt: es ingeniería de contexto y también ingeniería de costes.
4. **Permitir que el agent modifique su propio harness.** Si la superficie de extensión del harness es suficientemente abierta, el propio agent puede semi-automatizar la optimización de su comportamiento.

## Fuentes de referencia (texto original / código fuente)

Todas las afirmaciones pueden rastrearse hasta los textos originales o el código fuente siguientes, evitando las descripciones basadas en impresiones:

- **Sitio web de pi.dev**: definición original «Ask Pi to build what you want, or install a package that does it your way», cuatro capas personalizables y árbol de sessions —«sessions are stored as trees», `/tree`, guardado en un solo archivo, exportación a HTML y uso compartido mediante gist—.<br/>https://pi.dev/
- **Documentación oficial de pi.dev · Sessions**: compaction conectable —por temas, sensible al código o con otro modelo de resumen— y descripción del mecanismo de compaction automática e inyección de contexto dinámico.<br/>https://pi.dev/docs/usage/sessions
- **Documentación oficial de pi.dev · Extensions**: las Extensions pueden inyectar mensajes antes de cada ronda de razonamiento, filtrar el historial, implementar RAG y construir memoria a largo plazo.<br/>https://pi.dev/docs/usage/extensions
- **Documentación oficial de pi.dev · Project Context**: semántica de replace y append de SYSTEM.md.<br/>https://pi.dev/docs/usage/project-context
- **README del código fuente de Pi Coding Agent** (badlogic/pi-mono): orden de carga de tres niveles de AGENTS.md —global → directorio padre → directorio actual—, condiciones que activan `/compact` y la compaction automática, punto de corte de 20 000 tokens, carga bajo demanda de Skills y estándar Agent Skills, ciclo de vida de Hooks y cuatro usos oficiales de ejemplo, y Programmatic Usage —JSON / RPC / SDK—.<br/>https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md
- **Repositorio comunitario pi-agent-harness**: Extensions skill-router, session-summary, extract-patterns y telemetry; sistema de archivos VISION.md / PROGRESS.md / LESSONS.md / STANDARDS.md.<br/>https://github.com/LabidySabidy/pi-agent-harness

Lecciones relacionadas: [Lección 02. Qué es realmente un harness](../../lectures/lecture-02-what-a-harness-actually-is/) ｜ [Lección 05. Mantén vivo el contexto entre sesiones](../../lectures/lecture-05-why-long-running-tasks-lose-continuity/) ｜ [Lección 13. De la conducción manual al ciclo automatizado](../../lectures/lecture-13-loop-engineering/)
