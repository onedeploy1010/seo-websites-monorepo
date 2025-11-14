# 🔧 服务器环境变量错误修复指南

## 问题症状

如果您在服务器上看到以下错误：

```
error: Environment variable not found: DATABASE_URL
error: Please define a `secret` in production (NEXTAUTH_SECRET)
PM2 log: Script had too many unstable restarts (10). Stopped.
```

说明环境变量配置有问题，请按照以下步骤修复。

---

## 🚀 快速修复（推荐）

在服务器上执行：

```bash
# 1. 进入项目目录
cd /www/wwwroot/seo-websites-monorepo

# 2. 拉取最新代码
git pull origin master

# 3. 运行修复脚本
chmod +x scripts/fix-server-deployment.sh
./scripts/fix-server-deployment.sh
```

修复脚本会自动：
- ✅ 检查环境变量文件
- ✅ 验证所有必需的环境变量
- ✅ 停止旧的 PM2 进程
- ✅ 重新生成 Prisma Client
- ✅ 使用新的 ecosystem.config.js 启动服务
- ✅ 保存 PM2 配置

---

## 📝 手动修复步骤

如果快速修复失败，请按照以下详细步骤操作：

### 步骤 1: 检查环境变量文件

```bash
cd /www/wwwroot/seo-websites-monorepo

# 检查 .env.production 是否存在
ls -la .env.production
```

如果文件不存在，创建它：

```bash
cp .env.production.example .env.production
nano .env.production
```

### 步骤 2: 配置必需的环境变量

编辑 `.env.production`，确保包含以下变量：

```bash
# 数据库配置（必需）
DATABASE_URL="postgresql://supabase_admin:your-password@your-project.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1"

# NextAuth 配置（必需）
NEXTAUTH_SECRET="your-secret-key-here"  # 使用: openssl rand -base64 32
NEXTAUTH_URL="https://admin.telegram1688.com"

# 加密密钥（必需）
SETTINGS_ENCRYPTION_KEY="your-encryption-key"  # 使用: openssl rand -base64 48

# Tavily API（可选，用于 SEO 数据更新）
TAVILY_API_KEY="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"

# 网站 URL（必需）
NEXT_PUBLIC_WEBSITE1_URL="https://telegram1688.com"
NEXT_PUBLIC_WEBSITE2_URL="https://telegramjiaoyu.com"
NEXT_PUBLIC_WEBSITE_TG_URL="https://telegramzhfw.com"
```

### 步骤 3: 生成密钥

如果需要生成新的密钥：

```bash
# 生成 NEXTAUTH_SECRET
openssl rand -base64 32

# 生成 SETTINGS_ENCRYPTION_KEY
openssl rand -base64 48
```

### 步骤 4: 停止所有 PM2 进程

```bash
pm2 delete all
```

### 步骤 5: 重新生成 Prisma Client

```bash
cd /www/wwwroot/seo-websites-monorepo/packages/database
source ../../.env.production
DATABASE_URL=$DATABASE_URL npx prisma generate
cd ../..
```

### 步骤 6: 启动服务

```bash
# 使用新的 ecosystem.config.js 启动
pm2 start ecosystem.config.js

# 保存配置
pm2 save

# 查看状态
pm2 list
```

### 步骤 7: 验证服务

```bash
# 查看日志
pm2 logs

# 查看特定应用日志
pm2 logs seo-admin
pm2 logs seo-website-1

# 检查端口
curl http://localhost:3100  # Admin
curl http://localhost:3001  # Website 1
curl http://localhost:3002  # Website 2
curl http://localhost:3003  # Website TG
```

---

## 🔍 问题诊断

### 问题 1: DATABASE_URL 找不到

**错误信息:**
```
error: Environment variable not found: DATABASE_URL
```

**解决方案:**
1. 确认 `.env.production` 文件存在
2. 确认文件中有 `DATABASE_URL=...` 行
3. 确认 DATABASE_URL 值正确（Supabase 连接字符串）
4. 重新启动服务：`pm2 restart all`

### 问题 2: NEXTAUTH_SECRET 缺失

**错误信息:**
```
[next-auth][error][NO_SECRET] Please define a `secret` in production
```

**解决方案:**
1. 生成密钥：`openssl rand -base64 32`
2. 添加到 `.env.production`：`NEXTAUTH_SECRET="生成的密钥"`
3. 重新启动：`pm2 restart seo-admin`

### 问题 3: PM2 不断重启

**错误信息:**
```
PM2 log: Script had too many unstable restarts (10). Stopped.
```

**原因:**
- 环境变量缺失导致应用启动失败
- 使用了已删除的 `start-*.sh` 脚本

**解决方案:**
1. 删除所有进程：`pm2 delete all`
2. 确保环境变量配置正确
3. 使用新配置启动：`pm2 start ecosystem.config.js`

### 问题 4: 端口被占用

**错误信息:**
```
Error: listen EADDRINUSE: address already in use :::3100
```

**解决方案:**
```bash
# 查找占用端口的进程
lsof -i :3100

# 杀死进程
kill -9 <PID>

# 或者停止所有 PM2 进程
pm2 delete all

# 重新启动
pm2 start ecosystem.config.js
```

---

## 📊 验证清单

完成修复后，请验证以下项目：

- [ ] `.env.production` 文件存在且包含所有必需变量
- [ ] `DATABASE_URL` 可以连接到 Supabase
- [ ] `NEXTAUTH_SECRET` 已设置
- [ ] PM2 显示所有 4 个服务都在运行
- [ ] 所有服务状态为 `online`
- [ ] 日志中没有错误信息
- [ ] 可以通过端口访问各个服务
- [ ] 可以通过域名访问网站

---

## 🎯 ecosystem.config.js 更新说明

最新的 `ecosystem.config.js` 配置：

### 主要变化
1. **移除了 start-*.sh 脚本** - 直接使用 `next start` 命令
2. **添加了 env_file** - 从 `.env.production` 自动加载环境变量
3. **更新了 cwd** - 指向各个应用的目录
4. **简化了 env** - 只保留 NODE_ENV 和 PORT

### 优势
- ✅ 不再依赖外部脚本
- ✅ 环境变量管理更集中
- ✅ 更容易调试和维护
- ✅ 与 Next.js 最佳实践一致

---

## 💡 最佳实践

1. **环境变量管理**
   - 所有环境变量集中在 `.env.production`
   - 使用强密钥（至少 32 字符）
   - 定期轮换密钥

2. **PM2 管理**
   - 使用 `pm2 save` 保存配置
   - 定期查看日志：`pm2 logs`
   - 监控内存使用：`pm2 monit`

3. **定期维护**
   - 每周检查日志
   - 每月更新依赖
   - 每季度更新密钥

---

## 🆘 需要帮助？

如果问题仍未解决：

1. 查看完整日志：
   ```bash
   pm2 logs --lines 100
   tail -n 100 /www/wwwlogs/seo-admin-error.log
   ```

2. 检查 PM2 配置：
   ```bash
   pm2 show seo-admin
   ```

3. 验证环境变量：
   ```bash
   source .env.production
   echo $DATABASE_URL
   echo $NEXTAUTH_SECRET
   ```

4. 查看其他文档：
   - `docs/deployment/DEPLOYMENT-GUIDE.md` - 完整部署指南
   - `docs/deployment/BAOTA-COMPLETE-GUIDE.md` - 宝塔面板配置
   - `DEPLOYMENT.md` - 快速部署参考

---

**最后更新:** 2025-11-14
