/**
 * PM2 配置文件 - 服务器 1（网页模板服务器）
 *
 * 用途：部署3个网页模板，支持15个域名访问
 *
 * 服务器角色：公开前端展示服务器
 * - 仅运行 website-1, website-2, website-tg
 * - 通过API从服务器3获取数据
 * - 不包含管理后台
 *
 * 使用方法：
 * 1. 启动所有网站: pm2 start ecosystem.server1.config.js
 * 2. 查看状态: pm2 list
 * 3. 查看日志: pm2 logs
 *
 * 注意：
 * - 确保 .env.server1.production 文件配置正确
 * - 确保已运行 pnpm build
 * - 确保服务器3的API地址可访问
 */

const fs = require('fs');
const path = require('path');

// 读取并解析环境变量文件
function loadEnvFile(filePath) {
  const envVars = {};

  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    lines.forEach(line => {
      line = line.trim();

      // 跳过注释和空行
      if (!line || line.startsWith('#')) {
        return;
      }

      // 解析 KEY=VALUE 或 KEY="VALUE"
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();

        // 移除引号
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }

        envVars[key] = value;
      }
    });
  }

  return envVars;
}

// 加载环境变量（优先使用 .env.server1.production，回退到 .env.production）
const envFilePath = fs.existsSync(path.join(__dirname, '.env.server1.production'))
  ? path.join(__dirname, '.env.server1.production')
  : path.join(__dirname, '.env.production');

const envVars = loadEnvFile(envFilePath);

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🖥️  服务器1 - 网页模板服务器');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`✅ 环境变量文件: ${envFilePath}`);
console.log(`   DATABASE_URL: ${envVars.DATABASE_URL ? envVars.DATABASE_URL.replace(/:[^:@]+@/, ':****@') : 'NOT FOUND'}`);
console.log(`   NEXT_PUBLIC_API_URL: ${envVars.NEXT_PUBLIC_API_URL || 'NOT SET'}`);
console.log(`   DISABLE_ADMIN_ACCESS: ${envVars.DISABLE_ADMIN_ACCESS || 'false'}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

module.exports = {
  apps: [
    // ==========================================
    // Website 1 - Telegram1688.com
    // ==========================================
    {
      name: 'website-1',
      cwd: '/www/wwwroot/seo-websites-monorepo/apps/website-1',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3001',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        ...envVars
      },
      instances: 2,              // 2个实例以提高并发能力
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '800M',
      error_file: '/www/wwwlogs/server1-website-1-error.log',
      out_file: '/www/wwwlogs/server1-website-1-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s'
    },

    // ==========================================
    // Website 2 - TelegramJiaoyu.com
    // ==========================================
    {
      name: 'website-2',
      cwd: '/www/wwwroot/seo-websites-monorepo/apps/website-2',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3002',
      env: {
        NODE_ENV: 'production',
        PORT: 3002,
        ...envVars
      },
      instances: 2,
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '800M',
      error_file: '/www/wwwlogs/server1-website-2-error.log',
      out_file: '/www/wwwlogs/server1-website-2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s'
    },

    // ==========================================
    // Website TG - TelegramZhfw.com
    // ==========================================
    {
      name: 'website-tg',
      cwd: '/www/wwwroot/seo-websites-monorepo/apps/website-tg',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3003',
      env: {
        NODE_ENV: 'production',
        PORT: 3003,
        ...envVars
      },
      instances: 2,
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '800M',
      error_file: '/www/wwwlogs/server1-website-tg-error.log',
      out_file: '/www/wwwlogs/server1-website-tg-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ]
}
