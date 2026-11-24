[中文版本 →](../../../zh/projects/project-02-agent-readable-workspace/)

> Zugehörige Lektionen: [Lektion 03. Mache das Repository zur einzigen Quelle der Wahrheit](./../../lectures/lecture-03-why-the-repository-must-become-the-system-of-record/index.md) · [Lektion 04. Teile Anweisungen auf mehrere Dateien auf](./../../lectures/lecture-04-why-one-giant-instruction-file-fails/index.md)
> Vorlagendateien: [templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/de/resources/templates/)

# Projekt 02. Das Projekt lesbar machen und dort weiterarbeiten, wo du aufgehört hast

## Was du tust

Füge dem Repository "Lesbarkeit" hinzu, damit ein neuer Agent die Projektstruktur schnell versteht, den aktuellen Fortschritt kennt und Arbeit aufnehmen kann. Konkret: Implementiere Dokumentimport, Detailansicht und lokale Persistenz über zwei Sessions hinweg.

Beide Durchläufe beginnen mit demselben Code aus `starter/`. Im ersten nutzt du das schlanke Harness des Starters ohne `session-handoff.md`. Im zweiten verwendest du die auf Übergaben ausgerichtete `AGENTS.md` aus `solution/` und lässt am Ende von Session A eine `session-handoff.md` schreiben. Jeder Durchlauf umfasst zwei Sessions: Die zweite übernimmt die Arbeit, die in der ersten offenblieb. Nach dem Versuchsablauf bleiben Code, Prompt, Agent und Abbruchpunkt gleich. Verglichen wird damit das Harness: die Regeln in `AGENTS.md` und die Übergabenotiz.

## Werkzeuge

- Claude Code oder Codex
- Git
- Node.js + Electron

## Harness-Mechanismus

Agent-lesbarer Workspace + persistente Zustandsdateien

## Nutze das eingecheckte Projekt

Repository-Pfad: [`projects/project-02/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02)

| Verzeichnis | Inhalt | Vergleichspunkt |
|------|------|------|
| [`starter/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/starter) | Code aus Project 01 mit noch unvollständigem Import, Detailansicht und Persistenz. Die Dokumentation ist vorhanden, aber dünner, und `session-handoff.md` fehlt. | Der gemeinsame Ausgangspunkt für beide Durchläufe. |
| [`solution/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/solution) | Derselbe Produktschnitt ist fertig, mit Übergabedokumentation unter [`projects/project-02/solution/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/solution) sowie [`feature_list.json`](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/solution/feature_list.json) und [`session-handoff.md`](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/solution/session-handoff.md). | Dient als Referenz, nicht als Ausgangspunkt für einen Durchlauf. Übernimm für den starken Durchlauf nur `AGENTS.md`. |

Die Produktfunktionen sind Dokumentimport, vollständiges Laden von Details/Inhalt und Persistenz nach Neustart. Die Harness-Funktion ist ein gut übergebbarer Workspace.

## Versuchsablauf

Zwischen den Durchläufen darf sich nur das Harness unterscheiden. Ausgangscode, Aufgabenprompt, Agent und Abbruchpunkt von Session A bleiben gleich. Session A umfasst den Dokumentimport und die Detailansicht; Session B ergänzt die persistente Speicherung, wie in der [Projekt-README](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/README.md) beschrieben.

1. Bereite zwei voneinander getrennte Arbeitsverzeichnisse vor, etwa `p02-baseline/` und `p02-improved/`. Führe die Versuche nacheinander aus: beide Sessions abschließen, Ergebnisse archivieren, das Arbeitsverzeichnis löschen und erst dann den anderen Versuch starten. Verwende keine Git-Branches zur Trennung. Ein Coding-Agent kann andere Branches und benachbarte Verzeichnisse lesen. Wenn er im schwachen Durchlauf die Dateien des starken Durchlaufs sehen kann, ist der Vergleich verfälscht. Es gilt dieselbe Regel wie in Projekt 01.
2. Kopiere [`projects/project-02/starter/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/starter) als Ausgangspunkt für beide Durchläufe. Der Starter basiert auf der Lösung von Projekt 01. Dessen Funktionen sind bereits abgenommen; die drei Funktionen von Projekt 02 stehen in `feature_list.json` auf `not-started`. Wenn du auf deinem eigenen Ergebnis aus Projekt 01 aufbauen willst, verwende für beide Durchläufe denselben Stand. Entscheidend ist identischer Ausgangscode.
3. Verwende in beiden Durchläufen denselben Prompt, zum Beispiel: „Implementiere den Dokumentimport über einen Dateiauswahldialog, eine Detailansicht, die den gesamten Dokumentinhalt lädt, und eine dauerhafte Speicherung, damit importierte Dokumente einen Neustart der App überstehen.“
4. Kopiere weder `solution/docs/` noch `solution/feature_list.json` oder `solution/session-handoff.md` in eines der Verzeichnisse. Diese Dateien beschreiben bereits den fertigen Import und das Laden der Inhalte oder markieren alle Funktionen als `pass`. Damit würdest du dem Agenten die Lösung vorgeben. Lass `docs/ARCHITECTURE.md`, `docs/PRODUCT.md` und `feature_list.json` in beiden Durchläufen unverändert aus `starter/` übernehmen.

### Erster Durchlauf (schwaches Harness)

Behalte in `p02-baseline/` das Harness des Starters bei: die kurze `AGENTS.md`, `docs/` und `feature_list.json`, aber keine `session-handoff.md`. Lösche diese Dateien nicht. Das schwache Harness ist schlank, nicht leer.

**Session A:**

1. Starte den Agenten mit dem Aufgabenprompt.
2. Beende die Session selbst, sobald Import und Detailansicht funktionieren, aber bevor die Daten dauerhaft gespeichert werden. Prüfe das so: Starte die App, importiere eine `.txt`- oder `.md`-Datei über den Dateiauswahldialog, finde sie in der Dokumentliste und öffne sie, um ihren vollständigen Inhalt zu sehen. Nach einem Neustart geht das importierte Dokument noch verloren. Nutze im zweiten Durchlauf dasselbe Kriterium.
3. Fordere weder eine Übergabenotiz noch eine andere Zusammenfassung an.

**Session B:**

1. Öffne im gleichen Verzeichnis eine neue Agentensession und sage nur: „Setze die Arbeit fort.“
2. Miss die Zeit bis zur ersten sinnvollen Codeänderung und notiere jedes Mal, wenn der Agent etwas erneut herausfindet, das in Session A bereits bekannt war, etwa Architektur, Befehle oder welche Funktion noch nicht fertig ist.

### Zweiter Durchlauf (starkes Harness)

Ersetze vor Session A in `p02-improved/` die `AGENTS.md` durch [`solution/AGENTS.md`](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/solution/AGENTS.md). Sie ergänzt Startregeln, eine Hierarchie für die Dokumentation, eine Regel zur Dokumentationspflege, ein Abschlusskriterium mit Nachweisen in `feature_list.json` und einen Abschnitt zur Übergabe zwischen Sessions. Ändere sonst nichts. Da `AGENTS.md` mehr als die Übergaberegel enthält, prüft dieser Durchlauf das gesamte Harness. Ein Unterschied in Session B lässt sich nicht allein der Übergabenotiz zuschreiben. Um deren Einfluss separat zu messen, ergänze einen dritten Durchlauf: Behalte die `AGENTS.md` des Starters bei und füge nur den Abschnitt zur Übergabe hinzu.

**Session A:**

1. Starte den Agenten mit demselben Aufgabenprompt.
2. Beende die Umsetzung am selben Punkt wie im ersten Durchlauf: Import und Detailansicht funktionieren, die dauerhafte Speicherung fehlt noch.
3. Lass den Agenten vor dem Schließen der Session im Stammverzeichnis des Repositorys eine `session-handoff.md` nach der [Übergabevorlage](./../../resources/templates/session-handoff.md) schreiben: Was wurde überprüft, was hat sich geändert, was funktioniert nicht oder ist noch ungeprüft, und was ist der nächste sinnvolle Schritt? [`solution/session-handoff.md`](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/solution/session-handoff.md) ist ein fertiges Beispiel, in dem alle Funktionen bereits abgeschlossen sind. Kopiere es nicht.

**Session B:**

1. Öffne im gleichen Verzeichnis eine neue Agentensession und sage nur: „Setze die Arbeit fort.“ Die Anweisung, `session-handoff.md` zu lesen, steht in `AGENTS.md`, nicht im Prompt.
2. Erfasse dieselben Messwerte wie im ersten Durchlauf.

## Ergebnisse messen

| Kennzahl | Beschreibung |
|------|------|
| Einarbeitungszeit in Session B | Zeit vom Beginn der Session B bis zur ersten sinnvollen Codeänderung |
| Erneute Erkundungen | Wie oft der Agent bereits bekannte Architektur, Befehle oder Projektzustände erneut ermittelt |
| Qualität der Übergabe | Ob die Notiz vollständig, korrekt und für die Weiterarbeit brauchbar ist (nur im zweiten Durchlauf) |
| Doppelte Arbeit | Wie viel Session B von bereits abgeschlossener Arbeit aus Session A wiederholt |
| Abschlussstand | Ob am Ende alle drei Funktionen fertig sind |

## Abgabe

- Schwaches Harness: Gesprächsprotokolle oder Logs beider Sessions
- Starkes Harness: dieselben Aufzeichnungen sowie die verwendete `AGENTS.md` und die vom Agenten erstellte `session-handoff.md`
- Eine kurze Gegenüberstellung der Einarbeitungszeit und der Qualität, mit der der Agent den Kontext wiederherstellt
