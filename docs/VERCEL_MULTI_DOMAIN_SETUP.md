# Vercel 多域名部署方案

## 概述

我们的SEO多域名管理系统可以与Vercel无缝集成，实现一个部署服务多个域名的蜘蛛池策略。

## Vercel 域名管理机制

### Vercel 支持的功能

1. **单项目多域名**: 一个Vercel项目可以添加无限个自定义域名
2. **自动SSL证书**: 每个域名自动获得Let's Encrypt SSL证书
3. **智能路由**: 所有域名指向同一个部署，由应用代码处理路由逻辑
4. **域名验证**: 支持A记录、CNAME和TXT记录验证

## 部署架构

```
┌─────────────────┐
│ domain1.com     │──┐
├─────────────────┤  │
│ domain2.com     │──┤
├─────────────────┤  │
│ domain3.com     │──┼──► Vercel项目 (website-1) ──► Next.js应用
├─────────────────┤  │         │
│ ...             │──┤         │
├─────────────────┤  │         ▼
│ domain30.com    │──┘    PostgreSQL数据库
└─────────────────┘          (DomainAlias表)
                                    │
                                    ▼
                            根据hostname返回
                            对应标签的文章内容
```

## 配置步骤

### 1. 在数据库中添加域名别名

通过Admin后台 (`/websites/[id]/domains`) 添加域名配置：

```typescript
{
  domain: "tg-download-cn.com",
  siteName: "Telegram中文下载",
  siteDescription: "提供Telegram中文版下载",
  primaryTags: ["telegram", "下载", "中文"],
  secondaryTags: ["通讯", "社交"],
  status: "PENDING" // 待配置DNS
}
```

### 2. 在Vercel项目中添加域名

#### 方式一: 通过Vercel Dashboard

1. 进入项目设置: `https://vercel.com/[team]/[project]/settings/domains`
2. 点击 "Add Domain"
3. 输入域名 (例如: `tg-download-cn.com`)
4. Vercel会提示DNS配置方法

#### 方式二: 通过Vercel CLI

```bash
# 安装Vercel CLI
npm i -g vercel

# 登录
vercel login

# 添加域名到项目
vercel domains add tg-download-cn.com --project=website-1
```

#### 方式三: 通过Vercel API (推荐自动化)

```typescript
// 可以在Admin后台集成此API调用
const response = await fetch(
  `https://api.vercel.com/v10/projects/${projectId}/domains`,
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'tg-download-cn.com',
    }),
  }
)
```

### 3. 配置DNS记录

Vercel会提供以下DNS配置选项：

#### 选项A: A记录 (推荐使用Cloudflare)

```
类型: A
名称: @
值: 76.76.21.21
TTL: 自动

类型: A
名称: www
值: 76.76.21.21
TTL: 自动
```

#### 选项B: CNAME记录

```
类型: CNAME
名称: @
值: cname.vercel-dns.com
TTL: 自动

类型: CNAME
名称: www
值: cname.vercel-dns.com
TTL: 自动
```

> **注意**: 使用Cloudflare时，建议使用A记录，并开启橙色云朵（CDN加速）

### 4. 验证域名并更新状态

DNS配置后，Vercel会自动验证域名（通常需要几分钟到24小时）。

验证成功后，在Admin后台将域名状态更新为 `ACTIVE`:

```typescript
// 通过Admin界面或API更新
await fetch(`/api/websites/[websiteId]/domains/[domainId]`, {
  method: 'PATCH',
  body: JSON.stringify({
    status: 'ACTIVE'
  })
})
```

## 应用层域名识别机制

### 自动识别域名并返回对应内容

我们的Next.js应用已经实现了域名识别机制：

```typescript
// apps/website-1/app/page.tsx (已实现)
import { headers } from 'next/headers'
import { getDomainConfigFromList } from '@repo/shared/domain-db-helper'

export default async function HomePage() {
  // 1. 获取当前访问的域名
  const headersList = headers()
  const hostname = headersList.get('host')?.split(':')[0] || ''

  // 2. 查询该网站的所有域名别名
  const website = await prisma.website.findFirst({
    include: {
      domainAliases: {
        where: { status: 'ACTIVE' }
      }
    }
  })

  // 3. 匹配当前域名配置
  const domainConfig = getDomainConfigFromList(
    hostname,
    website.domainAliases
  )

  // 4. 根据域名的标签配置筛选文章
  if (domainConfig) {
    const currentDomain = website.domainAliases.find(
      d => d.domain === domainConfig.domain
    )

    // 计算文章匹配分数
    const postsWithScores = allPosts.map(post => ({
      post,
      score: calculateTagMatchScoreFromDB(
        post.metaKeywords,
        currentDomain
      )
    }))

    // 按分数排序，优先显示匹配度高的文章
    postsWithScores.sort((a, b) => b.score - a.score)
  }

  return <HomePage posts={filteredPosts} />
}
```

## 标签权重计分机制

```typescript
// packages/shared/src/domain-db-helper.ts
export function calculateTagMatchScoreFromDB(
  articleTags: string[],
  domainAlias: DomainAliasFromDB
): number {
  let score = 0

  // 主要标签: 权重 3
  for (const tag of articleTags) {
    if (domainAlias.primaryTags.includes(tag)) {
      score += 3
    }
  }

  // 次要标签: 权重 1
  for (const tag of articleTags) {
    if (domainAlias.secondaryTags.includes(tag)) {
      score += 1
    }
  }

  return score
}
```

## 批量域名配置示例

### 场景: 为3个网站各配置10个域名

```typescript
// 示例配置
const domainConfigs = [
  // Website 1 - Telegram主题
  {
    websiteId: 'website-1-id',
    domains: [
      {
        domain: 'tg-download.com',
        siteName: 'Telegram Download',
        primaryTags: ['telegram', 'download'],
        isPrimary: true
      },
      {
        domain: 'telegram-app.net',
        siteName: 'Telegram App',
        primaryTags: ['telegram', 'app'],
      },
      // ... 另外8个域名
    ]
  },
  // Website 2 - 更广泛的内容
  {
    websiteId: 'website-2-id',
    domains: [
      {
        domain: 'social-messenger.com',
        siteName: 'Social Messenger',
        primaryTags: ['社交', '通讯'],
        isPrimary: true
      },
      // ... 另外9个域名
    ]
  },
  // Website TG - 特定功能
  // ...
]
```

## Vercel API 集成方案

### 创建自动化域名添加功能

可以在Admin后台添加域名时自动调用Vercel API：

```typescript
// apps/admin/app/api/websites/[id]/domains/route.ts
import { Vercel } from '@vercel/sdk'

export async function POST(request: Request) {
  const data = await request.json()

  // 1. 在数据库中创建域名别名
  const domainAlias = await prisma.domainAlias.create({
    data: {
      domain: data.domain,
      siteName: data.siteName,
      // ...
      status: 'PENDING'
    }
  })

  // 2. 自动添加到Vercel (可选)
  if (process.env.VERCEL_TOKEN && process.env.VERCEL_PROJECT_ID) {
    try {
      const vercel = new Vercel({
        bearerToken: process.env.VERCEL_TOKEN,
      })

      await vercel.projects.addProjectDomain({
        idOrName: process.env.VERCEL_PROJECT_ID,
        requestBody: {
          name: data.domain,
        },
      })

      // 更新状态为待验证
      await prisma.domainAlias.update({
        where: { id: domainAlias.id },
        data: { status: 'PENDING' } // 等待DNS验证
      })
    } catch (error) {
      console.error('Failed to add domain to Vercel:', error)
    }
  }

  return Response.json(domainAlias)
}
```

### 环境变量配置

在 `.env` 中添加：

```bash
# Vercel API Token (从 https://vercel.com/account/tokens 获取)
VERCEL_TOKEN=your_vercel_token_here

# Vercel 项目 ID
VERCEL_PROJECT_ID_WEBSITE_1=prj_xxxxxxxxxxxxx
VERCEL_PROJECT_ID_WEBSITE_2=prj_xxxxxxxxxxxxx
VERCEL_PROJECT_ID_WEBSITE_TG=prj_xxxxxxxxxxxxx

# Vercel Team ID (如果是团队项目)
VERCEL_TEAM_ID=team_xxxxxxxxxxxxx
```

## 域名验证状态同步

可以创建一个定时任务检查Vercel域名验证状态：

```typescript
// 示例: 通过Vercel API检查域名状态
async function syncDomainStatus(domainId: string) {
  const domain = await prisma.domainAlias.findUnique({
    where: { id: domainId }
  })

  const response = await fetch(
    `https://api.vercel.com/v9/projects/${projectId}/domains/${domain.domain}`,
    {
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
      },
    }
  )

  const vercelDomain = await response.json()

  // 如果Vercel验证通过，更新数据库状态
  if (vercelDomain.verified) {
    await prisma.domainAlias.update({
      where: { id: domainId },
      data: { status: 'ACTIVE' }
    })
  }
}
```

## SEO优化建议

### 1. Sitemap 生成

为每个域名生成独立的sitemap：

```typescript
// apps/website-1/app/sitemap-[domain].xml/route.ts
export async function GET(request: Request) {
  const hostname = new URL(request.url).hostname

  const domainAlias = await prisma.domainAlias.findUnique({
    where: { domain: hostname }
  })

  // 只包含该域名标签匹配的文章
  const posts = await getPostsForDomain(domainAlias)

  return new Response(generateSitemap(posts), {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
```

### 2. Robots.txt 配置

```typescript
// apps/website-1/app/robots.txt/route.ts
export async function GET(request: Request) {
  const hostname = new URL(request.url).hostname

  return new Response(`
User-agent: *
Allow: /
Sitemap: https://${hostname}/sitemap.xml
  `.trim())
}
```

### 3. 结构化数据

每个域名使用独立的站点名称和描述：

```typescript
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: domainConfig.siteName,
  description: domainConfig.siteDescription,
  url: `https://${domainConfig.domain}`,
}
```

## 监控和分析

### 1. 爬虫访问追踪

在中间件中记录爬虫访问：

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || ''
  const hostname = request.headers.get('host')?.split(':')[0] || ''

  // 识别搜索引擎爬虫
  const bot = detectBot(userAgent)

  if (bot) {
    // 查找域名别名ID
    const domainAlias = await prisma.domainAlias.findUnique({
      where: { domain: hostname }
    })

    // 记录爬虫访问
    await prisma.spiderLog.create({
      data: {
        ip: request.ip || '',
        userAgent,
        url: request.url,
        bot,
        websiteId: 'website-1-id',
        domainAliasId: domainAlias?.id,
      }
    })
  }

  return NextResponse.next()
}
```

### 2. 域名访问统计

已实现的统计API：`/api/domains/[domainId]/stats`

## 成本和限制

### Vercel 限制

- **Hobby计划**: 免费，支持无限域名，但有带宽限制
- **Pro计划**: $20/月，100GB带宽
- **Enterprise**: 无限制

### 建议

- **20-30个域名**: Pro计划足够
- **配合Cloudflare**:
  - 免费CDN加速
  - DDoS防护
  - 节省Vercel带宽

## 故障排查

### 问题1: 域名无法验证

**解决方案**:
1. 检查DNS记录是否正确配置
2. 等待DNS传播（最多24小时）
3. 使用 `dig` 命令检查DNS解析：
   ```bash
   dig tg-download-cn.com
   ```

### 问题2: 所有域名显示相同内容

**解决方案**:
1. 检查数据库中域名状态是否为 `ACTIVE`
2. 验证标签配置是否正确
3. 查看文章是否有对应标签

### 问题3: SSL证书未生成

**解决方案**:
1. 等待Vercel自动生成（通常5-10分钟）
2. 检查域名DNS是否指向Vercel
3. 联系Vercel支持

## 下一步

1. ✅ 数据库多域名支持已完成
2. ⬜ 实现Vercel API集成（可选）
3. ⬜ 创建域名批量导入功能
4. ⬜ 添加域名验证状态同步
5. ⬜ 为每个域名生成独立sitemap
6. ⬜ 配置Cloudflare CDN（可选）

## 总结

通过结合Vercel的域名管理和我们的数据库配置系统，可以实现：

1. **一次部署，多域名服务**: 降低运维成本
2. **内容智能分发**: 根据域名标签自动筛选内容
3. **SEO优化**: 避免重复内容惩罚
4. **灵活扩展**: 随时添加新域名
5. **统一管理**: 通过Admin后台集中管理所有域名
