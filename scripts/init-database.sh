#!/bin/bash

##############################################################################
# 数据库初始化脚本
#
# 功能：
# - 创建数据库 seo_websites
# - 创建用户 seo_user
# - 授予必要的权限
# - 验证连接
#
# 使用方法：
# chmod +x scripts/init-database.sh
# sudo ./scripts/init-database.sh
##############################################################################

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "=========================================="
echo -e "${BLUE}🗄️  数据库初始化脚本${NC}"
echo "=========================================="
echo ""

# 检查是否以 root 运行
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}❌ 请使用 sudo 运行此脚本${NC}"
    exit 1
fi

# 检查 PostgreSQL 是否运行
if ! systemctl is-active --quiet postgresql; then
    echo -e "${RED}❌ PostgreSQL 服务未运行${NC}"
    echo "请先运行: sudo ./scripts/fix-postgresql.sh"
    exit 1
fi

# 数据库配置
DB_NAME="seo_websites"
DB_USER="seo_user"

# 提示输入密码
echo -e "${YELLOW}请设置数据库密码（至少 8 位，包含大小写字母和数字）：${NC}"
read -s -p "密码: " DB_PASSWORD
echo ""
read -s -p "确认密码: " DB_PASSWORD_CONFIRM
echo ""

if [ "$DB_PASSWORD" != "$DB_PASSWORD_CONFIRM" ]; then
    echo -e "${RED}❌ 两次密码不一致${NC}"
    exit 1
fi

if [ ${#DB_PASSWORD} -lt 8 ]; then
    echo -e "${RED}❌ 密码长度至少 8 位${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}步骤 1/4: 创建数据库和用户${NC}"

# 创建数据库和用户
sudo -u postgres psql << EOSQL
-- 删除已存在的数据库和用户（如果有）
DROP DATABASE IF EXISTS $DB_NAME;
DROP USER IF EXISTS $DB_USER;

-- 创建新用户
CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';

-- 创建数据库
CREATE DATABASE $DB_NAME OWNER $DB_USER;

-- 授予数据库权限
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;

-- 连接到新数据库
\c $DB_NAME

-- 授予 schema 权限
GRANT ALL ON SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;

-- 设置默认权限
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USER;

-- 显示创建结果
\echo '✅ 数据库创建成功'
\l $DB_NAME
\du $DB_USER
EOSQL

echo -e "${GREEN}✅ 数据库和用户创建成功${NC}"
echo ""

# 测试连接
echo -e "${YELLOW}步骤 2/4: 测试数据库连接${NC}"
if PGPASSWORD="$DB_PASSWORD" psql -U $DB_USER -d $DB_NAME -h localhost -c "SELECT current_database(), current_user;" &> /dev/null; then
    echo -e "${GREEN}✅ 数据库连接测试成功${NC}"
else
    echo -e "${RED}❌ 数据库连接测试失败${NC}"
    exit 1
fi
echo ""

# 生成 DATABASE_URL
echo -e "${YELLOW}步骤 3/4: 生成连接字符串${NC}"
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}?schema=public"
echo -e "${GREEN}✅ 连接字符串已生成${NC}"
echo ""

# 保存配置到临时文件
TEMP_ENV_FILE="/tmp/database-config.env"
cat > "$TEMP_ENV_FILE" << EOF
# 数据库配置
DATABASE_URL="$DATABASE_URL"

# 数据库信息
DB_HOST=localhost
DB_PORT=5432
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
EOF

chmod 600 "$TEMP_ENV_FILE"
echo -e "${GREEN}✅ 配置已保存到: $TEMP_ENV_FILE${NC}"
echo ""

# 提示用户
echo -e "${YELLOW}步骤 4/4: 配置项目环境变量${NC}"
echo ""
echo "请将以下配置添加到项目的 .env.local 文件中："
echo ""
echo -e "${BLUE}DATABASE_URL=\"$DATABASE_URL\"${NC}"
echo ""
echo "或者运行以下命令自动添加："
echo ""
echo -e "${BLUE}cd /www/wwwroot/seo-websites-monorepo${NC}"
echo -e "${BLUE}echo 'DATABASE_URL=\"$DATABASE_URL\"' >> .env.local${NC}"
echo ""

echo "=========================================="
echo -e "${GREEN}✅ 数据库初始化完成！${NC}"
echo "=========================================="
echo ""
echo "📋 数据库信息:"
echo "  数据库名: $DB_NAME"
echo "  用户名: $DB_USER"
echo "  主机: localhost"
echo "  端口: 5432"
echo ""
echo "💡 下一步："
echo "  1. 配置 .env.local 文件（参考上面的命令）"
echo "  2. 运行: cd packages/database && npx dotenv -e ../../.env.local -- npx prisma db push"
echo "  3. 运行: npx dotenv -e ../../.env.local -- npm run db:seed"
echo ""
