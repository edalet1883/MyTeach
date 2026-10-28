'use client'

import { useApp } from '@/lib/store'
import { useT, DictKey } from '@/lib/i18n'

export function Footer() {
  const t = useT()
  const navigate = useApp((s) => s.navigate)

  const pages: { key: 'home' | 'categories' | 'teachers' | 'how-it-works' | 'faq' | 'about' | 'contact'; labelKey: DictKey }[] = [
    { key: 'home', labelKey: 'nav.home' },
    { key: 'teachers', labelKey: 'nav.teachers' },
    { key: 'categories', labelKey: 'nav.categories' },
    { key: 'how-it-works', labelKey: 'nav.howItWorks' },
    { key: 'faq', labelKey: 'nav.faq' },
    { key: 'about', labelKey: 'nav.about' },
    { key: 'contact', labelKey: 'nav.contact' },
  ]

  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-900 pb-[env(safe-area-inset-bottom)] text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brend */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 bg-[linear-gradient(135deg,#10b981_0%,#0d9488_100%)] text-sm font-extrabold text-white">
                MT
              </div>
              <div className="text-xl font-extrabold tracking-tight text-white">
                My<span className="text-emerald-400">Teach</span>
              </div>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">
              {t('footer.description')}
            </p>
            <div className="mt-4 inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
              {t('footer.free')}
            </div>
          </div>

          {/* Səhifələr */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {t('footer.pages')}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {pages.map((p) => (
                <li key={p.key}>
                  <button
                    onClick={() => navigate(p.key)}
                    className="text-sm text-slate-400 transition-colors hover:text-emerald-400"
                  >
                    {t(p.labelKey)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Müəllimlər üçün + əlaqə */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {t('footer.forTeachers')}
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <button
                  onClick={() => navigate('teacher-register')}
                  className="text-sm text-slate-400 transition-colors hover:text-emerald-400"
                >
                  {t('footer.becomeTeacher')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('how-it-works')}
                  className="text-sm text-slate-400 transition-colors hover:text-emerald-400"
                >
                  {t('footer.howItWorks')}
                </button>
              </li>
            </ul>
            <div className="mt-6 space-y-2 text-sm text-slate-400">
              <div>
                <span className="block text-xs font-medium uppercase tracking-wide text-slate-500">
                  {t('contact.email')}
                </span>
                <span>info@myteach.az</span>
              </div>
              <div>
                <span className="block text-xs font-medium uppercase tracking-wide text-slate-500">
                  {t('contact.phone')}
                </span>
                <span>+994 12 555 55 55</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-800 pt-6 text-xs text-slate-500 sm:flex-row">
          <span>© {new Date().getFullYear()} MyTeach. {t('footer.copyright')}</span>
          <span>
            myteach.dpdns.org • Azərbaycan • English • Русский
          </span>
        </div>
      </div>
    </footer>
  )
}
