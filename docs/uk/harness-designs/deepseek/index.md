# Розбір дизайну DeepSeek Harness

[DeepSeek Harness](https://deepseek.com/harness) (команда `dsh`, репозиторій `deepseek-ai/deepseek-harness`) випущено в серпні 2026 року як Developer Preview. Офіційне визначення дуже пряме: **Agent = Model + Environment + Tools + State** — модель, середовище, інструменти та стан.

Якщо розбір перших трьох продуктів відповідав на питання «як слід проєктувати harness», то DeepSeek Harness ставить радикальніше питання: **чи може harness відокремитися від конкретної моделі й стати незалежним runtime?** Його відповідь — так, і цей підхід доведено до межі. В [архітектурній документації](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md) прямо сказано: *Every part of the product is a plugin, including the model adapter, the tool registry, the session log, and the agent loop itself* (кожна частина продукту є плагіном, включно з адаптером моделі, реєстром інструментів, журналом сесії та самим циклом agent).

У цій статті ми розберемо три головні аспекти: плагінне ядро, шви можливостей (capability seam), конвеєр подій і найсильніше інженерне обмеження — «Model-visible means logged».

## Позиціонування одним реченням

Традиційний coding agent має структуру «LLM + фіксований цикл agent + фіксований набір інструментів». DeepSeek Harness має структуру «модель + плагінне ядро (Cordis)»: ядро відповідає лише за завантаження й вивантаження плагінів, залежності та механізм подій і **не володіє жодною конкретною можливістю agent**. В [архітектурній документації](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md) це сформульовано так: «There is no privileged core to patch» (немає привілейованого ядра, яке потрібно виправляти) і «you extend dsh by mounting a plugin beside the others» (щоб розширити dsh, достатньо змонтувати плагін поруч з іншими, не змінюючи ядро). Це означає, що навіть цикл agent не є недоторканним: можна взяти модель DeepSeek, підключити subagent із Claude Code, додати віддалену sandbox, написати власну пам’ять, замінити цикл і UI та зібрати цілком нового agent.

Це найповніше втілення твердження курсу «все поза вагами моделі є harness»: якщо harness незалежний, нехай він стане окремою операційною системою.

## Ядро архітектури 1: шов можливості (Capability Seam)

У DeepSeek Harness поняття Service позначає «можливість», а майже кожну можливість поділено на три рівні:

```
Service Definition
        ↓
Service Provider
        ↓
Consumer
```

Візьмімо файлову систему: під `FS Service` працюють кілька Provider — Local FS, E2B FS і Remote FS, а назовні вони надають єдиний інтерфейс file tools. Shell, Subprocess, Sandbox, Web, LLM і SubAgent мають таку саму структуру. Цю трирівневу схему не виведено в нашому аналізі — в оригіналі розділу [архітектурної документації · Capability seams](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md) прямо сказано: *a seam is a swappable capability with three roles: a Service Definition declaring the interface, a Service Provider implementing it, and a Consumer using it, commonly a model-facing tool* (шов можливості — замінна можливість із трьома ролями: Service Definition оголошує інтерфейс, Service Provider реалізує його, а Consumer використовує; останнім зазвичай є інструмент, доступний моделі).

Це розв’язує давню проблему інженерії harness: **від чого має залежати agent — від «конкретного інструмента» чи від «інтерфейсу можливості»?** DeepSeek Harness обирає друге. У термінах курсу це означає, що «підсистема інструментів» стандартизована як інтерфейс: заміна Provider не змінює інструменти, доступні моделі, але повністю змінює середовище.

## Ядро архітектури 2: конвеєр подій (Event Pipeline)

Усередині DeepSeek Harness працює не простий ланцюжок «LLM → інструмент → LLM», а конвеєр подій, кожна ланка якого є точкою події, доступною для прослуховування плагінами:

```
turn/start → claim input → assemble（system prompt / context / tools）
  → agent/pre-step → step/start → LLM request（agent/request）→ llm/stream
  → assistant/message → tool/call
  → tools/pre-execute（permission / guard / policy / hook）
  → tools/execute → tools/post-execute → tool/result → step/end → next turn
```

(Наведений вище конвеєр — це переказ розділу [архітектурної документації · Turn flow](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md): `turn/*`, `step/*`, `user/message`, `assistant/*` і `tool/*` є збережуваними подіями сесії, а `agent/pre-step`, `agent/request`, `llm/stream` і `tools/*` — точками розширення, які можуть прослуховувати плагіни.)

Найбільша перевага цього дизайну: **для багатьох функцій узагалі не потрібно змінювати сам цикл agent**. Потрібна перевірка безпеки перед виконанням інструмента? Прослуховуйте `tools/pre-execute`. Потрібна пам’ять? Додавайте її через `agent/pre-step`. Потрібен запис поведінки? Підпишіться на події сесії. Потрібно змінити запит моделі? Додайте hook до `agent/request`. Потрібно вирішувати, чи продовжувати міркування? Прослуховуйте `agent/turn-stopping`.

Порівняно з одинадцятою лекцією курсу «Як зробити виконання agent спостережуваним», DeepSeek Harness заходить далі: він не просто «додає журнали», а перетворює **кожен крок циклу на точку події**, завдяки чому спостережуваність, дозволи, пам’ять і політики підключаються до циклу як слухачі, а не жорстко вбудовуються в нього.

## Ядро архітектури 3: Session Event Log і «Model-visible means logged»

DeepSeek Harness має **append-only Session Event Log (лише дописуваний журнал подій сесії)** та встановлює надзвичайно сильне інженерне обмеження. В оригіналі розділу [архітектурної документації · Session log](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md) сказано:

> **Model-visible means logged.** Anything that reaches a model request must be reconstructable from the log, and a runtime invariant asserts it.

(Усе, що бачить модель, має бути записано. Усе, що потрапляє до запиту моделі, повинно відтворюватися з журналу, і це забезпечує інваріант runtime.)

Інакше кажучи, спостережуваність — не журнал, доданий постфактум, а первинне обмеження harness: усе, що потрапляє до контексту моделі, за замовчуванням має залишити запис. Це безпосередньо перегукується з тезою фінальної лекції «спостережуваність належить до harness» і перетворює дизайн сховища append-only на принцип: журнал лише дописується, а не перезаписується, тому стан сесії можна відтворити.

## Відповідність фреймворку курсу

| Підсистема | Реалізація DeepSeek Harness | Оцінка |
| --- | --- | --- |
| Інструкції | Плагінна архітектура; правила/навички додаються як плагіни | Надзвичайна свобода, але немає вбудованої домовленості на кшталт «CLAUDE.md» |
| Інструменти | Шов можливості Service Definition → Provider → Consumer | Максимальна стандартизація підсистеми інструментів |
| Середовище | Provider для sandbox/FS/Shell можна повністю замінити (включно з віддаленим E2B) | Середовище повністю змінне |
| Стан | append-only Session Event Log + Model-visible means logged | Спостережуваність є первинним обмеженням |
| Зворотний зв’язок | permission / guard / policy / hook у tools/pre-execute | Механізм зворотного зв’язку перетворено на події |

Докорінна відмінність DeepSeek Harness від інших трьох продуктів полягає в тому, що Pi, Claude Code і Codex оптимізують harness усередині «конкретного agent», тоді як DeepSeek Harness визначає harness як **операційну систему, незалежну від моделі**, а сам agent є лише змінним застосунком у цій OS. Ціна теж очевидна: висока свобода означає вищі витрати на конфігурацію. Це невіддільний зворотний бік дизайну «harness як OS» (на етапі Developer Preview продукт також позиціонується як рання можливість випробувати механізми, що ще розвиваються).

## Проєктні рішення, які варто запозичити

1. **Перетворіть кожен крок циклу на точку події**: підключайте дозволи, пам’ять, політики та журнали до циклу як слухачів, а не вбудовуйте їх жорстко.
2. **Стандартизуйте шви можливостей**: залежте від «інтерфейсу можливості», а не від «конкретного інструмента», щоб можна було цілком замінити середовище, не змінюючи доступну моделі поверхню інструментів.
3. **Model-visible means logged**: усе, що бачить модель, має бути записано; перетворіть спостережуваність із «додаткової переваги» на «первинне обмеження».
4. **append-only журнал сесії**: відтворюваний стан і надійне передавання роботи є інженерною гарантією того, що «кожна сесія залишає чистий стан».

## Джерела (оригінали / вихідний код)

Кожне твердження можна простежити до наведеного нижче оригінального тексту або вихідного коду, щоб уникнути переказу з пам’яті:

- **Офіційний сайт DeepSeek Harness**: визначення продукту «Agent = Model + Environment + Tools + State», статус Developer Preview і команда `dsh`.<br/>https://deepseek.com/harness
- **Репозиторій deepseek-ai/deepseek-harness** (команда `dsh`, ліцензія MIT):<br/>https://github.com/deepseek-ai/deepseek-harness
- **Архітектурна документація architecture.md**: головне джерело цієї статті — «Every part of the product is a plugin», «There is no privileged core to patch», конвеєр подій Turn flow, три ролі Capability seams, «Model-visible means logged» та інваріант runtime, append-only Session Event Log, шви можливостей fs/tools/telemetry і підсистеми `ctx.*`.<br/>https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md
- **Супровідні розділи архітектурної документації**: огляд ядра Cordis (plugins contribute services, typed events, reversible effects), деталі швів можливостей і підсистема Session.<br/>https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-primer.md ｜ https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/capability-seams.md ｜ https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/subsystems/session.md

Пов’язані лекції: [Лекція 11 · Як зробити виконання agent спостережуваним](../../lectures/lecture-11-why-observability-belongs-inside-the-harness/) ｜ [Лекція 12 · Чому кожна сесія має залишати чистий стан](../../lectures/lecture-12-why-every-session-must-leave-a-clean-state/) ｜ [Лекція 02 · Що таке harness насправді](../../lectures/lecture-02-what-a-harness-actually-is/)
