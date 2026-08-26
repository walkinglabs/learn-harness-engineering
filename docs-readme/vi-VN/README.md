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

> **Khóa học dựa trên dự án về xây dựng môi trường, quản lý trạng thái, cơ chế kiểm chứng và điều khiển giúp các agent viết code AI hoạt động đáng tin cậy.**

Learn Harness Engineering là một khóa học dành riêng cho kỹ thuật liên quan đến các agent viết code AI. Chúng tôi đã nghiên cứu sâu và tổng hợp các lý thuyết và thực tiễn Harness Engineering tiên tiến nhất trong ngành. Các tài liệu tham khảo cốt lõi của chúng tôi bao gồm:

> **🆕 Cập nhật tháng 8/2026: Phân tích Thiết kế Harness Tiên phong** — chuyên mục mới với 4 bài phân tích:
>
> - **Chuyên mục mới** [Phân tích Thiết kế Harness Tiên phong](../../docs/vi/harness-designs/index.md) — áp dụng framework năm hệ thống con của khóa học (chỉ dẫn, công cụ, môi trường, trạng thái, phản hồi) để phân tích ngược cách bốn sản phẩm tiên phong xây dựng harness thực tế.
> - **Pi** [Cách Pi xây dựng harness](../../docs/vi/harness-designs/pi/index.md) — kernel tối giản, khả năng mở rộng có thể lập trình và kỹ thuật ngữ cảnh đằng sau triết lý “yêu cầu Pi xây dựng điều bạn muốn”.
> - **Claude Code** [Cách Claude Code xây dựng harness](../../docs/vi/harness-designs/claude-code/index.md) — bộ nhớ bốn lớp, cơ chế compaction năm cấp, hooks và sự cô lập sub-agent.
> - **Codex** [Cách Codex xây dựng harness](../../docs/vi/harness-designs/codex/index.md) — repository là nguồn chân lý, AGENTS.md là trang thư mục và sự cô lập bằng worktree.
> - **DeepSeek** [Cách DeepSeek xây dựng harness](../../docs/vi/harness-designs/deepseek/index.md) — “mọi thứ đều là plugin”, các đường ranh giới năng lực và pipeline sự kiện.
> - **Đầy đủ cả 15 ngôn ngữ** — được dịch đầy đủ sang tất cả các ngôn ngữ được hỗ trợ.
>
> **Ý tưởng cốt lõi:** Khóa học cung cấp cho bạn một framework; các bài phân tích này cho thấy những nguyên tắc tương tự thực sự được áp dụng như thế nào trong các harness production.
>
> **🆕 Cập nhật tháng 8/2026: Graph Engineering (Kỹ thuật Đồ thị)** — thêm mới 1 bài giảng + 1 dự án:
>
> - **Bài giảng 14** [Từ Vòng lặp Đơn lẻ đến Kỹ thuật Đồ thị](../../docs/vi/lectures/lecture-14-graph-engineering/index.md): vì sao vòng lặp đơn lẻ chắc chắn phát triển thành đồ thị — bốn lớp xếp chồng (prompt → context → loop → graph) và vị trí của harness trong đó, bốn bộ phận của đồ thị (nút, cạnh, trạng thái dùng chung, định tuyến), vì sao checkpoint trong loop không cứu được ba kiểu thất bại mang tính cấu trúc ở quy mô lớn (Goodhart, mù hướng lên, xung đột), sáu bước xây dựng đồ thị đầu tiên của bạn không phụ thuộc framework, sự khác biệt giữa Graph và Workflow, mỏ neo, hiện trạng dự án mã nguồn mở trước-phát hành vs sau-phát hành, thuế điều phối, và khi nào thực sự đáng để vẽ đồ thị.
> - **Dự án 08** [Vẽ Quy trình Làm việc của bạn thành một Đồ thị](../../docs/vi/projects/project-08-graph-engineering-first-graph/index.md): ba thí nghiệm tiến dần — vẽ maker-checker loop thành đồ thị tường minh, thêm nút fan-out/fan-in song song, thêm cạnh quay lại có điều kiện và nút phê duyệt thủ công.
>
> **Ý tưởng cốt lõi:** Loop là một đồ thị chỉ có một nút. Khi nhiệm vụ cần phân công, song song, trạng thái dùng chung, xác minh và phục hồi — nó không còn là loop, mà là đồ thị.
>
> **🆕 Cập nhật tháng 7/2026: Loop Engineering (Kỹ thuật Vòng lặp)** — thêm mới 1 bài giảng + 1 dự án + mẫu code:
>
> - **Bài giảng 13** [Từ Nhắc lệnh Thủ công đến Vòng lặp Tự chủ](../../docs/vi/lectures/lecture-13-loop-engineering/index.md): từ `/goal` đến sáu nguyên thủy của loop engineering (automations, worktrees, skills, connectors, sub-agents, external state), phân tách generator/evaluator, bốn chi phí thầm lặng, và xây dựng từng bước vòng lặp đầu tiên của bạn.
> - **Dự án 07** [Xây dựng Vòng lặp Tự động Đầu tiên](../../docs/vi/projects/project-07-loop-engineering-first-loop/index.md): ba thí nghiệm tiến dần — vòng lặp theo mục tiêu, vòng lặp theo lịch, vòng lặp maker-checker. So sánh thủ công vs. tự động hóa, đo lường việc giảm can thiệp, học cách bước ra khỏi vòng lặp.
> - **Mẫu code**: `goal-template.md`, `loop-state-template.md`, `maker-prompt.md`, `checker-prompt.md` — các mẫu xây dựng vòng lặp dùng ngay được.
>
> **Ý tưởng cốt lõi:** Harness engineering tạo ra chiếc xe. Loop engineering thiết kế con đường nó chạy — và bạn phải thiết kế con đường đó từ bên ngoài chiếc xe.

- [OpenAI: Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)
- [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Anthropic: Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [Awesome Harness Engineering](https://github.com/walkinglabs/awesome-harness-engineering)

> **Bắt đầu nhanh?** Skill [`skills/harness-creator/`](../../skills/harness-creator/) có thể giúp bạn tạo nhanh một harness cấp sản xuất (AGENTS.md, feature lists, init.sh, quy trình kiểm chứng) cho dự án của riêng bạn chỉ trong vài phút.

---

## Mục lục

- [Xem trước trực quan](#xem-trước-trực-quan)
- [Harness Engineering thực sự có nghĩa là gì](#harness-engineering-thực-sự-có-nghĩa-là-gì)
- [Bắt đầu nhanh: Cải thiện Agent của bạn ngay hôm nay](#bắt-đầu-nhanh-cải-thiện-agent-của-bạn-ngay-hôm-nay)
- [Dự án tổng kết: Một ứng dụng thực tế](#dự-án-tổng-kết-một-ứng-dụng-thực-tế)
- [Lộ trình học tập](#lộ-trình-học-tập)
- [Giáo trình](#giáo-trình)
- [Skills](#skills)
- [Các khóa học khác](#các-khóa-học-khác)

---

## Xem trước trực quan

### Trang chủ khóa học
> Tổng quan khóa học toàn diện và giới thiệu về các triết lý cốt lõi, cung cấp lộ trình rõ ràng để bắt đầu.

![Xem trước trang chủ khóa học](../../docs/public/screenshots/readme/zh-home.png)

### Bài giảng nhập môn
> Đi sâu vào các vấn đề thực tế và dự án thực hành (như Dự án 01) mang đến trải nghiệm học tập nhập môn.

![Xem trước bài giảng khóa học](../../docs/public/screenshots/readme/zh-lecture-01.png)

### Thư viện tài nguyên sẵn sàng sử dụng
> Các mẫu và cấu hình tham khảo được thiết kế để giải quyết các vấn đề phổ biến trong phát triển agent AI nhiều lượt, chẳng hạn như mất ngữ cảnh và hoàn thành tác vụ quá sớm.

![Xem trước thư viện tài nguyên](../../docs/public/screenshots/readme/zh-resources.png)

## Sách giáo trình PDF

Kho lưu trữ hiện đã bao gồm quy trình xây dựng PDF cho nội dung khóa học.

- Chạy `npm run pdf:build` để tạo PDF tiếng Anh và tiếng Trung tại máy cục bộ.
- Các tệp đầu ra được ghi vào `artifacts/pdfs/`.
- Chạy `npm run screenshots:readme` nếu bạn muốn làm mới hình ảnh xem trước README.
- GitHub Actions workflow [`release-course-pdfs.yml`](../../.github/workflows/release-course-pdfs.yml) có thể xây dựng PDF và xuất bản chúng lên GitHub Releases.

---

## Mô hình thì thông minh, Harness giúp nó đáng tin cậy

Có một sự thật khắc nghiệt mà hầu hết mọi người đều học theo cách khó khăn nhất: **mô hình mạnh nhất thế giới vẫn sẽ thất bại trên các tác vụ kỹ thuật thực tế nếu bạn không xây dựng một môi trường phù hợp xung quanh nó.**

Bạn có thể đã tự thấy điều này. Bạn giao một tác vụ cho Claude hoặc GPT trong kho mã của mình. Nó bắt đầu tốt — đọc tệp, viết code, trông có vẻ hiệu quả. Sau đó có điều gì đó sai. Nó bỏ qua một bước. Nó làm hỏng một bài kiểm tra. Nó nói "xong" nhưng thực tế không có gì hoạt động. Bạn dành nhiều thời gian hơn để dọn dẹp so với việc tự làm.

Đây không phải là vấn đề của mô hình. Đây là vấn đề của harness.

Bằng chứng là rõ ràng. Anthropic đã thực hiện một thí nghiệm đối chứng: cùng mô hình (Opus 4.5), cùng prompt ("xây dựng trình soạn thảo game retro 2D"). Không có harness, nó tiêu tốn 9 đô la trong 20 phút và tạo ra thứ gì đó không hoạt động. Với harness đầy đủ (planner + generator + evaluator), nó tiêu tốn 200 đô la trong 6 giờ và xây dựng một game mà bạn có thể thực sự chơi được. Mô hình không thay đổi. Harness đã thay đổi.

OpenAI cũng báo cáo điều tương tự với Codex: trong một kho mã được harness tốt, cùng mô hình chuyển từ "không đáng tin cậy" sang "đáng tin cậy." Không phải là cải thiện nhỏ — mà là sự chuyển đổi về chất.

**Khóa học này dạy bạn cách xây dựng môi trường đó.**

```text
                    MÔ HÌNH HARNESS
                    ===============

    Bạn --> giao tác vụ --> Agent đọc tệp harness --> Agent thực thi
                                                        |
                                              harness điều phối mọi bước:
                                              |
                                              +--> Hướng dẫn:   làm gì, theo thứ tự nào
                                              +--> Phạm vi:     một tính năng mỗi lần, không vượt quá
                                              +--> Trạng thái:  nhật ký tiến trình, danh sách tính năng, lịch sử git
                                              +--> Kiểm chứng:  bài kiểm tra, lint, kiểm tra kiểu, chạy thử
                                              +--> Vòng đời:    khởi tạo lúc bắt đầu, trạng thái sạch lúc kết thúc
                                              |
                                              v
                                         Agent chỉ dừng khi
                                         kiểm chứng đạt yêu cầu
```

---

## Harness Engineering thực sự có nghĩa là gì

Harness engineering là về việc xây dựng một môi trường làm việc hoàn chỉnh xung quanh mô hình để nó tạo ra kết quả đáng tin cậy. Nó không phải là về việc viết prompt tốt hơn. Nó là về việc thiết kế hệ thống mà mô hình hoạt động bên trong.

Một harness có năm hệ thống con:

```text
    ┌─────────────────────────────────────────────────────────────────┐
    │                          HARNESS                                │
    │                                                                 │
    │   ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
    │   │  Hướng dẫn   │  │  Trạng thái  │  │     Kiểm chứng       │ │
    │   │              │  │              │  │                      │ │
    │   │ AGENTS.md    │  │ progress.md  │  │ tests + lint         │ │
    │   │ CLAUDE.md    │  │ feature_list │  │ kiểm tra kiểu        │ │
    │   │ feature_list │  │ git log      │  │ chạy thử             │ │
    │   │ docs/        │  │ bàn giao phiên│  │ pipeline e2e         │ │
    │   └──────────────┘  └──────────────┘  └──────────────────────┘ │
    │                                                                 │
    │   ┌──────────────┐  ┌──────────────────────────────────────┐   │
    │   │   Phạm vi    │  │        Vòng đời phiên                │   │
    │   │              │  │                                      │   │
    │   │ một tính     │  │ init.sh lúc bắt đầu                  │   │
    │   │ năng mỗi lần │  │ danh sách kiểm tra sạch lúc kết thúc │   │
    │   │ định nghĩa   │  │ ghi chú bàn giao cho phiên tiếp      │   │
    │   │ "hoàn thành" │  │ commit chỉ khi an toàn để tiếp tục   │   │
    │   └──────────────┘  └──────────────────────────────────────┘   │
    │                                                                 │
    └─────────────────────────────────────────────────────────────────┘

    MÔ HÌNH quyết định viết code gì.
    HARNESS điều phối khi nào, ở đâu và viết như thế nào.
    Harness không làm mô hình thông minh hơn.
    Nó làm đầu ra của mô hình đáng tin cậy hơn.
```

Mỗi hệ thống con có một nhiệm vụ duy nhất:

- **Instructions** — Cho agent biết phải làm gì, theo thứ tự nào, và phải đọc gì trước khi bắt đầu. Không phải một tệp khổng lồ duy nhất; mà là cấu trúc tiết lộ dần mà agent điều hướng theo nhu cầu.
- **State** — Theo dõi những gì đã làm, những gì đang tiến hành, và những gì tiếp theo. Được lưu trữ trên đĩa để phiên tiếp theo tiếp tục chính xác nơi phiên trước đã dừng.
- **Verification** — Chỉ một bộ bài kiểm tra đạt mới được tính là bằng chứng. Agent không thể tuyên bố hoàn thành mà không có bằng chứng có thể chạy được.
- **Scope** — Giới hạn agent ở một tính năng tại một thời điểm. Không vượt quá phạm vi. Không hoàn thành một nửa ba việc. Không viết lại danh sách tính năng để che giấu công việc chưa hoàn thành.
- **Session Lifecycle** — Khởi tạo ở đầu. Dọn dẹp ở cuối. Để lại đường dẫn khởi động lại sạch cho phiên tiếp theo.

---

## Tại sao khóa học này tồn tại

Câu hỏi không phải là "mô hình có thể viết code không?" Chúng có thể. Câu hỏi là: **chúng có thể hoàn thành đáng tin cậy các tác vụ kỹ thuật thực tế bên trong các kho mã thực tế, qua nhiều phiên, mà không cần giám sát liên tục từ con người không?**

Hiện tại, câu trả lời là: không thể nếu không có harness.

```text
    KHÔNG CÓ HARNESS                          CÓ HARNESS
    ================                          ==========

    Phiên 1: agent viết code                  Phiên 1: agent đọc hướng dẫn
              agent làm hỏng bài kiểm tra              agent chạy init.sh
              agent nói "xong rồi"                     agent làm một tính năng
              bạn tự sửa thủ công                      agent kiểm chứng trước khi nói xong
                                                         agent cập nhật nhật ký tiến trình
    Phiên 2: agent bắt đầu lại từ đầu                  agent commit trạng thái sạch
              agent không nhớ
              những gì đã xảy ra trước đó       Phiên 2: agent đọc nhật ký tiến trình
              agent làm lại từ đầu                      agent tiếp tục chính xác nơi đã dừng
              hoặc làm hoàn toàn việc khác              agent tiếp tục tính năng chưa xong
              bạn lại phải sửa lại                     bạn đánh giá, không phải cứu vãn

    Kết quả: bạn dành nhiều thời gian            Kết quả: agent làm công việc,
            dọn dẹp hơn là nếu bạn                       bạn kiểm chứng kết quả
            tự làm lấy
```

Những câu hỏi mà khóa học này thực sự quan tâm:

- Những thiết kế harness nào cải thiện tỷ lệ hoàn thành tác vụ?
- Những thiết kế nào giảm thiểu việc làm lại và hoàn thành không chính xác?
- Những cơ chế nào giữ cho các tác vụ chạy dài tiến triển ổn định?
- Những cấu trúc nào giữ cho hệ thống có thể bảo trì sau nhiều lần chạy agent?

---

## Giáo trình & Tài liệu khóa học

Để xem đầy đủ tài liệu khóa học, vui lòng truy cập **[Trang web Tài liệu](https://walkinglabs.github.io/learn-harness-engineering/)**.

Giáo trình được chia thành ba phần:

1. **Bài giảng**: 14 đơn vị khái niệm giải thích lý thuyết đằng sau harness engineering.
2. **Dự án**: 8 dự án thực hành nơi bạn xây dựng một không gian làm việc agentic từ đầu.
3. **Thư viện tài nguyên**: Các mẫu sẵn sàng sử dụng (`AGENTS.md`, `feature_list.json`, `init.sh`, v.v.) để sử dụng trong kho mã của riêng bạn ngay hôm nay.

---

## Bắt đầu nhanh: Cải thiện Agent của bạn ngay hôm nay

Bạn không cần phải đọc cả 14 bài giảng trước khi bắt đầu nhận được giá trị. Nếu bạn đang sử dụng một agent viết code trên một dự án thực tế, đây là cách cải thiện nó ngay bây giờ.

Ý tưởng rất đơn giản: thay vì chỉ viết prompt, hãy cho agent của bạn một bộ tệp có cấu trúc xác định phải làm gì, những gì đã làm, và cách kiểm chứng công việc. Các tệp này nằm trong kho mã của bạn, vì vậy mỗi phiên bắt đầu từ cùng một trạng thái.

```text
    THƯ MỤC GỐC DỰ ÁN CỦA BẠN
    ├── AGENTS.md              <-- sổ tay vận hành của agent
    ├── CLAUDE.md              <-- (thay thế, nếu dùng Claude Code)
    ├── init.sh                <-- chạy cài đặt + xác minh + khởi động
    ├── feature_list.json      <-- tính năng nào tồn tại, cái nào đã xong
    ├── claude-progress.md     <-- những gì đã xảy ra trong mỗi phiên
    └── src/                   <-- code thực tế của bạn
```

Lấy các mẫu khởi đầu từ [Thư viện tài nguyên](https://walkinglabs.github.io/learn-harness-engineering/en/resources/) và đưa chúng vào dự án của bạn. Đó là tất cả. Bốn tệp, và các phiên agent của bạn sẽ đã ổn định hơn đáng kể so với việc chỉ chạy trên prompt.

---

## Dự án tổng kết: Một ứng dụng thực tế

Tất cả sáu dự án khóa học đều xoay quanh cùng một sản phẩm: **một ứng dụng desktop cơ sở tri thức cá nhân dựa trên Electron**.

```text
    ┌─────────────────────────────────────────────────────┐
    │          Ứng dụng Desktop Cơ sở Tri thức            │
    │                                                     │
    │  ┌──────────────┐  ┌──────────────────────────────┐│
    │  │ Danh sách tài │  │       Bảng Hỏi-Đáp          ││
    │  │   liệu       │  │                              ││
    │  │ doc-001.md   │  │  H: Harness engineering là gì?││
    │  │ doc-002.md   │  │  Đ: Môi trường được xây dựng ││
    │  │ doc-003.md   │  │     quanh một mô hình agent...││
    │  │ ...          │  │     [trích dẫn: doc-002.md]  ││
    │  └──────────────┘  └──────────────────────────────┘│
    │                                                     │
    │  ┌─────────────────────────────────────────────────┐│
    │  │ Thanh trạng thái: 42 tài liệu | 38 đã lập chỉ │││
    │  │                     mục | đồng bộ lần cuối 3p  │││
    │  └─────────────────────────────────────────────────┘│
    └─────────────────────────────────────────────────────┘

    Tính năng cốt lõi:
    ├── Nhập tài liệu cục bộ
    ├── Quản lý thư viện tài liệu
    ├── Xử lý và lập chỉ mục tài liệu
    ├── Chạy Hỏi-Đáp AI trên nội dung đã nhập
    └── Trả lời có căn cứ kèm trích dẫn
```

Dự án này được chọn vì nó kết hợp giá trị thực tế cao, đủ độ phức tạp sản phẩm thực tế, và môi trường tốt để quan sát sự cải thiện harness trước/sau.

Mỗi starter/solution của dự án khóa học là một bản sao hoàn chỉnh của ứng dụng Electron ở giai đoạn tiến hóa đó. Starter của P(N+1) được tạo từ solution của P(N) — ứng dụng tiến hóa khi kỹ năng harness của bạn phát triển.

---

## Lộ trình học tập

Khóa học được thiết kế để hoàn thành theo thứ tự. Mỗi giai đoạn xây dựng dựa trên giai đoạn trước.

```text
    Giai đoạn 1: NHÌN VẤN ĐỀ              Giai đoạn 2: TỔ CHỨC KHO MÃ
    =========================              ===========================

    L01  Mô hình mạnh ≠ thực thi          L03  Kho mã là nguồn
         đáng tin cậy                            chân lý duy nhất
    L02  Harness thực sự nghĩa là gì
                                       L04  Chia hướng dẫn thành nhiều
         |                                   tệp, không phải một tệp khổng lồ
         v
    P01  Chỉ dùng prompt vs.                    |
         ưu tiên quy tắc                         v
                                               P02  Không gian làm việc agent đọc được


    Giai đoạn 3: KẾT NỐI CÁC PHIÊN       Giai đoạn 4: PHẢN HỒI & PHẠM VI
    ==============================        ================================

    L05  Giữ ngữ cảnh sống                L07  Vẽ ranh giới tác vụ rõ ràng
         qua các phiên
                                       L08  Danh sách tính năng như
    L06  Khởi tạo trước mọi                     nguyên thủy harness
         phiên agent
                                               |
         |                                     v
         v                                     P04  Phản hồi thời gian chạy
    P03  Tính liên tục đa phiên                   sửa hành vi agent


    Giai đoạn 5: KIỂM CHỨNG              Giai đoạn 6: TỔNG HỢP TẤT CẢ
    =========================             =============================

    L09  Ngăn agent tuyên bố              L11  Làm thời gian chạy của
         hoàn thành quá sớm                     agent có thể quan sát

    L10  Chạy toàn bộ pipeline =          L12  Bàn giao sạch ở cuối
         kiểm chứng thực sự                     mọi phiên

         |                                     |
         v                                     v
    P05  Agent tự kiểm chứng              P06  Xây dựng harness hoàn chỉnh
                                               (dự án tổng kết)


    Giai đoạn 7: TỰ ĐỘNG HÓA VÒNG LẶP
    ==============================
    L13  Ngừng nhắc lệnh cho agent —
         chuyển sang thiết kế vòng lặp
         |
         v
    P07  Xây dựng vòng lặp tự động đầu tiên
         (vòng lặp theo mục tiêu, theo lịch,
          maker-checker)

    Giai đoạn 8: CẤU TRÚC HÓA HỆ THỐNG
    ==============================
    L14  Vẽ hệ thống thành một đồ thị —
         nút, cạnh, trạng thái dùng chung, định tuyến
         |
         v
    P08  Vẽ quy trình làm việc của bạn thành một đồ thị
         (đồ thị tường minh, fan-out/fan-in song song,
          cạnh quay lại, người-máy cộng tác)
```

Mỗi giai đoạn mất khoảng một tuần nếu bạn học bán thời gian. Nếu bạn muốn đi nhanh hơn, các giai đoạn 1-3 có thể hoàn thành trong một cuối tuần dài.

---

## Giáo trình

### Bài giảng — 14 đơn vị khái niệm, mỗi đơn vị trả lời một câu hỏi cốt lõi

*Đọc toàn bộ văn bản cho mỗi bài giảng trên [Trang web Tài liệu](https://walkinglabs.github.io/learn-harness-engineering/).*

| Phiên | Câu hỏi | Ý tưởng cốt lõi |
|-------|---------|------------------|
| [L01](../../docs/vi/lectures/lecture-01-why-capable-agents-still-fail/index.md) | Tại sao các mô hình mạnh vẫn thất bại trên tác vụ thực tế? | Khoảng cách năng lực giữa benchmark và kỹ thuật thực tế |
| [L02](../../docs/vi/lectures/lecture-02-what-a-harness-actually-is/index.md) | "Harness" thực sự có nghĩa là gì? | Năm hệ thống con: instructions, state, verification, scope, lifecycle |
| [L03](../../docs/vi/lectures/lecture-03-why-the-repository-must-become-the-system-of-record/index.md) | Tại sao kho mã phải là nguồn chân lý duy nhất? | Nếu agent không thể thấy nó, nó không tồn tại |
| [L04](../../docs/vi/lectures/lecture-04-why-one-giant-instruction-file-fails/index.md) | Tại sao một tệp hướng dẫn khổng lồ lại thất bại? | Tiết lộ dần: cho một bản đồ, không phải một bộ bách khoa toàn thư |
| [L05](../../docs/vi/lectures/lecture-05-why-long-running-tasks-lose-continuity/index.md) | Tại sao các tác vụ chạy dài mất tính liên tục? | Lưu trữ tiến trình vào đĩa; tiếp tục từ nơi bạn đã dừng |
| [L06](../../docs/vi/lectures/lecture-06-why-initialization-needs-its-own-phase/index.md) | Tại sao khởi tạo cần một giai đoạn riêng? | Xác minh môi trường khỏe mạnh trước khi agent bắt đầu làm việc |
| [L07](../../docs/vi/lectures/lecture-07-why-agents-overreach-and-under-finish/index.md) | Tại sao agent lại vượt quá phạm vi và không hoàn thành? | Một tính năng tại một thời điểm; định nghĩa rõ ràng về "hoàn thành" |
| [L08](../../docs/vi/lectures/lecture-08-why-feature-lists-are-harness-primitives/index.md) | Tại sao danh sách tính năng là nguyên thủy của harness? | Ranh giới phạm vi có thể đọc bởi máy mà agent không thể bỏ qua |
| [L09](../../docs/vi/lectures/lecture-09-why-agents-declare-victory-too-early/index.md) | Tại sao agent tuyên bố hoàn thành quá sớm? | Khoảng trống kiểm chứng: sự tự tin ≠ sự chính xác |
| [L10](../../docs/vi/lectures/lecture-10-why-end-to-end-testing-changes-results/index.md) | Tại sao kiểm thử đầu-cuối lại thay đổi kết quả? | Chỉ một lần chạy toàn bộ pipeline mới được tính là kiểm chứng thực sự |
| [L11](../../docs/vi/lectures/lecture-11-why-observability-belongs-inside-the-harness/index.md) | Tại sao khả năng quan sát thuộc về bên trong harness? | Nếu bạn không thể thấy agent đã làm gì, bạn không thể sửa những gì nó đã làm hỏng |
| [L12](../../docs/vi/lectures/lecture-12-why-every-session-must-leave-a-clean-state/index.md) | Tại sao mỗi phiên phải để lại trạng thái sạch? | Sự thành công của phiên tiếp theo phụ thuộc vào việc dọn dẹp của phiên này |
| [L13](../../docs/vi/lectures/lecture-13-loop-engineering/index.md) | Tại sao bạn cần ngừng tự nhắc lệnh cho agent của mình? | Từ điều khiển thủ công đến vòng lặp tự chủ — vòng lặp theo mục tiêu, vòng lặp theo lịch, tách maker-checker |
| [L14](../../docs/vi/lectures/lecture-14-graph-engineering/index.md) | Tại sao một vòng lặp đơn lẻ phát triển thành đồ thị? | Từ vòng lặp đơn lẻ đến kỹ thuật đồ thị — nút, cạnh, trạng thái dùng chung, định tuyến, và khi nào thực sự đáng để vẽ đồ thị |

### Dự án — 8 dự án thực hành áp dụng phương pháp bài giảng vào cùng ứng dụng Electron

| Dự án | Những gì bạn làm | Cơ chế Harness |
|-------|-------------------|----------------|
| [P01](../../docs/vi/projects/project-01-baseline-vs-minimal-harness/index.md) | Chạy cùng tác vụ hai lần: chỉ dùng prompt vs. ưu tiên quy tắc | Harness tối thiểu: AGENTS.md + init.sh + feature_list.json |
| [P02](../../docs/vi/projects/project-02-agent-readable-workspace/index.md) | Tái cấu trúc kho mã để agent có thể đọc được | Không gian làm việc agent có thể đọc + các tệp trạng thái liên tục |
| [P03](../../docs/vi/projects/project-03-multi-session-continuity/index.md) | Khiến agent tiếp tục từ nơi nó đã dừng | Nhật ký tiến trình + bàn giao phiên + tính liên tục đa phiên |
| [P04](../../docs/vi/projects/project-04-incremental-indexing/index.md) | Ngăn agent làm quá nhiều hoặc quá ít | Phản hồi thời gian chạy + kiểm soát phạm vi + lập chỉ mục gia tăng |
| [P05](../../docs/vi/projects/project-05-grounded-qa-verification/index.md) | Khiến agent tự kiểm chứng công việc của mình | Tự kiểm chứng + Q&A có căn cứ + hoàn thành dựa trên bằng chứng |
| [P06](../../docs/vi/projects/project-06-runtime-observability-and-debugging/index.md) | Xây dựng một harness hoàn chỉnh từ đầu (tổng kết) | Harness đầy đủ: tất cả cơ chế + khả năng quan sát + nghiên cứu ablation |
| [P07](../../docs/vi/projects/project-07-loop-engineering-first-loop/index.md) | Xây dựng vòng lặp tự động đầu tiên của bạn | Vòng lặp theo mục tiêu, vòng lặp theo lịch, tách maker-checker, quản lý trạng thái vòng lặp |
| [P08](../../docs/vi/projects/project-08-graph-engineering-first-graph/index.md) | Vẽ quy trình làm việc của bạn thành một đồ thị | Nút/cạnh/trạng thái/định tuyến tường minh, fan-out/fan-in song song, cạnh quay lại, phê duyệt người-máy |

```text
    SỰ PHÁT TRIỂN DỰ ÁN
    ===================

    P01  Chỉ dùng prompt vs. ưu tiên       Bạn nhìn thấy vấn đề
         quy tắc
     |
     v
    P02  Không gian làm việc               Bạn tái cấu trúc kho mã
         agent đọc được
     |
     v
    P03  Tính liên tục đa phiên            Bạn kết nối các phiên
     |
     v
    P04  Phản hồi & phạm vi               Bạn thêm các vòng phản hồi
         thời gian chạy
     |
     v
    P05  Tự kiểm chứng                     Bạn khiến agent tự kiểm tra
     |
     v
    P06  Harness hoàn chỉnh (tổng kết)     Bạn xây dựng hệ thống đầy đủ
     |
     v
    P07  Vòng lặp tự động đầu tiên           Bạn bước ra khỏi vòng lặp
     |
     v
    P08  Vẽ quy trình làm việc thành đồ thị  Bạn vẽ hệ thống thành hình

    Solution của mỗi dự án trở thành starter của dự án tiếp theo.
    Ứng dụng phát triển. Kỹ năng harness của bạn lớn lên cùng nó.
```

### Thư viện tài nguyên

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

## Vòng đời phiên Agent

Một trong những ý tưởng cốt lõi trong khóa học này: **phiên của agent nên tuân theo một vòng đời có cấu trúc, không phải tự do không kiểm soát.** Đây là cách nó trông như thế này:

```text
    VÒNG ĐỜI PHIÊN AGENT
    ====================

    ┌──────────────────────────────────────────────────────────────────┐
    │  BẮT ĐẦU                                                        │
    │                                                                  │
    │  1. Agent đọc AGENTS.md / CLAUDE.md                             │
    │  2. Agent chạy init.sh (cài đặt, xác minh, kiểm tra sức khỏe)  │
    │  3. Agent đọc claude-progress.md (đã xảy ra gì lần trước)      │
    │  4. Agent đọc feature_list.json (cái gì xong, cái gì tiếp)     │
    │  5. Agent kiểm tra git log (thay đổi gần đây)                   │
    │                                                                  │
    │  CHỌN TÁC VỤ                                                    │
    │                                                                  │
    │  6. Agent chọn chính xác MỘT tính năng chưa hoàn thành          │
    │  7. Agent chỉ làm việc trên tính năng đó                        │
    │                                                                  │
    │  THỰC THI                                                       │
    │                                                                  │
    │  8. Agent triển khai tính năng                                  │
    │  9. Agent chạy kiểm chứng (bài kiểm tra, lint, kiểm tra kiểu)   │
    │  10. Nếu kiểm chứng thất bại: sửa và chạy lại                  │
    │  11. Nếu kiểm chứng đạt: ghi nhận bằng chứng                   │
    │                                                                  │
    │  KẾT THÚC                                                       │
    │                                                                  │
    │  12. Agent cập nhật claude-progress.md                          │
    │  13. Agent cập nhật feature_list.json                           │
    │  14. Agent ghi lại những gì vẫn còn lỗi hoặc chưa kiểm chứng   │
    │  15. Agent commit (chỉ khi an toàn để tiếp tục)                 │
    │  16. Agent để lại đường khởi động lại sạch cho phiên tiếp       │
    │                                                                  │
    └──────────────────────────────────────────────────────────────────┘

    Harness điều phối mọi chuyển đổi trong vòng đời này.
    Mô hình quyết định viết code gì ở mỗi bước.
    Không có harness, bước 9 trở thành "agent nói trông ổn rồi."
    Có harness, bước 9 là "bài kiểm tra đạt, lint sạch, kiểu đúng."
```

---

## Khóa học này dành cho ai

Khóa học này dành cho:

- Các kỹ sư đang sử dụng agent viết code và muốn sự ổn định và chất lượng tốt hơn
- Các nhà nghiên cứu hoặc nhà xây dựng muốn hiểu biết hệ thống về thiết kế harness
- Các trưởng nhóm kỹ thuật cần hiểu cách thiết kế môi trường ảnh hưởng đến hiệu suất agent

Khóa học này không dành cho:

- Những người tìm kiếm một giới thiệu AI không cần viết code
- Những người chỉ quan tâm đến prompt và không có kế hoạch xây dựng các triển khai thực tế
- Những người học không sẵn sàng để các agent làm việc bên trong các kho mã thực tế

---

## Yêu cầu

Đây là một khóa học mà bạn thực sự chạy các agent viết code.

Bạn cần ít nhất một trong các công cụ sau:

- Claude Code
- Codex
- Một agent viết code IDE hoặc CLI khác hỗ trợ chỉnh sửa tệp, thực thi lệnh và tác vụ nhiều bước

Khóa học giả định rằng bạn có thể:

- Mở một kho mã cục bộ
- Cho phép agent chỉnh sửa tệp
- Cho phép agent chạy lệnh
- Kiểm tra đầu ra và chạy lại tác vụ

Nếu bạn không có công cụ như vậy, bạn vẫn có thể đọc nội dung khóa học, nhưng bạn sẽ không thể hoàn thành các dự án như dự kiến.

---

## Xem trước cục bộ

Kho lưu trữ này sử dụng VitePress làm trình xem tài liệu.

```sh
npm install
npm run docs:dev        # Dev server với tải lại nóng
npm run docs:build      # Build sản xuất
npm run docs:preview    # Xem trước trang đã build
```

Sau đó mở URL cục bộ mà VitePress hiển thị trong trình duyệt của bạn.

---

## Điều kiện tiên quyết

Bắt buộc:

- Quen thuộc với terminal, git và môi trường phát triển cục bộ
- Khả năng đọc và viết code trong ít nhất một ngăn xếp ứng dụng phổ biến
- Kinh nghiệm gỡ lỗi phần mềm cơ bản (đọc log, kiểm thử và hành vi thời gian chạy)
- Đủ thời gian để cam kết với khóa học tập trung vào triển khai

Có ích nhưng không bắt buộc:

- Kinh nghiệm với Electron, ứng dụng desktop hoặc công cụ local-first
- Nền tảng về kiểm thử, logging hoặc kiến trúc phần mềm
- Đã tiếp xúc với Codex, Claude Code hoặc các agent viết code tương tự

---

## Tài liệu tham khảo cốt lõi

Chính:

- [OpenAI: Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)
- [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Anthropic: Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [OpenAI: Unrolling the Codex agent loop](https://openai.com/index/unrolling-the-codex-agent-loop/)
- [Anthropic: Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- [LangChain: Improving Deep Agents with harness engineering](https://www.langchain.com/blog/improving-deep-agents-with-harness-engineering)
- [Thoughtworks / Martin Fowler: Harness engineering for coding agent users](https://martinfowler.com/articles/harness-engineering.html)
- [Cursor: Continually improving our agent harness](https://cursor.com/blog/continually-improving-agent-harness)

Xem danh sách tài liệu tham khảo phân tầng đầy đủ tại [`docs/vi/resources/reference/`](../../docs/vi/resources/reference/index.md).

---

## Cấu trúc kho lưu trữ

```text
learn-harness-engineering/
├── docs/                          # VitePress documentation site
│   ├── lectures/                  # 14 bài giảng (index.md + code/ ví dụ)
│   │   ├── lecture-01-*/
│   │   ├── lecture-02-*/
│   │   └── ... (tổng 14)
│   ├── projects/                  # 8 mô tả dự án
│   │   ├── project-01-*/
│   │   └── ... (tổng 8)
│   └── resources/                 # Multilingual templates & references
│       ├── en/                    # English templates, checklists, guides
│       ├── zh/                    # Chinese templates, checklists, guides
│       ├── ru/                    # Russian templates, checklists, guides
│       └── vi/                    # Vietnamese templates, checklists, guides
├── projects/
│   ├── shared/                    # Shared Electron + TypeScript + React foundation
│   └── project-NN/               # Per-project starter/ and solution/ directories
├── skills/                        # Reusable AI agent skills
│   └── harness-creator/           # Harness engineering skill
├── package.json                   # VitePress + dev tooling
└── CLAUDE.md                      # Claude Code instructions for this repo
```

---

## Khóa học được tổ chức như thế nào

- Mỗi bài giảng tập trung vào một câu hỏi
- Khóa học bao gồm 8 dự án
- Mọi dự án đều yêu cầu agent thực hiện công việc thực tế
- Mọi dự án đều so sánh kết quả harness yếu vs. mạnh
- Điều quan trọng là sự khác biệt được đo lường, không phải số lượng tài liệu đã viết

---

## Skills

Kho lưu trữ này cũng bao gồm các skill agent AI có thể tái sử dụng mà bạn có thể cài đặt trực tiếp vào IDE hoặc không gian làm việc agent của mình.

- [**harness-creator**](../../skills/harness-creator/): Một skill giúp bạn tạo nhanh một harness cấp sản xuất cho dự án của riêng bạn chỉ trong vài phút.

---

## Các khóa học khác

Đội ngũ của chúng tôi cũng đã tạo các khóa học khác! Hãy xem:

[![Hands-on Modern RL](https://img.shields.io/badge/HANDS--ON_MODERN_RL-0052cc?style=for-the-badge)](https://github.com/walkinglabs/hands-on-modern-rl)

**Hands-on Modern RL**: Một giáo trình thực hành mã nguồn mở kết nối khoảng cách từ các khái niệm RL cơ bản đến LLM alignment, RLVR và các hệ thống Agentic nâng cao.

---

## Lịch sử Star

[![Star History Chart](https://star-history.dera.page/svg?repos=walkinglabs/learn-harness-engineering&type=date&legend=top-left)](https://star-history.dera.page/#walkinglabs/learn-harness-engineering&type=date&legend=top-left)

---

## Lời cảm ơn

Khóa học này được truyền cảm hứng và rút ra ý tưởng từ [learn-claude-code](https://github.com/shareAI-lab/learn-claude-code) — một hướng dẫn tiệm tiến về việc xây dựng một agent từ đầu, từ một vòng lặp đơn giản đến thực thi tự chủ cô lập.
