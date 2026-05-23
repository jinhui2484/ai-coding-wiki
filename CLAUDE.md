# CLAUDE.md

本文档为 Claude Code 在该知识库工作时的指导手册，确保所有自动化操作与项目结构保持一致。

## 部署指令

当用户说"预览"、"本地预览"、"看看效果"时，执行：

```bash
open http://localhost:5173
```

若端口无响应，先执行 `npm run dev` 启动开发服务器，再打开链接。

当用户说"部署"、"发布"、"推到远程"、"上线"、"推远程"时，依次执行：

1. 若有未提交改动，先提交（commit message 根据改动内容自动生成，格式 `docs: <描述>`）
2. `git push origin main`（触发 GitHub Actions 自动部署到 GitHub Pages）

全部成功后报告 GitHub Pages 地址：`https://jinhui2484.github.io/ai-coding-wiki/`

## Commands

```bash
npm run dev        # 启动开发服务器（localhost:5173，热更新）
npm run build      # 构建静态文件 → dist/
npm run preview    # 本地预览构建产���
```

## 架构

**VitePress 1.3.4** 静态站点生成器，内容全部为 Markdown，配合 `vitepress-plugin-mermaid` 支持 Mermaid 图表。

### 配置入口

`.vitepress/config.ts` — 所有导航（`nav`）和侧边栏（`sidebar`）都在这里维护：

- **顶部导航（nav）**：包含首页 + Wyze Skills（专项）+ AI 工具/核心机制/进阶（三大板块）
- **侧边栏（sidebar）**：全局统一侧边栏，分 12 个 group（AI 工具、Agent、MCP、LSP、Skills、Prompt、RAG、Function Calling、Embedding、AI 实验室、AI 洞察、AI 成长）

### 项目结构

| 板块 | 路径 | 内容 | 在导航中的位置 |
|------|------|------|---|
| 🎯 Wyze Skills | `wyze-plugin-skills/` | 特定项目的架构与流程 | 单独一级菜单 |
| 🛠️ AI 工具 | `tools/` | Cursor、GitHub Copilot、Claude Code、Codex CLI | 第三级菜单 |
| 🧩 AI 核心机制 | `core/` | Agent、MCP、LSP、Skills、Prompt、RAG、Function Calling、Embedding | 第四级菜单 |
| 📚 AI 进阶 | `advanced/` | AI 实验室、AI 洞察、AI 成长 | 第五级菜单 |

### 目录树详解

```
.
├── CLAUDE.md                           # 本文件
├── index.md                            # 首页（layout: home）
├── docs/                               # 源文件根目录
│   ├── tools/                          # AI 工具板块
│   │   ├── commands.md                 # 命令合集（始终置顶）
│   │   ├── cursor/
│   │   │   └── intro.md
│   │   ├── copilot/
│   │   │   ├── intro.md
│   │   │   └── statusline-plugin.md
│   │   ├── claude/
│   │   │   └── intro.md
│   │   └── codex/
│   │       └── intro.md
│   ├── core/                           # AI 核心机制板块
│   │   ├── agent/
│   │   │   ├── agent-intro.md
│   │   │   ├── agent-create.md
│   │   │   └── multi-agent.md
│   │   ├── mcp/
│   │   │   ├── index.md
│   │   │   └── awesome-mcp-servers.md
│   │   ├── lsp.md
│   │   ├── skills/
│   │   │   ├── index.md
│   │   │   ├── skill-combination.md
│   │   │   └── mattpocock-skills.md
│   │   ├── prompt.md
│   │   ├── rag.md
│   │   ├── function-calling.md
│   │   └── embedding.md
│   ├── advanced/                       # AI 进阶板块
│   │   ├── lab/
│   │   │   ├── local-deployment.md
│   │   │   └── fine-tuning.md
│   │   ├── insights/
│   │   │   ├── trends.md
│   │   │   ├── curated-articles.md
│   │   │   ├── tech-platforms.md
│   │   │   ├── ai-coding-ok-analysis.md
│   │   │   └── codex-deepseek-analysis.md
│   │   └── growth/
│   │       └── ai-growth-2026-05-18.md
│   └── wyze-plugin-skills/             # Wyze Skills 专项板块
│       ├── project-structure.md
│       └── orchestration-flowchart.md
├── .vitepress/
│   ├── config.ts                       # 导航/侧边栏配置
│   ├── theme/
│   │   └── style.css                   # 样式（品牌青色 #1aa09a）
│   └── ...
└── package.json
```

### 主题与样式

`.vitepress/theme/style.css` — 品牌色青色 `#1aa09a`，深色模式已关闭（`appearance: false`）。

### 新增文章流程

1. 在对应目录新建 `.md` 文件
2. 在 `config.ts` 的 `nav`（若需跨板块导航）和 `sidebar` 对应块中添加 `{ text, link }` 条目
3. 同步更新 `index.md` 首页知识目录树（如有）
4. 执行 `npm run build` 验证无报错后推送

### 部署与同步

**Git 远程仓库：**

| Remote | 地址 | 用途 |
|--------|------|------|
| `origin` | `https://github.com/jinhui2484/ai-coding-wiki.git` | 主仓库，推送触发 GitHub Actions → GitHub Pages |

**线上地址：** `https://jinhui2484.github.io/ai-coding-wiki/`

**GitHub Actions 工作流：** `.github/workflows/deploy.yml`
- 触发条件：`push` 到 `main` 或手动 `workflow_dispatch`
- 构建流程：`checkout` → `setup-node@20` → `npm ci` → `npm run build` → 部署到 Pages

**VitePress Base Path：** `base: '/ai-coding-wiki/'`（因为是非用户主页仓库）

## 用户偏好与工作习惯

以下是站长日常操作中沉淀的偏好，后续 session 遵循：

### 内容规范

- **敏感词禁令**：所有发布内容禁止出现 Wyze、wyzelabs、wpk、Lock、Camera、DX_LL、CRD、Palmer、Bolt、Palm 等公司/产品标识
- **占位页面格式**：新建占位页用 `::: tip 📝 待完善` 标记，保持结构完整但标明未完成
- **工具排序**：AI 工具按市场用户量排序（Cursor > GitHub Copilot > Claude Code > Codex CLI）
- **命令合集始终置顶**：跨工具速查表放在 `/tools/commands.md`

### 首页设计偏好（如有）

- **简洁优先**：Hero 区 + 快速导航即可，避免冗长说明
- **快速入口**：首页提供到四大板块的快速链接

### 导航结构偏好

- **四大板块**：
  - 🎯 Wyze Skills（专项工具链）
  - 🛠️ AI 工具（军火库）
  - 🧩 AI 核心机制（技术中台）
  - 📚 AI 进阶（图书馆）
- **新增内容归类原则**：工具类 → AI 工具；底层原理/协议 → AI 核心机制；实验/洞察 → AI 进阶；特定项目 → Wyze Skills
- **Cursor 等编辑器归属 AI 工具**（GUI 工具也是工具，不单独分类）

### 工作流偏好

- **先预览再部署**：改完先 `npm run dev` 本地看效果，确认后再推远程
- **批量修改时同步三处**：nav（config.ts）+ sidebar（config.ts）+ 首页树（index.md）
- **简短指令风格**：用户常用简写（"jixu" = 继续、"都要加" = 全部添加、"帮我" = 直接执行不问），尽量少问多做
- **一次只做一件事**：每次修改聚焦一个主题，不混入无关改动

### 一致性强制规则（必须遵守）

任何涉及文件增删、移动、重命名的操作，**必须同时检查并同步以下四处**，缺一不可：

1. **本地目录结构** — 文件实际存放路径（`tools/`、`core/`、`advanced/`、`wyze-plugin-skills/`）
2. **config.ts nav** — 顶部导航所有 `link` 字段
3. **config.ts sidebar** — 侧边栏所有 `link` 字段
4. **CLAUDE.md 架构描述** — 此文件的"项目结构"表格和"目录树详解"

验证方法：操作完成后执行以下检查，确保本地文件与 config 链接一一对应、无缺失无孤儿：

```bash
# 提取 config 中所有链接
grep -o "link: '[^']*'" .vitepress/config.ts | sed "s/link: '//;s/'//" | grep -v '^/$' | grep -v '^http' | sort -u > /tmp/config_links.txt

# 提取本地所有 md 文件路径（排除.vitepress）
find . -name '*.md' -not -path './.vitepress/*' -not -path './node_modules/*' -not -path './.git/*' | sed 's|^\./||;s|\.md$||;s|/index$|/|' | sort -u > /tmp/local_files.txt

# 对比差异
diff /tmp/config_links.txt /tmp/local_files.txt
```

**有多篇子文章的主题必须建子目录**（如 `core/agent/`、`core/mcp/`、`core/skills/`），单篇的直接放平级（如 `core/lsp.md`）。

### 技术约束备忘

- VitePress sidebar 最多 2 级嵌套（group → item），无法 3 级
- `index.md` 中全角冒号（efbc9a）会导致 edit 工具匹配失败，遇到时用 bash/Python 处理
- 首页 HTML 中链接用相对路径（`./path`），因为 `base: '/ai-coding-wiki/'`
- 暗色模式已关闭（`appearance: false`）
- 最后更新日期在 `config.ts` 的 footer 中维护（`copyright` 字段）
