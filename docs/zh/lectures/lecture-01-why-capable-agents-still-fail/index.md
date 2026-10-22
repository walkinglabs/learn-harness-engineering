[English Version →](../../../en/lectures/lecture-01-why-capable-agents-still-fail/)

> 本篇代码示例：[code/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/zh/lectures/lecture-01-why-capable-agents-still-fail/code/)
> 实战练习：[Project 01. 只写提示词让 agent 做，和定好规则再让它做，差多少](./../../projects/project-01-baseline-vs-minimal-harness/index.md)

# 第一讲. 模型能力强，不等于执行可靠

2025 年 9 月 29 日，Anthropic 公布 Claude Sonnet 4.5 [在 SWE-bench Verified 上取得 77.2%](https://www.anthropic.com/news/claude-sonnet-4-5)。这个数字听起来还不错，但别急着高兴——那些都是精心挑选过的任务，有明确的 issue 描述，有现成的测试用例。等你把自己日常的需求丢过去，需求模糊、没有现成测试、隐含的业务规则散落在各处，通过率只会更低。你信心满满地交代一个任务，agent 跑了 20 分钟后告诉你"做完了"，你一看代码，加了功能但测试挂了，改了 bug 但引入了新 bug，根本不是你要的东西。

遇到这种情况，大多数人的第一反应是"这模型不行，换一个更贵的"。先别急着掏钱包。问题可能不在模型身上。

## 同一匹马，两种命运

Anthropic 比较了同一个 prompt、"做一个 2D 复古游戏编辑器"、同一个模型 Opus 4.5 在两种 harness 下的表现。第一次裸跑，20 分钟花了 $9：应用能打开，但实体出现在屏幕上、对输入没有反应，实体定义和游戏运行时的接线断了。第二次配上了完整的 harness——planner、generator、evaluator 三 agent 架构——6 小时花了 $200：能移动实体，但物理有粗糙之处，还会被墙挡住，[核心玩法能跑，应用仍不完整](https://www.anthropic.com/engineering/harness-design-long-running-apps)。

Opus 4.5 还是那个 Opus 4.5，模型没有换。换的是马具。

OpenAI 在 2025 年的 harness engineering 文章里把这件事说得更直白。他们说 Codex 在一个 harness 搭得好的仓库里，表现能从"不可靠"直接跳到"可靠"。注意这个用词——不是"好了一点"，是质变。harness 这个词在这里的意思就是**模型权重之外的一切工程基础设施**。

## agent 到底卡在哪

具体的失败模式其实就那么几种：

- **需求描述模糊，agent 只能猜。** "加个搜索功能"，这话说了等于没说。搜索的对象是什么？全文本还是结构化查询？结果要不要分页、要不要高亮？你没说明白，agent 就只好自己猜。猜对了算运气好，猜错了你再改，来回一折腾，比一开始说清楚多花好几倍的时间。
- **隐性约定没写下来，agent 无从遵守。** 你们全组都用 SQLAlchemy 2.0 的新语法，但 agent 默认写了 1.x 的代码；所有 API 端点必须走 OAuth 2.0 认证，可这条规矩只存在于你脑子里和三个月前一条 Slack 消息里。Agent 压根不知道有这么回事，不是不想遵守，是真没见过。
- **环境配置有缺口，agent 把精力花在修环境上。** 开发环境配置不完整、依赖缺了、工具版本不对，agent 把宝贵的上下文窗口花在了 `pip install` 报错、Node 版本冲突这些事上，真正该干的活反而没精力做。
- **缺少验证手段，agent 自己觉得做完了就算完成。** 没有测试、没有 lint、或者验证命令根本没告诉 agent。Agent 写完代码，自己看了看觉得没问题，就说完成了。Anthropic 还观察到一个有意思的现象：当 agent 感觉上下文快满了，它们会匆忙结束当前工作，跳过验证步骤，选一个简单的方案而不是最优方案。他们把这叫"上下文焦虑"。
- **跨会话状态丢失，每个新会话都要重新探索。** 上次会话的发现全丢了，每个新会话都得重新探索项目结构、理解代码组织。缺乏持久化状态的 agent 在超过 30 分钟的任务中失败率急剧上升。

## 关键名词解释

理解了上面的场景，这些概念就不再是一堆术语了：

- **能力鸿沟（Capability Gap）**：模型在基准测试上的表现和真实任务上的表现之间的巨大落差。基准任务的 issue 描述、测试和环境是给定的；真实任务里，这些往往要你自己补。
- **Harness**：模型之外的一切——指令、工具、环境、状态管理、验证反馈。不是模型权重的部分，全是 harness。也就是我们说的"马具"。
- **Harness 诱导失败**：模型本身能力足够，但因为执行环境有结构性缺陷而失败。上面的复古游戏对比就是一个例子。
- **验证缺口**：agent 对自己输出的信心评估和实际正确性之间的偏差。agent 说"我做完了"但实际没做完——这是最常见的失败模式。
- **诊断循环**：执行 → 观察失败 → 定位到 harness 的哪一层出了问题 → 修补那一层 → 重新执行。这是 harness 工程的核心方法论。
- **完成定义（Definition of Done）**：一组可以用命令验证的条件——测试通过、lint 没报错、类型检查通过。没有显式的完成定义，agent 就会自己编一个。

## 遇到失败，先修 harness

核心原则只有一条：**遇到失败，先别换模型，先检查 harness。** 如果同一个模型在类似的结构良好的任务中能成功，那优先假设是 harness 的问题。

具体怎么做？每次失败都归因到具体层。不要笼统地说"模型不行"，问自己：是任务没说清楚？是上下文不够？是没有验证手段？把每次失败归到五层防御里——任务规范、上下文供给、执行环境、验证反馈、状态管理。养成这个习惯，你会发现"模型不行"这个结论在日志里出现得越来越少。

然后，给每个任务写显式的完成定义。不要说"加个搜索功能"，要说清楚：
```
完成标准：
- 新增 GET /api/search?q=xxx 端点
- 支持分页，默认 20 条
- 返回结果包含高亮片段
- 所有新代码通过 pytest
- 类型检查通过（mypy --strict）
```

在仓库根目录放一个 `AGENTS.md` 文件，告诉 agent 这个项目的技术栈、架构约定、验证命令。这是 harness 工程的第一步，也是投入产出比最高的一步。一个 `AGENTS.md` 文件可能比你换一个更贵的模型更有效——这话不是开玩笑。

再往后，建立诊断循环。不要把失败当成"模型又犯傻了"，把它当作"harness 又暴露了一个缺陷"的信号。每次失败，定位到某一层，修补，下次不再犯。几轮下来，你的 harness 会越来越强，agent 的表现也会稳定提升。顺手记个简单的日志就行——每个任务成功了没有，失败了是哪一层的问题。跑几轮之后你就能看出来哪个层是瓶颈，集中火力修那个层。

## 一百万行代码的实验

2025 年 8 月，OpenAI 的三个工程师开始了一项实验。规则很简单：他们不写代码，只让 Codex 写。从一个空的 git 仓库起步，[五个月下来，仓库里有了大约 100 万行代码](https://openai.com/index/harness-engineering/)。应用逻辑、基础设施、工具、文档——全是 agent 生成的。团队后来扩展到七人，一共合并了约 1,500 个 PR，平均每人每天 3.5 个。

起初的进展出乎意料地慢。Codex 并不差，但它缺少足够完整的工具和结构去推进那些高层次的目标。三个工程师慢慢摸到了门道：把大的目标拆成小的积木块——设计、编码、审查、测试——让 agent 逐个搭建，再用这些积木去组合更复杂的任务。每当某件事做砸了，问题几乎从来不是"不够努力"，而是 agent 还缺什么——缺的能力能不能用一种既可理解又可执行的方式补上去。

这个实验直接印证了本讲的核心论点：**同一个模型，在空白环境里和在有完整 harness 的环境里，产出有本质差异。** 模型没变，变的是环境。

> 来源：[OpenAI: Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)

## 一个更接地气的例子

一个团队用 Claude Sonnet 给一个中等规模的 Python Web 应用（FastAPI + PostgreSQL + Redis，约 15,000 行代码）添加新的 API 端点。

起初他们只给了一句话："在 `/api/v2/users` 下添加用户偏好设置端点"。结果呢？agent 把大量时间花在探索仓库结构上，产出了看似合理的代码但没遵循项目的错误处理模式，用了旧版 SQLAlchemy 语法，宣称完成但端点实际有运行时错误。下一个会话还得重新做发现工作。

后来他们加了 `AGENTS.md`（描述项目架构和技术栈版本）、显式的验证命令（`pytest tests/api/v2/ && python -m mypy src/`）、和架构决策记录。同一个模型开始遵循项目约定，并用能执行的命令检查工作。

模型没变。变的还是 harness。

## 核心要点

- 模型能力和执行可靠性是两回事，千里马也得配上好马具。
- 失败的时候先看 harness，再看模型。换模型是成本最高的选择，而且很多时候根本不是模型的问题。
- 每次失败都是一个信号：你的 harness 有结构性缺陷。把它找出来、修掉。
- 遇到失败不要笼统地说"模型不行"。任务没交代清楚、上下文不够、环境没配好、验证手段缺失、上一个会话做到哪了新会话接不上，五个地方逐个排查，问题十有八九出在其中一层。
- 一个 `AGENTS.md` 文件可能比你换一个更贵的模型更有效。

## 延伸阅读

- [OpenAI: Harness Engineering — Leveraging Codex in an Agent-First World](https://openai.com/index/harness-engineering/)
- [Anthropic: Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [HumanLayer: Skill Issue — Harness Engineering for Coding Agents](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents)
- [SWE-bench Leaderboard](https://www.swebench.com/)
- [Thoughtworks Technology Radar: Harness Engineering](https://www.thoughtworks.com/radar)

## 练习

1. **对比实验**：选一个你熟悉的代码仓库和一项非平凡的修改任务。先不给任何 harness 支持，让 agent 跑一次，记录失败。然后加一个 `AGENTS.md` 和显式的验证命令，让同一个 agent 再跑一次。对比两次的结果，把失败归因到五层防御中的某一层。

2. **验证缺口测量**：选 5 个编码任务，在每个任务完成后记录 agent 是否声称完成，然后用独立测试验证实际正确性。计算 agent 在实际没完成时声称完成的比例——这就是你的验证缺口。然后想想：加什么验证命令能把这个比例降下来？

3. **诊断循环实践**：找一个 agent 在你的项目中反复失败的任务。跑一次，记录失败。归因到五层中的某一层。修那一层。再跑。重复三到五轮，记录每一轮的改善。
