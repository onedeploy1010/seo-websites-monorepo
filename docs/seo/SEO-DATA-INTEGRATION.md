# SEO 数据集成指南

## 当前数据状态

### ✅ 已有数据（演示数据）

**关键词（Keyword）**：
- 数据来源：`packages/database/prisma/seed.ts` 脚本
- 数据类型：硬编码的演示数据
- 包含字段：
  - `keyword`: 关键词文本
  - `volume`: 搜索量（**假数据**）
  - `difficulty`: SEO难度 0-100（**假数据**）
  - `cpc`: 每次点击费用（**假数据**）

### ❌ 缺失数据

**关键词排名（KeywordRanking）**：
- 当前状态：**数据库中完全没有排名记录**
- 需要的数据：
  - 关键词在搜索引擎中的实际排名位置
  - 排名的URL
  - 搜索引擎类型（Google, Baidu, Bing）
  - 历史排名趋势

---

## 获取真实 SEO 数据的方法

### 方案 1：Google Search Console API（推荐 - 免费）

**优势**：
- ✅ 完全免费
- ✅ 来自 Google 官方的真实数据
- ✅ 包含点击量、曝光量、点击率、排名等数据

**实施步骤**：

1. **启用 Google Search Console API**
   ```bash
   # 访问 Google Cloud Console
   https://console.cloud.google.com/

   # 启用 Search Console API
   # 创建服务账号并下载 credentials.json
   ```

2. **添加网站到 Search Console**
   ```
   https://search.google.com/search-console

   # 添加域名并验证所有权
   # 等待 Google 收集数据（需要几天）
   ```

3. **集成代码**
   ```typescript
   // packages/seo-tools/google-search-console.ts

   import { google } from 'googleapis'

   export async function getKeywordRankings(siteUrl: string) {
     const auth = new google.auth.GoogleAuth({
       keyFile: './credentials.json',
       scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
     })

     const searchconsole = google.searchconsole({ version: 'v1', auth })

     const response = await searchconsole.searchanalytics.query({
       siteUrl,
       requestBody: {
         startDate: '2025-10-01',
         endDate: '2025-11-01',
         dimensions: ['query', 'page'],
         rowLimit: 1000,
       },
     })

     return response.data.rows
   }
   ```

4. **创建定时任务**
   ```typescript
   // 每天自动更新排名数据
   // apps/admin/app/api/cron/update-rankings/route.ts

   export async function GET() {
     const websites = await prisma.website.findMany()

     for (const website of websites) {
       const rankings = await getKeywordRankings(website.domain)

       for (const row of rankings) {
         await prisma.keywordRanking.create({
           data: {
             keywordId: '...', // 根据 query 查找或创建 keyword
             position: row.position,
             url: row.keys[1], // page URL
             searchEngine: 'google',
           }
         })
       }
     }
   }
   ```

---

### 方案 2：第三方 SEO 工具 API（付费）

#### A. SEMrush API

**特点**：
- 全球最大的 SEO 数据库
- 提供关键词搜索量、难度、CPC 等真实数据
- 价格：$119.95/月起

**API 示例**：
```typescript
// packages/seo-tools/semrush.ts

export async function getKeywordData(keyword: string) {
  const response = await fetch(
    `https://api.semrush.com/?type=phrase_all&key=${API_KEY}&phrase=${keyword}&database=us`
  )

  const data = await response.text()
  // 返回: 搜索量, CPC, 竞争度, 排名等
}
```

#### B. Ahrefs API

**特点**：
- 强大的反向链接分析
- 准确的关键词难度评分
- 价格：$99/月起

**API 示例**：
```typescript
export async function getKeywordMetrics(keyword: string) {
  const response = await fetch(
    `https://apiv2.ahrefs.com?from=keywords_data&target=${keyword}&token=${API_TOKEN}`
  )

  return await response.json()
  // 返回: 搜索量, KD(难度), CPC, 点击率等
}
```

#### C. Moz API

**特点**：
- Domain Authority (DA) 评分
- 关键词难度分析
- 价格：$99/月起

---

### 方案 3：自建爬虫（不推荐 - 可能违反 ToS）

**警告**：
- ⚠️ 可能违反搜索引擎的服务条款
- ⚠️ IP 可能被封禁
- ⚠️ 数据准确性无法保证

**仅供参考的思路**：
```typescript
// 使用 Puppeteer 模拟搜索
import puppeteer from 'puppeteer'

export async function checkRankingPosition(keyword: string, targetUrl: string) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.goto(`https://www.google.com/search?q=${encodeURIComponent(keyword)}`)

  const results = await page.$$eval('.g', elements =>
    elements.map((el, index) => ({
      position: index + 1,
      url: el.querySelector('a')?.href,
    }))
  )

  const ranking = results.find(r => r.url?.includes(targetUrl))

  await browser.close()

  return ranking?.position || null
}
```

---

## 推荐实施方案

### 阶段 1：免费方案（立即可用）

1. **集成 Google Search Console API**
   - 获取真实的排名和点击数据
   - 完全免费
   - 数据权威可靠

2. **手动添加关键词**
   - 通过 Admin 后台添加目标关键词
   - 使用 Google Keyword Planner 获取搜索量（免费）
   - 定期手动更新

### 阶段 2：付费增强（可选）

1. **订阅 SEMrush 或 Ahrefs**
   - 获取更详细的关键词数据
   - 竞争对手分析
   - 反向链接监控

2. **自动化排名追踪**
   - 每日自动更新排名
   - 发送排名变化通知
   - 生成 SEO 报告

---

## 快速开始：添加真实数据

### 1. 手动添加排名记录

在 Admin 后台或通过 Prisma Studio：

```javascript
// 示例：添加一条排名记录
await prisma.keywordRanking.create({
  data: {
    keywordId: 'clx...', // 关键词ID
    position: 5,         // 排名第5位
    url: 'https://www.telegramdata.com/blog/telegram-introduction',
    searchEngine: 'google',
  }
})
```

### 2. 批量导入 CSV 数据

创建脚本导入从 Google Search Console 导出的数据：

```bash
# 导出 GSC 数据为 CSV
# 然后运行导入脚本
node scripts/import-gsc-data.js data.csv
```

### 3. 设置定时任务

使用 Vercel Cron 或类似服务：

```typescript
// vercel.json
{
  "crons": [{
    "path": "/api/cron/update-rankings",
    "schedule": "0 2 * * *" // 每天凌晨2点
  }]
}
```

---

## 总结

**当前状态**：
- ✅ 关键词数据：有（但是演示数据，不是真实搜索量）
- ❌ 排名数据：无（数据库中 0 条记录）

**建议行动**：
1. 立即集成 Google Search Console API（免费且权威）
2. 添加网站到 Search Console 并等待数据收集
3. 创建定时任务每日更新排名
4. 预算允许的话，订阅 SEMrush 获取更详细的关键词数据

**实施时间**：
- Google Search Console 集成：1-2天开发 + 3-7天等待数据
- 第三方 API 集成：半天到1天
- 完整自动化系统：3-5天

---

## 相关资源

- [Google Search Console API 文档](https://developers.google.com/webmaster-tools)
- [SEMrush API 文档](https://www.semrush.com/api-documentation/)
- [Ahrefs API 文档](https://ahrefs.com/api/documentation)
- [Google Keyword Planner](https://ads.google.com/home/tools/keyword-planner/)
