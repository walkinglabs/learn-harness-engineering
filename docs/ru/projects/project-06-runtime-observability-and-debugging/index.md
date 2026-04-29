[中文版本 →](../../../zh/projects/project-06-runtime-observability-and-debugging/)

> Связанные лекции: [Лекция 11. Сделайте runtime агента наблюдаемым](./../../lectures/lecture-11-why-observability-belongs-inside-the-harness/index.md) · [Лекция 12. Чистый handoff в конце каждой сессии](./../../lectures/lecture-12-why-every-session-must-leave-a-clean-state/index.md)
> Файлы шаблонов: [templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/en/resources/templates/)

# Проект 06. Соберите полноценный агентский harness (Capstone)

## Что вы делаете

Это capstone-проект. Соберите всё, чему научились в первых пяти проектах, проведите полный бенчмарк, затем сделайте проход уборки, чтобы убедиться, что качество поддерживаемое.

Используйте фиксированный набор multi-feature задач, охватывающий полный продуктовый срез: импорт документов, индексация, Q&A с цитатами, runtime-наблюдаемость и читаемое перезапускаемое состояние репозитория. Сначала запустите со слабым harness-baseline, затем с самым сильным harness, потом — уборку и повторный запуск. Наконец, проведите эксперимент с абляцией harness — убирайте по одному компоненту за раз и смотрите, какие из них реально важны.

## Инструменты

- Claude Code или Codex
- Git
- Node.js + Electron
- Шаблон quality-документа
- Рубрика evaluator
- Все компоненты harness, накопленные за первые пять проектов

## Механизм harness

Полный harness: все механизмы + наблюдаемость + ablation-исследование
