# Copilot CLI 终端任务监控：三种方案详解

## 一、背景与需求

Copilot CLI 在执行复杂任务时，并不是单线程地只输出一段文本。

当你要求它并行调研、跑命令、调用 subagent、执行 shell command 时，CLI 内部会派发多类后台工作：

- `background task`：独立 agent 在子上下文里工作
- `shell command`：可能同步执行，也可能后台执行
- `notification`：后台任务完成、idle、shell 结束时触发系统通知
- `agent turn`：主 agent 每轮完成后会刷新一次 UI

内置 `/tasks` 命令确实能看任务列表，但它有两个天然限制：

1. 需要手动输入，不能持续显示
2. 展示方式是覆盖式弹窗，不适合一边盯任务一边继续对话

所以真正的需求不是“能不能看任务”，而是：

- 在终端里**持续可见**地看到任务状态
- 同时看到上下文占用、当前模型、费用等运行指标
- 尽量不打断 Copilot CLI 的正常交互
- 能按需求从“轻量概览”升级到“完整仪表盘”

这就对应三条实现路线：

1. 用 `statusLine.command` 做原生底部状态栏
2. 用 Plugin Hooks 做事件驱动通知
3. 用 `tmux + TUI + 文件 IPC` 做独立监控面板

---

## 二、底层原理

### 2.1 `statusLine.command` 机制

Copilot CLI 的主配置文件是 `~/.copilot/settings.json`。文档确认这是用户级全局配置入口，自定义设置都放在这里。

其中 `statusLine` 支持把一个外部命令挂到终端底部状态栏：

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

这里有两个关键点：

- `type: "command"`：告诉 Copilot CLI，这不是静态文本，而是要执行一个脚本
- `command`：脚本路径，CLI 刷新 UI 时会调用它

它的工作链路可以理解成：

```text
Copilot CLI 渲染循环
       ↓
fork/exec statusLine.command 指向的脚本
       ↓
把当前 session 状态 JSON 写入脚本 stdin
       ↓
脚本解析 JSON，并把一行文本写到 stdout
       ↓
Copilot CLI 把 stdout 渲染到底部状态栏
```

stdin 里的 JSON 通常包含这些信息：

- `model`：当前模型 ID / 显示名
- `context_window`：上下文总量、当前使用量、已用百分比
- `cost`：当前 session 花费
- `rate_limits`：配额或时间窗使用情况
- `transcript_path`：会话 transcript JSONL 文件路径
- `cwd`：当前工作目录

`footer.showCustom: true` 的作用，是显式打开底部自定义区域。没有它，即使 `statusLine.command` 已经配置，终端底部也不一定显示脚本输出。

这一套机制与 Claude Code 的 `statusLine` API 是同一类工作方式：**脚本不是常驻进程，而是每次 UI 刷新时被重新执行一次**。这也是为什么 [claude-hud](https://github.com/jarrodwatts/claude-hud) 能靠“读 stdin JSON + 读 transcript JSONL”实现实时 HUD，而不需要额外守护进程。

#### 为什么它适合做“概览型监控”

因为它有三个天然优势：

1. **原生嵌入**：直接显示在 Copilot CLI 底部，不改变使用习惯
2. **零窗口切换**：你不用开第二个 pane
3. **成本低**：一个脚本就能跑起来

但它也有明确边界：

- 只能输出一小段文本
- 更适合摘要，不适合详细列表
- 任务状态如果很多，必须自己做聚合

---

### 2.2 Plugin Hooks 系统

Copilot CLI 提供 Hook 生命周期机制，可以在特定事件发生时执行外部命令。官方文档给出的 hook 配置格式如下：

```json
{
  "version": 1,
  "hooks": {
    "notification": [
      {
        "type": "command",
        "bash": "your-bash-command",
        "timeoutSec": 30
      }
    ]
  }
}
```

Hook 的本质不是“画 UI”，而是“在生命周期节点拦截事件”。

对任务监控最关键的三个事件是：

- `notification`：系统通知事件，异步触发，不阻塞主会话
- `subagentStop`：子 agent 完成
- `agentStop`：主 agent 完成一轮

其中 `notification` 最适合做后台任务通知，因为它支持 `matcher` 过滤通知类型。和任务监控直接相关的 matcher 包括：

- `agent_completed`
- `shell_completed`
- `shell_detached_completed`
- `agent_idle`

也就是说，你可以只监听“后台任务结束”和“进入 idle”这类事件，而不用处理所有 Hook。

Hook 输入是 JSON，脚本从 stdin 读取。对任务监控常见的字段有：

- `notification_type`
- `title`
- `message`
- `transcriptPath`
- `agentName`
- `cwd`
- `sessionId`

Hook 输出同样是 JSON，最常用的两类返回值是：

```json
{ "additionalContext": "..." }
```

和：

```json
{ "decision": "block", "reason": "..." }
```

它们分别对应两种能力：

1. `additionalContext`：把信息注入到对话流，等价于“系统补充说明”
2. `decision: "block"`：阻断当前结束动作，并强制 agent 再报告一轮

#### 为什么 Hook 适合做“事件型监控”

因为 Hook 不是按刷新频率执行，而是按事件触发：

- 子任务完成了才通知
- shell 结束了才通知
- agent idle 了才通知

这意味着它特别适合：

- 主动播报关键事件
- 把任务结果写入日志或状态文件
- 给后续状态栏 / TUI 提供数据源

但它不适合单独承担“持续可见面板”的职责，因为 Hook 的输出默认是**注入对话流**，不是常驻 UI。

---

### 2.3 `tmux` 分屏 + 文件 IPC

如果一行状态栏不够用，就要把“任务监控”从 Copilot CLI 主界面里拆出来，变成独立面板。

最稳妥的做法是：

- 左侧 pane 跑 Copilot CLI
- 右侧 pane 跑独立 TUI 监控程序
- 两者通过文件进行 IPC

这里的 IPC 不建议直接上 socket、named pipe，原因很简单：任务监控要求的是**稳定**，不是极限低延迟。

文件 IPC 的典型链路如下：

```text
Copilot Hook / Skill
       ↓
写入 events.jsonl / task-state.json
       ↓
TUI 进程轮询或 tail 文件
       ↓
解析 JSON
       ↓
渲染任务列表、上下文、模型、成本
```

之所以推荐“状态快照 + 事件日志”双文件，是因为两者职责不同：

- `events.jsonl`：保留事件历史，便于追溯
- `task-state.json`：保存当前快照，便于快速渲染

#### 为什么文件 IPC 最实用

1. **断线可恢复**：TUI 重启后直接读文件即可恢复状态
2. **解耦**：Copilot 和面板不需要直接通信
3. **好调试**：`cat` 一下文件就能看到数据对不对
4. **易扩展**：后续可以从 shell 版 TUI 换成 Bubbletea，而不改 Hook 写入逻辑

这套方案的代价也最明显：

- 你需要维护额外脚本
- 启动方式从 `copilot` 变成 `copilot-hud`
- 系统组件更多，但能力最强

---

## 三、方案一：`statusLine.command`（原生状态栏）

### 效果预览

```text
┌──────────────────────────────────────────┐
│  Copilot CLI 主界面                        │
│  ...对话内容...                            │
│──────────────────────────────────────────│
│ 🤖 opus | 📊 45% ctx | ⟳ 2 bg | ✓ 1 done │  ← 自定义状态栏
└──────────────────────────────────────────┘
```

### 适用场景

适合先快速落地一个“始终可见”的概览栏，重点看：

- 当前模型
- 上下文使用率
- 后台任务运行数 / 完成数
- 费用或限额信息

如果你的目标是“低成本先用起来”，优先做这一种。

### 完整实现步骤

#### Step 1：创建探测脚本，先确认 Copilot 实际传入什么 JSON

先不要急着写正式脚本，第一步是抓真实 stdin。

```bash
mkdir -p ~/.copilot/statusline
cat > ~/.copilot/statusline/probe.sh << 'EOF'
#!/bin/bash
INPUT=$(cat)
echo "$INPUT" > "$HOME/.copilot/statusline/stdin-dump.json"
echo "📡 probe active"
EOF
chmod +x ~/.copilot/statusline/probe.sh
```

这一步的目的不是显示信息，而是验证两个事实：

1. `statusLine.command` 是否真的被执行了
2. stdin JSON 的字段名到底是什么

#### Step 2：把探测脚本注册到 `settings.json`

> `settings.json` 官方上支持 JSONC。如果你文件里有注释，下面这段 `python3` 会失败；此时先手动去掉注释，或改用你自己的 JSONC 编辑方式。下面命令按“文件内容是合法 JSON”处理。

```bash
python3 -c "
import json
from pathlib import Path
p = Path.home() / '.copilot' / 'settings.json'
with open(p) as f:
    cfg = json.load(f)
cfg['statusLine'] = {
    'type': 'command',
    'command': str(Path.home() / '.copilot' / 'statusline' / 'probe.sh'),
    'padding': 1
}
cfg.setdefault('footer', {})['showCustom'] = True
with open(p, 'w') as f:
    json.dump(cfg, f, indent=2, ensure_ascii=False)
"
```

#### Step 3：重启 Copilot CLI，检查探测结果

重新启动 Copilot CLI 后执行：

```bash
cat ~/.copilot/statusline/stdin-dump.json | python3 -m json.tool
```

你需要重点确认这些字段是否存在：

- `.model.id`
- `.context_window.used_percentage`
- `.cost.total_cost_usd`
- `.transcript_path`
- `.rate_limits`

如果字段路径和示例不同，以你机器里抓到的实际字段为准。

#### Step 4：准备任务状态文件

`statusLine.command` 本身只拿得到 session 信息，拿不到你想展示的完整任务列表，所以要给它一个额外数据源。

先创建一个最小状态文件：

```bash
cat > ~/.copilot/statusline/task-state.json << 'EOF'
{
  "tasks": []
}
EOF
```

后续可以让 Hook 去更新这个文件；现在先让状态栏具备“读取任务快照”的能力。

#### Step 5：编写正式渲染脚本

依赖：`jq`

```bash
brew install jq
```

创建正式脚本：

```bash
cat > ~/.copilot/statusline/status.sh << 'EOF'
#!/bin/bash
INPUT=$(cat)
TASKS_FILE="$HOME/.copilot/statusline/task-state.json"

MODEL=$(echo "$INPUT" | jq -r '.model.id // .model // "unknown"' 2>/dev/null)
CTX_RAW=$(echo "$INPUT" | jq -r '.context_window.used_percentage // 0' 2>/dev/null)
COST_RAW=$(echo "$INPUT" | jq -r '.cost.total_cost_usd // 0' 2>/dev/null)

CTX_PCT=$(printf '%.0f' "${CTX_RAW:-0}" 2>/dev/null || echo 0)
COST=$(printf '%.2f' "${COST_RAW:-0}" 2>/dev/null || echo 0.00)

RUNNING=0
DONE=0
FAILED=0

if [[ -f "$TASKS_FILE" ]]; then
  RUNNING=$(jq '[.tasks[]? | select(.status == "running")] | length' "$TASKS_FILE" 2>/dev/null || echo 0)
  DONE=$(jq '[.tasks[]? | select(.status == "done")] | length' "$TASKS_FILE" 2>/dev/null || echo 0)
  FAILED=$(jq '[.tasks[]? | select(.status == "failed")] | length' "$TASKS_FILE" 2>/dev/null || echo 0)
fi

printf '🤖 %s | 📊 %s%% ctx | ⟳ %s bg | ✓ %s done | ✗ %s fail | 💰 $%s\n' \
  "$MODEL" "$CTX_PCT" "$RUNNING" "$DONE" "$FAILED" "$COST"
EOF
chmod +x ~/.copilot/statusline/status.sh
```

#### Step 6：把 `settings.json` 指向正式脚本

```bash
python3 -c "
import json
from pathlib import Path
p = Path.home() / '.copilot' / 'settings.json'
with open(p) as f:
    cfg = json.load(f)
cfg.setdefault('statusLine', {})['type'] = 'command'
cfg['statusLine']['command'] = str(Path.home() / '.copilot' / 'statusline' / 'status.sh')
cfg['statusLine']['padding'] = 1
cfg.setdefault('footer', {})['showCustom'] = True
with open(p, 'w') as f:
    json.dump(cfg, f, indent=2, ensure_ascii=False)
"
```

#### Step 7：验证状态栏是否正常显示

重启 Copilot CLI 后，底部应该能看到类似输出：

```text
🤖 claude-opus-4.6 | 📊 12% ctx | ⟳ 0 bg | ✓ 0 done | ✗ 0 fail | 💰 $0.00
```

如果看不到：

1. 确认 `footer.showCustom` 为 `true`
2. 手动执行脚本确认它有 stdout
3. 检查 `stdin-dump.json` 是否有内容
4. 确认 `status.sh` 有执行权限

### 底层原理补充

这套方案能成立，本质上是因为 **Copilot CLI 把状态栏当成“可执行渲染器”而不是“静态模板”**。

也就是说，CLI 自己不关心你输出的是模型、任务数，还是 Git 信息；它只做两件事：

1. 把当前 session 的运行时数据喂给脚本
2. 把脚本返回的一行文本嵌回终端底部

所以你真正要做的，不是“改 Copilot 的 UI”，而是“写一个把 JSON 转成摘要文本的渲染器”。

### Claude HUD 参考

[jarrodwatts/claude-hud](https://github.com/jarrodwatts/claude-hud) 是 Claude Code 上成熟的同类实现，值得直接借鉴它的架构思路：

- 每次 UI 刷新时执行一次，不是守护进程
- 数据来源是 `stdin JSON + transcript JSONL`
- 用脚本自己做聚合，再输出一行或多行 HUD
- 零额外窗口，完全嵌在底部状态栏

如果你后面想把“工具活动、agent 名称、todo 进度”也塞进状态栏，可以继续往 `transcript_path` 方向扩展。

---

## 四、方案二：Plugin Hooks 注入（对话流通知）

### 效果预览

```text
User: 帮我并行执行这三个任务
Assistant: 已派发 3 个后台任务...
[系统注入] ✅ Task "build-auth" 完成 (耗时 12s，成功)
[系统注入] ✅ Task "write-tests" 完成 (耗时 8s，成功)
[系统注入] ❌ Task "deploy" 失败 (exit code 1)
```

### 适用场景

适合做“事件通知”和“状态采集”，重点不是持续显示，而是：

- 某个后台任务结束时立刻提示
- 把任务状态写入日志 / 状态文件
- 在对话流里补充系统说明

它尤其适合和方案一、方案三配合使用：**Hook 负责采集事件，状态栏或 TUI 负责展示结果。**

### 完整实现步骤

#### Step 1：创建 Plugin 目录结构

先按 Copilot CLI 官方插件结构建目录。插件至少要有 `plugin.json`，如果要加载 hook，还要在 manifest 里显式声明 `hooks` 文件。

```bash
mkdir -p ~/.copilot/plugins/task-monitor/scripts
```

目录结构最终应该是：

```text
~/.copilot/plugins/task-monitor/
├── plugin.json
├── hooks.json
└── scripts/
    ├── on-notification.sh
    └── on-subagent-stop.sh
```

#### Step 2：创建 `plugin.json`

保存到 `~/.copilot/plugins/task-monitor/plugin.json`：

```json
{
  "name": "task-monitor",
  "version": "1.0.0",
  "description": "后台任务状态通知插件",
  "author": {
    "name": "jinhui.zhang"
  },
  "hooks": "hooks.json"
}
```

这里最关键的是 `hooks: "hooks.json"`。没有这行，插件目录里即使有 `hooks.json`，Copilot CLI 也不会把它当成插件组件加载。

#### Step 3：创建 `hooks.json`

保存到 `~/.copilot/plugins/task-monitor/hooks.json`：

```json
{
  "version": 1,
  "hooks": {
    "notification": [
      {
        "type": "command",
        "bash": "$HOME/.copilot/plugins/task-monitor/scripts/on-notification.sh",
        "matcher": "agent_completed|shell_completed|shell_detached_completed|agent_idle",
        "timeoutSec": 10
      }
    ],
    "subagentStop": [
      {
        "type": "command",
        "bash": "$HOME/.copilot/plugins/task-monitor/scripts/on-subagent-stop.sh",
        "timeoutSec": 10
      }
    ],
    "agentStop": [
      {
        "type": "command",
        "bash": "$HOME/.copilot/plugins/task-monitor/scripts/on-subagent-stop.sh",
        "timeoutSec": 10
      }
    ]
  }
}
```

这样配置后：

- `notification` 只监听你关心的后台通知类型
- `subagentStop` 能在子 agent 完成时插入额外上下文
- `agentStop` 能在主 agent 一轮结束时补充说明或强制再报告一轮

#### Step 4：创建 `notification` 处理脚本

依赖：`jq`

```bash
brew install jq
```

保存到 `~/.copilot/plugins/task-monitor/scripts/on-notification.sh`：

```bash
#!/bin/bash
INPUT=$(cat)
TYPE=$(echo "$INPUT" | jq -r '.notification_type // .notificationType // "unknown"')
TITLE=$(echo "$INPUT" | jq -r '.title // ""')
MSG=$(echo "$INPUT" | jq -r '.message // ""')
TIMESTAMP=$(date '+%H:%M:%S')

case "$TYPE" in
  agent_completed)
    ICON="✅"
    ;;
  shell_completed)
    ICON="🔧"
    ;;
  shell_detached_completed)
    ICON="⚙️"
    ;;
  agent_idle)
    ICON="⏸️"
    ;;
  *)
    ICON="📡"
    ;;
esac

printf '{"additionalContext":"[%s] %s %s: %s %s"}\n' \
  "$TIMESTAMP" "$ICON" "$TYPE" "$TITLE" "$MSG"
```

这个脚本做了两件事：

1. 从 stdin 里解析通知类型和描述
2. 把一段结构化文本以 `additionalContext` 的形式返回给 Copilot CLI

返回后，这段内容会被注入对话流，效果就像“系统自动补充了一句任务状态”。

#### Step 5：创建 `subagentStop` / `agentStop` 处理脚本

保存到 `~/.copilot/plugins/task-monitor/scripts/on-subagent-stop.sh`：

```bash
#!/bin/bash
INPUT=$(cat)
AGENT=$(echo "$INPUT" | jq -r '.agentName // .agent_name // "agent"' 2>/dev/null)
STOP_REASON=$(echo "$INPUT" | jq -r '.stopReason // .stop_reason // "end_turn"' 2>/dev/null)
TIMESTAMP=$(date '+%H:%M:%S')

printf '{"decision":"allow","additionalContext":"[%s] 🤖 %s stopped (%s)"}\n' \
  "$TIMESTAMP" "$AGENT" "$STOP_REASON"
```

如果你只想放行，不注入任何额外说明，也可以把输出简化成：

```json
{"decision":"allow"}
```

如果你希望“子 agent 完成后，强制主 agent 汇总一次结果”，则改成：

```json
{
  "decision": "block",
  "reason": "请先汇总刚刚完成的 subagent 结果，再继续后续动作。"
}
```

#### Step 6：赋予脚本执行权限

```bash
chmod +x ~/.copilot/plugins/task-monitor/scripts/*.sh
```

#### Step 7：安装插件

按官方推荐方式安装本地插件：

```bash
copilot plugin install ~/.copilot/plugins/task-monitor
```

然后确认插件已经加载：

```bash
copilot plugin list
```

如果你修改了插件内容，需要重新执行一次安装命令，因为 Copilot CLI 会缓存插件组件。

#### Step 8：实际验证 Hook 是否生效

启动新的 Copilot CLI 会话后，做一次会触发后台任务的操作，例如并行子任务或后台 shell。

然后观察：

- 对话流里是否出现 `[系统注入]` 样式的附加说明
- `notification` 是否在后台任务完成时触发
- `subagentStop` 是否在子 agent 完成时触发

如果没有触发，优先检查：

1. `plugin.json` 是否声明了 `hooks`
2. `matcher` 是否写对了通知类型
3. 脚本是否有执行权限
4. 脚本 stdout 是否输出了合法 JSON

### 底层原理补充

Hook 和状态栏最大的区别是：

- 状态栏解决“**现在是什么状态**”
- Hook 解决“**刚刚发生了什么事件**”

所以 Hook 更像事件总线的消费者：

```text
CLI 生命周期事件 → Hook 脚本 → JSON 输出 → 注入上下文 / 阻断 / 记录日志
```

它不负责持续渲染，但非常适合做下面这些事：

- 给用户即时通知
- 更新 `task-state.json`
- 把事件写入 `events.jsonl`
- 在关键节点强制 agent 重新总结

也正因为如此，Hook 最适合做“中间层”，不是终端展示层本身。

---

## 五、方案三：`tmux` 分屏 + TUI 监控面板（外部辅助）

### 效果预览

```text
┌──────────────────────────┬─────────────────┐
│  Copilot CLI              │ ╭─ Tasks ─────╮ │
│                          │ │ ⟳ Build (2m) │ │
│  > 你好...                │ │ ✓ Tests done │ │
│                          │ │ ○ Deploy     │ │
│                          │ ╰─────────────╯ │
│                          │                 │
│                          │ Context: 45%    │
│                          │ Model: opus 4.6 │
│                          │ Cost: $0.12     │
└──────────────────────────┴─────────────────┘
```

### 适用场景

适合你已经不满足于“一行摘要”，需要：

- 看到完整任务列表
- 区分 running / done / failed
- 保留最近事件
- 同时显示 context、model、cost、时间
- 把 Copilot CLI 变成接近 IDE 面板的使用体验

### 完整实现步骤

#### Step 1：安装依赖

```bash
brew install tmux jq
```

#### Step 2：创建状态写入 Plugin

先建立目录：

```bash
mkdir -p ~/.copilot/plugins/task-panel/scripts
mkdir -p ~/.copilot/statusline
```

创建 `~/.copilot/plugins/task-panel/plugin.json`：

```json
{
  "name": "task-panel",
  "version": "1.0.0",
  "description": "为外部 TUI 面板写入任务状态",
  "author": {
    "name": "jinhui.zhang"
  },
  "hooks": "hooks.json"
}
```

创建 `~/.copilot/plugins/task-panel/hooks.json`：

```json
{
  "version": 1,
  "hooks": {
    "notification": [
      {
        "type": "command",
        "bash": "$HOME/.copilot/plugins/task-panel/scripts/write-state.sh",
        "matcher": "agent_completed|shell_completed|shell_detached_completed|agent_idle",
        "timeoutSec": 10
      }
    ],
    "subagentStart": [
      {
        "type": "command",
        "bash": "$HOME/.copilot/plugins/task-panel/scripts/write-state.sh",
        "timeoutSec": 10
      }
    ],
    "subagentStop": [
      {
        "type": "command",
        "bash": "$HOME/.copilot/plugins/task-panel/scripts/write-state.sh",
        "timeoutSec": 10
      }
    ]
  }
}
```

这里的思路很明确：**不把 Hook 输出给对话流，而是把事件落到文件里，供右侧 TUI 读。**

#### Step 3：创建状态写入脚本

保存到 `~/.copilot/plugins/task-panel/scripts/write-state.sh`：

```bash
#!/bin/bash
set -euo pipefail

INPUT=$(cat)
STATE_DIR="$HOME/.copilot/statusline"
EVENTS_FILE="$STATE_DIR/events.jsonl"
STATE_FILE="$STATE_DIR/task-state.json"
TMP_FILE="$STATE_DIR/task-state.json.tmp"

mkdir -p "$STATE_DIR"
touch "$EVENTS_FILE"

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
TYPE=$(echo "$INPUT" | jq -r '.notification_type // .notificationType // .type // "event"')
TITLE=$(echo "$INPUT" | jq -r '.title // .agentDisplayName // .agentName // .agent_name // ""')
MSG=$(echo "$INPUT" | jq -r '.message // ""')

STATUS="running"
case "$TYPE" in
  agent_completed|shell_completed|shell_detached_completed)
    STATUS="done"
    ;;
  agent_idle)
    STATUS="idle"
    ;;
  subagentStart)
    STATUS="running"
    ;;
  subagentStop)
    STATUS="done"
    ;;
esac

EVENT_JSON=$(jq -nc \
  --arg ts "$TIMESTAMP" \
  --arg type "$TYPE" \
  --arg title "$TITLE" \
  --arg msg "$MSG" \
  --arg status "$STATUS" \
  '{ts:$ts,type:$type,title:$title,msg:$msg,status:$status}')

echo "$EVENT_JSON" >> "$EVENTS_FILE"

tail -20 "$EVENTS_FILE" | jq -s '
  def normalize_task:
    {
      name: (.title // .type // "task"),
      status: (.status // "running"),
      ts: .ts,
      type: .type,
      msg: (.msg // "")
    };
  {
    updated_at: (now | todateiso8601),
    tasks: [ .[] | normalize_task ],
    events: .
  }
' > "$TMP_FILE"

mv "$TMP_FILE" "$STATE_FILE"

printf '{"decision":"allow"}\n'
```

这个脚本同时维护两份数据：

- `events.jsonl`：追加事件流
- `task-state.json`：覆盖当前快照

之所以先写临时文件再 `mv`，是为了做到原子更新，避免 TUI 正在读文件时读到半截 JSON。

#### Step 4：安装状态写入插件

```bash
chmod +x ~/.copilot/plugins/task-panel/scripts/write-state.sh
copilot plugin install ~/.copilot/plugins/task-panel
copilot plugin list
```

#### Step 5：创建 Shell 版 TUI 监控脚本

保存到 `~/.copilot/statusline/watch.sh`：

```bash
#!/bin/bash
STATE_FILE="$HOME/.copilot/statusline/task-state.json"
EVENTS_FILE="$HOME/.copilot/statusline/events.jsonl"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

render_header() {
  echo -e "${BOLD}╭─────────────────────────────╮${NC}"
  echo -e "${BOLD}│   🖥️  Copilot Task Monitor   │${NC}"
  echo -e "${BOLD}╰─────────────────────────────╯${NC}"
  echo ""
}

render_empty() {
  echo -e "  ${YELLOW}等待任务事件...${NC}"
  echo ""
  echo "  当 Copilot 派发后台任务、subagent 或 shell 命令时"
  echo "  右侧面板会自动刷新。"
}

render_tasks() {
  echo -e "${BOLD}  Tasks${NC}"
  echo "  ───────────────────────────"

  jq -r '.tasks[]? | [.status, .ts, .name] | @tsv' "$STATE_FILE" 2>/dev/null | tail -5 | while IFS=$'\t' read -r status ts name; do
    short_ts=$(echo "$ts" | sed 's/.*T//; s/Z//')
    case "$status" in
      running) icon="${BLUE}⟳${NC}" ;;
      done)    icon="${GREEN}✓${NC}" ;;
      failed)  icon="${RED}✗${NC}" ;;
      idle)    icon="${YELLOW}⏸${NC}" ;;
      *)       icon="○" ;;
    esac
    printf "  %b %-8s %s\n" "$icon" "$short_ts" "$name"
  done
}

render_events() {
  echo ""
  echo -e "${BOLD}  Recent Events${NC}"
  echo "  ───────────────────────────"

  tail -5 "$EVENTS_FILE" 2>/dev/null | while IFS= read -r line; do
    type=$(echo "$line" | jq -r '.type // ""')
    title=$(echo "$line" | jq -r '.title // ""')
    ts=$(echo "$line" | jq -r '.ts // ""' | sed 's/.*T//; s/Z//')
    printf "  %-8s %-10s %s\n" "$ts" "$type" "$title"
  done
}

while true; do
  clear
  render_header

  if [[ ! -f "$STATE_FILE" ]]; then
    render_empty
    sleep 1
    continue
  fi

  render_tasks
  render_events

  echo ""
  echo "  ───────────────────────────"
  echo "  更新于 $(date '+%H:%M:%S')"
  sleep 1
done
```

赋权：

```bash
chmod +x ~/.copilot/statusline/watch.sh
```

#### Step 6：创建 `tmux` 一键启动脚本

保存到 `~/.copilot/statusline/copilot-tmux.sh`：

```bash
#!/bin/bash
SESSION="copilot-hud"

if tmux has-session -t "$SESSION" 2>/dev/null; then
  exec tmux attach -t "$SESSION"
fi

tmux new-session -d -s "$SESSION" -x "$(tput cols)" -y "$(tput lines)"

tmux split-window -h -l 35 -t "$SESSION:0"

tmux send-keys -t "$SESSION:0.1" "$HOME/.copilot/statusline/watch.sh" Enter

tmux send-keys -t "$SESSION:0.0" "copilot" Enter

tmux select-pane -t "$SESSION:0.0"

tmux attach -t "$SESSION"
```

赋权：

```bash
chmod +x ~/.copilot/statusline/copilot-tmux.sh
```

#### Step 7：创建快捷命令

```bash
ln -sf ~/.copilot/statusline/copilot-tmux.sh /usr/local/bin/copilot-hud
```

后续直接执行：

```bash
copilot-hud
```

就会自动进入双 pane：

- 左侧：Copilot CLI
- 右侧：任务监控面板

#### Step 8：可选升级为 Bubbletea TUI

如果 Shell 版不够用，可以把右侧面板换成 Go + Bubbletea：

```bash
mkdir -p ~/.copilot/statusline/tui
cd ~/.copilot/statusline/tui
go mod init copilot-watch
go get github.com/charmbracelet/bubbletea
go get github.com/charmbracelet/lipgloss
```

Bubbletea 的优势是：

- 更稳定的刷新机制
- 更好的布局能力
- 更容易做颜色、框线、列表、筛选
- 最终可编译成单二进制，部署简单

### IPC 方案选择

| 方案 | 延迟 | 可靠性 | 适用场景 |
|------|------|--------|---------|
| JSON 文件轮询 | 500ms-1s | ✅ 断线恢复 | 推荐默认 |
| JSONL + tail -f | ~10ms | ✅ 历史回溯 | 需要事件流 |
| Named Pipe | <1ms | ❌ 读端必须先启动 | 极低延迟需求 |
| Unix Socket | <1ms | ❌ 服务端必须在线 | 双向通信 |

### 底层原理补充

这套方案本质上是在 Copilot CLI 外部再搭一个“观测层”：

- Copilot 本身继续专注对话和任务执行
- Hook 只负责把生命周期事件序列化
- TUI 负责把这些序列化结果持续渲染成面板

因此它不是在“修改 Copilot CLI”，而是在“给 Copilot CLI 加一个旁路观测界面”。

也是因为做了职责拆分，它的扩展空间最大：

- 右侧面板可以显示更多维度
- 后续可以接入日志、耗时、失败原因
- 甚至可以做筛选、排序、历史回放

---

## 六、方案对比总结

| 维度 | 方案一：statusLine | 方案二：Plugin Hooks | 方案三：tmux + TUI |
|------|-------------------|---------------------|-------------------|
| 原生度 | ⭐⭐⭐ 内嵌状态栏 | ⭐⭐⭐ 对话流注入 | ⭐ 外部进程 |
| 信息量 | ⭐ 一行摘要 | ⭐⭐ 文字段落 | ⭐⭐⭐ 完整面板 |
| 实时性 | ⭐⭐⭐ UI 刷新周期 | ⭐⭐ 事件触发 | ⭐⭐ 1s 轮询 |
| 额外依赖 | `jq`（或 `node`） | `jq` | `tmux` + `jq` |
| 启动摩擦 | 无（自动加载） | 无（自动加载） | 需用 `copilot-hud` 启动 |
| 开发复杂度 | 低（一个脚本） | 中（plugin + hooks + 脚本） | 高（4-5 个文件） |
| 可视化能力 | 纯文本一行 | 纯文本注入对话 | 框线 / 颜色 / 表格全支持 |
| 持续可见 | ✅ 始终在底部 | ❌ 混在对话流中 | ✅ 独立面板 |
| 数据来源 | session stdin JSON | 生命周期事件 JSON | 文件快照 + 事件日志 |
| 最适合承担的职责 | 运行概览 | 关键事件通知 / 数据采集 | 完整任务仪表盘 |
| 故障排查难度 | 低 | 中 | 中高 |
| 适用场景 | 日常监控概览 | 关键事件即时通知 | 完整任务管理仪表盘 |

### 资源与性能影响

| 维度 | 方案一：statusLine | 方案二：Plugin Hooks | 方案三：tmux + TUI |
|------|-------------------|---------------------|-------------------|
| **Token 消耗** | ❌ 不消耗 | ⚠️ 少量（`additionalContext` 注入对话上下文） | ❌ 不消耗 |
| **内存占用** | 可忽略（fork 执行完即退出） | 可忽略（事件触发，无常驻） | ~7MB（tmux server ~5MB + 监控脚本 ~2MB） |
| **CPU 占用** | 极低（UI 刷新时才调用） | 极低（事件触发） | 极低（每秒读一次文件） |
| **磁盘写入** | 无 | 事件日志（几 KB） | `task-state.json`（几 KB） |
| **网络流量** | 无 | 无 | 无 |
| **对 Copilot 对话的侵入性** | 无 | 有（注入文字到上下文，占用 token） | 无（完全独立进程） |

> **Token 影响说明**：方案一和方案三的监控逻辑完全运行在 Copilot CLI 之外（独立脚本/进程），不会进入对话上下文，因此**零 token 消耗**。方案二的 `additionalContext` 会作为系统消息注入到 Copilot 的对话流中，每次注入大约消耗几十到几百个 token，取决于通知内容长度。如果后台任务频繁，累积的 token 开销需要关注。

### 推荐策略

```text
Phase 1 → statusLine.command（先用起来）
Phase 2 → + Plugin Hooks（补充关键事件通知）
Phase 3 → + tmux TUI（按需，当一行状态栏不够用时）
```

三者并不冲突，反而是天然分层：

- `statusLine.command` 负责概览
- `Plugin Hooks` 负责事件采集和通知
- `tmux + TUI` 负责完整展示

如果你只选一种，优先选方案一；如果你想做成长期可维护的终端监控体系，最终形态通常是**方案一 + 方案二**，重度用户再叠加方案三。

---

## 七、相关资源

- Copilot CLI 配置目录参考：https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference
- Copilot CLI Hooks 参考：https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-hooks-reference
- Copilot CLI Plugin 创建：https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-creating
- Claude HUD 源码：https://github.com/jarrodwatts/claude-hud
- Bubbletea TUI 框架：https://github.com/charmbracelet/bubbletea
