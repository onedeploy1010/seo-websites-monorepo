import { prisma } from '@repo/database'
import { generateSitemap } from '@repo/seo-tools'

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'

  const website = await prisma.website.findFirst({
    where: {
      domain: {
        contains: siteUrl.replace('http://', '').replace('https://', ''),
      },
    },
  })

  if (!website) {
    return new Response('Website not found', { status: 404 })
  }

  const posts = await prisma.post.findMany({
    where: {
      websiteId: website.id,
      status: 'PUBLISHED',
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  const urls = [
    {
      url: '/',
      changefreq: 'daily' as const,
      priority: 1.0,
    },
    {
      url: '/blog',
      changefreq: 'daily' as const,
      priority: 0.9,
    },
    ...posts.map((post) => ({
      url: `/blog/${post.slug}`,
      changefreq: 'weekly' as const,
      priority: 0.8,
      lastmod: post.updatedAt.toISOString(),
    })),
  ]

  const sitemap = await generateSitemap(siteUrl, urls)

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
