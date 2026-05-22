[English Version →](../../../en/lectures/lecture-01-why-capable-agents-still-fail/) | [中文版本 →](../../../zh/lectures/lecture-01-why-capable-agents-still-fail/)

> Ví dụ mã nguồn: [code/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/vi/lectures/lecture-01-why-capable-agents-still-fail/code/)
> Dự án thực hành: [Dự án 01. Chỉ Prompt vs. Ưu tiên Quy tắc](./../../projects/project-01-baseline-vs-minimal-harness/index.md)

# Bài 01. Mô hình mạnh vẫn thất bại trong app phân tích phỏng vấn thật

Bạn tự coi mình là người có kinh nghiệm trong thế giới AI — đăng ký Claude Pro, có API key GPT-4o, thuộc lòng các con số trên bảng xếp hạng SWE-bench. Một ngày nào đó bạn cuối cùng giao một dự án thực sự cho một AI agent, đầy tự tin. Kết quả? Nó thêm một tính năng nhưng làm hỏng các bài test, sửa một lỗi nhưng gây ra thêm hai lỗi khác, chạy 20 phút và tự hào tuyên bố "xong" — nhưng khi bạn nhìn vào mã nguồn, nó hoàn toàn không phải là thứ bạn yêu cầu.

Phản ứng đầu tiên của bạn? "Mô hình này không đủ tốt. Thời điểm nâng cấp." Khoan đã. Trước khi bạn mở ví, hãy cân nhắc rằng vấn đề có thể hoàn toàn không phải là mô hình.

Hãy nhìn vào một vài con số. Tính đến cuối năm 2025, các coding agent mạnh nhất trên SWE-bench Verified đạt khoảng 50-60%. Và đó là trên các tác vụ được lựa chọn cẩn thận với mô tả vấn đề rõ ràng và các bài test hiện có. Chuyển sang môi trường phát triển hàng ngày của bạn — yêu cầu mơ hồ, không có test, các quy tắc kinh doanh ẩn rải rác khắp nơi — và con số đó chỉ giảm xuống.

Nhưng đằng sau những con số này ẩn chứa một sự thật phản trực giác.

## Cùng Con Ngựa, Số Phận Khác Nhau

Anthropic đã thực hiện một thí nghiệm có kiểm soát. Cùng một prompt ("xây dựng một trình tạo trò chơi retro 2D"), cùng một mô hình (Opus 4.5). Lần chạy đầu tiên: trần trụi, không có hỗ trợ — 20 phút, $9, các tính năng cốt lõi của trò chơi hoàn toàn không hoạt động. Lần chạy thứ hai: harness đầy đủ (kiến trúc ba agent: planner + generator + evaluator) — 6 giờ, $200, trò chơi có thể chơi được.

Họ không thay đổi mô hình. Opus 4.5 vẫn là Opus 4.5. Những gì thay đổi là cái yên ngựa.

Bài viết về harness engineering năm 2025 của OpenAI nói thẳng: Codex trong một kho lưu trữ được trang bị harness tốt đi từ "không đáng tin cậy" đến "đáng tin cậy." Lưu ý cách diễn đạt của họ — không phải "tốt hơn một chút," mà là một sự thay đổi về chất. Giống như một con ngựa thuần chủng: bạn có thể cưỡi nó không có yên, nhưng bạn sẽ không đi xa, không nhanh, và việc ngã ngựa không có gì là ngạc nhiên. Harness là cái yên ngựa đó — **tất cả mọi thứ trong cơ sở hạ tầng kỹ thuật bên ngoài trọng số mô hình.**

## Agent Thực sự Bị Kẹt Ở Đâu

Vậy cụ thể điều gì đi sai?

Phổ biến nhất: bạn không bao giờ xác định rõ ràng tác vụ. Bạn nói "thêm tính năng tìm kiếm," và sự hiểu biết của agent hoàn toàn khác với của bạn — tìm kiếm cái gì? Full-text hay có cấu trúc? Phân trang? Tô sáng? Bạn không chỉ định, vì vậy agent đoán. Đoán đúng là may mắn; đoán sai tốn nhiều chi phí để sửa hơn là cụ thể hóa ngay từ đầu. Giống như đi vào nhà hàng và bảo với đầu bếp "tôi muốn cá" — liệu bạn có cá kho, cá hấp hay cá lẩu là hoàn toàn phụ thuộc vào may rủi.

Ngay cả khi bạn đã chỉ định, dự án có các quy ước kiến trúc ẩn mà agent không biết. Nhóm của bạn đã chuẩn hóa cú pháp SQLAlchemy 2.0, nhưng agent mặc định viết mã 1.x. Tất cả các API endpoint phải sử dụng xác thực OAuth 2.0, nhưng quy tắc đó chỉ tồn tại trong đầu bạn và một tin nhắn Slack từ ba tháng trước. Agent không thể nhìn thấy những điều này — không phải vì nó không muốn tuân thủ, mà là vì nó thực sự không biết những quy tắc này tồn tại.

Môi trường cũng là một cái bẫy. Dev environment không đầy đủ, thiếu dependencies, phiên bản công cụ sai. Agent đốt cháy cửa sổ ngữ cảnh quý báu vào lỗi `pip install` và xung đột phiên bản Node thay vì giải quyết tác vụ thực tế của bạn. Giống như thuê một thợ mộc lành nghề nhưng quên cung cấp búa, đinh hoặc bàn làm việc bằng phẳng — dù tài năng đến đâu, họ cũng không thể làm được việc.

Thậm chí còn phổ biến hơn: đơn giản là không có cách nào để xác minh. Không có test, không có lint, hoặc các lệnh xác minh không bao giờ được truyền đạt cho agent. Agent viết mã, nhìn vào nó, quyết định nó ổn, nói "xong." Giống như yêu cầu học sinh nộp bài tập mà không có đáp án — họ nghĩ họ làm đúng, nhưng khi bạn chấm điểm có hàng đống lỗi. Anthropic cũng quan sát thấy một hiện tượng thú vị: khi các agent cảm thấy ngữ cảnh đang cạn kiệt, họ vội vàng hoàn thành, bỏ qua xác minh, và chọn một giải pháp đơn giản hơn giải pháp tối ưu. Họ gọi đây là "lo lắng ngữ cảnh" — điều tương tự xảy ra khi bạn nhận ra thời gian gần hết trong bài kiểm tra và bắt đầu đoán ngẫu nhiên các câu hỏi trắc nghiệm còn lại.

Các tác vụ dài trải dài qua nhiều phiên còn tệ hơn — tất cả những phát hiện từ phiên trước đều bị mất, và mọi phiên mới phải khám phá lại cấu trúc dự án và hiểu lại cách tổ chức mã. Các agent không có trạng thái liên tục thấy tỷ lệ thất bại tăng vọt trên các tác vụ vượt quá 30 phút.

## Giải thích thuật ngữ chính

Với những tình huống này, các khái niệm sau không còn chỉ là thuật ngữ nữa:

- **Khoảng cách Năng lực (Capability Gap)**: Khoảng cách lớn giữa hiệu suất mô hình trên các điểm chuẩn và hiệu suất trên các tác vụ thực tế. Tỷ lệ vượt qua 50-60% trên SWE-bench Verified có nghĩa là gần một nửa số vấn đề thực tế không thể được giải quyết.
- **Harness**: Mọi thứ bên ngoài mô hình — hướng dẫn, công cụ, môi trường, quản lý trạng thái, phản hồi xác minh. Nếu không phải trọng số mô hình, thì đó là harness. Đó là cái chúng ta gọi là "yên ngựa."
- **Lỗi Do Harness (Harness-Induced Failure)**: Mô hình có đủ năng lực, nhưng môi trường thực thi có khiếm khuyết cấu trúc. Thí nghiệm có kiểm soát của Anthropic đã chứng minh điều này.
- **Khoảng cách Xác minh (Verification Gap)**: Khoảng cách giữa sự tự tin của agent vào kết quả của nó và tính đúng đắn thực tế. Agent nói "tôi đã xong" khi chưa xong — đây là chế độ lỗi phổ biến nhất.
- **Vòng lặp Chẩn đoán (Diagnostic Loop)**: Thực thi, quan sát lỗi, quy cho một lớp harness cụ thể, sửa lớp đó, thực thi lại. Đây là phương pháp luận cốt lõi của harness engineering.
- **Định nghĩa Hoàn thành (Definition of Done)**: Một tập hợp các điều kiện có thể xác minh bằng máy — test qua, lint sạch, type check qua. Không có định nghĩa hoàn thành rõ ràng, agent sẽ tự bịa ra định nghĩa của mình.

## Khi Sự Cố Xảy ra, Sửa Harness Trước

Nguyên tắc cốt lõi: **Khi sự cố xảy ra, đừng đổi mô hình trước — kiểm tra harness.** Nếu cùng một mô hình thành công trên các tác vụ tương tự, có cấu trúc tốt, hãy giả định đó là vấn đề harness. Giống như xe hơi bị hỏng — bạn không ngay lập tức nghi ngờ động cơ. Bạn kiểm tra xăng trước.

Các bước cụ thể:

**Quy mọi lỗi cho một lớp cụ thể.** Đừng chỉ nói "mô hình không tốt." Hãy hỏi: tác vụ có mơ hồ không? Ngữ cảnh có không đủ không? Không có phương pháp xác minh không? Ánh xạ mỗi lỗi vào một trong năm lớp phòng thủ (đặc tả tác vụ, cung cấp ngữ cảnh, môi trường thực thi, phản hồi xác minh, quản lý trạng thái). Xây dựng thói quen này, và bạn sẽ thấy "mô hình không đủ tốt" xuất hiện ngày càng ít hơn trong nhật ký của bạn.

**Viết Định nghĩa Hoàn thành rõ ràng cho mỗi tác vụ.** Đừng nói "thêm tính năng tìm kiếm." Hãy nói:
```
Tiêu chí hoàn thành:
- Endpoint GET /api/search?q=xxx mới
- Hỗ trợ phân trang, mặc định 20 mục
- Kết quả bao gồm đoạn trích được tô sáng
- Tất cả mã mới vượt qua pytest
- Type checking vượt qua (mypy --strict)
```

**Tạo tệp AGENTS.md.** Đặt nó trong thư mục gốc của repo để cho agent biết tech stack của dự án, các quy ước kiến trúc, và các lệnh xác minh. Đây là bước đầu tiên trong harness engineering và bước có ROI cao nhất bạn có thể thực hiện. Một tệp `AGENTS.md` có thể hiệu quả hơn việc nâng cấp lên mô hình đắt tiền hơn — tôi không nói đùa.

**Xây dựng vòng lặp chẩn đoán.** Đừng coi lỗi là "mô hình lại ngốc rồi." Coi chúng là tín hiệu rằng harness của bạn có khiếm khuyết. Mỗi lỗi, xác định lớp, sửa nó, không bao giờ thất bại theo cách đó nữa. Sau vài vòng, harness của bạn mạnh hơn và hiệu suất agent ổn định hơn. Giống như vá đường — mỗi ổ gà bạn lấp đầy làm cho đoạn đường tiếp theo êm hơn.

**Định lượng cải tiến.** Giữ một nhật ký đơn giản: mỗi tác vụ có thành công hay thất bại, và lớp nào gây ra lỗi. Sau vài vòng, bạn sẽ thấy lớp nào là điểm nghẽn cổ chai — tập trung năng lượng của bạn ở đó.

## Thí nghiệm Triệu Dòng Mã

OpenAI đã thực hiện một thí nghiệm táo bạo vào năm 2025: sử dụng Codex để xây dựng một sản phẩm nội bộ hoàn chỉnh từ một kho git trống. Năm tháng sau, kho có khoảng một triệu dòng mã — logic ứng dụng, cơ sở hạ tầng, công cụ, tài liệu, công cụ dev nội bộ — tất cả được tạo bởi agent. Ba kỹ sư điều khiển Codex, mở và hợp nhất khoảng 1,500 PR. Trung bình 3.5 PR mỗi người mỗi ngày.

Ràng buộc chính: **con người không bao giờ viết mã trực tiếp.** Đây không phải là trò gimmick — nó được thiết kế để buộc nhóm phải tìm ra điều gì thay đổi khi công việc chính của kỹ sư không còn là viết mã, mà là thiết kế môi trường, diễn đạt ý định, và xây dựng các vòng phản hồi.

Tiến độ ban đầu chậm hơn dự kiến. Không phải vì Codex không đủ năng lực, mà vì môi trường chưa đủ hoàn chỉnh — agent thiếu các công cụ, trừu tượng và cấu trúc nội bộ cần thiết để tiến lên các mục tiêu cấp cao. Công việc của các kỹ sư trở thành: chia nhỏ các mục tiêu lớn thành các khối xây dựng nhỏ (thiết kế, mã hóa, đánh giá, kiểm tra), để agent lắp ráp chúng, rồi sử dụng những khối đó để mở khóa các tác vụ phức tạp hơn. Khi có sự cố, câu trả lời gần như không bao giờ là "cố gắng hơn" — mà là "agent đang thiếu năng lực gì, và làm thế nào để chúng ta làm cho nó có thể hiểu và thực thi được?"

Thí nghiệm này trực tiếp chứng minh luận điểm cốt lõi của bài giảng này: **cùng một mô hình tạo ra kết quả về cơ bản khác nhau trong môi trường trần trụi so với môi trường có harness đầy đủ.** Mô hình không thay đổi. Môi trường thay đổi.

> Nguồn: [OpenAI: Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)

## Một Ví dụ Thực tế Hơn

Một nhóm sử dụng Claude Sonnet để thêm một API endpoint mới vào ứng dụng web Python cỡ trung (FastAPI + PostgreSQL + Redis, ~15,000 dòng mã).

Ban đầu họ chỉ đưa ra một câu: "thêm các endpoint tùy chọn người dùng dưới `/api/v2/users`." Kết quả? Agent dành 40% cửa sổ ngữ cảnh để khám phá cấu trúc repo, tạo ra mã trông có vẻ hợp lý nhưng không theo các mẫu xử lý lỗi của dự án, sử dụng cú pháp SQLAlchemy cũ, và tuyên bố hoàn thành trong khi endpoint có lỗi runtime. Phiên tiếp theo phải làm lại toàn bộ công việc khám phá.

Sau đó họ thêm `AGENTS.md` (mô tả kiến trúc dự án và phiên bản tech stack), các lệnh xác minh rõ ràng (`pytest tests/api/v2/ && python -m mypy src/`), và các bản ghi quyết định kiến trúc. Cùng một mô hình đã thành công trong cả ba lần chạy độc lập, với hiệu quả ngữ cảnh tốt hơn khoảng 60%.

Họ không thay đổi mô hình. Họ thay đổi harness.

## Những Điểm chính cần Nhớ

- Năng lực mô hình và độ tin cậy thực thi là hai điều khác nhau. Một con ngựa thuần chủng vẫn cần một cái yên tốt.
- Khi sự cố xảy ra, kiểm tra harness trước, rồi mới đến mô hình. Đổi mô hình là lựa chọn tốn kém nhất — và thường thậm chí không phải là vấn đề mô hình.
- Mỗi lỗi là một tín hiệu: harness của bạn có khiếm khuyết cấu trúc. Tìm nó, sửa nó.
- Năm lớp phòng thủ: đặc tả tác vụ, cung cấp ngữ cảnh, môi trường thực thi, phản hồi xác minh, quản lý trạng thái. Kiểm tra chúng có hệ thống, như bác sĩ loại trừ các nguyên nhân phổ biến nhất trước.
- Một tệp `AGENTS.md` có thể hiệu quả hơn việc nâng cấp lên mô hình đắt tiền hơn. Thực sự vậy.

## Đọc thêm

- [OpenAI: Harness Engineering — Leveraging Codex in an Agent-First World](https://openai.com/index/harness-engineering/)
- [Anthropic: Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [HumanLayer: Skill Issue — Harness Engineering for Coding Agents](https://humanlayer.dev/articles/harness-engineering-for-coding-agents/)
- [SWE-bench Leaderboard](https://www.swebench.com/)
- [Thoughtworks Technology Radar: Harness Engineering](https://www.thoughtworks.com/radar)

## Bài tập

1. **Thí nghiệm so sánh**: Chọn một codebase bạn biết rõ và một tác vụ sửa đổi không tầm thường. Đầu tiên, chạy agent mà không có hỗ trợ harness và ghi lại các lỗi. Sau đó thêm `AGENTS.md` với các lệnh xác minh rõ ràng và chạy lại với cùng agent. So sánh kết quả, quy mỗi lỗi vào một trong năm lớp phòng thủ.

2. **Đo lường khoảng cách xác minh**: Chọn 5 tác vụ lập trình. Sau mỗi tác vụ, ghi lại xem agent có tuyên bố hoàn thành không, sau đó xác minh tính đúng đắn thực tế bằng các bài test độc lập. Tính tỷ lệ lần agent tuyên bố xong khi thực tế chưa xong — đó là khoảng cách xác minh của bạn. Sau đó suy nghĩ: những lệnh xác minh nào sẽ giảm tỷ lệ này?

3. **Thực hành vòng lặp chẩn đoán**: Tìm một tác vụ mà agent liên tục thất bại trong dự án của bạn. Chạy một lần, ghi lại lỗi. Quy nó cho một trong năm lớp. Sửa lớp đó. Chạy lại. Lặp lại ba đến năm vòng, ghi lại cải tiến mỗi lần.
