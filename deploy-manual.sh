#!/bin/bash

##############################################################################
# 手动部署脚本（不依赖 pnpm 路径）
#
# 使用 npx 来执行所有命令，避免路径问题
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
echo -e "${CYAN}🚀 手动部署脚本${NC}"
echo "=========================================="
echo ""

PROJECT_DIR="/www/wwwroot/seo-websites-monorepo"
cd "$PROJECT_DIR"

# 步骤 5: 安装依赖
echo -e "${YELLOW}步骤 1/6: 安装项目依赖${NC}"
npx pnpm install
echo -e "${GREEN}✅ 依赖安装完成${NC}"
echo ""

# 步骤 6: 初始化 Prisma
echo -e "${YELLOW}步骤 2/6: 初始化 Prisma${NC}"
cd "$PROJECT_DIR/packages/database"
npx dotenv -e ../../.env.local -- npx prisma generate
echo -e "${GREEN}✅ Prisma 客户端已生成${NC}"
echo ""

# 步骤 7: 运行数据库迁移
echo -e "${YELLOW}步骤 3/6: 运行数据库迁移${NC}"
npx dotenv -e ../../.env.local -- npx prisma db push
echo -e "${GREEN}✅ 数据库表结构已创建${NC}"
echo ""

# 步骤 8: 创建种子数据
echo -e "${YELLOW}步骤 4/6: 创建种子数据（管理员账号）${NC}"
read -p "是否要创建默认管理员账号? (y/n): " create_seed
if [ "$create_seed" = "y" ]; then
    npx dotenv -e ../../.env.local -- npx tsx prisma/seed.ts
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
echo -e "${YELLOW}步骤 5/6: 部署域名配置（15个域名）${NC}"
read -p "是否要部署域名配置? (y/n): " deploy_domains
if [ "$deploy_domains" = "y" ]; then
    npx dotenv -e ../../.env.local -- npx tsx prisma/seed-domains.ts
    echo ""
    echo -e "${GREEN}✅ 已部署 15 个域名配置${NC}"
else
    echo -e "${BLUE}ℹ️  跳过域名配置${NC}"
fi
echo ""

# 步骤 10: 构建应用
echo -e "${YELLOW}步骤 6/6: 构建应用${NC}"
cd "$PROJECT_DIR"
npx pnpm build
echo -e "${GREEN}✅ 应用构建完成${NC}"
echo ""

# 启动服务
echo -e "${YELLOW}启动 PM2 服务${NC}"
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
echo -e "${GREEN}✅ 部署完成！${NC}"
echo "=========================================="
echo ""
echo "📋 服务信息:"
echo "  管理后台: https://admin.telegram1688.com"
echo "  默认账号: admin@example.com / admin123"
echo ""
echo "💡 常用命令:"
echo "  查看服务: pm2 list"
echo "  查看日志: pm2 logs seo-admin"
echo "  重启服务: pm2 restart all"
echo ""
