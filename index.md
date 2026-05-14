---
layout: home

hero:
  name: "AI 工具知识库"
  text: "个人实践手册"
  tagline: 从工具到原理，系统梳理 AI 编程的核心知识体系
---

<div class="home-content">

## 📖 关于本站

一个面向开发者的 **AI 编程知识库**——工具怎么用、机制怎么转、进阶怎么走，三条线贯穿。

当前覆盖三大板块：

| 角色 | 成员 | 职责 |
|:---:|------|------|
| 🛠️ | **AI 工具** | 军火库 — 五大主流 AI 编码工具总览与命令速查 |
| 🧩 | **AI 核心机制** | 技术中台 — Agent / MCP / LSP / Skills 底层原理与实战 |
| 📚 | **AI 进阶** | 图书馆员 — 模型实验、行业洞察、精选好文 |

所有内容均来自官方文档 + 个人实践，不搬运、不水字数。

---

## 知识目录

<div class="tree">

<details class="tree-node root" open>
<summary>
  <span class="node-icon">🛠️</span>
  <span class="node-title">AI 工具</span>
  <span class="node-badge">5 篇</span>
</summary>
<div class="tree-children">
  <a class="tree-leaf" href="./tools/commands">
    <span class="leaf-title">命令合集</span>
    <span class="leaf-desc">Claude Code / Copilot CLI / Codex CLI 命令、快捷键、配置对照表</span>
  </a>
  <a class="tree-leaf" href="./tools/cursor/intro">
    <span class="leaf-title">Cursor</span>
    <span class="leaf-desc">VS Code 魔改，AI 编辑器市场份额第一</span>
  </a>
  <a class="tree-leaf" href="./tools/copilot/intro">
    <span class="leaf-title">GitHub Copilot</span>
    <span class="leaf-desc">GitHub 出品，PR / Issue / Actions 原生集成</span>
  </a>
  <a class="tree-leaf" href="./tools/claude/intro">
    <span class="leaf-title">Claude Code</span>
    <span class="leaf-desc">Anthropic 出品，本地工程协作 + Skills + MCP 集成</span>
  </a>
  <a class="tree-leaf" href="./tools/codex/intro">
    <span class="leaf-title">Codex CLI</span>
    <span class="leaf-desc">OpenAI 出品，沙箱安全执行 + 三级审批</span>
  </a>
</div>
</details>

<details class="tree-node root" open>
<summary>
  <span class="node-icon">🧩</span>
  <span class="node-title">AI 核心机制</span>
  <span class="node-badge">12 篇</span>
</summary>
<div class="tree-children">
  <details class="tree-node sub">
  <summary><span class="node-title">Agent</span><span class="node-desc">🕵️ 特工 — AI 自主决策与任务执行的核心</span><span class="node-badge">3 篇</span></summary>
  <div class="tree-children">
    <a class="tree-leaf" href="./core/agent/agent-intro">
      <span class="leaf-title">Agent 概念与原理</span>
      <span class="leaf-desc">Tool Use、Agentic Loop、Subagent，从零理解 Agent 工作原理</span>
    </a>
    <a class="tree-leaf" href="./core/agent/agent-create">
      <span class="leaf-title">Agent 实战开发</span>
      <span class="leaf-desc">三条创建路径 + Claude Code vs Copilot CLI Agent 能力对比</span>
    </a>
    <a class="tree-leaf" href="./core/agent/multi-agent">
      <span class="leaf-title">多 Agent 协作</span>
      <span class="leaf-desc">五种协调模式，iOS / IoT 实战案例，编排最佳实践</span>
    </a>
  </div>
  </details>

  <details class="tree-node sub">
  <summary><span class="node-title">MCP</span><span class="node-desc">🌉 桥梁 — AI 与外部系统的标准通信协议</span><span class="node-badge">2 篇</span></summary>
  <div class="tree-children">
    <a class="tree-leaf" href="./core/mcp/">
      <span class="leaf-title">MCP 详解</span>
      <span class="leaf-desc">Model Context Protocol 架构、双端配置、实战接入与排障</span>
    </a>
    <a class="tree-leaf" href="./core/mcp/awesome-mcp-servers">
      <span class="leaf-title">Awesome MCP Servers</span>
      <span class="leaf-desc">2200+ 社区 MCP Server 分类速查与精选 TOP 20</span>
    </a>
  </div>
  </details>

  <details class="tree-node sub">
  <summary><span class="node-title">LSP</span><span class="node-desc">🔬 解码器 — 让 AI 深度理解代码语义与符号</span><span class="node-badge">1 篇</span></summary>
  <div class="tree-children">
    <a class="tree-leaf" href="./core/lsp">
      <span class="leaf-title">LSP 详解</span>
      <span class="leaf-desc">Language Server Protocol，11 种语言服务器配置与日常工作流</span>
    </a>
  </div>
  </details>

  <details class="tree-node sub">
  <summary><span class="node-title">Skills</span><span class="node-desc">🎯 教官 — 训练 AI 掌握专业工作流</span><span class="node-badge">2 篇</span></summary>
  <div class="tree-children">
    <a class="tree-leaf" href="./core/skills/">
      <span class="leaf-title">Skill 工作流</span>
      <span class="leaf-desc">18 个本地 Skill + 21 个 gstack Skill，覆盖开发全流程</span>
    </a>
    <a class="tree-leaf" href="./core/skills/mattpocock-skills">
      <span class="leaf-title">Matt Pocock Skills</span>
      <span class="leaf-desc">18 个实战工程 Skill，解决 AI 编程四大痛点</span>
    </a>
  </div>
  </details>

  <details class="tree-node sub">
  <summary><span class="node-title">Prompt</span><span class="node-desc">📝 话术师 — 用精准指令驱动 AI 输出</span><span class="node-badge">1 篇</span></summary>
  <div class="tree-children">
    <a class="tree-leaf" href="./core/prompt">
      <span class="leaf-title">Prompt 实战</span>
      <span class="leaf-desc">系统指令设计、Few-shot、Chain-of-Thought、格式控制</span>
    </a>
  </div>
  </details>

  <details class="tree-node sub">
  <summary><span class="node-title">RAG</span><span class="node-desc">📚 情报员 — 检索外部知识增强 AI 回答</span><span class="node-badge">1 篇</span></summary>
  <div class="tree-children">
    <a class="tree-leaf" href="./core/rag">
      <span class="leaf-title">RAG 检索增强</span>
      <span class="leaf-desc">向量数据库、Embedding、Chunking、检索 + 生成全链路</span>
    </a>
  </div>
  </details>

  <details class="tree-node sub">
  <summary><span class="node-title">Function Calling</span><span class="node-desc">🔌 接线员 — 模型调用外部函数的底层能力</span><span class="node-badge">1 篇</span></summary>
  <div class="tree-children">
    <a class="tree-leaf" href="./core/function-calling">
      <span class="leaf-title">Function Calling</span>
      <span class="leaf-desc">模型调用外部函数的底层机制，Agent 与 MCP 的基石</span>
    </a>
  </div>
  </details>

  <details class="tree-node sub">
  <summary><span class="node-title">Embedding</span><span class="node-desc">🧬 翻译官 — 将文本转为向量，实现语义理解</span><span class="node-badge">1 篇</span></summary>
  <div class="tree-children">
    <a class="tree-leaf" href="./core/embedding">
      <span class="leaf-title">Embedding</span>
      <span class="leaf-desc">文本向量化、语义搜索、代码搜索的核心技术</span>
    </a>
  </div>
  </details>
</div>
</details>

<details class="tree-node root" open>
<summary>
  <span class="node-icon">📚</span>
  <span class="node-title">AI 进阶</span>
  <span class="node-badge">4 篇</span>
</summary>
<div class="tree-children">
  <details class="tree-node sub">
  <summary><span class="node-title">AI 实验室</span><span class="node-desc">🧪 实验员 — 动手部署、微调、跑通全流程</span><span class="node-badge">2 篇</span></summary>
  <div class="tree-children">
    <a class="tree-leaf" href="./advanced/lab/local-deployment">
      <span class="leaf-title">本地模型部署</span>
      <span class="leaf-desc">Ollama / llama.cpp / vLLM 本地运行指南</span>
    </a>
    <a class="tree-leaf" href="./advanced/lab/fine-tuning">
      <span class="leaf-title">模型微调入门</span>
      <span class="leaf-desc">LoRA / QLoRA 微调流程、数据准备、训练实战</span>
    </a>
  </div>
  </details>

  <details class="tree-node sub">
  <summary><span class="node-title">AI 洞察</span><span class="node-desc">🔭 观察员 — 追踪行业趋势与优质内容</span><span class="node-badge">3 篇</span></summary>
  <div class="tree-children">
    <a class="tree-leaf" href="./advanced/insights/trends">
      <span class="leaf-title">行业动态</span>
      <span class="leaf-desc">AI 编程工具演进、重要发布、趋势观察</span>
    </a>
    <a class="tree-leaf" href="./advanced/insights/curated-articles">
      <span class="leaf-title">精选文章</span>
      <span class="leaf-desc">GitHub / 公众号 / 博客优质文章收藏与点评</span>
    </a>
    <a class="tree-leaf" href="./advanced/insights/tech-platforms">
      <span class="leaf-title">技术内容平台</span>
      <span class="leaf-desc">视频 / 文章 / 论文 / 播客平台全景对比与 MCP 抓取方案</span>
    </a>
  </div>
  </details>
</div>
</details>

<div class="tree-node-coming">
<details class="tree-node root" open>
<summary>
  <span class="node-icon">🚧</span>
  <span class="node-title">即将更新</span>
  <span class="node-badge soon">训练中</span>
</summary>
<div class="tree-children">
  <div class="tree-leaf disabled">
    <span class="leaf-title">Hooks 深度解析</span>
    <span class="leaf-desc">PreToolUse / PostToolUse / Stop 生命周期钩子</span>
  </div>
</div>
</details>
</div>

</div>

---


</div>

<style>
.VPHero {
  padding-bottom: 0 !important;
}

.home-content {
  max-width: 860px;
  margin: 0 auto;
  padding: 24px 24px 64px;
}

.home-content h2 {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 32px 0 16px;
  border-top: none !important;
  padding-top: 0 !important;
}

.home-content > p {
  color: #303133;
  line-height: 1.8;
  margin-bottom: 8px;
}

.home-content > ul {
  padding-left: 20px;
  margin-bottom: 16px;
}

.home-content > ul li {
  color: #303133;
  line-height: 1.8;
}

/* ===== Tree ===== */
.tree {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tree-node {
  border: 1px solid #e8ecf0;
  border-radius: 12px;
  overflow: hidden;
}

.tree-node.root {
  background: #fafbfc;
}

.tree-node.sub {
  border: 1px solid #eef1f5;
  border-radius: 8px;
  background: #fff;
}

.tree-node summary {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
  cursor: pointer;
  user-select: none;
  list-style: none;
  font-weight: 600;
  transition: background 0.15s;
}

.tree-node summary::-webkit-details-marker {
  display: none;
}

.tree-node summary::before {
  content: '▶';
  font-size: 0.65rem;
  color: #8a94a6;
  transition: transform 0.2s;
  flex-shrink: 0;
}

.tree-node[open] > summary::before {
  transform: rotate(90deg);
}

.tree-node.root > summary {
  font-size: 1.05rem;
}

.tree-node.sub > summary {
  font-size: 0.95rem;
  padding: 12px 16px;
}

.tree-node summary:hover {
  background: rgba(26, 160, 154, 0.04);
}

.node-icon {
  font-size: 1.3rem;
  line-height: 1;
}

.tree-node.sub .node-icon {
  font-size: 1.1rem;
}

.node-title {
  color: #1a1f36;
}

.node-desc {
  font-size: 0.78rem;
  font-weight: 400;
  color: #8a94a6;
  margin-left: 8px;
}

.node-badge {
  font-size: 0.7rem;
  font-weight: 500;
  padding: 2px 10px;
  border-radius: 20px;
  background: rgba(26, 160, 154, 0.1);
  color: #1aa09a;
  margin-left: auto;
}

.node-badge.soon {
  background: rgba(190, 64, 39, 0.08);
  color: #BE4027;
}

.tree-children {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0 12px 12px;
}

.tree-node.sub .tree-children {
  padding: 0 8px 8px;
}

/* ===== Leaf ===== */
.tree-leaf {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 8px;
  text-decoration: none !important;
  transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
  cursor: pointer;
  position: relative;
}

.tree-leaf::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 0;
  background: #1aa09a;
  border-radius: 2px;
  transition: height 0.2s;
}

.tree-leaf:hover {
  background: rgba(26, 160, 154, 0.06);
  transform: translateX(4px);
}

.tree-leaf:hover::before {
  height: 60%;
}

.tree-leaf.disabled {
  opacity: 0.5;
  cursor: default;
  pointer-events: none;
}

.leaf-icon {
  display: none;
}

.tree-leaf-group {
  font-size: 0.75rem;
  font-weight: 600;
  color: #8a94a6;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 10px 16px 2px;
  margin-top: 4px;
}

.leaf-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1a1f36;
  display: block;
  margin-bottom: 4px;
}

.leaf-desc {
  font-size: 0.82rem;
  color: #8a94a6;
  line-height: 1.5;
  display: block;
}

/* ===== Coming Soon ===== */
.tree-node-coming {
  opacity: 0.65;
}

/* ===== Sources ===== */
.home-content ul:last-child {
  list-style: none;
  padding: 0;
}

.home-content ul:last-child li {
  padding: 4px 0;
}

.home-content ul:last-child li::before {
  content: none;
}

/* ===== Responsive ===== */
@media (max-width: 640px) {
  .tree-node summary {
    padding: 12px 14px;
  }
  .tree-leaf {
    padding: 10px 12px;
  }
}
</style>
