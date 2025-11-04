import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const adminEmail = 'admin@example.com'
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  })

  let admin
  if (!existingAdmin) {
    const hashedPassword = await hash('admin123', 10)
    admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin User',
        role: 'ADMIN',
      },
    })
    console.log('✅ Created admin user:', adminEmail)
    console.log('   Password: admin123')
  } else {
    admin = existingAdmin
    console.log('ℹ️  Admin user already exists:', adminEmail)
  }

  // Create demo websites
  const website1 = await prisma.website.upsert({
    where: { domain: 'localhost:3001' },
    update: {},
    create: {
      name: 'Demo Website 1',
      domain: 'localhost:3001',
      description: 'First demo website for testing',
      status: 'ACTIVE',
      seoTitle: 'Demo Website 1 - SEO Management Platform',
      seoDescription:
        'A demonstration website showcasing the SEO management platform capabilities',
      seoKeywords: ['seo', 'demo', 'website', 'nextjs'],
    },
  })
  console.log('✅ Created/Updated website:', website1.name)

  const website2 = await prisma.website.upsert({
    where: { domain: 'localhost:3002' },
    update: {},
    create: {
      name: 'Demo Website 2',
      domain: 'localhost:3002',
      description: 'Second demo website for testing',
      status: 'ACTIVE',
      seoTitle: 'Demo Website 2 - Content Syndication',
      seoDescription:
        'Second demonstration website for content syndication testing',
      seoKeywords: ['content', 'syndication', 'blog', 'nextjs'],
    },
  })
  console.log('✅ Created/Updated website:', website2.name)

  const websiteTG = await prisma.website.upsert({
    where: { domain: 'localhost:3003' },
    update: {},
    create: {
      name: 'TG中文纸飞机',
      domain: 'localhost:3003',
      description: 'Telegram中文官网 - 即时通讯，高效安全',
      status: 'ACTIVE',
      seoTitle: 'Telegram中文官网 - TG中文版下载 | 纸飞机中文版',
      seoDescription:
        'Telegram中文官网提供TG中文版、纸飞机中文版下载。支持iOS、Android、Windows、Mac全平台，安全加密的即时通讯工具。',
      seoKeywords: ['telegram', 'tg', '纸飞机', 'telegram中文', '电报', 'telegram下载'],
    },
  })
  console.log('✅ Created/Updated website:', websiteTG.name)

  // Create demo blog posts
  const post1 = await prisma.post.upsert({
    where: {
      websiteId_slug: {
        websiteId: website1.id,
        slug: 'welcome-to-our-platform',
      },
    },
    update: {},
    create: {
      title: 'Welcome to Our SEO Management Platform',
      slug: 'welcome-to-our-platform',
      content: `Welcome to our comprehensive SEO management platform! This is your one-stop solution for managing multiple websites, optimizing content, and tracking search engine performance.

Our platform offers powerful features including:
- Multi-website management
- Blog post synchronization across sites
- Keyword ranking tracking
- Spider pool monitoring
- Automated sitemap generation and submission

Whether you're managing a single blog or a network of websites, our platform provides all the tools you need to succeed in SEO.

Get started today and take your SEO efforts to the next level!`,
      metaTitle: 'Welcome to Our SEO Management Platform',
      metaDescription:
        'Discover how our SEO management platform can help you manage multiple websites, optimize content, and track performance.',
      metaKeywords: ['seo', 'platform', 'management', 'optimization'],
      status: 'PUBLISHED',
      websiteId: website1.id,
      authorId: admin.id,
    },
  })
  console.log('✅ Created/Updated post:', post1.title)

  const post2 = await prisma.post.upsert({
    where: {
      websiteId_slug: {
        websiteId: website1.id,
        slug: 'seo-best-practices-2025',
      },
    },
    update: {},
    create: {
      title: 'SEO Best Practices for 2025',
      slug: 'seo-best-practices-2025',
      content: `Search engine optimization continues to evolve, and staying up-to-date with best practices is crucial for success. Here are the top SEO strategies for 2025:

1. Quality Content First
Create valuable, original content that serves your audience's needs. Search engines prioritize content that provides real value.

2. Mobile-First Approach
Ensure your website is fully responsive and provides an excellent mobile experience.

3. Page Speed Optimization
Fast-loading pages improve user experience and search rankings.

4. Structured Data
Implement schema markup to help search engines understand your content better.

5. E-A-T Signals
Demonstrate expertise, authoritativeness, and trustworthiness in your content.

6. User Experience (UX)
Focus on creating intuitive navigation and engaging user experiences.

Follow these practices to improve your search rankings and drive more organic traffic!`,
      metaTitle: 'SEO Best Practices for 2025 - Complete Guide',
      metaDescription:
        'Learn the latest SEO best practices for 2025 including content strategy, mobile optimization, and user experience improvements.',
      metaKeywords: ['seo', 'best practices', '2025', 'optimization', 'ranking'],
      status: 'PUBLISHED',
      websiteId: website1.id,
      authorId: admin.id,
    },
  })
  console.log('✅ Created/Updated post:', post2.title)

  const post3 = await prisma.post.upsert({
    where: {
      websiteId_slug: {
        websiteId: website1.id,
        slug: 'content-syndication-guide',
      },
    },
    update: {},
    create: {
      title: 'The Complete Guide to Content Syndication',
      slug: 'content-syndication-guide',
      content: `Content syndication is a powerful strategy for expanding your reach and driving more traffic to your websites. Here's everything you need to know:

What is Content Syndication?
Content syndication involves republishing your content on third-party websites to reach a broader audience.

Benefits of Content Syndication:
- Increased brand visibility
- More backlinks to your site
- Greater audience reach
- Enhanced thought leadership

Best Practices:
1. Choose reputable syndication partners
2. Use canonical tags to avoid duplicate content issues
3. Track performance metrics
4. Maintain consistent branding

Our platform makes content syndication easy by allowing you to manage and sync posts across multiple websites from a single dashboard.

Start syndicating your content today and watch your reach grow!`,
      metaTitle: 'Content Syndication Guide - How to Expand Your Reach',
      metaDescription:
        'Learn how to effectively syndicate your content across multiple platforms to increase visibility and drive more traffic.',
      metaKeywords: [
        'content syndication',
        'content marketing',
        'distribution',
        'reach',
      ],
      status: 'PUBLISHED',
      websiteId: website1.id,
      authorId: admin.id,
      syncedWebsites: [website1.id, website2.id],
    },
  })
  console.log('✅ Created/Updated post:', post3.title)

  // Create posts for TG website
  const postTG1 = await prisma.post.upsert({
    where: {
      websiteId_slug: {
        websiteId: websiteTG.id,
        slug: 'what-is-telegram',
      },
    },
    update: {},
    create: {
      title: '什么是 Telegram（电报）中文版？',
      slug: 'what-is-telegram',
      content: `Telegram中文版是指支持中文界面和功能的Telegram应用版本，允许用户使用中文进行操作和沟通。

## Telegram简介

Telegram是一款全球领先的即时通讯应用，以其强大的功能、极致的安全性和卓越的用户体验而闻名。

### 核心特点

**1. 安全加密**
- 采用MTProto加密协议
- 支持端到端加密的秘密聊天
- 消息可设置自毁功能

**2. 云端同步**
- 消息存储在云端
- 支持多设备同时登录
- 跨平台无缝切换

**3. 功能强大**
- 支持最大2GB的文件传输
- 群组成员可达20万人
- 频道支持无限订阅者`,
      metaTitle: '什么是 Telegram 中文版 - TG 中文纸飞机官网',
      metaDescription:
        'Telegram中文版完整介绍，了解TG的核心功能、安全特性和使用优势。',
      metaKeywords: ['telegram', 'telegram中文', 'tg', '什么是telegram'],
      status: 'PUBLISHED',
      websiteId: websiteTG.id,
      authorId: admin.id,
    },
  })
  console.log('✅ Created/Updated TG post:', postTG1.title)

  const postTG2 = await prisma.post.upsert({
    where: {
      websiteId_slug: {
        websiteId: websiteTG.id,
        slug: 'telegram-download-guide',
      },
    },
    update: {},
    create: {
      title: 'Telegram 下载安装完整指南',
      slug: 'telegram-download-guide',
      content: `本指南将帮助您在各种设备上下载和安装 Telegram。

## Windows 电脑版下载

1. 访问官方网站
2. 点击"下载 Windows 版"
3. 运行安装程序
4. 完成安装向导

## Android 手机下载

1. 打开 Google Play 商店
2. 搜索"Telegram"
3. 点击安装
4. 等待下载完成

## iOS iPhone/iPad 下载

1. 打开 App Store
2. 搜索"Telegram"
3. 点击获取
4. 输入 Apple ID 密码确认`,
      metaTitle: 'Telegram 下载 - TG 中文版全平台下载指南',
      metaDescription:
        'Telegram 官方下载指南，支持 Windows、Mac、iOS、Android 全平台。',
      metaKeywords: ['telegram下载', 'tg下载', 'telegram安装', '纸飞机下载'],
      status: 'PUBLISHED',
      websiteId: websiteTG.id,
      authorId: admin.id,
    },
  })
  console.log('✅ Created/Updated TG post:', postTG2.title)

  const postTG3 = await prisma.post.upsert({
    where: {
      websiteId_slug: {
        websiteId: websiteTG.id,
        slug: 'telegram-features',
      },
    },
    update: {},
    create: {
      title: 'Telegram 核心功能详解',
      slug: 'telegram-features',
      content: `深入了解 Telegram 的强大功能。

## 1. 秘密聊天
端到端加密，确保绝对隐私

## 2. 群组功能
支持多达 20 万成员的超大群组

## 3. 频道广播
创建无限订阅者的公开频道

## 4. 文件传输
支持任何格式，最大 2GB

## 5. 机器人
强大的自动化工具生态

## 6. 贴纸和GIF
丰富的表情包和动图`,
      metaTitle: 'Telegram 功能 - TG 强大功能完整介绍',
      metaDescription:
        'Telegram 核心功能详解：秘密聊天、群组、频道、文件传输、机器人等。',
      metaKeywords: ['telegram功能', 'tg功能', 'telegram特点', '电报功能'],
      status: 'PUBLISHED',
      websiteId: websiteTG.id,
      authorId: admin.id,
      syncedWebsites: [websiteTG.id],
    },
  })
  console.log('✅ Created/Updated TG post:', postTG3.title)

  // Create keywords for tracking
  const keyword1 = await prisma.keyword.upsert({
    where: {
      websiteId_keyword: {
        websiteId: website1.id,
        keyword: 'seo management platform',
      },
    },
    update: {},
    create: {
      keyword: 'seo management platform',
      volume: 1200,
      difficulty: 65,
      cpc: 2.5,
      websiteId: website1.id,
    },
  })
  console.log('✅ Created/Updated keyword:', keyword1.keyword)

  const keyword2 = await prisma.keyword.upsert({
    where: {
      websiteId_keyword: {
        websiteId: website1.id,
        keyword: 'content syndication',
      },
    },
    update: {},
    create: {
      keyword: 'content syndication',
      volume: 800,
      difficulty: 45,
      cpc: 1.8,
      websiteId: website1.id,
    },
  })
  console.log('✅ Created/Updated keyword:', keyword2.keyword)

  // TG website keywords
  const keywordTG1 = await prisma.keyword.upsert({
    where: {
      websiteId_keyword: {
        websiteId: websiteTG.id,
        keyword: 'telegram中文',
      },
    },
    update: {},
    create: {
      keyword: 'telegram中文',
      volume: 5000,
      difficulty: 58,
      cpc: 0.8,
      websiteId: websiteTG.id,
    },
  })
  console.log('✅ Created/Updated TG keyword:', keywordTG1.keyword)

  const keywordTG2 = await prisma.keyword.upsert({
    where: {
      websiteId_keyword: {
        websiteId: websiteTG.id,
        keyword: 'telegram下载',
      },
    },
    update: {},
    create: {
      keyword: 'telegram下载',
      volume: 8000,
      difficulty: 62,
      cpc: 1.2,
      websiteId: websiteTG.id,
    },
  })
  console.log('✅ Created/Updated TG keyword:', keywordTG2.keyword)

  // Create sitemap entries
  const existingSitemap1 = await prisma.sitemap.findFirst({
    where: { websiteId: website1.id },
  })
  if (!existingSitemap1) {
    await prisma.sitemap.create({
      data: {
        url: 'http://localhost:3001/sitemap.xml',
        websiteId: website1.id,
        type: 'POSTS',
        urls: 0,
        submitted: false,
      },
    })
    console.log('✅ Created sitemap for:', website1.name)
  }

  const existingSitemap2 = await prisma.sitemap.findFirst({
    where: { websiteId: website2.id },
  })
  if (!existingSitemap2) {
    await prisma.sitemap.create({
      data: {
        url: 'http://localhost:3002/sitemap.xml',
        websiteId: website2.id,
        type: 'POSTS',
        urls: 0,
        submitted: false,
      },
    })
    console.log('✅ Created sitemap for:', website2.name)
  }

  const existingSitemapTG = await prisma.sitemap.findFirst({
    where: { websiteId: websiteTG.id },
  })
  if (!existingSitemapTG) {
    await prisma.sitemap.create({
      data: {
        url: 'http://localhost:3003/sitemap.xml',
        websiteId: websiteTG.id,
        type: 'POSTS',
        urls: 0,
        submitted: false,
      },
    })
    console.log('✅ Created sitemap for:', websiteTG.name)
  }

  // Create some spider logs for demo
  const spiderBots = ['googlebot', 'bingbot', 'baiduspider', 'yandexbot']
  const websites = [website1.id, website2.id, websiteTG.id]
  for (let i = 0; i < 15; i++) {
    const bot = spiderBots[Math.floor(Math.random() * spiderBots.length)]
    const websiteId = websites[Math.floor(Math.random() * websites.length)]
    await prisma.spiderLog.create({
      data: {
        ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: `Mozilla/5.0 (compatible; ${bot}/2.1)`,
        url: '/',
        bot,
        statusCode: 200,
        websiteId,
        createdAt: new Date(Date.now() - Math.random() * 86400000), // Random time in last 24h
      },
    })
  }
  console.log('✅ Created demo spider logs')

  console.log('\n🎉 Database seeded successfully!')
  console.log('\n📝 Login credentials:')
  console.log('   Email: admin@example.com')
  console.log('   Password: admin123')
  console.log('\n🌐 Demo websites:')
  console.log('   - http://localhost:3001 (Demo Website 1)')
  console.log('   - http://localhost:3002 (Demo Website 2)')
  console.log('\n🔧 Admin panel:')
  console.log('   - http://localhost:3100')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
