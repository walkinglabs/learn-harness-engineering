[English Version →](../../../en/projects/project-02-agent-readable-workspace/)

> संबंधित लेक्चर्स: [लेक्चर 03. रिपॉजिटरी को एकमात्र सच क्यों बनना होगा](./../../lectures/lecture-03-why-the-repository-must-become-the-system-of-record/index.md) · [लेक्चर 04. एक ही बड़ी निर्देश फ़ाइल क्यों फेल होती है](./../../lectures/lecture-04-why-one-giant-instruction-file-fails/index.md)
> टेम्पलेट फाइल्स: [templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/hi/resources/templates/)

# प्रोजेक्ट 02. प्रोजेक्ट को एजेंट-पठनीय बनाएँ और जहाँ छोड़ा था वहीं से शुरू करें

## आपको क्या करना है (What You Do)

रिपॉजिटरी में "पठनीयता" (readability) जोड़ें ताकि एक नया एजेंट कोडबेस के ढांचे को तुरंत समझ सके, वर्तमान प्रगति जान सके, और बिना किसी मौखिक संदर्भ के काम को आगे बढ़ा सके। विशेष रूप से: डॉक्यूमेंट इम्पोर्ट, डॉक्यूमेंट डिटेल व्यू, और लोकल पर्सिस्टेंस लागू करें, जिसे दो सेशन्स में पूरा किया जाना है।

आप इसे चेक-इन डायरेक्टरीज़ से दो बार चलाएँगे: पहली बार बिना `session-handoff.md` के, और दूसरी बार विस्तृत `ARCHITECTURE.md`, `PRODUCT.md`, और `session-handoff.md` के साथ।

## आवश्यक टूल्स (Tools)

- Claude Code या Codex
- Git
- Node.js + Electron

## हार्नेस मैकेनिज्म (Harness Mechanism)

एजेंट-पठनीय वर्कस्पेस + पर्सिस्टेंट स्टेट फाइल्स (`ARCHITECTURE.md`, `PRODUCT.md`, `session-handoff.md`)

## रिपॉजिटरी में प्रोजेक्ट का उपयोग करें (Use the Checked-In Project)

रिपॉजिटरी पाथ: [`projects/project-02/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02)

| डायरेक्टरी | इसमें क्या शामिल है | क्या तुलना करनी है |
|------|------|------|
| [`starter/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/starter) | प्रोजेक्ट 01 का कोड और अपूर्ण डॉक्यूमेंट इम्पोर्ट। दस्तावेज़ जानबूझकर पतले हैं और कोई `session-handoff.md` नहीं है। | दूसरा एजेंट सेशन कोड समझने में कितना समय गँवाता है। |
| [`solution/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/solution) | पूरा किया गया कोड, विस्तृत डॉक्स, `feature_list.json` और `session-handoff.md` के साथ। | क्या एक नया सेशन बिना किसी मौखिक संदर्भ के रिपो स्थिति से तुरंत काम फिर से शुरू कर सकता है। |
