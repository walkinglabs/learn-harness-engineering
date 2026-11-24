[English Version →](../../../en/projects/project-06-runtime-observability-and-debugging/)

> संबंधित लेक्चर्स: [लेक्चर 11. ऑब्ज़र्वेबिलिटी हार्नेस का हिस्सा क्यों होनी चाहिए](./../../lectures/lecture-11-why-observability-belongs-inside-the-harness/index.md) · [लेक्चर 12. हर सेशन के बाद क्लीन स्टेट क्यों छोड़ना ज़रूरी है](./../../lectures/lecture-12-why-every-session-must-leave-a-clean-state/index.md)
> टेम्पलेट फाइल्स: [templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/hi/resources/templates/)

# प्रोजेक्ट 06. एक संपूर्ण एजेंट हार्नेस बनाएँ (कैपस्टोन)

## आपको क्या करना है (What You Do)

अब तक सीखे गए सभी 5 सबसिस्टम्स को एक साथ जोड़ें: रनटाइम लॉगिंग, स्प्रिंट कॉन्ट्रैक्ट्स, और 5-डाइमेंशन सेशन एग्ज़िट चेकलिस्ट लागू करके पूरे नॉलेज-बेस ऐप को प्रोडक्शन रेडी बनाएँ।

## आवश्यक टूल्स (Tools)

- Claude Code या Codex
- फुल टेस्ट स्टैक (Vitest, TypeCheck, Lint)
- Node.js + Electron

## हार्नेस मैकेनिज्म (Harness Mechanism)

पूर्ण हार्नेस कैपस्टोन: Instructions + State + Verification + Scope + Lifecycle Observability

## रिपॉजिटरी में प्रोजेक्ट का उपयोग करें (Use the Checked-In Project)

रिपॉजिटरी पाथ: [`projects/project-06/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-06)

| डायरेक्टरी | इसमें क्या शामिल है | क्या तुलना करनी है |
|------|------|------|
| [`starter/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-06/starter) | अधूरा कैपस्टोन प्रोजेक्ट। | बिना पूर्ण हार्नेस के कोडबेस में कचरा और एरर्स बढ़ते हैं। |
| [`solution/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-06/solution) | संपूर्ण प्रोडक्शन-ग्रेड हार्नेस। | शून्य एरर, स्वच्छ स्टेट, और पूर्णतः विश्वसनीय निष्पादन। |
