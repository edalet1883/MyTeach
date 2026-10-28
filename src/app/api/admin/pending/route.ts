import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/admin'

export const dynamic = 'force-dynamic'

// Gözləyən müəllim qeydiyyatları (PENDING + WAITING_ADMIN)
export async function GET() {
  const { forbidden } = await requireAdmin()
  if (forbidden) return forbidden

  try {
    const pending = await db.teacherProfile.findMany({
      where: { status: { in: ['PENDING', 'WAITING_ADMIN'] } },
      include: {
        user: { select: { name: true, surname: true, email: true, phone: true, emailVerified: true, createdAt: true } },
        subject: true,
        sector: true,
        purpose: true,
        city: true,
      },
      orderBy: { createdAt: 'asc' },
    })
    return NextResponse.json({ pending })
  } catch (e) {
    console.error('pending error', e)
    return NextResponse.json({ error: 'Server xətası' }, { status: 500 })
  }
}
