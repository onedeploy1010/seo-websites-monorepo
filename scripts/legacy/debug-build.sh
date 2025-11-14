#!/bin/bash

echo "=========================================="
echo "🔍 完整构建错误诊断"
echo "=========================================="
echo ""

cd /www/wwwroot/seo-websites-monorepo

echo "步骤 1: 检查当前版本"
echo "----------------------------------------"
git log --oneline -1
echo ""

echo "步骤 2: 检查是否有本地修改"
echo "----------------------------------------"
git status --short
echo ""

echo "步骤 3: 检查 website-2 的 package.json"
echo "----------------------------------------"
cat apps/website-2/package.json
echo ""

echo "步骤 4: 检查是否安装了 autoprefixer"
echo "----------------------------------------"
ls -la apps/website-2/node_modules/ | grep autoprefixer || echo "未找到 autoprefixer"
echo ""

echo "步骤 5: 单独构建 website-2（获取完整错误）"
echo "----------------------------------------"
cd apps/website-2
pnpm run build
