---
title: Codex × DeepSeek Installer 设计思路分析
description: 解析 codex-deepseek-installer 的一键安装器、本地代理协议转换设计，以及可迁移的多模型代理思路。
---

> 项目地址：[github.com/Mark7766/codex-deepseek-installer](https://github.com/Mark7766/codex-deepseek-installer)

## 📌 项目概览

一句话定义：让 OpenAI Codex CLI 无需翻墙、直接使用 DeepSeek 模型的一键安装工具。

核心思路：本地代理 + 协议转换 —— 在本地起一个 HTTP/WebSocket 服务，伪装成 OpenAI API，实际将请求翻译后转发给 DeepSeek。

## 📁 项目结构

```text
~/.codex/                        ← 一切都在这个目录
├── deepseek-proxy.mjs           ← 核心：本地代理服务（协议转换）
├── node_modules/ws/             ← WebSocket 依赖（局部安装）
├── config.toml                  ← Codex 配置（指向 localhost 代理）
├── auth.json                    ← DeepSeek API Key（chmod 600）
└── proxy.log                    ← 运行日志

install.sh                       ← 一键安装脚本（curl | bash）
```

| 文件 | 职责 | 设计意图 |
| --- | --- | --- |
| `install.sh` | 环境检测 → 安装 → 配置 → 启动 → 验证 | 零门槛一键部署 |
| `deepseek-proxy.mjs` | 本地代理：OpenAI Responses API ↔ DeepSeek Chat API | 运行时协议翻译 |
| `config.toml` | 告诉 Codex CLI 连 localhost:11435 | 劫持 API 地址 |
| `auth.json` | 存储 DeepSeek API Key | 安全隔离（600 权限） |

## 🔧 设计思路一：一键安装器（install.sh）

### 核心公式

```text
检测环境 → 安装依赖 → 部署代码 → 写入配置 → 注入自启 → 启动服务 → 验证结果
   ↑                                                                        ↓
   └────────── 任何一步失败：立即终止，给出修复建议 ──────────────────────────────┘
```

### 8 步流水线

1. **check_node** — 检测 Node.js ≥ 18

2. **install_codex** — npm 全局安装 @openai/codex（淘宝镜像）

3. **install_proxy** — 写入 proxy.mjs + 安装 ws 依赖

4. **configure_codex** — 生成 config.toml 指向 localhost

5. **configure_auth** — 交互输入 API Key 并加密存储

6. **setup_autostart** — 写入 .zshrc 开终端自动拉起代理

7. **start_proxy** — 立即启动代理

8. **verify** — 逐项验证全链路可用

### 关键设计原则

| 原则 | 实现方式 |
| --- | --- |
| 严格模式 | `set -euo pipefail` — 任何错误立即终止 |
| 幂等性 | 每步先检测是否已完成，重复执行不会破坏 |
| 环境自适应 | 自动检测 OS / Shell / 工具链，不硬编码 |
| 集中管理 | 全部文件在 `~/.codex/`，卸载 = rm -rf |
| 优雅降级 | npm 官方源不通自动切淘宝镜像 |
| 安全 | API Key chmod 600 + 隐藏输入 + 长度校验 |

---

## 🌐 设计思路二：本地代理（deepseek-proxy.mjs）

### 核心公式

```text
Codex CLI（只认 OpenAI 格式）
     │
     │  WebSocket / HTTP
     ▼
┌─────────────────────────────────────┐
│  localhost:11435（本地代理）          │
│                                     │
│  ① 接收 OpenAI Responses API 请求    │
│  ② 翻译为 DeepSeek Chat 格式        │
│  ③ 转发给 api.deepseek.com          │
│  ④ 接收 DeepSeek 响应               │
│  ⑤ 翻译回 OpenAI Responses 格式     │
│  ⑥ 返回给 Codex CLI                 │
└─────────────────────────────────────┘
     │
     │  HTTPS
     ▼
DeepSeek API 服务器
```

### 模块逻辑图

```text
┌─────────────────────────────────────────────────────────────────────┐
│                    deepseek-proxy.mjs                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────┐   ┌──────────────────┐   ┌────────────────┐  │
│  │  HTTP Server      │   │  WebSocket Server │   │  HTTPS Client  │  │
│  │  (端口 11435)     │   │  (同端口 upgrade) │   │  (→DeepSeek)   │  │
│  └────────┬─────────┘   └────────┬─────────┘   └───────▲────────┘  │
│           │                      │                      │           │
│           ▼                      ▼                      │           │
│  ┌─────────────────────────────────────────────┐        │           │
│  │          请求处理层                           │        │           │
│  │                                             │        │           │
│  │  itemsToMessages()    — 格式转换 A→B         │────────┘           │
│  │  fixOrphanedToolResults() — 补齐缺失调用      │                    │
│  │  extractTools()       — 工具定义转换          │                    │
│  │  normalizeRole()      — 角色标准化            │                    │
│  └─────────────────────────────────────────────┘                    │
│                                                                     │
│  ┌─────────────────────────────────────────────┐                    │
│  │          响应处理层                           │                    │
│  │                                             │                    │
│  │  streamDeepSeek()     — 流式响应 B→A 转换    │                    │
│  │  callDeepSeekSync()   — 同步响应转换          │                    │
│  │  callReasoningMap     — 思维链跨轮缓存        │                    │
│  └─────────────────────────────────────────────┘                    │
└─────────────────────────────────────────────────────────────────────┘
```

### 协议转换对照表

| Codex 发出（OpenAI 格式） | 代理转换为（DeepSeek 格式） |
| --- | --- |
| `{ type: "function_call_output", call_id, output }` | `{ role: "tool", tool_call_id, content }` |
| `{ type: "function_call", name, arguments }` | `{ role: "assistant", tool_calls: [...] }` |
| `"hello"`（纯文本） | `{ role: "user", content: "hello" }` |
| `{ role: "developer", content }` | `{ role: "system", content }` |

### 三个核心难点

- **难点 1：Streaming 流式转换** — DeepSeek 返回的 SSE chunk 要逐块翻译成 OpenAI Responses 事件格式，同时维护 item ID、output index 等状态
- **难点 2：工具调用上下文修复** — Codex 在同连接第二轮不重发 function_call，代理需要从缓存中注入，否则 DeepSeek 拒绝请求
- **难点 3：思维链回填** — DeepSeek 推理模型返回 reasoning_content，下一轮必须带回去，代理在内存中跨轮次缓存

---

## 💡 思维扩散：这种思路还能做什么

- **🔀 多模型路由器**：一个代理入口，按任务类型分发：简单问题 → 便宜模型，复杂推理 → 贵模型。省钱 50%+。
- **🛡️ API Key 网关**：所有 AI 工具都走本地代理，Key 只存一处，统一限额/轮转/审计，防泄露。
- **📊 Token 用量监控**：代理层记录每次请求的 token 数、耗时、模型，自动生成日报。知道钱花在哪。
- **🧪 A/B 测试框架**：同一个 prompt 同时发给两个模型，对比质量/速度/成本，帮你选最优模型。
- **💾 响应缓存**：相同请求命中缓存直接返回，省 API 调用。适合重复性高的场景（如代码补全）。
- **🔌 让任意工具接任意模型**：Cursor 接 Claude、Continue 接 DeepSeek、Xcode AI 接本地模型... 只要工具走 HTTP，代理一转全搞定。
- **📝 Prompt 注入层**：在代理层自动给所有请求加 system prompt（如公司编码规范），工具侧无需修改。
- **🏠 本地模型适配**：Ollama/LM Studio 跑本地模型，代理翻译格式后对接各种 AI 工具，完全离线可用。

---

## 📚 学习路径建议

### 阶段 1：基础（1-2 天）

| 学什么 | 怎么练 |
| --- | --- |
| Node.js HTTP 模块 | 写一个最简代理：接收请求 → 打印 → 原样转发 → 返回 |
| JSON 格式转换 | 手写 OpenAI → DeepSeek 的 message 格式转换函数 |
| 环境变量 + 配置文件 | API Key 从环境变量读取，端口从配置读取 |

### 阶段 2：进阶（2-3 天）

| 学什么 | 怎么练 |
| --- | --- |
| SSE（Server-Sent Events） | 实现流式代理：逐 chunk 转发，实时输出 |
| WebSocket | 加 WebSocket 通道，支持双向通信 |
| 错误处理 + 重试 | 上游超时/断连时优雅降级 |

### 阶段 3：实战（3-5 天）

| 学什么 | 怎么练 |
| --- | --- |
| 多模型路由 | 按 model 字段分发到不同后端 |
| 缓存层 | 相同请求 hash → 命中缓存直接返回 |
| 监控面板 | 记录请求日志，写个简单 HTML 页面展示统计 |

### 阶段 4：产品化

| 学什么 | 怎么练 |
| --- | --- |
| 一键安装脚本 | 模仿 install.sh 写自己的部署脚本 |
| 自启动管理 | launchd (macOS) / systemd (Linux) 服务化 |
| 配置热更新 | 修改配置文件不重启代理即生效 |

### 推荐学习资源

| 资源 | 内容 |
| --- | --- |
| 本项目源码 | 最好的学习材料，500 行覆盖全部核心概念 |
| Node.js 官方文档 - HTTP | http.createServer / https.request |
| MDN - Server-Sent Events | SSE 协议规范 |
| OpenAI API 文档 | Responses API 格式定义 |
| DeepSeek API 文档 | Chat Completions 格式定义 |

---

> 📅 生成时间：2026-05-23 | 🔍 分析对象：codex-deepseek-installer v1.0
