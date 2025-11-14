#!/bin/bash
# Website-1 应用启动脚本 - 使用 dotenv-cli 加载环境变量

# 获取脚本所在目录的绝对路径（项目根目录）
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# 进入项目根目录
cd "$SCRIPT_DIR"

# 使用绝对路径加载 .env.local 并启动应用
exec dotenv -e "$SCRIPT_DIR/.env.local" -- node "$SCRIPT_DIR/apps/website-1/node_modules/next/dist/bin/next" start -p 3001
