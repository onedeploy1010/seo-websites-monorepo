#!/bin/bash
# SEO 网站管理系统 - 服务器管理菜单

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 获取项目根目录
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_ROOT"

# 显示标题
show_header() {
    clear
    echo -e "${CYAN}=========================================${NC}"
    echo -e "${CYAN}   SEO 网站管理系统 - 服务器管理菜单   ${NC}"
    echo -e "${CYAN}=========================================${NC}"
    echo ""
}

# 显示主菜单
show_menu() {
    echo -e "${GREEN}【部署管理】${NC}"
    echo -e "  ${YELLOW}1${NC}) 一键完整部署 (推荐)"
    echo -e "  ${YELLOW}2${NC}) 强制部署 (解决 Git 冲突)"
    echo ""
    echo -e "${GREEN}【服务管理】${NC}"
    echo -e "  ${YELLOW}3${NC}) 查看 PM2 状态"
    echo -e "  ${YELLOW}4${NC}) 重启所有服务"
    echo -e "  ${YELLOW}5${NC}) 查看日志"
    echo -e "  ${YELLOW}6${NC}) 停止所有服务"
    echo ""
    echo -e "${GREEN}【故障排查】${NC}"
    echo -e "  ${YELLOW}7${NC}) 修复 502 错误"
    echo -e "  ${YELLOW}8${NC}) 诊断 502 错误"
    echo -e "  ${YELLOW}9${NC}) 更新环境变量"
    echo ""
    echo -e "${GREEN}【测试工具】${NC}"
    echo -e "  ${YELLOW}10${NC}) 测试本地端口访问"
    echo -e "  ${YELLOW}11${NC}) 测试线上域名访问"
    echo ""
    echo -e "${GREEN}【其他】${NC}"
    echo -e "  ${YELLOW}0${NC}) 退出"
    echo ""
    echo -ne "${PURPLE}请选择操作 [0-11]: ${NC}"
}

# 执行一键部署
deploy_complete() {
    echo -e "${CYAN}=========================================${NC}"
    echo -e "${CYAN}开始一键完整部署...${NC}"
    echo -e "${CYAN}=========================================${NC}"
    bash scripts/deploy/deploy-complete.sh
    read -p "按任意键返回菜单..." -n1
}

# 执行强制部署
deploy_force() {
    echo -e "${CYAN}=========================================${NC}"
    echo -e "${CYAN}开始强制部署...${NC}"
    echo -e "${CYAN}=========================================${NC}"
    echo -e "${YELLOW}警告：这将覆盖所有本地修改！${NC}"
    read -p "确认继续? (y/N): " confirm
    if [[ $confirm == [yY] ]]; then
        bash scripts/deploy/deploy-force.sh
    else
        echo "已取消"
    fi
    read -p "按任意键返回菜单..." -n1
}

# 查看 PM2 状态
pm2_status() {
    echo -e "${CYAN}=========================================${NC}"
    echo -e "${CYAN}PM2 服务状态${NC}"
    echo -e "${CYAN}=========================================${NC}"
    pm2 list
    echo ""
    read -p "按任意键返回菜单..." -n1
}

# 重启所有服务
pm2_restart() {
    echo -e "${CYAN}=========================================${NC}"
    echo -e "${CYAN}重启所有服务...${NC}"
    echo -e "${CYAN}=========================================${NC}"
    pm2 restart all
    echo ""
    echo -e "${GREEN}✅ 所有服务已重启${NC}"
    pm2 list
    read -p "按任意键返回菜单..." -n1
}

# 查看日志
pm2_logs() {
    echo -e "${CYAN}=========================================${NC}"
    echo -e "${CYAN}PM2 日志（最近 30 行）${NC}"
    echo -e "${CYAN}=========================================${NC}"
    pm2 logs --lines 30 --nostream
    echo ""
    read -p "按任意键返回菜单..." -n1
}

# 停止所有服务
pm2_stop() {
    echo -e "${CYAN}=========================================${NC}"
    echo -e "${CYAN}停止所有服务...${NC}"
    echo -e "${CYAN}=========================================${NC}"
    read -p "确认停止所有服务? (y/N): " confirm
    if [[ $confirm == [yY] ]]; then
        pm2 stop all
        echo -e "${GREEN}✅ 所有服务已停止${NC}"
        pm2 list
    else
        echo "已取消"
    fi
    read -p "按任意键返回菜单..." -n1
}

# 修复 502 错误
fix_502() {
    echo -e "${CYAN}=========================================${NC}"
    echo -e "${CYAN}修复 502 错误...${NC}"
    echo -e "${CYAN}=========================================${NC}"
    bash scripts/deploy/fix-502.sh
    read -p "按任意键返回菜单..." -n1
}

# 诊断 502 错误
diagnose_502() {
    echo -e "${CYAN}=========================================${NC}"
    echo -e "${CYAN}诊断 502 错误...${NC}"
    echo -e "${CYAN}=========================================${NC}"
    bash scripts/deploy/diagnose-502.sh
    read -p "按任意键返回菜单..." -n1
}

# 更新环境变量
update_env() {
    echo -e "${CYAN}=========================================${NC}"
    echo -e "${CYAN}更新环境变量...${NC}"
    echo -e "${CYAN}=========================================${NC}"
    bash scripts/deploy/update-env.sh
    echo ""
    echo -e "${GREEN}✅ 环境变量已更新${NC}"
    echo -e "${YELLOW}提示：需要重启服务才能生效${NC}"
    read -p "是否立即重启服务? (y/N): " confirm
    if [[ $confirm == [yY] ]]; then
        pm2 restart all
        echo -e "${GREEN}✅ 服务已重启${NC}"
    fi
    read -p "按任意键返回菜单..." -n1
}

# 测试本地端口
test_local() {
    echo -e "${CYAN}=========================================${NC}"
    echo -e "${CYAN}测试本地端口访问${NC}"
    echo -e "${CYAN}=========================================${NC}"
    
    echo -e "\n${YELLOW}Admin (3100):${NC}"
    curl -I http://localhost:3100 2>&1 | head -3
    
    echo -e "\n${YELLOW}Website-1 (3001):${NC}"
    curl -I http://localhost:3001 2>&1 | head -3
    
    echo -e "\n${YELLOW}Website-2 (3002):${NC}"
    curl -I http://localhost:3002 2>&1 | head -3
    
    echo -e "\n${YELLOW}Website-TG (3003):${NC}"
    curl -I http://localhost:3003 2>&1 | head -3
    
    echo ""
    read -p "按任意键返回菜单..." -n1
}

# 测试线上域名
test_online() {
    echo -e "${CYAN}=========================================${NC}"
    echo -e "${CYAN}测试线上域名访问${NC}"
    echo -e "${CYAN}=========================================${NC}"
    
    echo -e "\n${YELLOW}Admin:${NC}"
    curl -I https://admin.telegram1688.com 2>&1 | head -3
    
    echo -e "\n${YELLOW}Website-1:${NC}"
    curl -I https://telegram1688.com 2>&1 | head -3
    
    echo -e "\n${YELLOW}Website-2:${NC}"
    curl -I https://telegram2688.com 2>&1 | head -3
    
    echo -e "\n${YELLOW}Website-TG:${NC}"
    curl -I https://telegramcnfw.com 2>&1 | head -3
    
    echo ""
    read -p "按任意键返回菜单..." -n1
}

# 主循环
main() {
    while true; do
        show_header
        show_menu
        read choice
        
        case $choice in
            1) deploy_complete ;;
            2) deploy_force ;;
            3) pm2_status ;;
            4) pm2_restart ;;
            5) pm2_logs ;;
            6) pm2_stop ;;
            7) fix_502 ;;
            8) diagnose_502 ;;
            9) update_env ;;
            10) test_local ;;
            11) test_online ;;
            0)
                echo -e "${GREEN}再见！${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}无效选择，请重试${NC}"
                sleep 1
                ;;
        esac
    done
}

# 运行主程序
main
