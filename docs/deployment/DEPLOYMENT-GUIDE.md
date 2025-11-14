# 服务器部署指南

## 📋 前置要求

在开始部署前，请确保服务器已安装：

- ✅ Node.js 18+
- ✅ pnpm (`npm install -g pnpm`)
- ✅ PM2 (`npm install -g pm2`)
- ✅ Git
- ✅ PostgreSQL（Supabase 已提供）

---

## 🚀 快速部署（推荐）

### 方法 1：使用一键部署脚本

```bash
# 1. SSH 登录服务器
ssh root@your-server-ip

# 2. 克隆项目（首次部署）
cd /www/wwwroot
git clone https://github.com/onedeploy1010/seo-websites-monorepo.git
cd seo-websites-monorepo

# 3. 创建环境变量文件
cp .env.production.example .env.production
nano .env.production  # 编辑配置

# 4. 运行一键部署
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

**脚本会自动完成：**
1. 拉取最新代码
2. 安装依赖
3. 生成 Prisma Client
4. 构建项目
5. 停止旧服务
6. 启动新服务

---

## 📝 手动部署步骤

如果您想了解每一步的细节，可以手动执行：

### 步骤 1: 准备服务器环境

```bash
# SSH 登录服务器
ssh root@your-server-ip

# 检查 Node.js 版本
node -v  # 应该是 v18 或更高

# 安装 pnpm（如果没有）
npm install -g pnpm

# 安装 PM2（如果没有）
npm install -g pm2

# 设置 PM2 开机自启
pm2 startup
```

### 步骤 2: 克隆代码（首次部署）

```bash
cd /www/wwwroot
git clone https://github.com/onedeploy1010/seo-websites-monorepo.git
cd seo-websites-monorepo
```

### 步骤 3: 配置环境变量

```bash
# 复制环境变量模板
cp .env.production.example .env.production

# 编辑环境变量
nano .env.production
```

**必须配置的变量：**

```bash
# 数据库连接（Supabase）
DATABASE_URL="postgresql://supabase_admin:your-password@your-project.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.your-project:your-password@your-project.supabase.co:5432/postgres"

# NextAuth 密钥（生成新的）
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="https://admin.telegram1688.com"

# 加密密钥
SETTINGS_ENCRYPTION_KEY="$(openssl rand -base64 48)"

# Tavily API（您已有）
TAVILY_API_KEY="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"

# 网站 URL（修改为您的域名）
NEXT_PUBLIC_WEBSITE1_URL="https://telegram1688.com"
NEXT_PUBLIC_WEBSITE2_URL="https://telegramjiaoyu.com"
NEXT_PUBLIC_WEBSITE_TG_URL="https://telegramzhfw.com"
```

保存并退出（Ctrl+X → Y → Enter）

### 步骤 4: 安装依赖

```bash
pnpm install
```

### 步骤 5: 初始化数据库

```bash
# 进入数据库目录
cd packages/database

# 运行数据库迁移
npx prisma migrate deploy

# 生成 Prisma Client
npx prisma generate

# 填充初始数据（可选）
npx tsx prisma/seed.ts

# 返回项目根目录
cd ../..
```

### 步骤 6: 更新生产域名

```bash
# 将 localhost 域名替换为真实域名
npx tsx scripts/update-production-domains.ts
```

### 步骤 7: 构建项目

```bash
pnpm build
```

### 步骤 8: 启动服务

```bash
# 启动 PM2
pm2 start ecosystem.config.js

# 保存 PM2 配置
pm2 save

# 设置开机自启
pm2 startup
```

### 步骤 9: 验证部署

```bash
# 查看服务状态
pm2 list

# 查看日志
pm2 logs

# 测试端口
curl http://localhost:3100  # Admin
curl http://localhost:3001  # Website 1
curl http://localhost:3002  # Website 2
curl http://localhost:3003  # Website TG
```

---

## 🔄 后续更新部署

当您修改代码并推送到 GitHub 后：

### 方法 1: 使用一键脚本（推荐）

```bash
cd /www/wwwroot/seo-websites-monorepo
./scripts/deploy.sh
```

### 方法 2: 手动更新

```bash
cd /www/wwwroot/seo-websites-monorepo

# 拉取最新代码
git pull origin master

# 安装新依赖（如果有）
pnpm install

# 重新生成 Prisma Client（如果数据库有变化）
cd packages/database && npx prisma generate && cd ../..

# 重新构建
pnpm build

# 重启服务
pm2 restart all

# 查看状态
pm2 list
```

---

## 🌐 配置 Nginx 反向代理

在 Baota 面板中为每个域名配置反向代理：

### Admin 后台

```nginx
# admin.telegram1688.com → http://127.0.0.1:3100

location / {
    proxy_pass http://127.0.0.1:3100;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### Website 1 的域名（8个）→ 端口 3002

```nginx
# telegram1688.com, telegram2688.com, 等 → http://127.0.0.1:3002

location / {
    proxy_pass http://127.0.0.1:3002;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### Website 2 的域名（4个）→ 端口 3003

```nginx
# telegramjiaoyu.com, telegramrmb28.com, 等 → http://127.0.0.1:3003

location / {
    proxy_pass http://127.0.0.1:3003;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### Website 3 的域名（3个）→ 端口 3001

```nginx
# telegramzhfw.com, xztelegram.com, 等 → http://127.0.0.1:3001

location / {
    proxy_pass http://127.0.0.1:3001;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

---

## 🔒 SSL 证书配置

在 Baota 面板中：

1. 进入"网站" → 选择域名
2. 点击"SSL"标签
3. 选择"Let's Encrypt"
4. 勾选所有域名（主域名 + 别名）
5. 点击"申请"

---

## 📊 监控和维护

### 查看服务状态

```bash
pm2 list
```

### 查看实时日志

```bash
pm2 logs

# 查看特定应用
pm2 logs seo-admin
pm2 logs seo-website-1
```

### 重启服务

```bash
# 重启所有
pm2 restart all

# 重启单个
pm2 restart seo-admin
```

### 停止服务

```bash
pm2 stop all
```

### 删除进程

```bash
pm2 delete all
```

### 查看资源使用

```bash
pm2 monit
```

---

## 🛠️ 常见问题

### Q1: 端口被占用

```bash
# 查找占用端口的进程
lsof -i :3100
lsof -i :3001
lsof -i :3002
lsof -i :3003

# 杀死进程
kill -9 <PID>
```

### Q2: 数据库连接失败

检查 `.env.production` 中的数据库连接字符串：

```bash
# 测试数据库连接
cd packages/database
npx prisma db pull
```

### Q3: 构建失败

```bash
# 清理缓存
rm -rf node_modules
rm -rf .next
rm -rf apps/*/. next
rm -rf apps/*/.turbo

# 重新安装
pnpm install

# 重新构建
pnpm build
```

### Q4: PM2 进程启动失败

```bash
# 查看错误日志
pm2 logs --err

# 删除旧配置
pm2 delete all
pm2 kill

# 重新启动
pm2 start ecosystem.config.js
```

### Q5: 网站无法访问

1. 检查 PM2 进程是否运行：`pm2 list`
2. 检查端口是否监听：`netstat -tlnp | grep 3100`
3. 检查 Nginx 配置：`nginx -t`
4. 检查防火墙：`firewall-cmd --list-ports`
5. 查看日志：`pm2 logs`

---

## 📦 备份和恢复

### 备份数据库

```bash
# 使用 Supabase Dashboard 的备份功能
# 或者使用 pg_dump
pg_dump -h your-project.supabase.co -U postgres.your-project -d postgres > backup.sql
```

### 备份代码

```bash
cd /www/wwwroot/seo-websites-monorepo
tar -czf seo-backup-$(date +%Y%m%d).tar.gz .
```

### 恢复

```bash
# 恢复代码
tar -xzf seo-backup-20250114.tar.gz

# 恢复数据库
psql -h your-project.supabase.co -U postgres.your-project -d postgres < backup.sql
```

---

## ✅ 部署检查清单

部署完成后，请逐项检查：

- [ ] 所有 PM2 进程正常运行
- [ ] 4 个端口都可以访问（3100, 3001, 3002, 3003）
- [ ] 所有 15 个域名的 DNS 已解析
- [ ] Nginx 反向代理配置正确
- [ ] SSL 证书已申请并自动续期
- [ ] 管理后台可以正常登录
- [ ] 前台网站可以正常访问
- [ ] 数据库连接正常
- [ ] 域名已更新为生产域名
- [ ] SEO API 配置正确（Tavily）
- [ ] PM2 已设置开机自启

---

## 🎯 下一步

部署完成后，您可以：

1. ✅ 登录管理后台修改默认密码
2. ✅ 配置 Google Search Console
3. ✅ 设置定时任务更新 SEO 数据
4. ✅ 配置 Google Analytics
5. ✅ 添加网站内容

---

需要帮助？查看更多文档：

- `docs/TAVILY-QUICK-START.md` - Tavily API 使用
- `docs/PRODUCTION-DOMAINS-SETUP.md` - 域名配置
- `docs/ACCESSIBLE-SEO-APIS.md` - SEO API 对比
