import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@repo/database'

// GET /api/websites/[id]/domains - 获取网站的所有域名别名
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const domains = await prisma.domainAlias.findMany({
      where: { websiteId: params.id },
      orderBy: [
        { isPrimary: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json(domains)
  } catch (error) {
    console.error('Failed to fetch domains:', error)
    return NextResponse.json(
      { error: 'Failed to fetch domains' },
      { status: 500 }
    )
  }
}

// POST /api/websites/[id]/domains - 添加新的域名别名
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // 检查域名是否已存在
    const existing = await prisma.domainAlias.findUnique({
      where: { domain: body.domain },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Domain already exists' },
        { status: 400 }
      )
    }

    const domain = await prisma.domainAlias.create({
      data: {
        domain: body.domain,
        siteName: body.siteName,
        siteDescription: body.siteDescription,
        primaryTags: body.primaryTags || [],
        secondaryTags: body.secondaryTags || [],
        status: body.status || 'ACTIVE',
        isPrimary: body.isPrimary || false,
        websiteId: params.id,
      },
    })

    return NextResponse.json(domain, { status: 201 })
  } catch (error) {
    console.error('Failed to create domain:', error)
    return NextResponse.json(
      { error: 'Failed to create domain' },
      { status: 500 }
    )
  }
}
