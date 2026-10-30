import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// Müəllim VIP müraciəti — anketi VIP etmək üçün adminə göndərilir
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'TEACHER' || !user.teacherProfile) {
      return NextResponse.json({ error: 'Yalnız müəllimlər müraciət edə bilər' }, { status: 403 })
    }

    const { plan } = await req.json().catch(() => ({ plan: undefined }))
    const validPlan = ['MONTH', 'QUARTER', 'YEAR'].includes(plan) ? plan : 'MONTH'

    if (user.teacherProfile.isVip) {
      return NextResponse.json({ error: 'Anket artıq VIP-dir' }, { status: 400 })
    }

    await db.teacherProfile.update({
      where: { id: user.teacherProfile.id },
      data: { vipRequested: true, vipPlan: validPlan },
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('vip request error', e)
    return NextResponse.json({ error: 'Server xətası' }, { status: 500 })
  }
}
