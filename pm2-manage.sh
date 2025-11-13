#!/bin/bash

# PM2 管理脚本
# 用于管理 SEO Websites Monorepo 的所有应用

PROJECT_ROOT="/www/wwwroot/seo-websites-monorepo"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查 PM2 是否安装
check_pm2() {
    if ! command -v pm2 &> /dev/null; then
        print_error "PM2 未安装，正在安装..."
        npm install -g pm2
    else
        print_info "PM2 已安装: $(pm2 -v)"
    fi
}

# 启动所有应用
start_all() {
    print_info "启动所有应用..."
    cd "$PROJECT_ROOT" || exit 1
    pm2 start ecosystem.config.js
    pm2 save
    print_info "所有应用已启动"
}

# 停止所有应用
stop_all() {
    print_info "停止所有应用..."
    pm2 stop all
    print_info "所有应用已停止"
}

# 重启所有应用
restart_all() {
    print_info "重启所有应用..."
    pm2 restart all
    print_info "所有应用已重启"
}

# 重载所有应用（零停机）
reload_all() {
    print_info "重载所有应用（零停机）..."
    pm2 reload all
    print_info "所有应用已重载"
}

# 删除所有应用
delete_all() {
    print_warn "删除所有应用..."
    pm2 delete all
    print_info "所有应用已删除"
}

# 查看状态
status() {
    print_info "应用状态:"
    pm2 list
}

# 查看日志
logs() {
    if [ -z "$1" ]; then
        pm2 logs
    else
        pm2 logs "$1"
    fi
}

# 实时监控
monitor() {
    pm2 monit
}

# 启动单个应用
start_app() {
    if [ -z "$1" ]; then
        print_error "请指定应用名称: admin, website-1, website-2, website-tg"
        exit 1
    fi
    
    case "$1" in
        admin)
            pm2 start ecosystem.config.js --only seo-admin
            ;;
        website-1)
            pm2 start ecosystem.config.js --only seo-website-1
            ;;
        website-2)
            pm2 start ecosystem.config.js --only seo-website-2
            ;;
        website-tg)
            pm2 start ecosystem.config.js --only seo-website-tg
            ;;
        *)
            print_error "未知的应用: $1"
            exit 1
            ;;
    esac
    
    print_info "应用 $1 已启动"
}

# 重启单个应用
restart_app() {
    if [ -z "$1" ]; then
        print_error "请指定应用名称: admin, website-1, website-2, website-tg"
        exit 1
    fi
    
    case "$1" in
        admin)
            pm2 restart seo-admin
            ;;
        website-1)
            pm2 restart seo-website-1
            ;;
        website-2)
            pm2 restart seo-website-2
            ;;
        website-tg)
            pm2 restart seo-website-tg
            ;;
        *)
            print_error "未知的应用: $1"
            exit 1
            ;;
    esac
    
    print_info "应用 $1 已重启"
}

# 显示帮助信息
show_help() {
    cat << EOF
PM2 管理脚本 - SEO Websites Monorepo

用法: $0 [命令] [选项]

命令:
    start              启动所有应用
    stop               停止所有应用
    restart            重启所有应用
    reload             重载所有应用（零停机）
    delete             删除所有应用
    status             查看应用状态
    logs [app]         查看日志（可选指定应用名）
    monitor            实时监控
    start-app <name>   启动单个应用
    restart-app <name> 重启单个应用

应用名称:
    admin, website-1, website-2, website-tg

示例:
    $0 start                    # 启动所有应用
    $0 restart-app admin        # 重启 admin 应用
    $0 logs seo-website-tg      # 查看 website-tg 日志
    $0 status                   # 查看所有应用状态

EOF
}

# 主逻辑
check_pm2

case "$1" in
    start)
        start_all
        ;;
    stop)
        stop_all
        ;;
    restart)
        restart_all
        ;;
    reload)
        reload_all
        ;;
    delete)
        delete_all
        ;;
    status)
        status
        ;;
    logs)
        logs "$2"
        ;;
    monitor)
        monitor
        ;;
    start-app)
        start_app "$2"
        ;;
    restart-app)
        restart_app "$2"
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "未知命令: $1"
        show_help
        exit 1
        ;;
esac

