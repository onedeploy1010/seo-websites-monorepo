#!/bin/bash

set -e

echo "=========================================="
echo "🔧 服务器构建问题修复脚本"
echo "=========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}步骤 1: 强制拉取最新代码${NC}"
echo "----------------------------------------"
git fetch origin
git reset --hard origin/master
echo -e "${GREEN}✅ 代码已更新到最新版本${NC}"
echo ""

echo -e "${YELLOW}步骤 2: 显示最近的提交${NC}"
echo "----------------------------------------"
git log --oneline -3
echo ""

echo -e "${YELLOW}步骤 3: 清理所有构建缓存${NC}"
echo "----------------------------------------"
# 清理 Next.js 缓存
rm -rf apps/website-1/.next
rm -rf apps/website-2/.next
rm -rf apps/website-tg/.next
rm -rf apps/admin/.next

# 清理 Turborepo 缓存
rm -rf .turbo

# 清理 node_modules
echo "清理 node_modules..."
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules

echo -e "${GREEN}✅ 缓存已清理${NC}"
echo ""

echo -e "${YELLOW}步骤 4: 重新安装依赖${NC}"
echo "----------------------------------------"
npx pnpm install --force
echo -e "${GREEN}✅ 依赖已重新安装${NC}"
echo ""

echo -e "${YELLOW}步骤 5: 检查 website-2 的 layout.tsx（应该没有 Inter 字体）${NC}"
echo "----------------------------------------"
head -10 apps/website-2/app/layout.tsx
echo ""

echo -e "${YELLOW}步骤 6: 单独测试 website-2 构建${NC}"
echo "----------------------------------------"
cd apps/website-2
npm run build
cd ../..
echo -e "${GREEN}✅ website-2 构建成功${NC}"
echo ""

echo -e "${YELLOW}步骤 7: 单独测试 website-1 构建${NC}"
echo "----------------------------------------"
cd apps/website-1
npm run build
cd ../..
echo -e "${GREEN}✅ website-1 构建成功${NC}"
echo ""

echo "=========================================="
echo -e "${GREEN}✅ 修复完成！现在可以运行 ./deploy.sh 了${NC}"
echo "=========================================="
