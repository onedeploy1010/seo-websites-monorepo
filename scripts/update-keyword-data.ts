#!/usr/bin/env tsx

/**
 * 更新关键词真实数据脚本
 *
 * 此脚本从第三方 SEO API 获取真实的关键词数据并更新数据库
 *
 * 使用方法：
 * 1. 设置环境变量:
 *    export DATAFORSEO_LOGIN="your_login"
 *    export DATAFORSEO_PASSWORD="your_password"
 *    export TAVILY_API_KEY="your_api_key"  # 推荐：1000次/月免费
 *    export SERPAPI_KEY="your_api_key"     # 备选：100次/月免费
 *
 * 2. 运行脚本:
 *    npx tsx scripts/update-keyword-data.ts
 *
 * 可选参数:
 *   --keywords-only       只更新关键词数据，不检查排名
 *   --rankings-only       只检查排名，不更新关键词数据
 *   --ranking-api=tavily  指定排名 API (tavily|serpapi)，默认 tavily
 *   --website-id=xxx      只处理特定网站的关键词
 *   --limit=10            限制处理的关键词数量（测试用）
 *   --dry-run             试运行，不写入数据库
 */

import { prisma } from '@repo/database'
import {
  getKeywordSearchVolume,
  getDataForSEOConfigFromEnv,
  type KeywordDataResult,
} from '../packages/seo-tools/dataforseo'
import {
  checkKeywordRanking as checkRankingWithSerpApi,
  getSerpApiConfigFromEnv,
  checkApiQuota,
  type RankingResult,
} from '../packages/seo-tools/serpapi'
import {
  checkKeywordRanking as checkRankingWithTavily,
  getTavilyConfigFromEnv,
} from '../packages/seo-tools/tavily'

// 解析命令行参数
const args = process.argv.slice(2)
const options = {
  keywordsOnly: args.includes('--keywords-only'),
  rankingsOnly: args.includes('--rankings-only'),
  rankingApi: (args.find((arg) => arg.startsWith('--ranking-api='))?.split('=')[1] || 'tavily') as 'tavily' | 'serpapi',
  websiteId: args.find((arg) => arg.startsWith('--website-id='))?.split('=')[1],
  limit: parseInt(
    args.find((arg) => arg.startsWith('--limit='))?.split('=')[1] || '0'
  ),
  dryRun: args.includes('--dry-run'),
}

interface KeywordWithWebsite {
  id: string
  keyword: string
  volume: number | null
  difficulty: number | null
  cpc: number | null
  website: {
    id: string
    domain: string
    name: string
  }
}

async function main() {
  console.log('🚀 开始更新关键词数据...\n')

  // 1. 获取所有关键词
  console.log('📊 正在获取关键词列表...')

  const whereClause: any = {}
  if (options.websiteId) {
    whereClause.websites = {
      some: {
        id: options.websiteId,
      },
    }
  }

  let keywords = await prisma.keyword.findMany({
    where: whereClause,
    include: {
      website: {
        select: {
          id: true,
          domain: true,
          name: true,
        },
      },
    },
    take: options.limit > 0 ? options.limit : undefined,
  })

  console.log(`✅ 找到 ${keywords.length} 个关键词\n`)

  if (keywords.length === 0) {
    console.log('⚠️  没有找到关键词，退出')
    return
  }

  // 2. 更新关键词搜索量数据
  if (!options.rankingsOnly) {
    console.log('📈 正在获取关键词搜索量数据...')

    try {
      const dataForSEOConfig = getDataForSEOConfigFromEnv()
      const keywordTexts = keywords.map((k) => k.keyword)

      // 分批处理（每批100个）
      const batchSize = 100
      let updatedCount = 0

      for (let i = 0; i < keywordTexts.length; i += batchSize) {
        const batch = keywordTexts.slice(i, i + batchSize)
        console.log(
          `   处理批次 ${Math.floor(i / batchSize) + 1}/${Math.ceil(keywordTexts.length / batchSize)} (${batch.length} 个关键词)...`
        )

        try {
          const results = await getKeywordSearchVolume(batch, dataForSEOConfig)

          // 更新数据库
          for (const result of results) {
            const keyword = keywords.find((k) => k.keyword === result.keyword)
            if (!keyword) continue

            if (!options.dryRun) {
              await prisma.keyword.update({
                where: { id: keyword.id },
                data: {
                  volume: result.search_volume,
                  difficulty: Math.round(result.competition * 100), // 转换为 0-100
                  cpc: result.cpc,
                  updatedAt: new Date(),
                },
              })
            }

            console.log(
              `   ✓ ${result.keyword}: 搜索量=${result.search_volume}, 难度=${Math.round(result.competition * 100)}, CPC=$${result.cpc.toFixed(2)}`
            )
            updatedCount++
          }

          // 避免速率限制
          if (i + batchSize < keywordTexts.length) {
            await new Promise((resolve) => setTimeout(resolve, 1000))
          }
        } catch (error) {
          console.error(`   ❌ 批次处理失败:`, error)
        }
      }

      console.log(`\n✅ 成功更新 ${updatedCount} 个关键词的搜索数据\n`)
    } catch (error) {
      console.error('❌ DataForSEO 配置错误:', error)
      console.log('提示: 请设置 DATAFORSEO_LOGIN 和 DATAFORSEO_PASSWORD 环境变量\n')
    }
  }

  // 3. 检查关键词排名
  if (!options.keywordsOnly) {
    console.log(`🔍 正在检查关键词排名 (使用 ${options.rankingApi.toUpperCase()})...`)

    // 优先尝试 Tavily（免费额度更多）
    if (options.rankingApi === 'tavily' || !process.env.SERPAPI_KEY) {
      try {
        const tavilyConfig = getTavilyConfigFromEnv()
        console.log(`   ✓ 使用 Tavily API（免费额度: 1000次/月）\n`)

        let checkedCount = 0
        let foundRankings = 0

        // 只检查有关联网站的关键词
        const keywordsWithWebsites = keywords.filter(
          (k) => k.website
        )

        console.log(
          `   准备检查 ${keywordsWithWebsites.length} 个关键词的排名...\n`
        )

        for (const keyword of keywordsWithWebsites) {
          const website = keyword.website

          try {
            console.log(
              `   [${checkedCount + 1}/${keywordsWithWebsites.length}] 检查 "${keyword.keyword}" 在 ${website.domain} 的排名...`
            )

            const result = await checkRankingWithTavily(
              keyword.keyword,
              website.domain,
              tavilyConfig
            )

            if (result.position) {
              console.log(
                `   ✓ 找到排名: 第 ${result.position} 位 (${result.url})`
              )
              foundRankings++

              // 保存排名记录
              if (!options.dryRun) {
                await prisma.keywordRanking.create({
                  data: {
                    keywordId: keyword.id,
                    position: result.position,
                    url: result.url || '',
                    searchEngine: 'google',
                    checkedAt: result.searchedAt,
                  },
                })
              }
            } else {
              console.log(`   - 未找到排名（前10位之外）`)
            }

            checkedCount++

            // 避免速率限制
            await new Promise((resolve) => setTimeout(resolve, 1000))
          } catch (error) {
            console.error(`   ❌ 检查失败:`, error)
          }
        }

        console.log(
          `\n✅ 检查了 ${checkedCount} 个关键词，找到 ${foundRankings} 个排名\n`
        )
      } catch (error) {
        console.error('❌ Tavily 配置错误:', error)
        console.log('提示: 请设置 TAVILY_API_KEY 环境变量')
        console.log('注册地址: https://tavily.com/ (免费 1000 次/月)\n')
      }
    } else {
      // 使用 SerpApi
      try {
        const serpApiConfig = getSerpApiConfigFromEnv()

        // 检查 API 配额
        console.log('   检查 SerpApi 配额...')
        const quota = await checkApiQuota(serpApiConfig.apiKey)
        console.log(
          `   配额: ${quota.used}/${quota.total} (剩余 ${quota.remaining} 次)\n`
        )

        if (quota.remaining === 0) {
          console.log('⚠️  SerpApi 配额已用完，跳过排名检查')
          console.log('💡 提示: 可以使用 Tavily API（免费 1000 次/月）')
          console.log('   运行: npx tsx scripts/update-keyword-data.ts --ranking-api=tavily\n')
        } else {
          let checkedCount = 0
          let foundRankings = 0

          // 只检查有关联网站的关键词
          const keywordsWithWebsites = keywords.filter(
            (k) => k.website
          )

          console.log(
            `   准备检查 ${keywordsWithWebsites.length} 个关键词的排名...\n`
          )

          for (const keyword of keywordsWithWebsites) {
            const website = keyword.website

            try {
              console.log(
                `   [${checkedCount + 1}/${keywordsWithWebsites.length}] 检查 "${keyword.keyword}" 在 ${website.domain} 的排名...`
              )

              const result = await checkRankingWithSerpApi(
                keyword.keyword,
                website.domain,
                serpApiConfig
              )

              if (result.position) {
                console.log(
                  `   ✓ 找到排名: 第 ${result.position} 位 (${result.url})`
                )
                foundRankings++

                // 保存排名记录
                if (!options.dryRun) {
                  await prisma.keywordRanking.create({
                    data: {
                      keywordId: keyword.id,
                      position: result.position,
                      url: result.url || '',
                      searchEngine: 'google',
                      checkedAt: result.searchedAt,
                    },
                  })
                }
              } else {
                console.log(`   - 未找到排名（前100位之外）`)
              }

              checkedCount++

              // 避免速率限制 + 节省配额
              await new Promise((resolve) => setTimeout(resolve, 2000))

              // 达到配额限制则停止
              if (checkedCount >= quota.remaining) {
                console.log('\n⚠️  已达到 API 配额限制，停止检查')
                break
              }
            } catch (error) {
              console.error(`   ❌ 检查失败:`, error)
            }
          }

          console.log(
            `\n✅ 检查了 ${checkedCount} 个关键词，找到 ${foundRankings} 个排名\n`
          )
        }
      } catch (error) {
        console.error('❌ SerpApi 配置错误:', error)
        console.log('提示: 请设置 SERPAPI_KEY 环境变量\n')
      }
    }
  }

  console.log('✨ 更新完成！')

  if (options.dryRun) {
    console.log('\n⚠️  这是试运行，数据未写入数据库')
  }
}

main()
  .catch((error) => {
    console.error('❌ 发生错误:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
