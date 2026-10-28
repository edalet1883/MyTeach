'use client'

import { cn } from '@/lib/utils'

/**
 * Ulduz reytinqi — saf CSS formalarla (ikon kitabxanası yoxdur).
 * Interaktiv olduqda (onChange var) klik ilə qiymət seçilir.
 */
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
      className={cn('flex items-center gap-0.5', className)}
      role={interactive ? 'radiogroup' : undefined}
      aria-label={`${rating} / 5`}
    >
      {[1, 2, 3, 4, 5].map((i) => {
        const fillPct = Math.max(0, Math.min(1, rating - (i - 1))) * 100
        const star = (
          <span
            className="relative inline-block shrink-0"
            style={{ width: size, height: size }}
          >
            {/* boş (boz) ulduz */}
            <span className="css-star absolute inset-0 bg-slate-300" aria-hidden="true" />
            {/* dolu (kəhrəba) örtük — üfüqi kəsilir */}
            <span
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${fillPct}%` }}
              aria-hidden="true"
            >
              <span className="css-star block bg-amber-400" style={{ width: size, height: size }} />
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
