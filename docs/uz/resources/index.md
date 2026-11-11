# Resurslar kutubxonasi

Ushbu jild kurs uslublarini haqiqiy repozitoriylarda foydalanishingiz mumkin boʻlgan, nusxalashga tayyor andozalar (templates) va qisqa qoʻllanmalarga aylantiradi.

## Qachon foydalanish kerak

Codex, Claude Code yoki boshqa kod yozish agenti bir nechta sessiyalar davomida ishlashi kerak boʻlganda, har safar sozlamalar, holat va skoupni (scope) boshidan aniqlashga majbur boʻlmaslik uchun ishni shu yerdan boshlang.

Bu ayniqsa quyidagi holatlarda foydali:

- ish bir nechta sessiyalar davomida bajarilsa
- funksiyalar (features) koʻp boʻlsa va ularni chala tashlab ketish oson boʻlsa
- agentlar vaqtidan oldin “tugatdim” deb eʼlon qilishga moyil boʻlsa
- ishga tushirish (startup) qadamlari har safar qaytadan kashf etilsa

## Shu yerdan boshlang

Minimal oʻrnatish uchun quyidagilardan boshlang:

- asosiy yoʻriqnomalar (root instructions): [`templates/AGENTS.md`](./templates/AGENTS.md) yoki [`templates/CLAUDE.md`](./templates/CLAUDE.md)
- funksiya holati (feature state): [`templates/feature_list.json`](./templates/#feature-list-json)
- jarayon jurnali (progress log): [`templates/claude-progress.md`](./templates/claude-progress.md)
- boshlangʻich skript (bootstrap script) qoʻllanmasi: `docs/en/resources/templates/init.sh`

Keyin quyidagilarni qoʻshing:

- sessiyani topshirish (session handoff): [`templates/session-handoff.md`](./templates/session-handoff.md)
- toza chiqish tekshiruvi roʻyxati (clean-exit checklist): [`templates/clean-state-checklist.md`](./templates/clean-state-checklist.md)
- baholovchi rubrikasi (evaluator rubric): [`templates/evaluator-rubric.md`](./templates/evaluator-rubric.md)

Agar siz “Harness engineering” maqolasidagi OpenAI uslubidagi toʻliqroq repozitoriy strukturasini xohlasangiz, ilgʻor toʻplamdan (advanced pack) foydalaning:

- [`openai-advanced/index.md`](./openai-advanced/index.md)

## Kutubxona strukturasi

- [`templates/`](./templates/index.md): haqiqiy repoga koʻchirish uchun andozalar
- [`reference/`](./reference/index.md): metod eslatmalari, ishga tushirish oqimi (startup flow) va xatolik rejimlarining (failure-mode) xaritalari
- [`openai-advanced/`](./openai-advanced/index.md): ilgʻor repo skeleti, yagona haqiqat manbai (system-of-record) hujjatlari va agent-first boshqaruv (governance) andozalari

## Tavsiya etiladigan Minimal toʻplam

- `AGENTS.md` yoki `CLAUDE.md`
- `feature_list.json`
- `claude-progress.md`
- `init.sh`

Ushbu toʻrtta fayl koʻpgina agent jarayonlarini (workflows) sezilarli darajada barqarorlashtirish uchun yetarli.

Agar repo bir nechta domenlar, faol rejalar, sifat baholash (quality scoring) va ishonchlilik siyosatlarini (reliability policies) oʻz ichiga olgan, uzoq vaqt ishlaydigan tizimga aylansa, minimal toʻplamni haddan tashqari choʻzish oʻrniga [`openai-advanced/`](./openai-advanced/index.md) toʻplamiga oʻting.
