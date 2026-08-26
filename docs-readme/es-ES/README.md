<p align="center">
  <a href="../../README.md"><img alt="English" src="https://img.shields.io/badge/EN-English-blue?style=flat-square"></a>
  <a href="../zh-CN/README.md"><img alt="简体中文" src="https://img.shields.io/badge/ZH-简体中文-red?style=flat-square"></a>
  <a href="../zh-TW/README.md"><img alt="繁體中文" src="https://img.shields.io/badge/ZH--TW-繁體中文-orange?style=flat-square"></a>
  <a href="../ja-JP/README.md"><img alt="日本語" src="https://img.shields.io/badge/JA-日本語-green?style=flat-square"></a>
  <a href="../ko-KR/README.md"><img alt="한국어" src="https://img.shields.io/badge/KO-한국어-blueviolet?style=flat-square"></a>
  <a href="../es-ES/README.md"><img alt="Español" src="https://img.shields.io/badge/ES-Español-yellow?style=flat-square"></a>
  <a href="../fr-FR/README.md"><img alt="Français" src="https://img.shields.io/badge/FR-Français-007EC6?style=flat-square"></a>
  <a href="../ru-RU/README.md"><img alt="Русский" src="https://img.shields.io/badge/RU-Русский-informational?style=flat-square"></a>
  <a href="../de-DE/README.md"><img alt="Deutsch" src="https://img.shields.io/badge/DE-Deutsch-2EA043?style=flat-square"></a>
  <a href="../ar-SA/README.md"><img alt="العربية" src="https://img.shields.io/badge/AR-العربية-success?style=flat-square"></a>
  <a href="../vi-VN/README.md"><img alt="Tiếng Việt" src="https://img.shields.io/badge/VI-Tiếng_Việt-cc6699?style=flat-square"></a>
  <a href="../uz-UZ/README.md"><img alt="Oʻzbekcha" src="https://img.shields.io/badge/UZ-Oʻzbekcha-1A8BBA?style=flat-square"></a>
  <a href="../tr-TR/README.md"><img alt="Türkçe" src="https://img.shields.io/badge/TR-Türkçe-E30A17?style=flat-square"></a>
  <a href="../pt-BR/README.md"><img alt="Português-BR" src="https://img.shields.io/badge/PT--BR-Português-1A8BBA?style=flat-square"></a>
  <a href="../uk-UA/README.md"><img alt="Українська" src="https://img.shields.io/badge/UK-Українська-0057B7?style=flat-square"></a>
</p>

# Learn Harness Engineering

> **Un curso basado en proyectos sobre cómo construir el entorno, la gestión de estado, la verificación y los mecanismos de control que hacen que los agentes de codificación de IA funcionen de forma fiable.**

Learn Harness Engineering es un curso dedicado a la ingeniería de agentes de codificación de IA. Hemos estudiado y sintetizado en profundidad las teorías y prácticas más avanzadas de Harness Engineering en la industria. Nuestras referencias principales incluyen:

> **🆕 Actualización de agosto de 2026: Análisis de los harness más avanzados** — nueva sección con 4 análisis:
>
> - **Nueva sección** [Análisis de los harness más avanzados](../../docs/es/harness-designs/index.md) — aplica el marco de cinco subsistemas del curso (instrucciones, herramientas, entorno, estado y retroalimentación) para desentrañar mediante ingeniería inversa cómo cuatro productos de vanguardia construyen harness reales.
> - **Pi** [Cómo Pi construye su harness](../../docs/es/harness-designs/pi/index.md) — un núcleo minimalista, extensiones programables y la ingeniería de contexto detrás de «pide a Pi que construya lo que quieras».
> - **Claude Code** [Cómo Claude Code construye su harness](../../docs/es/harness-designs/claude-code/index.md) — memoria de cuatro capas, compaction de cinco niveles, hooks y aislamiento de sub-agentes.
> - **Codex** [Cómo Codex construye su harness](../../docs/es/harness-designs/codex/index.md) — el repositorio como fuente de verdad, AGENTS.md como página de índice y aislamiento mediante worktree.
> - **DeepSeek** [Cómo DeepSeek construye su harness](../../docs/es/harness-designs/deepseek/index.md) — «todo es un plugin», puntos de separación entre capacidades y una pipeline de eventos.
> - **Los 15 idiomas** — cobertura completa de traducción en todos los idiomas compatibles.
>
> **Idea clave:** El curso te ofrece un marco; estos análisis muestran cómo esos mismos principios se aplican realmente en harness de producción.
>
> **🆕 Actualización de agosto de 2026: Ingeniería de Grafos (Graph Engineering)** — 1 clase nueva + 1 proyecto nuevo:
>
> - **Lección 14** [De los Loops Únicos a la Ingeniería de Grafos](../../docs/es/lectures/lecture-14-graph-engineering/index.md): por qué un loop único inevitablemente se convierte en un grafo — las cuatro capas apiladas (prompt → context → loop → graph) y el lugar del harness en ellas, las cuatro piezas del grafo (nodos, aristas, estado compartido, routing), por qué los checkpoints dentro de un loop no salvan los tres fallos estructurales a escala (Goodhart, ceguera hacia arriba, conflicto), los seis pasos independientes del framework para construir tu primer grafo, la diferencia entre Grafo y Workflow, las anclas, el estado actual de los proyectos open source anteriores vs. posteriores al concepto, el impuesto de orquestación, y cuándo realmente vale la pena dibujar un grafo.
> - **Proyecto 08** [Dibuja tu flujo de trabajo como un grafo](../../docs/es/projects/project-08-graph-engineering-first-graph/index.md): tres experimentos progresivos — dibujar el loop maker-checker como un grafo explícito, añadir nodos paralelos de fan-out/fan-in, y añadir aristas de retroceso condicionales y un nodo de aprobación humana.
>
> **Idea clave:** Un loop es un grafo con un solo nodo. Cuando la tarea necesita especialización, paralelismo, estado compartido, verificación y recuperación — deja de ser un loop y se convierte en un grafo.
>
> **🆕 Actualización de julio de 2026: Ingeniería de Loops (Loop Engineering)** — 1 clase nueva + 1 proyecto nuevo + plantillas de código:
>
> - **Lección 13** [Del Prompting Manual a los Loops Autónomos](../../docs/es/lectures/lecture-13-loop-engineering/index.md): de `/goal` a los seis primitivos del loop engineering (Automations, Worktrees, Skills, Connectors, Sub-agentes, Estado Externo), la separación Generador/Evaluador, los cuatro costes silenciosos, y la construcción paso a paso de tu primer loop.
> - **Proyecto 07** [Construye Tu Primer Loop Automatizado](../../docs/es/projects/project-07-loop-engineering-first-loop/index.md): tres experimentos progresivos — loop de objetivo, loop de temporizador, loop maker-checker. Comparar manual vs. automatizado, medir la reducción de intervención, aprender a salir del loop.
> - **Plantillas de código**: `goal-template.md`, `loop-state-template.md`, `maker-prompt.md`, `checker-prompt.md` — plantillas listas para usar para construir loops.
>
> **Idea clave:** La ingeniería de harness construye el vehículo. La ingeniería de loops diseña la carretera por la que circula — y tú diseñas esa carretera desde fuera del vehículo.

- [OpenAI: Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)
- [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Anthropic: Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [Awesome Harness Engineering](https://github.com/walkinglabs/awesome-harness-engineering)

> **Inicio rápido?** La skill [`skills/harness-creator/`](../../skills/harness-creator/) puede ayudarte a generar un harness de nivel productivo (AGENTS.md, listas de funcionalidades, init.sh, flujos de verificación) para tu propio proyecto en cuestión de minutos.

---

## Tabla de Contenidos

- [Vista Previa Visual](#vista-previa-visual)
- [Lo que realmente significa Harness Engineering](#lo-que-realmente-significa-harness-engineering)
- [Inicio Rápido: Mejora tu agente hoy mismo](#inicio-rápido-mejora-tu-agente-hoy-mismo)
- [Proyecto Final: Una aplicación real](#proyecto-final-una-aplicación-real)
- [Ruta de Aprendizaje](#ruta-de-aprendizaje)
- [Programa de Estudios](#programa-de-estudios)
- [Skills](#skills)
- [Otros Cursos](#otros-cursos)

---

## Vista Previa Visual

### Pagina de Inicio del Curso
> Un esquema completo del curso e introducción a las filosofías centrales, que proporciona una ruta clara para comenzar.

![Vista previa de la página de inicio](../../docs/public/screenshots/readme/zh-home.png)

### Clases Inmersivas
> Análisis profundo de problemas reales y proyectos prácticos (como el Proyecto 01) para una experiencia de aprendizaje inmersiva.

![Vista previa de las clases](../../docs/public/screenshots/readme/zh-lecture-01.png)

### Biblioteca de Recursos Listos para Usar
> Plantillas y configuraciones de referencia diseñadas para resolver problemas comunes en el desarrollo de agentes de IA de múltiples turnos, como la pérdida de contexto y la finalización prematura de tareas.

![Vista previa de la biblioteca de recursos](../../docs/public/screenshots/readme/zh-resources.png)

## Libros de Curso en PDF

El repositorio ahora incluye un pipeline de construcción en PDF para el contenido del curso.

- Ejecuta `npm run pdf:build` para generar los PDFs en inglés y chino localmente.
- Los archivos de salida se escriben en `artifacts/pdfs/`.
- Ejecuta `npm run screenshots:readme` si deseas actualizar las imágenes de vista previa del README.
- El workflow de GitHub Actions [`release-course-pdfs.yml`](../../.github/workflows/release-course-pdfs.yml) puede construir los PDFs y publicarlos en GitHub Releases.

---

## El modelo es inteligente, el harness lo hace fiable

Hay una verdad difícil que la mayoría de las personas aprenden por las malas: **el modelo más potente del mundo seguirá fallando en tareas de ingeniería reales si no construyes un entorno adecuado a su alrededor.**

Probablemente ya lo hayas visto. Le das una tarea a Claude o GPT en tu repositorio. Comienza bien: lee archivos, escribe código, parece productivo. Luego algo sale mal. Omite un paso. Rompe un test. Dice "listo" pero nada funciona realmente. Pasas más tiempo arreglando las cosas que si lo hubieras hecho tú mismo.

Esto no es un problema del modelo. Es un problema del harness.

La evidencia es clara. Anthropic realizó un experimento controlado: mismo modelo (Opus 4.5), mismo prompt ("construye un editor de juegos retro 2D"). Sin un harness, gastó $9 en 20 minutos y produjo algo que no funcionaba. Con un harness completo (planificador + generador + evaluador), gastó $200 en 6 horas y construyó un juego que realmente se podía jugar. El modelo no cambió. El harness sí.

OpenAI reportó lo mismo con Codex: en un repositorio bien equipado con un harness, el mismo modelo pasa de "poco fiable" a "fiable". No una mejora marginal, sino un cambio cualitativo.

**Este curso te enseña cómo construir ese entorno.**

```text
                    EL PATRÓN DEL HARNESS
                    =====================

    Tú --> das tarea --> Agente lee archivos del harness --> Agente ejecuta
                                                                  |
                                                        el harness gobierna cada paso:
                                                        |
                                                        +--> Instrucciones: qué hacer, en qué orden
                                                        +--> Alcance:       una funcionalidad a la vez, sin excederse
                                                        +--> Estado:        registro de progreso, lista de funcionalidades, historial git
                                                        +--> Verificación:  tests, lint, verificación de tipos, pruebas de humo
                                                        +--> Ciclo de vida: inicio al arrancar, estado limpio al finalizar
                                                        |
                                                        v
                                                   El agente se detiene solo cuando
                                                   la verificación pasa
```

---

## Lo que realmente significa Harness Engineering

Harness Engineering se trata de construir un entorno de trabajo completo alrededor del modelo para que produzca resultados fiables. No se trata de escribir mejores prompts. Se trata de diseñar el sistema dentro del cual opera el modelo.

Un harness tiene cinco subsistemas:

```text
    ┌─────────────────────────────────────────────────────────────────┐
    │                        EL HARNESS                               │
    │                                                                 │
    │   ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
    │   │ Instrucciones │  │   Estado     │  │   Verificación       │ │
    │   │              │  │              │  │                      │ │
    │   │ AGENTS.md    │  │ progress.md  │  │ tests + lint         │ │
    │   │ CLAUDE.md    │  │ feature_list │  │ verif. de tipos      │ │
    │   │ feature_list │  │ git log      │  │ pruebas de humo      │ │
    │   │ docs/        │  │ handoff ses. │  │ pipeline e2e         │ │
    │   └──────────────┘  └──────────────┘  └──────────────────────┘ │
    │                                                                 │
    │   ┌──────────────┐  ┌──────────────────────────────────────┐   │
    │   │   Alcance    │  │       Ciclo de Vida de Sesión        │   │
    │   │              │  │                                      │   │
    │   │ una func.    │  │ init.sh al inicio                    │   │
    │   │ a la vez    │  │ checklist de estado limpio al final   │   │
    │   │ definición   │  │ nota de entrega para sig. sesión     │   │
    │   │ de hecho     │  │ commit solo cuando es seguro reanudar│   │
    │   └──────────────┘  └──────────────────────────────────────┘   │
    │                                                                 │
    └─────────────────────────────────────────────────────────────────┘

    El MODELO decide qué código escribir.
    El HARNESS gobierna cuándo, dónde y cómo lo escribe.
    El harness no hace al modelo más inteligente.
    Hace que la salida del modelo sea fiable.
```

Cada subsistema tiene una única responsabilidad:

- **Instructions** — Le dicen al agente qué hacer, en qué orden y qué leer antes de comenzar. No un archivo gigante; una estructura de divulgación progresiva que el agente navega según lo necesite.
- **State** — Rastrea qué se ha hecho, qué está en progreso y qué sigue. Se persiste en disco para que la siguiente sesión continúe exactamente donde la anterior se quedó.
- **Verification** — Solo un conjunto de tests que pasan cuenta como evidencia. El agente no puede declarar victoria sin pruebas ejecutables.
- **Scope** — Limita al agente a una funcionalidad a la vez. Sin excederse. Sin dejar tres cosas a medias. Sin reescribir la lista de funcionalidades para ocultar trabajo inacabado.
- **Session Lifecycle** — Inicializar al inicio. Limpiar al final. Dejar una ruta de reinicio limpia para la siguiente sesión.

---

## Por qué existe este curso

La pregunta no es "pueden los modelos escribir código?" Pueden. La pregunta es: **pueden completar de forma fiable tareas de ingeniería reales dentro de repositorios reales, a lo largo de múltiples sesiones, sin supervisión humana constante?**

En este momento, la respuesta es: no sin un harness.

```text
    SIN HARNESS                              CON HARNESS
    ===========                              ===========

    Sesión 1: agente escribe código          Sesión 1: agente lee instrucciones
              agente rompe tests                      agente ejecuta init.sh
              agente dice "listo"                     agente trabaja en una funcionalidad
              tú lo arreglas manualmente              agente verifica antes de decir "listo"
                                                       agente actualiza registro de progreso
    Sesión 2: agente empieza de cero                  agente hace commit de estado limpio
              agente no tiene memoria
              de lo que pasó antes             Sesión 2: agente lee registro de progreso
              agente rehace el trabajo                 agente continúa exactamente donde lo dejó
              o hace algo totalmente distinto          agente sigue con la funcionalidad pendiente
              tú lo arreglas otra vez                  tú revisas, no rescatas

    Resultado: pasas más tiempo               Resultado: el agente hace el trabajo,
            arreglando que si lo                       tú verificas el resultado
            hubieras hecho tú mismo
```

Las preguntas que realmente importan en este curso:

- Qué diseños de harness mejoran las tasas de completitud de tareas?
- Qué diseños reducen el retrabajo y las completaciones incorrectas?
- Qué mecanismos mantienen las tareas de larga duración progresando de manera constante?
- Qué estructuras mantienen el sistema mantenible después de múltiples ejecuciones del agente?

---

## Plan de Estudios y Documentación del Curso

Para ver todos los materiales del curso, visita el **[Sitio de Documentación](https://walkinglabs.github.io/learn-harness-engineering/)**.

El plan de estudios se divide en tres partes:

1. **Clases**: 14 unidades conceptuales que explican la teoría detrás de Harness Engineering.
2. **Proyectos**: 8 proyectos prácticos donde construyes un espacio de trabajo para agentes desde cero.
3. **Biblioteca de Recursos**: Plantillas listas para copiar (`AGENTS.md`, `feature_list.json`, `init.sh`, etc.) para usar en tus propios repositorios hoy mismo.

---

## Inicio Rápido: Mejora tu agente hoy mismo

No necesitas leer las 14 clases antes de empezar a obtener valor. Si ya estás usando un agente de codificación en un proyecto real, aquí tienes cómo mejorarlo ahora mismo.

La idea es simple: en lugar de solo escribir prompts, dale a tu agente un conjunto de archivos estructurados que definan qué hacer, qué se ha hecho y cómo verificar el trabajo. Estos archivos viven dentro de tu repositorio, así que cada sesión comienza desde el mismo estado.

```text
    RAÍZ DE TU PROYECTO
    ├── AGENTS.md              <-- el manual de operación del agente
    ├── CLAUDE.md              <-- (alternativa, si usas Claude Code)
    ├── init.sh                <-- ejecuta install + verify + start
    ├── feature_list.json      <-- qué funcionalidades existen, cuáles están listas
    ├── claude-progress.md     <-- qué pasó en cada sesión
    └── src/                   <-- tu código real
```

Obtén las plantillas iniciales de la [Biblioteca de Recursos](https://walkinglabs.github.io/learn-harness-engineering/en/resources/) y colócalas en tu proyecto. Eso es todo. Cuatro archivos, y tus sesiones de agente ya serán significativamente más estables que ejecutándolas solo con prompts.

---

## Proyecto Final: Una aplicación real

Los ocho proyectos del curso giran en torno al mismo producto: **una aplicación de escritorio de base de conocimiento personal basada en Electron**.

```text
    ┌─────────────────────────────────────────────────────┐
    │          App de Escritorio Base de Conocimiento     │
    │                                                     │
    │  ┌──────────────┐  ┌──────────────────────────────┐│
    │  │ Lista de     │  │    Panel de Preguntas y      ││
    │  │ Documentos   │  │    Respuestas                ││
    │  │              │  │                              ││
    │  │ doc-001.md   │  │  P: Qué es harness eng?     ││
    │  │ doc-002.md   │  │  R: El entorno construido    ││
    │  │ doc-003.md   │  │     alrededor de un agente...││
    │  │ ...          │  │     [cita: doc-002.md]       ││
    │  └──────────────┘  └──────────────────────────────┘│
    │                                                     │
    │  ┌─────────────────────────────────────────────────┐│
    │  │ Barra de estado: 42 docs | 38 indexados | últ. 3m│
    │  └─────────────────────────────────────────────────┘│
    └─────────────────────────────────────────────────────┘

    Funcionalidades principales:
    ├── Importar documentos locales
    ├── Gestionar una biblioteca de documentos
    ├── Procesar e indexar documentos
    ├── Ejecutar P&R con IA sobre el contenido importado
    └── Devolver respuestas fundamentadas con citas
```

Este proyecto fue elegido porque combina un fuerte valor práctico, suficiente complejidad de producto del mundo real y un buen entorno para observar mejoras antes y después del harness.

El starter/solution de cada proyecto del curso es una copia completa de esta aplicación Electron en esa etapa evolutiva. El starter de P(N+1) se deriva de la solution de P(N) — la aplicación evoluciona a medida que crecen tus habilidades de harness.

---

## Ruta de Aprendizaje

El curso está diseñado para realizarse en orden. Cada fase se construye sobre la anterior.

```text
    Fase 1: VER EL PROBLEMA               Fase 2: ESTRUCTURAR EL REPO
    =========================              ==========================

    L01  Modelos potentes ≠ ejecución     L03  Repositorio como única
         fiable                                  fuente de verdad
    L02  Qué significa realmente harness
                                       L04  Dividir instrucciones en
         |                                   archivos, no un archivo gigante
         v
    P01  Solo prompts vs.                       |
         comparación con reglas primero          v
                                               P02  Espacio de trabajo legible
                                                    por el agente


    Fase 3: CONECTAR SESIONES             Fase 4: RETROALIMENTACIÓN Y ALCANCE
    ==========================           ====================================

    L05  Mantener el contexto vivo        L07  Dibujar límites claros de tarea
         entre sesiones
                                       L08  Listas de funcionalidades como
    L06  Inicializar antes de cada              primitivas del harness
         sesión del agente
                                               |
         |                                     v
         v                                     P04  Retroalimentación en tiempo de
    P03  Continuidad multi-sesión                   ejecución para corregir el agente


    Fase 5: VERIFICACIÓN                  Fase 6: PONERLO TODO JUNTO
    =====================                 ============================

    L09  Evitar que los agentes           L11  Hacer observable el runtime
         declaren victoria pronto              del agente

    L10  Ejecución completa del           L12  Entrega limpia al final de
         pipeline = verificación real          cada sesión

         |                                     |
         v                                     v
    P05  El agente verifica su            P06  Construir un harness completo
         propio trabajo                          (proyecto final)

    Fase 7: AUTOMATIZA EL LOOP
    ==========================
    L13  Deja de hacerle prompting a tu agente —
         diseña loops en su lugar
         |
         v
    P07  Construye tu primer loop automatizado
         (loop de objetivo, loop de temporizador,
          maker-checker)

    Fase 8: ESTRUCTURA EL SISTEMA
    =============================
    L14  Dibuja el sistema como un grafo —
         nodos, aristas, estado compartido, routing
         |
         v
    P08  Dibuja tu flujo de trabajo como un grafo
         (grafo explícito, fan-out/fan-in paralelo,
          aristas de retroceso, humano en el circuito)
```

Cada fase toma aproximadamente una semana si lo haces a tiempo parcial. Si quieres ir más rápido, las fases 1-3 se pueden completar en un fin de semana largo.

---

## Programa de Estudios

### Clases — 14 unidades conceptuales, cada una respondiendo una pregunta central

*Lee el texto completo de cada clase en el [Sitio de Documentación](https://walkinglabs.github.io/learn-harness-engineering/).*

| Sesión | Pregunta | Idea Central |
|---------|----------|--------------|
| [L01](../../docs/es/lectures/lecture-01-why-capable-agents-still-fail/index.md) | Por qué los modelos potentes siguen fallando en tareas reales? | La brecha de capacidad entre benchmarks e ingeniería real |
| [L02](../../docs/es/lectures/lecture-02-what-a-harness-actually-is/index.md) | Qué significa realmente "harness"? | Cinco subsistemas: instrucciones, estado, verificación, alcance, ciclo de vida |
| [L03](../../docs/es/lectures/lecture-03-why-the-repository-must-become-the-system-of-record/index.md) | Por qué el repositorio debe ser la única fuente de verdad? | Si el agente no puede verlo, no existe |
| [L04](../../docs/es/lectures/lecture-04-why-one-giant-instruction-file-fails/index.md) | Por qué falla un único archivo de instrucciones gigante? | Divulgación progresiva: da un mapa, no una enciclopedia |
| [L05](../../docs/es/lectures/lecture-05-why-long-running-tasks-lose-continuity/index.md) | Por qué las tareas de larga duración pierden continuidad? | Persistir el progreso en disco; continuar donde lo dejaste |
| [L06](../../docs/es/lectures/lecture-06-why-initialization-needs-its-own-phase/index.md) | Por qué la inicialización necesita su propia fase? | Verificar que el entorno está saludable antes de que el agente comience a trabajar |
| [L07](../../docs/es/lectures/lecture-07-why-agents-overreach-and-under-finish/index.md) | Por qué los agentes se exceden y no terminan? | Una funcionalidad a la vez; definición explícita de "hecho" |
| [L08](../../docs/es/lectures/lecture-08-why-feature-lists-are-harness-primitives/index.md) | Por qué las listas de funcionalidades son primitivas del harness? | Límites de alcance legibles por máquina que el agente no puede ignorar |
| [L09](../../docs/es/lectures/lecture-09-why-agents-declare-victory-too-early/index.md) | Por qué los agentes declaran victoria demasiado pronto? | Brechas de verificación: confianza ≠ corrección |
| [L10](../../docs/es/lectures/lecture-10-why-end-to-end-testing-changes-results/index.md) | Por qué las pruebas de extremo a extremo cambian los resultados? | Solo una ejecución completa del pipeline cuenta como verificación real |
| [L11](../../docs/es/lectures/lecture-11-why-observability-belongs-inside-the-harness/index.md) | Por qué la observabilidad pertenece dentro del harness? | Si no puedes ver lo que el agente hizo, no puedes arreglar lo que rompió |
| [L12](../../docs/es/lectures/lecture-12-why-every-session-must-leave-a-clean-state/index.md) | Por qué cada sesión debe dejar un estado limpio? | El éxito de la siguiente sesión depende de la limpieza de esta sesión |
| [L13](../../docs/es/lectures/lecture-13-loop-engineering/index.md) | Por qué necesitas dejar de hacerle prompting a tu agente personalmente? | Del prompting manual a los loops autónomos: loop de objetivo, loop de temporizador, separación maker-checker |
| [L14](../../docs/es/lectures/lecture-14-graph-engineering/index.md) | Por qué un loop único evoluciona hacia un grafo? | De los loops únicos a la ingeniería de grafos: nodos, aristas, estado compartido, routing, y cuándo realmente vale la pena dibujar un grafo |

### Proyectos — 8 proyectos prácticos aplicando los métodos de las clases a la misma aplicación Electron

| Proyecto | Lo que haces | Mecanismo del Harness |
|----------|--------------|----------------------|
| [P01](../../docs/es/projects/project-01-baseline-vs-minimal-harness/index.md) | Ejecutar la misma tarea dos veces: solo con prompts vs. con reglas primero | Harness mínimo: AGENTS.md + init.sh + feature_list.json |
| [P02](../../docs/es/projects/project-02-agent-readable-workspace/index.md) | Reestructurar el repositorio para que el agente pueda leerlo | Espacio de trabajo legible por el agente + archivos de estado persistentes |
| [P03](../../docs/es/projects/project-03-multi-session-continuity/index.md) | Hacer que el agente continúe desde donde se quedó | Registro de progreso + transferencia de sesión + continuidad multi-sesión |
| [P04](../../docs/es/projects/project-04-incremental-indexing/index.md) | Evitar que el agente haga demasiado o muy poco | Retroalimentación en tiempo de ejecución + control de alcance + indexación incremental |
| [P05](../../docs/es/projects/project-05-grounded-qa-verification/index.md) | Hacer que el agente verifique su propio trabajo | Auto-verificación + Q&A fundamentado + completación basada en evidencia |
| [P06](../../docs/es/projects/project-06-runtime-observability-and-debugging/index.md) | Construir un harness completo desde cero (proyecto final) | Harness completo: todos los mecanismos + observabilidad + estudio de ablación |
| [P07](../../docs/es/projects/project-07-loop-engineering-first-loop/index.md) | Construye tu primer loop automatizado | Loop de objetivo, loop de temporizador, separación maker-checker, gestión del estado del loop |
| [P08](../../docs/es/projects/project-08-graph-engineering-first-graph/index.md) | Dibuja tu flujo de trabajo como un grafo | Nodos/aristas/estado/routing explícitos, fan-out/fan-in paralelo, aristas de retroceso, aprobación con humano en el circuito |

```text
    EVOLUCIÓN DEL PROYECTO
    ======================

    P01  Solo prompts vs. reglas primero   Tú ves el problema
     |
     v
    P02  Espacio de trabajo legible        Tú reestructuras el repo
         por el agente
     |
     v
    P03  Continuidad multi-sesión          Tú conectas las sesiones
     |
     v
    P04  Retroalimentación y alcance       Tú agregas ciclos de
         en tiempo de ejecución            retroalimentación
     |
     v
    P05  Auto-verificación                 Tú haces que el agente
                                              se verifique a sí mismo
     |
     v
    P06  Harness completo (proyecto final) Tú construyes el sistema completo
     |
     v
    P07  Tu primer loop automatizado        Tú sales del loop
     |
     v
    P08  Dibuja tu flujo de trabajo        Tú dibujas el sistema
         como un grafo                     como un grafo

    La solución de cada proyecto se convierte en el starter del siguiente.
    La app evoluciona. Tus habilidades de harness crecen con ella.
```

### Biblioteca de Recursos

- [English](https://walkinglabs.github.io/learn-harness-engineering/en/resources/) — templates, checklists, and method references
- [简体中文](https://walkinglabs.github.io/learn-harness-engineering/zh/resources/) — 中文模板、清单和方法参考
- [繁體中文](https://walkinglabs.github.io/learn-harness-engineering/zh-TW/resources/) — 繁體中文範本、清單和方法參考
- [日本語](https://walkinglabs.github.io/learn-harness-engineering/ja/resources/) — テンプレート、チェックリスト、方法リファレンス
- [한국어](https://walkinglabs.github.io/learn-harness-engineering/ko/resources/) — 템플릿, 체크리스트, 방법 참고 자료
- [Español](https://walkinglabs.github.io/learn-harness-engineering/es/resources/) — plantillas, listas de verificación y referencias
- [Français](https://walkinglabs.github.io/learn-harness-engineering/fr/resources/) — modèles, listes de contrôle et références
- [Русский](https://walkinglabs.github.io/learn-harness-engineering/ru/resources/) — шаблоны, чек-листы и справочники
- [Deutsch](https://walkinglabs.github.io/learn-harness-engineering/de/resources/) — Vorlagen, Checklisten und Referenzen
- [العربية](https://walkinglabs.github.io/learn-harness-engineering/ar/resources/) — قوالب، قوائم تحقق ومراجع
- [Tiếng Việt](https://walkinglabs.github.io/learn-harness-engineering/vi/resources/) — mẫu, danh sách kiểm tra và tài liệu tham khảo
- [Oʻzbekcha](https://walkinglabs.github.io/learn-harness-engineering/uz/resources/) — andozalar, tekshiruv roʻyxatlari va maʼlumotnomalar
- [Türkçe](https://walkinglabs.github.io/learn-harness-engineering/tr/resources/) — şablonlar, kontrol listeleri ve referanslar
- [Português (BR)](https://walkinglabs.github.io/learn-harness-engineering/pt-BR/resources/) — modelos, listas de verificação e referências de métodos

---

## El Ciclo de Vida de la Sesión del Agente

Una de las ideas centrales de este curso: **la sesión del agente debe seguir un ciclo de vida estructurado, no un libre intercambio.** Así es como se ve:

```text
    CICLO DE VIDA DE LA SESIÓN DEL AGENTE
    =====================================

    ┌──────────────────────────────────────────────────────────────────┐
    │  INICIO                                                         │
    │                                                                  │
    │  1. Agente lee AGENTS.md / CLAUDE.md                            │
    │  2. Agente ejecuta init.sh (install, verify, health check)      │
    │  3. Agente lee claude-progress.md (qué pasó la última vez)      │
    │  4. Agente lee feature_list.json (qué está listo, qué sigue)    │
    │  5. Agente revisa git log (cambios recientes)                   │
    │                                                                  │
    │  SELECCIONAR                                                     │
    │                                                                  │
    │  6. Agente elige exactamente UNA funcionalidad pendiente        │
    │  7. Agente trabaja solo en esa funcionalidad                    │
    │                                                                  │
    │  EJECUTAR                                                        │
    │                                                                  │
    │  8. Agente implementa la funcionalidad                          │
    │  9. Agente ejecuta verificación (tests, lint, verif. de tipos)  │
    │  10. Si la verificación falla: corregir y volver a ejecutar     │
    │  11. Si la verificación pasa: registrar evidencia               │
    │                                                                  │
    │  CERRAR                                                          │
    │                                                                  │
    │  12. Agente actualiza claude-progress.md                        │
    │  13. Agente actualiza feature_list.json                         │
    │  14. Agente registra qué sigue roto o sin verificar             │
    │  15. Agente hace commit (solo cuando es seguro reanudar)        │
    │  16. Agente deja una ruta de reinicio limpia para la sig. sesión│
    │                                                                  │
    └──────────────────────────────────────────────────────────────────┘

    El harness gobierna cada transición en este ciclo de vida.
    El modelo decide qué código escribir en cada paso.
    Sin el harness, el paso 9 se convierte en "el agente dice que se ve bien."
    Con el harness, el paso 9 es "los tests pasan, el lint está limpio, los tipos verifican."
```

---

## Para quién es este curso

Este curso es para:

- Ingenieros que ya usan agentes de codificación y desean mayor estabilidad y calidad
- Investigadores o constructores que quieren una comprensión sistemática del diseño de harnesses
- Líderes técnicos que necesitan entender cómo el diseño del entorno afecta el rendimiento del agente

Este curso NO es para:

- Personas que buscan una introducción a la IA sin código
- Personas que solo se interesan por los prompts y no planean construir implementaciones reales
- Estudiantes que no están preparados para dejar que los agentes trabajen dentro de repositorios reales

---

## Requisitos

Este es un curso donde realmente ejecutas agentes de codificación.

Necesitas al menos una de estas herramientas:

- Claude Code
- Codex
- Otro agente de codificación de IDE o CLI que soporte edición de archivos, ejecución de comandos y tareas de múltiples pasos

El curso asume que puedes:

- Abrir un repositorio local
- Permitir que el agente edite archivos
- Permitir que el agente ejecute comandos
- Inspeccionar la salida y volver a ejecutar tareas

Si no tienes una de estas herramientas, aún puedes leer el contenido del curso, pero no podrás completar los proyectos según lo previsto.

---

## Vista Previa Local

Este repositorio usa VitePress como visor de documentación.

```sh
npm install
npm run docs:dev        # Servidor de desarrollo con recarga en caliente
npm run docs:build      # Build de producción
npm run docs:preview    # Vista previa del sitio construido
```

Luego abre la URL local que VitePress muestra en tu navegador.

---

## Prerrequisitos

Requerido:

- Familiaridad con la terminal, git y entornos de desarrollo local
- Capacidad de leer y escribir código en al menos un stack de aplicaciones común
- Experiencia básica en depuración de software (lectura de logs, tests y comportamiento en tiempo de ejecución)
- Suficiente tiempo para dedicar a un curso enfocado en la implementación

Útil pero no requerido:

- Experiencia con Electron, aplicaciones de escritorio o herramientas local-first
- Experiencia en testing, logging o arquitectura de software
- Exposición previa a Codex, Claude Code o agentes de codificación similares

---

## Referencias Principales

Primarias:

- [OpenAI: Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)
- [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Anthropic: Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [OpenAI: Unrolling the Codex agent loop](https://openai.com/index/unrolling-the-codex-agent-loop/)
- [Anthropic: Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- [LangChain: Improving Deep Agents with harness engineering](https://www.langchain.com/blog/improving-deep-agents-with-harness-engineering)
- [Thoughtworks / Martin Fowler: Harness engineering for coding agent users](https://martinfowler.com/articles/harness-engineering.html)
- [Cursor: Continually improving our agent harness](https://cursor.com/blog/continually-improving-agent-harness)

Consulta la lista completa de referencias en capas en [`docs/es/resources/reference/`](../../docs/es/resources/reference/index.md).

---

## Estructura del Repositorio

```text
learn-harness-engineering/
├── docs/                          # Sitio de documentación VitePress
│   ├── lectures/                  # 14 clases (index.md + ejemplos en code/)
│   │   ├── lecture-01-*/
│   │   ├── lecture-02-*/
│   │   └── ... (14 en total)
│   ├── projects/                  # 8 descripciones de proyectos
│   │   ├── project-01-*/
│   │   └── ... (8 en total)
│   └── resources/                 # Plantillas y referencias multilingües
│       ├── en/                    # Plantillas, checklists y guías en inglés
│       ├── zh/                    # Plantillas, checklists y guías en chino
│       ├── ru/                    # Plantillas, checklists y guías en ruso
│       └── vi/                    # Plantillas, checklists y guías en vietnamita
├── projects/
│   ├── shared/                    # Fundación compartida de Electron + TypeScript + React
│   └── project-NN/               # Directorios starter/ y solution/ por proyecto
├── skills/                        # Skills reutilizables para agentes de IA
│   └── harness-creator/           # Skill de Harness Engineering
├── package.json                   # VitePress + herramientas de desarrollo
└── CLAUDE.md                      # Instrucciones de Claude Code para este repositorio
```

---

## Cómo está organizado el curso

- Cada clase se enfoca en una pregunta
- El curso incluye 8 proyectos
- Cada proyecto requiere que el agente haga trabajo real
- Cada proyecto compara resultados con harness débil vs. fuerte
- Lo que importa es la diferencia medida, no cuánta documentación se escribió

---

## Skills

Este repositorio también incluye skills reutilizables para agentes de IA que puedes instalar directamente en tu IDE o espacio de trabajo del agente.

- [**harness-creator**](../../skills/harness-creator/): Un skill que te ayuda a generar un harness de nivel productivo para tu propio proyecto en cuestión de minutos.

---

## Otros Cursos

Nuestro equipo también ha creado otros cursos! Échales un vistazo:

[![Hands-on Modern RL](https://img.shields.io/badge/HANDS--ON_MODERN_RL-0052cc?style=for-the-badge)](https://github.com/walkinglabs/hands-on-modern-rl)

**Hands-on Modern RL**: Un plan de estudios práctico y de código abierto que cierra la brecha entre los conceptos básicos de RL y la alineación de LLMs, RLVR y sistemas Agentic avanzados.

---

## Historial de Estrellas

[![Star History Chart](https://star-history.dera.page/svg?repos=walkinglabs/learn-harness-engineering&type=date&legend=top-left)](https://star-history.dera.page/#walkinglabs/learn-harness-engineering&type=date&legend=top-left)

---

## Agradecimientos

Este curso fue inspirado por y toma ideas de [learn-claude-code](https://github.com/shareAI-lab/learn-claude-code) — una guía progresiva para construir un agente desde cero, desde un simple bucle hasta la ejecución autónoma aislada.
