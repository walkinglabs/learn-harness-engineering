# 高级仓库模板

当你希望把仓库升级成更接近 OpenAI 文中那种 agent-first 文档面，而不只是一个最小 harness 时，就复制这套起步模板。

## 推荐复制顺序

1. 先把 `AGENTS.md` 和 `ARCHITECTURE.md` 放到仓库根目录。
2. 再复制整个 `docs/` 目录树。
3. 优先把 `docs/PRODUCT_SENSE.md`、`docs/QUALITY_SCORE.md`、
   `docs/RELIABILITY.md` 填起来。
4. 在 `docs/exec-plans/active/` 下创建你的第一份 active plan。
5. 始终保持入口文件很短，详细规则拆到链接文档里。

## 这套模板主要优化什么

- 持久、repo-local 的上下文
- 渐进披露，而不是一个超长 instruction 文件
- 明确的计划生命周期
- 随时间演化的质量追踪
- 对 agent 和人都更可读的边界

这里的每个文件都只是起点。真正投入使用前，把占位文字、示例命令和样例规则替换成你自己的项目现实。
