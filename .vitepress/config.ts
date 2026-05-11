import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(defineConfig({
  lang: 'zh-CN',
  title: 'AI 工具知识库',
  description: '覆盖 Claude Code、Skill 工作流、AI 编程工具的实用知识库，持续更新',
  base: '/claude-docs/',
  lastUpdated: true,

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'AI 工具知识库',

    nav: [
      { text: '首页', link: '/' },
      {
        text: 'Claude Code',
        activeMatch: '^/claude/',
        items: [
          { text: '命令手册', link: '/claude/commands' },
          {
            text: 'Agent 开发',
            items: [
              { text: 'Agent 入门', link: '/claude/agent-intro' },
              { text: '创建 Agent', link: '/claude/agent-create' },
              { text: '多 Agent 协调', link: '/claude/multi-agent' },
            ]
          },
        ]
      },
      {
        text: 'Copilot CLI',
        activeMatch: '^/copilot/',
        items: [
          { text: '命令手册', link: '/copilot/commands' },
        ]
      },
      {
        text: 'AI 大合集',
        activeMatch: '^/skills/',
        items: [
          { text: 'Skill 工作流', link: '/skills/' },
        ]
      },
    ],

    sidebar: [
      {
        text: 'CLAUDE CODE',
        collapsed: false,
        items: [
          { text: '命令手册', link: '/claude/commands' },
        ]
      },
      {
        text: 'AGENT 开发',
        collapsed: false,
        items: [
          { text: 'Agent 入门', link: '/claude/agent-intro' },
          { text: '创建 Agent', link: '/claude/agent-create' },
          { text: '多 Agent 协调', link: '/claude/multi-agent' },
        ]
      },
      {
        text: 'COPILOT CLI',
        collapsed: false,
        items: [
          { text: '命令手册', link: '/copilot/commands' },
        ]
      },
      {
        text: 'AI 大合集',
        collapsed: false,
        items: [
          { text: 'Skill 工作流', link: '/skills/' },
        ]
      },
    ],

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/Jinhui324/claude-docs'
      },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path d="M512 1024C229.222 1024 0 794.778 0 512S229.222 0 512 0s512 229.222 512 512-229.222 512-512 512zm259.149-568.883h-290.74a25.293 25.293 0 0 0-25.292 25.293l-.026 63.206c0 13.952 11.315 25.293 25.267 25.293h177.024c13.978 0 25.293 11.315 25.293 25.267v12.646a75.853 75.853 0 0 1-75.853 75.853h-240.23a25.293 25.293 0 0 1-25.267-25.293V417.203a75.853 75.853 0 0 1 75.827-75.853h353.946a25.293 25.293 0 0 0 25.267-25.292l.077-63.207a25.293 25.293 0 0 0-25.268-25.293H417.152a189.62 189.62 0 0 0-189.62 189.645V771.15c0 13.977 11.316 25.293 25.294 25.293h372.94a170.65 170.65 0 0 0 170.65-170.65V480.384a25.293 25.293 0 0 0-25.293-25.267z" fill="currentColor"/></svg>'
        },
        link: 'https://gitee.com/jinhuizhang/claude-docs'
      }
    ],

    footer: {
      message: '个人 AI 工具知识库，持续更新',
      copyright: '更新于 2026-05-06'
    },

    search: {
      provider: 'local'
    },

    outline: {
      label: '本页目录',
      level: [2, 3]
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    lastUpdated: {
      text: '更新于'
    }
  },

  mermaid: {
    theme: 'neutral'
  }
}))
