[English Version →](../../../en/projects/project-04-incremental-indexing/)

> संबंधित लेक्चर्स: [लेक्चर 07. एजेंट्स काम अधूरा क्यों छोड़ते हैं](./../../lectures/lecture-07-why-agents-overreach-and-under-finish/index.md) · [लेक्चर 08. फ़ीचर लिस्ट हार्नेस का मूल आधार क्यों है](./../../lectures/lecture-08-why-feature-lists-are-harness-primitives/index.md)
> टेम्पलेट फाइल्स: [templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/hi/resources/templates/)

# प्रोजेक्ट 04. एजेंट के व्यवहार को सुधारने के लिए रनटाइम फीडबैक का उपयोग करें

## आपको क्या करना है (What You Do)

इंक्रीमेंटल इंडेक्सिंग और सर्च हाइलाइटिंग लागू करें। एजेंट को रनटाइम फीडबैक टूल्स और कड़े स्कोप नियंत्रण (WIP=1) के तहत रखें ताकि वह अनपेक्षित फाइल्स को छुए बिना केवल अपने निर्दिष्ट कार्य को पूरा करे।

## आवश्यक टूल्स (Tools)

- Claude Code या Codex
- Git + Vitest
- Node.js + Electron

## हार्नेस मैकेनिज्म (Harness Mechanism)

रनटाइम फीडबैक लूप + स्कोप सर्फेस कंस्ट्रेंट्स + पास-गेट नीतियाँ

## रिपॉजिटरी में प्रोजेक्ट का उपयोग करें (Use the Checked-In Project)

रिपॉजिटरी पाथ: [`projects/project-04/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-04)

| डायरेक्टरी | इसमें क्या शामिल है | क्या तुलना करनी है |
|------|------|------|
| [`starter/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-04/starter) | रनटाइम फीडबैक के बिना प्रोजेक्ट। | एजेंट स्कोप से बाहर जाकर अनपेक्षित कोड में बदलाव करता है (Overreach)। |
| [`solution/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-04/solution) | रनटाइम टेस्ट और स्कोप ट्रैकर के साथ समाधान। | एजेंट केवल लक्षित फाइल्स को बदलता है और टेस्ट फेल होने पर तुरंत खुद को सुधारता है। |
