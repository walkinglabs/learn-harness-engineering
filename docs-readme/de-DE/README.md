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

> **Ein projektbasierter Kurs über den Aufbau von Umgebungen, Zustandsverwaltung, Verifizierung und Kontrollmechanismen, die KI-Coding-Agenten zuverlässig machen.**

Learn Harness Engineering ist ein Kurs, der sich der Entwicklung von KI-Coding-Agenten widmet. Wir haben die fortschrittlichsten Theorien und Praktiken des Harness Engineering in der Branche eingehend studiert und zusammengefasst. Unsere Kernreferenzen umfassen:

> **🆕 August-2026-Update: Analysen von Frontier-Harness-Designs** — neuer Abschnitt mit 4 Analysen:
>
> - **Neuer Abschnitt** [Analysen von Frontier-Harness-Designs](../../docs/de/harness-designs/index.md) — Wende das Fünf-Subsystem-Framework des Kurses (Anweisungen, Werkzeuge, Umgebung, Zustand, Feedback) an, um mittels Reverse Engineering herauszufinden, wie vier Frontier-Produkte echte Harnesses aufbauen.
> - **Pi** [Wie Pi sein Harness aufbaut](../../docs/de/harness-designs/pi/index.md) — ein minimaler Kernel, programmierbare Erweiterung und Context Engineering hinter „Bitte Pi, das zu bauen, was du möchtest“.
> - **Claude Code** [Wie Claude Code sein Harness aufbaut](../../docs/de/harness-designs/claude-code/index.md) — vierstufiges Gedächtnis, fünfstufige Komprimierung, Hooks und Sub-Agent-Isolation.
> - **Codex** [Wie Codex sein Harness aufbaut](../../docs/de/harness-designs/codex/index.md) — das Repository als Source of Truth, AGENTS.md als Verzeichnisseite und Worktree-Isolation.
> - **DeepSeek** [Wie DeepSeek sein Harness aufbaut](../../docs/de/harness-designs/deepseek/index.md) — „Alles ist ein Plugin“, Capability Seams und eine Event-Pipeline.
> - **Alle 15 Sprachen** — vollständige Übersetzungsabdeckung für alle unterstützten Sprachen.
>
> **Kernaussage:** Der Kurs vermittelt dir ein Framework; diese Analysen zeigen dir, wie dieselben Prinzipien in produktiven Harnesses tatsächlich umgesetzt werden.
>
> **🆕 August-2026-Update: Graph Engineering (Graph Engineering)** — 1 neue Vorlesung + 1 neues Projekt:
>
> - **Lektion 14** [Von Einzel-Loops zu Graph Engineering](../../docs/de/lectures/lecture-14-graph-engineering/index.md): warum ein einzelner Loop unweigerlich zu einem Graphen wird — die vier gestapelten Ebenen (prompt → context → loop → graph) und der Ort des Harness darin, die vier Teile eines Graphen (Knoten, Kanten, Shared State, Routing), warum Checkpoints innerhalb eines Loops die drei strukturellen Fehlschläge im Maßstab (Goodhart, Blindheit nach oben, Konflikt) nicht retten können, die framework-unabhängigen sechs Schritte zum Bauen deines ersten Graphen, der Unterschied zwischen Graph und Workflow, Anker, die Situation der Open-Source-Projekte vor vs. nach der Veröffentlichung, die Orchestration Tax — und wann ein Graph wirklich einen Graphen wert ist.
> - **Projekt 08** [Zeichne deinen Workflow als Graph](../../docs/de/projects/project-08-graph-engineering-first-graph/index.md): drei fortschreitende Experimente — den Maker-Checker-Loop als expliziten Graphen zeichnen, einen parallelen Fan-out/Fan-in-Knoten hinzufügen, eine bedingte Rollback-Kante und einen menschlichen Freigabe-Knoten hinzufügen.
>
> **Kernaussage:** Ein Loop ist ein Graph mit nur einem Knoten. Sobald eine Aufgabe Arbeitsteilung, Parallelität, Shared State, Verifikation und Wiederherstellung braucht — ist sie kein Loop mehr, sondern ein Graph.
>
> **🆕 Juli-2026-Update: Loop Engineering (Loop Engineering)** — 1 neue Vorlesung + 1 neues Projekt + Code-Vorlagen:
>
> - **Lektion 13** [Warum du aufhören solltest, deinen Agenten zu prompten](../../docs/de/lectures/lecture-13-loop-engineering/index.md): von `/goal` zu den sechs Primitiven des Loop Engineering (automations, worktrees, skills, connectors, sub-agents, external state), Generator/Evaluator-Trennung, vier stille Kosten und der schrittweise Aufbau deines ersten Loops.
> - **Projekt 07** [Baue deinen ersten automatisierten Loop](../../docs/de/projects/project-07-loop-engineering-first-loop/index.md): drei fortschreitende Experimente — Goal-Loop, Timer-Loop, Maker-Checker-Loop. Vergleiche manuell vs. automatisiert, miss die Reduktion der Eingriffe, lerne, den Loop zu verlassen.
> - **Code-Vorlagen**: `goal-template.md`, `loop-state-template.md`, `maker-prompt.md`, `checker-prompt.md` — Plug-and-Play-Vorlagen zum Bauen von Loops.
>
> **Kernaussage:** Harness Engineering baut das Auto. Loop Engineering entwirft die Straße, auf der es fährt — und du entwirfst diese Straße von außerhalb des Wagens.

- [OpenAI: Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)
- [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Anthropic: Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [Awesome Harness Engineering](https://github.com/walkinglabs/awesome-harness-engineering)

> **Schneller Einstieg?** Der Skill [`skills/harness-creator/`](../../skills/harness-creator/) kann Ihnen helfen, in Minuten ein produktionsreifes Harness (AGENTS.md, Feature-Listen, init.sh, Verifizierungs-Workflows) für Ihr eigenes Projekt zu erstellen.

---

## Inhaltsverzeichnis

- [Visuelle Vorschau](#visuelle-vorschau)
- [Was Harness Engineering wirklich bedeutet](#was-harness-engineering-wirklich-bedeutet)
- [Schnellstart: Verbessern Sie Ihren Agenten noch heute](#schnellstart-verbessern-sie-ihren-agenten-noch-heute)
- [Abschlussprojekt: Eine echte App](#abschlussprojekt-eine-echte-app)
- [Lernpfad](#lernpfad)
- [Lehrplan](#lehrplan)
- [Skills](#skills)
- [Weitere Kurse](#weitere-kurse)

---

## Visuelle Vorschau

### Kurs-Startseite
> Ein umfassender Kursüberblick und eine Einführung in die Kernphilosophien, die einen klaren Einstiegspfad bieten.

![Vorschau der Kurs-Startseite](../../docs/public/screenshots/readme/zh-home.png)

### Immersive Vorlesungen
> Tiefe Einblicke in reale Problemstellungen und praktische Projekte (wie Projekt 01) für ein immersives Lernerlebnis.

![Vorschau der Kurs-Vorlesung](../../docs/public/screenshots/readme/zh-lecture-01.png)

### Vorlagen-Bibliothek
> Vorlagen und Referenzkonfigurationen, die entwickelt wurden, um häufige Fallstricke bei der Entwicklung von Multi-Turn-KI-Agenten zu lösen, wie Kontextverlust und vorzeitiger Aufgabenabschluss.

![Vorschau der Vorlagen-Bibliothek](../../docs/public/screenshots/readme/zh-resources.png)

## PDF-Kursbücher

Das Repository enthält nun eine PDF-Build-Pipeline für die Kursinhalte.

- Führen Sie `npm run pdf:build` aus, um englische und chinesische PDFs lokal zu generieren.
- Die Ausgabedateien werden in `artifacts/pdfs/` geschrieben.
- Führen Sie `npm run screenshots:readme` aus, wenn Sie die README-Vorschaubilder aktualisieren möchten.
- Der GitHub Actions-Workflow [`release-course-pdfs.yml`](../../.github/workflows/release-course-pdfs.yml) kann die PDFs erstellen und auf GitHub Releases veröffentlichen.

---

## Das Modell ist klug, das Harness macht es zuverlässig

Es gibt eine harte Wahrheit, die die meisten Menschen auf die harte Tour lernen: **Das stärkste Modell der Welt wird bei echten Engineering-Aufgaben dennoch scheitern, wenn Sie keine geeignete Umgebung dafür aufbauen.**

Sie haben das wahrscheinlich selbst erlebt. Sie geben Claude oder GPT eine Aufgabe in Ihrem Repo. Es beginnt gut — liest Dateien, schreibt Code, sieht produktiv aus. Dann geht etwas schief. Es überspringt einen Schritt. Es zerstört einen Test. Es sagt „fertig", aber nichts funktioniert tatsächlich. Sie verbringen mehr Zeit mit der Behebung, als wenn Sie es selbst gemacht hätten.

Das ist kein Modellproblem. Es ist ein Harness-Problem.

Die Beweise sind eindeutig. Anthropic führte ein kontrolliertes Experiment durch: gleiches Modell (Opus 4.5), gleicher Prompt („baue einen 2D-Retro-Spieleditor"). Ohne Harness gab es 9 $ in 20 Minuten aus und produzierte etwas, das nicht funktionierte. Mit einem vollständigen Harness (Planer + Generator + Evaluierer) gab es 200 $ in 6 Stunden aus und baute ein Spiel, das man tatsächlich spielen konnte. Das Modell hat sich nicht geändert. Das Harness schon.

OpenAI berichtete dasselbe mit Codex: in einem gut geharnischten Repository wechselt dasselbe Modell von „unzuverlässig" zu „zuverlässig". Keine marginale Verbesserung — ein qualitativer Sprung.

**Dieser Kurs bringt Ihnen bei, wie Sie diese Umgebung aufbauen.**

```text
                    DAS HARNESS-MUSTER
                    ==================

    Sie --> Aufgabe geben --> Agent liest Harness-Dateien --> Agent führt aus
                                                              |
                                                    Harness steuert jeden Schritt:
                                                    |
                                                    +--> Anweisungen: was zu tun ist, in welcher Reihenfolge
                                                    +--> Umfang:       ein Feature nach dem anderen, keine Übergriffe
                                                    +--> Zustand:      Fortschrittslog, Feature-Liste, Git-Verlauf
                                                    +--> Verifizierung: Tests, Lint, Typprüfung, Smoke-Runs
                                                    +--> Lebenszyklus: Initialisierung am Start, sauberer Zustand am Ende
                                                    |
                                                    v
                                               Agent stoppt nur, wenn
                                               Verifizierung bestanden ist
```

---

## Was Harness Engineering wirklich bedeutet

Harness Engineering handelt davon, eine vollständige Arbeitsumgebung um das Modell herum aufzubauen, damit es zuverlässige Ergebnisse liefert. Es geht nicht darum, bessere Prompts zu schreiben. Es geht darum, das System zu entwerfen, in dem das Modell arbeitet.

Ein Harness hat fünf Subsysteme:

```text
    ┌─────────────────────────────────────────────────────────────────┐
    │                       DAS HARNESS                               │
    │                                                                 │
    │   ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
    │   │ Anweisungen  │  │   Zustand    │  │   Verifizierung      │ │
    │   │              │  │              │  │                      │ │
    │   │ AGENTS.md    │  │ progress.md  │  │ Tests + Lint         │ │
    │   │ CLAUDE.md    │  │ feature_list │  │ Typprüfung           │ │
    │   │ feature_list │  │ git log      │  │ Smoke-Runs           │ │
    │   │ docs/        │  │ Session-Übg. │  │ E2E-Pipeline         │ │
    │   └──────────────┘  └──────────────┘  └──────────────────────┘ │
    │                                                                 │
    │   ┌──────────────┐  ┌──────────────────────────────────────┐   │
    │   │   Umfang     │  │       Session-Lebenszyklus            │   │
    │   │              │  │                                      │   │
    │   │ ein Feature  │  │ init.sh am Start                     │   │
    │   │ nach dem and.│  │ Clean-State-Checkliste am Ende       │   │
    │   │ Definition   │  │ Übergabenotiz für nächste Session    │   │
    │   │ von Fertig   │  │ Commit nur wenn sicher fortsetzbar   │   │
    │   └──────────────┘  └──────────────────────────────────────┘   │
    │                                                                 │
    └─────────────────────────────────────────────────────────────────┘

    Das MODELL entscheidet, welcher Code geschrieben wird.
    Das HARNESS steuert, wann, wo und wie es geschrieben wird.
    Das Harness macht das Modell nicht schlauer.
    Es macht die Ausgabe des Modells zuverlässig.
```

Jedes Subsystem hat eine Aufgabe:

- **Instructions** — Dem Agenten sagen, was zu tun ist, in welcher Reihenfolge und was er lesen soll, bevor er beginnt. Nicht eine riesige Datei; eine progressive Enthüllungsstruktur, die der Agent nach Bedarf navigiert.
- **State** — Verfolgen, was erledigt wurde, was in Bearbeitung ist und was als Nächstes ansteht. Auf der Festplatte gespeichert, damit die nächste Session genau dort ansetzt, wo die letzte aufgehört hat.
- **Verification** — Nur eine bestehende Testsuite gilt als Nachweis. Der Agent kann keinen Erfolg melden ohne ausführbaren Beweis.
- **Scope** — Den Agenten auf ein Feature gleichzeitig beschränken. Keine Übergriffe. Kein halbfertiges Abschließen von drei Dingen. Kein Umschreiben der Feature-Liste, um unfertige Arbeit zu verbergen.
- **Session Lifecycle** — Initialisierung am Anfang. Aufräumen am Ende. Einen sauberen Neustartpfad für die nächste Sitzung hinterlassen.

---

## Warum dieser Kurs existiert

Die Frage ist nicht „Können Modelle Code schreiben?" Sie können. Die Frage ist: **Können sie zuverlässig echte Engineering-Aufgaben in echten Repositories über mehrere Sessions hinweg absolvieren, ohne ständige menschliche Überwachung?**

Im Moment lautet die Antwort: nicht ohne ein Harness.

```text
    OHNE HARNESS                              MIT HARNESS
    ===========                               ===========

    Session 1: Agent schreibt Code            Session 1: Agent liest Anweisungen
              Agent zerstört Tests                      Agent führt init.sh aus
              Agent sagt "fertig"                       Agent arbeitet an einem Feature
              Sie reparieren manuell                    Agent verifiziert vor Fertig-Meldung
                                                         Agent aktualisiert Fortschrittslog
    Session 2: Agent startet neu                      Agent committet sauberen Zustand
              Agent hat keine Erinnerung
              an vorherige Session              Session 2: Agent liest Fortschrittslog
              Agent macht Arbeit neu                   Agent setzt genau dort fort
              oder macht etwas ganz anderes            Agent bearbeitet das unfertige Feature
              Sie reparieren wieder                    Sie überprüfen, statt zu retten

    Ergebnis: Sie verbringen mehr Zeit         Ergebnis: Agent erledigt die Arbeit,
              mit Aufräumen, als wenn                   Sie verifizieren das Ergebnis
              Sie es selbst gemacht hätten
```

Die Fragen, die dieser Kurs wirklich interessieren:

- Welche Harness-Designs verbessern die Aufgabenabschlussraten?
- Welche Designs reduzieren Nacharbeit und falsche Abschlüsse?
- Welche Mechanismen halten langlaufende Aufgaben stetig voran?
- Welche Strukturen halten das System nach mehreren Agenten-Läufen wartbar?

---

## Kurscurriculum & Dokumentation

Die vollständigen Kursmaterialien finden Sie auf der **[Dokumentations-Website](https://walkinglabs.github.io/learn-harness-engineering/)**.

Das Curriculum ist in drei Teile gegliedert:

1. **Vorlesungen**: 14 konzeptionelle Einheiten, die die Theorie hinter dem Harness Engineering erklären.
2. **Projekte**: 8 praktische Projekte, bei denen Sie einen agentenbasierten Arbeitsbereich von Grund auf neu aufbauen.
3. **Vorlagen-Bibliothek**: Kopierfertige Vorlagen (`AGENTS.md`, `feature_list.json`, `init.sh` usw.), die Sie noch heute in Ihren eigenen Repositories verwenden können.

---

## Schnellstart: Verbessern Sie Ihren Agenten noch heute

Sie müssen nicht alle 14 Vorlesungen lesen, bevor Sie einen Nutzen ziehen. Wenn Sie bereits einen Coding-Agenten in einem echten Projekt einsetzen, können Sie ihn jetzt sofort verbessern.

Die Idee ist einfach: Anstatt nur Prompts zu schreiben, geben Sie Ihrem Agenten einen Satz strukturierter Dateien, die definieren, was zu tun ist, was bereits erledigt ist und wie die Arbeit verifiziert wird. Diese Dateien befinden sich in Ihrem Repo, sodass jede Session vom gleichen Zustand ausgeht.

```text
    IHR PROJEKT-ROOT
    ├── AGENTS.md              <-- das Betriebshandbuch des Agenten
    ├── CLAUDE.md              <-- (Alternative, wenn Sie Claude Code verwenden)
    ├── init.sh                <-- führt install + verify + start aus
    ├── feature_list.json      <-- welche Features existieren, welche erledigt sind
    ├── claude-progress.md     <-- was in jeder Session passiert ist
    └── src/                   <-- Ihr tatsächlicher Code
```

Laden Sie sich die Starter-Vorlagen aus der [Vorlagen-Bibliothek](https://walkinglabs.github.io/learn-harness-engineering/en/resources/) herunter und fügen Sie sie in Ihr Projekt ein. Das war's. Vier Dateien, und Ihre Agenten-Sessions werden bereits deutlich stabiler sein als mit Prompts allein.

---

## Abschlussprojekt: Eine echte App

Alle acht Kursprojekte drehen sich um dasselbe Produkt: **eine Electron-basierte Desktop-App für persönliches Wissensmanagement**.

```text
    ┌─────────────────────────────────────────────────────┐
    │          Wissensdatenbank-Desktop-App                │
    │                                                     │
    │  ┌──────────────┐  ┌──────────────────────────────┐│
    │  │ Dokumenten-  │  │       F&A-Panel              ││
    │  │ liste        │  │                              ││
    │  │ doc-001.md   │  │  F: Was ist Harness Eng.?   ││
    │  │ doc-002.md   │  │  A: Die Umgebung, die um    ││
    │  │ doc-003.md   │  │     ein Agentenmodell...     ││
    │  │ ...          │  │     [Zitat: doc-002.md]      ││
    │  └──────────────┘  └──────────────────────────────┘│
    │                                                     │
    │  ┌─────────────────────────────────────────────────┐│
    │  │ Statusleiste: 42 Doks | 38 indiziert | letzte Sync 3m ││
    │  └─────────────────────────────────────────────────┘│
    └─────────────────────────────────────────────────────┘

    Kernfunktionen:
    ├── Lokale Dokumente importieren
    ├── Eine Dokumentenbibliothek verwalten
    ├── Dokumente verarbeiten und indizieren
    ├── KI-gestützte F&A über importierte Inhalte ausführen
    └── Fundierte Antworten mit Quellnachweisen liefern
```

Dieses Projekt wurde gewählt, weil es hohen praktischen Nutzen, ausreichende reale Produktkomplexität und ein gutes Szenario für die Beobachtung von Harness-Verbesserungen (Vorher/Nachher) verbindet.

Jedes Kursprojekt (Starter/Lösung) ist eine vollständige Kopie dieser Electron-App im jeweiligen Entwicklungsstadium. Der Starter von P(N+1) wird aus der Lösung von P(N) abgeleitet — die App entwickelt sich weiter, während Ihre Harness-Fähigkeiten wachsen.

---

## Lernpfad

Der Kurs ist für die chronologische Abarbeitung konzipiert. Jede Phase baut auf der vorherigen auf.

```text
    Phase 1: DAS PROBLEM ERKENNEN          Phase 2: DAS REPO STRUKTURIEREN
    ==============================         ===============================

    L01  Starke Modelle ≠ zuverlässige    L03  Repository als einzige
         Ausführung                             Wahrheitsquelle
    L02  Was ein Harness wirklich bedeutet
                                       L04  Anweisungen auf mehrere
         |                                   Dateien aufteilen, nicht eine riesige
         v
    P01  Nur-Prompt vs.                        |
         regelbasierter Vergleich               v
                                               P02  Agentenlesbarer Arbeitsbereich


    Phase 3: SESSIONS VERBINDEN           Phase 4: FEEDBACK & UMFANG
    ===========================          =========================

    L05  Kontext über Sessions hinweg     L07  Klare Aufgabengrenzen ziehen
         lebendig halten
                                       L08  Feature-Listen als Harness-
    L06  Vor jeder Agenten-Session              Primitive
         initialisieren
                                               |
         |                                     v
         v                                     P04  Laufzeit-Feedback zur
    P03  Multi-Session-Kontinuität               Korrektur des Agentenverhaltens


    Phase 5: VERIFIZIERUNG               Phase 6: ALLES ZUSAMMENFÜHREN
    =======================              ==============================

    L09  Agenten davon abhalten,          L11  Laufzeit des Agenten
         zu früh Erfolg zu melden              beobachtbar machen

    L10  Vollständiger Pipeline-Lauf =    L12  Saubere Übergabe am Ende
         echte Verifizierung                    jeder Session

         |                                     |
         v                                     v
    P05  Agent verifiziert seine           P06  Ein vollständiges Harness
         eigene Arbeit                           aufbauen (Abschlussprojekt)


    Phase 7: LOOP AUTOMATISIEREN
    ============================
    L13  Hör auf, deinen Agenten zu
         prompten — designe Loops
         |
         v
    P07  Baue deinen ersten automatisierten
         Loop (Goal-Loop, Timer-Loop,
         Maker-Checker-Loop)

    Phase 8: SYSTEM STRUKTURIEREN
    ==============================
    L14  Zeichne das System als Graphen —
         Knoten, Kanten, Shared State, Routing
         |
         v
    P08  Zeichne deinen Workflow als Graphen
         (expliziter Graph, paralleles
         Fan-out/Fan-in, Rollback-Kanten,
         Mensch+Maschine)
```

Jede Phase dauert etwa eine Woche, wenn Sie nebenbei lernen. Wenn Sie schneller vorgehen möchten, können die Phasen 1–3 an einem langen Wochenende absolviert werden.

---

## Lehrplan

### Vorlesungen — 14 konzeptionelle Einheiten, die jeweils eine Kernfrage beantworten

*Lesen Sie den vollständigen Text jeder Vorlesung auf der [Dokumentations-Website](https://walkinglabs.github.io/learn-harness-engineering/).*

| Session | Frage | Kernidee |
|---------|-------|----------|
| [L01](../../docs/de/lectures/lecture-01-why-capable-agents-still-fail/index.md) | Warum scheitern starke Modelle dennoch bei echten Aufgaben? | Die Lücke zwischen Benchmarks und echtem Engineering |
| [L02](../../docs/de/lectures/lecture-02-what-a-harness-actually-is/index.md) | Was bedeutet „Harness" eigentlich? | Fünf Subsysteme: Instructions, State, Verification, Scope, Lifecycle |
| [L03](../../docs/de/lectures/lecture-03-why-the-repository-must-become-the-system-of-record/index.md) | Warum muss das Repo die einzige Quelle der Wahrheit sein? | Wenn der Agent es nicht sehen kann, existiert es nicht |
| [L04](../../docs/de/lectures/lecture-04-why-one-giant-instruction-file-fails/index.md) | Warum scheitert eine einzige riesige Instruktionsdatei? | Progressive Enthüllung: eine Karte geben, keine Enzyklopädie |
| [L05](../../docs/de/lectures/lecture-05-why-long-running-tasks-lose-continuity/index.md) | Warum verlieren langlaufende Aufgaben ihre Kontinuität? | Fortschritt auf der Festplatte speichern; dort fortfahren, wo man aufgehört hat |
| [L06](../../docs/de/lectures/lecture-06-why-initialization-needs-its-own-phase/index.md) | Warum braucht die Initialisierung eine eigene Phase? | Die Umgebung auf Funktionsfähigkeit prüfen, bevor der Agent mit der Arbeit beginnt |
| [L07](../../docs/de/lectures/lecture-07-why-agents-overreach-and-under-finish/index.md) | Warum greifen Agenten über und schließen unvollständig ab? | Ein Feature gleichzeitig; explizite Definition von „Fertig" |
| [L08](../../docs/de/lectures/lecture-08-why-feature-lists-are-harness-primitives/index.md) | Warum sind Feature-Listen Harness-Primitiven? | Maschinenlesbare Scope-Grenzen, die der Agent nicht ignorieren kann |
| [L09](../../docs/de/lectures/lecture-09-why-agents-declare-victory-too-early/index.md) | Warum melden Agenten zu früh den Erfolg? | Verifizierungslücken: Vertrauen ≠ Korrektheit |
| [L10](../../docs/de/lectures/lecture-10-why-end-to-end-testing-changes-results/index.md) | Warum ändert End-to-End-Testing die Ergebnisse? | Nur ein vollständiger Pipeline-Lauf gilt als echte Verifizierung |
| [L11](../../docs/de/lectures/lecture-11-why-observability-belongs-inside-the-harness/index.md) | Warum gehört Observability in das Harness? | Wenn Sie nicht sehen können, was der Agent getan hat, können Sie nicht reparieren, was er zerstört hat |
| [L12](../../docs/de/lectures/lecture-12-why-every-session-must-leave-a-clean-state/index.md) | Warum muss jede Session einen sauberen Zustand hinterlassen? | Der Erfolg der nächsten Session hängt vom Aufräumen dieser Session ab |
| [L13](../../docs/de/lectures/lecture-13-loop-engineering/index.md) | Warum musst du aufhören, deinen Agenten zu prompten? | Von manuellen Prompts zu autonomen Loops — Ziel-Loops, Timer-Loops, Maker-Checker-Trennung |
| [L14](../../docs/de/lectures/lecture-14-graph-engineering/index.md) | Warum entwickelt sich ein einzelner Loop zu einem Graphen? | Von Einzel-Loops zu Graph Engineering — Knoten, Kanten, Shared State, Routing — und wann ein Graph wirklich einen Graphen wert ist |

### Projekte — 8 praktische Projekte, die Vorlesungsmethoden auf dieselbe Electron-App anwenden

| Projekt | Was Sie tun | Harness-Mechanismus |
|---------|-------------|---------------------|
| [P01](../../docs/de/projects/project-01-baseline-vs-minimal-harness/index.md) | Dieselbe Aufgabe zweimal ausführen: nur Prompt vs. regelnbasiert | Minimales Harness: AGENTS.md + init.sh + feature_list.json |
| [P02](../../docs/de/projects/project-02-agent-readable-workspace/index.md) | Das Repo umstrukturieren, damit der Agent es lesen kann | Agentenlesbarer Arbeitsbereich + persistente Zustandsdateien |
| [P03](../../docs/de/projects/project-03-multi-session-continuity/index.md) | Den Agenten dort fortfahren lassen, wo er aufgehört hat | Fortschrittsprotokoll + Session-Übergabe + Multi-Session-Kontinuität |
| [P04](../../docs/de/projects/project-04-incremental-indexing/index.md) | Den Agenten davon abhalten, zu viel oder zu wenig zu tun | Laufzeit-Feedback + Scope-Kontrolle + inkrementelle Indizierung |
| [P05](../../docs/de/projects/project-05-grounded-qa-verification/index.md) | Den Agenten seine eigene Arbeit verifizieren lassen | Selbstverifizierung + fundierte Q&A + evidenzbasierter Abschluss |
| [P06](../../docs/de/projects/project-06-runtime-observability-and-debugging/index.md) | Ein vollständiges Harness von Grund auf neu aufbauen (Abschlussprojekt) | Vollständiges Harness: alle Mechanismen + Observability + Ablationsstudie |
| [P07](../../docs/de/projects/project-07-loop-engineering-first-loop/index.md) | Baue deinen ersten automatisierten Loop | Ziel-Loop, Timer-Loop, Maker-Checker-Trennung, Loop-State-Management |
| [P08](../../docs/de/projects/project-08-graph-engineering-first-graph/index.md) | Zeichne deinen Workflow als Graph | Explizite Knoten/Kanten/Status/Routing, paralleles Fan-out/Fan-in, Rollback-Kanten, Mensch+Maschine-Freigabe |

```text
    PROJEKTENTWICKLUNG
    ==================

    P01  Nur-Prompt vs. regelbasiert       Sie erkennen das Problem
     |
     v
    P02  Agentenlesbarer Arbeitsbereich     Sie restrukturieren das Repo
     |
     v
    P03  Multi-Session-Kontinuität          Sie verbinden Sessions
     |
     v
    P04  Laufzeit-Feedback & Umfang         Sie fügen Feedback-Schleifen hinzu
     |
     v
    P05  Selbstverifizierung                Sie lassen den Agenten sich selbst prüfen
     |
     v
    P06  Vollständiges Harness (Abschluss)  Sie bauen das Gesamtsystem
     |
     v
    P07  Ihr erster automatischer Loop      Sie verlassen den Loop
     |
     v
    P08  Zeichnen Sie Ihren Workflow als
         Graph                              Sie zeichnen das System als Graph

    Die Lösung jedes Projekts wird zum Starter des nächsten Projekts.
    Die App entwickelt sich weiter. Ihre Harness-Fähigkeiten wachsen mit.
```

### Vorlagen-Bibliothek

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

## Der Lebenszyklus einer Agenten-Session

Eine der Kernideen dieses Kurses: **Die Session eines Agenten sollte einem strukturierten Lebenszyklus folgen, keinem Freifür-alle.** So sieht das aus:

```text
    AGENTEN-SESSION-LEBENSZYKLUS
    ============================

    ┌──────────────────────────────────────────────────────────────────┐
    │  START                                                          │
    │                                                                  │
    │  1. Agent liest AGENTS.md / CLAUDE.md                           │
    │  2. Agent führt init.sh aus (Installieren, Verifizieren, Check) │
    │  3. Agent liest claude-progress.md (was letztes Mal passierte)  │
    │  4. Agent liest feature_list.json (was erledigt, was als Nächstes)│
    │  5. Agent prüft git log (letzte Änderungen)                     │
    │                                                                  │
    │  AUSWAHL                                                        │
    │                                                                  │
    │  6. Agent wählt genau EIN unfertiges Feature aus                │
    │  7. Agent arbeitet nur an diesem Feature                        │
    │                                                                  │
    │  AUSFÜHRUNG                                                     │
    │                                                                  │
    │  8. Agent implementiert das Feature                             │
    │  9. Agent führt Verifizierung aus (Tests, Lint, Typprüfung)    │
    │  10. Wenn Verifizierung fehlschlägt: korrigieren und neu ausf. │
    │  11. Wenn Verifizierung bestanden: Beweise dokumentieren        │
    │                                                                  │
    │  ABSCHLUSS                                                      │
    │                                                                  │
    │  12. Agent aktualisiert claude-progress.md                      │
    │  13. Agent aktualisiert feature_list.json                       │
    │  14. Agent dokumentiert, was noch kaputt oder unverifiziert ist │
    │  15. Agent committet (nur wenn sicher fortsetzbar)              │
    │  16. Agent hinterlässt sauberen Neustartpfad für nächste Session│
    │                                                                  │
    └──────────────────────────────────────────────────────────────────┘

    Das Harness steuert jeden Übergang in diesem Lebenszyklus.
    Das Modell entscheidet, welcher Code bei jedem Schritt geschrieben wird.
    Ohne Harness wird Schritt 9 zu „Agent sagt, es sieht gut aus."
    Mit Harness ist Schritt 9: „Tests bestanden, Lint sauber, Typen geprüft."
```

---

## Für wen ist dieser Kurs?

Dieser Kurs richtet sich an:

- Entwickler, die bereits Coding-Agenten verwenden und mehr Stabilität und Qualität möchten
- Forscher oder Entwickler, die ein systematisches Verständnis des Harness-Designs erwerben möchten
- Tech-Leads, die verstehen möchten, wie Umgebungsdesign die Agentenleistung beeinflusst

Dieser Kurs richtet sich nicht an:

- Personen, die eine Einführung in KI ohne Programmierung suchen
- Personen, die sich nur für Prompts interessieren und keine echten Implementierungen planen
- Lernende, die nicht bereit sind, Agenten in echten Repositories arbeiten zu lassen

---

## Voraussetzungen

Dies ist ein Kurs, in dem Sie tatsächlich Coding-Agenten ausführen.

Sie benötigen mindestens eines dieser Werkzeuge:

- Claude Code
- Codex
- Einen anderen IDE- oder CLI-Coding-Agenten, der Dateibearbeitung, Befehlsausführung und mehrstufige Aufgaben unterstützt

Der Kurs setzt voraus, dass Sie:

- Ein lokales Repository öffnen können
- Dem Agenten erlauben können, Dateien zu bearbeiten
- Dem Agenten erlauben können, Befehle auszuführen
- Ausgaben überprüfen und Aufgaben neu starten können

Wenn Sie über kein solches Werkzeug verfügen, können Sie die Kursinhalte dennoch lesen, aber Sie werden die Projekte nicht wie vorgesehen abschließen können.

---

## Lokale Vorschau

Dieses Repository verwendet VitePress als Dokumentationsbetrachter.

```sh
npm install
npm run docs:dev        # Dev-Server mit Hot Reload
npm run docs:build      # Produktions-Build
npm run docs:preview    # Vorschau der erstellten Seite
```

Öffnen Sie dann die lokale URL, die VitePress ausgibt, in Ihrem Browser.

---

## Vorkenntnisse

Erforderlich:

- Vertrautheit mit dem Terminal, Git und lokalen Entwicklungsumgebungen
- Fähigkeit, Code in mindestens einem gängigen Anwendungsstack zu lesen und zu schreiben
- Grundlegende Software-Debugging-Erfahrung (Lesen von Logs, Tests und Laufzeitverhalten)
- Ausreichend Zeit für implementationsfokussierte Kursarbeit

Hilfreich, aber nicht erforderlich:

- Erfahrung mit Electron, Desktop-Apps oder Local-First-Tools
- Hintergrund in Testing, Logging oder Softwarearchitektur
- Frühere Erfahrung mit Codex, Claude Code oder ähnlichen Coding-Agenten

---

## Kernreferenzen

Primär:

- [OpenAI: Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)
- [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Anthropic: Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [OpenAI: Unrolling the Codex agent loop](https://openai.com/index/unrolling-the-codex-agent-loop/)
- [Anthropic: Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- [LangChain: Improving Deep Agents with harness engineering](https://www.langchain.com/blog/improving-deep-agents-with-harness-engineering)
- [Thoughtworks / Martin Fowler: Harness engineering for coding agent users](https://martinfowler.com/articles/harness-engineering.html)
- [Cursor: Continually improving our agent harness](https://cursor.com/blog/continually-improving-agent-harness)

Die vollständige geschichtete Referenzliste finden Sie in [`docs/de/resources/reference/`](../../docs/de/resources/reference/index.md).

---

## Repository-Struktur

```text
learn-harness-engineering/
├── docs/                          # VitePress-Dokumentationsseite
│   ├── lectures/                  # 14 Vorlesungen (index.md + code/ Beispiele)
│   │   ├── lecture-01-*/
│   │   ├── lecture-02-*/
│   │   └── ... (insgesamt 14)
│   ├── projects/                  # 8 Projektbeschreibungen
│   │   ├── project-01-*/
│   │   └── ... (insgesamt 8)
│   └── resources/                 # Mehrsprachige Vorlagen & Referenzen
│       ├── en/                    # Englische Vorlagen, Checklisten, Leitfäden
│       ├── zh/                    # Chinesische Vorlagen, Checklisten, Leitfäden
│       ├── ru/                    # Russische Vorlagen, Checklisten, Leitfäden
│       └── vi/                    # Vietnamesische Vorlagen, Checklisten, Leitfäden
├── projects/
│   ├── shared/                    # Gemeinsame Electron + TypeScript + React-Basis
│   └── project-NN/               # Projektbezogene starter/ und solution/ Verzeichnisse
├── skills/                        # Wiederverwendbare KI-Agenten-Skills
│   └── harness-creator/           # Harness Engineering Skill
├── package.json                   # VitePress + Dev-Werkzeuge
└── CLAUDE.md                      # Claude Code-Anweisungen für dieses Repo
```

---

## Wie der Kurs organisiert ist

- Jede Vorlesung konzentriert sich auf eine Frage
- Der Kurs umfasst 8 Projekte
- Jedes Projekt erfordert, dass der Agent echte Arbeit leistet
- Jedes Projekt vergleicht schwache vs. starke Harness-Ergebnisse
- Was zählt, ist der gemessene Unterschied, nicht wie viele Dokumente geschrieben wurden

---

## Skills

Dieses Repository enthält auch wiederverwendbare KI-Agenten-Skills, die Sie direkt in Ihre IDE oder Ihren Agenten-Arbeitsbereich installieren können.

- [**harness-creator**](../../skills/harness-creator/): Ein Skill, der Ihnen hilft, in Minuten ein produktionsreifes Harness für Ihr eigenes Projekt zu erstellen.

---

## Weitere Kurse

Unser Team hat auch weitere Kurse erstellt! Schauen Sie sich diese an:

[![Hands-on Modern RL](https://img.shields.io/badge/HANDS--ON_MODERN_RL-0052cc?style=for-the-badge)](https://github.com/walkinglabs/hands-on-modern-rl)

**Hands-on Modern RL**: Ein Open-Source-Praxiscurriculum, das die Lücke von grundlegenden RL-Konzepten zu LLM-Alignment, RLVR und fortschrittlichen agentischen Systemen überbrückt.

---

## Star-History

[![Star History Chart](https://star-history.dera.page/svg?repos=walkinglabs/learn-harness-engineering&type=date&legend=top-left)](https://star-history.dera.page/#walkinglabs/learn-harness-engineering&type=date&legend=top-left)

---

## Danksagungen

Dieser Kurs wurde inspiriert von und bezieht Ideen aus [learn-claude-code](https://github.com/shareAI-lab/learn-claude-code) — einem fortschreitenden Leitfaden zum Aufbau eines Agenten von Grund auf, von einem einzelnen Loop bis zur isolierten autonomen Ausführung.
