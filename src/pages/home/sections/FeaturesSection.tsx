import { Icon, Icons } from '@/components/common'
import { useLocale } from '@/i18n'

const features = [
  {
    icon: Icons.bolt,
    titleKey: 'landing.features.items.lightning_fast.title',
    descriptionKey: 'landing.features.items.lightning_fast.desc',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
  },
  {
    icon: Icons.palette,
    titleKey: 'landing.features.items.modern_design.title',
    descriptionKey: 'landing.features.items.modern_design.desc',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
  {
    icon: Icons.deviceMobile,
    titleKey: 'landing.features.items.fully_responsive.title',
    descriptionKey: 'landing.features.items.fully_responsive.desc',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Icons.heart,
    titleKey: 'landing.features.items.free_forever.title',
    descriptionKey: 'landing.features.items.free_forever.desc',
    color: 'text-secondary-300',
    bg: 'bg-secondary-500/10',
  },
  {
    icon: Icons.lock,
    titleKey: 'landing.features.items.auth_ready.title',
    descriptionKey: 'landing.features.items.auth_ready.desc',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
  },
  {
    icon: Icons.package,
    titleKey: 'landing.features.items.typescript.title',
    descriptionKey: 'landing.features.items.typescript.desc',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
  },
  {
    icon: Icons.brandReact,
    titleKey: 'landing.features.items.react19.title',
    descriptionKey: 'landing.features.items.react19.desc',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
  },
  {
    icon: Icons.rocket,
    titleKey: 'landing.features.items.production_ui.title',
    descriptionKey: 'landing.features.items.production_ui.desc',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
  },
] as const

export function FeaturesSection() {
  const { t } = useLocale()

  return (
    <section id="features" className="py-24 px-4 bg-secondary-950 scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/5 border border-white/10 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-theme-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-theme-primary"></span>
            </span>
            <span className="text-body-sm font-semibold text-secondary-300">
              {t('landing.features.badge')}
            </span>
          </div>
          <h2 className="text-display-section text-white mb-6">
            {t('landing.features.title_prefix')} <span className="text-gradient">{t('landing.features.title_emphasis')}</span>
          </h2>
          <p className="text-lead text-secondary-400 max-w-2xl mx-auto">
            {t('landing.features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <div
              key={f.titleKey}
              className="p-6 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors duration-300"
            >
              <div className={`w-12 h-12 rounded-lg ${f.bg} flex items-center justify-center mb-5`}>
                <Icon icon={f.icon} className={`w-6 h-6 ${f.color}`} />
              </div>
              <h3 className="heading-5 text-white mb-2">
                {t(f.titleKey)}
              </h3>
              <p className="text-body-sm text-secondary-400 leading-relaxed">
                {t(f.descriptionKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
