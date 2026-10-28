import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser, hashPassword } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// Müəllimin öz profili — GET: bax, PUT: redaktə et
export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Qeydiyyat lazımdır' }, { status: 401 })

  try {
    const profile = await db.teacherProfile.findUnique({
      where: { userId: user.id },
      include: {
        subject: true, sector: true, purpose: true, city: true,
        reviews: { select: { rating: true } },
      },
    })

    const avg =
      profile && profile.reviews.length > 0
        ? profile.reviews.reduce((s, r) => s + r.rating, 0) / profile.reviews.length
        : 0

    return NextResponse.json({
      emailVerified: user.emailVerified,
      verifyToken: user.verifyToken, // sandbox: təsdiq linkini göstərmək üçün
      profile: profile
        ? {
            ...profile,
            reviews: undefined,
            avgRating: Math.round(avg * 10) / 10,
            reviewCount: profile.reviews.length,
          }
        : null,
    })
  } catch (e) {
    console.error('my teacher profile error', e)
    return NextResponse.json({ error: 'Server xətası' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'TEACHER') {
    return NextResponse.json({ error: 'Yalnız müəllimlər redaktə edə bilər' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const {
      bio, experienceYears, pricePerHour,
      subjectId, sectorId, purposeId, cityId,
      whatsapp, phoneContact, emailContact,
      showWhatsapp, showPhone, showEmail,
      newPassword,
    } = body

    const data: Record<string, unknown> = {
      bio: bio?.trim() || null,
      experienceYears: parseInt(String(experienceYears), 10) || 0,
      pricePerHour: parseInt(String(pricePerHour), 10) || 0,
      subjectId: subjectId || null,
      sectorId: sectorId || null,
      purposeId: purposeId || null,
      cityId: cityId || null,
      whatsapp: whatsapp?.trim() || null,
      phoneContact: phoneContact?.trim() || user.phone,
      emailContact: emailContact?.trim() || user.email,
      showWhatsapp: !!showWhatsapp,
      showPhone: !!showPhone,
      showEmail: !!showEmail,
    }

    const existing = await db.teacherProfile.findUnique({ where: { userId: user.id } })
    if (!existing) {
      return NextResponse.json({ error: 'Müəllim profili tapılmadı' }, { status: 404 })
    }

    // Rədd edilmiş müəllim redaktə edib yenidən göndərə bilər → admin təsdiqinə qayıdır
    if (existing.status === 'REJECTED') {
      data.status = 'WAITING_ADMIN'
    }

    await db.teacherProfile.update({ where: { userId: user.id }, data })

    if (newPassword && newPassword.length >= 6) {
      await db.user.update({
        where: { id: user.id },
        data: { password: hashPassword(newPassword) },
      })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('teacher profile update error', e)
    return NextResponse.json({ error: 'Server xətası' }, { status: 500 })
  }
}
