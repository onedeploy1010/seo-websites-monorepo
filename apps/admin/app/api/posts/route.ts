import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@repo/database'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const websiteId = searchParams.get('websiteId')

    const posts = await prisma.post.findMany({
      where: websiteId ? { websiteId } : undefined,
      include: {
        website: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      slug,
      content,
      metaTitle,
      metaDescription,
      metaKeywords,
      websiteId,
      status,
    } = body

    if (!title || !slug || !content || !websiteId) {
      return NextResponse.json(
        { error: 'Title, slug, content, and website are required' },
        { status: 400 }
      )
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        metaTitle,
        metaDescription,
        metaKeywords: metaKeywords || [],
        websiteId,
        status: status || 'DRAFT',
        authorId: session.user.id,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error: any) {
    console.error('Failed to create post:', error)

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A post with this slug already exists for this website' },
        { status: 409 }
      )
    }

    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
