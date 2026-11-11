# 拆解 Codex 的 harness 設計

OpenAI 的 [Codex](https://openai.com/index/harness-engineering/) 可能是四款產品裡與「harness 原教旨」連結最深的一個，那篇定義整個領域名稱的《Harness Engineering》文章，本身就是 OpenAI 團隊使用 Codex 開發產品時的經驗總結。因此，拆解 Codex 的 harness 設計，很大程度上就是拆解那篇文章背後的工程實務。

Codex 的哲學可以濃縮成一句話：**儲存庫即事實來源（repository as the system of record），AGENTS.md 只是目錄頁，工程的價值在於設計環境、表達意圖、建構回饋循環。**

## 一句話定位

OpenAI 團隊使用 Codex，在幾週內交付了一個最後達到上百萬行程式碼的產品，**每一行程式碼都是 Codex 寫的**（原文請參閱 [Harness Engineering](https://openai.com/index/harness-engineering/) 的 "Designing for growth" 一節）。他們的實務回答了一個問題：當工程師的角色從「寫程式碼」變成「設計 harness」時，系統應該如何組織。Codex CLI 本身是開放原始碼的單體二進位檔（以 Rust 實作，[github.com/openai/codex](https://github.com/openai/codex)），但它對 harness 的貢獻主要在於**慣例（convention）**和**上下文工程**，而不是花俏的擴充點。

## 指令子系統：AGENTS.md 是目錄頁，不是百科全書

這是 Codex 對 harness 理論最具影響力的一項設計：

> 單一巨型指令檔案不利於機械化檢查（涵蓋率、更新狀態、所有權、交叉連結），偏離現實的情況無法避免。因此，我們不再把 AGENTS.md 視為百科全書，而是將它視為**目錄頁**。程式碼庫知識位於結構化文件中，AGENTS.md 負責指向它們。

（以上直接轉述自 [《Harness Engineering》原文](https://openai.com/index/harness-engineering/) 中 "AGENTS.md should be a directory page" 一節。）

課程第四講說「單一巨型指令檔案會失敗」，Codex 直接給出正解：把 AGENTS.md 控制在 100 行左右（原文建議約 100 行，接近上限就拆到 `docs/`），放不下的內容就拆分到 `docs/` 目錄，讓 agent 隨選讀取。這是「給地圖，不給說明書」的權威出處。

搭配的原則稱為**執行不變量，不要微觀管理實作**（原文："don't micromanage the implementation；focus on invariants"）：AGENTS.md 只寫不可違反的硬性約束和驗證指令，具體如何實作則交給模型。這直接對應課程第二講的「約束而非微觀操控」。

## 上下文子系統：Write-Select-Compress-Isolate

Codex 的上下文工程可概括為四種策略。這是社群在 "context engineering" 成為獨立學科後，總結並對應回 Codex 的框架（框架出處請參閱 [Context Engineering for Codex CLI](https://codex.danielvaughan.com/2026/06/10/context-engineering-codex-cli-write-select-compress-isolate-june-2026/)）：

- **Write（寫出去）**：把上下文持久化到視窗之外，把結論寫入文件、把狀態寫入檔案，而不是留在對話裡。對應「儲存庫即事實來源」。
- **Select（選進來）**：只把需要的 token 拉進視窗，由 AGENTS.md 指路、隨選讀取檔案，而不是把整個儲存庫塞進去。
- **Compress（壓縮）**：保留真正重要的內容，Codex 有自動 compaction 和手動 `/compact`，可以自訂 `compact_prompt`（請參閱 [Context Engineering for Codex CLI](https://codex.danielvaughan.com/2026/06/10/context-engineering-codex-cli-write-select-compress-isolate-june-2026/)）。
- **Isolate（隔離）**：把上下文切分到不同邊界，使用 subagent 隔離不同任務的上下文，前端 subagent 永遠看不到後端的資料庫 schema。

Codex 還有一項很細緻的環境上下文設計：社群對 [codex-harness-internals](https://github.com/AlexKenbo/codex-harness-internals) 的原始碼分析顯示，`build_environment_update_item` 只在環境變更時輸出**有變動的欄位**（CWD、git 分支、檔案系統），而不是每一輪都貼上一遍完整的系統上下文。這是「不要在上下文裡保留重複 token」的工程細節。

## 工具與邊界：worktree 隔離 + subagent

Codex 有兩項核心 harness 機制：

**1. git worktree 隔離環境。** [《Harness Engineering》原文](https://openai.com/index/harness-engineering/) 的 "Environment" 一節明確指出：每個任務都在獨立的 git worktree 裡執行，搭配本機可觀測性堆疊（日誌、指標、追蹤），讓每項變更都在獨立環境中驗證。這就是課程第七講「為 agent 劃清每次任務的邊界」的實體實作，邊界不是靠指令懇求，而是由環境隔離強制執行。環境（environment）子系統在此成為硬隔離。

**2. 核心層級 subagent。** Codex 的 `spawn_agent` / `wait_agent` 是核心層級工具：模型明確建立 subagent、給它獨立的 session 歷史和工具集，並等待結果。subagent 會繼承父層的 AGENTS.md 指令，但在**自己的上下文**裡執行。設定放在 `.codex/agents/*.toml`，可指定不同模型和指令（細節請參閱 [Context Engineering for Codex CLI](https://codex.danielvaughan.com/2026/06/10/context-engineering-codex-cli-write-select-compress-isolate-june-2026/) 的 Sub-agents 一節）。這是「上下文隔離」的直接實作，也體現了課程第十二講的「交接」精神：每個 subagent 都是邊界清楚的工作單元。

## 回饋子系統：把驗證指令寫進規範

OpenAI 的實務最強調的一點是：在 AGENTS.md 裡明確列出驗證指令，把「如何確認做對了」變成儲存庫的一部分。Codex 的工程流程中，測試、CI、文件、可觀測性設定，全都由 Codex 產生，而且全都是「可執行的驗證路徑」。模型能力強卻不可靠的解法，不是祈禱模型自律，而是讓**驗證路徑成為 harness 的預設元件**。

核准原則（approval policies）和計畫模式（plan mode）則是另一個回饋方向：執行高風險操作前先提出計畫、先取得核准，把「任務邊界」和「人類決策權」做成執行時期控制。

## 對應到課程框架

| 子系統 | Codex 的實現 | 評價 |
| --- | --- | --- |
| 指令 | AGENTS.md 目錄頁 + docs/ 拆分 + 執行不變量 | 教科書級，定義了"給地圖不給說明書" |
| 工具 | worktree 隔離 + spawn_agent 子代理 | 邊界靠環境硬隔離，很強 |
| 環境 | 獨立 worktree + 可觀測性堆疊 | worktree 隔離是其招牌 |
| 狀態 | Write 策略（狀態寫進檔案/文件） | 依賴約定而非內建記憶 |
| 回饋 | 驗證命令入規範 + 審批策略 + plan mode | 回饋路徑預設化，值得抄 |

Codex 和 Claude Code 的對比很有意思：Claude Code 是「加法」，把記憶、permissions、subagent 全都做到核心裡；Codex 是「減法」，核心盡量保持克制，把更多責任放在儲存庫慣例和上下文工程上。這也是為什麼社群常說「Codex 的 harness 哲學比它的程式碼更有價值」。

## 值得借鑑的設計

1. **把 AGENTS.md 當成目錄頁來寫**：控制在 100 行左右，指向 docs/ 裡的細節，並可做機械化檢查。
2. **只寫不變量，不微觀管理實作**：硬性約束 + 驗證指令，其餘交給模型。
3. **用 worktree 隔離環境**：任務邊界由環境強制執行，不靠指令懇求。
4. **環境上下文只傳增量**：每輪只輸出變動的欄位，不要重複貼上完整的系統上下文。
5. **用 subagent 隔離上下文**：拆任務的同時也拆上下文，不要讓子任務污染主循環。

## 參考來源（原文 / 原始碼）

每一項論述都能追溯到以下原文或原始碼，避免憑印象轉述：

- **OpenAI《Harness Engineering》**：AGENTS.md 目錄頁和約 100 行的建議、executive invariants / don't micromanage、worktree 隔離 + 可觀測性堆疊、把驗證指令寫入規範、上百萬行產品案例、核准原則與 plan mode。本篇所有核心論述的主要出處。<br/>https://openai.com/index/harness-engineering/
- **OpenAI 官方《AGENTS.md》規範**（AGENTS.md 作為跨工具慣例的標準）：<br/>https://openai.com/index/agents-md/
- **Codex CLI 開源儲存庫**（以 Rust 實作的單體二進位檔）：<br/>https://github.com/openai/codex
- **Context Engineering for Codex CLI**（社群）：Write-Select-Compress-Isolate 框架、`/compact` 與 `compact_prompt`、`spawn_agent` / `wait_agent` subagent 與 `.codex/agents/*.toml` 設定。<br/>https://codex.danielvaughan.com/2026/06/10/context-engineering-codex-cli-write-select-compress-isolate-june-2026/
- **codex-harness-internals**（社群原始碼分析）：`build_environment_update_item` 增量環境上下文等實作細節。<br/>https://github.com/AlexKenbo/codex-harness-internals

相關講義：[第三講 · 讓程式碼儲存庫成為唯一的事實來源](../../lectures/lecture-03-why-the-repository-must-become-the-system-of-record/) ｜ [第四講 · 把指令拆分到不同檔案裡](../../lectures/lecture-04-why-one-giant-instruction-file-fails/) ｜ [第七講 · 為 agent 劃清每次任務的邊界](../../lectures/lecture-07-why-agents-overreach-and-under-finish/)
