import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/admin'

export const dynamic = 'force-dynamic'

// Müəllimi təsdiqlə / rədd et / VIP ver / VIP ləğv et
export async function POST(req: NextRequest) {
  const { forbidden } = await requireAdmin()
  if (forbidden) return forbidden

  try {
    const { teacherId, action } = await req.json() // action: approve | reject | grantVip | revokeVip
    if (!teacherId || !['approve', 'reject', 'grantVip', 'revokeVip'].includes(action)) {
      return NextResponse.json({ error: 'Yanlış sorğu' }, { status: 400 })
    }

    const teacher = await db.teacherProfile.findUnique({ where: { id: teacherId } })
    if (!teacher) {
      return NextResponse.json({ error: 'Müəllim tapılmadı' }, { status: 404 })
    }

    if (action === 'grantVip') {
      await db.teacherProfile.update({
        where: { id: teacherId },
        data: { isVip: true, vipRequested: false },
      })
      return NextResponse.json({ ok: true, isVip: true })
    }
    if (action === 'revokeVip') {
      await db.teacherProfile.update({
        where: { id: teacherId },
        data: { isVip: false, vipRequested: false },
      })
      return NextResponse.json({ ok: true, isVip: false })
    }

    const status = action === 'approve' ? 'APPROVED' : 'REJECTED'
    await db.teacherProfile.update({ where: { id: teacherId }, data: { status } })

    return NextResponse.json({ ok: true, status })
  } catch (e) {
    console.error('teacher-action error', e)
    return NextResponse.json({ error: 'Server xətası' }, { status: 500 })
  }
}
