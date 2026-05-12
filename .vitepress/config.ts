import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(defineConfig({
  lang: 'zh-CN',
  title: 'AI 工具知识库',
  description: '从工具到原理，系统梳理 AI 编程的核心知识体系',
  base: '/claude-docs/',
  lastUpdated: true,

  appearance: false,

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'AI 工具知识库',

    nav: [
      { text: '首页', link: '/' },
      {
        text: 'AI 工具',
        activeMatch: '^/tools/',
        items: [
          { text: '命令合集', link: '/tools/commands' },
          { text: 'Cursor', link: '/tools/cursor/intro' },
          {
            text: 'GitHub Copilot',
            items: [
              { text: '简介', link: '/tools/copilot/intro' },
              { text: '自定义状态栏', link: '/tools/copilot/statusline-plugin' },
            ]
          },
          { text: 'Claude Code', link: '/tools/claude/intro' },
          { text: 'Codex CLI', link: '/tools/codex/intro' },
        ]
      },
      {
        text: 'AI 核心机制',
        activeMatch: '^/core/',
        items: [
          {
            text: 'Agent',
            items: [
              { text: 'Agent 概念与原理', link: '/core/agent/agent-intro' },
              { text: 'Agent 实战开发', link: '/core/agent/agent-create' },
              { text: '多 Agent 协作', link: '/core/agent/multi-agent' },
            ]
          },
          {
            text: 'MCP',
            items: [
              { text: 'MCP 详解', link: '/core/mcp/' },
              { text: 'Awesome MCP Servers', link: '/core/mcp/awesome-mcp-servers' },
            ]
          },
          {
            text: 'LSP',
            items: [
              { text: 'LSP 详解', link: '/core/lsp' },
            ]
          },
          {
            text: 'Skills',
            items: [
              { text: 'Skill 工作流', link: '/core/skills/' },
              { text: 'Skill 组合实战', link: '/core/skills/skill-combination' },
              { text: 'Matt Pocock Skills', link: '/core/skills/mattpocock-skills' },
            ]
          },
          {
            text: 'Prompt',
            items: [
              { text: 'Prompt 实战', link: '/core/prompt' },
            ]
          },
          {
            text: 'RAG',
            items: [
              { text: 'RAG 检索增强', link: '/core/rag' },
            ]
          },
          {
            text: 'Function Calling',
            items: [
              { text: 'Function Calling', link: '/core/function-calling' },
            ]
          },
          {
            text: 'Embedding',
            items: [
              { text: 'Embedding', link: '/core/embedding' },
            ]
          },
        ]
      },
      {
        text: 'AI 进阶',
        activeMatch: '^/advanced/',
        items: [
          {
            text: 'AI 实验室',
            items: [
              { text: '本地模型部署', link: '/advanced/lab/local-deployment' },
              { text: '模型微调入门', link: '/advanced/lab/fine-tuning' },
            ]
          },
          {
            text: 'AI 洞察',
            items: [
              { text: '行业动态', link: '/advanced/insights/trends' },
              { text: '精选文章', link: '/advanced/insights/curated-articles' },
            ]
          },
        ]
      },
    ],

    sidebar: [
      {
        text: 'AI 工具',
        collapsed: false,
        items: [
          { text: '命令合集', link: '/tools/commands' },
          { text: 'Cursor', link: '/tools/cursor/intro' },
          {
            text: 'GitHub Copilot',
            collapsed: true,
            items: [
              { text: '简介', link: '/tools/copilot/intro' },
              { text: '自定义状态栏', link: '/tools/copilot/statusline-plugin' },
            ]
          },
          { text: 'Claude Code', link: '/tools/claude/intro' },
          { text: 'Codex CLI', link: '/tools/codex/intro' },
        ]
      },
      {
        text: 'Agent',
        collapsed: false,
        items: [
          { text: 'Agent 概念与原理', link: '/core/agent/agent-intro' },
          { text: 'Agent 实战开发', link: '/core/agent/agent-create' },
          { text: '多 Agent 协作', link: '/core/agent/multi-agent' },
        ]
      },
      {
        text: 'MCP',
        collapsed: false,
        items: [
          { text: 'MCP 详解', link: '/core/mcp/' },
          { text: 'Awesome MCP Servers', link: '/core/mcp/awesome-mcp-servers' },
        ]
      },
      {
        text: 'LSP',
        collapsed: false,
        items: [
          { text: 'LSP 详解', link: '/core/lsp' },
        ]
      },
      {
        text: 'Skills',
        collapsed: false,
        items: [
          { text: 'Skill 工作流', link: '/core/skills/' },
          { text: 'Skill 组合实战', link: '/core/skills/skill-combination' },
          { text: 'Matt Pocock Skills', link: '/core/skills/mattpocock-skills' },
        ]
      },
      {
        text: 'Prompt',
        collapsed: false,
        items: [
          { text: 'Prompt 实战', link: '/core/prompt' },
        ]
      },
      {
        text: 'RAG',
        collapsed: false,
        items: [
          { text: 'RAG 检索增强', link: '/core/rag' },
        ]
      },
      {
        text: 'Function Calling',
        collapsed: false,
        items: [
          { text: 'Function Calling', link: '/core/function-calling' },
        ]
      },
      {
        text: 'Embedding',
        collapsed: false,
        items: [
          { text: 'Embedding', link: '/core/embedding' },
        ]
      },
      {
        text: 'AI 实验室',
        collapsed: true,
        items: [
          { text: '本地模型部署', link: '/advanced/lab/local-deployment' },
          { text: '模型微调入门', link: '/advanced/lab/fine-tuning' },
        ]
      },
      {
        text: 'AI 洞察',
        collapsed: true,
        items: [
          { text: '行业动态', link: '/advanced/insights/trends' },
          { text: '精选文章', link: '/advanced/insights/curated-articles' },
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
      copyright: '更新于 2026-05-11'
    },

    search: {
      provider: 'local'
    },

    outline: {
      label: '本页目录',
      level: 2
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
