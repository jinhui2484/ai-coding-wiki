# Copilot CLI 自定义状态栏 & 任务监控

> 如何在 Copilot CLI 终端中显示自定义信息（任务状态、上下文、模型等）

## 底层原理

### statusLine.command 机制

Copilot CLI 在 `~/.copilot/settings.json` 中支持 `statusLine` 配置：

```json
{
  "statusLine": {
    "type": "command",
    "command": "/path/to/your-script.sh",
    "padding": 1
  },
  "footer": {
    "showCustom": true
  }
}
```

**工作流程：**

```
Copilot CLI 渲染循环
       ↓
  fork 执行 command 指定的脚本
       ↓
  stdin 传入 session JSON（模型、上下文、会话信息等）
       ↓
  脚本 stdout 输出文本 → 渲染到终端底部状态栏
       ↓
  周期性重复（每次 UI 刷新时触发）
```

这和 **Claude Code 的 statusLine API 完全一致**（claude-hud 插件就是基于这个机制构建的）。

### 两个独立的配置项

| 配置项 | 类型 | 作用 | 配置方式 |
|--------|------|------|----------|
| `footer` | `object` (布尔值) | 控制内置状态项的显隐 | `/statusline` 命令交互切换 |
| `statusLine` | `object` (command) | **自定义脚本**，输出任意内容 | 手动编辑 `settings.json` |

`footer` 控制的内置项：

| 字段 | 显示内容 |
|------|---------|
| `showModelEffort` | 当前模型和推理等级 |
| `showDirectory` | 工作目录 |
| `showBranch` | Git 分支 |
| `showContextWindow` | 上下文窗口占用百分比 |
| `showQuota` | 配额使用情况 |
| `showAgent` | 当前 Agent 名称 |
| `showCodeChanges` | 代码变更统计（未文档化） |
| `showUsername` | GitHub 用户名（未文档化） |
| `showCustom` | **启用/禁用自定义 statusLine**（未文档化） |

### stdin JSON 数据结构

基于 Claude Code 的 statusLine API（Copilot 采用相同机制），stdin 传入的 JSON 包含：

```typescript
interface StdinData {
  transcript_path?: string;     // 对话日志文件路径（JSONL 格式）
  cwd?: string;                 // 当前工作目录
  model?: {
    id?: string;                // 如 "claude-opus-4.6"
    display_name?: string;      // 如 "Claude Opus 4.6"
  };
  context_window?: {
    context_window_size?: number;     // 总上下文窗口大小
    current_usage?: {
      input_tokens?: number;
      output_tokens?: number;
    };
    used_percentage?: number | null;  // 已用百分比
  };
  cost?: {
    total_cost_usd?: number | null;
  } | null;
  rate_limits?: {
    five_hour?: { used_percentage?: number; resets_at?: number } | null;
    seven_day?: { used_percentage?: number; resets_at?: number } | null;
  } | null;
  effort?: string | { level?: string } | null;
}
```

> ⚠️ Copilot CLI 的实际字段可能与 Claude Code 有差异，需要通过探测脚本实测确认。

## 实现方式

### 方式一：statusLine.command（原生嵌入） ✅ 推荐

**原理**：Copilot CLI 周期性调用脚本，脚本 stdout 渲染到状态栏。

**效果**：
```
┌──────────────────────────────────────────┐
│  Copilot CLI 主界面                        │
│  ...对话内容...                            │
│──────────────────────────────────────────│
│ ⟳ 2 tasks | ✓ 1 done | 45% ctx | opus  │  ← 自定义状态栏
└──────────────────────────────────────────┘
```

**步骤**：

1. 创建渲染脚本：

```bash
#!/bin/bash
# ~/.copilot/statusline/status.sh
INPUT=$(cat)

# 用 jq 或 node 解析 stdin JSON
MODEL=$(echo "$INPUT" | jq -r '.model.id // "unknown"')
CTX=$(echo "$INPUT" | jq -r '.context_window.used_percentage // 0' | xargs printf "%.0f")
COST=$(echo "$INPUT" | jq -r '.cost.total_cost_usd // 0' | xargs printf "%.2f")

echo "🤖 $MODEL | 📊 ${CTX}% ctx | 💰 \$$COST"
```

2. 注册到 settings.json：

```json
{
  "statusLine": {
    "type": "command",
    "command": "/Users/you/.copilot/statusline/status.sh",
    "padding": 1
  },
  "footer": {
    "showCustom": true
  }
}
```

3. 重启 Copilot CLI 生效。

**优点**：零依赖、原生集成、无启动摩擦
**缺点**：只有一行空间，信息密度有限

### 方式二：Plugin Hooks 注入（对话流通知）

**原理**：利用 Copilot Plugin 的 hook 系统，在特定生命周期事件时注入信息到对话流。

**可用 hooks**：

| Hook | 触发时机 | 可阻断？ | 可注入内容？ |
|------|---------|---------|------------|
| `notification` | 后台任务完成（fire-and-forget） | ❌ | ✅ `additionalContext` |
| `subagentStop` | 子 agent 完成 | ✅ | ✅ 可 block + 注入 |
| `agentStop` | 主 agent 完成一轮 | ✅ | ✅ 可 block + 注入 |
| `preToolUse` | 工具调用前 | ✅ | ✅ 可 deny/modify |

**`notification` hook 示例**（监听后台任务完成）：

```json
// hooks.json
{
  "version": 1,
  "hooks": {
    "notification": [{
      "type": "command",
      "bash": "./scripts/on-notification.sh",
      "matcher": "agent_completed|shell_completed"
    }]
  }
}
```

脚本返回 `{ "additionalContext": "✅ 后台任务完成: ..." }` 注入对话。

**优点**：事件驱动、精准通知
**缺点**：不是可视面板，是文字注入到对话流

### 方式三：tmux 分屏 + TUI 监控（外部辅助）

**原理**：用 tmux 分屏，左边跑 Copilot CLI，右边跑独立的 TUI 监控程序。通过文件 IPC 通信。

**效果**：
```
┌──────────────────────────┬─────────────────┐
│  Copilot CLI              │ ╭─ Tasks ─────╮ │
│                          │ │ ⟳ Build (2m) │ │
│  > 你好...                │ │ ✓ Tests done │ │
│                          │ │ ○ Deploy     │ │
│                          │ ╰─────────────╯ │
│                          │ Context: 45%    │
│                          │ Model: opus     │
└──────────────────────────┴─────────────────┘
```

**架构**：

```
Copilot Skill/Hook              监控 TUI（Bubbletea/Textual）
─────────────────               ─────────────────────────────
写 task-state.json              每 500ms 轮询 task-state.json
(atomic rename)          →      解析 → 渲染面板
```

**IPC 方案对比**：

| 方案 | 延迟 | 可靠性 | 复杂度 |
|------|------|--------|--------|
| JSON 文件轮询 | 500ms | ✅ 断线恢复 | 低 |
| JSONL 事件日志 | ~10ms | ✅ 历史回溯 | 中 |
| Named Pipe (FIFO) | <1ms | ❌ 必须先启动读端 | 低 |
| Unix Domain Socket | <1ms | ❌ 服务端必须在线 | 高 |

**TUI 框架推荐**：

| 框架 | 语言 | 特点 | 推荐场景 |
|------|------|------|---------|
| **Bubbletea** | Go | 单二进制、Elm 架构、零依赖 | ✅ 生产部署 |
| Textual | Python | CSS 布局、快速原型 | 快速验证 |
| Rich Live | Python | 轻量表格渲染 | 最小实现 |
| Sampler | YAML 配置 | 零代码、brew 安装 | 演示 |

**启动脚本示例**：

```bash
#!/usr/bin/env bash
SESSION="copilot"
tmux has-session -t "$SESSION" 2>/dev/null && exec tmux attach -t "$SESSION"
tmux new-session -d -s "$SESSION"
tmux split-window -h -l 35 -t "$SESSION:0"
tmux send-keys -t "$SESSION:0.1" "copilot-task-watch" Enter
tmux select-pane -t "$SESSION:0.0"
tmux attach -t "$SESSION"
```

**优点**：信息量最大、完整面板、可扩展
**缺点**：需要 tmux + TUI 程序、启动方式改变

## Claude HUD 参考实现

[jarrodwatts/claude-hud](https://github.com/jarrodwatts/claude-hud) 是 Claude Code 的 statusLine 插件，架构值得参考：

```
Claude Code
    ↓ stdin JSON（模型、上下文、费用）
    ↓
  node dist/index.js
    ↓ 读取 transcript_path → 解析 JSONL 对话日志
    ↓ 提取 TodoWrite/TaskCreate 等工具调用 → 构建任务列表
    ↓
  stdout → ANSI 字符串 → 渲染到 Claude Code 状态栏
```

**关键设计**：
- 零运行时依赖（纯 Node.js 内置模块 + ANSI 转义码）
- 数据来源：stdin JSON + transcript JSONL 文件
- 每次 UI 刷新时 fork 执行，不是常驻进程

## 方案对比总结

| 维度 | statusLine.command | Plugin Hooks | tmux + TUI |
|------|-------------------|-------------|-----------|
| **原生度** | ⭐⭐⭐ 内嵌状态栏 | ⭐⭐⭐ 对话流注入 | ⭐ 外部进程 |
| **信息量** | ⭐ 一行 | ⭐⭐ 文字段落 | ⭐⭐⭐ 完整面板 |
| **实时性** | ⭐⭐⭐ UI 刷新周期 | ⭐⭐ 事件触发 | ⭐⭐ 500ms 轮询 |
| **依赖** | 无（bash/node） | 无（plugin hooks.json） | tmux + Go/Python |
| **启动摩擦** | 无 | 无 | 必须走 tmux 脚本 |
| **开发复杂度** | 低（一个脚本） | 中（hook + 脚本） | 高（3-4 个组件） |
| **适用场景** | 日常监控 | 关键事件通知 | 完整任务管理面板 |

### 推荐策略

```
Phase 1 → statusLine.command
          成本最低，先用起来，验证需求

Phase 2 → + Plugin Hooks（可选）
          补充关键事件的主动通知

Phase 3 → + tmux TUI（按需）
          如果一行状态栏不够用，再加完整面板
```

## 相关资源

- [Copilot CLI 配置目录参考](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference)
- [Copilot CLI Hooks 参考](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-hooks-reference)
- [Copilot CLI Plugin 创建指南](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-creating)
- [Claude HUD 源码](https://github.com/jarrodwatts/claude-hud)
- [Bubbletea TUI 框架](https://github.com/charmbracelet/bubbletea)
- [Textual Python TUI](https://github.com/Textualize/textual)
