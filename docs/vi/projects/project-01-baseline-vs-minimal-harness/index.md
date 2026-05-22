[English Version →](../../../en/projects/project-01-baseline-vs-minimal-harness/) | [中文版本 →](../../../zh/projects/project-01-baseline-vs-minimal-harness/)

> Bài giảng liên quan: [Bài 01. Mô hình mạnh không có nghĩa là thực thi đáng tin cậy](./../../lectures/lecture-01-why-capable-agents-still-fail/index.md) · [Bài 02. Harness thực sự có nghĩa là gì](./../../lectures/lecture-02-what-a-harness-actually-is/index.md)
> Tệp mẫu: [templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/vi/resources/templates/)

# Dự án 01. Chỉ Prompt vs. Ưu tiên Quy tắc: Sự Khác biệt Lớn thế Nào

## Bạn Làm Gì

Xây dựng một ứng dụng Electron interview-debrief shell tối giản — một cửa sổ với danh sách interview sessions bên trái, panel debrief report bên phải, và thư mục dữ liệu cục bộ. Bản thân tác vụ không phức tạp. Điều phức tạp là cách bạn để agent hoàn thành nó.

Bạn chạy hai lần. Lần đầu: chỉ một prompt, không chuẩn bị gì. Lần hai: `AGENTS.md`, `init.sh`, `feature_list.json` được đặt sẵn trong repo. Sau đó so sánh.

Cốt lõi của dự án này không phải là viết mã — mà là tìm hiểu khoảng cách lớn thế nào giữa "dành 15 phút chuẩn bị quy tắc trước" và "cứ để agent tự làm."

## Công cụ

- Claude Code hoặc Codex (chọn một, sử dụng cho cả hai lần chạy)
- Git (quản lý branch và so sánh)
- Node.js + Electron (tech stack dự án)
- Đồng hồ đo thời gian (ghi lại thời gian mỗi lần chạy)

## Cơ chế Harness

Harness tối giản: `AGENTS.md` + `init.sh` + `feature_list.json`
