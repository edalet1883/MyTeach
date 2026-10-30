import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/admin'

export const dynamic = 'force-dynamic'

// İstifadəçi idarəetməsi — GET: siyahı, POST: block/unblock/delete
export async function GET() {
  const { forbidden } = await requireAdmin()
  if (forbidden) return forbidden

  try {
    const users = await db.user.findMany({
      include: {
        teacherProfile: {
          include: { subject: true, city: true },
        },
        _count: { select: { reviews: true, favorites: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    const mapped = users.map((u) => ({
      id: u.id,
      name: u.name,
      surname: u.surname,
      email: u.email,
      phone: u.phone,
      role: u.role,
      emailVerified: u.emailVerified,
      blocked: u.blocked,
      createdAt: u.createdAt,
      teacherStatus: u.teacherProfile?.status ?? null,
      teacherProfileId: u.teacherProfile?.id ?? null,
      isVip: u.teacherProfile?.isVip ?? false,
      vipRequested: u.teacherProfile?.vipRequested ?? false,
      subject: u.teacherProfile?.subject ?? null,
      city: u.teacherProfile?.city ?? null,
      reviewCount: u._count.reviews,
    }))

    return NextResponse.json({ users: mapped })
  } catch (e) {
    console.error('admin users error', e)
    return NextResponse.json({ error: 'Server xətası' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const { forbidden } = await requireAdmin()
  if (forbidden) return forbidden

  try {
    const { userId, action } = await req.json() // action: block | unblock | delete
    if (!userId || !['block', 'unblock', 'delete'].includes(action)) {
      return NextResponse.json({ error: 'Yanlış sorğu' }, { status: 400 })
    }

    const user = await db.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ error: 'İstifadəçi tapılmadı' }, { status: 404 })
    }
    if (user.role === 'ADMIN') {
      return NextResponse.json({ error: 'Admin hesabı dəyişdirilə bilməz' }, { status: 403 })
    }

    if (action === 'delete') {
      await db.user.delete({ where: { id: userId } })
    } else {
      await db.user.update({ where: { id: userId }, data: { blocked: action === 'block' } })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('admin user action error', e)
    return NextResponse.json({ error: 'Server xətası' }, { status: 500 })
  }
}
