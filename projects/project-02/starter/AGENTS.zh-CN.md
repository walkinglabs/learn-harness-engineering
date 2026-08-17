# AGENTS.md —— 项目 02：便于智能体阅读的工作区

## 快速开始

1. 运行 `npm install && npm run check` 验证构建。
2. 阅读 `docs/ARCHITECTURE.md` 了解层级结构。
3. 查看 `feature_list.json`，了解待完成事项。

## 层级

- 主进程：`src/main/` —— 窗口、IPC、服务
- 预加载脚本：`src/preload/` —— 桥接 API
- 渲染进程：`src/renderer/` —— React UI
- 服务：`src/services/` —— 业务逻辑

## 约定

- TypeScript 严格模式。不得在无注释的情况下使用 `any`。
- 仅使用命名导出。
- IPC 通道位于 `src/shared/types.ts`。
