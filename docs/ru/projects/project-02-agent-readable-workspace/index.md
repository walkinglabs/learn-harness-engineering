[中文版本 →](../../../zh/projects/project-02-agent-readable-workspace/)

> Связанные лекции: [Лекция 03. Сделайте репозиторий единственным источником истины](./../../lectures/lecture-03-why-the-repository-must-become-the-system-of-record/index.md) · [Лекция 04. Разделите инструкции по файлам](./../../lectures/lecture-04-why-one-giant-instruction-file-fails/index.md)
> Файлы шаблонов: [templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/en/resources/templates/)

# Проект 02. Сделайте проект читаемым и продолжите с того места, где остановились

## Что вы делаете

Добавьте «читаемость» в репозиторий, чтобы новый агент мог быстро понять структуру проекта, узнать текущий прогресс и продолжить работу. Конкретно: реализуйте импорт документов, просмотр деталей документа и локальное хранение, выполнив всё за две сессии.

Вы запускаете задачу дважды: первый раз — без какой-либо помощи, второй — с заранее размещёнными в репозитории `ARCHITECTURE.md`, `PRODUCT.md` и `session-handoff.md`.

## Инструменты

- Claude Code или Codex
- Git
- Node.js + Electron

## Механизм harness

Воркспейс, читаемый агентом + персистентные файлы состояния
