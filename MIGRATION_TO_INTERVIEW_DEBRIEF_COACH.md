# Codex 改造说明：将 `learn-harness-engineering` 重造成「AI 面试复盘教练」课程项目

> 请把这份文件作为 Codex / coding agent 的执行说明。  
> 目标不是只改 README，也不是给原项目换皮；目标是把整个课程项目从「Electron 个人知识库桌面应用」重造为「Electron AI 面试复盘桌面应用」，同时保留原课程的 harness engineering 教学结构：12 个 lecture、6 个 project、starter/solution、shared app、resource templates、benchmark、cleanup scanner、progress log、feature list、session handoff。

---

## 0. 执行身份与总目标

你是 Codex，正在一个 fork 后的 `walkinglabs/learn-harness-engineering` 仓库中工作。

当前上游项目的 capstone 是：

```text
Electron-based personal knowledge base desktop app
```

新的 capstone 要改造成：

```text
Electron-based AI Interview Debrief Coach desktop app
```

中文定位：

```text
一个基于 Electron 的本地优先 AI 面试复盘桌面应用。
用户上传面试录音或 transcript 后，系统生成带时间戳证据的面试复盘报告，分析：
- 面试官追问逻辑
- 技术深度漏洞
- 项目证据链缺口 / 项目真实性表达风险
- 卡顿、停顿、填充词和表达结构问题
- 面试风险点
- 后续训练建议
```

课程定位：

```text
通过构建一个真实的 AI 面试复盘桌面应用，学习如何让 AI coding agent 在真实工程任务中稳定、可验证、可恢复地工作。
```

仓库建议新名称：

```text
learn-interview-harness-engineering
```

产品建议名称：

```text
Interview Debrief Coach
```

---

## 1. 改造原则

### 1.1 保留的东西

保留原项目的教学骨架，不要把它改成普通应用仓库。

必须保留并迁移这些结构：

```text
README.md
CLAUDE.md / AGENTS.md 风格说明
package.json
.github/workflows/
docs/
docs-readme/
projects/
projects/shared/
projects/project-01/
projects/project-02/
projects/project-03/
projects/project-04/
projects/project-05/
projects/project-06/
scripts/
skills/
```

必须保留这些教学模式：

```text
12 lectures
6 hands-on projects
starter / solution 对比
P(N+1) starter 来自 P(N) solution
resource library templates
AGENTS.md
feature_list.json
init.sh
session-handoff.md
progress log
clean-state-checklist.md
evaluator-rubric.md
benchmark.sh
cleanup-scanner.sh
check-architecture.sh
```

### 1.2 需要替换的东西

把所有“个人知识库 / 文档库 / 文档导入 / 索引 / 文档问答 / citation”相关产品内容，替换为“面试复盘 / transcript / 面试会话 / 追问链 / 风险分析 / 时间戳证据”。

替换映射：

| 原知识库项目 | 新面试复盘项目 |
|---|---|
| Knowledge Base Desktop App | Interview Debrief Coach |
| document library | interview session library |
| import local documents | import interview audio or transcript |
| document list | interview session list |
| document detail | transcript timeline |
| document indexing | transcript parsing / segmentation / analysis |
| chunking | utterance parsing / question-chain segmentation |
| grounded Q&A | evidence-grounded debrief report |
| citation | timestamped evidence |
| QA panel | debrief report panel |
| answer feedback | analysis accuracy feedback |
| conversation history | debrief history / training plan history |
| indexing service | transcript parser / segmenter / analyzer |
| document chunks | utterances / follow-up chains |
| large document bug | timestamp / segmentation / long-answer bug |

### 1.3 不要做的东西

不要把应用改成雇主筛选系统。不要实现任何招聘决策功能。

禁止实现：

```text
- 候选人排名
- 是否录用 / 是否拒绝建议
- 招聘方候选人评分
- 自动筛选候选人
- 情绪识别
- 人格判断
- 诚信 / 撒谎 / 测谎判断
- 受保护特征推断，例如年龄、性别、种族、宗教、残疾、健康状态、国籍等
- 基于声音判断心理状态或情绪
```

“项目真实性”只能被表述为：

```text
项目证据链缺口 / project evidence gap
```

也就是只分析 transcript 中是否缺少可验证表达，例如：

```text
- 没有说清楚个人负责部分
- 没有说明指标来源
- 没有解释关键实现
- 没有说明 trade-off
- 没有讲线上故障、监控、回滚、压测或边界情况
```

严禁输出：

```text
候选人在撒谎
候选人项目不真实
候选人能力不行
候选人不适合录用
```

可以输出：

```text
这段回答存在项目证据链缺口：候选人描述了“我们做了订单服务”，但没有说明自己负责的接口、输入输出、指标基线或上线范围。建议补充个人职责、技术决策和验证证据。
```

---

## 2. 最终产品定义

### 2.1 产品一句话

```text
Interview Debrief Coach 是一个本地优先的 Electron 桌面应用。用户导入面试录音或带时间戳 transcript 后，系统会把面试过程切分成问题链，生成带时间戳证据的复盘报告，并给出后续训练任务。
```

### 2.2 核心用户

```text
正在准备技术面试的候选人，尤其是软件工程师、后端工程师、前端工程师、数据工程师、AI/ML 工程师、产品技术岗候选人。
```

### 2.3 用户流程

```text
1. 用户创建 interview session
2. 用户上传 transcript 或音频文件
3. 系统解析 transcript：speaker、timestamp、utterance
4. 系统识别面试官问题、候选人回答、追问链
5. 系统分析技术深度漏洞、项目证据链缺口、表达问题
6. 系统生成 risk items 和 training plan
7. 用户点击报告中的证据，跳转到 transcript 时间线
8. 用户标记某条分析是否准确
9. 系统保存复盘历史和训练建议
```

### 2.4 App 布局

建议三栏布局：

```text
┌────────────────────┬──────────────────────────────┬────────────────────────────┐
│ Interview Sessions │ Transcript Timeline           │ Debrief Report             │
│                    │                              │                            │
│ Backend Mock       │ [00:00:02] interviewer: ...  │ Follow-up Logic            │
│ System Design      │ [00:00:18] candidate: ...    │ Technical Depth Gaps       │
│ Project Deep Dive  │ [00:01:03] interviewer: ...  │ Project Evidence Gaps      │
│                    │ [00:01:20] candidate: ...    │ Speech Issues              │
│                    │                              │ Risk Items                 │
│                    │                              │ Training Plan              │
└────────────────────┴──────────────────────────────┴────────────────────────────┘
```

### 2.5 最终功能清单

```text
- 创建 / 查看 / 删除面试会话
- 导入带时间戳 transcript
- 可选：上传音频文件，但测试中必须使用 mock transcription service
- transcript timeline 展示
- speaker 修正：interviewer / candidate / unknown
- 面试官追问链分析
- 技术深度漏洞分析
- 项目证据链缺口分析
- 卡顿 / 停顿 / 填充词 / 重复表达分析
- 面试风险点生成
- 训练建议生成
- 报告条目点击后跳转 transcript 证据
- 用户反馈：准确 / 不准确 / 忽略
- 本地存储
- 结构化日志
- benchmark
- cleanup scanner
- architecture boundary check
```

---

## 3. 数据模型要求

在 `projects/shared/src/types/` 下建立或替换为以下类型。

### 3.1 `interview.ts`

```ts
export type Speaker = "interviewer" | "candidate" | "unknown";

export type InterviewType =
  | "behavioral"
  | "technical"
  | "system-design"
  | "project-deep-dive"
  | "mixed";

export interface InterviewSession {
  id: string;
  title: string;
  roleTarget: string;
  interviewType: InterviewType;
  audioPath?: string;
  transcriptPath?: string;
  createdAt: string;
  updatedAt: string;
  status: "imported" | "parsed" | "analyzing" | "analyzed" | "reviewed";
}

export interface Utterance {
  id: string;
  sessionId: string;
  speaker: Speaker;
  startMs: number;
  endMs: number;
  text: string;
  confidence?: number;
}
```

### 3.2 `analysis.ts`

```ts
export interface FollowUpChain {
  id: string;
  sessionId: string;
  topic: string;
  rootQuestionUtteranceId: string;
  utteranceIds: string[];
  depth: number;
  trigger:
    | "unclear-answer"
    | "technical-detail"
    | "ownership"
    | "tradeoff"
    | "metric"
    | "failure-case"
    | "unknown";
  summary: string;
}

export interface TechnicalGap {
  id: string;
  sessionId: string;
  category:
    | "architecture"
    | "data-structure"
    | "concurrency"
    | "database"
    | "cache"
    | "message-queue"
    | "observability"
    | "performance"
    | "tradeoff"
    | "testing"
    | "unknown";
  severity: "low" | "medium" | "high";
  explanation: string;
  evidenceUtteranceIds: string[];
}

export interface ProjectEvidenceGap {
  id: string;
  sessionId: string;
  gapType:
    | "ownership"
    | "metric"
    | "architecture"
    | "tradeoff"
    | "failure-story"
    | "implementation-detail"
    | "validation"
    | "unknown";
  explanation: string;
  evidenceUtteranceIds: string[];
}

export interface SpeechIssue {
  id: string;
  sessionId: string;
  issueType:
    | "long-pause"
    | "filler-word"
    | "repetition"
    | "interrupted-answer"
    | "unclear-structure";
  metric: number;
  explanation: string;
  evidenceUtteranceIds: string[];
}

export interface RiskItem {
  id: string;
  sessionId: string;
  title: string;
  severity: "low" | "medium" | "high";
  reason: string;
  evidenceUtteranceIds: string[];
  recommendedTrainingTaskIds: string[];
}

export interface TrainingTask {
  id: string;
  sessionId: string;
  title: string;
  taskType:
    | "rewrite-answer"
    | "mock-follow-up"
    | "deep-dive-drill"
    | "speech-practice"
    | "project-story";
  instructions: string;
  sourceRiskItemIds: string[];
}

export interface AnalysisReport {
  id: string;
  sessionId: string;
  createdAt: string;
  followUpChains: FollowUpChain[];
  technicalGaps: TechnicalGap[];
  projectEvidenceGaps: ProjectEvidenceGap[];
  speechIssues: SpeechIssue[];
  riskItems: RiskItem[];
  trainingPlan: TrainingTask[];
}
```

### 3.3 `transcript.ts`

```ts
export interface TranscriptParseResult {
  utterances: Utterance[];
  errors: TranscriptParseError[];
}

export interface TranscriptParseError {
  lineNumber: number;
  rawLine: string;
  reason: string;
}
```

---

## 4. Transcript 格式与 parser 要求

### 4.1 必须支持的格式

parser 至少支持以下格式：

```text
[00:02] interviewer: 介绍一下你最近做的订单系统项目。
[00:15] candidate: 这个项目主要是我们做了一个订单服务。

[00:01:02] interviewer: 幂等是怎么做的？
[00:01:08] candidate: 当时我们用了 Redis。

[00:01:02.500] interviewer: 你具体负责哪一块？
[00:01:10.250] candidate: 嗯，主要是参与后端开发。
```

speaker alias 必须支持中英文：

```text
interviewer
面试官
hr
candidate
候选人
me
我
unknown
未知
```

### 4.2 Parser 行为

```text
- 空行忽略
- timestamp 转换为 startMs
- endMs 默认等于下一个 utterance 的 startMs；最后一句可设为 startMs + 2000
- 无法解析的行不要直接丢弃，要进入 errors
- parser 不应该访问 UI
- parser 不应该调用 LLM
- parser 必须有单元测试
```

### 4.3 测试样例

在 `projects/shared/fixtures/interviews/` 下放入：

```text
backend-project-depth.transcript
system-design-cache.transcript
frontend-performance.transcript
ml-project-ownership.transcript
behavioral-leadership.transcript
```

每个 transcript 对应一个 expected 文件：

```text
projects/shared/fixtures/gold/backend-project-depth.expected.json
projects/shared/fixtures/gold/system-design-cache.expected.json
projects/shared/fixtures/gold/frontend-performance.expected.json
projects/shared/fixtures/gold/ml-project-ownership.expected.json
projects/shared/fixtures/gold/behavioral-leadership.expected.json
```

---

## 5. Shared app 改造要求

`projects/shared/` 是所有 project 的基础。必须把它从知识库 app 改造成面试复盘 app。

### 5.1 `projects/shared/package.json`

修改：

```json
{
  "name": "interview-debrief-coach",
  "description": "Electron-based AI interview debrief coach with transcript import, follow-up analysis, evidence-grounded risk reports, and training plans"
}
```

保留 Electron、React、TypeScript、Vite、Vitest 技术栈。

可以新增轻量依赖，但不要引入重型音频、云 API、数据库、LLM SDK，除非有 mock 和测试隔离。

### 5.2 服务层文件

在 `projects/shared/src/services/` 下建立或替换：

```text
transcript-parser.ts
interview-session-store.ts
question-chain-segmenter.ts
speech-metrics.ts
technical-gap-analyzer.ts
project-evidence-gap-analyzer.ts
risk-analyzer.ts
training-plan-generator.ts
analysis-pipeline.ts
safety-boundary-checker.ts
logger.ts
```

服务职责：

```text
transcript-parser.ts
  - 输入 transcript text
  - 输出 utterances + parse errors

interview-session-store.ts
  - 本地保存 sessions、utterances、reports、feedback
  - 可以用 JSON 文件或 local storage mock

question-chain-segmenter.ts
  - 输入 utterances
  - 输出 follow-up chains
  - 根据 interviewer 问句、candidate 回答、继续追问进行分段

speech-metrics.ts
  - 输入 utterances
  - 输出 long pause、filler words、repetition 等 SpeechIssue

technical-gap-analyzer.ts
  - 输入 utterances + chains
  - 输出 TechnicalGap[]
  - 只能基于 evidence，不得编造

project-evidence-gap-analyzer.ts
  - 输入 utterances + chains
  - 输出 ProjectEvidenceGap[]
  - 只分析证据链缺口，不判断真假

risk-analyzer.ts
  - 输入 gaps + speech issues + chains
  - 输出 RiskItem[]
  - 每个 risk item 必须有 evidenceUtteranceIds

training-plan-generator.ts
  - 输入 RiskItem[]
  - 输出 TrainingTask[]
  - 每个 task 必须关联 sourceRiskItemIds

analysis-pipeline.ts
  - 串联 parse -> segment -> analyze -> report
  - 提供 fixture pipeline 和 UI 使用的统一入口

safety-boundary-checker.ts
  - 检查 report 是否含有禁止表述
  - 检查 risk item 是否都有证据
  - 检查是否出现 hiring decision / lie detection / protected attribute inference

logger.ts
  - 结构化日志
```

### 5.3 UI 组件

在 `projects/shared/src/renderer/components/` 下建立或替换：

```text
InterviewSessionSidebar.tsx
TranscriptTimeline.tsx
UtteranceRow.tsx
DebriefReportPanel.tsx
FollowUpChainView.tsx
TechnicalGapList.tsx
ProjectEvidenceGapList.tsx
SpeechIssueList.tsx
RiskItemList.tsx
TrainingPlanPanel.tsx
EvidenceChip.tsx
AnalysisFeedbackControls.tsx
EmptyState.tsx
StatusBar.tsx
```

UI 要求：

```text
- 左侧显示 interview sessions
- 中间显示 transcript timeline
- 右侧显示 debrief report
- 点击 evidence chip 后，高亮对应 utterance
- report 中所有风险点必须展示 evidence
- 没有 report 时显示 empty state
- 有 parse errors 时显示 warning，不要静默失败
```

### 5.4 IPC / preload

如果原 app 已经有 Electron IPC，需要替换为面试相关 API：

```ts
window.interviewCoach = {
  listSessions(): Promise<InterviewSession[]>;
  importTranscript(input: ImportTranscriptInput): Promise<InterviewSession>;
  getTranscript(sessionId: string): Promise<Utterance[]>;
  analyzeSession(sessionId: string): Promise<AnalysisReport>;
  getReport(sessionId: string): Promise<AnalysisReport | null>;
  saveFeedback(input: AnalysisFeedbackInput): Promise<void>;
};
```

不要让 renderer 直接访问 Node 文件系统。

---

## 6. Safety boundary 文档要求

新增：

```text
docs/SAFETY_BOUNDARIES.md
projects/shared/docs/SAFETY_BOUNDARIES.md
```

内容必须包含：

```text
# Safety Boundaries

This app is candidate-owned interview coaching software.
It is not an employer-side hiring, screening, ranking, or rejection system.

Allowed:
- summarize interview transcript
- identify follow-up chains
- identify evidence gaps in project storytelling
- identify technical depth gaps based on transcript evidence
- identify objective speech metrics such as long pauses, filler words, repetition, and unclear structure
- generate training tasks tied to transcript evidence

Disallowed:
- hiring recommendation
- candidate ranking
- reject / advance decision
- lie detection
- honesty judgment
- emotion recognition
- personality diagnosis
- protected characteristic inference
- health, disability, age, gender, race, religion, nationality inference

Project authenticity rule:
Use "project evidence gap" only.
Never claim the candidate lied or fabricated experience.
```

`AGENTS.md` 也必须包含这些规则。

---

## 7. 6 个 Project 的改造方案

### 7.1 Project 01：Prompt-only vs Rules-first

#### 新名称

```text
Project 01: Prompt-only vs Rules-first for Interview Debrief Apps
```

#### 教学目标

比较：

```text
只给 agent 一句“做个面试复盘 App”
vs
给 agent AGENTS.md + init.sh + feature_list.json + fixture transcript
```

#### 产品目标

starter / solution 都围绕最小 app：

```text
- Electron 应用能启动
- 左侧显示固定 interview session
- 中间显示 sample transcript
- 右侧显示静态 debrief summary
- 不接真实 LLM
- 不接真实音频转写
```

#### starter 状态

```text
- 极简 Electron app
- 可启动
- 有 sample transcript
- 没有完整 harness 或只有弱 harness
```

#### solution 状态

```text
- 有 AGENTS.md
- 有 init.sh
- 有 feature_list.json
- 有 parser test
- 有静态 debrief report UI
- 有 progress log
```

#### 需要替换的内容

把 README-CN.md、README.md 中所有知识库内容替换为面试复盘内容。

#### 验收标准

```text
npm install
npm run check
npm run test
npm run build
npm run dev 可启动
sample transcript 可见
Debrief Summary 可见
```

---

### 7.2 Project 02：Agent-readable Interview Workspace

#### 新名称

```text
Project 02: Agent-readable Interview Workspace
```

#### 教学目标

让 agent 不靠猜业务规则，而是从 repo 文档中读取：

```text
- 产品定义
- 数据模型
- transcript 格式
- 面试分析模型
- safety boundaries
- 架构边界
```

#### 产品目标

```text
- 支持导入 transcript 文件
- 解析 timestamp / speaker / text
- 保存 InterviewSession
- 重启后保留历史 session
- UI 显示 parse errors
```

#### 新增文档

```text
docs/PRODUCT.md
docs/ARCHITECTURE.md
docs/DATA_MODEL.md
docs/INTERVIEW_ANALYSIS_MODEL.md
docs/SAFETY_BOUNDARIES.md
```

#### 关键服务

```text
transcript-parser.ts
interview-session-store.ts
```

#### 测试

```text
transcript-parser.test.ts
interview-session-store.test.ts
```

#### 验收标准

```text
- parser 支持 [mm:ss]、[hh:mm:ss]、[hh:mm:ss.mmm]
- speaker alias 支持中文和英文
- invalid lines 进入 parse errors
- session 持久化可测试
- UI 能显示导入结果
```

---

### 7.3 Project 03：Multi-session Continuity

#### 新名称

```text
Project 03: Multi-session Continuity for Interview Analysis
```

#### 教学目标

训练跨会话持续开发：

```text
- progress log
- session handoff
- feature list 状态
- analysis 状态机
- 未完成 feature 不能标记 done
```

#### 产品目标

```text
- session 状态机：imported / parsed / analyzing / analyzed / reviewed
- 支持 analyze session
- 保存 AnalysisReport
- UI 显示 report 状态
- 可以从中断状态恢复
```

#### 新增模型

```text
AnalysisReport
FollowUpChain
TechnicalGap
ProjectEvidenceGap
SpeechIssue
RiskItem
TrainingTask
```

#### 新增服务

```text
analysis-pipeline.ts
question-chain-segmenter.ts
```

#### 新增 harness 文件

```text
session-handoff.md
claude-progress.md
clean-state-checklist.md
```

#### 验收标准

```text
- analyzeSession 可从 utterances 生成初版 report
- report 可持久化
- feature_list.json 状态准确
- session-handoff.md 说明下一步工作
- npm run test 通过
```

---

### 7.4 Project 04：Runtime Feedback and Structural Control

#### 新名称

```text
Project 04: Runtime Feedback and Structural Control for Transcript Analysis
```

#### 教学目标

让 agent 通过日志和结构化边界定位运行时问题，而不是靠猜。

#### 产品目标

```text
- 加入结构化 logger
- import / parse / segment / analyze 都产生日志
- 加入 architecture boundary check
- 植入并修复一个 transcript segmentation 或 timestamp bug
```

#### 建议植入 bug

选择一个：

```text
Bug A:
当 timestamp 是 [00:01:02.500] 时，parser 错误丢弃毫秒，导致停顿计算错误。

Bug B:
当候选人连续回答超过 90 秒时，segmenter 错误拆成两个 follow-up chain。

Bug C:
当 transcript 中有中文 speaker alias “面试官”时，parser 把 speaker 识别为 unknown。
```

#### 新增脚本

```text
scripts/check-architecture.sh
scripts/run-fixture-analysis.sh
scripts/verify-segmentation.sh
```

#### 新增测试

```text
question-chain-segmenter.test.ts
speech-metrics.test.ts
analysis-pipeline.test.ts
```

#### 验收标准

```text
- 有复现 bug 的 fixture
- 有修复前失败、修复后通过的测试
- 日志能定位 parse / segment / analyze 阶段
- check-architecture.sh 通过
- clean-state-checklist.md 存在
```

---

### 7.5 Project 05：Evaluator Loops and Three-role Upgrades

#### 新名称

```text
Project 05: Evaluator Loops and Three-role Upgrades for Risk Analysis
```

#### 教学目标

对比三种 agent 工作模式：

```text
single-role
  一个 agent 完成规划、实现、自评

gen-eval
  generator 实现，evaluator 根据 rubric 评估并要求修订

plan-gen-eval
  planner 写 sprint contract，generator 实现，evaluator 严格评分
```

#### 产品目标固定为同一个功能

实现：

```text
Risk Analyzer
```

Risk Analyzer 必须：

```text
- 从 follow-up chains、technical gaps、project evidence gaps、speech issues 生成 RiskItem[]
- 每个 RiskItem 必须有 severity、reason、evidenceUtteranceIds、recommendedTrainingTaskIds
- 禁止无证据评价
- 禁止 hiring decision
- 禁止 lie detection
- 禁止 emotion/personality/protected attribute inference
```

#### 目录要求

```text
projects/project-05/starter/
projects/project-05/solution/single-role/
projects/project-05/solution/gen-eval/
projects/project-05/solution/plan-gen-eval/
```

#### evaluator rubric

在每个 solution variant 下提供：

```text
evaluator-rubric.md
```

评分维度：

```text
1. Evidence grounding：每个 risk 是否有 transcript evidence
2. Specificity：是否指出具体回答片段，而不是泛泛而谈
3. Non-hallucination：是否编造 transcript 中不存在的信息
4. Safety boundary：是否避免招聘决策、测谎、情绪、人格、受保护特征推断
5. Training usefulness：建议是否能转成练习任务
6. UI integration：报告是否能跳转 transcript evidence
```

#### 验收标准

```text
- 三个 solution 目录都能 npm install / npm run test / npm run check
- 三个变体实现同一个功能，唯一差异是 harness 角色分工
- gen-eval 和 plan-gen-eval 必须有修订证据
- plan-gen-eval 必须有 sprint-contract.md
```

---

### 7.6 Project 06：Complete Interview Debrief Harness

#### 新名称

```text
Project 06: Complete Interview Debrief Harness Capstone
```

#### 教学目标

构建完整产品 + 完整 harness，并对比弱 harness 和强 harness 的差异。

#### starter 状态

```text
- 产品功能大体可用
- 只有基础 AGENTS.md
- 缺少 feature_list.json
- 缺少 session-handoff.md
- 缺少 clean-state-checklist.md
- 缺少 benchmark.sh
- 缺少 cleanup-scanner.sh
- 缺少完整 reliability docs
```

#### solution 状态

```text
- 完整产品
- 完整 harness
- 完整 benchmark
- 完整 cleanup scanner
- 完整 evaluator rubric
- 完整 quality-document.md
```

#### 最终产品功能

```text
- 上传 / 导入 transcript
- 可选音频上传入口，但使用 mock transcription
- 创建 interview session
- transcript timeline
- speaker 修正
- question chain 分析
- 面试官追问逻辑图
- 技术深度漏洞分析
- 项目证据链缺口分析
- 卡顿 / 停顿 / filler word 分析
- 风险报告
- 后续训练计划
- 用户反馈
- 时间戳证据跳转
- 本地存储和删除
- 结构化日志
```

#### 完整 harness 文件

```text
AGENTS.md
CLAUDE.md
feature_list.json
init.sh
session-handoff.md
claude-progress.md
clean-state-checklist.md
evaluator-rubric.md
quality-document.md
docs/PRODUCT.md
docs/ARCHITECTURE.md
docs/DATA_MODEL.md
docs/INTERVIEW_ANALYSIS_MODEL.md
docs/SAFETY_BOUNDARIES.md
docs/RELIABILITY.md
scripts/benchmark.sh
scripts/cleanup-scanner.sh
scripts/check-architecture.sh
scripts/run-fixture-analysis.sh
```

#### benchmark 指标

```text
- transcript parser fixture pass rate
- follow-up chain expected count match
- risk item evidence coverage: 100%
- safety boundary violation count: 0
- hallucinated risk count: 0
- training task linkage coverage: 100%
- architecture check pass
- cleanup scanner pass
```

#### 验收标准

```text
./init.sh
npm run check
npm run test
npm run build
./scripts/benchmark.sh
./scripts/cleanup-scanner.sh
./scripts/check-architecture.sh
```

---

## 8. 12 个 Lecture 的改造方案

保留 12 讲结构，但把所有例子换成 Interview Debrief Coach。

### Lecture rename map

```text
lecture-01: Strong models still fail on real interview-analysis apps
lecture-02: What harness means for AI interview debrief systems
lecture-03: Repository as the single source of truth for interview analysis
lecture-04: Split instructions across product, architecture, data, and safety docs
lecture-05: Keeping context alive across multi-session feature development
lecture-06: Why initialization matters before touching transcript analysis code
lecture-07: Why agents overreach on audio, LLM, UI, and analysis features
lecture-08: Feature lists as harness primitives for interview debrief apps
lecture-09: Why agents declare victory before reports are evidence-grounded
lecture-10: Why end-to-end fixture pipelines change results
lecture-11: Why observability belongs inside transcript analysis harnesses
lecture-12: Why every session must leave clean state and restartable handoff
```

### 每讲替换原则

把原来的例子：

```text
文档导入失败
索引失败
问答没 citation
大文件 chunk bug
conversation history
知识库 benchmark
```

替换成：

```text
transcript 导入失败
timestamp parser 失败
面试分析没有 evidence
长回答 segmentation bug
debrief history / training plan
面试复盘 benchmark
```

### 不要丢掉理论

课程核心仍然是 harness engineering，不是面试技巧课。

每讲都应该围绕一个 harness 概念：

```text
Instructions
State
Verification
Scope
Session lifecycle
Observability
Evaluator loops
Clean handoff
```

面试复盘只是应用载体。

---

## 9. Resource Library / Skills 改造

### 9.1 Resource templates

在 `docs/resources/` 或现有 resource library 下新增 / 替换：

```text
AGENTS-interview-template.md
feature-list-interview-template.json
init-interview-template.sh
session-handoff-interview-template.md
clean-state-checklist-interview-template.md
evaluator-rubric-interview-template.md
safety-boundaries-template.md
interview-analysis-model-template.md
```

### 9.2 `skills/harness-creator/`

如果原仓库里有 skill 用于创建 harness，需要把示例从 knowledge base 改成 interview debrief。

Skill 输出应该能生成：

```text
AGENTS.md
feature_list.json
init.sh
session-handoff.md
clean-state-checklist.md
docs/PRODUCT.md
docs/ARCHITECTURE.md
docs/SAFETY_BOUNDARIES.md
```

---

## 10. AGENTS.md 要求

所有 project starter / solution 中的 `AGENTS.md` 必须包含以下核心规则。

```md
# AGENTS.md

## Product Context

This repository builds Interview Debrief Coach: a candidate-owned desktop app for interview self-review.
Users import interview transcripts or recordings. The app generates evidence-grounded debrief reports with timestamped transcript references.

## Hard Safety Boundaries

This app is not an employer-side hiring tool.
Do not implement candidate ranking, hiring recommendation, rejection recommendation, lie detection, emotion recognition, personality diagnosis, or protected-characteristic inference.

"Project authenticity" must be implemented only as "project evidence gap" analysis.
Never claim a candidate lied or fabricated experience.

Every risk item must include transcript evidence.
If evidence is missing, say insufficient evidence instead of guessing.

## Development Rules

1. Read feature_list.json before changing code.
2. Work on one feature at a time.
3. Do not rewrite unrelated files.
4. Do not add real external AI, transcription, or cloud APIs unless the feature explicitly asks for an adapter and a mock.
5. Do not declare done until tests, type-check, and relevant fixture pipeline pass.
6. Update progress log and session handoff after meaningful work.
7. Preserve Electron boundaries: renderer must not access filesystem directly.
8. Services must be testable without UI.
9. All analysis outputs must be evidence-grounded.
10. Run cleanup scanner before final handoff when available.
```

---

## 11. feature_list.json 模板

在 project-06 solution 中至少包含以下 feature list：

```json
{
  "features": [
    {
      "id": "F01_SESSION_LIST",
      "title": "Display interview session list",
      "status": "done",
      "definitionOfDone": [
        "Sessions render in the sidebar",
        "Empty state is visible",
        "Unit tests pass"
      ]
    },
    {
      "id": "F02_TRANSCRIPT_IMPORT",
      "title": "Import timestamped transcript files",
      "status": "done",
      "definitionOfDone": [
        "Parser supports [mm:ss], [hh:mm:ss], and [hh:mm:ss.mmm] formats",
        "Invalid lines produce structured parse errors",
        "Fixture tests cover interviewer and candidate speakers"
      ]
    },
    {
      "id": "F03_FOLLOW_UP_CHAINS",
      "title": "Detect interviewer follow-up chains",
      "status": "done",
      "definitionOfDone": [
        "Each chain has a root question",
        "Each chain includes utterance evidence",
        "Fixture analysis matches expected chain count"
      ]
    },
    {
      "id": "F04_TECHNICAL_GAP_ANALYSIS",
      "title": "Detect technical depth gaps",
      "status": "done",
      "definitionOfDone": [
        "Gaps are tied to transcript evidence",
        "Categories are stable and documented",
        "No unsupported technical claims are generated"
      ]
    },
    {
      "id": "F05_PROJECT_EVIDENCE_GAP_ANALYSIS",
      "title": "Detect project evidence gaps",
      "status": "done",
      "definitionOfDone": [
        "Analyzer uses project evidence gap language only",
        "Analyzer never claims lying or fabrication",
        "Each gap has evidence utterances"
      ]
    },
    {
      "id": "F06_SPEECH_METRICS",
      "title": "Measure pauses, filler words, and unclear structure",
      "status": "done",
      "definitionOfDone": [
        "Long pauses are calculated from timestamps",
        "Filler words are counted deterministically",
        "Speech issues include evidence utterances"
      ]
    },
    {
      "id": "F07_RISK_ANALYZER",
      "title": "Generate evidence-grounded risk items",
      "status": "done",
      "definitionOfDone": [
        "Every risk item has severity, reason, and evidence",
        "No unsupported claims are generated",
        "Safety boundary checker passes"
      ]
    },
    {
      "id": "F08_TRAINING_PLAN",
      "title": "Generate follow-up training tasks",
      "status": "done",
      "definitionOfDone": [
        "Each task maps to at least one risk item",
        "Tasks are actionable",
        "Tasks render in the UI"
      ]
    },
    {
      "id": "F09_EVIDENCE_NAVIGATION",
      "title": "Jump from report evidence to transcript utterances",
      "status": "done",
      "definitionOfDone": [
        "Evidence chips render timestamps",
        "Clicking a chip highlights the utterance",
        "Missing evidence IDs are handled safely"
      ]
    },
    {
      "id": "F10_BENCHMARK_AND_CLEANUP",
      "title": "Benchmark and cleanup scanner",
      "status": "done",
      "definitionOfDone": [
        "benchmark.sh runs fixture analysis",
        "cleanup-scanner.sh detects stale artifacts",
        "quality-document.md records results"
      ]
    }
  ]
}
```

---

## 12. Fixture 内容要求

至少创建 5 份 transcript fixture。

### 12.1 `backend-project-depth.transcript`

主题：订单系统 / 幂等 / Redis / MQ / 个人职责不清。

必须包含：

```text
- 面试官问项目介绍
- 候选人多次说“我们做了”
- 面试官追问个人职责
- 面试官追问幂等
- 候选人只说 Redis，没有讲 requestId、幂等表、重试、补偿
- 有 1 个长停顿
```

### 12.2 `system-design-cache.transcript`

主题：缓存系统设计。

必须包含：

```text
- 面试官追问缓存一致性
- 候选人只说“加 Redis”
- 缺少失效策略、穿透、击穿、雪崩、监控
```

### 12.3 `frontend-performance.transcript`

主题：前端性能优化。

必须包含：

```text
- 候选人说性能提升 30%
- 没有说明指标来源、基线、测量工具
- 面试官追问 Lighthouse / Web Vitals
```

### 12.4 `ml-project-ownership.transcript`

主题：机器学习项目参与深度。

必须包含：

```text
- 候选人说用了 embedding / model / training
- 面试官追问训练数据、loss、评估指标
- 候选人承认主要是算法同事负责
- 项目证据链缺口应被识别为 ownership / implementation-detail
```

### 12.5 `behavioral-leadership.transcript`

主题：行为面 / 项目冲突。

必须包含：

```text
- STAR 结构不完整
- 缺少 action 和 result
- 高频填充词
- 面试官要求“具体一点”
```

---

## 13. 测试要求

### 13.1 Unit tests

必须添加：

```text
src/services/transcript-parser.test.ts
src/services/question-chain-segmenter.test.ts
src/services/speech-metrics.test.ts
src/services/technical-gap-analyzer.test.ts
src/services/project-evidence-gap-analyzer.test.ts
src/services/risk-analyzer.test.ts
src/services/training-plan-generator.test.ts
src/services/safety-boundary-checker.test.ts
```

### 13.2 Fixture pipeline tests

添加脚本：

```text
npm run analyze:fixture backend-project-depth
npm run eval:report backend-project-depth
```

如果 package scripts 不适合参数，可以提供：

```text
node scripts/run-fixture-analysis.js backend-project-depth
node scripts/evaluate-report.js backend-project-depth
```

### 13.3 Safety tests

`safety-boundary-checker.test.ts` 必须包含：

```text
- 含有 “hire / reject / ranking / lying / fabricated / emotion / personality” 时失败
- 含有 “撒谎 / 造假 / 录用 / 拒绝 / 排名 / 情绪 / 人格” 时失败
- RiskItem 没有 evidenceUtteranceIds 时失败
- TrainingTask 没有 sourceRiskItemIds 时失败
```

### 13.4 UI tests

如果项目没有 React Testing Library，不强行引入。至少保证：

```text
- build 通过
- type-check 通过
- components 接口类型正确
- fixture report 可渲染
```

---

## 14. Scripts 要求

### 14.1 `init.sh`

应执行：

```sh
#!/usr/bin/env bash
set -euo pipefail

npm install
npm run check
npm run test
npm run build
```

如果 project 有 fixture pipeline，还要执行：

```sh
./scripts/run-fixture-analysis.sh backend-project-depth
```

### 14.2 `scripts/check-architecture.sh`

检查：

```text
- renderer 不直接 import fs / path / electron main APIs
- services 不 import React
- preload 只暴露白名单 API
- analyzer 不访问 DOM
- parser 不调用 LLM / network
```

### 14.3 `scripts/benchmark.sh`

执行：

```text
- 所有 fixture analysis
- evaluator report
- safety boundary checker
- evidence coverage check
- 输出 artifacts/benchmark-results.json
```

输出字段建议：

```json
{
  "fixturesRun": 5,
  "parserPassRate": 1,
  "riskEvidenceCoverage": 1,
  "trainingTaskLinkageCoverage": 1,
  "safetyViolations": 0,
  "hallucinatedRiskCount": 0,
  "architectureCheck": "pass"
}
```

### 14.4 `scripts/cleanup-scanner.sh`

检查：

```text
- artifacts/ 下是否有 stale report
- 是否有临时音频文件
- 是否有未引用 fixture output
- feature_list.json 是否有 status 冲突
- claude-progress.md 是否更新
- session-handoff.md 是否存在
- npm run test 是否通过
```

---

## 15. README 改造要求

根目录 `README.md` 要重写为：

```md
# Learn Interview Harness Engineering

A project-based course on building reliable AI coding-agent workflows through a real desktop application: an AI-powered interview debrief coach.

Across six projects, you will build a local-first Electron app that imports interview transcripts or recordings, analyzes interviewer follow-up logic, detects technical depth gaps, identifies project evidence gaps, measures objective speech clarity issues, and generates evidence-grounded training plans.

This is not a hiring, screening, ranking, or lie-detection tool. It is a candidate-owned coaching tool.

The product evolves with your harness:

- Project 01: Prompt-only vs Rules-first
- Project 02: Agent-readable Interview Workspace
- Project 03: Multi-session Continuity
- Project 04: Runtime Feedback and Structural Control
- Project 05: Evaluator Loops and Three-role Upgrades
- Project 06: Complete Interview Debrief Harness
```

中文版 README-CN 或 docs 中文页要写：

```md
# Learn Interview Harness Engineering

这是一个基于项目的 AI coding agent 工程课程。

你将通过构建一个真实的 Electron 桌面应用，学习如何让 coding agent 在复杂工程任务中稳定工作。最终应用是一个 AI 面试复盘教练：用户上传面试录音或 transcript 后，系统会分析面试官追问逻辑、技术深度漏洞、项目证据链缺口、卡顿停顿问题、面试风险点，并生成带时间戳证据的训练建议。

本项目不是招聘筛选系统，不用于候选人排名、录用建议、拒绝建议、测谎或情绪识别。它是候选人自用的复盘与训练工具。
```

---

## 16. 文案替换规则

全仓库搜索并替换以下概念。不要做机械替换后不读上下文。每处都要保证语义成立。

```text
Knowledge Base -> Interview Debrief Coach
personal knowledge base -> interview debrief coach
document library -> interview session library
document -> interview transcript / interview session，按上下文决定
import documents -> import transcripts
index documents -> parse and analyze transcripts
chunks -> utterances / follow-up chains
Q&A -> debrief report / analysis
QA panel -> debrief report panel
grounded answers -> evidence-grounded debrief reports
citations -> timestamped evidence
conversation history -> debrief history / training plan history
IndexingService -> TranscriptParser / AnalysisPipeline
DocumentList -> InterviewSessionSidebar
DocumentDetail -> TranscriptTimeline
```

不要把课程理论里的 generic “harness” 改掉。

---

## 17. 质量文档要求

`quality-document.md` 应包含：

```text
# Quality Document

## Product quality
- Transcript import works
- Analysis report is evidence-grounded
- Evidence navigation works
- Safety boundary checker passes

## Harness quality
- AGENTS.md completeness
- feature_list.json accuracy
- init.sh reproducibility
- session handoff quality
- progress log quality
- benchmark coverage
- cleanup scanner coverage

## Benchmark results
- fixtures run
- parser pass rate
- chain detection match
- evidence coverage
- safety violations
- cleanup scanner result

## Known limitations
- Real audio transcription is mocked
- Speaker diarization is fixture-based or user-corrected
- Technical gap detection is heuristic and evidence-grounded, not a definitive skill assessment
- Project evidence gap analysis does not determine truthfulness
```

---

## 18. 最终验收清单

完成改造后，必须确认：

```text
[ ] 根 README 已改成 Learn Interview Harness Engineering
[ ] 仍然有 12 lectures
[ ] 仍然有 6 projects
[ ] 每个 project 都有 starter / solution
[ ] Project 05 有 single-role / gen-eval / plan-gen-eval 三个 solution variant
[ ] Project 06 starter 是弱 harness，solution 是完整 harness
[ ] projects/shared package name 不再是 knowledge-base
[ ] shared app 显示 interview sessions / transcript timeline / debrief report
[ ] transcript parser 有测试
[ ] question chain segmenter 有测试
[ ] speech metrics 有测试
[ ] risk analyzer 有测试
[ ] safety boundary checker 有测试
[ ] 每个 RiskItem 都有 evidenceUtteranceIds
[ ] 每个 TrainingTask 都有 sourceRiskItemIds
[ ] 没有招聘决策功能
[ ] 没有测谎功能
[ ] 没有情绪识别功能
[ ] 没有受保护特征推断
[ ] benchmark.sh 可运行
[ ] cleanup-scanner.sh 可运行
[ ] check-architecture.sh 可运行
[ ] feature_list.json 状态准确
[ ] session-handoff.md 存在
[ ] clean-state-checklist.md 存在
[ ] quality-document.md 存在
[ ] npm run check 通过
[ ] npm run test 通过
[ ] npm run build 通过
```

---

## 19. 执行顺序

按以下顺序执行，不要跳步。

### Phase 0：Repository audit

```text
1. 列出当前顶层目录
2. 列出 docs、projects、scripts、skills 的关键文件
3. 识别所有 knowledge-base / document / indexing / Q&A 相关引用
4. 写一个 migration-notes.md，记录需要改的区域
```

### Phase 1：Global docs rename

```text
1. 改根 README
2. 改 CLAUDE.md / AGENTS 入口说明
3. 改 docs-readme / docs index
4. 改课程总览
5. 不要先大改代码
```

### Phase 2：Shared app conversion

```text
1. 改 projects/shared/package.json
2. 建立 types
3. 建立 transcript parser
4. 建立 fixtures
5. 建立 services
6. 建立 UI components
7. 改 IPC / preload
8. 跑 tests
```

### Phase 3：Project 01-06 conversion

```text
1. 先改 project README
2. 再改 starter
3. 再改 solution
4. 确保每个 project 可独立 npm install / test / check
5. P(N+1) starter 应来自 P(N) solution
```

### Phase 4：Lecture conversion

```text
1. 保留 harness 理论
2. 替换产品例子
3. 替换图示中的知识库元素
4. 补充 safety boundary 相关解释
```

### Phase 5：Scripts and benchmark

```text
1. 改 init.sh
2. 改 check-architecture.sh
3. 新增 fixture analysis scripts
4. 新增 benchmark.sh
5. 新增 cleanup-scanner.sh
```

### Phase 6：Final verification

```text
1. 全仓库 grep knowledge-base / document library / indexing / Q&A
2. 只保留必要的历史对照文案
3. 跑 npm run check / test / build
4. 跑 benchmark 和 cleanup scanner
5. 更新 quality-document.md
6. 更新 session-handoff.md
```

---

## 20. 重要实现提示

### 20.1 不要一开始接真实音频转写

真实音频转写会引入 API、网络、模型、key、成本和失败路径。课程项目应使用：

```text
- transcript import 作为主路径
- mock transcription service 作为音频路径占位
- fixture transcript 作为测试主路径
```

可以有：

```text
audioPath?: string
mockTranscriptionService.ts
```

但不要要求真实 Whisper / cloud transcription 才能跑测试。

### 20.2 分析可以先用 deterministic heuristic

核心教学目标是 harness，不是做最强 AI 分析器。

优先实现可测试的 heuristic：

```text
- 问句识别：interviewer utterance 中包含 ? / ？ / 怎么 / 为什么 / 具体 / 如何 / 哪一块
- 追问识别：同一 topic 下连续 interviewer questions
- filler words：嗯、啊、然后、就是、这个、其实、basically、like、you know
- long pause：两个 utterance 的时间间隔超过阈值
- project evidence gap：回答中出现“我们做了”，但缺少“我负责 / 我实现 / 指标 / 输入输出 / trade-off”等表达
- technical gap：出现 Redis / MQ / cache / database 等词，但缺少一致性、幂等、重试、监控、压测等细节
```

可以保留 LLM adapter 接口，但测试不得依赖 LLM。

### 20.3 所有报告必须有 evidence

任何 report item 如果没有 evidenceUtteranceIds，就不应该显示为有效分析。

UI 可以显示：

```text
Insufficient evidence
```

而不是编造。

---

## 21. 最终交付物

完成后，仓库应该像这样：

```text
learn-interview-harness-engineering/
  README.md
  CLAUDE.md
  package.json

  docs/
    lectures/
      lecture-01-why-strong-models-fail/
      ...
      lecture-12-clean-handoff/
    projects/
      project-01-prompt-only-vs-rules-first/
      project-02-agent-readable-interview-workspace/
      project-03-multi-session-continuity/
      project-04-runtime-feedback-and-structural-control/
      project-05-evaluator-loops/
      project-06-complete-interview-harness/
    resources/
      AGENTS-interview-template.md
      feature-list-interview-template.json
      clean-state-checklist-interview-template.md
      evaluator-rubric-interview-template.md
      safety-boundaries-template.md

  projects/
    shared/
      package.json
      src/
        main/
        preload/
        renderer/
          components/
            InterviewSessionSidebar.tsx
            TranscriptTimeline.tsx
            DebriefReportPanel.tsx
            EvidenceChip.tsx
            RiskItemList.tsx
            TrainingPlanPanel.tsx
        services/
          transcript-parser.ts
          interview-session-store.ts
          question-chain-segmenter.ts
          speech-metrics.ts
          technical-gap-analyzer.ts
          project-evidence-gap-analyzer.ts
          risk-analyzer.ts
          training-plan-generator.ts
          analysis-pipeline.ts
          safety-boundary-checker.ts
          logger.ts
        types/
          interview.ts
          analysis.ts
          transcript.ts
      fixtures/
        interviews/
        gold/

    project-01/
      starter/
      solution/
    project-02/
      starter/
      solution/
    project-03/
      starter/
      solution/
    project-04/
      starter/
      solution/
    project-05/
      starter/
      solution/
        single-role/
        gen-eval/
        plan-gen-eval/
    project-06/
      starter/
      solution/

  scripts/
    scaffold-project.js
    sync-shared.js

  skills/
    harness-creator/
      SKILL.md
      templates/
```

---

## 22. 完成后给用户的总结格式

Codex 完成后，最后回复用户时不要只说“完成了”。请按这个格式总结：

```text
已完成：
- 根 README 改为 Learn Interview Harness Engineering
- shared app 从 Knowledge Base 改为 Interview Debrief Coach
- 新增 transcript parser / analyzer / risk report / training plan
- 改造 Project 01-06
- 改造 lecture examples
- 新增 safety boundary docs
- 新增 benchmark / cleanup scanner

验证结果：
- npm run check: pass/fail
- npm run test: pass/fail
- npm run build: pass/fail
- benchmark.sh: pass/fail
- cleanup-scanner.sh: pass/fail

重要限制：
- 真实音频转写目前为 mock
- 分析器为 heuristic/evidence-grounded，不做招聘决策或测谎

下一步建议：
- 人工审查 Project 05 三个 solution variant 的质量差异
- 人工跑一次 Project 06 benchmark
```

