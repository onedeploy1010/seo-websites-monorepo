#!/usr/bin/env node

/**
 * 服务器2 - Node.js跳转应用（Nginx替代方案）
 *
 * 用途：如果不想使用Nginx，可以使用这个简单的Node.js应用
 * 功能：Link跳转、访问过滤、SEO引导
 *
 * 安装：
 * npm install express axios
 *
 * 运行：
 * pm2 start redirect-app.js --name redirect-server
 */

const express = require('express');
const axios = require('axios');
const app = express();

// ============================================
// 配置
// ============================================
const CONFIG = {
  PORT: 3000,
  SERVER1_IP: '服务器1_IP',
  SERVER3_IP: '服务器3_IP',

  // 跳转映射表
  REDIRECT_MAP: {
    '/go/telegram1': 'https://telegram1688.com',
    '/go/telegram2': 'https://telegramjiaoyu.com',
    '/go/telegramtg': 'https://telegramzhfw.com',
    '/go/download1': 'https://telegram1688.com/download',
    '/go/download2': 'https://telegramjiaoyu.com/download',
    '/go/downloadtg': 'https://telegramzhfw.com/download'
  },

  // IP白名单（管理员IP）
  ADMIN_WHITELIST: [
    '127.0.0.1',
    '1.2.3.4',  // 替换为实际管理员IP
  ],

  // 搜索引擎User-Agent正则
  BOT_REGEX: /Googlebot|Bingbot|Baiduspider|Yandex|Slurp|DuckDuckBot|Sogou|360Spider/i
};

// ============================================
// 中间件
// ============================================

// 日志中间件
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const userAgent = req.get('User-Agent') || 'Unknown';
  const ip = req.ip || req.connection.remoteAddress;

  console.log(`[${timestamp}] ${ip} - ${req.method} ${req.path} - ${userAgent}`);
  next();
});

// 限流中间件（简单实现）
const requestCounts = new Map();
const RATE_LIMIT = 100; // 每分钟100个请求
const RATE_WINDOW = 60 * 1000; // 1分钟

app.use((req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();

  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, []);
  }

  const requests = requestCounts.get(ip);
  const recentRequests = requests.filter(time => now - time < RATE_WINDOW);

  if (recentRequests.length >= RATE_LIMIT) {
    return res.status(429).send('Too Many Requests');
  }

  recentRequests.push(now);
  requestCounts.set(ip, recentRequests);

  next();
});

// ============================================
// 辅助函数
// ============================================

// 检测是否为搜索引擎
function isBot(userAgent) {
  return CONFIG.BOT_REGEX.test(userAgent);
}

// 检查IP是否在白名单
function isWhitelisted(ip) {
  // 移除IPv6前缀（如果有）
  const cleanIp = ip.replace('::ffff:', '');
  return CONFIG.ADMIN_WHITELIST.includes(cleanIp);
}

// 代理请求到目标服务器
async function proxyRequest(req, res, targetUrl) {
  try {
    const response = await axios({
      method: req.method,
      url: targetUrl + req.path,
      headers: {
        'User-Agent': req.get('User-Agent'),
        'X-Real-IP': req.ip,
        'X-Forwarded-For': req.ip,
      },
      params: req.query,
      validateStatus: () => true // 接受所有状态码
    });

    // 转发响应头
    Object.keys(response.headers).forEach(key => {
      if (!['connection', 'transfer-encoding'].includes(key.toLowerCase())) {
        res.setHeader(key, response.headers[key]);
      }
    });

    // 隐藏服务器信息
    res.removeHeader('X-Powered-By');
    res.setHeader('Server', 'CloudFlare');

    res.status(response.status).send(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(502).send('Bad Gateway');
  }
}

// ============================================
// 路由
// ============================================

// Link跳转路由
app.get('/go/:target', (req, res) => {
  const path = `/go/${req.params.target}`;
  const redirectUrl = CONFIG.REDIRECT_MAP[path];

  if (redirectUrl) {
    console.log(`✅ Redirect: ${path} → ${redirectUrl}`);
    res.redirect(302, redirectUrl);
  } else {
    console.log(`❌ Unknown redirect: ${path}`);
    res.status(404).send('Redirect not found');
  }
});

// 管理后台代理（需要IP白名单）
app.all('/admin/*', (req, res) => {
  const clientIp = req.ip || req.connection.remoteAddress;

  if (!isWhitelisted(clientIp)) {
    console.log(`🚫 Admin access denied: ${clientIp}`);
    return res.status(403).send('Access Denied');
  }

  console.log(`✅ Admin access granted: ${clientIp}`);
  proxyRequest(req, res, `http://${CONFIG.SERVER3_IP}:3100`);
});

// SEO引导：根据User-Agent分流
app.get('*', (req, res) => {
  const userAgent = req.get('User-Agent') || '';

  if (isBot(userAgent)) {
    // 搜索引擎：代理到网站1
    console.log(`🤖 Bot detected: ${userAgent}`);
    proxyRequest(req, res, `http://${CONFIG.SERVER1_IP}:3001`);
  } else {
    // 普通用户：跳转到主站
    console.log(`👤 User redirect: ${req.path}`);
    res.redirect(302, 'https://telegram1688.com');
  }
});

// ============================================
// 错误处理
// ============================================
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).send('Internal Server Error');
});

// ============================================
// 启动服务器
// ============================================
const PORT = CONFIG.PORT;
app.listen(PORT, '0.0.0.0', () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🚀 服务器2 - 跳转服务器已启动');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`   端口: ${PORT}`);
  console.log(`   服务器1: ${CONFIG.SERVER1_IP}`);
  console.log(`   服务器3: ${CONFIG.SERVER3_IP}`);
  console.log(`   跳转路由数: ${Object.keys(CONFIG.REDIRECT_MAP).length}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});

// 优雅退出
process.on('SIGTERM', () => {
  console.log('📥 Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('📥 Received SIGINT, shutting down gracefully...');
  process.exit(0);
});
