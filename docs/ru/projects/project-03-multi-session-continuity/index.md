[中文版本 →](../../../zh/projects/project-03-multi-session-continuity/)

> Связанные лекции: [Лекция 05. Сохраняйте контекст живым между сессиями](./../../lectures/lecture-05-why-long-running-tasks-lose-continuity/index.md) · [Лекция 06. Инициализируйте перед каждой сессией агента](./../../lectures/lecture-06-why-initialization-needs-its-own-phase/index.md)
> Файлы шаблонов: [templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/en/resources/templates/)

# Проект 03. Заставьте агента продолжать работу через перезапуски сессий

## Что вы делаете

Добавьте агенту контроль скоупа и проверочные шлюзы. Реализуйте чанкование документов, извлечение метаданных, отображение прогресса индексации и Q&A-флоу с цитатами. Используйте `feature_list.json` для отслеживания статуса фич — по одной фиче за раз, никакого «pass» без доказательств верификации.

Вы запускаете задачу дважды: первый раз — без ограничений, второй — со строгим контролем.

## Инструменты

- Claude Code или Codex
- Git
- Node.js + Electron

## Механизм harness

Лог прогресса + handoff между сессиями + непрерывность между сессиями
