# रिसोर्स लाइब्रेरी (Resource Library)

यह फोल्डर कोर्स की तकनीकों को सीधे कॉपी करने योग्य टेम्पलेट्स (copy-ready templates) और संक्षिप्त संदर्भों (compact references) में बदलता है, जिन्हें आप अपनी असली रिपॉजिटरी में सीधे इस्तेमाल कर सकते हैं।

## इसका इस्तेमाल कब करें? (When To Use It)

यहाँ से शुरुआत करें जब आप चाहते हैं कि Codex, Claude Code, Cursor या कोई अन्य कोडिंग एजेंट बार-बार एनवायरनमेंट सेटअप, प्रोग्रेस और स्कोप को दोबारा समझे बिना कई सेशन्स तक लगातार काम कर सके।

यह विशेष रूप से तब उपयोगी है जब:

- काम कई सेशन्स में फैला हो
- फीचर्स की संख्या ज़्यादा हो और काम अधूरा छूटने का डर हो
- एजेंट्स समय से पहले ही काम पूरा होने का ऐलान कर देते हों
- हर नए सेशन में एजेंट को फिर से शुरुआत से बातें समझानी पड़ती हों

## यहाँ से शुरू करें (Start Here)

एक न्यूनतम सेटअप (minimal setup) के लिए इन तीन फाइल्स से शुरुआत करें:

- रूट निर्देश (Root instructions): [`templates/AGENTS.md`](./templates/AGENTS.md) या [`templates/CLAUDE.md`](./templates/CLAUDE.md)
- फ़ीचर स्थिति (Feature state): [`templates/feature_list.json`](./templates/index.md#feature-list-json)
- प्रोग्रेस लॉग (Progress log): [`templates/claude-progress.md`](./templates/claude-progress.md)

*नोट:* यह फ़ाइल नाम कोर्स का ऐतिहासिक कन्वेंशन है। यह एक जेनेरिक, रिपॉजिटरी-लोकल प्रोग्रेस लॉग है जिसे कोई भी कोडिंग एजेंट इस्तेमाल कर सकता है, बशर्ते आपके निर्देश उसे ऐसा करने को कहें।
- बूटस्ट्रैप स्क्रिप्ट रेफरेंस: `docs/hi/resources/templates/init.sh`

इसके बाद इन्हें जोड़ें:

- सेशन हैंडऑफ (Session handoff): [`templates/session-handoff.md`](./templates/session-handoff.md)
- क्लीन-एग्ज़िट चेकलिस्ट (Clean-exit checklist): [`templates/clean-state-checklist.md`](./templates/clean-state-checklist.md)
- इवैल्यूएटर रूब्रिक (Evaluator rubric): [`templates/evaluator-rubric.md`](./templates/evaluator-rubric.md)

यदि आप OpenAI के "Harness engineering" ब्लॉग जैसा विस्तृत रिपॉजिटरी स्ट्रक्चर चाहते हैं, तो एडवांस्ड पैक का उपयोग करें:

- [`openai-advanced/index.md`](./openai-advanced/index.md)

## लाइब्रेरी संरचना (Library Structure)

- [`templates/`](./templates/index.md): असली रिपॉजिटरी में कॉपी करने के लिए रेडीमेड टेम्पलेट्स
- [`reference/`](./reference/index.md): मेथड्स, स्टार्टअप फ्लो, और फेलियर-मोड्स के मैप्स
- [`openai-advanced/`](./openai-advanced/index.md): एडवांस्ड रिपो स्केलेटन, सिस्टम-ऑफ-रिकॉर्ड डॉक्स और गवर्नेंस टेम्पलेट्स

## अनुशंसित मिनिमल पैक (Recommended Minimal Pack)

अधिकांश प्रोजेक्ट्स के लिए, यह कॉम्बिनेशन सबसे तेज़ और सबसे असरदार रिज़ल्ट देता है:

```text
your-repo/
├── AGENTS.md                  # रूट निर्देश (100 लाइनों से कम)
├── feature_list.json          # स्ट्रक्चर्ड टास्क्स और पास क्राइटेरिया
├── claude-progress.md         # एक्टिव टास्क और सेशन नोट्स
└── init.sh                    # ऑटोमैटिक एनवायरनमेंट वेरिफिकेशन
```
