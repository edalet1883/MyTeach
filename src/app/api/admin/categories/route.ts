import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/admin'

export const dynamic = 'force-dynamic'

// Kateqoriya idarəetməsi — type: subject | sector | purpose | city
const MODELS = {
  subject: () => db.subject,
  sector: () => db.sector,
  purpose: () => db.purpose,
  city: () => db.city,
} as const

type CatType = keyof typeof MODELS

function isValidType(t: string): t is CatType {
  return ['subject', 'sector', 'purpose', 'city'].includes(t)
}

export async function POST(req: NextRequest) {
  const { forbidden } = await requireAdmin()
  if (forbidden) return forbidden

  try {
    const { type, nameAz, nameEn, nameRu, icon } = await req.json()
    if (!isValidType(type) || !nameAz || !nameEn || !nameRu) {
      return NextResponse.json({ error: 'Bütün dillərdə ad tələb olunur' }, { status: 400 })
    }
    const model = MODELS[type]()
    const created = await model.create({
      data: { nameAz, nameEn, nameRu, ...(type === 'subject' ? { icon: icon || 'book' } : {}) },
    })
    return NextResponse.json({ category: created })
  } catch (e) {
    console.error('category create error', e)
    return NextResponse.json({ error: 'Server xətası' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const { forbidden } = await requireAdmin()
  if (forbidden) return forbidden

  try {
    const { type, id, nameAz, nameEn, nameRu, icon } = await req.json()
    if (!isValidType(type) || !id || !nameAz || !nameEn || !nameRu) {
      return NextResponse.json({ error: 'Bütün dillərdə ad tələb olunur' }, { status: 400 })
    }
    const model = MODELS[type]()
    const updated = await model.update({
      where: { id },
      data: { nameAz, nameEn, nameRu, ...(type === 'subject' && icon ? { icon } : {}) },
    })
    return NextResponse.json({ category: updated })
  } catch (e) {
    console.error('category update error', e)
    return NextResponse.json({ error: 'Server xətası' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const { forbidden } = await requireAdmin()
  if (forbidden) return forbidden

  try {
    const { type, id } = await req.json()
    if (!isValidType(type) || !id) {
      return NextResponse.json({ error: 'Yanlış sorğu' }, { status: 400 })
    }
    const model = MODELS[type]()
    const usage =
      type === 'subject'
        ? await db.teacherProfile.count({ where: { subjectId: id } })
        : type === 'sector'
          ? await db.teacherProfile.count({ where: { sectorId: id } })
          : type === 'purpose'
            ? await db.teacherProfile.count({ where: { purposeId: id } })
            : await db.teacherProfile.count({ where: { cityId: id } })

    if (usage > 0) {
      return NextResponse.json(
        { error: `Bu kateqoriya ${usage} müəllim tərəfindən istifadə olunur, silmək olmaz` },
        { status: 409 }
      )
    }

    await model.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('category delete error', e)
    return NextResponse.json({ error: 'Server xətası' }, { status: 500 })
  }
}
