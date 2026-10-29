'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useApp, View } from '@/lib/store'
import { useT, DictKey } from '@/lib/i18n'
import { MezunLogo } from '@/components/myteach/mezun-logo'
import { cn } from '@/lib/utils'
import { api } from '@/lib/api'
import { toast } from '@/hooks/use-toast'

const LANGS: { code: 'az' | 'en' | 'ru'; label: string }[] = [
  { code: 'az', label: 'Azərbaycan' },
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
]

export function Header() {
  const t = useT()
  const { lang, setLang, user, view, navigate, setUser, setAuthOpen } = useApp()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Scroll ediləndə menyu yığılıb yarımşəffaf üzən pill formasına düşür
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navItems: { key: View; labelKey: DictKey }[] = [
    { key: 'home', labelKey: 'nav.home' },
    { key: 'categories', labelKey: 'nav.categories' },
    { key: 'teachers', labelKey: 'nav.teachers' },
    { key: 'how-it-works', labelKey: 'nav.howItWorks' },
    { key: 'faq', labelKey: 'nav.faq' },
    { key: 'about', labelKey: 'nav.about' },
    { key: 'contact', labelKey: 'nav.contact' },
  ]

  const handleLogout = async () => {
    await api('/api/auth/logout', { method: 'POST' })
    setUser(null)
    toast({ title: t('toast.logoutSuccess') })
    navigate('home')
  }

  const isActive = (v: View) => view === v

  const renderNavLinks = (mobile = false) => (
    <>
      {navItems.slice(0, mobile ? navItems.length : 5).map((item) => (
        <button
          key={item.key}
          onClick={() => {
            navigate(item.key)
            setMobileOpen(false)
          }}
          className={cn(
            'rounded-lg text-sm font-medium transition-colors',
            scrolled ? 'px-3 py-1.5' : 'px-3 py-2',
            isActive(item.key)
              ? 'bg-emerald-50 text-emerald-700'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          )}
        >
          {t(item.labelKey)}
        </button>
      ))}
    </>
  )

  return (
    <header
      className={cn(
        'pointer-events-none sticky top-0 z-40 w-full border-b transition-all duration-300',
        scrolled
          ? 'border-transparent px-3 pt-3 sm:px-4'
          : 'border-slate-200 bg-white/90 backdrop-blur-md'
      )}
    >
      <div
        className={cn(
          'pointer-events-auto mx-auto flex items-center justify-between gap-4 transition-all duration-300',
          scrolled
            ? 'h-12 max-w-6xl rounded-full border border-slate-200/60 bg-white/70 px-4 shadow-lg shadow-slate-900/5 backdrop-blur-xl sm:px-5'
            : 'h-16 max-w-7xl px-4 sm:px-6'
        )}
      >
        {/* Loqo — mezun (graduation cap) logosu */}
        <button
          className="flex items-center gap-2"
          onClick={() => navigate('home')}
          aria-label="MyTeach"
        >
          <div
            className={cn(
              'flex items-center justify-center rounded-xl bg-emerald-500 bg-[linear-gradient(135deg,#10b981_0%,#0d9488_100%)] text-white shadow-md shadow-emerald-200 transition-all duration-300',
              scrolled ? 'h-8 w-8' : 'h-9 w-9'
            )}
          >
            <MezunLogo size={scrolled ? 17 : 20} />
          </div>
          <div className="text-left">
            <div className="text-lg font-extrabold tracking-tight text-slate-900">
              My<span className="text-emerald-600">Teach</span>
            </div>
            <div className={scrolled ? 'hidden' : 'hidden text-[10px] leading-none text-slate-400 sm:block'}>
              {t('nav.tagline')}
            </div>
          </div>
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main navigation">
          {renderNavLinks()}
        </nav>

        {/* Sağ tərəf */}
        <div className="flex items-center gap-2">
          {/* Dil dəyişdirici */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1.5 rounded-lg border-slate-200">
                <span className="text-sm font-medium">
                  {lang.toUpperCase()}
                </span>
                <span className="css-chevron text-[10px] text-slate-400" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {LANGS.map((l) => (
                <DropdownMenuItem
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={cn(lang === l.code && 'bg-emerald-50 font-medium text-emerald-700')}
                >
                  {l.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-white pl-1 pr-3 transition-colors hover:bg-slate-50"
                  aria-label="User menu"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                    {user.name[0]}
                    {user.surname[0]}
                  </span>
                  <span className="hidden max-w-24 truncate text-sm font-medium text-slate-700 sm:block">
                    {user.name}
                  </span>
                  <span className="css-chevron text-[10px] text-slate-400" aria-hidden="true" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <div className="px-3 py-2">
                  <div className="text-sm font-semibold text-slate-900">
                    {user.name} {user.surname}
                  </div>
                  <div className="text-xs text-slate-500">{user.email}</div>
                  <div className="mt-1 inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                    {user.role === 'ADMIN' ? t('cab.admin') : user.role === 'TEACHER' ? t('cab.teacher') : t('cab.student')}
                  </div>
                </div>
                <DropdownMenuSeparator />
                {user.role === 'ADMIN' && (
                  <DropdownMenuItem onClick={() => navigate('admin')}>
                    {t('nav.adminPanel')}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => navigate('profile')}>
                  {t('nav.cabinet')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-rose-600 focus:text-rose-700">
                  {t('nav.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 rounded-lg text-sm font-medium text-slate-700"
                onClick={() => setAuthOpen('login')}
              >
                {t('nav.login')}
              </Button>
              <Button
                size="sm"
                className="h-9 rounded-lg bg-emerald-600 text-sm font-medium hover:bg-emerald-700"
                onClick={() => navigate('student-register')}
              >
                {t('nav.register')}
              </Button>
            </div>
          )}

          {/* Mobil menyu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg" aria-label="Menyu">
                <span className="css-bars text-slate-600" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 overflow-y-auto">
              <SheetTitle className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 bg-[linear-gradient(135deg,#10b981_0%,#0d9488_100%)] text-white">
                  <MezunLogo size={17} />
                </span>
                MyTeach
              </SheetTitle>
              <div className="mt-4 flex flex-col gap-1">
                {renderNavLinks(true)}
                {!user && (
                  <>
                    <div className="my-2 h-px bg-slate-100" />
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => {
                        setAuthOpen('login')
                        setMobileOpen(false)
                      }}
                    >
                      {t('nav.login')}
                    </Button>
                    <Button
                      className="justify-start bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => {
                        navigate('student-register')
                        setMobileOpen(false)
                      }}
                    >
                      {t('nav.register')}
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
