'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

// MyTeach minimalist line icon set (original SVG drawings, 24x24 grid).
// stroke="currentColor" -> icons inherit the surrounding text color,
// so they work on both dark tiles (white) and light backgrounds.

const ICONS: Record<string, ReactNode> = {
  english: (
    <>
      <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  <path d="M9.5 13 12 7.5 14.5 13" />
  <path d="M10.4 11.3h3.2" />
    </>
  ),
  german: (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </>
  ),
  math: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
  <path d="M8.5 7h7" />
  <path d="M8.5 12h.01" />
  <path d="M12 12h.01" />
  <path d="M15.5 12h.01" />
  <path d="M8.5 16h.01" />
  <path d="M12 16h.01" />
  <path d="M15.5 16h.01" />
    </>
  ),
  physics: (
    <>
      <circle cx="12" cy="12" r="1.1" />
  <ellipse cx="12" cy="12" rx="9" ry="3.6" />
  <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)" />
  <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)" />
    </>
  ),
  chemistry: (
    <>
      <path d="M9.5 3h5" />
  <path d="M10 3v5.2L4.9 17a2 2 0 0 0 1.7 3h10.8a2 2 0 0 0 1.7-3L14 8.2V3" />
  <path d="M7.6 14h8.8" />
    </>
  ),
  biology: (
    <>
      <path d="M4 20C4 10.5 10.5 4 20 4c0 9.5-6.5 16-16 16z" />
  <path d="M4 20c3.5-6 7.5-10 13-13" />
    </>
  ),
  informatics: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="2" />
  <path d="M8 20h8" />
  <path d="M12 16v4" />
    </>
  ),
  history: (
    <>
      <path d="M3 21h18" />
  <path d="M4 18h16" />
  <path d="M6 18v-9.5" />
  <path d="M10 18v-9.5" />
  <path d="M14 18v-9.5" />
  <path d="M18 18v-9.5" />
  <path d="M12 3 3.5 8.5h17z" />
    </>
  ),
  azerbaijani: (
    <>
      <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </>
  ),
  russian: (
    <>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </>
  ),
  turkish: (
    <>
      <path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z" />
  <path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z" />
    </>
  ),
  french: (
    <>
      <circle cx="12" cy="12" r="9" />
  <path d="M3 12h18" />
  <path d="M12 3a14.5 14.5 0 0 1 4 9 14.5 14.5 0 0 1-4 9 14.5 14.5 0 0 1-4-9 14.5 14.5 0 0 1 4-9z" />
    </>
  ),
  geography: (
    <>
      <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z" />
  <path d="M9 4v14" />
  <path d="M15 6v14" />
    </>
  ),
  default: (
    <>
      <path d="M22 9.5 12 4.5 2 9.5l10 5z" />
  <path d="M6 12v4.5c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V12" />
  <path d="M22 9.5V15" />
    </>
  ),
}

const NAME_MAP: Record<string, string> = {
  'İngilis dili': 'english',
  'Riyaziyyat': 'math',
  'Azərbaycan dili': 'azerbaijani',
  'Fizika': 'physics',
  'Kimya': 'chemistry',
  'Biologiya': 'biology',
  'Tarix': 'history',
  'Coğrafiya': 'geography',
  'Rus dili': 'russian',
  'İnformatika': 'informatics',
  'Alman dili': 'german',
  'Türk dili': 'turkish',
  'Fransız dili': 'french',
}


export function SubjectIcon({
  name,
  size = 24,
  className,
}: {
  name?: string | null
  size?: number
  className?: string
}) {
  const key = (name && NAME_MAP[name]) || 'default'
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn('inline-block shrink-0 select-none', className)}
    >
      {ICONS[key] ?? ICONS.default}
    </svg>
  )
}
