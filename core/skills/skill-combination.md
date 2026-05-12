# Skill 组合实战

> 适用对象：已安装 Skill 体系的 Claude Code / Copilot CLI 使用者  
> 更新日期：2026-05-12  
> 目标：掌握 Skill 的组合逻辑，在实际项目中合理串联触发

---

## 全景流程图

从需求到 PR 的完整链路，展示每个 Skill 的位置和数据流向。

```
需求输入
  │
  ▼
┌─────────────────┐
│  brainstorming   │ ← 任何创意/功能需求必须先过这一关
│  探索意图+设计    │   输出：设计方案 / Spec
└────────┬────────┘
         │ 设计批准
         ▼
┌─────────────────┐
│  writing-plans   │ ← 将 Spec 拆解为可执行任务
│  编写实现计划     │   输出：plan.md（含文件、测试、命令）
└────────┬────────┘
         │ 计划确认
         ▼
┌─────────────────┐
│ using-git-       │ ← 创建隔离工作区（可选但推荐）
│ worktrees        │   输出：独立 worktree + 基线测试通过
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  执行阶段（二选一）                    │
│                                     │
│  A: subagent-driven-development     │ ← 当前 session，逐任务派发
│     每个任务：                        │
│     implementer → spec-review       │
│                 → code-quality-review│
│                                     │
│  B: executing-plans                 │ ← 跨 session，批量执行
│     checkpoint 保存进度              │
└────────┬────────────────────────────┘
         │
         │  ┌──────────────────────┐
         ├──│ test-driven-          │ ← 每个子任务内部遵循 TDD
         │  │ development           │   红→绿→重构
         │  └──────────────────────┘
         │
         │  ┌──────────────────────┐
         ├──│ systematic-debugging  │ ← 遇到 bug/测试失败时触发
         │  │                      │   先调查根因，再修复
         │  └──────────────────────┘
         │
         │  ┌──────────────────────┐
         ├──│ guard                │ ← 碰敏感模块时锁定编辑范围
         │  └──────────────────────┘
         │
         │  ┌──────────────────────┐
         ├──│ checkpoint           │ ← 长任务中途保存进度
         │  └──────────────────────┘
         │
         ▼ 所有任务完成
┌─────────────────┐
│ verification-    │ ← 宣称完成前，必须跑验证
│ before-completion│   输出：测试通过的证据
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ requesting-      │ ← 提交 Code Review
│ code-review      │   输出：Review 反馈
└────────┬────────┘
         │ 收到反馈
         ▼
┌─────────────────┐
│ receiving-       │ ← 处理 Review 意见
│ code-review      │   验证→评估→回应→修复
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ finishing-a-     │ ← 决定如何集成
│ development-     │   Merge / 创建 PR / 保留分支
│ branch           │
└─────────────────┘
```

---

## 触发时机速查表

| 阶段 | Skill | 触发信号 |
|------|-------|---------|
| **需求** | brainstorming | "做一个…" "加个功能…" "改个行为…" |
| **规划** | writing-plans | brainstorming 输出 Spec 后自动衔接 |
| **隔离** | using-git-worktrees | 开始写代码前（尤其多文件改动） |
| **执行** | subagent-driven-dev | 当前 session 执行计划 |
| **执行** | executing-plans | 需要跨 session 或并行 session |
| **编码** | test-driven-development | 每个子任务内部，写代码前先写测试 |
| **异常** | systematic-debugging | 测试失败、行为异常、构建报错 |
| **防护** | guard | 碰生产代码、IoT SDK、Lock 插件等敏感模块 |
| **保存** | checkpoint | session 要断开、长任务中间节点 |
| **验证** | verification-before-completion | 准备说"完成了"之前 |
| **审查** | requesting-code-review | 任务完成后、合并前 |
| **反馈** | receiving-code-review | 收到 reviewer 的意见后 |
| **收尾** | finishing-a-development-branch | 全部完成，决定 merge/PR |
| **安全** | security-sweep | 涉及认证、密钥、网络等敏感改动时 |

---

## 关键设计原则

1. **严格的前置门禁**：brainstorming → writing-plans → 代码，不能跳步
2. **TDD 是内嵌的**：不是单独触发，而是每个实现子任务内部自动遵循
3. **两条执行路径**：subagent-driven（同 session）vs executing-plans（跨 session），按任务规模选
4. **验证不可跳过**：verification-before-completion 是硬门禁，没有证据不能说"完成"
5. **异常处理按需**：systematic-debugging 和 guard 是被动触发，不是流程中的固定节点

---

::: tip 记住一句话
**Brainstorm → Plan → Isolate → Build (TDD) → Verify → Review → Ship**

这就是所有 Skill 组合的骨架。其余 Skill 都是在这条主线上按需插入的。
:::
