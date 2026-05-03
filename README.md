# Claude Code 知识库

基于 Anthropic 官方文档整理的 Claude Code 实用指南，涵盖 CLI 命令、Agent 开发、多 Agent 协调等内容。

**线上地址：** [https://jh-claude-docs.netlify.app](https://jh-claude-docs.netlify.app)

**源码仓库：** [https://gitee.com/jinhuizhang/claude-docs](https://gitee.com/jinhuizhang/claude-docs)

---

## 从零创建该工程

**环境要求：** Node.js 18+

```bash
# 1. 初始化项目
mkdir claude-docs && cd claude-docs
npm init -y

# 2. 安装依赖
npm install -D vitepress
npm install mermaid vitepress-plugin-mermaid

# 3. 创建配置文件
mkdir -p .vitepress/theme
# 参考本仓库的 .vitepress/config.ts 和 .vitepress/theme/ 目录

# 4. 创建首页
echo '# 首页' > index.md

# 5. 启动开发服务器
npm run dev
```

---

## 本地预览

```bash
npm run dev
# 浏览器打开 http://localhost:5173
# 保存文件即时热更新，无需重启
```

---

## 发布到 Netlify（首次）

1. 执行构建，生成静态文件：
   ```bash
   npm run build
   # 产物在 .vitepress/dist/
   ```
2. 打开 [https://app.netlify.com/drop](https://app.netlify.com/drop)
3. 将 `.vitepress/dist` 文件夹拖入页面
4. Netlify 自动生成站点链接，在站点设置里可改名

---

## 更新发布（后续每次）

> ⚠️ 不要再拖到 [app.netlify.com/drop](https://app.netlify.com/drop)，否则会创建新站点

1. 编辑文档
2. 构建：
   ```bash
   npm run build
   ```
3. 打开已有站点的 Deploys 页面：[https://app.netlify.com/projects/jh-claude-docs/deploys](https://app.netlify.com/projects/jh-claude-docs/deploys)
4. 将 `.vitepress/dist` 文件夹拖入页面，覆盖更新

---

## 新增一篇文章

1. 在对应目录下新建 `.md` 文件，例如 `agent/hooks.md`
2. 在 `.vitepress/config.ts` 的 `nav` 和 `sidebar` 中各加一行：
   ```ts
   { text: '文章标题', link: '/agent/hooks' }
   ```
3. 构建 + 更新发布

---

## 目录结构

```
claude-docs/
├── .vitepress/
│   ├── config.ts          # 站点配置（导航、侧边栏、主题）
│   └── theme/
│       ├── index.ts       # 主题入口
│       └── style.css      # 自定义样式（Claude 品牌色）
├── guide/
│   └── commands.md        # CLI 命令手册
├── agent/
│   ├── intro.md           # Agent 入门
│   ├── create.md          # 如何创建 Agent
│   └── multi-agent.md     # 多 Agent 协调
└── index.md               # 首页
```

---

## 技术栈

- [VitePress](https://vitepress.dev) — 静态站点生成器
- [vitepress-plugin-mermaid](https://github.com/emersonbottero/vitepress-plugin-mermaid) — Mermaid 图表支持
- [Netlify](https://netlify.com) — 托管部署
