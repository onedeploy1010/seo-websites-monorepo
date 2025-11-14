#!/bin/bash

echo "=========================================="
echo "  检查环境配置状态"
echo "=========================================="
echo ""

# 检查项目根目录的 .env
if [ -f ".env" ]; then
    echo "✓ 找到 .env 文件"
    echo "内容："
    cat .env
else
    echo "✗ 未找到 .env 文件"
fi

echo ""
echo "----------------------------------------"

# 检查 apps/admin/.env.local
if [ -f "apps/admin/.env.local" ]; then
    echo "✓ 找到 apps/admin/.env.local 文件"
    echo "内容："
    cat apps/admin/.env.local
else
    echo "✗ 未找到 apps/admin/.env.local 文件"
fi

echo ""
echo "----------------------------------------"

# 检查其他可能的 .env 文件
echo ""
echo "所有 .env 文件位置："
find . -name ".env*" -type f 2>/dev/null | grep -v node_modules

echo ""
echo "=========================================="

