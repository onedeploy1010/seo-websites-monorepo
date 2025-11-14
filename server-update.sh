#!/bin/bash
# 服务器更新和重启脚本

echo "========================================="
echo "开始更新 SEO 网站管理系统"
echo "========================================="

cd /www/wwwroot/seo-websites-monorepo

echo "1. 拉取最新代码..."
git pull origin master

echo "2. 安装依赖..."
pnpm install

echo "3. 生成 Prisma Client..."
npx prisma generate

echo "4. 构建所有应用..."
pnpm run build

echo "5. 赋予启动脚本执行权限..."
chmod +x start-*.sh

echo "6. 重启 PM2 服务..."
pm2 delete all
pm2 start ecosystem.config.js
pm2 save

echo "========================================="
echo "更新完成！查看运行状态:"
echo "========================================="
pm2 list

echo ""
echo "查看日志: pm2 logs"
echo "重启单个应用: pm2 restart seo-admin"
