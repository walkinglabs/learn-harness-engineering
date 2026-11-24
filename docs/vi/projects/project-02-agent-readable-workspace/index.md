[English Version →](../../../en/projects/project-02-agent-readable-workspace/) | [中文版本 →](../../../zh/projects/project-02-agent-readable-workspace/)

> Bài giảng liên quan: [Bài 03. Biến kho lưu trữ thành nguồn sự thật duy nhất](./../../lectures/lecture-03-why-the-repository-must-become-the-system-of-record/index.md) · [Bài 04. Chia hướng dẫn ra thành nhiều tệp](./../../lectures/lecture-04-why-one-giant-instruction-file-fails/index.md)
> Tệp mẫu: [templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/vi/resources/templates/)

# Dự án 02. Làm cho Dự án Có thể Đọc Được và Tiếp tục từ Nơi Đã Dừng

## Bạn Làm Gì

Thêm "khả năng đọc được" vào repo để một agent mới có thể nhanh chóng hiểu cấu trúc dự án, biết tiến độ hiện tại, và tiếp tục công việc. Cụ thể: triển khai import tài liệu, document detail view, và local persistence, hoàn thành qua hai phiên.

Cả hai lượt bắt đầu từ cùng một mã nguồn trong `starter/`. Lượt một dùng harness có sẵn và không ghi bàn giao. Lượt hai thay `AGENTS.md` bằng bản có quy tắc bàn giao và yêu cầu agent viết `session-handoff.md` ở cuối phiên A. Xem quy trình thực nghiệm.

## Công cụ

- Claude Code hoặc Codex
- Git
- Node.js + Electron

## Cơ chế Harness

Không gian làm việc agent có thể đọc được + tệp trạng thái liên tục

## Dùng project có sẵn trong repo

Đường dẫn repo: [`projects/project-02/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02)

| Thư mục | Nội dung | So sánh gì |
|------|------|------|
| [`starter/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/starter) | Code từ Project 01, nhưng import tài liệu, trang chi tiết và persistence vẫn chưa hoàn chỉnh. Tài liệu có nhưng mỏng hơn, và không có `session-handoff.md`. | Phiên agent thứ hai phải tự khám phá lại bao nhiêu ngữ cảnh. |
| [`solution/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/solution) | Chỉ dùng bản hoàn chỉnh này để tham khảo, không dùng làm điểm xuất phát. Lượt harness mạnh chỉ lấy `AGENTS.md` từ đây. | Phiên mới có thể tiếp tục chỉ từ trạng thái repo hay không. |

## Quy trình thực nghiệm

Chỉ thay đổi harness giữa hai lượt chạy. Giữ nguyên mã nguồn ban đầu, lời nhắc, agent và điểm dừng của phiên A. Phiên A làm chức năng nhập và xem chi tiết tài liệu; phiên B làm chức năng lưu dữ liệu qua lần khởi động lại, như trong [README của dự án](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/README.md).

1. Chuẩn bị hai thư mục làm việc cách ly, chẳng hạn `p02-baseline/` và `p02-improved/`. Chỉ chạy một lượt tại một thời điểm: xong hai phiên, lưu kết quả rồi xóa thư mục làm việc trước khi bắt đầu lượt kia. Không dùng hai nhánh Git để tách lượt chạy. Agent có thể đọc nhánh khác hoặc thư mục ngang cấp; nếu nhóm yếu thấy tệp của nhóm mạnh, phép so sánh không còn công bằng.
2. Sao chép [`projects/project-02/starter/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/starter) vào cả hai thư mục. Starter dựa trên bản giải Project 01: các chức năng của Project 01 đã đạt, còn ba chức năng Project 02 có trạng thái `not-started` trong `feature_list.json`. Nếu dùng kết quả Project 01 của bạn, hãy sao chép cùng một bản chụp vào cả hai thư mục.
3. Dùng cùng một lời nhắc cho cả hai lượt, ví dụ: “Triển khai nhập tài liệu qua hộp thoại chọn tệp, màn hình chi tiết hiển thị toàn bộ nội dung và lưu dữ liệu để tài liệu đã nhập vẫn còn sau khi khởi động lại ứng dụng.”
4. Không sao chép `solution/docs/`, `solution/feature_list.json` hoặc `solution/session-handoff.md` vào bất kỳ lượt nào. Chúng mô tả các luồng đã hoàn chỉnh và đánh dấu mọi chức năng là `pass`, tức là tiết lộ đáp án. Giữ nguyên `starter/docs/ARCHITECTURE.md`, `starter/docs/PRODUCT.md` và `feature_list.json` ở cả hai lượt.

### Lượt thứ nhất (harness yếu)

Trong `p02-baseline/`, dùng harness nguyên bản của starter: `AGENTS.md` ngắn, `docs/` và `feature_list.json`, không có `session-handoff.md`. Không xóa tệp: harness yếu là tối giản, không phải trống.

**Phiên A:**

1. Khởi động agent với lời nhắc đã chọn.
2. Dừng khi nhập và xem chi tiết đã hoạt động, nhưng chưa có lưu dữ liệu: mở ứng dụng, nhập một tệp `.txt` hoặc `.md` qua hộp thoại, thấy nó trong danh sách và mở để xem toàn bộ nội dung. Sau khi khởi động lại, tài liệu vẫn mất. Dùng cùng tiêu chí cho lượt thứ hai.
3. Không yêu cầu ghi chú bàn giao hay tệp tóm tắt.

**Phiên B:**

1. Mở một phiên agent mới trong cùng thư mục và chỉ nói “Tiếp tục công việc.”
2. Đo thời gian đến lần sửa mã có ý nghĩa đầu tiên và đếm những lần agent phải tìm lại thông tin đã biết ở phiên A, chẳng hạn kiến trúc, lệnh hoặc trạng thái tính năng.

### Lượt thứ hai (harness mạnh)

Trong `p02-improved/`, trước phiên A, thay `AGENTS.md` bằng [`solution/AGENTS.md`](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/solution/AGENTS.md). Tệp này thêm quy tắc khởi động, thứ tự ưu tiên tài liệu, yêu cầu cập nhật tài liệu, tiêu chí hoàn thành có bằng chứng trong `feature_list.json` và mục bàn giao phiên. Không thay gì khác. Phép so sánh đo cả harness, không chỉ ghi chú. Nếu muốn tách riêng tác động của bàn giao, thêm lượt thứ ba giữ nguyên `AGENTS.md` của starter và chỉ thêm mục bàn giao phiên.

**Phiên A:**

1. Dùng cùng lời nhắc và dừng ở cùng điểm (đã nhập, xem chi tiết; chưa lưu dữ liệu).
2. Trước khi đóng phiên, yêu cầu agent viết `session-handoff.md` ở gốc repo theo [mẫu bàn giao](./../../resources/templates/session-handoff.md): đã xác minh gì, đã sửa gì, còn lỗi hoặc chưa kiểm chứng gì và bước tiếp theo. [Tệp trong solution](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/solution/session-handoff.md) chỉ là ví dụ hoàn chỉnh, không sao chép.

**Phiên B:**

1. Mở một phiên mới trong cùng thư mục và chỉ nói “Tiếp tục công việc.” Quy tắc đọc ghi chú đến từ `AGENTS.md`, không phải lời nhắc.
2. Đo như lượt thứ nhất.

## Cách đo kết quả

| Chỉ số | Mô tả |
|---|---|
| Thời gian tiếp quản ở phiên B | Từ lúc bắt đầu đến lần sửa mã có ý nghĩa đầu tiên |
| Số lần tìm lại thông tin | Số lần agent phải tìm lại kiến trúc, lệnh hoặc trạng thái đã biết |
| Chất lượng bàn giao | Ghi chú đầy đủ, chính xác và giúp hành động được hay không (chỉ lượt hai) |
| Công việc lặp lại | Phần việc phiên B làm lại dù phiên A đã hoàn thành |
| Kết quả cuối | Cả ba chức năng có hoàn thành hay không |

## Nội dung nộp

- Nhật ký hoặc bản ghi hội thoại của phiên A và B ở lượt harness yếu.
- Nhật ký hoặc bản ghi tương ứng ở lượt harness mạnh, kèm `AGENTS.md` đã dùng và `session-handoff.md` do agent viết.
- Nhận xét so sánh tốc độ tiếp quản và khả năng khôi phục ngữ cảnh.
