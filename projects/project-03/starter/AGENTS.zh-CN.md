# AGENTS.md —— 项目 03：通过范围控制实现多会话连续性

## 快速开始

1. 运行 `npm install && npm run check` 验证构建。
2. 阅读 `docs/ARCHITECTURE.md` 了解层级结构。
3. 阅读 `docs/PRODUCT.md` 了解功能需求。
4. 查看 `feature_list.json`，了解待完成事项。

## 层级

- 主进程：`src/main/` —— 窗口、IPC、服务
- 预加载脚本：`src/preload/` —— 桥接 API
- 渲染进程：`src/renderer/` —— React UI
- 服务：`src/services/` —— 业务逻辑

## 约定

- TypeScript 严格模式。不得在无注释的情况下使用 `any`。
- 仅使用命名导出。
- IPC 通道位于 `src/shared/types.ts`。

## 待实现功能

本项目的新功能包括：

1. **文档分块** —— `IndexingService` 将文档切分为约 500 字符的块
2. **元数据提取** —— 导入时提取字数、行数和文件类型
3. **索引状态 UI** —— `StatusBar` 用计数显示索引进度
4. **有据可查的问答** —— `QaService` 返回带引用和置信度的答案

请查看 `feature_list.json` 获取当前状态。

## 完成定义

一个功能在满足下列条件时才算“完成”：

1. TypeScript 无错误编译（`npm run check`）。
2. 应用已启动且功能正常。
3. 该功能在 `feature_list.json` 中的状态为 `"pass"`，并包含证据。

## 会话交接

恢复工作时，先检查 `session-handoff.md` 是否存在。起始项目默认不包含该文件；若不存在，请根据 `feature_list.json`、`docs/ARCHITECTURE.md`、`docs/PRODUCT.md` 以及当前 git diff 重建状态。
