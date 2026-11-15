# مكتبة الموارد العربية

يحول هذا المجلد طرق المساق إلى قوالب جاهزة للنسخ ومراجع مختصرة يمكنك استخدامها في مستودع حقيقي.

## متى تستخدمها

ابدأ هنا عندما تريد من Codex أو Claude Code أو وكيل برمجة آخر أن يعمل عبر عدة جلسات دون إعادة استنتاج الإعداد، والحالة، والنطاق في كل مرة.

تكون مفيدة خصوصًا عندما:

- يمتد العمل عبر عدة جلسات
- تكون الميزات كثيرة ويسهل تركها نصف مكتملة
- يميل الوكلاء إلى إعلان النجاح مبكرًا
- يعاد اكتشاف خطوات التشغيل في كل مرة

## ابدأ من هنا

لإعداد بسيط، ابدأ بـ:

- تعليمات الجذر: [`templates/AGENTS.md`](./templates/AGENTS.md) أو [`templates/CLAUDE.md`](./templates/CLAUDE.md)
- حالة الميزات: [`templates/feature_list.json`](./templates/index.md#feature-list-json)
- سجل التقدم: [`templates/claude-progress.md`](./templates/claude-progress.md)
- مرجع سكربت bootstrap: `docs/ar/resources/templates/init.sh`

ثم أضف:

- handoff الجلسة: [`templates/session-handoff.md`](./templates/session-handoff.md)
- قائمة تحقق للخروج النظيف: [`templates/clean-state-checklist.md`](./templates/clean-state-checklist.md)
- rubric للمقيّم: [`templates/evaluator-rubric.md`](./templates/evaluator-rubric.md)

إذا أردت بنية مستودع أكثر اكتمالًا على نمط OpenAI من مقالة "Harness engineering"، استخدم الحزمة المتقدمة:

- [`openai-advanced/index.md`](./openai-advanced/index.md)

## بنية المكتبة

- [`templates/`](./templates/index.md): قوالب لنسخها إلى مستودع حقيقي
- [`reference/`](./reference/index.md): ملاحظات منهجية، تدفق بدء التشغيل، وخرائط أنماط الفشل
- [`openai-advanced/`](./openai-advanced/index.md): هيكل مستودع متقدم، وثائق system-of-record، وقوالب حوكمة agent-first

## الحزمة البسيطة الموصى بها

- `AGENTS.md` أو `CLAUDE.md`
- `feature_list.json`
- `claude-progress.md`
- `init.sh`

هذه الملفات الأربعة كافية لجعل معظم workflows الخاصة بالوكلاء أكثر استقرارًا بشكل واضح.

عندما ينمو المستودع إلى نظام طويل الأمد بعدة نطاقات، وخطط نشطة، وتقييم جودة، وسياسات موثوقية، انتقل إلى حزمة [`openai-advanced/`](./openai-advanced/index.md) بدلًا من مد الحزمة البسيطة أكثر من اللازم.
