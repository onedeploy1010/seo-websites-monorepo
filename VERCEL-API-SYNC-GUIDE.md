# Vercel 域名自动同步指南

## 🎯 功能说明

这个脚本可以**自动从 Vercel 读取项目配置的域名**，并同步到 Admin 后台的数据库中，无需手动逐个添加！

### 工作原理

```
Vercel API
    ↓
获取项目域名列表
    ↓
过滤自定义域名（排除 .vercel.app）
    ↓
自动创建域名别名记录
    ↓
保存到 Admin 数据库
```

---

## 📋 前置条件

### 1. 获取 Vercel API Token

**步骤：**

1. **登录 Vercel**
   ```
   https://vercel.com/account/tokens
   ```

2. **创建新 Token**
   - 点击 "Create Token" 或 "Create"
   - Token Name: 输入 `SEO-Admin-Sync`
   - Scope: 选择 `Full Access` 或至少 `Read` 权限
   - Expiration: 建议选择 `No Expiration`（无过期时间）

3. **复制 Token**
   ```
   示例：vercel_1a2b3c4d5e6f7g8h9i0j...
   ```

   ⚠️ **重要：Token 只显示一次，请立即保存！**

### 2. 查找项目名称

在 Vercel Dashboard 中找到你的项目名称：

```
https://vercel.com/dashboard

你的项目应该显示为：
├─ admin
├─ website-tg
├─ website-1
└─ website-2
```

---

## 🚀 使用方法

### 方式一：临时设置环境变量（推荐测试）

```bash
# 设置 Token（本次会话有效）
export VERCEL_API_TOKEN="vercel_1a2b3c4d5e6f7g8h9i0j..."

# 如果是团队项目，还需要设置 Team ID
export VERCEL_TEAM_ID="team_xxxxx"

# 运行同步脚本
cd /home/ubuntu/WebstormProjects/seo-websites-monorepo/packages/database
dotenv -e ../../.env.local -- npx tsx sync-vercel-domains.ts
```

### 方式二：添加到 .env.local（推荐长期使用）

**编辑 `.env.local` 文件：**

```bash
# 在文件末尾添加
VERCEL_API_TOKEN=vercel_1a2b3c4d5e6f7g8h9i0j...

# 如果是团队项目，添加 Team ID
VERCEL_TEAM_ID=team_xxxxx
```

**运行脚本：**

```bash
cd /home/ubuntu/WebstormProjects/seo-websites-monorepo/packages/database
dotenv -e ../../.env.local -- npx tsx sync-vercel-domains.ts
```

---

## 📊 脚本执行示例

### 成功运行的输出

```
======================================================================
🔄 从 Vercel 同步域名到 Admin
======================================================================

📦 处理项目: website-tg
   对应网站: TG中文纸飞机
   --------------------------------------------------
   🔍 从 Vercel 获取域名...
   ✅ 找到 3 个自定义域名

   ✅ 已添加: tg-chinese.com
      🔵 主域名
      主标签: telegram
      副标签: app, download, guide
      Vercel 验证: ✅

   ✅ 已添加: telegram-download.com
      ⚪ 副域名
      主标签: telegram
      副标签: app, download, guide
      Vercel 验证: ✅

   ✅ 已添加: telegram-tutorial.com
      ⚪ 副域名
      主标签: telegram
      副标签: app, download, guide
      Vercel 验证: ⏳ 待验证

📦 处理项目: website-1
   对应网站: Demo Website 1
   --------------------------------------------------
   🔍 从 Vercel 获取域名...
   ℹ️  该项目没有自定义域名（或只有 .vercel.app 域名）

======================================================================
📊 同步结果汇总
======================================================================
✅ 成功同步: 3 个域名
⏭️  已存在跳过: 0 个
❌ 失败: 0 个
======================================================================

💡 下一步:
1. 在 Admin 后台查看域名配置
   → http://localhost:3100
   → 网站管理 → 选择网站 → 域名管理
2. 根据需要调整主/副标签配置
3. 验证不同域名的文章筛选效果
```

---

## ⚙️ 配置说明

### 项目映射配置

脚本中的 `PROJECT_MAPPINGS` 定义了 Vercel 项目和 Admin 网站的对应关系：

```typescript
const PROJECT_MAPPINGS = [
  {
    vercelProjectName: 'website-tg',    // Vercel 项目名
    websiteName: 'TG中文纸飞机',         // Admin 网站名
    defaultPrimaryTag: 'telegram',      // 默认主标签
    defaultSecondaryTags: ['app', 'download', 'guide'] // 默认副标签
  },
  // ... 更多映射
]
```

### 修改映射配置

如果你的项目名称不同，需要修改 `sync-vercel-domains.ts` 文件：

```bash
# 编辑脚本
nano /home/ubuntu/WebstormProjects/seo-websites-monorepo/packages/database/sync-vercel-domains.ts

# 修改 PROJECT_MAPPINGS 中的配置
# 保存后重新运行脚本
```

---

## 🔍 如何获取 Vercel Team ID

如果你的项目属于团队（而非个人账户），需要提供 Team ID：

### 方法 1：从 URL 获取

访问 Vercel Dashboard，URL 中包含 Team ID：

```
https://vercel.com/your-team-name/project-name
                    ^^^^^^^^^^^^^^
                    这就是 Team Slug

或者在团队设置页面：
https://vercel.com/teams/your-team-name/settings
```

### 方法 2：使用 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 查看团队列表
vercel teams list
```

### 方法 3：通过 API 获取

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.vercel.com/v2/teams
```

---

## 🎯 域名同步规则

### 自动过滤规则

脚本会**自动过滤**以下域名，只同步自定义域名：

```
✅ 保留并同步:
   - tg-chinese.com
   - telegram-download.com
   - www.telegram-app.com

❌ 自动过滤（不同步）:
   - website-tg.vercel.app
   - website-tg-git-main.vercel.app
   - website-tg-xxx.vercel.app
```

### 主/副域名规则

- **第一个同步的域名** → 自动设为主域名（isPrimary = true）
- **其他域名** → 设为副域名（isPrimary = false）

### 标签分配规则

所有从 Vercel 同步的域名会使用映射配置中的默认标签：

```typescript
defaultPrimaryTag: 'telegram'
defaultSecondaryTags: ['app', 'download', 'guide']
```

同步后，你可以在 Admin 后台手动调整每个域名的标签配置。

---

## 🔧 常见问题

### Q1: 提示 "VERCEL_API_TOKEN 环境变量未设置"？

**A:** 需要先获取并设置 Vercel API Token：

```bash
# 临时设置
export VERCEL_API_TOKEN="your-token-here"

# 或添加到 .env.local
echo 'VERCEL_API_TOKEN=your-token-here' >> ../../.env.local
```

### Q2: 提示 "Vercel API 错误: Invalid token"？

**A:** Token 无效或已过期：

1. 检查 Token 是否正确复制（没有多余空格）
2. 重新生成 Token
3. 确认 Token 权限包含读取项目信息

### Q3: 提示 "未找到网站: xxx"？

**A:** Admin 数据库中没有对应的网站记录：

```bash
# 检查数据库中的网站
cd /home/ubuntu/WebstormProjects/seo-websites-monorepo/packages/database
dotenv -e ../../.env.local -- npx tsx list-domains.ts

# 修改 sync-vercel-domains.ts 中的 PROJECT_MAPPINGS
# 确保 websiteName 与数据库中的网站名称完全一致
```

### Q4: 某些域名没有同步？

**A:** 检查以下情况：

1. **域名已存在** → 脚本会跳过已有域名，显示 "⏭️ 已存在"
2. **是 .vercel.app 域名** → 自动过滤，不会同步
3. **域名未在 Vercel 配置** → 先在 Vercel 添加域名

### Q5: 同步后想修改标签怎么办？

**A:** 两种方式：

**方式 1：Admin 网页界面（推荐）**
```
1. 登录 http://localhost:3100
2. 网站管理 → 选择网站 → 域名管理
3. 点击域名右侧的"编辑"按钮
4. 修改主/副标签
5. 保存
```

**方式 2：直接修改脚本默认值**
```typescript
// 编辑 sync-vercel-domains.ts
{
  vercelProjectName: 'website-tg',
  websiteName: 'TG中文纸飞机',
  defaultPrimaryTag: 'telegram',  // 修改这里
  defaultSecondaryTags: ['app', 'download', 'guide', 'tutorial']  // 修改这里
}
```

### Q6: 团队项目无法获取域名？

**A:** 需要设置 VERCEL_TEAM_ID：

```bash
# 方法 1：从 URL 获取
# https://vercel.com/your-team-name/project
# Team ID = your-team-name

# 方法 2：设置环境变量
export VERCEL_TEAM_ID="team_xxxxx"

# 或添加到 .env.local
echo 'VERCEL_TEAM_ID=team_xxxxx' >> ../../.env.local
```

---

## 📝 完整操作流程

### 步骤 1：准备 Vercel API Token

```bash
# 1. 访问 https://vercel.com/account/tokens
# 2. 创建 Token
# 3. 复制 Token
```

### 步骤 2：设置环境变量

```bash
# 编辑 .env.local
cd /home/ubuntu/WebstormProjects/seo-websites-monorepo
nano .env.local

# 添加以下内容：
VERCEL_API_TOKEN=vercel_1a2b3c4d5e6f7g8h9i0j...

# 如果是团队项目，还要添加：
VERCEL_TEAM_ID=team_xxxxx
```

### 步骤 3：检查项目映射配置

```bash
# 查看 sync-vercel-domains.ts 中的 PROJECT_MAPPINGS
cat packages/database/sync-vercel-domains.ts | grep -A 5 PROJECT_MAPPINGS

# 确保 vercelProjectName 和 websiteName 正确
```

### 步骤 4：运行同步脚本

```bash
cd /home/ubuntu/WebstormProjects/seo-websites-monorepo/packages/database
dotenv -e ../../.env.local -- npx tsx sync-vercel-domains.ts
```

### 步骤 5：验证同步结果

```bash
# 查看同步的域名
dotenv -e ../../.env.local -- npx tsx list-domains.ts

# 或在 Admin 后台查看
# http://localhost:3100 → 网站管理 → 域名管理
```

### 步骤 6：调整标签配置（可选）

```bash
# 在 Admin 后台手动调整每个域名的主/副标签
# 以实现更精细的文章筛选
```

---

## 🔄 自动化脚本

如果需要定期同步 Vercel 域名，可以创建自动化脚本：

### cron 定时任务（Linux）

```bash
# 编辑 crontab
crontab -e

# 添加每天凌晨 2 点同步
0 2 * * * cd /home/ubuntu/WebstormProjects/seo-websites-monorepo/packages/database && /path/to/dotenv -e ../../.env.local -- npx tsx sync-vercel-domains.ts >> /tmp/vercel-sync.log 2>&1
```

### GitHub Actions（推荐）

```yaml
# .github/workflows/sync-vercel-domains.yml
name: Sync Vercel Domains

on:
  schedule:
    - cron: '0 2 * * *'  # 每天凌晨 2 点
  workflow_dispatch:  # 支持手动触发

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npx tsx packages/database/sync-vercel-domains.ts
        env:
          VERCEL_API_TOKEN: ${{ secrets.VERCEL_API_TOKEN }}
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

---

## 📚 相关文档

- [Vercel API 文档](https://vercel.com/docs/rest-api)
- [Vercel Projects API](https://vercel.com/docs/rest-api/endpoints/projects)
- [Vercel Domains API](https://vercel.com/docs/rest-api/endpoints/domains)
- [DOMAIN-SETUP-GUIDE.md](./DOMAIN-SETUP-GUIDE.md) - 域名配置完整指南
- [VERCEL-TO-ADMIN-SYNC.md](./VERCEL-TO-ADMIN-SYNC.md) - 手动同步指南

---

**最后更新**: 2025-01-08
**版本**: 1.0
**脚本位置**: `/packages/database/sync-vercel-domains.ts`
