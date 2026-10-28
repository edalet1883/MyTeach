import { NextResponse } from 'next/server'
import { getCurrentUser, publicUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 })
    }
    return NextResponse.json({ user: publicUser(user) })
  } catch (e) {
    console.error('me error', e)
    return NextResponse.json({ user: null }, { status: 200 })
  }
}
