# 🔀 三项目拆分架构指南

## 📋 概览

将当前的monorepo拆分成三个独立的项目：

```
当前 Monorepo
    ↓
    ├─→ 项目1: seo-websites-frontend (Vercel部署)
    ├─→ 项目2: seo-redirect-service (服务器部署)
    └─→ 项目3: seo-admin-backend (服务器部署)
```

---

## 🎯 三个独立项目

### 项目1: seo-websites-frontend

**用途**: 前台网站模板，面向公众和搜索引擎

**技术栈**:
- Next.js 14 App Router
- TailwindCSS
- Prisma Client (只读)

**包含内容**:
```
seo-websites-frontend/
├── apps/
│   ├── website-1/      # Telegram1688.com
│   ├── website-2/      # TelegramJiaoyu.com
│   └── website-tg/     # TelegramZhfw.com
├── packages/
│   ├── ui/             # 共享UI组件
│   └── database/       # Prisma Client (只读模式)
├── .env.example
├── vercel.json
└── README.md
```

**部署方式**: Vercel（推荐）或Netlify

**环境变量**:
```bash
# 数据库（只读）
DATABASE_URL="postgresql://readonly_user:password@host:5432/seo_websites"

# API端点（指向项目3）
NEXT_PUBLIC_API_URL=https://admin-api.yourdomain.com

# 网站URL
NEXT_PUBLIC_WEBSITE1_URL=https://telegram1688.com
NEXT_PUBLIC_WEBSITE2_URL=https://telegramjiaoyu.com
NEXT_PUBLIC_WEBSITE_TG_URL=https://telegramzhfw.com
```

---

### 项目2: seo-redirect-service

**用途**: 跳转页服务，流量分发和SEO引导

**技术栈**:
- Nginx（推荐）或Express.js
- 轻量级，无数据库依赖

**包含内容**:
```
seo-redirect-service/
├── nginx.conf          # Nginx配置
├── redirect-app.js     # Node.js应用（可选）
├── config/
│   ├── routes.json     # 跳转路由配置
│   └── whitelist.json  # IP白名单
├── package.json
└── README.md
```

**部署方式**: 独立VPS或云服务器

**核心功能**:
- Link跳转路由
- 隐藏真实服务器结构
- 访问过滤（IP白名单/黑名单）
- 搜索引擎识别和分流

---

### 项目3: seo-admin-backend

**用途**: 后台管理系统和蜘蛛池

**技术栈**:
- Next.js 14 App Router (Admin)
- Prisma ORM
- PostgreSQL
- Node.js脚本（蜘蛛池）

**包含内容**:
```
seo-admin-backend/
├── apps/
│   └── admin/          # 管理后台
├── packages/
│   ├── database/       # Prisma完整配置
│   └── ui/             # 共享UI组件
├── spider-pool/        # 蜘蛛池系统
│   ├── scripts/
│   │   ├── submit-baidu.js
│   │   ├── submit-google.js
│   │   └── check-index.js
│   └── config/
├── scripts/            # 部署和管理脚本
├── .env.example
├── ecosystem.config.js # PM2配置
└── README.md
```

**部署方式**: VPS或云服务器（需要长期运行）

**环境变量**:
```bash
# 数据库（可读写）
DATABASE_URL="postgresql://admin_user:password@localhost:5432/seo_websites"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://admin.yourdomain.com"

# 蜘蛛池配置
BAIDU_TOKEN="your-baidu-token"
TAVILY_API_KEY="your-tavily-key"
```

---

## 🔧 拆分步骤

### 第1步: 创建项目1 - Frontend

```bash
# 1. 创建新仓库
mkdir seo-websites-frontend
cd seo-websites-frontend
git init

# 2. 从monorepo复制文件
cp -r ../seo-websites-monorepo/apps/website-* ./apps/
cp -r ../seo-websites-monorepo/packages/ui ./packages/
cp -r ../seo-websites-monorepo/packages/database ./packages/

# 3. 清理不需要的文件
rm -rf packages/database/prisma/migrations  # 前端不需要migrations

# 4. 修改package.json
# 移除admin相关依赖

# 5. 配置Vercel
# 创建 vercel.json
```

**vercel.json**:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "apps/website-1/package.json",
      "use": "@vercel/next"
    },
    {
      "src": "apps/website-2/package.json",
      "use": "@vercel/next"
    },
    {
      "src": "apps/website-tg/package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/website-1/(.*)",
      "dest": "apps/website-1/$1"
    },
    {
      "src": "/website-2/(.*)",
      "dest": "apps/website-2/$1"
    },
    {
      "src": "/website-tg/(.*)",
      "dest": "apps/website-tg/$1"
    }
  ]
}
```

---

### 第2步: 创建项目2 - Redirect Service

```bash
# 1. 创建新仓库
mkdir seo-redirect-service
cd seo-redirect-service
git init

# 2. 从monorepo复制配置文件
cp ../seo-websites-monorepo/server2-configs/* ./

# 3. 创建package.json（如果使用Node.js）
npm init -y
npm install express axios

# 4. 配置路由规则
# 编辑 config/routes.json
```

**config/routes.json**:
```json
{
  "/go/telegram1": "https://telegram1688.com",
  "/go/telegram2": "https://telegramjiaoyu.com",
  "/go/telegramtg": "https://telegramzhfw.com"
}
```

---

### 第3步: 创建项目3 - Admin Backend

```bash
# 1. 创建新仓库
mkdir seo-admin-backend
cd seo-admin-backend
git init

# 2. 从monorepo复制文件
cp -r ../seo-websites-monorepo/apps/admin ./apps/
cp -r ../seo-websites-monorepo/packages/database ./packages/
cp -r ../seo-websites-monorepo/packages/ui ./packages/
cp -r ../seo-websites-monorepo/spider-pool ./
cp -r ../seo-websites-monorepo/scripts ./

# 3. 复制PM2配置
cp ../seo-websites-monorepo/ecosystem.server3.config.js ./ecosystem.config.js

# 4. 复制环境变量模板
cp ../seo-websites-monorepo/.env.server3.production.example ./.env.example
```

---

## 📦 各项目的package.json配置

### 项目1 - Frontend

```json
{
  "name": "seo-websites-frontend",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "build:website-1": "cd apps/website-1 && pnpm build",
    "build:website-2": "cd apps/website-2 && pnpm build",
    "build:website-tg": "cd apps/website-tg && pnpm build"
  },
  "dependencies": {
    "@repo/database": "workspace:*",
    "@repo/ui": "workspace:*"
  },
  "devDependencies": {
    "turbo": "^2.0.0"
  }
}
```

### 项目2 - Redirect Service

```json
{
  "name": "seo-redirect-service",
  "version": "1.0.0",
  "main": "redirect-app.js",
  "scripts": {
    "start": "node redirect-app.js",
    "pm2:start": "pm2 start redirect-app.js --name redirect-service",
    "pm2:stop": "pm2 stop redirect-service"
  },
  "dependencies": {
    "express": "^4.18.2",
    "axios": "^1.6.0"
  }
}
```

### 项目3 - Admin Backend

```json
{
  "name": "seo-admin-backend",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "cd apps/admin && pnpm dev",
    "build": "turbo run build",
    "db:migrate": "cd packages/database && npx prisma migrate deploy",
    "db:seed": "cd packages/database && npx prisma db seed",
    "spider:baidu": "node spider-pool/scripts/submit-baidu.js",
    "spider:google": "node spider-pool/scripts/submit-google.js",
    "spider:check": "node spider-pool/scripts/check-index.js"
  },
  "dependencies": {
    "@repo/database": "workspace:*",
    "@repo/ui": "workspace:*",
    "axios": "^1.6.0",
    "googleapis": "^126.0.0"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "tsx": "^4.0.0"
  }
}
```

---

## 🔗 项目间通信

### 架构图

```
┌─────────────────────────┐
│  用户 / 搜索引擎         │
└────────────┬────────────┘
             │
             ▼
    ┌────────────────┐
    │  项目2: 跳转页  │ ← 流量分发
    └────────┬───────┘
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
┌─────────┐      ┌──────────┐
│ 项目1:  │◄────►│ 项目3:   │
│ 前台网站│      │ 后台管理  │
└─────────┘      └──────────┘
  (Vercel)         (VPS)
     │                │
     │                │
     └───► API ◄──────┘
```

### API通信示例

**项目1调用项目3的API**:

```typescript
// apps/website-1/lib/api-client.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL; // https://admin-api.yourdomain.com
const API_SECRET = process.env.API_SECRET_KEY;

export async function fetchKeywordData() {
  const response = await fetch(`${API_BASE}/api/keywords`, {
    headers: {
      'X-API-Secret': API_SECRET
    }
  });
  return response.json();
}
```

**项目3提供API**:

```typescript
// apps/admin/app/api/keywords/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // 验证API密钥
  const apiSecret = request.headers.get('X-API-Secret');
  if (apiSecret !== process.env.API_SECRET_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 返回数据
  const keywords = await prisma.keyword.findMany();
  return NextResponse.json(keywords);
}
```

---

## 🚀 部署指南

### 项目1: Frontend → Vercel

```bash
# 1. 推送到GitHub
git add .
git commit -m "Initial frontend project"
git push origin main

# 2. 在Vercel导入项目
# - 选择GitHub仓库
# - 选择Framework: Next.js
# - Root Directory: apps/website-1 (分别部署3个网站)

# 3. 配置环境变量
# DATABASE_URL
# NEXT_PUBLIC_API_URL
# NEXT_PUBLIC_WEBSITE1_URL

# 4. 配置自定义域名
# website-1 → telegram1688.com
# website-2 → telegramjiaoyu.com
# website-tg → telegramzhfw.com
```

### 项目2: Redirect Service → VPS

```bash
# 1. 连接服务器
ssh root@your-server-ip

# 2. 克隆代码
cd /www/wwwroot
git clone <your-repo-url> seo-redirect-service
cd seo-redirect-service

# 3. 配置Nginx或启动Node.js
# 方案A: Nginx
cp nginx.conf /etc/nginx/sites-available/redirect
ln -s /etc/nginx/sites-available/redirect /etc/nginx/sites-enabled/
nginx -t && nginx -s reload

# 方案B: Node.js + PM2
npm install
pm2 start redirect-app.js --name redirect-service
pm2 save
```

### 项目3: Admin Backend → VPS

```bash
# 1. 连接服务器
ssh root@your-server-ip

# 2. 克隆代码
cd /www/wwwroot
git clone <your-repo-url> seo-admin-backend
cd seo-admin-backend

# 3. 配置环境变量
cp .env.example .env.production
nano .env.production

# 4. 安装依赖和构建
pnpm install
pnpm build

# 5. 数据库迁移
pnpm db:migrate

# 6. 启动服务
pm2 start ecosystem.config.js
pm2 save
```

---

## 📊 优势对比

### Monorepo vs 三个独立项目

| 特性 | Monorepo | 三个独立项目 |
|------|----------|--------------|
| **代码复用** | ✅ 优秀 | ⚠️ 需手动同步 |
| **部署独立性** | ❌ 受限 | ✅ 完全独立 |
| **性能优化** | ⚠️ 有限 | ✅ 针对性优化 |
| **安全隔离** | ⚠️ 中等 | ✅ 完全隔离 |
| **维护成本** | ✅ 统一管理 | ⚠️ 分散管理 |
| **Vercel部署** | ❌ 不适合 | ✅ 完美支持 |
| **团队协作** | ⚠️ 可能冲突 | ✅ 独立开发 |

---

## 🔄 共享代码策略

### 方案1: npm私有包（推荐）

```bash
# 1. 发布共享包到npm
cd packages/ui
npm publish --access=private

# 2. 在各项目中安装
pnpm add @your-org/ui
```

### 方案2: Git Submodules

```bash
# 1. 创建共享代码仓库
git init shared-packages
cd shared-packages
# 添加 ui/ 和 database/

# 2. 在各项目中添加submodule
git submodule add <shared-repo-url> packages/shared
```

### 方案3: 手动同步（简单但需要纪律）

```bash
# 定期手动复制共享代码
cp -r project3/packages/ui project1/packages/
```

---

## 📝 下一步

1. **决定共享代码策略**
   - [ ] 使用npm私有包
   - [ ] 使用Git Submodules
   - [ ] 手动同步

2. **创建三个Git仓库**
   - [ ] seo-websites-frontend
   - [ ] seo-redirect-service
   - [ ] seo-admin-backend

3. **拆分代码**
   - [ ] 按照上述步骤拆分
   - [ ] 测试各项目独立运行

4. **配置部署**
   - [ ] Vercel部署前台
   - [ ] VPS部署跳转页
   - [ ] VPS部署后台

5. **更新文档**
   - [ ] 各项目README
   - [ ] 部署文档
   - [ ] 使用说明

---

**文档创建时间**: 2025-11-14
**版本**: v1.0
