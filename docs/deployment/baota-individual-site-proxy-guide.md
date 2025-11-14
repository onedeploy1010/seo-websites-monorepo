# 宝塔面板 - 单独站点反向代理配置指南

## 域名与端口对应表

| 域名 | 应用 | 端口 |
|------|------|------|
| admin.telegram1688.com | Admin后台 | 3100 |
| telegram1688.com | Website-1 | 3001 |
| telegram2688.com | Website-1 | 3001 |
| telegramcny28.com | Website-1 | 3001 |
| telegramrmb28.com | Website-1 | 3001 |
| telegramxzb.com | Website-1 | 3001 |
| telegramcnfw.com | Website-2 | 3002 |
| telegramfuwu.com | Website-2 | 3002 |
| telegramfwfw.com | Website-2 | 3002 |
| telegramxzfw.com | Website-2 | 3002 |
| telegramzhfw.com | Website-2 | 3002 |
| telegramgzzh.com | Website-TG | 3003 |
| telegramhnzh.com | Website-TG | 3003 |
| telegramjiaoyu.com | Website-TG | 3003 |
| xztelegram.com | Website-TG | 3003 |
| zhxztelegram.com | Website-TG | 3003 |

## 宝塔面板配置步骤

### 方法1：通过宝塔面板GUI配置（推荐）

#### 1. 进入站点设置
1. 登录宝塔面板
2. 点击左侧菜单 **网站**
3. 找到对应域名的站点，点击 **设置**

#### 2. 配置反向代理
1. 在站点设置页面，点击左侧 **反向代理**
2. 点击 **添加反向代理**
3. 填写配置信息：

**基本配置：**
- **代理名称**: 填写描述性名称（如：next-app-3100）
- **目标URL**: 根据上面的表格填写对应端口
  - Admin: `http://127.0.0.1:3100`
  - Website-1: `http://127.0.0.1:3001`
  - Website-2: `http://127.0.0.1:3002`
  - Website-TG: `http://127.0.0.1:3003`
- **发送域名**: `$host`
- **内容替换**: 留空（不需要）

#### 3. 高级配置
在 **配置内容** 文本框中，确保包含以下内容：

```nginx
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_set_header X-Forwarded-Host $host;
proxy_set_header X-Forwarded-Port $server_port;

# Next.js 特定配置
proxy_cache_bypass $http_upgrade;
proxy_buffering off;
proxy_read_timeout 300s;
proxy_connect_timeout 75s;
```

#### 4. 启用代理
1. 点击 **提交** 保存配置
2. 确保 **启用反向代理** 开关是打开状态

#### 5. 配置SSL证书（如果还没配置）
1. 在站点设置中，点击 **SSL**
2. 选择 **Let's Encrypt** 免费证书
3. 勾选要申请证书的域名
4. 点击 **申请**
5. 等待证书自动申请和配置完成

---

### 方法2：直接编辑配置文件（高级用户）

如果您熟悉Nginx配置，可以直接编辑配置文件：

#### 1. 找到站点配置文件
站点配置文件通常位于：
```
/www/server/panel/vhost/nginx/[域名].conf
```

#### 2. 编辑配置文件
在宝塔面板中：
1. 网站 → 设置 → 配置文件
2. 在 `server` 块的 `location /` 中添加以下内容：

```nginx
location / {
    proxy_pass http://127.0.0.1:3100;  # 根据域名修改端口号
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-Port $server_port;

    proxy_cache_bypass $http_upgrade;
    proxy_buffering off;
    proxy_read_timeout 300s;
    proxy_connect_timeout 75s;
}
```

#### 3. 保存并重载Nginx
```bash
nginx -t  # 检查配置语法
nginx -s reload  # 重载配置
```

---

## 批量配置脚本（可选）

如果您想通过SSH批量配置所有站点，可以使用以下脚本：

### 创建批量配置脚本
```bash
cd /home/ubuntu/WebstormProjects/seo-websites-monorepo
```

运行以下命令创建配置脚本：
```bash
cat > baota-batch-proxy-config.sh << 'EOF'
#!/bin/bash

# 域名到端口的映射
declare -A DOMAIN_PORT_MAP=(
    ["admin.telegram1688.com"]="3100"
    ["telegram1688.com"]="3001"
    ["telegram2688.com"]="3001"
    ["telegramcny28.com"]="3001"
    ["telegramrmb28.com"]="3001"
    ["telegramxzb.com"]="3001"
    ["telegramcnfw.com"]="3002"
    ["telegramfuwu.com"]="3002"
    ["telegramfwfw.com"]="3002"
    ["telegramxzfw.com"]="3002"
    ["telegramzhfw.com"]="3002"
    ["telegramgzzh.com"]="3003"
    ["telegramhnzh.com"]="3003"
    ["telegramjiaoyu.com"]="3003"
    ["xztelegram.com"]="3003"
    ["zhxztelegram.com"]="3003"
)

NGINX_VHOST_DIR="/www/server/panel/vhost/nginx"

echo "=========================================="
echo "  批量配置反向代理"
echo "=========================================="
echo ""

for domain in "${!DOMAIN_PORT_MAP[@]}"; do
    port="${DOMAIN_PORT_MAP[$domain]}"
    config_file="${NGINX_VHOST_DIR}/${domain}.conf"

    echo "配置 ${domain} -> 端口 ${port}"

    if [ ! -f "$config_file" ]; then
        echo "  ⚠️  配置文件不存在: $config_file"
        echo "  请先在宝塔面板中创建该站点"
        continue
    fi

    # 备份原配置
    cp "$config_file" "${config_file}.backup.$(date +%Y%m%d_%H%M%S)"

    # 检查是否已配置反向代理
    if grep -q "proxy_pass" "$config_file"; then
        echo "  ℹ️  该站点已配置反向代理，跳过"
        continue
    fi

    # 在 location / 块中添加反向代理配置
    # 这里需要小心处理，建议手动配置或使用更复杂的sed命令
    echo "  ⚠️  请手动配置此站点，或使用宝塔面板GUI"
done

echo ""
echo "=========================================="
echo "  配置完成"
echo "=========================================="
echo ""
echo "建议："
echo "1. 使用宝塔面板GUI逐个配置反向代理更安全"
echo "2. 每个站点配置完成后测试访问"
echo "3. 确保SSL证书已正确配置"
EOF

chmod +x baota-batch-proxy-config.sh
```

---

## 配置完成后的验证

### 1. 检查PM2应用状态
```bash
pm2 status
```
确保所有应用都在运行（online状态）

### 2. 检查端口监听
```bash
ss -tlnp | grep -E ':(3100|3001|3002|3003)'
```
应该看到4个端口都在监听

### 3. 本地测试反向代理
```bash
# 测试admin
curl -I http://127.0.0.1:3100

# 测试website-1
curl -I http://127.0.0.1:3001

# 测试website-2
curl -I http://127.0.0.1:3002

# 测试website-tg
curl -I http://127.0.0.1:3003
```

### 4. 测试域名访问
在浏览器中访问每个域名，确保：
- 页面能正常加载
- HTTPS证书有效
- 内容显示正确

---

## 常见问题排查

### 问题1: 502 Bad Gateway
**原因**: PM2应用没有运行或端口配置错误
**解决**:
```bash
pm2 status
pm2 restart all
```

### 问题2: 404 Not Found
**原因**: Nginx配置错误或路径配置问题
**解决**: 检查反向代理配置中的 `proxy_pass` URL是否正确

### 问题3: 证书错误
**原因**: SSL证书未配置或过期
**解决**: 在宝塔面板中重新申请Let's Encrypt证书

### 问题4: 页面样式丢失
**原因**: 静态资源路径问题
**解决**: 确保Next.js配置中的 `assetPrefix` 正确

---

## 推荐配置顺序

1. **先配置Admin站点** (admin.telegram1688.com)
   - 测试登录功能
   - 确保数据库连接正常

2. **配置其中一个Website-1域名** (如 telegram1688.com)
   - 测试页面加载
   - 验证内容正确

3. **配置剩余的Website-1域名**
   - telegram2688.com, telegramcny28.com, telegramrmb28.com, telegramxzb.com
   - 使用相同配置
   - 逐个测试

4. **配置Website-2的5个域名**
   - telegramcnfw.com, telegramfuwu.com, telegramfwfw.com, telegramxzfw.com, telegramzhfw.com
   - 代理到端口 3002

5. **配置Website-TG的5个域名**
   - telegramgzzh.com, telegramhnzh.com, telegramjiaoyu.com, xztelegram.com, zhxztelegram.com
   - 代理到端口 3003

---

## 注意事项

1. **SSL证书**: 确保每个域名都配置了HTTPS证书
2. **防火墙**: 确保80和443端口开放
3. **PM2自启动**: 确保PM2配置了开机自启动
   ```bash
   pm2 startup
   pm2 save
   ```
4. **日志监控**: 定期检查PM2和Nginx日志
   ```bash
   pm2 logs
   tail -f /www/wwwlogs/[域名].log
   ```

---

## 快速命令参考

```bash
# 查看PM2状态
pm2 status

# 重启所有应用
pm2 restart all

# 查看应用日志
pm2 logs seo-admin
pm2 logs seo-website-1

# 检查Nginx配置
nginx -t

# 重载Nginx
nginx -s reload

# 查看端口监听
ss -tlnp | grep -E ':(3100|3001|3002|3003)'
```
