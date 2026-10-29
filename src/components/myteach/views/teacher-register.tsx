'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useApp } from '@/lib/store'
import { useT, getCategoryName, DictKey } from '@/lib/i18n'
import { MezunArt } from '@/components/myteach/mezun-art'
import { SubjectIcon } from '@/components/myteach/subject-icon'
import { api } from '@/lib/api'
import { toast } from '@/hooks/use-toast'
import type { AppUser } from '@/lib/store'

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

export function TeacherRegisterView() {
  const t = useT()
  const lang = useApp((s) => s.lang)
  const { navigate, setUser } = useApp()
  const [cats, setCats] = useState<CategoriesResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [verifyUrl, setVerifyUrl] = useState<string | null>(null)
  const [diplomaName, setDiplomaName] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    password: '',
    experienceYears: '',
    pricePerHour: '',
    pricePeriod: 'HOUR',
    bio: '',
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
    lessonFormats: 'BOTH',
  })
  const [diploma, setDiploma] = useState<File | null>(null)

  useEffect(() => {
    api<CategoriesResponse>('/api/categories').then(setCats).catch(() => {})
  }, [])

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async () => {
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)))
    if (diploma) fd.append('diploma', diploma)

    setLoading(true)
    try {
      const d = await api<{ user: AppUser; verifyUrl: string }>('/api/auth/register-teacher', {
        method: 'POST',
        body: fd,
      })
      setUser(d.user)
      setVerifyUrl(d.verifyUrl)
    } catch (e) {
      toast({
        title: e instanceof Error ? e.message : t('common.error'),
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const valid =
    form.name &&
    form.surname &&
    form.email.includes('@') &&
    form.phone &&
    form.password.length >= 6 &&
    form.subjectId &&
    form.cityId &&
    form.pricePerHour

  if (verifyUrl) {
    return (
      <div className="mx-auto w-full max-w-md px-4 py-12 sm:px-6">
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
            <span className="css-check text-xl text-emerald-600" aria-hidden="true" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">{t('treg.success')}</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{t('treg.successDesc')}</p>
          <div className="mt-6 space-y-3">
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              onClick={() => (window.location.href = verifyUrl)}
            >
              {t('auth.openVerifyLink')}
            </Button>
            <Button variant="outline" className="w-full" onClick={() => navigate('profile')}>
              {t('nav.cabinet')}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
      {/* Başlıq kartı — yaşıl qradiyent */}
      <div className="relative overflow-hidden rounded-3xl bg-emerald-700 bg-[linear-gradient(135deg,#047857_0%,#059669_52%,#0d9488_100%)] px-6 py-9 text-center text-white sm:px-10">
        <MezunArt className="pointer-events-none absolute -right-10 -top-12 w-32 rotate-12 text-white/20 sm:w-40" />
        <MezunArt className="pointer-events-none absolute -bottom-10 -left-8 w-24 -rotate-12 text-white/10 sm:w-28" />
        <h1 className="relative text-2xl font-bold sm:text-3xl">{t('treg.title')}</h1>
        <p className="relative mx-auto mt-2 max-w-lg text-sm text-emerald-50/90">{t('treg.subtitle')}</p>
        <div className="relative mt-4 inline-flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-3 py-1">
            1. {t('how.stage1')}
          </span>
          <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-3 py-1">
            2. {t('how.stage2')}
          </span>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {/* 1 — Şəxsi məlumatlar */}
        <section className="rounded-3xl border border-slate-200/60 bg-white/70 p-6 shadow-lg shadow-slate-900/5 backdrop-blur-xl sm:p-7">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 bg-[linear-gradient(135deg,#10b981_0%,#0d9488_100%)] text-sm font-bold text-white">1</span>
            <div>
              <h2 className="font-semibold text-slate-900">{t('treg.sectionPersonal')}</h2>
              <p className="text-xs text-slate-400">{t('auth.name')}, {t('auth.email')}, {t('auth.phone')}</p>
            </div>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="tr-name">{t('auth.name')} *</Label>
              <Input id="tr-name" className="mt-1.5 bg-white/60" value={form.name} onChange={set('name')} />
            </div>
            <div>
              <Label htmlFor="tr-surname">{t('auth.surname')} *</Label>
              <Input id="tr-surname" className="mt-1.5 bg-white/60" value={form.surname} onChange={set('surname')} />
            </div>
            <div>
              <Label htmlFor="tr-email">{t('auth.email')} *</Label>
              <Input
                id="tr-email"
                type="email"
                className="mt-1.5 bg-white/60"
                placeholder="example@gmail.com"
                value={form.email}
                onChange={set('email')}
              />
            </div>
            <div>
              <Label htmlFor="tr-phone">{t('auth.phone')} *</Label>
              <Input
                id="tr-phone"
                className="mt-1.5 bg-white/60"
                placeholder="+994 50 123 45 67"
                value={form.phone}
                onChange={set('phone')}
              />
            </div>
            <div>
              <Label htmlFor="tr-password">{t('auth.password')} *</Label>
              <Input
                id="tr-password"
                type="password"
                className="mt-1.5 bg-white/60"
                value={form.password}
                onChange={set('password')}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="tr-diploma">{t('treg.diploma')}</Label>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) {
                    setDiploma(f)
                    setDiplomaName(f.name)
                  }
                }}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className={
                  diplomaName
                    ? 'mt-1.5 flex w-full items-center gap-3 rounded-2xl border-2 border-emerald-400 bg-emerald-50/60 px-4 py-3.5 text-left transition-colors hover:bg-emerald-50'
                    : 'mt-1.5 flex w-full flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/60 px-4 py-6 text-center transition-colors hover:border-emerald-400 hover:bg-emerald-50/40'
                }
              >
                {diplomaName ? (
                  <>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                      <span className="css-check text-sm text-emerald-600" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-slate-800">{diplomaName}</span>
                      <span className="block text-xs text-slate-400">{t('treg.chooseFile')}</span>
                    </span>
                  </>
                ) : (
                  <>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm">
                      <span className="text-lg" aria-hidden="true">＋</span>
                    </span>
                    <span className="text-sm font-medium text-slate-600">{t('treg.chooseFile')}</span>
                    <span className="text-xs text-slate-400">{t('treg.diplomaHint')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* 2 — Peşəkar məlumatlar */}
        <section className="rounded-3xl border border-slate-200/60 bg-white/70 p-6 shadow-lg shadow-slate-900/5 backdrop-blur-xl sm:p-7">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 bg-[linear-gradient(135deg,#10b981_0%,#0d9488_100%)] text-sm font-bold text-white">2</span>
            <div>
              <h2 className="font-semibold text-slate-900">{t('treg.sectionProfessional')}</h2>
              <p className="text-xs text-slate-400">{t('treg.subject')}, {t('treg.city')}, {t('treg.price')}</p>
            </div>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="tr-subject">{t('treg.subject')}</Label>
              <Select
                value={form.subjectId || undefined}
                onValueChange={(v) => setForm((f) => ({ ...f, subjectId: v }))}
              >
                <SelectTrigger id="tr-subject" className="mt-1.5">
                  <SelectValue placeholder={t('treg.selectPlaceholder')} />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {cats?.subjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      <span className="flex items-center gap-2">
                        <SubjectIcon name={s.nameAz} size={18} />
                        {getCategoryName(s, lang)}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tr-city">{t('treg.city')}</Label>
              <Select
                value={form.cityId || undefined}
                onValueChange={(v) => setForm((f) => ({ ...f, cityId: v }))}
              >
                <SelectTrigger id="tr-city" className="mt-1.5">
                  <SelectValue placeholder={t('treg.selectPlaceholder')} />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {cats?.cities.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {getCategoryName(c, lang)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tr-sector">{t('treg.sector')}</Label>
              <Select
                value={form.sectorId || undefined}
                onValueChange={(v) => setForm((f) => ({ ...f, sectorId: v }))}
              >
                <SelectTrigger id="tr-sector" className="mt-1.5">
                  <SelectValue placeholder={t('treg.selectPlaceholder')} />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {cats?.sectors.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {getCategoryName(s, lang)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tr-purpose">{t('treg.purpose')}</Label>
              <Select
                value={form.purposeId || undefined}
                onValueChange={(v) => setForm((f) => ({ ...f, purposeId: v }))}
              >
                <SelectTrigger id="tr-purpose" className="mt-1.5">
                  <SelectValue placeholder={t('treg.selectPlaceholder')} />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {cats?.purposes.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {getCategoryName(p, lang)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tr-exp">{t('treg.experience')} *</Label>
              <Input
                id="tr-exp"
                type="number"
                min="0"
                className="mt-1.5 bg-white/60"
                placeholder="5"
                value={form.experienceYears}
                onChange={set('experienceYears')}
              />
              <p className="mt-1 text-xs text-slate-400">{t('treg.experienceHint')}</p>
            </div>
            <div>
              <Label htmlFor="tr-price">{t('treg.price')} *</Label>
              <Input
                id="tr-price"
                type="number"
                min="0"
                className="mt-1.5 bg-white/60"
                placeholder="20"
                value={form.pricePerHour}
                onChange={set('pricePerHour')}
              />
              <p className="mt-1 text-xs text-slate-400">{t('treg.priceHint')}</p>
            </div>
            <div>
              <Label>{t('treg.pricePeriod')}</Label>
              <div className="mt-1.5 grid grid-cols-4 gap-1.5">
                {(['HOUR', 'DAY', 'MONTH', 'YEAR'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, pricePeriod: p }))}
                    className={
                      form.pricePeriod === p
                        ? 'rounded-xl border-2 border-emerald-600 bg-emerald-50 px-2 py-2.5 text-xs font-bold text-emerald-700'
                        : 'rounded-xl border border-slate-200 bg-white px-2 py-2.5 text-xs font-medium text-slate-500 transition-colors hover:border-emerald-300'
                    }
                  >
                    {t(`price.period.${p}` as DictKey).replace('/','')}
                  </button>
                ))}
              </div>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="tr-bio">{t('treg.bio')}</Label>
              <Textarea
                id="tr-bio"
                className="mt-1.5 min-h-24 bg-white/60"
                placeholder={t('treg.bioPlaceholder')}
                value={form.bio}
                onChange={set('bio')}
              />
            </div>
          </div>
        </section>

        {/* 3 — Dərs forması */}
        <section className="rounded-3xl border border-slate-200/60 bg-white/70 p-6 shadow-lg shadow-slate-900/5 backdrop-blur-xl sm:p-7">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 bg-[linear-gradient(135deg,#10b981_0%,#0d9488_100%)] text-sm font-bold text-white">3</span>
            <div>
              <h2 className="font-semibold text-slate-900">{t('fmt.label')}</h2>
              <p className="text-xs text-slate-400">{t('treg.contactPrefHint')}</p>
            </div>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {([
              ['ONLINE', t('fmt.online')],
              ['IN_PERSON', t('fmt.inPerson')],
              ['BOTH', t('fmt.both')],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setForm((f) => ({ ...f, lessonFormats: value }))}
                className={
                  form.lessonFormats === value
                    ? 'rounded-2xl border-2 border-emerald-600 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700'
                    : 'rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:border-emerald-300'
                }
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* 4 — Əlaqə üsulları */}
        <section className="rounded-3xl border border-slate-200/60 bg-white/70 p-6 shadow-lg shadow-slate-900/5 backdrop-blur-xl sm:p-7">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 bg-[linear-gradient(135deg,#10b981_0%,#0d9488_100%)] text-sm font-bold text-white">4</span>
            <div>
              <h2 className="font-semibold text-slate-900">{t('treg.sectionContactPref')}</h2>
              <p className="text-xs text-slate-400">{t('treg.contactPrefHint')}</p>
            </div>
          </div>
          <div className="mt-4 space-y-3.5">
            <div className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4">
              <Checkbox
                id="tr-wa"
                checked={form.showWhatsapp}
                onCheckedChange={(c) => setForm((f) => ({ ...f, showWhatsapp: !!c }))}
              />
              <div className="flex-1">
                <Label htmlFor="tr-wa" className="text-sm font-medium">
                  {t('treg.showWhatsapp')}
                </Label>
                {form.showWhatsapp && (
                  <Input
                    className="mt-2"
                    placeholder="+994 50 123 45 67"
                    value={form.whatsapp}
                    onChange={set('whatsapp')}
                  />
                )}
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4">
              <Checkbox
                id="tr-ph"
                checked={form.showPhone}
                onCheckedChange={(c) => setForm((f) => ({ ...f, showPhone: !!c }))}
              />
              <div className="flex-1">
                <Label htmlFor="tr-ph" className="text-sm font-medium">
                  {t('treg.showPhone')}
                </Label>
                {form.showPhone && (
                  <Input
                    className="mt-2"
                    placeholder="+994 50 123 45 67"
                    value={form.phoneContact}
                    onChange={set('phoneContact')}
                  />
                )}
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4">
              <Checkbox
                id="tr-em"
                checked={form.showEmail}
                onCheckedChange={(c) => setForm((f) => ({ ...f, showEmail: !!c }))}
              />
              <div className="flex-1">
                <Label htmlFor="tr-em" className="text-sm font-medium">
                  {t('treg.showEmail')}
                </Label>
                {form.showEmail && (
                  <Input
                    className="mt-2"
                    type="email"
                    placeholder="example@gmail.com"
                    value={form.emailContact}
                    onChange={set('emailContact')}
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        <Button
          size="lg"
          className="w-full rounded-xl bg-emerald-600 bg-[linear-gradient(135deg,#059669_0%,#0d9488_100%)] py-6 text-base font-semibold text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700"
          disabled={!valid || loading}
          onClick={submit}
        >
          {loading ? t('treg.submitting') : t('treg.submit')}
        </Button>
        <div className="text-center text-sm text-slate-500">
          {t('auth.haveAccount')}{' '}
          <button
            className="font-semibold text-emerald-700 hover:underline"
            onClick={() => useApp.getState().setAuthOpen('login')}
          >
            {t('auth.loginBtn')}
          </button>
        </div>
      </div>

      <Dialog open={!!verifyUrl} onOpenChange={() => {}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t('auth.verifyDialog')}
            </DialogTitle>
            <DialogDescription>{t('auth.verifyDialogText')}</DialogDescription>
          </DialogHeader>
          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            onClick={() => (window.location.href = verifyUrl!)}
          >
            {t('auth.openVerifyLink')}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
