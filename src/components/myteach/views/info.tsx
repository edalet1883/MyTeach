'use client'

import { useState } from 'react'
import { MezunLogo } from '@/components/myteach/mezun-logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useApp } from '@/lib/store'
import { useT, DictKey } from '@/lib/i18n'
import { toast } from '@/hooks/use-toast'

// ── Necə işləyir ──
export function HowItWorksView() {
  const t = useT()
  const navigate = useApp((s) => s.navigate)

  const studentSteps = [
    { titleKey: 'how.step1.title' as DictKey, descKey: 'how.step1.desc' as DictKey },
    { titleKey: 'how.step2.title' as DictKey, descKey: 'how.step2.desc' as DictKey },
    { titleKey: 'how.step3.title' as DictKey, descKey: 'how.step3.desc' as DictKey },
  ]

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('how.title')}</h1>
        <p className="mt-3 text-sm text-slate-500 sm:text-base">{t('how.subtitle')}</p>
      </div>

      {/* Şagird üçün addımlar */}
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {studentSteps.map((s, i) => (
          <div key={i} className="relative rounded-3xl border border-slate-200 bg-white p-7">
            <div className="absolute -top-3.5 left-7 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
              {i + 1}
            </div>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">{t(s.titleKey)}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{t(s.descKey)}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button size="lg" className="rounded-xl bg-emerald-600 hover:bg-emerald-700" onClick={() => navigate('teachers')}>
          {t('common.browseTeachers')}
        </Button>
      </div>

      {/* Müəllim üçün */}
      <div className="mt-14 overflow-hidden rounded-3xl bg-slate-900 bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_100%)] p-8 sm:p-12">
        <h2 className="text-2xl font-bold text-white">{t('how.forTeachers')}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
          {t('how.forTeachersDesc')}
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-sm font-bold text-emerald-400">
              1
            </span>
            <h3 className="mt-3 font-semibold text-white">{t('how.stage1')}</h3>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-sm font-bold text-emerald-400">
              2
            </span>
            <h3 className="mt-3 font-semibold text-white">{t('how.stage2')}</h3>
          </div>
        </div>
        <Button
          size="lg"
          className="mt-7 rounded-xl bg-emerald-500 font-semibold hover:bg-emerald-600"
          onClick={() => navigate('teacher-register')}
        >
          {t('how.becomeTeacher')}
        </Button>
      </div>
    </div>
  )
}

// ── FAQ ──
export function FaqView() {
  const t = useT()

  const faqs: { q: DictKey; a: DictKey }[] = [
    { q: 'faq.q1', a: 'faq.a1' },
    { q: 'faq.q2', a: 'faq.a2' },
    { q: 'faq.q3', a: 'faq.a3' },
    { q: 'faq.q4', a: 'faq.a4' },
    { q: 'faq.q5', a: 'faq.a5' },
    { q: 'faq.q6', a: 'faq.a6' },
  ]

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('faq.title')}</h1>
        <p className="mt-3 text-sm text-slate-500 sm:text-base">{t('faq.subtitle')}</p>
      </div>
      <Accordion type="single" collapsible className="mt-9 space-y-3">
        {faqs.map((f, i) => (
          <AccordionItem
            key={i}
            value={`item-${i}`}
            className="rounded-2xl border border-slate-200 bg-white px-5 last:border-b"
          >
            <AccordionTrigger className="text-left text-sm font-semibold text-slate-900 hover:no-underline sm:text-base">
              {t(f.q)}
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-slate-600">
              {t(f.a)}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

// ── Haqqımızda ──
export function AboutView() {
  const t = useT()
  const navigate = useApp((s) => s.navigate)

  const values = [t('about.value1'), t('about.value2'), t('about.value3')]

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 bg-[linear-gradient(135deg,#10b981_0%,#0d9488_100%)] text-white shadow-lg shadow-emerald-200">
          <MezunLogo size={32} />
        </div>
        <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900">{t('about.title')}</h1>
      </div>

      <div className="mt-8 space-y-5 rounded-3xl border border-slate-200 bg-white p-7 sm:p-10">
        <p className="text-sm leading-relaxed text-slate-600 sm:text-base">{t('about.p1')}</p>
        <p className="text-sm leading-relaxed text-slate-600 sm:text-base">{t('about.p2')}</p>
        <p className="text-sm leading-relaxed text-slate-600 sm:text-base">{t('about.p3')}</p>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl bg-emerald-700 bg-[linear-gradient(135deg,#047857_0%,#0d9488_100%)] p-7 text-white">
          <h2 className="text-lg font-bold">{t('about.mission')}</h2>
          <p className="mt-2 text-sm leading-relaxed text-emerald-50/90">{t('about.missionText')}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-7">
          <h2 className="text-lg font-bold text-slate-900">{t('about.values')}</h2>
          <ul className="mt-3 space-y-2.5">
            {values.map((v, i) => (
              <li key={i} className="flex items-center gap-2.5 text-sm text-slate-600">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-sm font-bold text-emerald-600">
                  {i + 1}
                </span>
                {v}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Button size="lg" className="rounded-xl bg-emerald-600 hover:bg-emerald-700" onClick={() => navigate('teachers')}>
          {t('common.browseTeachers')}
        </Button>
      </div>
    </div>
  )
}

// ── Əlaqə ──
export function ContactView() {
  const t = useT()
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const submit = () => {
    if (!form.name || !form.email || !form.message) return
    toast({ title: t('contact.formSent') })
    setForm({ name: '', email: '', message: '' })
  }

  const channels = [
    {
      label: t('contact.email'),
      value: 'info@myteach.az',
      href: 'mailto:info@myteach.az',
    },
    {
      label: t('contact.phone'),
      value: '+994 12 555 55 55',
      href: 'tel:+994125555555',
    },
    {
      label: t('contact.whatsappCta'),
      value: '+994 50 555 55 55',
      href: 'https://wa.me/994505555555',
    },
  ]

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('contact.title')}</h1>
        <p className="mt-3 text-sm text-slate-500 sm:text-base">{t('contact.subtitle')}</p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {/* Əlaqə kanalları */}
        <div className="space-y-4">
          {channels.map((c, i) => (
            <a
              key={i}
              href={c.href}
              target={c.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
            >
              <div>
                <div className="text-sm font-semibold text-slate-900">{c.label}</div>
                <div className="text-sm text-slate-500">{c.value}</div>
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                {c.label.split(' ')[0]}
              </span>
            </a>
          ))}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="text-xs font-medium text-slate-500">{t('contact.address')}</div>
                <div className="mt-0.5 text-sm font-medium text-slate-800">{t('contact.addressValue')}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-500">{t('contact.hours')}</div>
                <div className="mt-0.5 text-sm font-medium text-slate-800">{t('contact.hoursValue')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mesaj formu */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-900">
            {t('contact.formTitle')}
          </h2>
          <div className="mt-5 space-y-4">
            <div>
              <Label htmlFor="ct-name">{t('contact.formName')}</Label>
              <Input
                id="ct-name"
                className="mt-1.5"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="ct-email">{t('contact.formEmail')}</Label>
              <Input
                id="ct-email"
                type="email"
                className="mt-1.5"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="ct-msg">{t('contact.formMessage')}</Label>
              <Textarea
                id="ct-msg"
                className="mt-1.5 min-h-28"
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              />
            </div>
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              disabled={!form.name || !form.email || !form.message}
              onClick={submit}
            >
              {t('contact.formSend')}
            </Button>
            <p className="text-center text-xs text-slate-400">{t('contact.formNote')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
