# 生产环境域名配置指南

## 问题说明

您的数据库中当前配置的是开发环境域名（localhost），但实际生产环境应该使用真实域名。

### 当前配置（开发环境）
- Website 1: `localhost:3001`
- Website 2: `localhost:3002`
- Website 3: `localhost:3003`

### 应该配置（生产环境）
您有 15 个生产域名：
1. telegram1688.com
2. telegram2688.com
3. telegramcnfw.com
4. telegramcny28.com
5. telegramfuwu.com
6. telegramfwfw.com
7. telegramgzzh.com
8. telegramhnzh.com
9. telegramjiaoyu.com
10. telegramrmb28.com
11. telegramxzb.com
12. telegramxzfw.com
13. telegramzhfw.com
14. xztelegram.com
15. zhxztelegram.com

---

## 解决方案

我已经创建了一个脚本来自动更新域名配置：`scripts/update-production-domains.ts`

### 域名分配策略

脚本会将 15 个域名分配给 3 个网站：

#### Website 1: Telegram中文官网 (主站)
- **主域名**: telegram1688.com
- **别名域名** (7个):
  - telegram2688.com
  - telegramcnfw.com
  - telegramcny28.com
  - telegramfuwu.com
  - telegramfwfw.com
  - telegramgzzh.com
  - telegramhnzh.com

#### Website 2: TG中文纸飞机
- **主域名**: telegramjiaoyu.com
- **别名域名** (3个):
  - telegramrmb28.com
  - telegramxzb.com
  - telegramxzfw.com

#### Website 3: Demo Website 1
- **主域名**: telegramzhfw.com
- **别名域名** (2个):
  - xztelegram.com
  - zhxztelegram.com

---

## 使用步骤

### 1. 运行域名更新脚本

```bash
npx tsx scripts/update-production-domains.ts
```

输出示例：
```
🚀 开始更新生产环境域名...

📊 获取现有网站...
✅ 找到 3 个网站

🌐 更新网站: Telegram中文官网
   旧域名: localhost:3002
   新主域名: telegram1688.com
   ✓ 主域名已更新
   添加 7 个别名域名:
      ✓ telegram2688.com
      ✓ telegramcnfw.com
      ✓ telegramcny28.com
      ✓ telegramfuwu.com
      ✓ telegramfwfw.com
      ✓ telegramgzzh.com
      ✓ telegramhnzh.com
   ✓ 主域名别名已创建

...

✨ 域名更新完成！
```

### 2. 验证配置

运行完脚本后，检查数据库：

```bash
cd packages/database
npx prisma studio --port 5555
```

打开 http://localhost:5555，查看：
- `Website` 表：主域名已更新
- `DomainAlias` 表：所有别名域名已添加

### 3. 测试 SEO 排名检查

现在使用 Tavily API 检查真实域名的排名：

```bash
export TAVILY_API_KEY=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
npx tsx scripts/update-keyword-data.ts --rankings-only --limit=5
```

输出应该显示真实域名：
```
   [1/7] 检查 "telegram" 在 telegram1688.com 的排名...
   ✓ 找到排名: 第 X 位 (https://telegram1688.com/)
```

---

## 配置 Baota 反向代理

更新域名后，您需要在 Baota 面板中配置反向代理。

### 方法 1：单独创建站点（推荐）

为每个域名创建独立站点，并配置反向代理：

#### Website 1 的域名 (8个) → 端口 3002

```
telegram1688.com → http://127.0.0.1:3002
telegram2688.com → http://127.0.0.1:3002
telegramcnfw.com → http://127.0.0.1:3002
telegramcny28.com → http://127.0.0.1:3002
telegramfuwu.com → http://127.0.0.1:3002
telegramfwfw.com → http://127.0.0.1:3002
telegramgzzh.com → http://127.0.0.1:3002
telegramhnzh.com → http://127.0.0.1:3002
```

#### Website 2 的域名 (4个) → 端口 3003

```
telegramjiaoyu.com → http://127.0.0.1:3003
telegramrmb28.com → http://127.0.0.1:3003
telegramxzb.com → http://127.0.0.1:3003
telegramxzfw.com → http://127.0.0.1:3003
```

#### Website 3 的域名 (3个) → 端口 3001

```
telegramzhfw.com → http://127.0.0.1:3001
xztelegram.com → http://127.0.0.1:3001
zhxztelegram.com → http://127.0.0.1:3001
```

### 方法 2：使用别名（更简单）

1. 为每个网站创建一个主站点
2. 将其他域名添加为"域名别名"
3. Baota 会自动将所有别名域名代理到同一端口

---

## DNS 配置

确保所有 15 个域名的 DNS 都解析到您的服务器 IP：

```
A 记录:
telegram1688.com      → 您的服务器IP
telegram2688.com      → 您的服务器IP
telegramcnfw.com      → 您的服务器IP
...
zhxztelegram.com      → 您的服务器IP
```

---

## 多域名 SEO 的工作原理

### 数据库设计

```
Website (网站)
├── domain: telegram1688.com (主域名)
└── DomainAlias (域名别名)
    ├── telegram2688.com
    ├── telegramcnfw.com
    └── ...

Keyword (关键词)
├── websiteId: 关联到 Website
└── KeywordRanking (排名记录)
    ├── domainAliasId: 可选，记录具体哪个域名的排名
    └── url: 排名的具体 URL
```

### SEO 数据更新流程

1. **获取关键词**：从数据库读取所有关键词
2. **关联网站**：每个关键词关联一个网站（Website）
3. **检查排名**：使用网站的主域名检查排名
4. **记录结果**：保存排名数据到 KeywordRanking 表

### 未来扩展

如果您想追踪**每个别名域名的单独排名**：

1. 修改脚本，为每个 DomainAlias 创建单独的关键词
2. 或者在检查排名时，同时检查所有别名域名
3. 在 KeywordRanking 表中记录 `domainAliasId`

---

## 验证清单

更新域名后，请验证以下内容：

- [ ] 数据库中 Website 表的主域名已更新
- [ ] DomainAlias 表中所有别名域名已添加
- [ ] Baota 面板中所有域名都配置了反向代理
- [ ] DNS 解析已生效（可以用 `nslookup` 验证）
- [ ] 所有域名都可以正常访问网站
- [ ] SEO 排名检查脚本使用真实域名
- [ ] 网站可以通过任意别名域名访问

---

## 常见问题

### Q1: 为什么要使用多域名？

**A**: SEO 策略：
1. **流量分散**：不把所有鸡蛋放在一个篮子里
2. **关键词覆盖**：不同域名可以针对不同关键词
3. **风险管理**：一个域名被惩罚不影响其他域名
4. **品牌保护**：占领相关域名，防止竞争对手注册

### Q2: 多个域名指向同一个网站会被搜索引擎惩罚吗？

**A**: 不会，只要：
1. 内容质量高，不是垃圾站
2. 每个域名有独特价值（不是完全重复）
3. 使用 canonical 标签指定主域名
4. 不进行黑帽 SEO

### Q3: 如何让每个域名显示不同内容？

**A**: 修改代码，根据访问域名返回不同内容：

```typescript
// apps/website-2/app/page.tsx
export default async function HomePage() {
  const host = headers().get('host')

  // 根据域名返回不同内容
  if (host?.includes('telegram1688.com')) {
    return <HomePage1 />
  } else if (host?.includes('telegram2688.com')) {
    return <HomePage2 />
  }

  return <DefaultHomePage />
}
```

### Q4: 如何追踪每个域名的单独排名？

**A**: 当前脚本使用主域名检查排名。如果需要追踪每个别名的排名：

```typescript
// 修改 update-keyword-data.ts
for (const alias of website.domainAliases) {
  const result = await checkRankingWithTavily(
    keyword.keyword,
    alias.domain,
    tavilyConfig
  )

  await prisma.keywordRanking.create({
    data: {
      keywordId: keyword.id,
      position: result.position,
      url: result.url,
      searchEngine: 'google',
      domainAliasId: alias.id, // 记录别名 ID
    },
  })
}
```

---

## 下一步

1. ✅ 运行 `npx tsx scripts/update-production-domains.ts`
2. ✅ 在 Baota 配置反向代理
3. ✅ 验证 DNS 解析
4. ✅ 测试所有域名可访问
5. ✅ 运行 SEO 排名检查（使用 Tavily）

现在您的 SEO 数据将使用真实的生产域名进行追踪！🎉
