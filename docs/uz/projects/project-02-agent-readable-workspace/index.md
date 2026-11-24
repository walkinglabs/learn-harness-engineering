[English version →](../../../en/projects/project-02-agent-readable-workspace/)

> Tegishli maʼruzalar: [3-maʼruza. Repozitoriyni yagona haqiqat manbaiga aylantiring](./../../lectures/lecture-03-why-the-repository-must-become-the-system-of-record/index.md) · [4-maʼruza. Yoʻriqnomalarni fayllar boʻylab ajrating](./../../lectures/lecture-04-why-one-giant-instruction-file-fails/index.md)
> Andoza fayllari: [templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/en/resources/templates/)

# Loyiha 02. Loyihani oʻqishga qulay qiling va toʻxtagan joyidan davom ettiring

## Nima qilasiz

Yangi agent loyiha tuzilishini tez tushunib olishi, joriy jarayon (progress) qayerdaligini bilishi va ishni davom ettirishi uchun repoga “oʻqish qulayligi”ni (readability) qoʻshing. Aniqroq qilib aytganda: ikkita sessiya davomida hujjat import qilish, hujjat detallarini koʻrish va lokal saqlashni (local persistence) amalga oshiring.

Ikkala sinovda `starter/` dagi bir xil koddan boshlang. Birinchisida starter harnessʼini oʻzgartirmang va topshirish qaydini yozmang. Ikkinchisida topshirish qoidalari bor `AGENTS.md` dan foydalaning va A sessiyasi oxirida agentga `session-handoff.md` yozdiring. Sinov tartibiga qarang.

## Vositalar

- Claude Code yoki Codex
- Git
- Node.js + Electron

## Harness mexanizmi

Agent oʻqiy oladigan ish maydoni (Agent-readable workspace) + doimiy holat fayllari (persistent state files)

## Repodagi tayyor loyihadan foydalaning

Repo yoʻli: [`projects/project-02/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02)

| Katalog | Nimalar bor | Nimani taqqoslash |
|------|------|------|
| [`starter/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/starter) | Project 01 kodi, lekin hujjat importi, detail view va persistence hali toʻliq emas. Hujjatlar bor, ammo qisqaroq; `session-handoff.md` yoʻq. | Ikkinchi agent sessiyasi qancha kontekstni qayta topishi kerak. |
| [`solution/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/solution) | Faqat tayyor namuna, boshlangʻich nuqta emas. Kuchli sinov uchun undan faqat `AGENTS.md` olinadi. | Yangi sessiya faqat repo holatidan davom eta oladimi. |

## Sinov tartibi

Ikki sinovda faqat harness oʻzgaradi. Boshlangʻich kod, vazifa matni, agent va A sessiyasini toʻxtatish nuqtasi bir xil boʻlsin. [Loyiha README faylida](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/README.md) koʻrsatilganidek, A sessiyasida hujjat importi va tafsilotlar oynasi, B sessiyasida esa qayta ishga tushirgandan keyin ham saqlash amalga oshiriladi.

1. `p02-baseline/` va `p02-improved/` kabi ikkita alohida, bir-biridan ajratilgan ish katalogini tayyorlang. Har safar bitta sinovni oʻtkazing: ikkala sessiyani tugatib, natijalarni arxivlang va ikkinchi sinovdan oldin ish katalogini oʻchiring. Alohida Git tarmoqlaridan foydalanmang. Agent boshqa tarmoq va qoʻshni kataloglarni ham oʻqiy oladi; kuchsiz harness kuchli harness fayllarini koʻrsa, taqqoslash buziladi.
2. [`projects/project-02/starter/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/starter) tarkibini ikkala katalogga nusxalang. U Project 01 yechimiga asoslangan: Project 01 funksiyalari ishlaydi, Project 02 ning uchta funksiyasi esa `feature_list.json` ichida `not-started` holatida. Agar oʻzingizning Project 01 natijangizni ishlatsangiz, uning aynan bir nusxasidan ikkala katalogda ham boshlang.
3. Ikkala sinovda bir xil vazifa matnidan foydalaning. Masalan: «Fayl tanlash oynasi orqali hujjat importini, toʻliq mazmunni koʻrsatuvchi tafsilotlar oynasini va dastur qayta ishga tushganda import qilingan hujjatlarni saqlab qolishni amalga oshiring».
4. `solution/docs/`, `solution/feature_list.json` va `solution/session-handoff.md` ni hech qaysi katalogga nusxalamang. Bu fayllarda tayyor jarayonlar bayon etilgan, barcha funksiyalar esa `pass` deb belgilangan: ular agentga javobni oldindan koʻrsatadi. Ikkala sinovda `starter/docs/ARCHITECTURE.md`, `starter/docs/PRODUCT.md` va `feature_list.json` ni boshlangʻich koʻrinishida qoldiring.

### Birinchi sinov (kuchsiz harness)

`p02-baseline/` da starterʼning qisqa `AGENTS.md`, `docs/` va `feature_list.json` fayllarini oʻzgartirmang; `session-handoff.md` boʻlmasin. Kuchsiz harness degani boʻsh emas, balki ixcham harness demakdir.

**A sessiyasi:**

1. Agentni vazifa matni bilan ishga tushiring.
2. Import va tafsilotlar oynasi ishlaganida, lekin saqlash hali tayyor boʻlmaganida sessiyani toʻxtating. Dasturni ochib, fayl tanlash oynasi orqali `.txt` yoki `.md` faylini import qiling, roʻyxatda koʻring va ochib toʻliq mazmunini tekshiring. Dastur qayta ishga tushsa, bu hujjat hali yoʻqolishi kerak. Ikkinchi sinovda ham shu mezonni ishlating.
3. Topshirish qaydi yoki boshqa xulosa faylini soʻramang.

**B sessiyasi:**

1. Oʻsha katalogda agentning yangi sessiyasini oching va faqat «Ishni davom ettir» deng.
2. Birinchi mazmunli kod oʻzgarishigacha qancha vaqt oʻtganini va agent A sessiyasida maʼlum boʻlgan arxitektura, buyruqlar yoki yarim qolgan funksiya holatini necha marta qayta aniqlaganini yozing.

### Ikkinchi sinov (kuchli harness)

A sessiyasi boshlanishidan oldin `p02-improved/` dagi `AGENTS.md` ni [`solution/AGENTS.md`](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/solution/AGENTS.md) bilan almashtiring. Unda ishni boshlash qoidalari, hujjatlar ustuvorligi, hujjatlarni yangilash qoidasi, `feature_list.json` da dalil talab qiluvchi yakunlash mezoni va sessiyani topshirish boʻlimi bor. Boshqa hech narsani oʻzgartirmang. Bu taqqoslash faqat topshirish qaydini emas, butun harnessʼni oʻlchaydi. Qaydning oʻzi qanday taʼsir qilishini bilish uchun uchinchi sinovda starterʼning `AGENTS.md` fayliga faqat sessiyani topshirish boʻlimini qoʻshing.

**A sessiyasi:**

1. Oʻsha vazifa matni bilan boshlang va bir xil nuqtada toʻxtang: import va tafsilotlar oynasi ishlaydi, ammo doimiy saqlash hali tayyor emas.
2. Sessiyani yopishdan oldin agentdan [topshirish andozasi](./../../resources/templates/session-handoff.md) boʻyicha repo bosh katalogiga `session-handoff.md` yozishni soʻrang: nimalar tekshirildi, nimalar oʻzgardi, nima ishlamayapti yoki tekshirilmagan va navbatdagi qadam qaysi? [Tayyor yechimdagi qayd](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/solution/session-handoff.md) faqat misol, uni nusxalamang.

**B sessiyasi:**

1. Oʻsha katalogda yangi sessiya oching va faqat «Ishni davom ettir» deng. Qaydni oʻqish talabi vazifa matnidan emas, `AGENTS.md` dan keladi.
2. Birinchi sinovdagi oʻlchovlarni takrorlang.

## Natijalarni oʻlchash

| Koʻrsatkich | Tavsif |
|---|---|
| B sessiyasida ishga kirishish vaqti | Sessiya boshidan birinchi mazmunli kod oʻzgarishigacha |
| Qayta aniqlashlar soni | Agent maʼlum arxitektura, buyruqlar yoki holatni necha marta qayta aniqladi |
| Topshirish sifati | Qayd toʻliq, aniq va amalda foydalanishga yaroqlimi (faqat ikkinchi sinov) |
| Takrorlangan ish | B sessiyasi A sessiyasida tugallangan ishning qancha qismini qayta bajardi |
| Yakuniy natija | Uchta funksiya ham oxirigacha bajarildimi |

## Nimalarni topshirish kerak

- Kuchsiz harness sinovidagi A va B sessiyalarining suhbat yozuvi yoki jurnali.
- Kuchli harness sinovining shunday yozuvlari, ishlatilgan `AGENTS.md` va agent yozgan `session-handoff.md`.
- Ishni davom ettirish tezligi va kontekstni qayta tiklash sifatini solishtiruvchi qisqa qayd.
