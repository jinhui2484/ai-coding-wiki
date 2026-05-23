---
title: ai-coding-ok 项目深度分析 & wyze-plugin-skills 优化建议
description: 拆解 ai-coding-ok 的 PDCA 记忆闭环、三层记忆体系与安装机制，并给出面向 wyze-plugin-skills 的完整优化路线。
---

> 2026.05.23 · 面向 wyze-plugin-skills 的优化重构建议

## 目录
- 第一部分：ai-coding-ok 项目详细解读
- 第二部分：结合 wyze-plugin-skills 的优化建议

## 第一部分：ai-coding-ok 项目详细解读

### 1.1 项目定位

**一句话：**给 AI 编程工具加上"跨 session 记忆"，让 AI 第 50 次迭代时依然知道第 1 次做了什么决策。

**解决的痛点：**

- AI 在 session 内守规矩（单次纪律），但跨 session 时上下文断裂
- 第 N+1 次对话可能"修复"时偷偷破坏第 N 次的约束
- 手写的 AGENTS.md 是快照，10 次迭代后就过时了，没人更新

**目标用户：**使用 Claude Code / Copilot / Cursor / OpenCode 做持续迭代开发的个人或团队

### 1.2 核心机制：PDCA 闭环

```text
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  Plan   │────▶│   Do    │────▶│  Check  │────▶│   Act   │
│         │     │         │     │         │     │         │
│ 读记忆  │     │ 写代码  │     │ 跑测试  │     │ 写回记忆│
│ 文件    │     │ + 测试  │     │ 验证无  │     │ 更新三  │
│         │     │         │     │ 回归    │     │ 层文件  │
└─────────┘     └─────────┘     └─────────┘     └─────────┘
     ▲                                                │
     └────────────────────────────────────────────────┘
                    记忆回写闭环
```

**关键差异化**：绝大多数工具只做 Plan → Do → Check，ai-coding-ok 的核心创新在 Act 阶段的自动回写——每次任务结束强制让 AI 更新记忆文件，形成闭环。

### 1.3 三层记忆体系

| 层级 | 文件 | 内容 | 更新时机 | 类比 |
| --- | --- | --- | --- | --- |
| 长期 | `project-memory.md` | 架构事实、硬约束、已知问题 | 事实变更时（<500 行） | 人的长期记忆 |
| 中期 | `decisions-log.md` | ADR（为什么选 A 不选 B） | 架构变更时 | 决策日记 |
| 短期 | `task-history.md` | 最近 30 条任务摘要 | 每次任务完成 | 工作日志 |

第 50 次迭代读的还是这 3 个文件，但它们已经累积了 50 条上下文——**时间越长价值越高**。

### 1.4 Skill 模式（三种工作模式）

#### Mode A — Install（首次安装）

触发：项目中没有 `.github/agent/memory/`，或用户说"install ai-coding-ok"

动作：复制模板 → 问一句"你在做什么" → AI 自动填充占位符 → 初始化第一条 task-history

#### Mode B — PDCA Plan（每次开工前）

触发：已安装，用户发起任何开发任务

动作（~30秒）：读 AGENTS.md → 读三层记忆 → 内部确认约束 → 继续执行用户任务

#### Mode C — PDCA Act（每次完工后）

触发：任务完成，准备返回结果

动作：写 task-history（必写）→ 可选写 decisions-log → 可选写 project-memory → 输出"Memory Updates"摘要

### 1.5 项目文件结构解析

```text
ai-coding-ok/
├── install.sh                # 多平台安装器
│   └── 支持: --claude / --copilot / --cursor / --opencode / --lang zh
├── install.py                # Python 版安装器（同功能）
├── templates/
│   ├── en/                   # 英文模板
│   │   ├── AGENTS.md         # 架构速查表（AI 第一个读的文件）
│   │   ├── CLAUDE.md         # Claude Code 自动加载 shim
│   │   ├── .cursor/rules/ai-coding-ok.mdc  # Cursor 规则
│   │   └── .github/
│   │       ├── copilot-instructions.md      # Copilot 行为规则
│   │       ├── project-metadata.yml         # 机器可读项目元数据
│   │       ├── PULL_REQUEST_TEMPLATE.md     # PR 模板（含记忆更新清单）
│   │       ├── workflows/                   # CI + 记忆更新提醒
│   │       └── agent/
│   │           ├── system-prompt.md         # Agent persona + PDCA 流程
│   │           ├── coding-standards.md      # 编码规范
│   │           ├── workflows.md             # 场景剧本
│   │           ├── prompt-templates.md      # Prompt 模板库
│   │           └── memory/                  # 三层记忆文件
│   └── zh/                   # 中文模板（同结构）
├── skills/ai-coding-ok/
│   └── SKILL.md              # 技能定义（Mode A/B/C 规则）
├── scripts/
│   ├── verify.sh             # 验证安装完整性（CI 用）
│   ├── customize-prompt.md   # 定制引导词（Copilot/Cursor）
│   └── upgrade-prompt.md     # 升级引导词
├── docs/
│   ├── claude-code-quickstart.md
│   ├── copilot-quickstart.md
│   ├── superpowers-combo.md  # 与 superpowers 联动方案
│   └── faq.md
└── .claude-plugin            # Claude 插件元数据
```

### 1.6 安装机制设计

| 工具 | 安装方式 | 自动加载机制 |
| --- | --- | --- |
| Claude Code | `/plugin install` 或 `install.sh --claude` | CLAUDE.md → @AGENTS.md 引用链 |
| GitHub Copilot | `install.sh --copilot` | `.github/copilot-instructions.md` 自动加载 |
| Cursor | `install.sh --cursor` | `.cursor/rules/ai-coding-ok.mdc` alwaysApply 规则 |
| OpenCode | `install.sh --opencode` | `~/.config/opencode/AGENTS.md` 全局加载 |

### 1.7 设计哲学

1. **One install, every tool** — 同一套模板适配所有 AI 工具
2. **Let AI customize AI's config** — 用户只说一句话，AI 推断剩余配置
3. **Memory that stays alive** — 不靠人手动维护，靠 PDCA 自动闭环
4. **与 superpowers 互补** — superpowers 管单次纪律，ai-coding-ok 管跨次记忆

### 1.8 局限性

- Act 步骤依赖 AI 遵守指令，实测 ~95% 可靠性（5% 靠 CI verify.sh 兜底）
- 记忆文件会膨胀：task-history 约定上限 30 条，project-memory 建议 <500 行
- 对已有 AGENTS.md 项目需手动合并
- 没有版本管理/冲突解决——多人同时写记忆文件可能冲突

## 第二部分：结合 wyze-plugin-skills 的优化建议

### 2.1 两个项目的对比

| 维度 | ai-coding-ok | wyze-plugin-skills |
| --- | --- | --- |
| 定位 | 通用记忆框架（任何项目） | 团队专用 Skill 平台（Wyze 生态） |
| 记忆机制 | 三层 .md 文件 + PDCA 自动回写 | 知识库 .md 手动维护 + checkpoint |
| 安装模型 | 模板复制到项目内 | symlink 指向统一源头 |
| 多工具支持 | Claude / Copilot / Cursor / OpenCode | Claude Code + Copilot CLI |
| 工作流 | 仅 PDCA（轻量） | 完整流水线（brainstorming → plan → TDD → review → finish） |
| 角色系统 | 无 | 6 个 Role（implementer / reviewer / kb-updater 等） |
| 协作 | 单人 | 团队分享（public/private + wyze-sync） |
| MCP | 无 | 有（knowledge-rag-mcp） |

### 2.2 可借鉴的核心理念

#### 理念 1：记忆自动回写（最高优先级）

你的 `checkpoint` skill 已经有"保存进度"的概念，但它是**手动触发**的。ai-coding-ok 的 Act 阶段是**每次任务自动执行**。

⚠️ 当前痛点：知识库文件写完后从不自动更新，随时间腐烂。

#### 理念 2：结构化记忆分层

把记忆按"衰减速度"分层：长期事实 vs 中期决策 vs 短期任务历史。你的知识库目前是扁平的 .md 文件，没有明确的更新策略。

#### 理念 3：验证兜底

verify.sh 的思路——用 CI 检查记忆文件是否被正确更新，而不是 100% 信任 AI 遵守指令。

#### 理念 4：一次安装多工具适配

同一份模板通过不同 shim 文件适配多个 AI 工具，你的 symlink 模型已经做到了 Claude + Copilot 双端同步。

### 2.3 完整优化方案

#### 方案 A：引入项目级记忆层（高优先级）

**目标：**每个 Wyze 项目（如 palmer-lock-ios）自动维护跨 session 记忆

**实施：**

```text
{project-root}/
└── .ai/
    ├── project-memory.md     # 长期：架构事实、模块关系、已知坑
    ├── decisions-log.md      # 中期：为什么 A 不选 B
    └── task-history.md       # 短期：最近 30 条任务摘要
```

**与当前知识库的关系：**

- 现有知识库（identity.md / project-structure.md / sdk-dependencies.md）= 初始化 project-memory.md 的数据源
- knowledge-base-generator orchestration 可在初始化后自动生成 `.ai/` 目录
- 三层记忆文件 commit 到项目 repo，团队成员共享

**改造工作：**

1. 新建一个 `project-memory` skill（或在 kb-updater role 中扩展）
2. 在所有 _workflow skill 的"完成"阶段注入 Act 步骤
3. 在 `verification-before-completion` skill 中增加"记忆文件是否已更新"检查

#### 方案 B：工作流自动注入 PDCA（高优先级）

**目标：**让你的强制流水线自带记忆加载和回写

```text
当前流水线：
  brainstorming → writing-plans → executing-plans → verification → code-review → finish

改造后：
  [Memory Load] → brainstorming → writing-plans → executing-plans → verification → code-review → [Memory Write] → finish
      ↑                                                                                              ↓
      │                          自动读取 .ai/project-memory + decisions-log + task-history           │
      └──────────────────────────────────────────────────────────────────────────────────────────────┘
                                              闭环
```

**改造方式：**

1. 在 `custom_instruction` 的"自检触发"中增加：`当前项目是否有 .ai/ 目录？如有，先执行 Memory Load`
2. 在 `finishing-a-development-branch` skill 中增加 Act 步骤：自动追加 task-history
3. 或者创建独立的 `memory-sync` skill，由其他 skill 在完成时调用

#### 方案 C：知识库版本化与分层重构（中优先级）

**现状问题：**

- 知识库文件是扁平的（identity.md / project-structure.md / sdk-dependencies.md）
- 没有明确的"什么时候更新什么"策略
- 知识库生成后很少被更新

**重构方案：**

| 当前文件 | 映射到三层记忆 | 更新策略 |
| --- | --- | --- |
| identity.md | project-memory.md（长期） | 仅在模块/架构变更时更新 |
| project-structure.md | project-memory.md（长期） | 新增目录/模块时自动追加 |
| sdk-dependencies.md | project-memory.md（长期） | Podfile 变更时触发 |
| （新增） | decisions-log.md（中期） | 每次重大技术选型后记录 |
| checkpoint | task-history.md（短期） | 每次 session 结束自动写入 |

#### 方案 D：kb-updater Role 升级为 Memory Agent（中优先级）

**当前 kb-updater：**被 orchestration 调用，更新知识库 .md 文件

**升级后：**成为"记忆代理"，负责三层记忆的自动维护

```text
kb-updater (升级后) 职责：
├── 读取任务上下文 → 决定更新哪些记忆层
├── task-history.md  → 每次追加摘要（30 条滚动）
├── decisions-log.md → 检测到 ADR 级别变更时追加
├── project-memory.md → 检测到事实变更时更新
└── 冲突检测 → 多人协作时提示合并
```

#### 方案 E：CI 验证记忆完整性（中优先级）

**参考 ai-coding-ok 的 verify.sh：**

```bash
#!/bin/bash
# .ai/verify.sh — 检查记忆文件完整性
EXIT_CODE=0

# 检查必要文件存在
for f in .ai/project-memory.md .ai/decisions-log.md .ai/task-history.md; do
  [[ -f "$f" ]] || { echo "MISSING: $f"; EXIT_CODE=1; }
done

# 检查 task-history 不超过 30 条
count=$(grep -c "^## " .ai/task-history.md 2>/dev/null || echo 0)
[[ $count -le 30 ]] || { echo "WARN: task-history has $count entries (cap: 30)"; EXIT_CODE=2; }

# 检查占位符是否填完
grep -rn "{{.*}}" .ai/ && { echo "UNFILLED placeholders found"; EXIT_CODE=1; }

exit $EXIT_CODE
```

可以集成到 Wyze 项目的 CI pipeline 中，或在 `pod-publish` 脚本里加一步检查。

#### 方案 F：Checkpoint → Task History 自动桥接（低优先级）

**思路：**你已有 checkpoint skill，每次 checkpoint 时自动将摘要写入项目的 `.ai/task-history.md`

**改造：**

1. checkpoint skill 完成 WIP commit 后，检测当前项目是否有 `.ai/`
2. 如有，自动追加一条 task-history 条目（标题 + 日期 + 摘要 + 变更文件列表）
3. 格式与 ai-coding-ok 兼容，便于未来迁移

#### 方案 G：superpowers 式 Skill 组合模式（低优先级）

**启发：**ai-coding-ok 设计了与 superpowers 的明确组合协议：

```text
1. ai-coding-ok Mode B  (Plan: 加载记忆)       ← 每次任务开始
2. superpowers          (brainstorming → plan → execute)
3. ai-coding-ok Mode C  (Act: 写回记忆)        ← 每次任务结束
```

你的 _workflow skill 可以抽象出类似的"前置/后置钩子"机制：

```text
Skill 执行生命周期:
  beforeExecute() → skill 主逻辑 → afterExecute()
       ↑                                    ↓
  [读记忆 / 读知识库]              [写 task-history / 更新知识库]
```

### 2.4 推荐实施路线图

| 阶段 | 内容 | 工期 | 优先级 |
| --- | --- | --- | --- |
| Phase 1 | 定义 `.ai/` 三层记忆文件格式标准<br>在 1 个项目（如 palmer-lock-ios）试点 | 1 天 | 高 |
| Phase 2 | 改造 checkpoint skill：完成时自动写 task-history<br>改造 finishing-a-development-branch：Act 阶段 | 1 天 | 高 |
| Phase 3 | 升级 kb-updater Role 为 Memory Agent<br>增加 decisions-log 写入逻辑 | 2 天 | 中 |
| Phase 4 | 在 custom_instruction 中注入"Memory Load"自检步骤<br>实现 Mode B 自动触发 | 0.5 天 | 中 |
| Phase 5 | 编写 verify.sh，集成到 CI<br>推广到其他项目 | 1 天 | 低 |

### 2.5 具体代码改动建议

#### 2.5.1 在 custom_instruction 中注入 Memory Load

```markdown
## 开发工作流强制规则 — 新增：Memory Load

### 自检触发（更新版）

每次收到开发类任务时，先回答以下问题再动手：
- [ ] 这个任务属于哪个类型？（新功能 / Bug / 重构 / 继续）
- [ ] 当前应该处于流水线的哪个 Phase？
- [ ] 前置 Phase 是否已完成？
- [ ] 当前项目是否有 .ai/ 目录？如有 → 先执行 Memory Load（读三层文件）
```

#### 2.5.2 task-history.md 条目格式

```markdown
## 2026-05-23 — 修复手势页面动画卡顿

**类型:** Bug Fix
**影响文件:** GestureAnimationVC.swift, GestureTransition.swift
**关键决策:** 将 CABasicAnimation 替换为 UIViewPropertyAnimator，避免 layer 与 view 动画冲突
**测试:** GestureAnimationTests — 3 个新增用例全部通过
**关联:** WLL-87
```

#### 2.5.3 decisions-log.md 条目格式

```markdown
## ADR-005: 手势识别使用 UIViewPropertyAnimator 而非 CABasicAnimation

**日期:** 2026-05-23
**状态:** Accepted
**背景:** 手势页面在 iOS 17 上动画卡顿，原因是 layer 动画与 auto-layout 冲突
**决策:** 全面迁移到 UIViewPropertyAnimator
**替代方案:**
- CADisplayLink 手动驱动（太复杂，维护成本高）
- Core Animation Group（不解决根因）
**后果:** 动画代码可中断/可逆，但需要 iOS 14+ 最低版本
```

### 2.6 架构对比图：改造前 vs 改造后

```text
【改造前】wyze-plugin-skills 记忆流

Session 1 ──▶ 知识库（手动维护） ──▶ Session 2 ──▶ ... ──▶ Session N
                ↑ 偶尔手动更新                              知识库可能已过时
                └── kb-updater (仅 orchestration 调用时)

【改造后】PDCA 闭环记忆流

Session 1 ──┬──▶ .ai/task-history.md ──┬──▶ Session 2 ──┬──▶ ... ──▶ Session N
            │                          │                │
            ├──▶ .ai/decisions-log.md ─┤                │    每次自动读写
            │                          │                │
            └──▶ .ai/project-memory.md─┘                └── 记忆持续准确
                                          ▲
                                          │
                            kb-updater / checkpoint / finish
                            三个触发点自动回写
```

### 2.7 不建议直接采用 ai-coding-ok 的地方

| ai-coding-ok 做法 | 为什么不适合你 | 替代建议 |
| --- | --- | --- |
| 模板直接复制到项目 | 你的 symlink 模型更优（改一处全局生效） | 保持 symlink，记忆文件则 commit 到项目 |
| 通用 system-prompt.md | 你有 6 个专业 Role，粒度更细 | 在 Role 中注入 PDCA 前后钩子 |
| 单一 SKILL.md 文件 | 你有完整的 skill/orchestration/role 三层 | 将 PDCA 逻辑拆分注入各层 |
| project-memory < 500 行 | 你的项目知识库通常更大更详细 | 长期层可以引用外部知识库，只在 .ai/ 中放摘要索引 |

### 2.8 总结

**核心收获：**ai-coding-ok 的设计精髓在于 "让 AI 每次任务自动闭环记忆"。

你的 wyze-plugin-skills 已经在"单次纪律"（强制流水线 + TDD + 验证）和"团队协作"（Role + Orchestration + wyze-sync）上做得很好，**缺的恰好是跨 session 记忆的自动维护**。

**最小可行改动：**

1. 在每个项目中建 `.ai/` 三层记忆目录
2. 在 `finishing-a-development-branch` 中自动追加 task-history
3. 在 custom_instruction 自检中增加"Memory Load"步骤

这三步就能把 PDCA 闭环嫁接到你现有的流水线中，无需推翻重来。

---

> Generated: 2026-05-23 | Source: [github.com/Mark7766/ai-coding-ok](https://github.com/Mark7766/ai-coding-ok) | For: wyze-plugin-skills optimization
