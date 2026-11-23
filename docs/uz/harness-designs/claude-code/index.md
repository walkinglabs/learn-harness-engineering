# Claude Code harness dizayni tahlili

Anthropic “[Uzoq ishlaydigan agentlar uchun samarali harnessʼlar](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)” maqolasida ishonchlilik manbai model emas, harness ekanini va agent “modeldan tashqarida” cheklanishi kerakligini aniq taʼkidlaydi. Claude Code — shu gʻoyaning mahsulotga aylantirilgan namunasi; Anthropicʼning oʻzi ham uni bevosita **agentic harness** toifasiga kiritadi. Bu marketing iborasi emas: Claude Code hozirgacha ommaga eng batafsil ochib berilgan harness boʻlishi mumkin. Uning manba kodi ochiq, hamjamiyat tadqiqotlari batafsil va kurs maʼruzalaridagi deyarli barcha asosiy mexanizmlar — qatlamli xotira, kontekstni siqish, ruxsatlar, hookʼlar, subagentlar va sessiyani saqlash — toʻliq mahsulot darajasida amalga oshirilgan.

Ushbu maqolada Claude Codeʼni kursning beshta quyi tizimli modeli yordamida tahlil qilamiz. Asosiy eʼtibor uning “kontekst boshqaruvi”, “vaqtidan oldin tugallangan deb eʼlon qilishning oldini olish” va “deterministik cheklovlar” kabi harnessʼning fundamental tushunchalarini qanday amalga oshirganiga qaratiladi.

## Bir jumladagi taʼrif

Claude Codeʼning yadrosi oddiy while siklidan iborat: modelni chaqirish, vositani bajarish, natijani kuzatish va modelni yana chaqirish. Ammo **kodning mutlaq koʻpchiligi ushbu sikl ichida emas, uning atrofidagi tizimlarda joylashgan** — ruxsat tizimi, kontekstni siqish pipelineʼi, kengaytma mexanizmlari, subagentlarni muvofiqlashtirish va sessiyalar ombori. harnessʼning mohiyati ham shu: sikl — skelet, ishonchlilikni esa skelet atrofidagi barcha narsalar belgilaydi.

## Yoʻriqnomalar quyi tizimi: qatlamli xotira tizimi

Claude Code xotira tizimi — uning harness nazariyasiga qoʻshgan eng bevosita hissasi. U kursdagi “repo yagona haqiqat manbai” va “sessiyalararo kontekst uzluksizligi” mavzulariga mos keladi. [“Claude loyihangizni qanday eslab qoladi” rasmiy hujjatida](https://code.claude.com/docs/en/memory) aniq aytilishicha, har bir sessiya mutlaqo yangi kontekst oynasidan boshlanadi va bilim ikki mexanizm orqali sessiyalar orasida olib oʻtiladi: CLAUDE.md fayllari (siz yozgan yoʻriqnomalar) va auto memory (Claude oʻzi yozgan qaydlar).

Rasmiy hujjat CLAUDE.md fayllarini amal doirasiga koʻra toʻrt turga ajratadi (yuklanish tartibi kengdan tor doiraga qarab):

- **Tashkilot siyosati darajasi**: IT/DevOps tomonidan markazlashgan holda boshqariladi (masalan, `/etc/claude-code/CLAUDE.md`); kompaniya miqyosidagi standartlar.
- **Foydalanuvchi darajasi `~/.claude/CLAUDE.md`**: loyihalararo shaxsiy afzalliklar va qoidalar.
- **Loyiha darajasi `./CLAUDE.md` yoki `./.claude/CLAUDE.md`**: loyihaning yagona haqiqat manbai; muhandislik tuzilishi, tech stack va tekshiruv buyruqlari bilan repo orqali ulashiladi.
- **Mahalliy daraja `./CLAUDE.local.md`**: loyiha ichidagi shaxsiy afzalliklar; odatda `.gitignore`ʼga qoʻshilib, commit qilinmaydi.

Bundan tashqari, yana ikkita mexanizm bor:

- **Ichki katalog darajasida talab boʻyicha yuklash**: ichki kataloglardagi CLAUDE.md ishga tushirish paytida yuklanmaydi; Claude ushbu katalogdagi faylni oʻqigandagina kontekstga kiradi.
- **Avtomatik xotira (auto memory)**: Claude sizning tuzatishlaringiz va afzalliklaringiz asosida mustaqil qaydlar yozadi. Ular repo miqyosida ulashiladi, worktreeʼlar orasida amal qiladi va har bir sessiyada koʻpi bilan dastlabki 200 qator yoki 25 KB yuklanadi.

Ushbu toʻrt amal doirasi **yoʻriqnomalar iyerarxiyasi**ni hosil qiladi: rasmiy hujjatga koʻra, “aniqroq yoʻriqnomalar kontekstga keyinroq kiradi” (loyiha yoʻriqnomalari foydalanuvchi yoʻriqnomalaridan keyin keladi). Buning foydasi shundaki, model har bir suhbat boshida bitta ulkan yoʻriqnoma faylini hazm qilmaydi; yoʻriqnomalar amal doirasiga qarab eng yaqin joydan yuklanadi. Bu toʻrtinchi maʼruzadagi “nima uchun bitta ulkan yoʻriqnoma fayli muvaffaqiyatsiz boʻladi” savoliga mahsulot darajasidagi javobdir.

## Kontekst quyi tizimi: besh qatlamli siqish pipelineʼi

Claude Code kontekstni **besh qatlamli siqish pipelineʼi** (five-layer compaction pipeline) orqali boshqaradi; bu shunchaki “toʻlsa, qisqacha mazmun yozish” emas. Ushbu arxitektura tafsiloti VILA Labʼning manba kodiga asoslangan [“Dive into Claude Code” tahlilidan](https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf) olingan. Beshinchi maʼruzada “uzoq vazifalar uzluksizlikni yoʻqotadi” deyiladi. Claude Code yechimi koʻp bosqichli voronkadir: avval yoʻqotishsiz kesish (ortiqcha vosita natijalarini olib tashlash), soʻng tuzilmali saralash, faqat oxirida yoʻqotishli LLM xulosasi. Haddan ortiq siqishni oldini olish uchun circuit breaker mexanizmi ham qoʻllanadi.

Bunga sessiyalar ombori dizayni hamroh boʻladi: **qoʻshib borishga yoʻnaltirilgan sessiya ombori (append-oriented storage)**. Butun tarix `history.jsonl` fayliga ketma-ket qoʻshiladi; `/resume` orqali tiklash va fork tarmoqlanishi qoʻllab-quvvatlanadi. Shu tariqa “har bir sessiya tugashidan oldin topshirishni tayyorlash” kafolatlanadi — yaxshi xotira hisobiga emas, balki saqlash qatlami qoʻshib boriladigan va qayta ijro qilinadigan qilib qurilgani sababli.

## Vositalar quyi tizimi: toʻrtta kengaytma mexanizmi

Claude Code kengaytma imkoniyatlarini toʻrt turga ajratadi. Har bir tur alohida muammoni hal qiladi va bu dizaynning eng koʻp oʻrganishga arziydigan qismidir:

- **Koʻnikmalar (Skills)**: [rasmiy hujjatdagi](https://code.claude.com/docs/en/skills) taʼrifga koʻra, `SKILL.md` bilan ifodalanadigan protsessual bilimlar; trigger soʻzlar asosida avtomatik yuklanadi va progressive disclosure usulidan foydalanadi. Muayyan ishni “qanday bajarish”ga oid soha bilimlari uchun mos.
- **MCP**: [rasmiy hujjatdagi](https://code.claude.com/docs/en/mcp) JSON-RPC protokoli tashqi tizimlarga ulanadi; bu “model qoʻllarini tashqi dunyoga yetkazish”ning standart interfeysidir.
- **Hookʼlar (Hooks)**: [rasmiy hujjatga](https://code.claude.com/docs/en/hooks) koʻra, `PreToolUse`, `PostToolUse`, `Stop` kabi lifecycle hodisalariga ulanadigan deterministik skriptlar.
- **Plaginlar / subagentlar (Subagents)**: [rasmiy hujjatga](https://code.claude.com/docs/en/sub-agents) koʻra, murakkab vazifalarni maxsus agentlarga ajratib beradi.

Asosiy dizayn qarori — **masʼuliyatlarni ajratish**: CLAUDE.md “nima”ni, koʻnikmalar “qanday”ni, MCP “qayerga ulanish”ni, hookʼlar esa “qachon majburlash”ni boshqaradi. Agar jamoa bu qatlamlarni aralashtirsa (masalan, MCP bajarishi kerak boʻlgan ishni CLAUDE.mdʼga yozsa), kursda tasvirlangan kontekst sizib chiqishi yuz beradi.

## Qayta aloqa va tekshiruv: deterministik cheklovlar + inson va mashina mehnati taqsimoti

Oʻninchi maʼruzada “faqat toʻliq jarayon bajarilgandagina tekshiruv haqiqiy hisoblanadi” deyiladi. Claude Code bunga ikki yoʻnalishli mexanizm bilan javob beradi:

**1. Ruxsat tizimi (deterministik cheklovlar).** Claude Code ruxsatlari “hamma narsani birma-bir soʻrash” tarzida ishlamaydi. U yettita rejim va ML asosidagi klassifikatordan iborat: past xavfli operatsiyalar oʻtkaziladi, yuqori xavflilari esa siyosatga muvofiq soʻraladi yoki rad etiladi (arxitektura tafsilotlari: [VILA Lab tahlili](https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf)). Bu “agent chegaralarini aniq belgilash”ni (yettinchi maʼruza) prompt orqali iltimos qilishdan runtime majburloviga aylantiradi.

**2. Hookʼlar (vaqtidan oldin tugallangan deb eʼlon qilishni toʻxtatish).** `PostToolUse` hookʼi vosita bajarilgach tekshiruvni majburan ishga tushirishi va natijani kontekstga qaytarishi mumkin; `Stop` hookʼi esa agent ish tugaganini eʼlon qilganda aralashadi. Bu “ishni bajaruvchi bilan tekshiruvchi alohida boʻlishi kerak” tamoyilidir. [Anthropic harness haqidagi maqolada kuzatganidek](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents), agent oʻz ishini ishonch bilan maqtaydi (“confidently praised their work”). Shu sababli modelning oʻz bahosiga ishonish oʻrniga hook orqali **deterministik** tekshiruv kiritiladi.

**3. Subagentlar (kontekst izolyatsiyasi).** Har bir subagentning suhbat tarixi mustaqil sidechain faylida saqlanadi va **ota agent kontekstini kattalashtirmaydi** (qarang: [VILA Lab tahlili](https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf)). Bu “vazifa chegarasi” bilan “kontekst izolyatsiyasi”ning birikmasidir: vazifa boʻlinishi bilan birga kontekstning ifloslanishi ham cheklanadi.

## Kuzatuvchanlik va sessiyani saqlash

Claude Code loglari toʻliq va qoʻshib boriladigan yozuvlar (history.jsonl) shaklida saqlanadi. `/compact`, `/clear`, `/init` kabi aniq buyruqlar yordamida kontekst holatini toʻlib qolishini kutmasdan faol boshqarish mumkin. `/init` esa “agent har safar ishni boshlashdan oldin inisializatsiyadan oʻtishi kerak” tamoyilini (oltinchi maʼruza) bitta buyruqqa aylantiradi: [rasmiy hujjatga](https://code.claude.com/docs/en/memory) koʻra, u kod bazasini avtomatik tahlil qiladi va qurish buyruqlari, test yoʻriqnomalari hamda muhandislik konvensiyalarini oʻz ichiga olgan dastlabki CLAUDE.mdʼni yaratadi.

## Kurs modeliga moslashtirish

| Quyi tizim | Claude Codeʼdagi amalga oshirilishi | Baho |
| --- | --- | --- |
| Yoʻriqnomalar | Amal doirasi boʻyicha qatlamlash (tashkilot/foydalanuvchi/loyiha/mahalliy) + avtomatik xotira | Qatlamli xotira — namunaviy amalga oshirish |
| Vositalar | Koʻnikmalar + MCP + hookʼlar + subagentlardan iborat toʻrtta kengaytma turi | Masʼuliyatlar aniq ajratilgan; asosiy ustunlik |
| Muhit | Loyiha ichidagi sozlamalar + settings.json | Foydalanuvchining CLAUDE.md ichidagi tavsifiga tayanadi |
| Holat | Qoʻshib boriladigan sessiya ombori + besh qatlamli siqish + resume/fork | Juda kuchli; uzoq vazifalar uzluksizligi uchun namuna |
| Qayta aloqa | Ruxsat klassifikatori + PostToolUse hookʼining majburiy tekshiruvi | “Vaqtidan oldin tugallangan deb eʼlon qilish” deterministik mexanizm bilan toʻxtatiladi |

## Oʻrganishga arziydigan dizaynlar

1. **Yoʻriqnomalarni amal doirasi boʻyicha qatlamlang**, bitta faylga uyib tashlamang. Katalog darajasidagi CLAUDE.md — “eng yaqin joydan yuklash”ning nafis yechimi.
2. **Siqishni bosqichli voronkaga aylantiring**: avval yoʻqotishsiz, keyin yoʻqotishli; boshidanoq butun matnni umumlashtirmang.
3. **Deterministik tekshiruvlar uchun hookʼlardan foydalaning**: vaqtidan oldin tugallangan deb eʼlon qilishni prompt bilan iltimos qilish emas, runtime orqali majburlash toʻxtatadi.
4. **Subagentlar kontekstini izolyatsiya qiling**: vazifani boʻlish bilan birga kontekstni ham boʻling; kichik vazifa natijalari asosiy siklni ifloslantirmasin.
5. **Sessiyalar omborini qoʻshib boriladigan va qayta ijro qilinadigan qiling**: topshirishni xotira emas, saqlash qatlami kafolatlaydi.

## Manbalar (asl matn / manba kodi)

Har bir daʼvoni taxminlarga emas, quyidagi asl matn yoki manba kodiga bogʻlash mumkin:

- **Claude Code rasmiy hujjati · Memory**: har bir sessiyadagi yangi kontekst, CLAUDE.mdʼning toʻrtta amal doirasi, ichki kataloglardan talab boʻyicha yuklash, auto memory (200 qator / 25 KB), `/init` orqali CLAUDE.md yaratish.<br/>https://code.claude.com/docs/en/memory
- **Claude Code rasmiy hujjatlari · Skills / MCP / Hooks / Sub-agents**: toʻrtta kengaytma mexanizmi va hodisalarning taʼriflari (PreToolUse / PostToolUse / Stop).<br/>https://code.claude.com/docs/en/skills ｜ https://code.claude.com/docs/en/mcp ｜ https://code.claude.com/docs/en/hooks ｜ https://code.claude.com/docs/en/sub-agents
- **VILA Lab “Dive into Claude Code”** (manba kodi darajasidagi tahlil): besh qatlamli siqish pipelineʼi, yettita ruxsat rejimi + ML klassifikatori, sidechain subagentlari va qoʻshib boriladigan history.jsonl sessiya ombori.<br/>https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf
- **Anthropic “Uzoq ishlaydigan agentlar uchun samarali harnessʼlar”**: “ishonchlilik modeldan emas, harnessʼdan keladi”, agent oʻz ishini ishonch bilan maqtashi va tekshiruv uchun hookʼlardan foydalanish haqidagi fikrlar manbasi.<br/>https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- **Claude Code Full Stack qoʻllanmasi** (hamjamiyat; CLAUDE.md / Skills / MCP / Subagents / Hooks qatlamlari): kengaytma mexanizmlarining masʼuliyatlarini ajratish boʻyicha qoʻshimcha oʻqish.<br/>https://jsmanifest.com/claude-code-full-stack-guide

Tegishli maʼruzalar: [3-maʼruza · Kod reposini yagona haqiqat manbaiga aylantirish](../../lectures/lecture-03-why-the-repository-must-become-the-system-of-record/) ｜ [9-maʼruza · Agentning vaqtidan oldin gʻalabani eʼlon qilishiga yoʻl qoʻymaslik](../../lectures/lecture-09-why-agents-declare-victory-too-early/) ｜ [10-maʼruza · Faqat toʻliq jarayon bajarilgandagina tekshiruv haqiqiy hisoblanadi](../../lectures/lecture-10-why-end-to-end-testing-changes-results/)
