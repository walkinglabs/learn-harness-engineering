[English version →](../../../en/lectures/lecture-06-why-initialization-needs-its-own-phase/)

> Kod misollari: [code/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/en/lectures/lecture-06-why-initialization-needs-its-own-phase/code/)
> Amaliy loyiha: [Loyiha 03. Koʻp sessiyali uzluksizlik](./../../projects/project-03-multi-session-continuity/index.md)

# 06-maʼruza. Transcript analysis codega tegishdan oldin initialization nega kerak

Siz yangi agent sessiyasini boshlaysiz va “transcript analysis funksiyasini qoʻsh” deysiz. U darhol kod yozishga oʻtadi — tahsinga loyiq ishtiyoq. 20 daqiqadan soʻng, test freymvorki toʻgʻri sozlanmaganini bilib qoladi va uni toʻgʻrilash uchun yana 10 daqiqa sarflaydi. Keyin maʼlumotlar bazasi migratsiya skripti formati notoʻgʻri ekani aniqlanadi, yana ovoragarchilik. Oxir-oqibat transcript analysis funksiyasi qoʻshiladi, lekin butun sessiya samarasiz boʻldi — chunki vaqtning katta qismi transcript analysis funksiyasini yozishga emas, balki “bu loyiha oʻzi qanday ishlashini tushunish”ga sarflandi.

Yaxshiroq yondashuv: agentni ishlashga qoʻyib berishdan oldin, bazaviy muhitni tayyorlash, tekshiruv buyruqlarini (verification commands) muvaffaqiyatli oʻtkazish va loyiha strukturasini tushunish uchun alohida bosqich ajrating. Bu xuddi uy qurishga oʻxshaydi — siz poydevor quyib, devorlarni bir vaqtning oʻzida qurmaysiz. Agar shunday qilsangiz, devorlar poydevor qotmasidan oldin koʻtariladi va butun binoni buzib, qaytadan boshlashga toʻgʻri keladi. Avval poydevor quying, uning qotishini kuting, soʻngra devorlarni quring — toza va samarali.

Ushbu maʼruza nima uchun inisializatsiya (initialization) kod yozish bilan aralashib ketmasdan, alohida bosqich boʻlishi kerakligini tushuntiradi.

## Poydevor va devorlar: Ikkita tubdan farq qiluvchi ish

Inisializatsiya va implementatsiya bir-biridan butunlay farq qiladigan optimallashtirish maqsadlariga ega. Implementatsiya bosqichi quyidagilar uchun optimallashtiriladi: tekshirilgan funksiyalar (features) miqdori va sifatini maksimal darajaga koʻtarish. Inisializatsiya bosqichi esa: keyingi barcha implementatsiyalarning ishonchliligi va samaradorligini maksimal darajaga koʻtarish uchun optimallashtiriladi.

Inisializatsiya va implementatsiyani aralashtirganingizda, agent koʻp maqsadli optimallashtirish muammosiga duch keladi — infratuzilma qurish bilan bir vaqtda kod yozishga urinadi. Aniq ustuvorliksiz, agent tabiiy ravishda kod yozishga tortiladi (chunki bu bevosita koʻrinadigan natija), shu bilan birga infratuzilmani eʼtiborsiz qoldiradi (chunki uning qiymati faqat keyingi sessiyalarda koʻrinadi). Bu qurilish jamoasiga poydevor quyishni va bir vaqtning oʻzida devor qurishni buyurishga oʻxshaydi — ular, ehtimol, devor qurishga shoshishadi, chunki devorlar koʻrinadigan va koʻrsatish mumkin boʻlgan narsadir. Lekin yomon poydevorga ega boʻlgan uyni keyinchalik tizimli muammolar kutadi.

## Inisializatsiya sikli

```mermaid
flowchart TB
    subgraph Wrong["Aralash sessiya (notoʻgʻri)"]
        W1["Funksional ishni darhol boshlash"] --> W2["Vazifa oʻrtasida muhit va test boʻshliqlarini kashf etish"]
        W2 --> W3["Tekshirilmagan kod toʻplanib qolishi"]
        W3 --> W4["Keyingi sessiya loyiha holatini qayta kashf etishga majbur"]
    end

    subgraph Right["Maxsus inisializatsiya (toʻgʻri)"]
        R1["1-sessiya: muhit ishga tushishga tayyor"] --> R2["Namuna test oʻtmoqda"]
        R2 --> R3["Bootstrap shartnomasi + vazifalar roʻyxati yozilgan"]
        R3 --> R4["Toza checkpoint commit qilingan"]
        R4 --> R5["Keyingi sessiyalar toʻgʻridan-toʻgʻri tekshirilgan vazifalarni boshlaydi"]
    end
```

## Ularni aralashtirib yuborsangiz nima boʻladi

Eng toʻgʻridan-toʻgʻri muammo: poydevor toʻgʻri qotmaydi. Agent oʻz kuchining 80 foizini funksiya kodiga, 20 foizini esa shoshilinch qandaydir infratuzilmani sozlashga sarflaydi. Test freymvorki sozlangan, lekin hech qachon tekshirilmagan, lint qoidalari qoʻyilgan, lekin oʻta yumshoq, jarayon fayli (progress file) tuzilmagan. Bu kamchiliklar birinchi sessiyada darhol bilinmaydi (chunki agent oʻzi nima qilganini hali eslaydi), lekin ikkinchi sessiyada namoyon boʻladi — yangi agent qanday ishlashni, qanday test qilishni yoki ishlarning qayerda ekanligini bilmaydi. Qaltis poydevor, titroq bino.

Yana bir yashirin xarajat bu “tekshirilmagan toʻplanish” (unverified accumulation) — test freymvorki sozlanishidan oldin yozilgan kod, bu tekshiruvi yoʻq kod degani. Oxir-oqibat oʻsha kod uchun testlar yozishga qaytganingizda, boshidanoq dizayn notoʻgʻri qilinganini koʻrishingiz mumkin — agar shuni avvalroq bilganingizda, uni boshqacha amalga oshirgan boʻlardingiz. Bu hoʻl beton ustiga kafel yotqizishga oʻxshaydi — polning tekis emasligini anglab yetganingizda, barcha kafelni qoʻporib, qaytadan terishga toʻgʻri keladi.

Sessiya byudjeti ham bekorga sarflanadi. Inisializatsiya ishlari (muhitlarni sozlash, testlarni oʻrnatish, loyiha tuzilishini tushunish) katta byudjetni yeb yuboradi, bu esa asosiy kodni yozishga kamroq joy qoldiradi. Natija: birinchi sessiya ishlarning faqat yarmini tugatadi va ikkinchi sessiya loyihani tushunishni noldan boshlashiga toʻgʻri keladi. Poydevor uchun byudjet sarflandi, lekin poydevor ham mustahkam emas — ikkala maqsadga ham erishilmadi.

Eng osongina koʻzdan qochadigan muammo — bu oshkor qilinmagan taxminlar, minalar kabi yashirin tahdidlar (implicit assumption landmines). Agentning inisializatsiya davomida qabul qilgan qarorlari (qaysi test freymvorki ishlatilgan, kataloglar qanday tartiblangan, bogʻliqliklar qanday boshqarilgan) — agar ochiq-oydin yozib qoldirilmasa, keyingi sessiyalar bu tanlovlarni tushunolmaydi. Eng yomoni shundaki, keyingi sessiyalar unga zid qarorlar qabul qilishi mumkin. Birinchi qurilish jamoasi beton poydevordan foydalandi, ikkinchi jamoa buni bilmasdan turib uning ustiga yogʻoch qoqdi — poydevor yorilib ketdi.

Anthropicʼning uzoq muddatli dasturlarni yaratish boʻyicha tadqiqoti inisializatsiyani implementatsiyadan ajratishni ochiq-oydin tavsiya qiladi. Ularning tajriba maʼlumotlari: maxsus inisializatsiya bosqichidan foydalangan loyihalar, aralash usulga nisbatan, koʻp sessiyali (multi-session) ssenariylarda funksiyalarning 31% koʻproq tugallanish koʻrsatkichini namoyish etgan. Asosiy tushuncha — inisializatsiya bosqichiga sarflangan vaqt, keyingi 3-4 sessiyada toʻliq oqlanadi. Poydevor qanchalik mustahkam boʻlsa, devorlar shuncha tez koʻtariladi.

OpenAIʼning Codex harness muhandislik qoʻllanmasi ham “repo operatsion yozuv sifatida” (repository as operational record) tamoyilini taʼkidlaydi — birinchi ishga tushishdanoq aniq operatsion strukturani oʻrnating, aks holda har bir yangi sessiya loyiha qoidalarini (conventions) qaytadan aniqlashiga toʻgʻri keladi.

## Asosiy tushunchalar

- **Inisializatsiya bosqichi (Initialization Phase)**: Agent ishlash siklidagi (lifecycle) birinchi bosqich — kod yozilmaydi, faqatgina keyingi barcha implementatsiya bosqichlari uchun sharoitlar yaratiladi. Uning natijasi kod emas, infratuzilmadir.
- **Bootstrap shartnomasi (Bootstrap Contract)**: Yangi agent sessiyasi loyihani hech qanday noaniqliklarsiz boshqara olishi uchun kerak boʻlgan shartlar — loyihani ishga tushirish (start), test qilish (test), taraqqiyotni koʻrish (progress) va keyingi qadamlarni tanlash (next steps) mumkin boʻlishi kerak. Toʻrtta shart, barchasi zarur.
- **Sovuq ishga tushirish (Cold Start) va Issiq ishga tushirish (Warm Start)**: Sovuq ishga tushirish — bu boʻsh katalogdan boshlanib, agent loyiha tuzilishini taxmin qilishiga toʻgʻri keladi; issiq ishga tushirish esa, infratuzilma allaqachon mavjud boʻlgan andoza (template) yoki joriy loyihadan boshlanishidir. Issiq ishga tushirish har doim sovuq ishga tushirishdan ustunroq — bu suv va elektr quvvati boʻlgan maydonda ish boshlash bilan, sahroda ish boshlash oʻrtasidagi farq kabidir.
- **Topshirishga tayyorlik (Handoff Readiness)**: Loyiha istalgan vaqtda yangi agent qabul qilib ololadigan holatda turishi kerak. Ogʻzaki tushuntirish kerak emas — faqat repo ichidagilarning oʻzi yetarli.
- **Birinchi tekshiruvgacha vaqt (Time to First Verification)**: Loyiha boshlanganidan to birinchi funksionallik (feature point) tekshiruvdan oʻtgunga qadar boʻlgan vaqt. Bu inisializatsiya samaradorligini oʻlchash uchun asosiy metrikadir.
- **Keyingi bosqichda qoʻllanish yaroqliligi (Downstream Usability)**: Inisializatsiya sifatining eng yaxshi koʻrsatkichi — keyingi sessiyalarning yashirin bilimlarga tayanmasdan vazifalarni muvaffaqiyatli bajarish ulushidir.

## Inisializatsiyani qanday qilib toʻgʻri bajarish mumkin

**Inisializatsiyaga maxsus alohida bosqich sifatida qarang.** Birinchi sessiya faqat inisializatsiya bilan shugʻullanadi — biznes mantigʻiga oid kod umuman yozilmaydi. Inisializatsiya natijasi:

**1. Ishga tayyor muhit.** Loyiha ishga tushadi, kutubxonalar (dependencies) oʻrnatiladi, muhit muammolari yoʻq. Poydevor quyildi, hech qanday yoriq yoʻq.

**2. Tekshiruvga tayyor test freymvorki.** Kamida bitta namuna (example) test oʻtishi kerak. Bu test freymvorkining oʻzi toʻgʻri sozlanganini isbotlaydi — goʻyoki ogʻirlikni koʻtara olishini isbotlash uchun poydevor ustiga ustun oʻrnatgandek.

**3. Bootstrap shartnomasi hujjati.** Keyingi sessiyalarga nima qilishni ochiq-oydin tushuntiruvchi hujjat:
```markdown
# Inisializatsiya shartnomasi

## Boshlash buyruqlari
- Bogʻliqliklarni oʻrnatish: `make setup`
- Dev serverni ishga tushirish: `make dev`
- Testlarni ishga tushirish: `make test`
- Toʻliq tekshiruv: `make check`

## Joriy holat
- Barcha bogʻliqliklar oʻrnatilgan va qulflangan (locked)
- Test freymvorki sozlangan (Vitest + React Testing Library)
- Namuna test oʻtmoqda (1/1)
- Lint qoidalari sozlangan (ESLint + Prettier)

## Loyiha strukturasi
- src/ — Asosiy kod
- src/components/ — React komponentlari
- src/api/ — API mijoz (client)
- tests/ — Test fayllari
```

**4. Vazifalarni qismlarga ajratish.** Butun loyihani tartiblangan vazifalar roʻyxatiga boʻling, har bir vazifa aniq qabul qilish mezonlariga (acceptance criteria) ega boʻlsin:
```markdown
# Vazifalarni taqsimlash

## 1-vazifa: Asosiy foydalanuvchi autentifikatsiyasi
- JWT auth middlewareʼni amalga oshirish
- Kirish/Roʻyxatdan oʻtish endpointʼlarini qoʻshish
- Qabul qilish: pytest tests/test_auth.py barchasi oʻtishi kerak

## 2-vazifa: Foydalanuvchi profili sahifasi
- Profil CRUDʼni amalga oshirish
- Profilni tahrirlash formasini qoʻshish
- Qabul qilish: pytest tests/test_profile.py barchasi oʻtishi kerak

## 3-vazifa: Qidiruv funksiyasi
- ...
```

**5. Git commit checkpoint (nazorat nuqtasi) sifatida.** Inisializatsiya tugagandan soʻng, toza commit qiling. Keyingi barcha ishlar shu nazorat nuqtasidan boshlanadi.

**Issiq ishga tushirish (Warm start) strategiyasi**: Boʻsh katalogdan ish boshlamang. Standart katalog strukturasini, bogʻliqliklarni sozlashni va test freymvorklarini oldindan oʻrnatish uchun loyiha andozasidan (create-react-app, fastapi-template va h.k.) foydalaning. Odatdagi inisializatsiya qadamlarini andoza ichiga kiritib yuboring, toki agent faqatgina oʻz loyihasiga xos boʻlgan inisializatsiya ishlarini qilsin. Bu xuddi suv va chirogʻi bor joyda ish boshlash bilan — sahroning oʻrtasidan qurilishni boshlash oʻrtasidagi farq kabidir.

**Inisializatsiyani yakunlash mezoni**: “Qanchalik koʻp kod yozilganligi” emas, balki bootstrap shartnomasining toʻrtta talabiga javob berganligi bilan oʻlchanadi — boshlash mumkin, test qilish mumkin, joriy holatni koʻrish mumkin va keyingi qadamlarni aniqlab olish mumkin. Inisializatsiyani tasdiqlash uchun quyidagi tekshiruv roʻyxatidan foydalaning:

```markdown
## Inisializatsiyani qabul qilish roʻyxati
- [ ] `make setup` noldan muvaffaqiyatli ishlaydi
- [ ] `make test` da kamida bitta test oʻtdi
- [ ] Yangi agent sessiyasi faqat repo fayllariga tayanib “qanday ishga tushirish” va “qanday test qilish” ni ayta oladi
- [ ] Kamida 3 ta vazifa yozilgan vazifalar taqsimoti fayli mavjud
- [ ] Hamma narsa gitʼga commit qilingan
```

## Hayotiy misol

React frontend loyihasi uchun ikkita inisializatsiya yondashuvi:

**Aralash usul (poydevor quyish va devorlarni bir vaqtda qurish)**: 1-sessiyada agent loyiha tuzilishini yaratdi va bir vaqtning oʻzida birinchi funksiyani yozdi. Sessiya oxirida repoda ishlaydigan kod bor edi, ammo: loyihani boshlash/test qilish uchun aniq buyruqlar yoʻriqnomasi yoʻq, jarayonni kuzatib boradigan fayl yoʻq, vazifalar taqsimlanmagan edi. 2-sessiya loyiha strukturasi, test freymvorki va build jarayonini tushunib olishga ~20 daqiqa vaqt sarfladi — xuddi qurilish maydoniga kelib poydevor qayerda qotganini yoki suv quvurlari qayerdan oʻtganini bilmaydigan jamoa shuni bilish uchun bitta-bitta kovlab izlashiga oʻxshaydi.

**Maxsus inisializatsiya (avval poydevor)**: 1-sessiya faqat inisializatsiya bilan shugʻullandi — andozadan katalog strukturasini yaratdi, test freymvorkini sozladi (Vitest + React Testing Library), bitta namunaviy test yozib, uni tekshirib oldi, bootstrap shartnomasi hujjatini va vazifalar roʻyxatini tuzdi, hamda bularni initial checkpoint sifatida commit qildi. 2-sessiyaning tiklash vaqti (rebuild time) 3 daqiqadan oshmadi, u roʻyxatdagi vazifalardan toʻgʻridan toʻgʻri ishni boshladi — yangi jamoa maydonga kelib chizmaga bir koʻz tashlab, qayerdan davom ettirishni aniq biladi.

Loyiha sikllarini toʻliq taqqoslash: aralash usuldagi umumiy tiklash vaqti (barcha sessiyalar uchun) maxsus inisializatsiya yondashuviga qaraganda ~60% ga koʻp boʻldi. Inisializatsiyaga sarflangan ortiqcha 20 daqiqa keyingi sessiyalarda necha marta oʻzini oqladi. Xuddi mustahkam poydevor devorlarni tezroq qurishga yordam berganidek — sekin qadam bu aslida tezlashishdir.

## Asosiy xulosalar

- Inisializatsiya va implementatsiya turli xil optimallashtirish maqsadlariga ega — ularni aralashtirish ikkalasini ham orqaga tortadi. Avval poydevor quying, keyin devorlarni quring.
- Inisializatsiyaning natijasi bu kod emas, u infratuzilmadir: ishga tushishga tayyor muhit, tekshiruvdan oʻtadigan testlar, bootstrap shartnomasi va vazifalar taqsimoti.
- Inisializatsiyani bootstrap shartnomasining toʻrtta mezoniga koʻra tasdiqlang: ishga tushirish, test qilish, jarayonni koʻrish va keyingi qadamlarni aniqlay olish.
- Issiq ishga tushirish (warm start) sovuq ishga tushirishdan (cold start) doim ustun. Infratuzilmani oldindan sozlab olish uchun loyiha andozalaridan (project templates) foydalaning.
- Inisializatsiyaga kiritilgan vaqt keyingi 3-4 sessiyada toʻliq qoplanadi. Bu ortiqcha xarajat emas — bu boshlangʻich investitsiyadir. Poydevor qanchalik mustahkam boʻlsa, bino shunchalik tez koʻtariladi.

## Qoʻshimcha oʻqish uchun

- [Anthropic: Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [OpenAI: Harness Engineering](https://openai.com/index/harness-engineering/)
- [HumanLayer: Harness Engineering for Coding Agents](https://humanlayer.dev/articles/harness-engineering-for-coding-agents/)
- [Infrastructure as Code — Martin Fowler](https://martinfowler.com/bliki/InfrastructureAsCode.html)
- [SWE-agent: Agent-Computer Interfaces](https://github.com/princeton-nlp/SWE-agent)

## Mashqlar

1. **Bootstrap shartnomasi dizayni**: Oʻzingiz ishlayotgan loyiha uchun toʻliq bootstrap shartnomasini yozib chiqing. Soʻng mutlaqo yangi agent sessiyasini ochib, faqat repodagi maʼlumotlarni (ogʻzaki kontekstsiz) koʻrsatib, undan loyihani ishga tushirishni, testlarni ishga tushirishni va joriy jarayonni tushunishni talab qiling. U qanday muammolarga duch kelishini yozib oling — har bir duch kelingan muammo, sizning bootstrap shartnomangizda yetishmayotgan qoidani anglatadi.

2. **Taqqoslash tajribasi**: Oʻrtacha murakkablikdagi yangi loyihani tanlang. A yondashuv: agentʼga bir vaqtning oʻzida inisializatsiya qilishni va birinchi implementatsiyani amalga oshirishni ishonib topshiring. B yondashuv: birinchi sessiyani faqat inisializatsiyaga sarflang va ikkinchi sessiyadan implementatsiyani boshlang. 4 sessiyadan soʻng natijalarni solishtiring: birinchi tekshiruvgacha ketgan vaqt, tiklash narxi (rebuild cost) va funksiyalarni bajarish darajasi.

3. **Inisializatsiyani tasdiqlash varaqasi (Checklist)**: Loyihangiz uchun inisializatsiyani tasdiqlash roʻyxatini tuzing. Yangi agent sessiyasi har bir tekshiruv elementini bajarsin va qay biri muvaffaqiyatli, qaysi biri muvaffaqiyatsiz boʻlganini qayd etsin. Muvaffaqiyatsiz tugagan elementlar — sizning harnessʼingizdagi boʻshliqlardir; ularni toʻgʻrilash kerak.
