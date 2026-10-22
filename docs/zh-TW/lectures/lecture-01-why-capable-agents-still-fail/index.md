[English Version →](../../../en/lectures/lecture-01-why-capable-agents-still-fail/)

> 本篇程式碼示例：[code/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/zh-TW/lectures/lecture-01-why-capable-agents-still-fail/code/)
> 實戰練習：[Project 01. 只寫提示詞讓代理做，和定好規則再讓它做，差多少](./../../projects/project-01-baseline-vs-minimal-harness/index.md)

# 第一講. 模型能力強，不等於執行可靠

2025 年 9 月 29 日，Anthropic 公布 Claude Sonnet 4.5 [在 SWE-bench Verified 上取得 77.2%](https://www.anthropic.com/news/claude-sonnet-4-5)。這個數字乍看還行，但別急著慶祝。那都是精心挑選過的、有明確 issue 描述和現成測試用例的任務。換到你日常開發的場景，需求模糊、沒有現成測試、隱含的業務規則散落在各處，這個數字只會更低。你信心滿滿地交代任務，agent 跑了 20 分鐘告訴你「完成了」，你一看程式碼，加了功能但測試掛了，改了 bug 但引入了新 bug，根本不是你要的東西。

遇到這種情況，大部分人的第一反應是「這模型不行，得換一個更貴的。」先別急著掏錢包。問題可能根本不在模型身上。

## 同一匹馬，兩種命運

Anthropic 比較過同一個 prompt（「做一個 2D 復古遊戲編輯器」）、同一個模型（Opus 4.5）在兩種 harness 下的表現。第一次讓它裸跑，20 分鐘，花了 $9：應用能開啟，但實體對輸入沒有反應。第二次給它配上完整的 harness（planner + generator + evaluator 三 agent 架構），6 小時，花了 $200：能移動實體，但物理有粗糙之處，還有一面牆擋住去路。[核心玩法能跑，應用仍不完整](https://www.anthropic.com/engineering/harness-design-long-running-apps)。

模型沒換。Opus 4.5 還是那個 Opus 4.5。換的是馬具。

OpenAI 在 2025 年發佈的 harness engineering 文章裡說得更直接，Codex 在一個 harness 搭得好的儲存庫裡，表現能從「不可靠」變成「可靠」。注意他們的用詞，那不是「好了一點」，是質變。harness 就是**模型權重之外的一切工程基礎設施**。

## agent 到底卡在哪

那具體是什麼在出問題？

最常見的問題是任務說得不夠完整。你說「加個搜尋功能」，agent 理解的跟你完全不一樣。搜尋範圍是全文字還是結構化、要不要分頁、要不要標記，這些細節你沒說清楚，agent 就只能自己猜。猜對了是運氣，猜錯了你再改，改的成本比一開始說清楚還高。

就算你說清了，專案裡隱含的架構約定 agent 也不知道。你們團隊統一用 SQLAlchemy 2.0 的新語法，但 agent 預設寫了 1.x 的程式碼。所有 API 端點必須走 OAuth 2.0 認證，但這個規則只存在於你腦子裡和一個三個月前的 Slack 消息裡。Agent 看不到這些，它不是不想遵守，是壓根不知道有這回事。

環境也是個坑。開發環境配置不完整、依賴缺了、工具版本不對。Agent 把寶貴的脈絡視窗花在了 `pip install` 失敗、Node 版本不對這些事上，而不是解決你的核心任務。

更常見的問題是壓根沒有驗證手段。沒有測試、沒有 lint、或者驗證命令根本沒告訴 agent。Agent 寫完程式碼，自己看了看覺得沒問題，就說完成了。Anthropic 還觀察到一個有意思的現象，當 agent 感覺脈絡快滿了，它們會匆忙結束目前工作，跳過驗證步驟，選一個簡單的方案而不是最優方案。他們把這叫「脈絡焦慮」。

長任務跨工作階段就更慘了，上次工作階段的發現全丟了，每個新工作階段都得重新探索專案結構、理解程式碼組織。缺乏持久化狀態的 agent 在超過 30 分鐘的任務中失敗率急劇上升。

## 關鍵名詞解釋

理解了上面的場景，這些概念就不再是一堆術語了：

- **能力鴻溝（Capability Gap）**：模型在基準測試上的表現和真實任務上的表現之間的巨大落差。基準任務的 issue 描述、測試和環境是給定的；真實任務裡，這些往往要你自己補。
- **Harness**：模型之外的一切，包括指令、工具與環境，以及狀態管理和驗證機制。不是模型權重的部分，全是 harness。
- **Harness 誘導失敗**：模型本身能力足夠，但因為執行環境有結構性缺陷而失敗。上面的復古遊戲對比就是一個例子。
- **驗證缺口**：agent 對自己輸出的信心評估和實際正確性之間的偏差。agent 說「我做完了」但實際沒做完，這是最常見的失敗模式。
- **診斷循環**：執行 → 觀察失敗 → 定位到 harness 的哪一層出了問題 → 修補那一層 → 重新執行。這是 harness 工程的核心方法論。
- **完成定義（Definition of Done）**：一組可以用命令驗證的條件，測試通過、lint 沒報錯、類型檢查通過。沒有顯式的完成定義，agent 就會自己編一個。

## 遇到失敗，先修 harness

核心原則，**遇到失敗，先別換模型，先檢查 harness。** 如果同一個模型在類似的結構良好的任務中能成功，那優先假設是 harness 的問題。

具體怎麼做。

**每次失敗都歸因到具體層。** 不要籠統地說「模型不行」，而是問，是任務沒說清楚？是脈絡不夠？是沒有驗證手段？把每次失敗歸到五層防禦，任務規範、脈絡供給、執行環境、驗證回饋、狀態管理。養成這個習慣，你會發現「模型不行」這個結論在你的日誌裡出現得越來越少。

**給每個任務寫顯式的完成定義。** 不要說「加個搜尋功能」，要說：
```
完成標準：
- 新增 GET /api/search?q=xxx 端點
- 支援分頁，預設 20 條
- 返回結果包含標記片段
- 所有新程式碼通過 pytest
- 類型檢查通過（mypy --strict）
```

**建立 AGENTS.md 檔案。** 在儲存庫根目錄放一個檔案，告訴 agent 這個專案的技術堆疊、架構約定、驗證命令。這是 harness 工程的第一步，也是投入產出比最高的一步。一個 `AGENTS.md` 檔案可能比你換一個更貴的模型更有效，這不是誇張。

**建立診斷循環。** 不要把失敗當作「模型又犯傻了」，而是當作「harness 又暴露了一個缺陷」的信號。每次失敗 → 定位層 → 修補 → 下次不再犯。幾輪下來，你的 harness 會越來越強，agent 的表現會穩定提升。

**量化改進。** 記個簡單的日誌，每個任務成功了沒有，失敗了是哪一層的問題。跑幾輪之後你就能看出來哪個層是瓶頸，集中火力修那個層。

## 一百萬行程式碼的實驗

2025 年 8 月，OpenAI 的三個工程師用 Codex 從一個空的 git 儲存庫起步，建構一個完整的內部產品。[五個月後，這個儲存庫有大約 100 萬行程式碼](https://openai.com/index/harness-engineering/)，應用邏輯、基礎設施、工具、文件、內部開發工具，全部由 agent 生成。團隊後來擴展到七個工程師，一共合併了大約 1,500 個 PR，平均每人每天 3.5 個 PR。

這個實驗的關鍵約束，是**人類永遠不直接寫程式碼。** 這個設定是為了逼團隊搞清楚，當工程師的主要工作不再是寫程式碼，而是設計環境、表達意圖、建構回饋迴路時，到底什麼變了？

早期進展比預期慢。原因在於環境不夠完整，agent 缺少必要的工具、抽象和內部結構來推進高層次目標。工程師的工作變成了，把大目標拆成小積木（設計、編碼、審查、測試），讓 agent 去搭建，然後用這些積木解鎖更復雜的任務。當某件事失敗了，修復方向幾乎從來都不靠「更努力」，真正的問題是找清楚 agent 缺什麼能力、怎麼讓它既可理解又可執行。

這個實驗直接證明了本講的核心論點，**同一個模型，在空白環境裡和在有完整 harness 的環境裡，產出有本質差異。** 模型沒變，變的是環境。

> 來源：[OpenAI: Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)

## 一個更親民的例子

一個團隊用 Claude Sonnet 給一個中等規模的 Python Web 應用（FastAPI + PostgreSQL + Redis，約 15,000 行程式碼）添加新的 API 端點。

起初他們只給了一句話：「在 `/api/v2/users` 下添加使用者偏好設置端點」。結果呢？agent 把大量時間花在探索儲存庫結構上，產出了看似合理的程式碼但沒遵循專案的錯誤處理模式，用了舊版 SQLAlchemy 語法，宣稱完成但端點實際有執行時期錯誤。下一個工作階段還得重新做發現工作。

後來他們加了 `AGENTS.md`（描述專案架構和技術堆疊版本）、顯式的驗證命令（`pytest tests/api/v2/ && python -m mypy src/`）、和架構決策記錄。同一個模型開始遵循專案約定，並用能執行的命令檢查工作。

模型沒變。變的還是 harness。

## 帶走什麼

- 模型能力和執行可靠性是兩回事。千里馬也得配上好馬具。
- 失敗的時候先看 harness，再看模型。換模型是成本最高的選擇，而且很多時候根本不是模型的問題。
- 每次失敗都是一個信號：你的 harness 有結構性缺陷。把它找出來、修掉。
- 別只說「模型不行」。先排查任務描述和脈絡是否足夠，再確認環境和驗證手段是否到位，最後看跨工作階段的狀態是否有持久化。十次裡有九次，問題出在這幾層之中。
- 一個 `AGENTS.md` 檔案可能比你換一個更貴的模型更有效。

## 延伸閱讀

- [OpenAI: Harness Engineering — Leveraging Codex in an Agent-First World](https://openai.com/index/harness-engineering/)
- [Anthropic: Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [HumanLayer: Skill Issue — Harness Engineering for Coding Agents](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents)
- [SWE-bench Leaderboard](https://www.swebench.com/)
- [Thoughtworks Technology Radar: Harness Engineering](https://www.thoughtworks.com/radar)

## 練習

1. **對比實驗**：選一個你熟悉的程式碼儲存庫和一項非平凡的修改任務。先不給任何 harness 支援，讓 agent 跑一次，記錄失敗。然後加一個 `AGENTS.md` 和顯式的驗證命令，讓同一個 agent 再跑一次。對比兩次的結果，把失敗歸因到五層防禦中的某一層。

2. **驗證缺口測量**：選 5 個編碼任務，在每個任務完成後記錄 agent 是否聲稱完成，然後用獨立測試驗證實際正確性。計算 agent 在實際沒完成時聲稱完成的比例，這就是你的驗證缺口。然後想想：加什麼驗證命令能把這個比例降下來？

3. **診斷循環實踐**：找一個 agent 在你的專案中反覆失敗的任務。跑一次，記錄失敗。歸因到五層中的某一層。修那一層。再跑。重複三到五輪，記錄每一輪的改善。
