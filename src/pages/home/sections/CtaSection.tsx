import { Link } from 'react-router'
import { Icon, Icons } from '@/components/common'
import { useLocale } from '@/i18n'

const AVATAR_COUNT = 5

export function CtaSection() {
  const { t } = useLocale()

  const highlights = [
    t('landing.cta.highlights.items.forms'),
    t('landing.cta.highlights.items.tables'),
    t('landing.cta.highlights.items.charts'),
  ]

  return (
    <section id="cta" className="py-16 px-4 bg-white scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-3xl bg-secondary-950 p-10 sm:p-14 overflow-hidden relative">
          {/* Soft focal glows — blurred solid fills, no gradient */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-theme-primary/20 blur-[110px] pointer-events-none" aria-hidden />
          <div className="absolute -bottom-28 -left-28 w-80 h-80 rounded-full bg-theme-accent/15 blur-[110px] pointer-events-none" aria-hidden />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/5 border border-white/10 mb-6">
                <Icon icon={Icons.rocket} className="w-4 h-4 text-theme-primary" />
                <span className="text-body-sm font-semibold text-secondary-300">{t('landing.cta.badge')}</span>
              </div>

              <h2 className="text-display-section text-white mb-4">{t('landing.cta.title')}</h2>
              <p className="text-lead text-secondary-400 max-w-2xl">
                {t('landing.cta.subtitle')}
              </p>

              <div className="mt-9 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/auth/register"
                  className="btn-theme-primary px-8 py-4 rounded-xl font-bold inline-flex items-center justify-center gap-2"
                >
                  {t('landing.cta.primary')}
                  <Icon icon={Icons.arrowRight} className="w-5 h-5" />
                </Link>
                <Link
                  to="/dashboard"
                  className="px-8 py-4 rounded-xl font-bold border border-white/15 text-white hover:bg-white/5 transition-colors text-center"
                >
                  {t('landing.cta.secondary')}
                </Link>
              </div>

              <div className="mt-10 flex items-center gap-4">
                <div className="flex -space-x-2.5">
                  {Array.from({ length: AVATAR_COUNT }).map((_, i) => (
                    <img
                      key={i}
                      src={`/assets/avatars/avatar${i + 8}.jpg`}
                      alt=""
                      className="w-8 h-8 rounded-full border-2 border-secondary-950 object-cover"
                    />
                  ))}
                </div>
                <p className="text-body-sm text-secondary-400">{t('landing.cta.social_proof')}</p>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                <p className="text-label text-white mb-4">{t('landing.cta.highlights.title')}</p>
                <ul className="space-y-3">
                  {highlights.map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                        <Icon icon={Icons.check} className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-body-sm text-secondary-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
