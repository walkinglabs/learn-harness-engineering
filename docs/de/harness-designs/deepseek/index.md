# Analyse des Designs von DeepSeek Harness

[DeepSeek Harness](https://deepseek.com/harness) (Befehl `dsh`, Repository `deepseek-ai/deepseek-harness`) erschien im August 2026 als Developer Preview. Die offizielle Definition ist direkt: **Agent = Model + Environment + Tools + State** – Modell, Umgebung, Tools und Zustand als vier Bestandteile.

Wenn die Analyse der ersten drei Produkte fragt, „wie ein harness gestaltet sein sollte“, stellt DeepSeek Harness eine radikalere Frage: **Kann sich ein harness von einem bestimmten Modell lösen und zu einer eigenständigen Runtime werden?** Die Antwort lautet ja, und das Konzept wird bis zum Äußersten getrieben. Die [Architekturdokumentation](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md) formuliert es so: *Every part of the product is a plugin, including the model adapter, the tool registry, the session log, and the agent loop itself* (Jeder Teil des Produkts ist ein plugin – einschließlich Modelladapter, Tool-Registry, session-Log und sogar agent-Loop).

In dieser Analyse betrachten wir drei Dinge besonders: den plugin-basierten Kernel, Capability Seams und die Event-Pipeline sowie den stärksten Engineering-Constraint des Systems: „Model-visible means logged“.

## Positionierung in einem Satz

Die Struktur eines traditionellen coding agent lautet „LLM + fester agent-Loop + festes Toolset“. DeepSeek Harness besteht dagegen aus „Modell + plugin-Kernel (Cordis)“. Der Kernel verantwortet nur Laden und Entladen der plugins, ihre Abhängigkeiten und den Event-Mechanismus; **er besitzt keine konkrete agent-Fähigkeit**. Die [Architekturdokumentation](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md) sagt dazu: „There is no privileged core to patch“ (Es gibt keinen privilegierten Kernel, der gepatcht werden muss) und „you extend dsh by mounting a plugin beside the others“ (dsh wird erweitert, indem man neben den anderen ein plugin einhängt, ohne den Kernel zu verändern). Das bedeutet, dass selbst der agent-Loop nicht unantastbar ist: Du kannst DeepSeeks Modell mit Claude Codes subagents, einer Remote-Sandbox, eigenem Memory, einem eigenen Loop und einer eigenen UI zu einem völlig neuen agent kombinieren.

Das ist die konsequenteste Umsetzung des Kurssatzes „Alles außerhalb der Modellgewichte ist harness“: Wenn der harness unabhängig ist, wird er zu einem eigenständigen Betriebssystem.

## Architekturkern 1: Capability Seam

DeepSeek Harness stellt „Fähigkeiten“ als Services dar; fast jede Fähigkeit ist in drei Ebenen aufgeteilt:

```
Service Definition
        ↓
Service Provider
        ↓
Consumer
```

Am Beispiel des Dateisystems: Unter dem `FS Service` stehen mehrere Provider wie Local FS, E2B FS und Remote FS, die nach oben einheitlich als file tools exponiert werden. Shell, Subprocess, Sandbox, Web, LLM und SubAgent folgen derselben Struktur. Diese Dreiteilung ist keine Zusammenfassung von uns. Die [Architekturdokumentation · Capability seams](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md) sagt: *a seam is a swappable capability with three roles: a Service Definition declaring the interface, a Service Provider implementing it, and a Consumer using it, commonly a model-facing tool* (Ein Capability Seam ist eine austauschbare Fähigkeit mit drei Rollen: einer Service Definition, die das Interface deklariert, einem Service Provider, der es implementiert, und einem Consumer, der es verwendet – üblicherweise ein dem Modell zugängliches Tool).

Dies löst ein dauerhaftes Problem im harness-Engineering: **Soll ein agent von „konkreten Tools“ oder von „Fähigkeitsschnittstellen“ abhängen?** DeepSeek Harness entscheidet sich für Letztere. Für den Kurs bedeutet das: Das „Toolsubsystem“ wird als Interface standardisiert. Wird ein Provider ausgetauscht, bleibt die dem Modell gezeigte Tooloberfläche unverändert, während sich die Umgebung vollständig ändert.

## Architekturkern 2: Event-Pipeline

DeepSeek Harness besteht intern nicht aus einem einfachen „LLM → Tool → LLM“, sondern aus einer Event-Pipeline, in der jedes Glied ein durch plugins beobachtbarer Event-Punkt ist:

```
turn/start → claim input → assemble（system prompt / context / tools）
  → agent/pre-step → step/start → LLM request（agent/request）→ llm/stream
  → assistant/message → tool/call
  → tools/pre-execute（permission / guard / policy / hook）
  → tools/execute → tools/post-execute → tool/result → step/end → next turn
```

(Die obige Pipeline ist eine Wiedergabe des Abschnitts [Architekturdokumentation · Turn flow](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md): `turn/*`, `step/*`, `user/message`, `assistant/*` und `tool/*` sind persistierte session-Events; `agent/pre-step`, `agent/request`, `llm/stream` und `tools/*` sind Erweiterungspunkte, die plugins beobachten können.)

Der größte Vorteil dieses Designs: **Viele Funktionen erfordern keinerlei Änderung am agent-Loop selbst.** Eine Sicherheitsprüfung vor der Toolausführung? `tools/pre-execute` beobachten. Memory hinzufügen? In `agent/pre-step` injizieren. Verhalten protokollieren? session-Events abonnieren. Modell-Requests verändern? Einen hook an `agent/request` hängen. Entscheiden, ob die Inferenz fortgesetzt wird? `agent/turn-stopping` beobachten.

Verglichen mit Lektion 11 „Den Lauf eines agent observable machen“ geht DeepSeek Harness noch weiter: Es „fügt nicht einfach Logs hinzu“, sondern macht **jeden Schritt des Loops zu einem Event-Punkt**. Observability, permissions, Memory und Richtlinien hängen als Listener am Loop, statt darin fest verdrahtet zu sein.

## Architekturkern 3: Session Event Log und „Model-visible means logged“

DeepSeek Harness besitzt ein **append-only Session Event Log** und stellt einen äußerst starken Engineering-Constraint auf. Das [Architekturdokument · Session log](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md) formuliert ihn so:

> **Model-visible means logged.** Anything that reaches a model request must be reconstructable from the log, and a runtime invariant asserts it.

(Alles, was das Modell sehen kann, muss protokolliert werden. Alles, was in einen Modell-Request gelangt, muss aus dem Log rekonstruierbar sein; eine Runtime-Invariante erzwingt dies.)

Mit anderen Worten: Observability ist kein nachträglich ergänztes Logging, sondern ein Constraint erster Ordnung des harness. Alles, was in den Modellkontext gelangt, sollte standardmäßig im Log verbleiben. Das greift „Observability gehört in den harness“ aus der Abschlusslektion direkt auf und erhebt „append-only“ zum Speicherprinzip: Logs werden nur angehängt, nie überschrieben, und der session-Zustand lässt sich replayen.

## Zuordnung zum Kurs-Framework

| Subsystem | Umsetzung von DeepSeek Harness | Bewertung |
| --- | --- | --- |
| Anweisungen | Pluginbasiert; Regeln und Skills werden als plugins injiziert | Maximale Freiheit, aber keine integrierte Konvention nach Art von CLAUDE.md |
| Werkzeuge | Service Definition → Provider → Consumer als Capability Seam | Konsequente Standardisierung des Werkzeugsubsystems |
| Umgebung | Provider für Sandbox/FS/Shell sind vollständig austauschbar (einschließlich Remote-E2B) | Die Umgebung ist vollständig austauschbar |
| Zustand | append-only Session Event Log + Model-visible means logged | Observability ist ein Constraint erster Ordnung |
| Feedback | permission / guard / policy / hook auf tools/pre-execute | Der Feedbackmechanismus ist ereignisbasiert |

Der grundlegende Unterschied zwischen DeepSeek Harness und den drei anderen Produkten: Pi, Claude Code und Codex optimieren den harness jeweils „innerhalb eines bestimmten agent“. DeepSeek Harness definiert den harness dagegen als **modellunabhängiges Betriebssystem**; der agent selbst ist nur eine austauschbare Anwendung auf diesem OS. Der Preis ist offensichtlich: Hohe Freiheit verursacht hohen Konfigurationsaufwand. Das ist die unvermeidliche Kehrseite des Designs „harness als OS“ – und in der Developer Preview lautet die Positionierung ohnehin „früh ausprobieren, während sich die Mechanismen noch entwickeln“.

## Übernehmenswerte Designs

1. **Jeden Schritt des Loops zu einem Event-Punkt machen**: permissions, Memory, Richtlinien und Logs hängen als Listener am Loop, statt darin fest verdrahtet zu sein.
2. **Capability Seams standardisieren**: Von „Fähigkeitsschnittstellen“ statt von „konkreten Tools“ abhängen, damit die gesamte Umgebung ausgetauscht werden kann, ohne die dem Modell gezeigte Tooloberfläche zu verändern.
3. **Model-visible means logged**: Alles, was das Modell sehen kann, muss protokolliert werden; Observability wird vom „Bonus“ zum „Constraint erster Ordnung“.
4. **append-only session-Logs**: Der Zustand lässt sich replayen und Handoffs werden zuverlässig – eine technische Garantie für „jede session hinterlässt einen sauberen Zustand“.

## Referenzen (Originaltexte / Sourcecode)

Jede Aussage lässt sich auf die folgenden Originaltexte oder den Sourcecode zurückführen; so werden Wiedergaben aus bloßer Erinnerung vermieden:

- **Offizielle Website von DeepSeek Harness**: Produktdefinition „Agent = Model + Environment + Tools + State“, Positionierung als Developer Preview und Befehl `dsh`.<br/>https://deepseek.com/harness
- **Repository deepseek-ai/deepseek-harness** (Befehl `dsh`, MIT-Lizenz):<br/>https://github.com/deepseek-ai/deepseek-harness
- **Architekturdokument architecture.md**: Wichtigste Quelle dieses Artikels – „Every part of the product is a plugin“, „There is no privileged core to patch“, Turn-flow-Event-Pipeline, drei Rollen der Capability Seams, „Model-visible means logged“ und Runtime-Invariante, append-only Session Event Log sowie Capability Seams wie fs/tools/telemetry und `ctx.*`-Subsysteme.<br/>https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md
- **Begleitdokumente zur Architektur**: Einführung in den Cordis-Kernel (plugins contribute services, typed events, reversible effects), Details zu Capability Seams und session-Subsystem.<br/>https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-primer.md ｜ https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/capability-seams.md ｜ https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/subsystems/session.md

Verwandte Lektionen: [Lektion 11 · Warum Observability in den harness gehört](../../lectures/lecture-11-why-observability-belongs-inside-the-harness/) ｜ [Lektion 12 · Warum jede session einen sauberen Zustand hinterlassen muss](../../lectures/lecture-12-why-every-session-must-leave-a-clean-state/) ｜ [Lektion 2 · Was ein harness tatsächlich ist](../../lectures/lecture-02-what-a-harness-actually-is/)
