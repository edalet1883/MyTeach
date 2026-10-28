'use client'

import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useApp } from '@/lib/store'
import { useT, getCategoryName } from '@/lib/i18n'
import { TeacherCard, TeacherCardData } from '@/components/myteach/teacher-card'
import { SubjectIcon } from '@/components/myteach/subject-icon'
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

export function TeachersView() {
  const t = useT()
  const lang = useApp((s) => s.lang)
  const { filters, setFilters, resetFilters, user } = useApp()
  const [cats, setCats] = useState<CategoriesResponse | null>(null)
  const [teachers, setTeachers] = useState<TeacherCardData[]>([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [filterOpen, setFilterOpen] = useState(false)

  useEffect(() => {
    api<CategoriesResponse>('/api/categories').then(setCats).catch(() => {})
  }, [])

  const loadFavorites = useCallback(() => {
    if (!user) {
      setFavorites(new Set())
      return
    }
    api<{ favorites: { teacherId: string }[] }>('/api/favorites')
      .then((d) => setFavorites(new Set(d.favorites.map((f) => f.teacherId))))
      .catch(() => {})
  }, [user])

  useEffect(() => {
    loadFavorites()
  }, [loadFavorites])

  const loadTeachers = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filters.subjectId) params.set('subjectId', filters.subjectId)
    if (filters.sectorId) params.set('sectorId', filters.sectorId)
    if (filters.purposeId) params.set('purposeId', filters.purposeId)
    if (filters.cityId) params.set('cityId', filters.cityId)
    if (filters.search) params.set('search', filters.search)
    if (filters.minPrice) params.set('minPrice', filters.minPrice)
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
    params.set('sort', filters.sort)
    try {
      const d = await api<{ teachers: TeacherCardData[] }>(`/api/teachers?${params.toString()}`)
      setTeachers(d.teachers)
    } catch {
      setTeachers([])
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    loadTeachers()
  }, [loadTeachers])

  const toggleFavorite = async (teacherId: string) => {
    try {
      const d = await api<{ favorited: boolean }>('/api/favorites', {
        method: 'POST',
        body: JSON.stringify({ teacherId }),
      })
      setFavorites((prev) => {
        const next = new Set(prev)
        if (d.favorited) next.add(teacherId)
        else next.delete(teacherId)
        return next
      })
    } catch {
      // qonaq üçün toast teacher-card-da göstərilir
    }
  }

  const renderFilterPanel = () => (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="font-semibold text-slate-900">
          {t('teachers.filters')}
        </div>
        <Button variant="ghost" size="sm" className="h-7 text-xs text-slate-500" onClick={resetFilters}>
          {t('teachers.clearFilters')}
        </Button>
      </div>

      <div>
        <Label className="text-xs font-medium text-slate-500">{t('cat.subjects')}</Label>
        <Select value={filters.subjectId || 'all'} onValueChange={(v) => setFilters({ subjectId: v === 'all' ? '' : v })}>
          <SelectTrigger className="mt-1.5">
            <SelectValue placeholder={t('treg.selectPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('common.all')}</SelectItem>
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
        <Label className="text-xs font-medium text-slate-500">{t('cat.sectors')}</Label>
        <Select value={filters.sectorId || 'all'} onValueChange={(v) => setFilters({ sectorId: v === 'all' ? '' : v })}>
          <SelectTrigger className="mt-1.5">
            <SelectValue placeholder={t('treg.selectPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('common.all')}</SelectItem>
            {cats?.sectors.map((s) => (
              <SelectItem key={s.id} value={s.id}>{getCategoryName(s, lang)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-xs font-medium text-slate-500">{t('cat.purposes')}</Label>
        <Select value={filters.purposeId || 'all'} onValueChange={(v) => setFilters({ purposeId: v === 'all' ? '' : v })}>
          <SelectTrigger className="mt-1.5">
            <SelectValue placeholder={t('treg.selectPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('common.all')}</SelectItem>
            {cats?.purposes.map((p) => (
              <SelectItem key={p.id} value={p.id}>{getCategoryName(p, lang)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-xs font-medium text-slate-500">{t('cat.cities')}</Label>
        <Select value={filters.cityId || 'all'} onValueChange={(v) => setFilters({ cityId: v === 'all' ? '' : v })}>
          <SelectTrigger className="mt-1.5">
            <SelectValue placeholder={t('treg.selectPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('common.all')}</SelectItem>
            {cats?.cities.map((c) => (
              <SelectItem key={c.id} value={c.id}>{getCategoryName(c, lang)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs font-medium text-slate-500">{t('teachers.minPrice')}</Label>
          <Input
            type="number"
            className="mt-1.5"
            placeholder="0"
            value={filters.minPrice}
            onChange={(e) => setFilters({ minPrice: e.target.value })}
          />
        </div>
        <div>
          <Label className="text-xs font-medium text-slate-500">{t('teachers.maxPrice')}</Label>
          <Input
            type="number"
            className="mt-1.5"
            placeholder="100"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ maxPrice: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label className="text-xs font-medium text-slate-500">{t('teachers.sort')}</Label>
        <Select value={filters.sort} onValueChange={(v) => setFilters({ sort: v as never })}>
          <SelectTrigger className="mt-1.5">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">{t('teachers.sortRating')}</SelectItem>
            <SelectItem value="priceAsc">{t('teachers.sortPriceAsc')}</SelectItem>
            <SelectItem value="priceDesc">{t('teachers.sortPriceDesc')}</SelectItem>
            <SelectItem value="experience">{t('teachers.sortExperience')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('teachers.title')}</h1>
        <p className="mt-2 text-sm text-slate-500 sm:text-base">{t('teachers.subtitle')}</p>
      </div>

      {/* Axtarış xətti */}
      <div className="mx-auto mt-7 flex max-w-2xl gap-2">
        <Input
          className="h-11 rounded-xl border-slate-200"
          placeholder={t('teachers.searchPlaceholder')}
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
        />
        <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="h-11 rounded-xl lg:hidden">
              {t('teachers.filters')}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 overflow-y-auto">
            <SheetTitle className="sr-only">{t('teachers.filters')}</SheetTitle>
            <div className="mt-4">
              {renderFilterPanel()}
              <Button
                className="mt-5 w-full bg-emerald-600 hover:bg-emerald-700"
                onClick={() => setFilterOpen(false)}
              >
                {t('teachers.applyBtn')}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="mt-8 flex gap-8">
        {/* Sol panel — filtrlər (desktop) */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-5">
            {renderFilterPanel()}
          </div>
        </aside>

        {/* Müəllim siyahısı */}
        <div className="min-w-0 flex-1">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-slate-500">
              <span className="font-semibold text-slate-900">{loading ? '…' : teachers.length}</span>{' '}
              {t('teachers.found')}
            </span>
            <span className="text-sm text-slate-500">
              {t('teachers.sortRating')}
            </span>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-60 rounded-2xl" />
              ))}
            </div>
          ) : teachers.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-14 text-center">
              <p className="font-medium text-slate-700">{t('teachers.empty')}</p>
              <p className="mt-1 text-sm text-slate-500">{t('teachers.emptyDesc')}</p>
              <Button variant="outline" className="mt-5" onClick={resetFilters}>
                {t('teachers.clearFilters')}
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {teachers.map((teacher) => (
                <TeacherCard
                  key={teacher.id}
                  teacher={teacher}
                  favorited={favorites.has(teacher.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
