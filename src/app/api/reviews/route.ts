import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// Rəy yaz (yalnız qeydiyyatlı şagird)
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Rəy yazmaq üçün qeydiyyat lazımdır' }, { status: 401 })
    }
    if (user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Yalnız şagirdlər rəy yaza bilər' }, { status: 403 })
    }

    const { teacherId, rating, comment } = await req.json()
    if (!teacherId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Reytinq 1-5 arası olmalıdır' }, { status: 400 })
    }

    const teacher = await db.teacherProfile.findUnique({ where: { id: teacherId } })
    if (!teacher || teacher.status !== 'APPROVED') {
      return NextResponse.json({ error: 'Müəllim tapılmadı' }, { status: 404 })
    }

    const review = await db.review.upsert({
      where: { teacherId_studentId: { teacherId, studentId: user.id } },
      create: { teacherId, studentId: user.id, rating, comment: comment?.trim() || '' },
      update: { rating, comment: comment?.trim() || '' },
    })

    return NextResponse.json({ review })
  } catch (e) {
    console.error('review create error', e)
    return NextResponse.json({ error: 'Server xətası' }, { status: 500 })
  }
}
