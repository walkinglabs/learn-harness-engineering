<p align="center">
  <a href="../../README.md"><img alt="English" src="https://img.shields.io/badge/EN-English-blue?style=flat-square"></a>
  <a href="../zh-CN/README.md"><img alt="简体中文" src="https://img.shields.io/badge/ZH-简体中文-red?style=flat-square"></a>
  <a href="../zh-TW/README.md"><img alt="繁體中文" src="https://img.shields.io/badge/ZH--TW-繁體中文-orange?style=flat-square"></a>
  <a href="../ja-JP/README.md"><img alt="日本語" src="https://img.shields.io/badge/JA-日本語-green?style=flat-square"></a>
  <a href="../ko-KR/README.md"><img alt="한국어" src="https://img.shields.io/badge/KO-한국어-blueviolet?style=flat-square"></a>
  <a href="../es-ES/README.md"><img alt="Español" src="https://img.shields.io/badge/ES-Español-yellow?style=flat-square"></a>
  <a href="../fr-FR/README.md"><img alt="Français" src="https://img.shields.io/badge/FR-Français-007EC6?style=flat-square"></a>
  <a href="../ru-RU/README.md"><img alt="Русский" src="https://img.shields.io/badge/RU-Русский-informational?style=flat-square"></a>
  <a href="../de-DE/README.md"><img alt="Deutsch" src="https://img.shields.io/badge/DE-Deutsch-2EA043?style=flat-square"></a>
  <a href="../ar-SA/README.md"><img alt="العربية" src="https://img.shields.io/badge/AR-العربية-success?style=flat-square"></a>
  <a href="../vi-VN/README.md"><img alt="Tiếng Việt" src="https://img.shields.io/badge/VI-Tiếng_Việt-cc6699?style=flat-square"></a>
  <a href="../uz-UZ/README.md"><img alt="Oʻzbekcha" src="https://img.shields.io/badge/UZ-Oʻzbekcha-1A8BBA?style=flat-square"></a>
  <a href="../tr-TR/README.md"><img alt="Türkçe" src="https://img.shields.io/badge/TR-Türkçe-E30A17?style=flat-square"></a>
  <a href="../pt-BR/README.md"><img alt="Português-BR" src="https://img.shields.io/badge/PT--BR-Português-1A8BBA?style=flat-square"></a>
  <a href="../uk-UA/README.md"><img alt="Українська" src="https://img.shields.io/badge/UK-Українська-0057B7?style=flat-square"></a>
</p>

# Learn Harness Engineering

> **一門專案導向的課程，教你建構讓 AI 程式設計代理可靠運作的環境、狀態管理、驗證與控制機制。**

Learn Harness Engineering 是一門專注於 AI 程式設計代理工程化的課程。我們深入研究並整合了業界最先進的 Harness Engineering 理論與實踐。核心參考資料包括：

> **🆕 2026 年 8 月更新：前沿 Harness 拆解**——新增欄目，包含 4 篇拆解：
>
> - **新欄目** [前沿 Harness 拆解](../../docs/zh-TW/harness-designs/index.md)：運用課程的五個子系統框架（指令、工具、環境、狀態、回饋），逆向拆解四款前沿產品如何建構真實的 harness。
> - **Pi** [Pi 如何建構其 harness](../../docs/zh-TW/harness-designs/pi/index.md)：極簡核心、可程式化擴充，以及「讓 Pi 建構你想要的東西」背後的上下文工程。
> - **Claude Code** [Claude Code 如何建構其 harness](../../docs/zh-TW/harness-designs/claude-code/index.md)：四層記憶、五級壓縮、hooks，以及 sub-agent 隔離。
> - **Codex** [Codex 如何建構其 harness](../../docs/zh-TW/harness-designs/codex/index.md)：以儲存庫為事實來源、以 AGENTS.md 為目錄頁，以及 worktree 隔離。
> - **DeepSeek** [DeepSeek 如何建構其 harness](../../docs/zh-TW/harness-designs/deepseek/index.md)：「一切皆為 plugin」、能力接縫，以及事件管線。
> - **全部 15 種語言**：涵蓋所有支援語言的完整翻譯。
>
> **核心觀點：** 課程為你提供框架；這些拆解則展示相同原則如何實際運用於生產環境的 harness。
>
> **🆕 2026 年 8 月更新：圖工程（Graph Engineering）**——新增 1 講 + 1 個專案：
>
> - **第十四講** [從單循環到圖工程](../../docs/zh-TW/lectures/lecture-14-graph-engineering/index.md)：為什麼單循環必然長成圖——四層疊加（prompt → context → loop → graph）及 harness 在其中的位置、圖的四個零件（節點、邊、共享狀態、路由）、為什麼 loop 內的檢查點救不了規模上的三種結構性失敗（Goodhart、向上失明、衝突）、框架無關的六步構建你的第一張圖、Graph 與 Workflow 的區別、錨、發布前 vs 發布後的開源專案現況、編排稅，以及什麼時候真的值得畫圖。
> - **專案 08** [把你的工作流畫成一張圖](../../docs/zh-TW/projects/project-08-graph-engineering-first-graph/index.md)：三個遞進實驗——把 maker-checker loop 畫成顯式圖、加平行 fan-out/fan-in 節點、加條件回退邊和人工審批節點。
>
> **核心觀點：** Loop 是只有一個節點的圖。當任務需要分工、平行、共享狀態、驗證和恢復時——它就不再是 loop，而是圖了。
>
> **🆕 2026 年 7 月更新：循環工程（Loop Engineering）**——新增 1 講 + 1 個專案 + 程式碼範本：
>
> - **第十三講** [為什麼你需要停止親自提示你的代理](../../docs/zh-TW/lectures/lecture-13-loop-engineering/index.md)：從 `/goal` 到循環工程的六個原語（automations、worktrees、skills、connectors、sub-agents、external state）、生成器/評估器分離、四種沉默成本，以及逐步構建你的第一個循環。
> - **專案 07** [構建你的第一個自動循環](../../docs/zh-TW/projects/project-07-loop-engineering-first-loop/index.md)：三個遞進實驗——目標循環、定時循環、製造者-檢查者循環。對比手動 vs. 自動化、衡量干預減少、學會跳出循環。
> - **程式碼範本**：`goal-template.md`、`loop-state-template.md`、`maker-prompt.md`、`checker-prompt.md`——即插即用的循環構建範本。
>
> **核心觀點：** Harness 工程造車。循環工程設計它行駛的道路——而你要從車外設計這條路。

- [OpenAI: Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)
- [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Anthropic: Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [Awesome Harness Engineering](https://github.com/walkinglabs/awesome-harness-engineering)

> **想快速上手？** [`skills/harness-creator/`](../../skills/harness-creator/) 技能可以在幾分鐘內為你自己的專案搭建一套生產級的 harness（AGENTS.md、功能列表、init.sh、驗證流程）。

---

## 目錄

- [✨ 視覺預覽](#視覺預覽)
- [Harness Engineering 的真正含義](#harness-engineering-的真正含義)
- [快速入門：今天就改善你的代理](#快速入門-今天就改善你的代理)
- [畢業專案：一個真實的應用程式](#畢業專案-一個真實的應用程式)
- [學習路徑](#學習路徑)
- [課程大綱](#課程大綱)
- [技能](#技能)
- [其他課程](#其他課程)

---

## ✨ 視覺預覽

### 🏠 課程首頁
> 完整的課程大綱與核心理念介紹，提供明確的上手路徑。

![課程首頁預覽](../../docs/public/screenshots/readme/en-home.png)

### 📖 沉浸式講座
> 深入探討實際痛點與動手專案（如 Project 01），帶來沉浸式的學習體驗。

![課程講座預覽](../../docs/public/screenshots/readme/en-lecture-01.png)

### 🗂️ 即用的資源庫
> 專為解決多輪 AI 代理開發中常見陷阱（如脈絡遺失、過早宣告任務完成）而設計的模板與參考配置。

![資源庫預覽](../../docs/public/screenshots/readme/en-resources.png)

## PDF 課程教材

本儲存庫現在包含課程內容的 PDF 建置流程。

- 執行 `npm run pdf:build` 可在本機產生英文與中文 PDF。
- 輸出檔案寫入 `artifacts/pdfs/`。
- 如果你想重新整理 README 預覽圖片，請執行 `npm run screenshots:readme`。
- GitHub Actions 工作流程 [`release-course-pdfs.yml`](../../.github/workflows/release-course-pdfs.yml) 可以建置 PDF 並發佈到 GitHub Releases。

---

## 模型很聰明，Harness 讓它可靠

大多數人都是慘痛教訓後才明白，**世界上最強大的模型，如果你不在它周圍建構適當的環境，它在真實工程任務上仍然會失敗。**

你可能自己也見過這種情況。你讓 Claude 或 GPT 在你的儲存庫中執行一項任務。它一開始表現不錯，讀取檔案、撰寫程式碼，看起來很有效率。然後出了問題。它跳過了一個步驟。它破壞了一個測試。它說「完成了」，但實際上什麼都不能用。你最後花的時間比自己動手做還多。

問題出在 harness 的設計，而非模型本身。

證據很明確。Anthropic 進行了一項對照實驗，相同的模型（Opus 4.5）、相同的提示（「建構一個 2D 復古遊戲編輯器」）。沒有 harness 的情況下，它在 20 分鐘內花了 9 美元，產出的東西無法運作。有了完整的 harness（規劃器 + 生成器 + 評估器），它在 6 小時內花了 200 美元，建構出一個你真的可以玩的遊戲。模型沒有變。變的是 harness。

OpenAI 也報告了 Codex 的相同結果，在一個 well-harnessed 的儲存庫中，相同的模型從「不可靠」變成「可靠」。改變的規模遠超邊際調整，是質的轉變。

**這門課程教你如何建構那個環境。**

```text
                    HARNESS 模式
                    ============

    你 --> 給定任務 --> 代理讀取 harness 檔案 --> 代理執行
                                                        |
                                              harness 管控每個步驟：
                                              |
                                              +--> 指令：該做什麼，以什麼順序
                                              +--> 範圍：一次一個功能，不過度延伸
                                              +--> 狀態：進度日誌、功能列表、git 歷史
                                              +--> 驗證：測試、lint、型別檢查、冒煙測試
                                              +--> 生命週期：開始時初始化，結束時乾淨狀態
                                              |
                                              v
                                         代理只在驗證通過時
                                         才會停止
```

---

## Harness Engineering 的真正含義

Harness Engineering 是關於在模型周圍建構一個完整的工作環境，使其產生可靠的結果。它不是關於寫更好的提示。它是關於設計模型運作所在的系統。

一個 harness 有五個子系統：

```text
    ┌─────────────────────────────────────────────────────────────────┐
    │                         HARNESS 系統                            │
    │                                                                 │
    │   ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
    │   │    指令       │  │    狀態      │  │      驗證            │ │
    │   │              │  │              │  │                      │ │
    │   │ AGENTS.md    │  │ progress.md  │  │ 測試 + lint          │ │
    │   │ CLAUDE.md    │  │ feature_list │  │ 型別檢查             │ │
    │   │ feature_list │  │ git log      │  │ 冒煙測試             │ │
    │   │ docs/        │  │ 工作階段交接 │  │ 端到端流程            │ │
    │   └──────────────┘  └──────────────┘  └──────────────────────┘ │
    │                                                                 │
    │   ┌──────────────┐  ┌──────────────────────────────────────┐   │
    │   │    範圍       │  │        工作階段生命週期               │   │
    │   │              │  │                                      │   │
    │   │ 一次一個功能 │  │ 開始時執行 init.sh                   │   │
    │   │ 明確的完成   │  │ 結束時使用乾淨狀態檢查清單           │   │
    │   │ 定義         │  │ 為下一個工作階段留下交接筆記         │   │
    │   │              │  │ 只在可安全恢復時才提交               │   │
    │   └──────────────┘  └──────────────────────────────────────┘   │
    │                                                                 │
    └─────────────────────────────────────────────────────────────────┘

    模型決定要寫什麼程式碼。
    HARNESS 管控何時、在哪裡、以及如何撰寫。
    Harness 不會讓模型變得更聰明。
    它讓模型的輸出變得可靠。
```

每個子系統各有其職責：

- **Instructions（指令）** — 告訴代理該做什麼、以什麼順序、以及在開始前該閱讀什麼。以漸進揭露的結構組織，讓代理按需導航，而非堆成一個巨大的檔案。
- **State（狀態）** — 追蹤已完成的事項、正在進行的事項、以及接下來該做的事。持久化到磁碟，讓下一個工作階段可以精確地從上一個階段停止的地方接續。
- **Verification（驗證）** — 只有通過的測試套件才算數。代理不能在沒有可執行證據的情況下宣告勝利。
- **Scope（範圍）** — 將代理限制在每次只做一個功能。不過度延伸。不三件事做一半。不改寫功能列表來隱藏未完成的工作。
- **Session Lifecycle（工作階段生命週期）** — 開始時初始化。結束時清理。為下一個工作階段留下乾淨的重啟路徑。

---

## 為什麼會有這門課程

問題不是「模型能不能寫程式？」它們能。問題是，**它們能不能在真實的儲存庫中，跨越多個工作階段，在沒有持續人工監督的情況下，可靠地完成真實的工程任務？**

目前的答案是，沒有 harness 就不行。

```text
    沒有 HARNESS                              有 HARNESS
    ==============                           ============

    工作階段 1：代理撰寫程式碼              工作階段 1：代理讀取指令
               代理破壞了測試                         代理執行 init.sh
               代理說「完成了」                       代理只做一個功能
               你手動修復                             代理在宣告完成前先驗證
                                                      代理更新進度日誌
    工作階段 2：代理從頭開始                         代理提交乾淨狀態
               代理沒有記憶
               不知道之前發生了什麼            工作階段 2：代理讀取進度日誌
               代理重做工作                             代理精確地從上次停止處接續
               或者做完全不同的事情                      代理繼續未完成的功能
               你再次修復                               你是審查，不是搶救

    結果：你花在清理的時間                      結果：代理做工作，
          比自己動手做還多                            你驗證結果
```

這門課程真正關心的問題：

- 哪些 harness 設計能提升任務完成率？
- 哪些設計能減少返工與錯誤完成？
- 哪些機制能讓長時間執行的任務穩定推進？
- 哪些結構能讓系統在多次代理執行後仍保持可維護性？

---

## 課程內容與文件

完整的課程資料，請造訪**[文件網站](https://walkinglabs.github.io/learn-harness-engineering/)**。

課程分為三個部分：

1. **講座**：14 個概念單元，解釋 harness engineering 背後的理論。
2. **專案**：8 個動手專案，讓你從零建構一個代理工作空間。
3. **資源庫**：可直接複製使用的模板（`AGENTS.md`、`feature_list.json`、`init.sh` 等），今天就能在你的儲存庫中使用。

---

## 快速入門：今天就改善你的代理

你不需要先讀完所有 14 堂講座才能開始獲得價值。如果你已經在真實專案中使用程式設計代理，以下是如何立刻改善它的方法。

概念很簡單，與其只寫提示，不如給你的代理一組結構化的檔案，定義該做什麼、已經做了什麼、以及如何驗證工作。這些檔案存在你的儲存庫中，所以每個工作階段都從相同的狀態開始。

```text
    你的專案根目錄
    ├── AGENTS.md              <-- 代理的操作手冊
    ├── CLAUDE.md              <-- （替代方案，如果使用 Claude Code）
    ├── init.sh                <-- 執行安裝 + 驗證 + 啟動
    ├── feature_list.json      <-- 哪些功能存在，哪些已完成
    ├── claude-progress.md     <-- 每個工作階段發生了什麼事
    └── src/                   <-- 你實際的程式碼
```

從[資源庫](https://walkinglabs.github.io/learn-harness-engineering/en/resources/)取得入門模板，放入你的專案。就是這樣。四個檔案，你的代理工作階段就會比僅靠提示穩定得多。

---

## 畢業專案：一個真實的應用程式

全部八個課程專案都圍繞著同一個產品：**一個基於 Electron 的個人知識庫桌面應用程式**。

```text
    ┌─────────────────────────────────────────────────────┐
    │              知識庫桌面應用程式                      │
    │                                                     │
    │  ┌──────────────┐  ┌──────────────────────────────┐│
    │  │  文件列表     │  │        問答面板              ││
    │  │              │  │                              ││
    │  │ doc-001.md   │  │  問：什麼是 harness 工程？  ││
    │  │ doc-002.md   │  │  答：圍繞代理模型建構的      ││
    │  │ doc-003.md   │  │     環境......               ││
    │  │ ...          │  │     [引用來源：doc-002.md]   ││
    │  └──────────────┘  └──────────────────────────────┘│
    │                                                     │
    │  ┌─────────────────────────────────────────────────┐│
    │  │ 狀態列：42 篇文件 | 38 篇已索引 | 上次同步 3 分鐘前││
    │  └─────────────────────────────────────────────────┘│
    └─────────────────────────────────────────────────────┘

    核心功能：
    ├── 匯入本地文件
    ├── 管理文件庫
    ├── 處理和索引文件
    ├── 對匯入內容執行 AI 問答
    └── 回傳有依據的答案與引用來源
```

選擇這個專案是因為它結合了強大的實用價值、足夠的真實產品複雜度，以及觀察 harness 改善前後差異的良好場景。

每個課程專案的 starter/solution 是這個 Electron 應用程式在那個演化階段的完整副本。P(N+1) 的 starter 衍生自 P(N) 的 solution——隨著你的 harness 技能成長，應用程式也在演化。

---

## 學習路徑

課程設計為按順序進行。每個階段建立在前一個階段之上。

```text
    階段 1：看見問題                        階段 2：建構儲存庫結構
    ===================                    ========================

    L01  強大的模型 ≠ 可靠的執行            L03  儲存庫作為唯一真實來源
    L02  Harness 到底是什麼意思
                                       L04  將指令分散到多個檔案，
         |                                   而非一個巨大檔案
         v
    P01  僅提示 vs. 規則優先比較                 |
                                               v
                                               P02  代理可讀的工作空間


    階段 3：連接工作階段                    階段 4：回饋與範圍
    =======================                ==================

    L05  跨工作階段保持脈絡               L07  劃清任務邊界
    L06  每次代理工作階段前初始化           L08  功能列表作為 harness
                                               基本元素
         |
         v                                     P04  執行時回饋修正
    P03  多工作階段連續性                           代理行為


    階段 5：驗證                            階段 6：整合所有內容
    =================                       ========================

    L09  阻止代理過早宣告勝利               L11  讓代理的執行時行為
                                               可觀測
    L10  完整流程執行 =                     L12  每個工作階段結束時
         真正的驗證                             乾淨的交接

         |                                     |
         v                                     v
    P05  代理驗證自己的工作                   P06  建構完整的 harness
                                               （畢業專案）

    階段 7：自動化循環
    ==========================
    L13  停止提示你的代理——
         改為設計循環
         |
         v
    P07  構建你的第一個自動循環
         （目標循環、定時循環、製造者-檢查者）

    階段 8：結構化系統
    =============================
    L14  把系統畫成一張圖——
         節點、邊、共享狀態、路由
         |
         v
    P08  把你的工作流畫成一張圖
         （顯式圖、平行 fan-out/fan-in、
          回退邊、人機協同）
```

如果你是兼職學習，每個階段大約需要一週。如果你想加快速度，階段 1-3 可以在一個長週末完成。

---

## 課程大綱

### 講座 — 14 個概念單元，每個聚焦一個關鍵提問

*在[文件網站](https://walkinglabs.github.io/learn-harness-engineering/)上閱讀每堂講座的完整內容。*

| 場次 | 問題 | 核心概念 |
|---------|----------|-----------|
| [L01](../../docs/zh-TW/lectures/lecture-01-why-capable-agents-still-fail/index.md) | 為什麼強大的模型在真實任務上仍然會失敗？ | 基準測試與真實工程之間的能力差距 |
| [L02](../../docs/zh-TW/lectures/lecture-02-what-a-harness-actually-is/index.md) | 「harness」到底是什麼意思？ | 五個子系統，指令、狀態、驗證、範圍、生命週期 |
| [L03](../../docs/zh-TW/lectures/lecture-03-why-the-repository-must-become-the-system-of-record/index.md) | 為什麼儲存庫必須是唯一的真實來源？ | 如果代理看不到它，它就不存在 |
| [L04](../../docs/zh-TW/lectures/lecture-04-why-one-giant-instruction-file-fails/index.md) | 為什麼一個巨大的指令檔案會失敗？ | 漸進揭露，給一張地圖，不是一本百科全書 |
| [L05](../../docs/zh-TW/lectures/lecture-05-why-long-running-tasks-lose-continuity/index.md) | 為什麼長時間執行的任務會失去連續性？ | 將進度持久化到磁碟；從你停止的地方接續 |
| [L06](../../docs/zh-TW/lectures/lecture-06-why-initialization-needs-its-own-phase/index.md) | 為什麼初始化需要自己的階段？ | 在代理開始工作之前驗證環境是否健康 |
| [L07](../../docs/zh-TW/lectures/lecture-07-why-agents-overreach-and-under-finish/index.md) | 為什麼代理會過度延伸和過早結束？ | 每次一個功能；明確的完成定義 |
| [L08](../../docs/zh-TW/lectures/lecture-08-why-feature-lists-are-harness-primitives/index.md) | 為什麼功能列表是 harness 的基本元素？ | 機器可讀的範圍邊界，代理無法忽略 |
| [L09](../../docs/zh-TW/lectures/lecture-09-why-agents-declare-victory-too-early/index.md) | 為什麼代理會過早宣告勝利？ | 驗證缺口，信心不等於正確 |
| [L10](../../docs/zh-TW/lectures/lecture-10-why-end-to-end-testing-changes-results/index.md) | 為什麼端到端測試能改變結果？ | 只有完整的流程執行才算真正的驗證 |
| [L11](../../docs/zh-TW/lectures/lecture-11-why-observability-belongs-inside-the-harness/index.md) | 為什麼可觀測性應該屬於 harness 內部？ | 如果你看不到代理做了什麼，你就無法修復它破壞的東西 |
| [L12](../../docs/zh-TW/lectures/lecture-12-why-every-session-must-leave-a-clean-state/index.md) | 為什麼每個工作階段都必須留下乾淨的狀態？ | 下一個工作階段的成功取決於這個工作階段的清理 |
| [L13](../../docs/zh-TW/lectures/lecture-13-loop-engineering/index.md) | 為什麼你需要停止親自提示你的代理？ | 從手動驅動到自動循環——目標循環、定時循環、製造者-檢查者分離 |
| [L14](../../docs/zh-TW/lectures/lecture-14-graph-engineering/index.md) | 為什麼單循環會演變成圖？ | 從單循環到圖工程——節點、邊、共享狀態、路由，以及何時真正值得畫圖 |

### 專案 — 8 個動手專案，將講座方法應用於同一個 Electron 應用程式

| 專案 | 你要做什麼 | Harness 機制 |
|---------|------------|-------------------|
| [P01](../../docs/zh-TW/projects/project-01-baseline-vs-minimal-harness/index.md) | 將同一任務執行兩次，僅提示 vs. 規則優先 | 最小 harness，AGENTS.md + init.sh + feature_list.json |
| [P02](../../docs/zh-TW/projects/project-02-agent-readable-workspace/index.md) | 重構儲存庫，讓代理能夠閱讀它 | 代理可讀的工作空間 + 持久化狀態檔案 |
| [P03](../../docs/zh-TW/projects/project-03-multi-session-continuity/index.md) | 讓代理從上次停止的地方接續 | 進度日誌 + 工作階段交接 + 多工作階段連續性 |
| [P04](../../docs/zh-TW/projects/project-04-incremental-indexing/index.md) | 阻止代理做得太多或太少 | 執行時回饋 + 範圍控制 + 增量索引 |
| [P05](../../docs/zh-TW/projects/project-05-grounded-qa-verification/index.md) | 讓代理驗證自己的工作 | 自我驗證 + 有依據的問答 + 基於證據的完成 |
| [P06](../../docs/zh-TW/projects/project-06-runtime-observability-and-debugging/index.md) | 從零建構一個完整的 harness（畢業專案） | 完整 harness，所有機制 + 可觀測性 + 消融實驗 |
| [P07](../../docs/zh-TW/projects/project-07-loop-engineering-first-loop/index.md) | 構建你的第一個自動循環 | 目標循環、定時循環、製造者-檢查者分離、循環狀態管理 |
| [P08](../../docs/zh-TW/projects/project-08-graph-engineering-first-graph/index.md) | 把你的工作流畫成一張圖 | 顯式的節點/邊/狀態/路由、平行 fan-out/fan-in、回退邊、人機協同審批 |

```text
    專案演進
    ========

    P01  僅提示 vs. 規則優先               你看見問題
     |
     v
    P02  代理可讀的工作空間                 你重構儲存庫
     |
     v
    P03  多工作階段連續性                   你連接工作階段
     |
     v
    P04  執行時回饋與範圍控制               你加入回饋迴圈
     |
     v
    P05  自我驗證                          你讓代理檢查自己
     |
     v
    P06  完整 harness（畢業專案）           你建構完整系統

    每個專案的 solution 成為下一個專案的 starter。
    應用程式在演化。你的 harness 技能也隨之成長。
```

### 資源庫

- [English](https://walkinglabs.github.io/learn-harness-engineering/en/resources/) — templates, checklists, and method references
- [简体中文](https://walkinglabs.github.io/learn-harness-engineering/zh/resources/) — 中文模板、清单和方法参考
- [繁體中文](https://walkinglabs.github.io/learn-harness-engineering/zh-TW/resources/) — 繁體中文範本、清單和方法參考
- [日本語](https://walkinglabs.github.io/learn-harness-engineering/ja/resources/) — テンプレート、チェックリスト、方法リファレンス
- [한국어](https://walkinglabs.github.io/learn-harness-engineering/ko/resources/) — 템플릿, 체크리스트, 방법 참고 자료
- [Español](https://walkinglabs.github.io/learn-harness-engineering/es/resources/) — plantillas, listas de verificación y referencias
- [Français](https://walkinglabs.github.io/learn-harness-engineering/fr/resources/) — modèles, listes de contrôle et références
- [Русский](https://walkinglabs.github.io/learn-harness-engineering/ru/resources/) — шаблоны, чек-листы и справочники
- [Deutsch](https://walkinglabs.github.io/learn-harness-engineering/de/resources/) — Vorlagen, Checklisten und Referenzen
- [العربية](https://walkinglabs.github.io/learn-harness-engineering/ar/resources/) — قوالب، قوائم تحقق ومراجع
- [Tiếng Việt](https://walkinglabs.github.io/learn-harness-engineering/vi/resources/) — mẫu, danh sách kiểm tra và tài liệu tham khảo
- [Oʻzbekcha](https://walkinglabs.github.io/learn-harness-engineering/uz/resources/) — andozalar, tekshiruv roʻyxatlari va maʼlumotnomalar
- [Türkçe](https://walkinglabs.github.io/learn-harness-engineering/tr/resources/) — şablonlar, kontrol listeleri ve referanslar
- [Português (BR)](https://walkinglabs.github.io/learn-harness-engineering/pt-BR/resources/) — modelos, listas de verificação e referências de métodos

---

## 代理工作階段生命週期

這門課程的核心理念之一：**代理的工作階段應該遵循結構化的生命週期，而不是隨意進行。** 以下是它的樣貌：

```text
    代理工作階段生命週期
    ===================

    ┌──────────────────────────────────────────────────────────────────┐
    │  開始                                                            │
    │                                                                  │
    │  1. 代理讀取 AGENTS.md / CLAUDE.md                              │
    │  2. 代理執行 init.sh（安裝、驗證、健康檢查）                    │
    │  3. 代理讀取 claude-progress.md（上次發生了什麼事）              │
    │  4. 代理讀取 feature_list.json（什麼已完成，什麼是下一步）      │
    │  5. 代理檢查 git log（最近的變更）                               │
    │                                                                  │
    │  選擇                                                            │
    │                                                                  │
    │  6. 代理精確挑選一個未完成的功能                                  │
    │  7. 代理只做那個功能                                              │
    │                                                                  │
    │  執行                                                            │
    │                                                                  │
    │  8. 代理實作該功能                                                │
    │  9. 代理執行驗證（測試、lint、型別檢查）                         │
    │  10. 如果驗證失敗：修復並重新執行                                │
    │  11. 如果驗證通過：記錄證據                                      │
    │                                                                  │
    │  收尾                                                            │
    │                                                                  │
    │  12. 代理更新 claude-progress.md                                 │
    │  13. 代理更新 feature_list.json                                  │
    │  14. 代理記錄仍然損壞或未驗證的部分                              │
    │  15. 代理提交（只在可安全恢復時）                                 │
    │  16. 代理為下一個工作階段留下乾淨的重啟路徑                      │
    │                                                                  │
    └──────────────────────────────────────────────────────────────────┘

    Harness 管控這個生命週期中的每個轉換。
    模型決定在每個步驟寫什麼程式碼。
    沒有 harness 時，步驟 9 變成「代理說看起來沒問題」。
    有了 harness 時，步驟 9 是「測試通過、lint 乾淨、型別檢查通過」。
```

---

## 適合什麼人

這門課程適合：

- 已在使用程式設計代理並希望獲得更好穩定性與品質的工程師
- 希望系統性理解 harness 設計的研究者或建構者
- 需要了解環境設計如何影響代理效能的技術主管

這門課程不適合：

- 尋求零程式碼 AI 入門的人
- 只關心提示、不打算建構真實實作的人
- 尚未準備好讓代理在真實儲存庫中工作的學習者

---

## 需求

這是一門你實際執行程式設計代理的課程。

你至少需要以下工具之一：

- Claude Code
- Codex
- 其他支援檔案編輯、命令執行和多步驟任務的 IDE 或 CLI 程式設計代理

課程假設你能夠：

- 開啟一個本地儲存庫
- 允許代理編輯檔案
- 允許代理執行命令
- 檢查輸出並重新執行任務

如果你沒有這樣的工具，你仍然可以閱讀課程內容，但無法按預期完成專案。

---

## 本地預覽

本儲存庫使用 VitePress 作為文件檢視器。

```sh
npm install
npm run docs:dev        # 含熱重載的開發伺服器
npm run docs:build      # 生產環境建置
npm run docs:preview    # 預覽建置後的網站
```

然後在瀏覽器中開啟 VitePress 輸出的本地 URL。

---

## 先備條件

必要條件：

- 熟悉終端機、git 和本地開發環境
- 能夠使用至少一種常見應用程式技術堆疊閱讀和撰寫程式碼
- 基本的軟體除錯經驗（閱讀日誌、測試和執行時行為）
- 有足夠的時間投入實作導向的課程

有幫助但非必要：

- 有使用 Electron、桌面應用程式或 local-first 工具的經驗
- 有測試、日誌或軟體架構的背景
- 曾接觸過 Codex、Claude Code 或類似的程式設計代理

---

## 核心參考資料

主要參考：

- [OpenAI: Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)
- [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Anthropic: Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [OpenAI: Unrolling the Codex agent loop](https://openai.com/index/unrolling-the-codex-agent-loop/)
- [Anthropic: Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- [LangChain: Improving Deep Agents with harness engineering](https://www.langchain.com/blog/improving-deep-agents-with-harness-engineering)
- [Thoughtworks / Martin Fowler: Harness engineering for coding agent users](https://martinfowler.com/articles/harness-engineering.html)
- [Cursor: Continually improving our agent harness](https://cursor.com/blog/continually-improving-agent-harness)

完整的分層參考列表請見 [`docs/zh-TW/resources/reference/`](../../docs/zh-TW/resources/reference/index.md)。

---

## 儲存庫結構

```text
learn-harness-engineering/
├── docs/                          # VitePress 文件網站
│   ├── lectures/                  # 14 堂講座（index.md + code/ 範例）
│   │   ├── lecture-01-*/
│   │   ├── lecture-02-*/
│   │   └── ...（共 14 堂）
│   ├── projects/                  # 8 個專案說明
│   │   ├── project-01-*/
│   │   └── ...（共 8 個）
│   └── resources/                 # 多語言模板與參考資料
│       ├── en/                    # 英文模板、檢查清單、指南
│       ├── zh/                    # 中文模板、檢查清單、指南
│       ├── ru/                    # 俄文模板、檢查清單、指南
│       └── vi/                    # 越南文模板、檢查清單、指南
├── projects/
│   ├── shared/                    # 共用的 Electron + TypeScript + React 基礎
│   └── project-NN/               # 每個專案的 starter/ 和 solution/ 目錄
├── skills/                        # 可重用的 AI 代理技能
│   └── harness-creator/           # Harness Engineering 技能
├── package.json                   # VitePress + 開發工具
└── CLAUDE.md                      # 本儲存庫的 Claude Code 指令
```

---

## 課程組織方式

- 每堂講座專注於一個問題
- 課程包含 8 個專案
- 每個專案都要求代理做真實的工作
- 每個專案都比較弱 harness 與強 harness 的結果
- 重要的是可量測的差異，而不是寫了多少文件

---

## 技能

本儲存庫還包含可重用的 AI 代理技能，你可以直接安裝到你的 IDE 或代理工作空間。

- [**harness-creator**](../../skills/harness-creator/)：一個幫助你在幾分鐘內為自己的專案搭建生產級 harness 的技能。

---

## 其他課程

我們的團隊還製作了其他課程！歡迎查看：

[![Hands-on Modern RL](https://img.shields.io/badge/HANDS--ON_MODERN_RL-0052cc?style=for-the-badge)](https://github.com/walkinglabs/hands-on-modern-rl)

**Hands-on Modern RL**，一個開源的實作課程，從基礎 RL 概念銜接到 LLM 對齊、RLVR 和進階 Agentic 系統。

---

## Star 歷史

[![Star History Chart](https://star-history.dera.page/svg?repos=walkinglabs/learn-harness-engineering&type=date&legend=top-left)](https://star-history.dera.page/#walkinglabs/learn-harness-engineering&type=date&legend=top-left)

---

## 致謝

本課程的靈感來源和部分理念取自 [learn-claude-code](https://github.com/shareAI-lab/learn-claude-code) —— 一份從零建構代理的漸進式指南，從單一迴圈到隔離的自主執行。
