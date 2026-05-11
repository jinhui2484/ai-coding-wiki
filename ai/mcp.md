# MCP 详解 — Model Context Protocol
> 适用范围：Claude Code + GitHub Copilot CLI  
> 更新日期：2026-05-11  
> 阅读目标：理解 MCP 的概念、架构、配置、调试与落地方式

::: tip 🌟 Awesome MCP Servers
社区维护的 MCP Server 大全（2200+ 个），详细分类见 [Awesome MCP Servers 速查手册](./awesome-mcp-servers)。
:::

---
## 什么是 MCP
MCP，全称 **Model Context Protocol**，是一个面向 AI Host 与外部服务的开放协议，用来标准化“模型如何读取外部上下文、调用外部能力、复用工作流模板”。
它不是替代 API，而是把 API、文件、数据库、内部工作流重新包装成 AI 容易发现、容易调用、容易组合的标准接口。
如果把 AI 看成“大脑”，MCP 就像把大脑接到外部世界的统一插口。
没有 MCP 时，Claude Code、Copilot CLI、IDE Agent、Web Chat 都得分别为 GitHub、Jira、Confluence、Figma、数据库写各自的私有集成；有了 MCP，服务方实现一次 Server，就能被多个 Host 复用。

### 为什么会有 MCP
MCP 诞生的原因很工程化，不是概念创新，而是接入成本已经高到不值得继续各自为战。
常见问题包括：
- AI 看到的上下文常常是用户手动复制进去的静态文本，容易过期。
- 每个 AI 产品的 API integration 方式都不一样，重复开发成本很高。
- 很多系统不只要“读数据”，还要“做动作”，例如建 ticket、搜知识库、抓网页、读设计稿、查数据库。
- 当团队同时使用 Claude Code、Copilot CLI、IDE Agent 时，私有接入会迅速失控。
MCP 想解决的问题可以概括为一句话：**让 AI 工具以统一方式接入外部服务。**

### 类比：像 USB-C for AI tools
MCP 最好记的类比是：**像 USB-C for AI tools**。
USB-C 的价值不是“接口长得一样”，而是：
- 设备接法统一了。
- 协商能力统一了。
- 适配成本降低了。
MCP 对 AI 工具做的是同样的事：
- Host 用统一协议接入外部能力。
- 服务方不必为每个 Host 单独重写一遍集成。
- 团队可以在 Claude Code 与 Copilot CLI 之间共享越来越多的接入资产。
所以 MCP 真正标准化的不是某一个 API，而是**AI 使用外部能力的方式**。

### MCP 标准化了什么
MCP 主要标准化以下内容：
- Host 如何发现 Server 提供了哪些能力。
- Host 如何调用 Tool。
- Host 如何读取 Resource。
- Host 如何展示 Prompt template。
- Host 与 Server 如何通过 transport 建立连接。
- 返回结果如何进入模型上下文继续推理。

### 三个典型场景
#### 场景 1：Issue 驱动开发
以前你要把 Jira ticket、评论、相关 PR、知识库链接手动复制给 AI；现在 Host 可以直接调用 Jira、GitHub、Confluence 的 MCP Tool，把完整上下文拉进来。
#### 场景 2：设计稿到实现
以前你只能把截图发给 AI，AI 很难理解布局结构；现在 Figma MCP Server 能把节点、文本、层级、图片引用直接暴露出来。
#### 场景 3：业务系统自动化
一个内部系统里，MCP 可以同时提供读取订单摘要的 Resource、创建售后工单的 Tool、生成客服回复的 Prompt，三者组合起来就是完整工作流。

### 什么时候值得上 MCP
以下情况基本都建议考虑 MCP：
- 你经常把同类数据复制给 AI。
- 你希望 AI 使用的是实时数据，而不是静态粘贴。
- 你要让多个 AI Host 共用同一套外部能力。
- 你要把内部系统能力安全暴露给 AI。
- 你关心长期维护，而不是一次性脚本。
如果只是单次脚本，直接调 API 足够；但只要目标变成“长期复用的 AI integration layer”，MCP 往往更合适。

---
## 核心架构
MCP 架构本身不复杂，但角色边界一定要分清。

### MCP Host
Host 是最终承载 AI 交互体验的应用。本文语境里最重要的两个 Host 是：
- Claude Code
- GitHub Copilot CLI
Host 负责承载聊天与 Agent 体验、管理会话上下文、决定何时调用 Tool / Resource / Prompt、执行权限控制并展示结果。

### MCP Client
Client 通常内置在 Host 里。你不一定直接看到它，但逻辑上一定存在。
它负责：
- 与 Server 建立连接。
- 发现可用能力。
- 发起 Tool / Resource / Prompt 请求。
- 把结果返回给 Host。
可以把它理解成“Host 里的协议执行器”。

### MCP Server
Server 是能力提供方。它把某个系统的能力包装成 MCP 语义，对外暴露：
- Tools
- Resources
- Prompts
Server 后面可以连本地文件系统、GitHub API、Jira / Confluence、Figma、数据库或内部平台。
MCP Server 不是业务系统本体，而是业务系统面向 AI 的协议适配层。

### External Service
External Service 是真正的业务系统，例如 GitHub、Jira、Confluence、Figma、CRM、报表系统、数据库。
Host 不直接理解这些系统的原始 API；它理解的是 MCP Server 暴露出来的标准能力。

### 架构图
```mermaid
flowchart LR
    H[MCP Host
Claude Code / Copilot CLI]
    C[MCP Client
Built into Host]
    S[MCP Server
Tool / Resource / Prompt Provider]
    E[External Service
Jira / GitHub / Confluence / Figma / DB]

    H <--> C
    C <--> S
    S <--> E
```

### 一次请求怎么流动
1. 用户在 Host 里提出任务，例如“读取 Jira 里的 BUG-142 并找相关 PR”。
2. Host 判断需要调用某个 MCP Server。
3. Host 内置 Client 根据配置与 Server 建立连接。
4. Client 发现该 Server 提供的 Tool / Resource / Prompt。
5. Host 发起调用。
6. Server 访问外部系统，拿到结果或执行动作。
7. Server 把结构化结果返回给 Client。
8. Client 交给 Host，结果进入模型上下文。
9. 模型基于这些新上下文继续推理。

### Transport：stdio / SSE / Streamable HTTP
MCP 最常见的三种 transport 是：
- **stdio**
- **SSE**
- **Streamable HTTP**

#### stdio
适合本地进程型 Server。Host 拉起命令，通过 stdin / stdout 交换协议消息。
适合：本地文件系统、本地脚本、本机数据库代理、单机实验工具。
优点：简单直接、启动快、权限边界清晰。
注意：日志必须打到 `stderr`，不能污染 `stdout`。

#### SSE
SSE 即 **Server-Sent Events**，适合远程事件流或已经存在的远程长连接服务。
适合：团队部署的远程网关、已有 SSE endpoint 的服务、需要事件流的场景。
注意：更依赖代理、超时、认证头和网络稳定性。

#### Streamable HTTP
这是更现代、更适合远程生产部署的 transport 形式。
适合：团队共享的云端服务、统一鉴权、统一网关、统一审计与限流的场景。
优点：更符合现代 HTTP 基础设施，更容易挂在企业网络与 API Gateway 后面。

### Transport 选择表
| Transport | 典型场景 | 优点 | 注意点 |
|------|------|------|------|
| stdio | 本地脚本、本地文件、本地实验 | 简单、上手快 | 进程启动失败、stdout 污染 |
| SSE | 兼容既有远程事件流 | 支持长连接事件推送 | 代理、鉴权、超时更敏感 |
| Streamable HTTP | 团队共享云端服务 | 更适合生产网络与治理 | 需规划 token、重试、配额 |

### 最容易混淆的边界
很多团队第一次接触 MCP 时会问：“我们已经有 API 了，为什么还要 Server？”
答案是：
- API 是业务系统自己的接口。
- Server 是把业务接口包装成 MCP 语义的适配层。
- Host 是 AI 交互入口。
- Client 是 Host 里的协议执行器。
当这四层边界清晰后，复用、替换、治理和测试都会更容易。

---
## MCP Server 能力
MCP Server 最核心的价值不是“连通了某个系统”，而是把系统能力抽象成三大类标准能力：
- **Tools**
- **Resources**
- **Prompts**

### Tools
Tool 本质上是“可调用函数”。它通常有输入参数、执行逻辑和返回结果。
常见例子：
- create Jira ticket
- search Confluence
- read GitHub issue
- fetch URL
- query database
- trigger internal workflow
Tool 的特点是语义偏动作，既可以是只读，也可以带副作用。适合“帮我做一件事”类需求。
在 Claude Code 或 Copilot CLI 里，用户通常不会手写 RPC，而是说“去 Confluence 搜一下这个主题”“帮我创建一个 Jira bug”“抓这个网页并总结”，Host 会自己决定是否调用对应 Tool。

### Resources
Resource 更像“可读取的数据源”。它的主要价值是给模型补充上下文，而不是执行动作。
常见例子：
- file contents
- DB records
- repo files
- issue details
- wiki page body
- metrics snapshot
Resource 的特点是偏读取、适合作为证据或材料，比 Tool 更适合“给模型喂上下文”。
一个很实用的心智模型是：**Tool 用来做事，Resource 用来拿资料。**

### Prompts
Prompt 是可复用的 prompt template，用来把团队高频任务标准化。
常见例子：
- 代码审查模板
- 缺陷复现模板
- 发布说明模板
- 事故复盘模板
- SQL 分析模板
Prompt 的价值是减少重复 prompt 编写、保持团队风格一致、让 Tool 与 Resource 更容易组合成稳定工作流。

### 三类能力如何配合
| 能力 | 本质 | 典型动作 | 最适合的场景 |
|------|------|------|------|
| Tools | 可执行函数 | 创建、更新、搜索、触发 | 需要动作或副作用 |
| Resources | 可读取数据 | 读文件、读记录、读文档 | 需要上下文或证据 |
| Prompts | 可复用模板 | 组织输入结构、输出格式 | 需要标准工作流 |

### 实战上的组合方式
一个成熟的 MCP Server 往往不是只做一类能力：
- 只有 Tool：适合非常原子的动作，例如触发 CI。
- Tool + Resource：适合大多数业务系统，例如既能搜 ticket，又能读 ticket 详情。
- Resource + Prompt：适合知识库、报表系统、规范系统。
- Tool + Resource + Prompt：最适合高频团队工作流。
例如一个发布场景可以这样组合：读取最近 20 个 commit 的 Resource + release notes Prompt + 创建 Confluence 页面 Tool。这样 AI 就不是“会聊天”，而是“能执行标准流程”。

---
## 在 Claude Code 中使用 MCP
Claude Code 是很典型的 MCP Host。它的价值在于把本地开发上下文与外部系统上下文接起来，让 Claude 不只看代码，还能看 issue、文档、设计稿、数据库结果和远程工作流。

### 配置文件位置
按本文约定，Claude Code 常见配置位置有两类：
- **全局配置**：`~/.claude/mcp.json`
- **项目配置**：`.mcp.json`
推荐的划分方式是：跨项目通用的个人工具放 `~/.claude/mcp.json`，当前仓库希望团队共享的工具放项目根目录 `.mcp.json`。
> 备注：不同版本或封装层，底层也可能把配置写进其他运行时文件；本文重点采用最直观、最易维护的 `~/.claude/mcp.json` / `.mcp.json` 说法。

### JSON 配置格式
最常见的顶层结构如下：
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-filesystem", "/Users/jinhui.zhang/Desktop/claude-docs"]
    },
    "design": {
      "type": "sse",
      "url": "https://mcp.example.com/design/sse",
      "headers": {
        "Authorization": "Bearer ${DESIGN_MCP_TOKEN}"
      }
    }
  }
}
```
这个例子同时展示了两种 transport：`filesystem` 用 **stdio**，`design` 用 **SSE**。

### stdio 配置示例
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-filesystem", "/Users/jinhui.zhang/Desktop/claude-docs"],
      "env": {
        "NODE_NO_WARNINGS": "1"
      }
    }
  }
}
```
适合：本地文件、本地脚本、本地数据库代理、本机实验能力。

### SSE 配置示例
```json
{
  "mcpServers": {
    "confluence": {
      "type": "sse",
      "url": "https://mcp.example.com/confluence/sse",
      "headers": {
        "Authorization": "Bearer ${CONFLUENCE_TOKEN}"
      }
    }
  }
}
```
适合：团队统一部署的远程服务、SaaS 提供的 SSE endpoint、事件流场景。

### Streamable HTTP 配置示例
```json
{
  "mcpServers": {
    "github": {
      "type": "streamable-http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer ${GITHUB_TOKEN}"
      }
    }
  }
}
```
适合：团队共享、远程托管、需要统一鉴权与网关治理的服务。

### CLI 管理命令
#### 添加 Server
```bash
claude mcp add <name> <command>
```
本地 stdio 真实例子：
```bash
claude mcp add filesystem -- npx -y @anthropic/mcp-server-filesystem /Users/jinhui.zhang/Desktop/claude-docs
```
远程 HTTP 真实例子：
```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp/
```
#### 列出 Server
```bash
claude mcp list
```
作用：确认注册成功、核对 server 名称、验证 transport 配置。
#### 删除 Server
```bash
claude mcp remove <name>
```
例如：
```bash
claude mcp remove filesystem
```

### Scope：project vs user vs global
| Scope | 配置位置 | 推荐用途 | 是否进版本库 |
|------|------|------|------|
| project | `.mcp.json` | 团队共享、当前仓库专用 | 可以，但不能含密钥 |
| user | `~/.claude/mcp.json` | 当前用户跨项目通用工具 | 不建议 |
| global / managed | 企业统一下发 | 组织级治理、审计、统一能力 | 由平台策略决定 |

### 什么时候用 project scope
适合：当前项目所有人都需要同一组工具；希望新同学 clone 仓库后立即获得相同能力；准备把团队工作流标准化。
注意：不要把 token 写进 `.mcp.json`，统一使用环境变量占位。

### 什么时候用 user scope
适合：个人效率工具、带个人凭据的服务、与某仓库无关的通用 server，例如个人知识库、私有只读数据库、个人实验型 Server。

### 在 Claude Code 里如何确认生效
通常从三个方面判断：
- `/mcp` 能看到 server 状态。
- 会话中可用工具数量增加。
- Claude 能在合适时自动调用相关 Tool，而不再需要你手动复制 Jira / Confluence / GitHub 内容。

### Claude Code 的最佳实践
- 本地能力优先用 **stdio**。
- 团队共享和远程能力优先考虑 **Streamable HTTP**。
- 公共配置用 `.mcp.json`，敏感信息走环境变量。
- server 名称保持稳定可读，例如 `github`、`jira`、`confluence`、`figma`、`fetch`、`filesystem`。
- 一个 Server 聚焦一类能力，不要做成巨型万能网关。

---
## 在 Copilot CLI 中使用 MCP
从 GitHub Copilot CLI 的角度看，MCP 的作用是把默认工具集扩展成“可访问外部服务的 Agent 工具箱”，让当前 session 能读外部数据、调用外部动作，并把这些结果纳入推理过程。

### 配置文件位置
按本文约定，Copilot CLI 的常见用户级配置位置是：
- `~/.copilot/mcp.json`
如果团队想共享项目级配置，也可以在仓库维护 `.mcp.json`，但从 CLI 的个人环境角度看，最典型的仍是 `~/.copilot/mcp.json`。

### JSON 配置格式
Copilot CLI 可以使用与 Claude Code 非常接近的 JSON 结构：
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-filesystem", "/Users/jinhui.zhang/Desktop/claude-docs"]
    },
    "github": {
      "type": "streamable-http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer ${GITHUB_TOKEN}"
      }
    }
  }
}
```
这样做的好处很实际：同一个团队可以维护近似一致的 MCP 资产与说明，Claude Code 与 Copilot CLI 可以共用大部分命名方式和文档结构。

### MCP 在 Copilot CLI 里如何表现
当 Copilot CLI 成功发现并加载 MCP Server 后，这些 server 暴露的能力会表现为当前 session 可用工具的一部分。你不需要关心底层 RPC，只需要表达任务；CLI 会在适当时机把 MCP Tool 纳入工具选择空间。
常见任务例子：
- “从 Confluence 搜索 API 限流相关文档。”
- “读取这个仓库最近 5 个 PR 标题。”
- “抓一下这个网页并总结关键结论。”
- “查 Jira 里和 login timeout 相关的 ticket。”

### 一个关键点：启动时发现
Copilot CLI 有一个非常重要的行为：**MCP servers are discovered at startup**。
这意味着：
- 你修改了 `~/.copilot/mcp.json` 后，通常需要重启或重新进入 session。
- 不重启时，CLI 可能仍在使用旧的 server 列表。
- 所以排查问题时，第一优先级不是 prompt，而是“配置是否已经被重新发现”。

### 与 Claude Code 的体感差异
| 维度 | Claude Code | Copilot CLI |
|------|------|------|
| 配置入口 | `claude mcp ...` 与 `/mcp` | 本地配置 + `/mcp` |
| 会话加载方式 | 启动会话加载，可用 `/mcp` 查看 | 启动时发现并注入工具 |
| 典型优势 | 本地开发、跨工具执行流 | GitHub 工作流、CLI Agent 扩展 |
| 常用排查入口 | `claude mcp list`、`/mcp` | `/mcp`、`/env`、重启 session |

### Copilot CLI 的最佳实践
- 把稳定、跨项目的工具放 `~/.copilot/mcp.json`。
- 每次改配置后重启 CLI。
- 从 1~2 个 server 开始验证，不要一次堆很多。
- 先确认 server 能启动，再确认工具能被发现，再确认调用能成功。
- 如果团队同时使用 Claude Code，尽量统一 server 命名与文档说明。

### 一个典型工作流例子
假设你在 Copilot CLI 中配置了 GitHub server、Atlassian Jira server、Fetch server，那么一句自然语言任务：
> “读取 Jira 里的 BUG-142，检查相关 PR，再抓一下线上公告页，看是否已经说明这个限制。”
对用户来说只是一个目标；对 Host 来说，背后却可能是多个 MCP Tool 的组合调用。MCP 的价值就在这里：**用户只描述目标，Host 负责调度异构服务。**

---
## 常用 MCP Server 示例
下面这张表覆盖在 Claude Code 与 Copilot CLI 中最常见、最实用的一批 MCP Server：

| Server | 用途 | 安装方式 |
|------|------|------|
| `@anthropic/mcp-server-filesystem` | 文件和目录操作，适合本地项目上下文 | `npx -y @anthropic/mcp-server-filesystem <path>` |
| `@anthropic/mcp-server-github` | GitHub API：repo、issue、PR、搜索 | `npx -y @anthropic/mcp-server-github` 或远程 HTTP endpoint |
| `atlassian-confluence` | 搜索、读取、写入 Confluence wiki | 常见为团队部署的 HTTP / SSE server |
| `atlassian-jira` | 查询、创建、更新 Jira ticket | 常见为团队部署的 HTTP / SSE server |
| `@anthropic/mcp-server-fetch` | 抓网页、转文本、辅助 research | `uvx mcp-server-fetch` 或等价包装 |
| `figma` | 读取 Figma 文件、节点、设计结构 | 远程服务或本地包装 server，需要 Figma token |
| `custom/local servers` | 公司内部 API、数据库、流水线、报表、审批流 | 自己用 Node.js / Python / Go 实现 stdio 或 HTTP server |

### 怎么理解“安装方式”这一列
现实里 MCP Server 的分发形态通常有四种：
- `npx` 直接拉 npm 包运行
- `uvx` / `pipx` 运行 Python server
- Docker 镜像
- 团队已经部署好的远程 HTTP / SSE endpoint
所以文档里最好同时说明两件事：**Server 从哪里来**，以及 **Host 怎么连它**。
例如：filesystem 来自 npm、本地通过 stdio 运行；GitHub 可能来自官方托管 endpoint、通过 HTTP 连接；Jira / Confluence 可能来自团队自建网关、通过 SSE 连接。

### 推荐接入顺序
如果你刚开始搭 MCP 环境，推荐顺序是：`filesystem` → `fetch` → `github` → `jira / confluence` → `figma` → `custom/local servers`。
原因很直接：filesystem 与 fetch 最容易验证链路；github 很快就能产生明显价值；jira / confluence 适合团队协作；figma 与内部系统通常需要更复杂的鉴权和领域建模。

---
## 实战：配置一个完整的 MCP 环境
下面给一个偏真实的 `.mcp.json` 示例，目标是同时照顾 Claude Code 与 Copilot CLI 的使用方式。

### Step 1：准备运行时和凭据
至少要确认这些基础能力已经存在：
- Node.js
- `npx`
- 可选：`uvx` 或 Python 运行环境
- 能访问远程 MCP endpoint 的网络权限
- 相关 token 或 OAuth 凭据

### Step 2：先分层再配置
不要一开始就把所有 server 塞进一个文件。推荐：
- 项目强相关 server 放仓库根目录 `.mcp.json`
- 个人通用 server 放 `~/.claude/mcp.json` 或 `~/.copilot/mcp.json`

### Step 3：多 Server 配置示例
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-filesystem", "/Users/jinhui.zhang/Desktop/claude-docs"]
    },
    "fetch": {
      "command": "uvx",
      "args": ["mcp-server-fetch"]
    },
    "github": {
      "type": "streamable-http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer ${GITHUB_TOKEN}"
      }
    },
    "jira": {
      "type": "sse",
      "url": "https://mcp.example.com/jira/sse",
      "headers": {
        "Authorization": "Bearer ${JIRA_API_TOKEN}"
      }
    },
    "confluence": {
      "type": "sse",
      "url": "https://mcp.example.com/confluence/sse",
      "headers": {
        "Authorization": "Bearer ${CONFLUENCE_API_TOKEN}"
      }
    },
    "figma": {
      "type": "streamable-http",
      "url": "https://mcp.example.com/figma/mcp",
      "headers": {
        "Authorization": "Bearer ${FIGMA_TOKEN}"
      }
    }
  }
}
```

### Step 4：敏感信息不要进仓库
应该放环境变量的包括：
- API token
- Cookie
- Basic Auth 密码
- 本机私有路径
示例：
```bash
export GITHUB_TOKEN="..."
export JIRA_API_TOKEN="..."
export CONFLUENCE_API_TOKEN="..."
export FIGMA_TOKEN="..."
```
建议：使用最小权限 token，只在受信任设备上配置，并定期轮换。

### Step 5：分别在两个 Host 中加载
#### Claude Code
- 共享配置写到项目根目录 `.mcp.json`，或用 `claude mcp add` 逐个添加。
- 用 `claude mcp list` 或 `/mcp` 检查状态。
#### Copilot CLI
- 把配置写入 `~/.copilot/mcp.json`。
- 重启 Copilot CLI。
- 用 `/mcp` 与 `/env` 确认当前 session 已加载成功。

### Step 6：最小链路验证
不要一上来就跑复杂跨系统任务，先做三个最小验证。
#### 验证 1：filesystem
任务：`列出当前项目根目录文件。`
通过意味着：stdio server 能启动、Host 能发现 tool、权限边界基本没问题。
#### 验证 2：fetch
任务：`抓取 https://modelcontextprotocol.io/introduction 并总结第一段。`
通过意味着：Host 能正常调用外部抓取能力，远程内容返回链路正常。
#### 验证 3：github / jira
任务：`读取这个仓库最近 5 个 PR 标题。` 或 `搜索 Jira 里标题包含 login timeout 的 issue。`
通过意味着：认证配置正确、远程 server 可连通、Host 能把结果纳入上下文继续推理。

### Step 7：跨 Server 组合验证
比如：`读取 Jira issue APP-102，找到对应 GitHub PR，再去 Confluence 搜索 migration note，最后给我总结成 5 条风险。`
当这类组合任务开始稳定成功，你的 MCP 环境才真正进入“有生产力”的状态。

### 团队落地建议：三阶段推进
- **阶段 1：个人验证**：先接 `filesystem`、`fetch`、`github`。
- **阶段 2：团队共享**：再接 `jira`、`confluence`，并在仓库里维护统一 `.mcp.json` 与环境说明。
- **阶段 3：业务集成**：再接 Figma、内部 API、数据库、发布平台、运维平台、报表系统，把 AI 从“代码助手”升级成“工作流助手”。

---
## 自定义 MCP Server
当现成 server 不满足业务诉求时，就应该考虑自己写一个。最典型的触发条件是：你有内部系统、内部 API、内部流程，但不想把原始能力直接暴露给 AI，而是希望用少量高层 Tool 做安全封装。

### 什么时候值得自定义
- 公司内部系统没有现成 server。
- 你只想暴露一组极小但高价值的能力。
- 你想把复杂业务流程包装成高层业务动作。
- 你要把多个后端系统聚合成一个面向 AI 的统一入口。

### 最小结构长什么样
一个最小自定义 MCP Server 通常包括：
- server 元信息
- capability 声明
- Tool / Resource / Prompt 定义
- transport 连接代码
- 访问外部系统的业务逻辑

### TypeScript SDK 极简示例
```ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'

const server = new Server(
  { name: 'team-helper', version: '0.1.0' },
  { capabilities: { tools: {} } }
)

server.tool(
  'search_release_notes',
  '根据版本号搜索内部发布记录',
  { version: z.string().min(1) },
  async ({ version }) => {
    const result = `release notes for ${version}`
    return {
      content: [{ type: 'text', text: result }]
    }
  }
)

const transport = new StdioServerTransport()
await server.connect(transport)
```
这个示例虽然极简，但已经说明核心思路：对 Host 暴露的是标准 Tool，底层真正接的是你自己的 SQL、REST、SDK 或内部服务。

### 设计 Tool 的经验
不要把底层 API 原封不动映射成几十个 Tool，更推荐：
- Tool 名称描述**业务动作**，不要描述底层 endpoint。
- 参数尽量业务化、高层化。
- 返回结果尽量简洁、结构化、可直接被模型消费。
- 高风险动作要做服务端校验，不要只依赖模型“自觉”。
好的命名示例：`create_incident_ticket`、`find_customer_orders`、`get_device_binding_status`、`generate_release_summary`。
不好的命名示例：`post_v1_ticket_create`、`get_list_data_2`、`run_api_xx_legacy`。

### stdio vs HTTP：自定义时怎么选
| 方案 | 最适合的场景 | 结论 |
|------|------|------|
| stdio | 本地开发、单机工具、内网脚本 | 最适合快速起步 |
| SSE | 已有远程事件流基础设施 | 适合兼容既有系统 |
| Streamable HTTP | 团队共享、生产部署、统一鉴权 | 更适合长期演进 |
如果你在做 POC、只有自己用、要访问本机文件或环境，优先 stdio；如果团队很多人要共用，且需要统一网关、鉴权、限流、审计，优先 HTTP。

### 自定义 Server 的安全边界
至少做到以下几点：
- 只暴露必要能力，不要把整套后台 API 裸露给 AI。
- 对写操作使用最小权限 token。
- 对高风险 Tool 做二次确认、参数校验或 allowlist。
- 所有调试日志写到 `stderr`，不要污染协议 `stdout`。
- 为关键动作保留审计日志。
如果是公司内部平台，建议把审批、删除、转账、批量修改这类动作做成独立高风险 Tool，并在服务端强校验，不要把安全责任完全交给模型。

---
## 从零创建一个 MCP Server（完整流程）

上面的「自定义 MCP Server」讲了核心概念，这一节给出完整的创建流程，包括项目初始化、多 Tool 实现、调试、注册到 Host。

### Step 1：初始化项目

```bash
mkdir my-mcp-server && cd my-mcp-server
npm init -y
npm install @modelcontextprotocol/sdk zod
npm install -D typescript @types/node tsx
npx tsc --init --target es2022 --module nodenext --moduleResolution nodenext --outDir dist
```

在 `package.json` 中添加：
```json
{
  "type": "module",
  "bin": { "my-mcp-server": "./dist/index.js" },
  "scripts": {
    "build": "tsc",
    "dev": "tsx src/index.ts"
  }
}
```

### Step 2：编写 Server 入口

```ts
// src/index.ts
#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'

const server = new Server(
  { name: 'my-mcp-server', version: '1.0.0' },
  { capabilities: { tools: {}, resources: {} } }
)

// ---- Tool 定义 ----

// Tool 1: 查询设备信息
server.tool(
  'get_device_info',
  '根据设备 MAC 地址查询设备基本信息',
  { mac: z.string().describe('设备 MAC 地址，格式 AA:BB:CC:DD:EE:FF') },
  async ({ mac }) => {
    // 实际场景：调用内部 API 或数据库
    const info = await fetchDeviceInfo(mac)
    return {
      content: [{ type: 'text', text: JSON.stringify(info, null, 2) }]
    }
  }
)

// Tool 2: 查询固件版本
server.tool(
  'get_firmware_versions',
  '查询指定产品型号的固件版本列表',
  {
    productModel: z.string().describe('产品型号，如 SmartCam_V3'),
    limit: z.number().optional().default(5).describe('返回条数')
  },
  async ({ productModel, limit }) => {
    const versions = await fetchFirmwareVersions(productModel, limit)
    return {
      content: [{ type: 'text', text: JSON.stringify(versions, null, 2) }]
    }
  }
)

// ---- Resource 定义（可选） ----

server.resource(
  'config://app-settings',
  'config://app-settings',
  async () => ({
    contents: [{
      uri: 'config://app-settings',
      mimeType: 'application/json',
      text: JSON.stringify({ env: 'development', region: 'us-west-2' })
    }]
  })
)

// ---- 启动 ----

const transport = new StdioServerTransport()
await server.connect(transport)
```

### Step 3：本地调试

```bash
# 方法 1：用 MCP Inspector（官方调试 UI）
npx @modelcontextprotocol/inspector tsx src/index.ts

# 方法 2：直接在 Claude Code 中测试
# 先在 .claude/settings.json 中注册（见 Step 4）
# 然后用 /mcp 命令验证
```

Inspector 会在浏览器打开一个调试面板，可以：
- 查看 Server 暴露的所有 Tools / Resources
- 手动发送请求并查看响应
- 观察 JSON-RPC 通信日志

### Step 4：注册到 Host

**Claude Code**（项目级）：
```json
// .mcp.json（项目根目录）
{
  "mcpServers": {
    "my-mcp-server": {
      "command": "tsx",
      "args": ["src/index.ts"],
      "cwd": "/path/to/my-mcp-server"
    }
  }
}
```

**Claude Code**（全局）：
```json
// ~/.claude/settings.json
{
  "mcpServers": {
    "my-mcp-server": {
      "command": "node",
      "args": ["/path/to/my-mcp-server/dist/index.js"]
    }
  }
}
```

**Copilot CLI**：
```json
// ~/.copilot/config.json（servers 字段）
{
  "mcpServers": {
    "my-mcp-server": {
      "command": "node",
      "args": ["/path/to/my-mcp-server/dist/index.js"]
    }
  }
}
```

注册后验证：
```bash
# Claude Code
claude mcp list              # 查看已注册 server
# 进入会话后
/mcp                         # 查看连接状态和 Tool 列表
```

### Step 5：发布与共享

```bash
# 构建
npm run build

# 团队内共享：推到内部 Git 仓库，其他人 clone 后注册路径即可
# 公开发布：发到 npm
npm publish
# 使用时：npx my-mcp-server
```

### Python 版最小示例

如果更熟悉 Python：

```python
# server.py
from mcp.server import Server
from mcp.server.stdio import stdio_server

app = Server("my-mcp-server")

@app.tool()
async def get_device_info(mac: str) -> str:
    """根据 MAC 地址查询设备信息"""
    # 调用内部 API
    return f"Device info for {mac}: online, firmware 1.2.3"

@app.tool()
async def search_logs(keyword: str, hours: int = 24) -> str:
    """搜索最近 N 小时的设备日志"""
    return f"Found 42 logs matching '{keyword}' in last {hours}h"

async def main():
    async with stdio_server() as (read, write):
        await app.run(read, write)

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
```

安装依赖并注册：
```bash
pip install mcp
# 注册到 Claude Code
claude mcp add my-server -- python server.py
```

---
## 对 iOS / 移动端开发者的实际意义

对于 iOS 或移动端开发工程师，MCP 不只是"又一个协议概念"，而是直接影响日常开发效率的基础设施。

### 已经在用的 MCP Server

| Server | 日常用途 |
|--------|---------|
| **GitHub** | 在 AI 对话中直接查 PR、提 Issue、读代码、看 CI 状态，不用切浏览器 |
| **Confluence** | 搜索和更新团队技术文档，AI 能直接读写 Wiki |
| **Jira** | 查 Ticket 详情、更新状态、关联 Issue，免去频繁切换 |
| **Figma** | 读取设计稿节点和样式，辅助 UI 还原 |
| **Filesystem** | AI 安全地读写本地项目文件 |
| **Fetch** | AI 直接访问 URL，获取 API 文档、网页内容 |

### 潜在的自定义 MCP Server 场景

以下是移动端 / IoT 开发中值得自建 MCP Server 的典型场景：

**1. 设备调试助手 Server**
```
Tool: get_device_status     — 通过 MAC 查设备在线状态
Tool: get_device_properties — 查询 IoT 属性（通过内部 API）
Tool: search_device_logs    — 搜索设备日志
Tool: get_firmware_info     — 查询固件版本和更新记录
```
意义：调试智能设备时，不用手动登录后台系统查数据，直接在 AI 对话中查。

**2. 工程依赖管理 Server**
```
Tool: check_pod_versions    — 查询各 Pod / Package 最新版本
Tool: compare_versions      — 对比当前 Podfile.lock 与最新版本差异
Tool: get_module_config     — 读取模块配置信息
Tool: search_api_docs       — 搜索内部 SDK 接口文档
```
意义：版本管理和 API 查找自动化，减少手动翻文档时间。

**3. MQTT / IoT 协议调试 Server**
```
Tool: decode_mqtt_payload   — 解码 MQTT 消息体
Tool: simulate_iot_action   — 模拟发送 IoT 指令（测试环境）
Tool: get_property_def      — 查询 IoT 属性定义
```
意义：IoT 开发中最耗时的是协议调试，AI 能直接解码消息、查属性定义、模拟指令。

### 为什么 MCP 对移动端开发者特别有价值

1. **多仓库协作** — 大型 App 开发通常涉及多个仓库（主工程、SDK、UI 组件、业务模块等），MCP 让 AI 能跨仓库理解上下文
2. **协议层复杂** — IoT 设备的 BLE、MQTT、HTTP 多层通信，用 MCP 把协议文档和调试工具接入 AI，大幅降低排查成本
3. **知识碎片化** — 设备属性、固件版本、绑定流程等知识分散在 Wiki、Issue、代码注释中，一个 Knowledge MCP Server 能做统一入口
4. **团队复用** — 一个人写好的 MCP Server，整个团队都能用，不需要每人重复配置

### 落地建议

| 阶段 | 做什么 | 预期收益 |
|------|--------|---------|
| **现在** | 用好 GitHub + Confluence + Jira + Figma 四个社区 Server | 减少 50% 的浏览器切换 |
| **短期** | 写一个依赖版本查询 Server（Python，~100 行） | 版本管理自动化 |
| **中期** | 写一个设备调试 Server，接内部 API | IoT 调试效率提升 |
| **长期** | 建团队级 MCP 资产清单，统一管理 | 新人上手快，知识不丢失 |

---
## 调试与排查
MCP 真正难的地方通常不是“怎么写配置”，而是“为什么它没连上、没发现、没调用成功”。下面是一套很实战的排查思路。

### 常见问题一览表
| 现象 | 常见原因 | 优先排查 |
|------|------|------|
| server 没启动 | `command` 错、依赖没装、路径不存在 | 直接在终端单独运行命令 |
| tool 没出现 | Host 没重新发现、能力声明不完整 | 重启 Host，检查 `capabilities` |
| 401 / 403 | token 错、权限不够 | 检查 env、scope、服务端权限 |
| 连接超时 | URL 不通、代理拦截、SSE 中断 | `curl` 测试 endpoint |
| 协议解析失败 | 日志污染了 `stdout` | 确认日志写到 `stderr` |
| 可见但调用失败 | schema 或业务逻辑异常 | 单独跑 server 看调试日志 |

### 第一原则：先验证 Server，再怀疑 Host
如果是 `stdio` server，先直接在 terminal 里跑 `command + args`。只要 server 自己都起不来，Host 就不可能连得上。
例子：
```bash
npx -y @anthropic/mcp-server-filesystem /Users/jinhui.zhang/Desktop/claude-docs
```

### Claude Code 常用排查命令
```bash
claude mcp list
```
作用：确认 server 是否注册成功、名字与 transport 是否正确。
在会话里：
```text
/mcp
```
作用：查看连接状态、每个 server 暴露了多少 tool、是否处于 pending / failed。

### Copilot CLI 常用排查入口
重点看：
- 改配置后是否重启了 CLI。
- `/mcp` 是否出现目标 server。
- `/env` 是否显示当前 session 已加载 MCP 环境。
- server 是启动时失败，还是调用时失败。
因为 Copilot CLI 采用**启动时发现**，所以“重启 session”通常是排查第一步之一。

### 网络类问题怎么查
远程 SSE / HTTP server 至少做这几步：
```bash
curl -I https://your-mcp-server.example.com
```
```bash
curl -H "Authorization: Bearer $TOKEN" https://your-mcp-server.example.com
```
重点验证：DNS 是否正常、TLS 证书是否正常、认证头是否传对、公司代理或网关是否拦截。

### Debug commands 清单
最常用的一组调试命令是：
```bash
claude mcp list
```
```text
/mcp
```
```text
/env
```
```bash
curl -I <mcp-endpoint>
```
```bash
<your-server-command>
```
如果是远程部署，还要补看：`docker logs <container>`、`journalctl -u <service>`、Kubernetes / Serverless 平台日志、API gateway / ingress 日志。

### Log locations：日志看哪里最靠谱
没有一条“所有 Host 都完全一致”的固定日志路径，所以最稳妥的日志来源通常有三类：
1. **Server 自身的 `stderr`**：首选，尤其适合 `stdio` server。
2. **Host 的状态视图**：Claude Code 的 `/mcp`，Copilot CLI 的 `/mcp`、`/env`。
3. **部署平台日志**：Docker、systemd、Kubernetes、Serverless、API gateway。
所以调试时不要执着找一个神秘固定目录，优先看“server 自身 stderr + Host 状态页 + 平台日志”这三层。

### 推荐排查顺序
1. 单独运行 server 命令。
2. 确认依赖与环境变量存在。
3. 确认远程 endpoint 可达。
4. 重启 Host 重新发现。
5. 查看 `/mcp` 或 `/env`。
6. 做一次最小调用验证。
7. 最后才排查 prompt 层面的问题。

### 四个高频坑
- **坑 1：日志打印到 `stdout`**。结果通常是 tool list 拉取失败、连接中断、Host 报协议错误。
- **坑 2：把 token 写进仓库**。短期方便，长期一定是风险。
- **坑 3：一个 server 暴露太多杂乱工具**。Host 难以选择，模型也更容易误用。
- **坑 4：没有最小验证链路**。正确做法是先验证只读 Tool，再验证简单写操作，最后验证跨 server 组合任务。

---
## MCP vs 传统 API 集成
很多团队真正关心的问题不是“什么是 MCP”，而是“我们已经有 API 了，为什么还要在前面再做一层 MCP”。答案很简单：**API 是给系统和开发者用的，MCP 是给 AI Host 标准化消费的。**

### 对比表
| 维度 | MCP | 传统硬编码 API 集成 |
|------|------|------|
| 目标 | 标准化 AI 接入 | 为某个 Host 写专用适配 |
| 复用性 | 高，一个 server 可被多个 Host 使用 | 低，往往绑定单一产品 |
| 迁移成本 | 低，换 Host 更容易 | 高，换 Host 近似重写 |
| 能力模型 | Tools / Resources / Prompts 统一抽象 | 每家 SDK 和接口风格不同 |
| 团队协作 | 更容易共享配置和文档 | 通常只能共享代码片段 |
| 治理能力 | 更容易做统一权限、审计、限流 | 适配层分散，治理成本高 |
| 长期维护 | 边界清晰，更适合演进 | 容易随着 Host 变化重复返工 |

### 传统集成仍然有价值吗
当然有。以下情况直接写 API 集成仍然合理：
- 只服务单一产品。
- 生命周期很短。
- 只是一次性自动化脚本。
- 根本不需要被多个 AI Host 复用。
但如果你的目标是让 Claude Code、Copilot CLI、IDE Agent、Web Agent 都能共享同一套业务能力，那 MCP 几乎一定更合适。

### MCP 的组织级收益
MCP 真正的长期价值通常不是“单次任务快了几秒”，而是：
- 新工具接入更快。
- 新 Host 上线更轻松。
- 权限模型更统一。
- 审计与治理更容易。
- 内部能力更容易产品化。

---
## 落地建议
如果你准备在真实团队里推进 MCP，建议按下面顺序做。

### 1. 先做对，再做大
第一批只接：`filesystem`、`fetch`、`github`。先把链路跑稳，再扩展到 Jira、Confluence、Figma 和内部系统。

### 2. 先做只读，再放写操作
先开放搜索、读取、摘要；再开放创建、更新、删除、触发。这比一开始就给 AI 全量写权限安全得多。

### 3. Tool 要表达业务动作，不要暴露底层 endpoint
模型更适合调用 `create_incident_ticket`，不适合面对十几个 `post_v1_xxx` 风格的接口名。

### 4. 尽量让 Claude Code 与 Copilot CLI 共用命名体系
推荐固定一组名字：`github`、`jira`、`confluence`、`figma`、`fetch`、`filesystem`。这样跨 Host 切换时，团队认知成本最低。

### 5. 维护一份团队级 MCP 资产清单
建议记录：server 名称、负责人、transport 类型、配置位置、所需环境变量、风险等级、最小验证方法。这会比“大家各自装一下”更适合长期维护。

---
## 结语
MCP 的重点从来不是“又一个新协议”，而是它把 AI 连接外部世界这件事标准化了。它用 Tools、Resources、Prompts 建立统一能力模型，让 Claude Code、Copilot CLI 这类 Host 能在同一套协议下共享越来越多的服务生态。
如果只记一句话，记这个：
> **MCP 让 AI Host 不必为每个外部系统重复发明集成方式。**
对个人开发者，它意味着更强的自动化；对团队，它意味着更低的集成成本；对组织，它意味着更容易治理的 AI capability layer。这也是为什么，MCP 很可能会成为未来 AI 工具生态里的基础协议之一。

---

> **参考来源：** [Awesome MCP Servers](https://github.com/punkpeye/awesome-mcp-servers)
