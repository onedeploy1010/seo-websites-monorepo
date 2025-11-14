#!/bin/bash

# =====================================================
# 🔧 服务器部署修复脚本
# =====================================================
#
# 用途：修复服务器上的PM2配置和环境变量问题
#
# 使用方法：
#   chmod +x scripts/fix-server-deployment.sh
#   ./scripts/fix-server-deployment.sh
#

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🔧 开始修复服务器部署问题...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 1. 检查环境变量文件
echo -e "${YELLOW}步骤 1/6: 检查环境变量文件...${NC}"
if [ ! -f ".env.production" ]; then
    echo -e "${RED}❌ 未找到 .env.production 文件${NC}"
    echo -e "${YELLOW}请先创建环境变量文件：${NC}"
    echo "  cp .env.production.example .env.production"
    echo "  nano .env.production"
    exit 1
else
    echo -e "${GREEN}✅ .env.production 文件存在${NC}"
fi

# 2. 验证关键环境变量
echo ""
echo -e "${YELLOW}步骤 2/6: 验证关键环境变量...${NC}"

source .env.production

REQUIRED_VARS=("DATABASE_URL" "NEXTAUTH_SECRET" "NEXTAUTH_URL")
MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        MISSING_VARS+=("$var")
        echo -e "${RED}❌ 缺少环境变量: $var${NC}"
    else
        echo -e "${GREEN}✅ $var 已配置${NC}"
    fi
done

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo ""
    echo -e "${RED}错误：缺少必需的环境变量${NC}"
    echo -e "${YELLOW}请编辑 .env.production 并添加：${NC}"
    for var in "${MISSING_VARS[@]}"; do
        echo "  $var=your-value"
    done
    exit 1
fi

# 3. 停止所有PM2进程
echo ""
echo -e "${YELLOW}步骤 3/6: 停止所有PM2进程...${NC}"
pm2 delete all 2>/dev/null || echo -e "${BLUE}ℹ️  没有正在运行的进程${NC}"
echo -e "${GREEN}✅ 已停止所有进程${NC}"

# 4. 重新生成Prisma Client（确保使用正确的DATABASE_URL）
echo ""
echo -e "${YELLOW}步骤 4/6: 重新生成Prisma Client...${NC}"
cd packages/database
DATABASE_URL=$DATABASE_URL npx prisma generate
cd ../..
echo -e "${GREEN}✅ Prisma Client已重新生成${NC}"

# 5. 使用ecosystem.config.js启动服务
echo ""
echo -e "${YELLOW}步骤 5/6: 启动所有服务（使用新的配置）...${NC}"

# 确保ecosystem.config.js使用.env.production
if [ -f "ecosystem.config.js" ]; then
    pm2 start ecosystem.config.js
    echo -e "${GREEN}✅ 所有服务已启动${NC}"
else
    echo -e "${RED}❌ 未找到 ecosystem.config.js${NC}"
    exit 1
fi

# 6. 保存PM2配置
echo ""
echo -e "${YELLOW}步骤 6/6: 保存PM2配置...${NC}"
pm2 save
echo -e "${GREEN}✅ PM2配置已保存${NC}"

# 显示服务状态
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ 修复完成！当前服务状态：${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
pm2 list

echo ""
echo -e "${YELLOW}💡 提示：${NC}"
echo "  - 查看日志: pm2 logs"
echo "  - 查看特定应用: pm2 logs seo-admin"
echo "  - 重启服务: pm2 restart all"
echo "  - 监控服务: pm2 monit"

echo ""
echo -e "${GREEN}🎉 服务已成功重启！${NC}"
