[中文版本 →](../../../zh/lectures/lecture-01-why-capable-agents-still-fail/)

> Codebeispiele: [code/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/de/lectures/lecture-01-why-capable-agents-still-fail/code/)
> Praxisprojekt: [Projekt 01. Nur Prompt vs. Regeln zuerst](./../../projects/project-01-baseline-vs-minimal-harness/index.md)

# Lektion 01. Starke Modelle bedeuten keine zuverlässige Ausführung

Du kennst dich in der KI-Welt gut aus: Claude-Pro-Abo, GPT-4o-API-Key, SWE-bench-Ranglisten im Kopf. Eines Tages gibst du einem KI-Agenten endlich ein echtes Projekt und bist voller Zuversicht. Das Ergebnis? Er fügt ein Feature hinzu, bricht aber die Tests, behebt einen Bug und erzeugt zwei neue, läuft 20 Minuten und erklärt stolz "fertig" - und wenn du dir den Code ansiehst, ist es gar nicht das, was du verlangt hast.

Dein erster Impuls? "Dieses Modell ist nicht gut genug. Zeit für ein Upgrade." Warte kurz. Bevor du zur Kreditkarte greifst, solltest du in Betracht ziehen, dass das Problem vielleicht gar nicht das Modell ist.

Am 29. September 2025 meldete Anthropic für Claude Sonnet 4.5 [77,2 % auf SWE-bench Verified](https://www.anthropic.com/news/claude-sonnet-4-5). Und das bei sorgfältig ausgewählten Aufgaben mit klaren Issue-Beschreibungen und vorhandenen Tests. Übertrage das auf deine tägliche Entwicklungsumgebung - vage Anforderungen, keine vorhandenen Tests, überall verstreute implizite Geschäftsregeln - und diese Zahl sinkt weiter.

Hinter diesen Zahlen steckt aber eine kontraintuitive Wahrheit.

## Gleiches Pferd, anderes Ergebnis

Anthropic verglich denselben Prompt ("baue einen 2D-Retro-Game-Maker") mit demselben Modell (Opus 4.5) unter zwei Harnesses. Erster Lauf: nackt, ohne Unterstützung - 20 Minuten, 9 Dollar; die App öffnete sich, aber die Entitäten reagierten nicht auf Eingaben. Zweiter Lauf: vollständiger Harness (Planner + Generator + Evaluator als Drei-Agenten-Architektur) - 6 Stunden, 200 Dollar; eine Entität ließ sich bewegen, aber die Physik hatte raue Kanten und eine Wand blockierte den Fortschritt. [Die Kernfunktionen liefen, fertig war die App nicht.](https://www.anthropic.com/engineering/harness-design-long-running-apps)

Sie änderten nicht das Modell. Opus 4.5 blieb Opus 4.5. Was sich änderte, war das Zaumzeug.

OpenAIs Artikel zu Harness Engineering aus dem Jahr 2025 formuliert es direkt: Codex wechselt in einem gut geharnessten Repository von "unzuverlässig" zu "zuverlässig". Achte auf die Wortwahl - nicht "ein bisschen besser", sondern ein qualitativer Sprung. Wie bei einem Vollblutpferd: Du kannst ohne passendes Zaumzeug reiten, aber du kommst nicht weit, nicht schnell, und ein Sturz ist keine Überraschung. Der Harness ist dieses gesamte Zaumzeug - **alles in der Engineering-Infrastruktur außerhalb der Modellgewichte.**

## Wo Agenten tatsächlich stecken bleiben

Was geht also konkret schief?

Am häufigsten: Du hast die Aufgabe nie eindeutig definiert. Du sagst "füge eine Suchfunktion hinzu", und das Verständnis des Agenten unterscheidet sich komplett von deinem - wonach suchen? Volltext oder strukturiert? Pagination? Hervorhebungen? Du hast es nicht angegeben, also rät der Agent. Ein richtiger Tipp ist Glück; ein falscher Tipp kostet mehr Nacharbeit, als klare Spezifikation am Anfang gekostet hätte. Es ist, als würdest du in ein Restaurant gehen und dem Koch sagen: "Ich nehme Fisch" - ob er geschmort, gedämpft oder im Hot Pot kommt, bleibt dem Zufall überlassen.

Selbst wenn du spezifizierst, hat das Projekt implizite Architekturkonventionen, die der Agent nicht kennt. Dein Team hat SQLAlchemy-2.0-Syntax standardisiert, aber der Agent schreibt standardmäßig 1.x-Code. Alle API-Endpunkte müssen OAuth-2.0-Authentifizierung nutzen, aber diese Regel existiert nur in deinem Kopf und in einer Slack-Nachricht von vor drei Monaten. Der Agent sieht das nicht - nicht weil er sich nicht daran halten will, sondern weil er buchstäblich nicht weiß, dass diese Regeln existieren.

Auch die Umgebung ist eine Falle. Unvollständige Entwicklungsumgebung, fehlende Abhängigkeiten, falsche Tool-Versionen. Der Agent verbrennt wertvolles Kontextfenster mit `pip install`-Fehlern und Node-Versionenkonflikten, statt deine eigentliche Aufgabe zu lösen. Das ist, als würdest du einen fähigen Tischler einstellen, aber Hammer, Nägel und eine ebene Werkbank vergessen - egal wie talentiert er ist, so kann er die Arbeit nicht erledigen.

Noch häufiger: Es gibt schlicht keine Möglichkeit zur Verifikation. Keine Tests, kein Linting, oder die Verifikationsbefehle wurden dem Agenten nie mitgeteilt. Der Agent schreibt Code, sieht ihn sich an, entscheidet, dass er gut aussieht, und sagt "fertig". Das ist wie Hausaufgaben ohne Lösungsschlüssel: Der Schüler glaubt, alles richtig zu haben, aber beim Korrigieren liegen überall Fehler. Anthropic beobachtete außerdem ein interessantes Phänomen: Wenn Agenten spüren, dass der Kontext knapp wird, beeilen sie sich, überspringen Verifikation und wählen eine einfache statt der besten Lösung. Sie nennen das "context anxiety" - dasselbe Gefühl, wenn bei einer Prüfung die Zeit fast abgelaufen ist und man die letzten Multiple-Choice-Fragen zufällig ankreuzt.

Lange Aufgaben über mehrere Sitzungen sind noch schlimmer: Alle Erkenntnisse aus der vorherigen Sitzung gehen verloren, und jede neue Sitzung muss Projektstruktur und Codeorganisation erneut erkunden und verstehen. Bei Agenten ohne persistenten Zustand steigen die Fehlerraten bei Aufgaben über 30 Minuten stark an.

## Schlüsselbegriffe

Mit diesen Szenarien im Hinterkopf sind die folgenden Begriffe kein bloßer Jargon mehr:

- **Capability Gap**: Die große Lücke zwischen Modellleistung auf Benchmarks und Leistung bei realen Aufgaben. Benchmark-Aufgaben bringen klare Issue-Beschreibungen, Tests und eine Umgebung mit; bei realen Aufgaben musst du diese oft selbst liefern.
- **Harness**: Alles außerhalb des Modells - Anweisungen, Tools, Umgebung, Zustandsverwaltung, Verifikationsfeedback. Wenn es keine Modellgewichte sind, gehört es zum Harness. Das ist das "Zaumzeug", von dem wir gesprochen haben.
- **Harness-Induced Failure**: Das Modell hat grundsätzlich genug Fähigkeit, aber die Ausführungsumgebung hat strukturelle Defekte. Der Retro-Game-Vergleich oben ist ein Beispiel.
- **Verification Gap**: Die Lücke zwischen dem Vertrauen des Agenten in sein Ergebnis und der tatsächlichen Korrektheit. Der Agent sagt "ich bin fertig", obwohl er nicht fertig ist - der häufigste Fehlermodus.
- **Diagnostic Loop**: Ausführen, Fehler beobachten, einer bestimmten Harness-Schicht zuordnen, diese Schicht reparieren, erneut ausführen. Das ist die Kernmethodik von Harness Engineering.
- **Definition of Done**: Eine Menge maschinell überprüfbarer Bedingungen - Tests grün, Lint sauber, Type Checks bestanden. Ohne explizite Definition of Done erfindet der Agent seine eigene.

## Wenn etwas scheitert, repariere zuerst den Harness

Kernprinzip: **Wenn etwas scheitert, tausche nicht zuerst das Modell aus - prüfe den Harness.** Wenn dasselbe Modell bei ähnlichen, gut strukturierten Aufgaben erfolgreich ist, gehe von einem Harness-Problem aus. Das ist wie bei einem Auto, das liegen bleibt: Du verdächtigst nicht sofort den Motor. Du prüfst zuerst, ob der Tank leer ist.

Konkrete Schritte:

**Ordne jeden Fehler einer bestimmten Schicht zu.** Sag nicht nur "das Modell taugt nichts". Frage: War die Aufgabe unklar? War der Kontext unzureichend? Gab es keine Verifikationsmethode? Ordne jeden Fehler einer der fünf Fehlerschichten zu: Aufgabenspezifikation, Kontextbereitstellung, Ausführungsumgebung, Verifikationsfeedback, Zustandsverwaltung. Das sind praktische Diagnoseschichten, nicht die sechs Glossarbegriffe oben. Wenn du diese Gewohnheit aufbaust, wirst du "das Modell ist nicht gut genug" immer seltener in deinen Logs sehen.

**Schreibe für jede Aufgabe eine explizite Definition of Done.** Sag nicht "füge eine Suchfunktion hinzu". Sag:
```
Completion criteria:
- New endpoint GET /api/search?q=xxx
- Supports pagination, default 20 items
- Results include highlighted snippets
- All new code passes pytest
- Type checking passes (mypy --strict)
```

**Erstelle eine AGENTS.md-Datei.** Lege sie im Repository-Root ab, damit der Agent Tech Stack, Architekturkonventionen und Verifikationsbefehle des Projekts kennt. Das ist der erste Schritt im Harness Engineering und der Schritt mit dem höchsten ROI. Eine einzige `AGENTS.md`-Datei kann wirksamer sein als ein Upgrade auf ein teureres Modell - das ist kein Witz.

**Baue eine Diagnoseschleife.** Behandle Fehler nicht als "das Modell ist wieder dumm". Behandle sie als Signale, dass dein Harness einen Defekt hat. Bei jedem Fehler: Schicht identifizieren, reparieren, dafür sorgen, dass derselbe Fehler nicht wieder auftritt. Nach ein paar Runden wird dein Harness stärker und die Agentenleistung stabiler. Wie Straßenreparatur: Jedes gefüllte Schlagloch macht den nächsten Abschnitt glatter.

**Quantifiziere Verbesserungen.** Führe ein einfaches Log: War jede Aufgabe erfolgreich oder nicht, und welche Schicht hat den Fehler verursacht? Nach ein paar Runden siehst du, welche Schicht der Engpass ist - konzentriere deine Energie dort.

## Das Millionen-Zeilen-Experiment

Im August 2025 starteten drei Engineers bei OpenAI ein Experiment: Codex sollte aus einem leeren Git-Repository ein vollständiges internes Produkt bauen. [Fünf Monate später enthielt das Repository ungefähr eine Million Zeilen Code](https://openai.com/index/harness-engineering/) - Anwendungslogik, Infrastruktur, Tooling, Dokumentation, interne Entwicklerwerkzeuge - alles von Agenten erzeugt. Das Team wuchs später auf sieben Engineers; insgesamt wurden etwa 1.500 PRs gemergt, im Schnitt 3,5 pro Engineer und Tag.

Die zentrale Einschränkung: **Menschen schreiben nie direkt Code.** Das war kein Trick, sondern sollte das Team zwingen herauszufinden, was sich ändert, wenn die Hauptaufgabe des Engineers nicht mehr Code schreiben ist, sondern Umgebungen zu entwerfen, Absichten präzise auszudrücken und Feedbackschleifen zu bauen.

Der frühe Fortschritt war langsamer als erwartet. Nicht weil Codex unfähig war, sondern weil die Umgebung nicht vollständig genug war - dem Agenten fehlten notwendige Werkzeuge, Abstraktionen und interne Strukturen, um übergeordnete Ziele voranzubringen. Die Arbeit der Engineers wurde: große Ziele in kleine Bausteine zerlegen (Design, Code, Review, Test), den Agenten diese zusammensetzen lassen und diese Bausteine dann nutzen, um komplexere Aufgaben freizuschalten. Wenn etwas scheiterte, lautete die Lösung fast nie "streng dich mehr an", sondern "welche Fähigkeit fehlt dem Agenten, und wie machen wir sie verständlich und ausführbar?"

Dieses Experiment belegt direkt die Kernaussage dieser Lektion: **Dasselbe Modell erzeugt in einer nackten Umgebung grundlegend andere Ergebnisse als in einer Umgebung mit vollständigem Harness.** Das Modell änderte sich nicht. Die Umgebung änderte sich.

> Quelle: [OpenAI: Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)

## Ein bodenständigeres Beispiel

Ein Team nutzte Claude Sonnet, um einer mittelgroßen Python-Web-App (FastAPI + PostgreSQL + Redis, ca. 15.000 Codezeilen) einen neuen API-Endpunkt hinzuzufügen.

Zunächst gaben sie nur einen Satz: "add user preferences endpoints under `/api/v2/users`." Das Ergebnis? Der Agent verbrachte viel Zeit damit, die Repository-Struktur zu erkunden, erzeugte Code, der plausibel aussah, aber nicht den Error-Handling-Mustern des Projekts folgte, verwendete alte SQLAlchemy-Syntax und erklärte die Aufgabe für abgeschlossen, obwohl der Endpunkt Laufzeitfehler hatte. Die nächste Sitzung musste die gesamte Entdeckungsarbeit erneut leisten.

Später ergänzten sie `AGENTS.md` (mit Projektarchitektur und Tech-Stack-Versionen), explizite Verifikationsbefehle (`pytest tests/api/v2/ && python -m mypy src/`) und Architecture Decision Records. Dasselbe Modell folgte danach den Konventionen des Projekts und prüfte seine Arbeit mit Befehlen, die es ausführen konnte.

Sie änderten nicht das Modell. Sie änderten den Harness.

## Wichtigste Erkenntnisse

- Modellfähigkeit und Ausführungszuverlässigkeit sind verschiedene Dinge. Auch ein Vollblut braucht gutes Zaumzeug.
- Wenn etwas scheitert, prüfe zuerst den Harness und dann das Modell. Modelle zu wechseln ist die teuerste Option - und oft ist es nicht einmal ein Modellproblem.
- Jeder Fehler ist ein Signal: Dein Harness hat einen strukturellen Defekt. Finde ihn und behebe ihn.
- Fünf Verteidigungsschichten: Aufgabenspezifikation, Kontextbereitstellung, Ausführungsumgebung, Verifikationsfeedback, Zustandsverwaltung. Prüfe sie systematisch, wie ein Arzt die häufigsten Ursachen zuerst ausschließt.
- Eine einzige `AGENTS.md`-Datei kann wirksamer sein als ein Upgrade auf ein teureres Modell. Ernsthaft.

## Weiterführende Literatur

- [OpenAI: Harness Engineering — Leveraging Codex in an Agent-First World](https://openai.com/index/harness-engineering/)
- [Anthropic: Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [HumanLayer: Skill Issue — Harness Engineering for Coding Agents](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents)
- [SWE-bench Leaderboard](https://www.swebench.com/)
- [Thoughtworks Technology Radar: Harness Engineering](https://www.thoughtworks.com/radar)

## Übungen

1. **Vergleichsexperiment**: Wähle eine Codebase, die du gut kennst, und eine nicht triviale Änderungsaufgabe. Führe den Agenten zuerst ohne Harness-Unterstützung aus und protokolliere die Fehler. Füge dann eine `AGENTS.md` mit expliziten Verifikationsbefehlen hinzu und führe denselben Agenten erneut aus. Vergleiche die Ergebnisse und ordne jeden Fehler einer der fünf Verteidigungsschichten zu.

2. **Messung der Verification Gap**: Wähle 5 Coding-Aufgaben. Notiere nach jeder Aufgabe, ob der Agent Abschluss behauptet, und prüfe anschließend die tatsächliche Korrektheit mit unabhängigen Tests. Berechne den Anteil der Fälle, in denen der Agent "fertig" sagt, obwohl er es tatsächlich nicht ist - das ist deine Verification Gap. Überlege dann: Welche Verifikationsbefehle würden diesen Anteil senken?

3. **Übung zur Diagnoseschleife**: Finde eine Aufgabe, bei der der Agent in deinem Projekt wiederholt scheitert. Führe sie einmal aus und protokolliere den Fehler. Ordne ihn einer der fünf Schichten zu. Repariere diese Schicht. Führe erneut aus. Wiederhole das drei bis fünf Runden und dokumentiere die Verbesserungen nach jeder Runde.
