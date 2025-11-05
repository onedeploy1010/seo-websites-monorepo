import { prisma } from '@repo/database'
import Link from 'next/link'
import { format } from 'date-fns'

// Force dynamic rendering to avoid build-time database queries
export const dynamic = 'force-dynamic'

async function getAllPosts() {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ''

    const website = await prisma.website.findFirst({
      where: {
        domain: {
          contains: siteUrl.replace('http://', '').replace('https://', ''),
        },
      },
    })

    if (!website) return []

    const posts = await prisma.post.findMany({
      where: {
        websiteId: website.id,
        status: 'PUBLISHED',
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return posts
  } catch (error) {
    console.error('Database error:', error)
    return []
  }
}

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Blog</h1>

      {posts.length > 0 ? (
        <div className="space-y-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                <Link href={`/blog/${post.slug}`} className="hover:text-blue-600">
                  {post.title}
                </Link>
              </h2>
              <div className="text-sm text-gray-500 mb-4">
                {format(new Date(post.createdAt), 'MMMM d, yyyy')}
              </div>
              <p className="text-gray-700 mb-4">
                {post.metaDescription || post.content.substring(0, 200)}...
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="inline-block text-blue-600 hover:text-blue-700 font-medium"
              >
                Read Full Article →
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500 text-lg">No blog posts available yet.</p>
        </div>
      )}
    </div>
  )
}
