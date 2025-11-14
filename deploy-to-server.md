# 服务器部署指南

## 当前状态
✅ .env.local 文件已清理完成
✅ 启动脚本已创建 (start-admin.sh, start-website-1.sh, start-website-2.sh, start-website-tg.sh)
✅ PM2 配置文件已更新 (ecosystem.config.js)

## 部署步骤

### 1. 复制清理后的 .env.local 到服务器

在本地项目目录执行:
```bash
scp .env.local root@YOUR_SERVER_IP:/www/wwwroot/seo-websites-monorepo/
```

或者手动复制文件内容到服务器的 `/www/wwwroot/seo-websites-monorepo/.env.local`

### 2. 在服务器上安装 dotenv-cli (如果未安装)

```bash
npm install -g dotenv-cli
```

### 3. 拉取最新代码并部署

```bash
cd /www/wwwroot/seo-websites-monorepo

# 拉取最新代码
git pull origin master

# 安装依赖
pnpm install

# 生成 Prisma Client
npx prisma generate

# 构建所有应用
pnpm run build

# 赋予启动脚本执行权限
chmod +x start-*.sh

# 停止所有旧进程
pm2 delete all

# 启动所有应用
pm2 start ecosystem.config.js

# 保存 PM2 配置
pm2 save

# 查看运行状态
pm2 list
pm2 logs
```

### 4. 验证部署

检查所有应用是否正常运行:

```bash
# 检查进程状态 (应该都显示 "online")
pm2 list

# 测试各个应用
curl http://localhost:3100  # Admin
curl http://localhost:3001  # Website 1
curl http://localhost:3002  # Website 2
curl http://localhost:3003  # Website TG

# 检查日志
pm2 logs --lines 50
```

### 5. 测试线上访问

- Admin: https://admin.telegram1688.com
- Website 1: https://telegram1688.com
- Website 2: https://telegram2688.com
- Website TG: https://telegramcnfw.com

### 常见问题排查

#### 如果仍然出现 NO_SECRET 错误:

```bash
# 检查 .env.local 文件是否正确
cat /www/wwwroot/seo-websites-monorepo/.env.local | grep NEXTAUTH_SECRET

# 检查启动脚本是否有执行权限
ls -la /www/wwwroot/seo-websites-monorepo/start-*.sh

# 查看详细错误日志
pm2 logs seo-admin --lines 100
```

#### 如果构建失败:

```bash
# 清理缓存重新构建
pnpm clean
pnpm install
pnpm run build
```

#### 重启服务:

```bash
pm2 restart all
# 或单独重启某个应用
pm2 restart seo-admin
```

## 环境变量说明

当前 .env.local 包含以下关键配置:

- `DATABASE_URL`: PostgreSQL 数据库连接
- `NEXTAUTH_SECRET`: NextAuth 认证密钥
- `NEXTAUTH_URL`: Admin 后台地址
- `SETTINGS_ENCRYPTION_KEY`: 设置加密密钥
- `TAVILY_API_KEY`: Tavily API 密钥 (新增)
- `NEXT_PUBLIC_*`: 公开配置变量

所有配置都已优化,可以被 dotenv-cli 正确解析。
