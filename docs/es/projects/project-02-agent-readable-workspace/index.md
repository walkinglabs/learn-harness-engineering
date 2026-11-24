[中文版本 →](../../../zh/projects/project-02-agent-readable-workspace/)

> Lecciones relacionadas: [Lección 03. Convierte el repositorio en tu única fuente de verdad](./../../lectures/lecture-03-why-the-repository-must-become-the-system-of-record/index.md) · [Lección 04. Divide las instrucciones en varios archivos](./../../lectures/lecture-04-why-one-giant-instruction-file-fails/index.md)
> Archivos de plantilla: [templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/es/resources/templates/)

# Proyecto 02. Haz el proyecto legible y retoma el trabajo donde lo dejaste

## Qué harás

Añade "legibilidad" al repositorio para que un agente nuevo pueda entender rápidamente la estructura del proyecto, conocer el progreso actual y retomar el trabajo. En concreto: implementa importación de documentos, vista de detalle y persistencia local, completado en dos sesiones.

Harás dos pruebas a partir del mismo código de `starter/`. En la primera conservarás la configuración ligera de partida, sin `session-handoff.md`; en la segunda usarás el `AGENTS.md` de `solution/` y generarás el archivo de traspaso al cerrar la sesión A. En ambos casos, la segunda sesión retomará el trabajo de la primera. El protocolo mantiene constantes el código, el agente, la consigna y el punto de parada para comparar el conjunto de reglas y el traspaso.

## Herramientas

- Claude Code o Codex
- Git
- Node.js + Electron
- Editor de texto (para redactar la documentación)

## Mecanismo de harness

Workspace legible para el agente + archivos de estado persistentes

## Usa el proyecto incluido

Ruta en el repositorio: [`projects/project-02/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02)

| Directorio | Qué contiene | Qué comparar |
|------|------|------|
| [`starter/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/starter) | Código de Project 01 con importación, vista de detalle y persistencia todavía incompletas. La documentación existe, pero es más ligera y no hay `session-handoff.md`. | Cuánto contexto tiene que redescubrir una segunda sesión del agente. |
| [`solution/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/solution) | La misma porción de producto ya completada, con documentación de handoff bajo [`projects/project-02/solution/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/solution), además de [`feature_list.json`](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/solution/feature_list.json) y [`session-handoff.md`](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/solution/session-handoff.md). | Solo como referencia: la segunda prueba toma de aquí únicamente `AGENTS.md`, no el código ni los resultados ya completados. |

Las funciones de producto son importación de documentos, carga completa del detalle/contenido y persistencia tras reiniciar. La función de harness es un workspace legible y fácil de retomar.

## Protocolo de ejecución

Solo cambia el harness entre ambas pruebas. En la sesión A se implementan la importación y la vista de detalle; en la B, la persistencia. Consulta el [README del proyecto](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/README.md).

1. Prepara dos directorios de trabajo aislados, `p02-baseline/` y `p02-improved/`, por ejemplo. Ejecuta ambas sesiones de una prueba, archiva los resultados y retira ese directorio antes de empezar la otra. No uses ramas de Git como aislamiento: el agente puede leer otras ramas o carpetas vecinas y ver archivos de la otra prueba.
2. Copia [el mismo `starter/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/starter) en ambos directorios. Deriva de la solución del Proyecto 01, cuyas funciones ya pasan las comprobaciones. Las tres funciones del Proyecto 02 figuran como `not-started` en `feature_list.json`. Si usas tu propio resultado del Proyecto 01, copia la misma instantánea en ambos directorios.
3. Usa la misma consigna en las dos pruebas: «Implementa la importación de documentos con un selector de archivos, una vista que muestre el contenido completo y la persistencia de lo importado tras reiniciar la aplicación».
4. No copies `solution/docs/`, `solution/feature_list.json` ni `solution/session-handoff.md`: describen la solución terminada o ya dan las funciones por aprobadas. En las dos pruebas conserva intactos `starter/docs/ARCHITECTURE.md`, `starter/docs/PRODUCT.md` y el `feature_list.json` de `starter/` al empezar.

### Primera prueba (harness ligero)

En `p02-baseline/`, conserva el `AGENTS.md` breve, `docs/` y `feature_list.json` del starter. No borres esos archivos y no añadas `session-handoff.md`.

**Sesión A:**

1. Inicia el agente con la consigna.
2. Detén la sesión cuando puedas abrir la aplicación, importar un `.txt` o `.md` con el selector, verlo en la lista y consultar su contenido completo, pero aún se pierda al reiniciar. Aplica el mismo criterio en la segunda prueba.
3. No pidas ninguna nota de traspaso ni otro resumen.

**Sesión B:**

1. Abre una sesión nueva del agente en el mismo directorio y dile solo «Continúa el trabajo».
2. Mide el tiempo hasta el primer cambio de código significativo y cuenta cada vez que el agente redescubre información de la sesión A: arquitectura, comandos o funciones pendientes.

### Segunda prueba (harness reforzado)

En `p02-improved/`, antes de iniciar la sesión A, sustituye `AGENTS.md` por [`solution/AGENTS.md`](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/solution/AGENTS.md). No cambies nada más en el punto de partida. Este archivo incorpora reglas de inicio, una jerarquía de documentos, una regla para mantenerlos actualizados, una definición de finalización con evidencias en `feature_list.json` y reglas de traspaso. La prueba evalúa el harness completo, no el efecto de la nota por sí sola. Para aislarlo, añade una tercera prueba con el `AGENTS.md` del starter y solo la sección de traspaso.

**Sesión A:**

1. Inicia el agente con la misma consigna.
2. Detén la implementación en el mismo punto: importación y detalle listos, persistencia aún pendiente.
3. Antes de cerrar la sesión, pide al agente que escriba `session-handoff.md` en la raíz del repositorio según la [plantilla de traspaso](./../../resources/templates/session-handoff.md): qué se verificó, qué cambió, qué falla o falta por verificar y cuál es el mejor paso siguiente. [`solution/session-handoff.md`](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/solution/session-handoff.md) es un ejemplo de un trabajo terminado; no lo copies.

**Sesión B:**

1. Abre una sesión nueva del agente en el mismo directorio y dile solo «Continúa el trabajo». La instrucción de leer `session-handoff.md` viene de `AGENTS.md`, no de la consigna.
2. Registra las mismas mediciones que en la primera prueba.

## Cómo medir los resultados

| Métrica | Descripción |
|------|------|
| Tiempo de reanudación de la sesión B | Desde el inicio hasta el primer cambio de código significativo |
| Redescubrimientos | Veces que el agente vuelve a averiguar aspectos ya conocidos de la arquitectura, los comandos o el estado |
| Calidad del traspaso | Si la nota es completa, precisa y útil para actuar (solo en la segunda prueba) |
| Trabajo repetido | Cuánto trabajo terminado en A vuelve a hacer el agente en B |
| Finalización | Si las tres funciones quedan completas al terminar |

## Qué entregar

- Registros o transcripciones de las sesiones A y B con el harness ligero.
- Los mismos registros con el harness reforzado, el `AGENTS.md` usado y el `session-handoff.md` generado por el agente.
- Una nota comparativa sobre la rapidez de reanudación y la calidad de la recuperación del contexto.
