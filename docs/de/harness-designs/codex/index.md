# Analyse des harness-Designs von Codex

OpenAIs [Codex](https://openai.com/index/harness-engineering/) ist unter den vier Produkten möglicherweise am engsten mit den Grundprinzipien des harness verbunden: Der Artikel „Harness Engineering“, der dem gesamten Feld seinen Namen gab, fasst die Erfahrungen des OpenAI-Teams bei der Produktentwicklung mit Codex zusammen. Das harness-Design von Codex zu analysieren heißt daher in weiten Teilen, die Engineering-Praxis hinter diesem Artikel zu untersuchen.

Die Philosophie von Codex lässt sich in einem Satz zusammenfassen: **Das Repository ist die maßgebliche Informationsquelle (repository as the system of record), AGENTS.md ist nur eine Verzeichnisseite, und der Wert des Engineerings liegt darin, die Umgebung zu gestalten, Absichten auszudrücken und Feedback-Loops aufzubauen.**

## Positionierung in einem Satz

Das OpenAI-Team lieferte mit Codex innerhalb weniger Wochen ein Produkt aus, das schließlich mehr als eine Million Codezeilen umfasste – **jede einzelne Zeile wurde von Codex geschrieben** (siehe den Abschnitt „Designing for growth“ in [Harness Engineering](https://openai.com/index/harness-engineering/)). Diese Praxis beantwortet eine Frage: Wie sollte ein System organisiert sein, wenn sich die Rolle von Engineers vom „Code schreiben“ zum „harness gestalten“ verlagert? Codex CLI selbst ist ein binäres Open-Source-Monolithprogramm (in Rust implementiert, [github.com/openai/codex](https://github.com/openai/codex)); sein Beitrag zum harness liegt jedoch vor allem in **Konventionen (convention)** und **Context Engineering**, nicht in auffälligen Erweiterungspunkten.

## Anweisungssubsystem: AGENTS.md ist eine Verzeichnisseite, keine Enzyklopädie

Dies ist der einflussreichste Beitrag von Codex zur harness-Theorie:

> Eine einzelne riesige Anweisungsdatei lässt sich nur schwer mechanisch auf Abdeckung, Aktualität, Eigentümerschaft und Querverweise prüfen; Abweichungen von der Realität sind unvermeidlich. Deshalb betrachten wir AGENTS.md nicht länger als Enzyklopädie, sondern als **Verzeichnisseite**. Das Wissen über die Codebase liegt in strukturierten Dokumenten, auf die AGENTS.md verweist.

(Dies ist eine direkte Wiedergabe des Abschnitts „AGENTS.md should be a directory page“ aus [Harness Engineering](https://openai.com/index/harness-engineering/).)

Lektion 4 erklärt, warum „eine einzelne riesige Anweisungsdatei scheitert“; Codex liefert unmittelbar die richtige Lösung: AGENTS.md sollte ungefähr 100 Zeilen umfassen (der Originaltext empfiehlt rund 100 Zeilen und bei Annäherung an die Grenze eine Auslagerung nach `docs/`). Was nicht hineinpasst, wird in das Verzeichnis `docs/` aufgeteilt, damit der agent es bei Bedarf liest. Dies ist die maßgebliche Quelle für das Prinzip „Gib eine Karte, keine Bedienungsanleitung“.

Das ergänzende Prinzip lautet **Invarianten durchsetzen, die Implementierung nicht micromanagen** (Original: „don't micromanage the implementation；focus on invariants“): AGENTS.md enthält nur unverletzliche harte Constraints und Validierungsbefehle; wie sie umgesetzt werden, bleibt dem Modell überlassen. Dies entspricht direkt dem Prinzip „Constraints statt Micromanagement“ aus Lektion 2.

## Kontextsubsystem: Write-Select-Compress-Isolate

Das Context Engineering von Codex lässt sich in vier Strategien zusammenfassen. Dieses Framework entstand in der Community, nachdem sich „context engineering“ als eigene Disziplin etabliert hatte, und wurde anschließend auf Codex zurückgeführt (Quelle: [Context Engineering for Codex CLI](https://codex.danielvaughan.com/2026/06/10/context-engineering-codex-cli-write-select-compress-isolate-june-2026/)):

- **Write (herausschreiben)**: Kontext außerhalb des Fensters persistieren – Erkenntnisse in Dokumente und Zustand in Dateien schreiben, statt beides im Gespräch zu belassen. Dies entspricht dem „Repository als maßgebliche Informationsquelle“.
- **Select (auswählen)**: Nur die benötigten token in das Fenster holen – AGENTS.md weist den Weg und Dateien werden bei Bedarf gelesen, statt das gesamte Repository hineinzuladen.
- **Compress (komprimieren)**: Nur wirklich Wichtiges bewahren – Codex unterstützt automatische compaction und das manuelle `/compact`; `compact_prompt` lässt sich anpassen (siehe [Context Engineering for Codex CLI](https://codex.danielvaughan.com/2026/06/10/context-engineering-codex-cli-write-select-compress-isolate-june-2026/)).
- **Isolate (isolieren)**: Kontext in getrennte Grenzen aufteilen – subagents isolieren den Kontext verschiedener Aufgaben, sodass beispielsweise ein Frontend-subagent niemals das Datenbankschema des Backends sieht.

Codex besitzt außerdem ein besonders feingranulares Design für Umgebungskontext: Laut der Sourcecode-Analyse in [codex-harness-internals](https://github.com/AlexKenbo/codex-harness-internals) gibt `build_environment_update_item` nur dann **geänderte Felder** aus, wenn sich die Umgebung verändert hat (CWD, git-Branch, Dateisystem), statt in jedem Durchlauf den vollständigen Systemkontext erneut einzufügen. Das ist ein Engineering-Detail nach dem Prinzip, „keine doppelten token im Kontext zu halten“.

## Tools und Grenzen: worktree-Isolation + subagents

Codex besitzt zwei zentrale harness-Mechanismen:

**1. Umgebungsisolation mit git worktrees.** Der Abschnitt „Environment“ in [Harness Engineering](https://openai.com/index/harness-engineering/) erklärt, dass jede Aufgabe in einem eigenen git worktree ausgeführt wird. Zusammen mit einem lokalen Observability-Stack aus Logs, Metriken und Traces kann so jede Änderung in einer isolierten Umgebung validiert werden. Das ist die physische Umsetzung von Lektion 7, „Jeder agent-Aufgabe klare Grenzen setzen“: Die Grenze wird nicht durch eine Anweisung erbeten, sondern durch Umgebungsisolation erzwungen. Das Umgebungssubsystem wird hier zu einer harten Isolation.

**2. subagents auf Kernel-Ebene.** `spawn_agent` / `wait_agent` sind Tools auf Kernel-Ebene: Das Modell erstellt ausdrücklich subagents, gibt ihnen jeweils einen eigenen session-Verlauf und ein eigenes Toolset und wartet auf ihre Ergebnisse. subagents erben die AGENTS.md-Anweisungen des Elternprozesses, arbeiten aber in **ihrem eigenen Kontext**. Die Konfiguration liegt in `.codex/agents/*.toml`; dort lassen sich unterschiedliche Modelle und Anweisungen festlegen (Details im Abschnitt „Sub-agents“ von [Context Engineering for Codex CLI](https://codex.danielvaughan.com/2026/06/10/context-engineering-codex-cli-write-select-compress-isolate-june-2026/)). Dies ist die direkte Umsetzung von „Kontextisolation“ – und zugleich Ausdruck des Handoff-Gedankens aus Lektion 12: Jeder subagent ist eine Arbeitseinheit mit klaren Grenzen.

## Feedbacksubsystem: Validierungsbefehle in der Spezifikation

Ein Punkt wird in OpenAIs Praxis besonders betont: Validierungsbefehle werden ausdrücklich in AGENTS.md aufgeführt, sodass „Wie bestätigen wir, dass es richtig ist?“ Teil des Repositorys wird. Im Engineering-Prozess mit Codex werden Tests, CI, Dokumentation und Observability-Konfiguration vollständig von Codex erzeugt – und alle bilden „ausführbare Validierungspfade“. Die Lösung für leistungsfähige, aber unzuverlässige Modelle besteht nicht darin, auf ihre Gewissenhaftigkeit zu hoffen, sondern darin, **Validierungspfade zu Standardkomponenten des harness zu machen**.

Approval Policies und Plan Mode bilden die andere Seite des Feedbacks: Vor risikoreichen Aktionen wird zuerst ein Plan erstellt und eine Genehmigung eingeholt. So werden „Aufgabengrenzen“ und „menschliche Entscheidungsgewalt“ als Runtime-Kontrollen umgesetzt.

## Zuordnung zum Kurs-Framework

| Subsystem | Umsetzung von Codex | Bewertung |
| --- | --- | --- |
| Anweisungen | AGENTS.md als Verzeichnisseite + Aufteilung in docs/ + Ausführungsinvarianten | Lehrbuchreif; definiert das Prinzip „eine Karte, keine Anleitung“ |
| Werkzeuge | worktree-Isolation + spawn_agent-subagents | Grenzen werden durch harte Umgebungsisolation durchgesetzt; sehr stark |
| Umgebung | Eigener worktree + Observability-Stack | worktree-Isolation ist das Markenzeichen |
| Zustand | Write-Strategie (Zustand wird in Dateien/Dokumente geschrieben) | Beruht auf Konventionen statt auf integriertem Memory |
| Feedback | Validierungsbefehle in der Spezifikation + Approval Policies + plan mode | Der Feedbackpfad ist standardmäßig vorgesehen; nachahmenswert |

Der Vergleich zwischen Codex und Claude Code ist aufschlussreich: Claude Code verfolgt „Addition“ – Memory, permissions und subagents werden in den Kernel eingebaut. Codex verfolgt „Subtraktion“ – der Kernel bleibt möglichst zurückhaltend, während mehr Verantwortung bei Repository-Konventionen und Context Engineering liegt. Deshalb heißt es in der Community oft: „Die harness-Philosophie von Codex ist wertvoller als sein Code.“

## Übernehmenswerte Designs

1. **AGENTS.md als Verzeichnisseite schreiben**: Auf ungefähr 100 Zeilen begrenzen, auf Details in docs/ verweisen und mechanische Prüfungen ermöglichen.
2. **Nur Invarianten festhalten, die Implementierung nicht micromanagen**: Harte Constraints + Validierungsbefehle; den Rest dem Modell überlassen.
3. **worktrees zur Umgebungsisolation verwenden**: Aufgabengrenzen durch die Umgebung erzwingen, nicht durch Bitten in Anweisungen.
4. **Nur Deltas des Umgebungskontexts übertragen**: In jedem Durchlauf nur geänderte Felder ausgeben, statt den vollständigen Systemkontext erneut einzufügen.
5. **subagents zur Kontextisolation verwenden**: Beim Aufteilen der Aufgabe zugleich den Kontext trennen, damit Teilaufgaben den Haupt-Loop nicht verunreinigen.

## Referenzen (Originaltexte / Sourcecode)

Jede Aussage lässt sich auf die folgenden Originaltexte oder den Sourcecode zurückführen; so werden Wiedergaben aus bloßer Erinnerung vermieden:

- **OpenAI, Harness Engineering**: AGENTS.md als Verzeichnisseite und Empfehlung von rund 100 Zeilen, executive invariants / don't micromanage, worktree-Isolation + Observability-Stack, Validierungsbefehle in der Spezifikation, Produktbeispiel mit mehr als einer Million Zeilen sowie Approval Policies und Plan Mode. Hauptquelle für alle Kernaussagen dieses Artikels.<br/>https://openai.com/index/harness-engineering/
- **Offizielle AGENTS.md-Spezifikation von OpenAI** (AGENTS.md als werkzeugübergreifender Standard):<br/>https://openai.com/index/agents-md/
- **Open-Source-Repository von Codex CLI** (in Rust implementiertes binäres Monolithprogramm):<br/>https://github.com/openai/codex
- **Context Engineering for Codex CLI** (Community): Write-Select-Compress-Isolate-Framework, `/compact` und `compact_prompt`, `spawn_agent` / `wait_agent`-subagents sowie die Konfiguration in `.codex/agents/*.toml`.<br/>https://codex.danielvaughan.com/2026/06/10/context-engineering-codex-cli-write-select-compress-isolate-june-2026/
- **codex-harness-internals** (Sourcecode-Analyse der Community): Implementierungsdetails wie der inkrementelle Umgebungskontext von `build_environment_update_item`.<br/>https://github.com/AlexKenbo/codex-harness-internals

Verwandte Lektionen: [Lektion 3 · Warum das Repository zur maßgeblichen Informationsquelle werden muss](../../lectures/lecture-03-why-the-repository-must-become-the-system-of-record/) ｜ [Lektion 4 · Warum eine einzige riesige Anweisungsdatei scheitert](../../lectures/lecture-04-why-one-giant-instruction-file-fails/) ｜ [Lektion 7 · Warum agents zu weit greifen und zu wenig abschließen](../../lectures/lecture-07-why-agents-overreach-and-under-finish/)
