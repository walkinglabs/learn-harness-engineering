[English version →](../../../en/projects/project-01-baseline-vs-minimal-harness/)

> Tegishli maʼruzalar: [1-maʼruza. Kuchli modellar doim ham ishonchli degani emas](./../../lectures/lecture-01-why-capable-agents-still-fail/index.md) · [2-maʼruza. Harness aslida nima degani](./../../lectures/lecture-02-what-a-harness-actually-is/index.md)
> Andoza fayllari: [templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/en/resources/templates/)

# Loyiha 01. Prompt-only vs. rules-first: Bu qanchalik farq qiladi

## Nima qilasiz

Minimal Electron bilimlar bazasi (interview-debrief) ilovasi (app) qobigʻini quring — chap tomonda interview sessionlar roʻyxati, oʻng tomonda debrief report (savol-javob) paneli va lokal maʼlumotlar katalogiga ega oyna. Vazifaning oʻzi murakkab emas. Murakkab qismi shundaki — agentga buni qanday qilib bajartirishdir.

Buni ikki marta ishga tushirasiz. Birinchi marta: hech qanday tayyorgarliksiz, faqat prompt bilan. Ikkinchi marta: repoda oldindan joylashtirilgan `AGENTS.md`, `init.sh`, `feature_list.json` bilan. Va keyin taqqoslaysiz.

Bu loyihaning asosiy maqsadi kod yozish emas — “avval qoidalarni tayyorlash uchun 15 daqiqa sarflash” bilan “shunchaki agentga qoʻyib berish” oʻrtasidagi tafovut qanchalik katta ekanligini anglab yetishdir.

## Vositalar

- Claude Code yoki Codex (bittasini tanlang va ikkala urinish uchun ham ishlatasiz)
- Git (branchʼlarni boshqarish va taqqoslash uchun)
- Node.js + Electron (loyiha steki)
- Taymer (har bir urinish qancha vaqt olganini yozib borish uchun)

## Harness mexanizmi

Minimal harness: `AGENTS.md` + `init.sh` + `feature_list.json`
