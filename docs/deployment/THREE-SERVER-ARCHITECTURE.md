# 🏗️ 三服务器分离架构设计

## 📋 架构概览

```
┌─────────────────────────────────────────────────────────────────┐
│                         用户/搜索引擎                            │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │   服务器 2: 跳转页服务器      │
         │   (中间层/流量分发)            │
         ├───────────────────────────────┤
         │ • Link跳转路由                 │
         │ • 隐藏真实结构                 │
         │ • 访问过滤                     │
         │ • 干净的SEO引导                │
         │ • IP白名单/黑名单              │
         └──────┬────────────────┬───────┘
                │                │
      ┌─────────▼─────┐         │
      │  公开域名访问  │         │
      └─────────┬─────┘         │
                │                │
                ▼                ▼
   ┌────────────────────┐  ┌──────────────────────┐
   │ 服务器 1:          │  │ 服务器 3:            │
   │ 网页模板服务器      │  │ 管理服务器           │
   ├────────────────────┤  ├──────────────────────┤
   │ • Website-1        │  │ • Admin后台          │
   │ • Website-2        │  │ • 蜘蛛池系统         │
   │ • Website-TG       │  │ • PostgreSQL数据库   │
   │ • 15个公开域名     │  │ • 仅内网/VPN访问     │
   └────────────────────┘  └──────────────────────┘
```

---

## 🖥️ 服务器 1: 网页模板服务器

### 用途
专门部署3个网页模板，支持多域名访问，面向公众和搜索引擎。

### 配置要求
- **CPU**: 2核心
- **内存**: 4GB
- **硬盘**: 50GB SSD
- **带宽**: 5Mbps+
- **IP**: 公网独立IP

### 部署应用
```
apps/website-1   → 端口 3001
apps/website-2   → 端口 3002
apps/website-tg  → 端口 3003
```

### 域名分配 (15个域名)
```
Website-1 (5个域名):
- telegram1688.com
- telegram-cn.com
- telegram-download.net
- telegramapp.net
- telegram-app.org

Website-2 (5个域名):
- telegramjiaoyu.com
- telegram-download.org
- telegramcn.net
- telegram-cn.org
- telegram-app.net

Website-TG (5个域名):
- telegramzhfw.com
- telegram-ios.com
- telegram-android.com
- telegram-web.com
- telegram-pc.com
```

### 环境变量 (.env.production)
```bash
# Node环境
NODE_ENV=production

# API端点 (指向服务器3的内网地址)
NEXT_PUBLIC_API_URL=http://内网IP:3100/api

# 数据库 (只读副本或通过API访问)
DATABASE_URL="postgresql://readonly_user:password@内网IP:5432/seo_websites"

# 网站URL (本服务器)
NEXT_PUBLIC_WEBSITE1_URL=https://telegram1688.com
NEXT_PUBLIC_WEBSITE2_URL=https://telegramjiaoyu.com
NEXT_PUBLIC_WEBSITE_TG_URL=https://telegramzhfw.com

# 禁用敏感功能
DISABLE_ADMIN_ACCESS=true
```

### Nginx配置特点
- 仅处理静态资源和反向代理
- 启用缓存
- 启用Gzip压缩
- 添加安全头

---

## 🔀 服务器 2: 跳转页服务器 (中间层)

### 用途
负责流量分发、访问过滤、SEO引导、隐藏真实服务器结构。

### 配置要求
- **CPU**: 1核心
- **内存**: 2GB
- **硬盘**: 20GB SSD
- **带宽**: 3Mbps+
- **IP**: 公网独立IP (不同于服务器1)

### 核心功能

#### 1. Link跳转路由
```
用户访问: https://jump.example.com/go/telegram
↓
302重定向到: https://telegram1688.com
```

#### 2. 隐藏真实结构
```
对外展示: https://t.me/s/channel
实际指向: https://内部真实地址（通过代理）
```

#### 3. 访问过滤
- IP白名单/黑名单
- User-Agent过滤（识别搜索引擎）
- 地区过滤（GeoIP）
- 频率限制（防爬虫）

#### 4. SEO引导
- 为搜索引擎展示优化的页面
- 为普通用户展示跳转页
- 记录访问统计

### 技术方案选择

#### 方案A: Nginx + Lua (推荐，性能最高)
```nginx
# 跳转路由
location /go/ {
    # 根据路径参数跳转
    rewrite ^/go/telegram1$ https://telegram1688.com permanent;
    rewrite ^/go/telegram2$ https://telegramjiaoyu.com permanent;
    rewrite ^/go/telegramtg$ https://telegramzhfw.com permanent;
}

# SEO引导 - 搜索引擎看到优化内容
location / {
    if ($http_user_agent ~* "Googlebot|bingbot|Baiduspider") {
        proxy_pass http://服务器1:3001;
    }
    # 普通用户看到跳转页
    return 302 https://telegram1688.com;
}

# 访问过滤
location /protected/ {
    # IP白名单
    allow 1.2.3.4;  # 管理员IP
    deny all;

    proxy_pass http://服务器3:3100;
}
```

#### 方案B: 简单Node.js应用
创建一个轻量级Express应用：
```javascript
const express = require('express');
const app = express();

// 跳转路由
const redirectMap = {
  '/go/telegram1': 'https://telegram1688.com',
  '/go/telegram2': 'https://telegramjiaoyu.com',
  '/go/telegramtg': 'https://telegramzhfw.com'
};

app.get('/go/:target', (req, res) => {
  const url = redirectMap[req.path];
  if (url) {
    res.redirect(302, url);
  } else {
    res.status(404).send('Not found');
  }
});

// SEO引导
app.get('*', (req, res) => {
  const isBot = /Googlebot|bingbot|Baiduspider/i.test(req.get('User-Agent'));

  if (isBot) {
    // 为搜索引擎返回优化内容
    res.send('<html>...</html>');
  } else {
    // 普通用户跳转
    res.redirect(302, 'https://telegram1688.com');
  }
});

app.listen(3000);
```

### 部署文件结构
```
/www/wwwroot/redirect-server/
├── nginx.conf           # Nginx配置
├── redirect-routes.conf # 跳转规则
├── ip-whitelist.conf    # IP白名单
└── logs/                # 访问日志
```

---

## 🔐 服务器 3: 管理服务器 (内部)

### 用途
后台管理系统、蜘蛛池、数据库，仅内网或VPN访问。

### 配置要求
- **CPU**: 4核心
- **内存**: 8GB+
- **硬盘**: 100GB SSD
- **带宽**: 3Mbps
- **IP**: 可以是公网IP（但防火墙严格限制）

### 部署应用
```
apps/admin       → 端口 3100 (后台管理)
spider-pool/     → 端口 3200 (蜘蛛池)
PostgreSQL       → 端口 5432 (数据库)
```

### 安全配置

#### 1. 防火墙规则
```bash
# 只允许服务器1和服务器2的IP访问
ufw allow from 服务器1_IP to any port 3100
ufw allow from 服务器2_IP to any port 3100
ufw allow from 管理员IP to any port 3100

# 数据库只允许本地和服务器1访问
ufw allow from 127.0.0.1 to any port 5432
ufw allow from 服务器1_IP to any port 5432

# 拒绝其他所有访问
ufw default deny incoming
ufw enable
```

#### 2. Nginx反向代理（添加认证）
```nginx
server {
    listen 80;
    server_name admin-internal.example.com;

    # 基础认证
    auth_basic "Admin Access";
    auth_basic_user_file /etc/nginx/.htpasswd;

    # IP白名单
    allow 管理员IP;
    allow 办公室IP段;
    deny all;

    location / {
        proxy_pass http://localhost:3100;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### 3. VPN访问（推荐）
```bash
# 使用WireGuard VPN
# 管理员通过VPN连接后才能访问
# 对外完全不开放端口
```

### 环境变量 (.env.production)
```bash
# Node环境
NODE_ENV=production
PORT=3100

# 数据库 (主库，可读写)
DATABASE_URL="postgresql://admin_user:strong_password@localhost:5432/seo_websites"

# NextAuth配置
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://内网IP:3100"

# 加密密钥
SETTINGS_ENCRYPTION_KEY="your-encryption-key"

# Tavily API (SEO数据)
TAVILY_API_KEY="your-tavily-key"

# 仅管理员访问
ADMIN_ONLY_MODE=true

# 允许的前端服务器IP
ALLOWED_FRONTEND_IPS="服务器1_IP,服务器2_IP"
```

---

## 🔗 服务器间通信

### 通信架构
```
服务器1 (网页) ←→ 服务器3 (API/数据库)
       ↓
    通过内网IP
    或VPN通道
       ↓
安全的API调用
```

### API安全措施

#### 1. 服务器1调用服务器3的API
```typescript
// apps/website-1/lib/api-client.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL; // http://内网IP:3100/api
const API_SECRET = process.env.API_SECRET_KEY;    // 服务器间共享密钥

async function fetchFromAdmin(endpoint: string) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'X-API-Secret': API_SECRET,  // 验证服务器身份
      'X-Server-ID': 'website-1'   // 标识来源
    }
  });
  return response.json();
}
```

#### 2. 服务器3验证请求来源
```typescript
// apps/admin/middleware.ts
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const apiSecret = request.headers.get('X-API-Secret');
  const clientIP = request.headers.get('X-Real-IP');

  const allowedIPs = process.env.ALLOWED_FRONTEND_IPS?.split(',') || [];

  // 验证API密钥
  if (apiSecret !== process.env.API_SECRET_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 验证IP白名单
  if (!allowedIPs.includes(clientIP)) {
    return NextResponse.json({ error: 'IP not allowed' }, { status: 403 });
  }

  return NextResponse.next();
}
```

---

## 📦 部署步骤

### 服务器 1 部署

```bash
# 1. 克隆代码
cd /www/wwwroot
git clone <repo-url> seo-websites-server1
cd seo-websites-server1

# 2. 配置环境变量
cp .env.server1.example .env.production
nano .env.production  # 编辑配置

# 3. 安装依赖
pnpm install

# 4. 构建应用
pnpm build

# 5. 使用 ecosystem.server1.config.js 启动
pm2 start ecosystem.server1.config.js
pm2 save
```

### 服务器 2 部署

```bash
# 方案A: Nginx配置
cp nginx.redirect.conf /etc/nginx/sites-available/redirect
ln -s /etc/nginx/sites-available/redirect /etc/nginx/sites-enabled/
nginx -t && nginx -s reload

# 方案B: Node.js应用
cd /www/wwwroot/redirect-server
npm install
pm2 start redirect-app.js
```

### 服务器 3 部署

```bash
# 1. 克隆代码
cd /www/wwwroot
git clone <repo-url> seo-websites-server3
cd seo-websites-server3

# 2. 配置环境变量
cp .env.server3.example .env.production
nano .env.production  # 编辑配置

# 3. 设置防火墙
ufw allow from 服务器1_IP to any port 3100
ufw allow from 服务器2_IP to any port 3100
ufw default deny incoming
ufw enable

# 4. 安装依赖和构建
pnpm install
pnpm build

# 5. 启动服务
pm2 start ecosystem.server3.config.js
pm2 save
```

---

## 🔍 蜘蛛池系统架构

### 蜘蛛池功能
1. **自动收录**: 将网站URL提交到各大搜索引擎
2. **外链建设**: 在高权重站点发布外链
3. **快速索引**: 加速搜索引擎收录
4. **监控统计**: 跟踪收录情况

### 蜘蛛池部署 (服务器3)

```
/www/wwwroot/spider-pool/
├── config/
│   ├── search-engines.json  # 搜索引擎配置
│   └── submit-urls.json     # 待提交URL列表
├── scripts/
│   ├── submit-baidu.js      # 百度提交
│   ├── submit-google.js     # Google提交
│   └── check-index.js       # 检查收录
└── logs/                    # 提交日志
```

#### 百度蜘蛛提交脚本
```javascript
// spider-pool/scripts/submit-baidu.js
const axios = require('axios');

const BAIDU_SUBMIT_API = 'http://data.zz.baidu.com/urls';
const SITE = 'telegram1688.com';
const TOKEN = 'your-baidu-token';

async function submitToBaidu(urls) {
  const response = await axios.post(
    `${BAIDU_SUBMIT_API}?site=${SITE}&token=${TOKEN}`,
    urls.join('\n'),
    {
      headers: { 'Content-Type': 'text/plain' }
    }
  );
  console.log('百度提交结果:', response.data);
}

// 从数据库获取待提交URL
const urlsToSubmit = [
  'https://telegram1688.com/',
  'https://telegram1688.com/download',
  // ... 更多URL
];

submitToBaidu(urlsToSubmit);
```

#### PM2定时任务
```javascript
// ecosystem.server3.config.js
module.exports = {
  apps: [
    {
      name: 'spider-pool-baidu',
      script: 'spider-pool/scripts/submit-baidu.js',
      cron_restart: '0 */6 * * *',  // 每6小时运行一次
      autorestart: false
    },
    {
      name: 'spider-pool-google',
      script: 'spider-pool/scripts/submit-google.js',
      cron_restart: '30 */6 * * *',  // 每6小时运行一次
      autorestart: false
    }
  ]
};
```

---

## 🛡️ 安全最佳实践

### 1. 网络隔离
- 服务器1: 公网完全开放，仅提供只读数据
- 服务器2: 公网开放，但有严格过滤
- 服务器3: 仅内网访问，或通过VPN

### 2. 数据库安全
```bash
# 服务器3的PostgreSQL配置
# /etc/postgresql/*/main/pg_hba.conf

# 只允许本地和服务器1访问
host    seo_websites    readonly_user    服务器1_IP/32    md5
host    seo_websites    admin_user       127.0.0.1/32     md5
```

### 3. 密钥管理
- 每个服务器使用不同的 NEXTAUTH_SECRET
- API_SECRET_KEY 仅服务器1和服务器3知道
- 定期轮换密钥

### 4. 日志监控
```bash
# 设置日志告警
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 50M
pm2 set pm2-logrotate:retain 7

# 监控可疑访问
tail -f /var/log/nginx/access.log | grep -E "404|500|401"
```

---

## 📊 监控和维护

### 性能监控
```bash
# 服务器1: 监控网站响应时间
pm2 monit

# 服务器2: 监控跳转成功率
tail -f /var/log/nginx/access.log | grep "302"

# 服务器3: 监控数据库和后台
pm2 logs admin
```

### 定期维护任务
```bash
# 每天备份数据库 (服务器3)
0 2 * * * /usr/bin/pg_dump seo_websites > /backup/db-$(date +\%Y\%m\%d).sql

# 每周清理日志
0 0 * * 0 find /www/wwwlogs -name "*.log" -mtime +7 -delete

# 每月检查更新
0 0 1 * * cd /www/wwwroot/seo-websites-server1 && git pull && pnpm build && pm2 restart all
```

---

## 🎯 优势总结

### 1. 安全性提升
- ✅ 管理后台与公开网站完全隔离
- ✅ 数据库不直接暴露在公网
- ✅ 多层防护，降低被攻击风险

### 2. SEO优化
- ✅ 服务器2提供干净的SEO引导
- ✅ 隐藏真实服务器结构
- ✅ 搜索引擎看到的是优化后的内容

### 3. 性能优化
- ✅ 服务器1专注前端渲染，响应快
- ✅ 服务器3独享资源，后台操作不受影响
- ✅ 可独立扩展每个服务器

### 4. 灵活性
- ✅ 可以随时更换跳转规则
- ✅ 可以添加/删除域名而不影响其他服务器
- ✅ 蜘蛛池独立运行，不干扰主业务

---

## 📝 下一步

1. **确认服务器IP地址**
   - 服务器1 IP: _______
   - 服务器2 IP: _______
   - 服务器3 IP: _______

2. **创建配置文件**
   - [ ] ecosystem.server1.config.js
   - [ ] ecosystem.server3.config.js
   - [ ] nginx.redirect.conf (服务器2)

3. **配置域名DNS**
   - [ ] 15个网站域名 → 服务器1 IP
   - [ ] 跳转域名 → 服务器2 IP
   - [ ] 管理域名 → 服务器3 IP (或不解析)

4. **测试通信**
   - [ ] 服务器1能访问服务器3 API
   - [ ] 服务器2能正确跳转到服务器1
   - [ ] 管理后台只能从指定IP访问

---

**文档创建时间**: 2025-11-14
**架构版本**: v1.0
