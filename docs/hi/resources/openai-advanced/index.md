# OpenAI एडवांस्ड हार्नेस पैक (OpenAI Advanced Pack)

यह पैक OpenAI के ऐतिहासिक "Harness engineering: leveraging Codex in an agent-first world" लेख पर आधारित रिपॉजिटरी संरचना प्रदान करता है।

## शामिल स्टार्टर लेआउट (Included Starter Layout)

- **`AGENTS.md`**: 100 लाइनों का रूट डायरेक्टरी इंडेक्स।
- **`ARCHITECTURE.md`**: सिस्टम का उच्च-स्तरीय वास्तुकला दस्तावेज़।
- **`docs/`**: विषयवार विस्तृत विनिर्देश (DESIGN, PRODUCT_SENSE, RELIABILITY, SECURITY)।
- **`docs/exec-plans/`**: सक्रिय और पूर्ण निष्पादन योजनाओं का ट्रैकर।

## इसे कैसे अपनाएँ (How To Adopt It)

1. अपने प्रोजेक्ट में `AGENTS.md` और `ARCHITECTURE.md` को कॉपी करें।
2. अपनी व्यावसायिक आवश्यकताओं के अनुसार `docs/product-specs/` में फीचर्स जोड़ें।
3. एजेंट को निर्देश दें कि वह कोड लिखने से पहले `docs/exec-plans/active/` में योजना दर्ज करे।

## SOP लाइब्रेरी (SOP Library)

- [ऑब्ज़र्वेबिलिटी फीडबैक लूप](./sops/observability-feedback-loop.md)
- [लेयर्ड डोमेन आर्किटेक्चर](./sops/layered-domain-architecture.md)
- [रिपो में ज्ञान को एनकोड करना](./sops/encode-knowledge-into-repo.md)
- [Chrome DevTools वैलिडेशन लूप](./sops/chrome-devtools-validation-loop.md)

## मुख्य डिज़ाइन सिद्धांत (Design Principles)

1. **रिपॉजिटरी ही एकमात्र सच है (Repo IS the Spec)**: सारा ज्ञान फाइल्स में होना चाहिए।
2. **इनवेरिएंट्स तय करें, माइक्रोमैनेज न करें**: कड़े नियम और टेस्ट दें, बाकी मॉडल पर छोड़ें।
3. **योजना पहले, कोड बाद में**: हर गैर-तुच्छ बदलाव से पहले एग्ज़ीक्यूशन प्लान अनिवार्य है।
