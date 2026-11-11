# Phân tích thiết kế harness của Codex

[Codex](https://openai.com/index/harness-engineering/) của OpenAI có lẽ là sản phẩm gắn bó sâu sắc nhất với “nguyên lý gốc của harness” trong bốn sản phẩm — chính bài viết “Harness Engineering”, bài đã đặt tên cho cả lĩnh vực này, là bản tổng kết kinh nghiệm của đội ngũ OpenAI khi dùng Codex để xây dựng sản phẩm. Vì vậy, phân tích thiết kế harness của Codex phần lớn cũng là phân tích thực tiễn kỹ thuật đứng sau bài viết đó.

Triết lý của Codex có thể cô đọng trong một câu: **repository là nguồn sự thật (repository as the system of record), AGENTS.md chỉ là trang mục lục, còn giá trị kỹ thuật nằm ở việc thiết kế môi trường, diễn đạt ý định và xây dựng vòng phản hồi.**

## Định vị trong một câu

Đội ngũ OpenAI đã dùng Codex để bàn giao trong vài tuần một sản phẩm cuối cùng có hơn một triệu dòng mã, và **mọi dòng mã đều do Codex viết** (xem nguyên văn ở phần “Designing for growth” trong [Harness Engineering](https://openai.com/index/harness-engineering/)). Thực tiễn của họ trả lời một câu hỏi: khi vai trò của kỹ sư chuyển từ “viết mã” sang “thiết kế harness”, hệ thống nên được tổ chức như thế nào. Bản thân Codex CLI là một binary nguyên khối mã nguồn mở (viết bằng Rust, [github.com/openai/codex](https://github.com/openai/codex)), nhưng đóng góp chủ yếu của nó cho harness nằm ở **quy ước (convention)** và **kỹ thuật ngữ cảnh**, chứ không phải các điểm mở rộng hào nhoáng.

## Hệ thống con chỉ dẫn: AGENTS.md là trang mục lục, không phải bách khoa toàn thư

Đây là quyết định thiết kế có ảnh hưởng lớn nhất của Codex đối với lý thuyết harness:

> Một tệp chỉ dẫn khổng lồ không thuận lợi cho việc kiểm tra tự động (độ bao phủ, trạng thái cập nhật, quyền sở hữu, liên kết chéo), nên việc nó lệch khỏi thực tế là không thể tránh khỏi. Vì vậy, chúng tôi không còn coi AGENTS.md là một bộ bách khoa toàn thư mà coi nó là một **trang mục lục**. Tri thức về codebase nằm trong tài liệu có cấu trúc, còn AGENTS.md chịu trách nhiệm trỏ đến chúng.

(Nội dung trên là phần thuật lại trực tiếp mục “AGENTS.md should be a directory page” trong [“Harness Engineering”](https://openai.com/index/harness-engineering/).)

Bài 4 của khóa học nói rằng “một tệp chỉ dẫn khổng lồ sẽ thất bại”, và Codex đưa ra lời giải trực tiếp: giữ AGENTS.md ở khoảng 100 dòng (nguyên văn khuyến nghị khoảng 100 dòng, gần tới giới hạn thì tách sang `docs/`); nếu không chứa hết thì chia nhỏ vào thư mục `docs/` để agent đọc theo nhu cầu. Đây là nguồn có thẩm quyền cho nguyên tắc “đưa bản đồ, không đưa sách hướng dẫn”.

Nguyên tắc đi kèm là **thực thi các bất biến, đừng vi quản lý cách triển khai** (nguyên văn: “don't micromanage the implementation; focus on invariants”): AGENTS.md chỉ viết các ràng buộc cứng không được vi phạm và lệnh xác minh, còn cách triển khai cụ thể được giao cho mô hình. Điều này tương ứng trực tiếp với “ràng buộc thay vì vi quản lý” trong Bài 2 của khóa học.

## Hệ thống con ngữ cảnh: Write-Select-Compress-Isolate

Kỹ thuật ngữ cảnh của Codex có thể được khái quát thành bốn chiến lược. Đây là khung do cộng đồng tổng kết sau khi “context engineering” trở thành một lĩnh vực riêng, rồi ánh xạ ngược lại Codex (nguồn của khung: [Context Engineering for Codex CLI](https://codex.danielvaughan.com/2026/06/10/context-engineering-codex-cli-write-select-compress-isolate-june-2026/)):

- **Write (ghi ra ngoài)**: duy trì ngữ cảnh ở ngoài cửa sổ — ghi kết luận vào tài liệu và trạng thái vào tệp, thay vì để trong hội thoại. Tương ứng với “repository là nguồn sự thật”.
- **Select (chọn đưa vào)**: chỉ kéo các token cần thiết vào cửa sổ — AGENTS.md chỉ đường, tệp được đọc theo nhu cầu, thay vì nhồi toàn bộ repository vào.
- **Compress (nén)**: giữ lại những gì thực sự quan trọng — Codex có nén tự động và `/compact` thủ công, đồng thời cho phép tùy chỉnh `compact_prompt` (xem [Context Engineering for Codex CLI](https://codex.danielvaughan.com/2026/06/10/context-engineering-codex-cli-write-select-compress-isolate-june-2026/)).
- **Isolate (cô lập)**: chia ngữ cảnh theo các ranh giới khác nhau — dùng agent con (subagent) để cô lập ngữ cảnh của từng tác vụ, chẳng hạn một agent con frontend sẽ không bao giờ nhìn thấy schema cơ sở dữ liệu của backend.

Codex còn có một thiết kế ngữ cảnh môi trường rất tinh tế: phân tích mã nguồn của cộng đồng về [codex-harness-internals](https://github.com/AlexKenbo/codex-harness-internals) cho thấy `build_environment_update_item` chỉ xuất **các trường đã thay đổi** (CWD, nhánh git, hệ thống tệp) khi môi trường thay đổi, thay vì dán lại toàn bộ ngữ cảnh hệ thống ở mỗi lượt. Đây là một chi tiết kỹ thuật cho nguyên tắc “không nuôi token lặp lại trong ngữ cảnh”.

## Công cụ và ranh giới: cô lập bằng worktree + agent con

Codex có hai cơ chế harness cốt lõi:

**1. Cô lập môi trường bằng git worktree.** Phần “Environment” trong [“Harness Engineering”](https://openai.com/index/harness-engineering/) nêu rõ: mỗi tác vụ chạy trong một git worktree độc lập, kết hợp với stack quan sát cục bộ (log, metric, trace), để mọi thay đổi đều được xác minh trong môi trường riêng. Đây là cách hiện thực hóa về mặt vật lý cho Bài 7, “vạch rõ ranh giới mỗi tác vụ cho agent” — ranh giới không dựa vào lời cầu xin trong chỉ dẫn mà được cưỡng chế bằng cô lập môi trường. Hệ thống con môi trường (environment) ở đây trở thành một lớp cô lập cứng.

**2. Agent con cấp lõi.** `spawn_agent` / `wait_agent` của Codex là các công cụ cấp lõi: mô hình chủ động tạo agent con, cung cấp lịch sử phiên và bộ công cụ độc lập cho nó, rồi chờ kết quả. Agent con kế thừa chỉ dẫn AGENTS.md của cấp cha, nhưng chạy trong **ngữ cảnh riêng**. Cấu hình nằm trong `.codex/agents/*.toml`, có thể chỉ định mô hình và chỉ dẫn khác nhau (xem chi tiết trong phần Sub-agents của [Context Engineering for Codex CLI](https://codex.danielvaughan.com/2026/06/10/context-engineering-codex-cli-write-select-compress-isolate-june-2026/)). Đây là cách triển khai trực tiếp “cô lập ngữ cảnh”, đồng thời thể hiện tinh thần “bàn giao” của Bài 12: mỗi agent con là một đơn vị công việc có ranh giới rõ ràng.

## Hệ thống con phản hồi: đưa lệnh xác minh vào quy chuẩn

Điểm được nhấn mạnh nhất trong thực tiễn của OpenAI: liệt kê rõ các lệnh xác minh trong AGENTS.md, biến “làm sao biết đã làm đúng” thành một phần của repository. Trong quy trình kỹ thuật của Codex, kiểm thử, CI, tài liệu và cấu hình khả năng quan sát đều do Codex tạo ra, và tất cả đều là “đường dẫn xác minh có thể thực thi”. Giải pháp cho một mô hình mạnh nhưng không đáng tin cậy không phải là cầu mong mô hình tự giác, mà là biến **đường dẫn xác minh thành thành phần mặc định của harness**.

Chính sách phê duyệt (approval policies) và chế độ lập kế hoạch (plan mode) tạo thành một hướng phản hồi khác: trước khi thực hiện thao tác rủi ro cao, hệ thống phải đưa ra kế hoạch và xin phê duyệt, qua đó biến “ranh giới tác vụ” và “quyền quyết định của con người” thành điều khiển ở runtime.

## Ánh xạ vào khung của khóa học

| Hệ thống con | Cách Codex triển khai | Đánh giá |
| --- | --- | --- |
| Chỉ dẫn | Trang mục lục AGENTS.md + tách sang docs/ + thực thi bất biến | Chuẩn sách giáo khoa, định nghĩa nguyên tắc “đưa bản đồ, không đưa sách hướng dẫn” |
| Công cụ | Cô lập bằng worktree + agent con spawn_agent | Ranh giới được cô lập cứng bằng môi trường, rất mạnh |
| Môi trường | worktree độc lập + stack quan sát | Cô lập bằng worktree là dấu ấn đặc trưng |
| Trạng thái | Chiến lược Write (ghi trạng thái vào tệp/tài liệu) | Dựa vào quy ước thay vì bộ nhớ tích hợp |
| Phản hồi | Đưa lệnh xác minh vào quy chuẩn + chính sách phê duyệt + plan mode | Mặc định hóa đường dẫn phản hồi, đáng học hỏi |

Sự đối chiếu giữa Codex và Claude Code rất thú vị: Claude Code là “phép cộng” — đưa bộ nhớ, quyền hạn và agent con vào lõi; Codex là “phép trừ” — giữ lõi tiết chế nhất có thể và giao nhiều trách nhiệm hơn cho quy ước repository cùng kỹ thuật ngữ cảnh. Đây cũng là lý do cộng đồng thường nói “triết lý harness của Codex còn đáng giá hơn mã nguồn của nó”.

## Những thiết kế đáng học hỏi

1. **Viết AGENTS.md như trang mục lục**: giữ ở khoảng 100 dòng, trỏ tới chi tiết trong docs/, có thể kiểm tra tự động.
2. **Chỉ viết bất biến, không vi quản lý cách triển khai**: ràng buộc cứng + lệnh xác minh, phần còn lại giao cho mô hình.
3. **Dùng worktree để cô lập môi trường**: ranh giới tác vụ được cưỡng chế bằng môi trường, không dựa vào lời cầu xin trong chỉ dẫn.
4. **Chỉ truyền phần gia tăng của ngữ cảnh môi trường**: mỗi lượt chỉ xuất trường đã thay đổi, không dán lại toàn bộ ngữ cảnh hệ thống.
5. **Dùng agent con để cô lập ngữ cảnh**: vừa chia tác vụ vừa chia ngữ cảnh, không để tác vụ con làm ô nhiễm vòng lặp chính.

## Nguồn tham khảo (nguyên văn / mã nguồn)

Mọi luận điểm đều có thể truy ngược về nguyên văn hoặc mã nguồn dưới đây, tránh thuật lại theo ấn tượng:

- **OpenAI “Harness Engineering”**: trang mục lục AGENTS.md và khuyến nghị khoảng 100 dòng, executive invariants / don't micromanage, cô lập bằng worktree + stack quan sát, đưa lệnh xác minh vào quy chuẩn, trường hợp sản phẩm hơn một triệu dòng mã, chính sách phê duyệt và plan mode. Nguồn chính cho mọi luận điểm cốt lõi trong bài.<br/>https://openai.com/index/harness-engineering/
- **Quy chuẩn “AGENTS.md” chính thức của OpenAI** (AGENTS.md là quy ước tiêu chuẩn dùng xuyên công cụ):<br/>https://openai.com/index/agents-md/
- **Repository mã nguồn mở Codex CLI** (binary nguyên khối viết bằng Rust):<br/>https://github.com/openai/codex
- **Context Engineering for Codex CLI** (cộng đồng): khung Write-Select-Compress-Isolate, `/compact` và `compact_prompt`, agent con `spawn_agent` / `wait_agent` cùng cấu hình `.codex/agents/*.toml`.<br/>https://codex.danielvaughan.com/2026/06/10/context-engineering-codex-cli-write-select-compress-isolate-june-2026/
- **codex-harness-internals** (phân tích mã nguồn của cộng đồng): các chi tiết triển khai như ngữ cảnh môi trường gia tăng `build_environment_update_item`.<br/>https://github.com/AlexKenbo/codex-harness-internals

Giáo trình liên quan: [Bài 3 · Biến repository thành nguồn sự thật duy nhất](../../lectures/lecture-03-why-the-repository-must-become-the-system-of-record/) ｜ [Bài 4 · Chia chỉ dẫn vào các tệp khác nhau](../../lectures/lecture-04-why-one-giant-instruction-file-fails/) ｜ [Bài 7 · Vạch rõ ranh giới mỗi tác vụ cho agent](../../lectures/lecture-07-why-agents-overreach-and-under-finish/)
