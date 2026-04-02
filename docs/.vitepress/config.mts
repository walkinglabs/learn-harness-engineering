/// <reference types="node" />
import { defineConfig } from "vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";

const docsBase = process.env.DOCS_BASE_PATH ?? "/";

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
  { text: "高级资源包", link: "/zh/resources/openai-advanced/" },
  { text: "English Templates", link: "/en/resources/templates/" },
  { text: "English Reference", link: "/en/resources/reference/" }
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
  { text: "Advanced Pack", link: "/en/resources/openai-advanced/" },
  { text: "中文模板", link: "/zh/resources/templates/" },
  { text: "中文参考", link: "/zh/resources/reference/" }
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
    themeConfig: {
      logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23D95C41"><path d="M12 2L13.4 8.6L20 10L13.4 11.4L12 18L10.6 11.4L4 10L10.6 8.6L12 2Z"/></svg>',
      search: {
        provider: "local"
      },
      socialLinks: [{ icon: "github", link: "https://github.com/walkinglabs/learn-harness-engineering" }]
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
        fontFamily: 'Inter, sans-serif'
      }
    },
    locales: {
      root: {
        label: "English",
        lang: "en",
        themeConfig: {
          nav: [
            { text: "Lectures", link: enLectureItems[1].link, activeMatch: '^/en/(lectures/.*)?$' },
            { text: "Projects", link: enProjectItems[0].link, activeMatch: '^/en/projects/' },
            { text: "Library", link: "/en/resources/", activeMatch: '^/en/resources/' },
            { text: "Try Harness ↗", link: "https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/en/resources/templates/index.md", target: "_blank", rel: "noopener noreferrer" }
          ],
          sidebar: {
            '/en/projects/': [
              { text: "Projects", items: enProjectItems }
            ],
            '/en/resources/': [
              { text: "Resource Library", items: enResourceItems }
            ],
            '/en/': [
              { text: "Lectures", items: enLectureItems }
            ]
          },
          socialLinks: [{ icon: "github", link: "https://github.com/walkinglabs/learn-harness-engineering" }]
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
            { text: "Try Harness ↗", link: "https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/zh/resources/templates/index.md", target: "_blank", rel: "noopener noreferrer" }
          ],
        sidebar: {
          '/zh/projects/': [
            { text: "项目", items: zhProjectItems }
          ],
          '/zh/resources/': [
            { text: "资料库", items: zhResourceItems }
          ],
          '/zh/': [
            { text: "讲义", items: zhLectureItems }
          ]
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
        socialLinks: [{ icon: "github", link: "https://github.com/walkinglabs/learn-harness-engineering" }]
      }
    },
    en: {
      label: "English",
      lang: "en",
      link: "/en/"
    }
  }
}));
