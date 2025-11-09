# 域名配置快速参考

## 📊 域名分配总览

| 域名 | Vercel 项目 | 状态 | 主/副域名 | 主标签 |
|------|------------|------|----------|--------|
| telegram1688.com | website-tg | ✅ 已添加到数据库 | 🔵 主域名 | telegram, tg, 中文版 |
| telegram2688.com | website-tg | ✅ 已添加到数据库 | ⚪ 副域名 | telegram, tg, 纸飞机 |
| telegramcnfw.com | website-tg | ✅ 已添加到数据库 | ⚪ 副域名 | telegram, 中文, 服务 |
| telegramcny28.com | website-1 | ✅ 已添加到数据库 | 🔵 主域名 | telegram, 社区, 中文 |
| telegramfuwu.com | website-1 | ✅ 已添加到数据库 | ⚪ 副域名 | telegram, 服务, 指南 |
| telegramjiaoyu.com | website-2 | ✅ 已添加到数据库 | 🔵 主域名 | telegram, 教育, 学习 |
| telegramrmb28.com | website-2 | ✅ 已添加到数据库 | ⚪ 副域名 | telegram, 资源, 中文 |

---

## 🔗 Vercel 项目信息

### website-tg (TG中文纸飞机)
- **项目 ID**: prj_aN8JC3AfUyQsnTZVdpO84Pf5SPvH
- **项目名**: website-tg
- **域名数量**: 3 个
- **域名列表**:
  1. telegram1688.com (主)
  2. telegram2688.com
  3. telegramcnfw.com

### website-1 (Demo Website 1)
- **项目 ID**: prj_dGal6NS8cuRCsXBHRysQ4rMUARWH
- **项目名**: website-1
- **域名数量**: 2 个
- **域名列表**:
  1. telegramcny28.com (主)
  2. telegramfuwu.com

### website-2 (Demo Website 2)
- **项目 ID**: prj_UCOP3BYbuHIu9QmVjSN70mzH1bFm
- **项目名**: website-2
- **域名数量**: 2 个
- **域名列表**:
  1. telegramjiaoyu.com (主)
  2. telegramrmb28.com

---

## 📋 DNS 配置清单

对于每个域名，在域名注册商添加以下记录：

```
类型: CNAME
主机记录: @
记录值: cname.vercel-dns.com.
TTL: 600 (10分钟)
```

### 配置状态：

- [ ] telegram1688.com - DNS 配置
- [ ] telegram2688.com - DNS 配置
- [ ] telegramcnfw.com - DNS 配置
- [ ] telegramcny28.com - DNS 配置
- [ ] telegramfuwu.com - DNS 配置
- [ ] telegramjiaoyu.com - DNS 配置
- [ ] telegramrmb28.com - DNS 配置

---

## 🚀 Vercel 域名添加清单

### website-tg
访问: https://vercel.com/dashboard → website-tg → Settings → Domains

- [ ] 添加 telegram1688.com
- [ ] 添加 telegram2688.com
- [ ] 添加 telegramcnfw.com
- [ ] 等待验证通过

### website-1
访问: https://vercel.com/dashboard → website-1 → Settings → Domains

- [ ] 添加 telegramcny28.com
- [ ] 添加 telegramfuwu.com
- [ ] 等待验证通过

### website-2
访问: https://vercel.com/dashboard → website-2 → Settings → Domains

- [ ] 添加 telegramjiaoyu.com
- [ ] 添加 telegramrmb28.com
- [ ] 等待验证通过

---

## 🎯 SEO 标签配置

### website-tg 域名的 SEO 标签

| 域名 | 站点名称 | 主标签 | 副标签 |
|------|---------|--------|--------|
| telegram1688.com | Telegram中文站 - TG纸飞机中文版下载 | telegram, tg, 中文版 | 下载, 教程, 安装, 注册 |
| telegram2688.com | Telegram2688 - 纸飞机中文官方下载 | telegram, tg, 纸飞机 | 官方, 中文, 安全, 下载 |
| telegramcnfw.com | Telegram中文服务 - TG中文版资讯 | telegram, 中文, 服务 | 技术支持, 教程, 资讯, cn |

### website-1 域名的 SEO 标签

| 域名 | 站点名称 | 主标签 | 副标签 |
|------|---------|--------|--------|
| telegramcny28.com | TelegramCNY - 中文纸飞机社区 | telegram, 社区, 中文 | 技巧, 分享, 交流, 教程 |
| telegramfuwu.com | Telegram服务站 - TG使用指南 | telegram, 服务, 指南 | 使用, 教程, 帮助, 问答 |

### website-2 域名的 SEO 标签

| 域名 | 站点名称 | 主标签 | 副标签 |
|------|---------|--------|--------|
| telegramjiaoyu.com | Telegram教育站 - TG学习平台 | telegram, 教育, 学习 | 教程, 培训, 课程, 技巧 |
| telegramrmb28.com | TelegramRMB - 中文纸飞机资源站 | telegram, 资源, 中文 | 频道, 群组, 分享, 推荐 |

---

## 🔍 验证方法

### 1. 检查 DNS 解析

```bash
# 检查所有域名的 DNS 解析
nslookup telegram1688.com
nslookup telegram2688.com
nslookup telegramcnfw.com
nslookup telegramcny28.com
nslookup telegramfuwu.com
nslookup telegramjiaoyu.com
nslookup telegramrmb28.com
```

所有域名应该返回指向 Vercel 的 CNAME 记录。

### 2. 测试 HTTPS 访问

```bash
# 测试所有域名是否可以访问
curl -I https://telegram1688.com
curl -I https://telegram2688.com
curl -I https://telegramcnfw.com
curl -I https://telegramcny28.com
curl -I https://telegramfuwu.com
curl -I https://telegramjiaoyu.com
curl -I https://telegramrmb28.com
```

所有域名应该返回 `200 OK` 或 `301/302` 重定向。

### 3. 检查数据库配置

```bash
cd packages/database
dotenv -e ../../.env.local -- npx prisma studio
```

访问 http://localhost:5555，查看 `domain_aliases` 表，确认所有 7 个域名都已添加。

---

## 📈 多域名 SEO 策略

### 内容分发策略

1. **telegram1688.com** (主站)
   - 定位: Telegram 中文版官方下载
   - 内容: 下载教程、安装指南、基础使用
   - 目标用户: 新手用户

2. **telegram2688.com**
   - 定位: Telegram 中文官方资讯
   - 内容: 功能介绍、更新日志、安全指南
   - 目标用户: 注重安全的用户

3. **telegramcnfw.com**
   - 定位: Telegram 中文技术服务
   - 内容: 技术支持、问题解答、高级功能
   - 目标用户: 技术用户

4. **telegramcny28.com**
   - 定位: Telegram 中文社区
   - 内容: 使用技巧、经验分享、社群推荐
   - 目标用户: 活跃用户

5. **telegramfuwu.com**
   - 定位: Telegram 服务指南
   - 内容: 使用帮助、FAQ、常见问题
   - 目标用户: 需要帮助的用户

6. **telegramjiaoyu.com**
   - 定位: Telegram 教育平台
   - 内容: 系统教程、学习课程、进阶指南
   - 目标用户: 学习型用户

7. **telegramrmb28.com**
   - 定位: Telegram 资源站
   - 内容: 频道推荐、群组分享、资源汇总
   - 目标用户: 寻找资源的用户

---

## 🛠️ 管理工具

### 检查部署状态
```bash
cd packages/database
dotenv -e ../../.env.local -- npx tsx check-vercel-deployments.ts
```

### 查看环境变量
```bash
cd packages/database
dotenv -e ../../.env.local -- npx tsx verify-vercel-env-vars.ts
```

### 查看域名配置
```bash
cd packages/database
dotenv -e ../../.env.local -- npx prisma studio
# 访问 http://localhost:5555
# 查看 domain_aliases 表
```

---

## 📞 联系信息

- **Admin 后台**: https://vercel.com/dashboard
- **数据库管理**: http://localhost:5555 (Prisma Studio)
- **本地开发**: http://localhost:3100 (Admin)

---

**最后更新**: 2025-11-09
**配置状态**: 数据库配置完成 ✅ | DNS 配置待完成 ⏳ | Vercel 添加待完成 ⏳
