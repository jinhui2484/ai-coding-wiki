# Claude Code CLI 完整命令手册

> 适用版本：Claude Code CLI（最新版）
> 更新日期：2026-05-03
> 标注 **\[Skill\]** 的命令为提示词驱动的内置 Skill，其余为原生内置命令。

---

## 会话管理

| 命令 | 别名 | 功能 | 使用场景 |
|------|------|------|----------|
| `/clear` | `/reset` `/new` | 开启新会话，旧会话可用 `/resume` 找回 | 想要全新开始时 |
| `/resume [session]` | `/continue` | 通过 ID、名称恢复历史会话，或打开选择器 | 继续上次未完成的工作 |
| `/branch [name]` | `/fork` | 在当前节点创建会话分支 | 想探索不同方向而不影响主线 |
| `/rename [name]` | — | 重命名当前会话；不传参则自动生成名称 | 给会话起有意义的名字方便管理 |
| `/recap` | — | 生成当前会话的一句话摘要 | 快速回顾本次做了什么 |
| `/export [filename]` | — | 将当前会话导出为纯文本文件 | 保存对话记录 |

---

## 上下文与性能

| 命令 | 别名 | 功能 | 使用场景 |
|------|------|------|----------|
| `/compact [instructions]` | — | 压缩会话历史释放上下文；可附加聚焦指令 | 上下文快满时，保留重要内容继续工作 |
| `/context` | — | 可视化当前上下文占用情况，给出优化建议 | 了解上下文窗口消耗分布 |
| `/usage` | `/cost` `/stats` | 显示本次会话费用、用量限制和活动统计 | 追踪花费和 token 用量 |

---

## 模型与执行控制

| 命令 | 别名 | 功能 | 使用场景 |
|------|------|------|----------|
| `/model [model]` | — | 切换 AI 模型；不传参打开选择器 | 在 Sonnet / Opus / Haiku 之间切换 |
| `/effort [level\|auto]` | — | 设置推理深度：`low` / `medium` / `high` / `xhigh` / `max` | 简单任务调低节省费用，复杂任务调高 |
| `/fast [on\|off]` | — | 开关快速模式（更低延迟和成本） | 需要快速响应的简单问答 |
| `/plan [description]` | — | 进入计划模式，先分析再执行 | 执行大改动前，先让 Claude 给出方案 |

---

## 文件与代码操作

| 命令 | 别名 | 功能 | 使用场景 |
|------|------|------|----------|
| `/add-dir <path>` | — | 为当前会话添加额外工作目录 | 需要访问当前目录之外的文件 |
| `/diff` | — | 打开交互式 diff 查看器，显示未提交改动 | 复查 Claude 做了哪些修改 |
| `/copy [N]` | — | 复制最近第 N 条回复到剪贴板；可选择代码块 | 快速提取代码片段 |
| `/review [PR]` | — | 在本地会话中 review 指定 PR | 轻量 PR 审查 |
| `/ultrareview [PR]` | — | 云端多 Agent 深度 review（安全/风格/逻辑） | 重要 PR 的全面审查 |

---

## 权限与安全

| 命令 | 别名 | 功能 | 使用场景 |
|------|------|------|----------|
| `/permissions` | `/allowed-tools` | 管理工具的 allow / ask / deny 规则 | 配置哪些工具需要逐次确认 |
| `/security-review` | — | 分析当前分支改动中的安全漏洞 | 提交涉及认证、数据处理的代码前 |
| `/sandbox` | — | 开关沙盒模式（隔离文件系统和网络） | 需要安全隔离环境时 |

---

## 配置与设置

| 命令 | 别名 | 功能 | 使用场景 |
|------|------|------|----------|
| `/config` | `/settings` | 打开设置界面（主题、模型、输出风格等） | 自定义 Claude Code 行为 |
| `/theme` | — | 切换配色主题（auto / light / dark / daltonized 等） | 修改外观 |
| `/statusline` | — | 配置终端状态栏显示内容 | 自定义底部状态信息 |
| `/terminal-setup` | — | 配置终端快捷键（Shift+Enter 等） | VS Code / Cursor / Zed 等终端适配 |
| `/keybindings` | — | 打开或创建快捷键配置文件 | 自定义键位 |
| `/color [color]` | — | 设置提示栏颜色（red/blue/green 等） | 多会话时用颜色区分 |

---

## 连接与集成

| 命令 | 别名 | 功能 | 使用场景 |
|------|------|------|----------|
| `/mcp` | — | 管理 MCP 服务器连接和 OAuth 认证 | 添加/配置 MCP 服务（Jira、Figma 等） |
| `/ide` | — | 管理 IDE 集成状态 | 连接/断开 VS Code、JetBrains 等 |
| `/desktop` | `/app` | 在桌面应用中继续当前会话（macOS/Windows） | 从 CLI 切换到桌面 App |
| `/remote-control` | `/rc` | 让当前会话可被 claude.ai 远程控制 | 从网页端操控本地 CLI |
| `/teleport` | `/tp` | 将 Web 端会话拉取到终端 | 把网页会话切换回 CLI |
| `/login` | — | 登录 Anthropic 账号 | 身份验证 |
| `/logout` | — | 登出 Anthropic 账号 | 切换账号 |

---

## 自动化与工作流

| 命令 | 别名 | 功能 | 使用场景 |
|------|------|------|----------|
| `/batch <instruction>` | — | **\[Skill\]** 并行大规模修改代码库，自动拆分为 5-30 个子任务在隔离 worktree 中执行 | 跨文件的大型重构，如迁移框架 |
| `/loop [interval] [prompt]` | `/proactive` | **\[Skill\]** 重复执行指定提示；不传参则进入自主维护巡检模式 | 定时监控、持续任务 |
| `/schedule [description]` | `/routines` | 创建/更新/列出定时任务，支持交互式配置 | 定时执行特定任务 |
| `/autofix-pr [prompt]` | — | 在云端监听当前 PR，自动推送 CI 修复 | PR CI 失败时自动修复 |

---

## Skills 工具

| 命令 | 别名 | 功能 | 使用场景 |
|------|------|------|----------|
| `/skills` | — | 列出所有可用 Skills；按 `t` 按 token 量排序 | 查看已安装的 Skill 列表 |
| `/plugin` | — | 管理 Claude Code 插件 | 安装、启用、禁用插件 |
| `/reload-plugins` | — | 热重载所有插件（无需重启） | 修改插件后立即生效 |

---

## 记忆与知识库

| 命令 | 别名 | 功能 | 使用场景 |
|------|------|------|----------|
| `/memory` | — | 编辑 CLAUDE.md；管理自动记忆条目 | 维护项目和个人指令 |
| `/init` | — | 为当前项目初始化 CLAUDE.md 引导文件 | 新项目接入 Claude Code |

---

## 代码质量

| 命令 | 别名 | 功能 | 使用场景 |
|------|------|------|----------|
| `/simplify [focus]` | — | **\[Skill\]** 并行启动 3 个 review Agent 分析代码复用和效率 | 重构优化，如 `/simplify focus on memory efficiency` |
| `/debug [description]` | — | **\[Skill\]** 开启调试日志，分析问题根因 | 排查异常或诊断 bug |
| `/fewer-permission-prompts` | — | **\[Skill\]** 扫描历史记录，将常用只读工具加入白名单 | 减少频繁弹出的权限确认 |
| `/claude-api [migrate]` | — | **\[Skill\]** 加载 Claude API 参考文档；`migrate` 子命令升级模型版本代码 | 开发 Claude API 集成时 |

---

## 帮助与诊断

| 命令 | 别名 | 功能 | 使用场景 |
|------|------|------|----------|
| `/help` | — | 显示帮助信息和可用命令 | 在终端快速查阅命令 |
| `/doctor` | — | 诊断 Claude Code 安装和配置；按 `f` 自动修复 | 出现异常时排查环境 |
| `/status` | — | 显示版本、模型、账号、连接状态（可在回复中途使用） | 不中断工作地检查状态 |
| `/insights` | — | 生成会话使用分析报告（项目分布、使用模式） | 了解自己的使用习惯 |
| `/release-notes` | — | 查看各版本更新日志 | 了解新功能 |
| `/feedback` | `/bug` | 提交反馈或 bug 报告 | 报告问题或建议功能 |
| `/heapdump` | — | 将 JS 堆快照写入桌面（内存诊断用） | 排查内存占用过高 |
| `/exit` | `/quit` | 退出 CLI | 关闭会话 |

---

## 规划与回滚

| 命令 | 别名 | 功能 | 使用场景 |
|------|------|------|----------|
| `/ultraplan <prompt>` | — | 在浏览器中起草并审批计划，再远程或本地执行 | 复杂多步任务的可视化规划 |
| `/rewind` | `/checkpoint` `/undo` | 将会话和代码回滚到之前的状态 | 撤销改动，恢复到某个检查点 |

---

## 账号与管理

| 命令 | 别名 | 功能 | 使用场景 |
|------|------|------|----------|
| `/hooks` | — | 查看 hook 配置（工具事件触发的自动化脚本） | 管理自动化钩子 |
| `/btw <question>` | — | 快速提问，不计入会话历史 | Claude 工作中间插一个小问题 |
| `/upgrade` | — | 打开升级页面切换到更高套餐 | 需要更多用量时 |
| `/extra-usage` | — | 配置额外用量，达到限额后继续工作 | 避免触达速率限制被中断 |
| `/privacy-settings` | — | 查看和更新隐私设置（Pro/Max 订阅用户） | 管理数据隐私 |
| `/setup-bedrock` | — | 配置 Amazon Bedrock 认证和区域 | 使用 AWS Bedrock 时 |
| `/setup-vertex` | — | 配置 Google Vertex AI 认证和项目 | 使用 Google Vertex AI 时 |
| `/install-github-app` | — | 为 GitHub 仓库安装 Claude Actions 集成 | 配置 CI/CD 自动化 |
| `/install-slack-app` | — | 安装 Claude Slack App | 在 Slack 中使用 Claude |
| `/powerup` | — | 通过互动演示学习 Claude Code 新功能 | 快速上手新特性 |
| `/focus` | — | 切换聚焦视图（只显示最新提示、工具摘要和回复） | 减少视觉干扰 |
| `/voice [hold\|tap\|off]` | — | 开关语音输入模式（需 Claude.ai 账号） | 免手输入 |
| `/tasks` | `/bashes` | 列出和管理后台任务 | 查看正在运行的后台命令 |
| `/mobile` | `/ios` `/android` | 显示下载 Claude 移动端的二维码 | 获取手机端访问 |
| `/passes` | — | 向朋友分享一周免费 Claude Code（限资格用户） | 邀请同事体验 |

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
