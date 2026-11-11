# Phân tích thiết kế harness của Pi

[Pi](https://pi.dev/) (gói npm `@earendil-works/pi-coding-agent`) tự gọi mình là “minimal agent harness” — một agent harness tối giản. Cụm từ này đáng được phân tích kỹ: nó không tự nhận là “coding agent mạnh nhất” hay “công cụ lập trình AI dễ dùng nhất”, mà xác định dứt khoát vị trí của mình bằng chính từ **harness**.

Trong bài này, chúng ta dùng khung năm hệ thống con của khóa học (chỉ dẫn, công cụ, môi trường, trạng thái, phản hồi) để phân tích Pi và xem triết lý thiết kế của nó khác căn bản với Claude Code và Codex như thế nào. Câu trả lời trước là: **triết lý của Pi là “tối giản hóa lõi + lập trình hóa phần mở rộng”, đưa kỹ thuật ngữ cảnh ra ngoài system prompt, để người dùng (thậm chí chính Pi) sửa harness, thay vì để Pi quyết định harness thay bạn.**

## Định vị trong một câu

Pi là một lõi tối giản: định vị chính thức chủ ý thu nhỏ lõi và trao lại quyền quyết định cho bạn — nguyên văn trên [trang chủ pi.dev](https://pi.dev/) là “Ask Pi to build what you want, or install a package that does it your way”. Nó chia harness thành bốn tầng có thể tùy chỉnh:

- **Phần mở rộng (Extensions)**: hook TypeScript gắn vào các sự kiện vòng đời của Pi, là bề mặt lập trình được ở cấp runtime.
- **Kỹ năng (Skills)**: gói năng lực được tải theo nhu cầu, gồm chỉ dẫn và công cụ, theo cơ chế công bố dần dần (progressive disclosure).
- **Mẫu prompt (Prompt templates)**: prompt Markdown có thể tái sử dụng, nhập `/name` để mở rộng.
- **Chủ đề (Themes)**: giao diện TUI.

Cách phân tầng này tự thân đã là một thiết kế harness: **trao hoàn toàn việc “mô hình có thể thấy gì và thấy vào lúc nào” cho quy tắc cùng phần mở rộng, thay vì viết cứng trong lõi.**

## Vòng lặp cốt lõi

Giống mọi coding agent, về bản chất Pi là một vòng lặp while “suy luận → thực thi công cụ → quan sát → suy luận tiếp”. Điều đáng chú ý không phải bản thân vòng lặp mà là cách Pi xử lý lớp ngoài của vòng lặp: nó mở rộng việc quản lý ngữ cảnh từ “nén” bên trong vòng lặp sang “kiểm soát” bên ngoài vòng lặp.

Runtime của Pi cung cấp giao diện lập trình ra bên ngoài — trong phần Programmatic Usage của [README mã nguồn](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md), ngoài TUI tương tác còn có chế độ in/JSON có thể script hóa, giao thức RPC và khả năng nhúng qua SDK. Điều này cho phép cùng một harness vừa được con người điều khiển từng bước, vừa có thể được CI/CD hoặc chương trình khác tự động điều khiển. Nó tương ứng với tiền đề “từ điều khiển thủ công đến vòng lặp tự động” trong Bài 13 về “kỹ thuật vòng lặp”: nếu một harness chỉ có thể được con người điều khiển tương tác, nó sẽ không bao giờ đi vào vòng lặp tự động.

## Hệ thống con chỉ dẫn: AGENTS.md và SYSTEM.md

Pi xử lý “chỉ dẫn” rất tiết chế nhưng có thứ bậc rõ ràng:

- **AGENTS.md**: phần Project Context Files trong [README mã nguồn](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md) nêu rõ thứ tự tải — `~/.pi/agent/AGENTS.md` toàn cục → duyệt ngược từng cấp thư mục cha → `./AGENTS.md` trong thư mục hiện tại (cũng tương thích với CLAUDE.md). Đây là cách hiện thực nguyên tắc “repository là nguồn sự thật” — chỉ dẫn là tệp, không phải lời dặn trong khung chat.
- **SYSTEM.md**: [tài liệu chính thức pi.dev](https://pi.dev/docs/usage/project-context) cho biết có thể thay thế (replace) hoặc nối thêm (append) system prompt mặc định theo từng dự án. Đây là lối vào chính thức duy nhất để Pi cho phép bạn tác động đến “system prompt”, đồng thời là tầng “môi trường tự mô tả” của nó.

Pi chính thức nhấn mạnh rằng bản thân system prompt của nó **cực kỳ tối giản**. Đằng sau là một đánh đổi rõ ràng: lõi không nhồi các quy tắc dài dòng kiểu “nếu… thì…”, mà để lại các điểm mở rộng để quy tắc chỉ xuất hiện dưới dạng kỹ năng và phần mở rộng khi cần. Điều này tương ứng trực tiếp với Bài 4, “Vì sao một tệp chỉ dẫn khổng lồ sẽ thất bại” — Pi tự nhiên tránh được vấn đề chỉ dẫn khổng lồ bằng “lõi tối giản + chia tệp + tải theo nhu cầu”.

## Trạng thái và ngữ cảnh: nơi Pi phân tách chi tiết nhất

Kỹ thuật ngữ cảnh của Pi đáng được phân tích kỹ, vì nó biến các khái niệm “tính liên tục của ngữ cảnh” và “ngăn ngữ cảnh suy thoái” trong khóa học thành những cơ chế cụ thể:

**1. Lập trình hóa việc nén (Compaction).** Khi gần đạt giới hạn ngữ cảnh, hệ thống tự động tóm tắt các tin nhắn cũ — [tài liệu chính thức pi.dev](https://pi.dev/docs/usage/sessions) nêu rằng bản thân chiến lược nén **có thể tùy chỉnh**: bạn có thể dùng phần mở rộng để triển khai nén theo chủ đề, tóm tắt nhận biết mã, thậm chí dùng một mô hình khác để tóm tắt. README mã nguồn cũng cho biết chi tiết của cơ chế mặc định: nén tự động được kích hoạt trong hai trường hợp (khôi phục khi tràn ngữ cảnh / vượt ngưỡng giữ lại), điểm cắt giữ khoảng 20 nghìn token gần nhất, các tin nhắn trước đó được tóm tắt thành “context handoff” rồi nén dây chuyền theo từng cấp. Nói cách khác, Pi không coi “nén như thế nào” là một hằng số bất biến, mà coi nó là một phần của harness.

**2. Ngữ cảnh động (Dynamic context).** [Tài liệu chính thức pi.dev](https://pi.dev/docs/usage/extensions) cho biết phần mở rộng có thể chèn tin nhắn trước mỗi lượt suy luận, lọc lịch sử tin nhắn, triển khai RAG và xây dựng bộ nhớ dài hạn. Điều này tiến xa hơn việc “đầy ngữ cảnh rồi mới nén”: nó cho phép bạn quyết định đưa gì vào và loại gì ra trước khi ngữ cảnh đi vào cửa sổ. Tương ứng với “làm cho quá trình chạy của agent có thể quan sát, gỡ lỗi” và “duy trì tính liên tục của ngữ cảnh” trong khóa học, Pi đưa cả hai xuống bề mặt mở rộng.

**3. Cây phiên (Session tree).** [Trang chủ pi.dev](https://pi.dev/) nêu rõ “các phiên được lưu theo cấu trúc cây (sessions are stored as trees)”; `/tree` có thể quay lại bất kỳ nút lịch sử nào để tiếp tục, và mọi nhánh đều được lưu trong cùng một tệp. Điều này giải quyết vấn đề “đứt gãy ngữ cảnh giữa các phiên” được nhấn mạnh nhiều lần trong khóa học — không phải bằng cách ép nối với bản tóm tắt, mà bằng cách phát lại lịch sử có cấu trúc. Nhánh có thể xuất thành HTML hoặc tải lên dưới dạng gist để chia sẻ, qua đó khả năng quan sát cũng được giải quyết.

## Hệ thống con công cụ: kỹ năng và phần mở rộng

“Công cụ” của Pi có hai tầng:

- **Kỹ năng (Skills)**: phần Skills trong [README mã nguồn](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md) định nghĩa rất rõ — “self-contained capability packages that the agent loads on-demand”, tức các gói năng lực độc lập mà agent tải theo nhu cầu, bao gồm chỉ dẫn và công cụ, tuân theo tiêu chuẩn Agent Skills. Việc công bố dần dần chỉ đưa chi tiết kỹ năng vào ngữ cảnh khi được kích hoạt, **không làm nổ prompt cache**. Đây là thiết kế harness xét từ góc độ chi phí: mỗi token thêm vào ngữ cảnh đều phải trả phí ở mỗi lần suy luận; biến kỹ năng thành nội dung tải theo nhu cầu chính là một cách diễn đạt khác của “đưa bản đồ, không đưa sách hướng dẫn”.
- **Phần mở rộng (Extensions)**: hook TypeScript gắn vào các sự kiện vòng đời tích hợp sẵn — phần Hooks trong [README mã nguồn](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md) đưa ra các ví dụ chính thức: chặn lệnh nguy hiểm (cổng quyền hạn), checkpoint trạng thái mã khi chuyển tác vụ, bảo vệ đường dẫn (cấm ghi `.env`, v.v.), sửa đầu ra công cụ trước khi đưa cho mô hình, và chèn tin nhắn từ bên ngoài (theo dõi tệp/Webhook/CI) để đánh thức agent. Các hook API này cũng được xuất trong `@mariozechner/pi-coding-agent/hooks`. Harness cộng đồng ([pi-agent-harness](https://github.com/LabidySabidy/pi-agent-harness)) tiếp tục đóng gói bề mặt hook thành các phần mở rộng có sẵn như skill-router, session-summary, extract-patterns và telemetry.

Phần mở rộng là quyết định thiết kế quan trọng nhất của Pi: **nó không chỉ “cho người dùng vài công tắc”, mà cung cấp toàn bộ bề mặt sự kiện bên trong runtime.** Muốn thêm bộ nhớ? Chèn ở `agent/pre-step`. Muốn ghi lại hành vi? Đăng ký sự kiện session. Muốn sửa yêu cầu gửi đến mô hình? Gắn hook vào `agent/request`. Bạn có thể để Pi tự sửa harness của chính nó — điều này gần với định nghĩa “harness có thể lập trình” hơn bất kỳ “tùy chọn cấu hình” nào.

## Phản hồi và xác minh: biến cả “học hỏi” thành harness

Bản thân Pi không tích hợp cổng kiểm thử bắt buộc (người dùng phải viết lệnh xác minh trong AGENTS.md), nhưng harness cộng đồng ([pi-agent-harness](https://github.com/LabidySabidy/pi-agent-harness)) đã dùng phần mở rộng để cấu trúc hóa “vòng phản hồi”; phần Hooks trong README chính thức cũng cung cấp nền tảng cơ chế tương tự:

- **session-summary** (phần mở rộng pi-agent-harness): duy trì các mục cuộn trong `PROGRESS.md` — đây là hệ thống con trạng thái của khóa học, dùng để theo dõi tiến độ tác vụ dài.
- **extract-patterns** (phần mở rộng pi-agent-harness): thu thập các bài học ứng viên từ phiên và lưu vào `LESSONS.md` — biến việc “bàn giao đầy đủ trước khi kết thúc mỗi phiên” từ quy ước thành cơ chế.
- **telemetry** (phần mở rộng pi-agent-harness): ghi lại lượng token sử dụng, chi phí, v.v. — khả năng quan sát.

Cùng repository cộng đồng đó còn xác minh thêm mô hình này: `VISION.md` (mục tiêu), `PROGRESS.md` (tiến độ), `LESSONS.md` (bài học), `STANDARDS.md` (tiêu chuẩn), tất cả đều là tệp Markdown được duy trì xuyên phiên. Cách làm này giống hệt “repository là nguồn sự thật + tệp tiến độ + cơ chế bàn giao” mà khóa học đề xuất, chỉ khác là cơ chế mở rộng của Pi biến nó thành một tầng dùng được ngay.

## Ánh xạ vào khung của khóa học

Dùng năm hệ thống con của khóa học để chấm điểm Pi (mang tính chủ quan, dùng để đối chiếu):

| Hệ thống con | Cách Pi triển khai | Đánh giá |
| --- | --- | --- |
| Chỉ dẫn | Tải AGENTS.md theo cấp + SYSTEM.md | Phân cấp rõ ràng, nhưng quy tắc phải do người dùng viết |
| Công cụ | Kỹ năng tải theo nhu cầu + hook toàn vòng đời của phần mở rộng | Rất mạnh, biến hệ thống công cụ thành bề mặt có thể lập trình |
| Môi trường | SYSTEM.md tự mô tả môi trường; môi trường runtime do người dùng khai báo trong AGENTS.md | Cơ chế mở, nhưng khả năng tái tạo phụ thuộc vào mô tả của người dùng |
| Trạng thái | Cây phiên + nén tùy chỉnh + PROGRESS.md | Rất mạnh, xuyên phiên và khả năng khôi phục là trọng tâm |
| Phản hồi | Lệnh xác minh do người dùng định nghĩa; cơ chế hóa session-summary / extract-patterns | Cung cấp cơ chế, nội dung do người dùng quyết định |

Sự đánh đổi của Pi đối lập rõ rệt với Claude Code / Codex: Claude Code đưa “bộ nhớ, quyền hạn, agent con” vào lõi để dùng ngay; Codex biến “quy chuẩn repository, cô lập môi trường” thành mặc định; Pi chọn **không quyết định thay bạn bất cứ điều gì** — nó biến quyền quyết định thành điểm mở rộng. Cái giá là bạn phải tự viết phần mở rộng hoặc cài gói do người khác viết.

## Những thiết kế đáng học hỏi

1. **Biến chiến lược nén thành thành phần có thể cắm thay**. Trong harness của bạn, “nén ngữ cảnh như thế nào” không nên là tham số viết cứng mà nên là giao diện chiến lược có thể thay thế.
2. **Dùng cây phiên thay cho bản tóm tắt cứng**. Khôi phục xuyên phiên không nhất thiết phải dựa vào “tóm tắt lượt trước”; phát lại lịch sử có cấu trúc thường là hệ thống con trạng thái đáng tin cậy hơn.
3. **Thân thiện với prompt cache**. Tải kỹ năng theo nhu cầu, không nhồi tất cả quy tắc vào system prompt cùng lúc; đây vừa là kỹ thuật ngữ cảnh vừa là kỹ thuật chi phí.
4. **Để agent có thể sửa harness của chính nó**. Nếu bề mặt mở rộng của harness đủ mở, chính agent có thể bán tự động thực hiện việc “tối ưu hành vi agent”.

## Nguồn tham khảo (nguyên văn / mã nguồn)

Mọi luận điểm đều có thể truy ngược về nguyên văn hoặc mã nguồn dưới đây, tránh thuật lại theo ấn tượng:

- **Trang chủ pi.dev**: nguyên văn định vị “Ask Pi to build what you want, or install a package that does it your way”, bốn tầng có thể tùy chỉnh, cây phiên (“sessions are stored as trees”, `/tree`, lưu trong một tệp, xuất HTML / chia sẻ gist).<br/>https://pi.dev/
- **Tài liệu chính thức pi.dev · Sessions**: nén có thể cắm thay (topic-based / code-aware / đổi mô hình tóm tắt), mô tả cơ chế nén tự động và chèn ngữ cảnh động.<br/>https://pi.dev/docs/usage/sessions
- **Tài liệu chính thức pi.dev · Extensions**: phần mở rộng có thể chèn tin nhắn trước mỗi lượt suy luận, lọc lịch sử, thực hiện RAG và xây dựng bộ nhớ dài hạn.<br/>https://pi.dev/docs/usage/extensions
- **Tài liệu chính thức pi.dev · Project Context**: ngữ nghĩa replace / append của SYSTEM.md.<br/>https://pi.dev/docs/usage/project-context
- **README mã nguồn Pi Coding Agent** (badlogic/pi-mono): thứ tự tải ba cấp AGENTS.md (toàn cục → thư mục cha → thư mục hiện tại), điều kiện kích hoạt `/compact` và nén tự động cùng điểm cắt 20 nghìn token, tải Skills theo nhu cầu và tiêu chuẩn Agent Skills, vòng đời Hooks cùng các ví dụ chính thức, Programmatic Usage (JSON / RPC / SDK).<br/>https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md
- **Repository cộng đồng pi-agent-harness**: các phần mở rộng skill-router / session-summary / extract-patterns / telemetry, cùng hệ thống tệp VISION.md / PROGRESS.md / LESSONS.md / STANDARDS.md.<br/>https://github.com/LabidySabidy/pi-agent-harness

Giáo trình liên quan: [Bài 2 · Harness thực chất là gì](../../lectures/lecture-02-what-a-harness-actually-is/) ｜ [Bài 5 · Duy trì tính liên tục của tác vụ xuyên phiên](../../lectures/lecture-05-why-long-running-tasks-lose-continuity/) ｜ [Bài 13 · Từ điều khiển thủ công đến vòng lặp tự động](../../lectures/lecture-13-loop-engineering/)
