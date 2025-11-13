# 宝塔面板批量创建站点 - 完整部署指南

## 准备工作

### 1. 获取宝塔 API 密钥

1. 登录宝塔面板
2. 进入 **面板设置** → **API 接口**
3. 点击 **开启 API 接口**
4. 复制生成的 **接口密钥**
5. 添加允许访问的 IP（如果本地运行脚本，添加你的 IP）

### 2. 确保服务器环境

```bash
# 检查 PHP 版本
php -v

# 检查 curl 扩展
php -m | grep curl

# 如果缺少 curl
yum install php-curl  # CentOS
apt install php-curl  # Ubuntu
```

## 方法 1：宝塔面板界面批量创建（推荐新手）

### 步骤：

1. **登录宝塔面板**
   - 访问 `http://你的服务器IP:8888`
   - 输入用户名和密码

2. **进入网站管理**
   - 左侧菜单 → **网站**

3. **批量添加站点**
   - 点击 **添加站点** 按钮
   - 选择 **批量添加** 标签

4. **输入域名列表**
   ```
   telegramcny28.com
   telegramfuwu.com
   telegramjiaoyu.com
   telegramrmb28.com
   telegram1688.com
   telegram2688.com
   telegramcnfw.com
   ```

5. **配置选项**
   - **PHP 版本**: 选择 **纯静态** 或 **PHP-81**（Next.js 使用反向代理，选纯静态即可）
   - **数据库**: **MySQL** 选择 **不创建**
   - **FTP**: 选择 **不创建**
   - **根目录**: 默认 `/www/wwwroot/域名`

6. **点击提交**
   - 等待批量创建完成
   - 查看创建结果

### 优点：
- ✅ 操作简单，适合新手
- ✅ 可视化界面
- ✅ 自动创建目录和配置文件

### 缺点：
- ❌ 每次最多创建 20 个站点
- ❌ 需要手动逐个配置 SSL

---

## 方法 2：使用 PHP API 脚本批量创建（推荐批量操作）

### 第一步：配置脚本

编辑 `scripts/baota-batch-create-sites.php`：

```php
// 修改这两行
$bt_panel = 'http://123.45.67.89:8888';  // 你的宝塔面板地址
$bt_key = 'your_api_key_here';            // 刚才获取的 API 密钥
```

### 第二步：上传脚本到服务器

```bash
# 方法 1: 使用 SCP
scp scripts/baota-batch-create-sites.php root@your-server:/root/

# 方法 2: 在服务器上直接创建
ssh root@your-server
vim /root/baota-batch-create-sites.php
# 粘贴脚本内容
```

### 第三步：运行脚本

```bash
ssh root@your-server
cd /root
php baota-batch-create-sites.php
```

### 预期输出：

```
========================================
宝塔面板批量创建站点工具
========================================

准备创建 7 个站点...

正在创建站点: telegramcny28.com
✓ 成功创建: telegramcny28.com

正在创建站点: telegramfuwu.com
✓ 成功创建: telegramfuwu.com

...

========================================
批量创建完成！
成功: 7 个
失败: 0 个
========================================
```

---

## 方法 3：使用宝塔命令行工具（适合高级用户）

宝塔提供了 bt 命令行工具：

```bash
# 查看帮助
bt

# 添加站点的命令（需要自己编写循环脚本）
bt site add_site '{"domain":"telegramcny28.com","path":"/www/wwwroot/telegramcny28.com","type_id":"0","type":"PHP","version":"00","port":"80"}'
```

### 创建批量脚本：

```bash
#!/bin/bash
# baota-bulk-create.sh

DOMAINS=(
    "telegramcny28.com"
    "telegramfuwu.com"
    "telegramjiaoyu.com"
    "telegramrmb28.com"
    "telegram1688.com"
    "telegram2688.com"
    "telegramcnfw.com"
)

for domain in "${DOMAINS[@]}"; do
    echo "Creating site: $domain"
    bt site add_site "{\"domain\":\"$domain\",\"path\":\"/www/wwwroot/$domain\",\"type_id\":\"0\",\"type\":\"PHP\",\"version\":\"00\",\"port\":\"80\"}"
    sleep 2
done
```

运行：
```bash
chmod +x baota-bulk-create.sh
./baota-bulk-create.sh
```

---

## 配置 Next.js 站点（创建后必须）

### 1. 安装 Node.js 和 PM2

```bash
# 使用宝塔安装 Node.js
# 软件商店 → 搜索 "PM2管理器" → 安装

# 或命令行安装
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
yum install -y nodejs
npm install -g pm2
```

### 2. 部署 Next.js 应用

```bash
# 1. 上传构建文件到服务器
cd /www/wwwroot/telegramcny28.com
git clone https://github.com/your-username/seo-websites-monorepo.git
cd seo-websites-monorepo

# 2. 安装依赖
npm install

# 3. 构建项目
npm run build

# 4. 使用 PM2 启动（每个站点不同端口）
pm2 start npm --name "website-1" -- start -- -p 3001
pm2 start npm --name "website-2" -- start -- -p 3002
pm2 start npm --name "website-tg" -- start -- -p 3003

# 5. 保存 PM2 配置
pm2 save
pm2 startup
```

### 3. 配置 Nginx 反向代理

对于每个站点，在宝塔面板：

1. **网站** → 点击站点 → **设置**
2. **配置文件** → 添加反向代理配置

```nginx
location / {
    proxy_pass http://127.0.0.1:3001;  # 对应 PM2 启动的端口
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# Next.js 静态文件
location /_next/static {
    proxy_pass http://127.0.0.1:3001/_next/static;
    add_header Cache-Control "public, max-age=31536000, immutable";
}

# Next.js 图片优化
location /_next/image {
    proxy_pass http://127.0.0.1:3001/_next/image;
    proxy_set_header Host $host;
}
```

### 4. 申请 SSL 证书

对于每个站点：

1. **网站** → 点击站点 → **设置**
2. **SSL** → **Let's Encrypt**
3. 输入邮箱 → **申请**
4. 等待申请完成
5. 开启 **强制 HTTPS**

---

## 域名配置

在你的域名提供商（如 Cloudflare、阿里云）添加 DNS 记录：

```
类型    名称                      值                TTL
A       telegramcny28.com        123.45.67.89     Auto
A       telegramfuwu.com         123.45.67.89     Auto
A       telegramjiaoyu.com       123.45.67.89     Auto
A       telegramrmb28.com        123.45.67.89     Auto
A       telegram1688.com         123.45.67.89     Auto
A       telegram2688.com         123.45.67.89     Auto
A       telegramcnfw.com         123.45.67.89     Auto
```

---

## 验证部署

```bash
# 检查 PM2 进程
pm2 list

# 检查端口监听
netstat -tlnp | grep node

# 检查 Nginx 配置
nginx -t

# 重启 Nginx
systemctl restart nginx

# 测试访问
curl -I http://telegramcny28.com
curl -I https://telegramcny28.com
```

---

## 常见问题

### Q1: API 密钥验证失败？
**A**: 检查：
- API 接口是否开启
- 访问 IP 是否在白名单
- 密钥是否正确复制

### Q2: 站点创建成功但无法访问？
**A**: 检查：
- DNS 是否正确解析（`nslookup 域名`）
- Nginx 是否配置反向代理
- PM2 进程是否运行
- 防火墙是否开放端口

### Q3: SSL 证书申请失败？
**A**: 确保：
- 域名已解析到服务器 IP
- 80 和 443 端口已开放
- 域名没有使用 CDN（申请时暂时关闭）

### Q4: 多个站点如何管理不同的环境变量？
**A**: 使用 PM2 生态系统文件：

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'website-1',
      script: 'npm',
      args: 'start',
      cwd: '/www/wwwroot/telegramcny28.com/apps/website-1',
      env: {
        PORT: 3001,
        NEXT_PUBLIC_SITE_NAME: 'Demo Website 1',
      }
    },
    {
      name: 'website-2',
      script: 'npm',
      args: 'start',
      cwd: '/www/wwwroot/telegramjiaoyu.com/apps/website-2',
      env: {
        PORT: 3002,
        NEXT_PUBLIC_SITE_NAME: 'Demo Website 2',
      }
    },
  ]
}
```

启动：
```bash
pm2 start ecosystem.config.js
```

---

## 性能优化建议

1. **启用 Gzip 压缩**（宝塔面板默认已开启）
2. **配置浏览器缓存**
   ```nginx
   # 在 Nginx 配置中添加
   location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
       expires 30d;
       add_header Cache-Control "public, immutable";
   }
   ```

3. **使用 CDN**（推荐 Cloudflare 免费版）

4. **开启 HTTP/2**（宝塔面板 SSL 配置中开启）

---

## 监控和维护

### 定期检查

```bash
# PM2 监控
pm2 monit

# 查看日志
pm2 logs website-1

# 重启应用
pm2 restart website-1

# 更新代码并重启
cd /www/wwwroot/telegramcny28.com
git pull
npm run build
pm2 restart all
```

### 自动更新脚本

```bash
#!/bin/bash
# /root/update-sites.sh

SITES=(
    "/www/wwwroot/telegramcny28.com"
    "/www/wwwroot/telegramfuwu.com"
)

for site in "${SITES[@]}"; do
    echo "Updating $site"
    cd "$site"
    git pull
    npm install
    npm run build
done

pm2 restart all
```

---

## 总结

**推荐方案**：
1. 使用 **宝塔面板界面批量创建**（简单快速）
2. 或使用 **PHP API 脚本**（适合大批量+自动化）
3. 配置 **Nginx 反向代理** 到 Next.js 端口
4. 使用 **PM2** 管理 Node.js 进程
5. 申请 **Let's Encrypt SSL 证书**

这样你就可以在一台宝塔服务器上托管多个域名的 Next.js 站点了！🚀
