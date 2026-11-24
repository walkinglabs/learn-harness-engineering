[English Version →](../../../en/projects/project-08-graph-engineering-first-graph/)

> संबंधित लेक्चर्स: [लेक्चर 14. सिंगल लूप से ग्राफ इंजीनियरिंग तक](./../../lectures/lecture-14-graph-engineering/index.md)
> टेम्पलेट फाइल्स: [templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/hi/resources/templates/)

# प्रोजेक्ट 08. अपने वर्कफ़्लो को एक ग्राफ़ के रूप में बनाएँ (Graph Engineering)

## आपको क्या करना है (What You Do)

जब एक सिंगल लूप जटिल वर्कफ़्लो के लिए छोटा पड़ने लगे, तो अपने एजेंटिक सिस्टम को नोड्स (Nodes), एजेस (Edges), और शेयर्ड स्टेट (Shared State) वाले एक प्रत्यक्ष ग्राफ़ (Directed Graph) में बदलें।

## आवश्यक टूल्स (Tools)

- Python / LangGraph या कस्टम स्टेट मशीन
- Claude Code / Codex

## हार्नेस मैकेनिज्म (Harness Mechanism)

ग्राफ़ इंजीनियरिंग: Nodes (Agents/Tools) + Edges (Transitions) + State + Conditional Routing

## मुख्य सीख (Key Takeaways)

- ग्राफ़ जटिल निर्णयों को विज़ुअलाइज़ और नियंत्रित करने में मदद करता है।
- हर नोड का दायरा सीमित रखें और एजेस पर सख्त सत्यापन नियम लगाएँ।
