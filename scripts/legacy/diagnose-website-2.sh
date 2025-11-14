#!/bin/bash

echo "=========================================="
echo "🔍 诊断 website-2 构建问题"
echo "=========================================="
echo ""

cd /www/wwwroot/seo-websites-monorepo

echo "步骤 1: 检查 Git 状态"
echo "----------------------------------------"
git log --oneline -3
echo ""

echo "步骤 2: 检查 layout.tsx（应该没有 Inter 字体）"
echo "----------------------------------------"
head -10 apps/website-2/app/layout.tsx
echo ""

echo "步骤 3: 检查 globals.css 文件"
echo "----------------------------------------"
cat apps/website-2/app/globals.css
echo ""

echo "步骤 4: 检查 tailwind.config.ts"
echo "----------------------------------------"
cat apps/website-2/tailwind.config.ts
echo ""

echo "步骤 5: 检查 postcss.config.mjs"
echo "----------------------------------------"
cat apps/website-2/postcss.config.mjs
echo ""

echo "步骤 6: 检查 package.json"
echo "----------------------------------------"
cat apps/website-2/package.json
echo ""

echo "步骤 7: 尝试单独构建 website-2（完整错误输出）"
echo "----------------------------------------"
cd apps/website-2
pnpm run build 2>&1 | tee /tmp/website-2-build-error.log
echo ""

echo "=========================================="
echo "完整错误日志已保存到: /tmp/website-2-build-error.log"
echo "请查看该文件获取详细错误信息"
echo "=========================================="
