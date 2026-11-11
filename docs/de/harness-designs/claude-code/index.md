# Analyse des harness-Designs von Claude Code

Anthropic erklärt in [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) ausdrücklich: Zuverlässigkeit entsteht durch den harness, nicht durch das Modell; ein agent muss „außerhalb des Modells“ begrenzt werden. Claude Code ist die Produktumsetzung dieses Gedankens, und Anthropic ordnet es offiziell direkt als **agentic harness** ein. Das ist keine Marketingformulierung: Claude Code ist möglicherweise der derzeit am gründlichsten öffentlich analysierte harness. Der Sourcecode ist offen, Forschungsberichte der Community sind detailliert, und nahezu alle Kernmechanismen der Kurslektionen – geschichtetes Memory, Context-compaction, permissions, hooks, subagents und session-Persistenz – wurden als vollständiges Produkt umgesetzt.

In diesem Artikel analysieren wir Claude Code anhand des Frameworks der fünf Subsysteme und konzentrieren uns darauf, wie es grundlegende harness-Konzepte wie „Kontextverwaltung“, „Verhindern verfrühter Fertigmeldungen“ und „deterministische Constraints“ umsetzt.

## Positionierung in einem Satz

Im Kern von Claude Code steht ein einfacher while-Loop: Modell aufrufen, Tool ausführen, Ergebnis beobachten und Modell erneut aufrufen. Doch **der größte Teil des Codes liegt nicht in diesem Loop, sondern in den Systemen um ihn herum** – im permission-System, in der Context-compaction-Pipeline, in Erweiterungsmechanismen, in der Orchestrierung von subagents und im session-Speicher. Das ist das Wesen eines harness: Der Loop ist das Skelett; alles um dieses Skelett herum bestimmt die Zuverlässigkeit.

## Anweisungssubsystem: Ein geschichtetes Memory-System

Claude Codes Memory-System ist sein direktester Beitrag zur harness-Theorie und entspricht den Kurslektionen „Das Repository als maßgebliche Informationsquelle“ und „Kontextkontinuität über sessions hinweg“. Die offizielle Dokumentation [How Claude remembers your project](https://code.claude.com/docs/en/memory) stellt klar: Jede session beginnt mit einem frischen Kontextfenster und transportiert Wissen über sessions hinweg durch zwei Mechanismen – CLAUDE.md-Dateien (von dir geschriebene Anweisungen) und auto memory (von Claude selbst geschriebene Notizen).

Nach Geltungsbereich teilt die offizielle Dokumentation CLAUDE.md-Dateien in vier Kategorien ein, geladen vom breitesten bis zum spezifischsten Bereich:

- **Ebene der Organisationsrichtlinien**: Zentral durch IT/DevOps verwaltet (zum Beispiel `/etc/claude-code/CLAUDE.md`), für unternehmensweite Standards.
- **Benutzerebene `~/.claude/CLAUDE.md`**: Projektübergreifende persönliche Präferenzen und Regeln.
- **Projektebene `./CLAUDE.md` oder `./.claude/CLAUDE.md`**: Maßgebliche Informationsquelle des Projekts für Engineering-Struktur, Technologie-Stack und Validierungsbefehle; wird mit dem Repository geteilt.
- **Lokale Ebene `./CLAUDE.local.md`**: Persönliche Präferenzen innerhalb eines Projekts; wird normalerweise in `.gitignore` aufgenommen und nicht committed.

Hinzu kommen zwei weitere Mechanismen:

- **Laden bei Bedarf auf Unterverzeichnisebene**: CLAUDE.md-Dateien in Unterverzeichnissen werden nicht beim Start geladen. Sie gelangen erst in den Kontext, wenn Claude Dateien in diesem Verzeichnis liest.
- **Auto memory**: Claude schreibt anhand deiner Korrekturen und Präferenzen proaktiv Notizen. Sie werden pro Repository geteilt, gelten über worktrees hinweg, und pro session werden höchstens die ersten 200 Zeilen oder 25KB geladen.

Diese vier Geltungsbereiche bilden eine **Anweisungshierarchie**: Laut offizieller Dokumentation erscheinen „spezifischere Anweisungen später im Kontext“; Projektanweisungen folgen also auf Benutzeranweisungen. Ihr Wert liegt darin, dass das Modell zu Beginn nicht in jedem Gespräch eine einzige riesige Anweisungsdatei verarbeiten muss. Stattdessen werden Anweisungen entsprechend ihrem Geltungsbereich dort geladen, wo sie gelten. Das ist die Produktantwort auf Lektion 4 „Warum eine einzige riesige Anweisungsdatei scheitert“.

## Kontextsubsystem: Eine fünfstufige compaction-Pipeline

Claude Code verwaltet Kontext mit einer **fünfstufigen compaction-Pipeline (five-layer compaction pipeline)**, nicht einfach nach dem Prinzip „zusammenfassen, wenn er voll ist“. Dieses Architekturdetail stammt aus der Sourcecode-Analyse [Dive into Claude Code](https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf) von VILA Lab. Lektion 5 erklärt, warum lang laufende Aufgaben Kontinuität verlieren; Claude Codes Antwort ist ein mehrstufiger Trichter: zuerst verlustfreies Pruning (redundante Toolresultate entfernen), dann strukturierte Verdichtung und erst zuletzt verlustbehaftete LLM-Zusammenfassungen – ergänzt durch Circuit Breaker gegen übermäßige compaction.

Dazu passt das Design des session-Speichers: **append-oriented session storage**. Der gesamte Verlauf wird an `history.jsonl` angehängt; `/resume` stellt ihn wieder her, und fork-Branches werden unterstützt. So „hinterlässt jede session vor ihrem Ende einen guten Handoff“ – nicht wegen eines guten Gedächtnisses, sondern weil die Speicherschicht append-oriented und replayable ist.

## Toolsubsystem: Vier Erweiterungsmechanismen

Claude Code unterteilt seine Erweiterungsoberfläche in vier Kategorien, von denen jede eine andere Problemklasse löst. Dieser Teil seines Designs ist besonders übernehmenswert:

- **Skills**: Laut [offizieller Dokumentation](https://code.claude.com/docs/en/skills) handelt es sich um in `SKILL.md` beschriebenes prozedurales Wissen, das anhand von Triggern automatisch durch progressive disclosure geladen wird. Skills eignen sich für Domänenwissen darüber, „wie etwas getan wird“.
- **MCP**: Das JSON-RPC-Protokoll in der [offiziellen Dokumentation](https://code.claude.com/docs/en/mcp) verbindet externe Systeme und bildet die Standardschnittstelle, über die „das Modell die Außenwelt erreichen kann“.
- **Hooks**: Deterministische Skripte an Lifecycle-Events wie `PreToolUse`, `PostToolUse` und `Stop`, beschrieben in der [offiziellen Dokumentation](https://code.claude.com/docs/en/hooks).
- **Plugins / Subagents**: Die [offizielle Dokumentation](https://code.claude.com/docs/en/sub-agents) beschreibt, wie komplexe Aufgaben an spezialisierte agents delegiert werden.

Die zentrale Designentscheidung ist die **Trennung der Verantwortlichkeiten**: CLAUDE.md verwaltet das „Was“, Skills das „Wie“, MCP das „Womit verbinden“ und hooks das „Wann erzwingen“. Vermischt ein Team diese Schichten – etwa indem es Aufgaben von MCP in CLAUDE.md schreibt –, entsteht das im Kurs beschriebene Kontextleck.

## Feedback und Validierung: Deterministische Constraints + Arbeitsteilung zwischen Mensch und agent

Lektion 10 erklärt, dass „Validierung erst zählt, wenn der vollständige Ablauf funktioniert“. Claude Code setzt dies auf zwei parallelen Wegen um:

**1. Permission-System (deterministische Constraints).** Claude Codes permissions „fragen nicht einfach bei allem nach“, sondern kombinieren sieben Modi mit einem ML-basierten Klassifikator: Operationen mit geringem Risiko werden zugelassen, solche mit hohem Risiko gemäß Richtlinie bestätigt oder abgelehnt (Architekturdetails in der [VILA-Lab-Analyse](https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf)). So wird „dem agent klare Aufgabengrenzen setzen“ aus Lektion 7 als Runtime-Zwang umgesetzt statt als Bitte im Prompt.

**2. Hooks (verfrühte Fertigmeldungen verhindern).** `PostToolUse`-hooks können nach einer Toolausführung Prüfungen erzwingen und deren Resultate in den Kontext zurückschreiben; `Stop`-hooks greifen ein, wenn der agent die Aufgabe für abgeschlossen erklärt. Dadurch werden „die Person, die arbeitet“ und „die Person, die prüft“ getrennt. [Anthropic beobachtete im harness-Artikel ausdrücklich](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents), dass agents ihre eigene Arbeit selbstbewusst lobten („confidently praised their work“). Deshalb injizieren hooks **deterministische** Prüfungen, statt der Selbsteinschätzung des Modells zu vertrauen.

**3. Subagents (Kontextisolation).** Der Gesprächsverlauf jedes subagent liegt in einer separaten sidechain-Datei und **bläht den Kontext des Eltern-agent nicht auf** (siehe [VILA-Lab-Analyse](https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf)). Das verbindet „Aufgabengrenzen“ mit „Kontextisolation“: Beim Aufteilen einer Aufgabe wird zugleich die Kontextverschmutzung isoliert.

## Observability und session-Persistenz

Claude Codes Logs sind vollständige append-oriented Aufzeichnungen (history.jsonl). Zusammen mit expliziten Befehlen wie `/compact`, `/clear` und `/init` kannst du den Kontextzustand proaktiv verwalten, statt passiv zu warten, bis er voll ist. `/init` macht sogar „den agent vor jeder Arbeit initialisieren“ aus Lektion 6 zu einem Befehl. Laut [offizieller Dokumentation](https://code.claude.com/docs/en/memory) analysiert er die Codebase automatisch und erstellt eine anfängliche CLAUDE.md mit Build-Befehlen, Testanweisungen und Engineering-Konventionen.

## Zuordnung zum Kurs-Framework

| Subsystem | Umsetzung von Claude Code | Bewertung |
| --- | --- | --- |
| Anweisungen | Schichtung nach Geltungsbereich (Organisation/Benutzer/Projekt/lokal) + automatisches Memory | Geschichtetes Memory ist eine Referenzimplementierung |
| Werkzeuge | Skills + MCP + hooks + subagents als vier Erweiterungstypen | Klare Trennung der Verantwortlichkeiten; ein zentraler Pluspunkt |
| Umgebung | Projekteinstellungen + settings.json | Basiert auf der Selbstbeschreibung des Benutzers in CLAUDE.md |
| Zustand | Append-only session-Speicher + fünfstufige compaction + resume/fork | Sehr stark; eine Referenzimplementierung für die Kontinuität lang laufender Aufgaben |
| Feedback | Permission-Klassifikator + durch PostToolUse-hooks erzwungene Prüfungen | Macht die Verhinderung verfrühter Fertigmeldungen zu einem deterministischen Mechanismus |

## Übernehmenswerte Designs

1. **Anweisungen nach Geltungsbereich schichten**, statt sie in einer Datei anzuhäufen. CLAUDE.md auf Verzeichnisebene ist eine elegante Umsetzung von „nah am Geltungsort laden“.
2. **compaction ist ein abgestufter Trichter**: erst verlustfrei, dann verlustbehaftet; nicht sofort alles zusammenfassen.
3. **hooks für deterministische Prüfungen verwenden**: Verfrühte Fertigmeldungen werden durch Runtime-Zwang verhindert, nicht durch Bitten im Prompt.
4. **Kontext von subagents isolieren**: Beim Aufteilen einer Aufgabe auch den Kontext trennen, damit Resultate von Teilaufgaben den Haupt-Loop nicht verunreinigen.
5. **session-Speicher append-oriented und replayable gestalten**: Handoffs werden durch die Speicherschicht gewährleistet, nicht durch Memory.

## Referenzen (Originaltexte / Sourcecode)

Jede Aussage lässt sich auf die folgenden Originaltexte oder den Sourcecode zurückführen; so werden Wiedergaben aus bloßer Erinnerung vermieden:

- **Offizielle Claude-Code-Dokumentation · Memory**: Frischer Kontext für jede session, vier Geltungsbereiche von CLAUDE.md, Laden bei Bedarf nach Unterverzeichnis, auto memory (200 Zeilen / 25KB) und Erzeugung von CLAUDE.md durch `/init`.<br/>https://code.claude.com/docs/en/memory
- **Offizielle Claude-Code-Dokumentation · Skills / MCP / Hooks / Sub-agents**: Definitionen der vier Erweiterungsmechanismen und ihrer Events (PreToolUse / PostToolUse / Stop).<br/>https://code.claude.com/docs/en/skills ｜ https://code.claude.com/docs/en/mcp ｜ https://code.claude.com/docs/en/hooks ｜ https://code.claude.com/docs/en/sub-agents
- **VILA Lab《Dive into Claude Code》** (Sourcecode-Analyse): fünfstufige compaction-Pipeline, sieben permission-Modi + ML-Klassifikator, sidechain-subagents und append-oriented session-Speicher in history.jsonl.<br/>https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf
- **Anthropic《Effective harnesses for long-running agents》**: Quelle für die Aussagen „Zuverlässigkeit entsteht durch den harness statt durch das Modell“, agents loben ihre eigene Arbeit selbstbewusst und hooks sollten zur Validierung verwendet werden.<br/>https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- **Claude Code Full Stack Guide** (Community, Schichten CLAUDE.md / Skills / MCP / Subagents / Hooks): ergänzende Lektüre zur Trennung der Verantwortlichkeiten zwischen Erweiterungsmechanismen.<br/>https://jsmanifest.com/claude-code-full-stack-guide

Verwandte Lektionen: [Lektion 3 · Warum das Repository zur maßgeblichen Informationsquelle werden muss](../../lectures/lecture-03-why-the-repository-must-become-the-system-of-record/) ｜ [Lektion 9 · Warum agents zu früh den Sieg erklären](../../lectures/lecture-09-why-agents-declare-victory-too-early/) ｜ [Lektion 10 · Warum End-to-End-Tests die Ergebnisse verändern](../../lectures/lecture-10-why-end-to-end-testing-changes-results/)
