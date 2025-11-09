# Vercel 自定义域名配置指南

本指南将帮你配置 7 个自定义域名到 Vercel 项目。

## 📋 域名分配方案 A

### website-tg (TG中文纸飞机)
- telegram1688.com (主域名)
- telegram2688.com
- telegramcnfw.com

### website-1 (Demo Website 1)
- telegramcny28.com (主域名)
- telegramfuwu.com

### website-2 (Demo Website 2)
- telegramjiaoyu.com (主域名)
- telegramrmb28.com

---

## 🚀 配置步骤

### 步骤 1: 在域名注册商配置 DNS

对于**每个域名**，在你的域名注册商（如阿里云、腾讯云、Cloudflare、GoDaddy 等）添加以下 DNS 记录：

#### CNAME 记录配置：

| 记录类型 | 主机记录 | 记录值 |
|---------|---------|--------|
| CNAME   | @       | cname.vercel-dns.com. |
| CNAME   | www     | cname.vercel-dns.com. |

> **注意**: 记录值末尾的 `.` 不要遗漏！

#### 示例（以阿里云为例）：

1. 登录阿里云控制台
2. 进入 **域名** → **解析设置**
3. 点击 **添加记录**
4. 填写信息：
   - 记录类型: CNAME
   - 主机记录: @
   - 记录值: cname.vercel-dns.com.
   - TTL: 10分钟（默认）
5. 再添加一条 www 记录（可选）

**重复此步骤配置所有 7 个域名的 DNS。**

---

### 步骤 2: 在 Vercel 添加自定义域名

#### 2.1 website-tg (prj_aN8JC3AfUyQsnTZVdpO84Pf5SPvH)

1. 访问: https://vercel.com/dashboard
2. 选择项目 **website-tg**
3. 点击 **Settings** → **Domains**
4. 点击 **Add Domain**
5. 依次添加以下域名：
   - telegram1688.com
   - telegram2688.com
   - telegramcnfw.com
6. 等待 Vercel 验证 DNS 配置

#### 2.2 website-1 (prj_dGal6NS8cuRCsXBHRysQ4rMUARWH)

1. 选择项目 **website-1**
2. Settings → Domains
3. 添加以下域名：
   - telegramcny28.com
   - telegramfuwu.com

#### 2.3 website-2 (prj_UCOP3BYbuHIu9QmVjSN70mzH1bFm)

1. 选择项目 **website-2**
2. Settings → Domains
3. 添加以下域名：
   - telegramjiaoyu.com
   - telegramrmb28.com

---

### 步骤 3: 验证域名配置

#### 3.1 等待 DNS 生效

- DNS 生效时间: 通常 5-30 分钟，最长可能需要 48 小时
- Vercel 会自动检测 DNS 配置
- 配置成功后，域名旁会显示绿色的 ✓

#### 3.2 检查域名状态

在 Vercel Dashboard 的 Domains 页面，你会看到：

- ✅ **Valid Configuration** - 配置成功
- ⚠️ **Invalid Configuration** - DNS 未生效或配置错误
- 🔒 **SSL Certificate** - Vercel 自动为你配置 HTTPS

#### 3.3 测试域名访问

DNS 生效后，访问每个域名测试：

```bash
# 测试 website-tg 的域名
curl -I https://telegram1688.com
curl -I https://telegram2688.com
curl -I https://telegramcnfw.com

# 测试 website-1 的域名
curl -I https://telegramcny28.com
curl -I https://telegramfuwu.com

# 测试 website-2 的域名
curl -I https://telegramjiaoyu.com
curl -I https://telegramrmb28.com
```

所有域名都应该返回 `200 OK`。

---

## 🎯 多域名 SEO 功能验证

配置完成后，验证多域名 SEO 功能是否正常工作：

### 1. 检查不同域名显示的内容

访问不同域名，确认它们根据 **primaryTags** 和 **secondaryTags** 显示不同的文章：

- **telegram1688.com**: 应显示标签为 `telegram, tg, 中文版` 的文章
- **telegramcny28.com**: 应显示标签为 `telegram, 社区, 中文` 的文章
- **telegramjiaoyu.com**: 应显示标签为 `telegram, 教育, 学习` 的文章

### 2. 检查 SEO 元标签

查看网页源代码，确认 `<title>` 和 `<meta>` 标签根据域名自动调整：

```html
<!-- telegram1688.com 应显示 -->
<title>Telegram中文站 - TG纸飞机中文版下载</title>
<meta name="description" content="Telegram1688提供最新TG中文版下载、使用教程和功能介绍">

<!-- telegramjiaoyu.com 应显示 -->
<title>Telegram教育站 - TG学习平台</title>
<meta name="description" content="Telegram教育平台，系统学习TG功能和使用技巧">
```

### 3. 验证文章筛选逻辑

在 Admin 后台创建测试文章：

1. 创建一篇文章，标签为 `telegram, 教育, 学习`
2. 访问 **telegramjiaoyu.com** - 应该能看到这篇文章
3. 访问 **telegram1688.com** - 可能看不到这篇文章（因为标签不匹配）

---

## 🔧 常见问题排查

### 问题 1: DNS 配置后域名无法访问

**原因**: DNS 未生效或配置错误

**解决方法**:
1. 检查 DNS 记录是否正确配置
2. 使用 `nslookup` 检查 DNS 解析:
   ```bash
   nslookup telegram1688.com
   ```
3. 确认返回的 CNAME 指向 `vercel-dns.com`

### 问题 2: Vercel 显示 "Invalid Configuration"

**原因**: DNS 记录未指向 Vercel

**解决方法**:
1. 删除域名的 A 记录（如果有）
2. 确保 CNAME 记录正确
3. 等待 5-10 分钟后刷新页面

### 问题 3: 域名访问显示 404

**原因**:
- Vercel 项目未正确部署
- 域名未添加到正确的项目

**解决方法**:
1. 确认项目已成功部署（查看 Deployments 页面）
2. 确认域名添加到了正确的 Vercel 项目
3. 重新部署项目

### 问题 4: 不同域名显示相同内容

**原因**: 文章标签配置不当

**解决方法**:
1. 检查数据库中的 `domain_aliases` 表
2. 确认 `primaryTags` 和 `secondaryTags` 配置正确
3. 检查文章的标签是否与域名标签匹配

---

## 📊 数据库配置验证

使用以下 SQL 查询验证域名配置：

```sql
-- 查看所有域名配置
SELECT
  da.domain,
  da.siteName,
  da.isPrimary,
  da.primaryTags,
  w.name as websiteName
FROM domain_aliases da
JOIN websites w ON da.websiteId = w.id
ORDER BY w.name, da.isPrimary DESC;

-- 预期结果：
-- telegram1688.com | Telegram中文站... | true  | {telegram,tg,中文版} | TG中文纸飞机
-- telegram2688.com | Telegram2688...   | false | {telegram,tg,纸飞机} | TG中文纸飞机
-- ...
```

你也可以在 Prisma Studio 中查看：
```bash
cd packages/database
dotenv -e ../../.env.local -- npx prisma studio
```

访问 http://localhost:5555，查看 `domain_aliases` 表。

---

## 🎉 配置完成检查清单

配置完成后，确保以下所有项都打勾：

- [ ] 所有 7 个域名的 DNS CNAME 记录已配置
- [ ] 所有域名已添加到对应的 Vercel 项目
- [ ] Vercel 显示所有域名为 "Valid Configuration"
- [ ] 所有域名都可以通过 HTTPS 访问
- [ ] 不同域名显示不同的 SEO 标题和描述
- [ ] 文章根据域名标签正确筛选

---

## 📝 下一步

配置完成后，你可以：

1. **在 Admin 后台管理内容**
   - 创建针对不同域名的文章
   - 使用正确的标签以便域名筛选

2. **监控 SEO 效果**
   - 使用 Google Search Console 添加所有域名
   - 提交 Sitemap
   - 跟踪关键词排名

3. **优化内容策略**
   - 为每个域名定制内容
   - 利用多域名提升 SEO 覆盖面
   - 监控不同域名的流量和转化

---

## 🆘 需要帮助？

如果遇到问题：

1. 检查 Vercel Dashboard 的部署日志
2. 查看浏览器控制台错误
3. 使用 `check-vercel-deployments.ts` 脚本检查部署状态：
   ```bash
   cd packages/database
   dotenv -e ../../.env.local -- npx tsx check-vercel-deployments.ts
   ```

---

**配置时间估计**: 30-60 分钟（包括等待 DNS 生效）

**DNS 生效时间**: 5 分钟 - 48 小时（通常 30 分钟内）

**SSL 证书**: Vercel 自动配置，通常在域名验证后 5 分钟内完成
