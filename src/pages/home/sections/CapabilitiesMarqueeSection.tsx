import { Icon, Icons, type IconName } from '@/components/common'
import { useLocale } from '@/i18n'

type MarqueeItem = { icon: IconName; label: string; color: string; bg: string }

export function CapabilitiesMarqueeSection() {
  const { t } = useLocale()

  const items: MarqueeItem[] = [
    { icon: Icons.dashboard, label: t('nav.overview'), color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { icon: Icons.chartBar, label: t('nav.charts'), color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { icon: Icons.calendar, label: t('nav.calendar'), color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { icon: Icons.contacts, label: t('nav.contacts'), color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { icon: Icons.checklist, label: t('nav.forms'), color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { icon: Icons.table, label: t('nav.table'), color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { icon: Icons.typescript, label: t('landing.capabilities.typescript'), color: 'text-sky-500', bg: 'bg-sky-500/10' },
  ]

  const loops = [0, 1] as const

  return (
    <section
      id="capabilities"
      className="group relative py-5 border-y border-surface-200 bg-white overflow-hidden"
    >
      {/* Edge fade masks (alpha only — no color gradient) */}
      <div className="absolute inset-y-0 left-0 w-16 sm:w-28 z-10 bg-white [mask-image:linear-gradient(to_right,black,transparent)] pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 sm:w-28 z-10 bg-white [mask-image:linear-gradient(to_left,black,transparent)] pointer-events-none" />

      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
        {loops.map((loop) => (
          <div key={loop} className="flex items-center shrink-0" aria-hidden={loop === 1}>
            {items.map((item, i) => (
              <div key={`${loop}-${i}`} className="flex items-center gap-5 sm:gap-6 pr-5 sm:pr-6">
                <div className="flex items-center gap-2.5 whitespace-nowrap">
                  <span className={`flex items-center justify-center w-7 h-7 rounded-full ${item.bg} ${item.color} shrink-0`}>
                    <Icon icon={item.icon} className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-body-sm font-medium text-secondary-600">
                    {item.label}
                  </span>
                </div>
                <span className="w-px h-4 bg-surface-200" aria-hidden />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
