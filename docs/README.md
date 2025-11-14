# 📚 文档中心

所有项目文档已按类别分类整理，方便查找和使用。

## 📁 目录结构

```
docs/
├── README.md                    # 本文件 - 文档导航
├── FILE-ORGANIZATION.md         # 项目文件组织说明
│
├── 📦 deployment/               # 部署相关文档
│   ├── DEPLOYMENT-GUIDE.md              # ⭐ 完整部署指南
│   ├── PRODUCTION-DOMAINS-SETUP.md      # 15个生产域名配置
│   ├── BAOTA-COMPLETE-GUIDE.md          # 宝塔面板完整指南
│   ├── baota-individual-site-proxy-guide.md  # 单站反向代理配置
│   ├── baota-reverse-proxy-guide.md     # 反向代理通用指南
│   ├── deploy-to-server.md              # 服务器部署步骤
│   ├── 服务器部署指南.md                # 中文部署指南
│   ├── 域名配置指南.md                  # 中文域名配置
│   └── baota-15-domains-final.txt       # 域名列表
│
├── 🔍 seo/                      # SEO 相关文档
│   ├── TAVILY-QUICK-START.md            # ⭐ Tavily API 快速开始
│   ├── ACCESSIBLE-SEO-APIS.md           # SEO API 对比与选择
│   ├── SEO-DATA-INTEGRATION.md          # SEO 数据集成指南
│   ├── QUICK-START-REAL-DATA.md         # 快速获取真实数据
│   ├── KEYWORDS_MANAGEMENT.md           # 关键词管理
│   ├── MULTI_DOMAIN_SEO_STRATEGY.md     # 多域名 SEO 策略
│   ├── SEO-KEYWORD-OPTIMIZATION-GUIDE.md # 关键词优化指南
│   ├── SEO-TOOLS-USAGE.md               # SEO 工具使用
│   └── SUMMARY-REAL-DATA-INTEGRATION.md # 真实数据集成总结
│
├── ⚙️ system/                   # 系统管理文档
│   ├── SYSTEM-SETTINGS.md               # 系统设置说明
│   ├── SYSTEM-SETTINGS-SETUP.md         # 系统设置配置
│   └── WORK-SUMMARY.md                  # 工作总结
│
└── 📖 usage/                    # 使用说明
    ├── 使用说明书.md                    # ⭐ 完整使用手册（中文）
    └── website-2-html-migration-summary.md  # Website-2 迁移总结
```

---

## 🚀 快速开始

### 新手入门
1. 📖 **使用说明**: [`usage/使用说明书.md`](usage/使用说明书.md)
2. 🚀 **快速部署**: 根目录 [`DEPLOYMENT.md`](../DEPLOYMENT.md)
3. 📦 **完整部署**: [`deployment/DEPLOYMENT-GUIDE.md`](deployment/DEPLOYMENT-GUIDE.md)

### 服务器部署
1. 📋 **部署检查清单**: [`deployment/服务器部署指南.md`](deployment/服务器部署指南.md)
2. 🌐 **域名配置**: [`deployment/PRODUCTION-DOMAINS-SETUP.md`](deployment/PRODUCTION-DOMAINS-SETUP.md)
3. 🖥️ **宝塔面板**: [`deployment/BAOTA-COMPLETE-GUIDE.md`](deployment/BAOTA-COMPLETE-GUIDE.md)
4. 🔄 **反向代理**: [`deployment/baota-individual-site-proxy-guide.md`](deployment/baota-individual-site-proxy-guide.md)

### SEO 优化
1. 📈 **Tavily API**: [`seo/TAVILY-QUICK-START.md`](seo/TAVILY-QUICK-START.md) ⭐ 推荐
2. 📊 **真实数据**: [`seo/QUICK-START-REAL-DATA.md`](seo/QUICK-START-REAL-DATA.md)
3. 🔍 **API 对比**: [`seo/ACCESSIBLE-SEO-APIS.md`](seo/ACCESSIBLE-SEO-APIS.md)
4. 🎯 **关键词管理**: [`seo/KEYWORDS_MANAGEMENT.md`](seo/KEYWORDS_MANAGEMENT.md)
5. 🌐 **多域名策略**: [`seo/MULTI_DOMAIN_SEO_STRATEGY.md`](seo/MULTI_DOMAIN_SEO_STRATEGY.md)

---

## 📂 按场景查找

### 场景 1: 首次部署到服务器
```
1. deployment/DEPLOYMENT-GUIDE.md       - 了解完整部署流程
2. deployment/PRODUCTION-DOMAINS-SETUP.md - 配置 15 个域名
3. deployment/BAOTA-COMPLETE-GUIDE.md    - 设置宝塔面板
4. 根目录 DEPLOYMENT.md                  - 执行快速部署
```

### 场景 2: 配置 SEO 真实数据
```
1. seo/ACCESSIBLE-SEO-APIS.md          - 选择合适的 API
2. seo/TAVILY-QUICK-START.md           - 配置 Tavily API（推荐）
3. seo/QUICK-START-REAL-DATA.md        - 获取真实数据
4. 根目录 menu.sh 选项 14              - 运行数据更新
```

### 场景 3: 添加新域名
```
1. deployment/域名配置指南.md           - 域名配置步骤
2. scripts/update-production-domains.ts - 更新域名脚本
3. deployment/baota-individual-site-proxy-guide.md - 配置反向代理
```

### 场景 4: 日常运维
```
1. 根目录 menu.sh                      - 交互式管理菜单
2. scripts/deploy.sh                   - 一键部署脚本
3. deployment/deploy-to-server.md      - 部署步骤参考
```

---

## 🎯 按文件类型查找

### 部署文档 (deployment/)
- **英文完整指南**: DEPLOYMENT-GUIDE.md
- **中文指南**: 服务器部署指南.md, 域名配置指南.md
- **宝塔面板**: BAOTA-COMPLETE-GUIDE.md, baota-*.md
- **域名配置**: PRODUCTION-DOMAINS-SETUP.md

### SEO 文档 (seo/)
- **快速开始**: TAVILY-QUICK-START.md, QUICK-START-REAL-DATA.md
- **API 选择**: ACCESSIBLE-SEO-APIS.md
- **数据集成**: SEO-DATA-INTEGRATION.md, SUMMARY-REAL-DATA-INTEGRATION.md
- **优化策略**: KEYWORDS_MANAGEMENT.md, MULTI_DOMAIN_SEO_STRATEGY.md

### 系统文档 (system/)
- **系统设置**: SYSTEM-SETTINGS.md, SYSTEM-SETTINGS-SETUP.md
- **工作总结**: WORK-SUMMARY.md

### 使用说明 (usage/)
- **完整手册**: 使用说明书.md
- **迁移记录**: website-2-html-migration-summary.md

---

## 🔧 脚本和工具

详见根目录的 `menu.sh` 和 `scripts/` 文件夹：

### 常用脚本
- `menu.sh` - 交互式管理菜单（推荐）
- `scripts/deploy.sh` - 一键部署
- `scripts/update-production-domains.ts` - 更新生产域名
- `scripts/update-keyword-data.ts` - 更新 SEO 数据

### 管理工具
- `scripts/nginx-config-generator.sh` - Nginx 配置生成
- `scripts/pm2-manage.sh` - PM2 服务管理
- `scripts/init-database.sh` - 数据库初始化
- `scripts/quick-setup.sh` - 快速设置

---

## 📝 文档维护

### 文档分类规则
- **deployment/** - 所有部署、配置、服务器相关
- **seo/** - SEO 优化、关键词、API 相关
- **system/** - 系统设置、内部管理相关
- **usage/** - 用户使用说明、教程相关

### 添加新文档
1. 根据内容放入对应类别文件夹
2. 在本 README.md 中添加链接
3. 如果是重要文档，在"快速开始"中添加

---

## 🆘 需要帮助？

1. **快速问题**: 查看 `usage/使用说明书.md`
2. **部署问题**: 查看 `deployment/` 文件夹
3. **SEO 问题**: 查看 `seo/` 文件夹
4. **运行脚本**: 使用根目录的 `menu.sh`

---

**文档最后更新**: 2025-11-14
