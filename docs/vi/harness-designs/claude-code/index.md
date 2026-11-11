# Phân tích thiết kế harness của Claude Code

Trong bài viết “[Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)”, Anthropic nêu rõ: độ tin cậy đến từ harness chứ không phải mô hình; agent cần được ràng buộc ở “bên ngoài mô hình”. Claude Code là một sản phẩm hóa của tư tưởng này, và Anthropic cũng trực tiếp xếp nó vào phạm trù **agentic harness**. Đây không phải lời quảng bá — Claude Code có lẽ là harness hiện được phân tích công khai kỹ lưỡng nhất: mã nguồn mở, báo cáo nghiên cứu của cộng đồng chi tiết, và gần như mọi cơ chế cốt lõi trong giáo trình (bộ nhớ phân tầng, nén ngữ cảnh, quyền hạn, hook, agent con, duy trì phiên) đều đã được triển khai thành sản phẩm hoàn chỉnh.

Trong bài này, chúng ta dùng khung năm hệ thống con của khóa học để phân tích Claude Code, tập trung vào cách nó hiện thực hóa những khái niệm nền tảng của harness như “quản lý ngữ cảnh”, “ngăn tuyên bố hoàn thành quá sớm” và “ràng buộc tất định”.

## Định vị trong một câu

Cốt lõi của Claude Code là một vòng lặp while đơn giản: gọi mô hình, thực thi công cụ, quan sát kết quả rồi gọi lại mô hình. Nhưng **phần lớn mã không nằm trong vòng lặp này mà nằm trong các hệ thống bao quanh nó** — hệ thống quyền hạn, pipeline nén ngữ cảnh, cơ chế mở rộng, điều phối agent con và lưu trữ phiên. Đây chính là bản chất của harness: vòng lặp là bộ khung, còn mọi thứ bên ngoài bộ khung mới quyết định độ tin cậy.

## Hệ thống con chỉ dẫn: hệ thống bộ nhớ phân tầng

Hệ thống bộ nhớ của Claude Code là đóng góp trực tiếp nhất của nó cho lý thuyết harness, tương ứng với hai bài trong khóa học về “repository là nguồn sự thật” và “tính liên tục của ngữ cảnh qua nhiều phiên”. [Tài liệu chính thức “How Claude remembers your project”](https://code.claude.com/docs/en/memory) nêu rõ: mỗi phiên đều bắt đầu với một cửa sổ ngữ cảnh hoàn toàn mới và mang tri thức qua các phiên bằng hai cơ chế — tệp CLAUDE.md (chỉ dẫn do bạn viết) và auto memory (ghi chú do Claude tự viết).

Về phạm vi, tài liệu chính thức chia tệp CLAUDE.md thành bốn loại (theo thứ tự tải từ rộng đến hẹp):

- **Cấp chính sách tổ chức**: do IT/DevOps quản lý thống nhất (chẳng hạn `/etc/claude-code/CLAUDE.md`), chứa quy chuẩn cấp công ty.
- **Cấp người dùng `~/.claude/CLAUDE.md`**: sở thích và quy tắc cá nhân dùng xuyên dự án.
- **Cấp dự án `./CLAUDE.md` hoặc `./.claude/CLAUDE.md`**: nguồn sự thật cấp dự án, gồm cấu trúc kỹ thuật, stack công nghệ và lệnh xác minh, được chia sẻ cùng repository.
- **Cấp cục bộ `./CLAUDE.local.md`**: sở thích cá nhân trong dự án, thường được thêm vào `.gitignore` và không commit.

Ngoài ra còn có hai cơ chế:

- **Tải theo nhu cầu ở cấp thư mục con**: CLAUDE.md trong thư mục con không được tải khi khởi động, mà chỉ đi vào ngữ cảnh khi Claude đọc tệp trong thư mục đó.
- **Bộ nhớ tự động (auto memory)**: Claude chủ động ghi chú dựa trên các sửa đổi và sở thích của bạn; ghi chú được chia sẻ theo repository, có hiệu lực xuyên worktree, và mỗi phiên chỉ tải tối đa 200 dòng đầu hoặc 25KB.

Bốn loại phạm vi này tạo thành một **hệ thống phân cấp chỉ dẫn**: tài liệu chính thức cho biết “chỉ dẫn càng cụ thể thì càng đi vào ngữ cảnh muộn” (chỉ dẫn dự án xuất hiện sau chỉ dẫn người dùng). Giá trị của nó nằm ở chỗ mô hình không phải tiêu hóa một tệp chỉ dẫn khổng lồ ngay đầu mỗi cuộc trò chuyện, mà tải cục bộ theo phạm vi. Đây chính là câu trả lời được sản phẩm hóa cho Bài 4 của khóa học, “Vì sao một tệp chỉ dẫn khổng lồ sẽ thất bại”.

## Hệ thống con ngữ cảnh: pipeline nén năm tầng

Claude Code quản lý ngữ cảnh bằng một **pipeline nén năm tầng** (five-layer compaction pipeline), chứ không đơn giản là “đầy thì tóm tắt” — chi tiết kiến trúc này đến từ phân tích cấp mã nguồn [“Dive into Claude Code” của VILA Lab](https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf). Bài 5 của khóa học nói về việc “tác vụ dài sẽ mất tính liên tục”; giải pháp của Claude Code là một phễu nhiều cấp: trước tiên cắt tỉa không mất dữ liệu (loại bỏ kết quả công cụ dư thừa), sau đó tinh lọc có cấu trúc, cuối cùng mới dùng bản tóm tắt LLM có mất dữ liệu, đồng thời kết hợp cơ chế ngắt mạch để tránh nén quá mức.

Đi cùng với đó là thiết kế lưu trữ phiên: **lưu trữ phiên theo kiểu nối thêm (append-oriented storage)**, toàn bộ lịch sử được nối thêm vào `history.jsonl`, hỗ trợ khôi phục bằng `/resume` và phân nhánh fork. Điều này bảo đảm “bàn giao đầy đủ trước khi kết thúc mỗi phiên” — không phải nhờ trí nhớ tốt, mà vì tầng lưu trữ có tính nối thêm và có thể phát lại.

## Hệ thống con công cụ: bốn cơ chế mở rộng

Claude Code chia bề mặt mở rộng thành bốn loại, mỗi loại giải quyết một dạng vấn đề; đây là phần đáng học hỏi nhất trong thiết kế của nó:

- **Kỹ năng (Skills)**: [tài liệu chính thức](https://code.claude.com/docs/en/skills) định nghĩa đây là tri thức quy trình được mô tả bằng `SKILL.md`, tự động tải theo từ khóa kích hoạt và công bố dần dần. Phù hợp với tri thức chuyên môn về “cách làm một việc”.
- **MCP**: giao thức JSON-RPC trong [tài liệu chính thức](https://code.claude.com/docs/en/mcp) kết nối các hệ thống bên ngoài, là giao diện tiêu chuẩn giúp “cánh tay của mô hình vươn ra thế giới bên ngoài”.
- **Hook (Hooks)**: [tài liệu chính thức](https://code.claude.com/docs/en/hooks) mô tả các script tất định gắn vào những sự kiện vòng đời như `PreToolUse`, `PostToolUse`, `Stop`.
- **Plugin / agent con (Subagents)**: [tài liệu chính thức](https://code.claude.com/docs/en/sub-agents) giao các tác vụ phức tạp cho agent chuyên biệt thực hiện.

Thiết kế then chốt là **phân tách trách nhiệm**: CLAUDE.md quản lý “là gì”, kỹ năng quản lý “làm thế nào”, MCP quản lý “kết nối đến đâu”, còn hook quản lý “khi nào phải cưỡng chế”. Nếu một nhóm dùng lẫn các tầng này (chẳng hạn viết công việc của MCP vào CLAUDE.md), hiện tượng rò rỉ ngữ cảnh được nói đến trong khóa học sẽ xuất hiện.

## Phản hồi và xác minh: ràng buộc tất định + phân công người–máy

Bài 10 của khóa học nói rằng “chỉ khi chạy thông toàn bộ quy trình mới được xem là xác minh thực sự”; Claude Code đáp ứng bằng cơ chế hai đường:

**1. Hệ thống quyền hạn (ràng buộc tất định).** Quyền hạn của Claude Code không phải “hỏi lại mọi thứ”, mà gồm bảy chế độ + một bộ phân loại dựa trên ML: thao tác rủi ro thấp được cho phép, thao tác rủi ro cao sẽ được hỏi hoặc từ chối theo chính sách (xem chi tiết kiến trúc trong [phân tích của VILA Lab](https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf)). Đây là cách biến việc “vạch rõ ranh giới cho agent” (Bài 7) thành cưỡng chế ở runtime, thay vì cầu xin bằng prompt.

**2. Hook (ngăn tuyên bố hoàn thành quá sớm).** Hook `PostToolUse` có thể buộc chạy kiểm tra sau khi công cụ được thực thi rồi ghi kết quả trở lại ngữ cảnh; hook `Stop` can thiệp khi agent tuyên bố hoàn thành. Đây là cách “tách người làm khỏi người kiểm tra” — [Anthropic đã quan sát rõ trong bài viết về harness](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) rằng agent sẽ tự tin ca ngợi công việc của mình (“confidently praised their work”), vì vậy hook được dùng để chèn kiểm tra **tất định**, thay vì tin vào tự đánh giá của mô hình.

**3. Agent con (cô lập ngữ cảnh).** Nhật ký hội thoại của mỗi agent con được lưu trong một tệp sidechain độc lập và **không làm phình ngữ cảnh của agent cha** (xem [phân tích của VILA Lab](https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf)). Đây là sự kết hợp giữa “ranh giới tác vụ” và “cô lập ngữ cảnh”: khi chia nhỏ tác vụ, sự ô nhiễm ngữ cảnh cũng được cô lập.

## Khả năng quan sát và duy trì phiên

Nhật ký của Claude Code là một bản ghi đầy đủ theo kiểu nối thêm (history.jsonl). Cùng với các lệnh tường minh `/compact`, `/clear`, `/init`, nó cho phép bạn chủ động quản lý trạng thái ngữ cảnh thay vì thụ động chờ cửa sổ đầy. Đặc biệt, `/init` biến việc “để agent khởi tạo trước mỗi lần làm việc” (Bài 6) thành một lệnh — [tài liệu chính thức](https://code.claude.com/docs/en/memory) cho biết lệnh này tự động phân tích codebase và tạo CLAUDE.md ban đầu (bao gồm lệnh build, hướng dẫn kiểm thử và quy ước kỹ thuật).

## Ánh xạ vào khung của khóa học

| Hệ thống con | Cách Claude Code triển khai | Đánh giá |
| --- | --- | --- |
| Chỉ dẫn | Phân tầng theo phạm vi (tổ chức/người dùng/dự án/cục bộ) + bộ nhớ tự động | Bộ nhớ phân tầng là triển khai chuẩn mực |
| Công cụ | Bốn loại mở rộng: kỹ năng + MCP + hook + agent con | Phân chia trách nhiệm rõ ràng, là điểm nổi bật cốt lõi |
| Môi trường | Thiết lập trong dự án + settings.json | Dựa vào người dùng tự mô tả trong CLAUDE.md |
| Trạng thái | Lưu trữ phiên nối thêm + nén năm tầng + resume/fork | Rất mạnh, là triển khai tham chiếu cho tính liên tục của tác vụ dài |
| Phản hồi | Bộ phân loại quyền hạn + hook PostToolUse cưỡng chế kiểm tra | Biến việc “ngăn tuyên bố hoàn thành quá sớm” thành cơ chế tất định |

## Những thiết kế đáng học hỏi

1. **Phân tầng chỉ dẫn theo phạm vi**, thay vì chất đống trong một tệp. CLAUDE.md cấp thư mục là một cách triển khai “tải cục bộ” rất đẹp.
2. **Nén là một phễu phân cấp**: không mất dữ liệu trước, có mất dữ liệu sau; đừng bắt đầu bằng việc tóm tắt toàn văn.
3. **Dùng hook để kiểm tra tất định**: ngăn tuyên bố hoàn thành quá sớm dựa vào cưỡng chế ở runtime, không phải lời cầu xin trong prompt.
4. **Cô lập ngữ cảnh agent con**: chia tác vụ đồng thời chia ngữ cảnh, không để kết quả tác vụ con làm ô nhiễm vòng lặp chính.
5. **Lưu trữ phiên theo kiểu nối thêm + có thể phát lại**: bàn giao không dựa vào trí nhớ mà được bảo đảm bởi tầng lưu trữ.

## Nguồn tham khảo (nguyên văn / mã nguồn)

Mọi luận điểm đều có thể truy ngược về nguyên văn hoặc mã nguồn dưới đây, tránh thuật lại theo ấn tượng:

- **Tài liệu chính thức Claude Code · Memory**: ngữ cảnh hoàn toàn mới ở mỗi phiên, bốn phạm vi CLAUDE.md, tải theo nhu cầu ở thư mục con, auto memory (200 dòng / 25KB), `/init` tạo CLAUDE.md.<br/>https://code.claude.com/docs/en/memory
- **Tài liệu chính thức Claude Code · Skills / MCP / Hooks / Sub-agents**: định nghĩa bốn cơ chế mở rộng và các sự kiện (PreToolUse / PostToolUse / Stop).<br/>https://code.claude.com/docs/en/skills ｜ https://code.claude.com/docs/en/mcp ｜ https://code.claude.com/docs/en/hooks ｜ https://code.claude.com/docs/en/sub-agents
- **VILA Lab “Dive into Claude Code”** (báo cáo phân tích cấp mã nguồn): pipeline nén năm tầng, bảy chế độ quyền hạn + bộ phân loại ML, agent con sidechain, lưu trữ phiên nối thêm history.jsonl.<br/>https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf
- **Anthropic “Effective harnesses for long-running agents”**: nguồn của các quan điểm “độ tin cậy đến từ harness chứ không phải mô hình”, agent tự tin ca ngợi công việc của mình và dùng hook để xác minh.<br/>https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- **Hướng dẫn Claude Code Full Stack** (cộng đồng, phân tầng CLAUDE.md / Skills / MCP / Subagents / Hooks): tài liệu đọc thêm về phân tách trách nhiệm giữa các cơ chế mở rộng.<br/>https://jsmanifest.com/claude-code-full-stack-guide

Giáo trình liên quan: [Bài 3 · Biến repository thành nguồn sự thật duy nhất](../../lectures/lecture-03-why-the-repository-must-become-the-system-of-record/) ｜ [Bài 9 · Ngăn agent tuyên bố hoàn thành quá sớm](../../lectures/lecture-09-why-agents-declare-victory-too-early/) ｜ [Bài 10 · Chỉ chạy thông toàn bộ quy trình mới là xác minh thực sự](../../lectures/lecture-10-why-end-to-end-testing-changes-results/)
