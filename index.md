---
layout: home

hero:
  name: "AI 工具知识库"
  text: "个人实践手册"
  tagline: 覆盖 Claude Code、Skill 工作流、AI 编程工具的实用知识，持续更新中
---

<div class="home-modules">

## 知识模块

<div class="module-group">

### Claude Code

<div class="card-row">
  <a class="card" href="/claude/commands">
    <div class="card-icon">📋</div>
    <div class="card-body">
      <div class="card-title">完整命令手册</div>
      <div class="card-desc">14 大类、80+ 条命令，涵盖会话管理、模型控制、自动化工作流</div>
    </div>
  </a>
  <a class="card" href="/claude/agent-intro">
    <div class="card-icon">🤖</div>
    <div class="card-body">
      <div class="card-title">Agent 入门</div>
      <div class="card-desc">Tool Use、Agentic Loop、Subagent，从零理解 Agent 工作原理</div>
    </div>
  </a>
  <a class="card" href="/claude/agent-create">
    <div class="card-icon">🔧</div>
    <div class="card-body">
      <div class="card-title">创建 Agent</div>
      <div class="card-desc">三条路径：Subagent 配置文件、Agent SDK、Managed Agents</div>
    </div>
  </a>
  <a class="card" href="/claude/multi-agent">
    <div class="card-icon">🌐</div>
    <div class="card-body">
      <div class="card-title">多 Agent 协调</div>
      <div class="card-desc">五种协调模式，iOS 实战案例，Agent Team 完整字段说明</div>
    </div>
  </a>
</div>

</div>

<div class="module-group">

### Copilot CLI

<div class="card-row">
  <a class="card" href="/copilot/commands">
    <div class="card-icon">🚀</div>
    <div class="card-body">
      <div class="card-title">命令手册</div>
      <div class="card-desc">全部斜杠命令 + 快捷键，涵盖会话、Agent、代码操作、权限管理</div>
    </div>
  </a>
</div>

</div>

<div class="module-group">

### Skill 工作流

<div class="card-row">
  <a class="card" href="/skills/">
    <div class="card-icon">⚡</div>
    <div class="card-body">
      <div class="card-title">Skill 全景手册</div>
      <div class="card-desc">18 个本地 Skill + 21 个 gstack Skill，覆盖开发全流程，含触发词与实战示例</div>
    </div>
  </a>
</div>

</div>

<div class="module-group coming-soon">

### 即将更新

<div class="card-row">
  <div class="card disabled">
    <div class="card-icon">🪝</div>
    <div class="card-body">
      <div class="card-title">Hooks 深度解析 <span class="badge">即将更新</span></div>
      <div class="card-desc">PreToolUse / PostToolUse / Stop 生命周期钩子，拦截与日志实战</div>
    </div>
  </div>
  <div class="card disabled">
    <div class="card-icon">🔌</div>
    <div class="card-body">
      <div class="card-title">MCP 集成指南 <span class="badge">即将更新</span></div>
      <div class="card-desc">接入 Jira、Figma、Confluence 等 MCP 服务，扩展 Claude Code 能力边界</div>
    </div>
  </div>
  <div class="card disabled">
    <div class="card-icon">🖱️</div>
    <div class="card-body">
      <div class="card-title">Cursor 使用指南 <span class="badge">即将更新</span></div>
      <div class="card-desc">Rules 配置、Composer Agent 模式、与 Claude Code 的协作模式对比</div>
    </div>
  </div>
</div>

</div>

</div>

<div class="home-sources">

## 参考来源

- [Anthropic 官方文档 · Agents Overview](https://docs.anthropic.com/en/docs/agents-and-tools/agents-overview)
- [Claude Code · Sub-agents](https://code.claude.com/docs/en/sub-agents)
- [Claude Code · Agent SDK](https://code.claude.com/docs/en/agent-sdk/overview)
- [Anthropic Engineering · Building Effective Agents](https://www.anthropic.com/research/building-effective-agents)
- [gstack · Garry Tan's Claude Code skill pack](https://github.com/garrytan/gstack)

</div>

<style>
.home-modules {
  max-width: 1152px;
  margin: 0 auto;
  padding: 24px 24px 0;
}

.home-modules h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  border-top: none !important;
  padding-top: 0 !important;
}

.module-group {
  margin-bottom: 32px;
}

.module-group h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  margin-bottom: 16px;
  border-top: none !important;
  padding-top: 0 !important;
}

.card-row {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.card {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  text-decoration: none !important;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
  cursor: pointer;
}

.card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 16px rgba(217, 119, 87, 0.15);
  transform: translateY(-2px);
}

.card.disabled {
  opacity: 0.55;
  cursor: default;
  pointer-events: none;
}

.card-icon {
  font-size: 1.8rem;
  line-height: 1;
  flex-shrink: 0;
}

.card-body {
  min-width: 0;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.card-desc {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.badge {
  font-size: 0.7rem;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 20px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  white-space: nowrap;
}

.home-sources {
  max-width: 1152px;
  margin: 0 auto;
  padding: 0 24px 64px;
  border-top: 1px solid var(--vp-c-divider);
}

.home-sources h2 {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 32px 0 16px;
  border-top: none !important;
  padding-top: 0 !important;
}

.home-sources ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.home-sources ul li::before {
  content: none;
}

@media (max-width: 640px) {
  .card-row {
    grid-template-columns: 1fr;
  }
}
</style>
