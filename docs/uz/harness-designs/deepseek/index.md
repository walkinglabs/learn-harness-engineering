# DeepSeek Harness dizayni tahlili

[DeepSeek Harness](https://deepseek.com/harness) (`dsh` buyrugʻi, `deepseek-ai/deepseek-harness` reposi) 2026-yil avgustida Developer Preview shaklida chiqarildi. Rasmiy taʼrif juda toʻgʻridan-toʻgʻri: **Agent = Model + Environment + Tools + State** — model, muhit, vositalar va holat; toʻrtlik toʻplam.

Agar oldingi uchta mahsulot tahlili “harness qanday loyihalanishi kerak?” degan savolni bersa, DeepSeek Harness yanada keskin savol qoʻyadi: **harness muayyan modeldan ajralib, mustaqil runtime boʻla oladimi?** Uning javobi — ha, va u bu gʻoyani eng oxirgi nuqtasigacha olib boradi. [Arxitektura hujjatidagi](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md) asl ibora: *Every part of the product is a plugin, including the model adapter, the tool registry, the session log, and the agent loop itself* (mahsulotning har bir qismi — model adapteri, vositalar registri, sessiya logi va hatto agent siklining oʻzi ham — plagindir).

Ushbu maqolada uch jihatga asosiy eʼtibor qaratamiz: plaginli yadro, imkoniyat tutashuvi (capability seam), hodisalar pipelineʼi hamda eng kuchli muhandislik cheklovi — “Model-visible means logged”.

## Bir jumladagi taʼrif

Anʼanaviy coding agent tuzilishi “LLM + oʻzgarmas agent sikli + oʻzgarmas vositalar toʻplami”dan iborat. DeepSeek Harness tuzilishi esa “model + plagin yadrosi (Cordis)”dir. Yadro faqat plaginlarni yuklash, tushirish, bogʻliqliklar va hodisalar mexanizmini boshqaradi; u **agentning hech qanday muayyan imkoniyatiga egalik qilmaydi**. [Arxitektura hujjatidagi](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md) asl iboralar: “There is no privileged core to patch” (patch qilish kerak boʻlgan imtiyozli yadro yoʻq) va “you extend dsh by mounting a plugin beside the others” (yadroni oʻzgartirmasdan, boshqalari yoniga plagin ulash orqali dshʼni kengaytirasiz). Demak, hatto agent siklining oʻzi ham daxlsiz emas: DeepSeek modelini ishlatish, unga Claude Code subagentlarini ulash, masofaviy sandbox qoʻshish, maxsus xotira yozish, maxsus sikl yoki UI bilan almashtirish va bularning barchasidan mutlaqo yangi agent yigʻish mumkin.

Bu kursdagi “model ogʻirliklaridan tashqaridagi barcha narsa harness” iborasining eng toʻliq amalga oshirilishidir: harness mustaqil boʻlsa, uni mustaqil operatsion tizimga aylantirish mumkin.

## Arxitektura yadrosi 1: imkoniyat tutashuvi (Capability Seam)

DeepSeek Harness “imkoniyat”ni Service orqali ifodalaydi va deyarli har bir imkoniyatni uch qatlamga ajratadi:

```
Service Definition
        ↓
Service Provider
        ↓
Consumer
```

Masalan, fayl tizimida `FS Service` ostida Local FS, E2B FS va Remote FS kabi bir nechta Provider mavjud; yuqorida esa ular yagona file tools koʻrinishida ochiladi. Shell, Subprocess, Sandbox, Web, LLM va SubAgent ham ayni tuzilishga ega. Ushbu uch qatlamli tuzilma bizning xulosamiz emas. [Arxitektura hujjatining Capability seams boʻlimida](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md) aynan shunday yozilgan: *a seam is a swappable capability with three roles: a Service Definition declaring the interface, a Service Provider implementing it, and a Consumer using it, commonly a model-facing tool* (imkoniyat tutashuvi — uchta roldan iborat almashtiriladigan imkoniyat: interfeysni eʼlon qiluvchi Service Definition, uni amalga oshiruvchi Service Provider va undan foydalanuvchi Consumer; oxirgisi odatda modelga koʻrinadigan vosita boʻladi).

Bu harness muhandisligidagi uzoq yillik muammoni hal qiladi: **agent “muayyan vosita”ga tayanishi kerakmi yoki “imkoniyat interfeysi”gami?** DeepSeek Harness ikkinchisini tanlaydi. Kurs nuqtayi nazaridan, bu “vositalar quyi tizimi” interfeys sifatida standartlashtirilganini anglatadi: Provider almashtirilsa, modelga ochiladigan vosita koʻrinishi oʻzgarmaydi, ammo muhit butunlay almashadi.

## Arxitektura yadrosi 2: hodisalar pipelineʼi (Event Pipeline)

DeepSeek Harness ichki tuzilishi oddiy “LLM → vosita → LLM” emas. U hodisalar pipelineʼidan iborat boʻlib, har bir bosqich plagin tinglashi mumkin boʻlgan hodisa nuqtasidir:

```
turn/start → claim input → assemble（system prompt / context / tools）
  → agent/pre-step → step/start → LLM request（agent/request）→ llm/stream
  → assistant/message → tool/call
  → tools/pre-execute（permission / guard / policy / hook）
  → tools/execute → tools/post-execute → tool/result → step/end → next turn
```

(Yuqoridagi pipeline [arxitektura hujjatining Turn flow boʻlimidagi](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md) maʼlumotning qayta bayonidir: `turn/*`, `step/*`, `user/message`, `assistant/*`, `tool/*` — doimiy saqlanadigan sessiya hodisalari; `agent/pre-step`, `agent/request`, `llm/stream`, `tools/*` esa plaginlar tinglashi mumkin boʻlgan kengaytma nuqtalaridir.)

Bu dizaynning eng katta afzalligi: **koʻplab funksiyalar uchun agent siklining oʻzini oʻzgartirish shart emas**. Vositani bajarishdan oldin xavfsizlik tekshiruvi kerakmi? `tools/pre-execute`ʼni tinglang. Xotira qoʻshmoqchimisiz? `agent/pre-step`ʼda maʼlumot kiriting. Xatti-harakatlarni yozmoqchimisiz? Session hodisalariga obuna boʻling. Model soʻrovini oʻzgartirmoqchimisiz? `agent/request`ʼga hook ulang. Fikrlashni davom ettirish kerakligini aniqlamoqchimisiz? `agent/turn-stopping`ʼni tinglang.

Kursning oʻn birinchi maʼruzasidagi “agent ish jarayonini kuzatiladigan qiling” gʻoyasi bilan taqqoslaganda, DeepSeek Harness yanada uzoqqa boradi: u shunchaki “log qoʻshmaydi”, balki **siklning har bir qadamini hodisa nuqtasiga aylantiradi**. Shu tariqa kuzatuvchanlik, ruxsat, xotira va siyosat siklga qotirib yozilmaydi, balki tinglovchi sifatida ulanadi.

## Arxitektura yadrosi 3: Session Event Log va “Model-visible means logged”

DeepSeek Harnessʼda **append-only Session Event Log (faqat qoʻshib boriladigan sessiya hodisalari logi)** mavjud va juda kuchli muhandislik cheklovi belgilangan. [Arxitektura hujjatining Session log boʻlimidagi](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md) asl matn:

> **Model-visible means logged.** Anything that reaches a model request must be reconstructable from the log, and a runtime invariant asserts it.

(Model koʻra oladigan barcha narsa logga yozilishi shart. Model soʻroviga yetib kelgan har qanday narsani logdan qayta tiklash mumkin boʻlishi kerak va runtime invarianti buni majburan tekshiradi.)

Boshqacha aytganda, kuzatuvchanlik keyin qoʻshiladigan log emas, harnessʼning birlamchi cheklovidir: model kontekstiga kirgan har qanday narsa sukut boʻyicha logda qolishi kerak. Bu yakuniy maʼruzadagi “kuzatuvchanlik harness ichida boʻlishi kerak” gʻoyasiga toʻgʻridan-toʻgʻri mos keladi va “append-only” saqlash dizaynini tamoyilga aylantiradi: loglar faqat qoʻshiladi, qayta yozilmaydi; sessiya holatini qayta ijro qilish mumkin.

## Kurs modeliga moslashtirish

| Quyi tizim | DeepSeek Harnessʼdagi amalga oshirilishi | Baho |
| --- | --- | --- |
| Yoʻriqnomalar | Plaginlashtirilgan; qoidalar/koʻnikmalar plagin sifatida kiritiladi | Juda erkin, ammo ichki “CLAUDE.md”ga oʻxshash konvensiya yoʻq |
| Vositalar | Service Definition → Provider → Consumer imkoniyat tutashuvi | Vositalar quyi tizimini standartlashtirishning eng oxirgi nuqtasi |
| Muhit | Sandbox/FS/Shell Providerʼlari toʻliq almashtiriladi (masofaviy E2B ham) | Muhit toʻliq ulanadigan va almashtiriladigan |
| Holat | append-only Session Event Log + Model-visible means logged | Kuzatuvchanlik — birlamchi cheklov |
| Qayta aloqa | tools/pre-executeʼdagi permission / guard / policy / hook | Qayta aloqa mexanizmi hodisalarga aylantirilgan |

DeepSeek Harnessʼning qolgan uch mahsulotdan tub farqi: Pi, Claude Code va Codex harnessʼni “muayyan agent” ichida takomillashtiradi; DeepSeek Harness esa harnessʼni **modeldan mustaqil operatsion tizim** sifatida belgilaydi, agentning oʻzi esa ushbu OS ichidagi almashtiriladigan ilova xolos. Buning narxi ham ayon: yuqori erkinlik yuqori sozlash xarajatini anglatadi. Bu “harness — OS” dizaynining tabiiy ikkinchi tomonidir (Developer Preview bosqichi ham “erta sinab koʻrish, mexanizmlar hali rivojlanmoqda” tarzida taqdim etilgan).

## Oʻrganishga arziydigan dizaynlar

1. **Siklning har bir qadamini hodisa nuqtasiga aylantiring**: ruxsat, xotira, siyosat va loglarni siklga qotirib yozmang; ularni tinglovchi sifatida ulang.
2. **Imkoniyat tutashuvlarini standartlashtiring**: “muayyan vosita”ga emas, “imkoniyat interfeysi”ga tayaning; model koʻradigan vositalar qatlami oʻzgarmasdan muhitni toʻliq almashtirish mumkin boʻlsin.
3. **Model-visible means logged**: model koʻra oladigan barcha narsa yozib borilishi shart; kuzatuvchanlikni “qoʻshimcha afzallik”dan “birlamchi cheklov”ga aylantiring.
4. **append-only sessiya logi**: holatni qayta ijro qilish va ishonchli topshirish imkonini beradi; bu “har bir sessiyadan keyin toza holat qoldirish”ning muhandislik kafolatidir.

## Manbalar (asl matn / manba kodi)

Har bir daʼvoni taxminlarga emas, quyidagi asl matn yoki manba kodiga bogʻlash mumkin:

- **DeepSeek Harness rasmiy sayti**: mahsulotning “Agent = Model + Environment + Tools + State” taʼrifi, Developer Preview maqomi va `dsh` buyrugʻi.<br/>https://deepseek.com/harness
- **deepseek-ai/deepseek-harness reposi** (`dsh` buyrugʻi, MIT litsenziyasi):<br/>https://github.com/deepseek-ai/deepseek-harness
- **architecture.md arxitektura hujjati**: ushbu maqolaning asosiy manbasi — “Every part of the product is a plugin”, “There is no privileged core to patch”, Turn flow hodisalar pipelineʼi, Capability seams uch qatlamli rollari, “Model-visible means logged” va runtime invarianti, append-only Session Event Log, fs/tools/telemetry kabi imkoniyat tutashuvlari hamda `ctx.*` quyi tizimlari.<br/>https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md
- **Arxitektura hujjatining qoʻshimcha hujjatlari**: Cordis yadrosiga kirish (plugins contribute services, typed events, reversible effects), imkoniyat tutashuvlari tafsilotlari va Session quyi tizimi.<br/>https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-primer.md ｜ https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/capability-seams.md ｜ https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/subsystems/session.md

Tegishli maʼruzalar: [11-maʼruza · Agent ish jarayonini kuzatiladigan qilish](../../lectures/lecture-11-why-observability-belongs-inside-the-harness/) ｜ [12-maʼruza · Har bir sessiya tugashidan oldin topshirishni tayyorlash](../../lectures/lecture-12-why-every-session-must-leave-a-clean-state/) ｜ [2-maʼruza · Harness aslida nima?](../../lectures/lecture-02-what-a-harness-actually-is/)
