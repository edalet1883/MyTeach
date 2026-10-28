'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getCategoryName, useT } from '@/lib/i18n'
import { useApp, Lang } from '@/lib/store'
import { StarRating } from './star-rating'
import { SubjectIcon } from './subject-icon'
import { cn } from '@/lib/utils'
import { api } from '@/lib/api'
import { toast } from '@/hooks/use-toast'

export interface TeacherCardData {
  id: string
  name: string
  surname: string
  bio?: string | null
  experienceYears: number
  pricePerHour: number
  subject: { id: string; nameAz: string; nameEn: string; nameRu: string } | null
  sector?: { id: string; nameAz: string; nameEn: string; nameRu: string } | null
  purpose?: { id: string; nameAz: string; nameEn: string; nameRu: string } | null
  city: { id: string; nameAz: string; nameEn: string; nameRu: string } | null
  lessonFormats?: string
  verified?: boolean
  avgRating: number
  reviewCount: number
  emailVerified?: boolean
}

const AVATAR_COLORS = [
  'bg-emerald-600',
  'bg-teal-600',
  'bg-cyan-700',
  'bg-emerald-700',
  'bg-teal-700',
  'bg-amber-600',
]

function avatarColor(id: string) {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) % 997
  return AVATAR_COLORS[hash % AVATAR_COLORS.length]
}

export function TeacherCard({
  teacher,
  favorited,
  onToggleFavorite,
}: {
  teacher: TeacherCardData
  favorited?: boolean
  onToggleFavorite?: (id: string) => void
}) {
  const t = useT()
  const lang = useApp((s) => s.lang)
  const navigate = useApp((s) => s.navigate)
  const user = useApp((s) => s.user)
  const initials = `${teacher.name?.[0] ?? ''}${teacher.surname?.[0] ?? ''}`.toUpperCase()

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user) {
      toast({ title: t('toast.loginForFavorites') })
      return
    }
    onToggleFavorite?.(teacher.id)
  }

  return (
    <div
      className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100/60"
      onClick={() => navigate('teacher-detail', { teacherId: teacher.id })}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate('teacher-detail', { teacherId: teacher.id })}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white',
              avatarColor(teacher.id)
            )}
            aria-hidden="true"
          >
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-semibold text-slate-900">
              <span className="line-clamp-1">
                {teacher.name} {teacher.surname}
              </span>
              {teacher.emailVerified && (
                <span
                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100"
                  title={t('tcard.verified')}
                  aria-label={t('tcard.verified')}
                >
                  <span className="css-check text-[10px] text-emerald-600" aria-hidden="true" />
                </span>
              )}
            </div>
            <div className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-500">
              <SubjectIcon name={teacher.subject?.nameAz} size={16} />
              {getCategoryName(teacher.subject, lang as Lang) || t('cat.subjects')}
            </div>
          </div>
        </div>
        <button
          onClick={handleFavorite}
          className="rounded-full p-2 transition-colors hover:bg-rose-50"
          aria-label={favorited ? t('toast.favoriteRemoved') : t('toast.favoriteAdded')}
        >
          <span
            className={cn(
              'css-heart text-lg leading-none transition-colors',
              favorited ? 'text-rose-500' : 'text-slate-300 group-hover:text-rose-300'
            )}
            aria-hidden="true"
          />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {teacher.city && (
          <Badge variant="secondary" className="bg-slate-100 text-slate-600">
            {getCategoryName(teacher.city, lang as Lang)}
          </Badge>
        )}
        {teacher.lessonFormats && (
          <Badge className="border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
            {teacher.lessonFormats === 'ONLINE'
              ? t('fmt.online')
              : teacher.lessonFormats === 'IN_PERSON'
                ? t('fmt.inPerson')
                : t('fmt.both')}
          </Badge>
        )}
        {teacher.sector && (
          <Badge variant="secondary" className="bg-slate-100 text-slate-600">
            {getCategoryName(teacher.sector, lang as Lang)}
          </Badge>
        )}
        {teacher.purpose && (
          <Badge variant="secondary" className="bg-slate-100 text-slate-600">
            {getCategoryName(teacher.purpose, lang as Lang)}
          </Badge>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-slate-600">
          {teacher.experienceYears} {t('tcard.years')}
        </span>
        <div className="text-right">
          <span className="text-xl font-bold text-emerald-700">{teacher.pricePerHour}</span>
          <span className="ml-0.5 text-sm text-slate-500">AZN{t('tcard.hour')}</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="flex items-center gap-1.5">
          <StarRating rating={teacher.avgRating} size={14} />
          <span className="text-sm font-medium text-slate-700">
            {teacher.avgRating > 0 ? teacher.avgRating.toFixed(1) : '—'}
          </span>
          <span className="text-xs text-slate-400">
            ({teacher.reviewCount})
          </span>
        </div>
        <Button
          size="sm"
          className="h-8 rounded-lg bg-emerald-600 text-xs hover:bg-emerald-700"
          tabIndex={-1}
        >
          {t('tcard.viewProfile')}
        </Button>
      </div>
    </div>
  )
}
