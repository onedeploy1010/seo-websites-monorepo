# 部署指南

本指南将帮助您将网站部署到生产环境。

## 部署选项

### 选项 1: Vercel（推荐）

Vercel 是 Next.js 的创建者，提供最佳的部署体验。

#### 步骤：

1. **安装 Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **登录 Vercel**
   ```bash
   vercel login
   ```

3. **部署**
   ```bash
   vercel
   ```

4. **生产部署**
   ```bash
   vercel --prod
   ```

#### 通过 GitHub 自动部署

1. 访问 [vercel.com](https://vercel.com)
2. 使用 GitHub 登录
3. 导入您的仓库
4. Vercel 会自动检测 Next.js 项目并配置
5. 每次推送到 main 分支时自动部署

#### 环境变量配置

在 Vercel 项目设置中添加环境变量：
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `NEXT_PUBLIC_GOOGLE_VERIFICATION`

### 选项 2: Netlify

1. **安装 Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **构建项目**
   ```bash
   npm run build
   ```

3. **部署**
   ```bash
   netlify deploy --prod
   ```

#### netlify.toml 配置

创建 `netlify.toml`：
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### 选项 3: 自托管服务器

#### 使用 PM2

1. **安装 PM2**
   ```bash
   npm install -g pm2
   ```

2. **构建项目**
   ```bash
   npm run build
   ```

3. **启动应用**
   ```bash
   pm2 start npm --name "tg-website" -- start
   pm2 save
   pm2 startup
   ```

#### 使用 Docker

1. **创建 Dockerfile**

已包含在项目中（见下方）

2. **构建镜像**
   ```bash
   docker build -t tg-website .
   ```

3. **运行容器**
   ```bash
   docker run -p 3000:3000 tg-website
   ```

#### Nginx 反向代理配置

创建 `/etc/nginx/sites-available/tg-website`：

```nginx
server {
    listen 80;
    server_name www.telegramtgm.com telegramtgm.com;

    # 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name www.telegramtgm.com telegramtgm.com;

    # SSL 证书
    ssl_certificate /etc/letsencrypt/live/telegramtgm.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/telegramtgm.com/privkey.pem;

    # SSL 配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # 反向代理
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 静态文件缓存
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

启用站点：
```bash
sudo ln -s /etc/nginx/sites-available/tg-website /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 选项 4: 云服务商

#### AWS Amplify

1. 连接 GitHub 仓库
2. 选择 main 分支
3. 构建设置会自动检测
4. 添加环境变量
5. 部署

#### Google Cloud Run

1. 构建 Docker 镜像
2. 推送到 Google Container Registry
3. 部署到 Cloud Run

#### Azure Static Web Apps

1. 连接 GitHub 仓库
2. 选择 Next.js 预设
3. 配置环境变量
4. 部署

## SSL 证书配置

### 使用 Let's Encrypt（免费）

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d telegramtgm.com -d www.telegramtgm.com

# 自动续期
sudo certbot renew --dry-run
```

## 性能优化

### 1. 启用缓存

在 `next.config.mjs` 中：

```javascript
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
  },
  headers: async () => {
    return [
      {
        source: '/:all*(svg|jpg|png|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}
```

### 2. CDN 配置

使用 Vercel Edge Network（自动）或配置 Cloudflare CDN：

1. 添加网站到 Cloudflare
2. 更新 DNS 记录
3. 启用 CDN 和优化功能

### 3. 图片优化

Next.js 自动优化图片，但请确保：
- 使用 WebP/AVIF 格式
- 提供适当的尺寸
- 使用 `priority` 属性标记首屏图片

## 环境变量

### 开发环境 (.env.local)

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 生产环境 (.env.production)

```env
NEXT_PUBLIC_SITE_URL=https://www.telegramtgm.com
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_VERIFICATION=your-verification-code
```

## 部署前检查清单

- [ ] 运行 `npm run build` 确保无错误
- [ ] 运行 `npm run lint` 修复代码问题
- [ ] 测试所有页面和功能
- [ ] 更新环境变量
- [ ] 配置域名 DNS
- [ ] 设置 SSL 证书
- [ ] 配置 Google Analytics
- [ ] 提交 sitemap 到 Google Search Console
- [ ] 测试移动端响应式
- [ ] 运行 Lighthouse 性能测试
- [ ] 配置错误监控（如 Sentry）
- [ ] 设置备份策略

## 监控和维护

### 错误监控

使用 Sentry：

```bash
npm install @sentry/nextjs
```

配置 `sentry.client.config.ts` 和 `sentry.server.config.ts`

### 性能监控

1. **Vercel Analytics**（Vercel 部署自带）
2. **Google Analytics**
3. **New Relic**
4. **DataDog**

### 日志管理

使用 PM2 查看日志：
```bash
pm2 logs tg-website
```

或配置集中式日志管理（如 ELK Stack）

## 回滚策略

### Vercel
```bash
vercel rollback
```

### PM2
```bash
pm2 reload tg-website
```

### Docker
```bash
docker stop tg-website
docker run -p 3000:3000 tg-website:previous-version
```

## 故障排除

### 构建失败

1. 检查 Node.js 版本（推荐 18.x 或更高）
2. 清除缓存：`rm -rf .next node_modules && npm install`
3. 检查环境变量是否正确设置

### 性能问题

1. 使用 Chrome DevTools 分析
2. 检查图片大小和格式
3. 启用压缩和缓存
4. 使用 CDN

### SSL 证书问题

1. 验证证书有效期
2. 检查 DNS 配置
3. 重新生成证书：`sudo certbot renew --force-renewal`

## 安全建议

1. **定期更新依赖**
   ```bash
   npm audit
   npm update
   ```

2. **使用 HTTPS**
3. **配置安全头**（在 `next.config.mjs`）
4. **实施 CSP（内容安全策略）**
5. **配置防火墙规则**
6. **限制 API 访问速率**
7. **定期备份数据**

## 扩展性

### 水平扩展

使用负载均衡器（如 Nginx、HAProxy）分发流量到多个实例

### 数据库

如需数据库：
- PostgreSQL（推荐）
- MongoDB
- Redis（缓存）

### 文件存储

- AWS S3
- Cloudflare R2
- DigitalOcean Spaces

## 成本估算

### Vercel（Hobby - 免费）
- 100GB 带宽/月
- 无限部署
- 自动 HTTPS
- **成本：$0/月**

### Vercel（Pro - $20/月）
- 1TB 带宽/月
- 无限部署
- 高级分析
- **成本：$20/月**

### 自托管（VPS）
- DigitalOcean Droplet（2GB RAM）：$12/月
- Cloudflare CDN：免费
- **成本：约 $12/月**

## 获取帮助

- [Next.js 文档](https://nextjs.org/docs)
- [Vercel 支持](https://vercel.com/support)
- [Next.js Discord](https://discord.gg/nextjs)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/next.js)
