# Vercel 部署指南

## 📋 部署前准备

### 1. 准备数据库

推荐使用 **Vercel Postgres** 或 **Supabase**：

#### 选项 A: Vercel Postgres（推荐）
1. 在 Vercel 项目中创建 Postgres 数据库
2. 获取 `DATABASE_URL` 连接字符串
3. 连接字符串格式：`postgres://username:password@host/database?sslmode=require`

#### 选项 B: Supabase
1. 在 [Supabase](https://supabase.com) 创建项目
2. 从 Settings → Database 获取连接字符串
3. 选择 "Connection string" 模式，使用 "Connection pooling"

### 2. 生成 NextAuth Secret

在本地终端运行：
```bash
openssl rand -base64 32
```

复制生成的密钥，稍后需要添加到环境变量中。

### 3. 准备 OpenAI API Key

1. 访问 [OpenAI Platform](https://platform.openai.com/api-keys)
2. 创建新的 API Key
3. 复制密钥（只会显示一次）

---

## 🚀 部署步骤

### 步骤 1: 导入项目到 Vercel

1. 访问 [Vercel Dashboard](https://vercel.com/new)
2. 点击 "Import Project"
3. 连接你的 GitHub 仓库
4. 选择 `seo-websites-monorepo` 仓库

### 步骤 2: 配置项目（重要）

Vercel 会检测到这是一个 Monorepo，你需要为每个应用创建**独立的项目**：

#### 2.1 部署管理后台 (Admin)

**项目设置：**
- Project Name: `seo-admin` (或你喜欢的名字)
- Framework Preset: `Next.js`
- Root Directory: `apps/admin` ⚠️
- Build Command: `cd ../.. && npm run build -- --filter=admin`
- Install Command: `cd ../.. && npm install`
- Output Directory: `.next` (默认)

**环境变量：**
```env
DATABASE_URL=postgresql://user:password@host:5432/database
NEXTAUTH_SECRET=your-generated-secret-from-step-2
NEXTAUTH_URL=https://your-admin-domain.vercel.app
NEXT_PUBLIC_SITE_NAME=SEO 管理后台

# 可选：OpenAI API（也可以在后台设置页面配置）
OPENAI_API_KEY=sk-your-openai-api-key
SETTINGS_ENCRYPTION_KEY=your-32-character-encryption-key
```

⚠️ **注意：** `OPENAI_API_KEY` 现在可以在管理后台的"系统设置"页面配置，无需设置环境变量！

#### 2.2 部署网站 1 (Website-1)

**项目设置：**
- Project Name: `seo-website-1`
- Framework Preset: `Next.js`
- Root Directory: `apps/website-1` ⚠️
- Build Command: `cd ../.. && npm run build -- --filter=website-1`
- Install Command: `cd ../.. && npm install`

**环境变量：**
```env
DATABASE_URL=postgresql://user:password@host:5432/database
NEXT_PUBLIC_SITE_URL=https://your-website-1-domain.vercel.app
NEXT_PUBLIC_SITE_NAME=Telegram 网站 1
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

#### 2.3 部署网站 2 (Website-2)

**项目设置：**
- Project Name: `seo-website-2`
- Root Directory: `apps/website-2` ⚠️
- 其他配置同 Website-1

#### 2.4 部署网站 TG (Website-TG)

**项目设置：**
- Project Name: `seo-website-tg`
- Root Directory: `apps/website-tg` ⚠️
- 其他配置同 Website-1

**环境变量：**
```env
DATABASE_URL=postgresql://user:password@host:5432/database
NEXT_PUBLIC_SITE_URL=https://www.telegramtgm.com
NEXT_PUBLIC_SITE_NAME=Telegram TGM
```

---

## 🔧 重要配置说明

### Monorepo 构建配置

由于使用 Turborepo，**必须**设置正确的构建命令：

```json
{
  "buildCommand": "cd ../.. && npm run build -- --filter=<app-name>",
  "installCommand": "cd ../.. && npm install"
}
```

替换 `<app-name>` 为：
- `admin` - 管理后台
- `website-1` - 网站 1
- `website-2` - 网站 2
- `website-tg` - 网站 TG

### 数据库迁移

**首次部署后，需要运行数据库迁移：**

1. 在本地配置 `DATABASE_URL` 环境变量
2. 运行迁移：
```bash
cd packages/database
npm run db:push
```

3. 运行数据种子（创建初始管理员账户）：
```bash
npm run db:seed
```

**默认管理员账户：**
- Email: `admin@example.com`
- Password: `admin123`

⚠️ **安全提示：** 首次登录后立即修改密码！

---

## 🌐 自定义域名配置

### 步骤 1: 在 Vercel 添加域名

1. 进入项目 Settings → Domains
2. 添加你的域名（如 `admin.yourdomain.com`）
3. 按照指引配置 DNS 记录

### 步骤 2: 更新环境变量

部署后，将 `NEXTAUTH_URL` 和 `NEXT_PUBLIC_SITE_URL` 更新为实际域名：

```env
# 管理后台
NEXTAUTH_URL=https://admin.yourdomain.com

# 网站
NEXT_PUBLIC_SITE_URL=https://www.yourdomain.com
```

⚠️ 更新环境变量后需要重新部署！

---

## ⚙️ 系统设置（推荐）

部署后，建议在管理后台的"系统设置"页面配置 API Keys：

### 访问设置页面
1. 登录管理后台
2. 访问 `/settings` 路径
3. 配置以下内容（只有 ADMIN 角色可访问）

### 可配置项目

| 设置项 | 分类 | 是否加密 | 说明 |
|--------|------|----------|------|
| OpenAI API Key | API | ✅ | 用于 AI SEO 优化功能 |
| OpenAI Model | API | ❌ | gpt-4-turbo 或 gpt-3.5-turbo |
| Google Analytics ID | 分析 | ❌ | G-XXXXXXXXXX |
| Google Search Console | SEO | ❌ | 验证码 |
| Bing Webmaster Key | SEO | ✅ | API Key |
| 百度统计 ID | 分析 | ❌ | 统计代码 |

### 配置优先级
```
数据库设置 > 环境变量
```

**好处：**
- ✅ 修改后立即生效，无需重新部署
- ✅ 敏感信息加密存储
- ✅ 可视化管理界面
- ✅ 集中管理所有 API Keys

---

## 🔒 NextAuth 配置说明

### 会话策略

项目使用 JWT 策略（无需数据库会话）：

```typescript
// apps/admin/lib/auth.ts:7-8
session: {
  strategy: 'jwt',
}
```

### 自定义登录页

登录页面位于：`apps/admin/app/login/page.tsx`

### 安全建议

1. **生产环境必须使用 HTTPS**
2. **定期轮换 NEXTAUTH_SECRET**
3. **使用强密码策略**
4. **启用 2FA（如需要）**

---

## 📊 环境变量优先级

Vercel 环境变量优先级（从高到低）：
1. 在 Vercel Dashboard 设置的环境变量
2. `.env.production`（生产环境）
3. `.env.local`（所有环境，不应提交到 Git）
4. `.env`（默认值）

推荐：**所有敏感信息都在 Vercel Dashboard 中配置**

---

## 🧪 部署后验证

### 1. 检查管理后台

访问 `https://your-admin-domain.vercel.app/login`

**测试清单：**
- [ ] 登录页面正常显示
- [ ] 使用默认账户登录成功
- [ ] Dashboard 数据正常加载
- [ ] 访问 `/settings` 配置 OpenAI API Key
- [ ] AI SEO 优化功能可用

### 2. 检查前台网站

访问各个网站域名

**测试清单：**
- [ ] 首页正常显示
- [ ] 文章列表加载
- [ ] SEO meta 标签正确
- [ ] Sitemap 可访问 (`/sitemap.xml`)
- [ ] RSS Feed 可访问 (`/feed.xml`)

---

## 🐛 常见问题

### 问题 1: 构建失败 - "Cannot find module '@repo/database'"

**解决方案：**
确保构建命令从 monorepo 根目录执行：
```bash
cd ../.. && npm run build -- --filter=<app-name>
```

### 问题 2: NextAuth 登录后立即退出

**原因：** `NEXTAUTH_URL` 与实际访问 URL 不匹配

**解决方案：**
1. 检查 `NEXTAUTH_URL` 环境变量
2. 确保包含正确的协议（https://）
3. 不要在末尾添加斜杠

### 问题 3: 数据库连接失败

**检查清单：**
- [ ] `DATABASE_URL` 格式正确
- [ ] 数据库允许外部连接
- [ ] SSL 模式正确（Vercel Postgres 需要 `?sslmode=require`）
- [ ] IP 白名单包含 Vercel IP

### 问题 4: OpenAI API 调用失败

**解决方案：**
1. 验证 API Key 有效性
2. 检查账户余额
3. 确认 API Key 权限

### 问题 5: 环境变量未生效

**解决方案：**
1. 在 Vercel Dashboard 重新检查环境变量
2. 确保变量应用到正确的环境（Production/Preview/Development）
3. **重新部署项目**（环境变量更改需要重新部署）

---

## 📈 性能优化建议

### 1. 启用 Vercel Analytics

```bash
npm install @vercel/analytics
```

在 `layout.tsx` 中添加：
```typescript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### 2. 配置图片优化

确保使用 Next.js Image 组件：
```typescript
import Image from 'next/image'

<Image
  src="/image.jpg"
  width={800}
  height={600}
  alt="Description"
/>
```

### 3. 配置缓存策略

在 `next.config.js` 中添加：
```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
    ]
  },
}
```

---

## 🔄 持续部署

Vercel 会自动：
- **主分支推送** → 生产环境部署
- **其他分支推送** → 预览环境部署
- **Pull Request** → 自动创建预览部署

---

## 📚 相关资源

- [Vercel Monorepo 文档](https://vercel.com/docs/monorepos)
- [NextAuth.js 文档](https://next-auth.js.org)
- [Vercel Postgres 文档](https://vercel.com/docs/storage/vercel-postgres)
- [Turborepo 文档](https://turbo.build/repo/docs)

---

## 🆘 获取帮助

如遇到问题：
1. 查看 Vercel 部署日志
2. 检查浏览器控制台错误
3. 查看 Vercel Function Logs

**支持渠道：**
- Vercel Discord: https://vercel.com/discord
- Next.js Discussions: https://github.com/vercel/next.js/discussions
