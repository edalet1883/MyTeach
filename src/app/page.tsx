'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/myteach/header'
import { Footer } from '@/components/myteach/footer'
import { LoginDialog } from '@/components/myteach/views/auth'
import { HomeView } from '@/components/myteach/views/home'
import { CategoriesView } from '@/components/myteach/views/categories'
import { TeachersView } from '@/components/myteach/views/teachers'
import { TeacherDetailView } from '@/components/myteach/views/teacher-detail'
import { ProfileView } from '@/components/myteach/views/profile'
import { AdminView } from '@/components/myteach/views/admin'
import { TeacherRegisterView } from '@/components/myteach/views/teacher-register'
import { StudentRegisterView } from '@/components/myteach/views/auth'
import {
  AboutView,
  ContactView,
  FaqView,
  HowItWorksView,
} from '@/components/myteach/views/info'
import { useApp, AppUser } from '@/lib/store'
import { useT } from '@/lib/i18n'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'

function ViewRouter() {
  const view = useApp((s) => s.view)
  switch (view) {
    case 'home':
      return <HomeView />
    case 'categories':
      return <CategoriesView />
    case 'teachers':
      return <TeachersView />
    case 'teacher-detail':
      return <TeacherDetailView />
    case 'profile':
      return <ProfileView />
    case 'admin':
      return <AdminView />
    case 'teacher-register':
      return <TeacherRegisterView />
    case 'student-register':
      return <StudentRegisterView />
    case 'how-it-works':
      return <HowItWorksView />
    case 'faq':
      return <FaqView />
    case 'about':
      return <AboutView />
    case 'contact':
      return <ContactView />
    default:
      return <HomeView />
  }
}

export default function Page() {
  const t = useT()
  const { setUser, lang, setLang, navigate, setAuthOpen } = useApp()
  const [booted, setBooted] = useState(false)

  // İlk yükləmə: dil + sessiya + verify token
  useEffect(() => {
    const init = async () => {
      // 1) Dili localStorage-dan oxu
      const savedLang = localStorage.getItem('myteach-lang')
      if (savedLang === 'az' || savedLang === 'en' || savedLang === 'ru') {
        setLang(savedLang)
      }

      // 2) Email təsdiqi linki ilə gəlib?
      const params = new URLSearchParams(window.location.search)
      const verifyToken = params.get('verify')

      // 3) Sessiya yoxla
      try {
        const d = await api<{ user: AppUser | null }>('/api/auth/me')
        setUser(d.user)
      } catch {
        setUser(null)
      }

      if (verifyToken) {
        try {
          const v = await api<{ ok: boolean; role: string; message: string }>(
            `/api/auth/verify?token=${encodeURIComponent(verifyToken)}`
          )
          if (v.ok) {
            toast({ title: t('toast.verifySuccess') })
            // URL-i təmizlə
            window.history.replaceState({}, '', '/')
            if (v.role === 'TEACHER') {
              navigate('profile')
            }
          }
        } catch {
          toast({ title: t('toast.verifyFail'), variant: 'destructive' })
        }
      }

      setBooted(true)
    }
    init()
  }, [])

  if (!booted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
          <span className="text-sm font-medium text-slate-500">MyTeach</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-slate-50">
      <Header />
      <main className="flex-1">
        <ViewRouter />
      </main>
      <Footer />
      <LoginDialog />
    </div>
  )
}
