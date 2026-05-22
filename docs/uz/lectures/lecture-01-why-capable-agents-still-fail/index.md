[English version →](../../../en/lectures/lecture-01-why-capable-agents-still-fail/)

> Kod misollar: [code/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/en/lectures/lecture-01-why-capable-agents-still-fail/code/)
> Amaliy loyiha: [01-loyiha. Faqat prompt vs. qoidalar ustuvor](./../../projects/project-01-baseline-vs-minimal-harness/index.md)

# 01-maʼruza. Kuchli modellar real interview-analysis applarda ham yiqiladi

Oʻzingizni AI olamida tajribali deb hisoblaysiz — Claude Pro obunangiz bor, GPT-4o API kalitingiz bor, SWE-bench reytingidagi raqamlarni yoddan bilasiz. Va nihoyat, haqiqiy loyihani ishonch bilan AI agentga topshirasiz. Natija nima? U bitta funksiya qoʻshadi-yu, testlarni buzadi; bitta xatoni tuzatadi-yu, yana ikkita yangisini kiritadi; 20 daqiqa ishlab “tayyor” deb faxr bilan eʼlon qiladi — siz kodga qaraysiz, u umuman soʻraganingiz emas.

Birinchi reaksiyangiz? “Bu model yetarli emas. Yaxshiroq modelga oʻtish vaqti keldi.” Toʻxtang. Yangi obunaga pul sarflashga shoshilmang — ehtimol, muammo umuman modelda emasdir.

Raqamlarga qaraylik. 2025-yil oxiriga kelib, SWE-bench Verifiedʼdagi eng kuchli kodlash agentlari taxminan 50–60% natija koʻrsatmoqda. Bu — sinchiklab tanlangan, aniq tavsifli va testlari mavjud vazifalarda. Kundalik dasturlash muhitiga oʻtsangiz — talablar noaniq, testlar yoʻq, biznes qoidalari hamma joyga sochilib yotgan — bu raqam yana ham pasayadi.

Ammo bu raqamlar ortida intuitsiyaga zid bir haqiqat yashiringan.

## Bir xil ot, turlicha taqdir

Anthropic nazorat ostida tajriba oʻtkazdi. Bir xil prompt (“2D retro oʻyinlar yaratish dasturini qur”), bir xil model (Opus 4.5). Birinchi sinov — hech qanday qoʻshimcha vositasiz: 20 daqiqa, 9 dollar; oʻyinning asosiy funksiyalari umuman ishlamadi. Ikkinchi sinov — toʻliq harness bilan (planner + generator + evaluator — uch agentli arxitektura): 6 soat, 200 dollar; oʻyin oʻynaladigan holatda chiqdi.

Ular modelni oʻzgartirmadi. Opus 4.5 hamon Opus 4.5 edi. Oʻzgargan narsa — egar.

OpenAIʼning 2025-yilgi harness engineering maqolasi buni ochiq aytadi: yaxshi tuzilgan harnessʼga ega repozitoriyadagi Codex “ishonchsiz”dan “ishonchli”ga oʻtadi. Eʼtibor bering — “biroz yaxshi” emas, sifat jihatidan tubdan boshqacha. Bu xuddi zotli otga oʻxshaydi: egarsiz minib boʻladi, lekin uzoqqa bormaysiz, tez ham yura olmaysiz, yiqilishingiz esa hech kimni ajablantirmaydi. Harness — aynan oʻsha egar; **model ogʻirliklaridan tashqaridagi barcha muhandislik infratuzilmasi.**

## Agentlar aslida qayerda tiqilib qoladi

Aniqrogʻi, nima notoʻgʻri ketadi?

Eng koʻp uchraydigan holat: vazifani aniq belgilamagansiz. “Qidiruv funksiyasini qoʻsh” deysiz, ammo agent buni siznikidan butunlay boshqacha tushunadi — nimani qidirish kerak? Toʻliq matn boʻyichami yoki strukturali? Sahifalash kerakmi? Natijalardagi mos parchalar ajratib koʻrsatilsinmi? Buni siz aytmagansiz — demak agent taxmin qiladi. Toʻgʻri taxmin qilsa — bu omad; notoʻgʻri taxminni keyin tuzatish boshidan aniq aytishdan koʻra qimmatga tushadi. Xuddi restoranda oshpazga “menga baliq bering” deganga oʻxshaydi — dimlanganmi, bugʼda pishirilganmi yoki qaynoq qozondami — buning hammasi sof tasodifga qoladi.

Vazifa aniq boʻlsa ham, loyihada agent bilmaydigan yashirin arxitektura konvensiyalari boʻladi. Jamoangiz SQLAlchemy 2.0 sintaksisini standart qilib olgan boʻlsa-da, agent odatda 1.x kodini yozadi. Barcha API endpointʼlar OAuth 2.0 autentifikatsiyasidan foydalanishi shart — lekin bu qoida faqat sizning yodingizda va uch oy oldingi Slack xabarida bor. Agent buni koʻra olmaydi — bu unga boʻysunmaslikni xohlagani uchun emas, balki bunday qoida borligini umuman bilmaydi.

Muhitning oʻzi ham tuzoq. Tugallanmagan dev muhit, yetishmayotgan kutubxonalar, mos kelmagan vosita versiyalari. Agent qimmatli kontekst oynasini sizning haqiqiy vazifangizni hal qilishga emas, `pip install` xatoliklari va Node versiyalari nomuvofiqligiga sarflaydi. Bu xuddi mohir duradgorni yollab, unga bolgʻa, mix yoki tekis ish stoli bermay qoʻyganga oʻxshaydi — qanchalar mohir boʻlmasin, ish qila olmaydi.

Yana bir keng tarqalgan holat: tekshirish imkoniyatining yoʻqligi. Testlar yoʻq, lint yoʻq yoki tekshirish buyruqlari hech qachon agentga aytilmagan. Agent kod yozadi, unga qaraydi, “yaxshi-ku” degan qarorga keladi va “tayyor” deydi. Bu xuddi talabaga javob varaqasiz uy vazifasini topshirishga oʻxshaydi — u toʻgʻri qildim deb oʻylaydi, lekin baholaganingizda xatolar uyumi chiqadi. Anthropic yana bir qiziq hodisani kuzatdi: agentlar kontekst tugayotganini sezsa, shoshilib tugatadi, tekshirishni oʻtkazib yuboradi va eng maqbul yechim oʻrniga oddiy yechimni tanlaydi. Buni “kontekst xavotiri” (context anxiety) deb atashadi — xuddi imtihonda vaqt oxirlayotganini sezganingizda qolgan test savollariga tasodifiy javoblarni belgilab ketishga oʻxshash holat.

Bir necha sessiyaga choʻzilgan uzun vazifalar yana ham yomonroq — oldingi sessiyadagi barcha topilmalar yoʻqoladi va har bir yangi sessiya loyiha strukturasini qaytadan oʻrganishi, kod tuzilishini qaytadan oʻrganishi shart. Doimiy holatga ega boʻlmagan agentlarda 30 daqiqadan oshadigan vazifalarda muvaffaqiyatsizlik darajasi keskin oshib ketadi.

## Asosiy atamalar

Bu ssenariylarni nazarda tutsak, quyidagi atamalar endi shunchaki jargon emas — har biri aniq muvaffaqiyatsizlik turini nomlaydi:

- **Capability Gap (Imkoniyatlar tafovuti)**: Modelning benchmark natijalari va haqiqiy vazifalarda koʻrsatadigan natijalari oʻrtasidagi katta tafovut. SWE-bench Verifiedʼda 50–60% muvaffaqiyat darajasi haqiqiy muammolarning deyarli yarmi hal qilinmasligini bildiradi.
- **Harness**: Modeldan tashqaridagi hamma narsa — yoʻriqnomalar, vositalar, muhit, holat boshqaruvi, tekshiruv qayta aloqasi. Agar bu model ogʻirliklari boʻlmasa — bu harness. Biz “egar” deb atayotgan narsamiz.
- **Harness-Induced Failure (Harness keltirib chiqargan muvaffaqiyatsizlik)**: Modelda yetarli imkoniyat mavjud, ammo bajarilish muhitida strukturaviy nuqsonlar bor. Anthropicʼning nazoratli tajribasi buni allaqachon isbotladi.
- **Verification Gap (Tekshiruv tafovuti)**: Agentning oʻz natijasiga ishonchi va haqiqiy toʻgʻrilik oʻrtasidagi farq. Agent “men tugatdim” deydi, aslida tugatmagan — bu eng keng tarqalgan muvaffaqiyatsizlik turi.
- **Diagnostic Loop (Diagnostik sikl)**: Bajarish, muvaffaqiyatsizlikni kuzatish, uni maʼlum bir harness qatlamiga bogʻlash, oʻsha qatlamni tuzatish, qaytadan bajarish. Bu — harness muhandisligining asosiy metodikasi.
- **Definition of Done (Bajarilganlik mezonlari)**: Mashina tomonidan tekshirilishi mumkin boʻlgan shartlar toʻplami — testlar oʻtadi, lint toza, type check muvaffaqiyatli. Aniq DoD boʻlmasa, agent oʻzicha ixtiro qiladi.

## Yiqilganda — avval harnessʼni tuzating

Asosiy tamoyil: **Yiqilish boʻlganda, modelni almashtirishga shoshilmang — harnessʼni tekshiring.** Agar bir xil model oʻxshash, yaxshi tuzilgan vazifalarda muvaffaqiyat qozonsa — bu harness muammosi deb taxmin qiling. Bu xuddi mashina buzilib qolganga oʻxshaydi — darhol dvigateldan ayb qidirmaysiz. Avval benzin bor-yoʻqligini tekshirasiz.

Aniq qadamlar:

**Har bir muvaffaqiyatsizlikni aniq qatlamga bogʻlang.** Shunchaki “model yomon” demang. Oʻzingizdan soʻrang: vazifa noaniqmidi? Kontekst yetarli emasmidi? Tekshiruv usullari yoʻqmidi? Har bir muvaffaqiyatsizlikni beshta muvaffaqiyatsizlik qatlamlaridan biriga (vazifa spetsifikatsiyasi, kontekst taʼminoti, bajarilish muhiti, tekshiruv qayta aloqasi, holat boshqaruvi) bogʻlang. Shu odatni shakllantirsangiz, “model yetarli emas” iborasi loglaringizda kamayib boradi.

**Har bir vazifa uchun aniq Definition of Done (bajarilganlik mezonlari) yozing.** “Qidiruv funksiyasini qoʻsh” demang. Mana shunday yozing:

```
Bajarilganlik mezonlari:
- Yangi endpoint: GET /api/search?q=xxx
- Sahifalashni qoʻllab-quvvatlaydi, default 20 ta
- Natijalar ajratib koʻrsatilgan parchalarni oʻz ichiga oladi
- Yangi kodning hammasi pytestʼdan oʻtadi
- Type check oʻtadi (mypy --strict)
```

**`AGENTS.md` faylini yarating.** Uni repo ildiziga joylashtiring va agentga loyihaning tech stackʼi, arxitektura konvensiyalari va tekshiruv buyruqlarini ayting. Bu — harness muhandisligidagi birinchi qadam va eng yuqori ROIʼga ega qadam. Bitta `AGENTS.md` fayli qimmatroq modelga oʻtishdan ham samaraliroq boʻlishi mumkin — hazil emas.

**Diagnostik siklni quring.** Muvaffaqiyatsizliklarni “model yana ahmoqlik qildi” deb qaramang. Ularni harnessʼingizda nuqson borligining signali deb qabul qiling. Har bir muvaffaqiyatsizlik uchun qatlamni aniqlang, tuzating, hech qachon shu yoʻl bilan yiqilmang. Bir necha aylanishdan soʻng harnessʼingiz mustahkamlanadi va agent samaradorligi barqarorlashadi. Bu xuddi yoʻl taʼmirlashga oʻxshaydi — har toʻldirilgan chuqur keyingi qismni silliqroq qiladi.

**Yaxshilanishlarni oʻlchang.** Oddiy log yuriting: har bir vazifa muvaffaqiyatli boʻldimi yoki yoʻqmi va qaysi qatlam yiqilishga sabab boʻldi. Bir necha aylanishdan soʻng qaysi qatlam toʻsiq ekanini koʻrasiz — diqqatingizni oʻsha yerga jamlang.

## Million qatorlik tajriba

OpenAI 2025-yilda jasoratli tajriba oʻtkazdi: boʻsh git repozitoriyasidan boshlab, Codex yordamida butun ichki mahsulotni qurish. Besh oydan soʻng repoda taxminan bir million qator kod paydo boʻldi — ilova mantiqi, infratuzilma, asboblar, hujjatlar, ichki dev vositalar — barchasi agent tomonidan yaratilgan. Uchta muhandis Codexʼni boshqarib, taxminan 1 500 ta PR ochib va birlashtirib bordi. Kuniga har bir kishiga oʻrtacha 3,5 ta PR.

Asosiy cheklov: **odamlar hech qachon kodni toʻgʻridan-toʻgʻri yozmagan.** Bu hiyla emas edi — bu jamoani muhandisning asosiy ishi endi kod yozish emas, balki muhitlarni loyihalash, niyatni ifodalash va qayta aloqa sikllarini qurishga aylanganda nima oʻzgarishini aniqlashga majbur qilish uchun moʻljallangan edi.

Boshlanishdagi rivoj kutilganidan sekinroq boʻldi. Codexning imkoniyati yetmagani uchun emas, balki muhit yetarlicha toʻliq emas edi — agent yuqori darajadagi maqsadlarni oldinga siljitish uchun zarur vositalar, abstraksiyalar va ichki strukturalarni topa olmas edi. Muhandislarning ishi quyidagicha oʻzgardi: katta maqsadlarni kichik qurilish bloklariga (dizayn, kod, koʻrib chiqish, test) boʻlib chiqish, agentga ularni yigʻishga ruxsat berish, soʻng oʻsha bloklardan foydalanib murakkabroq vazifalarni ochish. Biror narsa yiqilganda yechim deyarli hech qachon “yana qattiqroq harakat qil” emas edi — “agentda qaysi imkoniyat yetishmayapti va biz uni qanday qilib tushunarli va bajariladigan qilamiz?” edi.

Bu tajriba mazkur maʼruzaning asosiy tezisini bevosita isbotlaydi: **bir xil model qoʻshimcha tuzilmasiz muhitda va toʻliq harnessʼga ega muhitda tubdan farq qiluvchi natija beradi.** Model oʻzgarmadi. Muhit oʻzgardi.

> Manba: [OpenAI: Harness engineering — agent ustuvor dunyoda Codexdan foydalanish](https://openai.com/index/harness-engineering/)

## Yanada amaliy misol

Bir jamoa Claude Sonnetʼdan foydalanib oʻrta hajmdagi Python web ilovasiga (FastAPI + PostgreSQL + Redis, ~15 000 qator kod) yangi API endpoint qoʻshdi.

Boshida ular faqat bir jumla berishdi: “`/api/v2/users` ostida foydalanuvchi sozlamalari endpointʼlarini qoʻsh”. Natija? Agent kontekst oynasining 40%'ini repo strukturasini oʻrganishga sarfladi, koʻrinishidan oqilona kodni yozdi, ammo loyihaning xatoliklarni boshqarish naqshlariga rioya qilmadi, eski SQLAlchemy sintaksisidan foydalandi va endpointʼda esa runtime xatoliklari mavjud edi — agent buni eʼtiborga olmay “tayyor” deb eʼlon qildi. Keyingi sessiya butun oʻrganish ishini boshidan boshlashga majbur boʻldi.

Keyin ular `AGENTS.md` qoʻshdi (loyiha arxitekturasi va texnologiya versiyalari tasviri bilan), aniq tekshirish buyruqlari (`pytest tests/api/v2/ && python -m mypy src/`) va arxitektura qaroriga oid yozuvlar qoʻshdilar. Aynan oʻsha model uchchala mustaqil sinovda muvaffaqiyatga erishdi, kontekst samaradorligi taxminan 60%'ga yaxshilandi.

Ular modelni oʻzgartirmadi. Ular harnessʼni oʻzgartirdi.

## Asosiy xulosalar

- Modelning imkoniyati va bajarilishning ishonchliligi — bular boshqa-boshqa narsalar. Zotli ot ham yaxshi egarni talab qiladi.
- Yiqilish boʻlganda — avval harnessʼni, keyin modelni tekshiring. Modelni almashtirish — eng qimmat variant — va koʻpincha bu model muammosi ham emas.
- Har bir muvaffaqiyatsizlik — signal: harnessʼingizda strukturaviy nuqson bor. Toping, tuzating.
- Beshta himoya qatlami: vazifa spetsifikatsiyasi, kontekst taʼminoti, bajarilish muhiti, tekshiruv qayta aloqasi, holat boshqaruvi. Doktor eng keng tarqalgan sabablarni avval inkor qilganidek, ularni tizimli tekshiring.
- Bitta `AGENTS.md` fayli qimmatroq modelga oʻtishdan koʻra samaraliroq boʻlishi mumkin. Jiddiy.

## Qoʻshimcha oʻqish uchun

- [OpenAI: Harness Engineering — Leveraging Codex in an Agent-First World](https://openai.com/index/harness-engineering/)
- [Anthropic: Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [HumanLayer: Skill Issue — Harness Engineering for Coding Agents](https://humanlayer.dev/articles/harness-engineering-for-coding-agents/)
- [SWE-bench Leaderboard](https://www.swebench.com/)
- [Thoughtworks Technology Radar: Harness Engineering](https://www.thoughtworks.com/radar)

## Mashqlar

1. **Solishtirish tajribasi**: Oʻzingiz yaxshi biladigan kod bazasini va sezilarli oʻzgartirish vazifasini tanlang. Avval agentni hech qanday harness yordamisiz ishga tushiring va muvaffaqiyatsizliklarni qayd eting. Keyin aniq tekshirish buyruqlari bilan `AGENTS.md` qoʻshing va aynan oʻsha agent bilan qayta ishga tushiring. Natijalarni solishtiring va har bir muvaffaqiyatsizlikni beshta himoya qatlamlaridan biriga bogʻlang.

2. **Tekshiruv tafovutini oʻlchash**: 5 ta dasturlash vazifasini tanlang. Har bir vazifadan keyin agent tugatilganini eʼlon qilganmi yoki yoʻqligini yozib oling, soʻng mustaqil testlar orqali haqiqiy toʻgʻrilikni tekshiring. Agent “tayyor” deb aytgan, lekin haqiqatda tugatmagan holatlarning ulushini hisoblang — bu sizning verification gapʼingiz. Soʻng oʻylab koʻring: qaysi tekshirish buyruqlari bu nisbatni kamaytirishi mumkin?

3. **Diagnostik sikl mashqi**: Oʻz loyihangizda agent qayta-qayta yiqilayotgan vazifani toping. Bir marta ishga tushiring, muvaffaqiyatsizlikni qayd eting. Uni beshta qatlamdan biriga bogʻlang. Oʻsha qatlamni tuzating. Qayta ishga tushiring. Uch-besh marta takrorlang, har safar yaxshilanishlarni qayd eting.
