'use client'

import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useApp } from '@/lib/store'
import { useT, getCategoryName } from '@/lib/i18n'
import { SubjectIcon } from '@/components/myteach/subject-icon'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'

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

type GroupKey = 'subjects' | 'sectors' | 'purposes' | 'cities'
type FilterKey = 'subjectId' | 'sectorId' | 'purposeId' | 'cityId'

const STEPS: { group: GroupKey; filterKey: FilterKey }[] = [
  { group: 'subjects', filterKey: 'subjectId' },
  { group: 'sectors', filterKey: 'sectorId' },
  { group: 'purposes', filterKey: 'purposeId' },
  { group: 'cities', filterKey: 'cityId' },
]

export function CategoriesView() {
  const t = useT()
  const lang = useApp((s) => s.lang)
  const setFilters = useApp((s) => s.setFilters)
  const resetFilters = useApp((s) => s.resetFilters)
  const navigate = useApp((s) => s.navigate)
  const [cats, setCats] = useState<CategoriesResponse | null>(null)
  const [step, setStep] = useState(0)
  const [sel, setSel] = useState<Partial<Record<FilterKey, string>>>({})

  useEffect(() => {
    api<CategoriesResponse>('/api/categories').then(setCats).catch(() => {})
  }, [])

  const labels: Record<GroupKey, string> = {
    subjects: t('cat.subjects'),
    sectors: t('cat.sectors'),
    purposes: t('cat.purposes'),
    cities: t('cat.cities'),
  }

  // Birini seçən kimi növbəti addıma keçir — amma seçimlər itmir, Bitirə qədər axtarış başlamır
  const choose = (stepIdx: number, id: string) => {
    const fk = STEPS[stepIdx].filterKey
    const isSelect = sel[fk] !== id
    setSel((p) => ({ ...p, [fk]: isSelect ? id : undefined }))
    if (isSelect && stepIdx < STEPS.length - 1) setStep(stepIdx + 1)
  }

  // Bitir — bütün seçimlərə uyğun müəllimlər göstərilir
  const finish = () => {
    resetFilters()
    setFilters({
      subjectId: sel.subjectId ?? '',
      sectorId: sel.sectorId ?? '',
      purposeId: sel.purposeId ?? '',
      cityId: sel.cityId ?? '',
    })
    navigate('teachers')
  }

  const selectedChips = STEPS.filter((s) => sel[s.filterKey]).map((s) => {
    const item = cats?.[s.group].find((c) => c.id === sel[s.filterKey])
    return item ? getCategoryName(item, lang) : ''
  })

  const current = STEPS[step]

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('cat.title')}</h1>
        <p className="mt-2 text-sm text-slate-500 sm:text-base">{t('cat.selectHint')}</p>
      </div>

      {/* Addım göstəricisi — hər addıma klikləmək olar */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        {STEPS.map((s, i) => (
          <button
            key={s.group}
            onClick={() => setStep(i)}
            className={cn(
              'inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors sm:text-sm',
              i === step
                ? 'border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-200'
                : sel[s.filterKey]
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                  : 'border-slate-200 bg-white text-slate-500 hover:border-emerald-300'
            )}
          >
            <span
              className={cn(
                'flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold',
                i === step
                  ? 'bg-white/25 text-white'
                  : sel[s.filterKey]
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-500'
              )}
            >
              {sel[s.filterKey] && i !== step ? (
                <span className="css-check text-[9px]" aria-hidden="true" />
              ) : (
                i + 1
              )}
            </span>
            {labels[s.group]}
          </button>
        ))}
      </div>
      <div className="mt-2.5 text-center text-xs font-medium text-slate-400">
        {t('cat.step')} {step + 1}/{STEPS.length}
      </div>

      {!cats ? (
        <div className="mt-8 space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-2xl" />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Cari addımın seçimləri */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {cats[current.group].map((c) => {
              const active = sel[current.filterKey] === c.id
              return (
                <button
                  key={c.id}
                  onClick={() => choose(step, c.id)}
                  className={cn(
                    'group flex items-center gap-3 rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md',
                    active
                      ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-600/20'
                      : 'border-slate-200 bg-white hover:border-emerald-300'
                  )}
                >
                  {current.group === 'subjects' ? (
                    <span
                      className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white transition-transform group-hover:scale-110',
                        active ? 'bg-emerald-700' : 'bg-emerald-600'
                      )}
                      aria-hidden="true"
                    >
                      <SubjectIcon name={c.nameAz} size={22} />
                    </span>
                  ) : (
                    <span
                      className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-base font-bold transition-transform group-hover:scale-110',
                        active
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : 'border-slate-200 bg-white text-emerald-700'
                      )}
                      aria-hidden="true"
                    >
                      {getCategoryName(c, lang).charAt(0).toUpperCase()}
                    </span>
                  )}
                  <span
                    className={cn(
                      'min-w-0 flex-1 text-sm font-medium',
                      active ? 'text-emerald-800' : 'text-slate-700 group-hover:text-emerald-700'
                    )}
                  >
                    {getCategoryName(c, lang)}
                  </span>
                  {active && (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600">
                      <span className="css-check text-[10px] text-white" aria-hidden="true" />
                    </span>
                  )}
                </button>
              )
            })}
            {cats[current.group].length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-400">
                —
              </div>
            )}
          </div>

          {/* Alt panel — seçimlərin xülasəsi + Bitir düyməsi */}
          <div className="sticky bottom-4 mt-8">
            <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-4 shadow-lg shadow-slate-900/10 backdrop-blur-xl sm:p-5">
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  {selectedChips.length > 0 ? (
                    <>
                      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        {t('cat.yourSelections')}
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {selectedChips.map((chip, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"
                          >
                            {chip}
                          </span>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-slate-400">{t('cat.selectHint')}</p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {step > 0 && (
                    <Button
                      variant="outline"
                      className="rounded-xl"
                      onClick={() => setStep(step - 1)}
                    >
                      {t('cat.prevStep')}
                    </Button>
                  )}
                  <Button
                    size="lg"
                    className="rounded-xl bg-emerald-600 bg-[linear-gradient(135deg,#059669_0%,#0d9488_100%)] px-8 font-semibold text-white shadow-md shadow-emerald-200 hover:bg-emerald-700"
                    onClick={finish}
                  >
                    {t('cat.finish')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
