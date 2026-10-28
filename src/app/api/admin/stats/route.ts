import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  const { forbidden } = await requireAdmin()
  if (forbidden) return forbidden

  try {
    const [approvedTeachers, students, pending, rejected, reviews, totalUsers] = await Promise.all([
      db.teacherProfile.count({ where: { status: 'APPROVED' } }),
      db.user.count({ where: { role: 'STUDENT' } }),
      db.teacherProfile.count({ where: { status: { in: ['PENDING', 'WAITING_ADMIN'] } } }),
      db.teacherProfile.count({ where: { status: 'REJECTED' } }),
      db.review.count(),
      db.user.count(),
    ])

    return NextResponse.json({
      approvedTeachers,
      students,
      pending,
      rejected,
      reviews,
      totalUsers,
    })
  } catch (e) {
    console.error('stats error', e)
    return NextResponse.json({ error: 'Server xətası' }, { status: 500 })
  }
}
