# 宝塔面板反向代理配置指南（单独站点方式）

## 问题原因

如果你在宝塔面板中为每个域名创建了单独的站点，需要为每个站点单独配置反向代理。

## 配置步骤

### 1. 确认 PM2 应用运行状态

```bash
pm2 list
```

确保看到：
- seo-admin (端口 3100)
- seo-website-1 (端口 3001)
- seo-website-2 (端口 3002)
- seo-website-tg (端口 3003)

### 2. 在宝塔面板配置反向代理

#### 方法A：通过宝塔面板界面配置（推荐）

1. 登录宝塔面板
2. 进入 **网站**
3. 找到对应域名，点击 **设置**
4. 点击左侧 **反向代理**
5. 点击 **添加反向代理**

#### 配置示例：

**admin.telegram1688.com:**
- 代理名称：`admin-backend`
- 目标URL：`http://127.0.0.1:3100`
- 发送域名：`$host`
- 内容替换：留空
- 启用：是

**telegram1688.com:**
- 代理名称：`website1-backend`
- 目标URL：`http://127.0.0.1:3001`
- 发送域名：`$host`
- 内容替换：留空
- 启用：是

**依此类推配置其他域名...**

#### 方法B：手动修改配置文件

找到每个站点的 Nginx 配置文件，通常在：
```
/www/server/panel/vhost/nginx/域名.conf
```

### 3. 完整的 Nginx 反向代理配置模板

#### Admin 后台配置模板

```nginx
server {
    listen 80;
    server_name admin.telegram1688.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name admin.telegram1688.com;
    
    # SSL 证书（宝塔自动管理）
    ssl_certificate /www/server/panel/vhost/cert/admin.telegram1688.com/fullchain.pem;
    ssl_certificate_key /www/server/panel/vhost/cert/admin.telegram1688.com/privkey.pem;
    
    # 日志
    access_log /www/wwwlogs/admin.telegram1688.com.log;
    error_log /www/wwwlogs/admin.telegram1688.com.error.log;
    
    # 反向代理到 PM2 应用
    location / {
        proxy_pass http://127.0.0.1:3100;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # 超时设置
        proxy_connect_timeout 60;
        proxy_send_timeout 60;
        proxy_read_timeout 60;
        
        # 错误处理
        proxy_intercept_errors on;
    }
    
    # Next.js 静态资源
    location /_next/static {
        proxy_pass http://127.0.0.1:3100;
        proxy_cache_valid 60m;
        add_header Cache-Control "public, max-age=3600, immutable";
    }
}
```

#### Website 1 配置模板（5个域名共用）

```nginx
server {
    listen 80;
    server_name telegram1688.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name telegram1688.com;
    
    ssl_certificate /www/server/panel/vhost/cert/telegram1688.com/fullchain.pem;
    ssl_certificate_key /www/server/panel/vhost/cert/telegram1688.com/privkey.pem;
    
    access_log /www/wwwlogs/telegram1688.com.log;
    error_log /www/wwwlogs/telegram1688.com.error.log;
    
    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        proxy_connect_timeout 60;
        proxy_send_timeout 60;
        proxy_read_timeout 60;
    }
    
    location /_next/static {
        proxy_pass http://127.0.0.1:3001;
        proxy_cache_valid 60m;
        add_header Cache-Control "public, max-age=3600, immutable";
    }
}
```

重复以上配置为所有域名创建配置文件。

### 4. 域名端口映射表

| 域名 | 端口 | 站点类型 |
|------|------|---------|
| admin.telegram1688.com | 3100 | Admin |
| telegram1688.com | 3001 | Website 1 |
| telegram2688.com | 3001 | Website 1 |
| telegramcny28.com | 3001 | Website 1 |
| telegramrmb28.com | 3001 | Website 1 |
| telegramxzb.com | 3001 | Website 1 |
| telegramcnfw.com | 3002 | Website 2 |
| telegramfuwu.com | 3002 | Website 2 |
| telegramfwfw.com | 3002 | Website 2 |
| telegramxzfw.com | 3002 | Website 2 |
| telegramzhfw.com | 3002 | Website 2 |
| telegramgzzh.com | 3003 | Website TG |
| telegramhnzh.com | 3003 | Website TG |
| telegramjiaoyu.com | 3003 | Website TG |
| xztelegram.com | 3003 | Website TG |
| zhxztelegram.com | 3003 | Website TG |

### 5. 测试配置

```bash
# 测试 Nginx 配置
nginx -t

# 重载 Nginx
nginx -s reload

# 测试端口
curl http://localhost:3100
curl http://localhost:3001
curl http://localhost:3002
curl http://localhost:3003
```

### 6. 查看错误日志

```bash
# 查看 Nginx 错误日志
tail -f /www/wwwlogs/域名.error.log

# 查看 PM2 日志
pm2 logs seo-admin
pm2 logs seo-website-1
pm2 logs seo-website-2
pm2 logs seo-website-tg
```

### 7. 常见问题

#### 问题1：502 Bad Gateway

**原因：** PM2 应用未运行或端口错误

**解决：**
```bash
pm2 list
pm2 restart all
```

#### 问题2：Server configuration error

**原因：** Nginx 配置语法错误

**解决：**
```bash
nginx -t  # 查看具体错误
# 修正配置文件后重载
nginx -s reload
```

#### 问题3：SSL 证书错误

**原因：** 证书未申请或路径错误

**解决：**
- 在宝塔面板重新申请 SSL 证书
- 检查证书路径是否正确

### 8. 宝塔面板快捷配置

如果你使用宝塔面板的图形界面，按以下步骤：

1. **网站** → **添加站点**
2. 域名：填写对应域名
3. 根目录：随便选一个（不会用到）
4. PHP版本：纯静态
5. 创建后，进入 **设置** → **反向代理**
6. 添加反向代理：
   - 目标URL：`http://127.0.0.1:端口号`
   - 启用：是
7. 点击 **SSL** 申请证书
8. 完成

