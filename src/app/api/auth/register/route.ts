import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, setSessionCookie, publicUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// Şagird qeydiyyatı (sadə): Ad, Soyad, Gmail, Telefon, Şifrə (+ yaş, cins)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, surname, email, phone, password } = body
    const age = body.age ? parseInt(String(body.age), 10) : null
    const gender = body.gender === 'FEMALE' || body.gender === 'MALE' ? body.gender : null

    if (!name || !surname || !email || !phone || !password) {
      return NextResponse.json(
        { error: 'Bütün sahələr mütləqdir' },
        { status: 400 }
      )
    }

    const existing = await db.user.findUnique({ where: { email: email.toLowerCase().trim() } })
    if (existing) {
      return NextResponse.json(
        { error: 'Bu e-poçt artıq qeydiyyatdan keçib' },
        { status: 409 }
      )
    }

    const verifyToken = crypto.randomUUID()
    const user = await db.user.create({
      data: {
        name: name.trim(),
        surname: surname.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        password: hashPassword(password),
        role: 'STUDENT',
        age: age && !isNaN(age) ? age : null,
        gender,
        emailVerified: false,
        verifyToken,
      },
    })

    await setSessionCookie(user.id)

    return NextResponse.json({
      user: publicUser(user),
      verifyUrl: `/?verify=${verifyToken}`,
    })
  } catch (e) {
    console.error('register error', e)
    return NextResponse.json({ error: 'Server xətası' }, { status: 500 })
  }
}
