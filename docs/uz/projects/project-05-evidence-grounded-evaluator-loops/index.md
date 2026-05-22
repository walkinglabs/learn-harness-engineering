[English version →](../../../en/projects/project-05-evidence-grounded-evaluator-loops/)

> Tegishli maʼruzalar: [9-maʼruza. Agentlarni vaqtidan oldin gʻalabani eʼlon qilishdan saqlash](./../../lectures/lecture-09-why-agents-declare-victory-too-early/index.md) · [10-maʼruza. Faqatgina End-to-End testlash chinakam tekshiruvdir](./../../lectures/lecture-10-why-end-to-end-testing-changes-results/index.md)
> Andoza fayllari: [templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/en/resources/templates/)

# Loyiha 05. Agentga oʻz ishini oʻzi tekshirishiga imkon bering

## Nima qilasiz

Rollarni ajratishni (role separation) amalga oshiring — kod yozuvchi (generator), tekshiruvchi (evaluator), hamda ixtiyoriy ravishda rejalashtiruvchi (planner). Qoʻshilgan har bir turning taʼsirini oʻlchash uchun buni uch marta ishga tushirib koʻring.

Diqqatga sazovor boʻlgan biror funksiya yangilanishini tanlang (koʻp bosqichli suhbat, iqtibos panelini qayta dizayn qilish yoki hujjatlarni filtrlash) va uni barcha urinishlar davomida bir xil qilib saqlang.

## Vositalar

- Claude Code yoki Codex
- Git
- Node.js + Electron

## Harness mexanizmi

Oʻz-oʻzini tekshirish (Self-verification) + asoslangan debrief report (evidence-grounded debrief report) + dalilga asoslangan tugatish (evidence-based completion)
