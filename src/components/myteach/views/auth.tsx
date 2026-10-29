'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useApp } from '@/lib/store'
import { useT, DictKey } from '@/lib/i18n'
import { MezunArt } from '@/components/myteach/mezun-art'
import { MezunLogo } from '@/components/myteach/mezun-logo'
import { api } from '@/lib/api'
import { toast } from '@/hooks/use-toast'
import type { AppUser } from '@/lib/store'

export function LoginDialog() {
  const { authOpen } = useApp()
  return (
    <>
      <LoginDialogInner open={authOpen === 'login'} />
      <StudentRegisterDialog open={authOpen === 'student-register'} />
    </>
  )
}

// Qeydiyyat səhifəsi üslubunda: yaşıl qradiyent başlıq kartı + şüşə form hissəsi
function LoginDialogInner({ open }: { open: boolean }) {
  const t = useT()
  const { setAuthOpen, setUser, navigate } = useApp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) return
    setLoading(true)
    try {
      const d = await api<{ user: AppUser }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      setUser(d.user)
      setAuthOpen(null)
      toast({ title: t('toast.loginSuccess') })
      if (d.user.role === 'ADMIN') navigate('admin')
      else navigate('profile')
    } catch (e) {
      toast({
        title: e instanceof Error ? e.message : t('common.error'),
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && setAuthOpen(null)}>
      <DialogContent className="max-h-[92vh] w-full gap-0 overflow-y-auto rounded-3xl border-slate-200/60 bg-white/70 p-0 shadow-xl shadow-slate-900/10 backdrop-blur-xl sm:max-w-md">
        <DialogHeader className="sr-only">
          <DialogTitle>{t('auth.loginTitle')}</DialogTitle>
          <DialogDescription>{t('auth.loginSubtitle')}</DialogDescription>
        </DialogHeader>

        {/* Yaşıl başlıq kartı */}
        <div className="relative overflow-hidden bg-emerald-700 bg-[linear-gradient(135deg,#047857_0%,#059669_52%,#0d9488_100%)] px-6 pb-8 pt-7 text-center text-white">
          <MezunArt className="pointer-events-none absolute -right-7 -top-9 w-28 rotate-12 text-white/20" />
          <MezunArt className="pointer-events-none absolute -bottom-9 -left-7 w-20 -rotate-12 text-white/10" />
          <div className="relative mx-auto flex h-11 w-11 items-center justify-center rounded-2xl border border-white/25 bg-white/15">
            <MezunLogo size={24} className="text-white" />
          </div>
          <h3 className="relative mt-3 text-xl font-bold">{t('auth.welcomeBack')}</h3>
          <p className="relative mx-auto mt-1.5 max-w-xs text-sm leading-relaxed text-emerald-50/90">
            {t('auth.loginSubtitle')}
          </p>
          <ul className="relative mt-4 space-y-1.5 text-left">
            {(['auth.benefit1', 'auth.benefit2', 'auth.benefit3'] as const).map((k) => (
              <li key={k} className="flex items-center gap-2 text-xs leading-snug text-emerald-50/95">
                <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-white/20">
                  <span className="css-check text-[9px] text-white" aria-hidden="true" />
                </span>
                {t(k as DictKey)}
              </li>
            ))}
          </ul>
        </div>

        {/* Şüşə form hissəsi */}
        <div className="p-6 sm:p-7">
          <div className="space-y-4">
            <div>
              <Label htmlFor="login-email">{t('auth.email')}</Label>
              <Input
                id="login-email"
                type="email"
                className="mt-1.5 h-11 rounded-xl bg-white/60"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <div>
              <Label htmlFor="login-password">{t('auth.password')}</Label>
              <Input
                id="login-password"
                type="password"
                className="mt-1.5 h-11 rounded-xl bg-white/60"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <Button
              className="h-11 w-full rounded-xl bg-emerald-600 bg-[linear-gradient(135deg,#059669_0%,#0d9488_100%)] font-semibold text-white shadow-md shadow-emerald-200 hover:bg-emerald-700"
              disabled={loading || !email || !password}
              onClick={handleLogin}
            >
              {loading ? '...' : t('auth.loginBtn')}
            </Button>
            <div className="space-y-1.5 text-center text-sm text-slate-500">
              <div>
                {t('auth.noAccount')}{' '}
                <button
                  className="font-semibold text-emerald-700 hover:underline"
                  onClick={() => setAuthOpen('student-register')}
                >
                  {t('auth.registerStudent')}
                </button>
              </div>
              <div>
                <button
                  className="font-semibold text-emerald-700 hover:underline"
                  onClick={() => {
                    setAuthOpen(null)
                    navigate('teacher-register')
                  }}
                >
                  {t('auth.registerTeacher')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Şagird qeydiyyatı — istənilən yerdən açılan şüşə dialoq (arxa fon bulanıq)
function StudentRegisterDialog({ open }: { open: boolean }) {
  const t = useT()
  const { setAuthOpen, setUser } = useApp()
  const [form, setForm] = useState({ name: '', surname: '', email: '', phone: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [verifyUrl, setVerifyUrl] = useState<string | null>(null)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async () => {
    setLoading(true)
    try {
      const d = await api<{ user: AppUser; verifyUrl: string }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(form),
      })
      setUser(d.user)
      setVerifyUrl(d.verifyUrl)
    } catch (e) {
      toast({
        title: e instanceof Error ? e.message : t('common.error'),
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const valid =
    form.name && form.surname && form.email.includes('@') && form.phone && form.password.length >= 6

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          setAuthOpen(null)
          setVerifyUrl(null)
        }
      }}
    >
      <DialogContent className="max-h-[92vh] w-full gap-0 overflow-y-auto rounded-3xl border-slate-200/60 bg-white/70 p-0 shadow-xl shadow-slate-900/10 backdrop-blur-xl sm:max-w-md">
        <DialogHeader className="sr-only">
          <DialogTitle>{t('auth.studentRegTitle')}</DialogTitle>
          <DialogDescription>{t('auth.studentRegSubtitle')}</DialogDescription>
        </DialogHeader>

        {/* Yaşıl başlıq kartı */}
        <div className="relative overflow-hidden bg-emerald-700 bg-[linear-gradient(135deg,#047857_0%,#059669_52%,#0d9488_100%)] px-6 pb-8 pt-8 text-center text-white">
          <MezunArt className="pointer-events-none absolute -right-7 -top-9 w-28 rotate-12 text-white/20" />
          <MezunArt className="pointer-events-none absolute -bottom-9 -left-7 w-20 -rotate-12 text-white/10" />
          <h3 className="relative text-xl font-bold sm:text-2xl">{t('auth.studentRegTitle')}</h3>
          <p className="relative mx-auto mt-1.5 max-w-xs text-sm leading-relaxed text-emerald-50/90">
            {t('auth.studentRegSubtitle')}
          </p>
        </div>

        {verifyUrl ? (
          /* Gmail təsdiq mərhələsi */
          <div className="p-6 text-center sm:p-7">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
              <span className="css-check text-lg text-emerald-600" aria-hidden="true" />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{t('auth.verifyDialogText')}</p>
            <Button
              className="mt-5 h-11 w-full rounded-xl bg-emerald-600 bg-[linear-gradient(135deg,#059669_0%,#0d9488_100%)] font-semibold text-white hover:bg-emerald-700"
              onClick={() => {
                window.location.href = verifyUrl
              }}
            >
              {t('auth.openVerifyLink')}
            </Button>
            <Button
              variant="outline"
              className="mt-2.5 h-11 w-full rounded-xl"
              onClick={() => {
                setAuthOpen(null)
                setVerifyUrl(null)
                useApp.getState().navigate('profile')
              }}
            >
              {t('auth.later')}
            </Button>
          </div>
        ) : (
          <div className="p-6 sm:p-7">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="sr-dialog-name">{t('auth.name')}</Label>
                  <Input id="sr-dialog-name" className="mt-1.5 h-11 rounded-xl bg-white/60" value={form.name} onChange={set('name')} />
                </div>
                <div>
                  <Label htmlFor="sr-dialog-surname">{t('auth.surname')}</Label>
                  <Input id="sr-dialog-surname" className="mt-1.5 h-11 rounded-xl bg-white/60" value={form.surname} onChange={set('surname')} />
                </div>
              </div>
              <div>
                <Label htmlFor="sr-dialog-email">{t('auth.email')}</Label>
                <Input
                  id="sr-dialog-email"
                  type="email"
                  className="mt-1.5 h-11 rounded-xl bg-white/60"
                  placeholder="example@gmail.com"
                  value={form.email}
                  onChange={set('email')}
                />
                <p className="mt-1 text-xs text-slate-400">{t('auth.googleHint')}</p>
              </div>
              <div>
                <Label htmlFor="sr-dialog-phone">{t('auth.phone')}</Label>
                <Input
                  id="sr-dialog-phone"
                  className="mt-1.5 h-11 rounded-xl bg-white/60"
                  placeholder="+994 50 123 45 67"
                  value={form.phone}
                  onChange={set('phone')}
                />
              </div>
              <div>
                <Label htmlFor="sr-dialog-password">{t('auth.password')}</Label>
                <Input
                  id="sr-dialog-password"
                  type="password"
                  className="mt-1.5 h-11 rounded-xl bg-white/60"
                  value={form.password}
                  onChange={set('password')}
                />
              </div>
              <Button
                className="h-11 w-full rounded-xl bg-emerald-600 bg-[linear-gradient(135deg,#059669_0%,#0d9488_100%)] font-semibold text-white shadow-md shadow-emerald-200 hover:bg-emerald-700"
                disabled={!valid || loading}
                onClick={submit}
              >
                {loading ? '...' : t('auth.registerBtn')}
              </Button>
              <div className="text-center text-sm text-slate-500">
                {t('auth.haveAccount')}{' '}
                <button
                  className="font-semibold text-emerald-700 hover:underline"
                  onClick={() => setAuthOpen('login')}
                >
                  {t('auth.loginBtn')}
                </button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export function StudentRegisterView() {
  const t = useT()
  const { navigate, setUser } = useApp()
  const [form, setForm] = useState({ name: '', surname: '', email: '', phone: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [verifyUrl, setVerifyUrl] = useState<string | null>(null)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async () => {
    setLoading(true)
    try {
      const d = await api<{ user: AppUser; verifyUrl: string }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(form),
      })
      setUser(d.user)
      setVerifyUrl(d.verifyUrl)
    } catch (e) {
      toast({
        title: e instanceof Error ? e.message : t('common.error'),
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const valid =
    form.name && form.surname && form.email.includes('@') && form.phone && form.password.length >= 6

  return (
    <div className="relative isolate mx-auto w-full max-w-md px-4 py-10 sm:px-6">
      {/* Bulanıq duman fonu — şüşə kartların arxasında ətrafı dumanlandırır */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-14 -top-14 h-60 w-60 rounded-full bg-emerald-300/50 blur-3xl" />
        <div className="absolute -left-16 top-44 h-72 w-72 rounded-full bg-teal-300/40 blur-3xl" />
        <div className="absolute -right-12 bottom-10 h-64 w-64 rounded-full bg-sky-300/40 blur-3xl" />
        <div className="absolute -left-12 -bottom-12 h-52 w-52 rounded-full bg-emerald-200/60 blur-3xl" />
      </div>

      {/* Başlıq kartı — yaşıl qradiyent, künc qrafikası ilə */}
      <div className="relative overflow-hidden rounded-3xl bg-emerald-700 bg-[linear-gradient(135deg,#047857_0%,#059669_52%,#0d9488_100%)] px-6 pb-12 pt-9 text-center text-white">
        <MezunArt className="pointer-events-none absolute -right-8 -top-10 w-32 rotate-12 text-white/20 sm:w-36" />
        <MezunArt className="pointer-events-none absolute -bottom-9 -left-7 w-24 -rotate-12 text-white/10" />
        <h1 className="relative text-2xl font-bold sm:text-3xl">{t('auth.studentRegTitle')}</h1>
        <p className="relative mx-auto mt-2 max-w-sm text-sm leading-relaxed text-emerald-50/90">
          {t('auth.studentRegSubtitle')}
        </p>
      </div>

      {/* Ağ form kartı — başlıq kartına qismən üst-üstə düşür */}
      <div className="relative -mt-6 rounded-3xl border border-slate-200/60 bg-white/70 p-6 shadow-lg shadow-slate-900/5 backdrop-blur-xl sm:p-8">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="sr-name">{t('auth.name')}</Label>
              <Input id="sr-name" className="mt-1.5 rounded-xl bg-white/60" value={form.name} onChange={set('name')} />
            </div>
            <div>
              <Label htmlFor="sr-surname">{t('auth.surname')}</Label>
              <Input id="sr-surname" className="mt-1.5 rounded-xl bg-white/60" value={form.surname} onChange={set('surname')} />
            </div>
          </div>
          <div>
            <Label htmlFor="sr-email">{t('auth.email')}</Label>
            <Input
              id="sr-email"
              type="email"
              className="mt-1.5 rounded-xl bg-white/60"
              placeholder="example@gmail.com"
              value={form.email}
              onChange={set('email')}
            />
            <p className="mt-1 text-xs text-slate-400">{t('auth.googleHint')}</p>
          </div>
          <div>
            <Label htmlFor="sr-phone">{t('auth.phone')}</Label>
            <Input
              id="sr-phone"
              className="mt-1.5 rounded-xl bg-white/60"
              placeholder="+994 50 123 45 67"
              value={form.phone}
              onChange={set('phone')}
            />
            <p className="mt-1 text-xs text-slate-400">{t('auth.phoneHint')}</p>
          </div>
          <div>
            <Label htmlFor="sr-password">{t('auth.password')}</Label>
            <Input
              id="sr-password"
              type="password"
              className="mt-1.5 rounded-xl bg-white/60"
              value={form.password}
              onChange={set('password')}
            />
          </div>
          <Button
            className="h-11 w-full rounded-xl bg-emerald-600 bg-[linear-gradient(135deg,#059669_0%,#0d9488_100%)] font-semibold text-white shadow-md shadow-emerald-200 hover:bg-emerald-700"
            disabled={!valid || loading}
            onClick={submit}
          >
            {loading ? '...' : t('auth.registerBtn')}
          </Button>
          <div className="text-center text-sm text-slate-500">
            {t('auth.haveAccount')}{' '}
            <button
              className="font-semibold text-emerald-700 hover:underline"
              onClick={() => useApp.getState().setAuthOpen('login')}
            >
              {t('auth.loginBtn')}
            </button>
          </div>
        </div>
      </div>

      {/* Gmail təsdiq dialogu */}
      <Dialog open={!!verifyUrl} onOpenChange={(o) => !o && navigate('profile')}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-emerald-900">
              {t('auth.welcome')} {t('auth.verifyDialog')}
            </DialogTitle>
            <DialogDescription>{t('auth.verifyDialogText')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              onClick={() => {
                window.location.href = verifyUrl!
              }}
            >
              {t('auth.openVerifyLink')}
            </Button>
            <Button variant="outline" className="w-full" onClick={() => navigate('profile')}>
              {t('auth.later')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
