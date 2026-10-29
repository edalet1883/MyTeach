import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/admin'

export const dynamic = 'force-dynamic'

// Admin — şikayətlər: GET siyahı, PATCH həll et
export async function GET() {
  const { forbidden } = await requireAdmin()
  if (forbidden) return forbidden

  try {
    const reports = await db.report.findMany({
      include: {
        teacher: { include: { user: { select: { name: true, surname: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      reports: reports.map((r) => ({
        id: r.id,
        reason: r.reason,
        comment: r.comment,
        status: r.status,
        createdAt: r.createdAt,
        teacherName: `${r.teacher.user.name} ${r.teacher.user.surname}`,
      })),
    })
  } catch (e) {
    console.error('admin reports GET error', e)
    return NextResponse.json({ error: 'Server xətası' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const { forbidden } = await requireAdmin()
  if (forbidden) return forbidden

  try {
    const { reportId, status } = await req.json()
    if (!reportId || !['OPEN', 'RESOLVED'].includes(status)) {
      return NextResponse.json({ error: 'Yanlış sorğu' }, { status: 400 })
    }

    await db.report.update({ where: { id: reportId }, data: { status } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('admin reports PATCH error', e)
    return NextResponse.json({ error: 'Server xətası' }, { status: 500 })
  }
}
