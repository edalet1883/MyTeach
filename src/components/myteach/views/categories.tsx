'use client'

import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useApp } from '@/lib/store'
import { useT, getCategoryName, Lang } from '@/lib/i18n'
import { api } from '@/lib/api'

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

const TILE_COLORS = [
  'bg-emerald-50 text-emerald-700',
  'bg-teal-50 text-teal-700',
  'bg-amber-50 text-amber-700',
  'bg-cyan-50 text-cyan-700',
  'bg-lime-50 text-lime-700',
  'bg-orange-50 text-orange-700',
]

export function CategoriesView() {
  const t = useT()
  const lang = useApp((s) => s.lang)
  const navigate = useApp((s) => s.navigate)
  const setFilters = useApp((s) => s.setFilters)
  const [cats, setCats] = useState<CategoriesResponse | null>(null)

  useEffect(() => {
    api<CategoriesResponse>('/api/categories').then(setCats).catch(() => {})
  }, [])

  const pick = (key: 'subjectId' | 'sectorId' | 'purposeId' | 'cityId', id: string) => {
    setFilters({ [key]: id } as never)
    navigate('teachers')
  }

  const groups: {
    key: 'subjects' | 'sectors' | 'purposes' | 'cities'
    label: string
  }[] = [
    { key: 'subjects', label: t('cat.subjects') },
    { key: 'sectors', label: t('cat.sectors') },
    { key: 'purposes', label: t('cat.purposes') },
    { key: 'cities', label: t('cat.cities') },
  ]

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('cat.title')}</h1>
        <p className="mt-2 text-sm text-slate-500 sm:text-base">{t('cat.subtitle')}</p>
      </div>

      {!cats ? (
        <div className="mt-10 space-y-4">
          <Skeleton className="h-10 w-96 rounded-lg" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-2xl" />
            ))}
          </div>
        </div>
      ) : (
        <Tabs defaultValue="subjects" className="mt-10">
          <TabsList className="mx-auto flex h-11 w-full max-w-xl rounded-xl bg-slate-100 p-1">
            {groups.map((g) => (
              <TabsTrigger
                key={g.key}
                value={g.key}
                className="flex-1 rounded-lg text-xs font-medium sm:text-sm"
              >
                <span className="hidden sm:inline">{g.label}</span>
                <span className="sm:hidden">{g.label.split(' ')[0]}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {groups.map((g) => (
            <TabsContent key={g.key} value={g.key} className="mt-8">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {cats[g.key].map((c, i) => (
                  <button
                    key={c.id}
                    onClick={() => pick(g.key === 'subjects' ? 'subjectId' : g.key === 'sectors' ? 'sectorId' : g.key === 'purposes' ? 'purposeId' : 'cityId', c.id)}
                    className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base font-bold ${
                        TILE_COLORS[i % TILE_COLORS.length]
                      }`}
                      aria-hidden="true"
                    >
                      {getCategoryName(c, lang as Lang).charAt(0).toUpperCase()}
                    </span>
                    <span className="text-sm font-medium text-slate-700 group-hover:text-emerald-700">
                      {getCategoryName(c, lang)}
                    </span>
                  </button>
                ))}
                {cats[g.key].length === 0 && (
                  <div className="col-span-full rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-400">
                    —
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  )
}
