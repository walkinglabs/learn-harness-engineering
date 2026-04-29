# Английская библиотека ресурсов

Эта папка превращает методы курса в готовые к копированию шаблоны и компактные референсы, которые можно использовать в реальном репозитории.

## Когда её использовать

Начните отсюда, когда хотите, чтобы Codex, Claude Code или другой агент-кодер работал на протяжении нескольких сессий, не выводя каждый раз заново сетап, статус и скоуп.

Особенно полезно, когда:

- работа растягивается на несколько сессий
- фич много, и их легко оставить недоделанными
- агенты склонны слишком рано объявлять победу
- шаги старта каждый раз выясняются заново

## Начните здесь

Для минимального сетапа начните с:

- корневые инструкции: [`templates/AGENTS.md`](./templates/AGENTS.md) или [`templates/CLAUDE.md`](./templates/CLAUDE.md)
- состояние фич: [`templates/feature_list.json`](./templates/feature_list.json)
- лог прогресса: [`templates/claude-progress.md`](./templates/claude-progress.md)
- референс bootstrap-скрипта: `docs/en/resources/templates/init.sh`

Затем добавьте:

- session handoff: [`templates/session-handoff.md`](./templates/session-handoff.md)
- чек-лист чистого выхода: [`templates/clean-state-checklist.md`](./templates/clean-state-checklist.md)
- рубрика evaluator: [`templates/evaluator-rubric.md`](./templates/evaluator-rubric.md)

Если вам нужна более полная структура репозитория в стиле OpenAI из поста «Harness engineering», используйте advanced-пак:

- [`openai-advanced/index.md`](./openai-advanced/index.md)

## Структура библиотеки

- [`templates/`](./templates/index.md): шаблоны для копирования в реальный репозиторий
- [`reference/`](./reference/index.md): заметки по методу, флоу старта и карты режимов отказа
- [`openai-advanced/`](./openai-advanced/index.md): продвинутый каркас репозитория, документы system-of-record и шаблоны agent-first управления

## Рекомендуемый минимальный пак

- `AGENTS.md` или `CLAUDE.md`
- `feature_list.json`
- `claude-progress.md`
- `init.sh`

Этих четырёх файлов достаточно, чтобы заметно стабилизировать большинство агентских воркфлоу.

Когда репозиторий вырастает в долгоживущую систему с несколькими доменами, активными планами, оценкой качества и политиками надёжности, переходите на пак [`openai-advanced/`](./openai-advanced/index.md), а не растягивайте минимальный пак сверх меры.
