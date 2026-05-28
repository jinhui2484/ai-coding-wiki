import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(defineConfig({
  lang: 'zh-CN',
  title: 'AI 工具知识库',
  description: '从工具到原理，系统梳理 AI 编程的核心知识体系',
  base: '/ai-coding-wiki/',
  lastUpdated: true,

  appearance: false,

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'AI 工具知识库',

    nav: [
      { text: '首页', link: '/' },
      {
        text: 'Wyze Skills',
        items: [
          { text: '架构总览', link: '/wyze-plugin-skills/project-structure.html' },
          { text: '流程图', link: '/wyze-plugin-skills/orchestration-flowchart.html' },
        ]
      },
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
              { text: '8 种记忆策略', link: '/core/agent/agent-memory' },
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
               { text: '技术内容平台', link: '/advanced/insights/tech-platforms' },
               { text: 'ai-coding-ok 项目分析', link: '/advanced/insights/ai-coding-ok-analysis' },
               { text: 'Codex × DeepSeek Installer 分析', link: '/advanced/insights/codex-deepseek-analysis' },
              ]
            },
            {
              text: 'AI 成长',
              items: [
                { text: 'AI 成长复盘 2026-05-18', link: '/advanced/growth/ai-growth-2026-05-18' },
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
          { text: '8 种记忆策略', link: '/core/agent/agent-memory' },
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
             { text: '技术内容平台', link: '/advanced/insights/tech-platforms' },
             { text: 'ai-coding-ok 项目分析', link: '/advanced/insights/ai-coding-ok-analysis' },
             { text: 'Codex × DeepSeek Installer 分析', link: '/advanced/insights/codex-deepseek-analysis' },
        ]
      },
      {
        text: 'AI 成长',
        collapsed: true,
        items: [
             { text: 'AI 成长复盘 2026-05-18', link: '/advanced/growth/ai-growth-2026-05-18' },
        ]
      },
    ],

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/jinhui2484/ai-coding-wiki'
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
