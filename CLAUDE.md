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
2. `git push github main`（触发 GitHub Actions 自动部署到 GitHub Pages）
3. `git push origin main`（同步代码到 Gitee）

全部成功后报告 GitHub Pages 地址：`https://jinhui324.github.io/claude-docs/`

## Commands

```bash
npm run dev        # 启动开发服务器（localhost:5173，热更新）
npm run build      # 构建静态文件 → .vitepress/dist/
npm run preview    # 本地预览构建产物
```

## 架构

**VitePress** 静态站点生成器，内容全部为 Markdown，配合 `vitepress-plugin-mermaid` 支持 Mermaid 图表。

### 配置入口

`.vitepress/config.ts` — 所有导航（`nav`）和侧边栏（`sidebar`）都在这里维护：
- `nav`：三大顶级分组（AI 工具、AI 核心机制、AI 进阶），每组内用嵌套 `items` 实现子分组下拉
- `sidebar`：全局统一侧边栏，按内容分 10+ 个 group（AI 工具、Agent、MCP、LSP、Skills、Prompt、RAG、Function Calling、Embedding、AI 实验室、AI 洞察）

### 三大内容板块

| 板块 | 路径 | 内容 |
|------|------|------|
| 🛠️ AI 工具 | `cursor/`、`claude/`、`copilot/`、`codex/`、`ai/commands.md` | 五大 AI 编码工具介绍 + 命令对照表 |
| 🧩 AI 核心机制 | `ai/agent/`、`ai/mcp.md`、`ai/lsp.md`、`skills/`、`ai/prompt.md`、`ai/rag.md`、`ai/function-calling.md`、`ai/embedding.md` | Agent / MCP / LSP / Skills / Prompt / RAG / Function Calling / Embedding |
| 📚 AI 进阶 | `ai-knowledge/lab/`、`ai-knowledge/insights/` | 本地部署、模型微调、行业动态、精选文章 |

### 首页结构

`index.md` — `layout: home`，包含：
- Hero 区（标题 + tagline）
- 关于本站（团队表格：三大板块角色描述）
- 知识目录（`<details>` 折叠树，根节点默认展开，子节点默认收起）
- 每个子分组有角色描述（`<span class="node-desc">`）
- 即将更新区（灰色样式）
- 底部 CSS（树样式、node-desc、leaf 样式等）

### 主题

`.vitepress/theme/style.css` — 品牌色（青色 `#1aa09a`）、深色模式已关闭（`appearance: false`）。

### 新增文章流程

1. 在对应目录新建 `.md` 文件
2. 在 `config.ts` 的 `nav`（如需）和 `sidebar` 对应路径块中添加 `{ text, link }` 条目
3. 同步更新 `index.md` 首页知识目录树（篇数 badge、树节点）
4. `npm run build` 验证无报错后推送

### 部署与同步

**Git 远程仓库：**

| Remote | 地址 | 用途 |
|--------|------|------|
| `github` | `https://github.com/Jinhui324/claude-docs.git` | 部署源，推送触发 GitHub Actions → GitHub Pages |
| `origin` | `https://gitee.com/jinhuizhang/claude-docs.git` | 代码同步，不部署页面 |

**线上地址：** `https://jinhui324.github.io/claude-docs/`

**GitHub Actions 工作流：** `.github/workflows/deploy.yml`
- 触发条件：`push` 到 `main` 或手动 `workflow_dispatch`
- 构建流程：`checkout` → `setup-node@20` → `npm ci` → `npm run build` → 部署到 Pages

**VitePress Base Path：** `base: '/claude-docs/'`（非 `username.github.io` 仓库必须设置）

## 用户偏好与工作习惯

以下是站长日常操作中沉淀的偏好，后续 session 遵循：

### 内容规范
- **敏感词禁令**：所有发布内容禁止出现 Wyze、wyzelabs、wpk、Lock、Camera、DX_LL、CRD、Palmer、Bolt、Palm 等公司/产品标识
- **占位页面格式**：新建占位页用 `::: tip 📝 待完善` 标记，保持结构完整但标明未完成
- **工具排序**：AI 工具按市场用户量排序（Cursor > GitHub Copilot > Claude Code > Codex CLI）
- **命令合集始终置顶**：跨工具速查表放在所有工具之前

### 首页设计偏好
- **折叠树**：根节点默认展开（`open`），子节点默认收起（无 `open`）
- **角色描述**：每个子分组带 emoji + 角色名 + 一句话职责（如 🕵️ 特工 — AI 自主决策与任务执行的核心）
- **篇数 badge**：每个节点显示包含文章数
- **间距紧凑**：Hero 与正文之间不要过大间距（已覆盖 `.VPHero { padding-bottom: 0 }`)

### 导航结构偏好
- **三大板块**：AI 工具（军火库）、AI 核心机制（技术中台）、AI 进阶（图书馆）
- **新增内容归类原则**：工具类 → AI 工具；底层原理/协议 → AI 核心机制；实验/洞察 → AI 进阶
- **Cursor 归属 AI 工具**（GUI 编辑器也是工具，不单独分类）

### 工作流偏好
- **先预览再部署**：改完先 `npm run dev` 本地看效果，确认后再推远程
- **批量修改时同步三处**：nav（config.ts）+ sidebar（config.ts）+ 首页树（index.md）
- **文档写作用 background agent**：长文档（200+ 行）交给 general-purpose agent 后台写，主线程继续其他工作
- **简短指令风格**：用户常用简写（"jixu" = 继续、"都要加" = 全部添加、"帮我" = 直接执行不问），尽量少问多做
- **一次只做一件事**：每次修改聚焦一个主题，不混入无关改动

### 技术约束备忘
- VitePress sidebar 最多 2 级嵌套（group → item），无法 3 级
- `index.md` 中全角冒号（efbc9a）会导致 edit 工具匹配失败，遇到时用 bash/Python 处理
- 首页 HTML 中链接用相对路径（`./path`），因为 `base: '/claude-docs/'`
- 暗色模式已关闭（`appearance: false`）
