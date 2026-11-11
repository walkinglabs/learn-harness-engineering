# 拆解 Claude Code 的 harness 設計

Anthropic 在《[Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)》中明確提出：可靠性來自 harness 而不是模型，agent 需要在「模型之外」受到約束。Claude Code 就是這個思路的產品化範例，Anthropic 官方也直接把它歸入 **agentic harness** 的範疇。這不是行銷話術，Claude Code 可能是目前公開拆解得最透徹的 harness：原始碼公開、社群研究報告詳盡，而且它把課程講義裡幾乎所有核心機制（分層記憶、上下文壓縮、permissions、hooks、subagent、session 持久化）都做成完整的產品化實作。

這一篇我們用課程五子系統框架拆解 Claude Code，重點看它如何落實「上下文管理」「防止提前宣告完成」「確定性約束」這些 harness 的原教旨概念。

## 一句話定位

Claude Code 的核心是一個簡單的 while 循環：呼叫模型、執行工具、觀察結果、再次呼叫模型。但**絕大部分程式碼不在這個循環裡，而是在圍繞循環的系統中**，permissions 系統、上下文壓縮管線、擴充機制、subagent 編排、session 儲存。這就是 harness 的本質：循環是骨架，骨架以外的一切才是決定可靠性的部分。

## 指令子系統：分層記憶體系

Claude Code 的記憶系統是它對 harness 理論最直接的貢獻，對應課程中的「儲存庫即事實來源」和「跨 session 上下文連續」兩講。[官方文件《How Claude remembers your project》](https://code.claude.com/docs/en/memory)明確說明：每次 session 都從全新的上下文視窗開始，透過兩類機制跨 session 攜帶知識，CLAUDE.md 檔案（你寫的指令）和 auto memory（Claude 自己寫的筆記）。

就作用範圍而言，官方把 CLAUDE.md 檔案分成四類（依載入順序由廣到窄）：

- **組織原則層級**：由 IT/DevOps 統一管理（例如 `/etc/claude-code/CLAUDE.md`），公司層級的規範。
- **使用者層級 `~/.claude/CLAUDE.md`**：跨專案的個人偏好與規則。
- **專案層級 `./CLAUDE.md` 或 `./.claude/CLAUDE.md`**：專案層級的事實來源，包括工程結構、技術堆疊、驗證指令，隨儲存庫共享。
- **本機層級 `./CLAUDE.local.md`**：個人在專案內的偏好，通常加入 `.gitignore` 而不提交。

此外還有兩項機制：

- **子目錄層級隨選載入**：子目錄裡的 CLAUDE.md 不會在啟動時載入，而是在 Claude 讀取該目錄的檔案時才進入上下文。
- **自動記憶（auto memory）**：Claude 會根據你的糾正和偏好主動寫筆記，依儲存庫共享、跨 worktree 生效，每個 session 最多載入前 200 行或 25KB。

這四種作用範圍構成一個**指令層級**：官方文件說「越具體的指令越晚進入上下文」（專案指令出現在使用者指令之後）。它的價值在於：不是讓模型在每次對話開頭消化一整篇巨型指令，而是依作用範圍就近載入。這正是課程第四講「為什麼單一巨型指令檔案會失敗」的產品化答案。

## 上下文子系統：五層壓縮管線

根據 VILA Lab 對 Claude Code v2.1.88 的原始碼層級拆解《[Dive into Claude Code](https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf)》，當時的系統採用一套**五層 compaction 管線**（five-layer compaction pipeline），不是「滿了就摘要」這麼簡單。課程第五講談「長任務會失去連續性」，Claude Code 的解法是多級漏斗：先進行無損修剪（移除冗餘工具結果），再進行結構化提煉，最後才使用有損的 LLM 摘要，並搭配熔斷機制避免過度壓縮。

與它搭配的是 session 儲存設計：**附加導向的 session 儲存（append-oriented storage）**，所有歷史都附加寫入 `history.jsonl`，支援 `/resume` 復原和 fork 分支。這保證了「每次 session 結束前都做好交接」，不是因為記性好，而是因為儲存層採用附加方式，並且可以重播。

## 工具子系統：四種擴充機制

Claude Code 把擴充介面分成四類，每一類解決一種問題，這是它的設計中最值得借鑑的部分：

- **技能（Skills）**：[官方文件](https://code.claude.com/docs/en/skills)定義，由 `SKILL.md` 描述的程序性知識，依觸發詞自動載入，採漸進式揭露。適合「如何做某件事」的領域知識。
- **MCP**：[官方文件](https://code.claude.com/docs/en/mcp)中的 JSON-RPC 協定會連接外部系統，是「讓模型的手能伸到外部世界」的標準介面。
- **hooks（Hooks）**：[官方文件](https://code.claude.com/docs/en/hooks)掛在 `PreToolUse`、`PostToolUse`、`Stop` 等生命週期事件上的確定性腳本。
- **plugin / subagent（Subagents）**：[官方文件](https://code.claude.com/docs/en/sub-agents)把複雜任務拆給專門化的 agent 執行。

關鍵設計是**職責分離**：CLAUDE.md 管「是什麼」，技能管「怎麼做」，MCP 管「連到哪裡」，hooks 管「何時強制」。團隊如果混用這幾層（例如把 MCP 負責的事寫進 CLAUDE.md），就會出現課程所說的上下文滲漏。

## 回饋與驗證：確定性約束 + 人機分工

課程第十講談「跑通完整流程才算真正驗證」，Claude Code 對應的機制是雙軌制：

**1. permissions 系統（確定性約束）。** Claude Code 的 permissions 不是「全部都詢問一遍」，根據 VILA Lab 對 v2.1.88 的拆解，當時的系統採用七種模式 + 一個基於 ML 的分類器：低風險操作放行，高風險操作則依原則詢問或拒絕（架構細節請參閱 [VILA Lab 拆解](https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf)）。注意 v2.1.88 之後 permissions 模式命名已有變動：目前官方文件（[permission modes](https://code.claude.com/docs/en/permission-modes)）列出 Manual（原 "default"，v2.1.200+ 起改名）、Plan、acceptEdits、Auto、dontAsk 與 bypassPermissions。這是把「為 agent 劃清邊界」（第七講）做成執行時期的強制機制，而不是靠提示詞懇求。

**2. hooks（防止提前宣告完成）。** `PostToolUse` hooks 可以在工具執行後強制檢查、把結果寫回上下文；`Stop` hooks 則在 agent 宣告完成時介入。這就是「做事的人和檢查的人分開」，[Anthropic 在 harness 文章裡明確觀察到](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)，agent 會自信地稱讚自己的工作（"confidently praised their work"），因此用 hooks 注入**確定性**檢查，而不是信任模型的自我評估。

**3. subagent（隔離上下文）。** 每個 subagent 的對話記錄都存在獨立的 sidechain 檔案裡，**不會膨脹父 agent 的上下文**（請參閱 [VILA Lab 拆解](https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf)）。這是「任務邊界」和「上下文隔離」的結合：拆分任務的同時，也隔離上下文污染。

## 可觀測性與 session 持久化

Claude Code 的日誌是完整的附加式記錄（history.jsonl），加上 `/compact`、`/clear`、`/init` 這些明確指令，可主動管理上下文狀態，而不是被動等它滿。`/init` 更是把「讓 agent 每次工作前先初始化」（第六講）做成一條指令，[官方文件](https://code.claude.com/docs/en/memory)指出，它會自動分析程式碼庫並產生初始 CLAUDE.md（包括建置指令、測試說明、工程慣例）。

## 對應到課程框架

| 子系統 | Claude Code 的實現 | 評價 |
| --- | --- | --- |
| 指令 | 作用域分層（組織/用戶/項目/本地）+ 自動記憶 | 分層記憶是標桿實現 |
| 工具 | 技能 + MCP + 鉤子 + 子代理四類擴充 | 職責劃分清晰，是核心亮點 |
| 環境 | 項目內設置 + settings.json | 靠用戶在 CLAUDE.md 裡自描述 |
| 狀態 | 追加式會話儲存 + 五層壓縮（依 VILA v2.1.88 拆解） + resume/fork | 極強，長任務連續性的參考實現 |
| 回饋 | 權限分類器 + PostToolUse 鉤子強制檢查 | 把"防提前宣告完成"變成確定性機制 |

## 值得借鑑的設計

1. **指令依作用範圍分層**，而不是堆在單一檔案裡。目錄層級的 CLAUDE.md 是「就近載入」的漂亮實作。
2. **compaction 是分級漏斗**：先無損、後有損，不要一開始就做全文摘要。
3. **用 hooks 做確定性檢查**：防止提前宣告完成，靠的是執行時期強制，而不是提示詞懇求。
4. **subagent 上下文隔離**：拆任務的同時也拆上下文，不要讓子任務的結果污染主循環。
5. **session 儲存採附加式 + 可重播**：交接不是靠記憶，而是由儲存層保證。

## 參考來源

每一項論述都能追溯到以下來源，避免憑印象轉述：

### Anthropic 官方文件

- **Claude Code 官方文件 · Memory**：每次 session 使用全新上下文、CLAUDE.md 四種作用範圍、子目錄隨選載入、auto memory（200 行 / 25KB）、`/init` 產生 CLAUDE.md。<br/>https://code.claude.com/docs/en/memory
- **Claude Code 官方文件 · Skills / MCP / Hooks / Sub-agents**：四種擴充機制的定義與事件（PreToolUse / PostToolUse / Stop）。<br/>https://code.claude.com/docs/en/skills ｜ https://code.claude.com/docs/en/mcp ｜ https://code.claude.com/docs/en/hooks ｜ https://code.claude.com/docs/en/sub-agents
- **Claude Code 官方文件 · Permission modes**：目前的模式名稱 Manual（原 "default"，v2.1.200+ 起改名）、Plan、acceptEdits、Auto、dontAsk 與 bypassPermissions。<br/>https://code.claude.com/docs/en/permission-modes
- **Anthropic《Effective harnesses for long-running agents》**：「可靠性來自 harness 而非模型」、agent 會自信地稱讚自己的工作、用 hooks 進行驗證等觀點的出處。<br/>https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents

### 獨立研究 / 社群資源

這類來源反映的是特定歷史版本（VILA Lab 拆解時為 Claude Code v2.1.88），可能與目前行為不符。

- **VILA Lab《Dive into Claude Code》**（v2.1.88 原始碼層級拆解報告）：五層 compaction 管線、permissions 七種模式 + ML 分類器、sidechain subagent、附加式 session 儲存 history.jsonl。<br/>https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf
- **Claude Code Full Stack 導讀**（社群，CLAUDE.md / Skills / MCP / Subagents / Hooks 分層）：作為擴充機制職責分離的補充閱讀。<br/>https://jsmanifest.com/claude-code-full-stack-guide

相關講義：[第三講 · 讓程式碼儲存庫成為唯一的事實來源](../../lectures/lecture-03-why-the-repository-must-become-the-system-of-record/) ｜ [第九講 · 防止 agent 提前宣告完成](../../lectures/lecture-09-why-agents-declare-victory-too-early/) ｜ [第十講 · 跑通完整流程才算真正驗證](../../lectures/lecture-10-why-end-to-end-testing-changes-results/)
