# 爬虫工具使用指南

## 📋 目录

1. [爬虫检测](#爬虫检测)
2. [频率限制](#频率限制)
3. [Robots.txt 生成](#robotstxt-生成)
4. [爬虫行为分析](#爬虫行为分析)
5. [实际应用示例](#实际应用示例)

---

## 🕷️ 爬虫检测

### 基础用法

```typescript
import { detectSpider, BotType } from '@repo/seo-tools/spider-detector'

// 检测用户代理
const userAgent = request.headers['user-agent']
const spiderInfo = detectSpider(userAgent)

if (spiderInfo.isBot) {
  console.log('爬虫信息:', {
    名称: spiderInfo.botName,
    搜索引擎: spiderInfo.searchEngine,
    类型: spiderInfo.botType,
    版本: spiderInfo.version,
    可信: spiderInfo.isTrusted,
    优先级: spiderInfo.crawlPriority
  })
}
```

### 支持的爬虫类型

```typescript
enum BotType {
  SEARCH_ENGINE = 'search_engine',  // 搜索引擎（Google、Baidu 等）
  SOCIAL_MEDIA = 'social_media',    // 社交媒体（Facebook、Twitter 等）
  AI_SCRAPER = 'ai_scraper',        // AI 爬虫（ChatGPT、Claude 等）
  SEO_TOOL = 'seo_tool',            // SEO 工具（Ahrefs、SEMrush 等）
  SITE_MONITOR = 'site_monitor',    // 网站监控（UptimeRobot 等）
  FEED_READER = 'feed_reader',      // RSS 订阅器（Feedly 等）
  UNKNOWN = 'unknown'               // 未知爬虫
}
```

### 获取爬虫列表

```typescript
import { getBotList, getBotStatistics } from '@repo/seo-tools/spider-detector'

// 获取所有爬虫
const allBots = getBotList()

// 按类型获取
const searchEngineBots = getBotList(BotType.SEARCH_ENGINE)
const aiScrapers = getBotList(BotType.AI_SCRAPER)

// 获取统计信息
const stats = getBotStatistics()
console.log('爬虫统计:', {
  总数: stats.total,
  按类型: stats.byType,
  可信: stats.trusted,
  不可信: stats.untrusted
})
```

**示例输出：**
```
{
  total: 31,
  byType: {
    search_engine: 9,
    social_media: 7,
    ai_scraper: 6,
    seo_tool: 5,
    site_monitor: 2,
    feed_reader: 1,
    unknown: 1
  },
  trusted: 29,
  untrusted: 2
}
```

---

## ⏱️ 频率限制

### 基础用法

```typescript
import { SpiderRateLimiter, BotType } from '@repo/seo-tools/spider-detector'

// 创建限制器（使用默认配置）
const limiter = new SpiderRateLimiter()

// 检查是否允许访问
const ip = request.ip
const botType = spiderInfo.botType

if (!limiter.canVisit(ip, botType)) {
  return new Response('Too many requests', { status: 429 })
}
```

### 自定义配置

```typescript
// 创建自定义配置的限制器
const limiter = new SpiderRateLimiter({
  maxVisitsPerMinute: 20,
  maxVisitsPerHour: 300,
  burstSize: 5  // 1秒内最多5次访问
})

// 为特定类型设置配额
limiter.setBotConfig(BotType.AI_SCRAPER, {
  maxVisitsPerMinute: 2,
  maxVisitsPerHour: 20,
  burstSize: 1  // 严格限制 AI 爬虫
})

limiter.setBotConfig(BotType.SEARCH_ENGINE, {
  maxVisitsPerMinute: 60,
  maxVisitsPerHour: 1000,
  burstSize: 20  // 搜索引擎给予更高配额
})
```

### 默认配额（内置）

| 爬虫类型 | 每分钟 | 每小时 | 突发大小 |
|---------|--------|--------|----------|
| 搜索引擎 | 30 | 500 | 10 |
| 社交媒体 | 20 | 300 | 8 |
| AI 爬虫 | 5 | 50 | 2 |
| SEO 工具 | 15 | 200 | 5 |
| 网站监控 | 3 | 30 | 1 |
| Feed 阅读器 | 5 | 50 | 2 |
| 未知爬虫 | 2 | 20 | 1 |

### 访问统计

```typescript
// 获取访问统计
const stats = limiter.getVisitStats(ip)
console.log({
  最近1分钟访问: stats.lastMinute,
  最近1小时访问: stats.lastHour,
  最后访问时间: stats.lastVisit
})

// 清理过期数据
setInterval(() => {
  limiter.cleanup()
}, 60000) // 每分钟清理一次

// 清除特定 IP 的记录
limiter.clear(ip)

// 清除所有记录
limiter.clearAll()
```

---

## 🤖 Robots.txt 生成

### 基础用法

```typescript
import { generateRobotsTxt } from '@repo/seo-tools/spider-detector'

// 生成基础 robots.txt
const robotsTxt = generateRobotsTxt({
  allowPaths: ['/', '/blog/*'],
  disallowPaths: ['/api/*', '/admin/*'],
  sitemapUrl: 'https://example.com/sitemap.xml',
  crawlDelay: 1
})
```

### SEO 友好版本

```typescript
import { generateSEOFriendlyRobotsTxt } from '@repo/seo-tools/spider-detector'

// 生成 SEO 优化的 robots.txt（推荐）
const robotsTxt = generateSEOFriendlyRobotsTxt(
  'https://example.com/sitemap.xml',
  true  // 阻止 AI 爬虫
)
```

### 高级配置

```typescript
const robotsTxt = generateRobotsTxt({
  // 允许的路径
  allowPaths: [
    '/',
    '/blog',
    '/blog/*',
    '/products/*',
    '/sitemap.xml'
  ],

  // 禁止的路径
  disallowPaths: [
    '/api/*',
    '/admin/*',
    '/_next/*',
    '/private/*',
    '/*.json$',
    '/*?*utm_',     // 屏蔽带 UTM 参数的 URL
    '/*?*session',  // 屏蔽带 session 的 URL
  ],

  // Sitemap（可以是数组）
  sitemapUrl: [
    'https://example.com/sitemap.xml',
    'https://example.com/sitemap-blog.xml',
    'https://example.com/sitemap-products.xml'
  ],

  // 默认爬取延迟
  crawlDelay: 1,

  // 阻止 AI 爬虫
  blockAI: true,

  // 针对特定爬虫的自定义规则
  customRules: {
    'Googlebot': {
      crawlDelay: 0  // Google 不需要延迟
    },
    'Baiduspider': {
      crawlDelay: 2,  // 百度稍慢一点
      disallow: ['/en/*']  // 百度不爬英文页面
    },
    'GPTBot': {
      disallow: ['/']  // 完全禁止 GPTBot
    }
  },

  // 主机名（多域名时使用）
  host: 'www.example.com'
})
```

### 生成的 robots.txt 示例

```
# Robots.txt - Generated by SEO Tools
# Last updated: 2024-11-13T22:30:00.000Z

User-agent: *
Allow: /
Allow: /blog
Allow: /blog/*
Allow: /sitemap.xml
Allow: /sitemap-*.xml
Disallow: /api/*
Disallow: /admin/*
Disallow: /_next/*
Disallow: /private/*
Disallow: /*.json$
Disallow: /*?*utm_
Disallow: /*?*session
Disallow: /*?*sid
Crawl-delay: 1

# Block AI scrapers
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: PerplexityBot
Disallow: /

User-agent: Applebot-Extended
Disallow: /

# Custom rules for specific bots

User-agent: Googlebot
Crawl-delay: 0

User-agent: Baiduspider
Crawl-delay: 2

Sitemap: https://example.com/sitemap.xml
```

---

## 📊 爬虫行为分析

### 基础用法

```typescript
import { SpiderAnalytics } from '@repo/seo-tools/spider-detector'

const analytics = new SpiderAnalytics()

// 记录爬虫访问
analytics.recordVisit('Googlebot', '/blog/article-1', Date.now())
analytics.recordVisit('Googlebot', '/blog/article-2', Date.now())
analytics.recordVisit('Googlebot', '/products/item-1', Date.now())

// 获取爬虫友好度评分（0-100）
const score = analytics.getCrawlabilityScore('Googlebot')
console.log('Googlebot 友好度评分:', score)

// 获取所有爬虫的统计
const allStats = analytics.getAllStats()
console.log('所有爬虫统计:', allStats)
```

### 友好度评分算法

评分基于以下因素：

- **访问页面数量**（40分）：访问的唯一页面越多，说明爬虫覆盖越全面
- **总访问次数**（30分）：访问次数越多，说明爬虫活跃度越高
- **爬取深度**（30分）：爬取深度越深，说明网站结构对爬虫越友好

**示例输出：**
```typescript
{
  Googlebot: {
    totalVisits: 150,
    uniquePages: 45,
    crawlabilityScore: 82
  },
  Baiduspider: {
    totalVisits: 80,
    uniquePages: 25,
    crawlabilityScore: 65
  }
}
```

---

## 🚀 实际应用示例

### Next.js API Route 中使用

```typescript
// app/api/content/route.ts
import { NextRequest, NextResponse } from 'next/server'
import {
  detectSpider,
  SpiderRateLimiter,
  BotType
} from '@repo/seo-tools/spider-detector'

const limiter = new SpiderRateLimiter()

export async function GET(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || ''
  const ip = request.ip || 'unknown'

  // 检测爬虫
  const spider = detectSpider(userAgent)

  if (spider.isBot) {
    console.log(`🕷️ 爬虫访问: ${spider.botName} (${spider.searchEngine})`)

    // 频率限制
    if (!limiter.canVisit(ip, spider.botType)) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'Retry-After': '60'
        }
      })
    }

    // 针对不同类型的爬虫返回不同内容
    if (spider.botType === BotType.AI_SCRAPER && !spider.isTrusted) {
      // 阻止不可信的 AI 爬虫
      return new NextResponse('Forbidden', { status: 403 })
    }
  }

  // 正常处理请求
  return NextResponse.json({ data: '...' })
}
```

### Express.js 中间件

```typescript
// middleware/spider-protection.ts
import express from 'express'
import { detectSpider, SpiderRateLimiter, BotType } from '@repo/seo-tools/spider-detector'

const limiter = new SpiderRateLimiter()

export const spiderProtection = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const userAgent = req.headers['user-agent'] || ''
  const ip = req.ip || 'unknown'

  const spider = detectSpider(userAgent)

  if (spider.isBot) {
    // 检查频率限制
    if (!limiter.canVisit(ip, spider.botType)) {
      return res.status(429).json({
        error: 'Too many requests',
        retryAfter: 60
      })
    }

    // 记录爬虫访问（可选）
    req.spiderInfo = spider
  }

  next()
}

// 使用中间件
app.use(spiderProtection)
```

### 生成 robots.txt（Next.js App Router）

```typescript
// app/robots.txt/route.ts
import { generateSEOFriendlyRobotsTxt } from '@repo/seo-tools/spider-detector'

export async function GET() {
  const robotsTxt = generateSEOFriendlyRobotsTxt(
    'https://example.com/sitemap.xml',
    true  // 阻止 AI 爬虫
  )

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600'  // 缓存1小时
    }
  })
}
```

### 综合示例：爬虫监控仪表盘

```typescript
// app/api/admin/spider-stats/route.ts
import { getBotStatistics, SpiderAnalytics } from '@repo/seo-tools/spider-detector'

const analytics = new SpiderAnalytics()

export async function GET() {
  const botStats = getBotStatistics()
  const crawlStats = analytics.getAllStats()

  return Response.json({
    // 已知爬虫统计
    knownBots: botStats,

    // 爬虫访问统计
    crawlActivity: crawlStats,

    // Top 爬虫（按友好度评分排序）
    topBots: Object.entries(crawlStats)
      .map(([name, stats]: [string, any]) => ({
        name,
        ...stats
      }))
      .sort((a, b) => b.crawlabilityScore - a.crawlabilityScore)
      .slice(0, 10)
  })
}
```

---

## 🎯 最佳实践

### 1. 搜索引擎优化

```typescript
// ✅ 对搜索引擎友好
if (spider.botType === BotType.SEARCH_ENGINE) {
  // 不限制搜索引擎爬虫
  // 返回完整内容
  // 提供清晰的 sitemap
}
```

### 2. AI 爬虫管理

```typescript
// ⚠️ AI 爬虫需要特殊处理
if (spider.botType === BotType.AI_SCRAPER) {
  // 选项 1: 完全阻止
  if (BLOCK_AI_CRAWLERS) {
    return new Response('Forbidden', { status: 403 })
  }

  // 选项 2: 严格限制
  limiter.setBotConfig(BotType.AI_SCRAPER, {
    maxVisitsPerMinute: 1,
    maxVisitsPerHour: 10
  })
}
```

### 3. 定期清理

```typescript
// 定期清理过期的访问记录
setInterval(() => {
  limiter.cleanup()
}, 60000)  // 每分钟清理一次
```

### 4. 日志记录

```typescript
if (spider.isBot) {
  logger.info('Spider visit', {
    botName: spider.botName,
    engine: spider.searchEngine,
    type: spider.botType,
    trusted: spider.isTrusted,
    priority: spider.crawlPriority,
    url: request.url,
    timestamp: new Date()
  })
}
```

### 5. 渐进式限制

```typescript
// 根据爬虫优先级设置不同的限制
const rateLimitConfig = {
  maxVisitsPerMinute: Math.max(10, spider.crawlPriority * 3),
  maxVisitsPerHour: Math.max(100, spider.crawlPriority * 50)
}
```

---

## 📈 性能考虑

1. **内存使用**：`SpiderRateLimiter` 会在内存中存储访问记录，定期调用 `cleanup()` 清理
2. **缓存**：爬虫检测结果可以缓存，避免重复检测相同的 User-Agent
3. **异步处理**：爬虫统计和日志可以异步处理，不阻塞主请求

---

## 🔐 安全建议

1. **IP 验证**：对于重要爬虫（如 Googlebot），可以通过反向 DNS 验证真实性
2. **User-Agent 验证**：不要完全信任 User-Agent，结合 IP、行为模式综合判断
3. **渐进式阻止**：对可疑爬虫先限制，再阻止，避免误伤
4. **监控异常**：监控爬虫行为，发现异常立即告警

---

## 📚 更多资源

- [搜索引擎爬虫官方文档](https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers)
- [robots.txt 规范](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
- [AI 爬虫管理指南](https://platform.openai.com/docs/gptbot)
