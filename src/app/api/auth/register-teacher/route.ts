import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, setSessionCookie, publicUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// Müəllim qeydiyyatı — multipart/form-data (diplom faylı ilə)
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()

    const name = String(form.get('name') || '').trim()
    const surname = String(form.get('surname') || '').trim()
    const email = String(form.get('email') || '').toLowerCase().trim()
    const phone = String(form.get('phone') || '').trim()
    const password = String(form.get('password') || '')
    const experienceYears = parseInt(String(form.get('experienceYears') || '0'), 10)
    const pricePerHour = parseInt(String(form.get('pricePerHour') || '0'), 10)
    const bio = String(form.get('bio') || '').trim()
    const subjectId = String(form.get('subjectId') || '') || null
    const sectorId = String(form.get('sectorId') || '') || null
    const purposeId = String(form.get('purposeId') || '') || null
    const cityId = String(form.get('cityId') || '') || null
    const whatsapp = String(form.get('whatsapp') || '').trim()
    const phoneContact = String(form.get('phoneContact') || '').trim()
    const emailContact = String(form.get('emailContact') || '').trim()
    const showWhatsapp = String(form.get('showWhatsapp') || '') === 'true'
    const showPhone = String(form.get('showPhone') || '') === 'true'
    const showEmail = String(form.get('showEmail') || '') === 'true'
    const rawFormats = String(form.get('lessonFormats') || 'BOTH')
    const lessonFormats = ['ONLINE', 'IN_PERSON', 'BOTH'].includes(rawFormats) ? rawFormats : 'BOTH'
    const rawPeriod = String(form.get('pricePeriod') || 'HOUR')
    const pricePeriod = ['HOUR', 'DAY', 'MONTH', 'YEAR'].includes(rawPeriod) ? rawPeriod : 'HOUR'

    if (!name || !surname || !email || !phone || !password) {
      return NextResponse.json({ error: 'Bütün sahələr mütləqdir' }, { status: 400 })
    }
    if (!subjectId || !cityId) {
      return NextResponse.json({ error: 'Fənn və şəhər seçilməlidir' }, { status: 400 })
    }

    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Bu e-poçt artıq qeydiyyatdan keçib' }, { status: 409 })
    }

    // Diplomu yüklə
    let diplomaUrl: string | null = null
    const diploma = form.get('diploma') as File | null
    if (diploma && diploma.size > 0) {
      if (diploma.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: 'Diplom faylı 5MB-dan kiçik olmalıdır' }, { status: 400 })
      }
      const bytes = await diploma.arrayBuffer()
      const ext = diploma.name.split('.').pop() || 'pdf'
      const safeExt = ext.replace(/[^a-zA-Z0-9]/g, '').slice(0, 5) || 'bin'
      const filename = `diploma-${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${safeExt}`
      const { writeFile } = await import('fs/promises')
      const path = await import('path')
      const dir = path.join(process.cwd(), 'public', 'uploads', 'diplomas')
      await writeFile(path.join(dir, filename), Buffer.from(bytes))
      diplomaUrl = `/uploads/diplomas/${filename}`
    }

    const verifyToken = crypto.randomUUID()
    const user = await db.user.create({
      data: {
        name, surname, email, phone,
        password: hashPassword(password),
        role: 'TEACHER',
        emailVerified: false,
        verifyToken,
        teacherProfile: {
          create: {
            experienceYears: isNaN(experienceYears) ? 0 : experienceYears,
            pricePerHour: isNaN(pricePerHour) ? 0 : pricePerHour,
            pricePeriod,
            bio: bio || null,
            diplomaUrl,
            status: 'PENDING', // 1) Gmail təsdiqi gözlənilir
            subjectId, sectorId, purposeId, cityId,
            whatsapp: whatsapp || null,
            phoneContact: phoneContact || phone,
            emailContact: emailContact || email,
            showWhatsapp, showPhone, showEmail,
            lessonFormats,
          },
        },
      },
      include: { teacherProfile: true },
    })

    await setSessionCookie(user.id)

    return NextResponse.json({
      user: publicUser(user),
      verifyUrl: `/?verify=${verifyToken}`,
    })
  } catch (e) {
    console.error('register-teacher error', e)
    return NextResponse.json({ error: 'Server xətası' }, { status: 500 })
  }
}
