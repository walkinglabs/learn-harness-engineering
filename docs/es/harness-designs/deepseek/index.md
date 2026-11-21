# Análisis del diseño de DeepSeek Harness

[DeepSeek Harness](https://deepseek.com/harness) —comando `dsh`, repositorio `deepseek-ai/deepseek-harness`— se publicó en agosto de 2026 como Developer Preview. Su definición oficial es directa: **Agent = Model + Environment + Tools + State**; cuatro componentes: modelo, entorno, herramientas y estado.

Si al analizar los tres productos anteriores nos preguntábamos «cómo debería diseñarse un harness», DeepSeek Harness plantea una cuestión más radical: **¿puede el harness independizarse de un modelo concreto y convertirse en un runtime autónomo?** Su respuesta es afirmativa y lleva la idea hasta el extremo. En palabras de la [documentación de arquitectura](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md): *Every part of the product is a plugin, including the model adapter, the tool registry, the session log, and the agent loop itself* —cada parte del producto es un plugin, incluidos el adaptador del modelo, el registro de herramientas, el log de session e incluso el propio ciclo del agent—.

En este artículo lo analizamos centrándonos en tres elementos: el núcleo basado en plugins, los capability seams, la pipeline de eventos y la potente restricción de ingeniería «Model-visible means logged».

## En una frase

La estructura de un coding agent tradicional es «LLM + ciclo fijo del agent + conjunto fijo de herramientas». DeepSeek Harness se estructura como «modelo + un núcleo de plugins —Cordis—». El núcleo solo se ocupa de cargar y descargar plugins, gestionar sus dependencias y proporcionar el mecanismo de eventos; **no posee ninguna capacidad específica del agent**. Como explica la [documentación de arquitectura](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md): «There is no privileged core to patch» —no existe un núcleo privilegiado que deba parchearse— y «you extend dsh by mounting a plugin beside the others» —dsh se amplía montando un plugin junto a los demás, sin modificar el núcleo—. Esto significa que ni siquiera el propio ciclo del agent es sagrado e inmutable: puedes usar el modelo de DeepSeek, conectar los subagents de Claude Code, añadir un sandbox remoto, escribir memoria personalizada, sustituir el ciclo y la UI, y combinarlos en un agent completamente nuevo.

Es la aplicación más radical de la frase del curso «todo lo que queda fuera de los pesos del modelo es harness»: si el harness es independiente, hagamos de él un sistema operativo independiente.

## Núcleo arquitectónico 1: capability seam

DeepSeek Harness representa las «capacidades» mediante Services y divide casi todas ellas en tres capas:

```
Service Definition
        ↓
Service Provider
        ↓
Consumer
```

Por ejemplo, debajo de `FS Service` hay varios Providers —Local FS, E2B FS y Remote FS— que se exponen de forma uniforme hacia arriba como file tools. Shell, Subprocess, Sandbox, Web, LLM y SubAgent siguen la misma estructura. Esta organización en tres capas no es una interpretación nuestra: el texto original de [Capability seams, en la documentación de arquitectura](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md), dice que *a seam is a swappable capability with three roles: a Service Definition declaring the interface, a Service Provider implementing it, and a Consumer using it, commonly a model-facing tool* —un capability seam es una capacidad reemplazable con tres roles: Service Definition declara la interfaz, Service Provider la implementa y Consumer la utiliza, normalmente como una herramienta expuesta al modelo—.

Esto resuelve una cuestión persistente de la ingeniería de harness: **¿debe el agent depender de una «herramienta concreta» o de una «interfaz de capacidades»?** DeepSeek Harness elige la segunda. Desde la perspectiva del curso, significa estandarizar el «subsistema de herramientas» como interfaz: al cambiar un Provider, la herramienta que ve el modelo conserva su forma, pero el entorno cambia por completo.

## Núcleo arquitectónico 2: pipeline de eventos

DeepSeek Harness no funciona internamente mediante un simple «LLM → herramienta → LLM», sino mediante una pipeline de eventos en la que cada etapa constituye un punto de eventos que los plugins pueden escuchar:

```
turn/start → claim input → assemble（system prompt / context / tools）
  → agent/pre-step → step/start → LLM request（agent/request）→ llm/stream
  → assistant/message → tool/call
  → tools/pre-execute（permission / guard / policy / hook）
  → tools/execute → tools/post-execute → tool/result → step/end → next turn
```

(La pipeline anterior es una transcripción de la sección [Turn flow de la documentación de arquitectura](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md): `turn/*`, `step/*`, `user/message`, `assistant/*` y `tool/*` son eventos persistentes de session; `agent/pre-step`, `agent/request`, `llm/stream` y `tools/*` son puntos de extensión que pueden escuchar los plugins.)

La principal ventaja del diseño es que **muchas funciones no requieren modificar en absoluto el ciclo del agent**. ¿Quieres hacer una comprobación de seguridad antes de ejecutar una herramienta? Escucha `tools/pre-execute`. ¿Quieres añadir memoria? Inyéctala en `agent/pre-step`. ¿Quieres registrar el comportamiento? Suscríbete a los eventos de session. ¿Quieres modificar la solicitud al modelo? Conecta un hook a `agent/request`. ¿Quieres decidir si continuar el razonamiento? Escucha `agent/turn-stopping`.

Comparado con «hacer observable el proceso de ejecución del agent» de la undécima lección, DeepSeek Harness va más lejos: no «añade logs», sino que convierte **cada paso del ciclo en un punto de eventos**, de modo que observabilidad, permissions, memoria y políticas se conectan al ciclo como listeners, en lugar de quedar codificadas rígidamente dentro de él.

## Núcleo arquitectónico 3: Session Event Log y «Model-visible means logged»

DeepSeek Harness incluye un **Session Event Log append-only** y establece una restricción de ingeniería muy fuerte. En palabras de [Session log, en la documentación de arquitectura](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md):

> **Model-visible means logged.** Anything that reaches a model request must be reconstructable from the log, and a runtime invariant asserts it.

(Todo lo que puede ver el modelo debe registrarse. Cualquier elemento que llegue a una solicitud al modelo debe poder reconstruirse desde el log, y un invariante del runtime lo impone.)

En otras palabras, la observabilidad no es un log añadido a posteriori, sino una restricción fundamental del harness: todo lo que entra en el contexto del modelo debe dejar un log de forma predeterminada. Esto enlaza directamente con «la observabilidad pertenece al interior del harness» de la última noche y convierte el diseño de almacenamiento append-only en un principio: el log solo añade y nunca sobrescribe, por lo que el estado de la session puede reproducirse.

## Correspondencia con el marco del curso

| Subsistema | Implementación de DeepSeek Harness | Evaluación |
| --- | --- | --- |
| Instrucciones | Basadas en plugins; las reglas/Skills se inyectan como plugins | Extremadamente flexible, pero carece de una convención integrada como CLAUDE.md |
| Herramientas | Service Definition → Provider → Consumer como capability seam | Estandarización extrema del subsistema de herramientas |
| Entorno | Los Providers de sandbox/FS/Shell son reemplazables (incluido E2B remoto) | El entorno es totalmente conectable |
| Estado | append-only Session Event Log + Model-visible means logged | La observabilidad es una restricción de primer orden |
| Retroalimentación | permission / guard / policy / hook en tools/pre-execute | Los mecanismos de retroalimentación se basan en eventos |

La diferencia fundamental entre DeepSeek Harness y los otros tres productos es que Pi, Claude Code y Codex optimizan el harness dentro de «un agent concreto», mientras que DeepSeek Harness define el harness como un **sistema operativo independiente del modelo** y trata al propio agent como una aplicación reemplazable que se ejecuta sobre ese OS. El coste también es evidente: una mayor libertad implica un mayor coste de configuración, la otra cara inherente al diseño «harness como OS» —en la etapa de Developer Preview, su posicionamiento también es «probar pronto mientras los mecanismos siguen evolucionando»—.

## Diseños que merece la pena adoptar

1. **Convertir cada paso del ciclo en un punto de eventos**: conectar permissions, memoria, políticas y logs al ciclo como listeners, en vez de codificarlos rígidamente dentro de él.
2. **Estandarizar los capability seams**: depender de una «interfaz de capacidades», no de una «herramienta concreta», para poder reemplazar todo el entorno sin afectar a la superficie de herramientas que ve el modelo.
3. **Model-visible means logged**: registrar todo lo que puede ver el modelo y convertir la observabilidad de «mejora opcional» en «restricción fundamental».
4. **Log de session append-only**: permitir la reproducción del estado y un handoff fiable; es la garantía de ingeniería de «dejar un estado limpio al terminar cada session».

## Fuentes de referencia (texto original / código fuente)

Todas las afirmaciones pueden rastrearse hasta los textos originales o el código fuente siguientes, evitando las descripciones basadas en impresiones:

- **Sitio web de DeepSeek Harness**: definición del producto «Agent = Model + Environment + Tools + State», estado de Developer Preview y comando `dsh`.<br/>https://deepseek.com/harness
- **Repositorio deepseek-ai/deepseek-harness** (comando `dsh`, licencia MIT):<br/>https://github.com/deepseek-ai/deepseek-harness
- **Documento de arquitectura architecture.md**: fuente principal de este artículo: «Every part of the product is a plugin», «There is no privileged core to patch», pipeline de eventos Turn flow, tres roles de los capability seams, «Model-visible means logged» y el invariante del runtime, Session Event Log append-only, capability seams como fs/tools/telemetry y subsistemas `ctx.*`.<br/>https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md
- **Documentos complementarios de arquitectura**: introducción al núcleo Cordis —plugins contribute services, typed events, reversible effects—, detalles de los capability seams y subsistema Session.<br/>https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-primer.md ｜ https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/capability-seams.md ｜ https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/subsystems/session.md

Lecciones relacionadas: [Lección 11. Incorpora la observabilidad al harness](../../lectures/lecture-11-why-observability-belongs-inside-the-harness/) ｜ [Lección 12. Deja listo el handoff antes de terminar cada session](../../lectures/lecture-12-why-every-session-must-leave-a-clean-state/) ｜ [Lección 02. Qué es realmente un harness](../../lectures/lecture-02-what-a-harness-actually-is/)
