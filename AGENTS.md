# Project & Environment Guidelines

## 1. System & Shell Environment
- **OS**: macOS (Apple Silicon)
- **Shell**: Fish Shell
- **Command Rules**:
  - 生成或执行终端命令时，优先兼容 Fish 语法（例如设置环境变量使用 `set -x KEY VALUE` 或在命令前直接传参 `KEY=VALUE cmd`，避免依赖 Bash 特有的 `export` 或 `source` 写法）。
  - 严禁未经确认直接向系统全局环境安装依赖（如全局 `pip install` 或 `npm install -g`）。

---

## 2. Python Management (`uv`)
所有 Python 项目的初始化、虚拟环境与依赖管理**必须统一使用 `uv`**。
- **禁止使用**：`pip`、`pip3`、`python -m venv`、`virtualenv`、`conda`、`poetry`。
- **项目初始化**：
  - 新建项目使用 `uv init`（根据需求使用 `--app` 或 `--lib`）。
  - 指定 Python 版本使用 `uv python pin <version>`（生成 `.python-version`）。
- **依赖管理**：
  - 添加运行依赖：`uv add <package>`
  - 添加开发依赖：`uv add --dev <package>`
  - 移除依赖：`uv remove <package>`
  - 同步环境：`uv sync`
- **运行脚本与工具**：
  - 始终通过 `uv run <command>` 执行代码或测试（例如 `uv run main.py`、`uv run pytest`），不要手动激活 `.venv`。
  - 临时运行一次性 CLI 工具使用 `uvx <tool>`。

---

## 3. Node.js Management (`mise`)
所有 Node.js 运行时版本管理**必须统一使用 `mise`**。
- **禁止使用**：`nvm`、`fnm`、`n`、`volta`。
- **版本锁定**：
  - 创建新项目时，使用 `mise use node@lts`（或指定版本如 `mise use node@22`）在项目根目录生成并维护 `mise.toml`。
  - 在非交互式 Shell 中执行命令时，如遇到环境未自动激活，使用 `mise exec -- <command>`。
- **包管理器约定**：
  - 已有项目：严格遵循项目现有的 lockfile（`pnpm-lock.yaml` -> `pnpm`、`package-lock.json` -> `npm`、`bun.lock` -> `bun`）。
  - 新建项目：默认使用 `npm`（如需切换为 `pnpm` 或 `bun`，请在此处修改）。

---

## 4. Project Initialization Hygiene
每次创建新项目时，必须同步完成以下基础配置：
1. **Git 忽略文件**：生成适配当前语言栈的 `.gitignore`，确保忽略 `.venv/`、`__pycache__/`、`node_modules/`、`.env` 和 `.DS_Store`。
2. **锁文件提交**：保留并提交 `uv.lock`、`mise.toml` 以及 Node.js 的 lockfile，确保环境可复现。
3. **环境变量**：如需敏感配置，创建 `.env.example` 作为模板，不要将真实密钥写入代码或提交到 Git。
