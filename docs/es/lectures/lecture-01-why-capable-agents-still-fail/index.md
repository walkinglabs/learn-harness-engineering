[中文版本 →](../../../zh/lectures/lecture-01-why-capable-agents-still-fail/)

> Ejemplos de código: [code/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/es/lectures/lecture-01-why-capable-agents-still-fail/code/)
> Proyecto práctico: [Proyecto 01. Solo prompt vs reglas primero](./../../projects/project-01-baseline-vs-minimal-harness/index.md)

# Lección 01. Los modelos fuertes no significan ejecución fiable

Te consideras una persona con experiencia en el mundo de la IA: suscripción a Claude Pro, clave de API de GPT-4o, números del leaderboard de SWE-bench memorizados. Un día por fin entregas un proyecto real a un agente de IA, con mucha confianza. ¿El resultado? Añade una función pero rompe los tests, corrige un bug pero introduce dos más, corre durante 20 minutos y declara con orgullo "terminado"; miras el código y no es lo que pediste.

Tu primer instinto puede ser: "este modelo no es suficientemente bueno, toca actualizar". Espera. Antes de sacar la tarjeta, considera que quizá el problema no sea el modelo.

Veamos algunos números. El 29 de septiembre de 2025, Anthropic reportó Claude Sonnet 4.5 con un [77,2% en SWE-bench Verified](https://www.anthropic.com/news/claude-sonnet-4-5). Y eso en tareas cuidadosamente seleccionadas, con descripciones claras y tests existentes. Si lo llevas a tu entorno diario de desarrollo — requisitos vagos, sin tests existentes, reglas de negocio implícitas por todas partes — ese número solo baja.

Pero detrás de estos números hay una verdad contraintuitiva.

## El mismo caballo, destinos distintos

Anthropic comparó el mismo prompt ("construye un creador de juegos retro 2D") y el mismo modelo (Opus 4.5) con dos harness. Primera ejecución: sin apoyo, sin harness — 20 minutos, 9 dólares; la aplicación abría, pero las entidades no respondían a la entrada. Segunda ejecución: harness completo, con arquitectura de tres agentes planner + generator + evaluator — 6 horas, 200 dólares; se podía mover una entidad, pero la física tenía asperezas y una pared bloqueaba el avance. [El núcleo de la jugabilidad funcionaba; la aplicación no estaba terminada.](https://www.anthropic.com/engineering/harness-design-long-running-apps)

No cambiaron el modelo. Opus 4.5 seguía siendo Opus 4.5. Lo que cambió fue el equipo de monta.

El artículo de OpenAI sobre harness engineering lo dice con claridad: Codex en un repositorio bien harnessed pasa de "poco fiable" a "fiable". Fíjate en el lenguaje: no es "un poco mejor", sino un cambio cualitativo. Como un caballo pura sangre: puedes montarlo sin equipo de monta adecuado, pero no llegarás lejos, no irás rápido y caerte no será una sorpresa. El harness es ese conjunto completo de equipo: **todo lo que existe en la infraestructura de ingeniería fuera de los pesos del modelo.**

## Dónde se atascan realmente los agentes

¿Qué sale mal, exactamente?

Lo más común: nunca definiste la tarea con claridad. Dices "añade una función de búsqueda" y la interpretación del agente puede ser completamente distinta de la tuya: ¿buscar qué?, ¿texto completo o datos estructurados?, ¿paginación?, ¿resaltado? Si no lo especificas, el agente adivina. Si acierta, es suerte; si falla, corregirlo cuesta más que haber sido específico desde el principio. Es como entrar en un restaurante y decirle al chef "quiero pescado": si llega hervido, al vapor o en una olla picante queda al azar.

Incluso cuando especificas la tarea, el proyecto tiene convenciones arquitectónicas implícitas que el agente no conoce. Tu equipo estandarizó SQLAlchemy 2.0, pero el agente escribe código 1.x por defecto. Todos los endpoints deben usar OAuth 2.0, pero esa regla solo vive en tu cabeza y en un mensaje de Slack de hace tres meses. El agente no puede verla. No es que no quiera cumplirla; literalmente no sabe que existe.

El entorno también es una trampa. Entorno de desarrollo incompleto, dependencias faltantes, versiones incorrectas de herramientas. El agente quema una ventana de contexto valiosa en fallos de `pip install` y discrepancias de versión de Node en vez de resolver la tarea real. Es como contratar a un carpintero experto pero olvidar darle martillo, clavos y una mesa nivelada: por muy capaz que sea, no puede trabajar.

Todavía más común: no hay forma de verificar. No hay tests, no hay lint, o los comandos de verificación nunca se comunican al agente. El agente escribe código, lo mira, decide que está bien y dice "terminado". Es como pedir a un estudiante que entregue deberes sin clave de respuestas: cree que acertó, pero al corregir aparecen muchos errores. Anthropic también observó que cuando los agentes sienten que el contexto se agota, se apresuran a terminar, saltan verificación y eligen soluciones simples en vez de óptimas. Lo llaman "context anxiety": lo mismo que ocurre cuando notas que se acaba el tiempo en un examen y empiezas a marcar respuestas al azar.

Las tareas largas que cruzan sesiones son aún peores: los descubrimientos de la sesión anterior se pierden, y cada sesión nueva debe volver a explorar la estructura del proyecto y entender la organización del código. Los agentes sin estado persistente ven cómo la tasa de fallos sube bruscamente en tareas de más de 30 minutos.

## Terminología clave

Con estos escenarios en mente, estos conceptos ya no son jerga:

- **Brecha de capacidad**: la distancia enorme entre el rendimiento del modelo en benchmarks y su rendimiento en tareas reales. Las tareas de benchmark traen descripción del issue, tests y entorno; las tareas reales a menudo exigen que los aportes tú.
- **Harness**: todo lo que está fuera del modelo: instrucciones, herramientas, entorno, gestión de estado y feedback de verificación. Si no son pesos del modelo, es harness. Es el "equipo de monta" del que hablamos.
- **Fallo inducido por harness**: el modelo tiene capacidad suficiente, pero el entorno de ejecución tiene defectos estructurales. La comparación del juego retro de arriba es un ejemplo.
- **Brecha de verificación**: la diferencia entre la confianza del agente en su salida y la corrección real. El agente dice "terminé" cuando no terminó. Es el modo de fallo más común.
- **Bucle diagnóstico**: ejecutar, observar el fallo, atribuirlo a una capa concreta del harness, corregir esa capa y volver a ejecutar. Es la metodología central del harness engineering.
- **Definition of Done**: conjunto de condiciones verificables por máquina: tests pasan, lint limpio, type checks pasan. Sin una definición explícita, el agente inventará la suya.

## Cuando algo falla, arregla primero el harness

Principio central: **cuando algo falla, no cambies primero el modelo; revisa el harness.** Si el mismo modelo funciona en tareas similares y bien estructuradas, asume que es un problema de harness. Es como un coche que se detiene: no sospechas inmediatamente del motor; primero miras si tiene gasolina.

Pasos concretos:

**Atribuye cada fallo a una capa específica.** No digas simplemente "el modelo es malo". Pregunta: ¿la tarea era poco clara?, ¿faltaba contexto?, ¿no había métodos de verificación? Mapea cada fallo a una de las cinco capas: especificación de tarea, provisión de contexto, entorno de ejecución, feedback de verificación y gestión de estado. Estas son capas diagnósticas prácticas, no los seis términos del glosario anterior. Si construyes este hábito, verás cada vez menos "el modelo no es suficiente" en tus registros.

**Escribe una Definition of Done explícita para cada tarea.** No digas "añade búsqueda". Di:
```
Completion criteria:
- New endpoint GET /api/search?q=xxx
- Supports pagination, default 20 items
- Results include highlighted snippets
- All new code passes pytest
- Type checking passes (mypy --strict)
```

**Crea un archivo AGENTS.md.** Ponlo en la raíz del repositorio para decirle al agente el stack técnico, las convenciones arquitectónicas y los comandos de verificación. Es el primer paso del harness engineering y uno de los de mayor retorno. Un solo `AGENTS.md` puede ser más efectivo que actualizar a un modelo más caro; no es broma.

**Construye un bucle diagnóstico.** No trates los fallos como "el modelo volvió a equivocarse". Trátalos como señales de que tu harness tiene un defecto. En cada fallo, identifica la capa, corrígela y evita repetir ese modo de fallo. Tras unas rondas, tu harness se fortalece y el rendimiento del agente se estabiliza. Como reparar carreteras: cada bache que tapas hace más suave el siguiente tramo.

**Cuantifica las mejoras.** Mantén un registro sencillo: si cada tarea tuvo éxito o falló, y qué capa causó el fallo. Después de unas rondas verás cuál capa es el cuello de botella; enfoca ahí tu energía.

## El experimento del millón de líneas

En agosto de 2025, tres ingenieros de OpenAI comenzaron un experimento agresivo: usar Codex para construir un producto interno completo desde un repositorio git vacío. Cinco meses después, [el repositorio tenía alrededor de un millón de líneas de código](https://openai.com/index/harness-engineering/): lógica de aplicación, infraestructura, tooling, documentación y herramientas internas de desarrollo, todo generado por agentes. El equipo después creció a siete ingenieros; en total se fusionaron unas 1.500 PRs, con una media de 3,5 PRs por ingeniero al día.

La restricción clave: **los humanos nunca escriben código directamente.** No era un truco; estaba diseñado para obligar al equipo a descubrir qué cambia cuando el trabajo principal del ingeniero deja de ser escribir código y pasa a ser diseñar entornos, expresar intención y construir bucles de feedback.

El progreso inicial fue más lento de lo esperado. No porque Codex no pudiera, sino porque el entorno no estaba completo: al agente le faltaban herramientas, abstracciones y estructuras internas para avanzar hacia objetivos de alto nivel. El trabajo de los ingenieros se convirtió en descomponer metas grandes en bloques pequeños — diseño, código, revisión, test — dejar que el agente los ensamblara y luego usar esos bloques para desbloquear tareas más complejas. Cuando algo fallaba, la solución casi nunca era "intenta más fuerte"; era "qué capacidad le falta al agente, y cómo la hacemos comprensible y ejecutable".

Este experimento demuestra directamente la tesis central de la lección: **el mismo modelo produce resultados fundamentalmente distintos en un entorno desnudo y en uno con harness completo.** El modelo no cambió. El entorno sí.

> Fuente: [OpenAI: Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)

## Un ejemplo más cotidiano

Un equipo usó Claude Sonnet para añadir un nuevo endpoint a una aplicación web Python mediana (FastAPI + PostgreSQL + Redis, unas 15.000 líneas).

Al principio dieron solo una frase: "añade endpoints de preferencias de usuario bajo `/api/v2/users`". ¿El resultado? El agente pasó buena parte de la sesión explorando la estructura del repo, produjo código que parecía razonable pero no seguía los patrones de manejo de errores del proyecto, usó sintaxis antigua de SQLAlchemy y declaró finalización aunque el endpoint tenía errores en runtime. La siguiente sesión tuvo que repetir todo el descubrimiento.

Más tarde añadieron `AGENTS.md`, con arquitectura del proyecto y versiones del stack, comandos de verificación explícitos (`pytest tests/api/v2/ && python -m mypy src/`) y registros de decisiones arquitectónicas. El mismo modelo entonces siguió las convenciones del proyecto y comprobó su trabajo con comandos que podía ejecutar.

No cambiaron el modelo. Cambiaron el harness.

## Ideas clave

- Capacidad del modelo y fiabilidad de ejecución son cosas distintas. Un pura sangre también necesita buen equipo de monta.
- Cuando algo falla, revisa primero el harness y luego el modelo. Cambiar de modelo es la opción más cara, y muchas veces ni siquiera es un problema del modelo.
- Cada fallo es una señal: tu harness tiene un defecto estructural. Encuéntralo y arréglalo.
- Cinco capas defensivas: especificación de tarea, provisión de contexto, entorno de ejecución, feedback de verificación y gestión de estado. Revísalas de forma sistemática.
- Un solo `AGENTS.md` puede ser más efectivo que actualizar a un modelo más caro. En serio.

## Lecturas adicionales

- [OpenAI: Harness Engineering — Leveraging Codex in an Agent-First World](https://openai.com/index/harness-engineering/)
- [Anthropic: Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [HumanLayer: Skill Issue — Harness Engineering for Coding Agents](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents)
- [SWE-bench Leaderboard](https://www.swebench.com/)
- [Thoughtworks Technology Radar: Harness Engineering](https://www.thoughtworks.com/radar)

## Ejercicios

1. **Experimento comparativo**: elige un codebase que conozcas bien y una modificación no trivial. Primero ejecuta el agente sin soporte de harness y registra fallos. Luego añade un `AGENTS.md` con comandos de verificación explícitos y ejecuta de nuevo con el mismo agente. Compara resultados atribuyendo cada fallo a una de las cinco capas.

2. **Medición de la brecha de verificación**: elige 5 tareas de programación. Después de cada una, registra si el agente afirma haber terminado y verifica la corrección real con tests independientes. Calcula la proporción de veces que el agente dice que terminó cuando en realidad no terminó. Esa es tu brecha de verificación.

3. **Práctica de bucle diagnóstico**: encuentra una tarea donde el agente falle repetidamente en tu proyecto. Ejecuta una vez y registra el fallo. Atribúyelo a una de las cinco capas. Corrige esa capa y ejecuta de nuevo. Repite de tres a cinco rondas, registrando las mejoras.
