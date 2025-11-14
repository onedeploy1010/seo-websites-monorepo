#!/bin/bash
# 强制部署脚本 - 处理 Git 冲突并完成部署

set -e  # 遇到错误立即停止

echo "========================================="
echo "SEO 网站管理系统 - 强制部署"
echo "========================================="

# 获取项目根目录（scripts/deploy 的上两级）
PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$PROJECT_ROOT"

# 步骤 1: 备份本地修改
echo ""
echo "步骤 1/8: 备份并清理本地修改..."
git stash push -m "auto-backup-$(date +%Y%m%d_%H%M%S)"

# 步骤 2: 强制拉取最新代码
echo ""
echo "步骤 2/8: 强制拉取最新代码..."
git fetch origin master
git reset --hard origin/master

# 步骤 3: 更新环境变量
echo ""
echo "步骤 3/8: 更新 .env.local 文件..."
bash scripts/deploy/update-env.sh

# 步骤 4: 安装 dotenv-cli
echo ""
echo "步骤 4/8: 确保 dotenv-cli 已安装..."
npm list -g dotenv-cli || npm install -g dotenv-cli

# 步骤 5: 安装依赖
echo ""
echo "步骤 5/8: 安装项目依赖..."
pnpm install

# 步骤 6: 生成 Prisma Client
echo ""
echo "步骤 6/8: 生成 Prisma Client..."
npx prisma generate --schema=packages/database/prisma/schema.prisma

# 步骤 7: 构建所有应用
echo ""
echo "步骤 7/8: 构建所有应用..."
pnpm run build

# 步骤 8: 重启服务
echo ""
echo "步骤 8/8: 重启 PM2 服务..."
chmod +x start-*.sh
pm2 delete all 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

echo ""
echo "========================================="
echo "✅ 强制部署完成！"
echo "========================================="
echo ""
echo "查看运行状态:"
pm2 list
echo ""
echo "测试本地访问:"
echo "Admin:      curl http://localhost:3100"
echo "Website-1:  curl http://localhost:3001"
echo "Website-2:  curl http://localhost:3002"
echo "Website-TG: curl http://localhost:3003"
echo ""
echo "查看日志: pm2 logs"
echo "========================================="
