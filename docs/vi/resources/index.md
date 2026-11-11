# Thư viện Tài nguyên

Thư mục này chuyển đổi các phương pháp của khóa học thành các mẫu sao chép ngay và tài liệu tham khảo ngắn gọn mà bạn có thể sử dụng trong một kho lưu trữ thực tế.

## Khi nào nên sử dụng

Bắt đầu từ đây khi bạn muốn Codex, Claude Code, hoặc một coding agent khác hoạt động qua nhiều phiên làm việc mà không cần liên tục thiết lập lại cài đặt, trạng thái và phạm vi.

Nó đặc biệt hữu ích khi:

- công việc kéo dài qua nhiều phiên
- có nhiều tính năng và dễ bị bỏ dở giữa chừng
- các agent có xu hướng tuyên bố thành công quá sớm
- các bước khởi động bị tìm lại từ đầu mỗi lần

## Bắt đầu từ đây

Đối với thiết lập tối giản, hãy bắt đầu với:

- hướng dẫn gốc: [`templates/AGENTS.md`](./templates/AGENTS.md) hoặc [`templates/CLAUDE.md`](./templates/CLAUDE.md)
- trạng thái tính năng: [`templates/feature_list.json`](./templates/)
- nhật ký tiến độ: [`templates/claude-progress.md`](./templates/claude-progress.md)
- tham chiếu script khởi động: `docs/vi/resources/templates/init.sh`

Sau đó thêm:

- bàn giao phiên: [`templates/session-handoff.md`](./templates/session-handoff.md)
- danh sách kiểm tra thoát sạch: [`templates/clean-state-checklist.md`](./templates/clean-state-checklist.md)
- tiêu chí đánh giá: [`templates/evaluator-rubric.md`](./templates/evaluator-rubric.md)

Nếu bạn muốn cấu trúc kho lưu trữ kiểu OpenAI đầy đủ hơn từ bài viết
"Harness engineering", hãy sử dụng gói nâng cao:

- [`openai-advanced/index.md`](./openai-advanced/index.md)

## Cấu trúc Thư viện

- [`templates/`](./templates/index.md): các mẫu để sao chép vào một kho lưu trữ thực tế
- [`reference/`](./reference/index.md): ghi chú phương pháp, luồng khởi động và sơ đồ chế độ lỗi
- [`openai-advanced/`](./openai-advanced/index.md): khung kho lưu trữ nâng cao, tài liệu nguồn sự thật, và các mẫu quản trị ưu tiên agent

## Gói Tối giản Khuyên dùng

- `AGENTS.md` hoặc `CLAUDE.md`
- `feature_list.json`
- `claude-progress.md`
- `init.sh`

Bốn tệp này là đủ để làm cho hầu hết các quy trình làm việc của agent ổn định hơn rõ rệt.

Khi kho lưu trữ phát triển thành một hệ thống hoạt động lâu dài hơn với nhiều domain, kế hoạch hoạt động, chấm điểm chất lượng và chính sách độ tin cậy, hãy chuyển sang gói
[`openai-advanced/`](./openai-advanced/index.md) thay vì cố mở rộng gói tối giản quá xa.
