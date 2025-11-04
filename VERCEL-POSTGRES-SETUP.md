# 🗄️ Vercel Postgres 数据库配置指南

## 📋 概述

Vercel Postgres 是 Vercel 提供的托管 PostgreSQL 数据库服务，与 Vercel 项目无缝集成。

**优势：**
- ✅ 自动集成环境变量
- ✅ 无需手动配置连接字符串
- ✅ 免费套餐可用（适合开发和小型项目）
- ✅ 自动备份和扩展
- ✅ 低延迟（与 Vercel 函数在同一区域）

## 🚀 完整配置步骤

### 步骤 1：创建 Vercel Postgres 数据库

#### 方式 A：通过项目界面创建（推荐）

1. **登录 Vercel Dashboard**
   - 访问 https://vercel.com/dashboard

2. **进入项目**
   - 选择你的项目（如 `seo-admin`）
   - 点击 **Storage** 标签

3. **创建数据库**
   - 点击 **Create Database**
   - 选择 **Postgres**
   - 数据库名称：`seo-monorepo-db`（或你喜欢的名称）
   - 区域：选择与你的应用相同的区域（建议 `hnd1` - 东京）
   - 点击 **Create**

4. **连接到项目**
   - 创建完成后，会提示 "Connect to Project"
   - 选择你的项目（如 `seo-admin`）
   - 勾选要使用的环境：
     - ✅ Production
     - ✅ Preview
     - ✅ Development（可选）
   - 点击 **Connect**

#### 方式 B：通过 Storage 界面创建

1. 访问 https://vercel.com/dashboard/stores
2. 点击 **Create Database**
3. 选择 **Postgres**
4. 填写信息并创建
5. 创建后手动连接到项目

### 步骤 2：验证环境变量

数据库创建并连接后，Vercel 会**自动**添加以下环境变量到你的项目：

```env
POSTGRES_URL="postgres://default:xxx@xxx-pooler.us-east-1.postgres.vercel-storage.com/verceldb?sslmode=require"
POSTGRES_PRISMA_URL="postgres://default:xxx@xxx-pooler.us-east-1.postgres.vercel-storage.com/verceldb?sslmode=require&pgbouncer=true&connect_timeout=15"
POSTGRES_URL_NO_SSL="postgres://default:xxx@xxx-pooler.us-east-1.postgres.vercel-storage.com/verceldb"
POSTGRES_URL_NON_POOLING="postgres://default:xxx@xxx.us-east-1.postgres.vercel-storage.com/verceldb?sslmode=require"
POSTGRES_USER="default"
POSTGRES_HOST="xxx-pooler.us-east-1.postgres.vercel-storage.com"
POSTGRES_PASSWORD="xxx"
POSTGRES_DATABASE="verceldb"
```

**检查方式：**
1. 进入项目 Settings → Environment Variables
2. 确认看到以上变量

### 步骤 3：配置 Prisma 使用 Vercel Postgres

我们需要使用 `POSTGRES_PRISMA_URL`（专为 Prisma 优化的连接池）。

#### 更新环境变量映射

在 Vercel 环境变量中添加：

| 变量名 | 值 | 环境 |
|--------|-----|------|
| `DATABASE_URL` | 使用引用：`$POSTGRES_PRISMA_URL` | Production, Preview |

**或者直接复制值：**

| 变量名 | 值 | 环境 |
|--------|-----|------|
| `DATABASE_URL` | `postgres://default:xxx@...?sslmode=require&pgbouncer=true` | Production, Preview |

⚠️ **注意**：必须使用 `POSTGRES_PRISMA_URL`，而不是 `POSTGRES_URL`！

**原因：**
- `POSTGRES_PRISMA_URL` 包含 `pgbouncer=true`，支持连接池
- `POSTGRES_URL` 是直连，会导致连接数过多

### 步骤 4：本地开发配置

#### 方案 A：使用 Vercel Postgres（推荐）

**拉取环境变量：**

```bash
# 安装 Vercel CLI（如果还没安装）
npm i -g vercel

# 登录 Vercel
vercel login

# 链接项目
vercel link

# 拉取环境变量到本地
vercel env pull .env.local
```

这会创建 `.env.local` 文件，包含所有 Vercel 环境变量。

#### 方案 B：手动配置本地连接

1. **在 Vercel Storage 中查看连接字符串**
   - Storage → Postgres → `.env.local` 标签
   - 复制 `POSTGRES_PRISMA_URL`

2. **创建本地环境文件**

```bash
# packages/database/.env
DATABASE_URL="postgres://default:xxx@...?sslmode=require&pgbouncer=true"
```

### 步骤 5：运行数据库迁移

#### 首次迁移（Vercel 环境）

Vercel Postgres 数据库创建后是空的，需要运行迁移。

**方法 1：使用 Vercel CLI（推荐）**

```bash
# 1. 拉取环境变量
vercel env pull .env.local

# 2. 运行迁移
cd packages/database
npx dotenv -e ../../.env.local -- npx prisma db push

# 3. 创建初始用户
npx dotenv -e ../../.env.local -- npx prisma db seed
```

**方法 2：在本地使用生产数据库连接**

```bash
# 1. 设置环境变量
export DATABASE_URL="postgres://default:xxx@...?sslmode=require&pgbouncer=true"

# 2. 运行迁移
cd packages/database
npm run db:push

# 3. 创建初始用户
npm run db:seed
```

**方法 3：通过 Vercel 部署后的函数**

如果上述方法不可行，可以创建一个临时 API 端点：

```typescript
// apps/admin/app/api/setup-db/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@repo/database'
import { hash } from 'bcryptjs'

export async function GET() {
  try {
    // 检查是否已有用户
    const existingUser = await prisma.user.count()
    if (existingUser > 0) {
      return NextResponse.json({ message: 'Database already initialized' })
    }

    // 创建管理员用户
    const hashedPassword = await hash('admin123', 10)
    await prisma.user.create({
      data: {
        email: 'admin@example.com',
        name: 'Admin',
        password: hashedPassword,
        role: 'ADMIN',
      },
    })

    return NextResponse.json({ message: 'Database initialized successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
```

部署后访问：`https://your-app.vercel.app/api/setup-db`

⚠️ **完成后删除此文件！**

### 步骤 6：验证数据库连接

**使用 Prisma Studio（本地）：**

```bash
cd packages/database
npx prisma studio
```

浏览器会打开 http://localhost:5555，可以查看数据库内容。

**使用 Vercel Dashboard：**

1. Storage → Postgres → 你的数据库
2. 点击 **Query** 标签
3. 运行 SQL 查询：
   ```sql
   SELECT * FROM users;
   ```

应该能看到 `admin@example.com` 用户。

## 📊 完整环境变量清单

### Vercel 项目环境变量

| 变量名 | 值 | 来源 | 必需 |
|--------|-----|------|------|
| `POSTGRES_URL` | 自动生成 | Vercel | ✅ |
| `POSTGRES_PRISMA_URL` | 自动生成 | Vercel | ✅ |
| `DATABASE_URL` | `$POSTGRES_PRISMA_URL` | 手动映射 | ✅ |
| `NEXTAUTH_SECRET` | 生成的密钥 | 手动 | ✅ |
| `NEXTAUTH_URL` | `https://your-domain.vercel.app` | 手动 | ✅ |
| `SETTINGS_ENCRYPTION_KEY` | 生成的密钥 | 手动 | ❌ |
| `NEXT_PUBLIC_SITE_NAME` | `SEO 管理后台` | 手动 | ❌ |

### 本地开发（.env.local）

```env
# 从 Vercel 拉取
DATABASE_URL="postgres://default:xxx@...?sslmode=require&pgbouncer=true"

# 本地配置
NEXTAUTH_SECRET="local-dev-secret"
NEXTAUTH_URL="http://localhost:3100"
SETTINGS_ENCRYPTION_KEY="local-encryption-key"
```

## 🔄 多项目共享同一个数据库

如果你有多个 Vercel 项目（admin、website-1、website-2、website-tg），它们可以共享同一个数据库：

### 方法 1：使用相同的连接字符串

在每个项目的环境变量中添加：

```env
DATABASE_URL=postgres://default:xxx@...?sslmode=require&pgbouncer=true
```

### 方法 2：连接数据库到多个项目

1. Storage → Postgres → 你的数据库
2. 点击 **Settings** → **Connected Projects**
3. 点击 **Connect Project**
4. 选择其他项目（如 `seo-website-1`）
5. 重复步骤连接所有项目

这样每个项目都会自动获得数据库环境变量。

## 💰 定价和限制

### 免费套餐（Hobby）

- ✅ 256 MB 存储
- ✅ 60 小时计算时间/月
- ✅ 适合开发和测试

### Pro 套餐

- ✅ 512 MB 存储起步
- ✅ 100 小时计算时间/月
- ✅ 适合生产环境

### 使用建议

**对于此项目：**
- **开发阶段**：免费套餐足够
- **生产环境**：建议升级到 Pro（$20/月起）

**监控用量：**
- Storage → Postgres → Usage 标签
- 查看存储和计算时间使用情况

## 🔒 安全最佳实践

### 1. 连接字符串安全

✅ **正确做法：**
- 使用 Vercel 环境变量
- 不要硬编码连接字符串
- 不要提交 `.env.local` 到 Git

❌ **错误做法：**
```typescript
const db = new PrismaClient({
  datasourceUrl: 'postgres://user:pass@host/db' // 永远不要这样！
})
```

### 2. 使用连接池

必须使用 `POSTGRES_PRISMA_URL`（带 `pgbouncer=true`），否则会耗尽连接数。

### 3. 限制访问

Vercel Postgres 默认只允许 Vercel 网络访问。

**如需本地访问：**
- 使用 `vercel env pull`
- 或在 Vercel Dashboard 启用外部访问（不推荐）

### 4. 定期备份

Vercel Postgres 自动备份，但建议：
- 定期导出重要数据
- 使用版本控制管理 schema

## 🐛 常见问题

### 问题 1: "Can't reach database server"

**原因**：
- 连接字符串错误
- 网络问题
- 数据库未启动

**解决方案：**
```bash
# 1. 检查连接字符串
echo $DATABASE_URL

# 2. 测试连接
npx prisma db execute --stdin <<< "SELECT 1"

# 3. 检查 Vercel Storage 状态
```

### 问题 2: "Too many connections"

**原因**：未使用连接池

**解决方案：**
确保使用 `POSTGRES_PRISMA_URL`（带 `pgbouncer=true`）

```env
# ❌ 错误
DATABASE_URL=$POSTGRES_URL

# ✅ 正确
DATABASE_URL=$POSTGRES_PRISMA_URL
```

### 问题 3: "SSL connection required"

**原因**：连接字符串缺少 SSL 参数

**解决方案：**
确保包含 `?sslmode=require`：

```env
DATABASE_URL="postgres://...?sslmode=require&pgbouncer=true"
```

### 问题 4: Prisma 迁移失败

**错误**：`pgbouncer cannot be used with Prisma Migrate`

**原因**：Prisma Migrate 不支持 PgBouncer

**解决方案：**
使用 `db push` 而不是 `migrate`：

```bash
# ❌ 不支持
npx prisma migrate dev

# ✅ 使用这个
npx prisma db push
```

### 问题 5: 本地无法连接 Vercel 数据库

**解决方案：**

```bash
# 使用 Vercel CLI
vercel env pull .env.local

# 或使用环境变量
npx dotenv -e .env.local -- npx prisma studio
```

## 📋 完整部署检查清单

- [ ] 在 Vercel 创建 Postgres 数据库
- [ ] 连接数据库到项目
- [ ] 确认 `POSTGRES_PRISMA_URL` 环境变量存在
- [ ] 添加 `DATABASE_URL=$POSTGRES_PRISMA_URL` 映射
- [ ] 部署项目
- [ ] 运行 `prisma db push`（本地或 Vercel CLI）
- [ ] 运行 `prisma db seed` 创建管理员
- [ ] 测试登录（admin@example.com / admin123）
- [ ] 验证数据库连接（Prisma Studio 或 Vercel Query）

## 🎯 快速开始脚本

```bash
#!/bin/bash

echo "==================================="
echo "  Vercel Postgres 快速配置"
echo "==================================="

# 1. 安装 Vercel CLI
echo "📦 安装 Vercel CLI..."
npm i -g vercel

# 2. 登录
echo "🔐 登录 Vercel..."
vercel login

# 3. 链接项目
echo "🔗 链接项目..."
vercel link

# 4. 拉取环境变量
echo "📥 拉取环境变量..."
vercel env pull .env.local

# 5. 运行迁移
echo "🗄️  运行数据库迁移..."
cd packages/database
npx dotenv -e ../../.env.local -- npx prisma db push

# 6. 创建管理员
echo "👤 创建管理员用户..."
npx dotenv -e ../../.env.local -- npm run db:seed

echo ""
echo "✅ 完成！"
echo ""
echo "默认登录："
echo "  Email: admin@example.com"
echo "  Password: admin123"
echo ""
```

保存为 `setup-vercel-db.sh` 并运行。

## 📚 相关文档

- [Vercel Postgres 官方文档](https://vercel.com/docs/storage/vercel-postgres)
- [Prisma + Vercel Postgres](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [部署指南](./DEPLOYMENT.md)
- [NextAuth 配置](./NEXTAUTH-SETUP.md)

---

## 💡 下一步

完成数据库配置后：
1. 配置 NextAuth 环境变量
2. 部署到 Vercel
3. 访问 `/settings` 配置 OpenAI API Key
4. 开始使用 AI SEO 优化功能！
