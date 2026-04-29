[中文版本 →](../../../zh/projects/project-04-incremental-indexing/)

> Связанные лекции: [Лекция 07. Чётко обозначьте границы задач для агентов](./../../lectures/lecture-07-why-agents-overreach-and-under-finish/index.md) · [Лекция 08. Используйте списки фич, чтобы ограничивать действия агента](./../../lectures/lecture-08-why-feature-lists-are-harness-primitives/index.md)
> Файлы шаблонов: [templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/en/resources/templates/)

# Проект 04. Используйте runtime-обратную связь, чтобы корректировать поведение агента

## Что вы делаете

Добавьте runtime-наблюдаемость (логи запуска, логи импорта/индексации, состояния ошибок) и архитектурные ограничения, чтобы предотвратить нарушения границ слоёв. Подкиньте агенту runtime-баг для исправления.

Вы запускаете задачу дважды: первый раз — без логов и ограничений, второй — с правильными инструментами и правилами.

## Инструменты

- Claude Code или Codex
- Git
- Node.js + Electron

## Механизм harness

Runtime-обратная связь + контроль скоупа + инкрементальная индексация
