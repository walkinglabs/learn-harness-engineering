# Chào mừng đến với Learn Interview Harness Engineering

Learn Interview Harness Engineering là khóa học dự án về cách làm cho AI coding agent đáng tin cậy thông qua một sản phẩm capstone thật: **Interview Debrief Coach**, một ứng dụng Electron local-first để debrief sau phỏng vấn. Người dùng nhập audio phỏng vấn hoặc transcript có timestamp; ứng dụng phân đoạn chuỗi câu hỏi và tạo báo cáo debrief có bằng chứng timestamp cùng kế hoạch luyện tập.

Khóa học giữ cấu trúc harness engineering: 12 bài giảng, 6 dự án thực hành, starter/solution, template tài nguyên, feature list, progress log, benchmark, cleanup scanner và session handoff. Các tài liệu tham khảo cốt lõi của chúng tôi bao gồm:
- [OpenAI: Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)
- [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Anthropic: Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [Awesome Harness Engineering](https://github.com/walkinglabs/awesome-harness-engineering)

Thông qua thiết kế môi trường có hệ thống, quản lý trạng thái, xác minh và hệ thống kiểm soát, khóa học này dạy bạn cách làm cho các công cụ lập trình agent như Codex và Claude Code thực sự đáng tin cậy.

Ranh giới an toàn: ứng dụng chỉ huấn luyện ứng viên sau phỏng vấn. Nó không xếp hạng ứng viên, không khuyến nghị tuyển/loại, không suy luận thuộc tính được bảo vệ, không nhận diện cảm xúc, không đánh giá tính cách và không phán đoán nói dối.

## Bắt đầu

Chọn lộ trình học của bạn để bắt đầu. Khóa học được chia thành các bài giảng lý thuyết, các dự án thực hành và thư viện tài nguyên sẵn sàng sao chép.

<div class="card-grid">
  <a href="./lectures/lecture-01-why-capable-agents-still-fail/" class="card">
    <h3>Bài giảng</h3>
    <p>Hiểu lý do tại sao các mô hình mạnh mẽ vẫn thất bại và tìm hiểu lý thuyết đằng sau các harness hiệu quả.</p>
  </a>
  <a href="./projects/" class="card">
    <h3>Dự án</h3>
    <p>Thực hành phát triển Interview Debrief Coach và harness của nó từ đầu.</p>
  </a>
  <a href="./resources/" class="card">
    <h3>Thư viện Tài nguyên</h3>
    <p>Các mẫu sao chép ngay (AGENTS.md, feature_list.json) để sử dụng trong kho lưu trữ của riêng bạn.</p>
  </a>
</div>

## Cơ chế cốt lõi của một Harness

Một harness không "làm cho mô hình thông minh hơn"; thay vào đó, nó thiết lập một **hệ thống làm việc** vòng kín cho mô hình. Bạn có thể hiểu quy trình làm việc cốt lõi của nó qua sơ đồ đơn giản này:

```mermaid
graph TD
    A["Mục tiêu rõ ràng<br/>AGENTS.md"] --> B("Khởi tạo<br/>init.sh")
    B --> C{"Chạy tác vụ<br/>AI Agent"}
    C -->|Gặp sự cố| D["Phản hồi Runtime<br/>CLI / Logs"]
    D -->|Tự động sửa| C
    C -->|Mã hoàn thành| E{"Xác minh & QA<br/>Test suite"}
    E -->|Thất bại| D
    E -->|Thành công| F["Dọn dẹp & Bàn giao<br/>claude-progress.md"]
    
    classDef primary fill:#D95C41,stroke:#C14E36,color:#fff,font-weight:bold;
    classDef process fill:#F4F3EE,stroke:#D1D1D1,color:#1A1A1A;
    classDef check fill:#EAE8E1,stroke:#B3B3B3,color:#1A1A1A;
    
    class A,F primary;
    class B,D process;
    class C,E check;
```

## Những gì bạn sẽ học

Dưới đây là một số khái niệm chính mà bạn sẽ nắm vững:

<ul class="index-list">
  <li><strong>Ràng buộc hành vi của agent</strong> bằng các quy tắc và ranh giới rõ ràng.</li>
  <li><strong>Duy trì ngữ cảnh</strong> qua các tác vụ dài hạn, đa phiên.</li>
  <li><strong>Ngăn chặn agent</strong> khỏi việc tuyên bố thành công quá sớm.</li>
  <li><strong>Xác minh công việc</strong> bằng các bài kiểm thử toàn bộ quy trình và tự phản ánh.</li>
  <li><strong>Làm cho runtime có thể quan sát được</strong> và có thể gỡ lỗi.</li>
</ul>

## Các bước tiếp theo

Khi bạn đã hiểu các khái niệm cốt lõi, các hướng dẫn này sẽ giúp bạn đi sâu hơn:

<ul class="index-list">
  <li><a href="./lectures/lecture-01-why-capable-agents-still-fail/">Bài giảng 01: Tại sao các Agent mạnh vẫn thất bại</a>: Bắt đầu với lý thuyết đằng sau harness engineering.</li>
  <li><a href="./projects/project-01-baseline-vs-minimal-harness/">Dự án 01: Baseline vs Minimal Harness</a>: Đi qua tác vụ thực tế đầu tiên của bạn.</li>
  <li><a href="./resources/templates/">Các mẫu</a>: Lấy gói minimal harness (AGENTS.md, feature_list.json, claude-progress.md) cho các dự án của riêng bạn.</li>
</ul>
