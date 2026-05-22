# Learn Interview Harness Engineering kursiga xush kelibsiz

Learn Interview Harness Engineering — haqiqiy capstone mahsulot orqali AI coding agentlarni ishonchli qilishni oʻrgatadigan loyiha asosidagi kurs. Mahsulot — **Interview Debrief Coach**, interview audio yoki timestampli transcriptni import qilib, savol zanjirlarini ajratadigan va timestampli dalillar bilan debrief hisobot hamda mashq rejasini yaratadigan local-first Electron desktop ilovasi.

Kurs harness engineering tuzilmasini saqlaydi: 12 maʼruza, 6 amaliy loyiha, starter/solution, resurs andozalari, feature list, progress log, benchmark, cleanup scanner va session handoff. Asosiy manbalarimiz:

- [OpenAI: Harness engineering — agent ustuvor dunyoda Codexdan foydalanish](https://openai.com/index/harness-engineering/)
- [Anthropic: Uzoq ishlovchi agentlar uchun samarali harnessʼlar](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Anthropic: Uzoq muddatli ilova ishlab chiqish uchun harness dizayni](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [Awesome Harness Engineering](https://github.com/walkinglabs/awesome-harness-engineering)

Tizimli muhit dizayni, holat boshqaruvi, tekshiruv va nazorat tizimlari orqali ushbu kurs sizga Codex va Claude Code kabi agentik kod yozish vositalarini haqiqatan ham ishonchli qilishni oʻrgatadi.

Xavfsizlik chegarasi: ilova faqat nomzodning interviewdan keyingi oʻzini tahlil qilishiga yordam beradi. U nomzodlarni reyting qilmaydi, ishga olish/rad etish tavsiyasi bermaydi, himoyalangan belgilarni taxmin qilmaydi, hissiyot, shaxsiyat yoki yolgʻon haqida hukm chiqarmaydi.

## Boshlash

Oʻqish yoʻlingizni tanlang. Kurs uch qismdan iborat: nazariy maʼruzalar, amaliy loyihalar va tayyor koʻchirib olinadigan resurslar kutubxonasi.

<div class="card-grid">
  <a href="./lectures/lecture-01-why-capable-agents-still-fail/" class="card">
    <h3>Maʼruzalar</h3>
    <p>Kuchli modellar nega hali ham xato qilishini va samarali harness ortidagi nazariyani oʻrganing.</p>
  </a>
  <a href="./projects/" class="card">
    <h3>Loyihalar</h3>
    <p>Interview Debrief Coach va uning harnessini noldan rivojlantirish boʻyicha amaliy mashqlar.</p>
  </a>
  <a href="./resources/" class="card">
    <h3>Resurslar kutubxonasi</h3>
    <p>Oʻz repozitoriyalaringizda foydalanish uchun tayyor andozalar (AGENTS.md, feature_list.json).</p>
  </a>
</div>

## Harnessʼning asosiy mexanizmi

Harness modelni “aqlliroq qilmaydi”; aksincha, model uchun yopiq sikldagi **ishchi tizim** oʻrnatadi. Uning ishlash jarayonini quyidagi sodda diagramma orqali tushunish mumkin:

```mermaid
graph TD
    A["Aniq maqsad<br/>AGENTS.md"] --> B("Inisializatsiya<br/>init.sh")
    B --> C{"Vazifani bajarish<br/>AI Agent"}
    C -->|Muammoga duch keldi| D["Runtime fikr-mulohaza<br/>CLI / Loglar"]
    D -->|Avto-tuzatish| C
    C -->|Kod tayyor| E{"Tekshirish va QA<br/>Test toʻplami"}
    E -->|Yiqildi| D
    E -->|Oʻtdi| F["Tozalash va topshirish<br/>claude-progress.md"]

    classDef primary fill:#D95C41,stroke:#C14E36,color:#fff,font-weight:bold;
    classDef process fill:#F4F3EE,stroke:#D1D1D1,color:#1A1A1A;
    classDef check fill:#EAE8E1,stroke:#B3B3B3,color:#1A1A1A;

    class A,F primary;
    class B,D process;
    class C,E check;
```

## Nimalarni oʻrganasiz

Mana oʻzlashtiradigan asosiy tushunchalardan baʼzilari:

<ul class="index-list">
  <li><strong>Agent xatti-harakatini cheklash</strong> — aniq qoidalar va chegaralar yordamida.</li>
  <li><strong>Kontekstni saqlash</strong> — uzoq davom etadigan, koʻp sessiyali vazifalar boʻyicha.</li>
  <li><strong>Agentlarni toʻxtatish</strong> — vaqtidan oldin “tugadim” deb eʼlon qilishlarining oldini olish.</li>
  <li><strong>Ishni tekshirish</strong> — toʻliq pipeline testlari va oʻz-oʻzini baholash orqali.</li>
  <li><strong>Runtimeʼni kuzatib borish</strong> va xatolarni topish oson boʻlishi uchun.</li>
</ul>

## Keyingi qadamlar

Asosiy tushunchalarni oʻzlashtirgandan soʻng, quyidagi yoʻriqnomalar yanada chuqurroq kirib borishga yordam beradi:

<ul class="index-list">
  <li><a href="./lectures/lecture-01-why-capable-agents-still-fail/">01-maʼruza: Kuchli agentlar nega hali ham yiqiladi</a> — harness muhandisligi nazariyasidan boshlang.</li>
  <li><a href="./projects/project-01-baseline-vs-minimal-harness/">01-loyiha: Baseline va minimal harness</a> — birinchi haqiqiy vazifani qadamma-qadam koʻrib chiqing.</li>
  <li><a href="./resources/templates/">Andozalar</a> — oʻz loyihalaringiz uchun minimal harness paketini (AGENTS.md, feature_list.json, claude-progress.md) oling.</li>
</ul>
