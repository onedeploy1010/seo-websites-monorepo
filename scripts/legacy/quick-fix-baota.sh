#!/bin/bash

# 快速诊断和修复宝塔站点配置

echo "=========================================="
echo "  快速诊断工具"
echo "=========================================="
echo ""

# 1. 检查 PM2 状态
echo "1. 检查 PM2 应用状态..."
pm2 list

echo ""
echo "2. 检查端口监听..."
netstat -tlnp | grep -E '3100|3001|3002|3003'

echo ""
echo "3. 测试本地端口..."
for port in 3100 3001 3002 3003; do
    echo -n "测试端口 $port: "
    if curl -s http://localhost:$port > /dev/null 2>&1; then
        echo "✓ 正常"
    else
        echo "✗ 无响应"
    fi
done

echo ""
echo "4. 检查 Nginx 配置..."
nginx -t

echo ""
echo "5. 查看最近的 Nginx 错误日志..."
echo "Admin 后台错误:"
tail -5 /www/wwwlogs/admin.telegram1688.com.error.log 2>/dev/null || echo "日志文件不存在"

echo ""
echo "6. 查看 PM2 日志（最近10行）..."
echo "Admin 日志:"
pm2 logs seo-admin --lines 10 --nostream

echo ""
echo "=========================================="
echo "  诊断完成"
echo "=========================================="

