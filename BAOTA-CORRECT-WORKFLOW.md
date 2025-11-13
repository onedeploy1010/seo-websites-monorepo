# 宝塔 + Next.js 正确部署流程

## ⚠️ 重要：不要使用宝塔的 Node.js 项目管理功能

**正确做法：**
1. 在宝塔创建**静态站点**（PHP版本选0或纯静态）
2. 用命令行 PM2 管理 Node.js 进程
3. 配置 Nginx 反向代理

---

## 步骤 1：宝塔批量创建静态站点

### 1.1 登录宝塔面板
```
http://你的服务器IP:8888
```

### 1.2 批量添加站点
**网站** → **添加站点** → **批量添加**

粘贴以下内容：
```
telegram1688.com|1|0|0|0
telegram2688.com|1|0|0|0
telegramcnfw.com|1|0|0|0
telegramcny28.com|1|0|0|0
telegramfuwu.com|1|0|0|0
telegramjiaoyu.com|1|0|0|0
telegramrmb28.com|1|0|0|0
```

**重点：最后一个 `0` 表示纯静态，不使用 PHP 或 Node.js**

### 1.3 点击提交
等待所有站点创建完成

---

## 步骤 2：服务器上部署代码

### 2.1 SSH 登录服务器
```bash
ssh root@your-server-ip
```

### 2.2 安装 Node.js（如果还没安装）
```bash
# 宝塔软件商店搜索 "Node 版本管理器" 或 "nvm"
# 或命令行安装
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
yum install -y nodejs

# 验证
node -v
npm -v
```

### 2.3 安装 PM2
```bash
npm install -g pm2
pm2 -v
```

### 2.4 部署代码到第一个域名目录
```bash
cd /www/wwwroot/telegramcny28.com

# 克隆代码
git clone https://github.com/your-username/seo-websites-monorepo.git .

# 或上传代码
# scp -r ./your-project root@server:/www/wwwroot/telegramcny28.com/

# 安装依赖
npm install

# 配置环境变量
cat > .env.local << EOF
DATABASE_URL="postgresql://user:password@host:5432/dbname"
NEXTAUTH_URL="https://telegramcny28.com"
NEXTAUTH_SECRET="your-secret-key"
NEXT_PUBLIC_SITE_NAME="Demo Website 1"
EOF

# 构建项目
npm run build
```

---

## 步骤 3：用 PM2 启动 Next.js（不用宝塔界面）

### 3.1 启动不同的 Next.js 应用到不同端口

```bash
# Website-1 (telegramcny28.com, telegramfuwu.com)
cd /www/wwwroot/telegramcny28.com/apps/website-1
pm2 start npm --name "website-1" -- start -- -p 3001

# Website-2 (telegramjiaoyu.com, telegramrmb28.com)
cd /www/wwwroot/telegramjiaoyu.com/apps/website-2
pm2 start npm --name "website-2" -- start -- -p 3002

# Website-TG (telegram1688.com, telegram2688.com, telegramcnfw.com)
cd /www/wwwroot/telegram1688.com/apps/website-tg
pm2 start npm --name "website-tg" -- start -- -p 3003

# 保存 PM2 配置
pm2 save

# 设置开机自启
pm2 startup
# 复制输出的命令并执行
```

### 3.2 查看运行状态
```bash
pm2 list
pm2 logs
pm2 monit
```

预期输出：
```
┌─────┬──────────────┬─────────┬─────────┬──────────┐
│ id  │ name         │ mode    │ status  │ port     │
├─────┼──────────────┼─────────┼─────────┼──────────┤
│ 0   │ website-1    │ fork    │ online  │ 3001     │
│ 1   │ website-2    │ fork    │ online  │ 3002     │
│ 2   │ website-tg   │ fork    │ online  │ 3003     │
└─────┴──────────────┴─────────┴─────────┴──────────┘
```

---

## 步骤 4：宝塔配置 Nginx 反向代理

### 4.1 配置 telegramcny28.com

1. 宝塔面板 → **网站** → 找到 `telegramcny28.com` → 点击 **设置**
2. 左侧菜单 → **配置文件**
3. 找到 `location /` 部分，替换为：

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

# Next.js 静态资源
location /_next/static {
    proxy_pass http://127.0.0.1:3001/_next/static;
    add_header Cache-Control "public, max-age=31536000, immutable";
}

# Next.js 图片优化
location /_next/image {
    proxy_pass http://127.0.0.1:3001/_next/image;
    proxy_set_header Host $host;
}

# 公共静态文件
location /public {
    proxy_pass http://127.0.0.1:3001/public;
    add_header Cache-Control "public, max-age=86400";
}
```

4. 点击 **保存**

### 4.2 配置其他域名

**telegramfuwu.com** → 同样代理到端口 3001
**telegramjiaoyu.com** → 代理到端口 3002
**telegramrmb28.com** → 代理到端口 3002
**telegram1688.com** → 代理到端口 3003
**telegram2688.com** → 代理到端口 3003
**telegramcnfw.com** → 代理到端口 3003

每个域名都重复上述配置步骤，只需修改端口号。

---

## 步骤 5：申请 SSL 证书

### 5.1 为每个域名申请证书

1. 宝塔面板 → **网站** → 选择域名 → **设置**
2. 左侧菜单 → **SSL**
3. 选择 **Let's Encrypt**
4. 填写邮箱
5. 点击 **申请**
6. 等待申请成功
7. 开启 **强制 HTTPS**

### 5.2 批量申请（如果域名较多）

可以用命令行：
```bash
# 安装 certbot
yum install certbot python3-certbot-nginx -y

# 批量申请
certbot --nginx -d telegramcny28.com -d telegramfuwu.com \
  -d telegramjiaoyu.com -d telegramrmb28.com \
  -d telegram1688.com -d telegram2688.com \
  -d telegramcnfw.com \
  --non-interactive --agree-tos -m your-email@example.com
```

---

## 步骤 6：配置域名 DNS

在你的域名提供商（Cloudflare/阿里云等）添加 A 记录：

```
类型    主机记录              记录值
A       telegramcny28.com    123.45.67.89
A       telegramfuwu.com     123.45.67.89
A       telegramjiaoyu.com   123.45.67.89
A       telegramrmb28.com    123.45.67.89
A       telegram1688.com     123.45.67.89
A       telegram2688.com     123.45.67.89
A       telegramcnfw.com     123.45.67.89
```

---

## 验证部署

### 1. 检查 PM2 状态
```bash
pm2 list
pm2 logs website-1 --lines 50
```

### 2. 检查端口监听
```bash
netstat -tlnp | grep node
# 应该看到 3001, 3002, 3003 端口被监听
```

### 3. 测试 Nginx 配置
```bash
nginx -t
systemctl restart nginx
```

### 4. 测试网站访问
```bash
curl -I http://telegramcny28.com
curl -I https://telegramcny28.com

# 检查响应头是否包含 X-Powered-By: Next.js
```

### 5. 浏览器访问
打开浏览器访问：
- https://telegramcny28.com
- https://telegramfuwu.com
- 等等...

---

## 常见问题

### Q1: 为什么不用宝塔的 Node.js 项目管理？
**A:**
- ❌ 宝塔 Node.js 功能限制多
- ❌ 不方便管理多个应用和端口
- ✅ PM2 命令行更灵活强大
- ✅ 环境变量管理更方便

### Q2: 如何查看 Next.js 日志？
```bash
pm2 logs website-1
pm2 logs website-1 --lines 100
```

### Q3: 如何重启应用？
```bash
pm2 restart website-1
pm2 restart all
```

### Q4: 如何更新代码？
```bash
cd /www/wwwroot/telegramcny28.com
git pull
npm install
npm run build
pm2 restart all
```

### Q5: 端口冲突怎么办？
```bash
# 查看端口占用
netstat -tlnp | grep 3001

# 杀掉进程
kill -9 <PID>

# 重新启动
pm2 restart website-1
```

---

## 维护和监控

### 查看资源使用
```bash
pm2 monit
```

### 查看详细信息
```bash
pm2 show website-1
```

### 设置日志轮转
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### 性能监控（可选）
```bash
pm2 plus
# 访问 https://app.pm2.io 查看详细监控
```

---

## 总结

### ✅ 做的事情：
1. 宝塔创建**静态站点**（不用 Node.js 类型）
2. 命令行用 **PM2** 管理 Node.js 进程
3. 宝塔配置 **Nginx 反向代理**
4. 宝塔申请 **SSL 证书**
5. DNS 添加 **A 记录**

### ❌ 不要做：
1. ❌ 不要在宝塔"Node项目"里添加项目
2. ❌ 不要用宝塔界面启动 Node.js
3. ❌ 不要创建 PHP 类型站点（除非你真的需要 PHP）

### 🎯 关键点：
- **宝塔只负责**：创建站点目录、配置 Nginx、申请 SSL
- **PM2 负责**：管理 Node.js 进程、监控、日志
- **Nginx 负责**：反向代理、静态文件缓存

这样的架构最稳定、最灵活！🚀
