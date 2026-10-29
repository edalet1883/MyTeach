import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

const ALLOWED_REASONS = ['FAKE', 'PRICE', 'OFFENSIVE', 'OTHER']

// Şikayət göndər — qonaq da yaza bilər
export async function POST(req: NextRequest) {
  try {
    const { teacherId, reason, comment } = await req.json()

    if (!teacherId || !reason || !ALLOWED_REASONS.includes(reason)) {
      return NextResponse.json({ error: 'Səbəb seçilməlidir' }, { status: 400 })
    }

    const teacher = await db.teacherProfile.findUnique({ where: { id: teacherId } })
    if (!teacher || teacher.status !== 'APPROVED') {
      return NextResponse.json({ error: 'Müəllim tapılmadı' }, { status: 404 })
    }

    await db.report.create({
      data: {
        teacherId,
        reason,
        comment: typeof comment === 'string' ? comment.trim().slice(0, 1000) || null : null,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('report create error', e)
    return NextResponse.json({ error: 'Server xətası' }, { status: 500 })
  }
}
