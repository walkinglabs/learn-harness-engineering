<p align="center">
  <a href="README.md"><img alt="English" src="https://img.shields.io/badge/English-d9d9d9"></a>
  <a href="README-CN.md"><img alt="简体中文" src="https://img.shields.io/badge/简体中文-d9d9d9"></a>
  <a href="README-ZH-TW.md"><img alt="繁體中文" src="https://img.shields.io/badge/繁體中文-d9d9d9"></a>
  <a href="README-JA.md"><img alt="日本語" src="https://img.shields.io/badge/日本語-d9d9d9"></a>
  <a href="README-ES.md"><img alt="Español" src="https://img.shields.io/badge/Español-d9d9d9"></a>
  <a href="README-FR.md"><img alt="Français" src="https://img.shields.io/badge/Français-d9d9d9"></a>
  <a href="README-KO.md"><img alt="한국어" src="https://img.shields.io/badge/한국어-d9d9d9"></a>
  <a href="README-AR.md"><img alt="العربية" src="https://img.shields.io/badge/العربية-d9d9d9"></a>
  <a href="README-VI.md"><img alt="Tiếng_Việt" src="https://img.shields.io/badge/Tiếng_Việt-d9d9d9"></a>
  <a href="README-DE.md"><img alt="Deutsch" src="https://img.shields.io/badge/Deutsch-d9d9d9"></a>
  <a href="README-TR.md"><img alt="Türkçe" src="https://img.shields.io/badge/Türkçe-d9d9d9"></a>
  <a href="README-PT-BR.md"><img alt="Português (Brasil)" src="https://img.shields.io/badge/Português (Brasil)-d9d9d9"></a>
  <a href="README-UK.md"><img alt="Українська" src="https://img.shields.io/badge/Українська-d9d9d9"></a>
  <a href="README-HI.md"><img alt="हिन्दी" src="https://img.shields.io/badge/Hindi-d9d9d9"></a>
  <a href="README-UR.md"><img alt="اردو" src="https://img.shields.io/badge/اردو-d9d9d9"></a>
</p>

# Skills

یہ ڈائریکٹری Learn Harness Engineering پراجیکٹ کے لیے دوبارہ استعمال ہونے والی AI agent skills پر مشتمل ہے۔ ہر skill ایک self-contained prompt template ہے جسے AI coding agents (Claude Code, Codex, Cursor, Windsurf وغیرہ) مخصوص کاموں کو انجام دینے کے لیے load کر سکتے ہیں۔

## دستیاب Skills

### harness-creator

AI coding agents کے لیے production harness engineering skill۔ agent harness files (AGENTS.md, feature lists, verification workflows, session continuity mechanisms) بنانے، جانچنے اور بہتر بنانے میں مدد کرتا ہے۔

- **7 reference patterns**: Memory Persistence, Skill Runtime, Context Engineering, Tool Registry, Multi-Agent Coordination, Lifecycle & Bootstrap, Gotchas
- **Templates**: AGENTS.md/CLAUDE.md, feature-list.json, init.sh, progress.md, session-handoff.md
- **Scripts**: scaffold, validate, render HTML assessment, run structural benchmark
- **10 built-in eval test cases**

مکمل دستاویزات کے لیے [harness-creator/README.md](harness-creator/README.md) دیکھیں۔

## harness-creator کیسے بنایا گیا

`harness-creator` skill کو **skill-creator** methodology کے ذریعے تیار کیا گیا تھا — agent skills بنانے، جانچنے اور ان پر iterate کرنے کے لیے Anthropic کا سرکاری meta-skill۔ skill-creator ایک منظم workflow (draft → test → evaluate → iterate) فراہم کرتا ہے جس میں built-in eval runners، graders اور ایک benchmark viewer شامل ہیں۔

- **skill-creator source**: [anthropics/skills — skill-creator](https://github.com/anthropics/skills/tree/main/skills/skill-creator)
- **Anthropic Claude Code skills docs**: [anthropics/claude-code — plugin-dev/skills](https://github.com/anthropics/claude-code/tree/main/plugins/plugin-dev/skills)

## ڈائریکٹری کا ڈھانچہ

```
skills/
├── README.md                    # یہ فائل
├── README-CN.md                 # چینی نسخہ
├── README-ZH-TW.md              # روایتی چینی نسخہ
├── README-JA.md                 # جاپانی نسخہ
├── README-ES.md                 # ہسپانوی نسخہ
├── README-FR.md                 # فرانسیسی نسخہ
├── README-AR.md                 # عربی نسخہ
├── README-VI.md                 # ویتنامی نسخہ
├── README-DE.md                 # جرمن نسخہ
├── README-TR.md                 # ترکی نسخہ
├── README-PT-BR.md              # پرتگیزی (برازیل) نسخہ
├── README-UK.md                 # یوکرینی نسخہ
├── README-HI.md                 # ہندی نسخہ
├── README-UR.md                 # اردو نسخہ
└── harness-creator/             # Harness engineering skill
    ├── SKILL.md                 # مرکزی skill definition
    ├── SKILL.md.en              # صرف انگریزی نسخہ
    ├── README.md                # تفصیلی دستاویزات
    ├── metadata.json            # Skill metadata & triggers
    ├── agents/                  # Skill UI metadata
    ├── scripts/                 # Scaffold, validate, benchmark helpers
    ├── evals/                   # Test cases
    ├── templates/               # Scaffold templates
    └── references/              # تفصیلی pattern docs
```

## Skills کیسے کام کرتی ہیں

ہر skill ایک معیاری ڈھانچے کی پیروی کرتی ہے:

1. **SKILL.md** — Entry point۔ YAML frontmatter (name، triggering کے لیے description) اور agent کے لیے Markdown instructions پر مشتمل ہے۔
2. **references/** — ضرورت کے مطابق context میں load ہونے والی اضافی دستاویزات۔
3. **templates/** — وہ starting templates جو skill صارفین کے لیے generate کر سکتی ہے۔

Skills progressive disclosure استعمال کرتی ہیں — agent کو پہلے صرف name + description نظر آتا ہے، پھر trigger ہونے پر مکمل SKILL.md body load ہوتا ہے اور bundled resources صرف ضرورت پڑنے پر پڑھی جاتی ہیں۔

## سیکیورٹی آڈٹ

اس ڈائریکٹری میں موجود تمام فائلوں کا سیکیورٹی آڈٹ کیا جا چکا ہے:

- کوئی backdoors، hidden URLs یا encoded payloads نہیں
- کوئی data exfiltration یا hardcoded credentials نہیں
- کوئی command injection vulnerabilities نہیں
- Scripts صرف Node.js built-in modules استعمال کرتی ہیں
- Generated `init.sh` detected project verification commands چلاتا ہے

## لائسنس

MIT