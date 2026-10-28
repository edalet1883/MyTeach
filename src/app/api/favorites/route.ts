import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// Favorilər — GET: siyahı, POST: toggle
export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Qeydiyyat lazımdır' }, { status: 401 })

    const favorites = await db.favorite.findMany({
      where: { studentId: user.id },
      include: {
        teacher: {
          include: {
            user: { select: { name: true, surname: true } },
            subject: true,
            sector: true,
            purpose: true,
            city: true,
            reviews: { select: { rating: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const mapped = favorites.map((f) => {
      const ratings = f.teacher.reviews
      const avg = ratings.length > 0 ? ratings.reduce((s, r) => s + r.rating, 0) / ratings.length : 0
      return {
        favoriteId: f.id,
        teacherId: f.teacher.id,
        name: f.teacher.user.name,
        surname: f.teacher.user.surname,
        experienceYears: f.teacher.experienceYears,
        pricePerHour: f.teacher.pricePerHour,
        subject: f.teacher.subject,
        sector: f.teacher.sector,
        purpose: f.teacher.purpose,
        city: f.teacher.city,
        avgRating: Math.round(avg * 10) / 10,
        reviewCount: ratings.length,
      }
    })

    return NextResponse.json({ favorites: mapped })
  } catch (e) {
    console.error('favorites GET error', e)
    return NextResponse.json({ error: 'Server xətası' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Favorilər üçün qeydiyyat lazımdır' }, { status: 401 })
    }

    const { teacherId } = await req.json()
    if (!teacherId) {
      return NextResponse.json({ error: 'teacherId tələb olunur' }, { status: 400 })
    }

    const existing = await db.favorite.findUnique({
      where: { studentId_teacherId: { studentId: user.id, teacherId } },
    })

    if (existing) {
      await db.favorite.delete({ where: { id: existing.id } })
      return NextResponse.json({ favorited: false })
    } else {
      await db.favorite.create({ data: { studentId: user.id, teacherId } })
      return NextResponse.json({ favorited: true })
    }
  } catch (e) {
    console.error('favorites POST error', e)
    return NextResponse.json({ error: 'Server xətası' }, { status: 500 })
  }
}
