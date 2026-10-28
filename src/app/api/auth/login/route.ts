import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, setSessionCookie, publicUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'E-poçt və şifrə tələb olunur' }, { status: 400 })
    }

    const user = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: { teacherProfile: true },
    })

    if (!user || user.password !== hashPassword(password)) {
      return NextResponse.json({ error: 'E-poçt və ya şifrə yanlışdır' }, { status: 401 })
    }
    if (user.blocked) {
      return NextResponse.json({ error: 'Hesabınız bloklanıb' }, { status: 403 })
    }

    await setSessionCookie(user.id)
    return NextResponse.json({ user: publicUser(user) })
  } catch (e) {
    console.error('login error', e)
    return NextResponse.json({ error: 'Server xətası' }, { status: 500 })
  }
}
