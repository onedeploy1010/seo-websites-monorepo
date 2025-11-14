# 📁 项目文件组织说明

## 🎯 整理完成时间
2025-11-14

## 📂 目录结构

### 根目录文件（仅保留重要文件）

```
├── README.md                 # 项目主文档
├── DEPLOYMENT.md            # 快速部署指南
├── menu.sh                  # 🆕 交互式管理菜单（推荐使用）
├── .env.production.example  # 生产环境变量模板
└── ecosystem.config.js      # PM2 配置
```

### scripts/ - 自动化脚本

```
scripts/
├── create-admin-user.js             # 创建管理员用户
├── deploy.sh                        # 一键部署脚本（推荐）
├── update-production-domains.ts     # 更新生产域名
├── update-keyword-data.ts           # SEO 数据更新
├── server-update.sh                 # 服务器更新脚本
├── nginx-config-generator.sh        # Nginx 配置生成器
├── pm2-manage.sh                    # PM2 管理工具
├── init-database.sh                 # 数据库初始化
├── quick-setup.sh                   # 快速设置
└── legacy/                          # 旧脚本存档
    ├── check-env-status.sh
    ├── debug-build.sh
    ├── diagnose-website-2.sh
    ├── fix-nextauth-secret.sh
    ├── fix-server-build.sh
    ├── quick-fix-baota.sh
    ├── quick-setup-env.sh
    ├── restart-services.sh
    └── setup-database-env.sh
```

### docs/ - 完整文档（已分类整理）

```
docs/
├── README.md                         # 📖 文档导航中心
├── FILE-ORGANIZATION.md              # 📁 本文件 - 项目文件组织说明
│
├── deployment/                       # 📦 部署相关文档
│   ├── DEPLOYMENT-GUIDE.md                # 完整部署指南
│   ├── PRODUCTION-DOMAINS-SETUP.md        # 生产域名配置
│   ├── BAOTA-COMPLETE-GUIDE.md            # 宝塔面板完整指南
│   ├── baota-individual-site-proxy-guide.md  # 单站反向代理
│   ├── baota-reverse-proxy-guide.md       # 反向代理通用指南
│   ├── deploy-to-server.md                # 服务器部署步骤
│   ├── 服务器部署指南.md                  # 中文部署指南
│   ├── 域名配置指南.md                    # 中文域名配置
│   └── baota-15-domains-final.txt         # 域名列表
│
├── seo/                              # 🔍 SEO 相关文档
│   ├── TAVILY-QUICK-START.md              # Tavily API 快速开始
│   ├── ACCESSIBLE-SEO-APIS.md             # SEO API 对比与选择
│   ├── SEO-DATA-INTEGRATION.md            # SEO 数据集成指南
│   ├── QUICK-START-REAL-DATA.md           # 快速获取真实数据
│   ├── KEYWORDS_MANAGEMENT.md             # 关键词管理
│   ├── MULTI_DOMAIN_SEO_STRATEGY.md       # 多域名 SEO 策略
│   ├── SEO-KEYWORD-OPTIMIZATION-GUIDE.md  # 关键词优化指南
│   ├── SEO-TOOLS-USAGE.md                 # SEO 工具使用
│   └── SUMMARY-REAL-DATA-INTEGRATION.md   # 真实数据集成总结
│
├── system/                           # ⚙️ 系统管理文档
│   ├── SYSTEM-SETTINGS.md                 # 系统设置说明
│   ├── SYSTEM-SETTINGS-SETUP.md           # 系统设置配置
│   └── WORK-SUMMARY.md                    # 工作总结
│
└── usage/                            # 📖 使用说明
    ├── 使用说明书.md                      # 完整使用手册（中文）
    └── website-2-html-migration-summary.md # Website-2 迁移总结
```

### backups/ - 备份文件夹（新增）

```
backups/
├── db-backup-YYYYMMDD-HHMMSS.sql     # 数据库备份
└── code-backup-YYYYMMDD-HHMMSS.tar.gz # 代码备份
```

---

## 🚀 快速开始

### 使用交互式菜单（推荐）

```bash
./menu.sh
```

菜单包含所有常用操作：
- 📦 部署管理（一键部署、更新代码、构建）
- 🔧 服务管理（启动、停止、重启、查看状态）
- 🗄️ 数据库管理（迁移、seed、域名更新）
- 🔍 SEO 工具（关键词更新、排名检查）
- ⚙️ 配置管理（编辑环境变量、生成密钥）
- 🛠️ 维护工具（清理缓存、备份）

### 使用命令行

```bash
# 一键部署
./scripts/deploy.sh

# 更新生产域名
npx tsx scripts/update-production-domains.ts

# 更新 SEO 数据
npx tsx scripts/update-keyword-data.ts
```

---

## 🗑️ 已删除的临时文件

以下临时脚本已被删除或移动到 `scripts/legacy/`：

### 删除的启动脚本（已由 PM2 + ecosystem.config.js 替代）
- ❌ `start-admin.sh`
- ❌ `start-website-1.sh`
- ❌ `start-website-2.sh`
- ❌ `start-website-tg.sh`

### 移动到 scripts/legacy/ 的修复脚本
- 📦 `check-env-status.sh` - 环境检查（可用 menu.sh 选项 18）
- 📦 `debug-build.sh` - 调试构建
- 📦 `diagnose-website-2.sh` - 诊断脚本
- 📦 `diagnose-502.sh` - 502 错误诊断
- 📦 `fix-nextauth-secret.sh` - 修复密钥
- 📦 `fix-server-build.sh` - 修复构建
- 📦 `fix-502.sh` - 修复 502 错误
- 📦 `quick-fix-baota.sh` - Baota 快速修复
- 📦 `quick-setup-env.sh` - 快速环境设置
- 📦 `restart-services.sh` - 重启服务（可用 menu.sh 选项 7）
- 📦 `setup-database-env.sh` - 数据库环境设置

### 替代的旧脚本
- ❌ `deploy.sh`（根目录） → 使用 `scripts/deploy.sh`

---

## 📊 整理统计

- ✅ 删除临时文件：5 个（start-*.sh, reset-admin-password.js）
- ✅ 移动到 scripts/legacy：12 个（修复和诊断脚本）
- ✅ 移动到 scripts：3 个（管理工具脚本）
- ✅ 文档分类整理：23 个文档 → 4 个分类文件夹
  - deployment/ - 9 个部署相关文档
  - seo/ - 9 个 SEO 相关文档
  - system/ - 3 个系统管理文档
  - usage/ - 2 个使用说明文档
- ✅ 新增文件：3 个（menu.sh, FILE-ORGANIZATION.md, docs/README.md）
- ✅ 保留根目录：4 个核心文件（README.md, DEPLOYMENT.md, menu.sh, ecosystem.config.js）

---

## 🎨 新增功能

### 交互式菜单 (`menu.sh`)

提供 22 个常用操作的可视化菜单：

```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║      🚀 SEO 网站管理系统 - 自动化部署菜单                   ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

主菜单
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 部署管理
  1. 🚀 一键部署（拉取代码 + 构建 + 重启）
  2. 🔄 更新代码（仅 git pull）
  3. 📦 安装依赖（pnpm install）
  4. 🏗️  构建项目（pnpm build）

🔧 服务管理
  5. ▶️  启动所有服务
  6. ⏹️  停止所有服务
  7. 🔄 重启所有服务
  8. 📊 查看服务状态
  9. 📝 查看服务日志

🗄️  数据库管理
  10. 🔧 更新数据库（Prisma migrate）
  11. 🌱 填充初始数据（seed）
  12. 🌐 更新生产域名
  13. 🎨 打开 Prisma Studio

🔍 SEO 工具
  14. 📈 更新 SEO 关键词数据（Tavily API）
  15. 🎯 检查关键词排名
  16. 📊 查看 SEO API 状态

⚙️  配置管理
  17. 📝 编辑环境变量（.env.production）
  18. 🔍 检查环境变量状态
  19. 🔑 生成新密钥

🛠️  维护工具
  20. 🧹 清理缓存
  21. 💾 备份数据库
  22. 📦 备份代码

  0. ❌ 退出
```

---

## 📚 推荐使用方式

### 日常开发
```bash
./menu.sh  # 选择对应操作
```

### 首次部署
```bash
# 1. 查看快速指南
cat DEPLOYMENT.md

# 2. 配置环境变量
cp .env.production.example .env.production
nano .env.production

# 3. 运行菜单或一键部署
./menu.sh  # 选择 1
# 或
./scripts/deploy.sh
```

### 更新部署
```bash
# 方法 1：使用菜单
./menu.sh  # 选择 1 (一键部署)

# 方法 2：直接运行
./scripts/deploy.sh
```

### SEO 数据管理
```bash
# 使用菜单
./menu.sh  # 选择 14-16

# 或命令行
npx tsx scripts/update-keyword-data.ts
```

---

## 🔧 维护建议

### 定期清理（每月）
```bash
./menu.sh  # 选择 20 (清理缓存)
```

### 定期备份（每周）
```bash
./menu.sh  # 选择 21 (备份数据库) + 22 (备份代码)
```

### 监控服务
```bash
./menu.sh  # 选择 8 (查看状态)
pm2 monit  # 实时监控
```

---

## 📖 相关文档

| 文档 | 位置 | 用途 |
|------|------|------|
| 文档导航 | `docs/README.md` | 📖 所有文档的导航中心 |
| 快速部署 | `DEPLOYMENT.md` | 5分钟部署指南 |
| 完整部署 | `docs/deployment/DEPLOYMENT-GUIDE.md` | 详细部署步骤 |
| 域名配置 | `docs/deployment/PRODUCTION-DOMAINS-SETUP.md` | 15个域名配置 |
| SEO 集成 | `docs/seo/ACCESSIBLE-SEO-APIS.md` | API 对比选择 |
| Tavily 使用 | `docs/seo/TAVILY-QUICK-START.md` | Tavily API 指南 |
| 使用手册 | `docs/usage/使用说明书.md` | 完整使用说明（中文） |

---

## 🎯 下一步

1. ✅ 使用 `./menu.sh` 体验交互式管理
2. ✅ 定期运行 SEO 数据更新（每周）
3. ✅ 设置自动备份（每周）
4. ✅ 监控服务状态
5. ✅ 查看文档学习更多功能

---

## 💡 提示

- 所有临时脚本都在 `scripts/legacy/`，如有需要可以恢复
- 使用 `./menu.sh` 可以避免记忆复杂命令
- 备份文件自动保存到 `backups/` 文件夹
- 建议将 `backups/` 文件夹定期迁移到远程存储

---

**整理完成！现在您的项目结构更清晰、更易于维护！** 🎉
