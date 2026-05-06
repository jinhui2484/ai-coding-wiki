import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(defineConfig({
  lang: 'zh-CN',
  title: 'Claude Code 知识库',
  description: '基于 Anthropic 官方文档整理的 Claude Code 实用指南',
  lastUpdated: true,

  themeConfig: {
    logo: '🤖',
    siteTitle: 'Claude Code 知识库',

    nav: [
      { text: '首页', link: '/' },
      { text: 'Skill 手册', link: '/skills/' },
      {
        text: '知识模块',
        items: [
          { text: '完整命令手册', link: '/guide/commands' },
          {
            text: 'Agent 系列',
            items: [
              { text: 'Agent 入门', link: '/agent/intro' },
              { text: '创建 Agent', link: '/agent/create' },
              { text: '多 Agent 协调', link: '/agent/multi-agent' },
            ]
          },
        ]
      }
    ],

    sidebar: [
      {
        text: 'Skill 体系',
        items: [
          { text: 'Skill 全景手册', link: '/skills/' },
        ]
      },
      {
        text: 'Claude Code CLI',
        items: [
          { text: '完整命令手册', link: '/guide/commands' }
        ]
      },
      {
        text: 'Agent 系列',
        items: [
          { text: 'Agent 入门指南', link: '/agent/intro' },
          { text: '如何创建 Agent', link: '/agent/create' },
          { text: '多 Agent 协调', link: '/agent/multi-agent' },
        ]
      }
    ],

    socialLinks: [
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path d="M512 1024C229.222 1024 0 794.778 0 512S229.222 0 512 0s512 229.222 512 512-229.222 512-512 512zm259.149-568.883h-290.74a25.293 25.293 0 0 0-25.292 25.293l-.026 63.206c0 13.952 11.315 25.293 25.267 25.293h177.024c13.978 0 25.293 11.315 25.293 25.267v12.646a75.853 75.853 0 0 1-75.853 75.853h-240.23a25.293 25.293 0 0 1-25.267-25.293V417.203a75.853 75.853 0 0 1 75.827-75.853h353.946a25.293 25.293 0 0 0 25.267-25.292l.077-63.207a25.293 25.293 0 0 0-25.268-25.293H417.152a189.62 189.62 0 0 0-189.62 189.645V771.15c0 13.977 11.316 25.293 25.294 25.293h372.94a170.65 170.65 0 0 0 170.65-170.65V480.384a25.293 25.293 0 0 0-25.293-25.267z" fill="currentColor"/></svg>'
        },
        link: 'https://gitee.com/jinhuizhang/claude-docs'
      }
    ],

    footer: {
      message: '基于 Anthropic 官方文档整理',
      copyright: '更新于 2026-05-03'
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
