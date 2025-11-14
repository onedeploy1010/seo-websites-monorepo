# 🚀 服务器部署快速指南

## ✨ 一键部署（推荐）

### 在服务器上执行：

```bash
# 1. SSH 登录服务器
ssh root@your-server-ip

# 2. 进入项目目录（或首次克隆）
cd /www/wwwroot/seo-websites-monorepo
# 或首次部署: git clone https://github.com/onedeploy1010/seo-websites-monorepo.git

# 3. 首次部署：创建环境变量文件
cp .env.production.example .env.production
nano .env.production  # 填入实际配置

# 4. 运行一键部署
./scripts/deploy.sh
```

**就这么简单！** 🎉

脚本会自动完成所有步骤：拉取代码 → 安装依赖 → 构建 → 重启服务

---

## 📋 必须配置的环境变量

编辑 `.env.production` 文件，填入以下关键配置：

```bash
# 数据库（Supabase）
DATABASE_URL="postgresql://supabase_admin:your-password@your-project.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1"

# 管理后台地址
NEXTAUTH_URL="https://admin.telegram1688.com"

# 密钥（使用 openssl rand -base64 32 生成）
NEXTAUTH_SECRET="your-secret-key"
SETTINGS_ENCRYPTION_KEY="your-encryption-key"

# Tavily API（已提供）
TAVILY_API_KEY="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"

# 网站 URL
NEXT_PUBLIC_WEBSITE1_URL="https://telegram1688.com"
NEXT_PUBLIC_WEBSITE2_URL="https://telegramjiaoyu.com"
NEXT_PUBLIC_WEBSITE_TG_URL="https://telegramzhfw.com"
```

---

## 🔄 后续更新

每次修改代码后，在服务器上执行：

```bash
cd /www/wwwroot/seo-websites-monorepo
./scripts/deploy.sh
```

**完成！** 🎉

---

## 🌐 配置 Nginx

在 Baota 面板中为每个域名创建站点并配置反向代理：

| 应用 | 端口 | 域名 |
|------|------|------|
| Admin | 3100 | admin.telegram1688.com |
| Website 1 | 3002 | telegram1688.com + 7个别名 |
| Website 2 | 3003 | telegramjiaoyu.com + 3个别名 |
| Website 3 | 3001 | telegramzhfw.com + 2个别名 |

反向代理配置：
```nginx
location / {
    proxy_pass http://127.0.0.1:3100;  # 改成对应端口
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

---

## ✅ 验证部署

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

## 📚 详细文档

- **完整部署指南**: `docs/DEPLOYMENT-GUIDE.md`
- **生产域名配置**: `docs/PRODUCTION-DOMAINS-SETUP.md`
- **Tavily API 使用**: `docs/TAVILY-QUICK-START.md`
- **SEO API 对比**: `docs/ACCESSIBLE-SEO-APIS.md`

---

## 🆘 常见问题

**Q: 端口被占用？**
```bash
lsof -i :3100
kill -9 <PID>
```

**Q: 服务无法启动？**
```bash
pm2 logs --err
pm2 delete all
pm2 start ecosystem.config.js
```

**Q: 网站无法访问？**
1. 检查 PM2: `pm2 list`
2. 检查 Nginx: `nginx -t`
3. 检查防火墙: `firewall-cmd --list-ports`

---

## 🎯 部署完成后

1. ✅ 访问管理后台：https://admin.telegram1688.com
2. ✅ 默认账号：admin@example.com / admin123
3. ✅ **立即修改密码**
4. ✅ 运行域名更新：`npx tsx scripts/update-production-domains.ts`
5. ✅ 配置 SSL 证书
6. ✅ 测试所有域名

---

需要帮助？查看详细文档或联系技术支持！
