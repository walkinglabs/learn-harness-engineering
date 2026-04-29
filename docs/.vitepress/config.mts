/// <reference types="node" />
import { defineConfig } from "vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";

const docsBase = "/learn-harness-engineering/";
const brandLogo = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23D95C41" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="12.1" y1="11.9" x2="18.9" y2="8.2" /><line x1="12.1" y1="12.1" x2="20.3" y2="12.9" /><line x1="12.2" y1="12.4" x2="16.6" y2="19.1" /><line x1="11.8" y1="12.4" x2="7.3" y2="19.2" /><line x1="11.9" y1="12.1" x2="3.7" y2="13.3" /><line x1="11.8" y1="11.7" x2="7.8" y2="4.4" /></svg>';
const githubRepoTreeLink = "https://github.com/walkinglabs/learn-harness-engineering/tree/main";

const zhLectureItems = [
  { text: "欢迎", link: "/zh/" },
  { text: "模型能力强，不等于执行可靠", link: "/zh/lectures/lecture-01-why-capable-agents-still-fail/" },
  { text: "Harness 的定义", link: "/zh/lectures/lecture-02-what-a-harness-actually-is/" },
  { text: "让代码仓库成为唯一的事实来源", link: "/zh/lectures/lecture-03-why-the-repository-must-become-the-system-of-record/" },
  { text: "把指令拆分到不同文件里", link: "/zh/lectures/lecture-04-why-one-giant-instruction-file-fails/" },
  { text: "让跨会话的任务保持上下文连续", link: "/zh/lectures/lecture-05-why-long-running-tasks-lose-continuity/" },
  { text: "让 agent 每次工作前先初始化", link: "/zh/lectures/lecture-06-why-initialization-needs-its-own-phase/" },
  { text: "给 agent 划清每次任务的边界", link: "/zh/lectures/lecture-07-why-agents-overreach-and-under-finish/" },
  { text: "用功能清单约束 agent 该做什么", link: "/zh/lectures/lecture-08-why-feature-lists-are-harness-primitives/" },
  { text: "防止 agent 提前宣告完成", link: "/zh/lectures/lecture-09-why-agents-declare-victory-too-early/" },
  { text: "跑通完整流程才算真正验证", link: "/zh/lectures/lecture-10-why-end-to-end-testing-changes-results/" },
  { text: "让 agent 的运行过程可观测", link: "/zh/lectures/lecture-11-why-observability-belongs-inside-the-harness/" },
  { text: "每次会话结束前都做好交接", link: "/zh/lectures/lecture-12-why-every-session-must-leave-a-clean-state/" }
];

const zhProjectItems = [
  { text: "欢迎", link: "/zh/projects/" },
  { text: "提示词驱动 vs 规则驱动", link: "/zh/projects/project-01-baseline-vs-minimal-harness/" },
  { text: "让项目可读并接住上次工作", link: "/zh/projects/project-02-agent-readable-workspace/" },
  { text: "跨会话工作连续性", link: "/zh/projects/project-03-multi-session-continuity/" },
  { text: "运行反馈与行为修正", link: "/zh/projects/project-04-incremental-indexing/" },
  { text: "工作评审与自我验证", link: "/zh/projects/project-05-grounded-qa-verification/" },
  { text: "综合 Agent 工作环境", link: "/zh/projects/project-06-runtime-observability-and-debugging/" }
];

const zhResourceItems = [
  { text: "资料库总览", link: "/zh/resources/" },
  { text: "中文模板", link: "/zh/resources/templates/" },
  { text: "中文参考", link: "/zh/resources/reference/" },
  { text: "高级资源包", link: "/zh/resources/openai-advanced/" }
];

const zhSkillItems = [
  { text: "技能总览", link: "/zh/skills/" }
];

const enLectureItems = [
  { text: "Welcome", link: "/en/" },
  { text: "Why Capable Agents Still Fail", link: "/en/lectures/lecture-01-why-capable-agents-still-fail/" },
  { text: "What a Harness Actually Is", link: "/en/lectures/lecture-02-what-a-harness-actually-is/" },
  { text: "Why the Repository Must Become the System of Record", link: "/en/lectures/lecture-03-why-the-repository-must-become-the-system-of-record/" },
  { text: "Why One Giant Instruction File Fails", link: "/en/lectures/lecture-04-why-one-giant-instruction-file-fails/" },
  { text: "Why Long-Running Tasks Lose Continuity", link: "/en/lectures/lecture-05-why-long-running-tasks-lose-continuity/" },
  { text: "Why Initialization Needs Its Own Phase", link: "/en/lectures/lecture-06-why-initialization-needs-its-own-phase/" },
  { text: "Why Agents Overreach and Under-Finish", link: "/en/lectures/lecture-07-why-agents-overreach-and-under-finish/" },
  { text: "Why Feature Lists Are Harness Primitives", link: "/en/lectures/lecture-08-why-feature-lists-are-harness-primitives/" },
  { text: "Why Agents Declare Victory Too Early", link: "/en/lectures/lecture-09-why-agents-declare-victory-too-early/" },
  { text: "Why End-to-End Testing Changes Results", link: "/en/lectures/lecture-10-why-end-to-end-testing-changes-results/" },
  { text: "Why Observability Belongs Inside the Harness", link: "/en/lectures/lecture-11-why-observability-belongs-inside-the-harness/" },
  { text: "Why Every Session Must Leave a Clean State", link: "/en/lectures/lecture-12-why-every-session-must-leave-a-clean-state/" }
];

const enProjectItems = [
  { text: "Welcome", link: "/en/projects/" },
  { text: "Prompt-Only vs. Rules-First", link: "/en/projects/project-01-baseline-vs-minimal-harness/" },
  { text: "Agent-Readable Workspace", link: "/en/projects/project-02-agent-readable-workspace/" },
  { text: "Multi-Session Continuity", link: "/en/projects/project-03-multi-session-continuity/" },
  { text: "Runtime Feedback and Scope Control", link: "/en/projects/project-04-incremental-indexing/" },
  { text: "Self-Verification and Role Separation", link: "/en/projects/project-05-grounded-qa-verification/" },
  { text: "Complete Harness (Capstone)", link: "/en/projects/project-06-runtime-observability-and-debugging/" }
];

const enResourceItems = [
  { text: "Overview", link: "/en/resources/" },
  { text: "English Templates", link: "/en/resources/templates/" },
  { text: "English Reference", link: "/en/resources/reference/" },
  { text: "Advanced Pack", link: "/en/resources/openai-advanced/" }
];

const enSkillItems = [
  { text: "Skills Overview", link: "/en/skills/" }
];

const viLectureItems = [
  { text: "Chào mừng", link: "/vi/" },
  { text: "Tại sao các Agent mạnh vẫn thất bại", link: "/vi/lectures/lecture-01-why-capable-agents-still-fail/" },
  { text: "Harness thực sự là gì", link: "/vi/lectures/lecture-02-what-a-harness-actually-is/" },
  { text: "Tại sao Repository phải trở thành Nguồn sự thật", link: "/vi/lectures/lecture-03-why-the-repository-must-become-the-system-of-record/" },
  { text: "Tại sao một file hướng dẫn khổng lồ lại thất bại", link: "/vi/lectures/lecture-04-why-one-giant-instruction-file-fails/" },
  { text: "Tại sao các tác vụ dài hạn lại mất tính liên tục", link: "/vi/lectures/lecture-05-why-long-running-tasks-lose-continuity/" },
  { text: "Tại sao quá trình khởi tạo cần một giai đoạn riêng", link: "/vi/lectures/lecture-06-why-initialization-needs-its-own-phase/" },
  { text: "Tại sao Agent làm quá giới hạn và chưa hoàn thành", link: "/vi/lectures/lecture-07-why-agents-overreach-and-under-finish/" },
  { text: "Tại sao Feature List là nguyên lý cốt lõi của Harness", link: "/vi/lectures/lecture-08-why-feature-lists-are-harness-primitives/" },
  { text: "Tại sao Agent tuyên bố thành công quá sớm", link: "/vi/lectures/lecture-09-why-agents-declare-victory-too-early/" },
  { text: "Tại sao kiểm thử End-to-End thay đổi kết quả", link: "/vi/lectures/lecture-10-why-end-to-end-testing-changes-results/" },
  { text: "Tại sao tính quan sát thuộc về bên trong Harness", link: "/vi/lectures/lecture-11-why-observability-belongs-inside-the-harness/" },
  { text: "Tại sao mỗi phiên làm việc phải để lại trạng thái sạch", link: "/vi/lectures/lecture-12-why-every-session-must-leave-a-clean-state/" }
];

const viProjectItems = [
  { text: "Chào mừng", link: "/vi/projects/" },
  { text: "Chỉ Prompt vs. Ưu tiên Quy tắc", link: "/vi/projects/project-01-baseline-vs-minimal-harness/" },
  { text: "Không gian làm việc Agent đọc được", link: "/vi/projects/project-02-agent-readable-workspace/" },
  { text: "Tính liên tục đa phiên", link: "/vi/projects/project-03-multi-session-continuity/" },
  { text: "Phản hồi Runtime và Kiểm soát Phạm vi", link: "/vi/projects/project-04-incremental-indexing/" },
  { text: "Tự xác minh và Phân tách Vai trò", link: "/vi/projects/project-05-grounded-qa-verification/" },
  { text: "Harness Hoàn chỉnh", link: "/vi/projects/project-06-runtime-observability-and-debugging/" }
];

const viResourceItems = [
  { text: "Tổng quan", link: "/vi/resources/" },
  { text: "Mẫu tiếng Anh", link: "/vi/resources/templates/" },
  { text: "Tài liệu tham khảo tiếng Anh", link: "/vi/resources/reference/" },
  { text: "Gói Nâng cao", link: "/vi/resources/openai-advanced/" }
];

const viSkillItems = [
  { text: "Tổng quan về Kỹ năng", link: "/vi/skills/" }
const ruLectureItems = [
  { text: "Добро пожаловать", link: "/ru/" },
  { text: "Сильная модель ≠ надёжное исполнение", link: "/ru/lectures/lecture-01-why-capable-agents-still-fail/" },
  { text: "Что такое harness на самом деле", link: "/ru/lectures/lecture-02-what-a-harness-actually-is/" },
  { text: "Репозиторий как единый источник правды", link: "/ru/lectures/lecture-03-why-the-repository-must-become-the-system-of-record/" },
  { text: "Почему один большой файл инструкций не работает", link: "/ru/lectures/lecture-04-why-one-giant-instruction-file-fails/" },
  { text: "Как сохранять контекст между сессиями", link: "/ru/lectures/lecture-05-why-long-running-tasks-lose-continuity/" },
  { text: "Зачем инициализация — отдельная фаза", link: "/ru/lectures/lecture-06-why-initialization-needs-its-own-phase/" },
  { text: "Почему агенты делают слишком много или слишком мало", link: "/ru/lectures/lecture-07-why-agents-overreach-and-under-finish/" },
  { text: "Списки фич как примитивы harness", link: "/ru/lectures/lecture-08-why-feature-lists-are-harness-primitives/" },
  { text: "Почему агенты слишком рано объявляют успех", link: "/ru/lectures/lecture-09-why-agents-declare-victory-too-early/" },
  { text: "Только сквозной прогон — настоящая проверка", link: "/ru/lectures/lecture-10-why-end-to-end-testing-changes-results/" },
  { text: "Наблюдаемость — часть harness", link: "/ru/lectures/lecture-11-why-observability-belongs-inside-the-harness/" },
  { text: "Каждая сессия должна оставлять чистое состояние", link: "/ru/lectures/lecture-12-why-every-session-must-leave-a-clean-state/" }
];

const ruProjectItems = [
  { text: "Добро пожаловать", link: "/ru/projects/" },
  { text: "Только промпты vs правила", link: "/ru/projects/project-01-baseline-vs-minimal-harness/" },
  { text: "Рабочее пространство для агента", link: "/ru/projects/project-02-agent-readable-workspace/" },
  { text: "Непрерывность между сессиями", link: "/ru/projects/project-03-multi-session-continuity/" },
  { text: "Обратная связь и контроль скоупа", link: "/ru/projects/project-04-incremental-indexing/" },
  { text: "Самопроверка и обоснованные ответы", link: "/ru/projects/project-05-grounded-qa-verification/" },
  { text: "Полный harness (капстоун)", link: "/ru/projects/project-06-runtime-observability-and-debugging/" }
];

const ruResourceItems = [
  { text: "Обзор", link: "/ru/resources/" },
  { text: "Шаблоны", link: "/ru/resources/templates/" },
  { text: "Справочник", link: "/ru/resources/reference/" },
  { text: "Расширенный пакет", link: "/ru/resources/openai-advanced/" }
];

const ruSkillItems = [
  { text: "Обзор скиллов", link: "/ru/skills/" }
];

export default withMermaid(
  defineConfig({
    base: docsBase,
    title: "Learn Harness Engineering",
    description:
      "A project-based course on designing the environments, state, verification, and control systems that make Codex and Claude Code reliable.",
    cleanUrls: true,
    srcExclude: ["temp/**"],
    ignoreDeadLinks: true,
    head: [
      ['link', { rel: 'icon', type: 'image/svg+xml', href: brandLogo }]
    ],
    themeConfig: {
      logo: brandLogo,
      search: {
        provider: "local"
      },
      socialLinks: [{ icon: "github", link: githubRepoTreeLink }]
    },
    markdown: {
      theme: {
        light: 'github-light',
        dark: 'github-dark'
      }
    },
    mermaid: {
      theme: 'base',
      themeVariables: {
        primaryColor: '#F4F3EE',
        primaryBorderColor: '#D1D1D1',
        primaryTextColor: '#1A1A1A',
        lineColor: '#B3B3B3',
        fontFamily: 'Inter, sans-serif',
        fontSize: '18px'
      },
      flowchart: {
        nodeSpacing: 40,
        rankSpacing: 56,
        padding: 12
      }
    },
    locales: {
      root: {
        label: "English",
        lang: "en",
        link: "/en/"
      },
      en: {
        label: "English",
        lang: "en",
        link: "/en/",
        themeConfig: {
          nav: [
            { text: "Lectures", link: enLectureItems[1].link, activeMatch: '^/en/(lectures/.*)?$' },
            { text: "Projects", link: enProjectItems[0].link, activeMatch: '^/en/projects/' },
            { text: "Library", link: "/en/resources/", activeMatch: '^/en/resources/' },
            { text: "Skills", link: "/en/skills/", activeMatch: '^/en/skills/' },
            { text: "Try Harness ↗", link: "https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/en/resources/templates/index.md", target: "_blank", rel: "noopener noreferrer" }
          ],
          sidebar: {
            '/en/projects/': [{ text: "Projects", items: enProjectItems }],
            '/en/resources/': [{ text: "Resource Library", items: enResourceItems }],
            '/en/skills/': [{ text: "Skills", items: enSkillItems }],
            '/en/': [{ text: "Lectures", items: enLectureItems }]
          },
          socialLinks: [{ icon: "github", link: githubRepoTreeLink }]
        }
      },
      zh: {
        label: "简体中文",
        lang: "zh-CN",
        link: "/zh/",
        themeConfig: {
          nav: [
            { text: "讲义", link: zhLectureItems[1].link, activeMatch: '^/zh/(lectures/.*)?$' },
            { text: "项目", link: zhProjectItems[0].link, activeMatch: '^/zh/projects/' },
            { text: "资料库", link: "/zh/resources/", activeMatch: '^/zh/resources/' },
            { text: "技能", link: "/zh/skills/", activeMatch: '^/zh/skills/' },
            { text: "Try Harness ↗", link: "https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/zh/resources/templates/index.md", target: "_blank", rel: "noopener noreferrer" }
          ],
          sidebar: {
            '/zh/projects/': [{ text: "项目", items: zhProjectItems }],
            '/zh/resources/': [{ text: "资料库", items: zhResourceItems }],
            '/zh/skills/': [{ text: "技能", items: zhSkillItems }],
            '/zh/': [{ text: "讲义", items: zhLectureItems }]
          },
          outline: {
            level: [2, 3]
          },
          docFooter: {
            prev: "上一篇",
            next: "下一篇"
          },
          lastUpdated: {
            text: "最后更新于"
          },
          returnToTopLabel: "回到顶部",
          sidebarMenuLabel: "菜单",
          darkModeSwitchLabel: "主题",
          lightModeSwitchTitle: "切换到浅色模式",
          darkModeSwitchTitle: "切换到深色模式",
          socialLinks: [{ icon: "github", link: githubRepoTreeLink }]
        }
      },
      vi: {
        label: "Tiếng Việt",
        lang: "vi-VN",
        link: "/vi/",
        themeConfig: {
          nav: [
            { text: "Bài giảng", link: viLectureItems[1].link, activeMatch: '^/vi/(lectures/.*)?$' },
            { text: "Dự án", link: viProjectItems[0].link, activeMatch: '^/vi/projects/' },
            { text: "Tài nguyên", link: "/vi/resources/", activeMatch: '^/vi/resources/' },
            { text: "Kỹ năng", link: "/vi/skills/", activeMatch: '^/vi/skills/' },
            { text: "Try Harness ↗", link: "https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/vi/resources/templates/index.md", target: "_blank", rel: "noopener noreferrer" }
          ],
          sidebar: {
            '/vi/projects/': [{ text: "Dự án", items: viProjectItems }],
            '/vi/resources/': [{ text: "Thư viện Tài nguyên", items: viResourceItems }],
            '/vi/skills/': [{ text: "Kỹ năng", items: viSkillItems }],
            '/vi/': [{ text: "Bài giảng", items: viLectureItems }]
          },
          outline: {
            level: [2, 3]
          },
          docFooter: {
            prev: "Trang trước",
            next: "Trang sau"
          },
          lastUpdated: {
            text: "Cập nhật lần cuối"
          },
          returnToTopLabel: "Trở lên trên cùng",
          sidebarMenuLabel: "Menu",
          darkModeSwitchLabel: "Giao diện",
          lightModeSwitchTitle: "Chuyển sang chế độ sáng",
          darkModeSwitchTitle: "Chuyển sang chế độ tối",
      ru: {
        label: "Русский",
        lang: "ru",
        link: "/ru/",
        themeConfig: {
          nav: [
            { text: "Лекции", link: ruLectureItems[1].link, activeMatch: '^/ru/(lectures/.*)?$' },
            { text: "Проекты", link: ruProjectItems[0].link, activeMatch: '^/ru/projects/' },
            { text: "Материалы", link: "/ru/resources/", activeMatch: '^/ru/resources/' },
            { text: "Скиллы", link: "/ru/skills/", activeMatch: '^/ru/skills/' },
            { text: "Try Harness ↗", link: "https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/ru/resources/templates/index.md", target: "_blank", rel: "noopener noreferrer" }
          ],
          sidebar: {
            '/ru/projects/': [{ text: "Проекты", items: ruProjectItems }],
            '/ru/resources/': [{ text: "Материалы", items: ruResourceItems }],
            '/ru/skills/': [{ text: "Скиллы", items: ruSkillItems }],
            '/ru/': [{ text: "Лекции", items: ruLectureItems }]
          },
          outline: {
            level: [2, 3],
            label: "На этой странице"
          },
          docFooter: {
            prev: "Предыдущая",
            next: "Следующая"
          },
          lastUpdated: {
            text: "Последнее обновление"
          },
          returnToTopLabel: "Наверх",
          sidebarMenuLabel: "Меню",
          darkModeSwitchLabel: "Тема",
          lightModeSwitchTitle: "Включить светлую тему",
          darkModeSwitchTitle: "Включить тёмную тему",
          socialLinks: [{ icon: "github", link: githubRepoTreeLink }]
        }
      }
    }
}));
