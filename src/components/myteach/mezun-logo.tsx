'use client'

// MyTeach — Mezun logosu (yəhərli keçəl papaq / graduation cap).
// SubjectIcon dəstinin default ikonu ilə eyni üslubdadır:
// stroke="currentColor" → ətrafındakı mətn rəngini alır,
// beləcə yaşıl qradiyent fon üzərində ağ, işıqlı fonda tünd görünür.
export function MezunLogo({
  size = 20,
  className,
}: {
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M22 9.5 12 4.5 2 9.5l10 5z" />
      <path d="M6 12v4.5c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V12" />
      <path d="M22 9.5V15" />
    </svg>
  )
}
