import type { Metadata } from 'next'
import { prisma } from '@repo/database'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

interface BlogPostData {
  id: string
  title: string
  content: string
  date: string
  category: string
  author: string
  readTime: string
}

async function getPost(id: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
    })
    return post
  } catch {
    return null
  }
}

async function getRelatedPosts(currentId: string) {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'TG中文纸飞机'

  const website = await prisma.website.findFirst({
    where: {
      OR: [
        { name: { contains: siteName } },
        { domain: { contains: 'localhost:3003' } }
      ]
    },
  })

  if (!website) return []

  const posts = await prisma.post.findMany({
    where: {
      websiteId: website.id,
      status: 'PUBLISHED',
      id: { not: currentId },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 3,
  })

  return posts
}

// 博客文章数据（作为fallback）
const blogPosts: { [key: string]: BlogPostData } = {
  '1': {
    id: '1',
    title: '什么是 电报（Telegram） 中文版？',
    content: `# 什么是 电报（Telegram） 中文版？

Telegram中文版是指支持中文界面和功能的Telegram应用版本，允许用户使用中文进行操作和沟通。

## Telegram简介

Telegram是一款全球领先的即时通讯应用，以其强大的功能、极致的安全性和卓越的用户体验而闻名。Telegram由俄罗斯企业家Pavel Durov和Nikolai Durov兄弟在2013年创立，目前在全球拥有超过7亿活跃用户。

### 核心特点

**1. 安全加密**
- 采用MTProto加密协议
- 支持端到端加密的秘密聊天
- 消息可设置自毁功能
- 从不向第三方提供用户数据

**2. 云端同步**
- 消息存储在云端
- 支持多设备同时登录
- 跨平台无缝切换
- 随时随地访问历史消息

**3. 功能强大**
- 支持最大2GB的文件传输
- 群组成员可达20万人
- 频道支持无限订阅者
- 丰富的Bot机器人生态

## 中文版特色

Telegram中文版在保留所有原版功能的基础上，特别针对中文用户进行了优化：

- 完整的中文界面
- 中文输入法优化
- 本地化的使用习惯
- 中文客服支持

## 如何获取中文版

1. 访问Telegram官方网站
2. 选择适合您设备的版本
3. 下载并安装应用
4. 在设置中选择中文语言

## 总结

Telegram中文版为中文用户提供了一个安全、高效、功能强大的即时通讯平台，无论是个人聊天还是团队协作，都能满足您的需求。`,
    date: '2025-08-07',
    category: '教程',
    author: 'Telegram Team',
    readTime: '5分钟'
  },
  '2': {
    id: '2',
    title: '电报（Telegram）怎么设置免打扰？',
    content: `# 电报（Telegram）怎么设置免打扰？

在Telegram中设置免打扰可以帮助您在需要专注或休息时避免消息通知的打扰。

## 设置单个聊天的免打扰

### 步骤1：打开聊天
1. 打开Telegram应用
2. 进入要设置免打扰的聊天或群组

### 步骤2：进入设置
1. 点击聊天窗口顶部的名称
2. 向下滑动找到"通知"选项

### 步骤3：配置免打扰
1. 点击"静音通知"
2. 选择时长：1小时、8小时、2天或永久
3. 确认设置

## 全局免打扰设置

如果您想要设置所有聊天的免打扰模式：

1. 打开Telegram设置
2. 选择"通知和声音"
3. 调整全局通知设置
4. 可以分别设置私聊、群组和频道的通知

## 使用技巧

- 重要联系人可以设置为例外
- 使用关键词提醒功能
- 合理利用免打扰时段

## 总结

通过合理设置免打扰功能，您可以更好地管理Telegram的通知，在需要专注时不被打扰，同时不会错过重要消息。`,
    date: '2025-08-06',
    category: '技巧',
    author: 'Telegram Team',
    readTime: '3分钟'
  },
  '3': {
    id: '3',
    title: 'Telegram移动端如何开启画中画模式？',
    content: `# Telegram移动端如何开启画中画模式？

画中画（Picture-in-Picture，PiP）模式允许您在使用其他应用时继续观看Telegram中的视频。

## Android设备设置

### 方法1：播放时启用
1. 在Telegram中播放视频
2. 点击画中画图标（通常在视频播放器右上角）
3. 视频将缩小为浮动窗口

### 方法2：系统设置
1. 打开手机设置
2. 进入应用管理
3. 找到Telegram
4. 启用"画中画"权限

## iOS设备设置

在iOS设备上使用画中画功能：

1. 确保iOS版本支持（iOS 14及以上）
2. 在Telegram中播放视频
3. 按Home键或上滑
4. 视频自动进入画中画模式

## 使用技巧

- 可以调整浮动窗口大小和位置
- 双击窗口可以暂停/播放
- 点击关闭按钮退出画中画模式

## 注意事项

- 某些视频可能不支持画中画
- 确保设备系统版本符合要求
- 部分定制Android系统可能有所不同

## 总结

画中画模式让您可以在处理其他事务的同时继续观看视频，大大提高了多任务处理的效率。`,
    date: '2025-08-05',
    category: '功能',
    author: 'Telegram Team',
    readTime: '4分钟'
  }
}

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const dbPost = await getPost(params.id)
  const post = dbPost
    ? {
        title: dbPost.title,
        content: dbPost.content,
      }
    : blogPosts[params.id] || blogPosts['1']

  return {
    title: `${post.title} - Telegram中文版博客`,
    description: post.content.substring(0, 160),
  }
}

export default async function BlogPost({ params }: { params: { id: string } }) {
  const dbPost = await getPost(params.id)
  const dbRelatedPosts = await getRelatedPosts(params.id)

  // 使用数据库文章或fallback到硬编码数据
  const post = dbPost
    ? {
        id: dbPost.id,
        title: dbPost.title,
        content: dbPost.content,
        date: new Date(dbPost.createdAt).toLocaleDateString('zh-CN'),
        category: '教程',
        author: 'Telegram Team',
        readTime: '5分钟',
      }
    : blogPosts[params.id] || blogPosts['1']

  // 相关文章
  const relatedPosts = dbRelatedPosts.length > 0
    ? dbRelatedPosts.map(p => ({
        id: p.id,
        title: p.title,
        content: p.content,
        date: new Date(p.createdAt).toLocaleDateString('zh-CN'),
        category: '教程',
        author: 'Telegram Team',
        readTime: '5分钟',
      }))
    : Object.values(blogPosts)
        .filter(p => p.id !== post.id)
        .slice(0, 3)

  return (
    <main className="min-h-screen">
      <Header />

      {/* 面包屑导航 */}
      <div className="pt-24 pb-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <nav className="text-sm text-gray-600">
            <Link href="/" className="hover:text-telegram-blue">首页</Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-telegram-blue">博客</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{post.title}</span>
          </nav>
        </div>
      </div>

      {/* 文章内容 */}
      <article className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* 文章头部 */}
            <header className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{post.readTime}</span>
                </div>
                <span className="px-3 py-1 bg-telegram-blue/10 text-telegram-blue rounded-full text-sm">
                  {post.category}
                </span>
              </div>
            </header>

            {/* 文章正文 */}
            <div className="prose prose-lg max-w-none mb-12">
              <div className="whitespace-pre-wrap leading-relaxed text-gray-700">
                {post.content}
              </div>
            </div>

            {/* 分享按钮 */}
            <div className="border-t border-b border-gray-200 py-6 mb-12">
              <p className="text-gray-600 mb-4">分享这篇文章：</p>
              <div className="flex gap-4">
                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                  Twitter
                </button>
                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                  Facebook
                </button>
                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                  复制链接
                </button>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-telegram-blue/10 p-8 rounded-2xl text-center">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                准备开始使用Telegram了吗？
              </h3>
              <p className="text-gray-600 mb-6">
                立即下载Telegram，体验安全、快速的即时通讯服务
              </p>
              <Link
                href="/download"
                className="inline-block bg-telegram-blue text-white px-8 py-3 rounded-full hover:bg-telegram-dark transition"
              >
                立即下载
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* 相关文章 */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-gray-900">相关文章</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.id}`}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
                >
                  <div className="p-6">
                    <span className="text-sm text-telegram-blue font-semibold">
                      {relatedPost.category}
                    </span>
                    <h3 className="text-xl font-bold mt-2 mb-3 text-gray-900">
                      {relatedPost.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {relatedPost.content.substring(0, 100)}...
                    </p>
                    <div className="flex items-center text-gray-500 text-sm">
                      <span>{relatedPost.date}</span>
                      <span className="mx-2">·</span>
                      <span>{relatedPost.readTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
