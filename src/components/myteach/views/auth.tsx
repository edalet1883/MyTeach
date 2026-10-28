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
import { useT } from '@/lib/i18n'
import { api } from '@/lib/api'
import { toast } from '@/hooks/use-toast'
import type { AppUser } from '@/lib/store'

export function LoginDialog() {
  const t = useT()
  const { authOpen, setAuthOpen, setUser, navigate } = useApp()
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
    <Dialog open={authOpen === 'login'} onOpenChange={(o) => !o && setAuthOpen(null)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {t('auth.loginTitle')}
          </DialogTitle>
          <DialogDescription>{t('auth.loginSubtitle')}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="login-email">{t('auth.email')}</Label>
            <Input
              id="login-email"
              type="email"
              className="mt-1.5"
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
              className="mt-1.5"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            disabled={loading || !email || !password}
            onClick={handleLogin}
          >
            {loading ? '...' : t('auth.loginBtn')}
          </Button>
          <div className="text-center text-sm text-slate-500">
            {t('auth.noAccount')}{' '}
            <button
              className="font-semibold text-emerald-700 hover:underline"
              onClick={() => setAuthOpen(null) || navigate('student-register')}
            >
              {t('auth.registerStudent')}
            </button>{' '}
            /{' '}
            <button
              className="font-semibold text-emerald-700 hover:underline"
              onClick={() => setAuthOpen(null) || navigate('teacher-register')}
            >
              {t('auth.registerTeacher')}
            </button>
          </div>
        </div>
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
    <div className="mx-auto w-full max-w-md px-4 py-12 sm:px-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-lg font-extrabold text-emerald-600">
            SR
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">{t('auth.studentRegTitle')}</h1>
          <p className="mt-1.5 text-sm text-slate-500">{t('auth.studentRegSubtitle')}</p>
        </div>

        <div className="mt-7 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="sr-name">{t('auth.name')}</Label>
              <Input id="sr-name" className="mt-1.5" value={form.name} onChange={set('name')} />
            </div>
            <div>
              <Label htmlFor="sr-surname">{t('auth.surname')}</Label>
              <Input id="sr-surname" className="mt-1.5" value={form.surname} onChange={set('surname')} />
            </div>
          </div>
          <div>
            <Label htmlFor="sr-email">{t('auth.email')}</Label>
            <Input
              id="sr-email"
              type="email"
              className="mt-1.5"
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
              className="mt-1.5"
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
              className="mt-1.5"
              value={form.password}
              onChange={set('password')}
            />
          </div>
          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700"
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
