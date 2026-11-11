# Pi harness dizayni tahlili

[Pi](https://pi.dev/) (`@earendil-works/pi-coding-agent` npm paketi) oʻzini “minimal agent harness” — minimal agent harness deb ataydi. Bu iborani qismlarga ajratib oʻqishga arziydi: u oʻzini “eng kuchli coding agent” yoki “foydalanish uchun eng qulay AI dasturlash vositasi” demaydi, balki oʻz oʻrnini qatʼiy ravishda **harness** soʻzi bilan belgilaydi.

Ushbu maqolada Piʼni kursning beshta quyi tizimli modeli — yoʻriqnomalar, vositalar, muhit, holat va qayta aloqa — orqali tahlil qilamiz hamda uning dizayn falsafasi Claude Code va Codexʼdan tubdan nimasi bilan farq qilishini koʻramiz. Javobni oldindan aytamiz: **Pi falsafasi “yadroni minimallashtirish + kengaytmalarni dasturlashtirish”dan iborat. U kontekst muhandisligini system prompt tashqarisiga olib chiqadi va harnessʼni Pi siz uchun belgilashi oʻrniga, foydalanuvchiga (hatto Piʼning oʻziga) oʻzgartirish imkonini beradi.**

## Bir jumladagi taʼrif

Pi — minimal yadro: rasmiy pozitsiya yadroni ataylab kichik saqlab, qaror qabul qilish huquqini sizga qaytaradi. [pi.dev bosh sahifasidagi](https://pi.dev/) asl ibora: “Ask Pi to build what you want, or install a package that does it your way”. U harnessʼni sozlanadigan toʻrt qatlamga ajratadi:

- **Kengaytmalar (Extensions)**: Pi lifecycle hodisalariga ulanadigan TypeScript hookʼlari; runtime darajasidagi dasturlashtiriladigan qatlam.
- **Koʻnikmalar (Skills)**: yoʻriqnomalar va vositalarni oʻz ichiga olgan, talab boʻyicha yuklanadigan imkoniyat paketlari; progressive disclosure.
- **Prompt andozalari (Prompt templates)**: `/name` kiritilganda ochiladigan, qayta ishlatiladigan Markdown promptlar.
- **Mavzular (Themes)**: TUI koʻrinishi.

Bu qatlamlash gʻoyasining oʻzi harness dizaynidir: **“model nimani koʻradi va qachon koʻradi” degan qaror yadroga qotirib qoʻyilmaydi, balki toʻliq qoidalar va kengaytmalarga topshiriladi.**

## Asosiy sikl

Barcha coding agentlar singari Piʼning mohiyati ham “fikrlash → vositani bajarish → kuzatish → qayta fikrlash” while siklidir. Eʼtiborga molik jihat siklning oʻzi emas, Piʼning uning tashqi qatlamiga munosabatidir: u kontekst boshqaruvini sikl ichidagi “siqish”dan sikl tashqarisidagi “boshqarish”gacha kengaytiradi.

Pi runtimeʼi dasturlashtiriladigan interfeysni tashqariga ochadi. [Manba kodi README faylining Programmatic Usage boʻlimida](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md) interaktiv TUIʼdan tashqari skript orqali boshqariladigan print/JSON rejimlari, RPC protokoli va SDK ichiga joylash qoʻllab-quvvatlanadi. Shu sababli ayni harnessʼni inson qadamma-qadam boshqarishi ham, CI/CD yoki boshqa dastur avtomatik boshqarishi ham mumkin. Bu oʻn uchinchi maʼruzadagi “sikl muhandisligi”ning “qoʻlda boshqarishdan avtomatik siklga oʻtish” shartiga mos keladi: agar harnessʼni faqat inson interaktiv boshqara olsa, u hech qachon avtomatik siklga kira olmaydi.

## Yoʻriqnomalar quyi tizimi: AGENTS.md va SYSTEM.md

Pi “yoʻriqnomalar” bilan vazmin ishlaydi, ammo qatlamlari aniq:

- **AGENTS.md**: [manba kodi README faylining Project Context Files boʻlimida](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md) yuklash tartibi aniq berilgan — global `~/.pi/agent/AGENTS.md` → ota kataloglar boʻylab yuqoriga yurish → joriy katalogdagi `./AGENTS.md` (CLAUDE.md ham qoʻllab-quvvatlanadi). Bu “repo yagona haqiqat manbai” tamoyilining amaliy ifodasi: yoʻriqnoma suhbat oynasidagi eslatma emas, fayldir.
- **SYSTEM.md**: [pi.dev rasmiy hujjatiga](https://pi.dev/docs/usage/project-context) koʻra, loyiha standart system promptʼni almashtirishi (replace) yoki unga qoʻshimcha kiritishi (append) mumkin. Bu Piʼda “system prompt”ni oʻzgartirishning yagona rasmiy kirish nuqtasi va uning “muhitning oʻzini tavsiflashi” qatlamidir.

Pi rasmiy ravishda system promptʼining oʻzi **minimal** ekanini taʼkidlaydi. Bu aniq murosaga asoslanadi: yadro ichiga uzun “agar… unda…” qoidalari tiqilmaydi; buning oʻrniga kengaytma nuqtalari qoldiriladi va qoidalar faqat kerak boʻlganda koʻnikma hamda kengaytma shaklida paydo boʻladi. Bu toʻrtinchi maʼruzadagi “nima uchun bitta ulkan yoʻriqnoma fayli muvaffaqiyatsiz boʻladi” mavzusiga bevosita mos keladi: Pi “minimal yadro + fayllarga ajratish + talab boʻyicha yuklash” yordamida ulkan yoʻriqnoma muammosini tabiiy ravishda chetlab oʻtadi.

## Holat va kontekst: Pi eng mayda qismlarga ajratgan soha

Piʼning kontekst muhandisligi alohida tahlilga loyiq, chunki u kursdagi “kontekst uzluksizligi” va “kontekst buzilishining oldini olish” tushunchalarini aniq mexanizmlarga aylantiradi:

**1. Siqish (Compaction) dasturlashtiriladi.** Kontekst chegarasiga yaqinlashganda eski xabarlar avtomatik umumlashtiriladi. [pi.dev rasmiy hujjatida](https://pi.dev/docs/usage/sessions) siqish strategiyasining oʻzi **sozlanishi mumkinligi** aytiladi: kengaytma yordamida mavzuga asoslangan siqish, kodni hisobga oladigan xulosa yoki hatto xulosa yozish uchun boshqa modelni ishlatish mumkin. Manba kodi README faylida standart mexanizm tafsilotlari ham bor: avtomatik siqish ikki holatda ishga tushadi (kontekst toshib ketishidan tiklanish / saqlash chegarasidan oshish). Kesish nuqtasi eng soʻnggi qariyb 20 ming tokenni saqlaydi, undan oldingi xabarlar “context handoff” shaklida umumlashtirilib, bosqichma-bosqich zanjirli siqiladi. Demak, Pi “qanday siqish”ni oʻzgarmas konstanta emas, harnessʼning bir qismi deb biladi.

**2. Dinamik kontekst (Dynamic context).** [pi.dev rasmiy hujjatiga](https://pi.dev/docs/usage/extensions) koʻra, kengaytmalar har bir fikrlash bosqichidan oldin xabar kiritishi, xabarlar tarixini filtrlashi, RAGʼni amalga oshirishi va uzoq muddatli xotira qurishi mumkin. Bu “kontekst toʻlgach siqish”dan bir qadam oldinda: maʼlumot kontekst oynasiga kirishidan oldin nimani kiritish va nimani kiritmaslikni tanlash imkonini beradi. Bu kursdagi “agent ish jarayonini kuzatiladigan va debug qilinadigan qilish” hamda “kontekst uzluksizligini saqlash” gʻoyalariga mos keladi; Pi ikkisini ham kengaytma qatlamiga tushiradi.

**3. Sessiya daraxti (Session tree).** [pi.dev bosh sahifasida](https://pi.dev/) “sessiyalar daraxt shaklida saqlanadi (sessions are stored as trees), `/tree` orqali tarixdagi istalgan tugunga qaytib davom etish mumkin va barcha tarmoqlar bitta faylda saqlanadi” deb aniq yozilgan. Bu kursda qayta-qayta taʼkidlangan “sessiyalararo kontekst uzilishi” muammosini hal qiladi: qattiq siqilgan xulosa orqali emas, tuzilmali tarixni qayta ijro qilish orqali. Tarmoqlarni HTMLʼga eksport qilish yoki gist sifatida ulashish mumkin, natijada kuzatuvchanlik ham bir yoʻla taʼminlanadi.

## Vositalar quyi tizimi: koʻnikmalar va kengaytmalar

Piʼning “vositalari” ikki qatlamdan iborat:

- **Koʻnikmalar (Skills)**: [manba kodi README faylining Skills boʻlimida](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md) aniq “self-contained capability packages that the agent loads on-demand” deb taʼriflanadi. Yaʼni ular yoʻriqnoma va vositalarni oʻz ichiga olgan, Agent Skills standartiga mos, talab boʻyicha yuklanadigan imkoniyat paketlaridir. Progressive disclosure sababli koʻnikma tafsilotlari faqat trigger boʻlganda kontekstga kiradi va **prompt cacheʼni toʻldirib yubormaydi**. Bu xarajat nuqtayi nazaridan harness dizaynidir: kontekstdagi har bir qoʻshimcha token uchun har bir fikrlash bosqichida haq toʻlanadi. Koʻnikmalarni talab boʻyicha yuklash — “qoʻllanmani emas, xaritani bering” gʻoyasining yana bir ifodasi.
- **Kengaytmalar (Extensions)**: ichki lifecycle hodisalariga ulanadigan TypeScript hookʼlari. [Manba kodi README faylining Hooks boʻlimida](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md) toʻrtta rasmiy foydalanish namunasi berilgan: xavfli buyruqlarni toʻxtatish (ruxsat darvozasi), vazifa almashganda kod holatini checkpoint qilish, yoʻllarni himoya qilish (`.env` fayliga yozishni taqiqlash va hokazo), vosita natijasini modelga berishdan oldin oʻzgartirish hamda agentni uygʻotish uchun tashqaridan (fayl kuzatuvchisi/Webhook/CI) xabar kiritish. Bu hook APIʼlari `@mariozechner/pi-coding-agent/hooks` orqali ham eksport qilinadi. Hamjamiyat harnessʼi ([pi-agent-harness](https://github.com/LabidySabidy/pi-agent-harness)) esa hook qatlamini skill-router, session-summary, extract-patterns va telemetry kabi tayyor kengaytmalarga aylantiradi.

Kengaytmalar Piʼning eng muhim dizayn qaroridir: **u “foydalanuvchiga bir nechta tugma berish” bilan cheklanmaydi, balki runtime ichidagi barcha hodisalarni tashqariga ochadi.** Xotira qoʻshmoqchimisiz? `agent/pre-step`ʼda maʼlumot kiriting. Xatti-harakatlarni yozmoqchimisiz? Session hodisalariga obuna boʻling. Model soʻrovini oʻzgartirmoqchimisiz? `agent/request`ʼga hook ulang. Hatto Piʼga oʻz harnessʼini oʻzgartirish imkonini berishingiz mumkin — bu har qanday “sozlama bandi”dan koʻra “dasturlashtiriladigan harness” taʼrifiga yaqinroq.

## Qayta aloqa va tekshiruv: “oʻrganish” ham harnessʼga aylantiriladi

Piʼning oʻzida majburiy test darvozasi yoʻq (tekshiruv buyruqlarini foydalanuvchi AGENTS.md ichida yozishi kerak), ammo hamjamiyat harnessʼi ([pi-agent-harness](https://github.com/LabidySabidy/pi-agent-harness)) “qayta aloqa sikli”ni kengaytmalar yordamida tuzilmalashtirgan. Rasmiy README faylining Hooks boʻlimi ham shunga oʻxshash mexanizmlar uchun asos beradi:

- **session-summary** (pi-agent-harness kengaytmasi): `PROGRESS.md` ichidagi yangilanib boradigan yozuvlarni saqlaydi — bu kursdagi holat quyi tizimi, yaʼni uzoq vazifalar jarayonini kuzatishdir.
- **extract-patterns** (pi-agent-harness kengaytmasi): sessiyadan oʻrganilgan saboqlar uchun nomzodlarni yigʻib, `LESSONS.md`ʼga saqlaydi — “har bir sessiya tugashidan oldin topshirishni tayyorlash”ni kelishuvdan mexanizmga aylantiradi.
- **telemetry** (pi-agent-harness kengaytmasi): token sarfi, xarajatlar va boshqa koʻrsatkichlarni yozadi — kuzatuvchanlik.

Ayni hamjamiyat reposi bu modelni yanada tasdiqlaydi: `VISION.md` (maqsad), `PROGRESS.md` (jarayon), `LESSONS.md` (saboqlar), `STANDARDS.md` (standartlar) — barchasi Markdown fayllari va sessiyalar orasida doimiy saqlanadi. Bu kurs tavsiya qilgan “repo yagona haqiqat manbai + jarayon fayli + topshirish mexanizmi” modelining aynan oʻzi, faqat Pi kengaytma mexanizmi uni foydalanishga tayyor qatlamga aylantirgan.

## Kurs modeliga moslashtirish

Kursning beshta quyi tizimi boʻyicha Piʼning bahosi (subyektiv, taqqoslash uchun):

| Quyi tizim | Piʼdagi amalga oshirilishi | Baho |
| --- | --- | --- |
| Yoʻriqnomalar | AGENTS.mdʼni darajalar boʻyicha yuklash + SYSTEM.md | Qatlamlar aniq, ammo qoidalarni foydalanuvchining oʻzi yozadi |
| Vositalar | Koʻnikmalarni talab boʻyicha yuklash + kengaytmalarning toʻliq lifecycle hookʼlari | Juda kuchli; vositalar tizimi dasturlashtiriladigan qatlamga aylantirilgan |
| Muhit | SYSTEM.md muhitni oʻzi tavsiflaydi; runtime muhiti AGENTS.md ichida foydalanuvchi tomonidan eʼlon qilinadi | Mexanizm ochiq, ammo qayta yaratiluvchanlik foydalanuvchi tavsifiga bogʻliq |
| Holat | Sessiya daraxti + sozlanadigan siqish + PROGRESS.md | Juda kuchli; sessiyalararo ishlash va tiklanish uning asosidir |
| Qayta aloqa | Tekshiruv buyruqlarini foydalanuvchi belgilaydi; session-summary / extract-patterns mexanizmlari | Mexanizm berilgan, mazmun foydalanuvchiga bogʻliq |

Pi tanlagan murosa Claude Code / Codexʼdan keskin farq qiladi. Claude Code “xotira, ruxsatlar, subagentlar”ning barchasini yadroga joylab, foydalanishga tayyor holatda beradi. Codex “repo standartlari va muhit izolyatsiyasi”ni standart qiladi. Pi esa **siz uchun hech narsani hal qilmaslik**ni tanlaydi — qaror qabul qilish imkonini kengaytma nuqtalariga aylantiradi. Buning evaziga kengaytmani oʻzingiz yozishingiz yoki boshqalar yaratgan paketni oʻrnatishingiz kerak.

## Oʻrganishga arziydigan dizaynlar

1. **Siqish strategiyasini ulanadigan qiling.** harnessʼingizda “kontekst qanday siqiladi” degan savolga qotirib qoʻyilgan parametr emas, almashtiriladigan strategiya interfeysi javob berishi kerak.
2. **Qattiq umumlashtirish oʻrniga sessiya daraxtidan foydalaning.** Sessiyalararo tiklanish har doim ham “oldingi sessiya xulosasi”ga tayanishi shart emas; tuzilmali tarixni qayta ijro qilish koʻpincha ishonchliroq holat quyi tizimidir.
3. **Prompt cache bilan samarali ishlang.** Koʻnikmalarni talab boʻyicha yuklang, barcha qoidalarni birdan system promptʼga tiqmang; bu ham kontekst, ham xarajat muhandisligidir.
4. **Agentga oʻz harnessʼini oʻzgartirish imkonini bering.** harness kengaytma qatlami yetarlicha ochiq boʻlsa, “agent xatti-harakatini yaxshilash”ni agentning oʻzi yarim avtomatik bajarishi mumkin.

## Manbalar (asl matn / manba kodi)

Har bir daʼvoni taxminlarga emas, quyidagi asl matn yoki manba kodiga bogʻlash mumkin:

- **pi.dev rasmiy sayti**: “Ask Pi to build what you want, or install a package that does it your way” degan asl pozitsiya, toʻrtta sozlanadigan qatlam, sessiya daraxti (“sessions are stored as trees”, `/tree`, bitta faylda saqlash, HTMLʼga eksport qilish / gist orqali ulashish).<br/>https://pi.dev/
- **pi.dev rasmiy hujjati · Sessions**: ulanadigan siqish (topic-based / code-aware / xulosa modelini almashtirish), avtomatik siqish va dinamik kontekst kiritish mexanizmlari.<br/>https://pi.dev/docs/usage/sessions
- **pi.dev rasmiy hujjati · Extensions**: kengaytmalar har bir fikrlash bosqichidan oldin xabar kiritishi, tarixni filtrlashi, RAG yaratishi va uzoq muddatli xotira qurishi mumkin.<br/>https://pi.dev/docs/usage/extensions
- **pi.dev rasmiy hujjati · Project Context**: SYSTEM.mdʼning replace / append semantikasi.<br/>https://pi.dev/docs/usage/project-context
- **Pi Coding Agent manba kodi README fayli** (badlogic/pi-mono): AGENTS.mdʼning uch bosqichli yuklash tartibi (global → ota katalog → joriy katalog), `/compact` va avtomatik siqishning ishga tushish shartlari hamda 20 ming tokenlik kesish nuqtasi, Skillsʼni talab boʻyicha yuklash va Agent Skills standarti, Hooks lifecycleʼi va toʻrtta rasmiy foydalanish namunasi, Programmatic Usage (JSON / RPC / SDK).<br/>https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md
- **pi-agent-harness hamjamiyat reposi**: skill-router / session-summary / extract-patterns / telemetry kengaytmalari, VISION.md / PROGRESS.md / LESSONS.md / STANDARDS.md fayl tizimi.<br/>https://github.com/LabidySabidy/pi-agent-harness

Tegishli maʼruzalar: [2-maʼruza · Harness aslida nima?](../../lectures/lecture-02-what-a-harness-actually-is/) ｜ [5-maʼruza · Sessiyalararo vazifalarda kontekst uzluksizligini saqlash](../../lectures/lecture-05-why-long-running-tasks-lose-continuity/) ｜ [13-maʼruza · Qoʻlda boshqarishdan avtomatik siklga oʻtish](../../lectures/lecture-13-loop-engineering/)
