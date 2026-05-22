[English Version →](../../../en/projects/project-05-evidence-grounded-evaluator-loops/) | [中文版本 →](../../../zh/projects/project-05-evidence-grounded-evaluator-loops/)

> Bài giảng liên quan: [Bài 09. Ngăn agent tuyên bố hoàn thành quá sớm](./../../lectures/lecture-09-why-agents-declare-victory-too-early/index.md) · [Bài 10. Chỉ testing end-to-end mới là xác minh thực sự](./../../lectures/lecture-10-why-end-to-end-testing-changes-results/index.md)
> Tệp mẫu: [templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/vi/resources/templates/)

# Dự án 05. Để Agent Xác minh Công việc của Chính nó

## Bạn Làm Gì

Triển khai phân tách vai trò — một generator thực hiện, một evaluator review, và tùy chọn một planner. Chạy ba lần để đo lường tác động của mỗi vai trò được thêm vào.

Chọn một tính năng nâng cấp thực chất (hội thoại đa lượt, thiết kế lại evidence reference panel, hoặc lọc transcript) và giữ nó nhất quán qua tất cả các lần chạy.

## Công cụ

- Claude Code hoặc Codex
- Git
- Node.js + Electron

## Cơ chế Harness

Tự xác minh + debrief report có grounding + hoàn thành dựa trên bằng chứng
