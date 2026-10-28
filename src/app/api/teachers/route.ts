import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

// Müəllim siyahısı — yalnız təsdiqlənmişlər + filtrlər
export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams
    const subjectId = sp.get('subjectId') || undefined
    const sectorId = sp.get('sectorId') || undefined
    const purposeId = sp.get('purposeId') || undefined
    const cityId = sp.get('cityId') || undefined
    const search = sp.get('search')?.trim()
    const minPrice = sp.get('minPrice') ? parseInt(sp.get('minPrice')!, 10) : undefined
    const maxPrice = sp.get('maxPrice') ? parseInt(sp.get('maxPrice')!, 10) : undefined
    const sort = sp.get('sort') || 'rating' // rating | priceAsc | priceDesc | experience

    const where: Record<string, unknown> = {
      status: 'APPROVED',
      user: { blocked: false },
    }
    if (subjectId) where.subjectId = subjectId
    if (sectorId) where.sectorId = sectorId
    if (purposeId) where.purposeId = purposeId
    if (cityId) where.cityId = cityId
    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceFilter: Record<string, number> = {}
      if (minPrice !== undefined && !isNaN(minPrice)) priceFilter.gte = minPrice
      if (maxPrice !== undefined && !isNaN(maxPrice)) priceFilter.lte = maxPrice
      if (Object.keys(priceFilter).length) where.pricePerHour = priceFilter
    }
    if (search) {
      where.OR = [
        { user: { name: { contains: search } } },
        { user: { surname: { contains: search } } },
        { bio: { contains: search } },
      ]
    }

    const teachers = await db.teacherProfile.findMany({
      where,
      include: {
        user: { select: { name: true, surname: true, emailVerified: true } },
        subject: true,
        sector: true,
        purpose: true,
        city: true,
        reviews: { select: { rating: true } },
        _count: { select: { reviews: true } },
      },
    })

    const mapped = teachers.map((t) => {
      const avg =
        t.reviews.length > 0
          ? t.reviews.reduce((s, r) => s + r.rating, 0) / t.reviews.length
          : 0
      return {
        id: t.id,
        name: t.user.name,
        surname: t.user.surname,
        emailVerified: t.user.emailVerified,
        bio: t.bio,
        experienceYears: t.experienceYears,
        pricePerHour: t.pricePerHour,
        subject: t.subject,
        sector: t.sector,
        purpose: t.purpose,
        city: t.city,
        avgRating: Math.round(avg * 10) / 10,
        reviewCount: t._count.reviews,
      }
    })

    switch (sort) {
      case 'priceAsc':
        mapped.sort((a, b) => a.pricePerHour - b.pricePerHour)
        break
      case 'priceDesc':
        mapped.sort((a, b) => b.pricePerHour - a.pricePerHour)
        break
      case 'experience':
        mapped.sort((a, b) => b.experienceYears - a.experienceYears)
        break
      case 'rating':
      default:
        mapped.sort((a, b) => b.avgRating - a.avgRating || b.reviewCount - a.reviewCount)
    }

    return NextResponse.json({ teachers: mapped })
  } catch (e) {
    console.error('teachers list error', e)
    return NextResponse.json({ error: 'Server xətası' }, { status: 500 })
  }
}
