# 🚀 Vercel 部署配置详细指南

## ⚠️ 重要说明

由于这是 **Turborepo Monorepo** 项目，Vercel 配置需要特别注意。

**关键点：**
- ✅ Root Directory 必须设置为子应用路径（如 `apps/admin`）
- ✅ 构建命令使用 Turbo 过滤器
- ✅ 安装命令**不要**使用 `--prefix` 或 `cd`
- ✅ Vercel 会自动检测 Turborepo

---

## 📦 Admin 后台部署配置

### Vercel 项目设置

| 配置项 | 值 | 说明 |
|--------|-----|------|
| **Project Name** | `seo-admin` | 项目名称 |
| **Framework Preset** | `Next.js` | 框架选择 |
| **Root Directory** | `apps/admin` | ⚠️ 必须设置 |
| **Build Command** | `cd ../.. && turbo run build --filter=admin` | Override 打开 |
| **Install Command** | `npm install` | ⚠️ 只需这个，不要加其他参数 |
| **Output Directory** | 留空（默认 `.next`） | 使用默认值 |

### 构建命令详解

```bash
cd ../.. && turbo run build --filter=admin
```

**解释：**
- `cd ../..` - 从 `apps/admin` 回到 monorepo 根目录
- `turbo run build` - 运行 Turborepo 构建
- `--filter=admin` - 只构建 admin 应用及其依赖

### 安装命令详解

```bash
npm install
```

**为什么只需要这个？**
- ✅ Vercel 会自动检测到 monorepo 根目录的 `package.json`
- ✅ Turborepo 会自动处理依赖安装
- ❌ 不要使用 `npm install --prefix=../..`（会出错）
- ❌ 不要使用 `cd ../.. && npm install`（不需要）

---

## 🌐 前台网站部署配置

### Website-1

| 配置项 | 值 |
|--------|-----|
| **Project Name** | `seo-website-1` |
| **Root Directory** | `apps/website-1` |
| **Build Command** | `cd ../.. && turbo run build --filter=website-1` |
| **Install Command** | `npm install` |

### Website-2

| 配置项 | 值 |
|--------|-----|
| **Project Name** | `seo-website-2` |
| **Root Directory** | `apps/website-2` |
| **Build Command** | `cd ../.. && turbo run build --filter=website-2` |
| **Install Command** | `npm install` |

### Website-TG

| 配置项 | 值 |
|--------|-----|
| **Project Name** | `seo-website-tg` |
| **Root Directory** | `apps/website-tg` |
| **Build Command** | `cd ../.. && turbo run build --filter=website-tg` |
| **Install Command** | `npm install` |

---

## 🔧 如何在 Vercel UI 中配置

### 步骤 1：导入项目

1. 访问 https://vercel.com/new
2. 选择 GitHub 仓库：`seo-websites-monorepo`
3. 点击 "Import"

### 步骤 2：配置项目

在配置页面：

1. **Configure Project**
   - Project Name: 输入项目名（如 `seo-admin`）

2. **Build and Output Settings**
   - Framework Preset: 选择 `Next.js`

   - **Root Directory:** 点击 "Edit"
     ```
     apps/admin
     ```
     （根据部署的应用选择对应目录）

3. **Build Command**
   - 点击 "Override" 开关 ✅
   - 输入：
     ```bash
     cd ../.. && turbo run build --filter=admin
     ```

4. **Install Command**
   - 点击 "Override" 开关 ✅
   - 输入：
     ```bash
     npm install
     ```

   ⚠️ **注意：只需要这个命令，不要添加任何其他参数！**

5. **Output Directory**
   - 保持默认（留空）

### 步骤 3：环境变量

点击 "Environment Variables"，添加：

| 变量名 | 值 |
|--------|-----|
| `DATABASE_URL` | （稍后配置） |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` 生成 |
| `NEXTAUTH_URL` | `https://temp.vercel.app`（临时） |
| `NEXT_PUBLIC_SITE_NAME` | `SEO 管理后台` |

### 步骤 4：部署

点击 "Deploy" 按钮。

---

## 🐛 常见错误和解决方案

### 错误 1: `ENOENT: no such file or directory, open '/vercel/package.json'`

**原因：** Install Command 配置错误

**错误示例：**
```bash
npm install --prefix=../..  ❌
cd ../.. && npm install     ❌
```

**正确配置：**
```bash
npm install                 ✅
```

---

### 错误 2: `Cannot find module '@repo/database'`

**原因：** Root Directory 未设置或设置错误

**解决方案：**
- 确保 Root Directory 设为 `apps/admin`（或对应子应用）
- Build Command 包含 `cd ../..`

---

### 错误 3: Turborepo 缓存问题

**症状：** 构建成功但应用显示旧代码

**解决方案：**
```bash
# 在 Vercel Dashboard
Settings → General → Build & Development Settings
→ Build Cache: Disable (临时禁用缓存)
```

或在构建命令中添加 `--force`：
```bash
cd ../.. && turbo run build --filter=admin --force
```

---

### 错误 4: 环境变量未生效

**原因：** 未在 `turbo.json` 中声明

**解决方案：**
1. 检查 `turbo.json` 的 `globalEnv` 数组
2. 确保所有使用的环境变量都已声明
3. 参考 [TURBOREPO-ENV-VARS.md](./TURBOREPO-ENV-VARS.md)

---

## 📋 完整部署检查清单

### 准备阶段
- [ ] 代码已推送到 GitHub
- [ ] 已创建 Vercel Postgres 数据库
- [ ] 已生成 NEXTAUTH_SECRET
- [ ] 已准备 OpenAI API Key（可选）

### Vercel 配置
- [ ] Root Directory: `apps/admin`
- [ ] Build Command: `cd ../.. && turbo run build --filter=admin`
- [ ] Install Command: `npm install`（只需这个）
- [ ] 环境变量已添加

### 部署后
- [ ] 连接数据库到项目
- [ ] 添加 `DATABASE_URL=$POSTGRES_PRISMA_URL`
- [ ] 更新 `NEXTAUTH_URL` 为实际域名
- [ ] 重新部署

### 初始化
- [ ] 运行 `prisma db:push`
- [ ] 运行 `npm run db:seed`
- [ ] 测试登录

---

## 🔄 修改现有项目配置

如果项目已创建，需要修改配置：

1. **进入项目 Settings → General**

2. **找到 Build & Development Settings**

3. **修改以下配置：**
   - Root Directory: `apps/admin`
   - Build Command: `cd ../.. && turbo run build --filter=admin`
   - Install Command: `npm install`

4. **保存更改**

5. **Deployments → 最新部署 → ⋯ → Redeploy**

---

## 💡 优化建议

### 1. 使用自定义域名

```bash
# 在 Settings → Domains 添加
admin.yourdomain.com
```

然后更新环境变量：
```env
NEXTAUTH_URL=https://admin.yourdomain.com
```

### 2. 启用自动部署

- Settings → Git → Production Branch: `master`
- 推送到 master 分支自动部署

### 3. 配置 Preview 环境

- Pull Request 自动创建 Preview 部署
- 可以在合并前测试

### 4. 监控构建时间

- Deployments 页面查看构建日志
- 优化慢的构建步骤

---

## 📚 相关文档

- [Vercel Monorepo 文档](https://vercel.com/docs/monorepos/turborepo)
- [Turborepo 文档](https://turbo.build/repo/docs)
- [DEPLOYMENT.md](./DEPLOYMENT.md) - 完整部署指南
- [TURBOREPO-ENV-VARS.md](./TURBOREPO-ENV-VARS.md) - 环境变量配置
- [VERCEL-POSTGRES-SETUP.md](./VERCEL-POSTGRES-SETUP.md) - 数据库配置

---

## 🆘 获取帮助

如果遇到问题：

1. **查看构建日志**
   - Deployments → 选择失败的部署 → View Build Logs

2. **检查环境变量**
   - Settings → Environment Variables

3. **验证配置**
   - Settings → General → Build & Development Settings

4. **清除缓存重试**
   - Deployments → Redeploy → ✅ Clear Cache and Redeploy
