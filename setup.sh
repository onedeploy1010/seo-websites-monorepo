#!/bin/bash

# SEO Websites Monorepo - 快速设置脚本

set -e

echo "🚀 开始设置 SEO Websites Monorepo..."
echo ""

# 检查Node.js版本
echo "📋 检查环境..."
node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$node_version" -lt 18 ]; then
  echo "❌ 需要Node.js 18或更高版本"
  exit 1
fi
echo "✅ Node.js版本: $(node -v)"
echo ""

# 1. 安装根依赖
echo "📦 安装根依赖..."
npm install
echo "✅ 根依赖安装完成"
echo ""

# 2. 安装所有工作区依赖
echo "📦 安装工作区依赖..."
npm install --workspaces
echo "✅ 工作区依赖安装完成"
echo ""

# 3. 创建环境变量文件
echo "⚙️  配置环境变量..."

# Database
if [ ! -f "packages/database/.env" ]; then
  cat > packages/database/.env << 'EOF'
# PostgreSQL数据库连接
DATABASE_URL="postgresql://postgres:password@localhost:5432/seo_monorepo"
EOF
  echo "✅ 创建 packages/database/.env"
else
  echo "⚠️  packages/database/.env 已存在，跳过"
fi

# Admin
if [ ! -f "apps/admin/.env.local" ]; then
  cat > apps/admin/.env.local << 'EOF'
# 数据库
DATABASE_URL="postgresql://postgres:password@localhost:5432/seo_monorepo"

# NextAuth配置
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3100"

# 搜索引擎API（可选）
# GOOGLE_API_KEY=""
# GOOGLE_CSE_ID=""
# BAIDU_TOKEN=""
# BING_API_KEY=""
EOF
  echo "✅ 创建 apps/admin/.env.local"
else
  echo "⚠️  apps/admin/.env.local 已存在，跳过"
fi

echo ""

# 4. 初始化数据库
echo "🗄️  初始化数据库..."
cd packages/database
npm run db:generate
echo "✅ Prisma Client 生成完成"
echo ""

echo "⚠️  请确保PostgreSQL正在运行，然后执行以下命令推送数据库架构:"
echo "   cd packages/database"
echo "   npm run db:push"
echo ""

cd ../..

# 5. 创建示例网站配置
echo "🌐 创建示例网站..."

# Website 1
if [ ! -d "apps/website-1" ]; then
  mkdir -p apps/website-1/app
  cat > apps/website-1/package.json << 'EOF'
{
  "name": "website-1",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3001",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.2.33",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@repo/database": "*",
    "@repo/seo-tools": "*"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "tailwindcss": "^3.3.0"
  }
}
EOF

  cat > apps/website-1/.env.local << 'EOF'
DATABASE_URL="postgresql://postgres:password@localhost:5432/seo_monorepo"
NEXT_PUBLIC_SITE_NAME="网站1"
NEXT_PUBLIC_SITE_URL="http://localhost:3001"
EOF
  echo "✅ 创建 apps/website-1"
fi

# Website 2
if [ ! -d "apps/website-2" ]; then
  mkdir -p apps/website-2/app
  cat > apps/website-2/package.json << 'EOF'
{
  "name": "website-2",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3002",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.2.33",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@repo/database": "*",
    "@repo/seo-tools": "*"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "tailwindcss": "^3.3.0"
  }
}
EOF

  cat > apps/website-2/.env.local << 'EOF'
DATABASE_URL="postgresql://postgres:password@localhost:5432/seo_monorepo"
NEXT_PUBLIC_SITE_NAME="网站2"
NEXT_PUBLIC_SITE_URL="http://localhost:3002"
EOF
  echo "✅ 创建 apps/website-2"
fi

echo ""

# 6. 完成提示
echo "✨ 设置完成！"
echo ""
echo "📚 下一步:"
echo "   1. 确保PostgreSQL正在运行"
echo "   2. 更新环境变量文件中的数据库连接"
echo "   3. 推送数据库架构: cd packages/database && npm run db:push"
echo "   4. 启动开发服务器: npm run dev"
echo ""
echo "🌐 应用访问地址:"
echo "   管理后台: http://localhost:3100"
echo "   网站1:   http://localhost:3001"
echo "   网站2:   http://localhost:3002"
echo ""
echo "📖 更多信息请查看:"
echo "   - README.md - 项目概述"
echo "   - ARCHITECTURE.md - 详细架构说明"
echo ""
