#!/bin/bash

##############################################################################
# SEO 网站管理系统 - 自动化部署脚本
#
# 功能：
# - 拉取最新代码
# - 安装依赖
# - 运行数据库迁移
# - 构建应用
# - 重启 PM2 服务
#
# 使用方法：
# chmod +x deploy.sh
# ./deploy.sh
#
# 注意：
# - 首次部署请参考：服务器部署指南.md
# - 确保已配置 .env.local 文件
# - 确保已初始化数据库
##############################################################################

set -e  # 遇到错误立即退出

echo "=========================================="
echo "🚀 开始部署 SEO 网站管理系统"
echo "=========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ 错误：请在项目根目录运行此脚本${NC}"
    exit 1
fi

# 步骤 1: 拉取最新代码
echo -e "${YELLOW}📥 步骤 1/5: 拉取最新代码${NC}"
git pull origin master
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 代码拉取成功${NC}"
else
    echo -e "${RED}❌ 代码拉取失败${NC}"
    exit 1
fi
echo ""

# 步骤 2: 安装依赖
echo -e "${YELLOW}📦 步骤 2/5: 安装依赖${NC}"
pnpm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 依赖安装成功${NC}"
else
    echo -e "${RED}❌ 依赖安装失败${NC}"
    exit 1
fi
echo ""

# 步骤 3: 数据库迁移
echo -e "${YELLOW}🗄️  步骤 3/5: 运行数据库迁移${NC}"
pnpm db:migrate:deploy
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 数据库迁移成功${NC}"
else
    echo -e "${RED}❌ 数据库迁移失败${NC}"
    exit 1
fi
echo ""

# 步骤 4: 构建应用
echo -e "${YELLOW}🏗️  步骤 4/5: 构建应用${NC}"
pnpm build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 应用构建成功${NC}"
else
    echo -e "${RED}❌ 应用构建失败${NC}"
    exit 1
fi
echo ""

# 步骤 5: 重启 PM2 服务
echo -e "${YELLOW}🔄 步骤 5/5: 重启 PM2 服务${NC}"
pm2 restart all
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ PM2 服务重启成功${NC}"
else
    echo -e "${RED}❌ PM2 服务重启失败${NC}"
    exit 1
fi
echo ""

# 显示 PM2 状态
echo -e "${YELLOW}📊 PM2 进程状态：${NC}"
pm2 list
echo ""

echo "=========================================="
echo -e "${GREEN}✅ 部署完成！${NC}"
echo "=========================================="
echo ""
echo "💡 提示："
echo "  - 查看日志: pm2 logs seo-admin"
echo "  - 实时监控: pm2 monit"
echo "  - 查看状态: pm2 list"
echo ""
