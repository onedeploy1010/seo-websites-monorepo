# 🚀 SEO 网站管理系统 - Monorepo

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-316192?style=for-the-badge&logo=postgresql)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwind-css)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-412991?style=for-the-badge&logo=openai)
![Turborepo](https://img.shields.io/badge/Turborepo-2.3-EF4444?style=for-the-badge&logo=turborepo)

**现代化多网站 SEO 管理平台 · AI 驱动 · 服务器部署**

[功能特性](#-功能特性) • [快速开始](#-快速开始) • [部署指南](#-部署指南) • [使用文档](#-使用文档)

</div>

---

## 🎯 项目简介

**SEO 网站管理系统** 是一个基于 **Turborepo** 构建的现代化 SEO 管理平台，专为管理多个网站的 SEO 优化而设计。支持服务器部署，使用宝塔面板轻松管理。

### ✨ 核心亮点

- 🎨 **统一管理多网站** - 一个后台控制所有网站内容和 SEO
- 🤖 **AI 智能优化** - GPT-4 驱动的 SEO 自动优化
- ⚙️ **可视化配置** - 后台设置页面管理 API Keys，无需重新部署
- 🚀 **灵活部署** - 支持服务器 + 宝塔面板部署，完全掌控
- 📊 **实时监控** - 蜘蛛池、排名跟踪、SEO 健康度分析
- 🔐 **安全可靠** - 敏感信息加密存储，JWT 认证
- 🌐 **多域名管理** - 支持为每个网站配置多个域名

### 💡 为什么选择这个项目？

| 传统方案 | 本项目 |
|---------|--------|
| ❌ 每个网站独立管理 | ✅ 统一后台管理多个网站 |
| ❌ 手动编写 SEO 标签 | ✅ AI 自动生成优化标签 |
| ❌ 修改配置需重新部署 | ✅ 后台可视化配置，实时生效 |
| ❌ 复杂的部署流程 | ✅ 宝塔面板一键部署 |
| ❌ 数据分散难以分析 | ✅ 集中数据分析和 SEO 监控 |
| ❌ 依赖云服务平台 | ✅ 完全部署在自己的服务器上 |

### 🎯 适用场景

- 🏢 **SEO 代理公司** - 管理多个客户的网站优化
- 📱 **内容营销团队** - 跨平台内容分发和 SEO
- 🌐 **多域名运营** - 运营多个相似但不同定位的网站
- 🔍 **SEO 优化团队** - 需要统一工具和数据仪表盘
- 🎯 **独立站运营** - 需要完全掌控服务器和数据

---

## ✨ 功能特性

### 📊 1. SEO 健康度监控 🆕

<details>
<summary>点击展开详情</summary>

- 📈 **综合 SEO 评分** - 0-100 分制，实时监控网站 SEO 健康度
- 🔍 **关键指标追踪** - 已索引页面、平均排名、爬虫活跃度
- 📊 **趋势分析** - 30 天 SEO 分数变化趋势图
- ⚠️ **问题诊断** - 自动识别 SEO 问题并提供优化建议
- 🎯 **多维度评估** - 内容质量、技术 SEO、爬虫友好度等

**评分算法**：
- 内容质量 (30%): Meta 标题、描述、关键词覆盖率
- 技术 SEO (25%): 页面速度、移动适配、Sitemap
- 爬虫活跃度 (20%): 搜索引擎爬虫访问频率
- 关键词排名 (15%): 目标关键词排名表现
- 索引状态 (10%): 已索引页面占比

</details>

### 🎨 2. 多网站管理系统

<details>
<summary>点击展开详情</summary>

- 📊 统一后台管理 3+ 个网站
- 🌍 每个网站支持多个域名（主域名 + 备用域名）
- 🔄 内容一键分发到多个网站
- 🎯 每个域名独立的 SEO 配置
- 📈 支持不同的关键词策略和内容定位
- 🗺️ 每个域名自动生成独立 Sitemap

**多域名功能**：
- 主域名 + 多个备用域名
- 每个域名独立的站点名称和描述
- 独立的 Primary/Secondary SEO 关键词
- 自动域名状态检测（ACTIVE/INACTIVE）
- 域名级别的 Sitemap 管理

</details>

### 🤖 3. AI SEO 智能优化

<details>
<summary>点击展开详情</summary>

**单篇文章优化** (`/api/ai/optimize-seo`)
- 🎯 自动生成 SEO 标题（50-60 字符）
- 📝 生成吸引人的元描述（150-160 字符）
- 🔑 智能推荐 5-7 个关键词
- 💡 提供内容优化建议

**批量优化** (`/api/ai/batch-optimize`)
- ⚡ 一次优化最多 20 篇文章
- 📊 实时进度显示
- ✅ 自动保存到数据库
- 📈 详细成功/失败统计

**关键词研究** (`/api/ai/generate-keywords`)
- 🔍 智能关键词生成
- 📊 搜索量和难度估算
- 🎯 长尾关键词建议
- 💡 LSI 相关关键词

**内容分析** (`/api/ai/analyze-content`)
- 📈 SEO 评分（0-100）
- 📖 可读性评分
- 🔑 关键词密度分析
- 💡 优化建议和改进方案

</details>

### 📋 4. 内容模板库

<details>
<summary>点击展开详情</summary>

**6 大类专业模板**
- 📥 **下载指南** - 各平台下载教程
- 📚 **使用教程** - 功能使用详细说明
- ⚡ **功能介绍** - 核心功能深度解析
- ❓ **常见问题** - FAQ 问答格式
- 🔄 **对比分析** - 竞品对比文章
- 🛠️ **技术文档** - 开发者技术指南

**特点：**
- ✅ 预设 SEO 关键词和结构
- ✅ 一键创建高质量内容
- ✅ 提升内容创作效率 6 倍
- ✅ 符合搜索引擎优化标准

</details>

### ⚙️ 5. 系统设置管理

<details>
<summary>点击展开详情</summary>

**后台可视化配置** (`/settings`)
- 🔑 **API Keys 管理** - OpenAI、Google Analytics 等
- 🔐 **敏感信息加密** - AES-256-CBC 加密存储
- ⚡ **实时生效** - 修改后无需重新部署
- 🎯 **分类管理** - API、SEO、分析、通知等分类
- 📊 **配置优先级** - 数据库配置 > 环境变量

**支持配置项：**
- OpenAI API Key（加密）
- OpenAI Model 选择
- Google Analytics ID
- Google Search Console 验证
- Bing Webmaster Key（加密）
- 百度统计 ID

</details>

### 🕷️ 6. 蜘蛛池监控

<details>
<summary>点击展开详情</summary>

- 🔍 实时爬虫访问记录
- 🤖 识别主要搜索引擎爬虫：
  - Googlebot、Bingbot、Baiduspider
  - Yandexbot、360Spider、Sogou Spider
- 📈 访问统计和趋势分析
- 🔔 爬虫访问通知
- 📊 爬虫健康度评分

</details>

### 📊 7. 关键词排名跟踪

<details>
<summary>点击展开详情</summary>

- 🎯 多搜索引擎排名监控
- 📈 排名历史趋势图
- 🔍 关键词难度和搜索量分析
- ⚡ 自动排名检查任务
- 🏆 竞争对手排名对比

</details>

### 🗺️ 8. Sitemap 自动管理

<details>
<summary>点击展开详情</summary>

- 📄 每个域名自动生成独立 Sitemap
- 📤 一键提交到 Google 搜索引擎
- 🔄 支持多种类型（Posts、Pages、Categories）
- ⏰ 实时更新
- ✅ 提交状态追踪
- 🌐 多域名视图 + 传统视图切换

</details>

---

## 🛠️ 技术栈

### 前端技术

| 技术 | 版本 | 用途 |
|------|------|------|
| [Next.js](https://nextjs.org/) | 14.2.33 | React 框架 + App Router |
| [TypeScript](https://www.typescriptlang.org/) | 5.3.3 | 类型安全 |
| [Tailwind CSS](https://tailwindcss.com/) | 3.3+ | 实用优先 CSS |
| [React Query](https://tanstack.com/query) | 5.13+ | 数据获取 |

### 后端技术

| 技术 | 版本 | 用途 |
|------|------|------|
| [Prisma](https://www.prisma.io/) | 5.7+ | ORM |
| [PostgreSQL](https://www.postgresql.org/) | 14+ | 关系型数据库 |
| [NextAuth.js](https://next-auth.js.org/) | 4.24+ | 身份验证 |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | 2.4+ | 密码加密 |

### AI 服务

| 技术 | 版本 | 用途 |
|------|------|------|
| [Vercel AI SDK](https://sdk.vercel.ai/) | 5.0+ | AI 集成框架 |
| [@ai-sdk/openai](https://www.npmjs.com/package/@ai-sdk/openai) | 1.0+ | OpenAI 适配器 |
| [OpenAI GPT-4](https://openai.com/) | GPT-4 Turbo | 大语言模型 |

### 开发工具

| 技术 | 版本 | 用途 |
|------|------|------|
| [Turborepo](https://turbo.build/repo) | 2.3+ | Monorepo 构建 |
| [pnpm](https://pnpm.io/) | 8.0+ | 包管理器 |
| [ESLint](https://eslint.org/) | 8.57+ | 代码检查 |

### 服务器部署

| 工具 | 用途 |
|------|------|
| [宝塔面板](https://www.bt.cn/) | 服务器管理面板 |
| [PM2](https://pm2.keymetrics.io/) | Node.js 进程管理 |
| [Nginx](https://nginx.org/) | 反向代理服务器 |

---

## 🏗️ 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                   Frontend Websites Layer                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Website-1   │  │  Website-2   │  │  Website-TG  │      │
│  │ (Port 3001)  │  │ (Port 3002)  │  │ (Port 3003)  │      │
│  │ 多域名支持    │  │ 多域名支持    │  │ 多域名支持    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────┬────────────┬──────────────┬───────────────────┘
             │            │              │
             └────────────┴──────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────────┐
│             Admin Panel Layer (Port 3100)                    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Admin Panel                                        │    │
│  │  • Website Management                               │    │
│  │  • Multi-Domain Management 🆕                      │    │
│  │  • Content Distribution                             │    │
│  │  • AI SEO Optimization                              │    │
│  │  • SEO Health Dashboard 🆕                         │    │
│  │  • System Settings                                  │    │
│  │  • Spider Pool Monitoring                           │    │
│  │  • Keyword Tracking                                 │    │
│  │  • Sitemap Management                               │    │
│  └─────────────────────────────────────────────────────┘    │
└────────────┬───────────────────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────────────────────┐
│                   Data & Services Layer                      │
│  ┌──────────────────┐  ┌──────────────────────────────┐    │
│  │  PostgreSQL DB   │  │  External Services           │    │
│  │  • Websites      │  │  • OpenAI GPT-4              │    │
│  │  • DomainAliases │  │  • Google Analytics          │    │
│  │  • Posts         │  │  • Google Search Console     │    │
│  │  • Keywords      │  │  • Baidu Tongji              │    │
│  │  • SpiderLogs    │  └──────────────────────────────┘    │
│  │  • Sitemaps      │                                       │
│  │  • Settings      │                                       │
│  └──────────────────┘                                       │
└─────────────────────────────────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                   Infrastructure Layer                       │
│  ┌──────────────────┐  ┌──────────────────────────────┐    │
│  │  Nginx           │  │  PM2 Process Manager         │    │
│  │  • Reverse Proxy │  │  • seo-admin (3100)          │    │
│  │  • SSL Certs     │  │  • seo-website-1 (3001)      │    │
│  │  • Load Balance  │  │  • seo-website-2 (3002)      │    │
│  └──────────────────┘  │  • seo-website-tg (3003)     │    │
│                        └──────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 快速开始

### 前置要求

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0（推荐）或 **npm** >= 9.0.0
- **PostgreSQL** >= 14.0

### 本地开发

#### 1. 克隆仓库

```bash
git clone https://github.com/onedeploy1010/seo-websites-monorepo.git
cd seo-websites-monorepo
```

#### 2. 安装依赖

```bash
pnpm install
```

#### 3. 配置数据库

**本地 PostgreSQL：**

```bash
sudo -u postgres psql
CREATE DATABASE seo_monorepo;
\q
```

**配置环境变量：**

```bash
cd packages/database
echo 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/seo_monorepo"' > .env
```

#### 4. 初始化数据库

```bash
cd packages/database
npx prisma db push
npm run db:seed
```

#### 5. 配置 Admin 环境变量

创建 `.env.local` 文件在项目根目录：

```bash
cp .env.example .env.local
```

编辑 `.env.local`：

```env
# 数据库配置
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/seo_monorepo"

# 认证配置
NEXTAUTH_URL="http://localhost:3100"
NEXTAUTH_SECRET="生成密钥: openssl rand -base64 32"

# 设置加密密钥
SETTINGS_ENCRYPTION_KEY="生成密钥: openssl rand -base64 32"

# OpenAI API（可选，可在后台配置）
OPENAI_API_KEY="sk-..."
```

#### 6. 启动开发服务器

```bash
pnpm dev
```

访问：
- 🎨 **Admin Panel**: http://localhost:3100
- 🌐 **Website-1**: http://localhost:3001
- 🌐 **Website-2**: http://localhost:3002
- 🌐 **Website-TG**: http://localhost:3003

#### 7. 登录后台

- **Email**: `admin@example.com`
- **Password**: `admin123`

⚠️ **首次登录后请立即修改密码！**

---

## 🚢 部署指南

### 服务器部署（推荐）⭐

支持使用宝塔面板快速部署到自己的服务器上，完全掌控数据和服务。

#### 📋 系统要求

- **服务器**: Ubuntu 20.04+ / CentOS 7+ / Debian 10+
- **CPU**: 2核以上
- **内存**: 4GB 以上推荐
- **硬盘**: 20GB 以上
- **软件**: Node.js 18.x+, PostgreSQL 14+, PM2, Nginx

#### 📖 完整部署文档

**推荐阅读：**
- 🌟 **[宝塔完整部署指南](./docs/BAOTA-COMPLETE-GUIDE.md)** - 宝塔面板 + PM2 + Nginx 完整教学（推荐）
- 📋 **[服务器部署指南](./docs/服务器部署指南.md)** - 详细的 12 步部署流程
- 📝 **[批量创建站点格式](./docs/baota-15-domains-final.txt)** - 宝塔批量创建 15 个域名的格式文件

主要步骤包括：
1. 安装宝塔面板
2. 配置软件栈（Node.js, PostgreSQL, PM2, Nginx）
3. 创建数据库
4. 上传项目代码
5. 配置环境变量
6. 初始化数据库
7. 构建应用
8. 使用 PM2 启动服务
9. 配置 Nginx 反向代理
10. 配置 SSL 证书
11. 安全加固
12. 自动化部署

#### ⚡ 快速部署命令

```bash
# 1. 拉取代码
cd /www/wwwroot/
git clone <your-repo-url> seo-websites
cd seo-websites

# 2. 安装依赖
pnpm install

# 3. 配置环境变量
nano .env.local

# 4. 初始化数据库
pnpm db:migrate:deploy
pnpm db:seed

# 5. 构建应用
pnpm build

# 6. 启动服务
pm2 start ecosystem.config.js
pm2 save
```

#### 📊 部署后检查

```bash
# 查看进程状态
pm2 list

# 查看日志
pm2 logs seo-admin

# 实时监控
pm2 monit
```

---

## 📂 项目结构

```
seo-websites-monorepo/
│
├── apps/                           # 应用程序
│   ├── admin/                      # 后台管理 (Port 3100)
│   │   ├── app/
│   │   │   ├── (auth)/login/       # 登录页面
│   │   │   ├── (dashboard)/        # Dashboard 路由组
│   │   │   │   ├── dashboard/      # 主仪表盘 + SEO 健康度
│   │   │   │   ├── websites/       # 网站管理
│   │   │   │   ├── domains/        # 多域名管理 🆕
│   │   │   │   ├── posts/          # 文章管理 + SEO 评分
│   │   │   │   ├── keywords/       # 关键词管理
│   │   │   │   ├── spider/         # 蜘蛛池监控
│   │   │   │   ├── sitemaps/       # Sitemap 管理
│   │   │   │   └── settings/       # 系统设置
│   │   │   └── api/                # API 路由
│   │   │       ├── ai/              # AI SEO API
│   │   │       ├── settings/        # 设置 API
│   │   │       ├── websites/        # 网站 API
│   │   │       ├── domains/         # 域名 API 🆕
│   │   │       ├── posts/           # 文章 API
│   │   │       └── seo-health/      # SEO 健康度 API 🆕
│   │   ├── components/
│   │   │   ├── AISEOOptimizer.tsx
│   │   │   ├── BatchOptimizer.tsx
│   │   │   ├── SEOHealthDashboard.tsx 🆕
│   │   │   └── Sidebar.tsx
│   │   ├── lib/
│   │   │   ├── auth.ts             # NextAuth 配置
│   │   │   └── openai-config.ts    # AI 配置
│   │   └── messages/               # i18n 翻译文件
│   │       ├── en.json
│   │       └── zh.json
│   │
│   ├── website-1/                  # 网站 1 (Port 3001)
│   ├── website-2/                  # 网站 2 (Port 3002)
│   └── website-tg/                 # 网站 TG (Port 3003)
│
├── packages/                       # 共享包
│   ├── database/                   # 数据库包
│   │   ├── prisma/
│   │   │   ├── schema.prisma       # Prisma Schema
│   │   │   └── seed.ts             # 种子数据
│   │   ├── lib/
│   │   │   └── settings.ts         # 设置服务
│   │   └── .env                    # 数据库配置
│   ├── seo-tools/                  # SEO 工具库
│   ├── ui-components/              # 共享 UI 组件
│   └── templates/                  # 内容模板库
│
├── docs/                           # 📚 完整文档目录
│   ├── 服务器部署指南.md             # 服务器部署完整指南（宝塔面板）
│   ├── 域名配置指南.md               # 15个域名配置说明
│   ├── 使用说明书.md                 # 用户使用手册
│   ├── SEO-KEYWORD-OPTIMIZATION-GUIDE.md # SEO关键词优化指南
│   ├── SYSTEM-SETTINGS.md            # 系统设置说明
│   └── ...                          # 其他技术文档
├── scripts/                        # 🛠️ 自动化部署脚本
│   ├── quick-setup.sh               # 一键部署脚本（11步）
│   ├── fix-postgresql.sh            # PostgreSQL修复脚本
│   ├── init-database.sh             # 数据库初始化脚本
│   └── deploy-domains.sh            # 域名配置部署脚本
├── .env.example                    # 环境变量示例
├── ecosystem.config.js             # PM2 配置
├── turbo.json                      # Turborepo 配置
└── package.json                    # 根 package.json
```

---

## 📚 使用文档

### 📖 核心文档

| 文档 | 描述 | 链接 |
|------|------|------|
| **服务器部署指南** | 完整的服务器部署流程（含自动化脚本） | [docs/服务器部署指南.md](./docs/服务器部署指南.md) |
| **域名配置指南** | 15个域名的详细配置说明 | [docs/域名配置指南.md](./docs/域名配置指南.md) |
| **使用说明书** | 系统功能详细使用说明 | [docs/使用说明书.md](./docs/使用说明书.md) |

### 🎯 快速链接

**部署相关**：
- 🚀 [服务器部署指南](./docs/服务器部署指南.md) - 从零开始部署到生产环境
- 🌐 [域名配置指南](./docs/域名配置指南.md) - 15个域名的完整配置说明
- ⚡ [一键部署脚本](./scripts/quick-setup.sh) - 自动化部署（11个步骤）
- 🔧 [环境变量配置](./docs/服务器部署指南.md#-第四步使用自动化脚本部署) - 必需的环境变量说明

**使用相关**：
- 📖 [使用说明书](./docs/使用说明书.md) - 完整功能使用指南
- 🎯 [快速开始](./docs/使用说明书.md#-快速开始) - 5 分钟上手指南
- ❓ [常见问题](./docs/使用说明书.md#-常见问题-faq) - 10 个常见问题解答

---

## 🔧 配置说明

### 必需环境变量

#### Admin 后台

```env
# 数据库（必需）
DATABASE_URL="postgresql://seo_user:password@localhost:5432/seo_websites"

# 认证（必需）
NEXTAUTH_SECRET="openssl rand -base64 32"
NEXTAUTH_URL="https://admin.yourdomain.com"

# 加密（推荐）
SETTINGS_ENCRYPTION_KEY="openssl rand -base64 32"

# AI 优化（可选 - 可在后台配置）
OPENAI_API_KEY="sk-..."
```

#### 前台网站

```env
DATABASE_URL="postgresql://seo_user:password@localhost:5432/seo_websites"
NEXT_PUBLIC_SITE_URL="https://www.yourdomain.com"
NEXT_PUBLIC_SITE_NAME="网站名称"
```

### 配置优先级

```
数据库设置（/settings 页面） > 环境变量 > 默认值
```

### 生成密钥

```bash
# 生成 NEXTAUTH_SECRET
openssl rand -base64 32

# 生成 SETTINGS_ENCRYPTION_KEY
openssl rand -base64 32
```

---

## 📊 使用统计

### 项目规模

- 📁 **总文件数**: 200+
- 📝 **代码行数**: 15,000+
- 📦 **依赖包**: 500+
- 🎨 **页面数**: 20+
- 🔌 **API 端点**: 40+

### 性能指标

- ⚡ **构建时间**: ~15 秒
- 🚀 **首次加载**: < 1 秒
- 📊 **Lighthouse 评分**: 95+
- 🎯 **类型覆盖率**: 100%

---

## 🔒 安全特性

- ✅ **密码加密** - bcrypt 哈希存储
- ✅ **JWT 认证** - 无状态会话管理
- ✅ **AES-256 加密** - 敏感配置加密存储
- ✅ **CSRF 保护** - NextAuth 内置保护
- ✅ **SQL 注入防护** - Prisma ORM 参数化查询
- ✅ **XSS 防护** - React 自动转义
- ✅ **环境隔离** - 生产/开发/预览环境分离

---

## ❓ 常见问题

<details>
<summary><b>Q1: 如何修改管理员密码？</b></summary>

**A:** 首次登录后：
1. 使用默认账号登录：`admin@example.com` / `admin123`
2. 访问个人设置页面
3. 修改密码为强密码
4. 重新登录验证

</details>

<details>
<summary><b>Q2: PM2 进程启动失败怎么办？</b></summary>

**A:** 排查步骤：
```bash
# 1. 查看详细错误日志
pm2 logs seo-admin --lines 50

# 2. 检查端口占用
netstat -tlnp | grep 3100

# 3. 手动测试启动
cd apps/admin
npm run start

# 4. 检查环境变量
cat .env.local
```

详见：[服务器部署指南 - 常见问题排查](./docs/服务器部署指南.md#-常见问题排查)

</details>

<details>
<summary><b>Q3: AI 功能无法使用？</b></summary>

**A:** 两种配置方式：
1. **后台配置**（推荐）：访问 `/settings` 页面配置 OpenAI API Key
2. **环境变量**：在 `.env.local` 中设置 `OPENAI_API_KEY`

优先级：数据库配置 > 环境变量

测试 API Key 是否有效：
- 访问后台 → 系统设置 → API 配置
- 点击"测试连接"按钮

</details>

<details>
<summary><b>Q4: 如何添加新的域名？</b></summary>

**A:** 添加域名步骤：
1. 登录后台
2. 访问"域名管理"页面
3. 点击"添加域名"按钮
4. 填写域名信息：
   - 域名地址（如：example.com）
   - 站点名称
   - 站点描述
   - Primary SEO 关键词
   - Secondary SEO 关键词
5. 配置 Nginx 反向代理指向该域名
6. 配置 DNS 解析到服务器 IP

详见：[使用说明书 - 域名管理](./使用说明书.md#3-域名管理)

</details>

<details>
<summary><b>Q5: 如何查看 SEO 健康度评分？</b></summary>

**A:**
1. 登录后台
2. 访问"Dashboard"页面
3. 查看"SEO 健康度监控"卡片
4. 点击"查看详情"可以看到：
   - 综合 SEO 评分（0-100）
   - 各项指标详情
   - 30 天趋势图
   - 优化建议

评分维度：
- 内容质量 (30%)
- 技术 SEO (25%)
- 爬虫活跃度 (20%)
- 关键词排名 (15%)
- 索引状态 (10%)

</details>

<details>
<summary><b>Q6: Nginx 502 Bad Gateway 错误？</b></summary>

**A:** 解决方法：
```bash
# 1. 检查 PM2 进程状态
pm2 list

# 2. 重启应用
pm2 restart seo-admin

# 3. 检查端口是否监听
netstat -tlnp | grep 3100

# 4. 检查 Nginx 配置
nginx -t

# 5. 重启 Nginx
systemctl restart nginx
```

</details>

<details>
<summary><b>Q7: 数据库连接失败？</b></summary>

**A:** 检查步骤：
```bash
# 1. 测试数据库连接
psql -U seo_user -d seo_websites -h localhost

# 2. 检查 PostgreSQL 状态
systemctl status postgresql

# 3. 检查 DATABASE_URL 格式
# 正确格式：postgresql://用户名:密码@主机:端口/数据库名
echo $DATABASE_URL

# 4. 检查防火墙
ufw status
```

</details>

<details>
<summary><b>Q8: 如何备份数据？</b></summary>

**A:** 使用宝塔面板：
1. 登录宝塔面板
2. 数据库 → 选择数据库 → 备份
3. 设置自动备份计划（推荐每天凌晨）
4. 保留 7 天备份

手动备份：
```bash
pg_dump -U seo_user seo_websites > backup_$(date +%Y%m%d).sql
```

恢复备份：
```bash
psql -U seo_user seo_websites < backup_20250113.sql
```

</details>

<details>
<summary><b>Q9: 如何更新应用到最新版本？</b></summary>

**A:** 使用部署脚本：
```bash
cd /www/wwwroot/seo-websites
./deploy.sh
```

或手动执行：
```bash
# 1. 拉取最新代码
git pull origin master

# 2. 安装依赖
pnpm install

# 3. 运行数据库迁移
pnpm db:migrate:deploy

# 4. 重新构建
pnpm build

# 5. 重启服务
pm2 restart all
```

</details>

<details>
<summary><b>Q10: 如何配置多个前台网站？</b></summary>

**A:** 配置步骤：
1. 在后台创建多个网站记录
2. 为每个网站配置域名
3. 修改 `ecosystem.config.js` 添加应用配置
4. 配置 Nginx 反向代理
5. 启动 PM2 进程

示例配置详见：[服务器部署指南 - PM2 配置](./docs/服务器部署指南.md#第五步配置-nginx-反向代理)

</details>

---

## 🗺️ 开发路线图

### ✅ v1.0 - 当前版本（已完成）

- [x] 多网站管理系统
- [x] 多域名管理功能
- [x] 内容分发功能
- [x] AI SEO 优化（单篇 + 批量）
- [x] SEO 健康度监控
- [x] 系统设置管理
- [x] 蜘蛛池监控
- [x] 关键词跟踪
- [x] Sitemap 管理
- [x] 完整部署文档（服务器 + 宝塔面板）
- [x] 双语支持（中文 + English）

### 🚧 v1.1 - 计划中

- [ ] 批量文章导入/导出（CSV/JSON）
- [ ] 高级 Markdown 编辑器
- [ ] 图片 CDN 集成（本地存储/OSS）
- [ ] 邮件通知系统
- [ ] 数据备份和恢复工具
- [ ] API 文档（Swagger）

### 💡 v2.0 - 未来规划

- [ ] 竞争对手分析
- [ ] 自动内容生成（AI 写作）
- [ ] 社交媒体集成
- [ ] 移动端 App
- [ ] 插件系统
- [ ] 自定义主题
- [ ] Docker 容器化部署

---

## 🤝 贡献指南

欢迎贡献！请遵循以下步骤：

### 提交流程

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m "feat: add amazing feature"`
4. 推送到分支：`git push origin feature/amazing-feature`
5. 创建 Pull Request

### Commit 规范

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式
- `refactor`: 重构
- `test`: 测试
- `chore`: 构建/工具

---

## 📄 许可证

MIT License © 2025

本项目采用 MIT 许可证，可自由使用、修改和分发。

---

## 🙏 致谢

感谢以下开源项目：

- [Next.js](https://nextjs.org/) - React 应用框架
- [Prisma](https://www.prisma.io/) - 现代化 ORM
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Turborepo](https://turbo.build/repo) - Monorepo 工具
- [Vercel AI SDK](https://sdk.vercel.ai/) - AI 集成
- [OpenAI](https://openai.com/) - GPT-4 模型
- [NextAuth.js](https://next-auth.js.org/) - 身份验证
- [宝塔面板](https://www.bt.cn/) - 服务器管理

---

## 📞 支持和反馈

- 🐛 **Issues**: [GitHub Issues](https://github.com/onedeploy1010/seo-websites-monorepo/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/onedeploy1010/seo-websites-monorepo/discussions)
- 📖 **文档**: [服务器部署指南](./docs/服务器部署指南.md) | [使用说明书](./docs/使用说明书.md)

---

<div align="center">

### 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=onedeploy1010/seo-websites-monorepo&type=Date)](https://star-history.com/#onedeploy1010/seo-websites-monorepo&Date)

### ✨

Made with ❤️ by Onelong

**状态**: ✅ 生产就绪 | **文档**: ✅ 完整 | **AI**: ✅ 已集成 | **部署**: ⚡ 服务器 + 宝塔面板

[开始使用](#-快速开始) • [查看文档](#-使用文档) • [立即部署](#-部署指南)

</div>
