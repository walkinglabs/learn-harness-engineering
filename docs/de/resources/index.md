# Deutsche Ressourcenbibliothek

Dieser Ordner übersetzt die Kursmethoden in kopierfertige Vorlagen und kompakte Referenzen, die du in einem echten Repository verwenden kannst.

## Wann du sie nutzt

Beginne hier, wenn Codex, Claude Code oder ein anderer Coding-Agent über mehrere Sessions arbeiten soll, ohne Setup, Status und Scope ständig neu herzuleiten.

Besonders nützlich ist das, wenn:

- Arbeit über mehrere Sessions läuft
- viele Features vorhanden sind und leicht halb fertig bleiben
- Agenten zu früh Erfolg melden
- Startschritte jedes Mal neu gesucht werden

## Hier starten

Für eine minimale Einrichtung beginne mit:

- Root-Anweisungen: [`templates/AGENTS.md`](./templates/AGENTS.md) oder [`templates/CLAUDE.md`](./templates/CLAUDE.md)
- Feature-Zustand: [`templates/feature_list.json`](./templates/#feature-list-json)
- Fortschrittslog: [`templates/claude-progress.md`](./templates/claude-progress.md)
- Bootstrap-Skriptreferenz: `docs/de/resources/templates/init.sh`

Ergänze danach:

- Session-Handoff: [`templates/session-handoff.md`](./templates/session-handoff.md)
- Clean-Exit-Checkliste: [`templates/clean-state-checklist.md`](./templates/clean-state-checklist.md)
- Evaluator-Rubrik: [`templates/evaluator-rubric.md`](./templates/evaluator-rubric.md)

Wenn du die vollständigere OpenAI-artige Repository-Struktur aus dem "Harness engineering"-Beitrag möchtest, nutze das erweiterte Paket:

- [`openai-advanced/index.md`](./openai-advanced/index.md)

## Struktur der Bibliothek

- [`templates/`](./templates/index.md): Vorlagen zum Kopieren in ein echtes Repository
- [`reference/`](./reference/index.md): Methodennotizen, Startablauf und Karten von Fehlermodi
- [`openai-advanced/`](./openai-advanced/index.md): erweitertes Repository-Gerüst, system-of-record-Dokumente und agent-first Governance-Vorlagen

## Empfohlenes Minimalpaket

- `AGENTS.md` oder `CLAUDE.md`
- `feature_list.json`
- `claude-progress.md`
- `init.sh`

Diese vier Dateien reichen aus, um die meisten Agenten-Workflows deutlich stabiler zu machen.

Wenn das Repository zu einem länger laufenden System mit mehreren Domänen, aktiven Plänen, Qualitätsscores und Zuverlässigkeitsrichtlinien wächst, wechsle zum Paket [`openai-advanced/`](./openai-advanced/index.md), statt das Minimalpaket zu weit zu dehnen.
