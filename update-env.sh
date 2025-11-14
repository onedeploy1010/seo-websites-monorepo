#!/bin/bash
# 更新 .env.local 文件脚本

echo "========================================="
echo "更新 .env.local 文件"
echo "========================================="

# 获取脚本所在目录（项目根目录）
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# 备份旧的 .env.local
if [ -f .env.local ]; then
    echo "备份旧的 .env.local 文件..."
    cp .env.local .env.local.backup.$(date +%Y%m%d_%H%M%S)
fi

# 创建新的 .env.local
echo "创建新的 .env.local 文件..."
cat > .env.local << 'EOF'
DATABASE_URL="postgresql://seo_user:tgseo123@localhost:5432/seo_websites?schema=public"

NEXTAUTH_SECRET="9kL2mN4pQ6rS8tU0vW1xY3zA5bC7dE9fG2hI4jK6lM8nO0pR1sT3uV5wX7yZ9aB1c"
NEXTAUTH_URL="https://admin.telegram1688.com"

SETTINGS_ENCRYPTION_KEY="4eF6gH8iJ0kL2mN4oP6qR8sT0uV2wX4yZ6aB8cD0eF2gH4iJ6kL8mN0oP2qR4sT6u"

TAVILY_API_KEY="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"

NEXT_PUBLIC_SITE_NAME="SEO 管理后台"

NEXT_PUBLIC_WEBSITE1_URL="https://telegram1688.com"
NEXT_PUBLIC_WEBSITE1_NAME="Telegram中文网 1"

NEXT_PUBLIC_WEBSITE2_URL="https://telegram2688.com"
NEXT_PUBLIC_WEBSITE2_NAME="Telegram中文网 2"

NEXT_PUBLIC_WEBSITE_TG_URL="https://telegramcnfw.com"
NEXT_PUBLIC_WEBSITE_TG_NAME="Telegram中文服务"

NODE_ENV="production"
PORT=3100
EOF

echo ""
echo "✅ .env.local 文件已更新"
echo ""
echo "验证关键配置:"
grep -E "NEXTAUTH_SECRET|TAVILY_API_KEY|DATABASE_URL" .env.local
echo ""
echo "========================================="
