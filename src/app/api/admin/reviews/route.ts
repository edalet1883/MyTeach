import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/admin'

export const dynamic = 'force-dynamic'

// Rəy idarəetməsi — GET: bütün rəylər, DELETE: rəyi sil
export async function GET() {
  const { forbidden } = await requireAdmin()
  if (forbidden) return forbidden

  try {
    const reviews = await db.review.findMany({
      include: {
        student: { select: { name: true, surname: true, email: true } },
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
      studentName: `${r.student.name} ${r.student.surname}`,
      teacherName: `${r.teacher.user.name} ${r.teacher.user.surname}`,
      subject: r.teacher.subject,
    }))

    return NextResponse.json({ reviews: mapped })
  } catch (e) {
    console.error('admin reviews error', e)
    return NextResponse.json({ error: 'Server xətası' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const { forbidden } = await requireAdmin()
  if (forbidden) return forbidden

  try {
    const { reviewId } = await req.json()
    if (!reviewId) {
      return NextResponse.json({ error: 'reviewId tələb olunur' }, { status: 400 })
    }
    await db.review.delete({ where: { id: reviewId } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('admin review delete error', e)
    return NextResponse.json({ error: 'Server xətası' }, { status: 500 })
  }
}
