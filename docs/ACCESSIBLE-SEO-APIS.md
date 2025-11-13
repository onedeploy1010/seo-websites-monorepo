# 可访问的 SEO API 方案

## 🟢 最容易集成的 API（推荐）

### 1. DataForSEO API

**特点**：
- ✅ 注册即可使用，无需复杂审核
- ✅ 提供 $1 免费额度测试
- ✅ 按需付费，无月费
- ✅ 支持关键词搜索量、难度、SERP 数据

**价格**：
- Keywords Data: $0.003/关键词
- SERP 数据: $0.006/查询
- 例如：查询 1000 个关键词 = $3

**API 示例**：
```typescript
// packages/seo-tools/dataforseo.ts

const DATAFORSEO_LOGIN = 'your_login'
const DATAFORSEO_PASSWORD = 'your_password'

export async function getKeywordData(keywords: string[]) {
  const auth = Buffer.from(`${DATAFORSEO_LOGIN}:${DATAFORSEO_PASSWORD}`).toString('base64')

  const response = await fetch('https://api.dataforseo.com/v3/keywords_data/google/search_volume/live', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([{
      language_code: 'en',
      location_code: 2840, // USA
      keywords: keywords,
    }]),
  })

  const data = await response.json()
  return data.tasks[0].result
}

// 返回数据结构
// {
//   keyword: "telegram",
//   search_volume: 1500000,
//   competition: 0.87,
//   cpc: 0.45
// }
```

**注册地址**：https://app.dataforseo.com/register

---

### 2. SerpApi

**特点**：
- ✅ 每月 100 次免费查询
- ✅ 实时 Google 搜索结果
- ✅ 支持获取排名位置
- ✅ 简单的 API key 认证

**价格**：
- 免费版: 100 次/月
- 开发者版: $50/月 5,000 次查询
- 生产版: $250/月 30,000 次查询

**API 示例**：
```typescript
// packages/seo-tools/serpapi.ts

const SERPAPI_KEY = 'your_api_key'

export async function checkKeywordRanking(keyword: string, targetDomain: string) {
  const params = new URLSearchParams({
    engine: 'google',
    q: keyword,
    api_key: SERPAPI_KEY,
    num: '100', // 获取前100个结果
  })

  const response = await fetch(`https://serpapi.com/search?${params}`)
  const data = await response.json()

  // 查找目标域名的排名
  const organicResults = data.organic_results || []
  const ranking = organicResults.findIndex((result: any) =>
    result.link?.includes(targetDomain)
  )

  return ranking !== -1 ? ranking + 1 : null
}

// 使用示例
const position = await checkKeywordRanking('telegram download', 'telegramdata.com')
console.log(`排名位置: ${position}`) // 输出: 排名位置: 5
```

**注册地址**：https://serpapi.com/users/sign_up

---

### 3. ValueSERP

**特点**：
- ✅ 每月 100 次免费查询
- ✅ 实时 Google/Bing/Baidu 搜索结果
- ✅ 价格比 SerpApi 便宜
- ✅ 支持多个搜索引擎

**价格**：
- 免费版: 100 次/月
- 基础版: $49/月 10,000 次
- 专业版: $99/月 25,000 次

**API 示例**：
```typescript
// packages/seo-tools/valuesrp.ts

const VALUESERP_KEY = 'your_api_key'

export async function searchGoogle(keyword: string) {
  const params = new URLSearchParams({
    api_key: VALUESERP_KEY,
    q: keyword,
    location: 'United States',
    google_domain: 'google.com',
    gl: 'us',
    hl: 'en',
    num: '100',
  })

  const response = await fetch(`https://api.valueserp.com/search?${params}`)
  const data = await response.json()

  return data.organic_results
}
```

**注册地址**：https://www.valueserp.com/signup

---

### 4. ScraperAPI + Google Trends (免费方案)

**特点**：
- ✅ Google Trends API 完全免费
- ✅ 可以获取相对搜索量趋势
- ✅ 无需认证（使用 google-trends-api npm 包）

**API 示例**：
```typescript
// packages/seo-tools/google-trends.ts

import googleTrends from 'google-trends-api'

export async function getKeywordTrend(keyword: string) {
  const results = await googleTrends.interestOverTime({
    keyword: keyword,
    startTime: new Date('2024-01-01'),
    endTime: new Date(),
  })

  const data = JSON.parse(results)
  return data.default.timelineData
}

// 获取相关关键词
export async function getRelatedQueries(keyword: string) {
  const results = await googleTrends.relatedQueries({
    keyword: keyword,
  })

  return JSON.parse(results)
}
```

**安装**：
```bash
npm install google-trends-api
```

---

### 5. Bing Webmaster API (免费)

**特点**：
- ✅ 完全免费
- ✅ 类似 Google Search Console
- ✅ 提供关键词排名、点击量数据
- ✅ 需要验证网站所有权

**API 示例**：
```typescript
// packages/seo-tools/bing-webmaster.ts

const BING_API_KEY = 'your_api_key'

export async function getBingKeywordStats(siteUrl: string) {
  const response = await fetch(
    `https://ssl.bing.com/webmaster/api.svc/json/GetKeywordStats?siteUrl=${encodeURIComponent(siteUrl)}&apikey=${BING_API_KEY}`
  )

  const data = await response.json()
  return data.d
}
```

**注册地址**：https://www.bing.com/webmasters

---

## 🟡 中等难度 API

### 6. KeywordTool.io API

**特点**：
- 提供 Google/YouTube/Amazon 关键词建议
- 每月 $99 起
- 提供搜索量数据

### 7. SEOStack Keyword Tool

**特点**：
- Chrome 扩展，可导出数据
- 免费版有限制
- Pro 版 $47 一次性付费

---

## 🔴 需要注意的限制

### Google Keyword Planner API
- ❌ 需要有活跃的 Google Ads 账户
- ❌ 需要实际投放广告才能获得精确数据
- ⚠️ 不推荐用于自动化

### SEMrush/Ahrefs API
- ❌ 需要订阅 $119+/月
- ❌ 认证严格
- ⚠️ 成本较高

---

## 💡 推荐组合方案

### 方案 A：完全免费（适合起步）
```
1. Google Search Console (免费)
   - 获取真实排名和点击数据
   - 需要验证网站所有权

2. Bing Webmaster (免费)
   - 补充 Bing 搜索数据

3. Google Trends (免费)
   - 获取搜索趋势和相对热度

4. SerpApi 免费版 (100次/月)
   - 验证排名位置
```

**成本**: $0/月
**数据质量**: ⭐⭐⭐☆☆

---

### 方案 B：低成本方案（推荐）
```
1. Google Search Console (免费)
   - 主要排名数据源

2. DataForSEO (按需付费)
   - 关键词搜索量: ~$3/1000词
   - 每月预算 $20-50 即可

3. SerpApi 开发者版 ($50/月)
   - 5,000 次查询
   - 用于验证和竞争对手分析
```

**成本**: ~$70/月
**数据质量**: ⭐⭐⭐⭐☆

---

### 方案 C：专业方案
```
1. Google Search Console (免费)
   - 基础数据

2. DataForSEO (按需付费)
   - 关键词数据 ~$100/月

3. ValueSERP 专业版 ($99/月)
   - 25,000 次查询
   - 实时 SERP 追踪
```

**成本**: ~$200/月
**数据质量**: ⭐⭐⭐⭐⭐

---

## 🚀 快速开始：最简单的实施方案

### 步骤 1：注册 DataForSEO（5 分钟）
```bash
1. 访问 https://app.dataforseo.com/register
2. 注册账号（无需验证）
3. 获取 API 凭证
4. 充值 $1 测试
```

### 步骤 2：注册 SerpApi（5 分钟）
```bash
1. 访问 https://serpapi.com/users/sign_up
2. 注册账号
3. 获取免费 API key
4. 每月 100 次免费查询
```

### 步骤 3：集成到项目（30 分钟）
```bash
# 安装依赖
cd packages/seo-tools
npm install google-trends-api

# 创建配置文件
cat > .env << EOF
DATAFORSEO_LOGIN=your_login
DATAFORSEO_PASSWORD=your_password
SERPAPI_KEY=your_api_key
EOF
```

### 步骤 4：创建更新脚本
```typescript
// scripts/update-keyword-data.ts

import { prisma } from '@repo/database'
import { getKeywordData } from '../packages/seo-tools/dataforseo'
import { checkKeywordRanking } from '../packages/seo-tools/serpapi'

async function updateKeywordData() {
  // 获取所有关键词
  const keywords = await prisma.keyword.findMany()

  // 批量更新搜索量
  const keywordTexts = keywords.map(k => k.keyword)
  const searchVolumeData = await getKeywordData(keywordTexts)

  for (let i = 0; i < keywords.length; i++) {
    const keyword = keywords[i]
    const data = searchVolumeData[i]

    // 更新关键词数据
    await prisma.keyword.update({
      where: { id: keyword.id },
      data: {
        volume: data.search_volume,
        difficulty: Math.round(data.competition * 100),
        cpc: data.cpc,
      },
    })

    // 检查排名（如果关键词有关联的网站）
    if (keyword.websites.length > 0) {
      const website = keyword.websites[0]
      const position = await checkKeywordRanking(keyword.keyword, website.domain)

      if (position) {
        await prisma.keywordRanking.create({
          data: {
            keywordId: keyword.id,
            position: position,
            url: `https://${website.domain}`,
            searchEngine: 'google',
          },
        })
      }
    }
  }

  console.log('✅ 关键词数据更新完成')
}

updateKeywordData()
```

### 步骤 5：设置定时任务
```typescript
// apps/admin/app/api/cron/update-seo-data/route.ts

import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function GET(request: Request) {
  // 验证 cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // 运行更新脚本
    const { stdout, stderr } = await execAsync('npx tsx scripts/update-keyword-data.ts')

    return NextResponse.json({
      success: true,
      output: stdout,
      error: stderr,
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 })
  }
}
```

---

## 📊 API 对比表

| API | 免费额度 | 付费起步价 | 搜索量 | 难度 | 排名 | 认证难度 |
|-----|---------|-----------|--------|------|------|---------|
| **DataForSEO** | $1 测试 | 按需付费 $0.003/词 | ✅ | ✅ | ✅ | ⭐ 简单 |
| **SerpApi** | 100次/月 | $50/月 | ❌ | ❌ | ✅ | ⭐ 简单 |
| **ValueSERP** | 100次/月 | $49/月 | ❌ | ❌ | ✅ | ⭐ 简单 |
| **Google Trends** | 无限制 | 免费 | ⚠️ 相对值 | ❌ | ❌ | ⭐ 无需认证 |
| **Bing Webmaster** | 无限制 | 免费 | ✅ | ❌ | ✅ | ⭐⭐ 需验证网站 |
| **GSC** | 无限制 | 免费 | ❌ | ❌ | ✅ | ⭐⭐ 需验证网站 |
| **SEMrush** | 10次/天 | $119.95/月 | ✅ | ✅ | ✅ | ⭐⭐⭐ 需订阅 |
| **Ahrefs** | ❌ | $99/月 | ✅ | ✅ | ✅ | ⭐⭐⭐ 需订阅 |

---

## 🎯 我的建议

对于您的项目，我推荐：

**立即实施（今天）：**
1. 注册 SerpApi 免费账号 → 获取 100 次/月免费查询
2. 集成 Google Trends → 完全免费，了解趋势
3. 注册 DataForSEO → 充值 $5 测试关键词搜索量

**本周完成：**
1. 添加网站到 Google Search Console
2. 添加网站到 Bing Webmaster
3. 等待搜索引擎收集数据（3-7天）

**下周开始：**
1. 使用 DataForSEO 批量更新关键词真实搜索量
2. 使用 SerpApi 验证排名位置
3. 从 GSC 获取点击和排名数据

**预算：**
- 第一个月: ~$20 (DataForSEO + SerpApi 免费)
- 后续每月: ~$50-100 (取决于查询量)

这个方案可以让您：
- ✅ 今天就开始获取真实数据
- ✅ 成本可控
- ✅ 数据质量高
- ✅ 易于集成和维护
