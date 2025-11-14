#!/bin/bash

echo "=========================================="
echo "🔄 重启所有服务"
echo "=========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 步骤 1: 重启 PM2 应用
echo -e "${YELLOW}步骤 1: 重启 PM2 应用${NC}"
echo "----------------------------------------"
pm2 restart all
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ PM2 应用重启成功${NC}"
else
    echo -e "${RED}❌ PM2 重启失败${NC}"
fi
echo ""

# 步骤 2: 显示 PM2 状态
echo -e "${YELLOW}步骤 2: PM2 进程状态${NC}"
echo "----------------------------------------"
pm2 list
echo ""

# 步骤 3: 重启 Nginx
echo -e "${YELLOW}步骤 3: 重启 Nginx 反向代理${NC}"
echo "----------------------------------------"

# 首先测试 Nginx 配置
nginx -t
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Nginx 配置正确${NC}"

    # 重新加载 Nginx（平滑重启，不会断开现有连接）
    nginx -s reload
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Nginx 重新加载成功${NC}"
    else
        echo -e "${YELLOW}⚠️  Nginx reload 失败，尝试完全重启...${NC}"
        systemctl restart nginx
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Nginx 重启成功${NC}"
        else
            echo -e "${RED}❌ Nginx 重启失败${NC}"
        fi
    fi
else
    echo -e "${RED}❌ Nginx 配置有错误，请检查配置文件${NC}"
    nginx -t
fi
echo ""

# 步骤 4: 检查 Nginx 状态
echo -e "${YELLOW}步骤 4: Nginx 服务状态${NC}"
echo "----------------------------------------"
systemctl status nginx --no-pager -l
echo ""

# 步骤 5: 显示应用端口监听状态
echo -e "${YELLOW}步骤 5: 应用端口监听状态${NC}"
echo "----------------------------------------"
echo "检查端口 3100 (admin):"
lsof -i :3100 || netstat -tuln | grep 3100 || echo "端口 3100 未监听"
echo ""
echo "检查端口 3001 (website-1):"
lsof -i :3001 || netstat -tuln | grep 3001 || echo "端口 3001 未监听"
echo ""
echo "检查端口 3002 (website-2):"
lsof -i :3002 || netstat -tuln | grep 3002 || echo "端口 3002 未监听"
echo ""
echo "检查端口 3003 (website-tg):"
lsof -i :3003 || netstat -tuln | grep 3003 || echo "端口 3003 未监听"
echo ""

echo "=========================================="
echo -e "${GREEN}✅ 服务重启完成！${NC}"
echo "=========================================="
echo ""
echo "💡 提示："
echo "  - 查看 PM2 日志: pm2 logs"
echo "  - 查看特定应用: pm2 logs seo-admin"
echo "  - 查看 Nginx 日志: tail -f /var/log/nginx/error.log"
echo "  - 实时监控: pm2 monit"
echo ""
