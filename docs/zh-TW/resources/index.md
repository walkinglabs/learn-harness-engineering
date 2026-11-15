# 繁體中文資源庫

這個資料夾把課程方法整理成可直接複製的範本與精簡參考資料，讓你能在真實儲存庫中使用。

## 適合什麼時候用

當你想讓 Codex、Claude Code 或其他程式設計代理跨多個工作階段工作，而不必每次都重新整理設定、狀態與範圍時，就從這裡開始。

它特別適合這些場景：

- 工作跨越多個工作階段
- 功能很多，容易做到一半就停住
- 代理容易過早宣告完成
- 每次開工都要重新摸索啟動步驟

## 從這裡開始

如果你要先建立最小配置，先看這些檔案：

- 根目錄指令： [`templates/AGENTS.md`](./templates/AGENTS.md) 或 [`templates/CLAUDE.md`](./templates/CLAUDE.md)
- 功能狀態： [`templates/feature_list.json`](./templates/index.md#feature-list-json)
- 進度日誌： [`templates/claude-progress.md`](./templates/claude-progress.md)
- 啟動腳本參考： `docs/zh-TW/resources/templates/init.sh`

接著再加入：

- 工作階段交接： [`templates/session-handoff.md`](./templates/session-handoff.md)
- 收尾檢查清單： [`templates/clean-state-checklist.md`](./templates/clean-state-checklist.md)
- 評估規準： [`templates/evaluator-rubric.md`](./templates/evaluator-rubric.md)

如果你想採用 OpenAI 文章中更完整的儲存庫結構，請改看：

- [`openai-advanced/index.md`](./openai-advanced/index.md)

## 資源庫結構

- [`templates/`](./templates/index.md)：可直接複製到真實儲存庫的範本
- [`reference/`](./reference/index.md)：方法說明、啟動流程與失敗模式對照
- [`openai-advanced/`](./openai-advanced/index.md)：進階儲存庫骨架、系統記錄文件，以及以代理為優先的治理範本

## 推薦最小組合

- `AGENTS.md` 或 `CLAUDE.md`
- `feature_list.json`
- `claude-progress.md`
- `init.sh`

這四個檔案已足以讓多數代理工作流程穩定許多。

當儲存庫成長成涵蓋多個領域、活躍計畫、品質評分與可靠性規則的長期系統時，請升級到 [`openai-advanced/`](./openai-advanced/index.md) 資源包，不要把最小組合一路撐成過大的系統。
