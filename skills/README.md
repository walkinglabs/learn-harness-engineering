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

This directory contains reusable AI agent skills for the Learn Harness Engineering project. Each skill is a self-contained prompt template that can be loaded by AI coding agents (Claude Code, Codex, Cursor, Windsurf, etc.) to perform specialized tasks.

## Available Skills

### harness-creator

Production harness engineering skill for AI coding agents. Helps create, assess, and improve agent harness files (AGENTS.md, feature lists, verification workflows, session continuity mechanisms).

- **7 reference patterns**: Memory Persistence, Skill Runtime, Context Engineering, Tool Registry, Multi-Agent Coordination, Lifecycle & Bootstrap, Gotchas
- **Templates**: AGENTS.md/CLAUDE.md, feature-list.json, init.sh, progress.md, session-handoff.md
- **Scripts**: scaffold, validate, render HTML assessment, run structural benchmark
- **10 built-in eval test cases**

See [harness-creator/README.md](harness-creator/README.md) for full documentation.

## How harness-creator Was Built

The `harness-creator` skill was developed using the **skill-creator** methodology — Anthropic's official meta-skill for creating, testing, and iterating on agent skills. The skill-creator provides a structured workflow (draft → test → evaluate → iterate) with built-in eval runners, graders, and a benchmark viewer.

- **skill-creator source**: [anthropics/skills — skill-creator](https://github.com/anthropics/skills/tree/main/skills/skill-creator)
- **Anthropic Claude Code skills docs**: [anthropics/claude-code — plugin-dev/skills](https://github.com/anthropics/claude-code/tree/main/plugins/plugin-dev/skills)

## Directory Structure

```
skills/
├── README.md                    # This file
├── README-CN.md                 # Chinese version
├── README-ZH-TW.md              # Traditional Chinese version
├── README-JA.md                 # Japanese version
├── README-ES.md                 # Spanish version
├── README-FR.md                 # French version
├── README-AR.md                 # Arabic version
├── README-VI.md                 # Vietnamese version
├── README-DE.md                 # German version
├── README-TR.md                 # Turkish version
├── README-PT-BR.md              # Portuguese (Brazil) version
├── README-UK.md                 # Ukrainian version
├── README-HI.md                 # Hindi version
└── harness-creator/             # Harness engineering skill
    ├── SKILL.md                 # Main skill definition
    ├── SKILL.md.en              # English-only version
    ├── README.md                # Detailed documentation
    ├── metadata.json            # Skill metadata & triggers
    ├── agents/                  # Skill UI metadata
    ├── scripts/                 # Scaffold, validate, benchmark helpers
    ├── evals/                   # Test cases
    ├── templates/               # Scaffold templates
    └── references/              # Deep-dive pattern docs
```

## How Skills Work

Each skill follows a standard structure:

1. **SKILL.md** — The entry point. Contains YAML frontmatter (name, description for triggering) and Markdown instructions for the agent.
2. **references/** — Additional docs loaded into context as needed.
3. **templates/** — Starting templates that the skill can generate for users.

Skills use progressive disclosure — the agent first sees only the name + description, then loads the full SKILL.md body when triggered, and reads bundled resources only when needed.

## Security Audit

All files in this directory have been audited for security:

- No backdoors, hidden URLs, or encoded payloads
- No data exfiltration or hardcoded credentials
- No command injection vulnerabilities
- Scripts use only Node.js built-in modules
- Generated `init.sh` runs detected project verification commands

## License

MIT
