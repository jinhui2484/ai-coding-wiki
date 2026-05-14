# 技术内容平台速查

> 优质技术内容来源全景图：视频、文章、论文、播客一站式索引
>
> 重点关注：**特点、访问方式（MCP / API / 浏览器）、是否需要付费**
>
> 更新日期：2026-05-14

## 速览总览

按收费门槛三色分级：

- 🟢 **完全免费** — MCP 工具可直接抓取
- 🟡 **部分付费墙** — 免费内容可抓，付费专栏抓不到
- 🔴 **必须付费 / 抓不到** — 强登录态或 DRM 保护

---

## 🎥 视频 / 大会演讲

| 平台 | 特点 | 访问方式 | 付费 |
|------|------|----------|------|
| **YouTube** | 全球最大技术视频库，顶级会议、官方频道全在这里 | `video-context` MCP（yt-dlp 后端）/ `fetch_youtube_transcript` | 🟢 公开视频免登录 |
| **InfoQ** | 顶级技术大会（QCon、AI Engineer）演讲合集，多数带 transcript | `fetch_readable` 抓页面 | 🟢 多数免费，少量需注册 |
| **GOTO Conferences** | 北欧老牌技术大会，Uncle Bob、Kent Beck 常驻嘉宾 | YouTube 频道 + `gotopia.tech` | 🟢 全免费 |
| **Bilibili** | 国内技术 UP 主集中地，中文字幕友好，前端 / AI 教程多 | `fetch_markdown` 抓页面；视频解析受限 | 🟡 登录态视频抓不到 |
| **Coursera / edX** | 系统化课程，斯坦福、MIT 等名校公开课 | 浏览器 / 官方 App | 🔴 视频内容付费，DRM 保护 |

## 📝 英文文章 / 博客

| 平台 | 特点 | 访问方式 | 付费 |
|------|------|----------|------|
| **Hacker News** | 技术圈风向标，社区投票筛选，必读 | `fetch_markdown` + 官方 Firebase API（免费无 Key） | 🟢 完全开放 |
| **Lobsters** | 比 HN 更小众、信噪比更高，邀请制社区 | `fetch_markdown` | 🟢 完全开放 |
| **dev.to** | 开发者博客社区，门槛低、覆盖广 | `fetch_readable` + 官方 API（免费） | 🟢 完全开放 |
| **Medium** | 中长文为主，AI / 架构 / 系统设计专栏多 | `fetch_readable` | 🟡 每月免费额度，付费墙文章抓不全 |
| **Substack** | 独立作者订阅制，深度长文（Pragmatic Engineer 等） | `fetch_readable` | 🟡 免费文 OK，付费订阅文抓不到 |
| **InfoQ 文章版** | 架构、AI、云原生深度文章，权威性高 | `fetch_readable` | 🟢 全免费 |
| **The Morning Paper** | 论文精读博客（Adrian Colyer），已停更但归档很值钱 | `fetch_readable` | 🟢 全免费 |
| **Simon Willison's blog** | LLM 实战日记，更新极勤，每周都有干货 | `fetch_readable` | 🟢 全免费 |
| **Latent Space** | AI Engineer 大会主办方博客，前沿 AI 工程实践 | `fetch_readable` | 🟡 大部分免费，少量会员专属 |

## 🇨🇳 中文优质技术内容

| 平台 | 特点 | 访问方式 | 付费 |
|------|------|----------|------|
| **掘金** | 前端 / 移动 / AI 最活跃的中文社区，文章 + 沸点 + 小册 | `fetch_markdown` | 🟢 文章免费，小册付费 |
| **InfoQ 中文站** | 国际大会演讲中文翻译版本，与英文站内容互补 | `fetch_readable` | 🟢 多数免费 |
| **极客时间** | 系统化付费课程，专栏 / 视频 / 训练营 | 浏览器，强登录态 | 🔴 必须付费，MCP 抓不到 |
| **少数派** | 工具 / 效率 / 开发者文化，深度长文 | `fetch_readable` | 🟡 部分会员专属 |
| **SegmentFault 思否** | 老牌问答 + 博客社区，技术深度高 | `fetch_readable` | 🟢 完全免费 |
| **阮一峰的网络日志** | 每周技术周刊，必订；GitHub 仓库同步 | `fetch_markdown`（GitHub raw） | 🟢 完全开放 |

## 📚 论文 / 前沿研究

| 平台 | 特点 | 访问方式 | 付费 |
|------|------|----------|------|
| **arXiv** | AI / 计算机论文必去，每天数百篇预印本 | `fetch_markdown` + `pdf-read_pdf` | 🟢 全免费 |
| **Papers With Code** | 论文 + 代码 + benchmark 三位一体 | `fetch_markdown` | 🟢 全免费 |
| **Hugging Face Blog** | LLM / AI 工程实践第一手资料 | `fetch_readable` | 🟢 全免费 |
| **官方 AI 实验室博客** | Anthropic、OpenAI、Google DeepMind | `fetch_readable` | 🟢 全免费 |

## 🎙️ 技术播客

| 平台 | 特点 | 访问方式 | 付费 |
|------|------|----------|------|
| **Software Engineering Daily** | 每日一期，覆盖全栈、架构、AI | RSS / `video-transcribe_video` 喂 mp3 | 🟢 全免费 |
| **The Pragmatic Engineer Podcast** | Gergely Orosz 主持，工程师成长 | RSS 公开 | 🟢 全免费 |
| **Latent Space** | AI 工程师播客，对话前沿从业者 | RSS 公开 | 🟢 全免费 |
| **Changelog** | 开源生态访谈节目，覆盖各种语言和框架 | RSS 公开 | 🟢 全免费 |

## 📱 iOS / 移动开发垂直

| 平台 | 特点 | 访问方式 | 付费 |
|------|------|----------|------|
| **objc.io** | Swift / iOS 顶级深度文章，作者多为前 Apple 工程师 | `fetch_readable` | 🟡 文章免费，书 / 视频付费 |
| **Swift by Sundell** | John Sundell 博客，Swift 实战技巧 | `fetch_readable` | 🟡 文章免费，视频会员制 |
| **Point-Free** | Composable Architecture 作者主理，函数式 Swift 进阶 | 浏览器 | 🔴 视频订阅制，强 DRM |
| **Hacking with Swift** | Paul Hudson 主理，教程量大、上手友好 | `fetch_readable` | 🟢 多数免费 |

---

## 🎯 三类决策矩阵

### 🟢 完全免费 + MCP 直抓
> 日常解读首选，零成本

YouTube、Hacker News、Lobsters、dev.to、掘金、SegmentFault、阮一峰、arXiv、Papers With Code、Hugging Face Blog、Simon Willison、官方 AI 博客、GOTO、InfoQ 主要内容、Hacking with Swift、所有开源播客

### 🟡 部分付费墙
> 免费部分够用，遇付费内容跳过即可

Medium、Substack（Pragmatic Engineer 等）、少数派、Latent Space、Swift by Sundell 视频、objc.io 书 / 视频、Bilibili 登录态视频、掘金小册

### 🔴 必须付费 / MCP 抓不到
> 想要这类内容，只能花钱

极客时间、Point-Free、Coursera / edX 付费课、Medium 付费专栏、Substack 付费专栏

---

## 💡 推荐工作流

```text
日常文章解读 → fetch_readable + 主模型分析
YouTube 演讲 → video-summarize_video（glm provider 免费）
论文阅读   → fetch_markdown 抓 abs + pdf-read_pdf 读 PDF
播客       → video-transcribe_video 喂 mp3 URL
中文优质   → 掘金 + 阮一峰周刊 + InfoQ 中文
iOS 垂直   → Hacking with Swift + Swift by Sundell + objc.io
```

---

## 🔧 MCP 配置实操

让 AI 工具能直接抓取上面这些平台，核心是装好下面三类 MCP Server。所有配置统一写到 `~/.copilot/mcp-config.json`（Copilot 用）或 `~/.claude/mcp.json`（Claude Code 用），格式相同。

### 1. Fetch MCP — 网页抓取主力

适用：所有 🟢 文章 / 博客 / 论文 abs 页

```json
{
  "mcpServers": {
    "fetch": {
      "command": "npx",
      "args": ["-y", "@kazuph/mcp-fetch"]
    }
  }
}
```

提供的工具：
- `fetch_readable` — Mozilla Readability 解析，最干净，文章首选
- `fetch_markdown` — 转 Markdown，保留表格 / 代码块
- `fetch_html` — 原始 HTML，调试用
- `fetch_youtube_transcript` — 抓 YouTube 字幕（不下载视频）

### 2. Video Context MCP — 视频解读

适用：YouTube / Bilibili 等视频解读

```json
{
  "mcpServers": {
    "video-context": {
      "command": "npx",
      "args": ["-y", "video-context-mcp-server"],
      "env": {
        "GLM_API_KEY": "your-glm-key",
        "GEMINI_API_KEY": "your-gemini-key",
        "DEEPGRAM_API_KEY": "your-deepgram-key"
      }
    }
  }
}
```

提供的工具：
- `video-summarize_video` — 整段视频结构化总结
- `video-analyze_video` — 针对视频问答
- `video-transcribe_video` — 转录音频（播客也能用）
- `video-search_timestamp` — 找视频里某个画面/事件的时间点
- `video-extract_frames` — 抽帧

> 💡 不想配 API Key？默认会 fallback 到免费 `glm` provider，能用但慢。

### 3. PDF MCP — 论文阅读

```json
{
  "mcpServers": {
    "pdf": {
      "command": "npx",
      "args": ["-y", "@kazuph/mcp-pdf"]
    }
  }
}
```

`pdf-read_pdf` 支持 URL 直读 + 分页抽取，配合 `fetch_markdown` 抓 arXiv abs 页是论文阅读黄金组合。

### 4. 一份完整配置参考

把三个 Server 合并到同一份 `mcp-config.json`：

```json
{
  "mcpServers": {
    "fetch": {
      "command": "npx",
      "args": ["-y", "@kazuph/mcp-fetch"]
    },
    "video-context": {
      "command": "npx",
      "args": ["-y", "video-context-mcp-server"]
    },
    "pdf": {
      "command": "npx",
      "args": ["-y", "@kazuph/mcp-pdf"]
    }
  }
}
```

重启 Copilot / Claude 即可使用，无需手动启动进程。

---

## 🪛 没装 MCP 时的兜底方案

不是所有平台都有现成 MCP，AI 工具本身也不一定开 MCP。下面三种方式可以让 AI 直接拿到内容：

### 方案 A：浏览器复制粘贴（最通用）

```text
1. 打开文章 → Cmd+A 全选 → Cmd+C
2. 在对话框粘贴，前缀一句"以下是文章原文，帮我解读："
3. 让 AI 直接处理
```

适用：所有 🟢🟡 网页内容、付费墙后的免费段落

### 方案 B：让 AI 用内置 `web_fetch` / `web_search`

大多数 AI 编程工具（Copilot CLI、Claude Code、Cursor）都内置了简易 fetch：

```text
"帮我抓取并总结 https://xxx.com/article"
"搜一下最新的 React 19 特性，给我列要点"
```

适用：公开 HTML 页面、新闻类内容
局限：拿不到登录态、JS 渲染页、复杂动态站点

### 方案 C：curl + 管道

终端里手动抓，再喂给 AI：

```bash
# 抓网页文本
curl -sL "https://example.com/article" | pandoc -f html -t markdown | pbcopy

# 抓 YouTube 字幕（需要装 yt-dlp）
yt-dlp --write-auto-sub --skip-download --sub-lang zh,en "https://youtube.com/watch?v=XXX"
cat *.vtt | pbcopy

# 抓 arXiv PDF 文本
curl -sL "https://arxiv.org/pdf/2401.00001.pdf" -o paper.pdf
pdftotext paper.pdf - | pbcopy
```

适用：批量处理、自动化脚本、CI 集成

### 方案 D：用浏览器扩展辅助

| 扩展 | 用途 |
|------|------|
| **Reader Mode** | Safari/Chrome 内置阅读模式，去广告留正文 |
| **Markdownload** | 一键把网页转 Markdown 复制到剪贴板 |
| **AI Reader 类扩展** | 直接在网页右下角悬浮 AI 问答 |

### 方案 E：搭建本地代理（高级）

需要登录态的内容（如付费 Substack、Medium 会员文）：

```bash
# 用 Chrome 调试模式登录后导出 cookies
# 再用 curl --cookie cookies.txt 抓取
```

⚠️ 涉及版权和服务条款，仅个人学习用，不要分享原文。

---

## 📌 备注

- **MCP 工具说明**：本站默认假设你装了 `fetch-*`、`video-context`、`pdf-read_pdf` 等 MCP，未装的话用上面兜底方案
- **配额提醒**：YouTube 抓取无官方配额，但同 IP 频繁触发会被临时风控；AI 解读受底层模型 API 配额限制
- **DRM 标记**：所有标 🔴 的平台都有强登录态或视频 DRM 保护，技术上无法绕过，只能付费订阅
- **法律边界**：抓取公开内容做个人学习 OK，绕过付费墙 / 大规模爬取 / 商用转发都越线，请自重
