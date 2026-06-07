import { useMemo } from 'react'
import { AreaChart } from '@/components/charts'
import { chartColors } from '@/components/charts/chartConfig'
import { useLocale } from '@/i18n'

export function AreaChartsPage() {
  const { locale, t } = useLocale()

  const monthLabels = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(locale, { month: 'short' })
    return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(2024, i, 1)))
  }, [locale])

  const revenue = useMemo(
    () => ({
      labels: monthLabels,
      datasets: [
        {
          label: t('charts.dataset.revenue'),
          data: [18500, 22400, 19800, 28200, 32100, 28800, 35200],
          fill: true,
          borderColor: chartColors.blue.solid,
          backgroundColor: chartColors.blue.light,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 6,
        },
      ],
    }),
    [monthLabels, t],
  )

  const stackedAreas = useMemo(
    () => ({
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [
        {
          label: t('charts.dataset.subscriptions'),
          data: [12000, 15500, 17800, 21000],
          fill: true,
          borderColor: chartColors.purple.solid,
          backgroundColor: chartColors.purple.light,
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 0,
        },
        {
          label: t('charts.dataset.one_time'),
          data: [6500, 6900, 7200, 8300],
          fill: true,
          borderColor: chartColors.green.solid,
          backgroundColor: chartColors.green.light,
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 0,
        },
      ],
    }),
    [t],
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-2 text-secondary-900 dark:text-white">{t('charts.area_chart')}</h1>
        <p className="text-body-sm mt-1 text-secondary-500 dark:text-secondary-400">{t('charts.area.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="card rounded-xl p-6">
          <h2 className="heading-5 text-secondary-900 dark:text-white">{t('charts.area.single.title')}</h2>
          <p className="text-body-sm text-secondary-500 dark:text-secondary-400 mt-1">{t('charts.area.single.desc')}</p>
          <div className="mt-4">
            <AreaChart data={revenue} height={320} />
          </div>
        </div>

        <div className="card rounded-xl p-6">
          <h2 className="heading-5 text-secondary-900 dark:text-white">{t('charts.area.multi.title')}</h2>
          <p className="text-body-sm text-secondary-500 dark:text-secondary-400 mt-1">{t('charts.area.multi.desc')}</p>
          <div className="mt-4">
            <AreaChart data={stackedAreas} height={320} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AreaChartsPage
