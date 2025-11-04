import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@repo/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const website = await prisma.website.findUnique({
      where: { id: params.id },
      include: {
        posts: {
          select: {
            id: true,
            title: true,
            status: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        keywords: {
          select: {
            id: true,
            keyword: true,
            volume: true,
            difficulty: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (!website) {
      return NextResponse.json({ error: 'Website not found' }, { status: 404 })
    }

    return NextResponse.json(website)
  } catch (error) {
    console.error('Failed to fetch website:', error)
    return NextResponse.json(
      { error: 'Failed to fetch website' },
      { status: 500 }
    )
  }
}
