#!/bin/bash

echo "=========================================="
echo "  快速配置数据库环境"
echo "=========================================="
echo ""

# 数据库信息
DB_USER="seo_user"
DB_PASSWORD="SeoTg2024!Secure"
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="seo_websites"

DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public"

echo "使用数据库配置："
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "主机: $DB_HOST"
echo "端口: $DB_PORT"
echo "数据库: $DB_NAME"
echo "用户: $DB_USER"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 生成 NEXTAUTH_SECRET
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# 创建项目根目录的 .env
cat > .env << 'ENVEOF'
# Database Configuration
DATABASE_URL="postgresql://seo_user:SeoTg2024!Secure@localhost:5432/seo_websites?schema=public"

# NextAuth Configuration (Admin)
NEXTAUTH_SECRET="'$NEXTAUTH_SECRET'"
NEXTAUTH_URL="https://admin.telegram1688.com"

# Optional: OpenAI API Key for AI features
# OPENAI_API_KEY="your-openai-api-key"

# Optional: Vercel Configuration
# VERCEL_TOKEN="your-vercel-token"
# VERCEL_PROJECT_ID="your-project-id"
# VERCEL_TEAM_ID="your-team-id"
ENVEOF

echo "✓ 已创建 .env 文件"

# 创建 admin 的 .env.local
cat > apps/admin/.env.local << 'ADMINEOF'
DATABASE_URL="postgresql://seo_user:SeoTg2024!Secure@localhost:5432/seo_websites?schema=public"
NEXTAUTH_SECRET="'$NEXTAUTH_SECRET'"
NEXTAUTH_URL="https://admin.telegram1688.com"
ADMINEOF

echo "✓ 已创建 apps/admin/.env.local 文件"

# 生成 Prisma Client
echo ""
echo "生成 Prisma Client..."
cd packages/database
npx prisma generate > /dev/null 2>&1
cd ../..
echo "✓ Prisma Client 已生成"

echo ""
echo "=========================================="
echo "  配置完成！"
echo "=========================================="
echo ""
echo "下一步："
echo "1. 创建管理员账号: node create-admin-user.js"
echo "2. 重启 PM2 应用: pm2 restart all"
echo ""

