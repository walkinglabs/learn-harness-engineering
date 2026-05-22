[English version →](../../../en/projects/project-04-incremental-segmentation/)

> Tegishli maʼruzalar: [7-maʼruza. Agentlar uchun aniq vazifa chegaralarini chizing](./../../lectures/lecture-07-why-agents-overreach-and-under-finish/index.md) · [8-maʼruza. Agent nima qilishini cheklash uchun funksiyalar roʻyxatidan foydalaning](./../../lectures/lecture-08-why-feature-lists-are-harness-primitives/index.md)
> Andoza fayllari: [templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/en/resources/templates/)

# Loyiha 04. Agent harakatlarini toʻgʻrilash uchun Runtime qayta aloqadan foydalaning

## Nima qilasiz

Qatlamlararo qoidabuzilishlarning (cross-layer violations) oldini olish uchun runtime kuzatuvchanligini (ishga tushish loglari, import/question-chain segmentation loglari, xatolik holatlari) va arxitektura cheklovlarini qoʻshing. Agent toʻgʻrilashi uchun runtime bug qoldiring.

Siz buni ikki marta bajarasiz: birinchisida loglar va cheklovlarsiz, ikkinchisida tegishli vositalar va qoidalar bilan.

## Vositalar

- Claude Code yoki Codex
- Git
- Node.js + Electron

## Harness mexanizmi

Runtime qayta aloqa (Runtime feedback) + skoup nazorati (scope control) + bosqichma-bosqich question-chain segmentation (incremental segmentation)
