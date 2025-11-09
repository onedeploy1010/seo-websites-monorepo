# 多域名管理架构说明

## 🎯 核心概念

这个系统实现了真正的**多域名多网站管理**，允许：
1. 同一个 Vercel 项目绑定多个域名
2. 每个域名有独立的 SEO 配置
3. 通过 Admin 后台统一管理所有域名和网站
4. 基于访问域名动态显示不同的内容和 SEO 元数据

## 🏗️ 架构设计

### 数据库层面

```
Website (网站)
  ├── id: 网站唯一标识
  ├── name: 网站名称 (如 "Demo Website 1")
  └── domainAliases: 该网站的所有域名

DomainAlias (域名配置)
  ├── domain: 域名 (如 "telegramcny28.com")
  ├── websiteId: 关联的 Website
  ├── siteName: 该域名的 SEO 标题
  ├── siteDescription: 该域名的 SEO 描述
  ├── primaryTags: 主标签 (用于文章过滤)
  ├── secondaryTags: 副标签
  ├── isPrimary: 是否为主域名
  └── status: 状态 (ACTIVE/INACTIVE)

Post (文章)
  ├── id: 文章 ID
  ├── websiteId: 关联的 Website
  ├── title, content, metaDescription...
  └── keywords: 文章关键词
```

### Vercel 部署层面

```
Vercel Project: website-1
  ├── Project ID: prj_dGal6NS8cuRCsXBHRysQ4rMUARWH
  ├── 绑定域名:
  │   ├── telegramcny28.com (主域名)
  │   └── telegramfuwu.com (副域名)
  └── 环境变量:
      ├── DATABASE_URL: 共享数据库连接
      └── NEXT_PUBLIC_SITE_NAME: "Demo Website 1" (兜底用)

Vercel Project: website-tg
  ├── Project ID: prj_aN8JC3AfUyQsnTZVdpO84Pf5SPvH
  ├── 绑定域名:
  │   ├── telegram1688.com (主域名)
  │   ├── telegram2688.com
  │   └── telegramcnfw.com
  └── ...

Vercel Project: website-2
  ├── Project ID: prj_UCOP3BYbuHIu9QmVjSN70mzH1bFm
  ├── 绑定域名:
  │   ├── telegramjiaoyu.com (主域名)
  │   └── telegramrmb28.com
  └── ...
```

## 🔄 工作流程

### 用户访问流程

```
用户访问 telegramcny28.com
  ↓
Vercel 路由到 website-1 项目
  ↓
Next.js 执行 getWebsiteByDomain()
  ↓
从 headers 获取 host: "telegramcny28.com"
  ↓
查询 DomainAlias 表
  WHERE domain = "telegramcny28.com"
  ↓
找到 DomainAlias:
  {
    domain: "telegramcny28.com",
    websiteId: "xxx",
    siteName: "Telegram中文站 - TG纸飞机中文版下载",
    siteDescription: "Telegram1688提供最新TG中文版下载...",
    primaryTags: ["telegram", "tg", "中文版"]
  }
  ↓
加载关联的 Website: "Demo Website 1"
  ↓
查询该 Website 的文章
  WHERE websiteId = "xxx" AND status = "PUBLISHED"
  ↓
渲染页面，使用该域名的 SEO 配置
```

### SEO 元数据生成

```typescript
// layout.tsx
export async function generateMetadata(): Promise<Metadata> {
  const seo = await getDomainSEOMetadata()

  return {
    title: seo.title,        // 来自 DomainAlias.siteName
    description: seo.description,  // 来自 DomainAlias.siteDescription
    keywords: seo.keywords,  // 来自 primaryTags + secondaryTags
  }
}
```

## 📝 核心代码

### 1. 域名检测工具 (`lib/get-website-by-domain.ts`)

```typescript
export async function getWebsiteByDomain(): Promise<WebsiteWithDomain | null> {
  const headersList = await headers()
  const host = headersList.get('host') || ''
  const domain = host.split(':')[0]

  // 查询域名配置
  const domainConfig = await prisma.domainAlias.findFirst({
    where: { domain: { equals: domain, mode: 'insensitive' } },
    include: { website: true }
  })

  if (domainConfig) {
    return {
      website: domainConfig.website,
      domainConfig: domainConfig
    }
  }

  // 兜底：使用环境变量
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME
  const website = await prisma.website.findFirst({
    where: { name: { contains: siteName } }
  })

  return website ? { website, domainConfig: null } : null
}
```

### 2. 页面使用 (`app/page.tsx`)

```typescript
async function getRecentPosts() {
  const result = await getWebsiteByDomain()

  if (!result) return []

  const { website, domainConfig } = result

  const posts = await prisma.post.findMany({
    where: {
      websiteId: website.id,
      status: 'PUBLISHED',
    },
    orderBy: { createdAt: 'desc' },
    take: 6,
  })

  return posts
}
```

## 🎨 蜘蛛池 SEO 策略

### 为什么需要多域名？

1. **不同关键词覆盖**：每个域名针对不同的关键词组
2. **SEO 分散风险**：一个域名被惩罚不影响其他域名
3. **地域/人群定位**：不同域名针对不同受众
4. **测试 A/B**：测试不同的 SEO 策略

### 域名 SEO 配置示例

```javascript
// telegramcny28.com
{
  siteName: "Telegram中文站 - TG纸飞机中文版下载",
  siteDescription: "Telegram1688提供最新TG中文版下载、使用教程和功能介绍",
  primaryTags: ["telegram", "tg", "中文版"],
  secondaryTags: ["下载", "教程", "安装", "注册"]
}

// telegramfuwu.com
{
  siteName: "Telegram服务网 - TG使用指南",
  siteDescription: "专业的Telegram使用服务和技术支持",
  primaryTags: ["telegram", "服务", "支持"],
  secondaryTags: ["教程", "问题", "解决方案"]
}
```

## 🔧 Admin 后台管理

### 域名管理界面

Admin 后台提供了完整的域名管理功能：

1. **域名列表**：查看所有域名及其关联的网站
2. **域名编辑**：修改 SEO 配置（siteName, siteDescription, tags）
3. **域名分配**：将域名分配给不同的 Website
4. **状态管理**：激活/停用域名

### 域名分配策略

根据之前的方案A，7个域名分配如下：

| 域名 | 项目 | Website | 是否主域名 |
|------|------|---------|-----------|
| telegram1688.com | website-tg | TG中文纸飞机 | ✅ 主 |
| telegram2688.com | website-tg | TG中文纸飞机 | 副 |
| telegramcnfw.com | website-tg | TG中文纸飞机 | 副 |
| telegramcny28.com | website-1 | Demo Website 1 | ✅ 主 |
| telegramfuwu.com | website-1 | Demo Website 1 | 副 |
| telegramjiaoyu.com | website-2 | Demo Website 2 | ✅ 主 |
| telegramrmb28.com | website-2 | Demo Website 2 | 副 |

## 🚀 部署流程

### 1. 在 Admin 后台配置域名

```bash
# 运行域名添加脚本
cd packages/database
dotenv -e ../../.env.local -- npx tsx add-custom-domains.ts
```

### 2. 在 Vercel 绑定域名

1. 进入 Vercel Dashboard
2. 选择对应的项目（website-1/website-2/website-tg）
3. 进入 Settings → Domains
4. 添加自定义域名
5. 配置 DNS CNAME 记录指向 `cname.vercel-dns.com`

### 3. 验证配置

访问各个域名，检查：
- [ ] 页面能正常加载
- [ ] SEO 元数据显示正确（查看源代码）
- [ ] 显示的是对应 Website 的文章
- [ ] 控制台日志显示正确的域名检测结果

## 🧪 测试

### 本地测试

```bash
# 启动 website-1
cd apps/website-1
npm run dev  # http://localhost:3001

# 启动 website-tg
cd apps/website-tg
npm run dev  # http://localhost:3003

# 启动 website-2
cd apps/website-2
npm run dev  # http://localhost:3002
```

修改 hosts 文件模拟不同域名：
```
127.0.0.1 telegramcny28.com
127.0.0.1 telegramfuwu.com
```

### 生产环境测试

```bash
# 检查域名配置
cd packages/database
dotenv -e ../../.env.local -- npx tsx check-production-domains.ts

# 验证 Vercel 部署
dotenv -e ../../.env.local -- npx tsx check-vercel-deployments.ts
```

## 📊 监控和优化

### 关键指标

1. **每个域名的 SEO 表现**
   - 搜索引擎收录量
   - 关键词排名
   - 自然流量

2. **文章分配策略**
   - 基于 primaryTags 的文章匹配
   - 不同域名的内容差异化

3. **用户行为**
   - 不同域名的跳出率
   - 页面停留时间
   - 转化率

### 优化建议

1. **定期更新域名 SEO 配置**
   - 根据搜索数据调整 siteName/siteDescription
   - 优化 primaryTags 匹配策略

2. **内容策略**
   - 为不同域名创建专属内容
   - 利用 DomainAlias 的标签系统过滤文章

3. **技术优化**
   - 启用 CDN 加速
   - 优化图片加载
   - 实施服务端渲染缓存

## 🔗 相关文档

- `DOMAIN-SETUP-GUIDE.md` - 域名配置指南
- `VERCEL-DOMAIN-SETUP.md` - Vercel 域名绑定
- `IMPLEMENTATION-NOTES.md` - 实施说明
- `WORK-SUMMARY.md` - 工作总结

## 🆘 常见问题

### Q: 为什么访问域名显示的内容不对？

A: 检查以下几点：
1. 域名是否在 `DomainAlias` 表中正确配置
2. 域名的 `websiteId` 是否指向正确的 Website
3. 该 Website 是否有已发布的文章
4. 检查浏览器控制台日志，查看域名检测结果

### Q: 如何添加新域名？

A:
1. 在 Admin 后台或通过脚本添加 DomainAlias 记录
2. 在 Vercel 对应项目绑定域名
3. 配置 DNS CNAME 记录
4. 等待 DNS 生效（通常 5-10 分钟）

### Q: 多个域名指向同一个 Website，SEO 会有影响吗？

A:
- 正确配置不会有负面影响
- 确保设置了 `isPrimary` 标记主域名
- 考虑在非主域名设置 canonical 标签指向主域名
- 利用不同的 SEO 配置实现差异化

---

**最后更新**: 2025-11-09
**版本**: 1.0
