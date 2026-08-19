<p align="center">
  <a href="../../README.md"><img alt="English" src="https://img.shields.io/badge/EN-English-blue?style=flat-square"></a>
  <a href="../zh-CN/README.md"><img alt="简体中文" src="https://img.shields.io/badge/ZH-简体中文-red?style=flat-square"></a>
  <a href="../zh-TW/README.md"><img alt="繁體中文" src="https://img.shields.io/badge/ZH--TW-繁體中文-orange?style=flat-square"></a>
  <a href="../ja-JP/README.md"><img alt="日本語" src="https://img.shields.io/badge/JA-日本語-green?style=flat-square"></a>
  <a href="../ko-KR/README.md"><img alt="한국어" src="https://img.shields.io/badge/KO-한국어-blueviolet?style=flat-square"></a>
  <a href="../es-ES/README.md"><img alt="Español" src="https://img.shields.io/badge/ES-Español-yellow?style=flat-square"></a>
  <a href="../fr-FR/README.md"><img alt="Français" src="https://img.shields.io/badge/FR-Français-007EC6?style=flat-square"></a>
  <a href="../ru-RU/README.md"><img alt="Русский" src="https://img.shields.io/badge/RU-Русский-informational?style=flat-square"></a>
  <a href="../de-DE/README.md"><img alt="Deutsch" src="https://img.shields.io/badge/DE-Deutsch-2EA043?style=flat-square"></a>
  <a href="../ar-SA/README.md"><img alt="العربية" src="https://img.shields.io/badge/AR-العربية-success?style=flat-square"></a>
  <a href="../vi-VN/README.md"><img alt="Tiếng Việt" src="https://img.shields.io/badge/VI-Tiếng_Việt-cc6699?style=flat-square"></a>
  <a href="../uz-UZ/README.md"><img alt="Oʻzbekcha" src="https://img.shields.io/badge/UZ-Oʻzbekcha-1A8BBA?style=flat-square"></a>
  <a href="../tr-TR/README.md"><img alt="Türkçe" src="https://img.shields.io/badge/TR-Türkçe-E30A17?style=flat-square"></a>
  <a href="../pt-BR/README.md"><img alt="Português-BR" src="https://img.shields.io/badge/PT--BR-Português-1A8BBA?style=flat-square"></a>
  <a href="../uk-UA/README.md"><img alt="Українська" src="https://img.shields.io/badge/UK-Українська-0057B7?style=flat-square"></a>
</p>

# Learn Harness Engineering

> **Muhitlar, holat boshqaruvi, tekshiruv va nazorat mexanizmlarini qurishga bagʻishlangan, KI kod yozuvchi agentlarini ishonchli qiladigan loyihaga asoslangan kurs.**

Learn Harness Engineering — KI kod yozuvchi agentlarini ishlab chiqishga bagʻishlangan kurs. Biz sanoatdagi Harness Engineering sohasining eng ilgʻor nazariya va amaliyotlarini chuqur oʻrganib, sintez qildik. Asosiy manbalarimiz:

> **🆕 2026-yil avgust yangilanishi: Frontier Harness Design Breakdowns (Ilgʻor harness dizayni tahlillari)** — 4 ta tahlildan iborat yangi boʻlim:
>
> - **Yangi boʻlim** [Frontier Harness Design Breakdowns](../../docs/uz/harness-designs/index.md) — kursning besh quyi tizimli freymvorkini (koʻrsatmalar, vositalar, muhit, holat, fikr-mulohaza) qoʻllab, toʻrtta ilgʻor mahsulot haqiqiy harnessʼlarni qanday qurishini teskari muhandislik orqali tahlil qiling.
> - **Pi** [Pi oʻz harnessʼini qanday quradi](../../docs/uz/harness-designs/pi/index.md) — minimal yadro, dasturlashtiriladigan kengaytirish va «Piʼdan xohlagan narsangizni qurishni soʻrang» tamoyili ortidagi kontekst muhandisligi.
> - **Claude Code** [Claude Code oʻz harnessʼini qanday quradi](../../docs/uz/harness-designs/claude-code/index.md) — toʻrt qatlamli xotira, besh darajali siqish, hookʼlar va sub-agent izolyatsiyasi.
> - **Codex** [Codex oʻz harnessʼini qanday quradi](../../docs/uz/harness-designs/codex/index.md) — repozitoriy haqiqat manbai sifatida, AGENTS.md katalog sahifasi sifatida va worktree izolyatsiyasi.
> - **DeepSeek** [DeepSeek oʻz harnessʼini qanday quradi](../../docs/uz/harness-designs/deepseek/index.md) — «hamma narsa — plugin», imkoniyatlar chegaralari va hodisalar konveyeri.
> - **Barcha 15 ta til** — qoʻllab-quvvatlanadigan barcha tillar uchun toʻliq tarjima qamrovi.
>
> **Asosiy fikr:** Kurs sizga freymvork beradi; bu tahlillar ayni tamoyillar amaldagi harnessʼlarda qanday roʻyobga chiqishini koʻrsatadi.
>
> **🆕 2026-yil avgust yangilanishi: Graph Engineering (Graf muhandisligi)** — 1 ta yangi maʼruza + 1 ta loyiha qoʻshildi:
>
> - **14-maʼruza** [Yakka loopʼdan grafik muhandisligigacha](../../docs/uz/lectures/lecture-14-graph-engineering/index.md): nima uchun yakka loop muqarrar ravishda grafikka aylanadi — toʻrt qatlamli qoʻshilish (prompt → context → loop → graph) va harnessʼning undagi oʻrni, grafikning toʻrt qismi (tugunlar, chekkalar, umumiy holat, marshrutlash), nima uchun loop ichidagi checkpointʼlar miqyosdagi uchta strukturaviy muvaffaqiyatsizlikni (Goodhart, yuqoriga qarab koʻrlilik, konflikt) qutqara olmaydi, freymvorkdan mustaqil olti qadamli birinchi grafikni qurish, Graph va Workflow oʻrtasidagi farq, anchorʼlar, eʼlondan oldingi va keyingi ochiq manbali loyihalar holati, orkestratsiya soligʼi va qachon haqiqatan grafik chizishga arzir.
> - **Loyiha 08** [Ish oqimingizni grafik qilib chizing](../../docs/uz/projects/project-08-graph-engineering-first-graph/index.md): uchta progressiv eksperiment — maker-checker loopʼni eksplisit grafik qilib chizish, parallel fan-out/fan-in tugunlarini qoʻshish, shartli qaytish chekkasi va inson tasdiqlash tugunini qoʻshish.
>
> **Asosiy fikr:** Loop — faqat bitta tugunli grafik. Vazifa mehnat taqsimoti, parallellik, umumiy holat, tekshiruv va tiklashni talab qilganda — u endi loop emas, grafikdir.
>
> **🆕 2026-yil iyul yangilanishi: Loop Engineering (Loop muhandisligi)** — 1 ta yangi maʼruza + 1 ta loyiha + kod andozalari qoʻshildi:
>
> - **13-maʼruza** [Nega agentingizga prompt yozishni bas qilishingiz kerak](../../docs/uz/lectures/lecture-13-loop-engineering/index.md): `/goal` dan loop muhandisligining olti primitivigacha (automations, worktrees, skills, connectors, sub-agents, external state), generator/evaluator boʻlinishi, toʻrtta jim xarajat va birinchi loopʼingizni bosqichma-bosqich qurish.
> - **Loyiha 07** [Birinchi avtomatlashtirilgan loopʼingizni qurish](../../docs/uz/projects/project-07-loop-engineering-first-loop/index.md): uchta progressiv eksperiment — maqsadli loop, taymer loop, maker-checker loop. Qoʻlda vs avtomatik taqqoslash, aralashuv kamayishini oʻlchash, loopʼdan tashqariga chiqishni oʻrganish.
> - **Kod andozalari**: `goal-template.md`, `loop-state-template.md`, `maker-prompt.md`, `checker-prompt.md` — qutidan chiqib ishlatiladigan loop qurish andozalari.
>
> **Asosiy fikr:** Harness muhandisligi mashina qurdi. Loop muhandisligi u harakatlanadigan yoʻlni loyihalaydi — va siz bu yoʻlni mashina tashqarisidan loyihalaysiz.

- [OpenAI: Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)
- [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Anthropic: Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [Awesome Harness Engineering](https://github.com/walkinglabs/awesome-harness-engineering)

> **Tezkor boshlash?** [`skills/harness-creator/`](../../skills/harness-creator/) skillʼi sizga oʻz loyihangiz uchun daqiqalar ichida ishlab chiqarish darajasidagi harness (AGENTS.md, funksiya roʻyxatlari, init.sh, tekshiruv oqimlari) yaratishga yordam beradi.

---

## Mundarija

- [Vizual oldindan koʻrish](#vizual-oldindan-koʻrish)
- [Harness Engineering nima degani](#harness-engineering-nima-degani)
- [Tezkor boshlash: Agentingizni bugunoq yaxshilang](#tezkor-boshlash-agentingizni-bugunoq-yaxshilang)
- [Yakuniy loyiha: Haqiqiy ilova](#yakuniy-loyiha-haqiqiy-ilova)
- [Oʻqish yoʻli](#oʻqish-yoʻli)
- [Oʻquv dasturi](#oʻquv-dasturi)
- [Skillʼlar](#skillʼlar)
- [Boshqa kurslar](#boshqa-kurslar)

---

## Vizual oldindan koʻrish

### Kurs bosh sahifasi
> Kursning toʻliq umumiy koʻrinishi va aniq boshlash yoʻlini taʼminlovchi asosiy falsafalarga kirish.

![Kurs bosh sahifasining oldindan koʻrinishi](../../docs/public/screenshots/readme/zh-home.png)

### Choʻmilishli maʼruzalar
> Haqiqiy muammolar va amaliy loyihalar (masalan, 01-loyiha) boʻyicha chuqur tahlillar, choʻmilishli oʻqish tajribasi uchun.

![Kurs maʼruzasi oldindan koʻrinishi](../../docs/public/screenshots/readme/zh-lecture-01.png)

### Andozalar kutubxonasi
> Koʻp burqli KI agentlarini ishlab chiqishda uchraydigan umumiy muammolarni, masalan kontekst yoʻqotilishi va muddatidan oldin vazifani tugatishni hal qilish uchun moʻljallangan andozalar va moslashtirilgan konfiguratsiyalar.

![Andozalar kutubxonasi oldindan koʻrinishi](../../docs/public/screenshots/readme/zh-resources.png)

## PDF kurs kitoblari

Repozitoriyada endi kurs materiallari uchun PDF yaratish pipelineʼi mavjud.

- Ingliz va xitoy PDFʼlarini mahalliy tarzda yaratish uchun `npm run pdf:build` buyrugʻini bajaring.
- Natija fayllari `artifacts/pdfs/` papkasiga yoziladi.
- README oldindan koʻrish rasmlarini yangilash uchun `npm run screenshots:readme` buyrugʻini bajaring.
- [`release-course-pdfs.yml`](../../.github/workflows/release-course-pdfs.yml) GitHub Actions workflowʼi PDFʼlarni yaratib, GitHub Releasesʼga chiqarishi mumkin.

---

## Model aqlli, harness uni ishonchli qiladi

Aksariyat odamlar ogʻir yoʻl bilan oʻrganadigan bitta qatʼiy haqiqat bor: **Dunyodagi eng kuchli model haqiqiy muhandislik vazifalarida, agar siz unga mos muhit yaratmasangiz, baribir muvaffaqiyatsiz boʻladi.**

Siz buni ehtimol oʻzingiz ham boshdan kechirgansiz. Claude yoki GPTʼga oʻz repozitoriyoringizda vazifa bersangiz. U yaxshi boshlanadi — fayllarni oʻqiydi, kod yozadi, samarali koʻrinadi. Keyin nimadir notoʻgʻri ketadi. Bir qadamni oʻtkazib yuboradi. Testni buzadi. "Tayyor" deydi, lekin hech narsa haqiqatan ishlamaydi. Oʻzingiz qilgandan koʻra koʻproq vaqtni tuzatishga sarflaysiz.

Bu model muammosi emas. Bu harness muammosi.

Dalillar aniq. Anthropic nazorat qilingan tajriba oʻtkazdi: bir xil model (Opus 4.5), bir xil soʻrov ("2D retro oʻyin muharriri yarating"). Harnessʼsiz u 20 daqiqada 9 $ sarfladi va ishlamaydigan narsa yaratdi. Toʻliq harness bilan (rejalashtiruvchi + generator + baholovchi) u 6 soatda 200 $ sarfladi va haqiqatan oʻynash mumkin boʻlgan oʻyin yaratdi. Model oʻzgarmadi. Harness oʻzgardi.

OpenAI Codex bilan xuddi shu haqida xabar berdi: yaxshi harnesslangan repozitoriyada bir xil model "ishonchsiz"dan "ishonchli"ga oʻtadi. Bu marginal yaxshilanish emas — sifat sakrashi.

**Ushbu kurs sizga shu muhitni qanday qurishni oʻrgatadi.**

```text
                    HARNESS NAMUNASI
                    ================

    Siz --> vazifa berasiz --> Agent harness fayllarini oʻqiydi --> Agent bajaradi
                                                                      |
                                                        harness har bir qadamni boshqaradi:
                                                        |
                                                        +--> Koʻrsatmalar: nima qilish, qanday tartibda
                                                        +--> Doira:       bir vaqtda bitta funksiya, haddan oshmaslik
                                                        +--> Holat:       taraqqiyot jurnali, funksiya roʻyxati, git tarixi
                                                        +--> Tekshiruv:   testlar, lint, tur-tekshirish, sinov ishga tushirish
                                                        +--> Hayot sikli: boshida ishga tushirish, oxirida toza holat
                                                        |
                                                        v
                                                   Agent faqat tekshiruv
                                                   oʻtganda toʻxtaydi
```

---

## Harness Engineering nima degani

Harness Engineering — model atrofida toʻliq ish muhiti qurishdir, shunda u ishonchli natijalar beradi. Bu yaxshi promptʼlar yozish haqida emas. Bu model ishlaydigan tizimni loyihalash haqida.

Harnessʼning beshta quyi tizimi bor:

```text
    ┌─────────────────────────────────────────────────────────────────┐
    │                          HARNESS                                │
    │                                                                 │
    │   ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
    │   │ Koʻrsatmalar │  │    Holat     │  │     Tekshiruv        │ │
    │   │              │  │              │  │                      │ │
    │   │ AGENTS.md    │  │ progress.md  │  │ testlar + lint       │ │
    │   │ CLAUDE.md    │  │ feature_list │  │ tur-tekshirish       │ │
    │   │ feature_list │  │ git log      │  │ sinov ishga tushirish│ │
    │   │ docs/        │  │ sessiya uzat │  │ e2e pipeline         │ │
    │   └──────────────┘  └──────────────┘  └──────────────────────┘ │
    │                                                                 │
    │   ┌──────────────┐  ┌──────────────────────────────────────┐   │
    │   │    Doira     │  │       Sessiya hayot sikli             │   │
    │   │              │  │                                      │   │
    │   │ bir vaqtda   │  │ boshida init.sh                      │   │
    │   │ bitta funksiya│  │ oxirida toza-holat tekshiruv roʻyxati│   │
    │   │ "tugadi"     │  │ keyingi sessiya uchun uzatish yozuvi │   │
    │   │ taʼrifi      │  │ faqat xavfsiz davom ettirishda commit│   │
    │   └──────────────┘  └──────────────────────────────────────┘   │
    │                                                                 │
    └─────────────────────────────────────────────────────────────────┘

    MODEL qanday kod yozishni hal qiladi.
    HARNESS qachon, qayerda va qanday yozishni boshqaradi.
    Harness modelni aqlliroq qilmaydi.
    U model natijasini ishonchli qiladi.
```

Har bir quyi tizimning oʻz vazifasi bor:

- **Koʻrsatmalar (Instructions)** — Agentga nima qilish kerak, qanday tartibda va boshlashdan oldin nima oʻqish kerakligini aytish. Bu bitta ulkan fayl emas; agent ehtiyojiga qarab navigatsiya qiladigan progressiv ochilish strukturasi.
- **Holat (State)** — Nima qilingan, nima bajarilayotgan va keyin nima turib qolganini kuzatish. Diskda saqlanadi, shunda keyingi sessiya aynan oldingi toʻxtagan joydan davom etadi.
- **Tekshiruv (Verification)** — Faqat mavjud test toʻplami dalil sifatida hisoblanadi. Agent bajariluvchi dalilsiz muvaffaqiyat haqida xabar bera olmaydi.
- **Doira (Scope)** — Agentni bir vaqtning oʻzida faqat bitta funksiyaga cheklash. Haddan oshmaslik. Uchta narsani yarim-yorti tugatmaslik. Tugallanmagan ishni yashirish uchun funksiya roʻyxatini qayta yozmaslik.
- **Sessiya hayot sikli (Session Lifecycle)** — Boshida ishga tushirish. Oxirida tozalash. Keyingi sessiya uchun toza qayta boshlash yoʻlini qoldirish.

---

## Bu kurs nega mavjud

Savol "Model lar kod yozoladimi?" emas. Yozoladi. Haqiqiy savol: **Ular haqiqiy repozitoriyalarda, bir nechta sessiyalar davomida, doimiy inson nazoratisiz haqiqiy muhandislik vazifalarini ishonchli bajara oladimi?**

Hozircha javob: harnessʼsiz — yoʻq.

```text
    HARNESSʼSIZ                               HARNESS BILAN
    ============                               ============

    1-sessiya: agent kod yozadi              1-sessiya: agent koʻrsatmalarni oʻqiydi
               agent testlarni buzadi                    agent init.sh ni ishga tushiradi
               agent "tugadi" deydi                      agent bitta funksiya ustida ishlaydi
               siz qoʻlbola tuzatasiz                    agent "tugadi" deyishdan oldin tekshiradi
                                                           agent taraqqiyot jurnalini yangilaydi
    2-sessiya: agent yangidan boshlaydi                agent toza holatni commit qiladi
               agentning xotirasi yoʻq
               oldin nima boʻlganini              2-sessiya: agent taraqqiyot jurnalini oʻqiydi
               agent ishni qayta qiladi                   agent aynan toʻxtagan joydan davom etadi
               yoki butunlay boshqa narsa qiladi          agent tugallanmagan funksiyani davom ettiradi
               siz yana tuzatasiz                         siz koʻrib chiqasiz, qutqarmaysiz

    Natija: siz oʻzingiz qilganingizdan       Natija: agent ishni bajaradi,
            koʻra koʻproq vaqtni                      siz natijani tekshirasiz
            tuzatishga sarflaysiz
```

Bu kursni qiziqtiradigan haqiqiy savollar:

- Qanday harness dizaynlari vazifani bajash koʻrsatkichlarini yaxshilaydi?
- Qanday dizaynlar qayta ish va notoʻgʻri tugashlarni kamaytiradi?
- Qanday mexanizmlar uzoq davom etuvchi vazifalarni barqaror oldinga surib turadi?
- Qanday strukturalar tizimni bir nechta agent ishga tushirgandan keyin ham saqlab turiladigan qiladi?

---

## Kurs oʻquv dasturi va hujjatlari

Toʻliq kurs materiallarini **[hujjatlar saytida](https://walkinglabs.github.io/learn-harness-engineering/)** topishingiz mumkin.

Oʻquv dasturi uch qismdan iborat:

1. **Maʼruzalar**: Harness Engineering ortidagi nazariyani tushuntiruvchi 14 konseptual blok.
2. **Loyihalar**: Agent asosidagi ish muhitini noldan quradigan 8 ta amaliy loyiha.
3. **Andozalar kutubxonasi**: Bugunoq oʻz repozitoriyalaringizda ishlatish uchun nusxalashga tayyor andozalar (`AGENTS.md`, `feature_list.json`, `init.sh` va h.k.).

---

## Tezkor boshlash: Agentingizni bugunoq yaxshilang

Foyda olish uchun 14 ta maʼruzani ham oʻqish shart emas. Agar siz allaqachon haqiqiy loyihada kod yozuvchi agentdan foydalansangiz, uni hoziryoq yaxshilashingiz mumkin.

Gʻoya oddiy: faqat promptʼlar yozish oʻrniga, agentingizga nima qilish kerak, nima allaqachon qilingan va ish qanday tekshirilishini belgilovchi strukturaviy fayllar toʻplamini bering. Bu fayllar repozitoriyangizda joylashgan, shunda har bir sessiya bir xil holatdan boshlanadi.

```text
    LOYIHANGIZNING ILDIZ PAPKASI
    ├── AGENTS.md              <-- agentning ish qoʻllanmasi
    ├── CLAUDE.md              <-- (Claude Code ishlatganingizda alternativa)
    ├── init.sh                <-- oʻrnatish + tekshirish + ishga tushirishni bajaradi
    ├── feature_list.json      <-- qanday funksiyalar mavjud, qaysilari tugallangan
    ├── claude-progress.md     <-- har bir sessiyada nima boʻlgani
    └── src/                   <-- sizning haqiqiy kodingiz
```

Boshlangʻich andozalarni [andozalar kutubxonasidan](https://walkinglabs.github.io/learn-harness-engineering/en/resources/) yuklab oling va loyihangizga qoʻshing. Shu. Toʻrtta fayl, va agent sessiyalaringiz allaqachon faqat promptʼlarga qaraganda ancha barqaror boʻladi.

---

## Yakuniy loyiha: Haqiqiy ilova

Sakkizta kurs loyihasi bir xil mahsulot atrofida qurilgan: **Electron asosidagi shaxsiy bilim bazasi uchun desktop ilova**.

```text
    ┌─────────────────────────────────────────────────────┐
    │          Bilim bazasi desktop ilovasi               │
    │                                                     │
    │  ┌──────────────┐  ┌──────────────────────────────┐│
    │  │ Hujjatlar    │  │       S&S paneli              ││
    │  │ roʻyxati     │  │                              ││
    │  │              │  │  S: Harness eng nima?        ││
    │  │ doc-001.md   │  │  J: Agent modeli atrofida    ││
    │  │ doc-002.md   │  │     qurilgan muhit...        ││
    │  │ doc-003.md   │  │     [manba: doc-002.md]      ││
    │  │ ...          │  │                              ││
    │  └──────────────┘  └──────────────────────────────┘│
    │                                                     │
    │  ┌─────────────────────────────────────────────────┐│
    │  │ Holat paneli: 42 hujjat | 38 indekslangan | soʻnggi sinxronizatsiya 3d ││
    │  └─────────────────────────────────────────────────┘│
    └─────────────────────────────────────────────────────┘

    Asosiy funksiyalar:
    ├── Mahalliy hujjatlarni import qilish
    ├── Hujjatlar kutubxonasini boshqarish
    ├── Hujjatlarni qayta ishlash va indekslash
    ├── Import qilingan kontent ustida KI asosidagi S&S oʻtkazish
    └── Manbalar bilan asoslangan javoblarni qaytarish
```

Bu loyiha shuning uchun tanlanganki, u yuqori amaliy foyda, yetarli haqiqiy mahsulot murakkabligi va harness yaxshilanishlarini kuzatish uchun yaxshi stsenariyani oʻzida birlashtiradi.

Har bir kurs loyihasi (boshlangʻich/yechim) ushbu Electron ilovasining mos rivojlanish bosqichidagi toʻliq nusxasidir. P(N+1) boshlangʻichi P(N) yechimidan hosil qilinadi — ilova rivojlanadi, harness koʻnikmalaringiz esa oʻsadi.

---

## Oʻqish yoʻli

Kurs xronologik tartibda bajarish uchun moʻljallangan. Har bir bosqich oldingisiga asoslanadi.

```text
    1-bosqich: MUAMMONI KOʻRISH             2-bosqich: REPONI TUZISH
    ===========================             ========================

    L01  Kuchli modellar ≠ ishonchli       L03  Repo yagona haqiqat
         bajarish                                 manbai sifatida
    L02  Harness nima degani haqiqatan
                                       L04  Koʻrsatmalarni bitta ulkan
         |                                   faylga emas, bir nechta faylga boʻlish
         v
    P01  Faqat prompt vs.                       |
         qoidalarga asoslangan solishtirish      v
                                               P02  Agent oʻqiy oladigan ish muhiti


    3-bosqich: SESSIYALARNI BOGʻLASH        4-bosqich: FIKR-MULOHAZA VA DOIRA
    ================================        ================================

    L05  Kontekstni sessiyalar             L07  Aniq vazifa chegaralarini chizish
         orasida saqlash
                                       L08  Funksiya roʻyxatlari harness
    L06  Har bir agent sessiyasidan               primitivlari sifatida
         oldin ishga tushirish
                                               |
         |                                     v
         v                                     P04  Agent xatti-harakatini
    P03  Koʻp sessiyali uzluksizlik                 tuzatish uchun runtime fikr-mulohaza


    5-bosqich: TEKSHIRUV                   6-bosqich: HAMMASINI BIRGA JAMQILISH
    ===================                    ===================================

    L09  Agentlarga erta                   L11  Agent runtime'ini
         muvaffaqiyat haqida xabar                kuzatiladigan qilish
         berishiga toʻsqinlik qilish
                                       L12  Har bir sessiya oxirida
    L10  Toʻliq pipeline ishga                  toza uzatish
         tushirish = haqiqiy tekshiruv
                                               |
         |                                     v
         v                                     P06  Toʻliq harness qurish
    P05  Agent oʻz ishini mustaqil tekshiradi       (yakuniy loyiha)


    7-bosqich: LOOPNI AVTOMATLASHTIRISH
    ===================================
    L13  Agentingizga prompt yozishni
         to'xtating — o'rniga loop loyihalang
         |
         v
    P07  Birinchi avtomatlashtirilgan loop'ingizni quring
         (maqsadli loop, taymer loop, maker-checker)

    8-bosqich: TIZIMNI TUZILMALASH
    ==============================
    L14  Tizimni grafik qilib chizing —
         tugunlar, chekkalar, umumiy holat,
         marshrutlash
         |
         v
    P08  Ish oqimingizni grafik qilib chizing
         (eksplisit grafik, parallel fan-out/fan-in,
          qaytish chekkalari, inson ishtiroki)
```

Agar parallel oʻqisangiz, har bir bosqich taxminan bir hafta davom etadi. Agar tezroq borishni xohlasangiz, 1–3 bosqichlarni bitta uzun dam olish kunlarida tugatishingiz mumkin.

---

## Oʻquv dasturi

### Maʼruzalar — har biri muhim savolga javob beruvchi 14 ta konseptual blok

*Har bir maʼruza matnini toʻliq oʻqish uchun [hujjatlar sayti](https://walkinglabs.github.io/learn-harness-engineering/)ga murojaat qiling.*

| Sessiya | Savol | Asosiy gʻoya |
|---------|-------|--------------|
| [L01](../../docs/uz/lectures/lecture-01-why-capable-agents-still-fail/index.md) | Kuchli modellar nega haqiqiy vazifalarda muvaffaqiyatsiz boʻladi? | Benchmarkʼlar va haqiqiy muhandislik oʻrtasidagi farq |
| [L02](../../docs/uz/lectures/lecture-02-what-a-harness-actually-is/index.md) | "Harness" nima degani? | Besh quyi tizim: Koʻrsatmalar, Holat, Tekshiruv, Doira, Hayot sikli |
| [L03](../../docs/uz/lectures/lecture-03-why-the-repository-must-become-the-system-of-record/index.md) | Nega repozitoriy yagona haqiqat manbai boʻlishi kerak? | Agar agent koʻrolmasa, u mavjud emas |
| [L04](../../docs/uz/lectures/lecture-04-why-one-giant-instruction-file-fails/index.md) | Nega bitta ulkan koʻrsatma fayli muvaffaqiyatsiz boʻladi? | Progressiv ochilish: xarita berish, ensiklopediya emas |
| [L05](../../docs/uz/lectures/lecture-05-why-long-running-tasks-lose-continuity/index.md) | Nega uzoq davom etuvchi vazifalar uzluksizlikni yoʻqotadi? | Taraqqiyotni diskda saqlash; toʻxtagan joydan davom ettirish |
| [L06](../../docs/uz/lectures/lecture-06-why-initialization-needs-its-own-phase/index.md) | Nega ishga tushirish alohida bosqichga muhtoj? | Agent ishni boshlashdan oldin muhit ishlashini tekshirish |
| [L07](../../docs/uz/lectures/lecture-07-why-agents-overreach-and-under-finish/index.md) | Nega agentlar haddan oshadi va yarim-yorti tugatadi? | Bir vaqtda bitta funksiya; "Tugadi" ning aniq taʼrifi |
| [L08](../../docs/uz/lectures/lecture-08-why-feature-lists-are-harness-primitives/index.md) | Nega funksiya roʻyxatlari harness primitivlari hisoblanadi? | Agent eʼtiborsiz qoldirolmaydigan, mashina oʻqiyoladigan doira chegaralari |
| [L09](../../docs/uz/lectures/lecture-09-why-agents-declare-victory-too-early/index.md) | Nega agentlar juda erta muvaffaqiyat haqida xabar beradi? | Tekshiruv boʻshliqlari: ishonch = toʻgʻrilik emas |
| [L10](../../docs/uz/lectures/lecture-10-why-end-to-end-testing-changes-results/index.md) | Nega uchdan-uchgacha testlash natijalarni oʻzgartiradi? | Faqat toʻliq pipeline ishga tushirish haqiqiy tekshiruv hisoblanadi |
| [L11](../../docs/uz/lectures/lecture-11-why-observability-belongs-inside-the-harness/index.md) | Nega kuzatuvchanlik harness ichida boʻlishi kerak? | Agent nima qilganini koʻrolmasangiz, u buzgan narsani tuzata olmaysiz |
| [L12](../../docs/uz/lectures/lecture-12-why-every-session-must-leave-a-clean-state/index.md) | Nega har bir sessiya toiza holat qoldirishi kerak? | Keyingi sessiyaning muvaffaqiyati shu sessiyaning tozalanishiga bogʻliq |
| [L13](../../docs/uz/lectures/lecture-13-loop-engineering/index.md) | Nega agentingizga prompt yozishni bas qilishingiz kerak? | Qoʻlda prompt yozishdan avtonom loopʼlargacha — maqsadli loop, taymer loop, maker-checker boʻlinishi |
| [L14](../../docs/uz/lectures/lecture-14-graph-engineering/index.md) | Nega yakka loop grafikka aylanadi? | Yakka loopʼdan grafik muhandisligigacha — tugunlar, chekkalar, umumiy holat, marshrutlash va qachon haqiqatan grafik chizishga arzir |

### Loyihalar — maʼruza usullarini bir xil Electron ilovasiga qoʻllaydigan 8 ta amaliy loyiha

| Loyiha | Nima qilasiz | Harness mexanizmi |
|---------|--------------|-------------------|
| [P01](../../docs/uz/projects/project-01-baseline-vs-minimal-harness/index.md) | Bir xil vazifani ikki marta bajarish: faqat prompt vs. qoidalarga asoslangan | Minimal harness: AGENTS.md + init.sh + feature_list.json |
| [P02](../../docs/uz/projects/project-02-agent-readable-workspace/index.md) | Repoʼni agent oʻqiy oladigan qayta tuzish | Agent oʻqiy oladigan ish muhiti + doimiy holat fayllari |
| [P03](../../docs/uz/projects/project-03-multi-session-continuity/index.md) | Agentni toʻxtagan joyidan davom ettirish | Taraqqiyot jurnali + sessiya uzatish + koʻp sessiyali uzluksizlik |
| [P04](../../docs/uz/projects/project-04-incremental-indexing/index.md) | Agentning koʻp yoki oz ishlashining oldini olish | Runtime fikr-mulohaza + doira nazorati + inkremental indekslash |
| [P05](../../docs/uz/projects/project-05-grounded-qa-verification/index.md) | Agentni oʻz ishini tekshirishga majburlash | Oʻz-oʻzini tekshirish + asoslangan S&S + dalillarga asoslangan tugatish |
| [P06](../../docs/uz/projects/project-06-runtime-observability-and-debugging/index.md) | Toʻliq harnessʼni noldan qurish (yakuniy loyiha) | Toʻliq harness: barcha mexanizmlar + kuzatuvchanlik + ablyatsiya tadqiqoti |
| [P07](../../docs/uz/projects/project-07-loop-engineering-first-loop/index.md) | Birinchi avtomatlashtirilgan loopʼingizni qurish | Maqsadli loop, taymer loop, maker-checker boʻlinishi, loop holat boshqaruvi |
| [P08](../../docs/uz/projects/project-08-graph-engineering-first-graph/index.md) | Ish oqimingizni grafik qilib chizing | Eksplisit tugun/chekka/holat/marshrutlash, parallel fan-out/fan-in, qaytish chekkalari, inson ishtiroki tasdiqlash |

```text
    LOYIHA RIVOJLANISHI
    ===================

    P01  Faqat prompt vs. qoidalarga asoslangan    Siz muammoni koʻrasiz
     |
     v
    P02  Agent oʻqiy oladigan ish muhiti            Siz repolarni qayta tuzasiz
     |
     v
    P03  Koʻp sessiyali uzluksizlik                 Siz sessiyalarni bogʻlaysiz
     |
     v
    P04  Runtime fikr-mulohaza va doira             Siz fikr-mulohaza halqalarini qoʻshasiz
     |
     v
    P05  Oʻz-oʻzini tekshirish                      Siz agentni oʻz-oʻzini tekshirishga majburlaysiz
     |
     v
    P06  Toʻliq harness (yakuniy loyiha)            Siz toʻliq tizimni qurasiz
     |
     v
    P07  Birinchi avtomatlashtirilgan loopʼingiz        Siz loopʼdan tashqariga chiqasiz
     |
     v
    P08  Ish oqimingizni grafik qilib chizing            Siz tizimni grafik qilib chizasiz

    Har bir loyihaning yechimi keyingi loyihaning boshlangʻichiga aylanadi.
    Ilova rivojlanadi. Harness koʻnikmalaringiz unga qarab oʻsadi.
```

### Andozalar kutubxonasi

- [English](https://walkinglabs.github.io/learn-harness-engineering/en/resources/) — templates, checklists, and method references
- [简体中文](https://walkinglabs.github.io/learn-harness-engineering/zh/resources/) — 中文模板、清单和方法参考
- [繁體中文](https://walkinglabs.github.io/learn-harness-engineering/zh-TW/resources/) — 繁體中文範本、清單和方法參考
- [日本語](https://walkinglabs.github.io/learn-harness-engineering/ja/resources/) — テンプレート、チェックリスト、方法リファレンス
- [한국어](https://walkinglabs.github.io/learn-harness-engineering/ko/resources/) — 템플릿, 체크리스트, 방법 참고 자료
- [Español](https://walkinglabs.github.io/learn-harness-engineering/es/resources/) — plantillas, listas de verificación y referencias
- [Français](https://walkinglabs.github.io/learn-harness-engineering/fr/resources/) — modèles, listes de contrôle et références
- [Русский](https://walkinglabs.github.io/learn-harness-engineering/ru/resources/) — шаблоны, чек-листы и справочники
- [Deutsch](https://walkinglabs.github.io/learn-harness-engineering/de/resources/) — Vorlagen, Checklisten und Referenzen
- [العربية](https://walkinglabs.github.io/learn-harness-engineering/ar/resources/) — قوالب، قوائم تحقق ومراجع
- [Tiếng Việt](https://walkinglabs.github.io/learn-harness-engineering/vi/resources/) — mẫu, danh sách kiểm tra và tài liệu tham khảo
- [Oʻzbekcha](https://walkinglabs.github.io/learn-harness-engineering/uz/resources/) — andozalar, tekshiruv roʻyxatlari va maʼlumotnomalar
- [Türkçe](https://walkinglabs.github.io/learn-harness-engineering/tr/resources/) — şablonlar, kontrol listeleri ve referanslar
- [Português (BR)](https://walkinglabs.github.io/learn-harness-engineering/pt-BR/resources/) — modelos, listas de verificação e referências de métodos

---

## Agent sessiyasi hayot sikli

Ushbu kursning asosiy gʻoyalaridan biri: **Agent sessiyasi tuzilgan hayot sikliga amal qilishi kerak, emas xohlagancha ishlashiga.** Bu quyidagicha koʻrinadi:

```text
    AGENT SESSIYA HAYOT SIKLI
    =========================

    ┌──────────────────────────────────────────────────────────────────┐
    │  BOSHLASH                                                       │
    │                                                                  │
    │  1. Agent AGENTS.md / CLAUDE.md faylini oʻqiydi                 │
    │  2. Agent init.sh ni ishga tushiradi (oʻrnatish, tekshirish, sogʻliqni nazorat)│
    │  3. Agent claude-progress.md ni oʻqiydi (oxirgi safar nima boʻldi)│
    │  4. Agent feature_list.json ni oʻqiydi (nima tugadi, keyin nima)│
    │  5. Agent git log ni tekshiradi (soʻnggi oʻzgarishlar)          │
    │                                                                  │
    │  TANLASH                                                         │
    │                                                                  │
    │  6. Agent aynan BITTA tugallanmagan funksiyani tanlaydi          │
    │  7. Agent faqat shu funksiya ustida ishlaydi                    │
    │                                                                  │
    │  BAJARISH                                                        │
    │                                                                  │
    │  8. Agent funksiyani amalga oshiradi                             │
    │  9. Agent tekshiruvni ishga tushiradi (testlar, lint, tur-tekshirish)│
    │  10. Agar tekshiruv oʻtmasa: tuzatish va qayta ishga tushirish  │
    │  11. Agar tekshiruv oʻtsa: dalilni qayd etish                    │
    │                                                                  │
    │  YAKUNLASH                                                       │
    │                                                                  │
    │  12. Agent claude-progress.md ni yangilaydi                      │
    │  13. Agent feature_list.json ni yangilaydi                       │
    │  14. Agent hali buzilgan yoki tekshirilmagan narsalarni qayd etadi│
    │  15. Agent commit qiladi (faqat xavfsiz davom ettirishda)        │
    │  16. Agent keyingi sessiya uchun toza qayta boshlash yoʻlini qoldiradi│
    │                                                                  │
    └──────────────────────────────────────────────────────────────────┘

    Harness ushbu hayot siklidagi har bir oʻtishni boshqaradi.
    Model har bir qadamda qanday kod yozishni hal qiladi.
    Harnessʼsiz 9-qadam "agent yaxshi koʻrinadi deydi" ga aylanadi.
    Harness bilan 9-qadam "testlar oʻtdi, lint toza, turlar tekshirildi" boʻladi.
```

---

## Bu kurs kim uchun?

Bu kurs quyidagilar uchun moʻljallangan:

- Kod yozuvchi agentlardan foydalanayotgan va koʻproq barqarorlik va sifat xohlaydigan dasturchilar
- Harness dizayni boʻyicha tizimli tushunchaga ega boʻlishni xohlaydigan tadqiqotchilar yoki dasturchilar
- Muhit dizayni agent ish faoliyatiga qanday taʼsir qilishini tushunmoqchi boʻlgan texnik yetakchilar

Bu kurs quyidagilar uchun moʻljallanmagan:

- Dasturlashsiz KI kirishini qidirayotganlar
- Faqat promptʼlar bilan qiziqqan va haqiqiy amalga oshirishni rejalashtirmaydiganlar
- Agentlarni haqiqiy repozitoriyalarda ishlashga tayyor boʻlmagan oʻquvchilar

---

## Talablar

Bu siz haqiqatan kod yozuvchi agentlarni ishga tushiradigan kurs.

Kamida quyidagi vositalardan biriga muhtojsiz:

- Claude Code
- Codex
- Fayl tahrirlash, buyruqlarni bajarish va koʻp bosqichli vazifalarni qoʻllab-quvvatlovchi boshqa IDE yoki CLI kod yozuvchi agent

Kurs quyidagilarni talab qiladi:

- Mahalliy repozitoriyni ochish
- Agentga fayllarni tahrirlashga ruxsat berish
- Agentga buyruqlar bajarishga ruxsat berish
- Natijalarni tekshirish va vazifalarni qayta boshlash

Agar sizda bunday vosita boʻlmasa, kurs materiallarini oʻqiy olasiz, lekin loyihalarni rejalashtirilganidek bajara olmaysiz.

---

## Mahalliy oldindan koʻrish

Ushbu repozitoriy hujjatlar koʻrish vositasi sifatida VitePressʼdan foydalanadi.

```sh
npm install
npm run docs:dev        # Hot reload bilan dev-server
npm run docs:build      # Ishlab chiqarish buildʼi
npm run docs:preview    # Yaratilgan saytni oldindan koʻrish
```

Keyin VitePress koʻrsatadigan mahalliy URLʼni brauzeringizda oching.

---

## Oldindan bilim

Talab qilinadi:

- Terminal, Git va mahalliy rivojlanish muhitlari bilan tanishlik
- Kamida bitta keng tarqalgan ilova stackʼida kodni oʻqish va yozish qobiliyati
- Asosiy dasturiy xatolarni tuzatish tajribasi (logʼlarni oʻqish, testlar va runtime xatti-harakati)
- Amalga oshirishga yoʻnaltirilgan kurs ishi uchun yetarli vaqt

Yordam beradi, lekin majburiy emas:

- Electron, desktop ilovalar yoki local-first vositalar bilan tajriba
- Testlash, logʼlash yoki dasturiy taʼminot arxitekturasi sohasida tajriba
- Codex, Claude Code yoki shunga oʻxshash kod yozuvchi agentlar bilan oldingi tajriba

---

## Asosiy manbalar

Birlamchi:

- [OpenAI: Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)
- [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Anthropic: Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [OpenAI: Unrolling the Codex agent loop](https://openai.com/index/unrolling-the-codex-agent-loop/)
- [Anthropic: Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- [LangChain: Improving Deep Agents with harness engineering](https://www.langchain.com/blog/improving-deep-agents-with-harness-engineering)
- [Thoughtworks / Martin Fowler: Harness engineering for coding agent users](https://martinfowler.com/articles/harness-engineering.html)
- [Cursor: Continually improving our agent harness](https://cursor.com/blog/continually-improving-agent-harness)

Toʻliq qatlamli manbalar roʻyxatini [`docs/uz/resources/reference/`](../../docs/uz/resources/reference/index.md) da topishingiz mumkin.

---

## Repozitoriy strukturasi

```text
learn-harness-engineering/
├── docs/                          # VitePress hujjatlar sayti
│   ├── lectures/                  # 14 ta maʼruza (index.md + code/ misollar)
│   │   ├── lecture-01-*/
│   │   ├── lecture-02-*/
│   │   └── ... (jami 14 ta)
│   ├── projects/                  # 8 ta loyiha tavsifi
│   │   ├── project-01-*/
│   │   └── ... (jami 8 ta)
│   └── resources/                 # Koʻp tilli andozalar va maʼlumotnomalar
│       ├── en/                    # Ingliz andozalari, tekshiruv roʻyxatlari, qoʻllanmalar
│       ├── zh/                    # Xitoy andozalari, tekshiruv roʻyxatlari, qoʻllanmalar
│       ├── ru/                    # Rus andozalari, tekshiruv roʻyxatlari, qoʻllanmalar
│       └── vi/                    # Vetnam andozalari, tekshiruv roʻyxatlari, qoʻllanmalar
├── projects/
│   ├── shared/                    # Umumiy Electron + TypeScript + React asos
│   └── project-NN/               # Loyihaga oid starter/ va solution/ papkalari
├── skills/                        # Qayta ishlatiladigan KI agent skillʼlari
│   └── harness-creator/           # Harness Engineering skillʼi
├── package.json                   # VitePress + dev vositalari
└── CLAUDE.md                      # Ushbu repo uchun Claude Code koʻrsatmalari
```

---

## Kurs qanday tuzilgan

- Har bir maʼruza bitta savolga qaratilgan
- Kurs 8 ta loyihani oʻz ichiga oladi
- Har bir loyiha agentdan haqiqiy ish bajarishni talab qiladi
- Har bir loyiha kuchsiz vs. kuchli harness natijalarini solishtiradi
- Muhim boʻlgan narsa — oʻlchangan farq, nechta hujjat yozilgani emas

---

## Skillʼlar

Ushbu repozitoriy, shuningdek, toʻgʻridan-toʻgʻri IDE yoki agent ish muhitiga oʻrnatishingiz mumkin boʻlgan qayta ishlatiladigan KI agent skillʼlarini oʻz ichiga oladi.

- [**harness-creator**](../../skills/harness-creator/): Oʻz loyihangiz uchun daqiqalar ichida ishlab chiqarish darajasidagi harness yaratishga yordam beradigan skill.

---

## Boshqa kurslar

Bizning jamoamiz yana boshqa kurslar ham yaratdi! Ularni koʻrib chiqing:

[![Hands-on Modern RL](https://img.shields.io/badge/HANDS--ON_MODERN_RL-0052cc?style=for-the-badge)](https://github.com/walkinglabs/hands-on-modern-rl)

**Hands-on Modern RL**: Asosiy RL konsepsiyalaridan LLM alignment, RLVR va ilgʻor agent tizimlarigacha boʻlgan masofani bridjlash uchun ochiq manbali amaliy oʻquv dasturi.

---

## Yulduzlar tarixi

[![Star History Chart](https://star-history.dera.page/svg?repos=walkinglabs/learn-harness-engineering&type=date&legend=top-left)](https://star-history.dera.page/#walkinglabs/learn-harness-engineering&type=date&legend=top-left)

---

## Minnatdorchilik

Ushbu kurs [learn-claude-code](https://github.com/shareAI-lab/learn-claude-code) dan ilhomlangan va undan gʻoyalar olgan — agentni bitta sikldan izolyatsiya qilingan avtonom bajarishgacha noldan qurish boʻyicha progressiv qoʻllanma.
