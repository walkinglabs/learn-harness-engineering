# Project 02. 讓代理看懂專案、銜接上次的工作

> 相關講義：[L03. 讓程式碼儲存庫成為唯一的事實來源](./../../lectures/lecture-03-why-the-repository-must-become-the-system-of-record/index.md) · [L04. 把指令拆分到不同檔案裡](./../../lectures/lecture-04-why-one-giant-instruction-file-fails/index.md)
> 本篇範本檔案：[templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/zh-TW/resources/templates/)

## 你要做什麼

P01 證明了準備規則有用。但 P01 的任務一次工作階段就完成了。真實開發不是這樣的——你昨天做了一半，今天開啟新工作階段，代理得從儲存庫狀態中釐清「做了什麼、尚未完成什麼、接下來要做什麼」。

這個專案要求你為儲存庫加上「可讀性」，讓一個全新的代理開啟儲存庫後，能快速理解專案結構、知道目前進度、銜接上次的工作。具體任務是給知識庫應用加上三個功能，包括文件匯入、文件詳情頁面、匯入後的本地持久化。這些功能必須跨至少兩個代理工作階段完成。

兩次都從 `starter/` 的同一份程式碼開始。第一次使用 starter 自帶的精簡 harness，不寫交接檔案；第二次改用 `solution/` 裡含交接規則的 `AGENTS.md`，並在工作階段 A 結束時寫出 `session-handoff.md`。每次執行都有兩個工作階段，第二個要接手第一個還沒做完的工作。兩次使用同樣的程式碼、提示詞、代理和中止條件，所以比較的是 `AGENTS.md` 規則加上交接檔案的整套 harness。

## 用什麼工具

- Claude Code 或 Codex（和 P01 保持一致）
- Git
- Node.js + Electron
- 文字編輯器（撰寫文件用）

## Harness 機制

可讀的代理工作區 + 持久化狀態檔案

## 使用倉庫內建專案

倉庫路徑：[`projects/project-02/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02)

| 目錄 | 內容 | 比較什麼 |
|------|------|------|
| [`starter/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/starter) | 基於 Project 01 解答版本的程式碼，但匯入/詳情/持久化仍未完整；文件較少，且缺少 `session-handoff.md`。 | 開啟新工作階段時，代理需要重新探索多少才能銜接進度。 |
| [`solution/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/solution) | 同一產品切片已完成，並在 [`projects/project-02/solution/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/solution) 下補齊核心文件（以及 [`feature_list.json`](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/solution/feature_list.json)、[`session-handoff.md`](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/solution/session-handoff.md)）等可接手產物。 | 只依靠儲存庫狀態，能否快速續寫而不靠口頭脈絡。 |

產品功能包含文件匯入、完整文件詳情與內容載入，以及重啟後的資料持久化。harness 功能是可供工作階段交接的可讀工作區。

`solution/` 只供參考，不是任一組的起點；強 harness 組只從這裡取用 `AGENTS.md`。

## 具體步驟

兩次執行只改變 harness，程式碼、任務提示詞、代理和工作階段 A 的中止條件都相同。依照[專案 README](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/README.md)，工作階段 A 負責文件匯入和詳情檢視，工作階段 B 負責持久化。

1. 準備兩個互相隔離的工作目錄，例如 `p02-baseline/` 和 `p02-improved/`。一次只跑一組；完成該組的兩個工作階段後，先封存結果、刪除該組工作目錄，再開始另一組。不要用 Git 分支來區分兩次執行。程式開發代理可以讀取其他分支和同層目錄；弱 harness 組如果看得到強組的檔案，對照就不公平（與 Project 01 的規則相同）。
2. 將 [`projects/project-02/starter/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/starter) 複製到兩個目錄。這個起點以 Project 01 的解答為基礎，Project 01 的功能已通過驗證，Project 02 的三項功能在 `feature_list.json` 裡標為 `not-started`。若要沿用自己做完的 Project 01，請把同一份快照複製到兩個目錄。重點是兩組的起始程式碼完全相同。
3. 兩次都給相同的任務提示詞，例如：「實作透過檔案選擇器匯入文件、能顯示完整內容的文件詳情檢視，以及讓匯入的文件在應用程式重新啟動後仍能保留的持久化機制。」
4. 不要把 `solution/docs/`、`solution/feature_list.json` 或 `solution/session-handoff.md` 複製到任何一組。這些檔案記錄已完成的匯入與內容讀取流程，並把所有功能標為 `pass`，等於先把答案交給代理。兩組都保留 starter 原有的 `docs/ARCHITECTURE.md`、`docs/PRODUCT.md` 和 `feature_list.json`。

### 第一次執行（弱 harness）

在 `p02-baseline/` 中原樣保留 starter 的簡短 `AGENTS.md`、`docs/` 和 `feature_list.json`，不寫 `session-handoff.md`。不要刪除這些檔案：弱 harness 是精簡版，不是空白版。

**工作階段 A：**

1. 使用任務提示詞啟動代理。
2. 在文件匯入和詳情檢視都能使用、但持久化尚未完成時，由你結束工作階段。驗證方式是啟動應用程式，透過檔案選擇器匯入 `.txt` 或 `.md` 檔案，確認清單中出現該文件，開啟後可看到完整內容；不過，重新啟動後文件仍會消失。第二次也在相同條件下中止。
3. 不要要求代理撰寫交接或其他摘要檔案。

**工作階段 B：**

1. 在同一個目錄開啟全新的代理工作階段，只說「繼續開發」。
2. 記錄代理花多久才做出第一個有意義的程式碼修改，以及它重新查找工作階段 A 已掌握的資訊（架構、指令、進行到一半的功能等）的次數。

### 第二次執行（強 harness）

在 `p02-improved/` 開始工作階段 A 前，把 `AGENTS.md` 換成 [`solution/AGENTS.md`](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/solution/AGENTS.md)。這份檔案新增啟動規則、文件優先順序與更新規則、要求在 `feature_list.json` 留下證據的完成條件，以及工作階段交接一節。其他檔案不變。因為 `AGENTS.md` 的差異不只交接規則，兩次比較的是整套 harness，工作階段 B 的差異不能只歸因於交接檔案。如果想單獨評估交接的效果，可再加跑第三組：保留 starter 的 `AGENTS.md`，只加上交接一節。

**工作階段 A：**

1. 用相同的任務提示詞啟動代理。
2. 在同一個進度點中止（匯入和詳情檢視可用、持久化尚未完成）。
3. 結束前，請代理依照[工作階段交接範本](./../../resources/templates/session-handoff.md)，在儲存庫根目錄寫出 `session-handoff.md`，記下已驗證的內容、做了哪些變更、哪些部分有問題或尚未驗證、下一步最該做什麼。[完成版範例](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/solution/session-handoff.md) 所有功能都已完成，不要直接複製。

**工作階段 B：**

1. 在同一個目錄開啟全新的代理工作階段，只說「繼續開發」。讀取 `session-handoff.md` 的指示來自 `AGENTS.md`，不是你的提示詞。
2. 記錄和第一次執行相同的指標。

## 怎麼衡量結果

| 指標 | 說明 |
|------|------|
| 工作階段 B 銜接時間 | 從開始到第一個有意義的程式碼修改的時間 |
| 重新探索次數 | 代理重新了解架構、指令、狀態等既有資訊的次數 |
| 交接檔案品質 | 交接記錄是否完整、準確且能據此繼續工作（僅第二次執行） |
| 重複工作 | 工作階段 B 重做了多少工作階段 A 已完成的工作 |
| 最終完成狀態 | 三項功能是否全部完成 |

## 要交什麼

- 弱 harness 的工作階段 A 和 B 的對話或執行記錄
- 強 harness 的相同記錄，以及本次使用的 `AGENTS.md` 和代理寫出的 `session-handoff.md`
- 一份比較筆記：著重於銜接速度和脈絡恢復品質

**延伸閱讀：** [Lecture 05：為什麼長任務會遺失連續性](../../lectures/lecture-05-why-long-running-tasks-lose-continuity/index.md)
