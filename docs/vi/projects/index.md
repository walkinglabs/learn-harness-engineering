# Chào mừng đến với Dự án

Đây là phần thực hành của Learn Interview Harness Engineering. Chỉ đọc các bài giảng là không đủ; bạn cần tự xây dựng Interview Debrief Coach và quan sát cách Codex, Claude Code hoặc các AI agent khác hoạt động dưới các quy tắc harness khác nhau.

## Tổng quan về Dự án

Khóa học này bao gồm 6 dự án thực hành tiến triển dần xoay quanh một sản phẩm Electron AI interview debrief:

1. **Chỉ Prompt vs. Ưu tiên Quy tắc**: So sánh cách agent hoạt động chỉ với prompt so với một harness cơ bản.
2. **Không gian làm việc Agent đọc được**: Tìm hiểu cách cấu trúc kho lưu trữ của bạn để thân thiện với AI và thiết lập cơ chế bàn giao.
3. **Tính liên tục đa phiên**: Thiết kế các tệp trạng thái và kịch bản khởi tạo để agent của bạn có thể tiếp tục công việc một cách liền mạch qua nhiều phiên.
4. **Phản hồi Runtime và Kiểm soát Cấu trúc**: Thêm kiểm tra quanh phân tích transcript, phân đoạn và hành vi phân tích.
5. **Vòng lặp Evaluator và Phân tách Vai trò**: Xây dựng cơ chế review độc lập cho bằng chứng timestamp và chất lượng debrief.
6. **Harness Interview Debrief Hoàn chỉnh**: Lắp ráp môi trường làm việc agent end-to-end, có thể quan sát được.

Ranh giới sản phẩm: ứng dụng chỉ huấn luyện ứng viên sau phỏng vấn. Nó không xếp hạng ứng viên, không khuyến nghị tuyển/loại, không suy luận thuộc tính được bảo vệ, không nhận diện cảm xúc, không đánh giá tính cách và không phán đoán nói dối.

## Cách Thực hiện

Mỗi thư mục dự án thường chứa:
- `starter/`: Không gian làm việc bắt đầu của bạn.
- `solution/`: Cách triển khai tham khảo (nếu bạn bị mắc kẹt).
- Các hướng dẫn tác vụ nêu chi tiết bối cảnh của bạn và các mục tiêu cụ thể.

Sử dụng AI Coding Agent ưa thích của bạn (ví dụ: Claude Code, Cursor, Trae) để hoàn thành các tác vụ bên trong thư mục `starter/`.
