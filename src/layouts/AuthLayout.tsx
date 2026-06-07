import { Outlet, Link } from 'react-router-dom'
import { Logo } from '@/components/common'
import { useLocale } from '@/i18n'

/**
 * Auth Layout Component - Side Layout
 * Split screen with branding on left, form on right
 */
export function AuthLayout() {
  const { t } = useLocale()
  const year = new Date().getFullYear()

  return (
    <div className="min-h-screen flex bg-surface-50 dark:bg-surface-950">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-secondary-900 p-12 flex-col justify-between">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-theme-primary/10 blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-theme-accent/10 blur-[100px]" />
        </div>

        <div className="relative z-10">
          <Link to="/" className="inline-block">
            <img src="/assets/logo/logo-dark.svg" alt={t('brand.name')} width={160} height={32} />
          </Link>
        </div>
        
        <div className="relative z-10 space-y-8">
          <h2 className="text-display-section text-white">
            {t('auth.side.title_prefix')} <br />
            <span className="text-gradient">
              {t('auth.side.title_emphasis')}
            </span>
          </h2>
          <p className="text-lead text-secondary-200/80 max-w-md leading-relaxed">
            {t('auth.side.subtitle')}
          </p>
          
          {/* Feature List */}
          <div className="flex flex-wrap gap-4 pt-4">
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-theme-primary" />
              <span className="text-sm text-white font-medium">{t('nav.overview')}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-theme-accent" />
              <span className="text-sm text-white font-medium">{t('nav.calendar')}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-sm text-white font-medium">{t('nav.contacts')}</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex justify-between items-end">
          <p className="text-secondary-200/60 text-sm">
            {t('footer.copyright_all_rights', { year })}
          </p>
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12 bg-surface-50 dark:bg-surface-950">
        <div className="w-full max-w-[440px]">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

/**
 * Auth Layout Component - Centered Card Layout
 * Centered card with optional background
 */
export function AuthCardLayout() {
  const { t } = useLocale()
  const year = new Date().getFullYear()

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface-100 dark:bg-surface-950 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] rounded-full opacity-20 blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgb(var(--theme-primary)) 0%, transparent 70%)' }}
        />
        <div 
          className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] rounded-full opacity-20 blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgb(var(--theme-accent)) 0%, transparent 70%)' }}
        />
      </div>

      {/* Card Container */}
      <div className="relative w-full max-w-[480px]">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center">
            <Logo width={160} height={32} />
          </Link>
        </div>

        {/* Auth Card */}
        <div className="bg-white dark:bg-surface-900 rounded-[2rem] p-8 md:p-10 shadow-xl border border-surface-200 dark:border-surface-800">
          <Outlet />
        </div>

        {/* Footer */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            {t('footer.copyright_all_rights', { year })}
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <Link to="#" className="text-secondary-500 hover:text-theme-primary transition-colors">{t('pages.privacy_policy')}</Link>
            <span className="text-surface-300">•</span>
            <Link to="#" className="text-secondary-500 hover:text-theme-primary transition-colors">{t('pages.terms_of_service')}</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
