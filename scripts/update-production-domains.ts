#!/usr/bin/env tsx

/**
 * 更新生产环境域名脚本
 *
 * 此脚本将开发环境的 localhost 域名替换为真实的生产域名
 * 并为每个网站添加多个域名别名
 *
 * 使用方法：
 *   npx tsx scripts/update-production-domains.ts
 */

import { prisma } from '@repo/database'

// 您的 15 个生产域名
const PRODUCTION_DOMAINS = [
  'telegram1688.com',
  'telegram2688.com',
  'telegramcnfw.com',
  'telegramcny28.com',
  'telegramfuwu.com',
  'telegramfwfw.com',
  'telegramgzzh.com',
  'telegramhnzh.com',
  'telegramjiaoyu.com',
  'telegramrmb28.com',
  'telegramxzb.com',
  'telegramxzfw.com',
  'telegramzhfw.com',
  'xztelegram.com',
  'zhxztelegram.com',
]

// 网站配置：将不同域名分配给不同的网站
const WEBSITE_DOMAINS = {
  // Website 1: Telegram中文官网 (主站) - 分配 8 个域名
  'localhost:3002': {
    primaryDomain: 'telegram1688.com',
    aliases: [
      'telegram2688.com',
      'telegramcnfw.com',
      'telegramcny28.com',
      'telegramfuwu.com',
      'telegramfwfw.com',
      'telegramgzzh.com',
      'telegramhnzh.com',
    ],
  },
  // Website 2: TG中文纸飞机 - 分配 4 个域名
  'localhost:3003': {
    primaryDomain: 'telegramjiaoyu.com',
    aliases: [
      'telegramrmb28.com',
      'telegramxzb.com',
      'telegramxzfw.com',
    ],
  },
  // Website 3: Demo Website 1 - 分配 3 个域名
  'localhost:3001': {
    primaryDomain: 'telegramzhfw.com',
    aliases: [
      'xztelegram.com',
      'zhxztelegram.com',
    ],
  },
}

async function main() {
  console.log('🚀 开始更新生产环境域名...\n')

  // 1. 获取所有网站
  console.log('📊 获取现有网站...')
  const websites = await prisma.website.findMany()

  console.log(`✅ 找到 ${websites.length} 个网站\n`)

  for (const website of websites) {
    const domainConfig = WEBSITE_DOMAINS[website.domain as keyof typeof WEBSITE_DOMAINS]

    if (!domainConfig) {
      console.log(`⚠️  跳过网站 "${website.name}" (${website.domain}) - 未配置生产域名`)
      continue
    }

    console.log(`\n🌐 更新网站: ${website.name}`)
    console.log(`   旧域名: ${website.domain}`)
    console.log(`   新主域名: ${domainConfig.primaryDomain}`)

    // 2. 更新主域名
    await prisma.website.update({
      where: { id: website.id },
      data: {
        domain: domainConfig.primaryDomain,
      },
    })

    console.log(`   ✓ 主域名已更新`)

    // 3. 添加域名别名
    if (domainConfig.aliases.length > 0) {
      console.log(`   添加 ${domainConfig.aliases.length} 个别名域名:`)

      for (const aliasDomain of domainConfig.aliases) {
        // 检查别名是否已存在
        const existing = await prisma.domainAlias.findFirst({
          where: {
            domain: aliasDomain,
          },
        })

        if (existing) {
          console.log(`      - ${aliasDomain} (已存在，跳过)`)
          continue
        }

        // 创建别名
        await prisma.domainAlias.create({
          data: {
            domain: aliasDomain,
            websiteId: website.id,
            isPrimary: false,
          },
        })

        console.log(`      ✓ ${aliasDomain}`)
      }
    }

    // 4. 为主域名也创建一个 DomainAlias 记录（标记为主要）
    const primaryAlias = await prisma.domainAlias.findFirst({
      where: {
        domain: domainConfig.primaryDomain,
        websiteId: website.id,
      },
    })

    if (!primaryAlias) {
      await prisma.domainAlias.create({
        data: {
          domain: domainConfig.primaryDomain,
          websiteId: website.id,
          isPrimary: true,
        },
      })
      console.log(`   ✓ 主域名别名已创建`)
    }
  }

  // 5. 显示最终配置
  console.log('\n\n📋 最终域名配置：\n')

  const updatedWebsites = await prisma.website.findMany({
    include: {
      domainAliases: {
        orderBy: {
          isPrimary: 'desc',
        },
      },
    },
  })

  for (const website of updatedWebsites) {
    console.log(`🌐 ${website.name}`)
    console.log(`   主域名: ${website.domain}`)

    if (website.domainAliases.length > 0) {
      console.log(`   所有域名 (${website.domainAliases.length} 个):`)
      website.domainAliases.forEach((alias) => {
        const marker = alias.isPrimary ? '★' : ' '
        console.log(`     ${marker} ${alias.domain}`)
      })
    }
    console.log('')
  }

  console.log('✨ 域名更新完成！')
  console.log('\n💡 下一步：')
  console.log('1. 在 Baota 面板中配置这些域名的反向代理')
  console.log('2. 确保 DNS 解析指向您的服务器 IP')
  console.log('3. 运行 SEO 数据更新脚本时，将使用真实域名检查排名\n')
}

main()
  .catch((error) => {
    console.error('❌ 发生错误:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
