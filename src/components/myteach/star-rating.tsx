'use client'

import { cn } from '@/lib/utils'

/**
 * Ulduz reytinqi — SVG formalarla (bütün brauzerlərdə dəqiq görünür).
 * Interaktiv olduqda (onChange var) klik ilə qiymət seçilir.
 */
function StarSvg({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  )
}

export function StarRating({
  rating,
  size = 16,
  className,
  onChange,
}: {
  rating: number
  size?: number
  className?: string
  onChange?: (value: number) => void
}) {
  const interactive = typeof onChange === 'function'

  return (
    <div
      className={cn('inline-flex items-center gap-0.5 align-middle', className)}
      role={interactive ? 'radiogroup' : undefined}
      aria-label={`${rating} / 5`}
    >
      {[1, 2, 3, 4, 5].map((i) => {
        const fillPct = Math.max(0, Math.min(1, rating - (i - 1))) * 100
        const star = (
          <span
            className="relative inline-block shrink-0 align-middle leading-none"
            style={{ width: size, height: size }}
          >
            {/* boş (boz) ulduz */}
            <StarSvg size={size} className="absolute inset-0 text-slate-300" />
            {/* dolu (kəhrəba) örtük — üfüqi kəsilir */}
            <span
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${fillPct}%` }}
              aria-hidden="true"
            >
              <StarSvg size={size} className="block text-amber-400" />
            </span>
          </span>
        )

        if (!interactive) {
          return <span key={i}>{star}</span>
        }

        return (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={rating === i}
            aria-label={`${i} / 5`}
            onClick={() => onChange?.(i)}
            className="rounded transition-transform hover:scale-110"
          >
            {star}
          </button>
        )
      })}
    </div>
  )
}
