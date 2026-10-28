'use client'

import { useCallback, useEffect, useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useApp, Lang, AppUser } from '@/lib/store'
import { useT, getCategoryName } from '@/lib/i18n'
import { TeacherCard } from '@/components/myteach/teacher-card'
import { StarRating } from '@/components/myteach/star-rating'
import { api } from '@/lib/api'
import { toast } from '@/hooks/use-toast'

interface CatItem {
  id: string
  nameAz: string
  nameEn: string
  nameRu: string
}

interface CategoriesResponse {
  subjects: CatItem[]
  sectors: CatItem[]
  purposes: CatItem[]
  cities: CatItem[]
}

interface FavItem {
  teacherId: string
  name: string
  surname: string
  experienceYears: number
  pricePerHour: number
  subject: CatItem | null
  sector: CatItem | null
  purpose: CatItem | null
  city: CatItem | null
  avgRating: number
  reviewCount: number
}

interface MyReview {
  id: string
  rating: number
  comment: string
  createdAt: string
  teacherId: string
  teacherName: string
  subject: CatItem | null
}

interface MyTeacherProfile {
  id: string
  bio: string | null
  experienceYears: number
  pricePerHour: number
  status: 'PENDING' | 'WAITING_ADMIN' | 'APPROVED' | 'REJECTED'
  subject: CatItem | null
  sector: CatItem | null
  purpose: CatItem | null
  city: CatItem | null
  whatsapp: string | null
  phoneContact: string | null
  emailContact: string | null
  showWhatsapp: boolean
  showPhone: boolean
  showEmail: boolean
  avgRating: number
  reviewCount: number
  diplomaUrl: string | null
}

export function ProfileView() {
  const t = useT()
  const lang = useApp((s) => s.lang)
  const { user, navigate, setAuthOpen } = useApp()

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center sm:px-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-xl font-bold text-slate-400">
          MT
        </div>
        <h1 className="mt-5 text-xl font-bold text-slate-900">{t('cab.loginRequired')}</h1>
        <p className="mt-2 text-sm text-slate-500">{t('cab.loginRequiredDesc')}</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setAuthOpen('login')}>
            {t('nav.login')}
          </Button>
          <Button variant="outline" onClick={() => navigate('student-register')}>
            {t('auth.registerStudent')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      {/* Ümumi məlumat kartı */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-emerald-600 text-xl font-bold text-white">
                {user.name[0]}
                {user.surname[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                {user.name} {user.surname}
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                <span>{user.email}</span>
                {user.emailVerified ? (
                  <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
                    {t('cab.emailVerified')}
                  </Badge>
                ) : (
                  <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50">
                    {t('cab.emailNotVerified')}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Badge className="w-fit bg-slate-900 px-3.5 py-1.5 text-sm text-white hover:bg-slate-900">
            {user.role === 'ADMIN' ? t('cab.admin') : user.role === 'TEACHER' ? t('cab.teacher') : t('cab.student')}
          </Badge>
        </div>
      </div>

      {user.role === 'ADMIN' ? (
        <AdminCabinet />
      ) : user.role === 'TEACHER' ? (
        <TeacherCabinet />
      ) : (
        <StudentCabinet />
      )}
    </div>
  )
}

// ── Şagird kabineti ──
function StudentCabinet() {
  const t = useT()
  const lang = useApp((s) => s.lang)
  const navigate = useApp((s) => s.navigate)
  const [favorites, setFavorites] = useState<FavItem[]>([])
  const [myReviews, setMyReviews] = useState<MyReview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api<{ favorites: FavItem[] }>('/api/favorites').catch(() => ({ favorites: [] })),
      api<{ reviews: MyReview[] }>('/api/my-reviews').catch(() => ({ reviews: [] })),
    ])
      .then(([f, r]) => {
        setFavorites(f.favorites)
        setMyReviews(r.reviews)
      })
      .finally(() => setLoading(false))
  }, [])

  const toggleFavorite = async (teacherId: string) => {
    await api('/api/favorites', { method: 'POST', body: JSON.stringify({ teacherId }) }).catch(() => {})
    setFavorites((prev) => prev.filter((f) => f.teacherId !== teacherId))
  }

  return (
    <Tabs defaultValue="favorites" className="mt-6">
      <TabsList className="h-11 w-full max-w-md rounded-xl bg-slate-100 p-1">
        <TabsTrigger value="favorites" className="flex-1 rounded-lg">
          {t('cab.myFavorites')} ({favorites.length})
        </TabsTrigger>
        <TabsTrigger value="reviews" className="flex-1 rounded-lg">
          {t('cab.myReviews')} ({myReviews.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="favorites" className="mt-6">
        {loading ? (
          <div className="text-sm text-slate-400">{t('common.loading')}</div>
        ) : favorites.length === 0 ? (
          <EmptyState
            title={t('cab.noFavorites')}
            desc={t('cab.noFavoritesDesc')}
            action={
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => navigate('teachers')}>
                {t('cab.browseTeachers')}
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((f) => (
              <TeacherCard
                key={f.teacherId}
                teacher={{
                  id: f.teacherId,
                  name: f.name,
                  surname: f.surname,
                  experienceYears: f.experienceYears,
                  pricePerHour: f.pricePerHour,
                  subject: f.subject,
                  sector: f.sector,
                  purpose: f.purpose,
                  city: f.city,
                  avgRating: f.avgRating,
                  reviewCount: f.reviewCount,
                }}
                favorited
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="reviews" className="mt-6">
        {myReviews.length === 0 ? (
          <EmptyState
            title={t('cab.noReviewsYet')}
            desc={t('tprof.noReviewsDesc')}
            action={
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => navigate('teachers')}>
                {t('cab.browseTeachers')}
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {myReviews.map((r) => (
              <div
                key={r.id}
                className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-emerald-300"
                onClick={() => navigate('teacher-detail', { teacherId: r.teacherId })}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-medium text-slate-900">{r.teacherName}</span>
                    {r.subject && (
                      <span className="ml-2 text-sm text-slate-500">
                        — {getCategoryName(r.subject, lang as Lang)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <StarRating rating={r.rating} size={14} />
                    <span className="text-xs text-slate-400">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {r.comment && <p className="mt-2 text-sm text-slate-600">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}

// ── Müəllim kabineti ──
function TeacherCabinet() {
  const t = useT()
  const lang = useApp((s) => s.lang)
  const { user } = useApp()
  const navigate = useApp((s) => s.navigate)
  const [profile, setProfile] = useState<MyTeacherProfile | null>(null)
  const [emailVerified, setEmailVerified] = useState(false)
  const [verifyToken, setVerifyToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [cats, setCats] = useState<CategoriesResponse | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    bio: '',
    experienceYears: '',
    pricePerHour: '',
    subjectId: '',
    sectorId: '',
    purposeId: '',
    cityId: '',
    whatsapp: '',
    phoneContact: '',
    emailContact: '',
    showWhatsapp: false,
    showPhone: false,
    showEmail: false,
  })

  const load = useCallback(async () => {
    try {
      const d = await api<{
        emailVerified: boolean
        verifyToken: string | null
        profile: MyTeacherProfile | null
      }>('/api/teachers/apply')
      setEmailVerified(d.emailVerified)
      setVerifyToken(d.verifyToken)
      setProfile(d.profile)
      if (d.profile) {
        setForm({
          bio: d.profile.bio || '',
          experienceYears: String(d.profile.experienceYears),
          pricePerHour: String(d.profile.pricePerHour),
          subjectId: d.profile.subject?.id || '',
          sectorId: d.profile.sector?.id || '',
          purposeId: d.profile.purpose?.id || '',
          cityId: d.profile.city?.id || '',
          whatsapp: d.profile.whatsapp || '',
          phoneContact: d.profile.phoneContact || '',
          emailContact: d.profile.emailContact || '',
          showWhatsapp: d.profile.showWhatsapp,
          showPhone: d.profile.showPhone,
          showEmail: d.profile.showEmail,
        })
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
    api<CategoriesResponse>('/api/categories').then(setCats).catch(() => {})
  }, [load])

  const save = async () => {
    setSaving(true)
    try {
      await api('/api/teachers/apply', { method: 'PUT', body: JSON.stringify(form) })
      toast({ title: t('cab.saved') })
      setEditing(false)
      await load()
      // user statusunu yenilə (REJECTED → WAITING_ADMIN ola bilər)
      const me = await api<{ user: AppUser | null }>('/api/auth/me').catch(() => null)
      if (me?.user) useApp.getState().setUser(me.user)
    } catch (e) {
      toast({ title: e instanceof Error ? e.message : t('common.error'), variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="mt-6 text-sm text-slate-400">{t('common.loading')}</div>
  }

  const steps = [
    { label: t('tstat.step1'), done: true },
    { label: t('tstat.step2'), done: emailVerified },
    {
      label: t('tstat.step3'),
      done: profile?.status === 'APPROVED',
      active: profile?.status === 'WAITING_ADMIN',
    },
    { label: t('tstat.step4'), done: profile?.status === 'APPROVED' },
  ]

  return (
    <div className="mt-6 space-y-6">
      {/* Status kartı */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
        <h2 className="text-lg font-bold text-slate-900">{t('tstat.title')}</h2>
        {/* Addımlar */}
        <div className="mt-5 flex items-center">
          {steps.map((s, i) => (
            <div key={i} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                    s.done
                      ? 'bg-emerald-600 text-white'
                      : s.active
                        ? 'border-2 border-amber-400 bg-amber-50 text-amber-600'
                        : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {s.done ? <span className="css-check" aria-hidden="true" /> : i + 1}
                </div>
                <span className="mt-1.5 hidden max-w-24 text-center text-xs text-slate-500 sm:block">
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`mx-2 h-0.5 flex-1 rounded ${s.done ? 'bg-emerald-500' : 'bg-slate-200'}`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-700">
            {profile ? t(`tstat.${profile.status}` as never) : t('tstat.noProfile')}
          </p>
          {!emailVerified && verifyToken && (
            <Button
              size="sm"
              variant="outline"
              className="border-emerald-200 text-emerald-700"
              onClick={() => (window.location.href = `/?verify=${verifyToken}`)}
            >
              {t('cab.resendVerify')}
            </Button>
          )}
        </div>
        {profile && profile.status !== 'APPROVED' && (
          <p className="mt-3 text-xs text-slate-400">{t('tstat.pendingNote')}</p>
        )}
        {profile?.status === 'REJECTED' && (
          <Button size="sm" className="mt-3 bg-emerald-600 hover:bg-emerald-700" onClick={() => setEditing(true)}>
            {t('cab.editProfile')}
          </Button>
        )}
      </div>

      {/* Statistikalar */}
      {profile && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-xs font-medium text-slate-500">{t('tprof.avgRating')}</div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-2xl font-bold text-slate-900">
                {profile.avgRating > 0 ? profile.avgRating.toFixed(1) : '—'}
              </span>
              <StarRating rating={profile.avgRating} size={14} />
            </div>
            <div className="mt-1 text-xs text-slate-400">({profile.reviewCount} {t('tprof.reviews').toLowerCase()})</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-xs font-medium text-slate-500">{t('tprof.experience')}</div>
            <div className="mt-2 text-2xl font-bold text-slate-900">
              {profile.experienceYears} {t('tcard.years')}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-xs font-medium text-slate-500">{t('treg.price')}</div>
            <div className="mt-2 text-2xl font-bold text-slate-900">{profile.pricePerHour} AZN</div>
          </div>
        </div>
      )}

      {/* Profil məlumatları / redaktə */}
      {profile && !editing && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">{t('cab.myInfo')}</h2>
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              {t('cab.editProfile')}
            </Button>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <InfoRow label={t('cat.subjects')} value={getCategoryName(profile.subject, lang as Lang)} />
            <InfoRow label={t('cat.cities')} value={getCategoryName(profile.city, lang as Lang)} />
            <InfoRow label={t('cat.sectors')} value={getCategoryName(profile.sector, lang as Lang)} />
            <InfoRow label={t('cat.purposes')} value={getCategoryName(profile.purpose, lang as Lang)} />
          </div>
          <Separator className="my-5" />
          {profile.bio && <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">{profile.bio}</p>}
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.showWhatsapp && profile.whatsapp && (
              <Badge variant="secondary" className="gap-1.5">
                WhatsApp: {profile.whatsapp}
              </Badge>
            )}
            {profile.showPhone && (
              <Badge variant="secondary" className="gap-1.5">
                {t('tprof.call')}: {profile.phoneContact}
              </Badge>
            )}
            {profile.showEmail && (
              <Badge variant="secondary" className="gap-1.5">
                {t('tprof.email')}: {profile.emailContact}
              </Badge>
            )}
          </div>
        </div>
      )}

      {profile && editing && (
        <div className="rounded-3xl border border-emerald-200 bg-white p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-900">{t('cab.editProfile')}</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <Label>{t('cat.subjects')}</Label>
              <Select value={form.subjectId || undefined} onValueChange={(v) => setForm((f) => ({ ...f, subjectId: v }))}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder={t('treg.selectPlaceholder')} /></SelectTrigger>
                <SelectContent className="max-h-60">
                  {cats?.subjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{getCategoryName(s, lang as Lang)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t('cat.cities')}</Label>
              <Select value={form.cityId || undefined} onValueChange={(v) => setForm((f) => ({ ...f, cityId: v }))}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder={t('treg.selectPlaceholder')} /></SelectTrigger>
                <SelectContent className="max-h-60">
                  {cats?.cities.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{getCategoryName(c, lang as Lang)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t('cat.sectors')}</Label>
              <Select value={form.sectorId || undefined} onValueChange={(v) => setForm((f) => ({ ...f, sectorId: v }))}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder={t('treg.selectPlaceholder')} /></SelectTrigger>
                <SelectContent className="max-h-60">
                  {cats?.sectors.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{getCategoryName(s, lang as Lang)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t('cat.purposes')}</Label>
              <Select value={form.purposeId || undefined} onValueChange={(v) => setForm((f) => ({ ...f, purposeId: v }))}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder={t('treg.selectPlaceholder')} /></SelectTrigger>
                <SelectContent className="max-h-60">
                  {cats?.purposes.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{getCategoryName(p, lang as Lang)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t('treg.experience')}</Label>
              <Input
                type="number"
                className="mt-1.5"
                value={form.experienceYears}
                onChange={(e) => setForm((f) => ({ ...f, experienceYears: e.target.value }))}
              />
            </div>
            <div>
              <Label>{t('treg.price')}</Label>
              <Input
                type="number"
                className="mt-1.5"
                value={form.pricePerHour}
                onChange={(e) => setForm((f) => ({ ...f, pricePerHour: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2">
              <Label>{t('treg.bio')}</Label>
              <Textarea
                className="mt-1.5 min-h-24"
                value={form.bio}
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              />
            </div>
            <div>
              <Label>{t('treg.whatsappNumber')}</Label>
              <Input
                className="mt-1.5"
                value={form.whatsapp}
                onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
              />
            </div>
            <div>
              <Label>{t('auth.phone')}</Label>
              <Input
                className="mt-1.5"
                value={form.phoneContact}
                onChange={(e) => setForm((f) => ({ ...f, phoneContact: e.target.value }))}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="cb-wa"
                type="checkbox"
                className="h-4 w-4 accent-emerald-600"
                checked={form.showWhatsapp}
                onChange={(e) => setForm((f) => ({ ...f, showWhatsapp: e.target.checked }))}
              />
              <Label htmlFor="cb-wa" className="text-sm">{t('treg.showWhatsapp')}</Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="cb-ph"
                type="checkbox"
                className="h-4 w-4 accent-emerald-600"
                checked={form.showPhone}
                onChange={(e) => setForm((f) => ({ ...f, showPhone: e.target.checked }))}
              />
              <Label htmlFor="cb-ph" className="text-sm">{t('treg.showPhone')}</Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="cb-em"
                type="checkbox"
                className="h-4 w-4 accent-emerald-600"
                checked={form.showEmail}
                onChange={(e) => setForm((f) => ({ ...f, showEmail: e.target.checked }))}
              />
              <Label htmlFor="cb-em" className="text-sm">{t('treg.showEmail')}</Label>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <Button className="bg-emerald-600 hover:bg-emerald-700" disabled={saving} onClick={save}>
              {saving ? '...' : t('common.save')}
            </Button>
            <Button variant="outline" onClick={() => setEditing(false)}>
              {t('common.cancel')}
            </Button>
          </div>
        </div>
      )}

      {!profile && (
        <div className="rounded-3xl border border-dashed border-slate-300 p-10 text-center">
          <p className="text-sm text-slate-500">{t('tstat.noProfile')}</p>
        </div>
      )}
    </div>
  )
}

// ── Admin kabinet qısaldılmış görünüşü ──
function AdminCabinet() {
  const t = useT()
  const navigate = useApp((s) => s.navigate)
  const { user } = useApp()
  return (
    <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
        <span className="css-check text-lg text-emerald-600" aria-hidden="true" />
      </div>
      <p className="mt-3 text-sm text-slate-600">
        {user?.name}, {t('adm.subtitle')}
      </p>
      <Button className="mt-5 bg-emerald-600 hover:bg-emerald-700" onClick={() => navigate('admin')}>
        {t('nav.adminPanel')}
      </Button>
    </div>
  )
}

function InfoRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="text-xs font-medium text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-slate-800">{value || '—'}</div>
    </div>
  )
}

function EmptyState({
  title,
  desc,
  action,
}: {
  title: string
  desc: string
  action?: React.ReactNode
}) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center">
      <p className="font-medium text-slate-700">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{desc}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
