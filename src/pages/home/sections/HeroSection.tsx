import { Link } from 'react-router'
import { Icon, Icons } from '@/components/common'
import { useLocale } from '@/i18n'

const BUILT_WITH = [
  { icon: Icons.brandReact, label: 'React 19' },
  { icon: Icons.typescript, label: 'TypeScript' },
  { icon: Icons.palette, label: 'Tailwind CSS' },
  { icon: Icons.bolt, label: 'Vite' },
] as const

const FLOATING_ICONS = [
  { icon: Icons.chartBar, className: 'top-[18%] left-[8%] sm:left-[14%] animate-float', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { icon: Icons.layoutGrid, className: 'top-[28%] right-[6%] sm:right-[12%] animate-float-delay', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  { icon: Icons.users, className: 'bottom-[30%] left-[5%] sm:left-[10%] animate-float-delay-2', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { icon: Icons.shield, className: 'bottom-[22%] right-[8%] sm:right-[15%] animate-float', color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { icon: Icons.calendar, className: 'top-[12%] right-[22%] hidden lg:flex animate-float-delay', color: 'text-pink-500', bg: 'bg-pink-500/10' },
  { icon: Icons.bolt, className: 'bottom-[14%] left-[22%] hidden lg:flex animate-float-delay-2', color: 'text-amber-500', bg: 'bg-amber-500/10' },
] as const

export function HeroSection() {
  const { t } = useLocale()

  const stats = [
    { value: '20+', label: t('landing.hero.stats.pages') },
    { value: '2', label: t('landing.hero.stats.apps') },
    { value: '100%', label: t('landing.hero.stats.typescript') },
  ]

  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20">
      {/* Base surface */}
      <div className="absolute inset-0 bg-surface-50" />

      {/* Animated background — drifting blurred solid fills, no gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute -top-24 left-[6%] h-[440px] w-[440px] rounded-full bg-theme-primary/20 blur-[110px] animate-blob" />
        <div className="absolute top-1/4 right-[2%] h-[400px] w-[400px] rounded-full bg-theme-accent/20 blur-[110px] animate-blob-delay" />
        <div className="absolute bottom-[-15%] left-1/3 h-[380px] w-[380px] rounded-full bg-success-500/15 blur-[110px] animate-blob-delay-2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-theme-primary/10 blur-[100px] animate-blob-delay" />

        {/* Floating decorative icon chips */}
        {FLOATING_ICONS.map((f, i) => (
          <div
            key={i}
            className={`absolute hidden sm:flex w-11 h-11 rounded-xl ${f.bg} ${f.color} items-center justify-center border border-surface-200/60 backdrop-blur-sm shadow-sm ${f.className}`}
          >
            <Icon icon={f.icon} className="w-5 h-5" />
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-surface-200 text-sm text-secondary-700 shadow-xs mb-6">
          <Icon icon={Icons.sparkles} className="w-4 h-4 text-theme-primary" />
          <span className="font-medium">{t('landing.hero.badge')}</span>
        </div>

        <h1 className="text-display-hero text-secondary-900 mb-5">
          {t('landing.hero.title_prefix')}
          <br />
          <span className="text-gradient">{t('landing.hero.title_emphasis')}</span>
        </h1>

        <p className="text-lead text-secondary-600 mb-8 max-w-2xl mx-auto">
          {t('landing.hero.subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto btn-theme-primary px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-theme-primary/20 hover:scale-105 transition-transform duration-200 inline-flex items-center justify-center gap-2"
          >
            {t('landing.hero.view_preview')}
            <Icon icon={Icons.arrowRight} className="w-5 h-5" />
          </Link>

          <Link
            to="/auth/login"
            className="w-full sm:w-auto px-8 py-4 bg-white text-secondary-900 rounded-2xl font-bold text-lg border border-surface-200 hover:border-theme-primary hover:bg-surface-50 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Icon icon={Icons.user} className="w-5 h-5" />
            {t('auth.login.sign_in')}
          </Link>
        </div>

        {/* Built with */}
        <div className="flex flex-col items-center gap-3 mb-12">
          <p className="text-ui-xs font-semibold uppercase tracking-wider text-secondary-400">
            {t('landing.hero.built_with')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {BUILT_WITH.map((item) => (
              <div key={item.label} className="flex items-center gap-1.5 text-secondary-500">
                <Icon icon={item.icon} className="w-4 h-4" />
                <span className="text-body-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-xl mx-auto pt-8 border-t border-surface-200">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-display-subhero text-secondary-900">{s.value}</p>
              <p className="text-body-sm text-secondary-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
