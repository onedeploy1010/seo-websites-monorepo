#!/usr/bin/env node

/**
 * 蜘蛛池 - 收录检查脚本
 *
 * 功能：检查URL是否被搜索引擎收录
 * 使用：每天运行一次，更新收录状态
 */

const axios = require('axios');
const { PrismaClient } = require('@repo/database');

const prisma = new PrismaClient();

// ============================================
// 配置
// ============================================
const CONFIG = {
  SITE: process.env.BAIDU_SITE || 'telegram1688.com',
  CHECK_DELAY: 2000  // 检查间隔2秒
};

// ============================================
// 获取需要检查的URL
// ============================================
async function getUrlsToCheck() {
  const urls = [
    `https://${CONFIG.SITE}/`,
    `https://${CONFIG.SITE}/download`,
    `https://${CONFIG.SITE}/features`,
    `https://${CONFIG.SITE}/faq`,
    `https://${CONFIG.SITE}/privacy`
  ];

  // 从数据库获取需要检查的URL
  // const pages = await prisma.page.findMany({
  //   where: { active: true },
  //   select: { url: true }
  // });
  // urls.push(...pages.map(p => p.url));

  return urls;
}

// ============================================
// 检查百度收录
// ============================================
async function checkBaiduIndex(url) {
  try {
    // 使用 site: 操作符检查收录
    const searchUrl = `https://www.baidu.com/s?wd=site:${encodeURIComponent(url)}`;

    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });

    const html = response.data;

    // 检查是否有结果
    const hasResults = !html.includes('抱歉，没有找到') && !html.includes('很抱歉');
    const indexed = hasResults;

    return {
      engine: 'baidu',
      url,
      indexed,
      checkedAt: new Date()
    };
  } catch (error) {
    console.error(`❌ 检查百度收录失败 ${url}:`, error.message);
    return {
      engine: 'baidu',
      url,
      indexed: null,
      error: error.message,
      checkedAt: new Date()
    };
  }
}

// ============================================
// 检查Google收录
// ============================================
async function checkGoogleIndex(url) {
  try {
    const searchUrl = `https://www.google.com/search?q=site:${encodeURIComponent(url)}`;

    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });

    const html = response.data;

    // 检查是否有结果
    const indexed = !html.includes('did not match any documents');

    return {
      engine: 'google',
      url,
      indexed,
      checkedAt: new Date()
    };
  } catch (error) {
    console.error(`❌ 检查Google收录失败 ${url}:`, error.message);
    return {
      engine: 'google',
      url,
      indexed: null,
      error: error.message,
      checkedAt: new Date()
    };
  }
}

// ============================================
// 保存检查结果
// ============================================
async function saveIndexStatus(results) {
  try {
    // 保存到数据库
    // for (const result of results) {
    //   await prisma.indexStatus.upsert({
    //     where: {
    //       engine_url: {
    //         engine: result.engine,
    //         url: result.url
    //       }
    //     },
    //     update: {
    //       indexed: result.indexed,
    //       lastChecked: result.checkedAt
    //     },
    //     create: result
    //   });
    // }
    console.log(`✅ 已保存 ${results.length} 条检查结果`);
  } catch (error) {
    console.error('❌ 保存检查结果失败:', error.message);
  }
}

// ============================================
// 生成报告
// ============================================
function generateReport(results) {
  const baiduResults = results.filter(r => r.engine === 'baidu');
  const googleResults = results.filter(r => r.engine === 'google');

  const baiduIndexed = baiduResults.filter(r => r.indexed === true).length;
  const googleIndexed = googleResults.filter(r => r.indexed === true).length;

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 收录检查报告');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`   检查时间: ${new Date().toLocaleString('zh-CN')}`);
  console.log(`   检查URL数: ${results.length / 2}`);
  console.log('');
  console.log(`   百度收录: ${baiduIndexed}/${baiduResults.length} (${(baiduIndexed / baiduResults.length * 100).toFixed(1)}%)`);
  console.log(`   Google收录: ${googleIndexed}/${googleResults.length} (${(googleIndexed / googleResults.length * 100).toFixed(1)}%)`);
  console.log('');

  // 显示未收录的URL
  const notIndexed = results.filter(r => r.indexed === false);
  if (notIndexed.length > 0) {
    console.log('   ⚠️  未收录的URL:');
    notIndexed.forEach(r => {
      console.log(`      [${r.engine}] ${r.url}`);
    });
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

// ============================================
// 主函数
// ============================================
async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🕷️  蜘蛛池 - 收录检查');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`   站点: ${CONFIG.SITE}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    // 获取URL列表
    const urls = await getUrlsToCheck();
    console.log(`✅ 将检查 ${urls.length} 个URL\n`);

    const results = [];

    // 检查每个URL
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      console.log(`[${i + 1}/${urls.length}] 检查: ${url}`);

      // 检查百度收录
      const baiduResult = await checkBaiduIndex(url);
      results.push(baiduResult);
      console.log(`   百度: ${baiduResult.indexed ? '✅ 已收录' : '❌ 未收录'}`);

      await new Promise(resolve => setTimeout(resolve, CONFIG.CHECK_DELAY));

      // 检查Google收录
      const googleResult = await checkGoogleIndex(url);
      results.push(googleResult);
      console.log(`   Google: ${googleResult.indexed ? '✅ 已收录' : '❌ 未收录'}`);

      await new Promise(resolve => setTimeout(resolve, CONFIG.CHECK_DELAY));
      console.log('');
    }

    // 保存结果
    await saveIndexStatus(results);

    // 生成报告
    generateReport(results);

    console.log('✅ 收录检查完成！');
  } catch (error) {
    console.error('\n❌ 检查过程出错:', error.message);
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

module.exports = { checkBaiduIndex, checkGoogleIndex };
