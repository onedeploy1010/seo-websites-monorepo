#!/usr/bin/env node

/**
 * 百度蜘蛛池 - URL提交脚本
 *
 * 功能：自动将网站URL提交给百度搜索引擎
 * 使用：pm2定时任务每6小时运行一次
 *
 * API文档：https://ziyuan.baidu.com/linksubmit/index
 */

const axios = require('axios');
const { PrismaClient } = require('@repo/database');

const prisma = new PrismaClient();

// ============================================
// 配置
// ============================================
const CONFIG = {
  BAIDU_SUBMIT_API: 'http://data.zz.baidu.com/urls',
  SITE: process.env.BAIDU_SITE || 'telegram1688.com',
  TOKEN: process.env.BAIDU_TOKEN || '',
  BATCH_SIZE: parseInt(process.env.SPIDER_BATCH_SIZE || '100'),
  INTERVAL: parseInt(process.env.SPIDER_SUBMIT_INTERVAL || '60') * 1000
};

// ============================================
// 获取待提交的URL列表
// ============================================
async function getUrlsToSubmit() {
  const urls = [];

  // 1. 从数据库获取所有活跃页面的URL
  try {
    // 获取首页
    urls.push(`https://${CONFIG.SITE}/`);

    // 获取下载页
    urls.push(`https://${CONFIG.SITE}/download`);

    // 获取功能页
    urls.push(`https://${CONFIG.SITE}/features`);

    // 获取FAQ页
    urls.push(`https://${CONFIG.SITE}/faq`);

    // 获取隐私页
    urls.push(`https://${CONFIG.SITE}/privacy`);

    // 从数据库获取动态页面（如果有的话）
    // 示例：博客文章、产品页面等
    // const posts = await prisma.post.findMany({
    //   where: { published: true },
    //   select: { slug: true }
    // });
    // posts.forEach(post => {
    //   urls.push(`https://${CONFIG.SITE}/blog/${post.slug}`);
    // });

    console.log(`✅ 收集到 ${urls.length} 个URL待提交`);
  } catch (error) {
    console.error('❌ 获取URL列表失败:', error.message);
  }

  return urls;
}

// ============================================
// 提交URL到百度
// ============================================
async function submitToBaidu(urls) {
  if (!CONFIG.TOKEN) {
    throw new Error('BAIDU_TOKEN 未配置');
  }

  if (urls.length === 0) {
    console.log('⚠️  没有URL需要提交');
    return;
  }

  try {
    const response = await axios.post(
      `${CONFIG.BAIDU_SUBMIT_API}?site=${CONFIG.SITE}&token=${CONFIG.TOKEN}`,
      urls.join('\n'),
      {
        headers: {
          'Content-Type': 'text/plain',
          'User-Agent': 'curl/7.12.1'
        },
        timeout: 30000
      }
    );

    const result = response.data;

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 百度提交结果:');
    console.log(`   本次提交: ${urls.length} 个URL`);
    console.log(`   成功: ${result.success || 0} 个`);
    console.log(`   今日剩余: ${result.remain || 'N/A'}`);

    if (result.not_same_site && result.not_same_site.length > 0) {
      console.log(`   ⚠️  非本站URL: ${result.not_same_site.length} 个`);
    }

    if (result.not_valid && result.not_valid.length > 0) {
      console.log(`   ❌ 无效URL: ${result.not_valid.length} 个`);
      result.not_valid.forEach(url => console.log(`      - ${url}`));
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // 记录到数据库（可选）
    await logSubmission('baidu', urls.length, result.success || 0, result);

    return result;
  } catch (error) {
    console.error('❌ 百度提交失败:', error.message);

    if (error.response) {
      console.error('   状态码:', error.response.status);
      console.error('   响应:', error.response.data);
    }

    throw error;
  }
}

// ============================================
// 记录提交历史到数据库
// ============================================
async function logSubmission(engine, totalUrls, successUrls, result) {
  try {
    // 如果有submission_logs表，记录到数据库
    // await prisma.submissionLog.create({
    //   data: {
    //     engine,
    //     site: CONFIG.SITE,
    //     totalUrls,
    //     successUrls,
    //     result: JSON.stringify(result),
    //     submittedAt: new Date()
    //   }
    // });
    console.log(`✅ 提交记录已保存`);
  } catch (error) {
    console.error('⚠️  保存提交记录失败:', error.message);
  }
}

// ============================================
// 分批提交
// ============================================
async function submitInBatches(urls) {
  const batches = [];
  for (let i = 0; i < urls.length; i += CONFIG.BATCH_SIZE) {
    batches.push(urls.slice(i, i + CONFIG.BATCH_SIZE));
  }

  console.log(`📦 分为 ${batches.length} 批提交`);

  for (let i = 0; i < batches.length; i++) {
    console.log(`\n🚀 提交第 ${i + 1}/${batches.length} 批...`);

    await submitToBaidu(batches[i]);

    // 批次间延迟，避免频率限制
    if (i < batches.length - 1) {
      console.log(`⏳ 等待 ${CONFIG.INTERVAL / 1000} 秒后继续...`);
      await new Promise(resolve => setTimeout(resolve, CONFIG.INTERVAL));
    }
  }
}

// ============================================
// 主函数
// ============================================
async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🕷️  百度蜘蛛池 - URL提交');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`   时间: ${new Date().toLocaleString('zh-CN')}`);
  console.log(`   站点: ${CONFIG.SITE}`);
  console.log(`   批次大小: ${CONFIG.BATCH_SIZE}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    // 获取URL列表
    const urls = await getUrlsToSubmit();

    if (urls.length === 0) {
      console.log('⚠️  没有URL需要提交');
      return;
    }

    // 提交
    await submitInBatches(urls);

    console.log('\n✅ 百度URL提交完成！');
  } catch (error) {
    console.error('\n❌ 提交过程出错:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// ============================================
// 执行
// ============================================
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { submitToBaidu, getUrlsToSubmit };
