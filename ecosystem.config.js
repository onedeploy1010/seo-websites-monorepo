/**
 * PM2 生产环境配置文件
 *
 * 使用方法：
 * 1. 启动所有应用: pm2 start ecosystem.config.js
 * 2. 启动单个应用: pm2 start ecosystem.config.js --only seo-admin
 * 3. 重启应用: pm2 restart all
 * 4. 查看状态: pm2 list
 * 5. 查看日志: pm2 logs seo-admin
 * 6. 实时监控: pm2 monit
 *
 * 注意：
 * - 请确保已经运行 `pnpm build` 构建所有应用
 * - 请确保 .env.production 文件配置正确（包含 DATABASE_URL, NEXTAUTH_SECRET 等）
 * - 日志文件会保存在 /www/wwwlogs/ 目录
 * - 环境变量从 .env.production 文件加载
 */

module.exports = {
  apps: [
    // ==========================================
    // 管理后台 (Admin Panel)
    // ==========================================
    {
      name: 'seo-admin',
      cwd: '/www/wwwroot/seo-websites-monorepo/apps/admin',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3100',
      env_file: '/www/wwwroot/seo-websites-monorepo/.env.production',
      env: {
        NODE_ENV: 'production',
        PORT: 3100
      },
      instances: 1,
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '500M',
      error_file: '/www/wwwlogs/seo-admin-error.log',
      out_file: '/www/wwwlogs/seo-admin-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s'
    },

    // ==========================================
    // 前台网站 1 (Website 1)
    // ==========================================
    {
      name: 'seo-website-1',
      cwd: '/www/wwwroot/seo-websites-monorepo/apps/website-1',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3001',
      env_file: '/www/wwwroot/seo-websites-monorepo/.env.production',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      instances: 1,
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '500M',
      error_file: '/www/wwwlogs/seo-website-1-error.log',
      out_file: '/www/wwwlogs/seo-website-1-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s'
    },

    // ==========================================
    // 前台网站 2 (Website 2)
    // ==========================================
    {
      name: 'seo-website-2',
      cwd: '/www/wwwroot/seo-websites-monorepo/apps/website-2',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3002',
      env_file: '/www/wwwroot/seo-websites-monorepo/.env.production',
      env: {
        NODE_ENV: 'production',
        PORT: 3002
      },
      instances: 1,
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '500M',
      error_file: '/www/wwwlogs/seo-website-2-error.log',
      out_file: '/www/wwwlogs/seo-website-2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s'
    },

    // ==========================================
    // 前台网站 TG (Website TG)
    // ==========================================
    {
      name: 'seo-website-tg',
      cwd: '/www/wwwroot/seo-websites-monorepo/apps/website-tg',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3003',
      env_file: '/www/wwwroot/seo-websites-monorepo/.env.production',
      env: {
        NODE_ENV: 'production',
        PORT: 3003
      },
      instances: 1,
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '500M',
      error_file: '/www/wwwlogs/seo-website-tg-error.log',
      out_file: '/www/wwwlogs/seo-website-tg-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ],

  // ==========================================
  // PM2 部署配置（可选）
  // ==========================================
  deploy: {
    production: {
      user: 'root',
      host: 'your-server-ip',
      ref: 'origin/master',
      repo: 'https://github.com/onedeploy1010/seo-websites-monorepo.git',
      path: '/www/wwwroot/seo-websites-monorepo',
      'post-deploy': 'pnpm install && pnpm build && pm2 reload ecosystem.config.js --env production && pm2 save'
    }
  }
}
