# 🚀 Vercel 部署快速清单

## ✅ 部署前检查（15 分钟）

### 1. 准备数据库
- [ ] 创建 Vercel Postgres 或 Supabase 数据库
- [ ] 复制 `DATABASE_URL` 连接字符串
- [ ] 确保连接字符串包含 `?sslmode=require`（Vercel Postgres）

### 2. 生成密钥
```bash
# 生成 NextAuth Secret
openssl rand -base64 32
```
- [ ] 复制生成的密钥（稍后使用）

### 3. 准备 API Keys
- [ ] OpenAI API Key (用于 AI SEO 优化)
- [ ] Google Analytics ID (可选)

---

## 📦 部署步骤（每个应用 10 分钟）

### 应用 1: 管理后台 (Admin)

1. **导入项目**
   - [ ] 访问 https://vercel.com/new
   - [ ] 连接 GitHub 仓库
   - [ ] 选择 `seo-websites-monorepo`

2. **配置项目**
   ```
   Project Name: seo-admin
   Framework: Next.js
   Root Directory: apps/admin ⚠️ 重要
   Build Command: cd ../.. && npm run build -- --filter=admin
   Install Command: cd ../.. && npm install
   ```

3. **添加环境变量**
   ```env
   DATABASE_URL=你的数据库连接字符串
   NEXTAUTH_SECRET=你生成的密钥
   NEXTAUTH_URL=https://你的部署域名.vercel.app
   OPENAI_API_KEY=sk-你的OpenAI密钥
   NEXT_PUBLIC_SITE_NAME=SEO 管理后台
   ```

4. **部署**
   - [ ] 点击 "Deploy"
   - [ ] 等待构建完成（约 2-3 分钟）

---

### 应用 2-4: 前台网站

**对每个网站重复以下步骤：**

#### Website-1
```
Root Directory: apps/website-1
Build Command: cd ../.. && npm run build -- --filter=website-1
环境变量:
  DATABASE_URL=你的数据库连接字符串
  NEXT_PUBLIC_SITE_URL=https://你的域名.vercel.app
  NEXT_PUBLIC_SITE_NAME=Telegram 网站 1
```

#### Website-2
```
Root Directory: apps/website-2
Build Command: cd ../.. && npm run build -- --filter=website-2
```

#### Website-TG
```
Root Directory: apps/website-tg
Build Command: cd ../.. && npm run build -- --filter=website-tg
环境变量:
  NEXT_PUBLIC_SITE_URL=https://www.telegramtgm.com
```

---

## 🗄️ 数据库初始化（首次部署后）

```bash
# 1. 配置本地环境变量
echo 'DATABASE_URL="你的数据库连接字符串"' > packages/database/.env

# 2. 运行数据库迁移
cd packages/database
npm run db:push

# 3. 创建初始管理员账户
npm run db:seed
```

**默认登录信息：**
- Email: `admin@example.com`
- Password: `admin123`

⚠️ **首次登录后立即修改密码！**

---

## 🌐 自定义域名（可选）

### 每个项目：
1. [ ] Settings → Domains
2. [ ] 添加你的域名
3. [ ] 配置 DNS 记录（A 或 CNAME）
4. [ ] 更新 `NEXTAUTH_URL` 和 `NEXT_PUBLIC_SITE_URL`
5. [ ] 重新部署

---

## ✅ 部署后验证

### 管理后台测试
- [ ] 访问 `/login` 页面
- [ ] 使用默认账户登录
- [ ] 检查 Dashboard 加载
- [ ] **访问 `/settings` 配置 OpenAI API Key** ⭐
- [ ] 测试文章创建
- [ ] 测试 AI SEO 优化（单篇）
- [ ] 测试批量优化

### 💡 推荐：使用系统设置
建议在"系统设置"页面配置 API Keys，而不是环境变量：
- 优点：修改后立即生效，无需重新部署
- 访问：`/settings` (仅 ADMIN 角色)
- 配置：OpenAI API Key、Google Analytics 等

### 前台网站测试
- [ ] 首页正常显示
- [ ] 文章列表加载
- [ ] 文章详情页面
- [ ] 检查 SEO meta 标签（查看源代码）
- [ ] 访问 `/sitemap.xml`
- [ ] 访问 `/robots.txt`

---

## 🐛 常见错误快速修复

### 错误 1: "Cannot find module '@repo/database'"
```bash
✅ 确保 Build Command 是: cd ../.. && npm run build -- --filter=<app-name>
```

### 错误 2: NextAuth 登录失败
```bash
✅ 检查 NEXTAUTH_URL 是否与访问 URL 一致
✅ 确保使用 https:// 协议
✅ 不要在 URL 末尾加斜杠
```

### 错误 3: 数据库连接超时
```bash
✅ 确保 DATABASE_URL 包含 ?sslmode=require
✅ 检查数据库防火墙设置
✅ 验证 Vercel IP 在白名单中
```

### 错误 4: 环境变量未生效
```bash
✅ 在 Vercel Dashboard 重新检查拼写
✅ 确保应用到 Production 环境
✅ 点击 "Redeploy" 重新部署
```

---

## 📊 部署时间估算

- **准备工作**: 15 分钟
- **管理后台部署**: 10 分钟
- **3 个网站部署**: 30 分钟（每个 10 分钟）
- **数据库初始化**: 5 分钟
- **验证测试**: 10 分钟

**总计: 约 70 分钟**

---

## 📞 需要帮助？

查看详细文档: `DEPLOYMENT.md`

常见问题都在那里！
