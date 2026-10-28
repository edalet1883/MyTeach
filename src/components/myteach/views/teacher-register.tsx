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
import { useT, getCategoryName } from '@/lib/i18n'
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
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-lg font-extrabold text-white">
          MT
        </div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">{t('treg.title')}</h1>
        <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">{t('treg.subtitle')}</p>
        <div className="mt-4 inline-flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-slate-600">
            1. {t('how.stage1')}
          </span>
          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-slate-600">
            2. {t('how.stage2')}
          </span>
        </div>
      </div>

      <div className="mt-8 space-y-5">
        {/* Şəxsi məlumatlar */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7">
          <h2 className="font-semibold text-slate-900">{t('treg.sectionPersonal')}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="tr-name">{t('auth.name')} *</Label>
              <Input id="tr-name" className="mt-1.5" value={form.name} onChange={set('name')} />
            </div>
            <div>
              <Label htmlFor="tr-surname">{t('auth.surname')} *</Label>
              <Input id="tr-surname" className="mt-1.5" value={form.surname} onChange={set('surname')} />
            </div>
            <div>
              <Label htmlFor="tr-email">{t('auth.email')} *</Label>
              <Input
                id="tr-email"
                type="email"
                className="mt-1.5"
                placeholder="example@gmail.com"
                value={form.email}
                onChange={set('email')}
              />
            </div>
            <div>
              <Label htmlFor="tr-phone">{t('auth.phone')} *</Label>
              <Input
                id="tr-phone"
                className="mt-1.5"
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
                className="mt-1.5"
                value={form.password}
                onChange={set('password')}
              />
            </div>
            <div>
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
                className="mt-1.5 flex h-9 w-full items-center rounded-md border border-input bg-transparent px-3 text-sm text-slate-600 transition-colors hover:bg-slate-50"
              >
                <span className="truncate">
                  {diplomaName || t('treg.chooseFile')}
                </span>
              </button>
              <p className="mt-1 text-xs text-slate-400">{t('treg.diplomaHint')}</p>
            </div>
          </div>
        </section>

        {/* Peşəkar məlumatlar */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7">
          <h2 className="font-semibold text-slate-900">{t('treg.sectionProfessional')}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
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
                className="mt-1.5"
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
                className="mt-1.5"
                placeholder="20"
                value={form.pricePerHour}
                onChange={set('pricePerHour')}
              />
              <p className="mt-1 text-xs text-slate-400">{t('treg.priceHint')}</p>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="tr-bio">{t('treg.bio')}</Label>
              <Textarea
                id="tr-bio"
                className="mt-1.5 min-h-24"
                placeholder={t('treg.bioPlaceholder')}
                value={form.bio}
                onChange={set('bio')}
              />
            </div>
          </div>
        </section>

        {/* Əlaqə üsulları */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7">
          <h2 className="font-semibold text-slate-900">{t('treg.sectionContactPref')}</h2>
          <p className="mt-1 text-xs text-slate-500">{t('treg.contactPrefHint')}</p>
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
          className="w-full rounded-xl bg-emerald-600 py-6 text-base font-semibold hover:bg-emerald-700"
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
