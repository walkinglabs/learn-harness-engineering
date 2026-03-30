# OpenAI 高级资源包

这个文件夹把 OpenAI 那篇《Harness engineering: leveraging Codex in an
agent-first world》里更完整、更高阶的仓库组织方式整理成可以直接参考和复制的模板。

当最小 harness 已经不够用，而你的仓库开始需要下面这些能力时，就该看这一套：

- 一个简短、负责路由的 `AGENTS.md`
- 放在仓库里的“唯一事实来源”文档体系
- 活跃执行计划与已完成计划的分层管理
- 明确的产品、可靠性、安全、前端治理文件
- 按产品领域和架构层持续更新的质量评分
- 面向模型阅读的参考材料目录
- 针对架构、知识沉淀、运行验证的标准 SOP

## 包含的目录骨架

[`repo-template/`](./repo-template/index.md) 里提供了一套可直接复制的起步
结构，核心布局如下：

```text
AGENTS.md
ARCHITECTURE.md
docs/
├── design-docs/
│   ├── index.md
│   └── core-beliefs.md
├── exec-plans/
│   ├── active/
│   ├── completed/
│   └── tech-debt-tracker.md
├── generated/
│   └── db-schema.md
├── product-specs/
│   ├── index.md
│   └── new-user-onboarding.md
├── references/
│   ├── design-system-reference-llms.txt
│   ├── nixpacks-llms.txt
│   └── uv-llms.txt
├── DESIGN.md
├── FRONTEND.md
├── PLANS.md
├── PRODUCT_SENSE.md
├── QUALITY_SCORE.md
├── RELIABILITY.md
└── SECURITY.md
```

## 怎么用

1. 如果仓库还小，先用最小资源包。
2. 一旦进入多模块、多轮会话、长期演化阶段，就把
   [`repo-template/`](./repo-template/index.md) 里的骨架复制到你的仓库。
3. 保持 `AGENTS.md` 很短，把深层规则拆到 `docs/` 里。
4. 把质量文档、可靠性文档、执行计划当成日常开发的一部分，而不是事后补写。
5. 把生成物和外部参考材料明确收进仓库，避免 agent 依赖聊天上下文或人的记忆。

## SOP 资料库

[`sops/`](./sops/index.md) 把文章里的几张关键图，整理成可以逐步执行的标准流程：

- 分层领域架构搭建 SOP
- 把不可见知识编码进仓库的 SOP
- 本地可观测性栈与反馈回路 SOP
- 用 Chrome DevTools 做 UI 验证闭环的 SOP

## 设计原则

- 短入口，深链接
- 仓库就是唯一事实来源
- 机械约束优先于口头约定
- 计划、质量和技术债都和代码一起版本化
- 清理与 harness 简化是常规工作，不是临时救火

这套资源包是有倾向性的模板，不是必须逐字照抄。最好的用法是把它当成一套高质量起点，再按你的项目改造。
