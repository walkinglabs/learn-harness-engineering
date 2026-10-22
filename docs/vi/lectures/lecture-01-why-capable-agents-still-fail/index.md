[English Version →](../../../en/lectures/lecture-01-why-capable-agents-still-fail/) | [中文版本 →](../../../zh/lectures/lecture-01-why-capable-agents-still-fail/)

> Ví dụ code: [code/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/vi/lectures/lecture-01-why-capable-agents-still-fail/code/)
> Dự án thực hành: [Dự án 01. Chỉ Prompt vs. Ưu tiên Quy tắc](./../../projects/project-01-baseline-vs-minimal-harness/index.md)

# Bài 01. Mô hình mạnh không có nghĩa là thực thi đáng tin cậy

Ngày 29 tháng 9 năm 2025, Anthropic công bố Claude Sonnet 4.5 đạt [77,2% trên SWE-bench Verified](https://www.anthropic.com/news/claude-sonnet-4-5). Con số đó nghe có vẻ khá, nhưng đừng vội ăn mừng. Đó là những tác vụ được lựa chọn cẩn thận với mô tả vấn đề rõ ràng và bộ test có sẵn. Đưa cho agent yêu cầu thực tế hàng ngày của bạn: đặc tả mơ hồ, không có test, quy tắc nghiệp vụ ẩn rải rác trong codebase, thì tỷ lệ vượt qua chỉ giảm thêm nữa. Bạn hào hứng giao một tác vụ, agent chạy 20 phút rồi báo "xong rồi", và bạn nhìn vào code: nó thêm một tính năng nhưng làm hỏng test, sửa một lỗi nhưng sinh ra lỗi mới, và kết quả cuối cùng còn không đúng thứ bạn yêu cầu.

Khi chuyện này xảy ra, phản ứng đầu tiên của hầu hết mọi người là "mô hình chưa đủ tốt, thử sang cái đắt tiền hơn xem sao". Trước khi mở ví, hãy cân nhắc: vấn đề có thể hoàn toàn không nằm ở mô hình.

## Cùng con ngựa, số phận khác nhau

Anthropic đã so sánh cùng một prompt ("xây dựng một trình tạo trò chơi retro 2D") và cùng một mô hình (Opus 4.5) dưới hai harness. Lần chạy đầu tiên: trần trụi, không có hỗ trợ, 20 phút, $9; ứng dụng mở được, nhưng các thực thể không phản hồi với input. Lần chạy thứ hai: harness đầy đủ, kiến trúc ba agent gồm planner, generator, evaluator, 6 giờ, $200; có thể di chuyển một thực thể, nhưng vật lý còn thô và một bức tường chặn đường đi. [Gameplay cốt lõi chạy được; ứng dụng vẫn chưa hoàn thành.](https://www.anthropic.com/engineering/harness-design-long-running-apps)

Họ không thay đổi mô hình. Opus 4.5 vẫn là Opus 4.5. Thứ thay đổi là bộ yên cương.

Bài viết về harness engineering năm 2025 của OpenAI còn nói thẳng hơn. Họ cho biết Codex trong một kho lưu trữ được trang bị harness tốt đi từ "không đáng tin cậy" thẳng đến "đáng tin cậy". Chú ý cách diễn đạt: không phải "tốt hơn một chút", mà là một bước nhảy về chất. Harness ở đây có nghĩa là **toàn bộ cơ sở hạ tầng kỹ thuật bên ngoài trọng số mô hình**.

## Agent thực sự bị kẹt ở đâu

Các chế độ thất bại cụ thể thực ra chỉ gói gọn trong vài điểm:

- **Yêu cầu mơ hồ, agent chỉ có thể đoán.** "Thêm tính năng tìm kiếm": câu đó hầu như chẳng mang nhiều ý nghĩa. Tìm kiếm cái gì? Full-text hay truy vấn có cấu trúc? Kết quả có cần phân trang? Tô sáng? Bạn không chỉ định rõ, nên agent buộc phải đoán. Đoán đúng là may, đoán sai thì chi phí sửa lại gấp nhiều lần so với việc nói rõ ngay từ đầu.
- **Quy ước ẩn không được viết ra, agent không có cách nào tuân thủ.** Cả nhóm bạn dùng cú pháp SQLAlchemy 2.0, nhưng agent mặc định viết code 1.x. Mọi API endpoint phải đi qua xác thực OAuth 2.0, nhưng quy tắc đó chỉ tồn tại trong đầu bạn và một tin nhắn Slack từ ba tháng trước. Agent không hề biết, không phải nó không muốn tuân thủ, mà là nó chưa từng thấy quy tắc đó.
- **Thiết lập môi trường chưa đầy đủ, agent tốn năng lượng sửa môi trường.** Môi trường dev chưa hoàn chỉnh, thiếu dependency, sai phiên bản công cụ, agent đốt cửa sổ ngữ cảnh quý giá vào lỗi `pip install` và xung đột phiên bản Node thay vì làm việc bạn thực sự giao.
- **Không có phương pháp xác minh, agent tự coi là xong khi nó cảm thấy xong.** Không có test, không có lint, hoặc các lệnh xác minh chưa bao giờ được truyền đạt cho agent. Agent viết code, nhìn lại, thấy có vẻ ổn rồi tuyên bố hoàn thành. Anthropic cũng quan sát thấy một hiện tượng thú vị: khi agent cảm nhận ngữ cảnh sắp cạn, nó vội vàng kết thúc, bỏ qua bước xác minh, và chọn giải pháp đơn giản thay vì tối ưu. Họ gọi đây là "context anxiety" (lo lắng ngữ cảnh).
- **Mất trạng thái giữa các phiên, mỗi phiên mới bắt đầu lại từ đầu.** Mọi phát hiện từ phiên trước đều biến mất. Mỗi phiên mới phải khám phá lại cấu trúc dự án và hiểu lại cách tổ chức code. Agent không có trạng thái liên tục thì tỷ lệ thất bại tăng vọt trên các tác vụ kéo dài quá 30 phút.

## Giải thích thuật ngữ chính

Với các tình huống trên, những khái niệm này không còn chỉ là thuật ngữ suông:

- **Khoảng cách Năng lực (Capability Gap)**: Khoảng cách lớn giữa hiệu suất mô hình trên benchmark và hiệu suất trên tác vụ thực tế. Các tác vụ benchmark đi kèm mô tả vấn đề rõ ràng, test và môi trường; tác vụ thực tế thường buộc bạn phải tự cung cấp những thứ đó.
- **Harness**: Mọi thứ bên ngoài mô hình, hướng dẫn, công cụ, môi trường, quản lý trạng thái, phản hồi xác minh. Không phải trọng số mô hình, thì đó là harness. Chính là thứ chúng ta vẫn gọi là "bộ yên cương".
- **Lỗi Do Harness (Harness-Induced Failure)**: Mô hình có đủ năng lực, nhưng môi trường thực thi có khiếm khuyết cấu trúc. So sánh trò chơi retro ở trên là một ví dụ.
- **Khoảng cách Xác minh (Verification Gap)**: Khoảng cách giữa sự tự tin của agent về kết quả đầu ra và tính đúng đắn thực tế. Agent nói "tôi đã xong" khi chưa xong, đây là chế độ thất bại phổ biến nhất.
- **Vòng lặp Chẩn đoán (Diagnostic Loop)**: Thực thi, quan sát lỗi, quy cho một lớp harness cụ thể, sửa lớp đó, thực thi lại. Đây là phương pháp luận cốt lõi của harness engineering.
- **Định nghĩa Hoàn thành (Definition of Done)**: Một tập các điều kiện có thể xác minh bằng lệnh: test vượt qua, lint sạch, type check vượt qua. Không có định nghĩa hoàn thành rõ ràng, agent sẽ tự bịa ra định nghĩa của riêng nó.

## Khi sự cố xảy ra, hãy sửa harness trước

Thực ra chỉ có một nguyên tắc cốt lõi duy nhất: **Khi sự cố xảy ra, đừng đổi mô hình trước, hãy kiểm tra harness.** Nếu cùng một mô hình thành công trên các tác vụ tương tự, có cấu trúc tốt, hãy mặc định giả định đó là vấn đề harness.

Trong thực tế thì trông như thế nào? Hãy quy mọi lỗi cho một lớp cụ thể. Đừng chỉ nói "mô hình không đủ tốt". Hãy tự hỏi: tác vụ có mơ hồ không? Ngữ cảnh có thiếu không? Không có phương pháp xác minh? Ánh xạ mỗi lỗi vào một trong năm lớp phòng thủ: đặc tả tác vụ, cung cấp ngữ cảnh, môi trường thực thi, phản hồi xác minh, quản lý trạng thái. Xây dựng thói quen này, bạn sẽ thấy cụm "mô hình không đủ tốt" xuất hiện ngày càng ít trong nhật ký.

Sau đó, hãy viết Định nghĩa Hoàn thành rõ ràng cho mỗi tác vụ. Đừng nói "thêm tính năng tìm kiếm". Hãy viết rõ ra:
```
Tiêu chí hoàn thành:
- Endpoint mới GET /api/search?q=xxx
- Hỗ trợ phân trang, mặc định 20 mục
- Kết quả bao gồm đoạn trích được tô sáng
- Toàn bộ code mới vượt qua pytest
- Type checking vượt qua (mypy --strict)
```

Đặt một tệp `AGENTS.md` ở thư mục gốc repo, kể cho agent nghe về tech stack, quy ước kiến trúc và các lệnh xác minh của dự án. Đây là bước đầu tiên trong harness engineering, và là bước có tỷ suất hoàn vốn (ROI) cao nhất. Một tệp `AGENTS.md` có thể hiệu quả hơn việc nâng cấp lên một mô hình đắt tiền hơn, và chúng tôi không đùa.

Từ đó, xây dựng vòng lặp chẩn đoán. Đừng xem lỗi là "mô hình lại ngốc". Hãy xem chúng là tín hiệu cho thấy harness của bạn đang lộ khiếm khuyết. Mỗi lần lỗi, xác định lớp, sửa lớp đó, rồi không bao giờ tái diễn kiểu thất bại đó nữa. Sau vài vòng, harness của bạn mạnh hơn và hiệu suất agent ổn định dần. Một cuốn nhật ký đơn giản là đủ: với mỗi tác vụ, nó thành công hay thất bại, và lớp nào gây ra lỗi. Sau vài vòng, bạn sẽ thấy lớp nào là điểm nghẽn, và có thể tập trung năng lượng vào đó.

## Thí nghiệm triệu dòng code

Vào tháng 8 năm 2025, ba kỹ sư tại OpenAI bắt đầu một thí nghiệm. Quy tắc đơn giản: chính họ không viết code, chỉ Codex viết. Bắt đầu từ một kho git trống, năm tháng sau [kho chứa khoảng một triệu dòng code](https://openai.com/index/harness-engineering/). Logic ứng dụng, hạ tầng, công cụ, tài liệu, tất cả đều do agent tạo. Nhóm sau đó phát triển lên bảy kỹ sư; trong cả giai đoạn đã hợp nhất khoảng 1.500 PR, trung bình 3,5 PR mỗi kỹ sư mỗi ngày.

Tiến độ ban đầu chậm hơn dự kiến một cách đáng ngạc nhiên. Codex không tệ, nó chỉ thiếu các công cụ và cấu trúc đủ hoàn chỉnh để hướng đến mục tiêu cấp cao. Ba kỹ sư dần tìm ra quy luật: chia nhỏ mục tiêu lớn thành các khối xây dựng nhỏ, thiết kế, code, review, test, để agent lắp ráp từng khối một, rồi dùng các khối đó để tổng hợp các tác vụ phức tạp hơn. Mỗi khi có trục trặc, vấn đề hầu như không bao giờ là "cố gắng chưa đủ", mà luôn là "agent còn thiếu năng lực gì, và thiếu năng lực đó có thể được cung cấp theo cách vừa dễ hiểu vừa có thể thực thi không".

Thí nghiệm này chứng minh trực tiếp luận điểm cốt lõi của bài giảng: **cùng một mô hình, trong môi trường trần trụi và trong môi trường có harness đầy đủ, tạo ra kết quả về cơ bản khác nhau.** Mô hình không thay đổi. Môi trường thay đổi.

> Nguồn: [OpenAI: Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)

## Một ví dụ gần gũi hơn

Một nhóm dùng Claude Sonnet để thêm API endpoint mới vào một ứng dụng web Python cỡ trung (FastAPI + PostgreSQL + Redis, khoảng 15.000 dòng code).

Ban đầu họ chỉ đưa ra một câu: "thêm endpoint tùy chọn người dùng dưới `/api/v2/users`". Kết quả? Agent dành phần lớn phiên để khám phá cấu trúc repo, tạo ra code trông có vẻ hợp lý nhưng không theo mẫu xử lý lỗi của dự án, dùng cú pháp SQLAlchemy cũ, và tuyên bố hoàn thành trong khi endpoint vẫn có lỗi runtime. Phiên tiếp theo phải làm lại toàn bộ phần khám phá.

Sau đó họ bổ sung `AGENTS.md` (mô tả kiến trúc dự án và phiên bản tech stack), các lệnh xác minh rõ ràng (`pytest tests/api/v2/ && python -m mypy src/`), và các bản ghi quyết định kiến trúc. Cùng một mô hình sau đó đã tuân theo quy ước của dự án và kiểm tra công việc bằng các lệnh nó có thể chạy.

Họ không thay đổi mô hình. Họ thay đổi harness.

## Những điểm chính cần nhớ

- Năng lực mô hình và độ tin cậy thực thi là hai chuyện khác nhau. Ngay cả một con ngựa thuần chủng cũng cần bộ yên cương tốt.
- Khi sự cố xảy ra, kiểm tra harness trước, rồi mới đến mô hình. Đổi mô hình là lựa chọn tốn kém nhất, và phần lớn thời gian, đó thậm chí không phải là vấn đề mô hình.
- Mỗi lỗi là một tín hiệu: harness của bạn có khiếm khuyết cấu trúc. Hãy tìm và sửa nó.
- Đừng chỉ nói "mô hình không đủ tốt". Hãy rà qua có hệ thống năm lớp: tác vụ chưa định nghĩa rõ, ngữ cảnh thiếu, môi trường cấu hình sai, thiếu xác minh, mất trạng thái giữa các phiên. Cứ mười lần thì chín lần vấn đề nằm ở một trong các lớp đó.
- Một tệp `AGENTS.md` có thể hiệu quả hơn việc nâng cấp lên mô hình đắt tiền hơn.

## Đọc thêm

- [OpenAI: Harness Engineering — Leveraging Codex in an Agent-First World](https://openai.com/index/harness-engineering/)
- [Anthropic: Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [HumanLayer: Skill Issue — Harness Engineering for Coding Agents](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents)
- [SWE-bench Leaderboard](https://www.swebench.com/)
- [Thoughtworks Technology Radar: Harness Engineering](https://www.thoughtworks.com/radar)

## Bài tập

1. **Thí nghiệm so sánh**: Chọn một codebase bạn biết rõ và một tác vụ sửa đổi không tầm thường. Trước tiên, chạy agent mà không có hỗ trợ harness và ghi lại các lỗi. Sau đó thêm `AGENTS.md` cùng các lệnh xác minh rõ ràng, rồi chạy lại với cùng agent đó. So sánh hai kết quả, quy mỗi lỗi vào một trong năm lớp phòng thủ.

2. **Đo lường khoảng cách xác minh**: Chọn 5 tác vụ lập trình. Sau mỗi tác vụ, ghi lại xem agent có tuyên bố hoàn thành hay không, rồi xác minh tính đúng đắn thực tế bằng các test độc lập. Tính tỷ lệ lần agent tuyên bố xong khi thực tế chưa xong, đó chính là khoảng cách xác minh của bạn. Sau đó hãy nghĩ: những lệnh xác minh nào sẽ thu hẹp tỷ lệ này?

3. **Thực hành vòng lặp chẩn đoán**: Tìm một tác vụ mà agent liên tục thất bại trong dự án của bạn. Chạy một lần, ghi lại lỗi. Quy nó cho một trong năm lớp. Sửa lớp đó. Chạy lại. Lặp lại ba đến năm vòng, ghi lại cải thiện qua mỗi vòng.
