# GitHub Copilot CLI 工具介绍

> GitHub 出品的终端 AI 编程助手  
> 更新日期：2026-05-11

---

## 1. 是什么
GitHub Copilot CLI 是 GitHub 推出的 CLI AI 编程工具，也常被称为 Copilot Coding Agent。
相比只做补全的编辑器插件版本，CLI 形态更强调终端工作流、仓库级上下文理解和 GitHub 生态联动。
如果你的开发流程强依赖 GitHub，它的价值会很直接：处理 Issue、审查 PR、读取 Actions 结果、结合代码搜索做调研、把任务委派给 AI 连续执行。

典型入口：
```bash
copilot
```
```bash
copilot "为当前移动端仓库生成一版 PR 描述草稿"
```

可解决的问题：
- 生成代码与命令草稿
- 结合 GitHub 数据做判断
- 自动整理 PR / Issue 内容
- 调用 MCP 服务补充外部上下文
- 把重复任务交给 Agent 处理

---

## 2. 安装方式
### 2.1 环境要求
- macOS / Linux
- Node.js 环境或 Homebrew
- GitHub 账号
- Copilot 订阅

### 2.2 npm 安装
```bash
npm i -g @github/copilot
```

### 2.3 gh 扩展安装
```bash
brew install gh
gh extension install github/gh-copilot
```

### 2.4 检查版本
```bash
copilot --version
```

### 2.5 登录准备
```bash
gh auth status
```
如果未登录：
```bash
gh auth login
```

---

## 3. 快速上手
### 3.1 启动会话
适合多轮任务，例如持续修改、补文档、查 PR。
```bash
copilot
```

### 3.2 直接给任务
```bash
copilot "分析当前分支改动，生成 code review checklist"
```

### 3.3 多模型使用
支持多种模型，例如 Claude Sonnet、GPT 系列。
常见思路：
- 代码理解：Claude Sonnet
- 广覆盖生成：GPT 系列

### 3.4 面向移动端开发的最小示例
为当前分支写 PR 描述：
```bash
copilot "根据当前 diff 生成 PR 标题、摘要、测试说明"
```
分析一个 Issue：
```bash
copilot "读取这个 Issue，输出实现拆解和风险列表"
```
检查 CI：
```bash
copilot "查看最近一次 Actions 失败原因，并给出修复建议"
```

---

## 4. 核心能力
### 4.1 代码补全与生成
Copilot CLI 不只是聊天，也能直接服务编码工作。
```bash
copilot "为当前 Swift 网络层补一个重试策略实现"
```
```bash
copilot "给这个移动端模块增加日志埋点封装示例"
```
```bash
copilot "把重复的 JSON 解析逻辑抽成公共工具"
```
适合：
- 补模板代码
- 生成测试样例
- 重复逻辑抽取
- 辅助重构

### 4.2 GitHub 原生集成
这是 Copilot CLI 最有辨识度的能力之一，可与 Pull Request、Issue、Actions、Code Review、Commit 历史天然联动。
```bash
copilot "读取当前 PR 的 review comments，并整理待处理项"
```
```bash
copilot "总结这个仓库最近 5 次提交的主题变化"
```
```bash
copilot "定位最近一次构建失败对应的 job 日志重点"
```

### 4.3 MCP Server 支持
支持连接 MCP Server，把文档系统、项目管理系统、设计资源系统和自定义服务接入同一工作流。
```bash
copilot "读取任务系统里的需求描述，再生成一版移动端实现方案"
```
```bash
copilot "结合知识库内容，补一版模块接入说明"
```

### 4.4 Delegate 模式
适合把一个清晰任务直接交给 AI 处理，例如接一个小 Issue、补一个文档改动、做一轮简单修复、提交 PR 草稿。
```bash
copilot "处理当前 Issue：补充空状态文案，并更新对应测试说明"
```

### 4.5 Fleet 批量任务
适合并行处理多个相互独立的小任务，例如多目录文档同步更新、多个页面文案统一、多组脚本生成、多个 PR 初筛。
```bash
copilot "批量检查当前仓库所有 Markdown 标题层级是否一致"
```

### 4.6 多模型选择
支持 Claude Sonnet 4.5、GPT-5 等模型选择。
常见思路：
- 日常开发问答：Claude Sonnet 4.5
- 大段生成与对比：GPT-5
- 不同任务切到不同模型

### 4.7 Research 深度搜索
适合做需要查证的工作，例如依赖升级影响、历史 PR 处理方式、结合 Web 与仓库信息做结论。
```bash
copilot "研究 Swift 并发迁移的常见坑，并结合当前仓库给出落地建议"
```

### 4.8 Custom Instructions
支持通过指令文件稳定输出风格和执行边界，适合放编码规范、提交规范、审查重点、文档模板和团队约束。
```bash
copilot "按项目规范补一版模块接入文档"
```

---

## 5. 适用场景
### 5.1 GitHub 工作流自动化
```bash
copilot "读取当前分支关联 PR，整理 review 风险点"
```

### 5.2 PR 审查
```bash
copilot "review 当前改动，重点关注空值、线程、分页边界"
```

### 5.3 Issue 处理
```bash
copilot "把这个 Issue 拆成实现步骤、测试点、回归点"
```

### 5.4 团队协作
```bash
copilot "根据团队模板生成本次改动说明"
```

更适合的任务类型：
- 以 GitHub 为中心的开发流程
- PR / Issue / Actions 联动场景
- 需要多人协作统一格式的任务
- 希望把 Agent 能力融入日常仓库操作

---

## 6. 定价模式
Copilot CLI 通常依赖 Copilot 订阅体系。

常见套餐方向：
- Copilot Individual
- Copilot Business
- Copilot Enterprise

选择思路：
- 个人开发者：Individual
- 小团队协作：Business
- 企业级权限与治理：Enterprise

如果重点是 GitHub 平台协作，Copilot 的定价模型通常更省心。

---

## 7. 配置文件
### 7.1 用户级目录
```text
~/.copilot/
```
通常用于保存用户级配置和会话相关数据。

### 7.2 项目级指令文件
```text
.github/copilot-instructions.md
```
适合写入：
- 仓库开发规范
- 常用命令
- 审查重点
- 输出格式偏好

最小示例：
```md
# Project Instructions

- Swift 代码优先给最小可运行片段
- 涉及移动端页面时说明状态流转
- 提交前先总结风险点
- 文档结构统一使用安装、使用、限制三段式
```

### 7.3 指令继承思路
当仓库下还有其他规则文件时，可以把共性规范放全局，把仓库特定约束放项目目录，减少提示词重复输入。

---

## 8. 最小实践路线
### 第一步：确认登录与安装
```bash
gh auth status
copilot --version
```

### 第二步：在仓库里启动会话
```bash
cd your-project
copilot
```

### 第三步：先做 GitHub 相关只读任务
```bash
copilot "总结当前 PR 的改动范围和影响面"
```

### 第四步：再做小范围生成任务
```bash
copilot "为当前移动端页面补一个错误提示组件示例"
```

### 第五步：最后固化项目规则
```text
.github/copilot-instructions.md
```

这样最容易把它用成真正的 GitHub 工作流助手，而不是单次问答工具。
