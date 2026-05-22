[English version →](../../../en/projects/project-03-multi-session-continuity/)

> Tegishli maʼruzalar: [5-maʼruza. Sessiyalar oʻrtasida kontekstni saqlab qoling](./../../lectures/lecture-05-why-long-running-tasks-lose-continuity/index.md) · [6-maʼruza. Har bir agent sessiyasidan oldin inisializatsiya qiling](./../../lectures/lecture-06-why-initialization-needs-its-own-phase/index.md)
> Andoza fayllari: [templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/en/resources/templates/)

# Loyiha 03. Agentning ishlashini sessiyalar boʻylab uzluksiz taʼminlang

## Nima qilasiz

Agentga skoup nazorati (scope control) va tekshirish eshiklarini (verification gates) qoʻshing. Hujjatlarni qismlarga boʻlish (segmentation), metamaʼlumotlarni (metadata) ajratib olish, question-chain segmentation jarayonini koʻrsatish va iqtiboslarga asoslangan debrief report (savol-javob) oqimini amalga oshiring. Funksiyalar (features) holatini kuzatish uchun `feature_list.json` dan foydalaning — bir vaqtda bitta funksiya ustida ishlansin, tekshiruv dalilisiz (verification evidence) “pass” (oʻtdi) deb belgilash mumkin emas.

Siz buni ikki marta bajarasiz: birinchisida hech qanday cheklovlarsiz, ikkinchisida esa qatʼiy talablar asosida.

## Vositalar

- Claude Code yoki Codex
- Git
- Node.js + Electron

## Harness mexanizmi

Jarayon jurnali (Progress log) + sessiyani topshirish (session handoff) + koʻp sessiyali uzluksizlik (multi-session continuity)
