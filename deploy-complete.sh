#!/bin/bash
# 一键完整部署脚本 - 包含环境变量更新、代码拉取、构建和重启

set -e  # 遇到错误立即停止

echo "========================================="
echo "SEO 网站管理系统 - 一键部署"
echo "========================================="

# 获取脚本所在目录（项目根目录）
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# 步骤 1: 更新环境变量
echo ""
echo "步骤 1/7: 更新 .env.local 文件..."
bash update-env.sh

# 步骤 2: 拉取最新代码
echo ""
echo "步骤 2/7: 拉取最新代码..."
git pull origin master

# 步骤 3: 安装 dotenv-cli
echo ""
echo "步骤 3/7: 确保 dotenv-cli 已安装..."
npm list -g dotenv-cli || npm install -g dotenv-cli

# 步骤 4: 安装依赖
echo ""
echo "步骤 4/7: 安装项目依赖..."
pnpm install

# 步骤 5: 生成 Prisma Client
echo ""
echo "步骤 5/7: 生成 Prisma Client..."
npx prisma generate

# 步骤 6: 构建所有应用
echo ""
echo "步骤 6/7: 构建所有应用..."
pnpm run build

# 步骤 7: 重启服务
echo ""
echo "步骤 7/7: 重启 PM2 服务..."
chmod +x start-*.sh
pm2 delete all 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

echo ""
echo "========================================="
echo "✅ 部署完成！"
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
