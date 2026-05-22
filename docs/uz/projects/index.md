# Loyihalarga xush kelibsiz

Bu Learn Interview Harness Engineering kursining amaliy qismidir. Faqat maʼruzalarni oʻqish yetarli emas — Interview Debrief Coach ilovasini oʻzingiz qurishingiz va turli harness qoidalari ostida Codex, Claude Code yoki boshqa AI agentlar qanday harakat qilishini kuzatishingiz kerak.

## Loyiha xulosasi

Ushbu kurs bitta Electron AI interview debrief mahsuloti atrofidagi 6 ta bosqichma-bosqich amaliy loyihani oʻz ichiga oladi:

1. **Faqat prompt vs. Avval qoidalar (Prompt-Only vs. Rules-First)**: Agent faqat prompt bilan qanday ishlashini va minimal harness bilan qanday ishlashini taqqoslang.
2. **Agent oʻqiy oladigan ish maydoni (Agent-Readable Workspace)**: Repozitoriyni qanday qilib AI uchun qulay qilishni va ishlarni topshirish (handoff) mexanizmlarini yaratishni oʻrganing.
3. **Koʻp sessiyali uzluksizlik (Multi-Session Continuity)**: Agent ishlarni sessiyalar oʻrtasida muammosiz davom ettira olishi uchun holat fayllari va ishga tushirish (initialization) skriptlarini loyihalang.
4. **Runtime fikr-mulohaza va strukturaviy nazorat**: transcript parsing, segmentatsiya va analysis xatti-harakatlari uchun tekshiruvlar qoʻshing.
5. **Evaluator loops va rollarni ajratish**: timestampli dalillar va debrief sifati uchun mustaqil review mexanizmini quring.
6. **Toʻliq Interview Debrief Harness**: yakuniy, kuzatiladigan (observable), end-to-end agent ish muhitini toʻplang.

Mahsulot chegarasi: ilova faqat nomzodning interviewdan keyingi oʻzini tahlil qilishiga yordam beradi. U nomzodlarni reyting qilmaydi, ishga olish/rad etish tavsiyasi bermaydi, himoyalangan belgilarni taxmin qilmaydi, hissiyot, shaxsiyat yoki yolgʻon haqida hukm chiqarmaydi.

## Qanday davom ettirish kerak

Har bir loyiha papkasi odatda quyidagilarni oʻz ichiga oladi:
- `starter/`: Sizning boshlangʻich ish maydoningiz (workspace).
- `solution/`: Namuna yechim (agar qiyin vaziyatga tushib qolsangiz).
- Sizning orqa foningiz va aniq maqsadlaringiz tushuntirilgan vazifa yoʻriqnomalari.

`starter/` katalogidagi vazifalarni bajarish uchun oʻzingiz afzal koʻrgan AI kod yozish agentidan (masalan, Claude Code, Cursor, Trae) foydalaning.
