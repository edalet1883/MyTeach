import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'

// Admin yoxlaması — qayıdır: { user } və ya Response
export async function requireAdmin() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') {
    return { user: null, forbidden: NextResponse.json({ error: 'Admin girişi tələb olunur' }, { status: 403 }) }
  }
  return { user, forbidden: null }
}

export async function adminStats() {
  const [teachers, students, pending, reviews, guests] = await Promise.all([
    db.teacherProfile.count({ where: { status: 'APPROVED' } }),
    db.user.count({ where: { role: 'STUDENT' } }),
    db.teacherProfile.count({ where: { status: { in: ['PENDING', 'WAITING_ADMIN'] } } }),
    db.review.count(),
    db.user.count(),
  ])
  return { teachers, students, pending, reviews, totalUsers: guests }
}
