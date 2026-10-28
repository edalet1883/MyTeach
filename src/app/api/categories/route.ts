import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

// Bütün kateqoriyalar (3 dilli)
export async function GET() {
  try {
    const [subjects, sectors, purposes, cities] = await Promise.all([
      db.subject.findMany({ orderBy: { nameAz: 'asc' } }),
      db.sector.findMany({ orderBy: { nameAz: 'asc' } }),
      db.purpose.findMany({ orderBy: { nameAz: 'asc' } }),
      db.city.findMany({ orderBy: { nameAz: 'asc' } }),
    ])
    return NextResponse.json({ subjects, sectors, purposes, cities })
  } catch (e) {
    console.error('categories error', e)
    return NextResponse.json({ error: 'Server xətası' }, { status: 500 })
  }
}
