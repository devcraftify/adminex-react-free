import { Link } from 'react-router'
import { Icon, Icons, Logo } from '@/components/common'
import { useLocale } from '@/i18n'
import { PRO_DEMO_BASE_URL } from '@/config/pro'

const BUILT_WITH = [
  { icon: Icons.brandReact, label: 'React 19' },
  { icon: Icons.typescript, label: 'TypeScript' },
  { icon: Icons.bolt, label: 'Vite' },
]

export function LandingFooter() {
  const { t } = useLocale()
  const year = new Date().getFullYear()

  const productLinks = [
    { label: t('landing.footer.links.live_demo'), to: '/dashboard' },
    { label: t('header.components.tables'), to: '/tables/data' },
  ] as const

  const pageLinks = [
    { label: t('pages.account_settings'), to: '/pages/account-settings' },
    { label: t('nav.typography'), to: '/pages/typography' },
  ] as const

  const authLinks = [
    { label: t('landing.footer.links.login'), to: '/auth/login' },
    { label: t('landing.footer.links.register'), to: '/auth/register' },
  ] as const

  return (
    <footer className="px-4 pt-16 pb-8 bg-surface-50 border-t border-surface-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12">
          <div className="md:col-span-4">
            <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
              <Logo width={140} height={28} />
            </Link>
            <p className="text-body-sm text-secondary-600 mt-4 max-w-sm leading-relaxed">
              {t('landing.footer.description')}
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-6">
              {BUILT_WITH.map((item) => (
                <div key={item.label} className="flex items-center gap-1.5 text-secondary-500">
                  <Icon icon={item.icon} className="w-4 h-4" />
                  <span className="text-ui-xs font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Icon icon={Icons.layoutGrid} className="w-4 h-4 text-theme-primary" />
                <p className="text-label text-secondary-900">{t('landing.footer.product')}</p>
              </div>
              <div className="space-y-3">
                {productLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="group flex items-center gap-1.5 text-body-sm text-secondary-500 hover:text-theme-primary transition-colors w-fit"
                  >
                    {link.label}
                    <Icon
                      icon={Icons.arrowUpRight}
                      className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                    />
                  </Link>
                ))}
                <a
                  href={`${PRO_DEMO_BASE_URL}/charts/line`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-1.5 text-body-sm text-secondary-500 hover:text-theme-primary transition-colors w-fit"
                >
                  {t('nav.charts')}
                  <Icon
                    icon={Icons.arrowUpRight}
                    className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                  />
                </a>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Icon icon={Icons.file} className="w-4 h-4 text-theme-primary" />
                <p className="text-label text-secondary-900">{t('landing.footer.pages')}</p>
              </div>
              <div className="space-y-3">
                {pageLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="group flex items-center gap-1.5 text-body-sm text-secondary-500 hover:text-theme-primary transition-colors w-fit"
                  >
                    {link.label}
                    <Icon
                      icon={Icons.arrowUpRight}
                      className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                    />
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Icon icon={Icons.lock} className="w-4 h-4 text-theme-primary" />
                <p className="text-label text-secondary-900">{t('landing.footer.auth')}</p>
              </div>
              <div className="space-y-3">
                {authLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="group flex items-center gap-1.5 text-body-sm text-secondary-500 hover:text-theme-primary transition-colors w-fit"
                  >
                    {link.label}
                    <Icon
                      icon={Icons.arrowUpRight}
                      className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-surface-200 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          <p className="text-body-sm text-secondary-500">{t('landing.footer.copyright', { year })}</p>
          <a
            href="#top"
            className="inline-flex items-center gap-1.5 text-body-sm font-medium text-secondary-600 hover:text-theme-primary transition-colors"
          >
            {t('landing.footer.back_to_top')}
            <Icon icon={Icons.arrowUp} className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </footer>
  )
}
