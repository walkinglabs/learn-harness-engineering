# Project 02: Agent-Readable Workspace

演示仓库可读性和显式连续性产物如何减少跨会话开发中的上下文丢失。

## 目录说明

| 目录 | 含义 |
|------|------|
| `starter/` | **起点**——基于 P1 solution 的代码，新增文档导入、详情视图、持久化功能待实现。harness 较弱：AGENTS.md 简陋，没有 session-handoff。 |
| `solution/` | **参考实现**——所有新功能已实现，配备完整的 workspace 文档（ARCHITECTURE.md、PRODUCT.md、session-handoff.md）。 |

## 使用方法

将 `starter/` 复制到两个隔离的工作目录，不要用两个分支。每次只运行其中一份，归档时不要让下一轮 agent 访问上一轮的结果。在每份副本中执行 `npm install`，并使用相同的 agent 和任务提示词。

1. **基线组：** 开始时保留 starter 自带的 harness，包括 `docs/` 和 `feature_list.json`；不写交接文件。
2. **改进组：** 开始前只将 `AGENTS.md` 替换为 [`solution/AGENTS.md`](./solution/AGENTS.md)。会话 A 结束时，让 agent 自己写 `session-handoff.md`。不要复制已完成的参考代码、文档、功能清单或交接文件。
3. **两组相同：** 文档能导入、详情能显示完整内容，但重启仍会丢失导入的文档时，结束会话 A。开启全新的会话 B，只说「继续开发」，完成持久化。

比较会话 B 做出第一个有效修改所需的时间、重新探索或重复工作的多少，以及三个功能是否全部可用。这是在比较规则与交接文件的综合效果，不是单独测试交接文件。

[完整实验流程和提交要求](../../docs/zh/projects/project-02-agent-readable-workspace/index.md)

## 具体任务对应关系

从 `starter/` 开始。starter 已经有 Project 01 的应用壳和一个较弱的
harness。本项目要补的是 Project 02 的产品切片，以及让第二个会话能快速接手的仓库文档。

| 功能 / 产物 | starter 状态 | solution 证据 |
|------|------|------|
| 文档导入 | renderer、preload、IPC、`DocumentService` 的导入链路不完整 | `ImportPanel.tsx`, `ipc-handlers.ts`, `document-service.ts` |
| 文档详情 | 详情面板还不能通过 IPC 加载并显示完整内容 | `DocumentDetail.tsx`, `IPC_CHANNELS.GET_DOCUMENT_CONTENT` |
| 基本持久化 | 导入文档不能完整跨重启恢复 | `persistence-service.ts`, `documents-meta.json` 处理 |
| agent 可读状态 | starter 没有最终交接文件 | `session-handoff.md`, 扩展后的 `docs/ARCHITECTURE.md` 和 `docs/PRODUCT.md` |

## 本项目涉及的功能

- 文档导入流程（文件选择器 + IPC 传输）
- 文档详情视图（元数据 + 内容展示）
- 基本持久化（导入的文档在重启后保留）

## 对应课件

- [Lecture 03: 让仓库成为唯一的真相来源](../../docs/zh/lectures/lecture-03-why-the-repository-must-become-the-system-of-record/index.md)
- [Lecture 04: 拆分指令文件，而不是一个巨型文件](../../docs/zh/lectures/lecture-04-why-one-giant-instruction-file-fails/index.md)
