# AI 编码工具命令合集

> Cursor · Claude Code · GitHub Copilot CLI · OpenAI Codex CLI 命令对照手册
>
> 更新日期：2026-05-11
>
> 说明：Cursor 是 GUI 编辑器，不是 CLI，优先用快捷键或界面操作表示；无对应能力统一记为 `—`。Claude Code / Copilot CLI 内容基于仓库现有命令手册；Codex CLI 内容基于 OpenAI 官方 Codex 文档与 `openai/codex` README。

## 工具概览对比表

| 项目 | Cursor | Claude Code | GitHub Copilot CLI | OpenAI Codex CLI |
|---|---|---|---|---|
| 开发商 | Anysphere | Anthropic | GitHub | OpenAI |
| 主力模型 | Claude Sonnet / GPT-4o（可切换多种模型） | Claude Sonnet（可切 Opus / Haiku） | Claude Sonnet 4.5 + GPT-5 | GPT-5.5 / GPT-5.4 / GPT-5.3-Codex 等 |
| 定价模式 | Hobby 免费 / Pro $20/月 / Business $40/月 | 订阅 / API 接入为主 | Copilot 订阅体系 | ChatGPT 订阅或 API Key |
| 安装方式 | 官网下载 `cursor.sh` | `npm i -g @anthropic-ai/claude-code` | `brew install copilot-cli`<br>`npm i -g @github/copilot` | `npm i -g @openai/codex`<br>`brew install --cask codex` |
| 核心定位 | VS Code 深度定制 AI 编辑器，Tab 补全 + 内联编辑 + Chat + Composer | 本地开发 + Skills + MCP + 多阶段协作 | GitHub 工作流集成最强，偏 PR / Issue / Agent | 终端内本地编码代理，兼顾交互 TUI 与脚本化 `exec` |
| 典型优势 | 上手最低门槛、Tab 补全体验最佳、VS Code 生态兼容 | Skills、批量任务、远程控制、PR autofix | GitHub 原生集成、Delegate、Fleet、Research | Sandbox/approval 粒度清晰，非交互自动化完整 |

补充说明：Cursor 偏“编辑器内 AI 原生体验”；Claude Code 偏“本地工程协作”；Copilot CLI 偏“GitHub 平台工作流”；Codex CLI 偏“终端代理 + 自动化执行”。

## 启动与登录

| 场景 | Cursor | Claude Code | Copilot CLI | Codex CLI |
|---|---|---|---|---|
| 启动 | 打开 Cursor 应用 | `claude` | `copilot` | `codex` |
| 带初始任务启动 | — | — | — | `codex "<task>"` |
| 登录 | 设置页面登录 | `/login` | `/login` | `codex login` |
| 登出 | 设置页面 | `/logout` | `/logout` | `/logout` |
| 查看帮助 | `Cmd+Shift+P` → Help | `/help` | `/help` | `/help` |
| 初始化项目指令文件 | 创建 `.cursorrules` 或 `.cursor/rules/` | `/init` → 生成 `CLAUDE.md` | `/init` → 初始化指令文件 | `/init` → 生成 `AGENTS.md` |

补充说明：Cursor 通过设置页、命令面板和规则文件完成初始化；Codex 的 `codex login` 是显式命令；Claude / Copilot 更常见是先进入 TUI 再用 `/login`。

## 会话管理

| 场景 | Cursor | Claude Code | Copilot CLI | Codex CLI |
|---|---|---|---|---|
| 新会话 | `Cmd+L`（新 Chat）/ `Cmd+I`（新 Composer） | `/clear` / `/reset` / `/new` | `/new` / `/clear` | `/new` / `/clear` |
| 恢复会话 | Chat 历史面板 | `/resume` / `/continue` | `/resume` | `codex resume` / `/resume` |
| 会话分支 | — | `/branch` / `/fork` | — | `/fork` |
| 重命名 | — | `/rename` | `/rename` | — |
| 会话摘要 / 压缩 | — | `/recap` / `/compact` | `/compact` | `/compact` |
| 历史查看 | Chat 历史面板 | — | `/search` / `/chronicle` | `/history` |
| 导出 / 分享 | — | `/export` | `/share` | — |
| 当前状态 | — | `/status` | `/usage` / `/context` | `/status` |
| 复制最近输出 | 右键复制 | `/copy` | `/copy` | `/copy` |

补充说明：Cursor 的会话管理主要依赖 Chat / Composer 历史面板；Codex 会话恢复既支持交互式 `codex resume`，也支持 `codex exec resume --last "<task>"` 续跑自动化任务。

## 上下文与文件操作

| 场景 | Cursor | Claude Code | Copilot CLI | Codex CLI |
|---|---|---|---|---|
| 添加额外目录 | 工作区添加文件夹 | `/add-dir <path>` | `/add-dir` | `--add-dir <path>` |
| 切换工作目录 | — | — | `/cwd` | `--cd <path>` / `-C` |
| 引用文件 / 精确上下文 | `@file` / `@folder` / `@codebase` | — | `@` | `@` / `/mention` |
| 查看改动 | 内置 Git diff | `/diff` | `/diff` | `/diff` |
| 回滚最近一步 | `Cmd+Z` / Composer 可逐步回退 | `/rewind` / `/undo` | `/rewind` / `/undo` | `/undo` |
| 查看上下文占用 | — | `/context` | `/context` | `/status` |
| 图片输入 | 粘贴图片到 Chat | — | — | `-i` / `--image` |
| 在编辑器中写长提示 | 直接在 Chat / Composer 输入框编写 | — | `Ctrl+G` | `Ctrl+G` |
| 直接执行 shell | Composer Agent 模式自动执行 | — | `!` | `!` |
| 文件引用 | `@file` | — | `@` | `@` |

补充说明：Cursor 把文件引用、代码库引用和多文件改动集中在编辑器内完成；Codex 的 `/mention` 是显式命令，`@` 是更快的文件模糊引用入口；Copilot 的 `@` 也是核心上下文操作。

## 模型与执行控制

| 场景 | Cursor | Claude Code | Copilot CLI | Codex CLI |
|---|---|---|---|---|
| 切换模型 | Chat / Composer 顶部模型选择器 | `/model` | `/model` | `/model` / `--model <name>` / `-m` |
| 推理 / 速度控制 | 模型选择器切换快 / 慢模型 | `/effort` / `/fast` | `Shift+Tab` 切模式 | `/fast` |
| 计划模式 | — | `/plan` | `/plan` | `/plan` |
| 会话风格 / 个性 | — | `/config` / `/theme` | `/theme` | `/personality` / `/theme` |
| 模式切换 | Normal / Agent（Composer 内切换） | — | `Shift+Tab`（Normal / Plan / Autopilot） | `/mode` |
| 非交互执行 | — | — | — | `codex exec "<task>"` |
| 配置档切换 | `.cursor/rules/` 按文件分规则 | — | `/instructions` | `--profile <name>` / `-p` |
| 远程会话 | — | `/remote-control` / `/teleport` | `/remote` | `--remote <ws://...>` |

补充说明：Cursor 更强调编辑器内模型切换与 Agent / Normal 模式切换；Codex 在“交互 TUI”和“非交互 `exec`”之间切换最自然；Copilot 更强调交互模式切换；Claude 更强调计划与推理深度控制。

## 权限与安全

| 场景 | Cursor | Claude Code | Copilot CLI | Codex CLI |
|---|---|---|---|---|
| 权限管理 | 设置 → Privacy | `/permissions` | `/allow-all` / `/reset-allowed-tools` | `/permissions` / `/approvals` |
| 沙箱控制 | — | `/sandbox` | — | `--sandbox <mode>` |
| 沙箱模式 | — | 开 / 关沙箱 | — | `read-only` / `workspace-write` / `danger-full-access` |
| 危险全放开 | — | — | `/allow-all` | `--yolo` / `--dangerously-bypass-approvals-and-sandbox` |
| 安全审查 | — | `/security-review` | — | — |
| 允许目录管理 | 工作区文件夹管理 | `/add-dir` | `/add-dir` / `/list-dirs` | `--add-dir` |

补充说明：Cursor 的权限控制主要体现在隐私设置与工作区范围；Codex 的安全模型最明确，核心是“sandbox mode + approval policy”双层控制；`--full-auto` 为旧兼容入口，现更推荐显式 `codex exec --sandbox workspace-write`。

## Agent 与 Subagent

| 场景 | Cursor | Claude Code | Copilot CLI | Codex CLI |
|---|---|---|---|---|
| 查看 / 选择 Agent | Composer Agent 模式 | `/skills` / `/plugin` | `/agent` | `/agent` |
| 并行子任务 | — | `/batch` **[Skill]** | `/fleet` | 显式请求 subagent |
| 后台任务查看 | — | `/tasks` / `/bashes` | `/tasks` / `/sidekicks` | `/ps` |
| 云端 / 远端委派 | — | `/autofix-pr` / `/ultrareview` | `/delegate` | `--remote` / Codex Cloud |
| 分支线程 | — | `/branch` | — | `/fork` / `/side` |

补充说明：Cursor 目前更偏单编辑器会话中的 Agent 交互；Copilot 的优势是 GitHub 平台委派；Claude 强在 Skill 驱动的大任务拆解；Codex 的 subagent 更像显式并行协作者，而不是默认常驻后台能力。

## MCP 集成

| 场景 | Cursor | Claude Code | Copilot CLI | Codex CLI |
|---|---|---|---|---|
| 查看 / 管理 MCP | 设置 → MCP | `/mcp` | `/mcp` | `/mcp` / `codex mcp` |
| 命令行新增 MCP Server | — | — | — | `codex mcp add <name> -- <command>` |
| MCP OAuth | — | `/mcp` 内完成 | `/mcp` 内管理 | `codex mcp login <server-name>` |
| 暴露 MCP 命令 | — | `/mcp__<server>__<prompt>` | — | — |
| 配置文件位置 | `.cursor/mcp.json` | — | 配置在 Copilot 指令 / 插件体系中 | `~/.codex/config.toml` / `.codex/config.toml` |

补充说明：Cursor 通过设置页与 `.cursor/mcp.json` 管理 MCP；Codex 的 MCP CLI 最完整，支持 add / login / config.toml 双路径；Claude 支持把 MCP 能力直接暴露成 slash 风格命令。

## 代码质量与审查

| 场景 | Cursor | Claude Code | Copilot CLI | Codex CLI |
|---|---|---|---|---|
| 本地代码审查 | Chat 中请求 review | `/review` | `/review` | `/review` / `codex review` |
| 深度审查 | — | `/ultrareview` | — | — |
| PR 相关审查 | — | `/review [PR]` | `/pr` / `/review` | — |
| 代码简化 | `Cmd+K` 选中后要求简化 | `/simplify` **[Skill]** | — | — |
| 调试辅助 | Chat 中粘贴错误 | `/debug` **[Skill]** / `/doctor` | `/lsp` / `/research` | `/debug-config` |
| 差异检查 | 内置 Git diff | `/diff` | `/diff` | `/diff` |
| 用户反馈 | 设置 → Feedback | `/feedback` | `/feedback` | `/feedback` |

补充说明：Cursor 更适合在编辑器内直接 review、改写和比对 diff；Codex 的 `codex review` 适合非交互审查；Claude 把 review 拓展到了深度 review 和 simplify；Copilot 更偏与 PR / GitHub 流程结合。

## 自动化与工作流

| 场景 | Cursor | Claude Code | Copilot CLI | Codex CLI |
|---|---|---|---|---|
| 周期性任务 | — | `/loop` / `/schedule` | `/every` | — |
| 非交互脚本化 | — | — | — | `codex exec` |
| 恢复自动化 | — | — | — | `codex exec resume --last` |
| 全自动模式 | Composer Agent 模式 | — | Autopilot（`Shift+Tab`） | `--full-auto`（兼容标志） |
| 远程工作流 | — | `/remote-control` / `/teleport` | `/remote` | `--remote` |
| 自动发现 | — | — | — | `--discover` |

补充说明：Cursor 的自动化更多体现在编辑器内 Agent 连续执行；如果目标是“把命令塞进 shell 脚本 / CI / 自动化管线”，Codex CLI 明显最完整；Copilot 的自动化更偏交互式 Agent 工作流；Claude 更适合长期巡检和计划驱动工作流。

## 快捷键对比

| 操作 | Cursor | Claude Code | Copilot CLI | Codex CLI |
|---|---|---|---|---|
| 取消当前操作 | `Esc` | — | `Ctrl+C` | `Ctrl+C` |
| 退出 | `Cmd+Q` | `/exit` / `/quit` | `Ctrl+C ×2` / `Ctrl+D` | `Ctrl+D` / `/exit` / `/quit` |
| 清屏 | — | — | `Ctrl+L` | `Ctrl+L` |
| 打开外部编辑器 | N/A（自身就是编辑器） | `/keybindings` / `/terminal-setup` 可配置 | `Ctrl+G` | `Ctrl+G` |
| 队列下一条输入 | — | — | `Ctrl+S` | `Tab` |
| 输入历史 | Chat 历史 | — | `Up / Down` | `Up / Down` |
| 文件引用 | `@` | — | `@` | `@` |
| 运行 shell | 内置终端 | — | `!` | `!` |
| 回到上条消息编辑 | — | — | — | `Esc` ×2 |
| Cursor 独有 | `Cmd+K`（行内编辑）、`Cmd+I`（Composer）、`Cmd+Shift+L`（选中发到 Chat）、`Tab`（补全） | — | — | — |

补充说明：Cursor 以编辑器快捷键为主；Claude Code 更强调“可配置快捷键”，而不是在命令手册里集中罗列默认键位；Copilot 与 Codex 都是明显的键盘优先 TUI。

## 配置文件对比

| 项目 | Cursor | Claude Code | Copilot CLI | Codex CLI |
|---|---|---|---|---|
| 项目级指令文件 | `.cursorrules` / `.cursor/rules/*.mdc` | `CLAUDE.md` | `CLAUDE.md` / `GEMINI.md` / `AGENTS.md` / `.github/instructions/**/*.instructions.md` / `.github/copilot-instructions.md` | `AGENTS.md` + `.codex/config.toml` |
| 用户级配置 | Cursor Settings（GUI） | `/config`、`/keybindings` 等界面管理 | `$HOME/.copilot/copilot-instructions.md` | `~/.codex/config.toml` |
| 配置格式 | MDC（Markdown + frontmatter）/ JSON | Markdown 指令 + UI 设置 | Markdown 指令文件 | TOML + Markdown（`AGENTS.md`） |
| 加载优先级 | `.cursor/rules/` 按 frontmatter 条件匹配 → `.cursorrules`（全局兜底） | 公开命令手册未列完整顺序；实践上以项目 `CLAUDE.md` 为主 | `CLAUDE.md` / `GEMINI.md` / `AGENTS.md`（项目根与当前目录） → `.github/instructions/**` → `.github/copilot-instructions.md` → `$HOME/.copilot/copilot-instructions.md` → 环境变量目录 | CLI flags / `--config` → `--profile` → 项目 `.codex/config.toml`（从项目根到当前目录，近者优先）→ `~/.codex/config.toml` → `/etc/codex/config.toml` → built-in defaults |
| MCP 配置 | `.cursor/mcp.json` | 通过 `/mcp` 管理 | 通过 `/mcp` 与插件体系管理 | `config.toml` 中 `[mcp_servers.<name>]` |
| Sandbox / approval 配置 | — | 命令级控制为主 | 权限列表为主 | `sandbox_mode` / `approval_policy` / `default_permissions` |

补充说明：Cursor 的规则体系偏编辑器内配置；Codex 是几者里“配置文件体系最工程化”的一个；Copilot 的指令加载层级最清晰；Claude 的公开命令文档更偏操作入口而不是配置层级细节。

## 独有功能

| 工具 | 独有能力 | 说明 |
|---|---|---|
| Cursor | `Cmd+K`、Tab 补全、Composer、`@codebase`、`.cursorrules` | AI 编辑器体验最流畅，Tab 补全 + 行内编辑 + 多文件 Composer 三位一体 |
| Claude Code | `/batch`、`/loop`、`/autofix-pr`、`/ultrareview`、`/memory` | 强调 Skills、长期工作流、深度 review、会话记忆 |
| GitHub Copilot CLI | `/delegate`、`/fleet`、`/pr`、`/research`、`/env` | 强绑定 GitHub 生态，适合 PR / Issue / Actions 导向工作流 |
| OpenAI Codex CLI | `codex exec`、`codex review`、`--sandbox`、`--profile`、`--image`、`--remote` | 终端代理 + 脚本化自动化 + 细粒度沙箱控制最突出 |

补充说明：如果你最在意“编辑器内即时补全与改写”，优先看 Cursor；最在意“自动化可脚本化”，优先看 Codex；最在意“GitHub 协作闭环”，优先看 Copilot；最在意“可编排技能与复杂本地任务”，优先看 Claude。

## 选择建议

| 场景 | 更推荐 | 原因 |
|---|---|---|
| 需要最低上手门槛、类 VS Code 体验 | Cursor | VS Code 用户无缝迁移，GUI 交互最直观 |
| 需要 Tab 补全 + 行内快速编辑 | Cursor | Tab 多行预测 + `Cmd+K` 行内改写体验最好 |
| 本地复杂改造、需要多轮计划和 Skill 编排 | Claude Code | 计划、Skills、批量任务、深度 review 更强 |
| GitHub PR / Issue / Actions / Delegate 为中心 | GitHub Copilot CLI | 原生 GitHub 集成最完整 |
| 需要非交互脚本、CLI 自动化、沙箱可控 | OpenAI Codex CLI | `codex exec` + `--sandbox` + `--profile` 组合最适合自动化 |
| 需要最清晰的配置层级与本地策略控制 | OpenAI Codex CLI | TOML 配置、approval policy、sandbox mode 都更明确 |
| 需要团队统一项目指令加载 | GitHub Copilot CLI | 指令文件加载优先级最清楚，支持多种项目指令入口 |
| 需要大量并行任务与本地技能扩展 | Claude Code | Skills 与批量执行能力更突出 |

补充说明：实际团队可以同时保留四者——Cursor 负责编辑器内高频补全与改写，Claude 负责复杂本地任务，Copilot 负责 GitHub 流程，Codex 负责脚本化与安全可控执行。
