import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

// Gmail təsdiqi — token ilə
export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get('token')
    if (!token) {
      return NextResponse.json({ ok: false, error: 'Token yoxdur' }, { status: 400 })
    }

    const user = await db.user.findFirst({ where: { verifyToken: token } })
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Link etibarsızdır və ya istifadə olunub' }, { status: 400 })
    }

    const updated = await db.user.update({
      where: { id: user.id },
      data: { emailVerified: true, verifyToken: null },
      include: { teacherProfile: true },
    })

    // Müəllimdirsə və status PENDING-dirsə — admin təsdiqinə keçir
    if (updated.role === 'TEACHER' && updated.teacherProfile?.status === 'PENDING') {
      await db.teacherProfile.update({
        where: { userId: updated.id },
        data: { status: 'WAITING_ADMIN' },
      })
    }

    return NextResponse.json({
      ok: true,
      role: updated.role,
      name: updated.name,
      message: 'E-poçt təsdiqləndi',
    })
  } catch (e) {
    console.error('verify error', e)
    return NextResponse.json({ ok: false, error: 'Server xətası' }, { status: 500 })
  }
}
