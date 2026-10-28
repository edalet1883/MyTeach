'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useApp } from '@/lib/store'
import { useT, getCategoryName } from '@/lib/i18n'
import { TeacherCard, TeacherCardData } from '@/components/myteach/teacher-card'
import { api } from '@/lib/api'

interface CategoriesResponse {
  subjects: { id: string; nameAz: string; nameEn: string; nameRu: string }[]
  sectors: { id: string; nameAz: string; nameEn: string; nameRu: string }[]
  purposes: { id: string; nameAz: string; nameEn: string; nameRu: string }[]
  cities: { id: string; nameAz: string; nameEn: string; nameRu: string }[]
}

// Kateqoriya kartları üçün rəng palitrası (baş hərf bloku)
const TILE_COLORS = [
  'bg-emerald-50 text-emerald-700',
  'bg-teal-50 text-teal-700',
  'bg-amber-50 text-amber-700',
  'bg-cyan-50 text-cyan-700',
  'bg-lime-50 text-lime-700',
  'bg-orange-50 text-orange-700',
]

export function HomeView() {
  const t = useT()
  const lang = useApp((s) => s.lang)
  const navigate = useApp((s) => s.navigate)
  const setFilters = useApp((s) => s.setFilters)
  const [cats, setCats] = useState<CategoriesResponse | null>(null)
  const [searchSubject, setSearchSubject] = useState('')
  const [searchCity, setSearchCity] = useState('')
  const [topTeachers, setTopTeachers] = useState<TeacherCardData[]>([])
  const [loadingTeachers, setLoadingTeachers] = useState(true)

  useEffect(() => {
    api<CategoriesResponse>('/api/categories').then(setCats).catch(() => {})
    api<{ teachers: TeacherCardData[] }>('/api/teachers')
      .then((d) => setTopTeachers(d.teachers.slice(0, 4)))
      .catch(() => {})
      .finally(() => setLoadingTeachers(false))
  }, [])

  const doSearch = () => {
    setFilters({ subjectId: searchSubject, cityId: searchCity })
    navigate('teachers')
  }

  const goToSubject = (subjectId: string) => {
    setFilters({ subjectId })
    navigate('teachers')
  }

  const stats = [
    { value: topTeachers.length > 0 ? `${topTeachers.length}+` : '—', label: t('hero.statTeachers') },
    { value: cats?.subjects.length ?? '—', label: t('hero.statSubjects') },
    { value: cats?.cities.length ?? '—', label: t('hero.statCities') },
    { value: '100%', label: t('hero.statFree') },
  ]

  const howSteps = [
    { titleKey: 'how.step1.title' as const, descKey: 'how.step1.desc' as const },
    { titleKey: 'how.step2.title' as const, descKey: 'how.step2.desc' as const },
    { titleKey: 'how.step3.title' as const, descKey: 'how.step3.desc' as const },
  ]

  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600">
        {/* dekorativ elementlər */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-teal-400/20 blur-3xl" aria-hidden="true" />
        <div
          className="pointer-events-none absolute right-8 top-6 hidden select-none text-[11rem] font-extrabold leading-none text-white/5 lg:block"
          aria-hidden="true"
        >
          MT
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-sm font-medium text-white backdrop-blur">
              {t('hero.badge')}
            </div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t('hero.title1')}{' '}
              <span className="text-amber-300">{t('hero.title2')}</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-emerald-50/90 sm:text-lg">
              {t('hero.subtitle')}
            </p>

            {/* Axtarış xətti */}
            <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-2 rounded-2xl bg-white p-2.5 shadow-xl shadow-emerald-900/20 sm:flex-row">
              <Select value={searchSubject} onValueChange={setSearchSubject}>
                <SelectTrigger className="w-full border-0 bg-slate-50 text-slate-700 focus:ring-2 focus:ring-emerald-500 sm:flex-[1.2]">
                  <SelectValue placeholder={t('hero.allSubjects')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('hero.allSubjects')}</SelectItem>
                  {cats?.subjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {getCategoryName(s, lang)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={searchCity} onValueChange={setSearchCity}>
                <SelectTrigger className="w-full border-0 bg-slate-50 text-slate-700 focus:ring-2 focus:ring-emerald-500 sm:flex-1">
                  <SelectValue placeholder={t('hero.allCities')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('hero.allCities')}</SelectItem>
                  {cats?.cities.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {getCategoryName(c, lang)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="lg"
                className="h-10 rounded-xl bg-emerald-600 px-6 font-semibold text-white hover:bg-emerald-700 sm:h-auto"
                onClick={doSearch}
              >
                {t('hero.searchBtn')}
              </Button>
            </div>

            {/* Populyar axtarışlar */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-emerald-100/80">
              <span>{t('hero.popularSearch')}</span>
              {(cats?.subjects.slice(0, 4) ?? []).map((s) => (
                <button
                  key={s.id}
                  onClick={() => goToSubject(s.id)}
                  className="rounded-full border border-white/25 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-white/15"
                >
                  {getCategoryName(s, lang)}
                </button>
              ))}
            </div>
          </div>

          {/* Statlar */}
          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((st, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/20 bg-white/10 p-4 text-center backdrop-blur"
              >
                <div className="text-2xl font-extrabold text-white">{st.value}</div>
                <div className="mt-1 text-xs text-emerald-50/80">{st.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Populyar fənlər ── */}
      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {t('cat.popularSubjects')}
            </h2>
            <p className="mt-1.5 text-sm text-slate-500">{t('cat.subtitle')}</p>
          </div>
          <Button
            variant="ghost"
            className="hidden text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 sm:inline-flex"
            onClick={() => navigate('categories')}
          >
            {t('cat.viewAll')}
          </Button>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {(cats?.subjects.slice(0, 12) ?? []).map((s, i) => (
            <button
              key={s.id}
              onClick={() => goToSubject(s.id)}
              className="group flex flex-col items-center gap-2.5 rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold transition-transform group-hover:scale-110 ${
                  TILE_COLORS[i % TILE_COLORS.length]
                }`}
                aria-hidden="true"
              >
                {getCategoryName(s, lang).charAt(0).toUpperCase()}
              </span>
              <span className="text-center text-sm font-medium text-slate-700 group-hover:text-emerald-700">
                {getCategoryName(s, lang)}
              </span>
            </button>
          ))}
          {!cats && Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
      </section>

      {/* ── Necə işləyir ── */}
      <section className="border-y border-slate-100 bg-slate-50/60">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {t('how.title')}
            </h2>
            <p className="mt-2 text-sm text-slate-500 sm:text-base">{t('how.subtitle')}</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {howSteps.map((step, i) => (
              <div key={i} className="relative rounded-2xl border border-slate-200 bg-white p-6">
                <div className="absolute -top-3 left-6 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                  {i + 1}
                </div>
                <h3 className="mt-2 font-semibold text-slate-900">{t(step.titleKey)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{t(step.descKey)}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Button variant="link" className="text-emerald-700" onClick={() => navigate('how-it-works')}>
              {t('nav.howItWorks')}
            </Button>
          </div>
        </div>
      </section>

      {/* ── Top müəllimlər ── */}
      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {t('nav.teachers')}
            </h2>
            <p className="mt-1.5 text-sm text-slate-500">{t('teachers.subtitle')}</p>
          </div>
          <Button
            variant="ghost"
            className="hidden text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 sm:inline-flex"
            onClick={() => navigate('teachers')}
          >
            {t('cat.viewAll')}
          </Button>
        </div>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {loadingTeachers
            ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-60 rounded-2xl" />)
            : topTeachers.map((teacher) => <TeacherCard key={teacher.id} teacher={teacher} />)}
          {!loadingTeachers && topTeachers.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-300 p-10 text-center">
              <p className="text-sm text-slate-500">{t('teachers.empty')}</p>
              <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700" onClick={() => navigate('teachers')}>
                {t('common.browseTeachers')}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* ── Müəllim CTA ── */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 px-6 py-12 text-center sm:px-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-emerald-500/20 blur-2xl" aria-hidden="true" />
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-lg font-extrabold text-white">
            MT
          </div>
          <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">{t('how.forTeachers')}</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
            {t('how.forTeachersDesc')}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              className="rounded-xl bg-emerald-500 px-7 font-semibold text-white hover:bg-emerald-600"
              onClick={() => navigate('teacher-register')}
            >
              {t('how.becomeTeacher')}
            </Button>
          </div>
          <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span className="rounded-full border border-slate-700 px-3 py-1">{t('how.stage1')}</span>
            <span className="rounded-full border border-slate-700 px-3 py-1">{t('how.stage2')}</span>
          </div>
        </div>
      </section>
    </div>
  )
}
