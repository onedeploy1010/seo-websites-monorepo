import { prisma } from '@repo/database'
import Link from 'next/link'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import Features from '@/components/Features'
import Footer from '@/components/Footer'
import { headers } from 'next/headers'
import { getDomainConfigFromList, calculateTagMatchScoreFromDB } from '@repo/shared'

// Force dynamic rendering to avoid build-time database queries
export const dynamic = 'force-dynamic'

async function getRecentPosts() {
  try {
    // 获取当前域名
    const headersList = headers()
    const hostname = headersList.get('host') || 'localhost:3002'

    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Telegram中文官网'

    const website = await prisma.website.findFirst({
      where: {
        OR: [
          { name: { contains: siteName } },
          { domain: { contains: 'localhost:3002' } }
        ]
      },
      include: {
        domainAliases: {
          where: {
            status: 'ACTIVE'
          }
        }
      }
    })

    if (!website) return []

    // 获取当前域名的配置
    const domainConfig = getDomainConfigFromList(hostname, website.domainAliases)

    const allPosts = await prisma.post.findMany({
      where: {
        websiteId: website.id,
        status: 'PUBLISHED',
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // 如果有域名配置，根据标签过滤和排序
    if (domainConfig) {
      const currentDomain = website.domainAliases.find(d => d.domain === domainConfig.domain)
      if (currentDomain) {
        // 计算每篇文章的匹配分数
        const postsWithScores = allPosts.map(post => ({
          post,
          score: calculateTagMatchScoreFromDB(post.metaKeywords, currentDomain),
        }))

        // 按分数降序排序
        postsWithScores.sort((a, b) => b.score - a.score)

        // 返回前6篇
        return postsWithScores.map(item => item.post).slice(0, 6)
      }
    }

    // 如果没有域名配置，返回最新的6篇
    return allPosts.slice(0, 6)
  } catch (error) {
    console.error('Database error:', error)
    return []
  }
}

export default async function Home() {
  const posts = await getRecentPosts()
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />

      {/* Features Section - 为什么选择Telegram */}
      <Features />

      {/* Latest News Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800">Telegram最新消息</h2>
          </div>

          {/* Blog Preview Cards */}
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.id}`}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
                >
                  <div className="h-40 overflow-hidden bg-gray-100">
                    {/* Placeholder for blog images */}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold mb-2 text-gray-800 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {post.metaDescription || post.content.substring(0, 100)}
                    </p>
                    <span className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg max-w-7xl mx-auto">
              <p className="text-gray-500 text-lg">暂无博客文章</p>
            </div>
          )}
        </div>
      </section>

      <Services />
      <Footer />
    </main>
  )
}
