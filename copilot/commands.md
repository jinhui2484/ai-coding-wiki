# GitHub Copilot CLI 完整命令手册

> 适用版本：Copilot CLI v1.0+
> 更新日期：2026-05-11
> 基于 `/help` 输出整理，按功能分类

---

## 全局快捷键

| 快捷键 | 功能 |
|--------|------|
| `/` | 打开命令列表 |
| `@` | 引用文件（精确上下文） |
| `#` | 引用 Issue / PR |
| `!` | 执行 Shell 命令 |
| `Shift+Tab` | 切换模式（Normal / Plan / Autopilot） |
| `Ctrl+S` | 执行命令但保留输入内容 |
| `Ctrl+O / E` | 展开所有时间线 |
| `Ctrl+C` | 取消当前操作 |
| `Ctrl+C ×2` | 退出 CLI |
| `Esc` | 取消 |
| `Ctrl+D` | 关闭 CLI |
| `Ctrl+L` | 清屏 |
| `Ctrl+T` | 切换推理过程显示 |
| `Ctrl+X → B` | 将当前任务移到后台 |
| `Ctrl+X → O` | 打开最近的链接 |

### 输入编辑

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+A` | 光标移到行首 |
| `Ctrl+E` | 光标移到行尾 |
| `Ctrl+H` | 删除前一个字符 |
| `Ctrl+W` | 删除前一个单词 |
| `Ctrl+U` | 删除到行首 |
| `Ctrl+K` | 删除到行尾 |
| `Meta+←/→` | 按单词移动光标 |
| `Ctrl+G` | 在 `$EDITOR` 中编辑提示词 |

---

## 会话管理

- **`/new`** — 开始新对话
- **`/resume`** — 切换到其他会话（可指定 session ID、任务 ID 或名称）
- **`/rename`** — 重命名当前会话，不传参自动生成名称
- **`/context`** — 查看上下文窗口 token 使用情况
- **`/usage`** — 显示会话用量统计
- **`/compact`** — 压缩对话历史以减少上下文占用
- **`/share`** — 将会话导出为 Markdown、HTML 或 GitHub Gist
- **`/remote`** — 查看远程状态，或从 GitHub Web/Mobile 远程控制
- **`/copy`** — 复制最近一条回复到剪贴板
- **`/rewind`** 别名 `/undo` — 回退最近一轮对话并撤销文件更改
- **`/clear`** — 放弃当前会话，重新开始

---

## Agent 环境

- **`/init`** — 为当前仓库初始化 Copilot 指令文件
- **`/agent`** — 浏览并选择可用的 Agent
- **`/skills`** — 管理 Skills
- **`/mcp`** — 管理 MCP 服务器配置
- **`/plugin`** — 管理插件和插件市场

---

## Agent / Subagent

- **`/model`** — 选择 AI 模型（Claude Sonnet、GPT-5 等）
- **`/delegate`** — 将当前会话发送到 GitHub，由 Copilot 自动创建 PR
- **`/fleet`** — 启用 Fleet 模式（并行 Subagent 执行）
- **`/tasks`** — 查看和管理任务（Subagent 和 Shell 命令）

---

## 代码操作

- **`/ide`** — 连接 IDE 工作区
- **`/diff`** — 查看当前目录的改动
- **`/pr`** — 操作当前分支的 Pull Request
- **`/review`** — 运行代码审查 Agent 分析改动
- **`/lsp`** — 管理语言服务器配置
- **`/terminal-setup`** — 配置终端多行输入支持（Shift+Enter）

---

## 权限管理

- **`/allow-all`** — 启用所有权限（工具、路径、URL）
- **`/add-dir`** — 添加目录到允许访问列表
- **`/list-dirs`** — 显示所有允许访问的目录
- **`/cwd`** — 切换工作目录或显示当前目录
- **`/reset-allowed-tools`** — 重置允许的工具列表

---

## 帮助与诊断

- **`/help`** — 显示帮助信息
- **`/changelog`** — 查看版本更新日志，加 `summarize` 可获取 AI 摘要
- **`/feedback`** — 提交使用反馈
- **`/theme`** — 查看或设置配色模式
- **`/statusline`** 别名 `/footer` — 配置底部状态栏显示项
- **`/update`** — 更新 CLI 到最新版本
- **`/version`** — 显示版本信息并检查更新
- **`/experimental`** — 查看实验性功能，开关实验模式
- **`/instructions`** — 查看和切换自定义指令文件
- **`/streamer-mode`** — 切换直播模式（隐藏模型名和配额信息）

---

## 其他命令

- **`/ask`** — 快速侧边提问，不计入对话历史
- **`/chronicle`** — 会话历史工具和使用分析
- **`/env`** — 查看已加载的环境详情（指令、MCP、Skills、Agent、LSP 等）
- **`/every`** — 设置周期性提示（如 `/every 5m run tests`）
- **`/exit`** — 退出 CLI
- **`/keep-alive`** — 管理保活模式（阻止系统休眠）
- **`/login`** — 登录 Copilot
- **`/logout`** — 登出 OAuth 登录会话
- **`/plan`** — 先制定实施计划再编码
- **`/research`** — 运行深度研究调查（GitHub 搜索 + Web 来源）
- **`/restart`** — 重启 CLI，保留当前会话
- **`/search`** — 搜索对话时间线
- **`/sidekicks`** — 查看运行中的 Sidekick Agent
- **`/user`** — 管理 GitHub 用户列表

---

## 指令文件加载位置

Copilot CLI 会从以下位置读取自定义指令（优先级从高到低）：

1. `CLAUDE.md`（项目根目录 & 当前目录）
2. `GEMINI.md`（项目根目录 & 当前目录）
3. `AGENTS.md`（项目根目录 & 当前目录）
4. `.github/instructions/**/*.instructions.md`
5. `.github/copilot-instructions.md`
6. `$HOME/.copilot/copilot-instructions.md`
7. `COPILOT_CUSTOM_INSTRUCTIONS_DIRS` 环境变量指定的目录

---

## 常用工作流组合

### 日常开发

```
/plan        → 分析任务，制定方案
/diff        → 查看改动
/review      → 代码审查
/compact     → 上下文不足时压缩
```

### 深度调研

```
/research    → 深度研究调查
/ask         → 快速侧边提问
/share       → 导出研究报告
```

### 团队协作

```
/delegate    → 发到 GitHub 自动创建 PR
/pr          → 操作当前分支 PR
/fleet       → 并行 Subagent 执行
```

### 环境配置

```
/init        → 初始化指令文件
/mcp         → 配置 MCP 服务器
/lsp         → 配置语言服务器
/env         → 查看完整环境信息
```

---

## 实验性功能

通过 `copilot --experimental` 或 `/experimental` 启用：

- **Autopilot 模式** — 按 `Shift+Tab` 切换，Agent 持续工作直到任务完成，无需逐步确认

---

## 与 Claude Code 的区别

| 维度 | GitHub Copilot CLI | Claude Code CLI |
|------|-------------------|-----------------|
| 开发商 | GitHub（Microsoft） | Anthropic |
| 模型 | Claude Sonnet 4.5（默认）+ GPT-5 | Claude Sonnet（默认）+ Opus/Haiku |
| 认证 | GitHub 账号 | Anthropic 账号 |
| 内置集成 | GitHub MCP Server | 无默认 MCP |
| 侧重点 | GitHub 工作流（PR、Issue、Actions） | 本地开发、多模型切换 |
| 指令文件 | 支持 CLAUDE.md + copilot-instructions.md | CLAUDE.md |
| 安装 | `brew install copilot-cli` / `npm i -g @github/copilot` | `npm i -g @anthropic-ai/claude-code` |
