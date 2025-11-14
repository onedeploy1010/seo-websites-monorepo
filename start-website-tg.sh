#!/bin/bash
# Website-TG 启动脚本 - 使用 dotenv-cli 加载环境变量

cd "$(dirname "$0")"
exec dotenv -e .env.local -- node apps/website-tg/node_modules/next/dist/bin/next start -p 3003
