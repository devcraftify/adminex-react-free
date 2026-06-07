/**
 * Analytics Dashboard
 * UX Structure: Full-width data visualization focus
 * - Stat cards for key metrics
 * - Hero chart takes prominence
 * - Data tables and lists dominate
 */
import { Icon, Icons } from '@/components/common'
import { AreaChart, BarChart, DoughnutChart } from '@/components/charts'
import { chartColors } from '@/components/charts/chartConfig'
import { topPages, browserStats, countries } from '@/data'
import { StatCard, ChartCard } from '@/components/dashboard'
import { useLocale } from '@/i18n'

export function AnalyticsDashboard() {
  const { t } = useLocale()
  const trafficData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'],
    datasets: [
      {
        label: 'Visitors',
        data: [2400, 3200, 2800, 3600, 4100, 3200, 2100, 2800, 3400, 3100, 3800, 4200, 3400, 4800],
        fill: true,
        borderColor: chartColors.blue.solid,
        backgroundColor: chartColors.blue.light,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
    ],
  }

  const hourlyData = {
    labels: ['12AM', '3AM', '6AM', '9AM', '12PM', '3PM', '6PM', '9PM'],
    datasets: [{
      label: 'Sessions',
      data: [120, 80, 200, 890, 1240, 1580, 1120, 680],
      backgroundColor: chartColors.purple.solid,
      borderRadius: 4,
      borderSkipped: false,
      barThickness: 20,
    }],
  }

  const deviceData = {
    labels: ['Desktop', 'Mobile', 'Tablet'],
    datasets: [{
      data: [58, 35, 7],
      backgroundColor: [chartColors.blue.solid, chartColors.purple.solid, chartColors.orange.solid],
      borderWidth: 0,
      cutout: '70%',
    }],
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="heading-2 text-secondary-900 dark:text-white">{t('dashboard.analytics_overview')}</h1>
            <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
              <Icon icon={Icons.circleFilled} className="w-1.5 h-1.5 animate-pulse" />
              {t('dashboard.live')}
            </span>
          </div>
          <p className="text-body-sm text-secondary-500 mt-1">{t('dashboard.monitor_performance')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors text-secondary-500">
            <Icon icon={Icons.refresh} width={20} height={20} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg text-sm font-medium text-secondary-700 dark:text-secondary-300 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors">
            <Icon icon={Icons.calendar} width={16} height={16} />
            {t('dashboard.last_14_days')}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-theme-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            <Icon icon={Icons.download} width={16} height={16} />
            {t('dashboard.export')}
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label={t('dashboard.total_visitors')}
          value="45,890"
          change="12.5%"
          isPositive={true}
          icon={Icons.users}
          iconBg="bg-blue-100 dark:bg-blue-900/30"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          label={t('dashboard.page_views')}
          value="128,430"
          change="8.2%"
          isPositive={true}
          icon={Icons.eye}
          iconBg="bg-purple-100 dark:bg-purple-900/30"
          iconColor="text-purple-600 dark:text-purple-400"
        />
        <StatCard
          label={t('dashboard.avg_session_duration')}
          value="4m 32s"
          change="2.4%"
          isPositive={false}
          icon={Icons.clock}
          iconBg="bg-orange-100 dark:bg-orange-900/30"
          iconColor="text-orange-600 dark:text-orange-400"
        />
        <StatCard
          label={t('dashboard.bounce_rate')}
          value="32.8%"
          change="1.2%"
          isPositive={true}
          icon={Icons.activity}
          iconBg="bg-green-100 dark:bg-green-900/30"
          iconColor="text-green-600 dark:text-green-400"
        />
      </div>

      {/* AI Insights Banner */}
      <div className="bg-gradient-to-r from-theme-primary/10 to-purple-500/10 border border-theme-primary/20 rounded-xl p-4 flex items-start gap-4">
        <div className="p-2 bg-theme-primary/20 rounded-lg text-theme-primary">
          <Icon icon={Icons.sparkles} width={20} height={20} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-secondary-900 dark:text-white">{t('dashboard.traffic_spike_detected')}</h3>
          <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1" dangerouslySetInnerHTML={{ __html: t('dashboard.traffic_spike_description') }} />
        </div>
        <button className="ml-auto text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-200">
          <Icon icon={Icons.x} width={16} height={16} />
        </button>
      </div>

      {/* Hero Chart - Full Width Prominence */}
      <ChartCard
        title={t('dashboard.traffic_overview')}
        subtitle={t('dashboard.compare_traffic_stats')}
        action={
          <div className="flex items-center gap-2 text-sm">
            <button className="px-3 py-1 bg-theme-primary text-white rounded-lg text-xs font-medium">{t('dashboard.14_days')}</button>
            <button className="px-3 py-1 text-secondary-500 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg text-xs font-medium">{t('dashboard.30_days')}</button>
            <button className="px-3 py-1 text-secondary-500 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg text-xs font-medium">{t('dashboard.90_days')}</button>
          </div>
        }
      >
        <AreaChart data={trafficData} height={320} />
      </ChartCard>

      {/* Three Equal Columns for Supporting Data */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Devices */}
        <ChartCard title={t('dashboard.device_breakdown')} subtitle={t('dashboard.traffic_source_by_device')}>
          <div className="flex justify-center mb-6">
            <DoughnutChart data={deviceData} height={160} />
          </div>
          <div className="space-y-3">
            {[
              { icon: Icons.deviceDesktop, label: 'Desktop', value: '58%', color: 'text-blue-500', bg: 'bg-blue-500' },
              { icon: Icons.deviceMobile, label: 'Mobile', value: '35%', color: 'text-purple-500', bg: 'bg-purple-500' },
              { icon: Icons.deviceTablet, label: 'Tablet', value: '7%', color: 'text-orange-500', bg: 'bg-orange-500' },
            ].map((d) => (
              <div key={d.label} className="flex items-center justify-between p-2 hover:bg-surface-50 dark:hover:bg-surface-800/50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${d.bg}`} />
                  <div className="flex items-center gap-2">
                    <Icon icon={d.icon} width={16} height={16} className={d.color} />
                    <span className="text-sm text-secondary-600 dark:text-secondary-400">{d.label}</span>
                  </div>
                </div>
                <span className="text-sm font-bold text-secondary-900 dark:text-white">{d.value}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Browsers */}
        <ChartCard title={t('dashboard.browser_stats')} subtitle={t('dashboard.most_used_browsers')}>
          <div className="space-y-4">
            {browserStats.map((b) => (
              <div key={b.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Icon icon={Icons.brandChrome} width={16} height={16} style={{ color: b.color }} />
                    <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">{b.name}</span>
                  </div>
                  <span className="text-sm font-bold text-secondary-900 dark:text-white">{b.value}%</span>
                </div>
                <div className="h-2 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${b.value}%`, backgroundColor: b.color }} />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Countries */}
        <ChartCard title={t('dashboard.top_countries')} subtitle={t('dashboard.traffic_distribution_by_country')}>
          <div className="space-y-4">
            {countries.map((c) => (
              <div key={c.name} className="flex items-center gap-3 p-2 hover:bg-surface-50 dark:hover:bg-surface-800/50 rounded-lg transition-colors">
                <span className="heading-3">{c.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-secondary-900 dark:text-white truncate">{c.name}</span>
                    <span className="text-xs font-semibold text-secondary-500">{c.sessions.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden">
                    <div className="h-full bg-theme-primary rounded-full" style={{ width: `${c.percentage}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Data Table - Primary Content */}
        <div className="lg:col-span-2 card rounded-xl overflow-hidden">
          <div className="p-6 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">{t('dashboard.top_pages')}</h2>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">{t('dashboard.most_visited_pages')}</p>
            </div>
            <button className="text-sm text-theme-primary font-medium hover:underline flex items-center gap-1">
              {t('dashboard.view_full_report')} <Icon icon={Icons.externalLink} width={14} height={14} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-50 dark:bg-surface-800/50">
                <tr>
                  <th className="text-left py-3 px-6 text-xs font-semibold text-secondary-500 uppercase tracking-wider">{t('dashboard.page_name')}</th>
                  <th className="text-right py-3 px-6 text-xs font-semibold text-secondary-500 uppercase tracking-wider">{t('dashboard.views')}</th>
                  <th className="text-right py-3 px-6 text-xs font-semibold text-secondary-500 uppercase tracking-wider">{t('dashboard.unique')}</th>
                  <th className="text-right py-3 px-6 text-xs font-semibold text-secondary-500 uppercase tracking-wider">{t('dashboard.avg_time')}</th>
                  <th className="text-right py-3 px-6 text-xs font-semibold text-secondary-500 uppercase tracking-wider">{t('dashboard.bounce')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                {topPages.map((page) => (
                  <tr key={page.path} className="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors">
                    <td className="py-4 px-6">
                      <p className="text-sm font-medium text-secondary-900 dark:text-white">{page.title}</p>
                      <p className="text-xs text-secondary-400 mt-0.5">{page.path}</p>
                    </td>
                    <td className="py-4 px-6 text-sm text-secondary-900 dark:text-white text-right font-medium">{page.views.toLocaleString()}</td>
                    <td className="py-4 px-6 text-sm text-secondary-600 dark:text-secondary-400 text-right">{page.unique.toLocaleString()}</td>
                    <td className="py-4 px-6 text-sm text-secondary-600 dark:text-secondary-400 text-right">{page.avgTime}</td>
                    <td className="py-4 px-6 text-right">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        parseInt(page.bounce) < 40 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : parseInt(page.bounce) < 60
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {page.bounce}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sessions by Hour - Secondary Chart */}
        <ChartCard 
          title={t('dashboard.sessions_by_hour')} 
          subtitle={t('dashboard.peak_traffic_times')}
          action={
            <div className="flex items-center gap-2 text-sm bg-surface-100 dark:bg-surface-800 px-3 py-1 rounded-lg">
              <span className="text-secondary-500">{t('dashboard.peak')}:</span>
              <span className="font-bold text-secondary-900 dark:text-white">3:00 PM</span>
            </div>
          }
        >
          <BarChart data={hourlyData} height={280} />
          <div className="mt-4 pt-4 border-t border-surface-100 dark:border-surface-800">
            <div className="flex items-center justify-between text-sm">
              <span className="text-secondary-500">{t('dashboard.lowest_traffic')}</span>
              <span className="font-medium text-secondary-900 dark:text-white">3:00 AM (80)</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-secondary-500">{t('dashboard.average_per_hour')}</span>
              <span className="font-medium text-secondary-900 dark:text-white">731</span>
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  )
}
