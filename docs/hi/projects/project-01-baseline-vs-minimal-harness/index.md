[English Version →](../../../en/projects/project-01-baseline-vs-minimal-harness/)

> संबंधित लेक्चर्स: [लेक्चर 01. काबिल मॉडल्स भी क्यों फेल होते हैं](./../../lectures/lecture-01-why-capable-agents-still-fail/index.md) · [लेक्चर 02. हार्नेस असल में क्या होता है](./../../lectures/lecture-02-what-a-harness-actually-is/index.md)
> टेम्पलेट फाइल्स: [templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/hi/resources/templates/)

# प्रोजेक्ट 01. केवल प्रॉम्प्ट बनाम नियम-पहले: हार्नेस से कितना फर्क पड़ता है?

## आपको क्या करना है (What You Do)

एक न्यूनतम Electron नॉलेज-बेस ऐप का ढाँचा तैयार करें — बाईं तरफ डॉक्यूमेंट लिस्ट वाली एक विंडो, दाईं तरफ एक Q&A पैनल, और एक लोकल डेटा डायरेक्टरी। टास्क खुद में बहुत जटिल नहीं है। जटिल यह है कि आप एजेंट से इसे कैसे पूरा करवाते हैं।

आप इसे दो बार चलाएँगे। पहली बार: केवल एक अस्पष्ट प्रॉम्प्ट, बिना किसी तैयारी के। दूसरी बार: रिपो में पहले से रखी गई न्यूनतम हार्नेस फाइल्स (`AGENTS.md`, `init.sh`, `feature_list.json`) के साथ। फिर दोनों के परिणामों की तुलना करें।

## रिपॉजिटरी में प्रोजेक्ट का उपयोग करें (Use the Checked-In Project)

रिपॉजिटरी पाथ: [`projects/project-01/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-01)

| डायरेक्टरी | इसमें क्या शामिल है | इसका इस्तेमाल कैसे करें |
|------|------|------|
| [`starter/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-01/starter) | कमज़ोर हार्नेस रन। इसमें टास्क विवरण के रूप में केवल [`task-prompt.md`](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-01/starter/task-prompt.md) है, कोई `AGENTS.md` या `feature_list.json` नहीं है। | अपने कोडिंग एजेंट को केवल प्रॉम्प्ट दें और मापें कि बिना अतिरिक्त संरचना के वह कितना काम पूरा करता है। |
| [`solution/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-01/solution) | स्पष्ट हार्नेस आर्टिफैक्ट्स के साथ वही प्रोजेक्ट: `AGENTS.md`, `CLAUDE.md`, `init.sh`, `feature_list.json`, `claude-progress.md`, और `docs/`। | तुलना करें कि नियमों और सत्यापन साक्ष्यों के माध्यम से वही कार्य कितना ठोस और विश्वसनीय बन जाता है। |

चार ठोस फीचर्स हैं: विंडो लॉन्च, डॉक्यूमेंट लिस्ट, सवाल पैनल, और लोकल डेटा डायरेक्टरी क्रिएशन।

## आवश्यक टूल्स (Tools)

- Claude Code या Codex (कोई एक चुनें, दोनों रन के लिए वही रखें)
- दो अलग-अलग वर्किंग डायरेक्टरीज़
- Node.js + Electron (प्रोजेक्ट स्टैक)
- एक टाइमर (प्रत्येक रन की अवधि रिकॉर्ड करने के लिए)

## हार्नेस मैकेनिज्म (Harness Mechanism)

न्यूनतम हार्नेस: `AGENTS.md` + `init.sh` + `feature_list.json` + `CLAUDE.md` + `claude-progress.md` + `docs/`

## रन प्रोटोकॉल (Run Protocol)

### तैयारी (Preparation)
1. दो अलग-अलग वर्किंग डायरेक्टरीज़ तैयार करें, जैसे `p01-baseline/` और `p01-improved/`।
2. दोनों रन्स को अलग करने के लिए गिट ब्रांचेस का उपयोग न करें। कोडिंग एजेंट के पास पूरा फाइलसिस्टम एक्सेस होता है और वह दूसरी ब्रांचेस की फाइल्स देख सकता है।
3. दोनों रन्स के लिए एक ही टास्क प्रॉम्प्ट रखें: *"Build an Electron app that can show documents and answer questions."*

### पहला रन (कमज़ोर हार्नेस)
1. एजेंट को केवल टास्क प्रॉम्प्ट के साथ शुरू करें।
2. समय और रिट्राइज़ (retries) नोट करें। देखें कि क्या एजेंट ने बिना पूरा काम किए ही कह दिया कि "काम हो गया।"

### दूसरा रन (स्पष्ट हार्नेस)
1. एजेंट को हार्नेस फाइल्स (`AGENTS.md`, `feature_list.json` आदि) पढ़ने का निर्देश दें।
2. देखें कि कैसे `feature_list.json` और ऑटोमैटिक वेरिफिकेशन से एजेंट व्यवस्थित तरीके से काम पूरा करता है।
