'use client'

// MyTeach — Mezun bədii qrafikası (dekorativ arxa fon "şəkli").
// MezunLogodan fərqli olaraq dolu (fill) formalarla çəkilir —
// küncdən yerləşdirilərək arxa fon şəkli kimi istifadə olunur.
// currentColor ilə rəng alır: text-white/15 kimi şəffaflıqla işlədilir.
export function MezunArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 240"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      {/* Yəhərli keçəl papaq — lövhə hissəsi */}
      <path d="M120 52 232 100l-112 48L8 100Z" />
      {/* Papağın başa geyinən hissəsi */}
      <path d="M62 121v30c0 14 26 25 58 25s58-11 58-25v-30l-58 26Z" />
      {/* Pərpənoq (tassel) — sap + ucu */}
      <rect x="228.5" y="102" width="7" height="40" rx="3.5" />
      <circle cx="232" cy="150" r="9" />
      {/* Ətrafda ulduzlar */}
      <path d="M30 28l3.4 8.6L42 40l-8.6 3.4L30 52l-3.4-8.6L18 40l8.6-3.4Z" />
      <path d="M210 25l2.5 6.5L219 34l-6.5 2.5L210 43l-2.5-6.5L201 34l6.5-2.5Z" />
      <path d="M26 188l2.2 5.8L34 196l-5.8 2.2L26 204l-2.2-5.8L18 196l5.8-2.2Z" />
      <path d="M214 168l2.8 7.2L224 178l-7.2 2.8L214 188l-2.8-7.2L204 178l7.2-2.8Z" />
    </svg>
  )
}
