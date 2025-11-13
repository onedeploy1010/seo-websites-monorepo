#!/bin/bash

##############################################################################
# 域名配置一键部署脚本
#
# 功能：
# - 自动添加所有 15 个域名到数据库
# - 配置域名别名、SEO 信息和标签
# - 按网站自动分配域名
#
# 使用方法：
# chmod +x scripts/deploy-domains.sh
# ./scripts/deploy-domains.sh
##############################################################################

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# 项目目录
PROJECT_DIR="/www/wwwroot/seo-websites-monorepo"

# 如果当前在项目目录中，使用当前目录
if [ -f "package.json" ] && grep -q "seo-websites-monorepo" package.json; then
    PROJECT_DIR=$(pwd)
fi

echo "==========================================="
echo -e "${CYAN}🌐 域名配置一键部署脚本${NC}"
echo "==========================================="
echo ""

# 检查是否在正确的目录
if [ ! -f "$PROJECT_DIR/package.json" ]; then
    echo -e "${RED}❌ 错误：找不到项目目录${NC}"
    echo "请确保在项目根目录运行此脚本，或修改 PROJECT_DIR 变量"
    exit 1
fi

cd "$PROJECT_DIR"
echo -e "${GREEN}✅ 项目目录: $PROJECT_DIR${NC}"
echo ""

# 检查 .env.local 文件
if [ ! -f ".env.local" ]; then
    echo -e "${RED}❌ 错误：.env.local 文件不存在${NC}"
    echo "请先创建 .env.local 文件并配置数据库连接"
    exit 1
fi
echo -e "${GREEN}✅ 环境变量配置已找到${NC}"
echo ""

# 检查数据库连接
echo -e "${YELLOW}正在检查数据库连接...${NC}"
if ! grep -q "DATABASE_URL" .env.local; then
    echo -e "${RED}❌ 错误：.env.local 中未找到 DATABASE_URL${NC}"
    exit 1
fi
echo -e "${GREEN}✅ 数据库配置正确${NC}"
echo ""

# 显示将要部署的域名列表
echo -e "${CYAN}📋 将部署以下 15 个域名：${NC}"
echo ""
echo -e "${BLUE}Website 1 (5个域名):${NC}"
echo "   1. telegram1688.com ⭐ (主域名)"
echo "   2. telegram2688.com"
echo "   3. telegramcny28.com"
echo "   4. telegramrmb28.com"
echo "   5. telegramxzb.com"
echo ""
echo -e "${BLUE}Website 2 (5个域名):${NC}"
echo "   6. telegramcnfw.com ⭐ (主域名)"
echo "   7. telegramfuwu.com"
echo "   8. telegramfwfw.com"
echo "   9. telegramxzfw.com"
echo "   10. telegramzhfw.com"
echo ""
echo -e "${BLUE}Website TG (5个域名):${NC}"
echo "   11. telegramgzzh.com ⭐ (主域名)"
echo "   12. telegramhnzh.com"
echo "   13. telegramjiaoyu.com"
echo "   14. xztelegram.com"
echo "   15. zhxztelegram.com"
echo ""

# 确认
read -p "$(echo -e ${YELLOW}是否继续部署？\(y/n\): ${NC})" confirm
if [ "$confirm" != "y" ]; then
    echo -e "${BLUE}ℹ️  已取消部署${NC}"
    exit 0
fi
echo ""

# 运行域名配置脚本
echo -e "${YELLOW}🚀 开始部署域名配置...${NC}"
echo ""

cd packages/database
npx dotenv -e ../../.env.local -- npm run db:seed-domains

echo ""
echo "==========================================="
echo -e "${GREEN}✅ 域名配置部署完成！${NC}"
echo "==========================================="
echo ""
echo -e "${CYAN}📊 部署结果：${NC}"
echo "   ✅ 所有 15 个域名已添加到数据库"
echo "   ✅ SEO 配置已完成"
echo "   ✅ 标签系统已配置"
echo ""
echo -e "${CYAN}💡 下一步操作：${NC}"
echo ""
echo "1️⃣  配置 Nginx 反向代理"
echo "   - 进入宝塔面板"
echo "   - 为每个域名添加网站配置"
echo "   - 配置反向代理到相应端口"
echo ""
echo "2️⃣  申请 SSL 证书"
echo "   - 在宝塔面板中为每个域名申请 Let's Encrypt 证书"
echo "   - 或使用通配符证书"
echo ""
echo "3️⃣  配置 DNS 解析"
echo "   - 在域名注册商添加 A 记录"
echo "   - 将所有域名指向服务器 IP"
echo ""
echo "4️⃣  测试访问"
echo "   - 访问每个域名确保正常工作"
echo "   - 检查 HTTPS 是否生效"
echo ""
echo -e "${CYAN}📖 详细文档：${NC}"
echo "   - 域名配置指南.md"
echo "   - 服务器部署指南.md"
echo ""
echo -e "${CYAN}🔍 查看域名配置：${NC}"
echo "   1. 登录管理后台: https://admin.telegram1688.com"
echo "   2. 进入\"网站管理\" → \"域名别名\""
echo "   3. 查看所有已配置的域名"
echo ""
echo -e "${CYAN}🎯 管理后台域名：${NC}"
echo "   admin.telegram1688.com"
echo ""
echo -e "${CYAN}🔑 默认登录账号：${NC}"
echo "   邮箱: admin@example.com"
echo "   密码: admin123"
echo "   ${RED}⚠️  首次登录后请立即修改密码！${NC}"
echo ""
