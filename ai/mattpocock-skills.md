# Matt Pocock Skills — 实战工程 Skill 合集
> 适用对象：Claude Code、Codex、Copilot CLI、各类 coding agents 使用者  
> 更新日期：2026-05-11  
> 目标：快速理解 `mattpocock/skills` 的定位、安装方式、核心 workflow 与落地价值
---
## 简介
`mattpocock/skills` 是 Matt Pocock 维护的一套开源 agent skill pack，核心目标很明确：把 **真实工程纪律** 包装成可复用、可组合、可改造的 skills，而不是让 AI “自由发挥”做 vibe coding。
### Matt Pocock 是谁
Matt Pocock 是知名 **TypeScript educator**，也是 **Total TypeScript** 的创建者。他在开发者社区里长期输出 TypeScript 教学内容，同时也在持续推广 AI-assisted engineering 的实践方法。
README 明确提到，他围绕这套 skills 维护的 newsletter 已经吸引 **~60,000 other devs**。这说明这不是一次性 prompt 集，而是一套被大量开发者持续关注和试用的工程工作流。
### 这个仓库是什么
它是一套面向以下对象的通用 skills：
- Claude Code
- Codex
- 其他 coding agents
- 任意支持 slash command / workflow prompt 的 AI 编程工具
仓库一共包含 **18 个 skills**，分为 3 组：
- **Engineering**：10 个
- **Productivity**：4 个
- **Misc**：4 个
### 核心哲学
README 的开场白非常有代表性：
> "My agent skills that I use every day to do real engineering - not vibe coding."
它的设计原则也写得很清楚：
> "These skills are designed to be small, easy to adapt, and composable. They work with any model. They're based on decades of engineering experience. Hack around with them. Make them your own. Enjoy."
可以把这套仓库概括为 4 个关键词：
- **small**：每个 skill 只解决一个明确问题
- **composable**：可以按顺序串联，也可以单独使用
- **hackable**：鼓励你按团队习惯改写和组合
- **model-agnostic**：不绑定某个模型或某个平台
一句话总结：
> 这不是“让 AI 替你写代码”，而是“把工程方法论变成 AI 可执行的工作流”。
### 仓库链接与热度
- GitHub：<https://github.com/mattpocock/skills>
- Newsletter：<https://www.aihero.dev/s/skills-newsletter>
- skills.sh installer：<https://skills.sh/mattpocock/skills>
- Stars：![GitHub Repo stars](https://img.shields.io/github/stars/mattpocock/skills?style=social)
- 当前抓取热度：约 **70.8k+ ⭐**
---
## 安装
安装命令只有一条：
```bash
npx skills@latest add mattpocock/skills
```
### 标准安装流程
1. 执行安装命令。
2. 选择你要安装的 skills。
3. 选择这些 skills 要安装到哪些 coding agents 上。
4. **务必勾选 `/setup-matt-pocock-skills`**。
5. 进入 agent 后运行 `/setup-matt-pocock-skills`。
6. 根据提示完成当前 repo 的基础配置。
### setup flow 会配置什么
README 说明，`/setup-matt-pocock-skills` 会引导你配置：
- issue tracker：GitHub / Linear / local files
- triage 使用的 labels
- 生成文档的保存位置
也就是说，这套 skills 不是单纯的 prompt 文本集合，而是带有 **per-repo scaffold** 能力的工程工具包。
### 实用理解
你可以把安装拆成两层：
```text
第一层：安装通用 skill pack
第二层：把当前 repo 绑定到具体 workflow
```
这样做的价值在于：同一套 skill 可以复用于不同仓库，但每个仓库又能拥有自己的文档布局、issue 流程和 triage 习惯。
---
## 核心理念 — 解决 AI 编程的 4 大痛点
Matt Pocock 在 README 里没有先堆功能列表，而是先定义 AI 编程里最常见的 4 个失败模式。这个切入方式非常工程化，因为它回答的是：**为什么这些 skills 存在。**
### 1. The Agent Didn't Do What I Want — Misalignment
> "No-one knows exactly what they want"  
> — David Thomas & Andrew Hunt, *The Pragmatic Programmer*
#### 问题描述
AI coding agent 最常见的问题不是不会写，而是**没真正理解你要它做什么**。你以为自己已经描述清楚了，但 agent 往往还是会误解业务目标、忽略约束条件、漏掉边界，最后做出“看起来接近、实则不对”的结果。
#### 解决方案
README 给出的修复方式是 **grilling session**。对应 skills：
- `/grill-me`
- `/grill-with-docs`
原文表述：
> "The fix for this is a grilling session - getting the agent to ask you detailed questions about what you're building."
#### 为什么有效
这两个 skill 的价值不在于替你写计划，而在于先把模糊需求压缩成明确决策：先追问，再编码；先拆假设，再实现；先把真实意图说清楚，再让 agent 执行。
#### 实战判断
如果你常遇到“AI 上来就写”“改得很快但方向不对”“需求一变就整段返工”，优先用这两个 skill，尤其是功能开始前。
---
### 2. The Agent Is Way Too Verbose — No shared language
> "With a ubiquitous language, conversations among developers and expressions of the code are all derived from the same domain model."  
> — Eric Evans, *Domain-Driven Design*
#### 问题描述
很多 agent 显得“很啰嗦”，本质上不是因为模型爱说话，而是因为它**不懂你们团队的领域语言**。没有 shared language 时，它只能用很多普通英语去描述一个本来应该有项目内专有名称的概念。
README 给了一个很典型的例子：
- **BEFORE**："There's a problem when a lesson inside a section of a course is made 'real' (i.e. given a spot in the file system)"
- **AFTER**："There's a problem with the materialization cascade"
#### 解决方案
这个问题不是靠“让 AI 少说点”解决，而是靠 shared language。对应机制包括：
- `CONTEXT.md`
- `/grill-with-docs`
- ADRs
原文表述：
> "The Fix for this is a shared language. It's a document that helps agents decode the jargon used in the project."
以及：
> "This is built into `/grill-with-docs`. It's a grilling session, but that helps you build a shared language with the AI, and document hard-to-explain decisions in ADR's."
#### 为什么有效
README 特别指出，shared language 的收益远不止减少 verbosity，还会带来：
- **Variables, functions and files are named consistently**
- **The codebase is easier to navigate for the agent**
- **The agent also spends fewer tokens on thinking**
#### 实战判断
如果项目术语很多、命名不统一、agent 总在“解释一个本可直呼其名的概念”，就该优先引入 `CONTEXT.md` 这条线。
---
### 3. The Code Doesn't Work — No feedback loops
> "Always take small, deliberate steps. The rate of feedback is your speed limit. Never take on a task that’s too big."  
> — David Thomas & Andrew Hunt, *The Pragmatic Programmer*
#### 问题描述
即使需求对齐了，agent 产出的代码也未必能工作。问题通常出在反馈闭环缺失：它写了代码，但没有足够快、足够稳定的反馈去验证实现是否正确，于是整个过程处于“盲飞”状态。
README 原话：
> "Without feedback on how the code it produces actually runs, the agent will be flying blind."
#### 解决方案
Matt 给出的修复动作是建立反馈闭环，重点技能有：
- `/tdd`
- `/diagnose`
关于测试：
> "For automated tests, a red-green-refactor loop is critical."
关于调试：
> "I've also built a `/diagnose` skill that wraps best debugging practices into a simple loop."
#### 为什么有效
`/tdd` 通过 red-green-refactor 把 agent 锁进稳定反馈回路；`/diagnose` 则把 bug 修复变成纪律化流程，而不是凭感觉乱改。两者共同作用的核心，就是让 agent 每一步都有证据支撑。
#### 实战判断
如果你的 AI 生成代码经常“像能跑但不稳”“修一个炸两个”“看起来合理但回归一片红”，优先补 feedback loops，而不是换更强的模型。
---
### 4. We Built A Ball Of Mud — Software entropy
> "Invest in the design of the system every day."  
> — Kent Beck, *Extreme Programming Explained*
> "The best modules are deep. They allow a lot of functionality to be accessed through a simple interface."  
> — John Ousterhout, *A Philosophy of Software Design*
#### 问题描述
AI 写代码速度越快，软件熵增往往也越快。短期看是交付提速，长期看却可能变成：模块边界混乱、命名漂移、重复实现增多、修改成本越来越高，最后形成一个典型的 **Ball of Mud**。
README 原话：
> "Because agents can radically speed up coding, they also accelerate software entropy."
#### 解决方案
这个问题不能只靠最后一次“大重构”解决，而要把架构思考融入平时工作流。README 提到的关键 skills：
- `/to-prd`
- `/zoom-out`
- `/improve-codebase-architecture`
核心描述：
> "And crucially, `/improve-codebase-architecture` helps you rescue a codebase that has become a ball of mud."
#### 为什么有效
这套技能链把“架构”前移到了需求、理解和治理阶段：写 PRD 时就思考模块边界；读陌生代码时主动拉高视角；代码库变糊后显式寻找 deepening opportunities，而不是默认继续往上堆功能。
#### 实战判断
如果项目已经出现“能跑但越来越难改”的迹象，`/improve-codebase-architecture` 会比单次 code review 更接近根因治理。
---
## Skill 全览
下面按 README 的分组整理全部 18 个 skills，并补上中文落地说明。
### 🔧 Engineering — 工程实践（10 个）
| Skill | 触发命令 | 功能 | 关键特点 |
|------|------|------|------|
| diagnose | `/diagnose` | 纪律化调试 | reproduce → minimise → hypothesise → instrument → fix → regression-test |
| grill-with-docs | `/grill-with-docs` | 带文档的需求拷问 | 对齐需求、打磨术语、更新 `CONTEXT.md` 和 ADR |
| triage | `/triage` | 问题分诊 | 通过 triage roles 状态机处理 issue |
| improve-codebase-architecture | `/improve-codebase-architecture` | 改善架构 | 从 `CONTEXT.md` 的领域语言出发寻找 deepening opportunities |
| setup-matt-pocock-skills | `/setup-matt-pocock-skills` | 初始化仓库配置 | 每个 repo 跑一次，建立 issue tracker / labels / doc layout |
| tdd | `/tdd` | 测试驱动开发 | red-green-refactor，一次只推进一个 vertical slice |
| to-issues | `/to-issues` | 拆 issue | 把 plan / spec / PRD 拆成可独立领取的 GitHub issues |
| to-prd | `/to-prd` | 生成 PRD | 把对话上下文转为 PRD，并提交为 GitHub issue |
| zoom-out | `/zoom-out` | 拉高代码视角 | 在陌生代码里给 agent 补 broader context |
| prototype | `/prototype` | 快速原型 | 构建 throwaway prototype、terminal app 或多种 UI variation |
#### `/diagnose`
这是典型的“把调试纪律写成 skill”。适合 bug 原因不清、agent 容易一上来乱改的场景。它的核心价值是：**先收集证据，再动代码**。当你需要复现问题、缩小范围、验证根因、补回归时优先用它。
#### `/grill-with-docs`
这是整套仓库最有代表性的 skill。它不是普通问答，而是“需求拷问 + 术语治理 + 文档沉淀”的复合入口。适合中大型功能、术语复杂的业务项目，以及任何你希望 AI 越用越懂仓库的场景。
#### `/triage`
面向 issue 分诊而不是编码本身。适合 issue 较多、需要统一 triage 流程、希望让“谁来处理、怎么归类、下一步是什么”更标准化的团队。
#### `/improve-codebase-architecture`
专门针对 Ball of Mud 问题。适合代码还能跑、但结构越来越难改的仓库。它关注的是架构深化机会，而不是“大拆大改”。
#### `/setup-matt-pocock-skills`
这是仓库初始化 skill。适合第一次把这套 skills 引入某个 repo 时使用，通常每个 repo 跑一次即可，主要解决 issue tracker、labels 与 docs layout 的落地问题。
#### `/tdd`
这是最硬核的工程实践 skill 之一。适合新功能、bug fix、核心逻辑、回归风险高的改动。它要求一次只做一个 vertical slice，避免 agent 连续生成大块未经验证的代码。
#### `/to-issues`
适合把已经形成的 plan / spec / PRD 拆成可并行执行的问题单元。它强调 vertical slices，而不是按前后端、数据库、UI 这种横向技术层切分任务。
#### `/to-prd`
它把聊天上下文变成正式 PRD，是从“讨论”进入“工程对象”的关键桥梁。适合已经明确方向、但还缺一份正式、可追踪、可提交产物的场景。
#### `/zoom-out`
这是很容易被低估的 skill。它不是解释局部实现，而是告诉 agent：**把当前代码放回整个系统里理解**。很适合陌生项目接手、局部代码看不懂上下文、想快速理解系统关系时使用。
#### `/prototype`
适合快速试错，不适合直接走正式实现。你可以用它搭一个 terminal app 验证逻辑，或者同时做多个 UI 版本比较。关键词是 **throwaway**：先验证思路，再决定是否正式落地。
---
### 📋 Productivity — 生产力工具（4 个）
| Skill | 触发命令 | 功能 | 关键特点 |
|------|------|------|------|
| caveman | `/caveman` | 极致压缩沟通 | token 用量大约减少 75% |
| grill-me | `/grill-me` | 纯对话式拷问 | 连续追问直到关键决策被解决 |
| handoff | `/handoff` | 会话交接 | 把长对话压缩成交接文档给另一个 agent |
| write-a-skill | `/write-a-skill` | 编写新 skill | 结构规范，考虑 progressive disclosure |
#### `/caveman`
这是一个沟通协议型 skill，目标不是优雅表达，而是高密度、低 token、足够可用的协作语言。如果你和 agent 已经建立了默契，或者上下文成本很高，它会非常有效。
#### `/grill-me`
README 直接把它列为 most popular skills 之一。它比 `/grill-with-docs` 更轻量，适合快速完成需求对齐、澄清约束、补齐边界，而不一定立刻进入文档治理。
#### `/handoff`
真实协作里，最大的成本之一是上下文切换。`/handoff` 的价值是把长会话压缩成另一个 agent 能立即接手的 handoff document，而不是让它从头读完整历史。
#### `/write-a-skill`
当你已经不满足于“用 skill”，而想沉淀自己的工作流时，这个 skill 非常有价值。它帮助你按规范创建 skill，并考虑 progressive disclosure 等更专业的 skill 设计方式。
---
### 🧰 Misc — 辅助工具（4 个）
| Skill | 触发命令 | 功能 | 关键特点 |
|------|------|------|------|
| git-guardrails-claude-code | `/git-guardrails-claude-code` | Git 安全护栏 | 阻止危险命令：push、reset --hard、clean |
| migrate-to-shoehorn | `/migrate-to-shoehorn` | 迁移测试文件 | 把 `as` 迁移到 `@total-typescript/shoehorn` |
| scaffold-exercises | `/scaffold-exercises` | 练习脚手架 | 创建 exercise 目录结构 |
| setup-pre-commit | `/setup-pre-commit` | pre-commit 配置 | Husky + lint-staged + Prettier + type checking |
#### `/git-guardrails-claude-code`
这是偏安全治理的 skill。对任何真实仓库都很实用，因为它优先解决“AI 误执行 destructive git actions”的风险，而不是事后补救。
#### `/migrate-to-shoehorn`
这是强领域相关的迁移 skill，适合已经在 Total TypeScript 生态里使用 `@total-typescript/shoehorn` 的项目。它展示了 skill 也可以包装非常具体的迁移套路。
#### `/scaffold-exercises`
偏教学 / 内容生产场景。适合需要标准化练习目录、快速搭 exercise 结构时使用，不是通用工程入口，但属于典型的高频小工具。
#### `/setup-pre-commit`
偏工程基础设施。适合新仓库初始化、规范 pre-commit 质量门禁时使用。它将 Husky、lint-staged、Prettier 和 type checking 组合成一条可快速落地的默认防线。
---
## 核心 Skill 深度解析
下面挑 5 个最值得优先掌握的 skills 展开说明。
### 1. `/grill-with-docs` — the most powerful skill
#### 它解决什么
它把 3 件事情合成一个入口：需求拷问、shared language 建设、文档沉淀。对于长期项目来说，这比单纯“问几个问题再写代码”强得多。
#### 工作流 / loop
一个典型流程可以理解为：
1. 连续追问需求与边界；
2. 提炼领域术语和项目内概念；
3. 检查这些术语是否已有统一表达；
4. 把稳定术语写回 `CONTEXT.md`；
5. 把难以口头传达的关键决策写成 ADR；
6. 再把已经澄清的上下文交给后续实现流程。
#### 什么时候用
- 新功能开始前
- 业务模型复杂时
- 项目术语很多时
- 希望 AI 越做越懂这个仓库时
#### 预期输出
- 更清晰的需求边界
- 一组稳定术语
- 更新后的 `CONTEXT.md`
- 关键决策 ADR
- 更稳定的后续实现前提
#### 为什么它最强
因为它解决的是“长期上下文质量”而不是“单次任务效率”。一旦 shared language 形成，后续提示会更短、命名更稳、解释更少废话、agent 的导航和推理成本都会下降。
---
### 2. `/grill-me` — the most popular skill
#### 它解决什么
它通过持续追问，把“我大概想做 X”压实成“我明确决定做 X，并且知道边界在哪”。这是最轻量、最通用、最高频的需求对齐工具。
#### 工作流 / loop
常见过程是：agent 提问 → 你回答 → 继续追问未决点 → 每轮消灭一个模糊区 → 直到关键决策收敛，再把结论交给后续 skill 或实现。
#### 什么时候用
- 任务不算特别大，但也不想直接开写
- 当前不一定需要文档治理
- 想快速澄清约束、风险、边界
#### 预期输出
- 明确的需求定义
- 一组关键约束
- 已决策事项列表
- 一个 agent 可直接执行的清晰任务描述
#### 与 `/grill-with-docs` 的差异
`/grill-me` 更轻、更快、更偏一次性对齐；`/grill-with-docs` 更系统，更适合长期项目沉淀共享语境。
---
### 3. `/tdd` — red-green-refactor
#### 它解决什么
它的目标不是“更学院派”，而是给 agent 一个稳定的反馈回路，避免它在没有证据的情况下连续生成大量代码。
#### 工作流 / loop
标准 loop 就是：
1. 先写失败测试；
2. 运行并确认真的失败；
3. 写最小实现让测试变绿；
4. 重构实现与测试；
5. 保持绿色后再进入下一个 vertical slice。
#### 什么时候用
- 新功能开发
- bug fix
- 核心业务逻辑
- 回归风险高的改动
#### 预期输出
- 有意义的失败测试
- 最小通过实现
- 更稳的回归保护
- 更可解释的演化路径
#### 为什么有效
README 里那句 "The rate of feedback is your speed limit." 对 AI coding 尤其成立。没有反馈，再强的模型也会偏航；有了失败测试，agent 的每一步都有明确的对错信号。
---
### 4. `/diagnose` — debugging loop
#### 它解决什么
它把“修 bug”从灵感型活动变成纪律化流程，避免 agent 直接猜根因、直接改代码、改完又解释不清为什么修好了。
#### 工作流 / loop
README 给出的链路非常完整：
- reproduce
- minimise
- hypothesise
- instrument
- fix
- regression-test
换成实战语言就是：先稳定复现，再缩小问题面，再提出根因假设，再打点验证，最后做最小必要修复并补回归验证。
#### 什么时候用
- bug 原因不明确
- 复现路径不稳定
- 涉及复杂上下文
- 你不想让 agent 一上来就乱改
#### 预期输出
- 可复现路径
- 经验证的根因假设
- 最小修复方案
- 回归验证步骤或回归测试
#### 为什么有效
`/diagnose` 把“碰巧修好”尽量转化为“有证据地修好”。这对真实工程非常重要，因为只有可解释的修复才能持续复用。
---
### 5. `/improve-codebase-architecture` — architecture improvement
#### 它解决什么
它专门应对软件熵增，帮助你从现有代码库里识别结构深化机会，而不是等系统彻底失控后再考虑重构。
#### 工作流 / loop
基于 README，可以把它理解为：读取当前代码结构 → 结合 `CONTEXT.md` 的领域语言理解系统 → 找出职责混杂和边界模糊区域 → 识别可深化模块 → 提出更深、更稳、更容易长期维护的结构改进方向。
#### 什么时候用
- 代码越来越黏、越来越难改时
- 每轮功能迭代后做周期性治理时
- 想主动改良系统而不是被动等故障时
#### 预期输出
- 架构问题清单
- 可执行的改良方向
- 更贴合领域术语的模块边界建议
- 一组可以逐步落地的演进方案
#### 为什么值得周期性运行
AI 越能提速，越要定期“架构清淤”。这个 skill 适合成为周期性治理动作，而不只是火烧眉毛时才启动。
---
## 与本地 Skill 对比
你的本地环境已经有一套很强的 skills。Matt Pocock 的这套 skills 并不是替代它们，而是提供非常自然的互补能力。
| 功能 | Matt Pocock | 本地 Skill |
|------|------|------|
| Brainstorming | `grill-me` / `grill-with-docs` | `brainstorming` |
| TDD | `tdd` | `test-driven-development` |
| Debugging | `diagnose` | `systematic-debugging` |
| Architecture | `improve-codebase-architecture` | `requesting-code-review` |
| Planning | `to-prd` / `to-issues` | `writing-plans` |
| Handoff | `handoff` | `checkpoint` |
### 如何理解这种映射
#### Brainstorming
Matt 的 `grill-*` 更像“拷问式对齐器”；本地 `brainstorming` 更像“结构化设计流程”。前者擅长逼出真实需求，后者擅长把需求沉淀成 spec。
#### TDD
两边都强调 red-green-refactor，只是流程包装不同。若你已经熟悉本地 `test-driven-development`，迁移到 Matt 的 `tdd` 会很自然。
#### Debugging
`diagnose` 与 `systematic-debugging` 属于同一路线：**先建立诊断闭环，再改代码**。这类 skill 的价值在于约束 agent，而不是激发 agent 的“灵感修复”。
#### Architecture
这里并不是一一对应。`improve-codebase-architecture` 偏主动寻找结构改良机会；`requesting-code-review` 更偏实现完成后的质量审查。两者串用效果更好：先找问题，再审具体改动。
#### Planning
Matt 的 `to-prd` / `to-issues` 更偏“把对话生成正式需求对象再拆任务”；本地 `writing-plans` 更偏“基于既定需求拆执行计划”。它们处于同一链路的不同层。
#### Handoff
`handoff` 强调跨 agent、跨上下文的紧凑移交；`checkpoint` 强调跨 session 的进度持久化与恢复。一个偏沟通对象，一个偏状态保存。
### 总结判断
最重要的结论是：
> 这两套 skill 体系并不冲突，反而非常适合混用。
实战上，完全可以用本地 skills 做流程总控，再用 Matt 的 skills 补强需求对齐、shared language、TDD、调试闭环和架构治理。
---
## 推荐工作流
下面是一条非常实用的组合 workflow：
### 1. `/grill-with-docs` → align on requirements
先不要急着写代码，用它把需求边界、术语、关键决策说清楚，并把 shared language 写进 `CONTEXT.md`，把复杂决策沉淀成 ADR。
### 2. `/to-prd` → generate PRD
当讨论已经收敛后，把对话上下文转成正式 PRD。这样需求不再只存在于聊天窗口，而变成一个可跟踪、可提交、可继续拆解的工程对象。
### 3. `/to-issues` → break into issues
把 PRD 拆成 independently-grabbable GitHub issues，尽量按 vertical slices 切分，而不是按技术层横切，以便多人或多 agent 并行推进。
### 4. `/tdd` → implement with tests
进入实现阶段时，使用 red-green-refactor 控制节奏。每次只推进一小段，并用测试把需求与实现绑在一起，降低 agent “大段生成、局部错误”的概率。
### 5. `/diagnose` → debug if needed
如果过程中出现 bug，不要立刻乱改。切到 `/diagnose`，先复现、再定位、再修复、再回归验证，把修 bug 也纳入反馈闭环。
### 6. `/improve-codebase-architecture` → periodic cleanup
功能完成后不要默认系统仍然健康。定期运行架构治理 skill，检查是否出现 Ball of Mud 趋势，并持续寻找模块深化机会。
### 这条 workflow 的本质
它覆盖了 6 个阶段：**对齐 → 文档化 → 拆分 → 实现 → 调试 → 治理**。和“一步生成代码”的 AI 流程相比，它的最大优势是：每一步都在给 agent 加工程约束，而不是给 agent 更多自由发挥空间。
---
## 适合什么团队采用
如果你的团队符合下面任意几条，这套仓库都值得试：
- 已经在用 Claude Code / Codex / Copilot CLI
- AI 生成代码经常方向对、细节错
- 需求对齐成本高
- 项目术语复杂，AI 很难快速进入语境
- 代码生成速度很快，但架构质量在下降
- 希望把工程纪律产品化成可复用 workflow
### 不只适用于 TypeScript
虽然 Matt Pocock 以 TypeScript 内容著名，但这些 skills 的核心并不依赖 TypeScript，而依赖通用工程原则：需求对齐、shared language、反馈闭环、架构治理、任务切分和上下文交接。因此它完全可以迁移到 Swift / iOS、Python、Node.js、前端项目、后端服务、CLI 工具等场景。
---
## 使用建议
### 建议一：不要一口气全用
推荐的上手顺序是：先试 `/grill-me`，再试 `/grill-with-docs`，然后把 `/tdd`、`/diagnose` 纳入日常；当团队开始需要正式化需求与架构治理时，再引入 `/to-prd`、`/to-issues`、`/improve-codebase-architecture`。
### 建议二：优先跑通 shared language
这套仓库最容易被低估的能力，往往不是 TDD，而是 `CONTEXT.md` + ADR。术语一旦统一，后续提示会更短、命名会更稳、解释会更少废话、AI 也更容易理解你的系统。
### 建议三：把它当“工程护栏”，不是“流程宗教”
Matt 在 README 里反复强调 small / adaptable / composable。正确姿势不是死记流程，而是先理解每个 skill 修复什么问题，再把真正带来收益的环节嵌入你现有的开发流。
---
## 参考资源
- GitHub：<https://github.com/mattpocock/skills>
- Newsletter：<https://www.aihero.dev/s/skills-newsletter>
- skills.sh installer：<https://skills.sh/mattpocock/skills>
- 推荐阅读：
  - *The Pragmatic Programmer*
  - *Domain-Driven Design*
  - *Extreme Programming Explained*
  - *A Philosophy of Software Design*
### 为什么这些资源重要
`mattpocock/skills` 并不是凭空发明的一组 prompt 技巧，而是把经典工程思想重新编排到 agent 时代：来自 *The Pragmatic Programmer* 的反馈与渐进式开发，来自 *Domain-Driven Design* 的 ubiquitous language，来自 *Extreme Programming Explained* 的持续设计与 TDD，以及来自 *A Philosophy of Software Design* 的 deep modules 思维。
更准确地说：
> `mattpocock/skills` 不是“AI 新发明的一套工作流”，而是“经典工程方法论在 agent 时代的一次重新编排”。
---
## 总结
如果只用一句话评价这个仓库，我会这样概括：
> 这是一套把“真实工程纪律”包装成可组合 skills 的开源仓库。
它真正抓住了 AI 编程里最常见的 4 个失败模式：
- **Misalignment**
- **No shared language**
- **No feedback loops**
- **Software entropy**
然后再用一组足够小、足够清晰、足够容易改造的 skills 去修复它们：`/grill-me`、`/grill-with-docs`、`/tdd`、`/diagnose`、`/to-prd`、`/to-issues`、`/zoom-out`、`/improve-codebase-architecture`。
如果你已经有本地 skill 体系，这套仓库最适合的定位不是“替换”，而是“增强”。其中最值得优先试的 4 个是：
1. `/grill-with-docs`
2. `/grill-me`
3. `/tdd`
4. `/diagnose`
最后给一个最实用的建议：如果你只打算先试一个 skill，就先试 `/grill-with-docs`。它最能体现 Matt Pocock 这套仓库和普通“prompt 模板集合”的根本差异。

---

> **参考来源：** [Matt Pocock · Skills For Real Engineers](https://github.com/mattpocock/skills)
