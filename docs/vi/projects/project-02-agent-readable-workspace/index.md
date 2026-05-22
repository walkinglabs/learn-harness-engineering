[English Version →](../../../en/projects/project-02-agent-readable-workspace/) | [中文版本 →](../../../zh/projects/project-02-agent-readable-workspace/)

> Bài giảng liên quan: [Bài 03. Biến kho lưu trữ thành nguồn sự thật duy nhất](./../../lectures/lecture-03-why-the-repository-must-become-the-system-of-record/index.md) · [Bài 04. Chia hướng dẫn ra thành nhiều tệp](./../../lectures/lecture-04-why-one-giant-instruction-file-fails/index.md)
> Tệp mẫu: [templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/vi/resources/templates/)

# Dự án 02. Làm cho Dự án Có thể Đọc Được và Tiếp tục từ Nơi Đã Dừng

## Bạn Làm Gì

Thêm "khả năng đọc được" vào repo để một agent mới có thể nhanh chóng hiểu cấu trúc dự án, biết tiến độ hiện tại, và tiếp tục công việc. Cụ thể: triển khai import transcript, transcript detail view, và local persistence, hoàn thành qua hai phiên.

Bạn chạy hai lần: lần đầu không có sự trợ giúp nào, lần hai với `ARCHITECTURE.md`, `PRODUCT.md`, và `session-handoff.md` được đặt sẵn trong repo.

## Công cụ

- Claude Code hoặc Codex
- Git
- Node.js + Electron

## Cơ chế Harness

Không gian làm việc agent có thể đọc được + tệp trạng thái liên tục
