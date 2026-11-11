# Analyse des harness-Designs von Pi

[Pi](https://pi.dev/) (npm-Paket `@earendil-works/pi-coding-agent`) bezeichnet sich selbst als „minimal agent harness“ – als minimalistischen agent harness. Diese Formulierung lohnt eine genauere Betrachtung: Pi nennt sich weder „leistungsfähigster coding agent“ noch „benutzerfreundlichstes AI-Programmierwerkzeug“, sondern verankert seine Positionierung ausdrücklich im Begriff **harness**.

In diesem Artikel analysieren wir Pi anhand des Frameworks der fünf Subsysteme – Anweisungen, Tools, Umgebung, Zustand und Feedback – und untersuchen, wie sich seine Designphilosophie grundlegend von Claude Code und Codex unterscheidet. Die Antwort vorweg: **Pis Philosophie lautet „Kernel minimieren + Erweiterungen programmierbar machen“. Context Engineering findet außerhalb des System-Prompts statt, und die Nutzer – oder sogar Pi selbst – verändern den harness, statt Pi über den harness entscheiden zu lassen.**

## Positionierung in einem Satz

Pi ist ein minimalistischer Kernel: Die offizielle Positionierung hält den Kernel bewusst klein und gibt dir die Entscheidungshoheit zurück. Die [pi.dev-Startseite](https://pi.dev/) formuliert es so: „Ask Pi to build what you want, or install a package that does it your way“. Pi unterteilt den anpassbaren harness in vier Ebenen:

- **Extensions**: TypeScript-hooks an Ereignissen des Pi-Lebenszyklus, die programmierbare Oberfläche auf Runtime-Ebene.
- **Skills**: Bei Bedarf geladene Fähigkeitspakete mit Anweisungen und Tools; progressive disclosure.
- **Prompt templates**: Wiederverwendbare Markdown-Prompts, die mit `/name` expandiert werden.
- **Themes**: Das Erscheinungsbild der TUI.

Diese Schichtung ist selbst ein harness-Design: **Was das Modell wann sehen kann, wird vollständig Regeln und Erweiterungen überlassen, statt fest im Kernel verdrahtet zu sein.**

## Kern-Loop

Wie alle coding agents besteht Pi im Kern aus einem while-Loop „schlussfolgern → Tool ausführen → beobachten → erneut schlussfolgern“. Bemerkenswert ist nicht der Loop selbst, sondern wie Pi mit seiner äußeren Schicht umgeht: Kontextverwaltung wird von der „compaction“ innerhalb des Loops zur „Kontrolle“ außerhalb des Loops erweitert.

Pis Runtime stellt eine programmierbare Schnittstelle bereit. Der Abschnitt [Programmatic Usage im Sourcecode-README](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md) beschreibt neben der interaktiven TUI auch skriptfähige Print-/JSON-Modi, ein RPC-Protokoll und die Einbettung per SDK. So kann derselbe harness entweder schrittweise von Menschen oder automatisiert durch CI/CD beziehungsweise andere Programme gesteuert werden. Dies entspricht der Voraussetzung aus Lektion 13 „Loop Engineering“ für den Weg „von manueller Steuerung zu automatischen Loops“: Ein harness, den nur Menschen interaktiv steuern können, wird nie Teil eines automatischen Loops.

## Anweisungssubsystem: AGENTS.md und SYSTEM.md

Pi geht zurückhaltend mit „Anweisungen“ um, besitzt aber eine klare Hierarchie:

- **AGENTS.md**: Der Abschnitt [Project Context Files im Sourcecode-README](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md) beschreibt die Ladereihenfolge ausdrücklich: globales `~/.pi/agent/AGENTS.md` → schrittweises Durchlaufen der Elternverzeichnisse → `./AGENTS.md` im aktuellen Verzeichnis (auch mit CLAUDE.md kompatibel). Das setzt das Prinzip „Repository als maßgebliche Informationsquelle“ um: Anweisungen sind Dateien, keine Ermahnungen im Chatfenster.
- **SYSTEM.md**: Laut der [offiziellen pi.dev-Dokumentation](https://pi.dev/docs/usage/project-context) kann der Standard-System-Prompt projektspezifisch ersetzt (replace) oder ergänzt (append) werden. Dies ist der einzige offizielle Zugang, über den Pi Änderungen am „System-Prompt“ erlaubt, und zugleich seine Ebene der „Selbstbeschreibung der Umgebung“.

Pi betont offiziell, dass sein System-Prompt selbst **minimalistisch** ist. Dahinter steht ein klarer Trade-off: Der Kernel wird nicht mit langen „Wenn … dann …“-Regeln gefüllt, sondern bietet Erweiterungspunkte, über die Regeln erst bei Bedarf als Skills und Extensions erscheinen. Das greift Lektion 4 „Warum eine einzige riesige Anweisungsdatei scheitert“ direkt auf: Mit „minimalistischem Kernel + aufgeteilten Dateien + Laden bei Bedarf“ vermeidet Pi das Problem riesiger Anweisungsdateien von vornherein.

## Zustand und Kontext: Pis feingranularste Aufteilung

Pis Context Engineering verdient besondere Aufmerksamkeit, weil es Konzepte wie „Kontextkontinuität“ und „Vermeidung von Kontextkorruption“ in konkrete Mechanismen übersetzt:

**1. Compaction wird programmierbar.** Wenn sich der Kontext seinem Limit nähert, werden alte Nachrichten automatisch zusammengefasst. Die [offizielle pi.dev-Dokumentation](https://pi.dev/docs/usage/sessions) erklärt, dass die compaction-Strategie selbst **anpassbar** ist: Mit Extensions lassen sich themenbasierte compaction, codebewusste Zusammenfassungen oder sogar ein anderes Modell für die Zusammenfassung implementieren. Das Sourcecode-README beschreibt auch Details des Standardmechanismus: Automatische compaction wird in zwei Fällen ausgelöst – Wiederherstellung nach einem Kontextüberlauf oder Überschreiten des Aufbewahrungsschwellwerts. Der Schnittpunkt bewahrt ungefähr die jüngsten 20.000 token; frühere Nachrichten werden zu einem „context handoff“ zusammengefasst und schrittweise in einer Kette weiter komprimiert. Pi behandelt die Frage „Wie wird komprimiert?“ also nicht als unveränderliche Konstante, sondern als Teil des harness.

**2. Dynamic context.** Laut der [offiziellen pi.dev-Dokumentation](https://pi.dev/docs/usage/extensions) können Extensions vor jedem Inferenzdurchlauf Nachrichten injizieren, den Nachrichtenverlauf filtern, RAG implementieren und langfristiges Memory aufbauen. Dies geht über „erst komprimieren, wenn der Kontext voll ist“ hinaus: Du entscheidest, was in das Kontextfenster gelangt, bevor es dieses erreicht. Pi verlagert damit die Kurskonzepte „den Lauf eines agent observable und debuggable machen“ und „Kontextkontinuität bewahren“ auf die Erweiterungsoberfläche.

**3. Session tree.** Die [pi.dev-Startseite](https://pi.dev/) sagt ausdrücklich, dass „sessions are stored as trees“: Mit `/tree` kann man zu jedem historischen Knoten zurückkehren und dort fortfahren; alle Branches bleiben in derselben Datei erhalten. Dies löst das im Kurs wiederholt behandelte Problem von Kontextabbrüchen zwischen sessions – nicht durch das harte Aneinanderfügen von Zusammenfassungen, sondern durch strukturiertes Replay des Verlaufs. Branches lassen sich als HTML exportieren oder als gist teilen; Observability ergibt sich dabei gleich mit.

## Toolsubsystem: Skills und Extensions

Pis „Tools“ bestehen aus zwei Ebenen:

- **Skills**: Der Abschnitt [Skills im Sourcecode-README](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md) definiert sie eindeutig als „self-contained capability packages that the agent loads on-demand“ – bei Bedarf geladene, eigenständige Fähigkeitspakete mit Anweisungen und Tools, die dem Agent-Skills-Standard folgen. Durch progressive disclosure gelangen Details eines Skills erst beim Auslösen in den Kontext und **überladen den prompt cache nicht**. Das ist harness-Design aus Kostenperspektive: Jeder zusätzliche token im Kontext muss bei jeder Inferenz bezahlt werden. Skills nur bei Bedarf zu laden ist eine weitere Form von „Gib eine Karte, keine Bedienungsanleitung“.
- **Extensions**: TypeScript-hooks an integrierten Lifecycle-Events. Der Abschnitt [Hooks im Sourcecode-README](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md) nennt offizielle Anwendungsbeispiele: gefährliche Befehle abfangen (permission gate), beim Aufgabenwechsel einen checkpoint des Codezustands anlegen, Pfade schützen (etwa Schreibzugriffe auf `.env` verbieten), Toolausgaben vor der Übergabe an das Modell verändern und Nachrichten aus externen Quellen wie File Watcher, Webhook oder CI injizieren, um den agent zu wecken. Diese hooks-APIs werden außerdem über `@mariozechner/pi-coding-agent/hooks` exportiert. Der Community-harness [pi-agent-harness](https://github.com/LabidySabidy/pi-agent-harness) kapselt die hooks-Oberfläche weiter in fertige Erweiterungen wie skill-router, session-summary, extract-patterns und telemetry.

Extensions sind Pis wichtigste Designentscheidung: **Pi stellt den Nutzern nicht bloß einige Schalter bereit, sondern öffnet die gesamte Ereignisoberfläche der Runtime.** Memory hinzufügen? In `agent/pre-step` injizieren. Verhalten protokollieren? session-Events abonnieren. Modell-Requests ändern? Einen hook an `agent/request` hängen. Du kannst Pi seinen eigenen harness verändern lassen – das kommt der Definition eines „programmierbaren harness“ näher als jede Konfigurationsoption.

## Feedback und Validierung: Auch „Lernen“ wird Teil des harness

Pi selbst bringt kein obligatorisches Test-Gate mit – die Validierungsbefehle müssen Nutzer in AGENTS.md festhalten. Der Community-harness [pi-agent-harness](https://github.com/LabidySabidy/pi-agent-harness) strukturiert den „Feedback-Loop“ jedoch über Extensions; auch der Hooks-Abschnitt des offiziellen README liefert die Grundlage für ähnliche Mechanismen:

- **session-summary** (pi-agent-harness-Extension): Pflegt fortlaufende Einträge in `PROGRESS.md` – das Zustandssubsystem des Kurses für die Fortschrittsverfolgung bei langen Aufgaben.
- **extract-patterns** (pi-agent-harness-Extension): Sammelt Kandidaten für Lessons Learned aus sessions und hält sie in `LESSONS.md` fest. So wird „vor dem Ende jeder session einen guten Handoff vorbereiten“ von einer Konvention zum Mechanismus.
- **telemetry** (pi-agent-harness-Extension): Protokolliert token-Verbrauch, Kosten und weitere Werte – Observability.

Dasselbe Community-Repository bestätigt dieses Muster weiter: `VISION.md` (Ziel), `PROGRESS.md` (Fortschritt), `LESSONS.md` (Erkenntnisse) und `STANDARDS.md` (Standards) sind sämtlich Markdown-Dateien, die über sessions hinweg persistieren. Dies entspricht exakt dem vom Kurs empfohlenen Muster „Repository als maßgebliche Informationsquelle + Fortschrittsdatei + Handoff-Mechanismus“, wird durch Pis Erweiterungsmechanismus jedoch gebrauchsfertig.

## Zuordnung zum Kurs-Framework

Bewertung von Pi anhand der fünf Subsysteme des Kurses (subjektiv, zum Vergleich):

| Subsystem | Umsetzung von Pi | Bewertung |
| --- | --- | --- |
| Anweisungen | Abgestuftes Laden von AGENTS.md + SYSTEM.md | Klare Hierarchie, die Regeln selbst müssen jedoch vom Benutzer verfasst werden |
| Werkzeuge | Laden von Skills bei Bedarf + hooks für den gesamten Lebenszyklus von Extensions | Sehr stark; macht das Werkzeugsystem zu einer programmierbaren Oberfläche |
| Umgebung | SYSTEM.md zur Selbstbeschreibung der Umgebung; die Runtime-Umgebung wird vom Benutzer in AGENTS.md deklariert | Der Mechanismus ist offen, die Reproduzierbarkeit hängt jedoch von der Selbstbeschreibung des Benutzers ab |
| Zustand | session tree + anpassbare compaction + PROGRESS.md | Sehr stark; session-übergreifende Kontinuität und Wiederherstellbarkeit bilden den Kern |
| Feedback | Validierungsbefehle werden vom Benutzer definiert; session-summary / extract-patterns sind als Mechanismen umgesetzt | Der Mechanismus wird bereitgestellt, der Inhalt kommt vom Benutzer |

Pis Trade-offs stehen in scharfem Kontrast zu Claude Code und Codex: Claude Code baut „Memory, permissions und subagents“ gebrauchsfertig in den Kernel ein; Codex macht „Repository-Konventionen und Umgebungsisolation“ zum Standard. Pi entscheidet sich dafür, **nichts an deiner Stelle zu entscheiden** – es macht die Entscheidungshoheit zu Erweiterungspunkten. Der Preis: Du musst Extensions entweder selbst schreiben oder Pakete anderer installieren.

## Übernehmenswerte Designs

1. **Die compaction-Strategie austauschbar machen.** „Wie wird Kontext komprimiert?“ sollte in deinem harness kein fest verdrahteter Parameter, sondern eine austauschbare Strategieschnittstelle sein.
2. **Einen session tree statt harter Zusammenfassungen verwenden.** Wiederherstellung über sessions hinweg muss nicht von einer „Zusammenfassung des letzten Durchlaufs“ abhängen; strukturiertes Replay des Verlaufs ist oft das zuverlässigere Zustandssubsystem.
3. **Den prompt cache berücksichtigen.** Skills bei Bedarf laden und nicht sämtliche Regeln auf einmal in den System-Prompt packen – das ist sowohl Context Engineering als auch Kosten-Engineering.
4. **Den agent seinen eigenen harness verändern lassen.** Ist die Erweiterungsoberfläche des harness offen genug, kann die „Optimierung des agent-Verhaltens“ halbautomatisch vom agent selbst vorgenommen werden.

## Referenzen (Originaltexte / Sourcecode)

Jede Aussage lässt sich auf die folgenden Originaltexte oder den Sourcecode zurückführen; so werden Wiedergaben aus bloßer Erinnerung vermieden:

- **Offizielle pi.dev-Website**: Originale Positionierung „Ask Pi to build what you want, or install a package that does it your way“, vier anpassbare Ebenen, session tree („sessions are stored as trees“, `/tree`, Speicherung in einer Datei, HTML-Export / Teilen als gist).<br/>https://pi.dev/
- **Offizielle pi.dev-Dokumentation · Sessions**: Austauschbare compaction (topic-based / code-aware / anderes Zusammenfassungsmodell), automatische compaction und Mechanismus zur Injektion von dynamic context.<br/>https://pi.dev/docs/usage/sessions
- **Offizielle pi.dev-Dokumentation · Extensions**: Extensions können vor jedem Inferenzdurchlauf Nachrichten injizieren, den Verlauf filtern, RAG ausführen und langfristiges Memory aufbauen.<br/>https://pi.dev/docs/usage/extensions
- **Offizielle pi.dev-Dokumentation · Project Context**: replace- / append-Semantik von SYSTEM.md.<br/>https://pi.dev/docs/usage/project-context
- **Sourcecode-README des Pi Coding Agent** (badlogic/pi-mono): dreistufige Ladereihenfolge von AGENTS.md (global → Elternverzeichnis → aktuelles Verzeichnis), Auslöser von `/compact` und automatischer compaction sowie Schnittpunkt bei 20.000 token, Laden von Skills bei Bedarf und Agent-Skills-Standard, Hooks-Lebenszyklus und offizielle Anwendungsbeispiele, Programmatic Usage (JSON / RPC / SDK).<br/>https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md
- **Community-Repository pi-agent-harness**: skill-router- / session-summary- / extract-patterns- / telemetry-Extensions und das Dateisystem aus VISION.md / PROGRESS.md / LESSONS.md / STANDARDS.md.<br/>https://github.com/LabidySabidy/pi-agent-harness

Verwandte Lektionen: [Lektion 2 · Was ein harness tatsächlich ist](../../lectures/lecture-02-what-a-harness-actually-is/) ｜ [Lektion 5 · Warum lang laufende Aufgaben ihre Kontinuität verlieren](../../lectures/lecture-05-why-long-running-tasks-lose-continuity/) ｜ [Lektion 13 · Loop Engineering](../../lectures/lecture-13-loop-engineering/)
