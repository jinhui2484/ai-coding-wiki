# Claude Agent 入门指南

> 基于 Anthropic 官方文档整理，结合实际使用经验
>
> 官方参考：
> - [Tool Use Overview](https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview)
> - [How Tool Use Works](https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/how-tool-use-works)
> - [Agent SDK](https://code.claude.com/docs/en/agent-sdk/overview)
> - [Subagents](https://code.claude.com/docs/en/sub-agents)
>
> 更新：2026-05-03

---

## 一、什么是 Agent

### 官方定义

> An AI agent is a system that uses a language model to **direct its own processes and tool usage** to accomplish a goal.
> — Anthropic 官方文档

关键词：**主动引导自身的执行过程**。Agent 不是被动回答，而是主动决策、调用工具、反复推进，直到完成目标。

### 和普通对话的区别

```
普通对话
  你：帮我看看 auth.swift 有没有问题
  Claude：我无法直接读取文件，请把内容粘贴给我

Agent（有工具）
  你：帮我看看 auth.swift 有没有问题
  Claude：→ 调用 Read 工具读取文件
         → 发现第 42 行有个 force unwrap
         → 调用 Grep 搜索是否有其他地方有类似问题
         → 汇总给你完整的安全问题报告
```

---

## 二、Tool Use：Agent 的行动能力

没有工具，Claude 只能说话；有了工具，Claude 才能真正"做事"。

官方把工具分为三类，区别在于**谁来执行**：

### 类型 1：用户自定义工具（User-defined Tools）

你写工具的描述和参数格式，Claude 决定何时调用，你负责实际执行并返回结果。

**适合：** 调你自己的数据库、内部接口、业务逻辑。

```python
tools = [{
    "name": "get_device_status",
    "description": "查询指定设备的在线状态",
    "input_schema": {
        "type": "object",
        "properties": {
            "device_id": {"type": "string", "description": "设备 ID"}
        },
        "required": ["device_id"]
    }
}]
# Claude 分析后决定要调这个工具
# 你接到 tool_use 响应，自己去查数据库，把结果返回给 Claude
```

### 类型 2：Anthropic 内置工具（Anthropic-schema Tools）

工具 schema 由 Anthropic 预定义，你只负责执行。Claude 针对这些工具专门训练过，比同等功能的自定义工具更可靠。

| 工具 | 作用 |
|------|------|
| `bash` | 执行 shell 命令 |
| `text_editor` | 查看和编辑文件（view / str_replace / undo_edit） |
| `computer` | 控制鼠标、键盘、截图（计算机控制场景） |
| `memory` | 保存和读取跨会话记忆 |

> Claude Code 里 Claude 读文件、改代码、跑命令，用的就是这类工具。

### 类型 3：服务端工具（Server-executed Tools）

由 Anthropic 服务器执行，你只收到最终结果，看不到过程。

| 工具 | 作用 |
|------|------|
| `web_search` | 搜索网页 |
| `web_fetch` | 抓取网页内容 |
| `code_execution` | 在沙盒中运行代码 |
| `tool_search` | 从工具库中搜索合适的工具 |

::: warning 注意
服务端工具执行中可能返回 `stop_reason: "pause_turn"`，表示内部还没结束，你需要重新发送请求让它继续。
:::

### 什么时候用 Tool Use

**适合用：**
- 有副作用的操作（写文件、发消息、更新数据库）
- 需要实时数据（天气、价格、数据库记录）
- 需要强制结构化输出（特定 JSON 字段）
- 调用已有系统（内部 API、文件系统）

**不适合用：**
- 模型自身能回答的（总结、翻译、常识问题）
- 一次性问答，无副作用
- 工具调用延迟超过实际收益时

---

## 三、Agentic Loop：Agent 是怎么工作的

这是理解 Agent 最核心的部分。

### 完整执行循环

```
① 你发送：request + tools 列表 + 用户消息
         ↓
② Claude 分析后返回：
   - stop_reason: "tool_use"  → 要调工具
   - stop_reason: "end_turn"  → 完成了
         ↓（如果是 tool_use）
③ 你执行工具，得到结果
         ↓
④ 把结果包装成 tool_result，加入对话，重新发送
         ↓
   回到 ②，循环直到 end_turn
```

### 代码示例（Python，最小可运行版）

```python
import anthropic

client = anthropic.Anthropic()

tools = [...]        # 你定义的工具列表
messages = [{"role": "user", "content": "帮我检查 main.swift 的代码质量"}]

while True:
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        tools=tools,
        messages=messages
    )

    # 任务完成
    if response.stop_reason == "end_turn":
        print(response.content[0].text)
        break

    # Claude 要调工具
    if response.stop_reason == "tool_use":
        tool_block = next(b for b in response.content if b.type == "tool_use")

        # 你来执行工具逻辑
        result = my_execute(tool_block.name, tool_block.input)

        # 把结果塞回对话，继续循环
        messages.append({"role": "assistant", "content": response.content})
        messages.append({
            "role": "user",
            "content": [{
                "type": "tool_result",
                "tool_use_id": tool_block.id,
                "content": result
            }]
        })
```

::: tip 生产环境建议
给循环加 `maxTurns` 上限，防止因提示词模糊导致 Agent 无限循环消耗 token。
:::

---

## 四、Claude Code 中的 Subagent

### 官方定义

> Subagents are specialized AI assistants that handle specific types of tasks. They run in **their own context window** with custom system prompts, specific tool access, and independent permissions.

关键点：**独立上下文窗口**。子 Agent 和主 Agent 不共享记忆，只有返回值会传回主 Agent。

### 三个内置 Subagent

| 代理 | 模型 | 工具权限 | 用途 |
|------|------|----------|------|
| `Explore` | Haiku（轻量快速） | 只读 | 代码库探索、文件发现 |
| `Plan` | 继承主模型 | 只读 | Plan mode 的分析规划阶段 |
| `General-purpose` | 继承主模型 | 全部工具 | 复杂多步骤任务 |

### 为什么需要 Subagent

**1. 保护主上下文**
主 Agent 上下文有大小限制。读大量文件时，交给子 Agent 处理，只把关键结论返回，主上下文不被撑满。

**2. 并行加速**
多个子 Agent 同时工作，互不等待。比如同时分析三个模块的代码，比串行快三倍。

**3. 权限最小化**
只读任务用只读子 Agent，减少误操作风险。

### 前台 vs 后台运行

| 模式 | 行为 | 适用场景 |
|------|------|----------|
| **前台** | 阻塞主对话，实时显示权限弹窗 | 需要用户确认的任务 |
| **后台** | 并发执行，需提前预批准权限；工具失败时局部失败，不中断主 Agent | 独立的并行任务 |

> **经验：** 后台 Agent 适合"跑测试"、"搜索文档"这类不需要你介入的任务，但要注意提前在权限设置里授权好工具。

---

## 五、自定义 Subagent

### 文件位置与优先级

官方定义的优先级（从高到低）：

```
1. 组织级设置（org-managed，最高）
2. CLI --agent 参数（会话级）
3. .claude/agents/      ← 项目级，日常推荐放这里
4. ~/.claude/agents/    ← 用户全局级
5. 插件（最低）
```

同名 Agent 以更高优先级的为准。

### 配置格式

文件格式：Markdown + YAML Frontmatter

```markdown
---
name: code-reviewer
description: 代码 review 专家，分析代码质量、安全性和可维护性。当用户要求 review 代码或 PR 时调用。
tools: Read, Grep, Glob, Bash
model: inherit
permissionMode: default
maxTurns: 10
---

你是一个资深代码 reviewer，专注于代码质量和安全性。

执行时：
1. 先运行 `git diff` 查看最新改动
2. 聚焦被修改的文件
3. 立即开始分析，不问用户

按优先级输出反馈：
- 严重问题（必须修复）
- 警告（应该修复）
- 建议（可以考虑）

每条问题附上具体修复示例。
```

### 关键字段一览

| 字段 | 说明 | 常用值 |
|------|------|--------|
| `name` | 代理名称，必填 | 英文短横线命名 |
| `description` | **最重要的字段**，Claude 靠这个判断何时调用，要写清触发场景 | 详细说明 |
| `tools` | 允许的工具 | `Read, Edit, Bash, Grep, Glob` |
| `disallowedTools` | 禁用的工具 | 工具名列表 |
| `model` | 使用的模型 | `inherit` / `sonnet` / `haiku` / `opus` |
| `permissionMode` | 权限模式 | `default` / `acceptEdits` / `auto` / `bypassPermissions` |
| `memory` | 持久知识库 | `user` / `project` / `local` |
| `maxTurns` | 最大执行轮次，防止无限循环 | 数字，建议设 10-30 |
| `isolation` | 在 git worktree 中隔离运行 | `worktree` |
| `background` | 是否后台运行 | `true` / `false` |

### 三种调用方式

```bash
# 1. 自然语言 — Claude 根据 description 自动判断是否调用
"帮我 review 一下这次改动"

# 2. @-mention — 强制指定，保证一定用这个代理
@"code-reviewer (agent)" 看一下 auth.swift

# 3. 会话级绑定 — 整个会话默认使用
claude --agent code-reviewer
```

---

## 六、Agent SDK：在代码里用 Agent

适合场景：CI/CD 自动化、后端服务集成、自定义 Agent 工作流

### 与其他方式对比

| 方式 | 适用场景 | 执行环境 |
|------|----------|----------|
| **Agent SDK** | CI/CD、自动化流水线、生产服务 | 你的服务器/进程 |
| **Claude Code CLI** | 交互式开发、临时任务 | 开发机终端 |
| **Client SDK（直接 API）** | 需要完全自定义控制 | 自己实现 tool loop |
| **Managed Agents** | 长期异步任务 | Anthropic 托管基础设施 |

### 快速示例（Python）

```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions

async def main():
    async for message in query(
        prompt="找到 auth.py 中的 bug 并修复",
        options=ClaudeAgentOptions(
            allowed_tools=["Read", "Edit", "Bash"]
        ),
    ):
        print(message)

asyncio.run(main())
```

### 核心特性

**内置工具（开箱即用）**

| 工具 | 作用 |
|------|------|
| `Read` / `Write` / `Edit` | 文件读写 |
| `Bash` | 执行 shell 命令 |
| `Glob` / `Grep` | 文件和内容搜索 |
| `WebSearch` / `WebFetch` | 网络操作 |
| `AskUserQuestion` | 向用户提问（交互场景） |
| `Agent` | 启动子 Agent（在 `allowed_tools` 里加上这个就能派子代理） |

**Hooks（生命周期钩子）**

```python
hooks = {
    "PreToolUse":  my_validator,   # 工具调用前：验证/拦截
    "PostToolUse": my_logger,      # 工具调用后：记录日志
    "Stop":        my_cleanup,     # 任务结束时：清理资源
}
```

**会话持久化**

```python
# 第一次：保存 session_id
result = await query(prompt="分析这个项目的架构")
session_id = result.session_id

# 下次：恢复上下文继续工作
await query(
    prompt="基于刚才的架构分析，帮我补充测试用例",
    session_id=session_id
)
```

---

## 七、实战速查

### 触发并行 Subagent

```
帮我分析 ViewController、ViewModel、Repository 三个文件的依赖关系
```

Claude 会自动判断可以并行，派三个子 Agent 同时读取，汇总结果。你不需要做任何额外操作。

### 大规模修改用 /batch

```
/batch 把所有文件里的 NSLog 替换为 WZLog
```

内部流程：拆分任务 → 多子 Agent 在隔离 worktree 并行执行 → 汇总。适合跨文件批量改动。

### 先规划再执行用 /plan

```
/plan 新增蓝牙设备绑定流程，支持蓝牙和 WiFi 两种方式
```

进入 Plan 模式：只读分析，不动代码，输出完整方案。你确认后再执行，避免走偏。

### 跨仓库工作

```
/add-dir ~/Desktop/Wyze/wyze-wpk-ios
帮我看 wpk 的网络层怎么实现的，我要在插件里复用
```

先用 `/add-dir` 把其他仓库加进当前会话，Claude 就能跨目录读取了。

### 自定义 Subagent 的典型结构

```
.claude/agents/
├── code-reviewer.md     # 代码 review 专家
├── test-writer.md       # 单测生成专家
└── doc-writer.md        # 注释和文档专家
```

---

## 八、常见误区

| 误区 | 正确理解 |
|------|----------|
| 子 Agent 和主 Agent 共享上下文 | **不共享。** 子 Agent 有独立上下文窗口，结束后只有返回值传给主 Agent |
| Agent 一定能完成任务 | Agent 会出错。生产环境必须设 `maxTurns` 防无限循环，复杂任务要人工复查 |
| 工具越多给 Agent 越好 | 只给完成任务所需的最小工具集，减少误操作和 token 消耗 |
| 后台 Agent 失败会中断主流程 | 后台 Agent 工具调用失败是局部失败，不影响主 Agent 继续运行 |
| 服务端工具和普通工具一样 | 服务端工具由 Anthropic 执行，你看不到过程，且可能返回 `pause_turn` 需要续发请求 |
| `description` 随便写就行 | description 是 Claude 决定"是否调用这个子 Agent"的唯一依据，写得模糊会导致该触发时不触发 |

---

## 三个概念的关系

```
Tool Use
  └── 让 Claude 能"做事"的基础机制
        └── 三类工具：用户自定义 / Anthropic内置 / 服务端执行

Agentic Loop
  └── 反复调用工具、推进任务的执行模式
        └── 本质：tool_use → 执行 → tool_result → 继续思考 → 循环

Subagent
  └── 在主 Agent 之下运行的专职子 Agent
        └── 独立上下文 + 专属工具权限 + 专属系统提示
        └── 解决：上下文限制 / 并行提速 / 权限隔离
```
