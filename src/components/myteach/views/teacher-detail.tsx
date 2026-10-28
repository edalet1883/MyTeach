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
import { useT, getCategoryName } from '@/lib/i18n'
import { StarRating } from '@/components/myteach/star-rating'
import { SubjectIcon } from '@/components/myteach/subject-icon'
import { api } from '@/lib/api'
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
  subject: { id: string; nameAz: string; nameEn: string; nameRu: string } | null
  sector: { id: string; nameAz: string; nameEn: string; nameRu: string } | null
  purpose: { id: string; nameAz: string; nameEn: string; nameRu: string } | null
  city: { id: string; nameAz: string; nameEn: string; nameRu: string } | null
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
        <div className="bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600 px-6 pb-16 pt-10 sm:px-10">
          <div className="flex items-center gap-2 text-emerald-100/90">
            {teacher.emailVerified && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                <span className="css-check text-[10px] text-amber-300" aria-hidden="true" />
              </span>
            )}
            <span className="text-sm font-medium">{t('tcard.verified')}</span>
            <span className="mx-1">•</span>
            <span className="text-sm">{t('hero.badge')}</span>
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
                {teacher.pricePerHour} <span className="text-base font-medium text-slate-500">AZN{t('tcard.hour')}</span>
              </div>
              <div className="mt-1 text-xs text-slate-400">{t('treg.priceHint')}</div>
            </div>
          </div>

          {/* Kateqoriya nişanları */}
          <div className="mt-5 flex flex-wrap gap-2">
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
                <div className="mt-1.5 text-xl font-bold text-slate-900">{teacher.pricePerHour} AZN</div>
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
                variant="outline"
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
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
    </div>
  )
}
