import { defineConfig } from "vitepress";

const lectureItems = [
  { text: "Lecture 01", link: "/lectures/lecture-01-why-capable-agents-still-fail/" },
  { text: "Lecture 02", link: "/lectures/lecture-02-what-a-harness-actually-is/" },
  { text: "Lecture 03", link: "/lectures/lecture-03-why-the-repository-must-become-the-system-of-record/" },
  { text: "Lecture 04", link: "/lectures/lecture-04-why-one-giant-instruction-file-fails/" },
  { text: "Lecture 05", link: "/lectures/lecture-05-why-long-running-tasks-lose-continuity/" },
  { text: "Lecture 06", link: "/lectures/lecture-06-why-initialization-needs-its-own-phase/" },
  { text: "Lecture 07", link: "/lectures/lecture-07-why-agents-overreach-and-under-finish/" },
  { text: "Lecture 08", link: "/lectures/lecture-08-why-feature-lists-are-harness-primitives/" },
  { text: "Lecture 09", link: "/lectures/lecture-09-why-agents-declare-victory-too-early/" },
  { text: "Lecture 10", link: "/lectures/lecture-10-why-end-to-end-testing-changes-results/" },
  { text: "Lecture 11", link: "/lectures/lecture-11-why-observability-belongs-inside-the-harness/" },
  { text: "Lecture 12", link: "/lectures/lecture-12-why-every-session-must-leave-a-clean-state/" }
];

const projectItems = [
  { text: "Project 01", link: "/projects/project-01-baseline-vs-minimal-harness/" },
  { text: "Project 02", link: "/projects/project-02-agent-readable-workspace/" },
  { text: "Project 03", link: "/projects/project-03-multi-session-continuity/" },
  { text: "Project 04", link: "/projects/project-04-incremental-indexing/" },
  { text: "Project 05", link: "/projects/project-05-grounded-qa-verification/" },
  { text: "Project 06", link: "/projects/project-06-runtime-observability-and-debugging/" }
];

export default defineConfig({
  title: "Learn Harness Engineering",
  description:
    "A project-based course on designing the environments, state, verification, and control systems that make Codex and Claude Code reliable.",
  cleanUrls: true,
  srcExclude: ["temp/**"],
  themeConfig: {
    nav: [
      { text: "Course Home", link: "/" },
      { text: "Lectures", link: lectureItems[0].link },
      { text: "Projects", link: projectItems[0].link }
    ],
    search: {
      provider: "local"
    },
    sidebar: [
      {
        text: "Lectures",
        items: lectureItems
      },
      {
        text: "Projects",
        items: projectItems
      }
    ],
    outline: {
      level: [2, 3]
    },
    socialLinks: [{ icon: "github", link: "https://github.com/walkinglabs/learn-harness-engineering" }]
  }
});
