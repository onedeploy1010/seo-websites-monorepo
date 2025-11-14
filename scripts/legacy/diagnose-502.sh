#!/bin/bash
# 502 错误诊断脚本

echo "========================================="
echo "诊断 502 Bad Gateway 错误"
echo "========================================="

echo ""
echo "1. 检查 PM2 进程状态:"
pm2 list

echo ""
echo "2. 检查端口监听情况:"
netstat -tlnp | grep -E ':(3100|3001|3002|3003)'

echo ""
echo "3. 检查最近的错误日志 (Admin):"
echo "--- Admin 错误日志 ---"
pm2 logs seo-admin --lines 30 --err

echo ""
echo "4. 测试本地端口连接:"
echo "测试 Admin (3100):"
curl -I http://localhost:3100 2>&1 | head -5

echo ""
echo "测试 Website-1 (3001):"
curl -I http://localhost:3001 2>&1 | head -5

echo ""
echo "5. 检查 Nginx 配置:"
nginx -t

echo ""
echo "6. 检查 .env.local 文件是否存在:"
ls -lh /www/wwwroot/seo-websites-monorepo/.env.local

echo ""
echo "7. 检查 NEXTAUTH_SECRET 是否配置:"
grep NEXTAUTH_SECRET /www/wwwroot/seo-websites-monorepo/.env.local

echo ""
echo "========================================="
echo "诊断完成"
echo "========================================="
