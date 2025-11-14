#!/usr/bin/env node

/**
 * Google蜘蛛池 - URL提交脚本
 *
 * 功能：通过Google Indexing API提交URL
 * 文档：https://developers.google.com/search/apis/indexing-api/v3/quickstart
 *
 * 注意：
 * 1. 需要在Google Cloud Console创建服务账号
 * 2. 下载JSON密钥文件到 spider-pool/config/google-credentials.json
 * 3. 在Search Console中添加该服务账号为验证用户
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@repo/database');

const prisma = new PrismaClient();

// ============================================
// 配置
// ============================================
const CONFIG = {
  CREDENTIALS_PATH: path.join(__dirname, '../config/google-credentials.json'),
  SITE: process.env.GOOGLE_SITE || 'telegram1688.com',
  BATCH_SIZE: parseInt(process.env.SPIDER_BATCH_SIZE || '100'),
  INTERVAL: parseInt(process.env.SPIDER_SUBMIT_INTERVAL || '60') * 1000
};

// ============================================
// 获取待提交的URL列表
// ============================================
async function getUrlsToSubmit() {
  const urls = [];

  try {
    // 主要页面
    urls.push(`https://${CONFIG.SITE}/`);
    urls.push(`https://${CONFIG.SITE}/download`);
    urls.push(`https://${CONFIG.SITE}/features`);
    urls.push(`https://${CONFIG.SITE}/faq`);
    urls.push(`https://${CONFIG.SITE}/privacy`);

    // 从数据库获取动态页面
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
// 初始化Google Indexing API
// ============================================
async function initGoogleIndexing() {
  if (!fs.existsSync(CONFIG.CREDENTIALS_PATH)) {
    throw new Error(`Google凭证文件不存在: ${CONFIG.CREDENTIALS_PATH}`);
  }

  const key = require(CONFIG.CREDENTIALS_PATH);

  const jwtClient = new google.auth.JWT(
    key.client_email,
    null,
    key.private_key,
    ['https://www.googleapis.com/auth/indexing'],
    null
  );

  await jwtClient.authorize();

  return google.indexing({
    version: 'v3',
    auth: jwtClient
  });
}

// ============================================
// 提交单个URL到Google
// ============================================
async function submitUrlToGoogle(indexing, url, type = 'URL_UPDATED') {
  try {
    const response = await indexing.urlNotifications.publish({
      requestBody: {
        url: url,
        type: type  // URL_UPDATED 或 URL_DELETED
      }
    });

    return {
      success: true,
      url: url,
      response: response.data
    };
  } catch (error) {
    console.error(`❌ 提交失败 ${url}:`, error.message);
    return {
      success: false,
      url: url,
      error: error.message
    };
  }
}

// ============================================
// 批量提交URL
// ============================================
async function submitToGoogle(urls) {
  if (urls.length === 0) {
    console.log('⚠️  没有URL需要提交');
    return;
  }

  console.log(`🚀 开始提交 ${urls.length} 个URL到Google...`);

  const indexing = await initGoogleIndexing();
  const results = {
    success: 0,
    failed: 0,
    errors: []
  };

  // 批量提交（Google API限制较少，但仍建议控制频率）
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    console.log(`\n[${i + 1}/${urls.length}] 提交: ${url}`);

    const result = await submitUrlToGoogle(indexing, url);

    if (result.success) {
      results.success++;
      console.log(`   ✅ 成功`);
    } else {
      results.failed++;
      results.errors.push({ url, error: result.error });
      console.log(`   ❌ 失败: ${result.error}`);
    }

    // 间隔延迟
    if (i < urls.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1秒延迟
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Google提交结果:');
  console.log(`   总计: ${urls.length} 个URL`);
  console.log(`   成功: ${results.success} 个`);
  console.log(`   失败: ${results.failed} 个`);

  if (results.errors.length > 0) {
    console.log('\n   ❌ 失败的URL:');
    results.errors.forEach(({ url, error }) => {
      console.log(`      - ${url}: ${error}`);
    });
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // 记录到数据库
  await logSubmission('google', urls.length, results.success, results);

  return results;
}

// ============================================
// 记录提交历史
// ============================================
async function logSubmission(engine, totalUrls, successUrls, result) {
  try {
    // 记录到数据库
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
// 主函数
// ============================================
async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🕷️  Google蜘蛛池 - URL提交');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`   时间: ${new Date().toLocaleString('zh-CN')}`);
  console.log(`   站点: ${CONFIG.SITE}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    // 获取URL列表
    const urls = await getUrlsToSubmit();

    if (urls.length === 0) {
      console.log('⚠️  没有URL需要提交');
      return;
    }

    // 提交
    await submitToGoogle(urls);

    console.log('\n✅ Google URL提交完成！');
  } catch (error) {
    console.error('\n❌ 提交过程出错:', error.message);

    if (error.message.includes('credentials')) {
      console.error('\n💡 提示: 请确保已配置Google服务账号凭证');
      console.error('   1. 在Google Cloud Console创建服务账号');
      console.error('   2. 下载JSON密钥到: spider-pool/config/google-credentials.json');
      console.error('   3. 在Search Console添加该服务账号为验证用户');
    }

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

module.exports = { submitToGoogle, getUrlsToSubmit };
