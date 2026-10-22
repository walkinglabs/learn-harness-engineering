[中文版本 →](../../../zh/lectures/lecture-11-why-observability-belongs-inside-the-harness/)

> أمثلة الكود: [code/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/ar/lectures/lecture-11-why-observability-belongs-inside-the-harness/code/)
> مشروع عملي: [المشروع 06. Harness كامل (Capstone)](./../../projects/project-06-runtime-observability-and-debugging/index.md)

# المحاضرة 11. اجعل runtime الوكيل قابلًا للملاحظة

## ما المشكلة التي تحلها هذه المحاضرة؟

تطلب من وكيل أن ينفذ ميزة. يعمل 20 دقيقة، يعدل عددًا كبيرًا من الملفات، ثم يقول لك: "انتهيت، لكن هناك اختبارين يفشلان". تسأله لماذا يفشلان فيجيب: "لست متأكدًا، ربما مشكلة توقيت". تسأله أي المسارات الحرجة غيّرها فيقول: "دعني أنظر إلى الكود...".

المشكلة ليست أن الوكيل غير قادر. المشكلة أن harness لا يوفر ملاحظة كافية. **من دون observability، يتخذ الوكلاء قرارات تحت عدم اليقين، وتصبح التقييمات أحكامًا ذاتية، وتتحول المحاولات المتكررة إلى تخبط أعمى.** كل من OpenAI و Anthropic يعرفان الموثوقية على أنها مشكلة أدلة: يجب على harness أن يكشف سلوك runtime وإشارات التقييم بصيغة تساعد القرار التالي.

## المفاهيم الأساسية

- **ملاحظة runtime**: إشارات على مستوى النظام مثل logs و traces وأحداث العمليات و health checks. تجيب عن سؤال "ماذا فعل النظام؟".
- **ملاحظة العملية**: رؤية لآثار قرارات harness مثل الخطط، rubrics، ومعايير القبول. تجيب عن سؤال "لماذا يجب قبول هذا التغيير؟".
- **Task trace**: سجل كامل لمسار القرار من بداية المهمة إلى نهايتها، مشابه لتتبع الطلبات في الأنظمة الموزعة.
- **Sprint contract**: اتفاق قصير قبل كتابة الكود يحدد نطاق المهمة، ومعايير التحقق، والاستثناءات. وهو أداة أساسية لملاحظة العملية.
- **Evaluator rubric**: يحول تقييم الجودة من حكم ذاتي إلى تقييم منظم قائم على الأدلة.
- **ملاحظة متعددة الطبقات**: تصميم ملاحظة طبقة النظام وطبقة العملية معًا بحيث يعزز كل منهما الآخر. إشارات runtime تشرح السلوك، وآثار العملية تشرح النية.

## ملاحظة متعددة الطبقات

```mermaid
flowchart LR
    Contract["اكتب المهمة أولًا<br/>ما الذي يتغير / ما لا يتغير / معايير النجاح"] --> Generator["Generator"]
    Generator --> Signals["اجمع logs و traces<br/>و health checks أثناء التشغيل"]
    Contract --> Review["راجع النتيجة بندًا بندًا<br/>السلوك / الاختبارات / الحدود"]
    Signals --> Review
    Review --> Verdict["أشر إلى الفحص الفاشل<br/>ومكان الإصلاح"]
    Verdict --> Generator
```

## لماذا يحدث هذا

### التكلفة الحقيقية لغياب observability

عندما يفتقر harness إلى observability، تظهر أربعة أنواع من المشاكل بشكل منهجي:

**لا يمكن التمييز بين "صحيح" و"يبدو صحيحًا"**: قد تبدو الدالة صحيحة تمامًا في مراجعة الكود، لكن في runtime ينتج خطأ edge case نتائج غير صحيحة لمدخلات محددة. وحدها runtime traces تكشف أن مسار التنفيذ الفعلي انحرف عن المتوقع.

**يصبح التقييم غامضًا**: من دون rubrics ومعايير قبول، يعتمد المقيمون، بشرًا كانوا أم وكلاء، على افتراضات ضمنية. قد يحصل نفس الناتج على تقييمات مختلفة جدًا. يصبح تقييم الجودة غير قابل لإعادة الإنتاج.

**تصبح المحاولات المتكررة تخمينات عمياء**: عندما لا يعرف الوكيل سبب الفشل، يكون اتجاه المحاولة التالية عشوائيًا. قد يصلح مسارات كود غير مرتبطة بينما يتجاهل السبب الجذري. كل محاولة عمياء تكلف tokens ووقتًا.

**انحدار معلومات handoff بين الجلسات**: عندما ينتقل عمل غير مكتمل إلى جلسة جديدة، يعني غياب observability أن الجلسة الجديدة يجب أن تشخص حالة النظام من الصفر. عليها إعادة قراءة الكود وإعادة تشغيل الأوامر وتقرير أي الإشارات تهم؛ [سجلات التقدم والتحقق المُدارة بالإصدارات](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) توفر حالة قابلة للفحص.

### سيناريو واقعي مع Claude Code

تخيل harness يستخدم workflow بثلاثة أدوار: planner-generator-evaluator، وينفذ مهمة "أضف dark mode إلى التطبيق".

**من دون observability**: يخرج planner وصفًا غامضًا. ينفذ generator dark mode بناءً على هذا الغموض، لكنه لا يطابق توقعات planner الضمنية. يرفض evaluator النتيجة وفق معاييره الضمنية، لكنه لا يستطيع شرح الخطأ تحديدًا. يعيد generator المحاولة عشوائيًا. تتكرر الدورة 3-4 مرات، وتستغرق نحو 45 دقيقة، وتنتج مخرجًا بالكاد مقبولًا.

**مع observability كاملة**: يخرج planner عقد sprint contract يعدد المكونات التي يجب تعديلها، ومعايير التحقق، والاستثناءات. ينفذ generator وفق العقد. تسجل runtime observability تحميل وتطبيق الأنماط لكل مكون. يستخدم evaluator rubric لتقييم كل بُعد مع أدلة محددة. تنتج دورة واحدة نتيجة عالية الجودة في نحو 15 دقيقة.

الفرق يأتي من وجود العقد والأدلة خارج رأس الوكيل.

### لماذا لا يستطيع الوكلاء حل ذلك وحدهم

قد تفكر: "ألا يستطيع الوكيل طباعة logs بنفسه؟" المشاكل هي:

1. الوكيل لا يعرف ما لا يعرفه؛ لن يسجل إشارات لا يدرك أنه يحتاجها.
2. تنسيقات logs غير متسقة؛ كل جلسة قد تستخدم شكلًا مختلفًا، وهذا يمنع التحليل المنهجي.
3. ملاحظة العملية لا تحلها logs؛ sprint contracts و scoring rubrics آثار منظمة تحتاج دعمًا على مستوى harness.

## كيف تفعل ذلك بشكل صحيح

### 1. ابنِ جمع إشارات runtime داخل harness

لا تعتمد على الوكيل ليطبع logs بنفسه. يجب أن يجمع harness هذه الإشارات تلقائيًا:

- **دورة حياة التطبيق**: حالات startup و ready و running و shutdown
- **تنفيذ مسار الميزة**: سجلات للمسارات الحرجة، بما فيها نقاط الدخول و checkpoints والخروج
- **تدفق البيانات**: سجلات البيانات بين المكونات
- **استخدام الموارد**: أنماط غير طبيعية مثل ذاكرة تنمو باستمرار
- **الأخطاء والاستثناءات**: سياق الخطأ كاملًا، لا رسالة الخطأ فقط

### 2. نفذ sprint contracts

قبل بدء كل مهمة، يتفاوض generator و evaluator، وقد يكونان استدعاءين مختلفين لنفس الوكيل، على عقد:

```markdown
# Sprint Contract: Dark Mode Support

## Scope
- Modify the theme toggle component
- Update global CSS variables
- Add dark mode tests

## Verification Standards
- Visual regression tests pass for each component
- Main flow end-to-end tests pass
- No flash of unstyled content (FOUC)

## Exclusions
- Not handling print styles
- Not handling third-party component dark mode
```

### 3. أنشئ rubric للتقييم

حوّل سؤال "هل هذا جيد؟" إلى تقييم قابل للقياس:

```markdown
# Scoring Rubric

| Dimension | A | B | C | D |
|-----------|---|---|---|---|
| Code correctness | All tests pass | Main flow passes | Partial pass | Build fails |
| Architecture compliance | Fully compliant | Minor deviations | Obvious deviations | Serious violations |
| Test coverage | Main + edge cases | Main flow only | Only skeleton | No tests |
```

### 4. وحّد القياس باستخدام OpenTelemetry

أنشئ trace لكل جلسة harness، و span لكل مهمة، و sub-spans لكل خطوة تحقق. استخدم attributes قياسية لتسجيل المعلومات المهمة. هكذا يمكن دمج بيانات observability مع أدوات مثل Jaeger و Zipkin.

## حالة واقعية

Harness يستخدم workflow من planner-generator-evaluator لتنفيذ "إضافة دعم dark mode":

**نسخة غير قابلة للملاحظة**: 3-4 جولات من المحاولات العمياء، 45 دقيقة، نتيجة بالكاد مقبولة. يقول evaluator "لا تبدو صحيحة" لكنه لا يستطيع تحديد السبب. يضيع generator وقتًا كبيرًا في اتجاهات خاطئة.

**نسخة قابلة للملاحظة بالكامل**:
- sprint contract يوضح النطاق والمعايير والاستثناءات
- runtime traces تسجل تحميل الأنماط لكل مكون
- rubric يوفر تقييمًا منظمًا لكل بُعد
- دورة واحدة تنتج نتيجة عالية الجودة في 15 دقيقة

نتيجة أوضح، جودة أكثر استقرارًا، وتقييمات قابلة لإعادة الإنتاج.

## الخلاصات الأساسية

- **Observability خاصية معمارية في harness**، وليست ميزة تضاف لاحقًا.
- **طبقتا observability ضروريتان**: إشارات runtime تشرح "ماذا حدث"، وآثار العملية تشرح "لماذا حدث بهذه الطريقة".
- **Sprint contracts تسبق التنفيذ بالتوافق**، فتمنع بناء شيء سيرفضه evaluator فورًا لأسباب متوقعة.
- **Rubrics تجعل التقييم قابلًا لإعادة الإنتاج**، بحيث يعطي مقيمون مختلفون درجات متقاربة لنفس الناتج.
- **observability تحوّل رفضًا غامضًا إلى عيب محدد قابل للإصلاح.**

## قراءات إضافية

- [Observability Engineering - Charity Majors](https://www.honeycomb.io/blog/observability-engineering-book) — إطار نظري وعملي لهندسة observability الحديثة
- [Dapper - Google (Sigelman et al.)](https://research.google/pubs/pub36356/) — ممارسة رائدة في tracing الموزع واسع النطاق
- [Harness Design - Anthropic](https://www.anthropic.com/engineering/harness-design-long-running-apps) — تقديم sprint contracts و evaluator rubrics
- [Site Reliability Engineering - Google](https://sre.google/sre-book/table-of-contents/) — تطبيق منهجي للملاحظة في أنظمة الإنتاج

## تمارين

1. **تحليل فجوة observability**: راجع harness الحالي لديك من طبقة النظام وطبقة العملية. ابحث عن حالات نظام لا يمكن تمييزها من الإشارات الحالية واقترح إضافات.

2. **تدريب sprint contract**: اكتب sprint contract لمهمة حقيقية. اجعل الوكيل ينفذ وفق العقد، وقارن الكفاءة والجودة مع العقد وبدونه.

3. **بناء task trace**: سجل كل خطوة من عمليات الوكيل أثناء مهمة برمجية كاملة. أضف annotations باستخدام OpenTelemetry semantic conventions وحلل نقاط نقص المعلومات.
