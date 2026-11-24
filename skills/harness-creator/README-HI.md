# harness-creator

AI कोडिंग एजेंट्स के लिए एक मजबूत हार्नेस बनाने और उसका ऑडिट करने के लिए एक कॉम्पैक्ट और प्रोडक्शन-रेडी स्किल।

यह किसी भी रिपॉजिटरी में एजेंट्स को वो 5 बुनियादी चीज़ें देने में मदद करती है जिनकी उन्हें ज़रूरत होती है: **निर्देश (Instructions), स्थिति (State), सत्यापन (Verification), दायरा सीमा (Scope Boundaries), और सत्र जीवनचक्र (Lifecycle Handoff)**।

## इंस्टॉलेशन (Install)

```bash
npx skills add walkinglabs/learn-harness-engineering --skill harness-creator
```

या फिर `skills/harness-creator/` डायरेक्टरी को अपने प्रोजेक्ट के स्किल्स पाथ में कॉपी कर लें।

## इस्तेमाल कैसे करें (Use)

```bash
# हार्नेस फाइल्स बनाएँ
node skills/harness-creator/scripts/create-harness.mjs --target /path/to/project

# हार्नेस का ऑडिट और स्कोरिंग करें
node skills/harness-creator/scripts/validate-harness.mjs --target /path/to/project

# बेंचमार्क रिपोर्ट जनरेट करें
node skills/harness-creator/scripts/run-benchmark.mjs --target /path/to/project --html /path/to/report.html
```

ये स्क्रिप्ट्स केवल Node.js के बिल्ट-इन मॉड्यूल्स का उपयोग करती हैं, इसलिए इन्हें किसी भी बाहरी डिपेंडेंसी के बिना किसी भी प्रोजेक्ट में आसानी से चलाया जा सकता है।

## क्या जनरेट होता है? (What It Creates)

- `AGENTS.md` या `CLAUDE.md` — एजेंट के लिए प्रोजेक्ट नियम और कमांड्स
- `feature_list.json` — स्ट्रक्चर्ड टास्क्स और पास-क्राइटेरिया
- `progress.md` — सेशन प्रोग्रेस और एक्टिव टास्क ट्रैकिंग
- `init.sh` — एजेंट के लिए ऑटोमैटिक एनवायरनमेंट सेटअप
- `session-handoff.md` — सेशन्स के बीच क्लीन हैंडऑफ टेम्पलेट

`create-harness.mjs` सामान्य प्रोजेक्ट स्टैक्स और पैकेज मैनेजर्स (Node/npm/pnpm/yarn/bun, Python, Go, Rust, Maven, Gradle, और .NET) को अपने-आप पहचान लेता है और बेसिक वेरिफिकेशन कमांड्स सेट कर देता है।

## यह क्या जाँचता है? (What It Checks)

`validate-harness.mjs` हार्नेस के 5 मुख्य सबसिस्टम्स का मूल्यांकन करता है:

1. **Instructions (निर्देश)**: क्या नियम स्पष्ट, छोटे और मॉड्यूलर हैं?
2. **State (स्थिति)**: क्या प्रोग्रेस और एक्टिव टास्क ट्रैक हो रहे हैं?
3. **Verification (सत्यापन)**: क्या ऑटोमैटिक टेस्ट और टाइप-चेक कमांड्स मौजूद हैं?
4. **Scope (दायरा)**: क्या WIP=1 और स्कोप सीमाएँ तय हैं?
5. **Lifecycle (जीवनचक्र)**: क्या इनिशियलाइज़ेशन और क्लीन हैंडऑफ चेकलिस्ट है?

यह स्कोर स्ट्रक्चरल होता है — यह बताता है कि हार्नेस का ढाँचा कितना सुसंगत है; यह वास्तविक एजेंट रनटाइम टेस्टिंग का विकल्प नहीं है।

## वर्तमान स्थिति (Status)

- [x] मिनिमल हार्नेस स्कैफोल्डिंग
- [x] पाँच-सबसिस्टम वैलिडेशन और स्कोरिंग
- [x] HTML असेसमेंट रिपोर्ट
- [x] स्ट्रक्चरल बेंचमार्क रिपोर्ट
- [x] 10 इवैल्यूएशन टेस्ट केसेस
- [x] सामान्य टेक स्टैक्स के लिए जेनेरिक वेरिफिकेशन डिटेक्शन
- [ ] वैकल्पिक रियल बिफोर/आफ्टर एजेंट सेशन रीप्ले

## फ़ाइल संरचना (Files)

```text
harness-creator/
├── SKILL.md
├── README.md
├── README-HI.md
├── references/
│   ├── context-engineering.md
│   ├── gotchas.md
│   ├── lifecycle-and-bootstrap.md
│   ├── memory-persistence.md
│   ├── multi-agent-coordination.md
│   ├── skill-runtime.md
│   └── tool-registry.md
├── scripts/
│   ├── create-harness.mjs
│   ├── run-benchmark.mjs
│   └── validate-harness.mjs
└── templates/
    ├── AGENTS.md
    ├── feature_list.json
    ├── init.sh
    ├── progress.md
    └── session-handoff.md
```
