<div align="center">

[English](./README.en.md) | **中文**

# FreeLLMAPI

**一个 OpenAI 兼容接口，聚合 18 个免费 LLM 提供商、161 个免费模型，每月约 17 亿 Token。**

将 Google、Groq、Cerebras、NVIDIA、Mistral、OpenRouter、GitHub Models、Cohere、Cloudflare、HuggingFace、智谱 Z.ai、Ollama、Kilo、Pollinations、LLM7、OVH AI Endpoints、OpenCode Zen 和 AI Horde 的免费额度，以及自定义 OpenAI 兼容的对话、嵌入、图像和音频接口，统一整合到单个 `/v1` API 后面。API 密钥加密存储。路由器会为每个请求挑选最佳可用模型，遇到限流时自动回退到下一个提供商，并追踪每个密钥的使用量，确保不超出免费额度上限。

[![CI](https://github.com/seraluce/model-aggregator/actions/workflows/ci.yml/badge.svg)](https://github.com/seraluce/model-aggregator/actions/workflows/ci.yml)
[![GitHub stars](https://img.shields.io/github/stars/seraluce/model-aggregator?style=flat&logo=github&color=yellow)](https://github.com/seraluce/model-aggregator/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#contributing)
[![Docker image](https://img.shields.io/badge/ghcr.io-freellmapi-2496ED?logo=docker&logoColor=white)](https://github.com/seraluce/model-aggregator/pkgs/container/freellmapi)

**[freellmapi.co](https://freellmapi.co)** · 浏览全部 161 个免费模型的实时目录

路由器会自动更新模型目录。免费版会在每个新模型上线 30 天后获得；
**[Premium 版当天即可获得，目前领先 79 个模型](https://freellmapi.co/?utm_source=github&utm_medium=readme#pricing)**（$19/年，随时取消）。

![各提供商回退链及 Token 预算](repo-assets/fallback-chain.png)

</div>

---

## 目录

- [为什么有这个项目](#为什么有这个项目)
- [支持的提供商](#支持的提供商)
- [功能特性](#功能特性)
- [暂不支持](#暂不支持)
- [快速开始](#快速开始)
- [与 OB-1 及其他客户端配合](#与-ob-1-及其他客户端配合)
- [Docker](#docker)
- [桌面应用](#桌面应用)
- [多语言支持](#多语言支持)
- [Premium（实时目录）](#premium实时目录)
- [使用 API](#使用-api)
- [截图](#截图)
- [工作原理](#工作原理)
- [上下文移交](#上下文移交)
- [局限性](#局限性)
- [贡献指南](#贡献指南)
- [服务条款审查](#服务条款审查)
- [免责声明](#免责声明)

## 为什么有这个项目

每个主流 AI 实验室现在都提供免费额度——每月几百万 Token、每天几千次请求。单独看每个额度都很有限，但叠加在一起，大约 **每月 17 亿 Token** 的有效推理容量，涵盖 160 多个模型，从轻量快速到相当能干的都有。

问题在于手动叠加太麻烦：18 种 SDK、18 种不同的频率限制、18 个可能出问题的地方。FreeLLMAPI 将它们整合成一个 OpenAI 兼容的接口。将任意 OpenAI 客户端库指向你的本地服务器，它会透明地在所有已添加密钥的提供商之间路由。

而且免费模型格局每周都在变：提供商推出新模型、下架旧模型、随时调整配额而不另行通知。FreeLLMAPI 会自动跟踪这些变化。路由器会自行从 [freellmapi.co](https://freellmapi.co) 拉取签名的模型目录，这样你的安装就能保持更新，无需手动 `git pull`。详见 [Premium（实时目录）](#premium实时目录)。

## 支持的提供商

<table>
<tr>
<td align="center" width="180"><a href="https://ai.google.dev"><b>Google</b><br/>Gemini 2.5 Flash · 3.x 预览版</a></td>
<td align="center" width="180"><a href="https://groq.com"><b>Groq</b><br/>Llama 3.3, Llama 4, GPT-OSS, Qwen3</a></td>
<td align="center" width="180"><a href="https://cerebras.ai"><b>Cerebras</b><br/>Qwen3 235B</a></td>
<td align="center" width="180"><a href="https://opencode.ai/zen"><b>OpenCode Zen</b><br/>DeepSeek V4 Flash · Nemotron（推广）</a></td>
</tr>
<tr>
<td align="center"><a href="https://mistral.ai"><b>Mistral</b><br/>Large 3 · Medium 3.5 · Codestral · Devstral</a></td>
<td align="center"><a href="https://openrouter.ai"><b>OpenRouter</b><br/>21 个免费模型</a></td>
<td align="center"><a href="https://github.com/marketplace/models"><b>GitHub Models</b><br/>GPT-4.1 · GPT-4o</a></td>
<td align="center"><a href="https://developers.cloudflare.com/workers-ai"><b>Cloudflare</b><br/>Kimi K2 · GLM-4.7 · GPT-OSS · Granite 4</a></td>
</tr>
<tr>
<td align="center"><a href="https://cohere.com"><b>Cohere</b><br/>Command R+ · Command-A（试用）</a></td>
<td align="center"><a href="https://docs.z.ai"><b>Z.ai（智谱）</b><br/>GLM-4.5 · GLM-4.7 Flash</a></td>
<td align="center"><a href="https://build.nvidia.com"><b>NVIDIA</b><br/>NIM · 40 RPM 免费（仅评估用途）</a></td>
<td align="center"><a href="https://huggingface.co/docs/inference-providers"><b>HuggingFace</b><br/>路由器 → DeepSeek V4 · Kimi K2.6 · Qwen3</a></td>
</tr>
<tr>
<td align="center"><a href="https://ollama.com"><b>Ollama Cloud</b><br/>GLM-4.7 · Kimi K2 · gpt-oss · Qwen3</a></td>
<td align="center"><a href="https://kilo.ai"><b>Kilo Gateway</b><br/>免费路由（可匿名）</a></td>
<td align="center"><a href="https://pollinations.ai"><b>Pollinations</b><br/>GPT-OSS 20B（可匿名）</a></td>
<td align="center"><a href="https://llm7.io"><b>LLM7</b><br/>GPT-OSS · Llama 3.1 · GLM（可匿名）</a></td>
</tr>
<tr>
<td align="center"><a href="https://endpoints.ai.cloud.ovh.net"><b>OVH AI Endpoints</b><br/>Qwen3.5 397B · GPT-OSS · Llama 3.3（可匿名）</a></td>
<td align="center"><a href="https://aihorde.net"><b>AI Horde</b><br/>社区 Llama · Gemma · Cydonia（可匿名，较慢）</a></td>
<td align="center"></td>
<td align="center"></td>
</tr>
</table>

还有**自定义**提供商——可以在"密钥"页面指向任意 OpenAI 兼容的接口（llama.cpp、LM Studio、vLLM、本地 Ollama 或远程网关），支持对话、嵌入、图像或音频模型。

完整且实时更新的列表请访问 **[freellmapi.co/models](https://freellmapi.co/models.html)**，包含每个模型的频率限制、上下文窗口和免费 Token 预算。

## 功能特性

- **OpenAI 兼容** — `POST /v1/chat/completions` 和 `GET /v1/models` 可直接配合官方 OpenAI SDK 及任意 OpenAI 兼容客户端（LangChain、LlamaIndex、Continue、Hermes 等）使用，只需修改 `base_url`。
- **Responses API** — `POST /v1/responses`（当前 Codex CLI 所需的线路格式）作为翻译层在同一个路由器上实现，支持完整流式事件和工具调用。
- **编辑器自动补全** — `POST /v1/completions` 将传统的 prompt/suffix 请求转换为路由器调用，使 Continue 等 VS Code 内联补全客户端可以使用 FreeLLMAPI。
- **Anthropic Messages API** — `POST /v1/messages`（以及 `/v1/messages/count_tokens`）以 Anthropic 线路格式通过同一路由器通信，因此 **Claude Code** 和官方 Anthropic SDK 可以直接使用你的免费池。`GET /v1/models` 支持内容协商（客户端发送 `anthropic-version` 时返回 Anthropic 格式，否则返回 OpenAI 格式）。Claude 系列名称（`opus` / `sonnet` / `haiku` / `default`）映射到 `auto` 或密钥页面上固定的模型。详见 [Anthropic / Claude 客户端](#anthropic--claude-客户端)。
- **图像生成 & 文字转语音** — `POST /v1/images/generations` 和 `POST /v1/audio/speech` 可在提供媒体模型的提供商之间路由，包括自定义 OpenAI 兼容的媒体接口。在仪表盘的 **模型 → 图像/音频** 标签页中浏览和切换。
- **自更新模型目录** — 路由器每天两次从 freellmapi.co 同步签名目录：新模型、配额变化和提供商适配修复会自动应用到你的安装。详见 [Premium（实时目录）](#premium实时目录)。
- **流式和非流式** — `stream: true` 时使用 Server-Sent Events，否则返回 JSON 响应。每个提供商适配器都实现了两种模式。
- **工具调用** — OpenAI 风格的 `tools` / `tool_choice` 请求会被透传，助手的 `tool_calls` + `tool` 角色的后续消息可在各提供商之间正常往返。
- **嵌入** — `/v1/embeddings` 支持基于家族的自动路由，包括自定义 OpenAI 兼容的嵌入端点：故障转移仅在提供**相同**模型的提供商之间进行（不同模型的向量不兼容），绝不跨模型。详见 [嵌入](#嵌入)。
- **自动回退** — 如果选中的提供商返回 429、5xx 或超时，路由器会跳过该提供商，将密钥短暂冷却，然后尝试回退链中的下一个模型（最多 20 次尝试）。
- **按密钥频率追踪** — 按 `(平台, 模型, 密钥)` 追踪 RPM、RPD、TPM、TPD 计数，确保路由器始终选择未超限的密钥。
- **粘性会话** — 多轮对话在 30 分钟内保持使用同一模型，避免中途切换模型导致的幻觉峰值。
- **加密密钥存储** — API 密钥在存入 SQLite 前使用 AES-256-GCM 加密；仅在请求前在内存中解密。
- **统一 API 密钥** — 客户端使用单个 `freellmapi-…` Bearer Token 验证代理。你无需向应用暴露上游提供商密钥。
- **仪表盘登录** — 管理 UI 和所有 `/api/*` 路由均通过邮箱+密码账户保护（scrypt 哈希，会话 Token 认证），首次运行时设置。`/v1` 代理对应用使用独立的统一密钥认证。
- **健康检查** — 定期探测将密钥标记为 `healthy`（健康）、`rate_limited`（被限流）、`invalid`（无效）或 `error`（错误），路由器自动跳过失效密钥。
- **管理仪表盘** — React + Vite UI，支持管理密钥、重排回退链、查看分析数据、在 Playground 中运行提示词。内置暗色模式。
- **分析** — 每次请求记录延迟、Token 数量、成功率及按提供商的详细分解。
- **模型切换时的上下文移交** — 可选功能。当会话回退到不同模型时，注入一条紧凑的系统消息，让新模型知道它在继续已有任务。默认关闭；通过 `FREELLMAPI_CONTEXT_HANDOFF=on_model_switch` 启用。详见 [上下文移交](#上下文移交)。
- **可在任何 Node 20+ 环境中运行** — Windows、macOS、Linux 服务器或小型 ARM SBC（包括树莓派）。空闲时约 40 MB RSS，可配合 PM2 / systemd 等进程管理工具使用。

## 暂不支持

项目的范围有意保持精简。如果某个功能不在以下列表中且未在下面列出，则默认尚未支持。

- **内容审核** (`/v1/moderations`)
- **`n > 1`**（单次请求多个补全）
- **按用户计费 / 多租户认证** — 设计上为单用户

欢迎提交 PR 添加以上功能。详见[贡献指南](#贡献指南)。

## 快速开始

**一行命令**（需要 Docker — 创建 `~/freellmapi` 目录、生成加密密钥、拉取镜像并启动容器）：

```bash
curl -fsSL https://freellmapi.co/install.sh | bash
```

想先看看内容再执行？[脚本在此](https://freellmapi.co/install.sh)。重复运行是安全的：你的 `.env`（和加密密钥）会被保留，容器会更新到 `:latest`。可通过 `FREELLMAPI_DIR`、`PORT` 或 `HOST_BIND` 环境变量覆盖默认值。

Windows 用户最简单的路径是桌面版 **[`.exe` 安装程序（Releases 页面）](https://github.com/seraluce/model-aggregator/releases/latest)**（见下方）；Docker 步骤适用于 WSL 或任意 bash shell。

**或手动使用 Docker Compose。** 它在 3001 端口同时运行 API 和仪表盘，SQLite 数据保存在命名卷中。

**前提条件：** Docker、Docker Compose、OpenSSL。

*macOS / Linux（Bash）：*
```bash
git clone https://github.com/seraluce/model-aggregator.git
cd model-aggregator

# 生成加密密钥用于静态密钥存储
ENCRYPTION_KEY="$(openssl rand -hex 32)"
printf "ENCRYPTION_KEY=%s\nPORT=3001\n" "$ENCRYPTION_KEY" > .env

docker compose up -d
```

*Windows（PowerShell）：*
```powershell
git clone https://github.com/seraluce/model-aggregator.git
cd model-aggregator

$Bytes = New-Object Byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($Bytes)
$ENCRYPTION_KEY = -join ($Bytes | ForEach-Object { "{0:x2}" -f $_ })
"ENCRYPTION_KEY=$ENCRYPTION_KEY`nPORT=3001" | Out-File -Encoding utf8 .env
docker compose up -d
```

打开 http://localhost:3001，在**密钥**页面添加提供商密钥，按需求调整**回退链**顺序，然后从密钥页面顶部获取你的统一 API 密钥。这就是你要指向 OpenAI SDK 的密钥。

全新安装附带免费的目录快照（目前 82 个模型），之后会自动更新。实时订阅额外添加的所有模型可在 [freellmapi.co/models](https://freellmapi.co/models.html) 查看。

> **需要从其他设备访问？** 默认容器只发布到 `127.0.0.1`，因此从其他设备访问 `http://<服务器IP>:3001` 会失败（页面一直加载）。要在局域网内暴露（例如树莓派上 `http://192.168.1.x:3001`），请使用 `HOST_BIND=0.0.0.0` 启动：
>
> ```bash
> HOST_BIND=0.0.0.0 docker compose up -d
> ```
>
> 仅在受信任的网络中这样做：代理是单用户的，仅由统一 API 密钥保护。

### 本地开发

**前提条件：** Node.js 20+、npm。

*macOS / Linux（Bash）：*
```bash
git clone https://github.com/seraluce/model-aggregator.git
cd model-aggregator
npm install
ENCRYPTION_KEY="$(node -e 'console.log(require("crypto").randomBytes(32).toString("hex"))')"
printf "ENCRYPTION_KEY=%s\nPORT=3001\n" "$ENCRYPTION_KEY" > .env
npm run dev
```

*Windows（PowerShell）：*
```powershell
git clone https://github.com/seraluce/model-aggregator.git
cd model-aggregator
npm install
$ENCRYPTION_KEY = node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
"ENCRYPTION_KEY=$ENCRYPTION_KEY`nPORT=3001" | Out-File -Encoding utf8 .env
npm run dev
```

`ENCRYPTION_KEY` 是启动必需的。当 `NODE_ENV` 不是 `production` 且未设置该变量时，服务器会自动生成一个开发密钥并保存到 SQLite 数据库旁边的 `.encryption-key` 文件（0600 权限），而不是保存在数据库内。之前将密钥保存在数据库中的旧安装会在首次启动时迁移到此文件。如果使用真实的提供商密钥，请不要依赖这个回退机制；请设置 `ENCRYPTION_KEY`。

请求分析数据默认保留 90 天或最多 100000 行，以先达到的限制为准。在 `.env` 中设置 `REQUEST_ANALYTICS_RETENTION_DAYS=0` 或 `REQUEST_ANALYTICS_MAX_ROWS=0` 可禁用相应限制。

打开 http://localhost:5173（Vite 开发 UI），在**密钥**页面添加提供商密钥，按需求调整**回退链**顺序，然后从密钥页面顶部获取统一 API 密钥。

### 声明式启动配置

对于可重复的 Docker/服务器安装，FreeLLMAPI 可以在每次启动时应用 JSON 配置。设置 `FREEAPI_CONFIG_PATH=/path/to/freellmapi.config.json` 或将相同的 JSON 放在 `FREEAPI_CONFIG_JSON` 中。配置是幂等的：现有密钥、自定义提供商、模型编辑、回退行和路由设置会被更新而非重复添加。

```json
{
  "keys": [
    { "platform": "groq", "key": "gsk_...", "label": "main" },
    { "platform": "google", "key": "AIza...", "enabled": true }
  ],
  "customProviders": [
    {
      "baseUrl": "http://host.docker.internal:11434/v1",
      "label": "Ollama",
      "models": [
        { "model": "llama3.1:8b", "displayName": "Local Llama", "supportsTools": true }
      ]
    }
  ],
  "models": [
    {
      "platform": "groq",
      "modelId": "llama-3.3-70b-versatile",
      "displayName": "Llama 3.3 70B",
      "supportsTools": true,
      "fallbackEnabled": true
    }
  ],
  "routing": { "strategy": "balanced" }
}
```

> **需要从局域网其他设备访问开发 UI？** 使用 `npm run dev:lan`——它会向 Vite 传递 `--host` 参数，然后 Vite 会打印一个 `Network: http://<你的IP>:5173` 的 URL，可用手机或其他设备访问。（直接使用 `npm run dev -- --host` 是**不行**的：根目录的 `dev` 脚本是 `concurrently` 包装器，标志位无法传递到 Vite。）API 调用通过 Vite 的开发代理转发，因此无需额外配置服务器。

无 Docker 的生产构建：

```bash
npm run build
node server/dist/index.js     # 服务器和仪表盘都在 :3001 提供
```

## Docker

FreeLLMAPI 发布单个生产镜像，包含 Express 服务器和构建好的 React 仪表盘：

```bash
docker pull ghcr.io/seraluce/model-aggregator:latest   # 或固定版本，如 :v1.2.3
```

镜像为多架构（`linux/amd64` + `linux/arm64`，可在树莓派上运行）。发布的标签：`latest`（默认分支）、`v*.*.*`（git 发布标签）和 `sha-<commit>`。

附带的 `docker-compose.yml` 是推荐的安装方式：

```bash
docker compose up -d
docker compose logs -f freellmapi
```

默认容器的端口绑定到 `127.0.0.1`（仅本地）。要从网络上的另一台设备访问仪表盘/API，使用 `HOST_BIND=0.0.0.0 docker compose up -d` 发布到所有接口——仅在受信任的局域网中这样做，因为代理是单用户的。

SQLite 数据存储在 `freellmapi-data` 卷的 `/app/server/data` 目录下。升级时需保留相同的 `.env` 文件中的 `ENCRYPTION_KEY` 和卷，因为提供商密钥是加密存储的。如果你的主机只持久化特定目录，请设置 `FREEAPI_DB_PATH=/that/path/freellmapi.db`。

在临时磁盘的主机上，配置加密备份目标：

```env
FREEAPI_DB_BACKUP_PATH=/app/server/data/freellmapi.db.backup
# 或：
FREEAPI_DB_BACKUP_URL=https://example.com/freellmapi.db.backup
FREEAPI_DB_BACKUP_TOKEN=optional-bearer-token
FREEAPI_DB_BACKUP_KEY=64-char-hex-backup-key
FREEAPI_DB_BACKUP_INTERVAL_MS=300000
```

当数据库文件在启动时缺失，FreeLLMAPI 会在迁移运行前恢复备份。服务器运行时，它会定期上传新的加密备份。如果省略 `FREEAPI_DB_BACKUP_KEY`，应用也会使用 `ENCRYPTION_KEY` 作为备份密钥。

更多 Docker 操作和示例请参见 [docker/README.md](./docker/README.md)。

## 桌面应用

[`desktop/`](./desktop) 目录中有一个原生菜单栏应用：路由器+仪表盘直接在系统托盘中本地运行，带有一个半透明弹窗显示实时请求统计。

![FreeLLMAPI 桌面应用](repo-assets/desktop.png)

**[从 Releases 下载](https://github.com/seraluce/model-aggregator/releases/latest)**——macOS `.dmg` 和 Windows `.exe` 安装程序由 [`desktop-release`](.github/workflows/desktop-release.yml) 工作流在每个发布版本中构建并上传。也可以从本仓库中几分钟内构建：

> **Windows 用户从源码构建的注意事项：** 构建桌面应用需要为 Electron 编译原生 SQLite 模块。在运行 `npm install` 之前，必须先安装 [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)（特别是"使用 C++ 的桌面开发"工作负载）和 Python。

```bash
npm install
npm install --prefix desktop  # 安装桌面依赖
npm run desktop:dist          # macOS  → desktop/dist-electron/FreeLLMAPI-…-arm64.dmg
npm run desktop:dist:win      # Windows → "desktop/dist-electron/FreeLLMAPI Setup ….exe"
```

> 本地构建的应用未签名，Windows SmartScreen 可能在首次运行时弹出警告（选择"更多信息"→"仍要运行"）；macOS 构建可直接启动无需 Gatekeeper 提示。
> 完整说明请参见 [desktop/README.md](./desktop/README.md)。

### 凭据和数据存储位置

桌面应用**无需设置用户名或密码**。与服务器（需要邮箱+密码才能访问仪表盘）不同，桌面版使用隐藏的本地账户自动登录仪表盘，因此你无需输入凭据。

你唯一需要的凭据是**统一 API 密钥**——即 OpenAI/Anthropic 客户端使用的 `freellmapi-…` Token。获取方式：

- 托盘弹窗——点击托盘图标，然后**复制密钥**，或
- 仪表盘**密钥**页面顶部（托盘→**打开仪表盘**）。

无需手动打开或编辑 `freeapi.db`。

你的设置和数据存储在以下文件夹中（复制即可迁移到另一台机器或容器中）：

| 操作系统 | 位置 |
|---------|------|
| Windows | `%APPDATA%\FreeLLMAPI\`（例如 `C:\Users\<你>\AppData\Roaming\FreeLLMAPI\`） |
| macOS | `~/Library/Application Support/FreeLLMAPI/` |
| Linux | `~/.config/FreeLLMAPI/` |

该文件夹包含 `freeapi.db`（所有密钥、模型、设置，加密存储）和 `config.json`（窗口/主题/端口/局域网偏好）。复制两者即可迁移安装。对于服务器（非桌面）部署，对等的状态文件是 `.env` 文件和 SQLite 数据库 `server/data/freeapi.db`（或 `FREEAPI_DB_PATH` 指向的位置）。

## 多语言支持

仪表盘和桌面托盘支持 6 种语言。UI 在首次加载时会自动检测浏览器/系统语言，你也可以随时从 **⋯** 菜单切换；选择会被记住。

| 语言 | 区域设置 |
| --- | --- |
| English | `en` |
| 中文（简体） | `zh-CN` |
| Français | `fr` |
| Español | `es` |
| Português (Brasil) | `pt-BR` |
| Italiano | `it` |

翻译文件位于 [`client/src/i18n/locales/`](./client/src/i18n/locales)，为扁平 JSON 格式。要添加一种语言，复制 `en.json`，翻译各字段的值，然后在 `client/src/i18n/I18nProvider.tsx`（以及桌面版的 `desktop/src/i18n.ts`）中注册该区域设置——欢迎提交 PR。

## 与 OB-1 及其他客户端配合

FreeLLMAPI 是 **[OB-1](https://github.com/Overbrilliant/ob-1)** 的免费后端：OB-1 CLI 可以自动克隆、配置、启动、健康检查并将此代理接入其设置。新 OB-1 用户可以选择**免费开始**，在创建任何托管账户之前即可获得可用的 OpenAI 兼容接口。

它本身也很有用。任何可以使用 OpenAI 兼容 base URL 的客户端都可以使用 FreeLLMAPI：

- **OB-1**：由 CLI 自动管理，包括匿名提供商。
- **opencode、aider、Continue、LangChain、LlamaIndex**：将 `base_url` 设置为 `http://localhost:3001/v1`，使用仪表盘中获取的统一密钥。
- **Claude Code / Anthropic SDKs**：使用 Anthropic 兼容的 `/v1/messages` 接口和下面所述的 `ANTHROPIC_AUTH_TOKEN` 流程。
- **本地 GPU 设备**：为 Ollama、llama.cpp、LM Studio、vLLM 或内部网关添加自定义 OpenAI 兼容接口。

FreeLLMAPI 是本地优先且单用户设计。你的提供商密钥保存在 SQLite 数据库中，静态加密，请求从你的机器发送到已启用的上游提供商。

## Premium（实时目录）

路由器会自动保持模型目录更新：每天两次从 [freellmapi.co](https://freellmapi.co) 拉取签名目录，将新模型、配额变化和提供商适配修复应用到本地数据库。你自己的启用/禁用选择以及自定义提供商永远不会被修改，每次下载在应用前都会使用固定的 Ed25519 密钥进行验证。

目录分为两个版本：

| | 免费版 | Premium |
|---|---|---|
| 价格 | 永久免费 | **$19/年** 或 **$49 一次性** |
| 当前提供的模型（2026 年 7 月） | 82 | **161** |
| 新免费模型 | 每个模型上线 30 天后 | **上线当天** |
| 配额变化和适配修复 | 同样延迟 30 天 | 2-3 天内 |
| 激活 | 无需操作 | 一个密钥，所有设备通用 |

这个差距不是假设的。目前实时订阅比免费安装**领先 79 个模型**，包括 Kimi K2.7 Code、GLM-5.2、MiniMax M3、Qwen3.5 397B 和拥有 100 万 Token 上下文窗口的 Nemotron 3 Ultra 550B。每个模型在上线后约一个月才会到达免费安装版；而 Premium 路由器在上线当天即可使用。浏览你到底错过了什么：**[freellmapi.co/models](https://freellmapi.co/models.html)**。

在这个市场中，30 天是很长的时间。当某个提供商推出强大的新免费模型、悄悄收紧配额或破坏了线路格式时，实时订阅的路由器在几天内就能获得修复，而免费安装需要等待模型逐步更新。如果你每天使用路由器，Premium 就是享受免费浪潮和仅仅听说它之间的区别。

**[立即上线 freellmapi.co →](https://freellmapi.co/?utm_source=github&utm_medium=readme#pricing)**

- $19/年或 $49 一次性，终身有效。Stripe 支付；可随时取消，自助操作。
- 一个 `fla_` 密钥覆盖你运行的所有路由器：桌面、家庭实验室、树莓派。
- 在仪表盘的 **Premium** 下激活；在 [freellmapi.co/manage](https://freellmapi.co/manage) 自助取消或管理账单。
- 路由器本身保持 MIT 许可，永久完全免费。Premium 仅针对实时订阅，它资助了维持两个版本正常运行的每日模型测试和目录维护。

目录服务器永远不会看到你的提示词、补全结果或提供商密钥——路由器无论是否付费都保持完全自托管。

## 使用 API

任何 OpenAI 兼容客户端均可使用（Anthropic / Claude 客户端也可以，详见 [Anthropic / Claude 客户端](#anthropic--claude-客户端)）。示例：

**Python**

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:3001/v1",
    api_key="freellmapi-your-unified-key",
)

resp = client.chat.completions.create(
    model="auto",  # 让路由器选择；或指定如 "gemini-2.5-flash"
    messages=[{"role": "user", "content": "Summarise the fall of Rome in one sentence."}],
)
print(resp.choices[0].message.content)
print("Routed via:", resp.headers.get("x-routed-via"))
```

**curl**

```bash
curl http://localhost:3001/v1/chat/completions \
  -H "Authorization: Bearer freellmapi-your-unified-key" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "auto",
    "messages": [{"role": "user", "content": "hi"}]
  }'
```

**流式**

```python
stream = client.chat.completions.create(
    model="auto",
    messages=[{"role": "user", "content": "Stream me a haiku about SQLite."}],
    stream=True,
)
for chunk in stream:
    print(chunk.choices[0].delta.content or "", end="", flush=True)
```

**VS Code 内联自动补全（Continue）**

FreeLLMAPI 暴露 `/v1/completions` 供发送传统 OpenAI prompt/suffix 请求的编辑器自动补全客户端使用。Continue 配置示例：

```yaml
models:
  - name: FreeLLMAPI Autocomplete
    provider: openai
    model: auto
    apiBase: http://localhost:3001/v1
    apiKey: freellmapi-your-unified-key
    useLegacyCompletionsEndpoint: true
    roles:
      - autocomplete
```

**工具调用**

传入 OpenAI 风格的 `tools` 和 `tool_choice`；助手的响应与 OpenAI API 完全一样通过代理往返。多步流程（助手 `tool_calls` → `tool` 角色后续消息 → 最终答案）可在路由器能到达的每个提供商上工作。

```python
tools = [{
    "type": "function",
    "function": {
        "name": "get_weather",
        "description": "Get current weather for a city.",
        "parameters": {
            "type": "object",
            "properties": {"city": {"type": "string"}},
            "required": ["city"],
        },
    },
}]

# 1. 模型请求工具调用
first = client.chat.completions.create(
    model="auto",
    messages=[{"role": "user", "content": "What's the weather in Karachi?"}],
    tools=tools,
    tool_choice="required",
)
call = first.choices[0].message.tool_calls[0]

# 2. 执行工具，返回结果
final = client.chat.completions.create(
    model="auto",
    messages=[
        {"role": "user", "content": "What's the weather in Karachi?"},
        first.choices[0].message,
        {"role": "tool", "tool_call_id": call.id, "content": '{"temp_c": 32, "cond": "sunny"}'},
    ],
    tools=tools,
)
print(final.choices[0].message.content)
```

**Gemini Google Search 联网搜索**

Google 的模型可以基于实时 Google 搜索结果回答问题。由于 OpenAI 线路格式无法表达这一点，请求一个名为 `google_search` 的工具，Google 提供商将其转换为 Gemini 原生的联网搜索工具。它可以单独发送，也可以与你通常的函数工具一起发送。

```python
resp = client.chat.completions.create(
    model="gemini-2.5-flash",  # 固定使用 Google 模型，确保请求路由到那里
    messages=[{"role": "user", "content": "Who won the F1 race this weekend?"}],
    tools=[{"type": "function", "function": {"name": "google_search", "parameters": {}}}],
)
print(resp.choices[0].message.content)
```

**视觉 / 图像输入**

使用标准的 OpenAI `image_url` 内容块（base64 `data:` URL 或 `http(s)` URL）发送图像。当请求包含图像时，路由器会限制自己使用**支持视觉的模型**，忽略纯文本模型。视觉模型在回退链页面上标有**视觉**徽章；当前支持的包括 Gemini（2.5 / 3.x）、Llama 4 Scout/Maverick（Groq、NVIDIA）、GLM-4.6V Flash（Z.ai）、Nemotron Nano 12B VL（OpenRouter）以及 GitHub 的 GPT-4o / GPT-4.1。

```python
resp = client.chat.completions.create(
    model="auto",  # 自动路由到视觉模型
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "What's in this image?"},
            {"type": "image_url", "image_url": {"url": "data:image/png;base64,<...>"}},
        ],
    }],
)
print(resp.choices[0].message.content)
```

如果回退链中没有启用任何支持视觉的模型，图像请求会返回明确的 `422`（`code: "no_vision_model"`），而不是静默丢弃图像。（`/v1/responses` 上的图像输入暂不支持——请使用 `/v1/chat/completions`。）

也支持 `stream=True`——你会收到 `delta.tool_calls` 块，然后是 `finish_reason: "tool_calls"` 结束。在底层，OpenAI 兼容提供商（Groq、Cerebras、Mistral、OpenRouter、GitHub Models、HuggingFace、Cloudflare、Cohere compat）直接透传请求；Gemini 请求会被翻译成 Google 的 `functionDeclarations` / `functionResponse` 格式，响应再翻译回来。

每个响应都带有 `X-Routed-Via: <平台>/<模型>` 标头，让你知道实际服务请求的是哪个提供商。如果请求在提供商之间发生了回退，你还会看到 `X-Fallback-Attempts: N`。

### 嵌入

`/v1/embeddings` 是 OpenAI 兼容的，与对话路由有一个重要的区别：**故障转移绝不跨模型。** 不同模型的向量位于不兼容的空间——静默切换模型会破坏基于代理构建的任何向量存储。因此，嵌入按**家族**（一个模型身份+维度）路由，故障转移仅在提供同一家族的提供商之间进行。

```python
resp = client.embeddings.create(
    model="auto",          # 默认家族；或家族名称如 "bge-m3"
    input=["the quick brown fox", "pack my box with five dozen liquor jugs"],
)
print(len(resp.data), "vectors of", len(resp.data[0].embedding), "dims")
```

```bash
curl http://localhost:3001/v1/embeddings \
  -H "Authorization: Bearer freellmapi-your-unified-key" \
  -H "Content-Type: application/json" \
  -d '{"model": "auto", "input": "hello world"}'
```

`model` 接受 `auto`（配置的默认家族）、家族名称或特定于提供商的模型 ID（会解析为其家族）。可用家族：

| 家族（`model`） | 维度 | 提供商（回退顺序） |
| --- | --- | --- |
| `gemini-embedding-001` *（默认）* | 3072 | Google |
| `text-embedding-3-large` | 3072 | GitHub Models |
| `text-embedding-3-small` | 1536 | GitHub Models |
| `embed-v4.0` | 1536 | Cohere |
| `bge-m3` | 1024 | Cloudflare → Hugging Face |
| `qwen3-embedding-0.6b` | 1024 | Cloudflare |
| `nv-embedqa-e5-v5` | 1024 | NVIDIA |
| `llama-nemotron-embed-1b-v2` | 2048 | NVIDIA |
| `llama-nemotron-embed-vl-1b-v2` | 2048 | NVIDIA → OpenRouter |
| `embeddinggemma-300m` | 768 | Cloudflare |

默认家族、按提供商的开关和优先级位于仪表盘的**模型→嵌入**页面。选择并坚持使用一个家族用于给定的向量存储——这就是家族模型的全部意义。

### Anthropic / Claude 客户端

FreeLLMAPI 也能说 Anthropic 的 Messages API，因此任何为 Claude 构建的工具——包括 **Claude Code** 和官方 Anthropic SDK——都可以对你的免费池运行。将客户端指向你服务器的**源地址**（Anthropic 客户端会自动追加 `/v1/messages`），使用你的统一密钥进行认证。`x-api-key` 和 `Authorization: Bearer` 均被接受。

```bash
curl http://localhost:3001/v1/messages \
  -H "x-api-key: freellmapi-your-unified-key" \
  -H "anthropic-version: 2023-06-01" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 256,
    "messages": [{"role": "user", "content": "hi"}]
  }'
```

Claude 模型名称映射到**密钥→Anthropic** 标签页上的免费池：每个家族（`default`、`opus`、`sonnet`、`haiku`）路由到 `auto`（路由器选择免费模型）或你固定的模型。`POST /v1/messages/count_tokens` 和内容协商的 `GET /v1/models`（当发送 `anthropic-version` 时返回 Anthropic 格式）也已实现。流式、系统提示、工具使用和图像输入都与 OpenAI 端点在同一个路由器上翻译。

**Claude Code** — 指向你的服务器并启动：

*macOS / Linux（Bash）：*
```bash
export ANTHROPIC_BASE_URL=http://localhost:3001
export ANTHROPIC_AUTH_TOKEN=freellmapi-your-unified-key   # 不是 ANTHROPIC_API_KEY
claude
```

*Windows（PowerShell）：*
```powershell
$env:ANTHROPIC_BASE_URL="http://localhost:3001"
$env:ANTHROPIC_AUTH_TOKEN="freellmapi-your-unified-key"
claude
```

> 使用 `ANTHROPIC_AUTH_TOKEN`（作为 Bearer Token 发送），**不要使用** `ANTHROPIC_API_KEY`——Claude Code 检测到已设置的 `ANTHROPIC_API_KEY` 会视为冲突的第一方凭据并拒绝启动。

## 截图

### 密钥

管理提供商凭据并获取应用连接所需的统一 API 密钥。每个密钥显示状态点和上次健康检查时间。

![密钥页面](repo-assets/keys.png)

### Playground

通过路由器发送聊天补全请求，查看是哪个提供商处理的，以及模型 ID 和延迟信息直接显示在消息上。

![Playground 页面](repo-assets/playground.png)

### 分析

请求量、成功率、输入输出 Token、平均延迟以及按提供商细分的数据，支持 24 小时/7 天/30 天窗口。

![分析页面](repo-assets/analytics.png)

## 工作原理

```
┌──────────────────┐   Bearer freellmapi-…   ┌─────────────────────────┐
│  OpenAI SDK /    │ ──────────────────────▶ │  Express 代理 (:3001)   │
│  curl / 其他     │ ◀────────────────────── │  /v1/chat/completions   │
│  OpenAI 客户端   │      流式 Token          └────────────┬────────────┘
└──────────────────┘                                      │
                                                           ▼
              ┌──────────────────────────────────────────────────────┐
              │  路由器                                                │
              │   1. 选择优先级最高的模型，满足：                         │
              │      (a) 有健康密钥 且                                 │
              │      (b) 未超任何频率限制                               │
              │   2. 解密密钥，调用提供商 SDK                           │
              │   3. 遇到 429/5xx → 冷却 + 重试下一个模型               │
              └──────────────────────────────────────────────────────┘
                               │
   ┌────────────┬────────────┬─┴──────────┬─────────────┬──────────┐
   ▼            ▼            ▼            ▼             ▼          ▼
 Google       Groq        Cerebras    OpenRouter       HF        …10+ 个
```

- **路由器**（`server/src/services/router.ts`）— 为每个请求选择模型。
- **频率限制账本**（`server/src/services/ratelimit.ts`）— 内存中的 RPM/RPD/TPM/TPD 计数器，由 SQLite 持久化，429 时自动冷却。
- **提供商适配器**（`server/src/providers/*.ts`）— 每个提供商一个文件，实现 `Provider` 基类：`chatCompletion()` 和 `streamChatCompletion()`。
- **健康检查服务**（`server/src/services/health.ts`）— 定期探测保持密钥状态更新。
- **仪表盘**（`client/`）— React + Vite + shadcn/ui 管理界面。
- **存储** — SQLite（`better-sqlite3`），密钥使用 AES-256-GCM 信封加密。

## 上下文移交

当 FreeLLMAPI 在对话中途回退到不同模型时（配额、频率限制、冷却），新模型不知道它正在接替别人的任务。**上下文移交**会在出站请求中添加一条紧凑的 `system` 消息，告知新模型这一点：

```
FreeLLMAPI 上下文移交：
你正在接管另一个模型（groq:llama-3 → google:gemini-flash）正在进行中的对话。
请使用本请求中已提供的对话上下文继续用户的任务。
不要重新开始任务、重新询问已回答的设置问题或丢弃先前的工具结果。
以用户的最新消息作为最高优先级指令。

最近的会话摘要：
用户：…
助手：…
```

**在 `.env` 中启用：**

```env
FREELLMAPI_CONTEXT_HANDOFF=on_model_switch
```

**工作原理：**

- 每个会话的消息存储在内存中（TTL：3 小时）。
- 仅当所选模型在指定会话密钥发生变化时注入。
- 首次请求、同模型继续或已存在上下文移交消息时不会注入。
- 会话密钥：`X-Session-Id` 标头（如果存在），否则为首条用户消息的 SHA-1 哈希（与粘性会话相同）。
- 存储仅在内存中。不会写入磁盘或日志。

> **重要：** 上下文移交改善了通过 FreeLLMAPI 路由的对话的连续性。它无法恢复提供商内部隐藏状态或从未发送给代理的消息。

## 局限性

叠加免费额度有实际的权衡。请诚实面对它们：

- **没有前沿模型。** 免费目录的上限大约是 Llama 3.3 70B、GLM-4.5、Qwen 3 Coder 和 Gemini 2.5 Pro。通过这个你无法获得 GPT-5 或 Claude Opus 级别的推理能力。对于困难的问题，请使用付费 API。
- **智能水平随一天时间推移而下降。** 排名最高的模型（通常是 Gemini 2.5 Pro、通过 GitHub Models 的 GPT-4o）每日上限最低。一旦达到上限，路由器会沿优先级链回退到更小/更弱的模型。预计接口的有效智能水平会在每天晚些时候下降——然后在 UTC 午夜重置。
- **延迟波动很大。** Cerebras 和 Groq 极快；其他则不然。你能用哪个取决于哪个当前可用。
- **免费额度可能随时变化。** 提供商会定期收紧、放宽或取消免费额度。发生这种情况时，你会看到 429 或认证错误，直到目录更新到达你——实时订阅安装在几天内获得修复，免费安装则走 30 天延迟。重新植入脚本位于 `server/src/scripts/`。
- **没有 SLA，这是必然的。** 如果你需要可靠性，请使用有合同的付费提供商。
- **本地优先。** 没有多租户认证。仅供个人使用；不要暴露到互联网上。

## 贡献指南

非常欢迎贡献者！请参阅 [CONTRIBUTING.md](CONTRIBUTING.md) 了解开发流程、PR 期望以及 AI/LLM 辅助贡献的政策（简要版：欢迎，与其他 PR 相同的质量标准）。好的首次 PR：

- **添加提供商** — 复制 `server/src/providers/openai-compat.ts` 作为模板，接入 `server/src/providers/index.ts`，在 `server/src/db/index.ts` 中植入模型，在 `server/src/__tests__/providers/` 中添加测试。
- **添加端点** — 审核（moderations）及其他 OpenAI 兼容接口。提供商基类可以扩展新方法；适配器声明它们支持哪些。
- **改进路由器** — 成本感知路由（最便宜-健康-最快权衡）、更好的延迟加权优先级、区域固定。
- **仪表盘优化** — 分析页面的图表、密钥轮换 UX、从 `.env` 批量导入密钥。
- **文档** — 更多示例、Go/Rust 等语言的客户端库片段、Docker 或 Fly 的部署方案。

**开发循环：**

```bash
npm install
npm run dev      # 服务器在 :3001，仪表盘在 :5173，均有 HMR
npm test         # 服务器 vitest；如果工作区添加了客户端测试也会运行
npm run build    # 编译服务器和仪表盘
```

PR 应包含测试，保持现有测试套件绿色，并匹配仓库已有的 `.editorconfig` / tsconfig 默认值。完整的贡献者工作流程请参见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

### 数据库迁移

本地开发时，应用待处理的迁移：

```bash
NODE_ENV=development npm run db:migration:up
```

完整的迁移 CLI 和工作流程请参见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

### 贡献者

<a href="https://github.com/moaaz12-web"><img src="https://images.weserv.nl/?url=github.com/moaaz12-web.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@moaaz12-web" /></a>
<a href="https://github.com/lukasulc"><img src="https://images.weserv.nl/?url=github.com/lukasulc.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@lukasulc" /></a>
<a href="https://github.com/VinhPhamAI"><img src="https://images.weserv.nl/?url=github.com/VinhPhamAI.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@VinhPhamAI" /></a>
<a href="https://github.com/deadc"><img src="https://images.weserv.nl/?url=github.com/deadc.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@deadc" /></a>
<a href="https://github.com/zhangyu1324"><img src="https://images.weserv.nl/?url=github.com/zhangyu1324.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@zhangyu1324" /></a>
<a href="https://github.com/chongjiazhen"><img src="https://images.weserv.nl/?url=github.com/chongjiazhen.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@chongjiazhen" /></a>
<a href="https://github.com/vjsai"><img src="https://images.weserv.nl/?url=github.com/vjsai.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@vjsai" /></a>
<a href="https://github.com/long2ice"><img src="https://images.weserv.nl/?url=github.com/long2ice.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@long2ice" /></a>
<a href="https://github.com/sadesguy"><img src="https://images.weserv.nl/?url=github.com/sadesguy.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@sadesguy" /></a>
<a href="https://github.com/hodlmybeer69-bit"><img src="https://images.weserv.nl/?url=github.com/hodlmybeer69-bit.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@hodlmybeer69-bit" /></a>
<a href="https://github.com/phoenixikkifullstack"><img src="https://images.weserv.nl/?url=github.com/phoenixikkifullstack.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@phoenixikkifullstack" /></a>
<a href="https://github.com/jtbrennan-git"><img src="https://images.weserv.nl/?url=github.com/jtbrennan-git.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@jtbrennan-git" /></a>
<a href="https://github.com/praveenkumarpranjal"><img src="https://images.weserv.nl/?url=github.com/praveenkumarpranjal.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@praveenkumarpranjal" /></a>
<a href="https://github.com/nordbyte"><img src="https://images.weserv.nl/?url=github.com/nordbyte.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@nordbyte" /></a>
<a href="https://github.com/mybropro"><img src="https://images.weserv.nl/?url=github.com/mybropro.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@mybropro" /></a>
<a href="https://github.com/danscMax"><img src="https://images.weserv.nl/?url=github.com/danscMax.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@danscMax" /></a>
<a href="https://github.com/jhash"><img src="https://images.weserv.nl/?url=github.com/jhash.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@jhash" /></a>
<a href="https://github.com/JammyJames1234"><img src="https://images.weserv.nl/?url=github.com/JammyJames1234.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@JammyJames1234" /></a>
<a href="https://github.com/Sumit4codes"><img src="https://images.weserv.nl/?url=github.com/Sumit4codes.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@Sumit4codes" /></a>
<a href="https://github.com/meliani"><img src="https://images.weserv.nl/?url=github.com/meliani.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@meliani" /></a>
<a href="https://github.com/thedavidweng"><img src="https://images.weserv.nl/?url=github.com/thedavidweng.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@thedavidweng" /></a>
<a href="https://github.com/bharvey42"><img src="https://images.weserv.nl/?url=github.com/bharvey42.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@bharvey42" /></a>
<a href="https://github.com/yuvrxj-afk"><img src="https://images.weserv.nl/?url=github.com/yuvrxj-afk.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@yuvrxj-afk" /></a>
<a href="https://github.com/Tushar49"><img src="https://images.weserv.nl/?url=github.com/Tushar49.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@Tushar49" /></a>
<a href="https://github.com/nicyoong"><img src="https://images.weserv.nl/?url=github.com/nicyoong.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@nicyoong" /></a>
<a href="https://github.com/Aldo-f"><img src="https://images.weserv.nl/?url=github.com/Aldo-f.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@Aldo-f" /></a>
<a href="https://github.com/Tazrif-Raim"><img src="https://images.weserv.nl/?url=github.com/Tazrif-Raim.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@Tazrif-Raim" /></a>
<a href="https://github.com/m1nuzz"><img src="https://images.weserv.nl/?url=github.com/m1nuzz.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@m1nuzz" /></a>
<a href="https://github.com/LoneRifle"><img src="https://images.weserv.nl/?url=github.com/LoneRifle.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@LoneRifle" /></a>
<a href="https://github.com/ita333"><img src="https://images.weserv.nl/?url=github.com/ita333.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@ita333" /></a>
<a href="https://github.com/barbotkonv"><img src="https://images.weserv.nl/?url=github.com/barbotkonv.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@barbotkonv" /></a>
<a href="https://github.com/Naster17"><img src="https://images.weserv.nl/?url=github.com/Naster17.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@Naster17" /></a>
<a href="https://github.com/StealthTensor"><img src="https://images.weserv.nl/?url=github.com/StealthTensor.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@StealthTensor" /></a>
<a href="https://github.com/EmranAhmed"><img src="https://images.weserv.nl/?url=github.com/EmranAhmed.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@EmranAhmed" /></a>
<a href="https://github.com/itsfuad"><img src="https://images.weserv.nl/?url=github.com/itsfuad.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@itsfuad" /></a>
<a href="https://github.com/RobinHoodO"><img src="https://images.weserv.nl/?url=github.com/RobinHoodO.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@RobinHoodO" /></a>
<a href="https://github.com/hmm183"><img src="https://images.weserv.nl/?url=github.com/hmm183.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@hmm183" /></a>
<a href="https://github.com/duemilionidieuro-bot"><img src="https://images.weserv.nl/?url=github.com/duemilionidieuro-bot.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@duemilionidieuro-bot" /></a>
<a href="https://github.com/hjhhoni"><img src="https://images.weserv.nl/?url=github.com/hjhhoni.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@hjhhoni" /></a>
<a href="https://github.com/immanuelsavio"><img src="https://images.weserv.nl/?url=github.com/immanuelsavio.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@immanuelsavio" /></a>
<a href="https://github.com/Slyker"><img src="https://images.weserv.nl/?url=github.com/Slyker.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@Slyker" /></a>
<a href="https://github.com/wells1013"><img src="https://images.weserv.nl/?url=github.com/wells1013.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@wells1013" /></a>
<a href="https://github.com/evgkrsk"><img src="https://images.weserv.nl/?url=github.com/evgkrsk.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@evgkrsk" /></a>
<a href="https://github.com/aaronjmars"><img src="https://images.weserv.nl/?url=github.com/aaronjmars.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@aaronjmars" /></a>
<a href="https://github.com/Robs87"><img src="https://images.weserv.nl/?url=github.com/Robs87.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@Robs87" /></a>
<a href="https://github.com/dashitongzhi"><img src="https://images.weserv.nl/?url=github.com/dashitongzhi.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@dashitongzhi" /></a>
<a href="https://github.com/QingJ01"><img src="https://images.weserv.nl/?url=github.com/QingJ01.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@QingJ01" /></a>
<a href="https://github.com/3215"><img src="https://images.weserv.nl/?url=github.com/3215.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@3215" /></a>
<a href="https://github.com/saifulaiub123"><img src="https://images.weserv.nl/?url=github.com/saifulaiub123.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@saifulaiub123" /></a>
<a href="https://github.com/PietFourie"><img src="https://images.weserv.nl/?url=github.com/PietFourie.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@PietFourie" /></a>
<a href="https://github.com/mhmdkrmabd"><img src="https://images.weserv.nl/?url=github.com/mhmdkrmabd.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@mhmdkrmabd" /></a>
<a href="https://github.com/DemeulemeesterxMaxime"><img src="https://images.weserv.nl/?url=github.com/DemeulemeesterxMaxime.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@DemeulemeesterxMaxime" /></a>
<a href="https://github.com/HoodBlah"><img src="https://images.weserv.nl/?url=github.com/HoodBlah.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@HoodBlah" /></a>
<a href="https://github.com/SeanPedersen"><img src="https://images.weserv.nl/?url=github.com/SeanPedersen.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@SeanPedersen" /></a>
<a href="https://github.com/andersmmg"><img src="https://images.weserv.nl/?url=github.com/andersmmg.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@andersmmg" /></a>
<a href="https://github.com/chirag127"><img src="https://images.weserv.nl/?url=github.com/chirag127.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@chirag127" /></a>
<a href="https://github.com/jasnoorgill"><img src="https://images.weserv.nl/?url=github.com/jasnoorgill.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@jasnoorgill" /></a>
<a href="https://github.com/allababbot"><img src="https://images.weserv.nl/?url=github.com/allababbot.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@allababbot" /></a>
<a href="https://github.com/johan-droid"><img src="https://images.weserv.nl/?url=github.com/johan-droid.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@johan-droid" /></a>
<a href="https://github.com/redenfire"><img src="https://images.weserv.nl/?url=github.com/redenfire.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@redenfire" /></a>
<a href="https://github.com/itzpingcat"><img src="https://images.weserv.nl/?url=github.com/itzpingcat.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@itzpingcat" /></a>
<a href="https://github.com/kairwang01"><img src="https://images.weserv.nl/?url=github.com/kairwang01.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@kairwang01" /></a>
<a href="https://github.com/gongjurenzhangwei"><img src="https://images.weserv.nl/?url=github.com/gongjurenzhangwei.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@gongjurenzhangwei" /></a>
<a href="https://github.com/jsonring"><img src="https://images.weserv.nl/?url=github.com/jsonring.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@jsonring" /></a>
<a href="https://github.com/1029734570"><img src="https://images.weserv.nl/?url=github.com/1029734570.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@1029734570" /></a>
<a href="https://github.com/86TheCactus"><img src="https://images.weserv.nl/?url=github.com/86TheCactus.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@86TheCactus" /></a>
<a href="https://github.com/AmiroKD"><img src="https://images.weserv.nl/?url=github.com/AmiroKD.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@AmiroKD" /></a>
<a href="https://github.com/ecryptomillionaire-dev"><img src="https://images.weserv.nl/?url=github.com/ecryptomillionaire-dev.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@ecryptomillionaire-dev" /></a>
<a href="https://github.com/4riful"><img src="https://images.weserv.nl/?url=github.com/4riful.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@4riful" /></a>
<a href="https://github.com/cagedbird043"><img src="https://images.weserv.nl/?url=github.com/cagedbird043.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@cagedbird043" /></a>
<a href="https://github.com/fix2015"><img src="https://images.weserv.nl/?url=github.com/fix2015.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@fix2015" /></a>
<a href="https://github.com/iisyw"><img src="https://images.weserv.nl/?url=github.com/iisyw.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@iisyw" /></a>
<a href="https://github.com/xsfhacg"><img src="https://images.weserv.nl/?url=github.com/xsfhacg.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@xsfhacg" /></a>
<a href="https://github.com/noobix"><img src="https://images.weserv.nl/?url=github.com/noobix.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@noobix" /></a>
<a href="https://github.com/nandukmelath"><img src="https://images.weserv.nl/?url=github.com/nandukmelath.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@nandukmelath" /></a>
<a href="https://github.com/coffcoe"><img src="https://images.weserv.nl/?url=github.com/coffcoe.png&w=60&h=60&fit=cover&mask=circle" width="60" alt="@coffcoe" /></a>

## 服务条款审查

针对每个提供商的 ToS（2026 年 5 月）对自托管、单用户、个人使用场景进行了重新审查。概要：

| 提供商 | 结论 | 备注 |
|---|---|---|
| Google Gemini | ⚠️ 谨慎 | 2026 年 3 月 ToS 将范围限制为"专业或商业目的，非消费者使用"——自托管开发者代理仍可辩护，但这是新条款。 |
| Groq | ✅ 可能合规 | GroqCloud 服务协议允许客户应用集成。 |
| Cerebras | ✅ 可能合规 | 允许；明确禁止出售/转让 API 密钥。 |
| Mistral | ✅ 可能合规 | API 允许个人/内部业务使用。 |
| OpenRouter | ✅ 可能合规 | 2026 年 4 月 ToS 强化了禁止转售/禁止竞争服务条款；私人单用户代理仍可接受。 |
| Cloudflare Workers AI | ⚠️ 模糊 | 无反代理条款；受通用自助订阅协议约束。 |
| NVIDIA NIM | ⚠️ 谨慎 | 试用 ToS §1.2 / §1.4："仅限评估，不可用于生产。"免费访问是 40 RPM 频率限制（2025 年的积分系统已废止），但仅限评估的范围仍然有效。 |
| GitHub Models | ⚠️ 谨慎 | 免费额度明确限定为"实验"和"原型设计"。 |
| Cohere | ❌ 避免 | 条款 §14 仍然禁止"个人、家庭或家居用途"。 |
| 智谱 (open.bigmodel.cn) | ✅ 可能合规 | 平台文档中仍有个人/非商业研究例外。 |
| Z.ai (api.z.ai) | ⚠️ 谨慎 | 新增行——新加坡实体（与智谱 CN 不同）。§III.3(l) 反流量重定向条款可能被解释为针对代理；没有明确的个人使用例外。 |
| Ollama Cloud | ✅ 可能合规 | 新增行——免费计划允许云端模型访问（1 并发，5 小时会话上限）。未发现反代理/反转售条款。 |
| OVH AI Endpoints | ✅ 可能合规 | 新增行（2026 年 6 月）——匿名访问已正式记录（每个 IP 每个模型 2 req/min）。OVH 保留引入 Token/消费上限的权利。 |
| AI Horde | ✅ 可能合规 | 新增行（2026 年 6 月）——由 Haidra 非营利组织运营的免费社区共享资源；匿名使用受官方支持（密钥 `0000000000`，队列优先级最低）。无反代理/反转售条款。OpenAI 代理为试点项目，可能受使用限制。 |

让大多数提供商满意的经验法则：**每个提供商一个账户**、**不转售**、**不与他人共享你的接口**、**不要将免费额度当作付费生产后端使用**。此信息仅供参考，不构成法律建议——请阅读每个提供商的 ToS 并自行判断。

自 2026 年 4 月审查以来移除的内容：Hugging Face、Moonshot 和 MiniMax 的直接集成已从目录中删除（HF——工具调用格式问题；Moonshot——已转为仅付费；MiniMax——已被 OpenRouter 的 `minimax/minimax-m2.5:free` 路由取代）。

## 免责声明

**本项目仅用于个人实验和学习，不适用于生产环境。** 免费额度的存在是为了让开发者进行原型设计；它们不是稳定、有支持的推理基础设施，也不应被视为如此。如果你在 FreeLLMAPI 之上构建了实际产品，请在上线前替换为付费 API。你与每个上游提供商的关系受你创建账户时接受的条款约束——当流量通过本项目代理时，这些条款仍然适用，你有责任遵守它们。

## Star 历史

[![Star History Chart](https://api.star-history.com/chart?repos=seraluce/model-aggregator&type=date&legend=top-left)](https://www.star-history.com/?repos=seraluce%2Fmodel-aggregator&type=date&legend=top-left)

## 许可证

[MIT](./LICENSE)
