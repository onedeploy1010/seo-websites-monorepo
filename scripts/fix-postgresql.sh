#!/bin/bash

##############################################################################
# PostgreSQL 完整修复脚本
#
# 功能：
# - 清理重复的配置项
# - 修复日志配置
# - 确保服务正常运行
# - 创建必要的目录和权限
#
# 使用方法：
# chmod +x scripts/fix-postgresql.sh
# sudo ./scripts/fix-postgresql.sh
##############################################################################

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "=========================================="
echo -e "${BLUE}🔧 PostgreSQL 完整修复脚本${NC}"
echo "=========================================="
echo ""

# 检查是否以 root 运行
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}❌ 请使用 sudo 运行此脚本${NC}"
    exit 1
fi

# 1. 检查是否安装
echo -e "${YELLOW}步骤 1/7: 检查 PostgreSQL 安装${NC}"
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL 未安装${NC}"
    echo "请先安装 PostgreSQL:"
    echo "  - 通过宝塔面板安装，或"
    echo "  - 运行: apt install postgresql postgresql-contrib"
    exit 1
fi
echo -e "${GREEN}✅ PostgreSQL 已安装${NC}"
echo ""

# 2. 备份配置
echo -e "${YELLOW}步骤 2/7: 备份配置文件${NC}"
CONFIG_FILE="/www/server/pgsql/data/postgresql.conf"

# 尝试不同的配置文件位置
if [ ! -f "$CONFIG_FILE" ]; then
    # 尝试标准 Ubuntu/Debian 位置
    PG_VERSION=$(psql --version | grep -oP '\d+' | head -1)
    CONFIG_FILE="/etc/postgresql/${PG_VERSION}/main/postgresql.conf"
fi

if [ -f "$CONFIG_FILE" ]; then
    BACKUP_FILE="${CONFIG_FILE}.backup.$(date +%Y%m%d_%H%M%S)"
    cp "$CONFIG_FILE" "$BACKUP_FILE"
    echo -e "${GREEN}✅ 已备份: $BACKUP_FILE${NC}"
else
    echo -e "${RED}❌ 配置文件不存在${NC}"
    echo "尝试的位置:"
    echo "  - /www/server/pgsql/data/postgresql.conf"
    echo "  - /etc/postgresql/*/main/postgresql.conf"
    exit 1
fi
echo ""

# 3. 清理重复配置
echo -e "${YELLOW}步骤 3/7: 清理重复的日志配置${NC}"
# 删除所有日志配置行
sed -i '/^logging_collector/d' "$CONFIG_FILE"
sed -i '/^log_destination/d' "$CONFIG_FILE"
sed -i '/^log_directory/d' "$CONFIG_FILE"
sed -i '/^log_filename/d' "$CONFIG_FILE"
sed -i '/^log_statement/d' "$CONFIG_FILE"
sed -i '/^log_min_duration_statement/d' "$CONFIG_FILE"

# 确定日志目录
if [ -d "/www/server/pgsql" ]; then
    LOG_DIR="/www/server/pgsql/logs"
else
    LOG_DIR="/var/log/postgresql"
fi

# 添加一次正确的配置
cat >> "$CONFIG_FILE" << LOGCONF

# ==========================================
# 日志配置 (Log Configuration)
# ==========================================
logging_collector = on
log_destination = 'stderr'
log_directory = '$LOG_DIR'
log_filename = 'postgresql-%Y-%m-%d.log'
log_statement = 'none'
log_min_duration_statement = 5000
LOGCONF

echo -e "${GREEN}✅ 配置已清理并重新添加${NC}"
echo ""

# 4. 确保基本配置
echo -e "${YELLOW}步骤 4/7: 检查基本配置${NC}"

# 监听地址
if ! grep -q "^listen_addresses" "$CONFIG_FILE"; then
    echo "listen_addresses = 'localhost'" >> "$CONFIG_FILE"
    echo -e "${GREEN}✅ 已添加 listen_addresses${NC}"
else
    echo -e "${BLUE}ℹ️  listen_addresses 已配置${NC}"
fi

# 端口
if ! grep -q "^port = 5432" "$CONFIG_FILE"; then
    echo "port = 5432" >> "$CONFIG_FILE"
    echo -e "${GREEN}✅ 已添加 port${NC}"
else
    echo -e "${BLUE}ℹ️  port 已配置${NC}"
fi
echo ""

# 5. 创建日志目录
echo -e "${YELLOW}步骤 5/7: 创建日志目录${NC}"
mkdir -p "$LOG_DIR"
chown -R postgres:postgres "$LOG_DIR"
chmod 750 "$LOG_DIR"
echo -e "${GREEN}✅ 日志目录已创建: $LOG_DIR${NC}"
echo ""

# 6. 重启服务
echo -e "${YELLOW}步骤 6/7: 重启 PostgreSQL 服务${NC}"
systemctl restart postgresql
sleep 3

if systemctl is-active --quiet postgresql; then
    echo -e "${GREEN}✅ PostgreSQL 服务运行中${NC}"
else
    echo -e "${RED}❌ PostgreSQL 启动失败${NC}"
    echo ""
    echo "错误日志:"
    journalctl -xeu postgresql --no-pager | tail -30
    exit 1
fi
echo ""

# 7. 测试连接
echo -e "${YELLOW}步骤 7/7: 测试数据库连接${NC}"
if sudo -u postgres psql -c "SELECT version();" &> /dev/null; then
    echo -e "${GREEN}✅ 数据库连接正常${NC}"
    echo ""
    echo "PostgreSQL 版本:"
    sudo -u postgres psql -t -c "SELECT version();" | head -1
else
    echo -e "${RED}❌ 数据库连接失败${NC}"
    exit 1
fi
echo ""

echo "=========================================="
echo -e "${GREEN}✅ 修复完成！${NC}"
echo "=========================================="
echo ""
echo "📋 服务状态:"
systemctl status postgresql --no-pager | head -10
echo ""
echo "📊 端口监听:"
netstat -tlnp | grep 5432 || ss -tlnp | grep 5432
echo ""
echo "💡 下一步："
echo "  1. 运行初始化脚本: sudo ./scripts/init-database.sh"
echo "  2. 或手动创建数据库和用户"
echo ""
