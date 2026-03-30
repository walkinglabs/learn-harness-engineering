# AGENTS.md

这个仓库面向长时运行的 coding-agent 工作流。保持这个文件简短，把它当成“唯一事实来源”文档的入口和路由层，而不是一个不断膨胀的大说明书。

## 开工流程

改代码前先做这些事：

1. 用 `pwd` 确认仓库根目录。
2. 读取 `ARCHITECTURE.md`，理解当前系统地图和硬性依赖规则。
3. 读取 `docs/QUALITY_SCORE.md`，先知道最弱的产品领域和架构层。
4. 读取 `docs/PLANS.md`，再打开当前要执行的 active plan。
5. 读取相关的 `docs/product-specs/` 规格文档。
6. 跑这个仓库约定的 bootstrap 与验证路径。
7. 如果基础验证先失败，先修 baseline，再加新范围。

## 路由地图

- `ARCHITECTURE.md`：领域地图、分层模型、依赖规则
- `docs/design-docs/index.md`：设计决策与核心信念
- `docs/product-specs/index.md`：当前产品行为与验收目标
- `docs/PLANS.md`：计划生命周期与执行计划规则
- `docs/QUALITY_SCORE.md`：产品领域与架构层健康度
- `docs/RELIABILITY.md`：运行信号、benchmark、重启要求
- `docs/SECURITY.md`：密钥、沙箱、数据和外部动作规则
- `docs/FRONTEND.md`：UI 约束、设计系统规则、可访问性检查

## 工作约定

- 一次只围绕一个有边界的计划或功能切片工作。
- 不能只靠读代码就宣布完成，必须有可运行证据。
- 只要改了行为，就同步更新对应的产品、计划或可靠性文档。
- 如果某类 review feedback 反复出现，把它升级成机械规则、检查或 linter，不要一直在聊天里重复解释。
- 生成物放进 `docs/generated/`，外部 reference 放进 `docs/references/`。
- 需要更多细节时，优先补小而新的文档，而不是继续把这个文件写长。

## 完成定义

一个改动只有在以下条件都满足时才算完成：

- 目标行为已实现
- 要求的验证真的跑过
- 证据已经挂到相关 plan 或质量文档里
- 受影响的文档仍然是最新的
- 仓库能按标准启动路径干净重启

## 收尾

结束会话前：

1. 更新当前 active execution plan。
2. 如果产品领域或架构层有明显变化，更新 `docs/QUALITY_SCORE.md`。
3. 如果有延期处理的债务，记到 `docs/exec-plans/tech-debt-tracker.md`。
4. 已完成的计划及时移到 `docs/exec-plans/completed/`。
5. 保证仓库可重启，并留下清晰的下一步动作。
