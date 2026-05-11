# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 部署指令

当用户说"预览"、"本地预览"、"看看效果"时，执行：

```bash
open http://localhost:5173
```

若端口无响应，先执行 `npm run dev` 启动开发服务器，再打开链接。

当用户说"部署"、"发布"、"推到远程"、"上线"、"推远程"时，依次执行：

1. 若有未提交改动，先提交（commit message 根据改动内容自动生成，格式 `docs: <描述>`）
2. `git push origin main`
3. `npm run build`
4. `npx netlify deploy --prod --dir=.vitepress/dist --message "$(git log -1 --pretty='%h %s')"`

全部成功后报告 Netlify 生产地址。

## Commands

```bash
npm run dev        # 启动开发服务器（localhost:5173，热更新）
npm run build      # 构建静态文件 → .vitepress/dist/
npm run preview    # 本地预览构建产物
```

部署到 Netlify（已链接 `jh-claude-docs` 项目）：

```bash
npm run build
npx netlify deploy --prod --dir=.vitepress/dist
```

推送到 Gitee（remote 已配置 HTTPS + macOS Keychain 凭证）：

```bash
git push origin main
```

## 架构

**VitePress** 静态站点生成器，内容全部为 Markdown，配合 `vitepress-plugin-mermaid` 支持 Mermaid 图表。

### 配置入口

`.vitepress/config.ts` — 所有导航（`nav`）和侧边栏（`sidebar`）都在这里维护：
- `nav`：顶部导航，Claude Code 为下拉组，Skill 工作流为独立链接
- `sidebar`：按路径前缀分区（`/guide/`、`/agent/`、`/skills/`），各区独立侧边栏

### 主题

`.vitepress/theme/style.css` — 品牌色（暖橙 `#d97757`）、深色模式背景（`#09090b`）、侧边栏分组标题 uppercase 样式。`.vitepress/theme/index.ts` 仅注册自定义 404 页面和 style.css。

### 内容目录

| 路径 | 内容 |
|------|------|
| `index.md` | 首页（VitePress `layout: home`，含自定义卡片 CSS） |
| `claude/` | Claude Code CLI 文档（命令手册 + Agent 开发系列） |
| `copilot/` | GitHub Copilot CLI 文档 |
| `skills/` | Skill 工作流全景手册 |

### 新增文章流程

1. 在对应目录新建 `.md` 文件
2. 在 `config.ts` 的 `nav`（如需）和 `sidebar` 对应路径块中添加 `{ text, link }` 条目
3. `npm run build` 验证无报错后推送

### 部署

- **Netlify**：`jh-claude-docs` 项目，生产地址 `https://jh-claude-docs.netlify.app`；`.netlify/` 目录已在 `.gitignore` 中
- **Gitee**：`https://gitee.com/jinhuizhang/claude-docs`，remote 使用 HTTPS，凭证存于 macOS Keychain
