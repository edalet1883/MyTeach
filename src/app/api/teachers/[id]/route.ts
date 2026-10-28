import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

// Müəllim profil detalları + rəylər
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const teacher = await db.teacherProfile.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, surname: true, emailVerified: true, createdAt: true } },
        subject: true,
        sector: true,
        purpose: true,
        city: true,
        reviews: {
          include: {
            student: { select: { name: true, surname: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!teacher || teacher.status !== 'APPROVED') {
      return NextResponse.json({ error: 'Müəllim tapılmadı' }, { status: 404 })
    }

    const avg =
      teacher.reviews.length > 0
        ? teacher.reviews.reduce((s, r) => s + r.rating, 0) / teacher.reviews.length
        : 0

    return NextResponse.json({
      teacher: {
        id: teacher.id,
        name: teacher.user.name,
        surname: teacher.user.surname,
        emailVerified: teacher.user.emailVerified,
        bio: teacher.bio,
        experienceYears: teacher.experienceYears,
        pricePerHour: teacher.pricePerHour,
        subject: teacher.subject,
        sector: teacher.sector,
        purpose: teacher.purpose,
        city: teacher.city,
        avgRating: Math.round(avg * 10) / 10,
        reviewCount: teacher.reviews.length,
        contacts: {
          whatsapp: teacher.showWhatsapp ? teacher.whatsapp : null,
          phone: teacher.showPhone ? teacher.phoneContact : null,
          email: teacher.showEmail ? teacher.emailContact : null,
        },
        reviews: teacher.reviews.map((r) => ({
          id: r.id,
          rating: r.rating,
          comment: r.comment,
          createdAt: r.createdAt,
          studentName: `${r.student.name} ${r.student.surname.charAt(0)}.`,
        })),
        memberSince: teacher.user.createdAt,
      },
    })
  } catch (e) {
    console.error('teacher detail error', e)
    return NextResponse.json({ error: 'Server xətası' }, { status: 500 })
  }
}
