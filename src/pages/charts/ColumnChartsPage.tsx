import { useMemo } from 'react'
import { BarChart } from '@/components/charts'
import { chartColors } from '@/components/charts/chartConfig'
import { useLocale } from '@/i18n'

export function ColumnChartsPage() {
  const { locale, t } = useLocale()

  const categoryLabels = useMemo(
    () => [
      t('charts.category.shoes'),
      t('charts.category.bags'),
      t('charts.category.watches'),
      t('charts.category.hoodies'),
      t('charts.category.caps'),
      t('charts.category.sunglasses'),
    ],
    [t],
  )

  const monthLabels = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(locale, { month: 'short' })
    return Array.from({ length: 6 }, (_, i) => fmt.format(new Date(2024, i, 1)))
  }, [locale])

  const columns = useMemo(
    () => ({
      labels: categoryLabels,
      datasets: [
        {
          label: t('charts.dataset.sales'),
          data: [1200, 950, 780, 1400, 620, 860],
          backgroundColor: [
            chartColors.blue.solid,
            chartColors.purple.solid,
            chartColors.green.solid,
            chartColors.orange.solid,
            chartColors.cyan.solid,
            chartColors.pink.solid,
          ],
          borderRadius: 10,
          borderSkipped: false,
        },
      ],
    }),
    [categoryLabels, t],
  )

  const stacked = useMemo(
    () => ({
      labels: monthLabels,
      datasets: [
        {
          label: t('charts.dataset.desktop'),
          data: [320, 380, 410, 520, 610, 590],
          backgroundColor: chartColors.blue.solid,
          borderRadius: 8,
        },
        {
          label: t('charts.dataset.mobile'),
          data: [280, 340, 360, 470, 540, 510],
          backgroundColor: chartColors.purple.solid,
          borderRadius: 8,
        },
      ],
    }),
    [monthLabels, t],
  )

  const stackedOptions = useMemo(
    () => ({
      scales: {
        x: { stacked: true },
        y: { stacked: true },
      },
    }),
    [],
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-2 text-secondary-900 dark:text-white">{t('charts.columns.title')}</h1>
        <p className="text-body-sm mt-1 text-secondary-500 dark:text-secondary-400">{t('charts.columns.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="card rounded-xl p-6">
          <h2 className="heading-5 text-secondary-900 dark:text-white">{t('charts.columns.columns.title')}</h2>
          <p className="text-body-sm text-secondary-500 dark:text-secondary-400 mt-1">{t('charts.columns.columns.desc')}</p>
          <div className="mt-4">
            <BarChart data={columns} height={320} />
          </div>
        </div>

        <div className="card rounded-xl p-6">
          <h2 className="heading-5 text-secondary-900 dark:text-white">{t('charts.columns.stacked.title')}</h2>
          <p className="text-body-sm text-secondary-500 dark:text-secondary-400 mt-1">{t('charts.columns.stacked.desc')}</p>
          <div className="mt-4">
            <BarChart data={stacked} height={320} options={stackedOptions as never} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ColumnChartsPage
