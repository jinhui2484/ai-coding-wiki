# 如何创建 Agent

> 基于 Anthropic 官方文档
>
> 官方参考：
> - [Agents Overview](https://docs.anthropic.com/en/docs/agents-and-tools/agents-overview)
> - [Sub-agents](https://code.claude.com/docs/en/sub-agents)
> - [Agent SDK](https://code.claude.com/docs/en/agent-sdk/overview)
> - [Managed Agents](https://www.anthropic.com/engineering/managed-agents)
>
> 更新：2026-05-03

---

## 一、Agent 由什么组成

官方（[Managed Agents 架构文档](https://www.anthropic.com/engineering/managed-agents)）明确定义了四个核心组成部分：

```
┌──────────────────────────────────────────────────┐
│                    Agent                          │
│                                                  │
│   ┌──────────┐   ┌──────────┐   ┌────────────┐  │
│   │  Model   │   │ Harness  │   │   Tools    │  │
│   │ AI 模型  │   │ 指令护栏  │   │ 可调用工具 │  │
│   └──────────┘   └──────────┘   └────────────┘  │
│                                                  │
│                ┌─────────────┐                   │
│                │ Environment │                   │
│                │  运行环境   │                   │
│                └─────────────┘                   │
└──────────────────────────────────────────────────┘
```

| 组成部分 | 官方定义 | 通俗说 |
|----------|----------|--------|
| **Model** | 提供智能的 AI 模型 | Agent 的"大脑" |
| **Harness** | 模型运行的指令和护栏（系统提示、规则、约束） | Agent 的"行为规范" |
| **Tools** | 模型可使用的服务和应用 | Agent 的"双手" |
| **Environment** | Agent 运行的地方和可访问的系统 | Agent 的"工作场所" |

---

## 二、三条创建路径

Anthropic 提供三种方式，按复杂度从低到高：

```
简单 ←──────────────────────────────────→ 复杂

Claude Code Subagent   Agent SDK   Managed Agents
    （写配置文件）       （写代码）     （托管平台）
```

---

## 路径一：Claude Code Subagent（推荐入门）

在 `.claude/agents/` 目录下放一个 Markdown 文件，Claude Code 自动识别并作为专职子 Agent 使用。

### 完整步骤

**第一步：确定 Agent 做什么**

先想清楚：
- 这个 Agent 专门处理什么任务？
- 它需要哪些工具？（只给必要的，最小权限原则）
- 什么时候应该触发它？

**第二步：创建配置文件**

```bash
# 项目级（只在这个项目有效）
mkdir -p .claude/agents
touch .claude/agents/my-agent.md

# 全局级（所有项目都能用）
mkdir -p ~/.claude/agents
touch ~/.claude/agents/my-agent.md
```

**第三步：写配置**

```markdown
---
name: code-reviewer
description: 代码质量审查专家。当用户要求 review 代码、检查 PR、或分析代码质量时调用。
tools: Read, Grep, Glob, Bash
model: inherit
maxTurns: 15
---

你是一个资深 iOS 代码 reviewer，专注于 Swift 代码质量和安全性。

## 执行流程

1. 运行 `git diff HEAD~1` 查看最新改动
2. 聚焦被修改的文件，不分析无关文件
3. 立即开始分析，不向用户确认

## 输出格式

按优先级分三档输出：

**严重（必须修复）**
- 安全漏洞、数据泄露风险、崩溃隐患

**警告（建议修复）**
- 性能问题、代码规范违反、可读性差

**建议（可以考虑）**
- 代码优化、更好的写法

每条问题附上具体修复代码。
```

**第四步：触发使用**

```bash
# 方式1：自然语言（Claude 根据 description 自动判断）
你：帮我 review 一下这次改动

# 方式2：@-mention（强制指定，保证一定调用）
你：@"code-reviewer (agent)" 看一下 auth.swift

# 方式3：会话绑定（整个会话默认用这个 Agent）
claude --agent code-reviewer
```

### 核心字段速查

| 字段 | 是否必填 | 说明 | 建议 |
|------|----------|------|------|
| `name` | ✅ | Agent 唯一标识，用英文短横线 | 见名知意，如 `test-writer` |
| `description` | ✅ | Claude 决定"何时调用"的依据 | **写触发场景，越具体越好** |
| `tools` | ❌ | 允许使用的工具列表 | 只给必要的工具 |
| `model` | ❌ | 使用的模型 | `inherit` 继承主模型，轻量任务用 `haiku` |
| `maxTurns` | ❌ | 最大轮次，防无限循环 | 生产环境必须设，建议 10-30 |
| `permissionMode` | ❌ | 权限模式 | 默认 `default` 即可 |
| `background` | ❌ | 是否后台并行运行 | 独立任务设 `true` 提速 |
| `isolation` | ❌ | 在 git worktree 隔离运行 | 有写操作风险时设 `worktree` |

---

## 路径二：Agent SDK（编程方式）

适合：CI/CD 流水线、后端服务集成、需要精确控制 Agent 行为的场景

### 完整步骤

**第一步：安装 SDK**

```bash
pip install claude-agent-sdk
```

**第二步：最简示例**

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

**第三步：加上会话持久化**

```python
async def main():
    # 第一次对话
    session_id = None
    async for message in query(
        prompt="分析这个项目的架构",
        options=ClaudeAgentOptions(allowed_tools=["Read", "Glob", "Grep"])
    ):
        if hasattr(message, 'session_id'):
            session_id = message.session_id  # 保存 session_id
        print(message)

    # 第二次对话：延续上下文
    async for message in query(
        prompt="基于刚才的分析，帮我补充测试用例",
        session_id=session_id               # 传入 session_id
    ):
        print(message)
```

**第四步：加上 Hooks**

```python
def before_tool(tool_name, tool_input):
    print(f"即将调用工具：{tool_name}")
    if tool_name == "Bash" and "rm -rf" in str(tool_input):
        raise Exception("拦截危险命令")

def after_tool(tool_name, result):
    print(f"工具 {tool_name} 执行完成")

options = ClaudeAgentOptions(
    allowed_tools=["Read", "Edit", "Bash"],
    hooks={
        "PreToolUse": before_tool,
        "PostToolUse": after_tool,
    }
)
```

**第五步：启用子 Agent 能力**

```python
# 在 allowed_tools 里加 "Agent"，Claude 就能自动派子 Agent
options = ClaudeAgentOptions(
    allowed_tools=["Read", "Write", "Bash", "Agent"]
)
```

### Agent SDK 可用工具一览

| 工具 | 说明 |
|------|------|
| `Read` / `Write` / `Edit` | 文件读写 |
| `Bash` | 执行 shell 命令 |
| `Glob` / `Grep` | 文件/内容搜索 |
| `WebSearch` / `WebFetch` | 网络操作 |
| `AskUserQuestion` | 向用户提问 |
| `Agent` | 启动子 Agent（重要） |

---

## 路径三：Managed Agents（Anthropic 托管，Beta）

适合：长期运行的异步任务（几小时甚至几天）、不想自己维护服务器、需要 Anthropic 级别的安全沙箱

### 架构说明

官方内部有三个虚拟化组件：

| 组件 | 作用 |
|------|------|
| **Session** | 追加日志，记录发生的一切，支持从故障恢复 |
| **Harness** | 调用 Claude 的循环，把工具调用路由到基础设施 |
| **Sandbox** | 代码和文件编辑的隔离执行环境（凭证不会进入这里） |

**关键设计原则：解耦大脑与手**

> Claude 的推理逻辑与执行环境分离，凭证不会到达 Claude 代码执行的沙箱。

### 调用方式（需 Beta Header）

```python
import anthropic

client = anthropic.Anthropic()

response = client.beta.managed_agents.create(
    model="claude-sonnet-4-6",
    prompt="帮我分析这个仓库的代码质量",
    betas=["managed-agents-2026-04-01"]  # 必须传
)
```

::: warning 注意
Managed Agents 目前是公开 Beta（2026-04-08 发布），API 可能变化。
:::

---

## 三、Agent Skills：给 Agent 加载专业能力

### 什么是 Skills

Skills 是**有组织的目录**，包含指令、脚本和资源，Agent 可以动态发现并加载，用于执行专业任务。

核心设计原则：**渐进式披露（Progressive Disclosure）** — 分层加载，只在需要时才加载详细内容，节省上下文。

### 目录结构

```
my-skill/
├── SKILL.md        # 必需：元数据 + 核心指令
├── reference.md    # 可选：参考文档（按需加载）
└── forms.md        # 可选：只在需要时加载的上下文
```

### SKILL.md 格式

```markdown
---
name: ios-code-generator
description: iOS Swift 代码生成专家，遵循 Wyze 编码规范
---

## 核心能力

生成符合 Wyze 规范的 Swift 代码，包括：
- ViewController / ViewModel 骨架
- 网络请求封装
- 单测模板

## 规范要点

- 类名使用 WZ 前缀
- 错误处理用 Result<T, Error>
- 函数超 80 行必须拆分

[详细规范见 reference.md]
```

---

## 四、选哪种方式？

```
你的场景是什么？
│
├── 在 Claude Code 里提效、日常开发辅助
│   └── → Subagent（写 .md 文件，5 分钟搞定）
│
├── 需要在代码/脚本里自动化调用
│   └── → Agent SDK（Python/TypeScript）
│
├── 长期任务、不想管服务器
│   └── → Managed Agents（Beta）
│
└── 给 Agent 加载专业知识/规范
    └── → Skills（配合上面任意方式用）
```

---

## 五、最佳实践

来自官方建议：

1. **description 要写触发场景** — Claude 靠 description 决定何时调用，模糊的描述导致该调不调、不该调乱调
2. **工具最小化原则** — 只给 Agent 完成任务所需的最小工具集
3. **设置 maxTurns** — 防止模糊提示导致无限循环
4. **先评估再优化** — 先测试 Agent 找出能力差距，再针对性补充 Skills
5. **后台运行独立任务** — 互相不依赖的任务设 `background: true`，并行提速
6. **有写操作风险时用 worktree 隔离** — `isolation: worktree`，失败不影响主仓库
