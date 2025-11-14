#!/bin/bash
# 完全自动化修复脚本 - 一键解决所有问题

set -e

PROJECT_ROOT="/www/wwwroot/seo-websites-monorepo"

echo "========================================="
echo "自动化修复脚本 - 开始执行"
echo "========================================="

cd "$PROJECT_ROOT"

# 步骤 1: 检测 Next.js 路径
echo ""
echo "步骤 1/8: 检测 Next.js 路径..."
if [ -f "$PROJECT_ROOT/node_modules/.bin/next" ]; then
    NEXT_BIN="$PROJECT_ROOT/node_modules/.bin/next"
    echo "✅ 找到 Next.js: $NEXT_BIN"
else
    echo "❌ 未找到 Next.js，正在安装依赖..."
    pnpm install
    NEXT_BIN="$PROJECT_ROOT/node_modules/.bin/next"
fi

# 步骤 2: 检测 dotenv-cli
echo ""
echo "步骤 2/8: 检测 dotenv-cli..."
if command -v dotenv &> /dev/null; then
    echo "✅ dotenv-cli 已安装"
else
    echo "❌ 正在安装 dotenv-cli..."
    npm install -g dotenv-cli
fi

# 步骤 3: 创建/更新 .env.local
echo ""
echo "步骤 3/8: 创建 .env.local 文件..."
cat > "$PROJECT_ROOT/.env.local" << 'EOF'
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
echo "✅ .env.local 已创建"

# 步骤 4: 验证环境变量
echo ""
echo "步骤 4/8: 验证环境变量..."
dotenv -e "$PROJECT_ROOT/.env.local" -- node -e "
if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL 未加载');
    process.exit(1);
}
if (!process.env.NEXTAUTH_SECRET) {
    console.error('❌ NEXTAUTH_SECRET 未加载');
    process.exit(1);
}
console.log('✅ DATABASE_URL: 已加载');
console.log('✅ NEXTAUTH_SECRET: 已加载');
"

# 步骤 5: 创建启动脚本
echo ""
echo "步骤 5/8: 创建启动脚本..."

# Admin
cat > "$PROJECT_ROOT/start-admin.sh" << EOF
#!/bin/bash
cd $PROJECT_ROOT
exec dotenv -e $PROJECT_ROOT/.env.local -- $NEXT_BIN start $PROJECT_ROOT/apps/admin -p 3100
EOF

# Website 1
cat > "$PROJECT_ROOT/start-website-1.sh" << EOF
#!/bin/bash
cd $PROJECT_ROOT
exec dotenv -e $PROJECT_ROOT/.env.local -- $NEXT_BIN start $PROJECT_ROOT/apps/website-1 -p 3001
EOF

# Website 2
cat > "$PROJECT_ROOT/start-website-2.sh" << EOF
#!/bin/bash
cd $PROJECT_ROOT
exec dotenv -e $PROJECT_ROOT/.env.local -- $NEXT_BIN start $PROJECT_ROOT/apps/website-2 -p 3002
EOF

# Website TG
cat > "$PROJECT_ROOT/start-website-tg.sh" << EOF
#!/bin/bash
cd $PROJECT_ROOT
exec dotenv -e $PROJECT_ROOT/.env.local -- $NEXT_BIN start $PROJECT_ROOT/apps/website-tg -p 3003
EOF

chmod +x "$PROJECT_ROOT"/start-*.sh
echo "✅ 启动脚本已创建"

# 步骤 6: 生成 Prisma Client
echo ""
echo "步骤 6/8: 生成 Prisma Client..."
cd "$PROJECT_ROOT/packages/database"
npx prisma generate
cd "$PROJECT_ROOT"
echo "✅ Prisma Client 已生成"

# 步骤 7: 重启 PM2 服务
echo ""
echo "步骤 7/8: 重启 PM2 服务..."
pm2 delete all 2>/dev/null || true
pm2 start "$PROJECT_ROOT/ecosystem.config.js"
pm2 save
echo "✅ PM2 服务已重启"

# 步骤 8: 验证服务状态
echo ""
echo "步骤 8/8: 验证服务状态..."
sleep 3
pm2 list

echo ""
echo "========================================="
echo "✅ 自动化修复完成！"
echo "========================================="

# 测试环境变量加载
echo ""
echo "最终验证:"
dotenv -e "$PROJECT_ROOT/.env.local" -- node -e "
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ 已加载' : '❌ 未加载');
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✅ 已加载' : '❌ 未加载');
"

echo ""
echo "查看日志: pm2 logs --lines 20"
echo "测试访问: curl http://localhost:3100"
echo ""
