# AI 工具知识库

从工具到原理，系统梳理 AI 编程的核心知识体系。

**线上地址：** [https://jinhui324.github.io/claude-docs/](https://jinhui324.github.io/claude-docs/)

**源码仓库：**
- GitHub：[https://github.com/Jinhui324/claude-docs](https://github.com/Jinhui324/claude-docs)
- Gitee：[https://gitee.com/jinhuizhang/claude-docs](https://gitee.com/jinhuizhang/claude-docs)

---

## 内容板块

| 板块 | 路径 | 内容 |
|------|------|------|
| 🛠️ AI 工具 | `tools/` | Cursor、GitHub Copilot、Claude Code、Codex CLI 介绍 + 四工具命令对照表 |
| 🧩 AI 核心机制 | `core/` | Agent、MCP、LSP、Skills、Prompt、RAG、Function Calling、Embedding |
| 📚 AI 进阶 | `advanced/` | 本地模型部署、模型微调、行业动态、精选文章 |

---

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器（localhost:5173，热更新）
npm run dev

# 构建静态文件
npm run build
```

---

## 新增文章

1. 在对应目录下新建 `.md` 文件
2. 在 `.vitepress/config.ts` 的 `nav` 和 `sidebar` 中添加条目
3. 同步更新 `index.md` 首页知识目录树
4. `npm run build` 验证无报错后推送

---

## 部署

推送 `main` 分支即自动部署：

```bash
# 部署到 GitHub Pages（自动触发 GitHub Actions）
git push github main

# 同步代码到 Gitee
git push origin main
```

---

## 目录结构

```
claude-docs/
├── .vitepress/
│   ├── config.ts              # 站点配置（导航、侧边栏）
│   └── theme/
│       ├── index.ts           # 主题入口
│       └── style.css          # 自定义样式（青色品牌色）
├── tools/                     # 🛠️ AI 工具
│   ├── commands.md            # 四工具命令对照表
│   ├── cursor/intro.md        # Cursor 使用指南
│   ├── claude/intro.md        # Claude Code 介绍
│   ├── copilot/intro.md       # GitHub Copilot 介绍
│   └── codex/intro.md         # Codex CLI 介绍
├── core/                      # 🧩 AI 核心机制
│   ├── agent/                 # Agent（概念、实战、多 Agent 协作）
│   ├── mcp/                   # MCP（详解 + Awesome Servers）
│   ├── skills/                # Skills（工作流 + Matt Pocock）
│   ├── lsp.md                 # LSP 详解
│   ├── prompt.md              # Prompt 实战
│   ├── rag.md                 # RAG 检索增强
│   ├── function-calling.md    # Function Calling
│   └── embedding.md           # Embedding
├── advanced/                  # 📚 AI 进阶
│   ├── lab/                   # 实验室（本地部署、模型微调）
│   └── insights/              # 洞察（行业动态、精选文章）
└── index.md                   # 首页
```

---

## 技术栈

- [VitePress](https://vitepress.dev) — 静态站点生成器
- [vitepress-plugin-mermaid](https://github.com/emersonbottero/vitepress-plugin-mermaid) — Mermaid 图表支持
- [GitHub Pages](https://pages.github.com) — 托管部署
