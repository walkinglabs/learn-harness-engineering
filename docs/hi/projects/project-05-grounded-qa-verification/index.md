[English Version →](../../../en/projects/project-05-grounded-qa-verification/)

> संबंधित लेक्चर्स: [लेक्चर 09. एजेंट्स समय से पहले जीत का ऐलान क्यों करते हैं](./../../lectures/lecture-09-why-agents-declare-victory-too-early/index.md) · [लेक्चर 10. एंड-टू-एंड टेस्टिंग से नतीजे कैसे बदलते हैं](./../../lectures/lecture-10-why-end-to-end-testing-changes-results/index.md)
> टेम्पलेट फाइल्स: [templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/hi/resources/templates/)

# प्रोजेक्ट 05. एजेंट से उसका खुद का काम सत्यापित करवाएँ (Self-Verification)

## आपको क्या करना है (What You Do)

ग्राउंडेड Q&A सत्यापन लागू करें। एजेंट को यूनिट टेस्ट्स के साथ-साथ एक स्वतंत्र इवैल्यूएटर/वेरिफायर लेयर के माध्यम से पास होना होगा, ताकि समय से पहले "काम पूरा हो गया" का झूठा दावा रोका जा सके।

## आवश्यक टूल्स (Tools)

- Claude Code या Codex
- Vitest + E2E टेस्ट रनर
- Node.js + Electron

## हार्नेस मैकेनिज्म (Harness Mechanism)

तीन-परत वाली टर्मिनेशन जाँच (Three-Layer Termination Check) + इवैल्यूएटर रूब्रिक + मेकर-चेकर अलगाव

## रिपॉजिटरी में प्रोजेक्ट का उपयोग करें (Use the Checked-In Project)

रिपॉजिटरी पाथ: [`projects/project-05/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-05)

| डायरेक्टरी | इसमें क्या शामिल है | क्या तुलना करनी है |
|------|------|------|
| [`starter/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-05/starter) | केवल बुनियादी यूनिट टेस्ट्स। | एजेंट आंशिक काम के बाद ही जीत का ऐलान कर देता है। |
| [`solution/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-05/solution) | स्वतंत्र इवैल्यूएटर और एंड-टू-एंड पाइपलाइन। | एजेंट तब तक नहीं रुकता जब तक पूरा फ्लो पास न हो जाए। |
