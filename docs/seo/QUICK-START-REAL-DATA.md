# 快速开始：获取真实 SEO 数据

本指南将帮助您在 **15 分钟内** 开始获取真实的关键词和排名数据。

---

## 📋 前提条件

- ✅ 已完成数据库初始化（运行过 `npx tsx prisma/seed.ts`）
- ✅ 数据库中已有关键词记录（至少1个）
- ✅ 有信用卡或 PayPal 账号（用于充值测试，最低 $1）

---

## 🚀 方案 A：最快开始（DataForSEO + SerpApi）

### 步骤 1：注册 DataForSEO（5 分钟）

1. 访问注册页面：https://app.dataforseo.com/register

2. 填写信息注册账号（**无需验证，立即可用**）

3. 登录后进入 Dashboard

4. 点击 "API Credentials" 获取：
   - Login (用户名)
   - Password (API 密码)

5. 充值测试（最低 $1）：
   - 点击 "Add Funds"
   - 充值 $1-5 美元即可测试数百个关键词
   - 价格：$0.003/关键词（$1 可查询约 330 个关键词）

### 步骤 2：注册 SerpApi（3 分钟）

1. 访问注册页面：https://serpapi.com/users/sign_up

2. 使用 Google 账号快速注册

3. 登录后进入 Dashboard

4. 复制 "Your API Key"

5. **免费额度：100 次/月**（无需付费）

### 步骤 3：配置环境变量（2 分钟）

```bash
# 进入项目目录
cd /home/ubuntu/WebstormProjects/seo-websites-monorepo

# 复制环境变量模板
cp .env.seo.example .env.seo

# 编辑配置文件
nano .env.seo
```

填入您的 API 凭证：

```bash
# DataForSEO 配置
DATAFORSEO_LOGIN=your_login          # ← 填入 DataForSEO 的 Login
DATAFORSEO_PASSWORD=your_password    # ← 填入 DataForSEO 的 Password

# SerpApi 配置
SERPAPI_KEY=your_api_key_here       # ← 填入 SerpApi 的 API Key
```

保存文件（Ctrl + X，然后 Y，然后 Enter）

### 步骤 4：运行更新脚本（5 分钟）

```bash
# 加载环境变量
export $(cat .env.seo | xargs)

# 运行更新脚本（先试运行查看效果）
npx tsx scripts/update-keyword-data.ts --dry-run --limit=3

# 看起来正常？运行实际更新（限制前10个关键词）
npx tsx scripts/update-keyword-data.ts --limit=10

# 成功后，更新所有关键词
npx tsx scripts/update-keyword-data.ts
```

### 步骤 5：查看结果

```bash
# 启动 Prisma Studio 查看数据
cd packages/database
npx prisma studio --port 5555
```

打开浏览器访问：http://localhost:5555

查看：
- `Keyword` 表：搜索量、难度、CPC 已更新为真实数据
- `KeywordRanking` 表：已添加排名记录

---

## 🎯 脚本使用说明

### 基本用法

```bash
# 更新所有关键词数据 + 检查排名
npx tsx scripts/update-keyword-data.ts

# 只更新关键词数据（不检查排名）
npx tsx scripts/update-keyword-data.ts --keywords-only

# 只检查排名（不更新关键词数据）
npx tsx scripts/update-keyword-data.ts --rankings-only

# 限制处理数量（测试用）
npx tsx scripts/update-keyword-data.ts --limit=5

# 只处理特定网站的关键词
npx tsx scripts/update-keyword-data.ts --website-id=clx...

# 试运行（不写入数据库）
npx tsx scripts/update-keyword-data.ts --dry-run
```

### 输出示例

```
🚀 开始更新关键词数据...

📊 正在获取关键词列表...
✅ 找到 7 个关键词

📈 正在获取关键词搜索量数据...
   处理批次 1/1 (7 个关键词)...
   ✓ telegram: 搜索量=1500000, 难度=87, CPC=$0.45
   ✓ telegram download: 搜索量=550000, 难度=65, CPC=$0.32
   ✓ telegram web: 搜索量=450000, 难度=71, CPC=$0.28
   ...

✅ 成功更新 7 个关键词的搜索数据

🔍 正在检查关键词排名...
   检查 SerpApi 配额...
   配额: 15/100 (剩余 85 次)

   准备检查 7 个关键词的排名...

   [1/7] 检查 "telegram" 在 telegramdata.com 的排名...
   ✓ 找到排名: 第 12 位 (https://www.telegramdata.com/)

   [2/7] 检查 "telegram download" 在 telegramdata.com 的排名...
   ✓ 找到排名: 第 5 位 (https://www.telegramdata.com/download)
   ...

✅ 检查了 7 个关键词，找到 5 个排名

✨ 更新完成！
```

---

## 💰 成本计算

### 测试阶段（前1个月）

**DataForSEO**：
- 充值：$5
- 查询：假设 100 个关键词
- 成本：100 × $0.003 = $0.30
- 剩余：$4.70

**SerpApi**：
- 免费额度：100 次/月
- 查询：假设 20 个关键词排名
- 成本：$0（免费额度内）

**总计**: $5（实际使用仅 $0.30）

### 生产阶段（每月）

假设您有：
- 500 个关键词
- 每月更新 2 次关键词数据
- 每周检查 1 次排名（每次 100 个关键词）

**DataForSEO**：
- 关键词更新：500 × 2 × $0.003 = $3/月

**SerpApi**：
- 排名检查：100 × 4 周 = 400 次/月
- 超出免费额度：400 - 100 = 300 次
- 需要开发者版：$50/月（5,000 次）

**总计**: ~$53/月

**节省方式**：
- 只更新重要关键词（减少 DataForSEO 成本）
- 减少排名检查频率（节省 SerpApi 配额）
- 使用 Google Search Console 获取免费排名数据

---

## 🆓 方案 B：完全免费方案

如果预算有限，可以使用完全免费的方案：

### 1. Google Search Console（推荐）

**优势**：
- ✅ 完全免费
- ✅ 官方权威数据
- ✅ 包含点击量、曝光量、排名

**步骤**：
1. 添加网站到 GSC：https://search.google.com/search-console
2. 验证网站所有权
3. 等待 3-7 天收集数据
4. 集成 GSC API（参考 `docs/SEO-DATA-INTEGRATION.md`）

### 2. Bing Webmaster Tools

**优势**：
- ✅ 完全免费
- ✅ 类似 GSC
- ✅ 补充 Bing 搜索数据

**步骤**：
1. 访问：https://www.bing.com/webmasters
2. 添加网站并验证
3. 获取 API Key
4. 集成 Bing API

### 3. 手动导入

**适用场景**：起步阶段，关键词数量少

**步骤**：
1. 使用 Google Keyword Planner（免费）导出关键词数据
2. 手动记录排名位置
3. 通过 Prisma Studio 或 Admin 后台录入

---

## 🔄 定时自动更新

### 方法 1：Cron Job（Linux）

```bash
# 编辑 crontab
crontab -e

# 添加定时任务（每天凌晨 2 点更新）
0 2 * * * cd /home/ubuntu/WebstormProjects/seo-websites-monorepo && export $(cat .env.seo | xargs) && npx tsx scripts/update-keyword-data.ts >> logs/seo-update.log 2>&1
```

### 方法 2：PM2 Cron

```bash
# 创建 PM2 生态系统配置
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'seo-updater',
      script: 'npx',
      args: 'tsx scripts/update-keyword-data.ts',
      cron_restart: '0 2 * * *', // 每天凌晨 2 点
      autorestart: false,
    },
  ],
}
EOF

# 启动
pm2 start ecosystem.config.js
```

### 方法 3：Admin 后台手动触发

创建 API 路由：`apps/admin/app/api/seo/update/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { stdout, stderr } = await execAsync(
      'npx tsx scripts/update-keyword-data.ts'
    )

    return NextResponse.json({
      success: true,
      output: stdout,
      errors: stderr,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
```

然后在 Admin 后台添加按钮调用此 API。

---

## 📊 数据验证

更新后，您应该看到：

### Keyword 表
| 字段 | 更新前 | 更新后 |
|------|--------|--------|
| volume | 10000（假数据） | 1500000（真实搜索量） |
| difficulty | 50（假数据） | 87（真实难度 0-100） |
| cpc | 0.50（假数据） | 0.45（真实 CPC） |

### KeywordRanking 表
| 字段 | 说明 |
|------|------|
| keywordId | 关联的关键词 ID |
| position | 排名位置（1-100） |
| url | 排名的具体 URL |
| searchEngine | google/bing/baidu |
| checkedAt | 检查时间 |

---

## ❓ 常见问题

### Q1: DataForSEO 返回 401 错误

**A**: 检查 Login 和 Password 是否正确。注意：
- Login 是用户名（不是邮箱）
- Password 是 API 密码（不是登录密码）

### Q2: SerpApi 返回 "You have reached your monthly search limit"

**A**: 免费配额用完了。解决方案：
- 使用 `--limit` 参数限制查询数量
- 订阅付费计划
- 使用 Google Search Console 替代

### Q3: 脚本运行很慢

**A**: 这是正常的。为了避免 API 速率限制：
- 关键词更新：每批次之间延迟 1 秒
- 排名检查：每次查询之间延迟 2 秒

100 个关键词大约需要 5-10 分钟。

### Q4: 某些关键词没有排名

**A**: 可能原因：
- 网站在前 100 位之外
- 域名不匹配（检查 website.domain 是否正确）
- 搜索引擎还未收录该页面

### Q5: 如何减少成本？

**A**: 优化策略：
1. 只更新重要关键词（使用 `--website-id` 过滤）
2. 降低更新频率（每周 1 次而非每天）
3. 结合免费工具（GSC + Bing Webmaster）
4. 使用 `--keywords-only` 跳过排名检查

---

## 🎉 下一步

恭喜！您已经成功集成真实 SEO 数据。

**接下来可以：**

1. ✅ 在 Admin 后台查看更新后的数据
2. ✅ 设置定时任务自动更新
3. ✅ 集成 Google Search Console（长期免费方案）
4. ✅ 创建 SEO 报告和趋势图表
5. ✅ 添加排名变化通知（邮件/Slack）

**相关文档：**
- 📄 API 详细对比：`docs/ACCESSIBLE-SEO-APIS.md`
- 📄 完整集成指南：`docs/SEO-DATA-INTEGRATION.md`
- 📄 数据库 Schema：`packages/database/prisma/schema.prisma`

---

需要帮助？欢迎查看文档或提出问题！
