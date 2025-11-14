#!/bin/bash

# ==========================================
# 🚀 SEO 网站管理系统 - 交互式菜单
# ==========================================
#
# 使用方法：
#   chmod +x menu.sh
#   ./menu.sh
#

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# 清屏
clear

# 显示 Banner
echo -e "${CYAN}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║      🚀 SEO 网站管理系统 - 自动化部署菜单                   ║
║                                                           ║
║      Telegram 多站点 SEO 管理平台                          ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# 主菜单函数
show_main_menu() {
    echo -e "${WHITE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}主菜单${NC}"
    echo -e "${WHITE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${GREEN}📦 部署管理${NC}"
    echo -e "  ${CYAN}1.${NC} 🚀 一键部署（拉取代码 + 构建 + 重启）"
    echo -e "  ${CYAN}2.${NC} 🔄 更新代码（仅 git pull）"
    echo -e "  ${CYAN}3.${NC} 📦 安装依赖（pnpm install）"
    echo -e "  ${CYAN}4.${NC} 🏗️  构建项目（pnpm build）"
    echo ""
    echo -e "${GREEN}🔧 服务管理${NC}"
    echo -e "  ${CYAN}5.${NC} ▶️  启动所有服务"
    echo -e "  ${CYAN}6.${NC} ⏹️  停止所有服务"
    echo -e "  ${CYAN}7.${NC} 🔄 重启所有服务"
    echo -e "  ${CYAN}8.${NC} 📊 查看服务状态"
    echo -e "  ${CYAN}9.${NC} 📝 查看服务日志"
    echo ""
    echo -e "${GREEN}🗄️  数据库管理${NC}"
    echo -e "  ${CYAN}10.${NC} 🔧 更新数据库（Prisma migrate）"
    echo -e "  ${CYAN}11.${NC} 🌱 填充初始数据（seed）"
    echo -e "  ${CYAN}12.${NC} 🌐 更新生产域名"
    echo -e "  ${CYAN}13.${NC} 🎨 打开 Prisma Studio"
    echo ""
    echo -e "${GREEN}🔍 SEO 工具${NC}"
    echo -e "  ${CYAN}14.${NC} 📈 更新 SEO 关键词数据（Tavily API）"
    echo -e "  ${CYAN}15.${NC} 🎯 检查关键词排名"
    echo -e "  ${CYAN}16.${NC} 📊 查看 SEO API 状态"
    echo ""
    echo -e "${GREEN}⚙️  配置管理${NC}"
    echo -e "  ${CYAN}17.${NC} 📝 编辑环境变量（.env.production）"
    echo -e "  ${CYAN}18.${NC} 🔍 检查环境变量状态"
    echo -e "  ${CYAN}19.${NC} 🔑 生成新密钥"
    echo ""
    echo -e "${GREEN}🛠️  维护工具${NC}"
    echo -e "  ${CYAN}20.${NC} 🧹 清理缓存"
    echo -e "  ${CYAN}21.${NC} 💾 备份数据库"
    echo -e "  ${CYAN}22.${NC} 📦 备份代码"
    echo ""
    echo -e "  ${CYAN}0.${NC} ❌ 退出"
    echo ""
    echo -e "${WHITE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -ne "${YELLOW}请选择操作 [0-22]: ${NC}"
}

# 等待用户按键
wait_for_key() {
    echo ""
    echo -ne "${YELLOW}按任意键继续...${NC}"
    read -n 1 -s
    echo ""
}

# 执行命令并显示结果
run_command() {
    local cmd="$1"
    local desc="$2"

    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}📌 ${desc}${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""

    if eval "$cmd"; then
        echo ""
        echo -e "${GREEN}✅ 操作成功完成！${NC}"
    else
        echo ""
        echo -e "${RED}❌ 操作失败，请检查错误信息${NC}"
    fi

    wait_for_key
}

# 主循环
while true; do
    clear
    show_main_menu
    read choice

    case $choice in
        1)
            run_command "./scripts/deploy.sh" "一键部署"
            ;;
        2)
            run_command "git pull origin master" "更新代码"
            ;;
        3)
            run_command "pnpm install" "安装依赖"
            ;;
        4)
            run_command "pnpm build" "构建项目"
            ;;
        5)
            run_command "pm2 start ecosystem.config.js" "启动所有服务"
            ;;
        6)
            run_command "pm2 stop all" "停止所有服务"
            ;;
        7)
            run_command "pm2 restart all" "重启所有服务"
            ;;
        8)
            clear
            echo -e "${CYAN}📊 服务状态：${NC}"
            echo ""
            pm2 list
            echo ""
            pm2 monit --no-interaction
            wait_for_key
            ;;
        9)
            clear
            echo -e "${CYAN}📝 服务日志：${NC}"
            echo ""
            echo -e "${YELLOW}按 Ctrl+C 退出日志查看${NC}"
            echo ""
            sleep 2
            pm2 logs
            ;;
        10)
            run_command "cd packages/database && npx prisma migrate deploy && cd ../.." "更新数据库"
            ;;
        11)
            run_command "cd packages/database && npx tsx prisma/seed.ts && cd ../.." "填充初始数据"
            ;;
        12)
            run_command "npx tsx scripts/update-production-domains.ts" "更新生产域名"
            ;;
        13)
            clear
            echo -e "${CYAN}🎨 启动 Prisma Studio...${NC}"
            echo -e "${YELLOW}浏览器访问: ${WHITE}http://localhost:5555${NC}"
            echo -e "${YELLOW}按 Ctrl+C 停止 Prisma Studio${NC}"
            echo ""
            cd packages/database && npx prisma studio --port 5555
            cd ../..
            wait_for_key
            ;;
        14)
            clear
            echo -e "${CYAN}选择更新类型：${NC}"
            echo -e "  ${YELLOW}1.${NC} 更新关键词数据 + 检查排名"
            echo -e "  ${YELLOW}2.${NC} 只更新关键词数据"
            echo -e "  ${YELLOW}3.${NC} 只检查排名"
            echo -ne "${YELLOW}请选择 [1-3]: ${NC}"
            read seo_choice

            case $seo_choice in
                1)
                    run_command "npx tsx scripts/update-keyword-data.ts" "更新关键词数据 + 检查排名"
                    ;;
                2)
                    run_command "npx tsx scripts/update-keyword-data.ts --keywords-only" "更新关键词数据"
                    ;;
                3)
                    run_command "npx tsx scripts/update-keyword-data.ts --rankings-only" "检查关键词排名"
                    ;;
            esac
            ;;
        15)
            clear
            echo -e "${CYAN}输入要检查的关键词数量（默认 10）：${NC}"
            read -p "> " limit
            limit=${limit:-10}
            run_command "npx tsx scripts/update-keyword-data.ts --rankings-only --limit=$limit" "检查前 $limit 个关键词排名"
            ;;
        16)
            clear
            echo -e "${CYAN}📊 SEO API 配置状态：${NC}"
            echo ""

            if [ -f ".env.seo" ]; then
                echo -e "${GREEN}✅ .env.seo 文件存在${NC}"
                echo ""
                echo "配置的 API："
                [ ! -z "$TAVILY_API_KEY" ] && echo -e "  ${GREEN}✓${NC} Tavily API" || echo -e "  ${RED}✗${NC} Tavily API"
                [ ! -z "$DATAFORSEO_LOGIN" ] && echo -e "  ${GREEN}✓${NC} DataForSEO" || echo -e "  ${YELLOW}○${NC} DataForSEO (可选)"
                [ ! -z "$SERPAPI_KEY" ] && echo -e "  ${GREEN}✓${NC} SerpApi" || echo -e "  ${YELLOW}○${NC} SerpApi (可选)"
            else
                echo -e "${YELLOW}⚠️  .env.seo 文件不存在${NC}"
                echo "  运行: cp .env.seo.example .env.seo"
            fi

            wait_for_key
            ;;
        17)
            nano .env.production
            ;;
        18)
            clear
            echo -e "${CYAN}🔍 环境变量检查：${NC}"
            echo ""

            if [ -f ".env.production" ]; then
                echo -e "${GREEN}✅ .env.production 存在${NC}"
                echo ""
                echo "关键配置："
                grep -q "DATABASE_URL" .env.production && echo -e "  ${GREEN}✓${NC} DATABASE_URL" || echo -e "  ${RED}✗${NC} DATABASE_URL"
                grep -q "NEXTAUTH_SECRET" .env.production && echo -e "  ${GREEN}✓${NC} NEXTAUTH_SECRET" || echo -e "  ${RED}✗${NC} NEXTAUTH_SECRET"
                grep -q "NEXTAUTH_URL" .env.production && echo -e "  ${GREEN}✓${NC} NEXTAUTH_URL" || echo -e "  ${RED}✗${NC} NEXTAUTH_URL"
            else
                echo -e "${RED}❌ .env.production 不存在${NC}"
                echo "  运行: cp .env.production.example .env.production"
            fi

            wait_for_key
            ;;
        19)
            clear
            echo -e "${CYAN}🔑 生成新密钥：${NC}"
            echo ""
            echo -e "${YELLOW}NEXTAUTH_SECRET:${NC}"
            openssl rand -base64 32
            echo ""
            echo -e "${YELLOW}SETTINGS_ENCRYPTION_KEY:${NC}"
            openssl rand -base64 48
            echo ""
            wait_for_key
            ;;
        20)
            clear
            echo -e "${CYAN}选择清理选项：${NC}"
            echo -e "  ${YELLOW}1.${NC} 清理 node_modules"
            echo -e "  ${YELLOW}2.${NC} 清理 .next 缓存"
            echo -e "  ${YELLOW}3.${NC} 清理所有（node_modules + .next）"
            echo -ne "${YELLOW}请选择 [1-3]: ${NC}"
            read clean_choice

            case $clean_choice in
                1)
                    run_command "rm -rf node_modules apps/*/node_modules packages/*/node_modules" "清理 node_modules"
                    ;;
                2)
                    run_command "rm -rf .next apps/*/.next apps/*/.turbo" "清理 .next 缓存"
                    ;;
                3)
                    run_command "rm -rf node_modules apps/*/node_modules packages/*/node_modules .next apps/*/.next apps/*/.turbo" "清理所有缓存"
                    ;;
            esac
            ;;
        21)
            clear
            backup_file="db-backup-$(date +%Y%m%d-%H%M%S).sql"
            echo -e "${CYAN}💾 备份数据库到: ${WHITE}$backup_file${NC}"
            echo ""
            echo -e "${YELLOW}请输入 Supabase 数据库连接信息：${NC}"
            echo -ne "Host: "
            read db_host
            echo -ne "User: "
            read db_user
            echo -ne "Database: "
            read db_name

            run_command "pg_dump -h $db_host -U $db_user -d $db_name > backups/$backup_file" "备份数据库"
            ;;
        22)
            clear
            backup_file="code-backup-$(date +%Y%m%d-%H%M%S).tar.gz"
            echo -e "${CYAN}📦 备份代码到: ${WHITE}$backup_file${NC}"
            run_command "tar -czf backups/$backup_file --exclude='node_modules' --exclude='.next' --exclude='.git' ." "备份代码"
            ;;
        0)
            clear
            echo -e "${GREEN}👋 再见！${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}❌ 无效选择，请输入 0-22${NC}"
            sleep 2
            ;;
    esac
done
