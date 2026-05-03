import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'Claude Code 知识库',
  description: '基于 Anthropic 官方文档整理的 Claude Code 实用指南',
  lastUpdated: true,

  themeConfig: {
    logo: '🤖',
    siteTitle: 'Claude Code 知识库',

    nav: [
      { text: '首页', link: '/' },
      { text: 'CLI 指南', link: '/guide/commands' },
      {
        text: 'Agent 系列',
        items: [
          { text: 'Agent 入门', link: '/agent/intro' },
          { text: '创建 Agent', link: '/agent/create' },
          { text: '多 Agent 协调', link: '/agent/multi-agent' },
        ]
      }
    ],

    sidebar: [
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
      { icon: 'github', link: 'https://gitee.com/jinhuizhang' }
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
  }
})
