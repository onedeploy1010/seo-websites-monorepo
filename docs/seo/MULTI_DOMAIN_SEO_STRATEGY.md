# 多域名SEO标签优化策略

## 概述

本系统实现了基于域名标签的智能内容分发机制，通过为不同域名配置不同的标签权重，实现同一内容库在不同域名下呈现不同的内容优先级，从而优化SEO效果并避免重复内容惩罚。

## 核心原理

### 标签权重系统

每个域名别名可以配置两类标签：

- **主要标签（Primary Tags）**：权重为 **3**
- **次要标签（Secondary Tags）**：权重为 **1**

### 匹配分数计算

当用户访问某个域名时，系统会：

1. 识别当前访问的域名
2. 获取该域名配置的标签
3. 为每篇文章计算匹配分数：
   ```
   分数 = (匹配的主要标签数 × 3) + (匹配的次要标签数 × 1)
   ```
4. 按分数降序排序文章
5. 优先展示分数高的文章

## 应用场景示例

### 场景一：TG中文纸飞机网站

假设有以下域名配置：

#### 域名A：`tg-download-cn.com`
```typescript
{
  domain: "tg-download-cn.com",
  siteName: "Telegram中文下载",
  siteDescription: "提供Telegram中文版下载",
  primaryTags: ["telegram", "下载", "中文"],
  secondaryTags: ["安装", "教程"]
}
```

#### 域名B：`telegram-privacy.com`
```typescript
{
  domain: "telegram-privacy.com",
  siteName: "Telegram隐私安全",
  siteDescription: "Telegram安全使用指南",
  primaryTags: ["telegram", "隐私", "安全"],
  secondaryTags: ["加密", "秘密聊天"]
}
```

### 文章匹配示例

#### 文章1: "Telegram中文版下载指南"
```typescript
metaKeywords: ["telegram", "下载", "中文", "安装"]
```

**在域名A的匹配分数**：
- 主要标签匹配：telegram(3) + 下载(3) + 中文(3) = 9
- 次要标签匹配：安装(1) = 1
- **总分：10**

**在域名B的匹配分数**：
- 主要标签匹配：telegram(3) = 3
- 次要标签匹配：无 = 0
- **总分：3**

➡️ 这篇文章会在域名A优先显示

#### 文章2: "Telegram秘密聊天使用教程"
```typescript
metaKeywords: ["telegram", "秘密聊天", "隐私", "加密"]
```

**在域名A的匹配分数**：
- 主要标签匹配：telegram(3) = 3
- 次要标签匹配：无 = 0
- **总分：3**

**在域名B的匹配分数**：
- 主要标签匹配：telegram(3) + 隐私(3) = 6
- 次要标签匹配：加密(1) + 秘密聊天(1) = 2
- **总分：8**

➡️ 这篇文章会在域名B优先显示

## 实现架构

### 1. 数据库模型

#### DomainAlias 表
```prisma
model DomainAlias {
  id              String   @id @default(cuid())
  domain          String   @unique
  siteName        String
  siteDescription String
  primaryTags     String[]  // 主要标签，权重3
  secondaryTags   String[]  // 次要标签，权重1
  status          DomainStatus @default(ACTIVE)
  websiteId       String
  website         Website @relation(...)
}
```

#### Post 表
```prisma
model Post {
  id              String   @id @default(cuid())
  title           String
  content         String
  metaKeywords    String[] // 文章的标签
  status          PostStatus
  websiteId       String
  website         Website @relation(...)
}
```

### 2. 核心函数

#### `getDomainConfigFromList()`
```typescript
// packages/shared/src/domain-db-helper.ts
export function getDomainConfigFromList(
  hostname: string,
  domainAliases: DomainAliasFromDB[]
): DomainConfig | null
```
- 根据当前访问的hostname查找对应的域名配置
- 返回包含标签信息的域名配置对象

#### `calculateTagMatchScoreFromDB()`
```typescript
// packages/shared/src/domain-db-helper.ts
export function calculateTagMatchScoreFromDB(
  articleTags: string[],
  domainAlias: DomainAliasFromDB
): number
```
- 计算文章标签与域名标签的匹配分数
- 主要标签权重：3
- 次要标签权重：1

### 3. 前端实现

所有三个网站（website-1, website-2, website-tg）都已实现标签筛选功能：

```typescript
// 获取当前访问的域名
const headersList = headers()
const hostname = headersList.get('host')?.split(':')[0] || ''

// 查询网站及域名别名
const website = await prisma.website.findFirst({
  where: { /* ... */ },
  include: {
    domainAliases: {
      where: { status: 'ACTIVE' }
    }
  }
})

// 获取所有文章
const allPosts = await prisma.post.findMany({
  where: {
    websiteId: website.id,
    status: 'PUBLISHED'
  }
})

// 获取当前域名配置
const domainConfig = getDomainConfigFromList(hostname, website.domainAliases)

if (domainConfig) {
  const currentDomain = website.domainAliases.find(
    d => d.domain === domainConfig.domain
  )

  // 计算匹配分数并排序
  const postsWithScores = allPosts.map(post => ({
    post,
    score: calculateTagMatchScoreFromDB(post.metaKeywords, currentDomain)
  }))

  postsWithScores.sort((a, b) => b.score - a.score)

  return postsWithScores.map(item => item.post)
}
```

## 使用指南

### 第一步：在Admin后台添加域名别名

1. 访问 `/websites/[id]/domains`
2. 点击"添加域名"
3. 填写域名信息：

```json
{
  "domain": "tg-tutorial.com",
  "siteName": "Telegram使用教程",
  "siteDescription": "全面的Telegram使用指南",
  "primaryTags": ["telegram", "教程", "使用技巧"],
  "secondaryTags": ["新手", "入门", "FAQ"],
  "isPrimary": false
}
```

4. 如果配置了Vercel API，域名会自动添加到Vercel项目

### 第二步：配置DNS

按照Vercel提供的DNS记录配置域名解析：

```
类型: A
名称: @
值: 76.76.21.21
```

### 第三步：创建或编辑文章

在创建/编辑文章时，为文章添加合适的标签：

```json
{
  "title": "Telegram高级使用技巧",
  "metaKeywords": [
    "telegram",
    "教程",
    "使用技巧",
    "高级功能"
  ]
}
```

### 第四步：验证效果

1. 访问不同域名查看文章排序
2. 分数高的文章会优先显示
3. 确保内容与域名主题匹配

## 最佳实践

### 1. 标签命名规范

#### 主要标签（Primary Tags）
- 使用3-5个核心关键词
- 与域名主题高度相关
- 避免过于宽泛的词汇

**好的例子**：
```typescript
primaryTags: ["telegram", "下载", "安装"]
```

**不好的例子**：
```typescript
primaryTags: ["社交", "软件", "工具"] // 太宽泛
```

#### 次要标签（Secondary Tags）
- 使用5-10个辅助关键词
- 扩展主题相关词汇
- 可以包含长尾关键词

**好的例子**：
```typescript
secondaryTags: ["中文版", "官方下载", "最新版本", "使用教程"]
```

### 2. 文章标签策略

#### 为文章添加多层次标签

```typescript
{
  "title": "Telegram秘密聊天功能详解",
  "metaKeywords": [
    // 核心主题
    "telegram",
    "秘密聊天",

    // 功能特性
    "端到端加密",
    "隐私保护",
    "阅后即焚",

    // 使用场景
    "安全通讯",
    "私密对话",

    // 辅助词汇
    "使用教程",
    "设置方法"
  ]
}
```

### 3. 域名主题差异化

为不同域名设计明确的主题定位：

#### 示例配置

**域名1：下载安装主题**
```typescript
{
  domain: "telegram-download.com",
  primaryTags: ["telegram", "下载", "安装", "中文版"],
  secondaryTags: ["官方下载", "最新版", "Windows", "Mac", "Android", "iOS"]
}
```

**域名2：使用教程主题**
```typescript
{
  domain: "telegram-tutorial.com",
  primaryTags: ["telegram", "教程", "使用技巧"],
  secondaryTags: ["新手入门", "高级功能", "常见问题", "视频教程"]
}
```

**域名3：隐私安全主题**
```typescript
{
  domain: "telegram-security.com",
  primaryTags: ["telegram", "隐私", "安全", "加密"],
  secondaryTags: ["秘密聊天", "两步验证", "数据保护", "防窃听"]
}
```

### 4. SEO优化技巧

#### A. 避免重复内容惩罚

- 每个域名展示相同内容的不同排序
- 通过标签权重自然区分内容焦点
- 保持每个域名的独特性

#### B. 提升相关性

- 确保域名名称与主要标签对应
- 域名描述与内容匹配
- 元数据优化

#### C. 长尾关键词策略

```typescript
// 主域名：广泛关键词
primaryTags: ["telegram", "教程"]

// 子域名1：细分关键词
primaryTags: ["telegram", "视频通话", "群组管理"]

// 子域名2：长尾关键词
primaryTags: ["telegram", "企业通讯", "团队协作"]
```

## 监控和优化

### 1. 查看域名统计

访问 `/websites/[id]/domains` 查看每个域名的：
- 访问量统计
- 爬虫访问记录
- 最活跃的搜索引擎爬虫

### 2. 分析文章表现

通过Admin后台查看：
- 每篇文章在不同域名的匹配分数
- 文章的实际访问来源
- 高匹配分数但低访问的文章（需要优化）

### 3. 调整优化

#### 调整域名标签
```typescript
// 发现某个域名流量低
// 原配置
primaryTags: ["telegram", "教程"]

// 优化后：更具体的定位
primaryTags: ["telegram", "新手教程", "入门指南"]
```

#### 调整文章标签
```typescript
// 发现文章在目标域名匹配分数低
// 原标签
metaKeywords: ["telegram", "功能"]

// 优化后：更精准的标签
metaKeywords: ["telegram", "新手教程", "基础功能", "使用指南"]
```

## 高级应用

### 1. 区域化内容策略

```typescript
// 中国市场域名
{
  domain: "telegram-cn.com",
  primaryTags: ["telegram", "中文版", "国内使用"],
  secondaryTags: ["翻墙", "VPN", "代理"]
}

// 国际市场域名
{
  domain: "telegram-global.com",
  primaryTags: ["telegram", "international", "worldwide"],
  secondaryTags: ["privacy", "security", "encryption"]
}
```

### 2. 用户画像差异化

```typescript
// 个人用户域名
{
  domain: "telegram-personal.com",
  primaryTags: ["telegram", "聊天", "社交"],
  secondaryTags: ["表情包", "贴纸", "主题"]
}

// 企业用户域名
{
  domain: "telegram-business.com",
  primaryTags: ["telegram", "企业", "团队协作"],
  secondaryTags: ["群组管理", "机器人", "API"]
}
```

### 3. 内容类型专门化

```typescript
// 教程内容域名
{
  domain: "telegram-tutorials.com",
  primaryTags: ["telegram", "教程", "视频教程"],
  secondaryTags: ["step-by-step", "how-to", "guide"]
}

// 新闻资讯域名
{
  domain: "telegram-news.com",
  primaryTags: ["telegram", "新闻", "更新"],
  secondaryTags: ["新功能", "版本", "公告"]
}
```

## 故障排查

### 问题1：文章在所有域名显示相同顺序

**原因**：
- 域名别名未配置或状态为INACTIVE
- 文章缺少标签（metaKeywords为空）
- 标签权重设置不当

**解决方案**：
1. 检查域名别名状态：`status = 'ACTIVE'`
2. 为文章添加标签
3. 调整主要标签和次要标签的配置

### 问题2：某些文章从不显示

**原因**：
- 文章状态不是PUBLISHED
- 文章所属网站ID不匹配
- 标签匹配分数为0

**解决方案**：
1. 检查文章状态
2. 验证websiteId是否正确
3. 为文章添加通用标签

### 问题3：域名无法识别

**原因**：
- DNS未正确配置
- Vercel域名未验证
- 域名在数据库中不存在

**解决方案**：
1. 验证DNS记录
2. 检查Vercel域名状态
3. 在Admin后台确认域名已添加

## 总结

多域名SEO标签优化策略的核心优势：

1. **内容复用**：一个内容库服务多个域名
2. **SEO优化**：避免重复内容，提升相关性
3. **灵活管理**：通过标签权重轻松调整
4. **数据驱动**：基于访问统计持续优化
5. **扩展性强**：随时添加新域名和标签

通过合理配置域名标签和文章标签，可以实现：
- 不同域名展示不同内容焦点
- 提升各域名的SEO表现
- 优化用户体验
- 降低运营成本

定期监控和优化是关键，确保标签配置与实际流量数据相匹配！
