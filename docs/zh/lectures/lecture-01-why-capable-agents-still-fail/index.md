[English Version →](../../../en/lectures/lecture-01-why-capable-agents-still-fail/)

> 本篇代码示例：[code/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/zh/lectures/lecture-01-why-capable-agents-still-fail/code/)
> 实战练习：[Project 01. 只写提示词让 agent 做，和定好规则再让它做，差多少](./../../projects/project-01-baseline-vs-minimal-harness/index.md)

# 第一讲. 模型能力强，不等于执行可靠

## 这节课要解决什么问题

你花了不少钱订阅了 Claude Pro，GPT-4o 在基准测试上分数一个比一个高，SWE-bench 排行榜天天有人刷分。但当你真的让 AI agent 去帮你改一个真实项目的时候——加了功能但测试挂了，改了 bug 但引入了新 bug，跑了 20 分钟然后自信满满地说"完成了"，结果你一看代码，根本不是你要的东西。

这不是模型不够聪明。这是你给模型的工作环境太差了。这节课要讲的就是：为什么最强的模型在真实工程任务中依然频繁翻车，以及根本原因不在模型本身，而在你给它搭的"测试架"（harness）。

## 核心概念

- **能力鸿沟（Capability Gap）**：模型在基准测试上的表现和真实任务上的表现之间的巨大落差。SWE-bench Verified 上 50-60% 的通过率意味着近一半的真实 issue 解不了。
- **测试架（Harness）**：模型之外的一切——指令、工具、环境、状态管理、验证反馈。不是模型权重的部分，全是测试架。
- **测试架诱导失败**：模型本身能力足够，但因为执行环境有结构性缺陷而失败。Anthropic 的对照实验：同一个 prompt、同一个模型，裸跑 vs 完整 harness，产出质量有本质差异。
- **验证缺口**：agent 对自己输出的信心评估和实际正确性之间的偏差。agent 说"我做完了"但实际没做完，这是最常见的失败模式。
- **诊断循环**：执行 → 观察失败 → 定位到 harness 的哪一层出了问题 → 修补那一层 → 重新执行。这是 harness 工程的核心方法论。
- **完成定义（Definition of Done）**：一组可以用命令验证的条件——测试通过、lint 没报错、类型检查通过。没有显式的完成定义，agent 就会自己编一个。

## 为什么会这样

先看一组数据。截至 2025 年底，最强的 coding agent 在 SWE-bench Verified 上的通过率大约在 50-60% 左右。这还是精心挑选过的、有明确 issue 描述和测试用例的任务。换到真实的日常开发场景——需求模糊、没有现成测试、隐含的业务规则散落在各处——这个数字只会更低。

但这里有个反直觉的事实：Anthropic 做过一个对照实验。同一个 prompt（"做一个 2D 复古游戏编辑器"），同一个模型（Opus 4.5）。单 agent 裸跑模式，20 分钟花了 $9，结果游戏核心功能根本跑不起来。加上完整 harness（planner + generator + evaluator 三 agent 架构），6 小时花了 $200，游戏可以正常游玩。模型没换，只是 harness 从"裸奔"变成了"全副武装"。

OpenAI 在 2025 年发布的 harness engineering 文章里说得很直白：Codex 在一个 harness 搭得好的仓库里，表现能从"不可靠"变成"可靠"——注意他们的用词，不是"好了一点"，是质变。Anthropic 的长运行 agent 文档也得出了类似结论：有显式恢复路径、稳定状态管理和可靠反馈回路的 agent，长任务完成率远高于缺乏这些结构的。

那具体是什么在出问题？我们把常见的失败模式分成五层：

**任务规范层**：你说的"加个搜索功能"，agent 理解的可能跟你完全不一样。搜什么？全文本还是结构化？要不要分页？要不要高亮？模糊匹配还是精确匹配？你没有说清楚，agent 就自己猜，猜错了你再改，改的成本比一开始说清楚还高。

**上下文供给层**：项目里有什么隐含的架构约定，agent 不知道。比如你们团队统一用 SQLAlchemy 2.0 的新语法，但 agent 默认写了 1.x 的代码。再比如所有 API 端点必须走 OAuth 2.0 认证，但这个规则只存在于你脑子里和一个三个月前的 Slack 消息里。Agent 看不到这些。

**执行环境层**：开发环境配置不完整、依赖缺了、工具版本不对。Agent 把宝贵的上下文窗口花在了 `pip install` 失败、Node 版本不对这些环境问题上，而不是解决你的核心任务。

**验证反馈层**：没有测试、没有 lint、或者验证命令根本没告诉 agent。Agent 写完代码，自己看了看觉得没问题，就说完成了。这就像你让学生交作业但不给答案检查——他自己觉得自己做对了，但你批改的时候发现一堆错误。

**状态管理层**：长任务跨会话，上次会话的发现全丢了。每个新会话都得重新探索项目结构、理解代码组织。Anthropic 的数据显示，缺乏持久化状态的 agent 在超过 30 分钟的任务中失败率急剧上升。

## 怎么做才对

核心原则：**遇到失败，先别换模型，先检查 harness。** 如果同一个模型在类似的结构良好的任务中能成功，那优先假设是 harness 的问题。

具体怎么做：

1. **每次失败都归因到具体层**。不要笼统地说"模型不行"，而是问：是任务没说清楚？是上下文不够？是没有验证手段？把每次失败归到上面五层中的某一层。

2. **给每个任务写显式的完成定义**。不要说"加个搜索功能"，要说：
   ```
   完成标准：
   - 新增 GET /api/search?q=xxx 端点
   - 支持分页，默认 20 条
   - 返回结果包含高亮片段
   - 所有新代码通过 pytest
   - 类型检查通过（mypy --strict）
   ```

3. **创建 AGENTS.md 文件**。在仓库根目录放一个文件，告诉 agent 这个项目的技术栈、架构约定、验证命令。这是 harness 工程的第一步，也是投入产出比最高的一步。

4. **建立诊断循环**。不要把失败当作"模型又犯傻了"，而是当作"harness 又暴露了一个缺陷"的信号。每次失败 → 定位层 → 修补 → 下次不再犯。几轮下来，你的 harness 会越来越强，agent 的表现会稳定提升。

5. **量化改进**。记个简单的日志：每个任务成功了没有，失败了是哪一层的问题。跑几轮之后你就能看出来哪个层是瓶颈，集中火力修那个层。

## 实际案例

### 从零开始的实验：0 行人工代码

OpenAI 在 2025 年做了一个激进的实验：用 Codex 从一个空的 git 仓库起步，构建一个完整的内部产品。五个月后，这个仓库有大约 100 万行代码——应用逻辑、基础设施、工具、文档、内部开发工具——全部由 agent 生成。三个工程师驱动 Codex，开了大约 1,500 个 PR 并合并。平均每人每天 3.5 个 PR。

这个实验的关键约束是：**人类永远不直接写代码。** 这不是噱头，而是为了逼团队搞清楚——当工程师的主要工作不再是写代码，而是设计环境、表达意图、构建反馈回路时，到底什么变了？

早期进展比预期慢。不是 Codex 不行，而是环境不够完整——agent 缺少必要的工具、抽象和内部结构来推进高层次目标。工程师的工作变成了：把大目标拆成小积木（设计、编码、审查、测试），让 agent 去搭建，然后用这些积木解锁更复杂的任务。当某件事失败了，修复几乎从来不是"更努力"，而是"agent 缺什么能力，怎么让它既可理解又可执行"。

这个实验直接证明了本讲的核心论点：**同一个模型，在空白环境里和在有完整 harness 的环境里，产出有本质差异。** 模型没变，变的是环境。

> 来源：[OpenAI: Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)

### 一个更小的对照实验

一个团队用 Claude Sonnet 给一个中等规模的 Python Web 应用（FastAPI + PostgreSQL + Redis，约 15,000 行代码）添加新的 API 端点。

**初始配置**：只给了"在 `/api/v2/users` 下添加用户偏好设置端点"这一句指令。

**结果**：agent 花了 40% 的上下文窗口探索仓库结构，产出了看似合理的代码但没遵循项目的错误处理模式，用了旧版 SQLAlchemy 语法，宣称完成但端点实际有运行时错误。下一个会话还得重新做发现工作。

**改进后**：团队加了 `AGENTS.md`（描述项目架构和技术栈版本）、显式的验证命令（`pytest tests/api/v2/ && python -m mypy src/`）、和架构决策记录。同一模型在三次独立运行中全部成功，上下文使用效率提高了约 60%。

## 关键要点

- 模型能力和执行可靠性是两回事。最强的模型在糟糕的 harness 里照样翻车。
- 失败的时候先看 harness，再看模型。换模型是成本最高的选择。
- 每次失败都是一个信号：你的 harness 有结构性缺陷。把它找出来、修掉。
- 五层防御：任务规范、上下文供给、执行环境、验证反馈、状态管理。逐层排查。
- 一个 `AGENTS.md` 文件可能比你换一个更贵的模型更有效。

## 延伸阅读

- [OpenAI: Harness Engineering — Leveraging Codex in an Agent-First World](https://openai.com/index/harness-engineering/)
- [Anthropic: Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [HumanLayer: Skill Issue — Harness Engineering for Coding Agents](https://humanlayer.dev/articles/harness-engineering-for-coding-agents/)
- [SWE-bench Leaderboard](https://www.swebench.com/)
- [Thoughtworks Technology Radar: Harness Engineering](https://www.thoughtworks.com/radar)

## 练习

1. **对比实验**：选一个你熟悉的代码仓库和一项非平凡的修改任务。先不给任何 harness 支持，让 agent 跑一次，记录失败。然后加一个 `AGENTS.md` 和显式的验证命令，让同一个 agent 再跑一次。对比两次的结果，把失败归因到五层防御中的某一层。

2. **验证缺口测量**：选 5 个编码任务，在每个任务完成后记录 agent 是否声称完成，然后用独立测试验证实际正确性。计算 agent 在实际没完成时声称完成的比例——这就是你的验证缺口。然后想想：加什么验证命令能把这个比例降下来？

3. **诊断循环实践**：找一个 agent 在你的项目中反复失败的任务。跑一次，记录失败。归因到五层中的某一层。修那一层。再跑。重复三到五轮，记录每一轮的改善。
