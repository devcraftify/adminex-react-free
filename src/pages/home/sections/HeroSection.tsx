import { Link } from 'react-router-dom'
import { Icon, Icons } from '@/components/common'
import { useLocale } from '@/i18n'

const ORBIT_ICONS = {
  ring1: [
    { icon: Icons.dashboard, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { icon: Icons.calendar, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { icon: Icons.contacts, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { icon: Icons.chartBar, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ],
  ring2: [
    { icon: Icons.table, color: 'text-pink-500', bg: 'bg-pink-500/10' },
    { icon: Icons.layoutGrid, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { icon: Icons.lock, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { icon: Icons.chartLine, color: 'text-red-500', bg: 'bg-red-500/10' },
    { icon: Icons.settings, color: 'text-teal-500', bg: 'bg-teal-500/10' },
    { icon: Icons.checklist, color: 'text-violet-500', bg: 'bg-violet-500/10' },
  ],
  ring3: [
    { icon: Icons.chartPie, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { icon: Icons.chartArea, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { icon: Icons.heading, color: 'text-lime-500', bg: 'bg-lime-500/10' },
    { icon: Icons.user, color: 'text-fuchsia-500', bg: 'bg-fuchsia-500/10' },
    { icon: Icons.database, color: 'text-sky-500', bg: 'bg-sky-500/10' },
    { icon: Icons.palette, color: 'text-green-500', bg: 'bg-green-500/10' },
    { icon: Icons.moon, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { icon: Icons.bolt, color: 'text-slate-500', bg: 'bg-slate-500/10' },
  ],
}

export function HeroSection() {
  const { t } = useLocale()

  return (
    <section id="top" className="relative min-h-screen overflow-hidden flex items-center justify-center pt-20">
      <div className="absolute inset-0 bg-surface-50 dark:bg-surface-950 transition-colors duration-300" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-theme-primary/10 via-transparent to-transparent opacity-50 dark:opacity-30" />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <div className="absolute w-[650px] h-[650px] rounded-full border border-surface-200 dark:border-surface-800 animate-orbit" style={{ '--duration-orbit': '40s' } as React.CSSProperties}>
          {ORBIT_ICONS.ring1.map((item, i, arr) => {
            const angle = (i / arr.length) * 360
            return (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 -ml-6 -mt-6 pointer-events-auto"
                style={{ transform: `rotate(${angle}deg) translateY(-325px) rotate(-${angle}deg)` }}
              >
                <div className="animate-orbit-reverse" style={{ '--duration-orbit': '40s' } as React.CSSProperties}>
                  <div className={`w-12 h-12 rounded-2xl ${item.bg} border border-surface-200 dark:border-surface-700 backdrop-blur-sm flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-125 cursor-default`}>
                    <Icon icon={item.icon} className={`w-6 h-6 ${item.color}`} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="absolute w-[850px] h-[850px] rounded-full border border-surface-200/50 dark:border-surface-800/50 animate-orbit" style={{ '--duration-orbit': '55s' } as React.CSSProperties}>
          {ORBIT_ICONS.ring2.map((item, i, arr) => {
            const angle = (i / arr.length) * 360
            return (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 -ml-5 -mt-5 pointer-events-auto"
                style={{ transform: `rotate(${angle}deg) translateY(-425px) rotate(-${angle}deg)` }}
              >
                <div className="animate-orbit-reverse" style={{ '--duration-orbit': '55s' } as React.CSSProperties}>
                  <div className={`w-10 h-10 rounded-xl ${item.bg} border border-surface-200 dark:border-surface-700 backdrop-blur-sm flex items-center justify-center shadow-md`}>
                    <Icon icon={item.icon} className={`w-5 h-5 ${item.color}`} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="absolute w-[1050px] h-[1050px] rounded-full border border-surface-200/30 dark:border-surface-800/30 animate-orbit" style={{ '--duration-orbit': '70s' } as React.CSSProperties}>
          {ORBIT_ICONS.ring3.map((item, i, arr) => {
            const angle = (i / arr.length) * 360
            return (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 -ml-4 -mt-4 pointer-events-auto"
                style={{ transform: `rotate(${angle}deg) translateY(-525px) rotate(-${angle}deg)` }}
              >
                <div className="animate-orbit-reverse" style={{ '--duration-orbit': '70s' } as React.CSSProperties}>
                  <div className={`w-8 h-8 rounded-lg ${item.bg} border border-surface-200 dark:border-surface-700 backdrop-blur-sm flex items-center justify-center shadow-sm`}>
                    <Icon icon={item.icon} className={`w-4 h-4 ${item.color}`} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-20">
        <div className="animate-fade-in flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 dark:bg-surface-900/50 border border-surface-200 dark:border-surface-800 text-sm text-secondary-700 dark:text-secondary-200 backdrop-blur-xl mb-8 shadow-sm">
            <Icon icon={Icons.sparkles} className="w-4 h-4 text-theme-primary" />
            <span className="font-medium">{t('landing.hero.badge')}</span>
          </div>

          <h1 className="text-display-hero text-secondary-900 dark:text-white mb-8">
            {t('landing.hero.title_prefix')}
            <br />
            <span className="text-gradient dark:text-white">
              {t('landing.hero.title_emphasis')}
            </span>
          </h1>

          <p className="text-lead text-secondary-600 dark:text-secondary-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            {t('landing.hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto btn-theme-primary px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-theme-primary/20 hover:scale-105 transition-transform duration-200 inline-flex items-center justify-center gap-2"
            >
              {t('landing.hero.view_preview')}
              <Icon icon={Icons.arrowRight} className="w-5 h-5" />
            </Link>

            <Link
              to="/auth/login"
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-surface-900 text-secondary-900 dark:text-white rounded-2xl font-bold text-lg border border-surface-200 dark:border-surface-800 hover:border-theme-primary hover:bg-surface-50 dark:hover:bg-surface-800 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Icon icon={Icons.user} className="w-5 h-5" />
              {t('auth.login.sign_in')}
            </Link>
          </div>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 w-full max-w-4xl">
            {[
              { k: '20+', v: t('landing.hero.stats.pages') },
              { k: '2', v: t('landing.hero.stats.apps') },
              { k: '100%', v: t('landing.hero.stats.typescript') },
              { k: t('landing.hero.stats.dark'), v: t('landing.hero.stats.mode') },
            ].map((s) => (
              <div key={s.v} className="rounded-2xl bg-white/60 dark:bg-surface-900/60 backdrop-blur-md border border-surface-200 dark:border-surface-800 p-6 flex flex-col items-center hover:bg-white dark:hover:bg-surface-900 transition-all duration-300">
                <p className="heading-2 text-secondary-900 dark:text-white">{s.k}</p>
                <p className="text-sm font-medium text-secondary-500 dark:text-secondary-400 mt-1 uppercase tracking-wider">{s.v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
