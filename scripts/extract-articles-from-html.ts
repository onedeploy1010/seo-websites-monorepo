#!/usr/bin/env node
/**
 * 从纸飞机3.html提取文章内容并保存到数据库
 */

import * as fs from 'fs'
import * as path from 'path'
import { PrismaClient } from '@prisma/client'
import { JSDOM } from 'jsdom'

const prisma = new PrismaClient()

interface Article {
  title: string
  excerpt: string
  category: string
  imageUrl?: string
  sourceUrl?: string
}

async function extractArticles(htmlPath: string): Promise<Article[]> {
  console.log('📖 读取HTML文件...')
  const htmlContent = fs.readFileSync(htmlPath, 'utf-8')

  console.log('🔍 解析HTML内容...')
  const dom = new JSDOM(htmlContent)
  const document = dom.window.document

  const articles: Article[] = []

  // 找到所有文章卡片（在 .wz-con 容器中的 a 标签）
  const articleLinks = document.querySelectorAll('.wz-con > a')

  console.log(`✅ 找到 ${articleLinks.length} 篇文章\n`)

  articleLinks.forEach((link, index) => {
    const titleEl = link.querySelector('.wz-con-tit')
    const excerptEl = link.querySelector('.wz-con-con')
    const categoryEl = link.querySelector('.wz-con-us')
    const imageEl = link.querySelector('img')
    const href = link.getAttribute('href')

    if (titleEl && excerptEl) {
      const title = titleEl.textContent?.trim() || ''
      const excerpt = excerptEl.textContent?.trim() || ''
      const category = categoryEl?.textContent?.trim() || 'Telegram'
      const imageUrl = imageEl?.getAttribute('src') || imageEl?.getAttribute('data-src')

      articles.push({
        title,
        excerpt,
        category,
        imageUrl: imageUrl || undefined,
        sourceUrl: href || undefined,
      })

      console.log(`${index + 1}. ${title}`)
    }
  })

  return articles
}

function analyzeKeywords(title: string, excerpt: string): string[] {
  const text = `${title} ${excerpt}`.toLowerCase()
  const keywords: Set<string> = new Set()

  // 常见的 Telegram 相关关键词
  const telegramKeywords = [
    'telegram', '电报', 'tg', '纸飞机', '飞机',
    '下载', '安装', '注册', '登录',
    '账号', '密码', '手机号', '验证码',
    'ios', 'android', '安卓', '苹果', 'iphone',
    '更新', '升级', '版本',
    '消息', '聊天', '群组', '频道',
    '设置', '隐私', '安全', '加密',
    '中文', '汉化', '语言'
  ]

  telegramKeywords.forEach(keyword => {
    if (text.includes(keyword)) {
      keywords.add(keyword)
    }
  })

  // 从标题中提取关键词（去除"telegram"、"怎么"、"如何"等常用词）
  const titleWords = title
    .replace(/telegram|怎么|如何|什么|吗|？|是|的|了|在/gi, '')
    .split(/\s+/)
    .filter(word => word.length > 1)

  titleWords.forEach(word => {
    if (word.length > 1) {
      keywords.add(word.toLowerCase())
    }
  })

  return Array.from(keywords).slice(0, 10) // 最多返回10个关键词
}

async function saveArticlesToDatabase(articles: Article[]) {
  console.log('\n💾 开始保存文章到数据库...\n')

  // 查找 website-2
  const website = await prisma.website.findFirst({
    where: {
      name: {
        contains: 'website-2'
      }
    }
  })

  if (!website) {
    console.error('❌ 未找到 website-2')
    return
  }

  console.log(`✅ 找到网站: ${website.name} (ID: ${website.id})\n`)

  let successCount = 0
  let skipCount = 0

  for (const article of articles) {
    try {
      // 检查文章是否已存在（通过标题）
      const existing = await prisma.article.findFirst({
        where: {
          title: article.title,
          websiteId: website.id
        }
      })

      if (existing) {
        console.log(`⏭️  跳过已存在的文章: ${article.title}`)
        skipCount++
        continue
      }

      // 分析关键词
      const keywords = analyzeKeywords(article.title, article.excerpt)

      // 生成 slug（URL友好的标识符）
      const slug = article.title
        .toLowerCase()
        .replace(/[？?]/g, '')
        .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 100)

      // 生成完整内容（从摘要扩展）
      const fullContent = `
<h1>${article.title}</h1>

<p>${article.excerpt}</p>

<h2>详细说明</h2>
<p>本文将详细介绍如何在Telegram中进行相关操作。</p>

<h2>操作步骤</h2>
<ol>
  <li>打开Telegram应用</li>
  <li>根据具体需求进行操作</li>
  <li>完成设置</li>
</ol>

<h2>注意事项</h2>
<p>在使用Telegram时，请注意保护个人隐私和账号安全。</p>

<h2>相关链接</h2>
<ul>
  <li><a href="/download">Telegram下载</a></li>
  <li><a href="/blog">更多教程</a></li>
</ul>
      `.trim()

      // 创建文章
      const newArticle = await prisma.article.create({
        data: {
          title: article.title,
          slug,
          content: fullContent,
          excerpt: article.excerpt,
          websiteId: website.id,
          categoryId: null, // 暂时不关联分类
          authorId: null, // 暂时不关联作者
          status: 'PUBLISHED',
          featured: false,
          viewCount: Math.floor(Math.random() * 500) + 100, // 随机浏览量

          // SEO 字段
          seoTitle: article.title,
          seoDescription: article.excerpt,
          seoKeywords: keywords.join(', '),

          // 时间戳
          publishedAt: new Date(),
        }
      })

      console.log(`✅ 已保存: ${article.title} (ID: ${newArticle.id})`)
      successCount++

    } catch (error) {
      console.error(`❌ 保存失败: ${article.title}`)
      console.error(error)
    }
  }

  console.log(`\n📊 保存完成：`)
  console.log(`   ✅ 成功: ${successCount} 篇`)
  console.log(`   ⏭️  跳过: ${skipCount} 篇`)
  console.log(`   📝 总计: ${articles.length} 篇`)
}

async function main() {
  console.log('🚀 开始提取文章...\n')

  const htmlPath = path.join(
    __dirname,
    '../apps/website-2/纸飞机3.html'
  )

  if (!fs.existsSync(htmlPath)) {
    console.error('❌ HTML文件不存在:', htmlPath)
    process.exit(1)
  }

  try {
    // 提取文章
    const articles = extractArticles(htmlPath)

    if (articles.length === 0) {
      console.log('⚠️  未找到文章')
      return
    }

    console.log('\n' + '='.repeat(50))
    console.log('📄 文章列表：')
    console.log('='.repeat(50))
    articles.forEach((article, index) => {
      console.log(`\n${index + 1}. ${article.title}`)
      console.log(`   摘要: ${article.excerpt.substring(0, 50)}...`)
      console.log(`   分类: ${article.category}`)
      if (article.sourceUrl) {
        console.log(`   来源: ${article.sourceUrl}`)
      }
    })
    console.log('\n' + '='.repeat(50))

    // 保存到数据库
    await saveArticlesToDatabase(articles)

    console.log('\n✨ 全部完成！')

  } catch (error) {
    console.error('❌ 处理失败:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
