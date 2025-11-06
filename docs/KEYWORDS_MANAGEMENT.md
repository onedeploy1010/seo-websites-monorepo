# 关键词管理系统

## 概述

关键词管理系统支持多域名SEO关键词排名追踪，可以追踪每个域名在不同搜索引擎的排名表现，帮助优化SEO策略。

## 核心功能

### 1. 关键词数据模型

#### Keyword（关键词）
- **keyword**：关键词文本
- **volume**：搜索量
- **difficulty**：难度评分（0-100）
- **cpc**：每次点击费用
- **websiteId**：所属网站

#### KeywordRanking（排名记录）
- **position**：排名位置
- **url**：排名URL
- **searchEngine**：搜索引擎（google, baidu, bing）
- **domainAliasId**：所属域名（支持多域名追踪）
- **keywordId**：关联关键词
- **createdAt**：记录时间

### 2. 多域名支持

关键词管理系统的多域名架构：

```
Website (网站级别)
  ├── Keyword 1 (关键词：telegram 下载)
  │     ├── Ranking 1 (主域名 - Google: #5)
  │     ├── Ranking 2 (域名A - Google: #3)
  │     └── Ranking 3 (域名B - Baidu: #7)
  ├── Keyword 2 (关键词：telegram 教程)
  │     ├── Ranking 1 (主域名 - Google: #12)
  │     └── Ranking 2 (域名A - Google: #8)
```

**设计优势**：
- 关键词保持网站级别（一个关键词库服务所有域名）
- 排名记录关联域名（每个域名的URL独立追踪）
- 可对比同一关键词在不同域名的表现
- 符合真实SEO工作流程

## 使用指南

### 第一步：创建关键词

1. 访问 `/keywords`
2. 点击"添加关键词"按钮
3. 填写关键词信息：
   - 选择所属网站 *
   - 输入关键词 *
   - 搜索量（可选）
   - 难度评分（可选，0-100）
   - CPC（可选）

```json
{
  "websiteId": "clxxxx...",
  "keyword": "telegram 中文版下载",
  "volume": 10000,
  "difficulty": 45,
  "cpc": 0.85
}
```

4. 点击"创建关键词"

### 第二步：添加排名记录

进入关键词详情页后：

1. 点击"添加排名记录"按钮
2. 填写排名信息：
   - 选择域名（可选，不选表示主域名）
   - 选择搜索引擎（google/baidu/bing）*
   - 输入排名位置 *
   - 输入排名URL *

```json
{
  "domainAliasId": "clxxxx..." (optional),
  "searchEngine": "google",
  "position": 5,
  "url": "https://tg-download.com/blog/telegram-guide"
}
```

3. 点击"添加"

### 第三步：查看排名历史

关键词详情页展示：

- **关键词指标**：搜索量、难度、CPC
- **排名历史**：按域名和搜索引擎分组
  - 域名A - Google
  - 域名A - Baidu
  - 域名B - Google
- 每条记录显示：
  - 排名位置（如 #5）
  - 排名URL
  - 记录时间

### 第四步：使用筛选功能

在关键词列表页：

1. **按网站筛选**：
   - 下拉选择网站
   - 只显示该网站的关键词

2. **按域名筛选**：
   - 选择网站后显示域名选项
   - 下拉选择域名
   - 只显示该域名有排名的关键词

## API 端点

### 关键词管理

#### 获取关键词列表
```http
GET /api/keywords?websiteId={websiteId}&domainAliasId={domainAliasId}
```

**查询参数**：
- `websiteId`（可选）：按网站筛选
- `domainAliasId`（可选）：按域名筛选

**响应**：
```json
[
  {
    "id": "clxxxx...",
    "keyword": "telegram 下载",
    "volume": 10000,
    "difficulty": 45,
    "cpc": 0.85,
    "website": {
      "id": "clxxxx...",
      "name": "TG中文纸飞机"
    },
    "rankings": [
      {
        "position": 5,
        "searchEngine": "google",
        "createdAt": "2025-11-06T10:00:00Z",
        "domainAlias": {
          "domain": "tg-download.com",
          "siteName": "TG下载站"
        }
      }
    ]
  }
]
```

#### 创建关键词
```http
POST /api/keywords
Content-Type: application/json

{
  "keyword": "telegram 教程",
  "volume": 5000,
  "difficulty": 30,
  "cpc": 0.65,
  "websiteId": "clxxxx..."
}
```

#### 获取关键词详情
```http
GET /api/keywords/{id}
```

#### 更新关键词
```http
PUT /api/keywords/{id}
Content-Type: application/json

{
  "keyword": "telegram 使用教程",
  "volume": 6000,
  "difficulty": 35
}
```

#### 删除关键词
```http
DELETE /api/keywords/{id}
```

### 排名管理

#### 添加排名记录
```http
POST /api/keywords/{id}/rankings
Content-Type: application/json

{
  "position": 8,
  "url": "https://example.com/blog/post",
  "searchEngine": "google",
  "domainAliasId": "clxxxx..." (optional)
}
```

#### 获取排名历史
```http
GET /api/keywords/{id}/rankings?domainAliasId={domainAliasId}&searchEngine={searchEngine}&limit={limit}
```

**查询参数**：
- `domainAliasId`（可选）：筛选特定域名
- `searchEngine`（可选）：筛选搜索引擎
- `limit`（可选）：限制返回数量（默认100）

## 应用场景

### 场景一：对比域名SEO表现

**需求**：比较同一关键词在不同域名的排名

**操作**：
1. 为关键词"telegram 下载"添加多个排名记录
   - 域名A在Google排名第3位
   - 域名B在Google排名第8位
   - 主域名在Google排名第15位

2. 在详情页查看分组排名
   - 一目了然看出域名A表现最好
   - 可以将资源集中优化域名A

### 场景二：追踪排名变化趋势

**需求**：监控关键词排名是上升还是下降

**操作**：
1. 定期（每周/每月）添加排名记录
   - 2025-11-01: #15
   - 2025-11-08: #12
   - 2025-11-15: #8

2. 在排名历史中查看时间序列
   - 排名从15位上升到8位
   - 说明SEO优化有效

### 场景三：多搜索引擎对比

**需求**：对比同一关键词在不同搜索引擎的表现

**操作**：
1. 为同一关键词添加不同搜索引擎的排名
   - Google: #5
   - Baidu: #12
   - Bing: #3

2. 分析不同搜索引擎的优化策略
   - Google表现较好，继续维持
   - Baidu需要针对性优化
   - Bing表现最佳，可以重点引流

### 场景四：域名筛选查看

**需求**：只查看特定域名的关键词排名

**操作**：
1. 在列表页选择网站：TG中文纸飞机
2. 选择域名：tg-download.com
3. 系统自动筛选：
   - 只显示该域名有排名记录的关键词
   - 排名列显示该域名的最新排名

## 最佳实践

### 1. 关键词组织

#### 按主题分类
```
网站：TG中文纸飞机
  ├── 下载类关键词
  │     ├── telegram 下载
  │     ├── telegram 中文版下载
  │     └── telegram 安装包
  ├── 教程类关键词
  │     ├── telegram 使用教程
  │     ├── telegram 注册教程
  │     └── telegram 设置教程
  └── 功能类关键词
        ├── telegram 秘密聊天
        ├── telegram 频道
        └── telegram 机器人
```

### 2. 排名追踪频率

- **竞争激烈的关键词**：每周追踪
- **中等竞争关键词**：每2周追踪
- **长尾关键词**：每月追踪

### 3. 域名策略

#### 为不同主题分配不同域名
```
主域名 (tg.com)
  └── 品牌词：telegram, TG

域名A (tg-download.com) - 下载主题
  └── 重点优化下载类关键词

域名B (tg-tutorial.com) - 教程主题
  └── 重点优化教程类关键词

域名C (tg-security.com) - 安全主题
  └── 重点优化安全隐私类关键词
```

### 4. 数据分析

#### 定期生成报告
1. **每月排名报告**
   - 哪些关键词排名上升
   - 哪些关键词排名下降
   - 哪些域名表现最好

2. **竞争分析**
   - 高价值关键词（高搜索量+低难度）
   - 需要优化的关键词（高难度+低排名）
   - 机会关键词（中等搜索量+低竞争）

3. **ROI 计算**
   - CPC × 预估点击率 × 搜索量
   - 评估关键词的投入产出比

## 技术架构

### 数据库设计

```prisma
model Keyword {
  id         String @id @default(cuid())
  keyword    String
  volume     Int?
  difficulty Int?
  cpc        Float?

  rankings KeywordRanking[]

  websiteId String
  website   Website @relation(...)

  @@unique([websiteId, keyword])
}

model KeywordRanking {
  id           String @id @default(cuid())
  position     Int
  url          String
  searchEngine String @default("google")

  createdAt DateTime @default(now())

  keywordId String
  keyword   Keyword @relation(...)

  domainAliasId String?
  domainAlias   DomainAlias? @relation(...)

  @@index([keywordId, domainAliasId, createdAt])
}
```

### 前端架构

```
/keywords                   - 列表页（筛选、搜索）
/keywords/create            - 创建页（表单）
/keywords/{id}              - 详情页（排名历史、添加排名）
/keywords/{id}/edit         - 编辑页（更新指标）
```

### API 设计原则

1. **RESTful 风格**
   - GET：查询
   - POST：创建
   - PUT：更新
   - DELETE：删除

2. **筛选支持**
   - 通过查询参数筛选
   - 支持多条件组合

3. **关联查询**
   - 使用 Prisma include
   - 减少 N+1 查询问题

## 故障排查

### 问题1：无法创建关键词

**原因**：关键词已存在（同一网站下关键词唯一）

**解决方案**：
1. 检查是否已有相同关键词
2. 如需修改，使用编辑功能
3. 如需不同拼写，创建新关键词

### 问题2：排名记录不显示

**原因**：域名筛选器过滤了记录

**解决方案**：
1. 清除域名筛选（选择"全部域名"）
2. 检查排名记录是否关联了正确的域名
3. 验证排名记录是否成功创建

### 问题3：域名选择器不显示

**原因**：未先选择网站

**解决方案**：
1. 先在网站筛选器选择网站
2. 域名选择器会自动显示
3. 选择后才会按域名筛选

## 总结

关键词管理系统的核心价值：

1. **多域名支持**：追踪每个域名的SEO表现
2. **排名历史**：监控排名变化趋势
3. **多搜索引擎**：对比不同搜索引擎效果
4. **数据驱动**：基于指标优化SEO策略
5. **灵活筛选**：快速定位目标关键词

通过系统化管理关键词和排名数据，可以：
- 提高SEO工作效率
- 发现优化机会
- 评估优化效果
- 指导内容策略

定期追踪和分析关键词排名是SEO成功的关键！
