import { useMemo } from 'react'
import { DoughnutChart, PieChart } from '@/components/charts'
import { chartColors } from '@/components/charts/chartConfig'
import { useLocale } from '@/i18n'

export function PieDoughnutChartsPage() {
  const { t } = useLocale()

  const pie = useMemo(
    () => ({
      labels: [t('charts.source.organic'), t('charts.source.paid'), t('charts.source.referral'), t('charts.source.email')],
      datasets: [
        {
          data: [42, 28, 18, 12],
          backgroundColor: [
            chartColors.blue.solid,
            chartColors.purple.solid,
            chartColors.green.solid,
            chartColors.orange.solid,
          ],
          borderWidth: 0,
        },
      ],
    }),
    [t],
  )

  const doughnut = useMemo(
    () => ({
      labels: ['Chrome', 'Safari', 'Firefox', 'Edge'],
      datasets: [
        {
          data: [58, 19, 14, 9],
          backgroundColor: [
            chartColors.blue.solid,
            chartColors.cyan.solid,
            chartColors.orange.solid,
            chartColors.purple.solid,
          ],
          borderWidth: 0,
        },
      ],
    }),
    [],
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-2 text-secondary-900 dark:text-white">{t('charts.pie_doughnut.title')}</h1>
        <p className="text-body-sm mt-1 text-secondary-500 dark:text-secondary-400">{t('charts.pie_doughnut.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="card rounded-xl p-6">
          <h2 className="heading-5 text-secondary-900 dark:text-white">{t('charts.pie.title')}</h2>
          <p className="text-body-sm text-secondary-500 dark:text-secondary-400 mt-1">{t('charts.pie.desc')}</p>
          <div className="mt-4">
            <PieChart data={pie} height={300} />
          </div>
        </div>

        <div className="card rounded-xl p-6">
          <h2 className="heading-5 text-secondary-900 dark:text-white">{t('charts.doughnut.title')}</h2>
          <p className="text-body-sm text-secondary-500 dark:text-secondary-400 mt-1">{t('charts.doughnut.desc')}</p>
          <div className="mt-4">
            <DoughnutChart data={doughnut} height={300} centerText="58%" centerSubtext="Chrome" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PieDoughnutChartsPage
