# SOP：可观测性反馈闭环

当调试太慢、agent 总在没证据的情况下宣布成功、或者运行时行为比代码本身还难看懂时，就用这份 SOP。

## 目标

给 agent 一套本地闭环，让它可以基于 logs、metrics、traces 和可重复 workload 来判断系统，而不是只靠看代码猜。

## 最小可用栈

- 应用输出结构化日志
- 条件允许时输出 metrics 和 traces
- 本地采集或 fan-out 层
- 可查询 logs / metrics / traces 的接口
- 每次改动后都能重跑的 workload 或 user journey

## 执行 SOP

1. 先定义最重要的黄金运行旅程。
2. 给启动流程和关键路径补结构化日志。
3. 在合适位置补 latency、failure count、queue depth 之类的 metrics。
4. 为慢路径或多阶段流程补 traces 或 timing 标记。
5. 让这些信号能从本地开发环境查询到。
6. 给 agent 一条可以反复重跑的 workload 或场景。
7. 强制执行这条闭环：query -> correlate -> reason -> implement -> restart
   -> rerun -> verify。

## 调试会话检查清单

- 到底哪里失败了？
- 哪条信号能证明它失败？
- 失败归属哪一层？
- 修复后哪条信号发生了变化？
- App 是否能干净重启？
- 同一 workload 重跑后是否通过？

## 完成定义

- agent 能用运行证据解释失败模式。
- 每次改动后都能重跑同一 workload。
- restart 与 rerun 已经成为正常任务循环的一部分。
- 可靠性信号已经记录到 `docs/RELIABILITY.md`。
