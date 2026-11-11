# Разбор дизайна DeepSeek Harness

[DeepSeek Harness](https://deepseek.com/harness) (команда `dsh`, репозиторий `deepseek-ai/deepseek-harness`) выпущен в августе 2026 года в статусе Developer Preview. Официальное определение предельно прямое: **Agent = Model + Environment + Tools + State** — модель, среда, инструменты и состояние.

Если при разборе первых трёх продуктов мы спрашивали «как следует проектировать harness», DeepSeek Harness задаёт более радикальный вопрос: **может ли harness отделиться от конкретной модели и стать независимым runtime?** Его ответ — да, и эта идея доведена до предела. В [архитектурной документации](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md) прямо сказано: *Every part of the product is a plugin, including the model adapter, the tool registry, the session log, and the agent loop itself* — каждая часть продукта является plugin, включая адаптер модели, реестр инструментов, лог session и даже сам цикл agent.

В этой статье мы сосредоточимся на трёх аспектах: ядре на основе plugin, швах возможностей (capability seam), конвейере событий и сильнейшем инженерном ограничении «Model-visible means logged».

## Позиционирование в одном предложении

Традиционный coding agent устроен как «LLM + фиксированный цикл agent + фиксированный набор инструментов». DeepSeek Harness устроен как «модель + ядро plugin (Cordis)». Ядро отвечает только за загрузку и выгрузку plugin, зависимости и механизм событий и **не владеет никакими конкретными возможностями agent**. В [архитектурной документации](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md) это сформулировано так: «There is no privileged core to patch» — нет привилегированного ядра, которое нужно изменять, — и «you extend dsh by mounting a plugin beside the others» — для расширения dsh достаточно подключить plugin рядом с остальными, не изменяя ядро. Поэтому даже сам цикл agent не является неприкосновенным: можно взять модель DeepSeek, подключить subagent Claude Code, добавить удалённую песочницу, написать собственную память, заменить цикл и UI и собрать совершенно нового agent.

Это наиболее последовательная реализация тезиса курса «всё за пределами весов модели — harness»: если harness независим, пусть он станет самостоятельной операционной системой.

## Архитектурное ядро 1: шов возможностей (Capability Seam)

DeepSeek Harness представляет «возможность» с помощью Service и разделяет почти каждую возможность на три уровня:

```
Service Definition
        ↓
Service Provider
        ↓
Consumer
```

Возьмём файловую систему: под `FS Service` находятся несколько Provider — Local FS, E2B FS и Remote FS, — а выше они единообразно представлены как file tools. Shell, Subprocess, Sandbox, Web, LLM и SubAgent используют ту же структуру. Это трёхуровневое разделение не наше обобщение: в оригинальном разделе [Architecture · Capability seams](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md) сказано: *a seam is a swappable capability with three roles: a Service Definition declaring the interface, a Service Provider implementing it, and a Consumer using it, commonly a model-facing tool* — шов возможностей является заменяемой возможностью с тремя ролями: Service Definition объявляет интерфейс, Service Provider реализует его, а Consumer использует, обычно в виде инструмента, доступного модели.

Это решает давнюю проблему инженерии harness: **должен ли agent зависеть от «конкретного инструмента» или от «интерфейса возможностей»?** DeepSeek Harness выбирает второе. В терминах курса это означает, что «подсистема инструментов» стандартизирована как интерфейс: при замене Provider представление инструмента для модели не меняется, хотя среда полностью заменяется.

## Архитектурное ядро 2: конвейер событий (Event Pipeline)

Внутренняя архитектура DeepSeek Harness — не простой цикл «LLM → инструмент → LLM», а конвейер событий, каждый этап которого является точкой, доступной для прослушивания plugin:

```
turn/start → claim input → assemble（system prompt / context / tools）
  → agent/pre-step → step/start → LLM request（agent/request）→ llm/stream
  → assistant/message → tool/call
  → tools/pre-execute（permission / guard / policy / hook）
  → tools/execute → tools/post-execute → tool/result → step/end → next turn
```

(Этот конвейер воспроизводит раздел [Architecture · Turn flow](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md): `turn/*`, `step/*`, `user/message`, `assistant/*` и `tool/*` — сохраняемые события session; `agent/pre-step`, `agent/request`, `llm/stream` и `tools/*` — точки расширения, доступные plugin.)

Главное преимущество такого дизайна: **множество функций вообще не требуют изменения самого цикла agent**. Нужна проверка безопасности перед выполнением инструмента? Слушайте `tools/pre-execute`. Нужна память? Внедряйте её в `agent/pre-step`. Хотите записывать поведение? Подпишитесь на события session. Хотите изменить запрос модели? Подключитесь к `agent/request`. Нужно решить, продолжать ли рассуждение? Слушайте `agent/turn-stopping`.

По сравнению с лекцией 11 «Как сделать работу agent наблюдаемой» DeepSeek Harness идёт дальше: он не просто «добавляет логи», а превращает **каждый шаг цикла в точку события**, позволяя подключать наблюдаемость, permissions, память и политики как слушателей цикла вместо жёсткого встраивания в него.

## Архитектурное ядро 3: Session Event Log и «Model-visible means logged»

В DeepSeek Harness есть **append-only Session Event Log** — лог событий session только для добавления — и действует чрезвычайно строгое инженерное ограничение. Оригинальный текст раздела [Architecture · Session log](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md):

> **Model-visible means logged.** Anything that reaches a model request must be reconstructable from the log, and a runtime invariant asserts it.

Иными словами, всё видимое модели должно быть записано. Всё, что попадает в запрос модели, должно восстанавливаться из лога, и это принудительно обеспечивает инвариант runtime.

Наблюдаемость здесь — не логи, добавленные постфактум, а первичное ограничение harness: всё, что попадает в контекст модели, по умолчанию должно оставлять запись. Это прямо перекликается с тезисом заключительной лекции «наблюдаемость относится к внутреннему устройству harness» и превращает append-only в принцип проектирования хранилища: лог только дополняется и не перезаписывается, а состояние session можно воспроизвести.

## Сопоставление с фреймворком курса

| Подсистема | Реализация DeepSeek Harness | Оценка |
| --- | --- | --- |
| Инструкции | Плагины; правила и skills внедряются как плагины | Полная свобода, но нет встроенного соглашения наподобие CLAUDE.md |
| Инструменты | Шов возможностей Service Definition → Provider → Consumer | Предельная стандартизация подсистемы инструментов |
| Среда | Провайдеры Sandbox/FS/Shell полностью заменяемы, включая удалённый E2B | Среда полностью модульна |
| Состояние | append-only Session Event Log + Model-visible means logged | Наблюдаемость — первичное ограничение |
| Обратная связь | permission / guard / policy / hook в tools/pre-execute | Механизм обратной связи основан на событиях |

Принципиальное отличие DeepSeek Harness от остальных трёх продуктов состоит в том, что Pi, Claude Code и Codex оптимизируют harness «внутри конкретного agent», а DeepSeek Harness определяет harness как **независимую от модели операционную систему**, где сам agent — лишь заменяемое приложение. Цена очевидна: высокая свобода означает высокую стоимость конфигурации. Это неотъемлемая обратная сторона модели «harness как OS» — особенно на этапе Developer Preview, когда продукт предназначен для раннего знакомства, а механизмы ещё развиваются.

## Дизайнерские решения, которые стоит перенять

1. **Превратите каждый шаг цикла в точку события**: подключайте permissions, память, политики и логи к циклу как слушателей, а не встраивайте их жёстко.
2. **Стандартизируйте швы возможностей**: зависите от «интерфейсов возможностей», а не от «конкретных инструментов», чтобы можно было целиком заменить среду, не меняя поверхность инструментов, видимую модели.
3. **Model-visible means logged**: всё видимое модели должно записываться; сделайте наблюдаемость не «дополнительным преимуществом», а «первичным ограничением».
4. **Append-only лог session**: воспроизводимое состояние и надёжный handoff — инженерная гарантия того, что «каждая session оставляет после себя чистое состояние».

## Источники (оригинальные материалы / исходный код)

Каждое утверждение можно проверить по приведённому ниже оригинальному материалу или исходному коду — мы не пересказываем по памяти:

- **Официальный сайт DeepSeek Harness**: определение продукта «Agent = Model + Environment + Tools + State», статус Developer Preview и команда `dsh`.<br/>https://deepseek.com/harness
- **Репозиторий deepseek-ai/deepseek-harness** (команда `dsh`, лицензия MIT):<br/>https://github.com/deepseek-ai/deepseek-harness
- **Архитектурный документ architecture.md**: главный источник статьи — «Every part of the product is a plugin», «There is no privileged core to patch», конвейер событий Turn flow, три роли Capability seams, «Model-visible means logged» и инвариант runtime, append-only Session Event Log, швы возможностей fs/tools/telemetry и подсистемы `ctx.*`.<br/>https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md
- **Архитектурная документация · Сопутствующие документы**: введение в ядро Cordis (plugins contribute services, typed events, reversible effects), подробности швов возможностей и подсистема Session.<br/>https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-primer.md ｜ https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/capability-seams.md ｜ https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/subsystems/session.md

Связанные лекции: [лекция 11 «Как сделать работу agent наблюдаемой»](../../lectures/lecture-11-why-observability-belongs-inside-the-harness/) ｜ [лекция 12 «Каждая session должна завершаться чистым handoff»](../../lectures/lecture-12-why-every-session-must-leave-a-clean-state/) ｜ [лекция 2 «Что такое harness на самом деле»](../../lectures/lecture-02-what-a-harness-actually-is/)
