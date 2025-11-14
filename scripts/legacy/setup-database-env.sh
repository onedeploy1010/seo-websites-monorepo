#!/bin/bash

# 数据库环境配置脚本

echo "=========================================="
echo "  数据库环境配置"
echo "=========================================="
echo ""

# 检查是否已有 .env 文件
if [ -f ".env" ]; then
    echo "✓ 找到现有 .env 文件"
    cat .env
    echo ""
else
    echo "⚠️  未找到 .env 文件"
    echo ""
fi

echo "请提供数据库连接信息："
echo ""

# 询问数据库信息
read -p "数据库主机 [localhost]: " DB_HOST
DB_HOST=${DB_HOST:-localhost}

read -p "数据库端口 [5432]: " DB_PORT
DB_PORT=${DB_PORT:-5432}

read -p "数据库名称 [seo_websites]: " DB_NAME
DB_NAME=${DB_NAME:-seo_websites}

read -p "数据库用户名 [postgres]: " DB_USER
DB_USER=${DB_USER:-postgres}

read -sp "数据库密码: " DB_PASSWORD
echo ""

# 生成 DATABASE_URL
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public"

echo ""
echo "生成的数据库连接:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "DATABASE_URL=\"${DATABASE_URL}\""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 测试数据库连接
echo "测试数据库连接..."
if command -v psql &> /dev/null; then
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT version();" > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✓ 数据库连接成功"
    else
        echo "⚠️  数据库连接失败，请检查配置"
    fi
else
    echo "⚠️  未安装 psql，跳过连接测试"
fi

echo ""
read -p "是否创建/更新 .env 文件？(y/n): " CONFIRM

if [ "$CONFIRM" = "y" ]; then
    # 备份现有 .env
    if [ -f ".env" ]; then
        cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
        echo "✓ 已备份现有 .env 文件"
    fi
    
    # 创建/更新 .env
    cat > .env << ENVEOF
# Database Configuration
DATABASE_URL="${DATABASE_URL}"

# NextAuth Configuration (Admin)
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="https://admin.telegram1688.com"

# Optional: OpenAI API Key for AI features
# OPENAI_API_KEY="your-openai-api-key"

# Optional: Vercel Configuration for automatic domain management
# VERCEL_TOKEN="your-vercel-token"
# VERCEL_PROJECT_ID="your-project-id"
# VERCEL_TEAM_ID="your-team-id"
ENVEOF
    
    echo "✓ .env 文件已创建/更新"
    echo ""
    
    # 同时更新 admin 的 .env.local
    if [ ! -d "apps/admin" ]; then
        mkdir -p apps/admin
    fi
    
    cat > apps/admin/.env.local << ADMINENVEOF
DATABASE_URL="${DATABASE_URL}"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="https://admin.telegram1688.com"
ADMINENVEOF
    
    echo "✓ apps/admin/.env.local 已创建/更新"
    echo ""
    
    # 生成 Prisma Client
    echo "生成 Prisma Client..."
    cd packages/database
    npx prisma generate
    cd ../..
    echo "✓ Prisma Client 已生成"
    echo ""
    
    # 运行数据库迁移
    echo "运行数据库迁移..."
    read -p "是否运行数据库迁移？(y/n): " RUN_MIGRATE
    if [ "$RUN_MIGRATE" = "y" ]; then
        cd packages/database
        npx prisma migrate deploy || npx prisma db push
        cd ../..
        echo "✓ 数据库迁移完成"
    fi
    
    echo ""
    echo "=========================================="
    echo "  配置完成！"
    echo "=========================================="
    echo ""
    echo "下一步："
    echo "1. 创建管理员账号: node create-admin-user.js"
    echo "2. 重启 PM2 应用: pm2 restart all"
    echo "3. 登录管理后台: https://admin.telegram1688.com"
else
    echo ""
    echo "已取消"
fi

