# Phân tích thiết kế DeepSeek Harness

[DeepSeek Harness](https://deepseek.com/harness) (tên lệnh `dsh`, repository `deepseek-ai/deepseek-harness`) được phát hành dưới dạng Developer Preview vào tháng 8 năm 2026. Định nghĩa chính thức của nó rất trực tiếp: **Agent = Model + Environment + Tools + State** — mô hình, môi trường, công cụ và trạng thái, một bộ bốn thành phần.

Nếu việc phân tích ba sản phẩm trước đặt câu hỏi “harness nên được thiết kế như thế nào”, DeepSeek Harness đặt ra một câu hỏi táo bạo hơn: **harness có thể tách khỏi mô hình cụ thể để trở thành một runtime độc lập không?** Câu trả lời của nó là có, và nó đẩy ý tưởng này đến cực hạn — nguyên văn trong [tài liệu kiến trúc](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md): *Every part of the product is a plugin, including the model adapter, the tool registry, the session log, and the agent loop itself* (mọi phần của sản phẩm đều là plugin, bao gồm bộ điều hợp mô hình, registry công cụ, nhật ký phiên và thậm chí chính vòng lặp agent).

Trong bài này, chúng ta tập trung phân tích ba điều: lõi plugin hóa, đường nối năng lực (capability seam), pipeline sự kiện, cùng ràng buộc kỹ thuật mạnh nhất: “Model-visible means logged”.

## Định vị trong một câu

Cấu trúc của coding agent truyền thống là “LLM + vòng lặp agent cố định + bộ công cụ cố định”. Cấu trúc của DeepSeek Harness là “mô hình + một lõi plugin (Cordis)”; lõi chỉ chịu trách nhiệm tải và gỡ plugin, quan hệ phụ thuộc cùng cơ chế sự kiện, và **không sở hữu bất kỳ năng lực cụ thể nào của agent** — nguyên văn trong [tài liệu kiến trúc](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md): “There is no privileged core to patch” (không có lõi đặc quyền nào cần vá), “you extend dsh by mounting a plugin beside the others” (chỉ cần gắn thêm một plugin bên cạnh các plugin khác để mở rộng dsh, không cần sửa lõi). Điều này có nghĩa ngay cả vòng lặp agent cũng không phải phần thiêng liêng bất biến — bạn có thể dùng mô hình của DeepSeek, nối với agent con của Claude Code, thêm sandbox từ xa, viết bộ nhớ tùy chỉnh, thay vòng lặp tùy chỉnh, thay UI tùy chỉnh và ghép thành một agent hoàn toàn mới.

Đây là cách hiện thực triệt để nhất câu “mọi thứ ngoài trọng số mô hình đều là harness” trong khóa học: nếu harness độc lập, hãy để nó độc lập thành một hệ điều hành.

## Cốt lõi kiến trúc 1: đường nối năng lực (Capability Seam)

DeepSeek Harness dùng Service để biểu diễn “năng lực”, và gần như mọi năng lực đều được chia thành ba tầng:

```
Service Definition
        ↓
Service Provider
        ↓
Consumer
```

Lấy hệ thống tệp làm ví dụ: bên dưới `FS Service` có nhiều Provider như Local FS, E2B FS, Remote FS, còn phía trên cung cấp thống nhất thành file tools. Shell, Subprocess, Sandbox, Web, LLM và SubAgent đều dùng cùng một cấu trúc. Cấu trúc ba tầng này không phải do chúng ta tự tổng kết — nguyên văn trong [tài liệu kiến trúc · Capability seams](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md): *a seam is a swappable capability with three roles: a Service Definition declaring the interface, a Service Provider implementing it, and a Consumer using it, commonly a model-facing tool* (đường nối năng lực = một năng lực có thể thay thế với ba vai trò: Service Definition khai báo giao diện, Service Provider triển khai giao diện và Consumer sử dụng nó; Consumer thường là công cụ hướng tới mô hình).

Điều này giải quyết một vấn đề tồn tại lâu dài trong kỹ thuật harness: **agent nên phụ thuộc vào “công cụ cụ thể” hay “giao diện năng lực”?** DeepSeek Harness chọn phương án thứ hai. Đối với khóa học, điều đó có nghĩa “hệ thống con công cụ” đã được tiêu chuẩn hóa thành giao diện — khi thay Provider, hình thức công cụ được cung cấp cho mô hình không đổi nhưng môi trường thay đổi hoàn toàn.

## Cốt lõi kiến trúc 2: pipeline sự kiện (Event Pipeline)

Bên trong DeepSeek Harness không chỉ là “LLM → công cụ → LLM”, mà là một pipeline sự kiện, trong đó mọi khâu đều là điểm sự kiện mà plugin có thể lắng nghe:

```
turn/start → claim input → assemble（system prompt / context / tools）
  → agent/pre-step → step/start → LLM request（agent/request）→ llm/stream
  → assistant/message → tool/call
  → tools/pre-execute（permission / guard / policy / hook）
  → tools/execute → tools/post-execute → tool/result → step/end → next turn
```

(Pipeline trên là bản chuyển lại từ phần [tài liệu kiến trúc · Turn flow](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md): `turn/*`, `step/*`, `user/message`, `assistant/*`, `tool/*` là các sự kiện phiên được duy trì; `agent/pre-step`, `agent/request`, `llm/stream`, `tools/*` là các điểm mở rộng mà plugin có thể lắng nghe.)

Lợi ích lớn nhất của thiết kế này là: **rất nhiều chức năng hoàn toàn không cần sửa chính vòng lặp agent**. Muốn kiểm tra an toàn trước khi thực thi công cụ? Lắng nghe `tools/pre-execute`. Muốn thêm bộ nhớ? Chèn vào `agent/pre-step`. Muốn ghi lại hành vi? Đăng ký sự kiện session. Muốn sửa yêu cầu gửi đến mô hình? Gắn hook vào `agent/request`. Muốn quyết định có tiếp tục suy luận không? Lắng nghe `agent/turn-stopping`.

So với Bài 11 của khóa học, “làm cho quá trình chạy của agent có thể quan sát được”, DeepSeek Harness còn đi xa hơn: nó không “thêm log”, mà biến **từng bước của vòng lặp thành một điểm sự kiện**, để khả năng quan sát, quyền hạn, bộ nhớ và chính sách đều gắn vào vòng lặp với tư cách listener, thay vì được viết cứng trong vòng lặp.

## Cốt lõi kiến trúc 3: Session Event Log và “Model-visible means logged”

DeepSeek Harness có một **Session Event Log chỉ nối thêm (append-only)**, đồng thời đặt ra một ràng buộc kỹ thuật rất mạnh. Nguyên văn trong [tài liệu kiến trúc · Session log](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md):

> **Model-visible means logged.** Anything that reaches a model request must be reconstructable from the log, and a runtime invariant asserts it.

(Mọi thứ mô hình nhìn thấy đều phải được ghi lại. Bất cứ thứ gì đi vào yêu cầu mô hình đều phải có thể được tái dựng từ log, và một bất biến runtime sẽ cưỡng chế điều này.)

Nói cách khác, khả năng quan sát không phải log bổ sung sau sự kiện, mà là ràng buộc nền tảng của harness: bất cứ thứ gì đi vào ngữ cảnh mô hình mặc định đều phải để lại log. Điều này trực tiếp tương ứng với “khả năng quan sát thuộc bên trong harness” ở bài kết thúc, đồng thời biến thiết kế lưu trữ “append-only” thành nguyên tắc — log chỉ được nối thêm, không ghi đè, và trạng thái phiên có thể phát lại.

## Ánh xạ vào khung của khóa học

| Hệ thống con | Cách DeepSeek Harness triển khai | Đánh giá |
| --- | --- | --- |
| Chỉ dẫn | Plugin hóa; quy tắc/kỹ năng đều được chèn dưới dạng plugin | Cực kỳ tự do, nhưng không có quy ước kiểu “CLAUDE.md” tích hợp sẵn |
| Công cụ | Đường nối năng lực Service Definition → Provider → Consumer | Đưa tiêu chuẩn hóa hệ thống con công cụ đến cực hạn |
| Môi trường | Sandbox/FS/Shell đều có thể thay Provider (bao gồm E2B từ xa) | Môi trường hoàn toàn có thể thay thế |
| Trạng thái | Session Event Log append-only + Model-visible means logged | Khả năng quan sát là ràng buộc nền tảng |
| Phản hồi | permission / guard / policy / hook trên tools/pre-execute | Cơ chế phản hồi được sự kiện hóa |

Khác biệt căn bản giữa DeepSeek Harness và ba sản phẩm còn lại: Pi, Claude Code và Codex đều tối ưu harness bên trong “một agent cụ thể”; còn DeepSeek Harness định nghĩa harness là một **hệ điều hành độc lập với mô hình**, trong đó chính agent chỉ là một ứng dụng có thể thay thế trên OS đó. Cái giá cũng rất rõ — mức độ tự do cao đồng nghĩa với chi phí cấu hình cao; đây là mặt còn lại vốn có của thiết kế “harness là OS” (giai đoạn Developer Preview cũng được định vị là “trải nghiệm sớm, cơ chế vẫn đang phát triển”).

## Những thiết kế đáng học hỏi

1. **Biến từng bước của vòng lặp thành điểm sự kiện**: quyền hạn, bộ nhớ, chính sách và log đều được gắn vào vòng lặp dưới dạng listener, thay vì viết cứng trong vòng lặp.
2. **Tiêu chuẩn hóa đường nối năng lực**: phụ thuộc vào “giao diện năng lực” thay vì “công cụ cụ thể”, để có thể thay toàn bộ môi trường mà không ảnh hưởng đến bề mặt công cụ mô hình nhìn thấy.
3. **Model-visible means logged**: mọi thứ mô hình nhìn thấy đều phải được ghi lại, biến khả năng quan sát từ “điểm cộng” thành “ràng buộc nền tảng”.
4. **Nhật ký phiên append-only**: trạng thái có thể phát lại, bàn giao đáng tin cậy; đây là bảo đảm kỹ thuật cho việc “mỗi phiên để lại trạng thái sạch”.

## Nguồn tham khảo (nguyên văn / mã nguồn)

Mọi luận điểm đều có thể truy ngược về nguyên văn hoặc mã nguồn dưới đây, tránh thuật lại theo ấn tượng:

- **Trang chủ DeepSeek Harness**: định nghĩa sản phẩm “Agent = Model + Environment + Tools + State”, định vị Developer Preview và lệnh `dsh`.<br/>https://deepseek.com/harness
- **Repository deepseek-ai/deepseek-harness** (lệnh `dsh`, giấy phép MIT):<br/>https://github.com/deepseek-ai/deepseek-harness
- **Tài liệu kiến trúc architecture.md**: nguồn cốt lõi nhất của bài — “Every part of the product is a plugin”, “There is no privileged core to patch”, pipeline sự kiện Turn flow, ba vai trò của Capability seams, “Model-visible means logged” cùng bất biến runtime, Session Event Log append-only, các đường nối năng lực như fs/tools/telemetry và hệ thống con `ctx.*`.<br/>https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md
- **Tài liệu con đi kèm tài liệu kiến trúc**: giới thiệu lõi Cordis (plugins contribute services, typed events, reversible effects), chi tiết đường nối năng lực và hệ thống con Session.<br/>https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-primer.md ｜ https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/capability-seams.md ｜ https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/subsystems/session.md

Giáo trình liên quan: [Bài 11 · Làm cho quá trình chạy của agent có thể quan sát được](../../lectures/lecture-11-why-observability-belongs-inside-the-harness/) ｜ [Bài 12 · Bàn giao đầy đủ trước khi kết thúc mỗi phiên](../../lectures/lecture-12-why-every-session-must-leave-a-clean-state/) ｜ [Bài 2 · Harness thực chất là gì](../../lectures/lecture-02-what-a-harness-actually-is/)
