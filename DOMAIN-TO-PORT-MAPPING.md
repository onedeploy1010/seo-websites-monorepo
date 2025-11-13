# 域名到端口映射配置

## 📊 完整映射表

| 域名 | Next.js 应用 | PM2 端口 | Nginx 反向代理 |
|------|-------------|----------|----------------|
| telegram1688.com | website-tg | 3003 | proxy_pass http://127.0.0.1:3003 |
| telegram2688.com | website-tg | 3003 | proxy_pass http://127.0.0.1:3003 |
| telegramcnfw.com | website-tg | 3003 | proxy_pass http://127.0.0.1:3003 |
| telegramcny28.com | website-1 | 3001 | proxy_pass http://127.0.0.1:3001 |
| telegramfuwu.com | website-1 | 3001 | proxy_pass http://127.0.0.1:3001 |
| telegramfwfw.com | website-1 | 3001 | proxy_pass http://127.0.0.1:3001 |
| telegramgzzh.com | website-1 | 3001 | proxy_pass http://127.0.0.1:3001 |
| telegramhnzh.com | website-1 | 3001 | proxy_pass http://127.0.0.1:3001 |
| telegramjiaoyu.com | website-2 | 3002 | proxy_pass http://127.0.0.1:3002 |
| telegramrmb28.com | website-2 | 3002 | proxy_pass http://127.0.0.1:3002 |
| telegramxzb.com | website-2 | 3002 | proxy_pass http://127.0.0.1:3002 |
| telegramxzfw.com | website-2 | 3002 | proxy_pass http://127.0.0.1:3002 |
| telegramzhfw.com | website-2 | 3002 | proxy_pass http://127.0.0.1:3002 |
| xztelegram.com | website-2 | 3002 | proxy_pass http://127.0.0.1:3002 |
| zhxztelegram.com | website-2 | 3002 | proxy_pass http://127.0.0.1:3002 |

## 🚀 PM2 启动命令

### Website-TG (端口 3003)
```bash
cd /www/wwwroot/telegram1688.com
pm2 start npm --name "website-tg" -- start -- -p 3003
```

**服务的域名：**
- telegram1688.com
- telegram2688.com
- telegramcnfw.com

### Website-1 (端口 3001)
```bash
cd /www/wwwroot/telegramcny28.com
pm2 start npm --name "website-1" -- start -- -p 3001
```

**服务的域名：**
- telegramcny28.com
- telegramfuwu.com
- telegramfwfw.com
- telegramgzzh.com
- telegramhnzh.com

### Website-2 (端口 3002)
```bash
cd /www/wwwroot/telegramjiaoyu.com
pm2 start npm --name "website-2" -- start -- -p 3002
```

**服务的域名：**
- telegramjiaoyu.com
- telegramrmb28.com
- telegramxzb.com
- telegramxzfw.com
- telegramzhfw.com
- xztelegram.com
- zhxztelegram.com

## 🔧 Nginx 配置脚本

为了方便配置，这里提供批量配置脚本：

### 配置 Website-TG 域名组 (端口 3003)
```bash
# telegram1688.com
# telegram2688.com
# telegramcnfw.com

# 每个域名的 Nginx 配置都是一样的：
location / {
    proxy_pass http://127.0.0.1:3003;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

location /_next/static {
    proxy_pass http://127.0.0.1:3003/_next/static;
    add_header Cache-Control "public, max-age=31536000, immutable";
}

location /_next/image {
    proxy_pass http://127.0.0.1:3003/_next/image;
    proxy_set_header Host $host;
}
```

### 配置 Website-1 域名组 (端口 3001)
```bash
# telegramcny28.com
# telegramfuwu.com
# telegramfwfw.com
# telegramgzzh.com
# telegramhnzh.com

# 将上面配置中的 3003 改为 3001
location / {
    proxy_pass http://127.0.0.1:3001;
    # ... 其余配置相同
}
```

### 配置 Website-2 域名组 (端口 3002)
```bash
# telegramjiaoyu.com
# telegramrmb28.com
# telegramxzb.com
# telegramxzfw.com
# telegramzhfw.com
# xztelegram.com
# zhxztelegram.com

# 将上面配置中的 3003 改为 3002
location / {
    proxy_pass http://127.0.0.1:3002;
    # ... 其余配置相同
}
```

## 📝 快速配置步骤

### 1. 宝塔批量创建站点
复制 `baota-15-domains-final.txt` 的内容到宝塔批量添加。

### 2. 启动3个 PM2 进程
```bash
pm2 start npm --name "website-tg" -- start -- -p 3003
pm2 start npm --name "website-1" -- start -- -p 3001
pm2 start npm --name "website-2" -- start -- -p 3002
pm2 save
pm2 startup
```

### 3. 配置 Nginx（逐个域名）
在宝塔面板中：
1. 网站 → 选择域名 → 设置 → 配置文件
2. 找到 `location /` 块
3. 根据上面的映射表配置对应端口
4. 保存

### 4. 申请 SSL 证书
对每个域名：
1. 网站 → 选择域名 → 设置 → SSL
2. Let's Encrypt → 申请
3. 开启强制 HTTPS

### 5. 配置 DNS
在域名提供商添加 A 记录：
```
telegram1688.com    → 你的服务器IP
telegram2688.com    → 你的服务器IP
...（所有15个域名）
```

## ✅ 验证

### 检查 PM2 进程
```bash
pm2 list
```

应该看到：
```
┌─────┬──────────────┬─────────┬─────────┬──────────┐
│ id  │ name         │ status  │ port    │ memory   │
├─────┼──────────────┼─────────┼─────────┼──────────┤
│ 0   │ website-tg   │ online  │ 3003    │ 150MB    │
│ 1   │ website-1    │ online  │ 3001    │ 180MB    │
│ 2   │ website-2    │ online  │ 3002    │ 160MB    │
└─────┴──────────────┴─────────┴─────────┴──────────┘
```

### 测试端口
```bash
curl http://127.0.0.1:3001
curl http://127.0.0.1:3002
curl http://127.0.0.1:3003
```

### 测试域名
```bash
curl -I https://telegram1688.com
curl -I https://telegramcny28.com
curl -I https://telegramjiaoyu.com
```

## 🔍 故障排查

### 问题：某个域名无法访问

**检查清单：**
1. ✅ PM2 进程是否运行？`pm2 list`
2. ✅ 端口是否监听？`netstat -tlnp | grep node`
3. ✅ Nginx 配置正确？检查端口号
4. ✅ DNS 是否解析？`nslookup 域名`
5. ✅ SSL 是否正常？查看宝塔 SSL 状态

### 问题：PM2 进程频繁重启

**检查日志：**
```bash
pm2 logs website-1 --lines 100
```

常见原因：
- 端口被占用
- 环境变量缺失
- 数据库连接失败

## 📊 域名分布统计

- **Website-TG**: 3个域名
- **Website-1**: 5个域名
- **Website-2**: 7个域名
- **总计**: 15个域名

## 🎯 性能考虑

**资源估算：**
- 每个 Next.js 进程：约 150-200MB 内存
- 3个进程总计：约 500-600MB
- 推荐服务器配置：2核 4GB 内存

**优化建议：**
1. 使用 PM2 cluster 模式（如果流量大）
2. 配置 Nginx gzip 压缩
3. 启用 Next.js ISR（增量静态生成）
4. 使用 CDN 加速静态资源

---

## 相关文档

- [BAOTA-CORRECT-WORKFLOW.md](./BAOTA-CORRECT-WORKFLOW.md) - 完整部署流程
- [BAOTA-DEPLOYMENT-GUIDE.md](./BAOTA-DEPLOYMENT-GUIDE.md) - 宝塔部署指南
- [baota-15-domains-final.txt](./baota-15-domains-final.txt) - 批量创建格式
