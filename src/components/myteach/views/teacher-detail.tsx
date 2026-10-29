'use client'

import { useCallback, useEffect, useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { useApp } from '@/lib/store'
import { useT, getCategoryName, DictKey } from '@/lib/i18n'
import { StarRating } from '@/components/myteach/star-rating'
import { SubjectIcon } from '@/components/myteach/subject-icon'
import { HeartIcon } from '@/components/myteach/heart-icon'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'

interface ReviewItem {
  id: string
  rating: number
  comment: string
  createdAt: string
  studentName: string
}

interface TeacherDetail {
  id: string
  name: string
  surname: string
  emailVerified: boolean
  bio: string | null
  experienceYears: number
  pricePerHour: number
  pricePeriod?: string
  subject: { id: string; nameAz: string; nameEn: string; nameRu: string } | null
  sector: { id: string; nameAz: string; nameEn: string; nameRu: string } | null
  purpose: { id: string; nameAz: string; nameEn: string; nameRu: string } | null
  city: { id: string; nameAz: string; nameEn: string; nameRu: string } | null
  lessonFormats: string
  diplomaVerified: boolean
  avgRating: number
  reviewCount: number
  contacts: { whatsapp: string | null; phone: string | null; email: string | null }
  reviews: ReviewItem[]
  memberSince: string
}

export function TeacherDetailView() {
  const t = useT()
  const lang = useApp((s) => s.lang)
  const { selectedTeacherId, navigate, user } = useApp()
  const [teacher, setTeacher] = useState<TeacherDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [reviewDialog, setReviewDialog] = useState(false)
  const [myRating, setMyRating] = useState(0)
  const [myComment, setMyComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [favorited, setFavorited] = useState(false)
  const [reportDialog, setReportDialog] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [reportComment, setReportComment] = useState('')
  const [reportSending, setReportSending] = useState(false)

  useEffect(() => {
    api<{ favorites: { teacherId: string }[] }>('/api/favorites')
      .then((d) => {
        if (selectedTeacherId) setFavorited(d.favorites.some((f) => f.teacherId === selectedTeacherId))
      })
      .catch(() => {})
  }, [selectedTeacherId])

  const toggleFavorite = async () => {
    if (!teacher) return
    try {
      const d = await api<{ favorited: boolean }>('/api/favorites', {
        method: 'POST',
        body: JSON.stringify({ teacherId: teacher.id }),
      })
      setFavorited(d.favorited)
    } catch {
      toast({ title: t('toast.loginForFavorites') })
    }
  }

  const load = useCallback(async () => {
    if (!selectedTeacherId) return
    setLoading(true)
    try {
      const d = await api<{ teacher: TeacherDetail }>(`/api/teachers/${selectedTeacherId}`)
      setTeacher(d.teacher)
    } catch {
      setTeacher(null)
    } finally {
      setLoading(false)
    }
  }, [selectedTeacherId])

  useEffect(() => {
    load()
  }, [load])

  const openReviewDialog = () => {
    if (!user) {
      toast({ title: t('tprof.loginToReview') })
      return
    }
    if (user.role !== 'STUDENT') {
      toast({ title: t('tprof.loginToReview') })
      return
    }
    setMyRating(0)
    setMyComment('')
    setReviewDialog(true)
  }

  const submitReview = async () => {
    if (!teacher || myRating < 1) return
    setSubmitting(true)
    try {
      await api('/api/reviews', {
        method: 'POST',
        body: JSON.stringify({ teacherId: teacher.id, rating: myRating, comment: myComment }),
      })
      toast({ title: t('tprof.reviewUpdated') })
      setReviewDialog(false)
      await load()
    } catch (e) {
      toast({ title: e instanceof Error ? e.message : t('common.error'), variant: 'destructive' })
    } finally {
      setSubmitting(false)
    }
  }

  const submitReport = async () => {
    if (!teacher || !reportReason) return
    setReportSending(true)
    try {
      await api('/api/reports', {
        method: 'POST',
        body: JSON.stringify({ teacherId: teacher.id, reason: reportReason, comment: reportComment }),
      })
      toast({ title: t('report.sent') })
      setReportDialog(false)
      setReportReason('')
      setReportComment('')
    } catch (e) {
      toast({ title: e instanceof Error ? e.message : t('common.error'), variant: 'destructive' })
    } finally {
      setReportSending(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <Skeleton className="h-10 w-44 rounded-lg" />
        <Skeleton className="mt-6 h-64 rounded-3xl" />
        <Skeleton className="mt-6 h-80 rounded-3xl" />
      </div>
    )
  }

  if (!teacher) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6">
        <p className="text-lg font-medium text-slate-700">{t('tprof.notFound')}</p>
        <Button className="mt-5 bg-emerald-600 hover:bg-emerald-700" onClick={() => navigate('teachers')}>
          {t('tprof.backToList')}
        </Button>
      </div>
    )
  }

  const initials = `${teacher.name[0]}${teacher.surname[0]}`

  // rating bölgüsü
  const breakdown = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: teacher.reviews.filter((r) => r.rating === stars).length,
  }))

  const waLink = teacher.contacts.whatsapp
    ? `https://wa.me/${teacher.contacts.whatsapp.replace(/[^0-9]/g, '')}`
    : null

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <Button variant="ghost" className="mb-5 text-slate-500" onClick={() => navigate('teachers')}>
        {t('tprof.backToList')}
      </Button>

      {/* Üst kart */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <div className="bg-emerald-700 bg-[linear-gradient(135deg,#047857_0%,#059669_52%,#0d9488_100%)] px-6 pb-16 pt-10 sm:px-10">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-emerald-50/95">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                <span className="css-check text-[10px] text-amber-300" aria-hidden="true" />
                {t('ver.teacher')}
              </span>
              {teacher.diplomaVerified && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/40 bg-amber-400/15 px-3 py-1 text-xs font-semibold text-amber-200 backdrop-blur">
                  <span className="css-check text-[10px]" aria-hidden="true" />
                  {t('ver.diplomaApproved')}
                </span>
              )}
              <span className="text-xs text-emerald-100/80">{t('hero.badge')}</span>
            </div>
            <button
              onClick={toggleFavorite}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur transition-colors hover:bg-white/20"
              aria-label={favorited ? t('toast.favoriteRemoved') : t('toast.favoriteAdded')}
            >
              <HeartIcon
                size={20}
                filled={favorited}
                className={favorited ? 'text-rose-400' : 'text-white'}
              />
            </button>
          </div>
        </div>
        <div className="-mt-12 px-6 pb-8 sm:px-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                <AvatarFallback className="bg-emerald-600 text-3xl font-bold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                    {teacher.name} {teacher.surname}
                  </h1>
                  {teacher.emailVerified && (
                    <span
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100"
                      title={t('tcard.verified')}
                      aria-label={t('tcard.verified')}
                    >
                      <span className="css-check text-xs text-emerald-600" aria-hidden="true" />
                    </span>
                  )}
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                  <span>{getCategoryName(teacher.city, lang)}</span>
                  <span className="text-slate-300">|</span>
                  <span>{getCategoryName(teacher.sector, lang) || '—'}</span>
                  <span className="text-slate-300">|</span>
                  <span>
                    {teacher.experienceYears} {t('tcard.years')}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-3xl font-extrabold text-emerald-700">
                {teacher.pricePerHour} <span className="text-base font-medium text-slate-500">AZN{t(`price.${teacher.pricePeriod ?? 'HOUR'}` as DictKey)}</span>
              </div>
              <div className="mt-1 text-xs text-slate-400">{t('treg.priceHint')}</div>
            </div>
          </div>

          {/* Kateqoriya nişanları */}
          <div className="mt-5 flex flex-wrap gap-2">
            {teacher.lessonFormats && (
              <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
                {teacher.lessonFormats === 'ONLINE'
                  ? t('fmt.online')
                  : teacher.lessonFormats === 'IN_PERSON'
                    ? t('fmt.inPerson')
                    : t('fmt.both')}
              </Badge>
            )}
            {teacher.subject && (
              <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                <SubjectIcon name={teacher.subject.nameAz} size={16} className="mr-1" />
                {getCategoryName(teacher.subject, lang)}
              </Badge>
            )}
            {teacher.sector && (
              <Badge variant="secondary">
                {getCategoryName(teacher.sector, lang)}
              </Badge>
            )}
            {teacher.purpose && (
              <Badge variant="secondary">
                {getCategoryName(teacher.purpose, lang)}
              </Badge>
            )}
            {teacher.city && (
              <Badge variant="secondary">
                {getCategoryName(teacher.city, lang)}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Sol — haqqında */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="text-lg font-bold text-slate-900">{t('tprof.about')}</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-600">
              {teacher.bio || '—'}
            </p>
            <Separator className="my-5" />
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-xs font-medium text-slate-500">{t('tprof.experience')}</div>
                <div className="mt-1.5 text-xl font-bold text-slate-900">
                  {teacher.experienceYears} {t('tcard.years')}
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-xs font-medium text-slate-500">{t('treg.price')}</div>
                <div className="mt-1.5 text-xl font-bold text-slate-900">{teacher.pricePerHour} AZN{t(`price.${teacher.pricePeriod ?? 'HOUR'}` as DictKey)}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-xs font-medium text-slate-500">{t('tprof.memberSince')}</div>
                <div className="mt-1.5 text-sm font-bold text-slate-900">
                  {new Date(teacher.memberSince).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Rəylər */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-slate-900">
                {t('tprof.reviews')}{' '}
                <span className="text-sm font-normal text-slate-400">({teacher.reviewCount})</span>
              </h2>
              <Button
                size="sm"
                className="bg-emerald-600 text-white hover:bg-emerald-700"
                onClick={openReviewDialog}
              >
                {t('tprof.writeReview')}
              </Button>
            </div>

            {teacher.reviewCount > 0 && (
              <div className="mt-5 flex flex-col gap-6 rounded-2xl bg-slate-50 p-5 sm:flex-row sm:items-center">
                <div className="text-center sm:w-36">
                  <div className="text-4xl font-extrabold text-slate-900">
                    {teacher.avgRating.toFixed(1)}
                  </div>
                  <StarRating rating={teacher.avgRating} className="mt-1.5 justify-center" />
                  <div className="mt-1 text-xs text-slate-500">{t('tprof.avgRating')}</div>
                </div>
                <div className="flex-1 space-y-1.5">
                  {breakdown.map((b) => (
                    <div key={b.stars} className="flex items-center gap-2 text-xs">
                      <span className="w-3 text-slate-500">{b.stars}</span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-amber-400"
                          style={{
                            width: `${teacher.reviewCount ? (b.count / teacher.reviewCount) * 100 : 0}%`,
                          }}
                        />
                      </div>
                      <span className="w-6 text-right text-slate-400">{b.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 space-y-4">
              {teacher.reviews.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                  <p className="text-sm font-medium text-slate-600">{t('tprof.noReviews')}</p>
                  <p className="mt-1 text-xs text-slate-400">{t('tprof.noReviewsDesc')}</p>
                </div>
              ) : (
                teacher.reviews.map((r) => (
                  <div key={r.id} className="rounded-2xl border border-slate-100 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-slate-200 text-xs font-bold text-slate-600">
                            {r.studentName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-slate-800">{r.studentName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StarRating rating={r.rating} size={13} />
                        <span className="text-xs text-slate-400">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {r.comment && (
                      <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{r.comment}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sağ — əlaqə */}
        <div className="space-y-6">
          <div className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-bold text-slate-900">{t('tprof.contact')}</h2>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{t('tprof.contactNote')}</p>

            {/* Ödəniş təhlükəsizliyi */}
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start gap-2.5">
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-400 text-xs font-black text-amber-900"
                  aria-hidden="true"
                >
                  !
                </span>
                <div>
                  <div className="text-sm font-bold text-amber-900">{t('safety.title')}</div>
                  <p className="mt-1 text-xs leading-relaxed text-amber-800">{t('safety.text')}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {waLink && (
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="block">
                  <Button className="h-12 w-full rounded-xl bg-[#25D366] font-semibold text-white hover:bg-[#1fb855]">
                    {t('tprof.whatsapp')}
                  </Button>
                </a>
              )}
              {teacher.contacts.phone && (
                <a href={`tel:${teacher.contacts.phone.replace(/\s/g, '')}`} className="block">
                  <Button className="h-12 w-full rounded-xl bg-emerald-600 font-semibold text-white hover:bg-emerald-700">
                    {teacher.contacts.phone}
                  </Button>
                </a>
              )}
              {teacher.contacts.email && (
                <a href={`mailto:${teacher.contacts.email}`} className="block">
                  <Button
                    variant="outline"
                    className="h-12 w-full rounded-xl border-slate-200 font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    {t('tprof.email')}
                  </Button>
                </a>
              )}
              {!waLink && !teacher.contacts.phone && !teacher.contacts.email && (
                <div className="rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-500">—</div>
              )}
            </div>
            <p className="mt-4 text-center text-xs text-slate-400">
              {t('tprof.reviewNote')}
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-3 w-full text-xs text-slate-400 hover:bg-rose-50 hover:text-rose-600"
              onClick={() => setReportDialog(true)}
            >
              {t('report.button')}
            </Button>
          </div>
        </div>
      </div>

      {/* Rəy yazma dialoqu */}
      <Dialog open={reviewDialog} onOpenChange={setReviewDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('tprof.writeReview')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm">{t('tprof.yourRating')}</Label>
              <div className="mt-2">
                <StarRating rating={myRating} size={30} onChange={setMyRating} />
              </div>
            </div>
            <div>
              <Label className="text-sm">{t('tprof.yourComment')}</Label>
              <Textarea
                className="mt-2 min-h-24"
                value={myComment}
                onChange={(e) => setMyComment(e.target.value)}
                placeholder="..."
              />
            </div>
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              disabled={myRating < 1 || submitting}
              onClick={submitReview}
            >
              {submitting ? '...' : t('tprof.submitReview')}
            </Button>
            <p className="text-center text-xs text-slate-400">{t('tprof.reviewNote')}</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Şikayət dialoqu */}
      <Dialog open={reportDialog} onOpenChange={setReportDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('report.title')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm">{t('report.reason')} *</Label>
              <div className="mt-2 space-y-2">
                {([
                  ['FAKE', t('report.reasonFake')],
                  ['PRICE', t('report.reasonPrice')],
                  ['OFFENSIVE', t('report.reasonOffensive')],
                  ['OTHER', t('report.reasonOther')],
                ] as const).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setReportReason(value)}
                    className={cn(
                      'w-full rounded-xl border px-4 py-2.5 text-left text-sm transition-colors',
                      reportReason === value
                        ? 'border-rose-400 bg-rose-50 font-semibold text-rose-700'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-sm">{t('report.comment')}</Label>
              <Textarea
                className="mt-2 min-h-20"
                value={reportComment}
                onChange={(e) => setReportComment(e.target.value)}
                placeholder="..."
              />
            </div>
            <Button
              className="w-full bg-rose-600 hover:bg-rose-700"
              disabled={!reportReason || reportSending}
              onClick={submitReport}
            >
              {reportSending ? '...' : t('report.submit')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
