# 拆解 Claude Code 的 harness 设计

Anthropic 在《[Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)》里明确提出：可靠性的来源是 harness 而不是模型，agent 需要在"模型之外"被约束。Claude Code 就是这个思路的产品化样本，Anthropic 官方也直接把它归入 **agentic harness** 的范畴。它不是营销话术——Claude Code 可能是目前公开拆解最透彻的 harness：源码公开、社区研究报告详尽，而且它把课程讲义里的几乎所有核心机制（分层记忆、上下文压缩、权限、钩子、子智能体、会话持久化）都做成了完整的产品化实现。

这一篇我们用课程五子系统框架拆 Claude Code，重点看它怎么把"上下文管理""防止提前宣告完成""确定性约束"这些 harness 原教旨概念落地。

## 一句话定位

Claude Code 的核心是一个简单的 while 循环：调用模型、执行工具、观察结果、再调用模型。但**绝大部分代码不在这个循环里，而在围绕这个循环的系统里**——权限系统、上下文压缩管线、扩展机制、子智能体编排、会话存储。这就是 harness 的本质：循环是骨架，骨架之外的一切才是决定可靠性的部分。

## 指令子系统：分层记忆体系

Claude Code 的记忆系统是它对 harness 理论最直接的贡献，对应课程里"仓库即事实来源"和"跨会话上下文连续"两讲。[官方文档《How Claude remembers your project》](https://code.claude.com/docs/en/memory)明确说：每次会话都从全新的上下文窗口开始，靠两类机制跨会话携带知识——CLAUDE.md 文件（你写的指令）和 auto memory（Claude 自己写的笔记）。

作用域上，官方把 CLAUDE.md 文件分为四类（按加载顺序从宽到严）：

- **组织策略级**：由 IT/DevOps 统一管理（如 `/etc/claude-code/CLAUDE.md`），公司级规范。
- **用户级 `~/.claude/CLAUDE.md`**：跨项目的个人偏好与规则。
- **项目级 `./CLAUDE.md` 或 `./.claude/CLAUDE.md`**：项目级事实来源，工程结构、技术栈、验证命令，随仓库共享。
- **本地级 `./CLAUDE.local.md`**：个人项目内偏好，通常加进 `.gitignore` 不提交。

此外还有两条机制：

- **子目录级按需加载**：子目录里的 CLAUDE.md 不在启动时加载，而是当 Claude 读取该目录文件时才进入上下文。
- **自动记忆（auto memory）**：Claude 根据你的纠正和偏好主动写笔记，按仓库共享、跨 worktree 生效，每会话最多加载前 200 行或 25KB。

这四类作用域构成一个**指令层级**：官方文档说"越具体的指令越晚进入上下文"（项目指令在用户指令之后出现）。它的价值在于：不是让模型在每次对话开头消化一整篇巨型指令，而是按作用域就近加载。这正是课程第四讲"为什么单个巨型指令文件会失败"的产品化答案。

## 上下文子系统：五层压缩管线

Claude Code 对上下文的管理是一套**五层压缩管线**（five-layer compaction pipeline），不是"满了就摘要"这么简单——这一架构细节来自 [VILA Lab 的《Dive into Claude Code》](https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf)源码级拆解。课程第五讲讲"长任务会丢失连续性"，Claude Code 的解法是多级漏斗：先做无损的剪枝（去掉冗余工具结果），再做结构化提炼，最后才动用有损的 LLM 摘要，并配套熔断机制防止过度压缩。

配套的是会话存储的设计：**追加式会话存储（append-oriented storage）**，所有历史都追加写入 `history.jsonl`，支持 `/resume` 恢复和 fork 分支。这保证了"每次会话结束前都做好交接"——不是因为记性好，而是因为存储层是追加的、可重放的。

## 工具子系统：四种扩展机制

Claude Code 把扩展面切成四类，每一类解决一类问题，这是它设计里最值得抄的部分：

- **技能（Skills）**：[官方文档](https://code.claude.com/docs/en/skills)定义——`SKILL.md` 描述的过程性知识，按触发词自动加载，渐进式披露。适合"如何做某件事"的领域知识。
- **MCP**：[官方文档](https://code.claude.com/docs/en/mcp)里的 JSON-RPC 协议连接外部系统，是"模型的手够到外部世界"的标准接口。
- **钩子（Hooks）**：[官方文档](https://code.claude.com/docs/en/hooks)挂在 `PreToolUse`、`PostToolUse`、`Stop` 等生命周期事件上的确定性脚本。
- **插件 / 子智能体（Subagents）**：[官方文档](https://code.claude.com/docs/en/sub-agents)把复杂任务拆给专门化的 agent 执行。

关键设计是**职责分离**：CLAUDE.md 管"是什么"，技能管"怎么做"，MCP 管"连到哪"，钩子管"何时强制"。团队如果把这几层混用（比如把 MCP 干的事写进 CLAUDE.md），就会出现课程里说的上下文渗漏。

## 反馈与验证：确定性约束 + 人机分工

课程第十讲讲"跑通完整流程才算真正验证"，Claude Code 的对应机制是双轨的：

**1. 权限系统（确定性约束）。** Claude Code 的权限不是"全都问一遍"，而是七种模式 + 一个基于 ML 的分类器：低风险操作放行，高风险操作按策略询问或拒绝（架构细节见 [VILA Lab 拆解](https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf)）。这是把"给 agent 划清边界"（第七讲）做成了运行时强制，而不是靠提示词恳求。

**2. 钩子（防提前宣告完成）。** `PostToolUse` 钩子可以在工具执行后强制跑检查、把结果写回上下文；`Stop` 钩子在 agent 宣告完成时介入。这就是"干活的人和检查的人分开"——[Anthropic 在 harness 文章里明确观察到](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) agent 会自信地夸赞自己的工作（"confidently praised their work"），所以用钩子注入**确定性的**检查，而不是信任模型的自评。

**3. 子智能体（隔离上下文）。** 每个子智能体的对话记录存在独立的 sidechain 文件里，**不会膨胀父智能体的上下文**（见 [VILA Lab 拆解](https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf)）。这是"任务边界"和"上下文隔离"的结合：拆分任务的同时，也隔离了上下文污染。

## 可观测性与会话持久化

Claude Code 的日志是追加式的完整记录（history.jsonl），加上 `/compact`、`/clear`、`/init` 这些显式命令，让你可以主动管理上下文状态，而不是被动等它满。`/init` 更是把"让 agent 每次工作前先初始化"（第六讲）做成了一条命令——[官方文档](https://code.claude.com/docs/en/memory)说它自动分析代码库并生成初始 CLAUDE.md（含构建命令、测试说明、工程约定）。

## 映射到课程框架

| 子系统 | Claude Code 的实现 | 评价 |
| --- | --- | --- |
| 指令 | 作用域分层（组织/用户/项目/本地）+ 自动记忆 | 分层记忆是标杆实现 |
| 工具 | 技能 + MCP + 钩子 + 子智能体四类扩展 | 职责划分清晰，是核心亮点 |
| 环境 | 项目内设置 + settings.json | 靠用户在 CLAUDE.md 里自描述 |
| 状态 | 追加式会话存储 + 五层压缩 + resume/fork | 极强，长任务连续性的参考实现 |
| 反馈 | 权限分类器 + PostToolUse 钩子强制检查 | 把"防提前宣告完成"变成确定性机制 |

## 值得借鉴的设计

1. **指令按作用域分层**，而不是堆在一个文件里。目录级 CLAUDE.md 是"就近加载"的漂亮实现。
2. **压缩是分级漏斗**：先无损后损，别一上来就全文摘要。
3. **用钩子做确定性检查**：防提前宣告完成，靠的是运行时强制，不是提示词恳求。
4. **子智能体上下文隔离**：拆任务的同时拆上下文，别让子任务的结果污染主循环。
5. **会话存储追加式 + 可重放**：交接不是靠记忆，是靠存储层保证。

## 参考来源（原文 / 源码）

每条论断都能回溯到下面的原文或源码，避免凭印象转述：

- **Claude Code 官方文档 · Memory**：每次会话全新上下文、CLAUDE.md 四类作用域、子目录按需加载、auto memory（200 行 / 25KB）、`/init` 生成 CLAUDE.md。<br/>https://code.claude.com/docs/en/memory
- **Claude Code 官方文档 · Skills / MCP / Hooks / Sub-agents**：四类扩展机制的定义与事件（PreToolUse / PostToolUse / Stop）。<br/>https://code.claude.com/docs/en/skills ｜ https://code.claude.com/docs/en/mcp ｜ https://code.claude.com/docs/en/hooks ｜ https://code.claude.com/docs/en/sub-agents
- **VILA Lab《Dive into Claude Code》**（源码级拆解报告）：五层压缩管线、权限七模式 + ML 分类器、sidechain 子智能体、追加式会话存储 history.jsonl。<br/>https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf
- **Anthropic《Effective harnesses for long-running agents》**："可靠性来自 harness 而非模型"、agent 会自信地夸赞自己的工作、用钩子做验证等观点出处。<br/>https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- **Claude Code Full Stack 导读**（社区，CLAUDE.md / Skills / MCP / Subagents / Hooks 分层）：作为扩展机制职责分离的补充阅读。<br/>https://jsmanifest.com/claude-code-full-stack-guide

相关讲义：[第三讲 · 让代码仓库成为唯一的事实来源](../../lectures/lecture-03-why-the-repository-must-become-the-system-of-record/) ｜ [第九讲 · 防止 agent 提前宣告完成](../../lectures/lecture-09-why-agents-declare-victory-too-early/) ｜ [第十讲 · 跑通完整流程才算真正验证](../../lectures/lecture-10-why-end-to-end-testing-changes-results/)
