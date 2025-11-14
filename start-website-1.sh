#!/bin/bash
# Website-1 应用启动脚本 - 使用 dotenv-cli 加载环境变量

# 进入项目根目录
cd "$(dirname "$0")"

# 使用 dotenv-cli 加载 .env.local 并启动应用
exec dotenv -e .env.local -- node apps/website-1/node_modules/next/dist/bin/next start -p 3001
