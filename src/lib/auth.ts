import crypto from 'crypto'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'

const SECRET = process.env.AUTH_SECRET || 'myteach-dev-secret-key-2026'

// ── Token utilities (HMAC-signed, stateless) ──────────────────────

function sign(data: string): string {
  return crypto.createHmac('sha256', SECRET).update(data).digest('hex')
}

export function createToken(userId: string): string {
  const payload = Buffer.from(userId).toString('base64url')
  const sig = sign(payload)
  return `${payload}.${sig}`
}

export function verifyToken(token: string): string | null {
  try {
    const [payload, sig] = token.split('.')
    if (!payload || !sig) return null
    const expected = sign(payload)
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null
    return Buffer.from(payload, 'base64url').toString('utf-8')
  } catch {
    return null
  }
}

export const SESSION_COOKIE = 'myteach_session'

export async function setSessionCookie(userId: string) {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, createToken(userId), {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  })
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, '', { httpOnly: true, maxAge: 0, path: '/' })
}

export async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null
  return verifyToken(token)
}

// ── Current user helper ───────────────────────────────────────────

export async function getCurrentUser() {
  const userId = await getSessionUserId()
  if (!userId) return null
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { teacherProfile: true },
  })
  if (!user || user.blocked) return null
  return user
}

export function publicUser(user: {
  id: string
  name: string
  surname: string
  email: string
  phone: string
  role: string
  emailVerified: boolean
  blocked: boolean
  createdAt: Date
  teacherProfile?: { status: string } | null
}) {
  return {
    id: user.id,
    name: user.name,
    surname: user.surname,
    email: user.email,
    phone: user.phone,
    role: user.role,
    emailVerified: user.emailVerified,
    blocked: user.blocked,
    createdAt: user.createdAt,
    teacherStatus: user.teacherProfile?.status ?? null,
  }
}

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + SECRET).digest('hex')
}
