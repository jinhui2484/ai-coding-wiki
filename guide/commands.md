# Claude Code CLI 完整命令手册

> 适用版本：Claude Code CLI（最新版）
> 更新日期：2026-05-03
> 标注 **[Skill]** 的命令为提示词驱动的内置 Skill，其余为原生内置命令。

---

## 会话管理

- **`/clear`** 别名 `/reset` `/new` — 开启新会话，旧会话可用 `/resume` 找回
- **`/resume [session]`** 别名 `/continue` — 通过 ID、名称恢复历史会话，或打开选择器
- **`/branch [name]`** 别名 `/fork` — 在当前节点创建会话分支，探索不同方向不影响主线
- **`/rename [name]`** — 重命名当前会话；不传参则自动生成名称
- **`/recap`** — 生成当前会话的一句话摘要
- **`/export [filename]`** — 将当前会话导出为纯文本文件

---

## 上下文与性能

- **`/compact [instructions]`** — 压缩会话历史释放上下文；可附加聚焦指令，上下文快满时使用
- **`/context`** — 可视化当前上下文占用情况，给出优化建议
- **`/usage`** 别名 `/cost` `/stats` — 显示本次会话费用、用量限制和活动统计

---

## 模型与执行控制

- **`/model [model]`** — 切换 AI 模型；不传参打开选择器（Sonnet / Opus / Haiku）
- **`/effort [level|auto]`** — 设置推理深度：`low` / `medium` / `high` / `xhigh` / `max`
- **`/fast [on|off]`** — 开关快速模式（更低延迟和成本）
- **`/plan [description]`** — 进入计划模式，先分析再执行

---

## 文件与代码操作

- **`/add-dir <path>`** — 为当前会话添加额外工作目录
- **`/diff`** — 打开交互式 diff 查看器，显示未提交改动
- **`/copy [N]`** — 复制最近第 N 条回复到剪贴板；可选择代码块
- **`/review [PR]`** — 在本地会话中 review 指定 PR
- **`/ultrareview [PR]`** — 云端多 Agent 深度 review（安全 / 风格 / 逻辑）

---

## 权限与安全

- **`/permissions`** 别名 `/allowed-tools` — 管理工具的 allow / ask / deny 规则
- **`/security-review`** — 分析当前分支改动中的安全漏洞
- **`/sandbox`** — 开关沙盒模式（隔离文件系统和网络）

---

## 配置与设置

- **`/config`** 别名 `/settings` — 打开设置界面（主题、模型、输出风格等）
- **`/theme`** — 切换配色主题（`auto` / `light` / `dark` / `daltonized` 等）
- **`/statusline`** — 配置终端状态栏显示内容
- **`/terminal-setup`** — 配置终端快捷键（Shift+Enter 等），适配 VS Code / Cursor / Zed
- **`/keybindings`** — 打开或创建快捷键配置文件
- **`/color [color]`** — 设置提示栏颜色（`red` / `blue` / `green` 等），多会话时用颜色区分

---

## 连接与集成

- **`/mcp`** — 管理 MCP 服务器连接和 OAuth 认证（Jira、Figma 等）
- **`/ide`** — 管理 IDE 集成状态（VS Code、JetBrains 等）
- **`/desktop`** 别名 `/app` — 在桌面应用中继续当前会话（macOS/Windows）
- **`/remote-control`** 别名 `/rc` — 让当前会话可被 claude.ai 远程控制
- **`/teleport`** 别名 `/tp` — 将 Web 端会话拉取到终端
- **`/login`** — 登录 Anthropic 账号
- **`/logout`** — 登出 Anthropic 账号

---

## 自动化与工作流

- **`/batch <instruction>`** **[Skill]** — 并行大规模修改代码库，自动拆分为 5–30 个子任务在隔离 worktree 中执行
- **`/loop [interval] [prompt]`** 别名 `/proactive` **[Skill]** — 重复执行指定提示；不传参则进入自主维护巡检模式
- **`/schedule [description]`** 别名 `/routines` — 创建/更新/列出定时任务，支持交互式配置
- **`/autofix-pr [prompt]`** — 在云端监听当前 PR，自动推送 CI 修复

---

## Skills 工具

- **`/skills`** — 列出所有可用 Skills；按 `t` 可按 token 量排序
- **`/plugin`** — 管理 Claude Code 插件（安装、启用、禁用）
- **`/reload-plugins`** — 热重载所有插件（无需重启）

---

## 记忆与知识库

- **`/memory`** — 编辑 CLAUDE.md；管理自动记忆条目
- **`/init`** — 为当前项目初始化 CLAUDE.md 引导文件

---

## 代码质量

- **`/simplify [focus]`** **[Skill]** — 并行启动 3 个 review Agent 分析代码复用和效率
- **`/debug [description]`** **[Skill]** — 开启调试日志，分析问题根因
- **`/fewer-permission-prompts`** **[Skill]** — 扫描历史记录，将常用只读工具加入白名单
- **`/claude-api [migrate]`** **[Skill]** — 加载 Claude API 参考文档；`migrate` 子命令升级模型版本代码

---

## 帮助与诊断

- **`/help`** — 显示帮助信息和可用命令
- **`/doctor`** — 诊断 Claude Code 安装和配置；按 `f` 自动修复
- **`/status`** — 显示版本、模型、账号、连接状态（可在回复中途使用）
- **`/insights`** — 生成会话使用分析报告（项目分布、使用模式）
- **`/release-notes`** — 查看各版本更新日志
- **`/feedback`** 别名 `/bug` — 提交反馈或 bug 报告
- **`/heapdump`** — 将 JS 堆快照写入桌面（内存诊断用）
- **`/exit`** 别名 `/quit` — 退出 CLI

---

## 规划与回滚

- **`/ultraplan <prompt>`** — 在浏览器中起草并审批计划，再远程或本地执行
- **`/rewind`** 别名 `/checkpoint` `/undo` — 将会话和代码回滚到之前的状态

---

## 账号与管理

- **`/hooks`** — 查看 hook 配置（工具事件触发的自动化脚本）
- **`/btw <question>`** — 快速提问，不计入会话历史
- **`/upgrade`** — 打开升级页面切换到更高套餐
- **`/extra-usage`** — 配置额外用量，避免触达速率限制被中断
- **`/privacy-settings`** — 查看和更新隐私设置（Pro/Max 订阅用户）
- **`/setup-bedrock`** — 配置 Amazon Bedrock 认证和区域
- **`/setup-vertex`** — 配置 Google Vertex AI 认证和项目
- **`/install-github-app`** — 为 GitHub 仓库安装 Claude Actions 集成
- **`/install-slack-app`** — 安装 Claude Slack App
- **`/powerup`** — 通过互动演示学习 Claude Code 新功能
- **`/focus`** — 切换聚焦视图（只显示最新提示、工具摘要和回复）
- **`/voice [hold|tap|off]`** — 开关语音输入模式（需 Claude.ai 账号）
- **`/tasks`** 别名 `/bashes` — 列出和管理后台任务
- **`/mobile`** 别名 `/ios` `/android` — 显示下载 Claude 移动端的二维码
- **`/passes`** — 向朋友分享一周免费 Claude Code（限资格用户）

---

## 常用工作流组合

### 日常开发

```
/plan        → 分析任务，制定方案
/diff        → 查看改动
/review      → PR 审查
/compact     → 上下文不足时压缩
```

### 新项目接入

```
/init        → 初始化 CLAUDE.md
/memory      → 配置项目规范
/permissions → 配置工具权限白名单
```

### 调试排查

```
/debug       → 开启调试日志
/doctor      → 检查环境问题
/status      → 查看当前状态
```

### 大规模重构

```
/plan        → 先规划
/batch       → 并行执行大范围修改
/simplify    → 代码质量检查
/ultrareview → 深度安全审查
```

---

## 注意事项

1. **Skills vs 内置命令**：标注 `[Skill]` 的是提示词驱动的 Skill，可被覆盖或自定义；其余为硬编码命令。
2. **别名等价**：`/cost` = `/usage`，`/quit` = `/exit`，可混用。
3. **可用性差异**：部分命令依赖订阅套餐、平台（macOS/Web）或环境变量。
4. **MCP 扩展命令**：MCP 服务器可暴露额外命令，格式为 `/mcp__<server>__<prompt>`。
5. **发现所有命令**：在 Claude Code 中输入 `/` 可查看当前环境下所有可用命令。
