# Vercel 域名同步到 Admin 系统指南

## 重要说明

⚠️ **Vercel 域名和 Admin 域名配置是两个独立的系统：**

1. **Vercel 域名配置**：控制哪些域名可以访问你的网站
2. **Admin 域名配置**：控制不同域名展示哪些文章（蜘蛛池 SEO）

两者需要分别配置，**不是自动同步的**！

---

## 完整操作流程

### 第一步：在 Vercel 添加域名（已完成或待完成）

#### 1.1 查看 Vercel 当前域名

登录 Vercel Dashboard 查看每个项目的域名：

```
https://vercel.com/dashboard

项目：website-tg
  ├─ website-tg-xxx.vercel.app (自动生成)
  ├─ tg-chinese.com (自定义，待添加)
  └─ telegram-zh.com (自定义，待添加)

项目：website-1
  ├─ website-1-xxx.vercel.app (自动生成)
  └─ 自定义域名 (待添加)

项目：website-2
  ├─ website-2-xxx.vercel.app (自动生成)
  └─ 自定义域名 (待添加)
```

#### 1.2 添加环境变量（必须先做！）

**在添加域名到 Admin 之前，必须先在 Vercel 添加 DATABASE_URL：**

```
Vercel Dashboard → 选择项目 → Settings → Environment Variables

变量名：DATABASE_URL
变量值：postgresql://neondb_owner:npg_gcf5GWB7KUqo@ep-aged-mouse-ah3vtfl7-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
环境：Production, Preview, Development

⚠️ 添加后需要重新部署项目！
```

需要添加到的项目：
- ✅ admin（已配置）
- ⏳ website-tg（待配置）
- ⏳ website-1（待配置）
- ⏳ website-2（待配置）

---

### 第二步：在 Admin 后台添加域名

#### 2.1 登录 Admin 后台

**本地开发环境：**
```
URL: http://localhost:3100/login
用户名：admin@admin.com
密码：admin123456
```

**生产环境：**
```
URL: https://admin-xxx.vercel.app/login
或: https://admin.yourdomain.com/login
用户名：admin@admin.com
密码：admin123456
```

#### 2.2 进入域名管理页面

```
步骤：
1. 点击左侧导航栏"网站管理"（或 Websites）
2. 找到"TG中文纸飞机"网站，点击右侧"查看"按钮
3. 点击"域名管理"标签（Domains）
```

#### 2.3 添加第一个域名

**示例：添加主域名 tg-chinese.com**

点击"添加域名"按钮，填写表单：

```
域名（Domain）：tg-chinese.com
是否主域名（Primary Domain）：✅ 勾选
主标签（Primary Tag）：telegram
副标签（Secondary Tags）：download,tutorial,guide,app

说明：
- 主标签：此域名主要展示包含"telegram"标签的文章
- 副标签：当"telegram"标签文章不足时，补充展示这些标签的文章
```

点击"保存"或"添加"。

#### 2.4 添加第二个域名

**示例：添加副域名 telegram-download.com**

再次点击"添加域名"：

```
域名（Domain）：telegram-download.com
是否主域名（Primary Domain）：❌ 不勾选
主标签（Primary Tag）：download
副标签（Secondary Tags）：telegram,install,app

说明：
- 这个域名主要展示"下载"相关文章
- 副标签补充展示其他相关内容
```

点击"保存"或"添加"。

#### 2.5 添加更多域名

继续添加其他域名，例如：

```
域名 3：telegram-tutorial.com
主标签：tutorial
副标签：telegram,guide,howto

域名 4：telegram-features.com
主标签：features
副标签：telegram,app,function

域名 5：telegram-faq.com
主标签：faq
副标签：telegram,help,problem
```

---

### 第三步：为其他网站配置域名

重复第二步的操作，为 website-1 和 website-2 配置域名：

#### 3.1 配置 website-1

```
1. 网站管理 → 选择"website-1"→ 域名管理
2. 添加域名
   - 主域名：website1.com
   - 主标签：根据网站内容设置
   - 副标签：相关标签
```

#### 3.2 配置 website-2

```
1. 网站管理 → 选择"website-2"→ 域名管理
2. 添加域名
   - 主域名：website2.com
   - 主标签：根据网站内容设置
   - 副标签：相关标签
```

---

## 验证域名配置

### 方法 1：在 Admin 后台查看

```
网站管理 → 选择网站 → 域名管理标签

应该看到：
✅ 域名列表显示所有已添加的域名
✅ 主域名有"主"标记
✅ 标签正确显示
```

### 方法 2：通过 API 验证

```bash
# 查看某个网站的所有域名别名
curl http://localhost:3100/api/websites/[网站ID]/domains

# 或使用 Prisma Studio
http://localhost:5555
# 打开 domain_aliases 表查看
```

### 方法 3：访问前端网站测试

```bash
# 不同域名应该展示不同的文章
curl https://tg-chinese.com/api/posts
curl https://telegram-download.com/api/posts

# 对比返回的文章列表是否不同
```

---

## 标签配置策略建议

### 为 TG中文纸飞机 配置多个域名

| 域名 | 主标签 | 副标签 | 用途 |
|------|--------|--------|------|
| tg-chinese.com | `telegram` | `app,guide,tutorial` | 主站，综合内容 |
| telegram-download.com | `download` | `telegram,install,app` | 下载专站 |
| telegram-tutorial.com | `tutorial` | `telegram,guide,howto` | 教程专站 |
| telegram-features.com | `features` | `telegram,app,function` | 功能介绍 |
| telegram-faq.com | `faq` | `telegram,help,problem` | 常见问题 |
| telegram-vs.com | `comparison` | `telegram,app,vs` | 对比评测 |

### 文章标签分配建议

在创建或编辑文章时，设置合适的标签：

```
文章："Telegram 完整安装指南"
推荐标签：telegram,download,install,guide,tutorial

文章："Telegram vs WhatsApp 功能对比"
推荐标签：telegram,comparison,app,vs,features

文章："Telegram 群组管理技巧"
推荐标签：telegram,tutorial,group,management,guide

文章："Telegram 下载常见问题"
推荐标签：telegram,download,faq,help,problem
```

---

## 常见问题

### Q1: 域名添加后立即生效吗？

**A:** 分两种情况：

1. **Admin 后台配置**：立即生效
2. **Vercel DNS 解析**：需要 5-60 分钟

建议先在 Vercel 添加域名并等待 DNS 生效，再在 Admin 配置。

### Q2: 可以为一个网站添加多少个域名？

**A:** 理论上无限制，但建议：
- 每个网站 3-6 个域名
- 每个域名聚焦不同的关键词类型
- 避免域名过多导致管理困难

### Q3: 主域名和副域名有什么区别？

**A:**
- **主域名**：网站的主要访问地址，标记为"主"
- **副域名**：额外的访问地址，用于蜘蛛池 SEO
- **功能上**：没有本质区别，只是标识作用

### Q4: 标签如何影响文章展示？

**A:** 文章筛选逻辑：

```javascript
// 伪代码
function getArticlesForDomain(domain) {
  const domainConfig = getDomainConfig(domain)

  // 1. 先找包含主标签的文章
  let articles = findArticlesByTag(domainConfig.primaryTag)

  // 2. 如果文章不足，再找副标签的文章
  if (articles.length < minimumCount) {
    articles.push(...findArticlesByTags(domainConfig.secondaryTags))
  }

  return articles
}
```

### Q5: 修改域名配置后需要重新部署吗？

**A:**
- **Admin 配置修改**：不需要，实时生效
- **Vercel 域名添加**：会自动重新部署
- **环境变量修改**：需要手动重新部署

---

## 快速操作清单

### 立即要做的（按顺序）：

#### ✅ 步骤 1：Vercel 添加环境变量
```
[ ] website-tg → DATABASE_URL
[ ] website-1 → DATABASE_URL
[ ] website-2 → DATABASE_URL
[ ] 每个项目添加后手动重新部署
```

#### ✅ 步骤 2：Vercel 添加自定义域名（可选）
```
[ ] website-tg → tg-chinese.com
[ ] website-tg → telegram-download.com
[ ] website-1 → 你的域名
[ ] website-2 → 你的域名
[ ] 配置 DNS 解析
[ ] 等待 SSL 证书生效
```

#### ✅ 步骤 3：Admin 后台配置域名
```
[ ] 登录 Admin
[ ] 网站管理 → TG中文纸飞机 → 域名管理
[ ] 添加 tg-chinese.com + 主标签 telegram
[ ] 添加 telegram-download.com + 主标签 download
[ ] 添加更多域名...
[ ] 为其他网站配置域名
```

#### ✅ 步骤 4：验证测试
```
[ ] 访问不同域名
[ ] 检查文章列表是否不同
[ ] 验证标签筛选正确
[ ] 检查 SEO 元数据
```

---

## 示例脚本：批量查看域名配置

如果你想通过脚本查看当前 Admin 中的域名配置：

```bash
# 创建查询脚本
cd /home/ubuntu/WebstormProjects/seo-websites-monorepo/packages/database

cat > list-domains.ts << 'EOF'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const websites = await prisma.website.findMany({
    include: {
      domainAliases: true
    }
  })

  console.log('=== 域名配置总览 ===\n')

  for (const website of websites) {
    console.log(`📌 ${website.name} (${website.domain})`)

    if (website.domainAliases.length === 0) {
      console.log('   ⚠️  未配置域名别名\n')
    } else {
      website.domainAliases.forEach(domain => {
        console.log(`   ${domain.isPrimary ? '🔵 主' : '⚪ 副'} ${domain.domain}`)
        console.log(`      主标签: ${domain.primaryTag || '未设置'}`)
        if (domain.secondaryTags.length > 0) {
          console.log(`      副标签: ${domain.secondaryTags.join(', ')}`)
        }
      })
      console.log('')
    }
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error(e)
    prisma.$disconnect()
  })
EOF

# 运行脚本
dotenv -e ../../.env.local -- npx tsx list-domains.ts
```

---

**最后更新**: 2025-01-08
**版本**: 1.0
