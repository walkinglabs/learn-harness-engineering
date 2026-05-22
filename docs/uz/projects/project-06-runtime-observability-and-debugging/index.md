[English version →](../../../en/projects/project-06-runtime-observability-and-debugging/)

> Tegishli maʼruzalar: [11-maʼruza. Agent ishining runtimeʼda kuzatilishini taʼminlang](./../../lectures/lecture-11-why-observability-belongs-inside-the-harness/index.md) · [12-maʼruza. Har bir sessiya yakunida toza holat qoldiring](./../../lectures/lecture-12-why-every-session-must-leave-a-clean-state/index.md)
> Andoza fayllari: [templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/en/resources/templates/)

# Loyiha 06. Toʻliq agent harnessʼini quring (Capstone)

## Nima qilasiz

Bu capstone (yakunlovchi) loyihadir. Dastlabki beshta loyihada oʻrganilgan barcha narsalarni bir joyga toʻplang, toʻliq benchmark ishlating, soʻngra sifatni barqaror ushlab turish mumkinligini isbotlash uchun tozalash (cleanup) bosqichini amalga oshiring.

Toʻliq mahsulot boʻlagini (product slice) qamrab oladigan qatʼiy koʻp funksiyali (multi-feature) vazifalar toʻplamidan foydalaning: transcript import, question-chain segmentation, iqtiboslarga asoslangan debrief report, runtime kuzatuvchanligi va oʻqish mumkin boʻlgan qayta ishga tushiriladigan (restartable) repo holati. Avval kuchsiz asosiy (baseline) harness bilan ishga tushiring, soʻngra oʻzingizning eng kuchli harnessʼingiz bilan, oxirida esa tozalash qilib, qayta ishlating. Va nihoyat, harnessʼda ablasyon (ablation) tajribasini oʻtkazing — har bir komponentni bittadan olib tashlang va haqiqatda qaysi biri muhim ekanligini aniqlang.

## Vositalar

- Claude Code yoki Codex
- Git
- Node.js + Electron
- Sifat hujjati andozasi (Quality document template)
- Baholovchi rubrikasi (Evaluator rubric)
- Dastlabki beshta loyihada toʻplangan barcha harness komponentlari

## Harness mexanizmi

Toʻliq harness: barcha mexanizmlar + kuzatuvchanlik (observability) + ablasyon oʻrganish (ablation study)
