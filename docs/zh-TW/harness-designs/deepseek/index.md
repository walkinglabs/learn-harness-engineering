# 拆解 DeepSeek Harness 的設計

[DeepSeek Harness](https://deepseek.com/harness)（指令名稱 `dsh`，儲存庫 `deepseek-ai/deepseek-harness`）於 2026 年 8 月以 Developer Preview 形式發佈，官方給出的定義很直接：**Agent = Model + Environment + Tools + State**，模型、環境、工具、狀態，四件套。

如果前三個產品的拆解是在問「harness 應該如何設計」，DeepSeek Harness 問的是更激進的問題：**harness 能不能脫離特定模型，成為一種獨立的執行時期？** 它的答案是可以，而且把這件事做到了極致，[架構文件](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md)的原文是：*Every part of the product is a plugin, including the model adapter, the tool registry, the session log, and the agent loop itself*（產品的每一部分都是 plugin，包括模型轉接器、工具登錄檔、session 日誌，甚至 agent 循環本身）。

這一篇我們拆解它，重點看三件事：plugin 化的核心、能力接縫（capability seam）、事件管線，以及那項最強的工程約束 "Model-visible means logged"。

## 一句話定位

傳統 coding agent 的結構是「LLM + 固定的 agent 循環 + 固定的工具集」。DeepSeek Harness 的結構是「模型 + 一個 plugin 核心（Cordis）」，核心只負責 plugin 的載入、卸載、相依關係和事件機制，**不擁有任何 agent 的具體能力**，[架構文件](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md)的原文是 "There is no privileged core to patch"（不存在需要修補的特權核心），"you extend dsh by mounting a plugin beside the others"（只要在一旁掛載一個 plugin 即可擴充，不必修改核心）。這表示連 agent 循環本身都不是神聖不可修改的，你可以使用 DeepSeek 的模型、接上 Claude Code 的 subagent、採用遠端沙箱、編寫自訂記憶、替換自訂循環、替換自訂 UI，組成一個全新的 agent。

這是對課程「模型權重以外的一切都是 harness」這句話最徹底的貫徹：既然 harness 是獨立的，就讓它獨立成為一個作業系統。

## 架構核心 1：能力接縫（Capability Seam）

DeepSeek Harness 使用 Service 表示「能力」，並將幾乎每項能力拆分為三層：

```
Service Definition（服務定義）
        ↓
Service Provider（服務提供者）
        ↓
Consumer（服務使用者）
```

以檔案系統為例：`FS Service` 下面有 Local FS、E2B FS、Remote FS 等多個 Provider，向上統一公開為 file tools。Shell、Subprocess、Sandbox、Web、LLM、SubAgent 都採用同一套結構。這套三層結構不是我們總結的，[架構文件 · Capability seams](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md)原文就是：*a seam is a swappable capability with three roles: a Service Definition declaring the interface, a Service Provider implementing it, and a Consumer using it, commonly a model-facing tool*（能力接縫 = 可替換的能力，包含三種角色：宣告介面的 Service Definition、實作它的 Service Provider，以及使用它的 Consumer；後者通常是面向模型的工具）。

這解決了 harness 工程裡長期存在的問題：**agent 究竟應該依賴「具體工具」，還是依賴「能力介面」？** DeepSeek Harness 選擇後者。對課程而言，這表示「工具子系統」被標準化為介面，更換 Provider 後，工具對模型公開的樣貌不變，但環境徹底改變。

## 架構核心 2：事件管線（Event Pipeline）

DeepSeek Harness 內部不是簡單的「LLM → 工具 → LLM」，而是一條事件管線，每個環節都是 plugin 可以監聽的事件點：

```
turn/start → claim input → assemble（system prompt / context / tools）
  → agent/pre-step → step/start → LLM request（agent/request）→ llm/stream
  → assistant/message → tool/call
  → tools/pre-execute（permission / guard / policy / hook）
  → tools/execute → tools/post-execute → tool/result → step/end → 下一輪
```

（上面的管線轉寫自 [架構文件 · Turn flow](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md) 一節：`turn/*`、`step/*`、`user/message`、`assistant/*`、`tool/*` 是持久化的 session 事件，`agent/pre-step`、`agent/request`、`llm/stream`、`tools/*` 則是 plugin 可以監聽的擴充點。）

這項設計最大的好處是：**大量功能根本不必修改 agent 循環本身**。想在工具執行前做安全檢查？監聽 `tools/pre-execute`。想加入記憶？在 `agent/pre-step` 注入。想記錄行為？訂閱 session 事件。想修改模型請求？掛接 `agent/request`。想決定是否繼續推理？監聽 `agent/turn-stopping`。

對照課程第十一講「讓 agent 的執行過程可觀測」，DeepSeek Harness 走得更遠：它不是「加入日誌」，而是讓**循環的每一步都成為事件點**，使可觀測性、permissions、記憶、原則全部以監聽器的身分掛在循環上，而不是寫死在循環裡。

## 架構核心 3：Session Event Log 與 "Model-visible means logged"

DeepSeek Harness 有一個 **append-only 的 Session Event Log（僅附加的 session 事件日誌）**，並訂出一項非常強的工程約束。[架構文件 · Session log](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md)的原文是：

> **Model-visible means logged.** Anything that reaches a model request must be reconstructable from the log, and a runtime invariant asserts it.

（凡是模型能看到的，都必須記錄。任何進入模型請求的內容都必須能從日誌重建，而且有一項執行時期不變量會強制檢查這一點。）

換句話說，可觀測性不是事後補上的日誌，而是 harness 的第一性約束：任何進入模型上下文的內容，預設都應該留下日誌。這直接呼應收官之夜的「可觀測性屬於 harness 內部」，並把 "append-only" 這項儲存設計化為原則，日誌只附加、不覆寫，session 狀態可以重播。

## 對應到課程框架

| 子系統 | DeepSeek Harness 的實現 | 評價 |
| --- | --- | --- |
| 指令 | 插件化；規則/技能均以插件形態注入 | 極自由，但沒有內建的"CLAUDE.md"式慣例 |
| 工具 | Service Definition → Provider → Consumer 能力接縫 | 工具子系統標準化的極致 |
| 環境 | 沙箱/FS/Shell 全部可換 Provider（含遠端 E2B） | 環境徹底可插拔 |
| 狀態 | append-only Session Event Log + Model-visible means logged | 可觀測性是第一性約束 |
| 回饋 | tools/pre-execute 上的 permission / guard / policy / hook | 回饋機制事件化 |

DeepSeek Harness 和其他三款產品的根本差異在於：Pi、Claude Code、Codex 都是在「一個具體的 agent」內部最佳化 harness；DeepSeek Harness 則把 harness 定義成**獨立於模型的作業系統**，agent 本身只是這套 OS 上的可替換應用程式。代價也很明顯，自由度高表示設定成本也高，這是「harness 即 OS」這套設計固有的另一面（開發者預覽階段的定位也是「搶先體驗、機制仍在演進」）。

## 值得借鑑的設計

1. **讓循環的每一步都成為事件點**：permissions、記憶、原則、日誌都以監聽器的身分掛在循環上，而不是寫死在循環裡。
2. **標準化能力接縫**：依賴「能力介面」而不是「具體工具」，環境可以整組替換而不影響模型看到的工具介面。
3. **Model-visible means logged**：凡模型能看到的內容都必須記錄，把可觀測性從「加分項」變成「第一性約束」。
4. **append-only session 日誌**：狀態可以重播、交接可靠，這是「每次 session 留下乾淨狀態」的工程化保證。

## 參考來源（原文 / 原始碼）

每一項論述都能追溯到以下原文或原始碼，避免憑印象轉述：

- **DeepSeek Harness 官網**：產品定義 "Agent = Model + Environment + Tools + State"、Developer Preview 定位與 `dsh` 指令。<br/>https://deepseek.com/harness
- **deepseek-ai/deepseek-harness 儲存庫**（指令 `dsh`，MIT 授權條款）：<br/>https://github.com/deepseek-ai/deepseek-harness
- **架構文件 architecture.md**：本篇最核心的出處，"Every part of the product is a plugin"、"There is no privileged core to patch"、Turn flow 事件管線、Capability seams 三層角色、"Model-visible means logged" 與執行時期不變量、append-only Session Event Log、fs/tools/telemetry 等能力接縫與 `ctx.*` 子系統。<br/>https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md
- **架構文件 · 配套子文件**：Cordis 核心簡介（plugins contribute services, typed events, reversible effects）、能力接縫細節、Session 子系統。<br/>https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-primer.md ｜ https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/capability-seams.md ｜ https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/subsystems/session.md

相關講義：[第十一講 · 讓 agent 的執行過程可觀測](../../lectures/lecture-11-why-observability-belongs-inside-the-harness/) ｜ [第十二講 · 每次 session 結束前都做好交接](../../lectures/lecture-12-why-every-session-must-leave-a-clean-state/) ｜ [第二講 · Harness 到底是什麼](../../lectures/lecture-02-what-a-harness-actually-is/)
