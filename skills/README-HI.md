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

यह डायरेक्टरी Learn Harness Engineering प्रोजेक्ट के लिए पुन: उपयोग किए जा सकने वाले AI agent skills प्रदान करती है। प्रत्येक skill एक self-contained prompt template है जिसे AI coding agents (Claude Code, Codex, Cursor, Windsurf, आदि) विशेष कार्यों को करने के लिए load कर सकते हैं।

## उपलब्ध Skills

### harness-creator

AI coding agents के लिए production harness engineering skill। agent harness files (AGENTS.md, feature lists, verification workflows, session continuity mechanisms) बनाने, मूल्यांकन करने और सुधारने में मदद करता है।

- **7 reference patterns**: Memory Persistence, Skill Runtime, Context Engineering, Tool Registry, Multi-Agent Coordination, Lifecycle & Bootstrap, Gotchas
- **Templates**: AGENTS.md/CLAUDE.md, feature-list.json, init.sh, progress.md, session-handoff.md
- **Scripts**: scaffold, validate, render HTML assessment, run structural benchmark
- **10 built-in eval test cases**

पूर्ण दस्तावेज़ के लिए [harness-creator/README.md](harness-creator/README.md) देखें।

## harness-creator कैसे बनाया गया

`harness-creator` skill को **skill-creator** methodology का उपयोग करके विकसित किया गया था — agent skills बनाने, परीक्षण करने और iterate करने के लिए Anthropic का आधिकारिक meta-skill। skill-creator एक structured workflow (draft → test → evaluate → iterate) प्रदान करता है जिसमें built-in eval runners, graders, और एक benchmark viewer शामिल हैं।

- **skill-creator source**: [anthropics/skills — skill-creator](https://github.com/anthropics/skills/tree/main/skills/skill-creator)
- **Anthropic Claude Code skills docs**: [anthropics/claude-code — plugin-dev/skills](https://github.com/anthropics/claude-code/tree/main/plugins/plugin-dev/skills)

## डायरेक्टरी संरचना

```
skills/
├── README.md                    # यह फ़ाइल
├── README-CN.md                 # चीनी संस्करण
├── README-ZH-TW.md              # पारंपरिक चीनी संस्करण
├── README-JA.md                 # जापानी संस्करण
├── README-ES.md                 # स्पेनिश संस्करण
├── README-FR.md                 # फ्रेंच संस्करण
├── README-AR.md                 # अरबी संस्करण
├── README-VI.md                 # वियतनामी संस्करण
├── README-DE.md                 # जर्मन संस्करण
├── README-TR.md                 # तुर्की संस्करण
├── README-PT-BR.md              # पुर्तगाली (ब्राज़ील) संस्करण
├── README-UK.md                 # यूक्रेनी संस्करण
├── README-HI.md                 # हिंदी संस्करण
├── README-UR.md                 # اردو نسخہ
└── harness-creator/             # Harness engineering skill
    ├── SKILL.md                 # मुख्य skill definition
    ├── SKILL.md.en              # केवल अंग्रेज़ी संस्करण
    ├── README.md                # विस्तृत दस्तावेज़
    ├── metadata.json            # Skill metadata & triggers
    ├── agents/                  # Skill UI metadata
    ├── scripts/                 # Scaffold, validate, benchmark helpers
    ├── evals/                   # Test cases
    ├── templates/               # Scaffold templates
    └── references/              # विस्तृत pattern docs
```

## Skills कैसे काम करती हैं

प्रत्येक skill एक standard structure का पालन करती है:

1. **SKILL.md** — Entry point। YAML frontmatter (name, description for triggering) और agent के लिए Markdown instructions शामिल हैं।
2. **references/** — आवश्यकता के अनुसार context में load की जाने वाली अतिरिक्त दस्तावेज़।
3. **templates/** — वे starting templates जो skill users के लिए generate कर सकती है।

Skills progressive disclosure का उपयोग करती हैं — agent को पहले केवल name + description दिखाई देता है, फिर triggered होने पर पूरा SKILL.md body load होता है, और bundled resources केवल आवश्यकता पड़ने पर ही पढ़ी जाती हैं।

## सुरक्षा ऑडिट

इस डायरेक्टरी की सभी फ़ाइलों का सुरक्षा ऑडिट किया गया है:

- कोई backdoors, hidden URLs, या encoded payloads नहीं
- कोई data exfiltration या hardcoded credentials नहीं
- कोई command injection vulnerabilities नहीं
- Scripts केवल Node.js built-in modules का उपयोग करती हैं
- जनरेट किया गया `init.sh` detected project verification commands को चलाता है

## लाइसेंस

MIT
