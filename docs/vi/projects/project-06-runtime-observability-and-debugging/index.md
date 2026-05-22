[English Version →](../../../en/projects/project-06-runtime-observability-and-debugging/) | [中文版本 →](../../../zh/projects/project-06-runtime-observability-and-debugging/)

> Bài giảng liên quan: [Bài 11. Làm cho runtime của agent có thể quan sát được](./../../lectures/lecture-11-why-observability-belongs-inside-the-harness/index.md) · [Bài 12. Bàn giao sạch sẽ ở cuối mỗi phiên](./../../lectures/lecture-12-why-every-session-must-leave-a-clean-state/index.md)
> Tệp mẫu: [templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/vi/resources/templates/)

# Dự án 06. Xây dựng Harness Agent Đầy đủ (Capstone)

## Bạn Làm Gì

Đây là dự án capstone. Tập hợp tất cả những gì đã học trong năm dự án đầu tiên, chạy một benchmark đầy đủ, sau đó thực hiện một lần dọn dẹp để xác minh chất lượng có thể duy trì được.

Sử dụng một bộ tác vụ đa tính năng cố định bao phủ toàn bộ product slice: import transcript, segmentation, debrief report dựa trên trích dẫn, observability runtime, và trạng thái repo có thể đọc và khởi động lại. Lần đầu chạy với baseline harness yếu, sau đó với harness mạnh nhất của bạn, sau đó dọn dẹp và chạy lại. Cuối cùng, thực hiện thí nghiệm ablation harness — xóa từng thành phần một và xem cái nào thực sự quan trọng.

## Công cụ

- Claude Code hoặc Codex
- Git
- Node.js + Electron
- Mẫu transcript chất lượng
- Rubric evaluator
- Tất cả các thành phần harness tích lũy từ năm dự án đầu tiên

## Cơ chế Harness

Harness đầy đủ: tất cả các cơ chế + observability + nghiên cứu ablation
