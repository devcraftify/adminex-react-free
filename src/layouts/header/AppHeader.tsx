import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Icon, Icons, LanguageSwitcher, Logo } from '@/components/common'
import { useLocale } from '@/i18n'
import { useTheme } from '@/hooks/useTheme'

type HeaderProps = {
  sidebarWidth: number
  isHorizontal: boolean
  isCollapsed: boolean
  onToggleSidebar: () => void
  isMobileSidebarOpen?: boolean
  onToggleMobileSidebar?: () => void
}

type MegaItem = {
  to: string
  title: string
  description: string
  icon: string
  badge?: string
}

type MegaMenu = {
  id: string
  label: string
  items: MegaItem[]
  footer?: {
    label: string
    to: string
  }
}

function useClickOutside<T extends HTMLElement>(onOutside: () => void) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const el = ref.current
      if (!el) return
      if (e.target instanceof Node && el.contains(e.target)) return
      onOutside()
    }

    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [onOutside])

  return ref
}

function TopLink({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
          isActive
            ? 'bg-theme-primary/10 text-theme-primary'
            : 'text-secondary-600 dark:text-secondary-300 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-secondary-900 dark:hover:text-white',
        ].join(' ')
      }
    >
      {label}
    </NavLink>
  )
}

export function AppHeader({ sidebarWidth, isHorizontal, isCollapsed, onToggleSidebar, onToggleMobileSidebar }: HeaderProps) {
  const location = useLocation()
  const { t } = useLocale()
  const { config: themeConfig } = useTheme()
  const isRtl = themeConfig.direction === 'rtl'

  const [openMega, setOpenMega] = useState<string | null>(null)
  const [userOpen, setUserOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const megaCloseTimerRef = useRef<number | null>(null)

  const clearMegaCloseTimer = () => {
    if (megaCloseTimerRef.current) {
      window.clearTimeout(megaCloseTimerRef.current)
      megaCloseTimerRef.current = null
    }
  }

  const openMegaMenu = (id: string) => {
    clearMegaCloseTimer()
    setOpenMega(id)
  }

  const scheduleMegaClose = () => {
    clearMegaCloseTimer()
    megaCloseTimerRef.current = window.setTimeout(() => setOpenMega(null), 180)
  }

  const megaRef = useClickOutside<HTMLDivElement>(() => {
    clearMegaCloseTimer()
    setOpenMega(null)
  })
  const userRef = useClickOutside<HTMLDivElement>(() => setUserOpen(false))
  const notifRef = useClickOutside<HTMLDivElement>(() => setNotifOpen(false))

  const menus = useMemo<MegaMenu[]>(
    () => [
      {
        id: 'apps',
        label: t('header.menu.apps'),
        items: [
          { to: '/app/email', title: t('nav.email'), description: t('header.apps.email_desc'), icon: Icons.mail, badge: '3' },
          { to: '/app/chat', title: t('nav.chat'), description: t('header.apps.chat_desc'), icon: Icons.message, badge: '5' },
          { to: '/app/notes', title: t('nav.notes'), description: t('header.apps.notes_desc'), icon: Icons.note },
          { to: '/app/kanban', title: t('nav.kanban_board'), description: t('header.apps.kanban_desc'), icon: Icons.kanban },
          { to: '/app/calendar', title: t('nav.calendar'), description: t('header.apps.calendar_desc'), icon: Icons.calendar },
          { to: '/app/ecommerce/products', title: t('nav.ecommerce_title'), description: t('header.apps.ecommerce_desc'), icon: Icons.shopping },
          { to: '/app/blog', title: t('nav.blog'), description: t('header.apps.blog_desc'), icon: Icons.article },
        ],
        footer: { label: t('header.footer.all_apps'), to: '/dashboard' },
      },
      {
        id: 'components',
        label: t('header.menu.components'),
        items: [
          { to: '/forms/layout', title: t('header.components.forms'), description: t('header.components.forms_desc'), icon: Icons.layoutGrid },
          { to: '/tables/data', title: t('header.components.tables'), description: t('header.components.tables_desc'), icon: Icons.table },
          { to: '/charts/line', title: t('header.components.charts'), description: t('header.components.charts_desc'), icon: Icons.chartLine },
          { to: '/pages/account-settings', title: t('header.components.settings_pages'), description: t('header.components.settings_pages_desc'), icon: Icons.settings },
        ],
        footer: { label: t('header.footer.explore_pages'), to: '/pages/pricing' },
      },
    ],
    [t],
  )

  const headerLeft = isHorizontal ? 0 : sidebarWidth

  return (
    <header
      className="layout-header fixed top-0 left-0 right-0 h-16 bg-white/95 dark:bg-surface-900/95 backdrop-blur border-b border-surface-200 dark:border-surface-800 z-[1020] transition-all duration-300"
      style={{ left: isHorizontal ? 0 : undefined }}
    >
      <style>{`
        @media (min-width: 1024px) {
          .layout-header {
            left: 0 !important;
            right: 0 !important;
          }

          ${isHorizontal ? '' : (isRtl
            ? `html[dir="rtl"] .layout-header { right: ${headerLeft}px !important; }`
            : `html[dir="ltr"] .layout-header { left: ${headerLeft}px !important; }`)}
        }
      `}</style>
      <div className={`${isHorizontal ? 'layout-container' : 'w-full px-4'} h-full flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle */}
          {!isHorizontal && (
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors"
              aria-label={t('header.aria.toggle_mobile_menu')}
            >
              <Icon icon={Icons.menu} className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
            </button>
          )}
          
          {/* Desktop Sidebar Toggle */}
          {!isHorizontal && (
            <button
              onClick={onToggleSidebar}
              className="hidden lg:block p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors"
              aria-label={t('header.aria.toggle_sidebar')}
            >
              {isCollapsed ? (
                <Icon icon={Icons.chevronRight} className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
              ) : (
                <Icon icon={Icons.chevronLeft} className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
              )}
            </button>
          )}

          {isHorizontal && (
            <Link to="/" className="flex items-center gap-2 me-3" aria-label="Adminex Home">
              <Logo height={35} />
            </Link>
          )}

          <div className="hidden xl:flex items-center gap-1" ref={megaRef}>
            <TopLink to="/dashboard" label={t('header.top.dashboard')} />
            <TopLink to="/pages/pricing" label={t('header.top.pages')} />

            {menus.map((m) => (
              <div key={m.id} className="relative">
                <button
                  type="button"
                  className={
                    openMega === m.id
                      ? 'px-3 py-2 rounded-lg text-sm font-medium bg-surface-100 dark:bg-surface-800 text-secondary-900 dark:text-white inline-flex items-center gap-1'
                      : 'px-3 py-2 rounded-lg text-sm font-medium text-secondary-600 dark:text-secondary-300 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-secondary-900 dark:hover:text-white inline-flex items-center gap-1'
                  }
                  aria-haspopup="menu"
                  aria-expanded={openMega === m.id}
                  onMouseEnter={() => openMegaMenu(m.id)}
                  onMouseLeave={scheduleMegaClose}
                  onClick={() => {
                    clearMegaCloseTimer()
                    setOpenMega((cur) => (cur === m.id ? null : m.id))
                  }}
                >
                  {m.label}
                  <Icon icon={Icons.chevronDown} className="w-4 h-4" />
                </button>

                {openMega === m.id && (
                  <div
                    className="absolute left-0 mt-2 w-[860px] rounded-3xl border border-surface-200/80 dark:border-surface-700 bg-white dark:bg-surface-900 shadow-2xl p-5 z-[1035]"
                    onMouseEnter={() => openMegaMenu(m.id)}
                    onMouseLeave={scheduleMegaClose}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-secondary-500 dark:text-secondary-400">{m.label}</p>
                        <p className="text-sm text-secondary-600 dark:text-secondary-300 mt-1">{t('header.quick_access')}</p>
                      </div>
                      <button
                        type="button"
                        className="text-sm text-secondary-500 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white"
                        onClick={() => setOpenMega(null)}
                      >
                        {t('common.close')}
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {m.items.map((it) => (
                        <Link
                          key={it.to}
                          to={it.to}
                          className={
                            'group flex items-start gap-3 rounded-2xl p-4 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors border border-transparent hover:border-surface-200/70 dark:hover:border-surface-700 ' +
                            (location.pathname.startsWith(it.to) ? 'bg-surface-50 dark:bg-surface-800 border-surface-200/70 dark:border-surface-700' : '')
                          }
                          onClick={() => setOpenMega(null)}
                        >
                          <div className="w-11 h-11 rounded-2xl bg-theme-primary/10 text-theme-primary flex items-center justify-center flex-shrink-0">
                            <Icon icon={it.icon} className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-ui font-semibold text-secondary-900 dark:text-white truncate">{it.title}</p>
                              {it.badge && (
                                <span className="px-2 py-0.5 text-ui-xs rounded-full bg-danger-100 text-danger-600 dark:bg-danger-900/30 dark:text-danger-300">
                                  {it.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-secondary-600 dark:text-secondary-300 mt-1 line-clamp-2">{it.description}</p>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {m.footer && (
                      <div className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-700 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-secondary-500 dark:text-secondary-400">{t('header.shortcuts')}</span>
                          <Link
                            to="/forms/layout"
                            className="text-xs px-2.5 py-1 rounded-full bg-surface-100 dark:bg-surface-800 text-secondary-700 dark:text-secondary-200 hover:bg-surface-200 dark:hover:bg-surface-700"
                            onClick={() => setOpenMega(null)}
                          >
                            {t('header.components.forms')}
                          </Link>
                          <Link
                            to="/tables/data"
                            className="text-xs px-2.5 py-1 rounded-full bg-surface-100 dark:bg-surface-800 text-secondary-700 dark:text-secondary-200 hover:bg-surface-200 dark:hover:bg-surface-700"
                            onClick={() => setOpenMega(null)}
                          >
                            {t('header.components.tables')}
                          </Link>
                          <Link
                            to="/charts/line"
                            className="text-xs px-2.5 py-1 rounded-full bg-surface-100 dark:bg-surface-800 text-secondary-700 dark:text-secondary-200 hover:bg-surface-200 dark:hover:bg-surface-700"
                            onClick={() => setOpenMega(null)}
                          >
                            {t('header.components.charts')}
                          </Link>
                        </div>

                        <Link
                          to={m.footer.to}
                          className="text-sm font-semibold text-theme-primary hover:underline"
                          onClick={() => setOpenMega(null)}
                        >
                          {m.footer.label}
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="lg:hidden p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors"
            aria-label={t('common.search')}
          >
            <Icon icon={Icons.search} className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
          </button>
          
          <div className="hidden lg:flex items-center">
            <div className="relative">
              <Icon icon={Icons.search} className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
              <input
                type="text"
                placeholder={t('search_placeholder')}
                className="w-48 xl:w-72 pl-10 pr-4 py-2 bg-surface-100 dark:bg-surface-800 border-0 rounded-lg text-sm text-secondary-900 dark:text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-theme-primary/20"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="lg:hidden p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors"
            aria-label={t('common.search')}
          >
            <Icon icon={Icons.search} className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
          </button>
          
          <Link
            to="/app/blog/create"
            className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-theme-primary text-white text-sm font-medium hover:bg-theme-primary-dark transition-colors"
          >
            <Icon icon={Icons.plus} className="w-4 h-4" />
            <span className="hidden lg:inline">{t('create')}</span>
          </Link>

          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          <div className="relative" ref={notifRef}>
            <button
              className="relative p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors"
              onClick={() => setNotifOpen((v) => !v)}
              aria-label={t('header.notifications')}
              aria-expanded={notifOpen}
            >
              <Icon icon={Icons.bell} className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full ring-2 ring-white dark:ring-surface-900"></span>
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 shadow-xl p-3 z-[1035]">
                <div className="flex items-center justify-between px-2 py-1">
                  <p className="text-sm font-semibold text-secondary-900 dark:text-white">{t('header.notifications')}</p>
                  <Link
                    to="/pages/account-settings"
                    className="text-xs text-theme-primary hover:underline"
                    onClick={() => setNotifOpen(false)}
                  >
                    {t('common.manage')}
                  </Link>
                </div>
                <div className="mt-2 space-y-2">
                  <div className="rounded-xl p-3 bg-surface-50 dark:bg-surface-800">
                    <p className="text-sm text-secondary-900 dark:text-white">New message in Chat</p>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">2 minutes ago</p>
                  </div>
                  <div className="rounded-xl p-3 bg-surface-50 dark:bg-surface-800">
                    <p className="text-sm text-secondary-900 dark:text-white">Order #1024 paid</p>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">Today</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={userRef}>
            <button
              onClick={() => setUserOpen((v) => !v)}
              className="flex items-center gap-3 ps-2 border-s border-surface-200 dark:border-surface-700 ms-2"
              aria-label={t('header.user_menu')}
              aria-expanded={userOpen}
            >
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-secondary-900 dark:text-white">John Doe</p>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">Admin</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-theme-primary flex items-center justify-center text-white text-sm font-semibold">
                JD
              </div>
            </button>

            {userOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 shadow-xl p-2 z-[1035]">
                <Link
                  to="/pages/account-settings"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-secondary-700 dark:text-secondary-200 hover:bg-surface-50 dark:hover:bg-surface-800"
                  onClick={() => setUserOpen(false)}
                >
                  <Icon icon={Icons.user} className="w-5 h-5" />
                  {t('common.profile')}
                </Link>
                <Link
                  to="/pages/account-settings"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-secondary-700 dark:text-secondary-200 hover:bg-surface-50 dark:hover:bg-surface-800"
                  onClick={() => setUserOpen(false)}
                >
                  <Icon icon={Icons.settings} className="w-5 h-5" />
                  {t('common.settings')}
                </Link>
                <Link
                  to="/pages/faq"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-secondary-700 dark:text-secondary-200 hover:bg-surface-50 dark:hover:bg-surface-800"
                  onClick={() => setUserOpen(false)}
                >
                  <Icon icon={Icons.help} className="w-5 h-5" />
                  {t('common.help')}
                </Link>
                <div className="my-2 border-t border-surface-200 dark:border-surface-700" />
                <Link
                  to="/auth/login"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/20"
                  onClick={() => setUserOpen(false)}
                >
                  <Icon icon={Icons.logout} className="w-5 h-5" />
                  {t('common.logout')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Search Dropdown */}
      {searchOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800 p-4 shadow-lg z-[1019]">
          <div className="relative">
            <Icon icon={Icons.search} className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
            <input
              type="text"
              placeholder={t('search_placeholder')}
              autoFocus
              className="w-full pl-10 pr-4 py-2.5 bg-surface-100 dark:bg-surface-800 border-0 rounded-lg text-sm text-secondary-900 dark:text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-theme-primary/20"
            />
          </div>
        </div>
      )}
    </header>
  )
}
