'use client'

import { create } from 'zustand'

export type Lang = 'az' | 'en' | 'ru'
export type View =
  | 'home'
  | 'categories'
  | 'teachers'
  | 'teacher-detail'
  | 'profile'
  | 'admin'
  | 'how-it-works'
  | 'faq'
  | 'about'
  | 'contact'
  | 'teacher-register'
  | 'student-register'

export interface AppUser {
  id: string
  name: string
  surname: string
  email: string
  phone: string
  role: 'STUDENT' | 'TEACHER' | 'ADMIN'
  emailVerified: boolean
  teacherStatus: 'PENDING' | 'WAITING_ADMIN' | 'APPROVED' | 'REJECTED' | null
}

export interface Filters {
  subjectId: string
  sectorId: string
  purposeId: string
  cityId: string
  search: string
  sort: 'rating' | 'priceAsc' | 'priceDesc' | 'experience'
  minPrice: string
  maxPrice: string
  lessonFormat: '' | 'ONLINE' | 'IN_PERSON'
}

interface AppState {
  lang: Lang
  view: View
  selectedTeacherId: string | null
  user: AppUser | null
  authOpen: 'login' | 'student-register' | null
  verifyResult: { ok: boolean; role?: string } | null
  filters: Filters

  setLang: (l: Lang) => void
  navigate: (v: View, opts?: { teacherId?: string; resetFilters?: boolean }) => void
  setTeacher: (id: string) => void
  setUser: (u: AppUser | null) => void
  setAuthOpen: (o: 'login' | 'student-register' | null) => void
  setVerifyResult: (r: { ok: boolean; role?: string } | null) => void
  setFilters: (f: Partial<Filters>) => void
  resetFilters: () => void
}

const defaultFilters: Filters = {
  subjectId: '',
  sectorId: '',
  purposeId: '',
  cityId: '',
  search: '',
  sort: 'rating',
  minPrice: '',
  maxPrice: '',
  lessonFormat: '',
}

export const useApp = create<AppState>((set) => ({
  lang: 'az',
  view: 'home',
  selectedTeacherId: null,
  user: null,
  authOpen: null,
  verifyResult: null,
  filters: { ...defaultFilters },

  setLang: (lang) => {
    set({ lang })
    if (typeof window !== 'undefined') localStorage.setItem('myteach-lang', lang)
  },
  navigate: (view, opts) =>
    set((s) => ({
      view,
      selectedTeacherId: opts?.teacherId ?? (view === 'teacher-detail' ? s.selectedTeacherId : null),
      filters: opts?.resetFilters ? { ...defaultFilters } : s.filters,
      authOpen: null,
    })),
  setTeacher: (selectedTeacherId) => set({ selectedTeacherId }),
  setUser: (user) => set({ user }),
  setAuthOpen: (authOpen) => set({ authOpen }),
  setVerifyResult: (verifyResult) => set({ verifyResult }),
  setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f } })),
  resetFilters: () => set({ filters: { ...defaultFilters } }),
}))
