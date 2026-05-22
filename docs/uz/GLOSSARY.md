# Terminologik glossary — Harness Engineering

Ushbu hujjat barcha tarjimalarda atamalar bir xil qoʻllanishini taʼminlaydi. Yangi maʼruza yoki loyiha tarjima qilinganda — avval shu hujjat bilan tekshirib chiqing, ixtiro qilmang.

**Tartib:** har bir atama uchun:
- **EN** — inglizcha asl
- **UZ** — standart oʻzbekcha tarjima (yoki `[saqlanadi]` — inglizcha qoldiriladi)
- **Tafsif** — qisqa izoh
- **Qoʻllash** — qachon, qayerda, qanday yozish

---

## 1. Markaziy tushunchalar (Core)

### Harness
- **EN:** Harness
- **UZ:** Harness *[saqlanadi — kalit atama]*
- **Tafsif:** Modeldan tashqaridagi barcha muhandislik infratuzilmasi — yoʻriqnomalar, vositalar, muhit, holat boshqaruvi, tekshiruv tizimi.
- **Qoʻllash:** Birinchi marta uchraganda — `harness (egar)` deb metafora bilan beriladi. Keyin oddiy `harness`. Suffikslar: `harnessʼga`, `harnessʼni`, `harnessʼlangan` (qoʻshma keng ishlatilmasin — "harnessga ega" afzal).

### Agent
- **EN:** AI agent / coding agent / agent
- **UZ:** Agent *[saqlanadi]*
- **Tafsif:** Avtonom kod yozish/oʻqish/tahrirlash imkoniyatiga ega LLM-asoslangan dastur (Codex, Claude Code va h.k.).
- **Qoʻllash:** Doim `agent` (kichik harf, tarjima qilinmaydi). "Sun'iy intellekt agenti" — birinchi marta keng kontekstda. Keyin shunchaki `agent`.

### Repository
- **EN:** Repository / repo
- **UZ:** Repozitoriy / repo *[saqlanadi]*
- **Tafsif:** Git boshqaruvidagi kod va hujjatlar majmuasi.
- **Qoʻllash:** Birinchi marta — `repozitoriy (repo)`. Keyin `repo`. Yopiq atamalar: `repo strukturasi`, `repo ildizi`, `repo tarixi`.

### Model
- **EN:** Model / LLM
- **UZ:** Model *[saqlanadi]*
- **Tafsif:** Til modeli (GPT-4o, Claude Opus, va h.k.) — agentning "miya"si.
- **Qoʻllash:** `model og'irliklari` (model weights) — texnik termin sifatida saqlanadi.

### Prompt
- **EN:** Prompt
- **UZ:** Prompt *[saqlanadi]*
- **Tafsif:** Foydalanuvchi tomonidan modelga beriladigan koʻrsatma matni.
- **Qoʻllash:** "system prompt", "user prompt" — inglizcha qoldiriladi. Suffikslar: `promptʼda`, `promptʼning`.

### Context window
- **EN:** Context window
- **UZ:** Kontekst oynasi *yoki* `context window` *[saqlanadi]*
- **Tafsif:** Modelning bir vaqt ichida koʻra oladigan matn hajmi (token bilan oʻlchanadi).
- **Qoʻllash:** Texnik kontekstda inglizcha. Tushuntirish kontekstida `kontekst oynasi` ishlatilishi mumkin.

---

## 2. Asosiy muvaffaqiyatsizlik turlari (Failure layers)

### Capability Gap
- **EN:** Capability Gap
- **UZ:** Capability Gap (imkoniyatlar tafovuti)
- **Tafsif:** Modelning benchmark natijalari va haqiqiy vazifalardagi natijalari oʻrtasidagi farq.
- **Qoʻllash:** Birinchi marta — toʻliq atama (qavs ichida tarjima). Keyin — `Capability Gap` yoki `imkoniyatlar tafovuti`.

### Verification Gap
- **EN:** Verification Gap
- **UZ:** Verification Gap (tekshiruv tafovuti)
- **Tafsif:** Agentning oʻz natijasiga ishonchi va haqiqiy toʻgʻrilik oʻrtasidagi farq.
- **Qoʻllash:** Atamani saqlang; tarjimasi qavsda. Suffikslar: `verification gapʼingiz`.

### Harness-Induced Failure
- **EN:** Harness-Induced Failure
- **UZ:** Harness-Induced Failure (harness keltirib chiqargan muvaffaqiyatsizlik)
- **Tafsif:** Modelda imkoniyat bor, lekin muhitda nuqson tufayli yiqilish.
- **Qoʻllash:** Toʻliq atama saqlanadi. Tarjimaga "harness sabab" deb yozmang — "harness keltirib chiqargan" toʻgʻri.

### Context Anxiety
- **EN:** Context anxiety
- **UZ:** Kontekst xavotiri (context anxiety)
- **Tafsif:** Agent kontekst tugayotganini sezsa shoshilib oddiy yechimni tanlaydigan hodisa.
- **Qoʻllash:** Birinchi marta toʻliq, keyin `kontekst xavotiri`.

### Five Failure Layers (Beshta muvaffaqiyatsizlik qatlami)

Bularning tarjimasi har joyda bir xil boʻlsin:

1. **Task specification** → `vazifa spetsifikatsiyasi`
2. **Context provision** → `kontekst taʼminoti`
3. **Execution environment** → `bajarilish muhiti`
4. **Verification feedback** → `tekshiruv qayta aloqasi`
5. **State management** → `holat boshqaruvi`

> **Diqqat:** "feedback" har joyda bir xil tarjima qilinmaydi:
> - "verification feedback" → `tekshiruv qayta aloqasi`
> - "feedback loop" → `qayta aloqa sikli`
> - "runtime feedback" → `runtime fikr-mulohaza` *yoki* `runtime qayta aloqa`

---

## 3. Jarayon va metodologiya (Process)

### Diagnostic Loop
- **EN:** Diagnostic Loop
- **UZ:** Diagnostik sikl (diagnostic loop)
- **Tafsif:** Bajarish → muvaffaqiyatsizlikni kuzatish → qatlamga bogʻlash → tuzatish → qaytadan bajarish.
- **Qoʻllash:** `Diagnostik sikl` — asosiy. Inglizcha qavsda birinchi marta.

### Definition of Done (DoD)
- **EN:** Definition of Done / DoD
- **UZ:** Definition of Done (bajarilganlik mezonlari) / DoD
- **Tafsif:** Mashina tekshirishi mumkin boʻlgan tugatish shartlari toʻplami.
- **Qoʻllash:**
  - Birinchi marta toʻliq.
  - Keyin **DoD** abbreviature OK.
  - Tarjimada **bajarilganlik mezonlari** ishlatiladi (NOT "tugatildi taʼrifi", NOT "tugatish mezonlari").

### Initialization phase
- **EN:** Initialization / Init phase
- **UZ:** Inisializatsiya / inisializatsiya bosqichi
- **Tafsif:** Agent ish boshlashidan oldin loyiha bilan tanishish va muhitni sozlash bosqichi.
- **Qoʻllash:** `init.sh` — fayl nomi, tarjima qilinmaydi.

### Handoff
- **EN:** Handoff
- **UZ:** Topshirish (handoff)
- **Tafsif:** Bir sessiyadan keyingisiga, yoki agentdan odamga ish holatini topshirish.
- **Qoʻllash:** `claude-progress.md` — handoff fayli, nomi saqlanadi.

### Session
- **EN:** Session
- **UZ:** Sessiya *[saqlanadi]*
- **Tafsif:** Bir agent ishlashining boshidan oxirigacha boʻlgan davri.
- **Qoʻllash:** `koʻp sessiyali`, `sessiyalar oraligʻi`, `sessiyalararo`.

### Diagnostic loop attribution
- **EN:** Attribute failure to layer
- **UZ:** Muvaffaqiyatsizlikni qatlamga bogʻlash
- **Qoʻllash:** "atribut qilish" kalka — ishlatmang. "Bogʻlash" yoki "tegishli qatlamga ajratish".

---

## 4. Infratuzilma fayllari (Files)

Quyidagi fayl nomlari **doim saqlanadi** — tarjima qilinmaydi:

| Fayl | Vazifasi |
|------|----------|
| `AGENTS.md` | Agent uchun loyiha boʻyicha asosiy yoʻriqnoma |
| `CLAUDE.md` | Claude Code uchun maxsus yoʻriqnoma |
| `feature_list.json` | Loyiha funksiyalari roʻyxati |
| `init.sh` | Inisializatsiya skripti |
| `claude-progress.md` | Sessiyalar oraligʻi handoff fayli |

---

## 5. Sifat va tekshiruv (Quality)

### Test
- **EN:** Test / unit test / integration test / E2E test
- **UZ:** Test *[saqlanadi]*
- **Qoʻllash:** `unit test`, `integration test`, `end-to-end test` — inglizcha. `pytest`, `vitest` — fayl nomi sifatida.

### Lint
- **EN:** Lint / linter
- **UZ:** Lint *[saqlanadi]*
- **Qoʻllash:** "lint toza" (clean lint), "lint xatolari" (lint errors).

### Type check
- **EN:** Type check / type checking
- **UZ:** Type check *[saqlanadi]*
- **Qoʻllash:** **NOT** "tip tekshiruvi" — yarim-tarjima. Toʻliq inglizcha qoldiriladi (mypy, tsc, pyright kontekstlarida).

### End-to-end testing
- **EN:** End-to-end testing / E2E
- **UZ:** End-to-end testlash / E2E test
- **Tafsif:** Toʻliq pipeline (boshidan oxirigacha) test.
- **Qoʻllash:** `E2E` qisqartmasi keyingi marotabalarda OK.

### Observability
- **EN:** Observability
- **UZ:** Kuzatuvchanlik (observability)
- **Tafsif:** Tizim ichida nima sodir boʻlayotganini kuzatish va tushunish imkoniyati.
- **Qoʻllash:** `kuzatuvchanlik` — texnik atama. Keng oʻzbek tilida kam ishlatiladi, shuning uchun birinchi marta toʻliq inglizcha qavsda.

### Pipeline
- **EN:** Pipeline / CI pipeline
- **UZ:** Pipeline *[saqlanadi]*

### Benchmark
- **EN:** Benchmark / SWE-bench
- **UZ:** Benchmark *[saqlanadi]*
- **Qoʻllash:** `SWE-bench Verified`, `benchmark natijalari`. Tarjima qilinmaydi.

### Runtime
- **EN:** Runtime
- **UZ:** Runtime *[saqlanadi]*
- **Qoʻllash:** "runtime xatoliklari" (runtime errors), "runtime fikr-mulohaza" (runtime feedback).

---

## 6. Loyihalar va arxitektura (Architecture)

### System of Record (SoR)
- **EN:** System of Record / SoR
- **UZ:** Yagona haqiqat manbai (system of record)
- **Tafsif:** Tizim holatining yagona, ishonchli manbai (3-maʼruza markaziy tushunchasi).
- **Qoʻllash:** Birinchi marta toʻliq. Keyin `SoR` yoki `yagona haqiqat manbai`. NOT "yozuv tizimi" (kalka).

### Feature list
- **EN:** Feature list
- **UZ:** Funksiyalar roʻyxati / feature list
- **Qoʻllash:** Loyihaning rasmiy `feature_list.json` fayliga ishora qilganda — atama saqlanadi. Umumiy maʼnoda — `funksiyalar roʻyxati`.

### Workspace
- **EN:** Workspace / agent-readable workspace
- **UZ:** Ish maydoni / agent oʻqiy oladigan ish maydoni
- **Qoʻllash:** Loyiha-2 nomi.

### Tech stack
- **EN:** Tech stack
- **UZ:** Tech stack *[saqlanadi]*
- **Qoʻllash:** **NOT** "texnologik stak" (yarim-tarjima). Inglizcha qoldiriladi: `loyihaning tech stack'i`.

### Tool
- **EN:** Tool / tools / tooling
- **UZ:** Vosita / vositalar
- **Tafsif:** Agent foydalanadigan dasturiy vositalar (shell, file editor, test runner, va h.k.).
- **Qoʻllash:** **Doim** `vosita` deb tarjima qilinadi (NOT preserved English). "Vosita" oʻzbekchada "tool" ning tabiiy ekvivalenti. Mermaid block'larda ham `Vositalar`. Texnik kompozit atamalar (`tool calling`, `tool use`) — toʻliq inglizcha qoldirilishi mumkin.

### Architecture decision record (ADR)
- **EN:** ADR / Architecture Decision Record
- **UZ:** Arxitektura qarorlari yozuvlari (ADR)
- **Qoʻllash:** Birinchi marta toʻliq, keyin ADR.

---

## 7. Agent xatti-harakati (Agent behavior)

### Overreach / Under-finish
- **EN:** Agents overreach and under-finish
- **UZ:** Agentlar haddan oshib, oxirigacha yetmaydi
- **Tafsif:** Agent skopdan tashqariga chiqib ketadi va asosiy vazifani tugatmaydi (7-maʼruza).

### Declare victory too early
- **EN:** Declare victory too early
- **UZ:** Vaqtidan oldin gʻalabani eʼlon qilish *yoki* `vaqtidan oldin "tugadim" deyish`
- **Qoʻllash:** Idiomatik. "Gʻalaba eʼlon qilish" — kalka boʻlsa-da, oʻzbekchada tushunarli.

### Scope control
- **EN:** Scope control
- **UZ:** Skoup nazorati (scope control)
- **Tafsif:** Agent vazifa chegarasidan chiqmasligini taʼminlash.

### Self-verification
- **EN:** Self-verification
- **UZ:** Oʻz-oʻzini tekshirish
- **Qoʻllash:** "self-verification" inglizcha qavsda birinchi marta.

### evidence-grounded debrief report
- **EN:** evidence-grounded debrief report / Evidence-grounded debrief reports
- **UZ:** Evidence-grounded debrief report
- **Tafsif:** Javob har bir tasdiq uchun manba (kod yoki hujjatda) bilan asoslangan.

---

## 8. Uslubiy atamalar (Style)

### Bare environment
- **EN:** Bare environment / no support
- **UZ:** Qoʻshimcha tuzilmasiz muhit *yoki* `harness'siz muhit`
- **Qoʻllash:** **NOT** "yalangʻoch muhit" (kalka). Toʻgʻri rendering — `qoʻshimcha tuzilmasiz`.

### Out of the box
- **EN:** Out of the box
- **UZ:** Boshlangʻich holatda *yoki* `qutidan chiqqan zahoti`
- **Qoʻllash:** "qutidan tashqarida" — kalka, ishlatmang.

### Reach for your wallet
- **EN:** Reach for your wallet
- **UZ:** Pul sarflashga shoshilmoq
- **Qoʻllash:** **NOT** "hamyonga qoʻl urmoq" (kalka — oʻzbekchada bunday ibora yoʻq).

### Time to upgrade
- **EN:** Time to upgrade / Time to X
- **UZ:** X vaqti keldi *(NOT "X-ga vaqt keldi")*
- **Misol:** "Time to upgrade" → "Yangiroq modelga oʻtish vaqti keldi" (NOT "Yaxshilashga vaqt keldi").

### Looks reasonable
- **EN:** Code that looks reasonable
- **UZ:** Yuzaki qaraganda mantiqli koʻringan kod
- **Qoʻllash:** **NOT** "koʻrinishidan oqilona" (kalka).

### Run (experiment)
- **EN:** First run / second run / independent run
- **UZ:** Birinchi sinov / ikkinchi sinov / mustaqil sinov
- **Qoʻllash:** **NOT** "yugurish" (sport maʼnosida noʻgʻri). `Sinov` — texnik tajriba.

### Gimmick
- **EN:** Gimmick
- **UZ:** Hiyla *yoki* `effekt uchun qilingan ish`
- **Qoʻllash:** **NOT** "oʻyin" (oʻyin = game, boshqa maʼno).

### Down-to-earth
- **EN:** Down-to-earth example
- **UZ:** Hayotiy misol
- **Qoʻllash:** **NOT** "amaliy misol" (juda umumiy).

### Wallet/money idioms
- "burn money/budget" → `pul sarflash`
- "expensive option" → `qimmat variant`
- "ROI-yuqori" — saqlanadi (ROI'ga ega)

---

## 9. Punktuatsiya va imlo (Orthography)

| Notoʻgʻri | Toʻgʻri | Eslatma |
|-----------|---------|---------|
| `o'`, `O'`, `g'`, `G'` | `oʻ`, `Oʻ`, `gʻ`, `Gʻ` | U+02BB |
| `ma'ruza`, `sun'iy`, `e'lon`, `ta'lim` | `maʼruza`, `sunʼiy`, `eʼlon`, `taʼlim` | U+02BC |
| `"matn"` (matn ichida) | `"matn"` | Egma tirnoq |
| HTML `class="..."` | `class="..."` | Toʻgʻri tirnoq |
| `qaer`, `qaerda` | `qayer`, `qayerda` | Imloviy xato |
| `senariy` | `ssenariy` | Russian-borrowed, double s |
| `etarli` (so'z boshida) | `yetarli` | y kerak |
| `xayron`, `xolat`, `xokim` | `hayron`, `holat`, `hokim` | h/x adashishi |
| `xech` | `hech` | h, NOT x |
| `shablon` | `andoza` | Lugʻat tanlovi |
| `tip tekshiruvi` | `type check` | Ingliz texnik atamani saqlang |

---

## 10. Saqlanadigan inglizcha atamalar — toʻliq roʻyxat

Quyidagilar **hech qachon tarjima qilinmaydi** (oʻzbekcha matn ichida ham inglizcha yoziladi):

`Harness`, `agent`, `prompt`, `repository`, `repo`, `pull request`, `PR`, `commit`, `endpoint`, `pipeline`, `runtime`, `context window`, `lint`, `test`, `type check`, `benchmark`, `feature list`, `init`, `tech stack`, `framework`, `Markdown`, `JSON`, `YAML`, `JSONL`, `API`, `IPC`, `Electron`, `React`, `TypeScript`, `Codex`, `Claude Code`, `OpenAI`, `Anthropic`, `LLM`, `SDK`, `CLI`, `IDE`, `IDE-extension`, `MCP`, `webhook`, `mock`, `stub`, `branch`, `merge`, `rebase`, `diff`, `staging`, `production`, `deploy`, `build`, `dev`, `prod`.

**Diqqat — saqlanmaydigan, tarjima qilinadigan atamalar:**
- `tool` → **vosita** (NOT preserved English)
- `template` → **andoza** (NOT shablon, NOT preserved English)
- `subsystem` → **quyi tizim** (defissiz)
- `framework` → **freymvork** (oʻzbek transliteratsiyasi, NOT preserved English)
- `isometric model control` → **izometrik model boshqaruvi** (birinchi marta qavsda tushuntirish: "modelni oʻzgarmas saqlab, harness komponentlarini birma-bir olib tashlab tekshirish usuli")
- `package manager` izoh: "X vs Y" → "X yoki Y" (NOT "X oʻrniga Y", NOT "X va Y orasida")

Suffikslar bilan: `harnessʼga`, `Codexʼni`, `OpenAIʼning`, `repoʼda`, `endpointʼlar` (lotin atamadan keyin `ʼ` belgisi qoʻyiladi).

---

## 11. Suffikslar va grammatik birikma

Inglizcha ot ortidan oʻzbekcha qoʻshimcha:
- Egalik kelishigi: `OpenAIʼning`, `Anthropicʼning` (NOT `OpenAIning`)
- Tushum: `Codexʼni`, `agentʼni`
- Joʻnalish: `harnessʼga`, `repoʼga`
- Oʻrin: `repoʼda`, `endpointʼda`
- Chiqish: `repoʼdan`, `kontekstʼdan`
- Koʻplik: `agentlar`, `endpointʼlar`, `harnessʼlar`

**Qoida:** Lotin asosli (oʻzbek bo'lmagan) ot va oʻzbek qoʻshimchasi orasida `ʼ` (U+02BC) qoʻyiladi.

Istisno: oddiy ko'plik `lar/lar` — `ʼ`siz ham koʻp uchraydi (`agentlar` toʻgʻri, `agentʼlar` ham toʻgʻri). Bir xillik uchun: koʻplikda `ʼ`siz, qolgan kelishiklarda `ʼ` bilan.

---

## 12. Yangi atama uchragan paytda

Tarjimon yangi atamaga duch kelganda:

1. Avval ushbu glossary'ni qidirib chiqing.
2. Mavjud bo'lmasa — quyidagi tartibda yondashing:
   - **Texnik atama** (dasturlash, AI, devops) → inglizcha saqlang.
   - **Umumiy soʻz** → tabiiy oʻzbek tarjimasini bering.
   - **Idioma/metafora** → mazmunan, kalkasiz.
3. Yangi qaror — bu hujjatga qoʻshing (Pull Request orqali).
4. Toʻgʻri ma'noni LQA agent yordamida tasdiqlang.

---

*Versiya: 0.1 — bunday tarjima boshlanishida tayyorlangan. Har bir maʼruza/loyiha tarjimasidan keyin kengaytiriladi.*
