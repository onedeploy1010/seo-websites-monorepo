#!/bin/bash
# Admin 应用启动脚本 - 加载环境变量

# 进入项目根目录
cd "$(dirname "$0")"

# 加载环境变量
set -a
source .env.local
set +a

# 进入 admin 目录并启动
cd apps/admin
exec node node_modules/next/dist/bin/next start -p 3100
