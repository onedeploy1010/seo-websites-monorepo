# 🔐 NextAuth 配置完整指南

## 📋 概述

项目已经配置好 NextAuth.js，使用 **JWT 策略**（不需要数据库会话表）和 **邮箱+密码** 登录方式。

## ✅ 已配置内容

### 1. NextAuth 配置文件
- **位置**：`apps/admin/lib/auth.ts`
- **策略**：JWT（无状态）
- **提供商**：Credentials（邮箱+密码）
- **登录页**：`/login`

### 2. API 路由
- **位置**：`apps/admin/app/api/auth/[...nextauth]/route.ts`
- **端点**：`/api/auth/*`

### 3. 登录页面
- **路径**：`/login`
- **功能**：邮箱密码登录表单

## 🔧 环境变量配置

### 必需的环境变量（2 个）

NextAuth 只需要 **2 个环境变量**：

#### 1. NEXTAUTH_SECRET（必需）

用于加密 JWT token 和会话数据。

**生成方法：**
```bash
openssl rand -base64 32
```

**输出示例：**
```
K7h9Jx2Lm5Np8Qr3St6Vw9Yz1Bc4De7Fg0Hi3Jk6Mn9Pq2Rs5Tu8Vx1Yz4==
```

**配置：**
```env
NEXTAUTH_SECRET=K7h9Jx2Lm5Np8Qr3St6Vw9Yz1Bc4De7Fg0Hi3Jk6Mn9Pq2Rs5Tu8Vx1Yz4==
```

⚠️ **重要**：
- 每个环境（Production/Preview/Development）应使用不同的密钥
- 不要泄露此密钥
- 生产环境必须设置，否则无法启动

#### 2. NEXTAUTH_URL（必需）

应用的完整 URL，用于回调和重定向。

**本地开发：**
```env
NEXTAUTH_URL=http://localhost:3100
```

**Vercel 部署（无自定义域名）：**
```env
NEXTAUTH_URL=https://your-app-name.vercel.app
```

**Vercel 部署（有自定义域名）：**
```env
NEXTAUTH_URL=https://admin.yourdomain.com
```

⚠️ **注意**：
- 必须包含完整协议（`https://` 或 `http://`）
- **不要**在末尾添加斜杠
- Production 环境必须使用 HTTPS

## 📦 完整配置示例

### 本地开发 (.env.local)

```env
# 数据库
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/seo_monorepo"

# NextAuth
NEXTAUTH_SECRET="local-dev-secret-change-in-production"
NEXTAUTH_URL="http://localhost:3100"

# OpenAI（可选，可在后台设置）
OPENAI_API_KEY="sk-your-api-key"

# 设置加密（可选）
SETTINGS_ENCRYPTION_KEY="local-encryption-key"
```

### Vercel Production

在 Vercel Dashboard → Settings → Environment Variables 添加：

| 变量名 | 值 | 环境 |
|--------|-----|------|
| `DATABASE_URL` | `postgresql://user:pass@host/db?sslmode=require` | Production |
| `NEXTAUTH_SECRET` | `K7h9Jx...` (生成的密钥) | Production |
| `NEXTAUTH_URL` | `https://admin.yourdomain.com` | Production |
| `NEXT_PUBLIC_SITE_NAME` | `SEO 管理后台` | Production |
| `SETTINGS_ENCRYPTION_KEY` | `wxyz9876...` (可选) | Production |

## 🚀 部署流程

### 方案 A：先部署，后更新 URL（无自定义域名）

**步骤 1：首次部署**

使用临时 URL：
```env
NEXTAUTH_URL=https://temp.vercel.app
```

点击 Deploy

**步骤 2：获取实际 URL**

部署完成后，Vercel 会分配 URL，如：
```
https://seo-admin-abc123.vercel.app
```

**步骤 3：更新环境变量**

1. 进入 Settings → Environment Variables
2. 编辑 `NEXTAUTH_URL`：
   ```env
   NEXTAUTH_URL=https://seo-admin-abc123.vercel.app
   ```
3. 保存

**步骤 4：重新部署**

- 方法 1：Deployments → 最新部署 → ⋯ → Redeploy
- 方法 2：推送新 commit

### 方案 B：使用自定义域名（推荐）

**步骤 1：提前规划域名**

决定使用的域名，如 `admin.yourdomain.com`

**步骤 2：配置环境变量**

直接使用最终域名：
```env
NEXTAUTH_URL=https://admin.yourdomain.com
```

**步骤 3：部署**

点击 Deploy

**步骤 4：添加自定义域名**

1. Settings → Domains
2. 添加 `admin.yourdomain.com`
3. 配置 DNS（CNAME 记录）：
   ```
   Type: CNAME
   Name: admin
   Value: cname.vercel-dns.com
   ```
4. 等待 DNS 生效（几分钟到几小时）

## 🔑 生成所有必需密钥

一键生成所有密钥的脚本：

```bash
#!/bin/bash

echo "==================================="
echo "  生成 NextAuth 和加密密钥"
echo "==================================="
echo ""

# 生成 NEXTAUTH_SECRET
NEXTAUTH_SECRET=$(openssl rand -base64 32)
echo "NEXTAUTH_SECRET:"
echo "$NEXTAUTH_SECRET"
echo ""

# 生成 SETTINGS_ENCRYPTION_KEY
ENCRYPTION_KEY=$(openssl rand -base64 32)
echo "SETTINGS_ENCRYPTION_KEY:"
echo "$ENCRYPTION_KEY"
echo ""

echo "==================================="
echo "  复制以下内容到 Vercel 环境变量"
echo "==================================="
echo ""
echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET"
echo "SETTINGS_ENCRYPTION_KEY=$ENCRYPTION_KEY"
echo "NEXTAUTH_URL=https://your-domain.vercel.app  # 改为实际域名"
echo "DATABASE_URL=postgresql://...  # 数据库连接字符串"
echo ""
```

保存为 `generate-keys.sh`，然后运行：
```bash
chmod +x generate-keys.sh
./generate-keys.sh
```

## 🧪 验证配置

### 1. 检查环境变量

访问 Vercel 项目：
- Settings → Environment Variables
- 确认 `NEXTAUTH_SECRET` 和 `NEXTAUTH_URL` 已设置

### 2. 测试登录流程

1. 访问 `https://your-domain.vercel.app/login`
2. 输入默认账户：
   - Email: `admin@example.com`
   - Password: `admin123`
3. 点击登录

**预期结果：**
- ✅ 成功登录并跳转到 `/dashboard`
- ✅ 侧边栏显示用户名和邮箱
- ✅ 可以正常访问其他页面

### 3. 检查浏览器控制台

打开浏览器开发者工具（F12）：
- ❌ 如果看到 CORS 错误 → `NEXTAUTH_URL` 配置不正确
- ❌ 如果看到 401 错误 → 检查数据库连接
- ❌ 如果看到 redirect 循环 → `NEXTAUTH_URL` 与实际访问 URL 不匹配

## 🐛 常见问题

### 问题 1：登录后立即退出

**原因**：`NEXTAUTH_URL` 与实际访问的 URL 不一致

**解决方案**：
```bash
# 检查实际访问的 URL
echo "访问 URL: $(curl -s https://your-app.vercel.app | grep canonical)"

# 确保 NEXTAUTH_URL 完全匹配（包括协议和域名）
```

**示例：**
```env
# ❌ 错误
NEXTAUTH_URL=http://admin.yourdomain.com  # 缺少 https
NEXTAUTH_URL=https://admin.yourdomain.com/  # 多了斜杠

# ✅ 正确
NEXTAUTH_URL=https://admin.yourdomain.com
```

### 问题 2：Missing NEXTAUTH_SECRET

**错误信息**：
```
Error: Please define the NEXTAUTH_SECRET environment variable
```

**解决方案**：
1. 生成密钥：`openssl rand -base64 32`
2. 在 Vercel 添加环境变量
3. 重新部署

### 问题 3：Invalid credentials（凭据无效）

**原因**：
- 数据库未初始化
- 用户不存在
- 密码错误

**解决方案**：
```bash
# 运行数据库迁移和种子数据
cd packages/database
npm run db:push
npm run db:seed
```

默认账户会被创建：
- Email: `admin@example.com`
- Password: `admin123`

### 问题 4：CSRF Token 错误

**原因**：跨域请求问题

**解决方案**：
确保 `NEXTAUTH_URL` 与前端访问域名一致

### 问题 5：Session 无法持久化

**原因**：Cookie 设置问题

**检查**：
1. 确保使用 HTTPS（生产环境）
2. 检查浏览器 Cookie 设置
3. 查看 Application → Cookies → `next-auth.session-token`

## 🔒 安全最佳实践

### 1. 使用强密钥

```bash
# ❌ 弱密钥
NEXTAUTH_SECRET=secret123

# ✅ 强密钥（至少 32 字节）
NEXTAUTH_SECRET=$(openssl rand -base64 32)
```

### 2. 不同环境使用不同密钥

```env
# Production
NEXTAUTH_SECRET=prod-key-abc123...

# Preview
NEXTAUTH_SECRET=preview-key-def456...

# Development
NEXTAUTH_SECRET=dev-key-ghi789...
```

在 Vercel 中为每个环境单独配置。

### 3. 定期轮换密钥

建议每 3-6 个月轮换一次 `NEXTAUTH_SECRET`。

⚠️ **注意**：轮换密钥会使所有现有会话失效，用户需要重新登录。

### 4. 启用 HTTPS Only

生产环境必须使用 HTTPS：
```env
NEXTAUTH_URL=https://admin.yourdomain.com  # ✅
```

### 5. 设置环境变量权限

在 Vercel 中：
- Production 环境变量仅在 Production 可用
- 敏感变量不要暴露到客户端（不使用 `NEXT_PUBLIC_` 前缀）

## 📊 环境变量对照表

| 环境变量 | 必需 | 默认值 | 说明 |
|---------|------|--------|------|
| `DATABASE_URL` | ✅ | 无 | PostgreSQL 连接字符串 |
| `NEXTAUTH_SECRET` | ✅ | 无 | JWT 签名密钥（32+ 字节） |
| `NEXTAUTH_URL` | ✅ | 无 | 完整应用 URL（含协议） |
| `NEXT_PUBLIC_SITE_NAME` | ❌ | `SEO Manager` | 网站名称 |
| `SETTINGS_ENCRYPTION_KEY` | ❌ | 默认密钥 | 设置加密密钥 |
| `OPENAI_API_KEY` | ❌ | 无 | 可在后台配置 |

## 🎯 快速检查清单

部署前检查：

- [ ] 已生成 `NEXTAUTH_SECRET`（32+ 字节）
- [ ] 已设置 `NEXTAUTH_URL`（完整 URL，含 https://）
- [ ] 已配置 `DATABASE_URL`
- [ ] 已运行 `db:push` 和 `db:seed`
- [ ] URL 末尾没有斜杠
- [ ] Production 使用 HTTPS

部署后检查：

- [ ] 可以访问 `/login` 页面
- [ ] 可以使用默认账户登录
- [ ] 登录后不会立即退出
- [ ] Dashboard 正常显示
- [ ] 浏览器控制台无错误

## 📚 相关资源

- [NextAuth.js 官方文档](https://next-auth.js.org)
- [Vercel 环境变量文档](https://vercel.com/docs/environment-variables)
- [部署指南](./DEPLOYMENT.md)
- [系统设置文档](./SYSTEM-SETTINGS.md)

---

## 💡 提示

如果遇到问题：
1. 检查 Vercel Deployment Logs（构建日志）
2. 检查 Vercel Function Logs（运行时日志）
3. 检查浏览器控制台
4. 验证环境变量拼写和值

需要帮助？查看上面的"常见问题"部分！
