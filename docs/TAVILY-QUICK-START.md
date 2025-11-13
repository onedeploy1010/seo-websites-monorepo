# Tavily API 快速开始指南

## ✨ 为什么选择 Tavily？

Tavily 是目前**最具性价比**的 SEO 排名检查 API：

| 特性 | Tavily | SerpApi |
|------|--------|---------|
| **免费额度** | **1,000 次/月** | 100 次/月 |
| **倍数优势** | **10倍** | - |
| 付费价格 | $30/月 (4,000 次) | $50/月 (5,000 次) |
| 注册难度 | ⭐ 简单 | ⭐ 简单 |
| 认证方式 | API Key | API Key |
| 搜索质量 | 高（为 AI 优化） | 高（原始 Google） |

**结论**：Tavily 提供 10 倍的免费额度，是最适合中小型 SEO 项目的选择！

---

## 🎉 好消息：您已经配置好了！

您的 Tavily API Key 已经配置完成：
```
TAVILY_API_KEY=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
```

配置文件位置：`.env.seo`

---

## 🚀 立即使用

### 1. 只检查排名（推荐测试）

使用 Tavily 检查前 5 个关键词的排名：

```bash
export TAVILY_API_KEY=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
npx tsx scripts/update-keyword-data.ts --rankings-only --limit=5
```

### 2. 更新所有关键词排名

```bash
export TAVILY_API_KEY=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
npx tsx scripts/update-keyword-data.ts --rankings-only
```

### 3. 完整更新（关键词数据 + 排名）

注意：需要 DataForSEO API（获取搜索量）+ Tavily API（检查排名）

```bash
# 设置两个 API
export DATAFORSEO_LOGIN=your_login
export DATAFORSEO_PASSWORD=your_password
export TAVILY_API_KEY=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

# 运行完整更新
npx tsx scripts/update-keyword-data.ts
```

---

## 📊 脚本参数说明

```bash
npx tsx scripts/update-keyword-data.ts [参数]
```

### 可用参数

| 参数 | 说明 | 示例 |
|------|------|------|
| `--ranking-api=tavily` | 指定使用 Tavily（默认） | 检查排名用 Tavily |
| `--ranking-api=serpapi` | 指定使用 SerpApi | 检查排名用 SerpApi |
| `--rankings-only` | 只检查排名，不更新搜索量 | 节省 DataForSEO 费用 |
| `--keywords-only` | 只更新搜索量，不检查排名 | 节省排名 API 配额 |
| `--limit=10` | 限制处理前 N 个关键词 | 测试或控制成本 |
| `--website-id=xxx` | 只处理某个网站的关键词 | 针对性更新 |
| `--dry-run` | 试运行，不写入数据库 | 测试 API 连接 |

### 常用组合

```bash
# 测试 Tavily API（不写入数据）
npx tsx scripts/update-keyword-data.ts --rankings-only --limit=3 --dry-run

# 检查前 10 个关键词排名（使用 Tavily）
npx tsx scripts/update-keyword-data.ts --rankings-only --limit=10

# 使用 SerpApi 代替 Tavily
npx tsx scripts/update-keyword-data.ts --rankings-only --ranking-api=serpapi

# 只更新关键词搜索量，不检查排名
npx tsx scripts/update-keyword-data.ts --keywords-only
```

---

## 💰 成本计算

### 免费方案（推荐起步）

**使用 Tavily 免费额度：1,000 次/月**

假设您有 100 个关键词：

- 每周检查 1 次：100 × 4 周 = 400 次/月
- **完全免费**！还剩 600 次配额

### 中型项目

假设您有 500 个关键词：

- 每周检查 1 次：500 × 4 = 2,000 次/月
- 超出免费额度：2,000 - 1,000 = 1,000 次
- 需要付费：$30/月（获得 4,000 次）
- **总成本：$30/月**

### 大型项目

假设您有 1,000 个关键词：

- 每周检查 1 次：1,000 × 4 = 4,000 次/月
- 方案：$30/月（4,000 次）刚好够用
- **总成本：$30/月**

### 与 SerpApi 对比

| 场景 | 关键词数 | Tavily 成本 | SerpApi 成本 | 节省 |
|------|----------|------------|--------------|------|
| 小型 | 100 | $0 | $0 | - |
| 中型 | 500 | $30 | $250+ | **$220** |
| 大型 | 1000 | $30-60 | $500+ | **$440** |

---

## 🔧 高级配置

### 环境变量

`.env.seo` 文件配置：

```bash
# Tavily API 配置
TAVILY_API_KEY=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
TAVILY_SEARCH_DEPTH=basic       # basic=1 credit, advanced=2 credits
TAVILY_MAX_RESULTS=10           # 检查前10个搜索结果

# 如果需要更深入的搜索结果，可以改为 advanced
# TAVILY_SEARCH_DEPTH=advanced  # 2 credits/次，但结果更全面
```

### 自动化定时任务

#### 方法 1：Linux Cron

```bash
# 编辑 crontab
crontab -e

# 每周一凌晨 3 点检查排名
0 3 * * 1 cd /home/ubuntu/WebstormProjects/seo-websites-monorepo && export TAVILY_API_KEY=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 && npx tsx scripts/update-keyword-data.ts --rankings-only >> logs/tavily-ranking.log 2>&1
```

#### 方法 2：PM2 定时任务

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'tavily-ranking-check',
      script: 'npx',
      args: 'tsx scripts/update-keyword-data.ts --rankings-only',
      cron_restart: '0 3 * * 1', // 每周一凌晨 3 点
      autorestart: false,
      env: {
        TAVILY_API_KEY: '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',
      },
    },
  ],
}
```

```bash
pm2 start ecosystem.config.js
pm2 save
```

---

## 📈 输出示例

### 成功运行

```
🚀 开始更新关键词数据...

📊 正在获取关键词列表...
✅ 找到 7 个关键词

🔍 正在检查关键词排名 (使用 TAVILY)...
   ✓ 使用 Tavily API（免费额度: 1000次/月）

   准备检查 7 个关键词的排名...

   [1/7] 检查 "telegram" 在 telegramdata.com 的排名...
   ✓ 找到排名: 第 3 位 (https://www.telegramdata.com/)

   [2/7] 检查 "telegram download" 在 telegramdata.com 的排名...
   ✓ 找到排名: 第 5 位 (https://www.telegramdata.com/download)

   [3/7] 检查 "telegram web" 在 telegramdata.com 的排名...
   - 未找到排名（前10位之外）

   ...

✅ 检查了 7 个关键词，找到 5 个排名

✨ 更新完成！
```

### 配额提醒

如果使用 SerpApi 且配额不足，会自动提示切换到 Tavily：

```
⚠️  SerpApi 配额已用完，跳过排名检查
💡 提示: 可以使用 Tavily API（免费 1000 次/月）
   运行: npx tsx scripts/update-keyword-data.ts --ranking-api=tavily
```

---

## 🔍 查看结果

### 方法 1：Prisma Studio

```bash
cd packages/database
npx prisma studio --port 5555
```

访问 http://localhost:5555，查看 `KeywordRanking` 表。

### 方法 2：SQL 查询

```bash
psql -U supabase_admin -d seomaster -c "
SELECT
  k.keyword,
  kr.position,
  kr.url,
  kr.\"createdAt\"
FROM \"KeywordRanking\" kr
JOIN \"Keyword\" k ON k.id = kr.\"keywordId\"
ORDER BY kr.\"createdAt\" DESC
LIMIT 10;
"
```

---

## ❓ 常见问题

### Q1: Tavily 返回的排名准确吗？

**A**: 非常准确！Tavily 使用真实的搜索引擎结果。但注意：
- Tavily 默认返回前 10 个结果（可配置到 10）
- SerpApi 可以返回前 100 个结果
- 如果您的网站排名在 10 名之后，建议使用 SerpApi

### Q2: 为什么有些关键词找不到排名？

**A**: 可能原因：
1. 网站排名在前 10 名之外（Tavily 默认只检查前 10）
2. 域名配置不正确（检查数据库中的 `website.domain`）
3. 网站还未被搜索引擎收录

### Q3: Tavily 和 SerpApi 可以同时使用吗？

**A**: 可以！脚本会根据 `--ranking-api` 参数选择：
- 默认使用 Tavily（免费额度更多）
- 可以手动切换到 SerpApi
- 建议：日常检查用 Tavily，深度分析用 SerpApi

### Q4: 如何查看 Tavily 配额使用情况？

**A**: Tavily 没有直接的配额查询 API，但您可以：
1. 登录 Tavily Dashboard：https://tavily.com/
2. 查看 Usage 页面
3. 或者自己记录使用次数：
   - Basic Search: 1 credit/次
   - Advanced Search: 2 credits/次

### Q5: 1000 次免费额度够用吗？

**A**: 完全够用！举例：
- 100 个关键词 × 每周 2 次 × 4 周 = 800 次/月 ✅
- 200 个关键词 × 每周 1 次 × 4 周 = 800 次/月 ✅
- 250 个关键词 × 每周 1 次 × 4 周 = 1000 次/月 ✅

### Q6: 如何优化配额使用？

**A**: 策略：
1. **按重要性分组**：重要关键词每周检查，次要的每月检查
2. **使用 --limit** 参数：每次只检查部分关键词
3. **配合 Google Search Console**：免费获取排名数据
4. **减少检查频率**：SEO 排名变化慢，每周检查 1 次足够

---

## 🎯 下一步

现在您已经配置好 Tavily，可以：

1. ✅ 运行测试命令确认 API 工作正常
2. ✅ 设置定时任务自动检查排名
3. ✅ 在 Admin 后台查看排名数据
4. ✅ （可选）注册 DataForSEO 获取搜索量数据

---

## 📚 相关文档

- [Tavily 官方文档](https://docs.tavily.com/)
- [SEO Data Integration Guide](./SEO-DATA-INTEGRATION.md)
- [Accessible SEO APIs](./ACCESSIBLE-SEO-APIS.md)
- [Quick Start Real Data](./QUICK-START-REAL-DATA.md)

---

**立即开始使用 Tavily！** 🚀

您已经拥有：
- ✅ 配置好的 API Key
- ✅ 完整的集成代码
- ✅ 1,000 次免费配额/月
- ✅ 详细的使用文档

只需一行命令即可开始：

```bash
export TAVILY_API_KEY=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
npx tsx scripts/update-keyword-data.ts --rankings-only --limit=5
```
