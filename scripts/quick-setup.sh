#!/bin/bash

##############################################################################
# 快速部署脚本
#
# 功能：
# - 一键完成从代码克隆到服务启动的全过程
# - 自动检测和修复常见问题
# - 提供详细的进度反馈
#
# 使用方法：
# chmod +x scripts/quick-setup.sh
# sudo ./scripts/quick-setup.sh
##############################################################################

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo "=========================================="
echo -e "${CYAN}🚀 SEO 网站管理系统 - 快速部署${NC}"
echo "=========================================="
echo ""

# 项目目录
PROJECT_DIR="/www/wwwroot/seo-websites-monorepo"

# 步骤 1: 检查系统要求
echo -e "${YELLOW}步骤 1/10: 检查系统要求${NC}"

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js 未安装${NC}"
    echo "请先安装 Node.js 18+"
    exit 1
fi
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js 版本过低（当前: $NODE_VERSION，要求: 18+）${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node -v)${NC}"

# 检查 pnpm（使用 npx 避免路径问题）
if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}⚠️  pnpm 未安装，正在安装...${NC}"
    npm install -g pnpm
fi
echo -e "${GREEN}✅ pnpm (将通过 npx 运行)${NC}"

# 检查 PostgreSQL
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}⚠️  PostgreSQL 未安装${NC}"
    read -p "是否要安装 PostgreSQL? (y/n): " install_pg
    if [ "$install_pg" = "y" ]; then
        apt update
        apt install postgresql postgresql-contrib -y
    else
        echo -e "${RED}❌ PostgreSQL 是必需的${NC}"
        exit 1
    fi
fi
echo -e "${GREEN}✅ PostgreSQL $(psql --version | awk '{print $3}')${NC}"

# 检查 PM2
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}⚠️  PM2 未安装，正在安装...${NC}"
    npm install -g pm2
fi
echo -e "${GREEN}✅ PM2 $(pm2 -v)${NC}"

echo ""

# 步骤 2: 修复 PostgreSQL
echo -e "${YELLOW}步骤 2/10: 修复 PostgreSQL 配置${NC}"
if [ -f "$PROJECT_DIR/scripts/fix-postgresql.sh" ]; then
    bash "$PROJECT_DIR/scripts/fix-postgresql.sh"
else
    echo -e "${YELLOW}⚠️  跳过（脚本不存在）${NC}"
fi
echo ""

# 步骤 3: 初始化数据库
echo -e "${YELLOW}步骤 3/10: 初始化数据库${NC}"
read -p "是否要初始化数据库? (y/n): " init_db
if [ "$init_db" = "y" ]; then
    if [ -f "$PROJECT_DIR/scripts/init-database.sh" ]; then
        bash "$PROJECT_DIR/scripts/init-database.sh"
    else
        echo -e "${YELLOW}⚠️  请手动创建数据库${NC}"
    fi
else
    echo -e "${BLUE}ℹ️  跳过数据库初始化${NC}"
fi
echo ""

# 步骤 4: 检查 .env.local
echo -e "${YELLOW}步骤 4/10: 检查环境变量配置${NC}"
if [ ! -f "$PROJECT_DIR/.env.local" ]; then
    echo -e "${YELLOW}⚠️  .env.local 不存在${NC}"
    echo -e "${BLUE}创建示例配置文件...${NC}"

    cat > "$PROJECT_DIR/.env.local" << 'EOF'
# ========== 数据库配置 ==========
DATABASE_URL="postgresql://seo_user:YOUR_PASSWORD@localhost:5432/seo_websites?schema=public"

# ========== NextAuth 配置 ==========
NEXTAUTH_SECRET="CHANGE_THIS_TO_32_CHAR_SECRET"
NEXTAUTH_URL="https://admin.yourdomain.com"

# ========== 加密密钥 ==========
SETTINGS_ENCRYPTION_KEY="CHANGE_THIS_TO_32_CHAR_SECRET"

# ========== 生产环境配置 ==========
NODE_ENV="production"
PORT=3100
EOF

    echo -e "${RED}❌ 请编辑 .env.local 文件并配置正确的值${NC}"
    echo "配置文件位置: $PROJECT_DIR/.env.local"
    echo ""
    echo "按 Enter 继续（配置完成后）..."
    read
else
    echo -e "${GREEN}✅ .env.local 已存在${NC}"
fi

# 加载环境变量到当前会话
echo -e "${BLUE}加载环境变量...${NC}"

# 清理 Windows 换行符（CRLF -> LF）
sed -i 's/\r$//' "$PROJECT_DIR/.env.local"

set -a  # 自动导出所有变量
source "$PROJECT_DIR/.env.local"
set +a
echo -e "${GREEN}✅ 环境变量已加载${NC}"

echo ""

# 步骤 5: 安装依赖
echo -e "${YELLOW}步骤 5/11: 安装项目依赖${NC}"
cd "$PROJECT_DIR"
echo -e "${BLUE}使用 npx pnpm 安装依赖（避免路径问题）...${NC}"
npx pnpm install
echo -e "${GREEN}✅ 依赖安装完成${NC}"
echo ""

# 步骤 6: 初始化 Prisma
echo -e "${YELLOW}步骤 6/11: 初始化 Prisma${NC}"
cd "$PROJECT_DIR/packages/database"
echo -e "${BLUE}生成 Prisma 客户端...${NC}"
npx prisma generate
echo -e "${GREEN}✅ Prisma 客户端已生成${NC}"
echo ""

# 步骤 7: 运行数据库迁移
echo -e "${YELLOW}步骤 7/11: 运行数据库迁移${NC}"
echo -e "${BLUE}推送数据库 schema...${NC}"
npx prisma db push
echo -e "${GREEN}✅ 数据库表结构已创建${NC}"
echo ""

# 步骤 8: 创建种子数据
echo -e "${YELLOW}步骤 8/11: 创建种子数据（管理员账号）${NC}"
read -p "是否要创建默认管理员账号? (y/n): " create_seed
if [ "$create_seed" = "y" ]; then
    echo -e "${BLUE}创建管理员账号和示例数据...${NC}"
    npx tsx prisma/seed.ts
    echo ""
    echo -e "${GREEN}✅ 默认管理员账号已创建${NC}"
    echo "  邮箱: admin@example.com"
    echo "  密码: admin123"
    echo ""
    echo -e "${RED}⚠️  首次登录后请立即修改密码！${NC}"
else
    echo -e "${BLUE}ℹ️  跳过种子数据${NC}"
fi
echo ""

# 步骤 9: 部署域名配置
echo -e "${YELLOW}步骤 9/11: 部署域名配置（15个域名）${NC}"
read -p "是否要部署域名配置? (y/n): " deploy_domains
if [ "$deploy_domains" = "y" ]; then
    echo -e "${BLUE}部署 15 个域名到数据库...${NC}"
    npx tsx prisma/seed-domains.ts
    echo ""
    echo -e "${GREEN}✅ 已部署 15 个域名配置${NC}"
    echo ""
    echo -e "${CYAN}域名列表：${NC}"
    echo "  Website 1: telegram1688.com, telegram2688.com, telegramcny28.com, telegramrmb28.com, telegramxzb.com"
    echo "  Website 2: telegramcnfw.com, telegramfuwu.com, telegramfwfw.com, telegramxzfw.com, telegramzhfw.com"
    echo "  Website TG: telegramgzzh.com, telegramhnzh.com, telegramjiaoyu.com, xztelegram.com, zhxztelegram.com"
    echo ""
    echo -e "${BLUE}ℹ️  下一步：配置 Nginx 反向代理和 SSL 证书（参考 docs/域名配置指南.md）${NC}"
else
    echo -e "${BLUE}ℹ️  跳过域名配置${NC}"
    echo "手动部署命令: ./scripts/deploy-domains.sh"
fi
echo ""

# 步骤 10: 构建应用
echo -e "${YELLOW}步骤 10/11: 构建应用${NC}"
cd "$PROJECT_DIR"
echo -e "${BLUE}构建所有应用（可能需要几分钟）...${NC}"
npx pnpm build
echo -e "${GREEN}✅ 应用构建完成${NC}"
echo ""

# 步骤 11: 启动服务
echo -e "${YELLOW}步骤 11/11: 启动 PM2 服务${NC}"
read -p "是否要启动 PM2 服务? (y/n): " start_pm2
if [ "$start_pm2" = "y" ]; then
    pm2 start ecosystem.config.js
    pm2 save
    pm2 startup
    echo -e "${GREEN}✅ PM2 服务已启动${NC}"
    echo ""
    pm2 list
else
    echo -e "${BLUE}ℹ️  跳过 PM2 启动${NC}"
    echo "手动启动命令: pm2 start ecosystem.config.js"
fi
echo ""

echo "=========================================="
echo -e "${GREEN}✅ 快速部署完成！${NC}"
echo "=========================================="
echo ""
echo "📋 服务信息:"
echo "  管理后台: http://localhost:3100"
echo "  默认账号: admin@example.com / admin123"
echo ""
echo "💡 常用命令:"
echo "  查看服务: pm2 list"
echo "  查看日志: pm2 logs seo-admin"
echo "  重启服务: pm2 restart all"
echo "  停止服务: pm2 stop all"
echo ""
echo "📖 完整文档:"
echo "  服务器部署指南: $PROJECT_DIR/服务器部署指南.md"
echo "  使用说明书: $PROJECT_DIR/使用说明书.md"
echo ""
