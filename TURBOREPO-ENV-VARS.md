# 🔧 Turborepo 环境变量配置说明

## ❗ 问题背景

在 Vercel 部署时遇到此错误：

```
WARNING - the following environment variables are set on your Vercel project,
but missing from "turbo.json". These variables WILL NOT be available to your
application and may cause your build to fail.

[warn] admin#build
[warn]   - NEXTAUTH_SECRET
[warn]   - NEXTAUTH_URL
```

## 🎯 根本原因

**Turborepo 的环境变量隔离机制：**

在 Monorepo 中，Turborepo 默认**不会**将所有环境变量传递给任务。这是为了：
- 🔒 安全性：避免意外暴露敏感信息
- 🚀 缓存优化：只有声明的环境变量变化才会使缓存失效
- 📦 可预测性：明确哪些环境变量被使用

因此，你必须在 `turbo.json` 中**显式声明**环境变量。

## ✅ 解决方案

### 已修复

`turbo.json` 已更新，添加 `globalEnv` 字段：

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "globalEnv": [
    "DATABASE_URL",
    "NEXTAUTH_SECRET",
    "NEXTAUTH_URL",
    "OPENAI_API_KEY",
    "SETTINGS_ENCRYPTION_KEY",
    "NEXT_PUBLIC_SITE_NAME",
    "NEXT_PUBLIC_SITE_URL",
    // ... 其他环境变量
  ],
  "tasks": {
    "build": { ... }
  }
}
```

### 配置说明

#### 1. `globalEnv` (全局环境变量)

所有任务都可以访问的环境变量。

**用途：**
- 数据库连接（`DATABASE_URL`）
- 认证密钥（`NEXTAUTH_SECRET`）
- API Keys（`OPENAI_API_KEY`）
- 服务器端变量

**示例：**
```json
"globalEnv": [
  "DATABASE_URL",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL"
]
```

#### 2. `globalDependencies` (全局依赖)

文件变化会导致所有缓存失效。

**示例：**
```json
"globalDependencies": ["**/.env.*local"]
```

这意味着任何 `.env.local`、`.env.development.local` 等文件变化都会触发重新构建。

#### 3. 任务级别的 `env`（可选）

如果某个环境变量只被特定任务使用，可以在任务级别声明：

```json
{
  "tasks": {
    "build": {
      "env": ["BUILD_SPECIFIC_VAR"],
      "dependsOn": ["^build"],
      "outputs": [".next/**"]
    }
  }
}
```

## 📋 完整的环境变量列表

我们的项目需要声明这些环境变量：

### 必需（服务器端）

| 变量 | 用途 | 示例值 |
|------|------|--------|
| `DATABASE_URL` | 数据库连接 | `postgresql://...` |
| `NEXTAUTH_SECRET` | NextAuth JWT 密钥 | `生成的随机字符串` |
| `NEXTAUTH_URL` | 应用 URL | `https://admin.yourdomain.com` |

### 可选（服务器端）

| 变量 | 用途 | 示例值 |
|------|------|--------|
| `OPENAI_API_KEY` | OpenAI API | `sk-...` |
| `SETTINGS_ENCRYPTION_KEY` | 设置加密 | `生成的密钥` |

### Vercel Postgres（自动生成）

| 变量 | 用途 |
|------|------|
| `POSTGRES_URL` | 直连 URL |
| `POSTGRES_PRISMA_URL` | Prisma 专用（带连接池） |
| `POSTGRES_USER` | 数据库用户 |
| `POSTGRES_PASSWORD` | 数据库密码 |
| `POSTGRES_HOST` | 数据库主机 |
| `POSTGRES_DATABASE` | 数据库名称 |

### 公开（客户端）

以 `NEXT_PUBLIC_` 开头的变量会暴露到客户端：

| 变量 | 用途 | 示例值 |
|------|------|--------|
| `NEXT_PUBLIC_SITE_NAME` | 网站名称 | `SEO 管理后台` |
| `NEXT_PUBLIC_SITE_URL` | 网站 URL | `https://www.example.com` |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics | `G-XXXXXXXXXX` |

⚠️ **重要**：`NEXT_PUBLIC_*` 变量会被打包到客户端 JS，不要用于敏感信息！

## 🔍 如何判断是否需要声明

### 检查构建警告

Vercel 部署日志会显示：

```
WARNING - the following environment variables are set on your Vercel project,
but missing from "turbo.json"
```

看到这个警告，就需要添加到 `turbo.json`。

### 手动检查

1. **列出所有环境变量**
   ```bash
   # Vercel Dashboard → Settings → Environment Variables
   ```

2. **对比 turbo.json**
   ```bash
   # 检查是否在 globalEnv 中
   cat turbo.json | grep "你的变量名"
   ```

3. **如果缺失，添加它**
   ```json
   "globalEnv": [
     "EXISTING_VAR",
     "NEW_VAR"  // 添加新的
   ]
   ```

## 🚨 常见错误

### 错误 1：忘记声明新的环境变量

**场景：**
```bash
# 在 Vercel 添加了新变量
NEW_API_KEY=abc123

# 但忘记在 turbo.json 中声明
```

**结果：**
- ❌ 构建时 `process.env.NEW_API_KEY` 是 `undefined`
- ❌ 应用运行异常
- ⚠️ Vercel 显示警告

**解决：**
```json
"globalEnv": [
  "DATABASE_URL",
  "NEW_API_KEY"  // 添加这行
]
```

### 错误 2：拼写错误

```json
// ❌ 错误
"globalEnv": ["DATABASE_ULR"]  // 打错字

// ✅ 正确
"globalEnv": ["DATABASE_URL"]
```

### 错误 3：遗漏 Vercel 自动生成的变量

Vercel Postgres 会自动创建多个变量：
```
POSTGRES_URL
POSTGRES_PRISMA_URL
POSTGRES_USER
...
```

如果你的代码直接使用这些变量（而不是通过 `DATABASE_URL`），也需要声明。

## 🔄 添加新环境变量的完整流程

1. **在 Vercel 添加环境变量**
   - Settings → Environment Variables → Add

2. **更新 turbo.json**
   ```json
   "globalEnv": [
     "EXISTING_VAR",
     "NEW_VAR"  // 添加新变量
   ]
   ```

3. **提交并推送**
   ```bash
   git add turbo.json
   git commit -m "Add NEW_VAR to turbo.json"
   git push
   ```

4. **重新部署**
   - Vercel 会自动触发部署
   - 或手动 Redeploy

5. **验证**
   - 检查部署日志，确认无警告
   - 测试功能是否正常

## 📊 性能影响

### 缓存失效

Turborepo 根据以下因素决定是否使用缓存：
- 源代码变化
- 依赖变化
- **声明的环境变量变化**

**示例：**
```json
"globalEnv": ["DATABASE_URL", "API_KEY"]
```

- ✅ 如果 `DATABASE_URL` 或 `API_KEY` 变化 → 缓存失效，重新构建
- ✅ 如果其他未声明的变量变化 → 使用缓存（可能有问题！）

### 最佳实践

1. **只声明实际使用的变量**
   - 不要添加无关变量
   - 减少不必要的缓存失效

2. **使用 `NEXT_PUBLIC_` 前缀规范**
   - 客户端变量：`NEXT_PUBLIC_*`
   - 服务器端变量：无前缀

3. **定期审查**
   - 删除不再使用的变量
   - 检查是否有遗漏

## 🐛 调试技巧

### 1. 检查环境变量是否传递

在构建脚本中添加调试输出：

```json
// package.json
{
  "scripts": {
    "build": "echo DATABASE_URL=$DATABASE_URL && next build"
  }
}
```

在 Vercel 日志中查看输出。

### 2. 使用 Turbo 调试模式

```bash
# 本地测试
TURBO_LOG_LEVEL=debug npm run build
```

### 3. 检查 Turbo 缓存

```bash
# 清除缓存
npm run clean
turbo run build --force
```

## 📚 相关文档

- [Turborepo 环境变量文档](https://turbo.build/repo/docs/core-concepts/caching/environment-variable-inputs)
- [Vercel 环境变量](https://vercel.com/docs/environment-variables)
- [Next.js 环境变量](https://nextjs.org/docs/basic-features/environment-variables)

---

## ✅ 检查清单

部署前检查：

- [ ] 所有 Vercel 环境变量已添加到 `turbo.json` 的 `globalEnv`
- [ ] `NEXT_PUBLIC_*` 变量也已声明（如果使用）
- [ ] 没有拼写错误
- [ ] 提交并推送 `turbo.json` 更改
- [ ] 重新部署后无警告
- [ ] 应用功能正常

---

💡 **总结**：在 Turborepo + Vercel 环境中，环境变量必须在 `turbo.json` 中显式声明才能在构建时使用！
