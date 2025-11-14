#!/bin/bash
# 快速修复脚本 - 一步步检查和修复问题

set +e  # 继续执行即使出错

echo "========================================="
echo "快速诊断和修复"
echo "========================================="

# 获取项目根目录
PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$PROJECT_ROOT"

echo ""
echo "项目根目录: $PROJECT_ROOT"
echo ""

# 步骤 1: 检查 .env.local 文件
echo "【1】检查 .env.local 文件..."
if [ -f .env.local ]; then
    echo "✅ .env.local 文件存在"
    echo "关键配置:"
    grep -E "DATABASE_URL|NEXTAUTH_SECRET|TAVILY_API_KEY" .env.local || echo "❌ 未找到关键配置"
else
    echo "❌ .env.local 文件不存在！正在创建..."
    bash scripts/deploy/update-env.sh
fi

echo ""
echo "【2】检查 dotenv-cli..."
if command -v dotenv &> /dev/null; then
    echo "✅ dotenv-cli 已安装"
    dotenv --version
else
    echo "❌ dotenv-cli 未安装！正在安装..."
    npm install -g dotenv-cli
fi

echo ""
echo "【3】检查 Prisma schema..."
if [ -f packages/database/prisma/schema.prisma ]; then
    echo "✅ Prisma schema 文件存在"
else
    echo "❌ Prisma schema 文件不存在！"
fi

echo ""
echo "【4】检查启动脚本..."
for script in start-admin.sh start-website-1.sh start-website-2.sh start-website-tg.sh; do
    if [ -f "$script" ]; then
        echo "✅ $script 存在"
    else
        echo "❌ $script 不存在！"
    fi
done

echo ""
echo "【5】测试环境变量加载..."
echo "测试 dotenv 加载 .env.local:"
dotenv -e .env.local -- node -e "console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ 已加载' : '❌ 未加载')"
dotenv -e .env.local -- node -e "console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✅ 已加载' : '❌ 未加载')"

echo ""
echo "【6】检查 PM2 状态..."
pm2 list

echo ""
echo "【7】检查端口占用..."
echo "检查端口 3100-3103:"
netstat -tlnp | grep -E ':(3100|3001|3002|3003)' || echo "没有端口被占用"

echo ""
echo "========================================="
echo "诊断完成！"
echo "========================================="
echo ""
echo "建议操作："
echo "1. 如果 .env.local 配置缺失 -> bash scripts/deploy/update-env.sh"
echo "2. 如果 dotenv-cli 未安装 -> npm install -g dotenv-cli"
echo "3. 如果一切正常但服务未启动 -> pm2 delete all && pm2 start ecosystem.config.js"
echo ""
read -p "是否立即执行完整部署? (y/N): " confirm
if [[ $confirm == [yY] ]]; then
    echo ""
    echo "开始完整部署..."
    bash scripts/deploy/deploy-force.sh
fi
