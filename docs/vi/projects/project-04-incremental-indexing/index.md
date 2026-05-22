[English Version →](../../../en/projects/project-04-incremental-segmentation/) | [中文版本 →](../../../zh/projects/project-04-incremental-segmentation/)

> Bài giảng liên quan: [Bài 07. Vạch ranh giới tác vụ rõ ràng cho agent](./../../lectures/lecture-07-why-agents-overreach-and-under-finish/index.md) · [Bài 08. Sử dụng feature list để ràng buộc những gì agent làm](./../../lectures/lecture-08-why-feature-lists-are-harness-primitives/index.md)
> Tệp mẫu: [templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/vi/resources/templates/)

# Dự án 04. Sử dụng Phản hồi Runtime để Điều chỉnh Hành vi Agent

## Bạn Làm Gì

Thêm observability runtime (log khởi động, log import/segmentation, trạng thái lỗi) và các ràng buộc kiến trúc để ngăn chặn vi phạm xuyên lớp. Cài một lỗi runtime để agent sửa.

Bạn chạy hai lần: lần đầu không có log hoặc ràng buộc, lần hai với các công cụ và quy tắc phù hợp.

## Công cụ

- Claude Code hoặc Codex
- Git
- Node.js + Electron

## Cơ chế Harness

Phản hồi runtime + kiểm soát phạm vi + segmentation tăng dần
