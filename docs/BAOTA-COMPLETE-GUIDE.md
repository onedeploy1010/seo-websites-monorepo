# 宝塔 + Next.js 完整部署指南

## 📋 目录

1. [核心原则](#核心原则)
2. [域名端口映射](#域名端口映射)
3. [步骤1：宝塔批量创建站点](#步骤1宝塔批量创建站点)
4. [步骤2：部署代码到服务器](#步骤2部署代码到服务器)
5. [步骤3：用PM2启动Next.js](#步骤3用pm2启动nextjs)
6. [步骤4：配置Nginx反向代理](#步骤4配置nginx反向代理)
7. [步骤5：申请SSL证书](#步骤5申请ssl证书)
8. [步骤6：配置DNS](#步骤6配置dns)
9. [验证部署](#验证部署)
10. [常见问题](#常见问题)

---

## ⚠️ 核心原则

### 正确做法 ✅
1. 在宝塔创建**静态站点**（PHP版本选0或纯静态）
2. 用命令行 **PM2** 管理 Node.js 进程
3. 在宝塔配置 **Nginx 反向代理**

### 错误做法 ❌
1. ❌ **不要**使用宝塔的"Node.js 项目管理"功能
2. ❌ **不要**在宝塔界面启动 Node.js 项目
3. ❌ **不要**创建 PHP 类型站点（除非你真的需要 PHP）

### 为什么这样做？
- ✅ PM2 命令行更灵活强大，支持多端口、环境变量
- ✅ 宝塔只负责基础设施：目录、Nginx、SSL
- ✅ 职责分离，维护更方便

---

## 📊 域名端口映射

| 域名组 | 域名数量 | Next.js 应用 | PM2 端口 | 部署目录 |
|--------|---------|-------------|----------|----------|
| **Website-TG** | 3个 | website-tg | 3003 | /www/wwwroot/telegram1688.com |
| **Website-1** | 5个 | website-1 | 3001 | /www/wwwroot/telegramcny28.com |
| **Website-2** | 7个 | website-2 | 3002 | /www/wwwroot/telegramjiaoyu.com |

### Website-TG 域名（端口 3003）
- telegram1688.com
- telegram2688.com
- telegramcnfw.com

### Website-1 域名（端口 3001）
- telegramcny28.com
- telegramfuwu.com
- telegramfwfw.com
- telegramgzzh.com
- telegramhnzh.com

### Website-2 域名（端口 3002）
- telegramjiaoyu.com
- telegramrmb28.com
- telegramxzb.com
- telegramxzfw.com
- telegramzhfw.com
- xztelegram.com
- zhxztelegram.com

---

## 步骤1：宝塔批量创建站点

### 1.1 登录宝塔面板

```
http://你的服务器IP:8888
```

输入用户名和密码登录。

### 1.2 进入批量添加界面

1. 左侧菜单 → **网站**
2. 点击 **添加站点** 按钮
3. 选择 **批量添加** 标签页

### 1.3 粘贴域名列表

复制 `baota-15-domains-final.txt` 的内容：

```
telegram1688.com|1|0|0|0
telegram2688.com|1|0|0|0
telegramcnfw.com|1|0|0|0
telegramcny28.com|1|0|0|0
telegramfuwu.com|1|0|0|0
telegramfwfw.com|1|0|0|0
telegramgzzh.com|1|0|0|0
telegramhnzh.com|1|0|0|0
telegramjiaoyu.com|1|0|0|0
telegramrmb28.com|1|0|0|0
telegramxzb.com|1|0|0|0
telegramxzfw.com|1|0|0|0
telegramzhfw.com|1|0|0|0
xztelegram.com|1|0|0|0
zhxztelegram.com|1|0|0|0
```

### 1.4 格式说明

```
域名|根目录|FTP|数据库|PHP版本
```

**参数解释：**
- `域名`: 要创建的域名
- `1`: 自动创建根目录 `/www/wwwroot/域名`
- `0`: 不创建 FTP 账号
- `0`: 不创建数据库
- `0`: 纯静态（不使用 PHP）

### 1.5 提交创建

1. 粘贴完成后点击 **提交**
2. 等待批量创建完成（约1-2分钟）
3. 查看创建结果，确认所有15个站点已创建

---

## 步骤2：部署代码到服务器

### 2.1 SSH 登录服务器

```bash
ssh root@你的服务器IP
```

### 2.2 安装 Node.js（如果还没安装）

**方法1：使用宝塔软件商店**
1. 宝塔面板 → **软件商店**
2. 搜索 **"Node版本管理器"** 或 **"nvm"**
3. 点击安装

**方法2：命令行安装**
```bash
# CentOS
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
yum install -y nodejs

# Ubuntu
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# 验证安装
node -v  # 应该显示 v20.x.x
npm -v   # 应该显示 10.x.x
```

### 2.3 安装 PM2

```bash
npm install -g pm2

# 验证安装
pm2 -v
```

### 2.4 部署代码

#### 方式1：使用 Git 克隆

```bash
# Website-TG (telegram1688.com)
cd /www/wwwroot/telegram1688.com
git clone https://github.com/your-username/seo-websites-monorepo.git .
npm install
npm run build

# Website-1 (telegramcny28.com)
cd /www/wwwroot/telegramcny28.com
git clone https://github.com/your-username/seo-websites-monorepo.git .
npm install
npm run build

# Website-2 (telegramjiaoyu.com)
cd /www/wwwroot/telegramjiaoyu.com
git clone https://github.com/your-username/seo-websites-monorepo.git .
npm install
npm run build
```

#### 方式2：使用 SCP 上传

```bash
# 在本地执行
scp -r ./seo-websites-monorepo root@服务器IP:/www/wwwroot/telegram1688.com/

# 然后在服务器上
cd /www/wwwroot/telegram1688.com
npm install
npm run build
```

### 2.5 配置环境变量（可选）

如果项目需要环境变量：

```bash
cd /www/wwwroot/telegram1688.com

cat > .env.local << 'EOF'
DATABASE_URL="postgresql://user:password@host:5432/dbname"
NEXTAUTH_URL="https://telegram1688.com"
NEXTAUTH_SECRET="your-secret-key"
NEXT_PUBLIC_SITE_NAME="Telegram 服务站"
EOF
```

---

## 步骤3：用PM2启动Next.js

### 3.1 启动3个Next.js应用

**重要：每个应用使用不同的端口**

```bash
# Website-TG (端口 3003)
cd /www/wwwroot/telegram1688.com
pm2 start npm --name "website-tg" -- start -- -p 3003

# Website-1 (端口 3001)
cd /www/wwwroot/telegramcny28.com
pm2 start npm --name "website-1" -- start -- -p 3001

# Website-2 (端口 3002)
cd /www/wwwroot/telegramjiaoyu.com
pm2 start npm --name "website-2" -- start -- -p 3002
```

### 3.2 保存PM2配置

```bash
# 保存当前进程列表
pm2 save

# 设置开机自启
pm2 startup
# 复制输出的命令并执行（类似下面）
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root
```

### 3.3 查看运行状态

```bash
pm2 list
```

**预期输出：**
```
┌─────┬──────────────┬─────────┬─────────┬──────────┐
│ id  │ name         │ status  │ port    │ memory   │
├─────┼──────────────┼─────────┼─────────┼──────────┤
│ 0   │ website-tg   │ online  │ 3003    │ 150MB    │
│ 1   │ website-1    │ online  │ 3001    │ 180MB    │
│ 2   │ website-2    │ online  │ 3002    │ 160MB    │
└─────┴──────────────┴─────────┴─────────┴──────────┘
```

### 3.4 PM2 常用命令

```bash
# 查看日志
pm2 logs website-1
pm2 logs website-1 --lines 50

# 重启应用
pm2 restart website-1
pm2 restart all

# 停止应用
pm2 stop website-1

# 删除应用
pm2 delete website-1

# 监控
pm2 monit

# 查看详细信息
pm2 show website-1
```

---

## 步骤4：配置Nginx反向代理

### 4.1 Website-TG 域名组（3个域名 → 端口3003）

为以下3个域名配置相同的 Nginx 反向代理：
- telegram1688.com
- telegram2688.com
- telegramcnfw.com

**操作步骤：**

1. 宝塔面板 → **网站**
2. 找到 `telegram1688.com` → 点击 **设置**
3. 左侧菜单 → **配置文件**
4. 找到 `location /` 部分，**替换**为：

```nginx
location / {
    proxy_pass http://127.0.0.1:3003;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# Next.js 静态资源优化
location /_next/static {
    proxy_pass http://127.0.0.1:3003/_next/static;
    add_header Cache-Control "public, max-age=31536000, immutable";
}

# Next.js 图片优化
location /_next/image {
    proxy_pass http://127.0.0.1:3003/_next/image;
    proxy_set_header Host $host;
}

# 公共静态文件
location /public {
    proxy_pass http://127.0.0.1:3003/public;
    add_header Cache-Control "public, max-age=86400";
}
```

5. 点击 **保存**
6. **重复**上述步骤，为 `telegram2688.com` 和 `telegramcnfw.com` 配置

### 4.2 Website-1 域名组（5个域名 → 端口3001）

为以下5个域名配置相同的 Nginx 反向代理：
- telegramcny28.com
- telegramfuwu.com
- telegramfwfw.com
- telegramgzzh.com
- telegramhnzh.com

**配置内容：**（将上面配置中的 `3003` 改为 `3001`）

```nginx
location / {
    proxy_pass http://127.0.0.1:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

location /_next/static {
    proxy_pass http://127.0.0.1:3001/_next/static;
    add_header Cache-Control "public, max-age=31536000, immutable";
}

location /_next/image {
    proxy_pass http://127.0.0.1:3001/_next/image;
    proxy_set_header Host $host;
}

location /public {
    proxy_pass http://127.0.0.1:3001/public;
    add_header Cache-Control "public, max-age=86400";
}
```

为每个域名重复配置步骤。

### 4.3 Website-2 域名组（7个域名 → 端口3002）

为以下7个域名配置相同的 Nginx 反向代理：
- telegramjiaoyu.com
- telegramrmb28.com
- telegramxzb.com
- telegramxzfw.com
- telegramzhfw.com
- xztelegram.com
- zhxztelegram.com

**配置内容：**（将上面配置中的 `3003` 改为 `3002`）

```nginx
location / {
    proxy_pass http://127.0.0.1:3002;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

location /_next/static {
    proxy_pass http://127.0.0.1:3002/_next/static;
    add_header Cache-Control "public, max-age=31536000, immutable";
}

location /_next/image {
    proxy_pass http://127.0.0.1:3002/_next/image;
    proxy_set_header Host $host;
}

location /public {
    proxy_pass http://127.0.0.1:3002/public;
    add_header Cache-Control "public, max-age=86400";
}
```

为每个域名重复配置步骤。

### 4.4 验证 Nginx 配置

配置完所有域名后，在服务器执行：

```bash
# 测试 Nginx 配置语法
nginx -t

# 如果提示 OK，重启 Nginx
systemctl restart nginx

# 或在宝塔面板重启
# 软件商店 → Nginx → 重启
```

---

## 步骤5：申请SSL证书

### 5.1 逐个域名申请证书

为每个域名重复以下步骤：

1. 宝塔面板 → **网站**
2. 找到域名 → 点击 **设置**
3. 左侧菜单 → **SSL**
4. 选择 **Let's Encrypt** 标签
5. 填写邮箱地址
6. 点击 **申请**
7. 等待申请成功（通常10-30秒）
8. 开启 **强制 HTTPS**

**注意事项：**
- ✅ 确保域名已解析到服务器IP
- ✅ 80和443端口已开放
- ✅ 如果使用CDN，申请时暂时关闭

### 5.2 批量申请（命令行方式）

如果域名很多，可以用命令行批量申请：

```bash
# 安装 certbot
yum install certbot python3-certbot-nginx -y

# 批量申请（一次性）
certbot --nginx \
  -d telegram1688.com \
  -d telegram2688.com \
  -d telegramcnfw.com \
  -d telegramcny28.com \
  -d telegramfuwu.com \
  -d telegramfwfw.com \
  -d telegramgzzh.com \
  -d telegramhnzh.com \
  -d telegramjiaoyu.com \
  -d telegramrmb28.com \
  -d telegramxzb.com \
  -d telegramxzfw.com \
  -d telegramzhfw.com \
  -d xztelegram.com \
  -d zhxztelegram.com \
  --non-interactive --agree-tos -m your-email@example.com
```

---

## 步骤6：配置DNS

在你的域名提供商（Cloudflare/阿里云/腾讯云等）添加 A 记录：

| 类型 | 主机记录 | 记录值 | TTL |
|------|---------|--------|-----|
| A | telegram1688.com | 你的服务器IP | 600 |
| A | telegram2688.com | 你的服务器IP | 600 |
| A | telegramcnfw.com | 你的服务器IP | 600 |
| A | telegramcny28.com | 你的服务器IP | 600 |
| A | telegramfuwu.com | 你的服务器IP | 600 |
| A | telegramfwfw.com | 你的服务器IP | 600 |
| A | telegramgzzh.com | 你的服务器IP | 600 |
| A | telegramhnzh.com | 你的服务器IP | 600 |
| A | telegramjiaoyu.com | 你的服务器IP | 600 |
| A | telegramrmb28.com | 你的服务器IP | 600 |
| A | telegramxzb.com | 你的服务器IP | 600 |
| A | telegramxzfw.com | 你的服务器IP | 600 |
| A | telegramzhfw.com | 你的服务器IP | 600 |
| A | xztelegram.com | 你的服务器IP | 600 |
| A | zhxztelegram.com | 你的服务器IP | 600 |

**验证 DNS 解析：**

```bash
# 检查单个域名
nslookup telegram1688.com

# 批量检查
for domain in telegram1688.com telegram2688.com telegramcnfw.com; do
  echo "Checking $domain..."
  nslookup $domain
done
```

---

## 验证部署

### 1. 检查 PM2 进程

```bash
pm2 list
```

应该看到3个进程都是 `online` 状态。

### 2. 检查端口监听

```bash
netstat -tlnp | grep node
```

**预期输出：**
```
tcp  0  0  0.0.0.0:3001  0.0.0.0:*  LISTEN  12345/node
tcp  0  0  0.0.0.0:3002  0.0.0.0:*  LISTEN  12346/node
tcp  0  0  0.0.0.0:3003  0.0.0.0:*  LISTEN  12347/node
```

### 3. 测试本地访问

```bash
curl http://127.0.0.1:3001
curl http://127.0.0.1:3002
curl http://127.0.0.1:3003
```

应该返回 HTML 内容（Next.js 页面）。

### 4. 测试域名访问（HTTP）

```bash
curl -I http://telegram1688.com
curl -I http://telegramcny28.com
curl -I http://telegramjiaoyu.com
```

应该返回 HTTP 200 或 301/302（如果开启了强制 HTTPS）。

### 5. 测试域名访问（HTTPS）

```bash
curl -I https://telegram1688.com
curl -I https://telegramcny28.com
curl -I https://telegramjiaoyu.com
```

应该返回 HTTP 200 和 SSL 证书信息。

### 6. 浏览器访问

在浏览器中逐个访问15个域名，确认：
- ✅ 页面正常显示
- ✅ HTTPS 正常（绿锁）
- ✅ 没有混合内容警告
- ✅ 图片和静态资源加载正常

---

## 常见问题

### Q1: 为什么不用宝塔的 Node.js 项目管理？

**A:**
- ❌ 宝塔 Node.js 功能限制多，不支持复杂配置
- ❌ 不方便管理多个应用和端口
- ❌ 环境变量管理不灵活
- ✅ PM2 命令行更强大，生态更完善
- ✅ PM2 支持进程监控、日志管理、负载均衡

### Q2: 如何查看 Next.js 日志？

```bash
# 查看所有日志
pm2 logs

# 查看特定应用日志
pm2 logs website-1

# 查看最近100行日志
pm2 logs website-1 --lines 100

# 实时查看日志
pm2 logs website-1 --lines 0
```

### Q3: 如何重启应用？

```bash
# 重启单个应用
pm2 restart website-1

# 重启所有应用
pm2 restart all

# 重新加载（0秒停机）
pm2 reload website-1
```

### Q4: 如何更新代码？

```bash
# 进入项目目录
cd /www/wwwroot/telegram1688.com

# 拉取最新代码
git pull

# 安装依赖（如果有新依赖）
npm install

# 重新构建
npm run build

# 重启 PM2 应用
pm2 restart website-tg

# 查看日志确认启动成功
pm2 logs website-tg --lines 50
```

### Q5: 端口冲突怎么办？

```bash
# 查看端口占用
netstat -tlnp | grep 3001

# 或使用 lsof
lsof -i :3001

# 杀掉占用端口的进程
kill -9 <PID>

# 重新启动 PM2 应用
pm2 restart website-1
```

### Q6: PM2 进程频繁重启？

**检查日志找原因：**
```bash
pm2 logs website-1 --lines 100
```

**常见原因：**
- 端口被占用
- 环境变量缺失（如 DATABASE_URL）
- 数据库连接失败
- 内存不足
- 代码错误

**解决方法：**
```bash
# 增加内存限制
pm2 start npm --name "website-1" --max-memory-restart 500M -- start -- -p 3001

# 检查环境变量
pm2 env 0

# 查看详细信息
pm2 show website-1
```

### Q7: 某个域名无法访问？

**检查清单：**

1. ✅ **PM2 进程是否运行？**
   ```bash
   pm2 list
   ```

2. ✅ **端口是否监听？**
   ```bash
   netstat -tlnp | grep node
   ```

3. ✅ **Nginx 配置正确？**
   - 检查 proxy_pass 端口号
   - 检查配置文件语法：`nginx -t`

4. ✅ **DNS 是否解析？**
   ```bash
   nslookup 域名
   ```

5. ✅ **SSL 是否正常？**
   - 宝塔面板查看 SSL 状态
   - 浏览器检查证书有效期

6. ✅ **防火墙是否开放端口？**
   ```bash
   # 开放 80 和 443 端口
   firewall-cmd --permanent --add-port=80/tcp
   firewall-cmd --permanent --add-port=443/tcp
   firewall-cmd --reload
   ```

### Q8: 如何配置不同的环境变量？

使用 PM2 生态系统文件：

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'website-tg',
      script: 'npm',
      args: 'start',
      cwd: '/www/wwwroot/telegram1688.com',
      env: {
        PORT: 3003,
        NODE_ENV: 'production',
        NEXT_PUBLIC_SITE_NAME: 'Telegram 服务站',
      }
    },
    {
      name: 'website-1',
      script: 'npm',
      args: 'start',
      cwd: '/www/wwwroot/telegramcny28.com',
      env: {
        PORT: 3001,
        NODE_ENV: 'production',
        NEXT_PUBLIC_SITE_NAME: '网站1',
      }
    },
    {
      name: 'website-2',
      script: 'npm',
      args: 'start',
      cwd: '/www/wwwroot/telegramjiaoyu.com',
      env: {
        PORT: 3002,
        NODE_ENV: 'production',
        NEXT_PUBLIC_SITE_NAME: '网站2',
      }
    },
  ]
}
```

启动：
```bash
pm2 start ecosystem.config.js
pm2 save
```

---

## 性能优化

### 1. 启用 Gzip 压缩

宝塔默认已开启，可以在面板确认：
- **软件商店** → **Nginx** → **性能调整** → **Gzip 压缩**

### 2. 配置浏览器缓存

在 Nginx 配置中添加（已包含在上面的配置中）：

```nginx
location /_next/static {
    proxy_pass http://127.0.0.1:3001/_next/static;
    add_header Cache-Control "public, max-age=31536000, immutable";
}
```

### 3. 使用 PM2 Cluster 模式（高流量）

```bash
# 停止当前应用
pm2 delete website-1

# 使用 Cluster 模式启动（自动多进程负载均衡）
pm2 start npm --name "website-1" -i max -- start -- -p 3001

# 或指定进程数量
pm2 start npm --name "website-1" -i 2 -- start -- -p 3001
```

### 4. 设置日志轮转

```bash
# 安装日志轮转模块
pm2 install pm2-logrotate

# 配置
pm2 set pm2-logrotate:max_size 10M      # 单个日志文件最大10MB
pm2 set pm2-logrotate:retain 7          # 保留7个备份
pm2 set pm2-logrotate:compress true     # 压缩旧日志
```

### 5. 使用 CDN（可选）

推荐 Cloudflare 免费版：
1. 在 Cloudflare 添加域名
2. 修改 DNS 服务器指向 Cloudflare
3. 开启 Auto Minify（自动压缩 JS/CSS/HTML）
4. 开启 Brotli 压缩
5. 缓存静态资源

---

## 维护和监控

### 定期检查

```bash
# PM2 监控仪表盘
pm2 monit

# 查看进程信息
pm2 show website-1

# 查看内存和 CPU 使用
pm2 list
```

### 自动更新脚本

创建 `/root/update-sites.sh`：

```bash
#!/bin/bash

echo "开始更新所有站点..."

# Website-TG
echo "更新 Website-TG..."
cd /www/wwwroot/telegram1688.com
git pull
npm install
npm run build

# Website-1
echo "更新 Website-1..."
cd /www/wwwroot/telegramcny28.com
git pull
npm install
npm run build

# Website-2
echo "更新 Website-2..."
cd /www/wwwroot/telegramjiaoyu.com
git pull
npm install
npm run build

# 重启所有应用
echo "重启所有 PM2 应用..."
pm2 restart all

echo "更新完成！"
pm2 list
```

使用：
```bash
chmod +x /root/update-sites.sh
/root/update-sites.sh
```

### 配置监控告警（可选）

使用 PM2 Plus（免费版）：

```bash
pm2 plus
# 按提示注册账号
# 访问 https://app.pm2.io 查看实时监控
```

---

## 资源估算

**单台服务器资源需求：**
- 每个 Next.js 进程：约 150-200MB 内存
- 3个进程总计：约 500-600MB
- **推荐配置**：2核 4GB 内存

**流量估算：**
- 低流量（<1000 PV/天）：1核 2GB 足够
- 中流量（1000-10000 PV/天）：2核 4GB
- 高流量（>10000 PV/天）：4核 8GB + Cluster 模式

---

## 总结

### ✅ 完整流程回顾

1. **宝塔批量创建15个静态站点**（格式：`域名|1|0|0|0`）
2. **命令行用 PM2 启动3个 Next.js 应用**（端口 3001/3002/3003）
3. **宝塔逐个配置 Nginx 反向代理**（15个域名）
4. **宝塔逐个申请 SSL 证书**（15个域名）
5. **域名商添加 DNS A 记录**（15个域名）

### 🎯 关键点

- **宝塔只负责**：创建站点目录、配置 Nginx、申请 SSL
- **PM2 负责**：管理 Node.js 进程、监控、日志
- **Nginx 负责**：反向代理、静态文件缓存

这样的架构最稳定、最灵活！🚀

### 📁 相关文件

- `baota-15-domains-final.txt` - 批量创建格式（直接粘贴到宝塔）
- 本文档 - 完整部署指南
