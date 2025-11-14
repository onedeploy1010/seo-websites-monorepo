#!/bin/bash

# Nginx 反向代理自动配置脚本
# 为 15 个域名配置反向代理

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Nginx 反向代理配置脚本${NC}"
echo -e "${GREEN}========================================${NC}"

# 配置目录
NGINX_CONF_DIR="/www/server/panel/vhost/nginx"
SERVER_IP=$(curl -s ifconfig.me)

echo -e "${YELLOW}服务器IP: $SERVER_IP${NC}"

# ==========================================
# Admin 后台配置
# ==========================================
cat > "$NGINX_CONF_DIR/admin.telegram1688.com.conf" << 'EOF'
upstream admin_backend {
    server 127.0.0.1:3100;
    keepalive 64;
}

server {
    listen 80;
    server_name admin.telegram1688.com;
    
    # HTTP 自动跳转到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name admin.telegram1688.com;

    # SSL 证书配置（需要先申请证书）
    ssl_certificate /www/server/panel/vhost/cert/admin.telegram1688.com/fullchain.pem;
    ssl_certificate_key /www/server/panel/vhost/cert/admin.telegram1688.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # 日志配置
    access_log /www/wwwlogs/admin.telegram1688.com.log;
    error_log /www/wwwlogs/admin.telegram1688.com.error.log;

    location / {
        proxy_pass http://admin_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # 超时配置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF

echo -e "${GREEN}✓${NC} 已生成 admin.telegram1688.com 配置"

# ==========================================
# Website 1 的 5 个域名配置
# ==========================================
cat > "$NGINX_CONF_DIR/website1_domains.conf" << 'EOF'
upstream website1_backend {
    server 127.0.0.1:3001;
    keepalive 64;
}

# HTTP 自动跳转到 HTTPS
server {
    listen 80;
    server_name telegram1688.com telegram2688.com telegramcny28.com telegramrmb28.com telegramxzb.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name telegram1688.com telegram2688.com telegramcny28.com telegramrmb28.com telegramxzb.com;

    # SSL 证书配置（使用主域名证书，支持多域名）
    ssl_certificate /www/server/panel/vhost/cert/telegram1688.com/fullchain.pem;
    ssl_certificate_key /www/server/panel/vhost/cert/telegram1688.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # 日志配置
    access_log /www/wwwlogs/website1_domains.log;
    error_log /www/wwwlogs/website1_domains.error.log;

    location / {
        proxy_pass http://website1_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # 超时配置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF

echo -e "${GREEN}✓${NC} 已生成 Website 1 的 5 个域名配置"

# ==========================================
# Website 2 的 5 个域名配置
# ==========================================
cat > "$NGINX_CONF_DIR/website2_domains.conf" << 'EOF'
upstream website2_backend {
    server 127.0.0.1:3002;
    keepalive 64;
}

# HTTP 自动跳转到 HTTPS
server {
    listen 80;
    server_name telegramcnfw.com telegramfuwu.com telegramfwfw.com telegramxzfw.com telegramzhfw.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name telegramcnfw.com telegramfuwu.com telegramfwfw.com telegramxzfw.com telegramzhfw.com;

    # SSL 证书配置
    ssl_certificate /www/server/panel/vhost/cert/telegramcnfw.com/fullchain.pem;
    ssl_certificate_key /www/server/panel/vhost/cert/telegramcnfw.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # 日志配置
    access_log /www/wwwlogs/website2_domains.log;
    error_log /www/wwwlogs/website2_domains.error.log;

    location / {
        proxy_pass http://website2_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # 超时配置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF

echo -e "${GREEN}✓${NC} 已生成 Website 2 的 5 个域名配置"

# ==========================================
# Website TG 的 5 个域名配置
# ==========================================
cat > "$NGINX_CONF_DIR/website_tg_domains.conf" << 'EOF'
upstream website_tg_backend {
    server 127.0.0.1:3003;
    keepalive 64;
}

# HTTP 自动跳转到 HTTPS
server {
    listen 80;
    server_name telegramgzzh.com telegramhnzh.com telegramjiaoyu.com xztelegram.com zhxztelegram.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name telegramgzzh.com telegramhnzh.com telegramjiaoyu.com xztelegram.com zhxztelegram.com;

    # SSL 证书配置
    ssl_certificate /www/server/panel/vhost/cert/telegramgzzh.com/fullchain.pem;
    ssl_certificate_key /www/server/panel/vhost/cert/telegramgzzh.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # 日志配置
    access_log /www/wwwlogs/website_tg_domains.log;
    error_log /www/wwwlogs/website_tg_domains.error.log;

    location / {
        proxy_pass http://website_tg_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # 超时配置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF

echo -e "${GREEN}✓${NC} 已生成 Website TG 的 5 个域名配置"

# ==========================================
# 测试 Nginx 配置
# ==========================================
echo ""
echo -e "${YELLOW}测试 Nginx 配置...${NC}"
nginx -t

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Nginx 配置测试通过"
    echo ""
    echo -e "${YELLOW}是否重载 Nginx？(y/n)${NC}"
    read -r RELOAD_NGINX
    
    if [ "$RELOAD_NGINX" = "y" ]; then
        nginx -s reload
        echo -e "${GREEN}✓${NC} Nginx 已重载"
    fi
else
    echo -e "${YELLOW}⚠${NC} Nginx 配置测试失败，请检查配置文件"
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  配置完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "下一步："
echo "1. 为每个域名申请 SSL 证书（在宝塔面板中）"
echo "2. 配置域名 DNS 解析，A 记录指向: $SERVER_IP"
echo "3. 测试访问：https://admin.telegram1688.com"
echo ""
echo "域名列表："
echo "  - admin.telegram1688.com (管理后台)"
echo "  - telegram1688.com, telegram2688.com, telegramcny28.com, telegramrmb28.com, telegramxzb.com"
echo "  - telegramcnfw.com, telegramfuwu.com, telegramfwfw.com, telegramxzfw.com, telegramzhfw.com"
echo "  - telegramgzzh.com, telegramhnzh.com, telegramjiaoyu.com, xztelegram.com, zhxztelegram.com"

