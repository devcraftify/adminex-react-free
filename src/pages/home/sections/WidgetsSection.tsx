import { Icons } from '@/components/common'
import { StatCard, ActivityItem, ProgressBar } from '@/components/dashboard'
import { AreaChart, DoughnutChart } from '@/components/charts'
import '@/components/charts/chartConfig'
import type { ChartOptions } from 'chart.js'
import { useLocale } from '@/i18n'

const sparklineOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { enabled: false } },
  scales: { x: { display: false }, y: { display: false } },
  layout: { padding: 0 },
}

const revenueChartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      fill: true,
      data: [25, 35, 32, 48, 42, 58, 62],
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 2.5,
      tension: 0.4,
      pointRadius: 0,
    },
  ],
}

const breakdownData = {
  labels: ['Direct', 'Referral'],
  datasets: [{ data: [72, 28], backgroundColor: ['#3B82F6', '#BFDBFE'], borderWidth: 0 }],
}

export function WidgetsSection() {
  const { t } = useLocale()

  return (
    <section
      id="widgets"
      className="py-24 px-4 bg-surface-50 scroll-mt-24 relative overflow-hidden"
    >
      {/* Soft focal glow — blurred solid fill, no pattern */}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-theme-primary/6 rounded-full blur-[130px] -translate-y-1/3 translate-x-1/3 pointer-events-none" aria-hidden />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white border border-surface-200 shadow-xs mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-theme-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-theme-primary"></span>
            </span>
            <span className="text-body-sm font-semibold text-secondary-600">
              {t('landing.widgets.badge')}
            </span>
          </div>

          <h2 className="text-display-section text-secondary-900 mb-6">
            {t('landing.widgets.title_prefix')} <span className="text-gradient">{t('landing.widgets.title_emphasis')}</span>
          </h2>
          <p className="text-lead text-secondary-600 leading-relaxed">
            {t('landing.widgets.subtitle')}
          </p>
        </div>

        {/* Bento grid — every card is a real component imported from the dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5">
          {/* Revenue chart */}
          <div className="lg:col-span-7 card rounded-xl p-6">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-secondary-500 font-medium">{t('landing.widgets.revenue_overview.title')}</p>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            </div>
            <p className="heading-4 text-secondary-900 mb-4">{t('landing.widgets.revenue_overview.subtitle')}</p>
            <div className="h-[160px]">
              <AreaChart data={revenueChartData} options={sparklineOptions} height={160} />
            </div>
          </div>

          {/* Traffic breakdown */}
          <div className="lg:col-span-5 card rounded-xl p-6">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-secondary-500 font-medium">{t('landing.widgets.breakdown.title')}</p>
            </div>
            <p className="heading-4 text-secondary-900 mb-4">{t('landing.widgets.breakdown.subscriptions')}</p>
            <div className="h-[160px]">
              <DoughnutChart data={breakdownData} height={160} centerText="72%" centerSubtext={t('landing.widgets.breakdown.subscriptions')} />
            </div>
          </div>

          {/* Stat card */}
          <div className="lg:col-span-4">
            <StatCard
              label={t('landing.widgets.items.revenue')}
              value="$48,295"
              change="+12%"
              icon={Icons.currencyDollar}
              iconBg="bg-blue-50"
              iconColor="text-blue-500"
              showMenu={false}
            />
          </div>

          {/* Activity feed */}
          <div className="lg:col-span-4 card rounded-xl p-5">
            <p className="text-label text-secondary-900 mb-2">{t('landing.widgets.components.activity_feed')}</p>
            <div className="space-y-1">
              <ActivityItem
                title={t('landing.widgets.activity.new_user')}
                time="2m"
                icon={Icons.userPlus}
                iconBg="bg-emerald-50"
                iconColor="text-emerald-500"
              />
              <ActivityItem
                title={t('landing.widgets.activity.order_completed')}
                time="18m"
                icon={Icons.circleCheck}
                iconBg="bg-blue-50"
                iconColor="text-blue-500"
              />
            </div>
          </div>

          {/* Progress bars */}
          <div className="lg:col-span-4 card rounded-xl p-5">
            <p className="text-label text-secondary-900 mb-4">{t('landing.widgets.components.progress')}</p>
            <div className="space-y-4">
              <ProgressBar label={t('landing.widgets.components.storage')} value={68} color="bg-blue-500" />
              <ProgressBar label={t('landing.widgets.components.tasks')} value={42} color="bg-emerald-500" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
