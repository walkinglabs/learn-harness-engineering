# Codex harness dizayni tahlili

OpenAI yaratgan [Codex](https://openai.com/index/harness-engineering/) ushbu toʻrt mahsulot orasida “harnessʼning asl mohiyati” bilan eng chuqur bogʻlangan mahsulot boʻlishi mumkin. Butun sohaga nom bergan “Harness Engineering” maqolasining oʻzi OpenAI jamoasining Codex yordamida mahsulot yaratish tajribasi asosida yozilgan. Shuning uchun Codex harness dizaynini tahlil qilish, asosan, oʻsha maqola ortidagi muhandislik amaliyotini tahlil qilish demakdir.

Codex falsafasini bir jumlada ifodalash mumkin: **repo yagona haqiqat manbai (repository as the system of record), AGENTS.md faqat mundarija sahifasi, muhandislikning qadri esa muhitni loyihalash, niyatni ifodalash va qayta aloqa siklini yaratishdadir.**

## Bir jumladagi taʼrif

OpenAI jamoasi Codex yordamida bir necha hafta ichida yakunda millionlab kod qatoridan iborat mahsulot yaratdi va **har bir kod qatorini Codex yozdi** (asl manba: [Harness Engineering](https://openai.com/index/harness-engineering/) maqolasining “Designing for growth” boʻlimi). Ularning tajribasi bitta savolga javob berdi: muhandisning roli “kod yozish”dan “harness loyihalash”ga oʻzgarganda tizim qanday tashkil qilinishi kerak? Codex CLIʼning oʻzi ochiq manbali monolit binar fayl (Rustʼda yozilgan, [github.com/openai/codex](https://github.com/openai/codex)), ammo uning harnessʼga asosiy hissasi bezakdor kengaytma nuqtalarida emas, balki **konvensiyalar (convention)** va **kontekst muhandisligi**dadir.

## Yoʻriqnomalar quyi tizimi: AGENTS.md ensiklopediya emas, mundarija sahifasi

Bu Codexʼning harness nazariyasiga eng katta taʼsir koʻrsatgan dizayn qaroridir:

> Bitta ulkan yoʻriqnoma faylini mexanik tekshirish qiyin: qamrov, yangilanganlik holati, egalik va oʻzaro havolalarni nazorat qilib boʻlmaydi; uning real holatdan chetlashishi muqarrar. Shuning uchun biz AGENTS.mdʼni ensiklopediya emas, **mundarija sahifasi** deb hisoblaymiz. Kod bazasi haqidagi bilimlar tuzilmali hujjatlarda saqlanadi, AGENTS.md esa ularga yoʻl koʻrsatadi.

(Yuqoridagi matn [“Harness Engineering” maqolasining](https://openai.com/index/harness-engineering/) “AGENTS.md should be a directory page” boʻlimidagi fikrning bevosita bayonidir.)

Toʻrtinchi maʼruzada “bitta ulkan yoʻriqnoma fayli muvaffaqiyatsiz boʻladi” deyiladi; Codex esa toʻgʻri yechimni bevosita koʻrsatadi: AGENTS.md taxminan 100 qator bilan cheklanadi (asl maqola qariyb 100 qatorni tavsiya qiladi; chegaraga yaqinlashganda mazmun `docs/` ichiga ajratiladi). Sigʻmagan maʼlumot `docs/` katalogiga boʻlinadi va agent uni talab boʻyicha oʻqiydi. “Qoʻllanmani emas, xaritani bering” tamoyilining nufuzli manbasi aynan shu.

Bunga hamroh tamoyil — **bajarilish invariantlarini belgilang, amalga oshirishni mayda-chuydasigacha boshqarmang** (asl matn: “don't micromanage the implementation; focus on invariants”). AGENTS.md faqat buzib boʻlmaydigan qatʼiy cheklovlar va tekshiruv buyruqlarini oʻz ichiga oladi; qanday amalga oshirishni modelning oʻzi hal qiladi. Bu ikkinchi maʼruzadagi “mayda boshqaruv emas, cheklovlar” gʻoyasiga toʻgʻridan-toʻgʻri mos keladi.

## Kontekst quyi tizimi: Write-Select-Compress-Isolate

Codex kontekst muhandisligini toʻrtta strategiya bilan ifodalash mumkin. Bu model “context engineering” mustaqil sohaga aylangach hamjamiyat tomonidan umumlashtirilib, Codexʼga tatbiq etilgan (model manbasi: [Context Engineering for Codex CLI](https://codex.danielvaughan.com/2026/06/10/context-engineering-codex-cli-write-select-compress-isolate-june-2026/)):

- **Write (yozib qoʻyish)**: kontekstni oynadan tashqarida saqlash — xulosalarni hujjatlarga, holatni fayllarga yozish; ularni suhbat ichida qoldirmaslik. Bu “repo yagona haqiqat manbai” tamoyiliga mos keladi.
- **Select (tanlab olish)**: oynaga faqat zarur tokenlarni olib kirish — AGENTS.md yoʻl koʻrsatadi, fayllar talab boʻyicha oʻqiladi; butun repo kontekstga tiqilmaydi.
- **Compress (siqish)**: faqat haqiqatdan muhim maʼlumotni saqlash — Codexʼda avtomatik siqish va qoʻlda ishga tushiriladigan `/compact` bor; `compact_prompt`ʼni sozlash mumkin (qarang: [Context Engineering for Codex CLI](https://codex.danielvaughan.com/2026/06/10/context-engineering-codex-cli-write-select-compress-isolate-june-2026/)).
- **Isolate (izolyatsiya qilish)**: kontekstni turli chegaralarga ajratish — subagentlar turli vazifalar kontekstini ajratadi; masalan, frontend subagenti backend maʼlumotlar bazasi schemaʼsini umuman koʻrmaydi.

Codexʼda muhit kontekstiga oid yana bir nozik dizayn mavjud. Hamjamiyatning [codex-harness-internals](https://github.com/AlexKenbo/codex-harness-internals) manba kodi tahliliga koʻra, `build_environment_update_item` har safar toʻliq tizim kontekstini takrorlamaydi, faqat muhit oʻzgarganda **oʻzgargan maydonlarni** (CWD, git branch, fayl tizimi) chiqaradi. Bu “kontekstda takroriy tokenlarni saqlamaslik”ning muhandislik darajasidagi amalga oshirilishidir.

## Vositalar va chegaralar: worktree izolyatsiyasi + subagentlar

Codexʼning ikkita asosiy harness mexanizmi:

**1. Muhitni git worktree bilan izolyatsiya qilish.** [“Harness Engineering” maqolasining](https://openai.com/index/harness-engineering/) “Environment” boʻlimida har bir vazifa mustaqil git worktree ichida bajarilishi aytiladi. U mahalliy kuzatuvchanlik steki (loglar, metrikalar, tracing) bilan birga ishlaydi va har bir oʻzgarishni alohida muhitda tekshirish imkonini beradi. Bu yettinchi maʼruzadagi “agent uchun har bir vazifaning chegarasini aniq belgilang” tamoyilining jismoniy amalga oshirilishidir: chegara yoʻriqnoma bilan iltimos qilish orqali emas, muhit izolyatsiyasi orqali majburan oʻrnatiladi. Bu yerda muhit (environment) quyi tizimi qatʼiy izolyatsiyaga aylantirilgan.

**2. Yadro darajasidagi subagentlar.** Codexʼning `spawn_agent` / `wait_agent` vositalari yadro darajasida ishlaydi: model subagentni bevosita yaratadi, unga mustaqil sessiya tarixi va vositalar toʻplamini beradi hamda natijasini kutadi. Subagent ota agentning AGENTS.md yoʻriqnomalarini meros qilib oladi, lekin **oʻz konteksti**da ishlaydi. Sozlamalar `.codex/agents/*.toml` ichida saqlanadi va ularda turli model hamda yoʻriqnomalarni belgilash mumkin (tafsilotlar: [Context Engineering for Codex CLI](https://codex.danielvaughan.com/2026/06/10/context-engineering-codex-cli-write-select-compress-isolate-june-2026/) maqolasining Sub-agents boʻlimi). Bu “kontekst izolyatsiyasi”ning bevosita amalga oshirilishi va ayni paytda oʻn ikkinchi maʼruzadagi “topshirish” ruhining ifodasidir: har bir subagent aniq chegaralangan ish birligidir.

## Qayta aloqa quyi tizimi: tekshiruv buyruqlarini standartga kiritish

OpenAI amaliyotidagi eng muhim talab: tekshiruv buyruqlarini AGENTS.md ichida aniq yozish va “toʻgʻri bajarilganini qanday tasdiqlash”ni reponing bir qismiga aylantirish. Codex muhandislik jarayonida testlar, CI, hujjatlar va kuzatuvchanlik sozlamalarining barchasini Codex yaratadi va ularning har biri “bajariladigan tekshiruv yoʻli” hisoblanadi. Model kuchli, ammo ishonchsiz boʻlishi muammosining yechimi model oʻzini nazorat qilishiga umid bogʻlash emas, balki **tekshiruv yoʻlini harnessʼning standart komponentiga aylantirish**dir.

Tasdiqlash siyosatlari (approval policies) va reja rejimi (plan mode) qayta aloqaning boshqa yoʻnalishini taʼminlaydi: xavfli operatsiyani bajarishdan oldin reja tuziladi va tasdiq soʻraladi. Shu tariqa “vazifa chegarasi” va “insonning qaror qabul qilish huquqi” runtime boshqaruviga aylantiriladi.

## Kurs modeliga moslashtirish

| Quyi tizim | Codexʼdagi amalga oshirilishi | Baho |
| --- | --- | --- |
| Yoʻriqnomalar | AGENTS.md mundarija sahifasi + docs/ ichiga ajratish + bajarilish invariantlari | Namunaviy daraja; “qoʻllanmani emas, xaritani bering” tamoyilini belgilab berdi |
| Vositalar | worktree izolyatsiyasi + spawn_agent subagentlari | Chegaralar muhit orqali qatʼiy izolyatsiya qilinadi; juda kuchli |
| Muhit | Mustaqil worktree + kuzatuvchanlik steki | worktree izolyatsiyasi — uning oʻziga xos belgisi |
| Holat | Write strategiyasi (holatni fayl/hujjatlarga yozish) | Ichki xotiradan koʻra konvensiyalarga tayanadi |
| Qayta aloqa | Tekshiruv buyruqlari standart ichida + tasdiqlash siyosatlari + plan mode | Qayta aloqa yoʻli standartlashtirilgan; oʻrganishga arziydi |

Codex va Claude Code taqqoslanishi juda qiziq. Claude Code “qoʻshish” yoʻlini tanlaydi — xotira, ruxsat va subagentlarning barchasini yadroga joylaydi. Codex esa “ayirish” yoʻlidan boradi — yadroni imkon qadar ixcham saqlab, koʻproq masʼuliyatni repo konvensiyalari va kontekst muhandisligiga yuklaydi. Shu sababli hamjamiyatda “Codexʼning harness falsafasi uning kodidan ham qimmatliroq” degan fikr tez-tez uchraydi.

## Oʻrganishga arziydigan dizaynlar

1. **AGENTS.mdʼni mundarija sahifasi sifatida yozing**: uni taxminan 100 qator bilan cheklang, tafsilotlar uchun docs/ ichidagi hujjatlarga yoʻnaltiring va mexanik tekshiruv imkonini saqlang.
2. **Faqat invariantlarni yozing, amalga oshirishni mayda boshqarmang**: qatʼiy cheklovlar + tekshiruv buyruqlari; qolganini modelga qoldiring.
3. **Muhitni worktree bilan izolyatsiya qiling**: vazifa chegarasini yoʻriqnoma bilan iltimos qilish emas, muhit bilan majburlash kerak.
4. **Muhit kontekstining faqat oʻzgarishini uzating**: har safar toʻliq tizim kontekstini qayta kiritmang, faqat oʻzgargan maydonlarni chiqaring.
5. **Kontekstni subagentlar bilan izolyatsiya qiling**: vazifani ajratish bilan birga kontekstni ham ajrating; kichik vazifalar asosiy siklni ifloslantirmasin.

## Manbalar (asl matn / manba kodi)

Har bir daʼvoni taxminlarga emas, quyidagi asl matn yoki manba kodiga bogʻlash mumkin:

- **OpenAI “Harness Engineering”**: AGENTS.md mundarija sahifasi va taxminan 100 qatorlik tavsiya, executive invariants / don't micromanage, worktree izolyatsiyasi + kuzatuvchanlik steki, tekshiruv buyruqlarini standartga kiritish, millionlab qatorli mahsulot misoli, tasdiqlash siyosatlari va plan mode. Ushbu maqoladagi barcha asosiy daʼvolarning bosh manbasi.<br/>https://openai.com/index/harness-engineering/
- **OpenAIʼning rasmiy “AGENTS.md” standarti** (AGENTS.mdʼning turli vositalar uchun umumiy konvensiyasi):<br/>https://openai.com/index/agents-md/
- **Codex CLI ochiq manbali reposi** (Rustʼda yozilgan monolit binar fayl):<br/>https://github.com/openai/codex
- **Context Engineering for Codex CLI** (hamjamiyat): Write-Select-Compress-Isolate modeli, `/compact` va `compact_prompt`, `spawn_agent` / `wait_agent` subagentlari hamda `.codex/agents/*.toml` sozlamalari.<br/>https://codex.danielvaughan.com/2026/06/10/context-engineering-codex-cli-write-select-compress-isolate-june-2026/
- **codex-harness-internals** (hamjamiyatning manba kodi tahlili): `build_environment_update_item` orqali muhit kontekstining oʻzgarishlarini uzatish kabi amalga oshirish tafsilotlari.<br/>https://github.com/AlexKenbo/codex-harness-internals

Tegishli maʼruzalar: [3-maʼruza · Kod reposini yagona haqiqat manbaiga aylantirish](../../lectures/lecture-03-why-the-repository-must-become-the-system-of-record/) ｜ [4-maʼruza · Yoʻriqnomalarni turli fayllarga ajratish](../../lectures/lecture-04-why-one-giant-instruction-file-fails/) ｜ [7-maʼruza · Agent uchun har bir vazifaning chegarasini aniq belgilash](../../lectures/lecture-07-why-agents-overreach-and-under-finish/)
