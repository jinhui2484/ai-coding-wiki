# Claude Code 工具介绍

> Anthropic 出品的终端 AI 编程助手  
> 更新日期：2026-05-11

---

## 1. 是什么
Claude Code 是 Anthropic 推出的 CLI 编程工具，直接在终端中与 Claude 模型交互。
它适合在本地仓库里完成代码生成、重构、调试、文档编写和命令执行。
相比单次问答，它更强调**工程上下文感知**：能理解当前目录、已有代码和执行结果，再继续推进任务。

典型入口：
```bash
claude
```
```bash
claude "为当前 iOS 模块补一个网络层错误处理示例"
```
```bash
claude -p "解释这个 Swift 文件的职责边界"
```

可解决的问题：
- 基于当前仓库生成代码
- 在已有结构上做小范围重构
- 根据错误信息继续排查
- 根据改动自动补文档
- 串联 Git 与脚本工作流

---

## 2. 安装方式
### 2.1 环境要求
- macOS / Linux / WSL2
- Node.js 18+
- 可访问 npm
- 可用账号或 API 凭证

### 2.2 全局安装
```bash
npm i -g @anthropic-ai/claude-code
```

### 2.3 检查版本
```bash
claude --version
```

### 2.4 首次启动
```bash
claude
```
首次启动后，按提示完成登录或凭证配置。

### 2.5 常见安装排查
```bash
node -v
```
```bash
nvm install 20
nvm use 20
npm i -g @anthropic-ai/claude-code
```

---

## 3. 快速上手
### 3.1 交互会话
适合连续对话、多轮修改、边看边改。
```bash
claude
```

### 3.2 单次任务
适合目标清晰、一次完成的任务。
```bash
claude "把当前目录下的 README 改成中文版本，并保留命令示例"
```

### 3.3 打印模式
适合只拿结果，不进入交互会话。
```bash
claude -p "Swift 中 async/await 和 completion handler 的迁移思路"
```

### 3.4 面向 iOS 开发的最小示例
生成一个轻量网络请求层：
```bash
claude "在当前工程创建一个 Swift APIClient，支持 GET 请求、解码 JSON、统一错误处理"
```
解释某个 ViewModel：
```bash
claude -p "阅读 Sources/Profile/ProfileViewModel.swift，说明输入、输出和依赖关系"
```
补接入文档：
```bash
claude "为当前移动端模块新增接入文档，包含安装、初始化、常见错误"
```

---

## 4. 核心能力
### 4.1 代码生成与重构
Claude Code 能基于当前仓库上下文生成或修改代码。
```bash
claude "把这个 UIKit 页面拆成 View + ViewModel，并保留现有行为"
```
```bash
claude "为当前 Swift 枚举补充本地化展示文案映射"
```
```bash
claude "将重复的网络回调逻辑提取成公共方法"
```
适合：
- 新建模块骨架
- 小范围重构
- 批量命名统一
- 生成示例代码

### 4.2 Skills 自定义工作流
可通过 `CLAUDE.md` 和项目级 Skill 固化团队流程，例如新模块接入、代码审查清单、发布前检查和文档模板。
```text
CLAUDE.md
```
配置后，提示词可以更短：
```bash
claude "按项目规范补一个移动端页面骨架"
```

### 4.3 MCP 集成
可通过 MCP 连接外部工具，例如 Jira、Confluence、GitHub、Figma 等。
```bash
claude "读取当前任务单，生成实现步骤，并同步一版开发说明"
```
```bash
claude "检查这个 PR 的改动范围，再整理成 review 要点"
```
适合把代码、任务、文档放到同一工作流里。

### 4.4 多模型切换
支持 Sonnet / Opus / Haiku 等模型选择。
常见思路：
- 日常编码：Sonnet
- 深度分析：Opus
- 快速低成本问答：Haiku

### 4.5 批量自动化
支持 Headless 思路，适合脚本和 CI/CD。
```bash
claude -p "输出当前仓库未使用的图片资源列表"
```
```bash
claude -p "根据变更内容生成 release notes 草稿"
```
适合：
- 自动生成变更摘要
- 自动补文档草稿
- 预提交辅助分析
- 批量检查目录结构

### 4.6 Git 全流程
适合串联 diff、commit、PR、review 等动作。
```bash
claude "根据当前 git diff 生成一个简洁的 commit message"
```
```bash
claude "总结这次改动的风险点，输出 PR 描述草稿"
```
```bash
claude "审查当前分支变更，重点关注崩溃风险和边界条件"
```

### 4.7 子代理任务分发
可通过 task tool 拆分复杂任务，适合并行检查多个模块或同时做调研、改文档、生成脚本。
```bash
claude "并行分析当前仓库的网络层、缓存层、登录流程，并输出汇总结论"
```

---

## 5. 适用场景
### 5.1 本地工程开发
```bash
claude "在当前 iOS 工程增加一个统一的 loading 状态管理器"
```

### 5.2 代码审查
```bash
claude "review 当前改动，重点检查空值处理和主线程更新"
```

### 5.3 自动化脚本
```bash
claude "写一个 Python 脚本，扫描工程中未引用的本地化 key"
```

### 5.4 文档生成
```bash
claude "把当前模块的初始化流程整理成接入文档"
```

更适合的任务类型：
- 本地仓库连续开发
- 针对已有代码的重构与解释
- 终端里直接串联命令和修改
- 需要结合项目上下文的文档任务

---

## 6. 定价模式
Claude Code 常见使用方式有两类。

### 6.1 订阅制
通过 Claude Pro / Max 订阅获取相应使用能力。

### 6.2 API Key 按量计费
适合脚本化、服务化接入，也适合自动化流水线。

选择建议：
- 个人高频使用：优先订阅
- 团队自动化：优先 API Key
- 临时批处理：按量计费更灵活

---

## 7. 配置文件
### 7.1 全局配置
```text
~/.claude/settings.json
```
适合放：默认模型、行为偏好、工具权限、输出风格。

### 7.2 项目级配置
```text
项目根目录/.claude/settings.json
```
适合放：仓库特定规则、项目工具开关、本地覆盖项。

### 7.3 上下文文件
```text
CLAUDE.md
```
适合放：项目背景、代码规范、命名规则、提交流程、文档模板。

最小示例：
```md
# Project Rules

- Swift 代码遵循 MVVM
- 新增接口统一走 APIClient
- 文档示例优先给最小可运行片段
- 变更后执行现有测试命令
```

---

## 8. 最小实践路线
### 第一步：确认安装
```bash
claude --version
```

### 第二步：进入仓库
```bash
cd your-project
claude
```

### 第三步：先做只读任务
```bash
claude -p "总结当前 iOS 工程的目录结构"
```

### 第四步：再做小改动
```bash
claude "为现有页面补一个空状态视图"
```

### 第五步：最后接入项目规则
```text
CLAUDE.md
```

这样能最快把它从“问答工具”变成“工程助手”。
