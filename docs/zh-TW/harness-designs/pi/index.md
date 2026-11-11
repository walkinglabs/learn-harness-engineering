# 拆解 Pi 的 harness 設計

[Pi](https://pi.dev/)（npm 套件 `@earendil-works/pi-coding-agent`）自稱 "minimal agent harness"，極簡的 agent harness。這句話值得拆開來看：它沒有自稱「最強的 coding agent」，也沒有自稱「最好用的 AI 程式設計工具」，而是把自己的定位牢牢釘在 **harness** 這個詞上。

這一篇我們用課程的五子系統框架（指令、工具、環境、狀態、回饋）拆解 Pi，看看它的設計哲學和 Claude Code、Codex 有什麼根本差異。答案先說：**Pi 的哲學是「核心最小化 + 擴充可程式化」，把上下文工程做到系統提示之外，讓使用者（甚至 Pi 自己）修改 harness，而不是讓 Pi 替你決定 harness。**

## 一句話定位

Pi 是極簡核心：官方刻意把核心做小、把決定權交還給你，[pi.dev 首頁](https://pi.dev/)的原文是 "Ask Pi to build what you want, or install a package that does it your way"。它把 harness 拆成四層可自訂項目：

- **擴充（Extensions）**：掛在 Pi 生命週期事件上的 TypeScript hooks，執行時期（runtime）層級的可程式化介面。
- **技能（Skills）**：隨選載入的能力套件，包含指令和工具，漸進式揭露（progressive disclosure）。
- **提示範本（Prompt templates）**：可重複使用的 Markdown 提示，輸入 `/name` 即可展開。
- **主題（Themes）**：TUI 外觀。

這種分層思路本身就是一種 harness 設計：**把「模型能看到什麼、什麼時候能看到」完全交給規則和擴充，而不是寫死在核心裡。**

## 核心循環

Pi 和所有 coding agent 一樣，本質上是「推理 → 工具執行 → 觀察 → 再推理」的 while 循環。值得注意的不是循環本身，而是 Pi 對循環外層的處理：它把上下文管理這件事，從循環內部的「壓縮」擴展到循環外部的「控制」。

Pi 的執行時期對外公開可程式化介面，[原始碼 README 的 Programmatic Usage](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md) 裡，除了互動式 TUI，還支援腳本化的列印/JSON 模式、RPC 協定與 SDK 嵌入。這決定了同一個 harness 既能由人逐條驅動，也能由 CI/CD 或其他程式自動驅動。它對應課程第十三講「循環工程」中「從手動驅動到自動循環」的前提：一個 harness 如果只能由人類互動驅動，就永遠無法進入自動循環。

## 指令子系統：AGENTS.md 與 SYSTEM.md

Pi 對「指令」的處理很克制，但層級清楚：

- **AGENTS.md**：[原始碼 README 的 Project Context Files](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md) 清楚列出載入順序，全域 `~/.pi/agent/AGENTS.md` → 逐層向上走訪父目錄 → 目前目錄 `./AGENTS.md`（也相容 CLAUDE.md）。這就是「儲存庫即事實來源」的貫徹，指令是檔案，不是聊天框裡的叮嚀。
- **SYSTEM.md**：[pi.dev 官方文件](https://pi.dev/docs/usage/project-context) 說明可依專案取代（replace）或附加（append）預設系統提示。這是 Pi 允許你修改「系統提示」的唯一正式入口，也是它的「環境自我描述」層。

Pi 官方強調它的系統提示本身**極簡**。背後是一個明確的取捨：核心不塞入「如果……那麼……」的冗長規則，而是保留擴充點，讓規則以技能和擴充的形式在需要時才出現。這直接呼應課程第四講「為什麼單一巨型指令檔案會失敗」，Pi 以「核心極簡 + 檔案拆分 + 隨選載入」自然避開巨型指令的問題。

## 狀態與上下文：Pi 拆得最細的地方

Pi 的上下文工程值得重點拆解，因為它把課程裡「上下文連續性」「防止上下文腐化」這些概念落實為具體機制：

**1. compaction 可程式化。** 接近上下文上限時，自動將舊訊息摘要化，[pi.dev 官方文件](https://pi.dev/docs/usage/sessions)說明 compaction 策略本身**可以自訂**：你可以用擴充實作基於主題的壓縮、能理解程式碼的摘要，甚至改用不同的模型來產生摘要。原始碼 README 也列出預設機制的細節：自動 compaction 會在兩種情況下觸發（上下文溢位復原 / 超過保留門檻），切割點會保留最近約 2 萬個 token，之前的訊息則摘要成 "context handoff" 並逐級鏈式壓縮。換句話說，Pi 不把「怎麼壓縮」視為不可修改的常數，而是視為 harness 的一部分。

**2. 動態上下文（Dynamic context）。** [pi.dev 官方文件](https://pi.dev/docs/usage/extensions)說明擴充可以在每一輪推理前注入訊息、過濾訊息歷史、實作 RAG、建構長期記憶。這比「上下文滿了再壓縮」更進一步：它讓你在上下文進入視窗前，就決定要放什麼、不放什麼。對應課程中的「讓 agent 的執行過程可觀測、可偵錯」和「保持上下文連續性」，Pi 把這兩件事下沉到擴充介面。

**3. session 樹（Session tree）。** [pi.dev 首頁](https://pi.dev/)明確寫著「session 以樹狀結構儲存（sessions are stored as trees），`/tree` 可以回到任意歷史節點繼續，所有分支都儲存在同一個檔案裡」。這解決了課程一再強調的「跨 session 上下文斷裂」問題，不是靠摘要硬接，而是靠結構化的歷史重播。分支可以匯出為 HTML，或上傳為 gist 分享，可觀測性也一併解決了。

## 工具子系統：技能與擴充

Pi 的「工具」分成兩層：

- **技能（Skills）**：[原始碼 README 的 Skills 一節](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md)定義得很清楚，"self-contained capability packages that the agent loads on-demand"，也就是隨選載入的能力套件，包含指令和工具，遵循 Agent Skills 標準。漸進式揭露讓技能細節只在觸發時才進入上下文，**不會塞爆提示快取（prompt cache）**。這是成本角度的 harness 設計：上下文每多一個 token，每次推理都要為它付費；把技能做成隨選載入，就是「給地圖，不給說明書」的另一種表達。
- **擴充（Extensions）**：掛在內建生命週期事件上的 TypeScript hooks，[原始碼 README 的 Hooks 一節](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md)列出四種官方範例用途：攔截危險指令（permissions 閘門）、切換任務時為程式碼建立 checkpoint、保護路徑（禁止寫入 `.env` 等）、修改工具輸出後再交給模型，以及從外部（檔案監看/Webhook/CI）注入訊息喚醒 agent。這些 hooks API 也在 `@mariozechner/pi-coding-agent/hooks` 裡匯出。社群 harness（[pi-agent-harness](https://github.com/LabidySabidy/pi-agent-harness)）則進一步把 hooks 介面封裝成 skill-router、session-summary、extract-patterns、telemetry 等現成擴充。

擴充是 Pi 最重要的設計決策：**它不是「提供使用者幾個開關」，而是把執行時期內部的事件介面全部公開。** 想加記憶？在 `agent/pre-step` 注入。想記錄行為？訂閱 session 事件。想修改模型請求？掛接 `agent/request`。你可以讓 Pi 自己修改自己的 harness，這比任何「設定項目」都更接近「可程式化 harness」的定義。

## 回饋與驗證：把「學習」也做成 harness

Pi 本身沒有內建強制測試閘門（那是使用者要在 AGENTS.md 裡寫的驗證指令），但社群 harness（[pi-agent-harness](https://github.com/LabidySabidy/pi-agent-harness)）透過擴充把「回饋迴路」結構化了，官方 README 的 Hooks 一節也提供了相似的機制基礎：

- **session-summary**（pi-agent-harness 擴充）：維護滾動更新的 `PROGRESS.md` 項目，這就是課程裡的狀態子系統，用於追蹤長任務進度。
- **extract-patterns**（pi-agent-harness 擴充）：從 session 中收集經驗教訓候選項，沉澱到 `LESSONS.md`，把「每次 session 結束前做好交接」從約定變成機制。
- **telemetry**（pi-agent-harness 擴充）：記錄 token 用量、成本等，可觀測性。

同一個社群儲存庫進一步驗證了這個模式：`VISION.md`（目標）、`PROGRESS.md`（進度）、`LESSONS.md`（經驗）、`STANDARDS.md`（標準），全都是 Markdown 檔案，可跨 session 持久化。這與課程建議的「儲存庫即事實來源 + 進度檔案 + 交接機制」完全是同一套做法，只是透過 Pi 的擴充機制成為開箱即用的一層。

## 對應到課程框架

用課程五子系統為 Pi 評分：

| 子系統 | Pi 的實現 | 評價 |
| --- | --- | --- |
| 指令 | AGENTS.md 分級載入 + SYSTEM.md | 層級清晰，但规则本身要靠用戶写 |
| 工具 | 技能按需載入 + 擴充全生命週期鉤子 | 極強，把工具系統做成了可程式化介面 |
| 環境 | SYSTEM.md 做環境自描述；運行時環境靠用戶在 AGENTS.md 裡聲明 | 機制是開放的，但可復現性依賴用戶自述 |
| 狀態 | 會話樹 + 壓縮可自訂 + PROGRESS.md | 極強，跨會話與可恢復性是其核心 |
| 回饋 | 驗證命令靠用戶定義；session-summary / extract-patterns 機制化 | 機制提供，內容靠用戶 |

Pi 的取捨和 Claude Code / Codex 形成鮮明對比：Claude Code 把「記憶、permissions、subagent」全都做到核心裡，開箱即用；Codex 把「儲存庫規範、環境隔離」設為預設；Pi 選擇**什麼都不替你決定**，它把決定權做成擴充點。代價是你要嘛自己寫擴充，要嘛安裝別人寫好的套件。

## 值得借鑑的設計

1. **讓壓縮策略可插拔**。你的 harness 裡「上下文怎麼壓縮」不應該是寫死的參數，而應該是可替換的策略介面。
2. **用 session 樹取代強制摘要**。跨 session 復原不一定要靠「上一輪摘要」，結構化重播歷史往往是更可靠的狀態子系統。
3. **對提示快取友善**。隨選載入技能，不要把所有規則一次塞進系統提示，這既是上下文工程，也是成本工程。
4. **讓 agent 能修改自己的 harness**。如果 harness 的擴充介面夠開放，「最佳化 agent 行為」這件事本身就能由 agent 半自動完成。

## 參考來源（原文 / 原始碼）

每一項論述都能追溯到以下原文或原始碼，避免憑印象轉述：

- **pi.dev 官網**：定位原文 "Ask Pi to build what you want, or install a package that does it your way"、四層可自訂項目、session 樹（"sessions are stored as trees"、`/tree`、單一檔案儲存、匯出 HTML / 分享 gist）。<br/>https://pi.dev/
- **pi.dev 官方文件 · Sessions**：compaction 可插拔（topic-based / code-aware / 更換摘要模型）、自動 compaction 與動態上下文注入的機制說明。<br/>https://pi.dev/docs/usage/sessions
- **pi.dev 官方文件 · Extensions**：擴充可在每輪推理前注入訊息、過濾歷史、執行 RAG、建構長期記憶。<br/>https://pi.dev/docs/usage/extensions
- **pi.dev 官方文件 · Project Context**：SYSTEM.md 的 replace / append 語意。<br/>https://pi.dev/docs/usage/project-context
- **Pi Coding Agent 原始碼 README**（badlogic/pi-mono）：AGENTS.md 三級載入順序（全域 → 父目錄 → 目前目錄）、`/compact` 與自動 compaction 的觸發條件及 2 萬個 token 切割點、Skills 隨選載入與 Agent Skills 標準、Hooks 生命週期與四種官方範例用途、Programmatic Usage（JSON / RPC / SDK）。<br/>https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md
- **pi-agent-harness 社群儲存庫**：skill-router / session-summary / extract-patterns / telemetry 擴充，VISION.md / PROGRESS.md / LESSONS.md / STANDARDS.md 檔案體系。<br/>https://github.com/LabidySabidy/pi-agent-harness

相關講義：[第二講 · Harness 到底是什麼](../../lectures/lecture-02-what-a-harness-actually-is/) ｜ [第五講 · 讓跨 session 的任務保持上下文連續](../../lectures/lecture-05-why-long-running-tasks-lose-continuity/) ｜ [第十三講 · 從手動驅動到自動循環](../../lectures/lecture-13-loop-engineering/)
