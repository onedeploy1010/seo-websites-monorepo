#!/bin/bash
# 502 错误诊断脚本

echo "========================================="
echo "诊断 502 Bad Gateway 错误"
echo "========================================="

# 获取脚本所在目录（项目根目录）
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_ROOT"

echo ""
echo "1. 检查 PM2 进程状态:"
pm2 list

echo ""
echo "2. 检查端口监听情况:"
netstat -tlnp | grep -E ':(3100|3001|3002|3003)'

echo ""
echo "3. 检查最近的错误日志 (Admin):"
echo "--- Admin 错误日志 ---"
pm2 logs seo-admin --lines 30 --err 2>&1 || tail -30 /www/wwwlogs/seo-admin-error.log 2>&1

echo ""
echo "4. 测试本地端口连接:"
echo "测试 Admin (3100):"
curl -I http://localhost:3100 2>&1 | head -5

echo ""
echo "测试 Website-1 (3001):"
curl -I http://localhost:3001 2>&1 | head -5

echo ""
echo "5. 检查 Nginx 配置:"
nginx -t 2>&1 || echo "Nginx 未安装或配置有误"

echo ""
echo "6. 检查 .env.local 文件是否存在:"
ls -lh .env.local

echo ""
echo "7. 检查关键环境变量:"
grep -E "DATABASE_URL|NEXTAUTH_SECRET|TAVILY_API_KEY" .env.local 2>&1 || echo ".env.local 文件不存在或无法读取"

echo ""
echo "8. 检查启动脚本:"
ls -lh start-*.sh

echo ""
echo "========================================="
echo "诊断完成"
echo "========================================="
