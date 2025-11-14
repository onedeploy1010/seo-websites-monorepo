#!/bin/bash

# ==========================================
# 🚀 服务器部署脚本
# ==========================================
# 用于将代码同步到服务器并启动服务
#
# 使用方法:
#   chmod +x scripts/deploy.sh
#   ./scripts/deploy.sh
#

set -e  # 遇到错误立即退出

echo "🚀 开始部署..."

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查是否在项目根目录
if [ ! -f "package.json" ]; then
    echo -e "${RED}错误: 请在项目根目录运行此脚本${NC}"
    exit 1
fi

# 1. 拉取最新代码
echo -e "${YELLOW}📥 步骤 1/7: 拉取最新代码...${NC}"
git pull origin master || {
    echo -e "${RED}Git pull 失败，请检查网络连接${NC}"
    exit 1
}
echo -e "${GREEN}✓ 代码已更新${NC}\n"

# 2. 检查环境变量文件
echo -e "${YELLOW}🔍 步骤 2/7: 检查环境变量...${NC}"
if [ ! -f ".env.production" ]; then
    echo -e "${RED}错误: .env.production 文件不存在${NC}"
    echo -e "${YELLOW}请先创建 .env.production 文件:${NC}"
    echo "  cp .env.production.example .env.production"
    echo "  然后编辑 .env.production 填入实际配置"
    exit 1
fi
echo -e "${GREEN}✓ 环境变量文件存在${NC}\n"

# 3. 安装依赖
echo -e "${YELLOW}📦 步骤 3/7: 安装依赖...${NC}"
pnpm install || {
    echo -e "${RED}依赖安装失败${NC}"
    exit 1
}
echo -e "${GREEN}✓ 依赖已安装${NC}\n"

# 4. 生成 Prisma Client
echo -e "${YELLOW}🔧 步骤 4/7: 生成 Prisma Client...${NC}"
cd packages/database
npx prisma generate
cd ../..
echo -e "${GREEN}✓ Prisma Client 已生成${NC}\n"

# 5. 构建项目
echo -e "${YELLOW}🏗️  步骤 5/7: 构建项目...${NC}"
pnpm build || {
    echo -e "${RED}构建失败${NC}"
    exit 1
}
echo -e "${GREEN}✓ 项目已构建${NC}\n"

# 6. 停止旧服务
echo -e "${YELLOW}⏹️  步骤 6/7: 停止旧服务...${NC}"
pm2 stop all || echo "没有运行中的 PM2 进程"
echo -e "${GREEN}✓ 旧服务已停止${NC}\n"

# 7. 启动新服务
echo -e "${YELLOW}▶️  步骤 7/7: 启动服务...${NC}"
pm2 start ecosystem.config.js
pm2 save
echo -e "${GREEN}✓ 服务已启动${NC}\n"

# 显示服务状态
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✨ 部署完成！${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

pm2 list

echo -e "\n${YELLOW}💡 提示:${NC}"
echo "  查看日志: pm2 logs"
echo "  重启服务: pm2 restart all"
echo "  停止服务: pm2 stop all"
echo "  查看详情: pm2 show <app-name>"

echo -e "\n${YELLOW}🔗 访问地址:${NC}"
echo "  管理后台: https://admin.telegram1688.com"
echo "  网站 1:   https://telegram1688.com"
echo "  网站 2:   https://telegramjiaoyu.com"
echo "  网站 3:   https://telegramzhfw.com"
