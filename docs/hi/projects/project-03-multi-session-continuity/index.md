[English Version →](../../../en/projects/project-03-multi-session-continuity/)

> संबंधित लेक्चर्स: [लेक्चर 05. लंबे टास्क्स में कॉन्टेक्स्ट क्यों खो जाता है](./../../lectures/lecture-05-why-long-running-tasks-lose-continuity/index.md) · [लेक्चर 06. इनिशियलाइज़ेशन का अलग फेज़ क्यों ज़रूरी है](./../../lectures/lecture-06-why-initialization-needs-its-own-phase/index.md)
> टेम्पलेट फाइल्स: [templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/hi/resources/templates/)

# प्रोजेक्ट 03. सेशन रीस्टार्ट के बाद भी एजेंट का काम जारी रखें

## आपको क्या करना है (What You Do)

मल्टी-सेशन निरंतरता (continuity) का परीक्षण करें: सिमेंटिक सर्च और फ़िल्टरिंग लागू करें, जिसमें एजेंट को जानबूझकर सत्र के बीच में रीस्टार्ट किया जाता है। एजेंट को यह साबित करना होगा कि वह पिछले सत्र के छोड़े गए काम को पहचान सकता है और बिना पिछले काम को तोड़े आगे बढ़ सकता है।

## आवश्यक टूल्स (Tools)

- Claude Code या Codex
- Git
- Node.js + Electron

## हार्नेस मैकेनिज्म (Harness Mechanism)

सेशन स्टेट ट्रैकिंग + इनिशियलाइज़ेशन चेकलिस्ट + हैंडऑफ प्रोटोकॉल (`init.sh`, `claude-progress.md`, `session-handoff.md`)

## रिपॉजिटरी में प्रोजेक्ट का उपयोग करें (Use the Checked-In Project)

रिपॉजिटरी पाथ: [`projects/project-03/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-03)

| डायरेक्टरी | इसमें क्या शामिल है | क्या तुलना करनी है |
|------|------|------|
| [`starter/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-03/starter) | बिना स्टेट ट्रैकिंग के अधूरा प्रोजेक्ट। | सेशन रीस्टार्ट होने पर एजेंट कैसे भ्रमित होता है और डुप्लिकेट कोड लिखता है। |
| [`solution/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-03/solution) | पूर्ण स्टेट ट्रैकिंग और प्रोग्रेस फाइल्स के साथ समाधान। | एजेंट रीस्टार्ट के बाद सेकंडों में सही फ़ाइल और अगले अनफिनिश्ड टास्क को पकड़ लेता है। |
