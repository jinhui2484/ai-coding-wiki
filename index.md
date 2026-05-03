---
layout: home

hero:
  name: "Claude Code 知识库"
  text: "实用指南 · 从入门到精通"
  tagline: 基于 Anthropic 官方文档整理，覆盖 CLI 命令、Agent 开发、多智能体协调
  actions:
    - theme: brand
      text: CLI 命令手册
      link: /guide/commands
    - theme: alt
      text: Agent 入门
      link: /agent/intro

features:
  - icon: 📋
    title: CLI 完整命令手册
    details: 14 大类、80+ 条命令，涵盖会话管理、模型控制、自动化工作流、代码质量工具，附常用工作流组合。
    link: /guide/commands
    linkText: 查看手册

  - icon: 🤖
    title: Agent 入门指南
    details: 从"什么是 Agent"到 Tool Use、Agentic Loop，再到 Subagent 和 Agent SDK，完整的 Agent 开发入门路径。
    link: /agent/intro
    linkText: 开始学习

  - icon: 🔧
    title: 如何创建 Agent
    details: 详解 Agent 的四大组成（Model / Harness / Tools / Environment），三条创建路径：Subagent 配置文件、Agent SDK、Managed Agents。
    link: /agent/create
    linkText: 动手创建

  - icon: 🌐
    title: 多 Agent 协调
    details: 从单体 Agent 到 Subagent 再到 Agent Team，五种协调模式，iOS 实战案例，完整字段说明表，选择决策树。
    link: /agent/multi-agent
    linkText: 进阶掌握
---

## 文档来源

本知识库内容基于以下官方资料整理：

- [Anthropic 官方文档 · Agents Overview](https://docs.anthropic.com/en/docs/agents-and-tools/agents-overview)
- [Claude Code · Sub-agents](https://code.claude.com/docs/en/sub-agents)
- [Claude Code · Agent Teams](https://code.claude.com/docs/en/agent-teams)
- [Claude Code · Agent SDK](https://code.claude.com/docs/en/agent-sdk/overview)
- [Anthropic Engineering · Building Effective Agents](https://www.anthropic.com/research/building-effective-agents)
- [Anthropic Engineering · Multi-Agent Research System](https://www.anthropic.com/engineering/multi-agent-research-system)
- [Anthropic Engineering · Managed Agents](https://www.anthropic.com/engineering/managed-agents)
