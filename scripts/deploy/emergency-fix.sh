#!/bin/bash
# 紧急修复脚本 - 解决环境变量和 npm 缓存问题

set -e

echo "========================================="
echo "紧急修复 - 环境变量和缓存问题"
echo "========================================="

# 获取项目根目录
PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$PROJECT_ROOT"

echo ""
echo "步骤 1/6: 修复 .env.local 文件..."
cat > .env.local << 'EOF'
DATABASE_URL="postgresql://seo_user:tgseo123@localhost:5432/seo_websites?schema=public"

NEXTAUTH_SECRET="9kL2mN4pQ6rS8tU0vW1xY3zA5bC7dE9fG2hI4jK6lM8nO0pR1sT3uV5wX7yZ9aB1c"
NEXTAUTH_URL="https://admin.telegram1688.com"

SETTINGS_ENCRYPTION_KEY="4eF6gH8iJ0kL2mN4oP6qR8sT0uV2wX4yZ6aB8cD0eF2gH4iJ6kL8mN0oP2qR4sT6u"

TAVILY_API_KEY="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"

NEXT_PUBLIC_SITE_NAME="SEO 管理后台"

NEXT_PUBLIC_WEBSITE1_URL="https://telegram1688.com"
NEXT_PUBLIC_WEBSITE1_NAME="Telegram中文网 1"

NEXT_PUBLIC_WEBSITE2_URL="https://telegram2688.com"
NEXT_PUBLIC_WEBSITE2_NAME="Telegram中文网 2"

NEXT_PUBLIC_WEBSITE_TG_URL="https://telegramcnfw.com"
NEXT_PUBLIC_WEBSITE_TG_NAME="Telegram中文服务"

NODE_ENV="production"
PORT=3100
EOF

echo "✅ .env.local 已修复"
echo "验证关键配置:"
grep -E "DATABASE_URL|NEXTAUTH_SECRET|TAVILY_API_KEY" .env.local

echo ""
echo "步骤 2/6: 清理 npm 缓存..."
npm cache clean --force
rm -rf /www/server/nodejs/v24.11.1/cache/_npx/* 2>/dev/null || true
echo "✅ npm 缓存已清理"

echo ""
echo "步骤 3/6: 安装 dotenv-cli..."
npm install -g dotenv-cli
echo "✅ dotenv-cli 已安装"

echo ""
echo "步骤 4/6: 生成 Prisma Client..."
cd packages/database
npx prisma generate
cd "$PROJECT_ROOT"
echo "✅ Prisma Client 已生成"

echo ""
echo "步骤 5/6: 重启 PM2 服务..."
chmod +x start-*.sh
pm2 delete all 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
echo "✅ PM2 服务已重启"

echo ""
echo "步骤 6/6: 验证服务状态..."
pm2 list

echo ""
echo "========================================="
echo "✅ 修复完成！"
echo "========================================="
echo ""
echo "测试环境变量加载:"
dotenv -e .env.local -- node -e "console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ 已加载' : '❌ 未加载')"
dotenv -e .env.local -- node -e "console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✅ 已加载' : '❌ 未加载')"

echo ""
echo "查看日志: pm2 logs --lines 20"
