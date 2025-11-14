#!/bin/bash
# 502 错误快速修复脚本

echo "========================================="
echo "开始修复 502 Bad Gateway 错误"
echo "========================================="

# 获取脚本所在目录（项目根目录）
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo ""
echo "1. 确保 dotenv-cli 已安装..."
npm list -g dotenv-cli || npm install -g dotenv-cli

echo ""
echo "2. 检查启动脚本权限..."
chmod +x start-*.sh
ls -lh start-*.sh

echo ""
echo "3. 停止所有现有进程..."
pm2 delete all 2>/dev/null || true

echo ""
echo "4. 清理 PM2 日志..."
pm2 flush

echo ""
echo "5. 启动所有应用..."
pm2 start ecosystem.config.js

echo ""
echo "6. 等待 5 秒让应用启动..."
sleep 5

echo ""
echo "7. 查看进程状态:"
pm2 list

echo ""
echo "8. 检查端口监听:"
netstat -tlnp | grep -E ':(3100|3001|3002|3003)'

echo ""
echo "9. 测试本地访问:"
echo "Admin (3100):"
curl -I http://localhost:3100 2>&1 | head -3

echo ""
echo "Website-1 (3001):"
curl -I http://localhost:3001 2>&1 | head -3

echo ""
echo "10. 查看最近的日志:"
pm2 logs --lines 20

echo ""
echo "========================================="
echo "修复完成！"
echo "========================================="
echo ""
echo "如果还有问题，请运行: bash diagnose-502.sh"
echo "或查看详细日志: pm2 logs seo-admin"
