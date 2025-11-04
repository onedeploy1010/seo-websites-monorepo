import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@repo/database'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const websites = await prisma.website.findMany({
      include: {
        _count: {
          select: {
            posts: true,
            keywords: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(websites)
  } catch (error) {
    console.error('Failed to fetch websites:', error)
    return NextResponse.json(
      { error: 'Failed to fetch websites' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, domain, description, seoTitle, seoDescription, seoKeywords } = body

    if (!name || !domain) {
      return NextResponse.json(
        { error: 'Name and domain are required' },
        { status: 400 }
      )
    }

    const website = await prisma.website.create({
      data: {
        name,
        domain,
        description,
        seoTitle,
        seoDescription,
        seoKeywords: seoKeywords || [],
      },
    })

    return NextResponse.json(website, { status: 201 })
  } catch (error: any) {
    console.error('Failed to create website:', error)

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A website with this domain already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create website' },
      { status: 500 }
    )
  }
}
