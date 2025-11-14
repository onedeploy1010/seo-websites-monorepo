/**
 * PM2 配置文件 - 服务器 3（管理服务器）
 *
 * 用途：运行管理后台、蜘蛛池系统、数据库
 *
 * 服务器角色：内部管理服务器
 * - 运行 Admin 后台
 * - 运行蜘蛛池系统
 * - 数据库主库
 * - 仅内网或VPN访问
 *
 * 使用方法：
 * 1. 启动所有服务: pm2 start ecosystem.server3.config.js
 * 2. 查看状态: pm2 list
 * 3. 查看日志: pm2 logs
 *
 * 注意：
 * - 确保 .env.server3.production 文件配置正确
 * - 确保防火墙规则已设置
 * - 确保只有授权IP可以访问
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

// 加载环境变量（优先使用 .env.server3.production，回退到 .env.production）
const envFilePath = fs.existsSync(path.join(__dirname, '.env.server3.production'))
  ? path.join(__dirname, '.env.server3.production')
  : path.join(__dirname, '.env.production');

const envVars = loadEnvFile(envFilePath);

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🔐 服务器3 - 管理服务器');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`✅ 环境变量文件: ${envFilePath}`);
console.log(`   DATABASE_URL: ${envVars.DATABASE_URL ? envVars.DATABASE_URL.replace(/:[^:@]+@/, ':****@') : 'NOT FOUND'}`);
console.log(`   NEXTAUTH_SECRET: ${envVars.NEXTAUTH_SECRET ? '****' : 'NOT FOUND'}`);
console.log(`   TAVILY_API_KEY: ${envVars.TAVILY_API_KEY ? '****' : 'NOT SET'}`);
console.log(`   ADMIN_ONLY_MODE: ${envVars.ADMIN_ONLY_MODE || 'false'}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

module.exports = {
  apps: [
    // ==========================================
    // 管理后台
    // ==========================================
    {
      name: 'admin',
      cwd: '/www/wwwroot/seo-websites-monorepo/apps/admin',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3100',
      env: {
        NODE_ENV: 'production',
        PORT: 3100,
        ...envVars
      },
      instances: 1,              // 管理后台单实例即可
      exec_mode: 'fork',         // 使用fork模式
      watch: false,
      max_memory_restart: '1G',
      error_file: '/www/wwwlogs/server3-admin-error.log',
      out_file: '/www/wwwlogs/server3-admin-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s'
    },

    // ==========================================
    // 蜘蛛池 - 百度提交
    // ==========================================
    {
      name: 'spider-baidu',
      cwd: '/www/wwwroot/seo-websites-monorepo',
      script: 'spider-pool/scripts/submit-baidu.js',
      env: {
        NODE_ENV: 'production',
        ...envVars
      },
      cron_restart: '0 */6 * * *',  // 每6小时运行一次
      autorestart: false,            // 定时任务不自动重启
      error_file: '/www/wwwlogs/spider-baidu-error.log',
      out_file: '/www/wwwlogs/spider-baidu-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true
    },

    // ==========================================
    // 蜘蛛池 - Google提交
    // ==========================================
    {
      name: 'spider-google',
      cwd: '/www/wwwroot/seo-websites-monorepo',
      script: 'spider-pool/scripts/submit-google.js',
      env: {
        NODE_ENV: 'production',
        ...envVars
      },
      cron_restart: '30 */6 * * *',  // 每6小时运行一次（错开时间）
      autorestart: false,
      error_file: '/www/wwwlogs/spider-google-error.log',
      out_file: '/www/wwwlogs/spider-google-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true
    },

    // ==========================================
    // 蜘蛛池 - 收录检查
    // ==========================================
    {
      name: 'spider-check-index',
      cwd: '/www/wwwroot/seo-websites-monorepo',
      script: 'spider-pool/scripts/check-index.js',
      env: {
        NODE_ENV: 'production',
        ...envVars
      },
      cron_restart: '0 2 * * *',  // 每天凌晨2点检查
      autorestart: false,
      error_file: '/www/wwwlogs/spider-check-error.log',
      out_file: '/www/wwwlogs/spider-check-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true
    },

    // ==========================================
    // SEO数据更新（可选）
    // ==========================================
    {
      name: 'seo-data-update',
      cwd: '/www/wwwroot/seo-websites-monorepo',
      script: 'scripts/update-keyword-data.ts',
      interpreter: 'npx',
      interpreter_args: 'tsx',
      env: {
        NODE_ENV: 'production',
        ...envVars
      },
      cron_restart: '0 4 * * 0',  // 每周日凌晨4点更新
      autorestart: false,
      error_file: '/www/wwwlogs/seo-update-error.log',
      out_file: '/www/wwwlogs/seo-update-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true
    }
  ]
}
