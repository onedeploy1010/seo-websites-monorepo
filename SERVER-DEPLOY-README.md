# 服务器部署指南

## 🚨 遇到错误？先运行这个！

```bash
cd /www/wwwroot/seo-websites-monorepo
git fetch origin master
git reset --hard origin/master
bash scripts/deploy/quick-fix.sh
```

这个脚本会：
- ✅ 检查所有配置是否正确
- ✅ 自动修复常见问题
- ✅ 显示清晰的诊断报告
- ✅ 提供具体的修复建议

---

## 📋 完整部署步骤（从头开始）

### 方法 1：使用交互式菜单（推荐）

```bash
cd /www/wwwroot/seo-websites-monorepo
git fetch origin master
git reset --hard origin/master
bash menu.sh
```

然后选择选项 2（强制部署）

### 方法 2：直接命令行部署

```bash
cd /www/wwwroot/seo-websites-monorepo
git fetch origin master
git reset --hard origin/master
bash scripts/deploy/deploy-force.sh
```

### 方法 3：手动一步步部署（如果自动脚本失败）

```bash
cd /www/wwwroot/seo-websites-monorepo

# 1. 拉取最新代码
git fetch origin master
git reset --hard origin/master

# 2. 更新环境变量
bash scripts/deploy/update-env.sh

# 3. 安装 dotenv-cli
npm install -g dotenv-cli

# 4. 安装依赖
pnpm install

# 5. 生成 Prisma Client
npx prisma generate --schema=packages/database/prisma/schema.prisma

# 6. 构建所有应用
pnpm run build

# 7. 停止旧服务
pm2 delete all

# 8. 启动新服务
pm2 start ecosystem.config.js

# 9. 保存 PM2 配置
pm2 save

# 10. 查看状态
pm2 list
```

---

## 🔍 故障排查

### 问题 1: DATABASE_URL 环境变量未找到

**症状：**
```
error: Environment variable not found: DATABASE_URL
```

**解决方案：**
```bash
# 更新环境变量文件
bash scripts/deploy/update-env.sh

# 重启服务
pm2 restart all
```

### 问题 2: NEXTAUTH_SECRET 未找到 (NO_SECRET 错误)

**症状：**
```
[NO_SECRET] Please define a 'secret' in production
```

**解决方案：**
```bash
# 更新环境变量文件
bash scripts/deploy/update-env.sh

# 确保 dotenv-cli 已安装
npm install -g dotenv-cli

# 重启服务
pm2 restart all
```

### 问题 3: 502 Bad Gateway

**症状：**
网站显示 502 错误

**解决方案：**
```bash
# 使用修复脚本
bash scripts/deploy/fix-502.sh

# 或查看诊断信息
bash scripts/deploy/diagnose-502.sh
```

### 问题 4: Prisma schema 找不到

**症状：**
```
Could not find Prisma Schema
```

**解决方案：**
```bash
# 使用正确的 schema 路径
npx prisma generate --schema=packages/database/prisma/schema.prisma
```

### 问题 5: Git 冲突无法拉取代码

**症状：**
```
error: Your local changes to the following files would be overwritten by merge
```

**解决方案：**
```bash
# 使用强制部署脚本
bash scripts/deploy/deploy-force.sh
```

---

## 📊 验证部署成功

### 1. 检查 PM2 状态

```bash
pm2 list
```

所有服务应该显示 **online** 状态：
- seo-admin (端口 3100)
- seo-website-1 (端口 3001)
- seo-website-2 (端口 3002)
- seo-website-tg (端口 3003)

### 2. 测试本地端口

```bash
curl http://localhost:3100  # Admin
curl http://localhost:3001  # Website 1
curl http://localhost:3002  # Website 2
curl http://localhost:3003  # Website TG
```

所有应该返回 HTTP 200 状态码

### 3. 测试线上域名

- Admin: https://admin.telegram1688.com
- Website 1: https://telegram1688.com
- Website 2: https://telegram2688.com
- Website TG: https://telegramcnfw.com

### 4. 查看日志

```bash
# 查看所有日志
pm2 logs --lines 50

# 查看特定应用日志
pm2 logs seo-admin --lines 50
```

---

## 🛠️ 常用命令

### 服务管理

```bash
# 查看服务状态
pm2 list

# 重启所有服务
pm2 restart all

# 重启单个服务
pm2 restart seo-admin

# 停止所有服务
pm2 stop all

# 查看日志
pm2 logs

# 清空日志
pm2 flush
```

### 部署更新

```bash
# 快速更新（无 Git 冲突）
cd /www/wwwroot/seo-websites-monorepo
git pull origin master
pnpm install
pnpm run build
pm2 restart all

# 完整部署（包含环境变量更新）
bash scripts/deploy/deploy-complete.sh

# 强制部署（解决 Git 冲突）
bash scripts/deploy/deploy-force.sh
```

### 测试工具

```bash
# 测试本地端口
bash -c 'for port in 3100 3001 3002 3003; do echo "Testing port $port:"; curl -I http://localhost:$port 2>&1 | head -3; echo ""; done'

# 测试环境变量加载
dotenv -e .env.local -- node -e "console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'OK' : 'MISSING')"
```

---

## 📝 文件说明

### 根目录脚本

- `menu.sh` - 交互式管理菜单
- `start-admin.sh` - Admin 启动脚本（PM2 使用）
- `start-website-1.sh` - Website-1 启动脚本
- `start-website-2.sh` - Website-2 启动脚本
- `start-website-tg.sh` - Website-TG 启动脚本

### scripts/deploy/ 脚本

- `quick-fix.sh` - 快速诊断和修复 ⭐
- `deploy-complete.sh` - 一键完整部署
- `deploy-force.sh` - 强制部署（解决 Git 冲突）
- `update-env.sh` - 更新环境变量
- `fix-502.sh` - 修复 502 错误
- `diagnose-502.sh` - 诊断 502 错误

---

## 🆘 获取帮助

如果上述方法都无法解决问题：

1. 运行诊断脚本获取详细信息：
   ```bash
   bash scripts/deploy/quick-fix.sh
   ```

2. 查看完整错误日志：
   ```bash
   pm2 logs --lines 100 --err
   ```

3. 检查系统日志：
   ```bash
   tail -100 /www/wwwlogs/seo-admin-error.log
   tail -100 /www/wwwlogs/seo-website-1-error.log
   ```

4. 把错误信息发给开发人员
