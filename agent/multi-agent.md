# 多 Agent 协调：完整指南

> 基于 Anthropic 官方文档
>
> 官方参考：
> - [Building Effective Agents](https://www.anthropic.com/research/building-effective-agents)
> - [Sub-agents](https://code.claude.com/docs/en/sub-agents)
> - [Agent Teams](https://code.claude.com/docs/en/agent-teams)
> - [Agent SDK](https://code.claude.com/docs/en/agent-sdk/overview)
> - [Multi-Agent Research System](https://www.anthropic.com/engineering/multi-agent-research-system)
>
> 更新：2026-05-03

---

## 一、为什么需要多 Agent

官方研究数据（[Multi-Agent Research System](https://www.anthropic.com/engineering/multi-agent-research-system)）：

> 多 Agent 系统比单 Agent 方式在研究任务上性能提升 **90.2%**，代价是使用约 **15 倍**的 token。

**官方原则：只在更简单的方案明确不够用时，才引入多 Agent 复杂度。**

### 适合场景

- 任务可以拆成**互相独立的子任务**并行完成
- 不同部分需要**专业化处理**（前端/后端/测试分别由专家处理）
- 需要**互相 review 和验证**（一个写，另一个审）
- 任务规模超过**单个 Agent 的上下文窗口**

### 不适合场景

- 步骤严格串行、有强依赖
- 简单问答或一次性小任务
- 预算有限（多 Agent 成本线性增长）

---

## 二、三种 Agent 的本质区别

```
普通 Agent（单体）
┌────────────────────────────────┐
│  你 ←→ Claude                  │
│        ↕                       │
│      Tools（读文件/跑命令等）    │
└────────────────────────────────┘
一个 Claude，自己做完所有事


Subagent（专职工作者）
┌────────────────────────────────────────────────┐
│  你 ←→ 主 Claude                               │
│          │                                     │
│          ├──► 子 Claude A（做完 → 只返回结果）  │
│          ├──► 子 Claude B（做完 → 只返回结果）  │
│          └──► 子 Claude C（做完 → 只返回结果）  │
└────────────────────────────────────────────────┘
主 Claude 派专职 Claude 干活，子 Claude 只向主 Claude 汇报


Agent Team（协作团队）
┌──────────────────────────────────────────────────────┐
│  你 ←→ Lead（队长）                                   │
│          │                                           │
│          │    共享任务列表                            │
│          ├──► 队友 A ◄──消息──► 队友 B               │
│          │        ↕                   ↕              │
│          └──► 队友 C ◄──消息──────────┘              │
└──────────────────────────────────────────────────────┘
每个队友独立运行，可以直接互发消息，你也能直接跟某个队友说话
```

### 官方对比表

| | **普通 Agent** | **Subagent** | **Agent Team** |
|---|---|---|---|
| **是什么** | 单个 Claude 实例，有工具，能循环推进任务 | 在主 Agent 内部派生的专职 Claude | 多个完全独立的 Claude 实例组成的团队 |
| **上下文** | 单一共享上下文 | 独立上下文，只把结果返回给主 Agent | 每个队友独立上下文，完全隔离 |
| **通信** | 你和它直接对话 | 子 Agent 只向主 Agent 单向汇报 | 队友之间可直接互发消息，你也能直接联系某个队友 |
| **协调方式** | 自己决定所有步骤 | 主 Agent 管理所有工作分配 | 共享任务列表 + 自主认领 + Lead 综合 |
| **Token 成本** | 最低 | 中等 | 最高 |
| **适合** | 单一连贯任务 | 有侧任务会污染主上下文；反复用同类工作者 | 需要讨论、互相挑战、协作的复杂工作 |

---

## 三、普通 Agent：基础单体

普通 Agent 就是你平时用的 Claude Code，有工具、会循环推进任务直到完成。

### 工作原理（Agentic Loop）

```
你：帮我修复这个 bug

Claude 思考：我需要先看代码
    └── 调用 Read 工具 → 读到文件内容
Claude 思考：找到 bug 了，在第 42 行
    └── 调用 Edit 工具 → 修改代码
Claude 思考：改完了，跑一下测试验证
    └── 调用 Bash 工具 → 跑测试
Claude 思考：测试通过，任务完成
    └── stop_reason: "end_turn"

Claude：已修复，测试通过。
```

**适合：** 单一连贯任务、上下文不超窗口限制、没有需要专业化处理的子任务

---

## 四、Subagent：专职工作者

### 官方定义

> Subagents are specialized AI assistants that handle specific types of tasks. Use one when **a side task would flood your main conversation** with search results, logs, or file contents you won't reference again.

两个使用时机：
1. **侧任务会污染主上下文**：比如搜索 100 个文件，结果不需要留在主对话里
2. **反复需要同类工作者**：比如每次都要"审查代码"，固化成 Subagent

### 上下文隔离机制

```
主 Agent（上下文：完整对话历史）
    │
    │  "去帮我分析这些文件"
    ▼
子 Agent（独立上下文：只有任务描述）
    │   读文件、搜索、分析...（大量中间过程）
    │
    │  "分析完了，结论是：xxx"（只返回摘要）
    ▼
主 Agent（上下文：+摘要，不加中间过程）
```

**关键：** 子 Agent 执行过程中产生的大量内容不会进入主 Agent 的上下文，这是保护主上下文的核心机制。

### 创建 Subagent

**`.claude/agents/swift-analyzer.md`**

```markdown
---
name: swift-analyzer
description: |
  Swift 代码质量分析师。
  当需要分析 Swift 代码结构、找潜在问题、输出质量报告时调用。
  不负责修改代码，只负责分析和报告。
tools: Read, Grep, Glob
model: haiku
maxTurns: 20
---

你是一个 Swift 代码质量分析师。

## 分析维度

1. **安全问题**：force unwrap、未处理的错误、硬编码敏感信息
2. **规范问题**：命名规范、函数长度（超 80 行标记）
3. **架构问题**：循环依赖、单一职责违反

## 输出格式

### 严重问题（[文件名:行号] 问题描述）
### 警告
### 建议

每条问题附上修复示例代码。
```

### 前台 vs 后台

```
前台（默认）：
  主 Agent 等子 Agent 完成才继续
  → 适合：子 Agent 的结果是主 Agent 下一步的输入

后台（background: true）：
  主 Agent 继续响应你，子 Agent 并发执行
  → 适合：子 Agent 任务完全独立，不影响主流程
```

---

## 五、Agent Team：协作团队

### 官方定义

> Agent teams let you coordinate **multiple Claude Code instances working together**. Teammates work independently, each in its own context window, and **communicate directly with each other**.
>
> Unlike subagents, **you can also interact with individual teammates directly** without going through the lead.

### Agent Team 的四个组成部分

#### Team Lead（队长）

职责：创建团队、分配任务、监控进度、综合结果
特点：就是你当前的主 Claude Code 会话，拥有最完整的上下文

#### Teammates（队友）

职责：领取任务、独立执行、通信协作、标记完成
特点：
- 每个队友是独立的 Claude Code 实例，有独立上下文
- 加载项目的 CLAUDE.md 和 MCP，但**不继承 Lead 的对话历史**
- 给队友的任务描述**必须自包含**

#### Task List（共享任务列表）

> Tasks have three states: **pending, in progress, and completed**.
> Tasks can also **depend on other tasks**.
> Task claiming uses **file locking** to prevent race conditions.

```
任务状态流转：

pending ──（无依赖或依赖完成）──► in_progress ──► completed
   │
   └── 有未完成的依赖任务 → 无法被认领（自动等待）
```

任务认领方式：
- **Lead 显式分配**：告诉 Lead 把哪个任务给哪个队友
- **队友自主认领**：完成当前任务后，自动认领下一个可用任务

#### Mailbox（消息系统）

```
Lead 发消息给 队友A：
  Lead → mailbox/teammate-a → 队友A 收到

队友A 发消息给 队友B：
  队友A → mailbox/teammate-b → 队友B 收到

队友完成任务时自动通知 Lead，Lead 不需要轮询检查
```

### Subagent vs Agent Team 通信差异

```
Subagent（单向汇报）：
  主 Agent
    ├──► 子 Agent A ─────────────► 主 Agent（只返回结果）
    ├──► 子 Agent B ─────────────► 主 Agent（只返回结果）
    子 Agent A 和 B 之间：无法通信

Agent Team（双向通信）：
  Lead
    ├──► 队友 A ◄──────────────► 队友 B（可直接对话）
    你 ◄──────────────────────────── 你也能直接找队友 A 说话
```

### 两种显示模式

**In-process 模式**（默认）：所有队友在主终端同一界面，用 `Shift+Down` 切换

**Split panes 模式**（需要 tmux 或 iTerm2）：每个队友独占一个窗格，可同时看到所有队友实时进度

---

## 六、五种核心协调模式

来自官方 [Building Effective Agents](https://www.anthropic.com/research/building-effective-agents)

### 模式 1：Orchestrator-Workers（最常用）⭐

```
Orchestrator（编排者）
    ├── 分析整体任务
    ├── 动态决定派几个 Worker、每个做什么
    │
    ├──► Worker A：负责部分 X → 完成汇报
    ├──► Worker B：负责部分 Y → 完成汇报
    └──► Worker C：负责部分 Z → 完成汇报
         │
         └── Orchestrator 汇总 → 最终输出
```

Orchestrator 不执行具体工作，只负责分解和协调。Workers 专注执行，不管全局。

**适合：** 功能开发、代码重构、分析大型代码库

### 模式 2：Parallelization（并行）

```
主 Agent 拆任务
    ├──► 子任务 A ─┐
    ├──► 子任务 B ─┼──► 全部完成 ──► 汇总
    └──► 子任务 C ─┘
```

> 官方数据：子 Agent 内部同时使用 3+ 个工具并行，可减少 **90%** 执行时间。

**适合：** 分析多个不相关文件、搜索多个数据源

### 模式 3：Prompt Chaining（链式）

```
任务 A ──完成──► 任务 B ──完成──► 任务 C ──► 最终结果
         ↑
    [可加验证关卡：质量不达标则重做]
```

每步结果是下一步的输入，可以在关键节点加质量检查。

**适合：** 架构分析 → 实现 → 测试（有严格顺序依赖）

### 模式 4：Routing（路由）

```
输入 ──► 分类 Agent ──► Agent A（处理类型1）
                    ├──► Agent B（处理类型2）
                    └──► Agent C（处理类型3）
```

**适合：** 不同类型的 bug 用不同专家处理，不同语言用不同代码生成器

### 模式 5：Evaluator-Optimizer（评估 + 优化循环）

```
Generator ──► 输出 ──► Evaluator（评分 + 反馈）
    ↑                         │
    └──── 不达标则继续优化 ◄──┘
                              │
                         达标 → 输出
```

**适合：** 代码质量要求高、需要多轮迭代改进的场景

---

## 七、实战：iOS 设备分组功能开发

**任务：** 给 Wyze 插件新增"设备分组"功能，包含架构分析、代码实现、单测编写、代码审查四个环节。

### 方案设计

```
如果用单 Agent 串行：
架构分析 → 代码实现 → 单测 → 审查
（全程一个 Claude 做，上下文越来越重）

用多 Agent 并行：
架构分析 → 代码实现
                └──►（同时）单测编写
         → 审查
（更快，每个 Agent 专注自己的领域，上下文干净）
```

依赖关系：

```
架构分析（必须第一个做）
    ↓
代码实现（依赖架构方案）
    ├──► 单测编写（可与实现并行）
    └──► 代码审查（等实现和测试都完成）
```

### 四个专职 Subagent 配置

**`.claude/agents/architect.md`**

```markdown
---
name: architect
description: |
  iOS 架构分析师。
  当任务需要分析现有模块结构、设计新功能的接口和文件结构时调用。
  输出实现方案，不写实现代码。
tools: Read, Grep, Glob
model: sonnet
maxTurns: 25
color: blue
---

你是一个 iOS 架构分析师，专注于 Swift 项目的模块结构设计。

## 分析流程

1. 用 Glob 扫描项目目录，了解整体结构
2. 用 Grep 查找与任务相关的现有代码
3. 读取关键文件，理解现有模式
4. 检查 wyze-wpk-* 系列是否有可复用组件（优先复用）

## 输出格式

### 新增文件
| 文件路径 | 职责 |

### 修改文件
| 文件路径 | 修改内容 |

### 核心接口定义
[Protocol 定义]

### 数据流
[ViewController → ViewModel → Repository → Network 的数据流向]
```

**`.claude/agents/implementer.md`**

```markdown
---
name: implementer
description: |
  iOS Swift 功能实现者。
  当有明确的架构方案，需要编写 Swift 实现代码时调用。
tools: Read, Write, Edit, Bash
model: sonnet
maxTurns: 40
color: green
---

你是一个 iOS Swift 开发工程师，专注于按架构方案编写高质量代码。

## 编码规范

- 类名用 WZ 前缀（WZDeviceGroup, WZDeviceGroupViewModel）
- 错误处理：底层用 `throws`，上层包装为 `Result<T, Error>` 传给 UI
- 函数超 80 行必须拆分
- 禁止 force unwrap（`!`）
```

**`.claude/agents/test-writer.md`**

```markdown
---
name: test-writer
description: |
  iOS 单测编写者。
  当 Swift 功能代码编写完成，需要编写 XCTest 单元测试时调用。
tools: Read, Write, Edit, Glob
model: haiku
maxTurns: 25
color: yellow
---

命名规范：`test_<被测方法>_<场景>_<期望结果>`

覆盖三条路径：正常路径、边界条件、错误路径
```

**`.claude/agents/reviewer.md`**

```markdown
---
name: reviewer
description: |
  iOS 代码审查者。
  当功能代码和测试都完成，需要做最终代码 review 时调用。
tools: Read, Grep, Glob, Bash
model: sonnet
maxTurns: 20
color: red
---

## 审查清单

**严重（必须修复）**
- force unwrap（`!`）
- 硬编码的 key/url/password
- 未处理的错误路径
- 内存泄漏风险（循环引用，闭包未捕获 weak self）

**警告（应该修复）**
- 不符合 WZ 前缀规范
- 函数超过 80 行
- 魔法数字或魔法字符串
```

### 执行流程

```
t=0   Lead 分析任务结构，建任务列表
      │
      ├──► architect 开始
      │    读代码 → 分析结构 → 写方案到 .claude/device-group-plan.md
      │
t=20  architect 完成，通知 Lead
      │
      ├──► implementer 开始（依赖 architect 完成）
      │    读方案 → 逐文件实现
      │
      ├──► test-writer 并行（与 implementer 重叠）
      │    等 implementer 每完成一个文件立即写测试
      │
t=70  两者完成
      │
      ├──► reviewer 开始（依赖前两者完成）
      │    输出三档 review 报告
      │
t=90  Lead 汇总 → 最终报告
```

### 过程中如何监控

```bash
# 直接联系某个队友（不经过 Lead）
@"implementer (agent)" 进度怎么样了？

# 给卡住的队友提示
@"test-writer (agent)" DeviceGroupViewModel 的异步方法用 async/await 测试

# 让 Lead 汇总当前状态
"所有队友现在进展如何？"

# 发现队友跑偏，直接重定向
@"architect (agent)" 不需要新建网络层，直接用 WZNetworkService
```

---

## 八、Subagent 完整字段说明

| 字段 | 必填 | 官方说明 | 建议 |
|------|------|----------|------|
| `name` | ✅ | 唯一标识，小写字母+短横线 | 见名知意，如 `swift-analyzer` |
| `description` | ✅ | Claude 据此决定何时调用 | **写具体触发场景，最重要的字段** |
| `tools` | ❌ | 允许的工具列表，不填则继承全部 | 只给必要工具，遵循最小权限 |
| `disallowedTools` | ❌ | 强制禁用的工具 | 确保只读 Agent 不能写文件 |
| `model` | ❌ | 模型选择，默认 `inherit` | 轻量任务用 `haiku`，复杂推理用 `sonnet` |
| `permissionMode` | ❌ | `default`/`acceptEdits`/`auto`/`bypassPermissions` | 一般保持 `default` |
| `maxTurns` | ❌ | 最大执行轮次 | **生产环境必填**，建议 15-30 |
| `skills` | ❌ | 预加载的 Skills | Subagent 不继承父会话的 Skills，需手动指定 |
| `mcpServers` | ❌ | 可用的 MCP 服务器 | 引用已配置的服务器名，或内联定义 |
| `hooks` | ❌ | 生命周期钩子（PreToolUse / PostToolUse / Stop 等） | 用于日志、拦截危险操作 |
| `memory` | ❌ | 持久记忆范围：`user`/`project`/`local` | 需要跨会话学习时开启 |
| `background` | ❌ | `true` 表示始终后台运行 | 独立任务设 `true` 不阻塞主对话 |
| `effort` | ❌ | 覆盖 effort 级别：`low`/`medium`/`high`/`xhigh`/`max` | 简单任务降低节省成本 |
| `isolation` | ❌ | `worktree`：在隔离的 git worktree 里运行 | 有写操作风险时使用 |
| `color` | ❌ | 显示颜色（`red`/`blue`/`green` 等 8 色） | 多个 Agent 运行时便于区分 |
| `initialPrompt` | ❌ | 用 `--agent` 启动时自动发送的第一条消息 | 设置 Agent 启动时的默认任务 |

---

## 九、最佳实践

**关于团队规模**
> 从 **3-5 个队友**开始。每增加一个队友，token 成本线性增长，协调开销也增加。

**关于任务粒度**
> 每个队友分配 **5-6 个任务**最优，任务应该是"能产出清晰交付物的自包含单元"。

**关于上下文传递**
> 队友加载项目上下文（CLAUDE.md、MCP、Skills），但**不加载 Lead 的对话历史**。给队友的任务描述必须自包含，不能依赖 Lead 的上下文。

**关于文件冲突**
> 每个队友应该**拥有不同的文件集合**，避免同时写同一个文件。

**关于启动顺序**
> 先从"只读、边界清晰"的研究/review 任务开始，不要上来就让多个 Agent 同时写代码。

---

## 十、已知限制

| 限制 | 说明 |
|------|------|
| 无法恢复 in-process 队友 | `/resume` 和 `/rewind` 不会恢复 in-process 模式的队友 |
| 任务状态可能滞后 | 队友有时忘记标记任务完成，会阻塞有依赖关系的后续任务 |
| 关闭较慢 | 队友会等当前请求完成才关闭 |
| 每个 Session 只能有一个团队 | Lead 一次只能管理一个团队 |
| 队友不能再建团队 | 不支持嵌套团队 |
| Split panes 需要 tmux 或 iTerm2 | 默认 in-process 模式无此限制 |

---

## 十一、选择指南

```
你的任务是什么？
│
├── 单一连贯任务，不需要并行
│   └── 普通 Agent（默认就是，无需配置）
│
├── 有侧任务会产生大量中间数据，污染主上下文
│   └── Subagent（保护主上下文，只传回摘要）
│
├── 反复需要同类专职工作者
│   └── Subagent（固化为配置文件，一次配置反复用）
│
├── 任务可以拆成独立子任务并行
│   └── 多个 Subagent 并行（background: true）
│
└── 需要队友之间互相讨论、分享发现、互相 review
    └── Agent Team（直接通信，共享任务列表）

成本考虑：
普通 Agent < Subagent < 多 Subagent < Agent Team
```

---

::: warning 官方的忠告
> Only add agentic complexity when simpler solutions demonstrably fail.
> Single optimized LLM calls often suffice.

**只有更简单的方案明确不够用时，才引入多 Agent 复杂度。一个调优好的单次调用往往就够了。**
:::
