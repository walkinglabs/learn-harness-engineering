# 第十五讲代码

无依赖示例（Node.js + `npx tsx`，逃逸检查另需 `git`）：

- `escape-check.ts`——在会话前后给主检出目录拍快照，报告隔离被突破的情况（切换了分支、`HEAD` 移动、工作区改动、stash 变化）。不带参数运行时，会在临时仓库里跑一个完整演示。
- `merge-queue.ts`——一个内存中的按仓库合并队列：一次只合并一个，rebase 到最新基线，对组合后的结果重跑确定性检查。演示中两个分支各自通过，合在一起却搞挂了构建。
- `deps-fingerprint.ts`——给依赖清单和 lockfile 打指纹；只有指纹变化时才重新安装共享环境，新安装失败时保留旧的安装。
- `fleet-signals.ts`——基于会话对话记录的行为信号检测器：在等人、绕过权限、卡住（按不活跃而不是总运行时长判断）、重试链上限。
- `verification-verdict.md`——checker 提示词约定与结构化结论 schema（completed / actionable / external / unknown / deferred），附路由表。
