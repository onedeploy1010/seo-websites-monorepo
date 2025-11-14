#!/bin/bash

# 修复 NextAuth SECRET 配置问题

echo "=========================================="
echo "  修复 NextAuth SECRET 配置"
echo "=========================================="
echo ""

# 生成随机 SECRET
NEXTAUTH_SECRET=$(openssl rand -base64 32)

echo "已生成 NEXTAUTH_SECRET: $NEXTAUTH_SECRET"
echo ""

# Admin .env.local 路径
ADMIN_ENV="/www/wwwroot/seo-websites-monorepo/apps/admin/.env.local"

# 检查文件是否存在
if [ ! -f "$ADMIN_ENV" ]; then
    echo "创建 .env.local 文件..."
    touch "$ADMIN_ENV"
fi

# 检查是否已有 NEXTAUTH_SECRET
if grep -q "NEXTAUTH_SECRET" "$ADMIN_ENV"; then
    echo "更新现有的 NEXTAUTH_SECRET..."
    sed -i "s|NEXTAUTH_SECRET=.*|NEXTAUTH_SECRET=\"$NEXTAUTH_SECRET\"|" "$ADMIN_ENV"
else
    echo "添加 NEXTAUTH_SECRET..."
    echo "" >> "$ADMIN_ENV"
    echo "# NextAuth Configuration" >> "$ADMIN_ENV"
    echo "NEXTAUTH_SECRET=\"$NEXTAUTH_SECRET\"" >> "$ADMIN_ENV"
fi

# 检查是否已有 NEXTAUTH_URL
if ! grep -q "NEXTAUTH_URL" "$ADMIN_ENV"; then
    echo "添加 NEXTAUTH_URL..."
    echo "NEXTAUTH_URL=\"https://admin.telegram1688.com\"" >> "$ADMIN_ENV"
fi

echo ""
echo "✓ 配置已更新"
echo ""
echo "当前 .env.local 内容:"
cat "$ADMIN_ENV"
echo ""

# 重启 PM2 应用
echo "重启 admin 应用..."
pm2 restart seo-admin

echo ""
echo "=========================================="
echo "  修复完成！"
echo "=========================================="
echo ""
echo "现在可以访问: https://admin.telegram1688.com"

