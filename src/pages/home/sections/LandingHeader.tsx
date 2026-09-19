import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { Icon, Icons, Logo } from '@/components/common'
import { AreaChart } from '@/components/charts'
import '@/components/charts/chartConfig'
import type { ChartOptions } from 'chart.js'
import { useLocale } from '@/i18n'

const featuredChartData = {
  labels: ['1', '2', '3', '4', '5', '6', '7'],
  datasets: [
    {
      fill: true,
      data: [20, 34, 28, 42, 38, 52, 58],
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 2,
      tension: 0.4,
      pointRadius: 0,
    },
  ],
}

const miniChartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { enabled: false } },
  scales: { x: { display: false }, y: { display: false } },
  layout: { padding: 0 },
}

export function LandingHeader() {
  const { t } = useLocale()

  const sectionLinks = [
    { label: t('landing.header.nav.demos'), href: '#demos' },
    { label: t('landing.header.nav.features'), href: '#features' },
    { label: t('landing.header.nav.widgets'), href: '#widgets' },
  ] as const

  const dashboards = [
    {
      title: t('nav.overview'),
      description: t('landing.demos.items.overview_light.desc'),
      to: '/dashboard',
      icon: Icons.dashboard,
      iconColor: 'text-blue-600',
      badge: t('landing.header.badge.popular'),
      badgeKind: 'popular',
      bg: 'bg-blue-50',
    },
    {
      title: t('nav.calendar'),
      description: t('landing.demos.items.calendar.desc'),
      to: '/app/calendar',
      icon: Icons.calendar,
      iconColor: 'text-pink-600',
      badge: t('landing.header.badge.new'),
      badgeKind: 'new',
      bg: 'bg-pink-50',
    },
    {
      title: t('nav.contacts'),
      description: t('header.apps.contacts_desc'),
      to: '/app/contacts',
      icon: Icons.contacts,
      iconColor: 'text-emerald-600',
      badge: undefined,
      badgeKind: undefined,
      bg: 'bg-emerald-50',
    },
  ] as const

  const [featured, ...otherDashboards] = dashboards

  const quickLinks = [
    { label: t('nav.calendar'), to: '/app/calendar', icon: Icons.calendar },
    { label: t('nav.contacts'), to: '/app/contacts', icon: Icons.contacts },
    { label: t('nav.form_layout'), to: '/forms/layout', icon: Icons.layoutGrid },
    { label: t('landing.header.quick_links.user_profile'), to: '/pages/account-settings', icon: Icons.user },
  ] as const

  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const closeTimerRef = useRef<number | null>(null)
  const megaContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menus on location change
  useEffect(() => {
    setIsOpen(false)
    setMegaOpen(false)
  }, [location.pathname, location.search, location.hash])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setIsOpen(false)
      setMegaOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [isOpen])

  useEffect(() => {
    if (!megaOpen) return
    const onPointerDown = (e: MouseEvent) => {
      const root = megaContainerRef.current
      if (!root) return
      if (root.contains(e.target as Node)) return
      setMegaOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [megaOpen])

  const openMega = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    setMegaOpen(true)
  }

  const scheduleCloseMega = () => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current)
    closeTimerRef.current = window.setTimeout(() => setMegaOpen(false), 150)
  }

  return (
    <header className="fixed top-[calc(var(--pro-banner-height)+0.75rem)] sm:top-[calc(var(--pro-banner-height)+1rem)] inset-x-3 sm:inset-x-6 z-50">
      <div
        className={`max-w-7xl mx-auto rounded-2xl border transition-all duration-300 px-4 sm:px-6 ${scrolled
          ? 'bg-white/90 backdrop-blur-xl border-surface-200/70 shadow-[0_8px_30px_-8px_rgba(15,23,42,0.15)] py-2.5'
          : 'bg-white/70 backdrop-blur-lg border-surface-200/50 shadow-[0_4px_20px_-8px_rgba(15,23,42,0.08)] py-3.5'
          }`}
      >
        <div className="flex items-center justify-between" ref={megaContainerRef}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <Logo className="transition-transform duration-300 group-hover:scale-105" width={140} height={28} />
          </Link>

          {/* Desktop Nav — plain inline links, no boxed pill */}
          <nav className="hidden md:flex items-center gap-1">
            {sectionLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-secondary-600 hover:text-secondary-900 hover:bg-surface-100 transition-all duration-200"
              >
                {l.label}
              </a>
            ))}

            <div
              className="relative"
              onMouseEnter={openMega}
              onMouseLeave={scheduleCloseMega}
            >
              <button
                type="button"
                className={`
                  px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 inline-flex items-center gap-1.5
                  ${megaOpen
                    ? 'bg-surface-100 text-secondary-900'
                    : 'text-secondary-600 hover:text-secondary-900 hover:bg-surface-100'
                  }
                `}
                aria-haspopup="menu"
                aria-expanded={megaOpen}
                onClick={() => setMegaOpen((v) => !v)}
              >
                {t('landing.header.nav.dashboards')}
                <Icon
                  icon={Icons.chevronDown}
                  className={`w-4 h-4 transition-transform duration-200 ${megaOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Mega Menu */}
              <div
                className={`
                  absolute left-1/2 -translate-x-1/2 top-full mt-4 w-[880px]
                  transition-all duration-300 origin-top-right
                  ${megaOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-2 invisible'}
                `}
                onMouseEnter={openMega}
                onMouseLeave={scheduleCloseMega}
              >
                <div className="rounded-2xl border border-surface-200/70 bg-white shadow-[0_20px_50px_-12px_rgba(15,23,42,0.18)] overflow-hidden">
                  <div className="grid grid-cols-12">
                    {/* Featured dashboard — live stat preview, no screenshot */}
                    <div className="col-span-5 p-5 bg-surface-50/70 border-r border-surface-200/70">
                      <Link to={featured.to} onClick={() => setMegaOpen(false)} className="group block h-full">
                        <div className="rounded-xl border border-surface-200 bg-white p-4 mb-4 transition-colors group-hover:border-theme-primary/40">
                          <div className="flex items-center justify-between mb-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${featured.bg} ${featured.iconColor}`}>
                              <Icon icon={featured.icon} className="w-5 h-5" />
                            </div>
                            <span className="px-2 py-0.5 rounded text-ui-2xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700">
                              {featured.badge}
                            </span>
                          </div>

                          <div className="h-[70px] -mx-1 mb-3">
                            <AreaChart data={featuredChartData} options={miniChartOptions} height={70} />
                          </div>

                          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-surface-100">
                            <div>
                              <p className="text-ui-2xs font-semibold uppercase tracking-wider text-secondary-400">{t('landing.header.mega.visitors')}</p>
                              <p className="text-body-sm font-bold text-secondary-900">12.8K</p>
                            </div>
                            <div>
                              <p className="text-ui-2xs font-semibold uppercase tracking-wider text-secondary-400">{t('landing.header.mega.growth')}</p>
                              <p className="text-body-sm font-bold text-emerald-600">+18.2%</p>
                            </div>
                          </div>
                        </div>

                        <h3 className="heading-5 text-secondary-900 group-hover:text-theme-primary transition-colors">
                          {featured.title}
                        </h3>
                        <p className="text-body-sm text-secondary-500 mt-1 leading-relaxed">
                          {featured.description}
                        </p>
                        <span className="inline-flex items-center gap-1 text-theme-primary text-sm font-semibold mt-3">
                          {t('landing.header.mega.explore')}
                          <Icon icon={Icons.arrowRight} className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </Link>
                    </div>

                    {/* Everything else */}
                    <div className="col-span-7 p-5">
                      <div className="flex items-center justify-between mb-2 px-1">
                        <p className="text-ui-xs font-bold uppercase tracking-wider text-secondary-400">
                          {t('landing.header.mega.title')}
                        </p>
                        <Link
                          to="/dashboard"
                          onClick={() => setMegaOpen(false)}
                          className="text-ui-xs font-bold text-theme-primary flex items-center gap-1"
                        >
                          {t('landing.header.mega.view_all')}
                          <Icon icon={Icons.arrowRight} className="w-3 h-3" />
                        </Link>
                      </div>
                      <div className="space-y-0.5 mb-5">
                        {otherDashboards.map((d) => (
                          <Link
                            key={d.title}
                            to={d.to}
                            onClick={() => setMegaOpen(false)}
                            className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-50 transition-colors"
                          >
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${d.bg} ${d.iconColor}`}>
                              <Icon icon={d.icon} className="w-4.5 h-4.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-x-2">
                                <span className="text-body-sm font-semibold text-secondary-900">{d.title}</span>
                                {d.badge && (
                                  <span className={`shrink-0 px-1.5 py-0.5 rounded text-ui-2xs font-bold uppercase tracking-wider ${d.badgeKind === 'new' ? 'bg-emerald-100 text-emerald-700' : 'bg-surface-100 text-secondary-600'}`}>
                                    {d.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-caption text-secondary-500 truncate">{d.description}</p>
                            </div>
                            <Icon icon={Icons.arrowRight} className="w-3.5 h-3.5 text-secondary-300 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0" />
                          </Link>
                        ))}
                      </div>

                      <p className="text-ui-xs font-bold uppercase tracking-wider text-secondary-400 mb-2 px-1">
                        {t('landing.header.quick_links.title')}
                      </p>
                      <div className="grid grid-cols-2 gap-2 mb-5">
                        {quickLinks.map((l) => (
                          <Link
                            key={l.label}
                            to={l.to}
                            onClick={() => setMegaOpen(false)}
                            className="flex items-center gap-2 p-2.5 rounded-xl border border-surface-200/70 hover:border-theme-primary/40 transition-colors"
                          >
                            <Icon icon={l.icon} className="w-4 h-4 text-secondary-400" />
                            <span className="text-body-sm font-medium text-secondary-700 truncate">
                              {l.label}
                            </span>
                          </Link>
                        ))}
                      </div>

                      <Link
                        to="/components/all"
                        onClick={() => setMegaOpen(false)}
                        className="flex items-center justify-between gap-3 p-4 rounded-xl bg-theme-primary text-white transition-transform hover:scale-[1.01]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-white/20">
                            <Icon icon={Icons.layoutGrid} className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-body-sm font-bold leading-tight text-white">{t('landing.header.components_cta.title')}</p>
                            <p className="text-ui-xs font-medium text-white/80">{t('landing.header.components_cta.subtitle')}</p>
                          </div>
                        </div>
                        <Icon icon={Icons.arrowRight} className="w-4 h-4 shrink-0" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/auth/login"
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-secondary-700 border border-surface-200 hover:border-theme-primary hover:bg-surface-100 transition-colors"
            >
              {t('landing.header.actions.login')}
            </Link>
            <Link
              to="/auth/register"
              className="btn-theme-primary px-6 py-2.5 rounded-xl text-sm font-bold inline-flex items-center justify-center gap-2 shadow-lg shadow-theme-primary/20 hover:shadow-xl transition-all"
            >
              {t('home.get_started')}
              <Icon icon={Icons.arrowRight} className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden relative z-50 w-10 h-10 rounded-full bg-surface-100 flex items-center justify-center text-secondary-900"
            onClick={() => setIsOpen((v) => !v)}
          >
            {isOpen ? <Icon icon={Icons.x} className="w-5 h-5" /> : <Icon icon={Icons.menu} className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`
          fixed inset-0 z-40 bg-white/95 backdrop-blur-xl transition-all duration-300 md:hidden
          ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
        `}
      >
        <div className="h-full overflow-y-auto pt-24 pb-8 px-6">
          <div className="flex flex-col gap-2">
            {sectionLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setIsOpen(false)}
                className="heading-3 text-secondary-900 py-3 border-b border-surface-100"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="mt-8">
            <p className="text-xs font-bold uppercase tracking-wider text-secondary-500 mb-4">
              {t('landing.header.nav.dashboards')}
            </p>
            <div className="grid gap-3">
              {dashboards.map((d) => (
                <Link
                  key={d.title}
                  to={d.to}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-surface-50 border border-surface-100"
                >
                  <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center ${d.iconColor} shadow-sm`}>
                    <Icon icon={d.icon} className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-secondary-900">{d.title}</h4>
                    <p className="text-xs text-secondary-500">{d.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-3">
            <Link
              to="/auth/login"
              onClick={() => setIsOpen(false)}
              className="w-full py-3 rounded-xl border border-surface-200 text-center font-bold text-secondary-900 hover:border-theme-primary transition-colors"
            >
              {t('landing.header.actions.login')}
            </Link>
            <Link
              to="/auth/register"
              onClick={() => setIsOpen(false)}
              className="btn-theme-primary w-full py-3 rounded-xl text-white text-center font-bold shadow-lg shadow-theme-primary/20"
            >
              {t('home.get_started')}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
