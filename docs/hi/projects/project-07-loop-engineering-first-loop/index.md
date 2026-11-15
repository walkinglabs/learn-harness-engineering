[English Version →](../../../en/projects/project-07-loop-engineering-first-loop/)

> संबंधित लेक्चर्स: [लेक्चर 13. मैन्युअल प्रॉम्प्टिंग से ऑटोनॉमस लूप्स तक](./../../lectures/lecture-13-loop-engineering/index.md)
> टेम्पलेट फाइल्स: [templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/hi/resources/templates/)

# प्रोजेक्ट 07. अपना पहला ऑटोमेटेड लूप बनाएँ (Loop Engineering)

## आपको क्या करना है (What You Do)

मैन्युअल प्रॉम्प्टिंग से ऑटोनॉमस लूप्स की ओर बढ़ें। तीन प्रगतिशील प्रयोगों के माध्यम से एक स्वचालित निष्पादन लूप का निर्माण करें:
1. **Goal Loop**: एक स्पष्ट लक्ष्य और रुकने की शर्त (Stopping Condition) के साथ लूप।
2. **Timer Loop**: आवधिक अंतराल पर चलने वाला ऑब्ज़र्वेशन लूप।
3. **Maker-Checker Loop**: कोड लिखने वाले और कोड जाँचने वाले एजेंट को अलग-अलग रखकर लूप चलाना।

## आवश्यक टूल्स (Tools)

- Claude Code या Codex
- Bash / Node.js रनर
- Git

## हार्नेस मैकेनिज्म (Harness Mechanism)

ऑटोनॉमस लूप प्रिमिटिव्स: Automations + Worktrees + Skills + Connectors + Sub-agents + External State

## मुख्य सीख (Key Takeaways)

- लूप को कोड में नहीं, स्पष्ट नियमों में बाँधें।
- मेकर को कभी अपना खुद का चेकर न बनने दें।
- लूप के बाहर हमेशा एक सख्त सर्किट ब्रेकर रखें।
