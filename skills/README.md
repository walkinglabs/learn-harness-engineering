# Skills

[中文版](./README-CN.md) · [한국어](./README-KO.md)

This directory contains reusable AI agent skills for the Learn Harness Engineering project. Each skill is a self-contained prompt template that can be loaded by AI coding agents (Claude Code, Codex, Cursor, Windsurf, etc.) to perform specialized tasks.

## Available Skills

### harness-creator

Production harness engineering skill for AI coding agents. Helps create, assess, and improve agent harness files (AGENTS.md, feature lists, verification workflows, session continuity mechanisms).

- **5 reference patterns**: Memory Persistence, Context Engineering, Tool Registry, Multi-Agent Coordination, Lifecycle & Bootstrap
- **Templates**: AGENTS.md, feature-list.json, init.sh, progress.md
- **5 built-in eval test cases**
- **Bilingual**: English + 中文

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
└── harness-creator/             # Harness engineering skill
    ├── SKILL.md                 # Main skill definition (bilingual)
    ├── SKILL.md.en              # English-only version
    ├── README.md                # Detailed documentation
    ├── metadata.json            # Skill metadata & triggers
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
- `init.sh` runs only standard npm lifecycle commands

## License

MIT
