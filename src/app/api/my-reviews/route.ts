import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// Şagirdin öz rəyləri (şəxsi kabinet üçün)
export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Qeydiyyat lazımdır' }, { status: 401 })

  try {
    const reviews = await db.review.findMany({
      where: { studentId: user.id },
      include: {
        teacher: {
          include: {
            user: { select: { name: true, surname: true } },
            subject: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const mapped = reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      teacherId: r.teacher.id,
      teacherName: `${r.teacher.user.name} ${r.teacher.user.surname}`,
      subject: r.teacher.subject,
    }))

    return NextResponse.json({ reviews: mapped })
  } catch (e) {
    console.error('my reviews error', e)
    return NextResponse.json({ error: 'Server xətası' }, { status: 500 })
  }
}
