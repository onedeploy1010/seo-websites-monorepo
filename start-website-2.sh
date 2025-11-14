#!/bin/bash
# Website-2 启动脚本 - 加载环境变量

cd "$(dirname "$0")"
set -a
source .env.local
set +a
cd apps/website-2
exec node node_modules/next/dist/bin/next start -p 3002
