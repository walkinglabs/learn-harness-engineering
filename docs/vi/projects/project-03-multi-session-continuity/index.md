[English Version →](../../../en/projects/project-03-multi-session-continuity/) | [中文版本 →](../../../zh/projects/project-03-multi-session-continuity/)

> Bài giảng liên quan: [Bài 05. Duy trì ngữ cảnh qua các phiên](./../../lectures/lecture-05-why-long-running-tasks-lose-continuity/index.md) · [Bài 06. Khởi tạo trước mỗi phiên agent](./../../lectures/lecture-06-why-initialization-needs-its-own-phase/index.md)
> Tệp mẫu: [templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/vi/resources/templates/)

# Dự án 03. Giữ cho Agent Tiếp tục Làm việc Qua Các Lần Khởi động Lại Phiên

## Bạn Làm Gì

Thêm kiểm soát phạm vi và cổng xác minh vào agent. Triển khai transcript segmentation, metadata extraction, hiển thị tiến độ segmentation, và luồng debrief report dựa trên trích dẫn. Sử dụng `feature_list.json` để theo dõi trạng thái tính năng — mỗi lần một tính năng, không đánh dấu là "pass" mà không có bằng chứng xác minh.

Bạn chạy hai lần: lần đầu không có ràng buộc, lần hai với thực thi nghiêm ngặt.

## Công cụ

- Claude Code hoặc Codex
- Git
- Node.js + Electron

## Cơ chế Harness

Nhật ký tiến độ + bàn giao phiên + tính liên tục đa phiên
