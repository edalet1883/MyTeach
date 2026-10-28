'use client'

import { useCallback, useEffect, useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useApp, Lang } from '@/lib/store'
import { useT, getCategoryName } from '@/lib/i18n'
import { StarRating } from '@/components/myteach/star-rating'
import { api } from '@/lib/api'
import { toast } from '@/hooks/use-toast'

interface CatItem {
  id: string
  nameAz: string
  nameEn: string
  nameRu: string
}

interface PendingTeacher {
  id: string
  bio: string | null
  experienceYears: number
  pricePerHour: number
  diplomaUrl: string | null
  status: 'PENDING' | 'WAITING_ADMIN'
  subject: CatItem | null
  sector: CatItem | null
  purpose: CatItem | null
  city: CatItem | null
  user: {
    name: string
    surname: string
    email: string
    phone: string
    emailVerified: boolean
    createdAt: string
  }
}

interface AdminUser {
  id: string
  name: string
  surname: string
  email: string
  phone: string
  role: string
  emailVerified: boolean
  blocked: boolean
  createdAt: string
  teacherStatus: string | null
  subject: CatItem | null
  city: CatItem | null
}

interface AdminReview {
  id: string
  rating: number
  comment: string
  createdAt: string
  studentName: string
  teacherName: string
  subject: CatItem | null
}

interface AdminReport {
  id: string
  reason: string
  comment: string | null
  status: string
  createdAt: string
  teacherName: string
}

interface Stats {
  approvedTeachers: number
  students: number
  pending: number
  rejected: number
  reviews: number
  totalUsers: number
}

export function AdminView() {
  const t = useT()
  const lang = useApp((s) => s.lang)
  const { user, navigate } = useApp()

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center sm:px-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-xl font-bold text-rose-500">
          MT
        </div>
        <h1 className="mt-5 text-xl font-bold text-slate-900">{t('adm.noAccess')}</h1>
        <p className="mt-2 text-sm text-slate-500">{t('adm.noAccessDesc')}</p>
        <Button className="mt-6 bg-emerald-600 hover:bg-emerald-700" onClick={() => navigate('home')}>
          {t('nav.home')}
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{t('adm.title')}</h1>
        <p className="mt-1.5 text-sm text-slate-500">{t('adm.subtitle')}</p>
      </div>

      <StatsCards />

      <Tabs defaultValue="pending" className="mt-8">
        <TabsList className="h-11 w-full justify-start overflow-x-auto rounded-xl bg-slate-100 p-1">
          <TabsTrigger value="pending" className="rounded-lg px-4">
            {t('adm.tabPending')}
          </TabsTrigger>
          <TabsTrigger value="users" className="rounded-lg px-4">
            {t('adm.tabUsers')}
          </TabsTrigger>
          <TabsTrigger value="categories" className="rounded-lg px-4">
            {t('adm.tabCategories')}
          </TabsTrigger>
          <TabsTrigger value="reviews" className="rounded-lg px-4">
            {t('adm.tabReviews')}
          </TabsTrigger>
          <TabsTrigger value="reports" className="rounded-lg px-4">
            {t('adm.tabReports')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <PendingTab />
        </TabsContent>
        <TabsContent value="users">
          <UsersTab />
        </TabsContent>
        <TabsContent value="categories">
          <CategoriesTab />
        </TabsContent>
        <TabsContent value="reviews">
          <ReviewsTab />
        </TabsContent>
        <TabsContent value="reports">
          <ReportsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ── Statistika kartları ──
function StatsCards() {
  const t = useT()
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    const load = () => api<Stats>('/api/admin/stats').then(setStats).catch(() => {})
    load()
    const interval = setInterval(load, 15000)
    return () => clearInterval(interval)
  }, [])

  const cards = [
    { label: t('adm.statTeachers'), value: stats?.approvedTeachers, color: 'bg-emerald-50 text-emerald-700' },
    { label: t('adm.statStudents'), value: stats?.students, color: 'bg-teal-50 text-teal-700' },
    { label: t('adm.statPending'), value: stats?.pending, color: 'bg-amber-50 text-amber-700' },
    { label: t('adm.statReviews'), value: stats?.reviews, color: 'bg-violet-50 text-violet-700' },
  ]

  return (
    <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c, i) => (
        <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold ${c.color}`}>
            {i + 1}
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900">{c.value ?? '—'}</div>
          <div className="text-xs text-slate-500">{c.label}</div>
        </div>
      ))}
    </div>
  )
}

// ── Gözləyən müəllimlər ──
function PendingTab() {
  const t = useT()
  const lang = useApp((s) => s.lang)
  const [pending, setPending] = useState<PendingTeacher[]>([])
  const [loading, setLoading] = useState(true)
  const [diplomaUrl, setDiplomaUrl] = useState<string | null>(null)
  const [diplomaName, setDiplomaName] = useState('')

  const load = useCallback(async () => {
    try {
      const d = await api<{ pending: PendingTeacher[] }>('/api/admin/pending')
      setPending(d.pending)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const act = async (teacherId: string, action: 'approve' | 'reject') => {
    await api('/api/admin/teacher-action', {
      method: 'POST',
      body: JSON.stringify({ teacherId, action }),
    })
    toast({ title: t('adm.done') })
    await load()
  }

  if (loading) {
    return <div className="mt-6 text-sm text-slate-400">{t('common.loading')}</div>
  }

  if (pending.length === 0) {
    return (
      <div className="mt-6 rounded-3xl border border-dashed border-slate-300 p-12 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
          <span className="css-check text-lg text-emerald-600" aria-hidden="true" />
        </div>
        <p className="mt-4 font-medium text-slate-700">{t('adm.noPending')}</p>
        <p className="mt-1 text-sm text-slate-500">{t('adm.noPendingDesc')}</p>
      </div>
    )
  }

  return (
    <div className="mt-6 space-y-4">
      {pending.map((p) => (
        <div key={p.id} className="rounded-3xl border border-amber-200 bg-amber-50/40 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3.5">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-slate-700 font-bold text-white">
                  {p.user.name[0]}
                  {p.user.surname[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-slate-900">
                  {p.user.name} {p.user.surname}
                  <Badge className="ml-2 bg-amber-100 text-amber-800 hover:bg-amber-100">
                    {t(`adm.${p.status}` as never)}
                  </Badge>
                  {p.user.emailVerified ? (
                    <Badge className="ml-1.5 bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                      Gmail OK
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="ml-1.5">
                      Gmail —
                    </Badge>
                  )}
                </div>
                <div className="mt-1 space-y-0.5 text-sm text-slate-500">
                  <div>{p.user.email} • {p.user.phone}</div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                    <span>{getCategoryName(p.subject, lang as Lang) || '—'}</span>
                    <span className="text-slate-300">•</span>
                    <span>{getCategoryName(p.city, lang as Lang) || '—'}</span>
                    <span className="text-slate-300">•</span>
                    <span>{getCategoryName(p.sector, lang as Lang) || '—'}</span>
                    <span className="text-slate-300">•</span>
                    <span>{getCategoryName(p.purpose, lang as Lang) || '—'}</span>
                  </div>
                  <div>
                    {t('adm.experienceCol')}: {p.experienceYears} • {t('adm.priceCol')}: {p.pricePerHour} AZN
                  </div>
                  {p.bio && <div className="max-w-xl text-xs leading-relaxed text-slate-400">{p.bio}</div>}
                </div>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {p.diplomaUrl ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDiplomaUrl(p.diplomaUrl!)
                    setDiplomaName(`${p.user.name} ${p.user.surname}`)
                  }}
                >
                  {t('adm.viewDiploma')}
                </Button>
              ) : (
                <Badge variant="secondary" className="text-xs">{t('adm.noDiploma')}</Badge>
              )}
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => act(p.id, 'approve')}
              >
                {t('adm.approve')}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-rose-200 text-rose-600 hover:bg-rose-50"
                onClick={() => act(p.id, 'reject')}
              >
                {t('adm.reject')}
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* Diploma baxış */}
      <Dialog open={!!diplomaUrl} onOpenChange={(o) => !o && setDiplomaUrl(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {t('adm.viewDiploma')} — {diplomaName}
            </DialogTitle>
          </DialogHeader>
          {diplomaUrl?.toLowerCase().endsWith('.pdf') ? (
            <object data={diplomaUrl} type="application/pdf" className="h-96 w-full rounded-lg bg-slate-100">
              <p className="p-4 text-sm text-slate-500">
                PDF —{' '}
                <a href={diplomaUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline">
                  {diplomaUrl}
                </a>
              </p>
            </object>
          ) : (
            <img src={diplomaUrl ?? ''} alt={diplomaName} className="max-h-96 w-full rounded-lg object-contain" />
          )}
          <a
            href={diplomaUrl ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-center text-sm text-emerald-700 underline"
          >
            {diplomaUrl}
          </a>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ── İstifadəçilər ──
function UsersTab() {
  const t = useT()
  const lang = useApp((s) => s.lang)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const load = useCallback(async () => {
    try {
      const d = await api<{ users: AdminUser[] }>('/api/admin/users')
      setUsers(d.users)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const act = async (userId: string, action: 'block' | 'unblock' | 'delete') => {
    try {
      await api('/api/admin/users', { method: 'POST', body: JSON.stringify({ userId, action }) })
      await load()
    } catch (e) {
      toast({ title: e instanceof Error ? e.message : t('common.error'), variant: 'destructive' })
    }
  }

  if (loading) return <div className="mt-6 text-sm text-slate-400">{t('common.loading')}</div>

  const filtered = users.filter(
    (u) =>
      !search ||
      `${u.name} ${u.surname} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="mt-6">
      <Input
        className="max-w-sm rounded-xl"
        placeholder={t('teachers.searchPlaceholder')}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3 font-medium">İstifadəçi</th>
                <th className="px-4 py-3 font-medium">{t('adm.role')}</th>
                <th className="px-4 py-3 font-medium">{t('adm.status')}</th>
                <th className="px-4 py-3 font-medium">{t('adm.joined')}</th>
                <th className="px-4 py-3 text-right font-medium">{t('adm.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">
                      {u.name} {u.surname}
                      {u.blocked && (
                        <Badge className="ml-2 bg-rose-100 text-rose-700 hover:bg-rose-100">
                          {t('adm.blocked')}
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-slate-400">{u.email}</div>
                    {u.subject && (
                      <div className="mt-0.5 text-xs text-slate-500">
                        {getCategoryName(u.subject, lang as Lang)} • {getCategoryName(u.city, lang as Lang)}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="secondary"
                      className={
                        u.role === 'ADMIN'
                          ? 'bg-slate-900 text-white'
                          : u.role === 'TEACHER'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-teal-50 text-teal-700'
                      }
                    >
                      {u.role === 'ADMIN' ? t('cab.admin') : u.role === 'TEACHER' ? t('cab.teacher') : t('cab.student')}
                    </Badge>
                    {u.teacherStatus && (
                      <div className="mt-1 text-xs text-slate-400">{t(`adm.${u.teacherStatus}` as never)}</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {u.blocked ? (
                      <span className="text-xs font-medium text-rose-600">{t('adm.blocked')}</span>
                    ) : (
                      <span className="text-xs font-medium text-emerald-600">{t('adm.active')}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {u.role !== 'ADMIN' && (
                      <div className="flex items-center justify-end gap-1.5">
                        {u.blocked ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 border-emerald-200 px-2.5 text-xs text-emerald-700 hover:bg-emerald-50"
                            onClick={() => act(u.id, 'unblock')}
                          >
                            {t('adm.unblock')}
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 border-amber-200 px-2.5 text-xs text-amber-700 hover:bg-amber-50"
                            onClick={() => act(u.id, 'block')}
                          >
                            {t('adm.block')}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 border-rose-200 px-2.5 text-xs text-rose-600 hover:bg-rose-50"
                          onClick={() => act(u.id, 'delete')}
                        >
                          {t('adm.delete')}
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── Kateqoriyalar ──
type CatType = 'subject' | 'sector' | 'purpose' | 'city'

function CategoriesTab() {
  const t = useT()
  const [type, setType] = useState<CatType>('subject')
  const [items, setItems] = useState<CatItem[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [names, setNames] = useState({ nameAz: '', nameEn: '', nameRu: '' })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const d = await api<{ subjects: CatItem[]; sectors: CatItem[]; purposes: CatItem[]; cities: CatItem[] }>(
        '/api/categories'
      )
      setItems(d[type])
    } finally {
      setLoading(false)
    }
  }, [type])

  useEffect(() => {
    load()
  }, [load])

  const openAdd = () => {
    setEditingId(null)
    setNames({ nameAz: '', nameEn: '', nameRu: '' })
    setDialogOpen(true)
  }

  const openEdit = (item: CatItem) => {
    setEditingId(item.id)
    setNames({ nameAz: item.nameAz, nameEn: item.nameEn, nameRu: item.nameRu })
    setDialogOpen(true)
  }

  const submit = async () => {
    try {
      if (editingId) {
        await api('/api/admin/categories', {
          method: 'PUT',
          body: JSON.stringify({ type, id: editingId, ...names }),
        })
      } else {
        await api('/api/admin/categories', {
          method: 'POST',
          body: JSON.stringify({ type, ...names }),
        })
      }
      toast({ title: t('adm.done') })
      setDialogOpen(false)
      await load()
    } catch (e) {
      toast({ title: e instanceof Error ? e.message : t('common.error'), variant: 'destructive' })
    }
  }

  const remove = async (id: string) => {
    try {
      await api('/api/admin/categories', { method: 'DELETE', body: JSON.stringify({ type, id }) })
      await load()
    } catch (e) {
      toast({ title: e instanceof Error ? e.message : t('common.error'), variant: 'destructive' })
    }
  }

  const typeLabels: Record<CatType, string> = {
    subject: t('cat.subjects'),
    sector: t('cat.sectors'),
    purpose: t('cat.purposes'),
    city: t('cat.cities'),
  }

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Select value={type} onValueChange={(v) => setType(v as CatType)}>
          <SelectTrigger className="w-52 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="subject">{t('cat.subjects')}</SelectItem>
            <SelectItem value="sector">{t('cat.sectors')}</SelectItem>
            <SelectItem value="purpose">{t('cat.purposes')}</SelectItem>
            <SelectItem value="city">{t('cat.cities')}</SelectItem>
          </SelectContent>
        </Select>
        <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={openAdd}>
          {t('adm.addCategory')}
        </Button>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3 font-medium">{t('adm.nameAz')}</th>
              <th className="px-4 py-3 font-medium">{t('adm.nameEn')}</th>
              <th className="px-4 py-3 font-medium">{t('adm.nameRu')}</th>
              <th className="px-4 py-3 text-right font-medium">{t('adm.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                  {t('common.loading')}
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-medium text-slate-900">{item.nameAz}</td>
                  <td className="px-4 py-3 text-slate-600">{item.nameEn}</td>
                  <td className="px-4 py-3 text-slate-600">{item.nameRu}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button size="sm" variant="outline" className="h-8 px-2.5 text-xs" onClick={() => openEdit(item)}>
                        {t('adm.edit')}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 border-rose-200 px-2.5 text-xs text-rose-600 hover:bg-rose-50"
                        onClick={() => remove(item.id)}
                      >
                        {t('adm.delete')}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingId ? t('adm.editCategory') : t('adm.addCategory')} — {typeLabels[type]}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>{t('adm.nameAz')}</Label>
              <Input
                className="mt-1.5"
                value={names.nameAz}
                onChange={(e) => setNames((n) => ({ ...n, nameAz: e.target.value }))}
              />
            </div>
            <div>
              <Label>{t('adm.nameEn')}</Label>
              <Input
                className="mt-1.5"
                value={names.nameEn}
                onChange={(e) => setNames((n) => ({ ...n, nameEn: e.target.value }))}
              />
            </div>
            <div>
              <Label>{t('adm.nameRu')}</Label>
              <Input
                className="mt-1.5"
                value={names.nameRu}
                onChange={(e) => setNames((n) => ({ ...n, nameRu: e.target.value }))}
              />
            </div>
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              disabled={!names.nameAz || !names.nameEn || !names.nameRu}
              onClick={submit}
            >
              {editingId ? t('common.save') : t('adm.addBtn')}
            </Button>
            <p className="text-center text-xs text-slate-400">{t('adm.deleteCategoryWarn')}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ── Rəylər ──
function ReportsTab() {
  const t = useT()
  const [reports, setReports] = useState<AdminReport[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const d = await api<{ reports: AdminReport[] }>('/api/admin/reports')
      setReports(d.reports)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const setStatus = async (reportId: string, status: 'OPEN' | 'RESOLVED') => {
    try {
      await api('/api/admin/reports', { method: 'PATCH', body: JSON.stringify({ reportId, status }) })
      await load()
    } catch (e) {
      toast({ title: e instanceof Error ? e.message : t('common.error'), variant: 'destructive' })
    }
  }

  const reasonLabel: Record<string, string> = {
    FAKE: t('report.reasonFake'),
    PRICE: t('report.reasonPrice'),
    OFFENSIVE: t('report.reasonOffensive'),
    OTHER: t('report.reasonOther'),
  }

  if (loading) return <div className="mt-6 text-sm text-slate-400">{t('common.loading')}</div>

  if (reports.length === 0) {
    return (
      <div className="mt-6 rounded-3xl border border-dashed border-slate-300 p-12 text-center text-sm text-slate-500">
        {t('report.empty')}
      </div>
    )
  }

  return (
    <div className="mt-6 space-y-3">
      {reports.map((r) => (
        <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  className={
                    r.status === 'OPEN'
                      ? 'bg-rose-100 text-rose-700 hover:bg-rose-100'
                      : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                  }
                >
                  {r.status === 'OPEN' ? t('report.button') : t('report.done')}
                </Badge>
                <span className="text-sm font-semibold text-slate-900">{reasonLabel[r.reason] ?? r.reason}</span>
                <span className="text-sm text-slate-400">→</span>
                <span className="text-sm font-medium text-emerald-700">{r.teacherName}</span>
              </div>
              {r.comment && <p className="mt-2 text-sm leading-relaxed text-slate-600">{r.comment}</p>}
              <div className="mt-1.5 text-xs text-slate-400">
                {new Date(r.createdAt).toLocaleString()}
              </div>
            </div>
            <Button
              size="sm"
              variant={r.status === 'OPEN' ? 'default' : 'outline'}
              className={r.status === 'OPEN' ? 'bg-emerald-600 hover:bg-emerald-700' : 'text-slate-500'}
              onClick={() => setStatus(r.id, r.status === 'OPEN' ? 'RESOLVED' : 'OPEN')}
            >
              {r.status === 'OPEN' ? t('report.done') : t('report.button')}
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

function ReviewsTab() {
  const t = useT()
  const lang = useApp((s) => s.lang)
  const [reviews, setReviews] = useState<AdminReview[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const d = await api<{ reviews: AdminReview[] }>('/api/admin/reviews')
      setReviews(d.reviews)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const remove = async (reviewId: string) => {
    if (!window.confirm(t('adm.deleteReviewConfirm'))) return
    try {
      await api('/api/admin/reviews', { method: 'DELETE', body: JSON.stringify({ reviewId }) })
      await load()
    } catch (e) {
      toast({ title: e instanceof Error ? e.message : t('common.error'), variant: 'destructive' })
    }
  }

  if (loading) return <div className="mt-6 text-sm text-slate-400">{t('common.loading')}</div>

  if (reviews.length === 0) {
    return (
      <div className="mt-6 rounded-3xl border border-dashed border-slate-300 p-12 text-center text-sm text-slate-500">
        —
      </div>
    )
  }

  return (
    <div className="mt-6 space-y-3">
      {reviews.map((r) => (
        <div key={r.id} className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-slate-900">{r.studentName}</span>
              <span className="text-sm text-slate-400">→</span>
              <span className="text-sm font-medium text-emerald-700">{r.teacherName}</span>
              {r.subject && (
                <Badge variant="secondary" className="text-xs">
                  {getCategoryName(r.subject, lang as Lang)}
                </Badge>
              )}
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <StarRating rating={r.rating} size={13} />
              <span className="text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</span>
            </div>
            {r.comment && <p className="mt-2 text-sm leading-relaxed text-slate-600">{r.comment}</p>}
          </div>
          <Button
            size="sm"
            variant="outline"
            className="shrink-0 border-rose-200 text-rose-600 hover:bg-rose-50"
            onClick={() => remove(r.id)}
          >
            {t('adm.delete')}
          </Button>
        </div>
      ))}
    </div>
  )
}
