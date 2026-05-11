# AI 工具知识库

覆盖 Claude Code、GitHub Copilot CLI、Skill 工作流的实用知识库，持续更新。

**线上地址：** [https://jinhui324.github.io/claude-docs/](https://jinhui324.github.io/claude-docs/)

**源码仓库：**
- GitHub：[https://github.com/Jinhui324/claude-docs](https://github.com/Jinhui324/claude-docs)
- Gitee：[https://gitee.com/jinhuizhang/claude-docs](https://gitee.com/jinhuizhang/claude-docs)

---

## 内容模块

| 模块 | 路径 | 内容 |
|------|------|------|
| Claude Code | `claude/` | 命令手册（80+ 条命令）、Agent 入门、创建 Agent、多 Agent 协调 |
| Copilot CLI | `copilot/` | 全部斜杠命令 + 快捷键，涵盖会话、Agent、代码操作、权限管理 |
| Skill 工作流 | `skills/` | 18 个本地 Skill + 21 个 gstack Skill，覆盖开发全流程 |

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
3. `npm run build` 验证无报错后推送

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
│   ├── config.ts          # 站点配置（导航、侧边栏）
│   └── theme/
│       ├── index.ts       # 主题入口
│       └── style.css      # 自定义样式（暖橙品牌色）
├── claude/
│   ├── commands.md        # Claude Code 命令手册
│   ├── agent-intro.md     # Agent 入门
│   ├── agent-create.md    # 创建 Agent
│   └── multi-agent.md     # 多 Agent 协调
├── copilot/
│   └── commands.md        # Copilot CLI 命令手册
├── skills/
│   └── index.md           # Skill 全景手册
└── index.md               # 首页
```

---

## 技术栈

- [VitePress](https://vitepress.dev) — 静态站点生成器
- [vitepress-plugin-mermaid](https://github.com/emersonbottero/vitepress-plugin-mermaid) — Mermaid 图表支持
- [GitHub Pages](https://pages.github.com) — 托管部署
