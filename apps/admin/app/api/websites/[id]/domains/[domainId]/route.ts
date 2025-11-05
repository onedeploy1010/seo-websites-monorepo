import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@repo/database'

// PATCH /api/websites/[id]/domains/[domainId] - 更新域名别名
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; domainId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const domain = await prisma.domainAlias.update({
      where: { id: params.domainId },
      data: {
        domain: body.domain,
        siteName: body.siteName,
        siteDescription: body.siteDescription,
        primaryTags: body.primaryTags,
        secondaryTags: body.secondaryTags,
        status: body.status,
        isPrimary: body.isPrimary,
      },
    })

    return NextResponse.json(domain)
  } catch (error) {
    console.error('Failed to update domain:', error)
    return NextResponse.json(
      { error: 'Failed to update domain' },
      { status: 500 }
    )
  }
}

// DELETE /api/websites/[id]/domains/[domainId] - 删除域名别名
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; domainId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.domainAlias.delete({
      where: { id: params.domainId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete domain:', error)
    return NextResponse.json(
      { error: 'Failed to delete domain' },
      { status: 500 }
    )
  }
}
