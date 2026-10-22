# 结构化验证结论

把它作为 checker（验证者）节点的收尾约定。checker 的最后一条消息以下面**二者之一**结尾：

- 单独一行的完成标记 `VERIFIED_COMPLETE`——仅当*当前已接受范围*内的每一项需求都有具体证据时；**或**
- 一行 `VERIFICATION_RESULT`，后面跟下方的 JSON。

## checker 指令（贴进验证者提示词）

```markdown
验证"当前已接受的范围"，它由原始请求和用户最新的指示共同决定。

- 新的用户指示覆盖旧的指示，包括缩小范围。
  "先把现有的发出去，剩下的以后再说"就是把剩余部分推迟了：把它记录为 deferred，
  不要实现它，也不要把它当成阻塞项。
- 绝不能仅仅因为工作难做或缺少证据，就自己编出一个"推迟"。
- 把每一项范围内的需求对应到具体证据（文件、测试、命令输出）。
- 已提交和未提交的改动都要检查。干净的 git status 或一个旧提交都不算证据。
- 每项检查都在前台运行并等它结束。你的回合结束时仍在运行的命令永远不会回报结果。
  "已经启动了测试"不算证据。
- 只有在被检查的文件没有变化时，才能复用本任务早先的检查结果。
- 缺少凭据、真实世界的指标或第三方审批属于 EXTERNAL，而不是代码有问题。
- 如果已接受的内容全部验证通过，以单独一行 VERIFIED_COMPLETE 结尾。
- 否则按下方 schema 以 VERIFICATION_RESULT {json} 结尾。在多次跟进之间保持缺口 id 不变，
  以便跟踪每个缺口的进展。
```

## Schema

```json
{
  "completed": ["<需求> —— <证据>"],
  "actionable": [{ "id": "<稳定的 kebab-case id>", "action": "<具体修复方式以及如何验证>" }],
  "external": ["<agent 无法控制的范围内前置条件，以及所需的证据>"],
  "unknown": ["<只有人才能回答的问题>"],
  "deferred": [{ "item": "<被推迟的工作>", "instruction": "<推迟它的那条用户指示>" }]
}
```

## 路由表

| 类别 | 下一个节点 | 是否自动重试？ |
|---|---|---|
| `VERIFIED_COMPLETE` | 人工审阅关卡 | — |
| `actionable`（非空） | 退回 **maker** 线程（绝不是 checker 的线程） | 是，直到达到链上限 |
| `external` | 人工收件箱 | 否 |
| `unknown` | 人工收件箱 | 否 |
| `deferred` | 记录在任务 / 进度文件中 | **永不** |
| 达到上限但仍有 `actionable` | 人工审阅关卡，附上剩余缺口 | 否 |

## 示例

```text
VERIFICATION_RESULT {"completed":["登录表单校验邮箱 —— login.spec.ts 通过（12/12）"],
"actionable":[{"id":"csv-export-empty-rows","action":"exportCsv 跳过空行；补一个包含两行空行的测试"}],
"external":["退款路径需要支付沙箱凭据才能端到端验证"],
"unknown":[],
"deferred":[{"item":"批量导入","instruction":"用户：'先把现有的发出去，批量导入以后再说'"}]}
```
