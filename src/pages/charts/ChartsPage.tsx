import { useMemo } from 'react'
import { AreaChart, BarChart, DoughnutChart, LineChart } from '@/components/charts'
import { chartColors } from '@/components/charts/chartConfig'

export function ChartsPage() {
  const revenueData = useMemo(
    () => ({
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [
        {
          label: 'Revenue',
          data: [18500, 22400, 19800, 28200, 32100, 28800, 35200],
          fill: true,
          borderColor: chartColors.blue.solid,
          backgroundColor: chartColors.blue.light,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: chartColors.blue.solid,
        },
      ],
    }),
    [],
  )

  const trafficLineData = useMemo(
    () => ({
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Visitors',
          data: [4200, 5100, 4600, 5900, 7200, 6800, 6100],
          borderColor: chartColors.purple.solid,
          backgroundColor: chartColors.purple.light,
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 6,
        },
        {
          label: 'Signups',
          data: [380, 420, 390, 510, 640, 600, 530],
          borderColor: chartColors.green.solid,
          backgroundColor: chartColors.green.light,
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 6,
        },
      ],
    }),
    [],
  )

  const salesBarData = useMemo(
    () => ({
      labels: ['Shoes', 'Bags', 'Watches', 'Hoodies', 'Caps', 'Sunglasses'],
      datasets: [
        {
          label: 'Sales',
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
    [],
  )

  const horizontalBarData = useMemo(
    () => ({
      labels: ['US', 'UK', 'Canada', 'Germany', 'France'],
      datasets: [
        {
          label: 'Orders',
          data: [520, 410, 360, 290, 240],
          backgroundColor: chartColors.blue.solid,
          borderRadius: 10,
          borderSkipped: false,
        },
      ],
    }),
    [],
  )

  const doughnutData = useMemo(
    () => ({
      labels: ['Organic', 'Paid', 'Referral', 'Email'],
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
    [],
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-2 text-secondary-900 dark:text-white">
          Charts
        </h1>
        <p className="text-body-sm mt-1 text-secondary-500 dark:text-secondary-400">
          Multiple chart examples using Chart.js + react-chartjs-2.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="card rounded-xl p-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h2 className="heading-5 text-secondary-900 dark:text-white">Area Chart</h2>
              <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
                Filled line chart for trends over time.
              </p>
            </div>
          </div>
          <AreaChart data={revenueData} height={320} />
        </div>

        <div className="card rounded-xl p-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h2 className="heading-5 text-secondary-900 dark:text-white">Line Chart</h2>
              <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
                Multiple datasets with points.
              </p>
            </div>
          </div>
          <LineChart data={trafficLineData} height={320} />
        </div>

        <div className="card rounded-xl p-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h2 className="heading-5 text-secondary-900 dark:text-white">Bar Chart</h2>
              <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
                Category comparison.
              </p>
            </div>
          </div>
          <BarChart data={salesBarData} height={320} />
        </div>

        <div className="card rounded-xl p-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h2 className="heading-5 text-secondary-900 dark:text-white">Horizontal Bar</h2>
              <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
                Ranking-style bars.
              </p>
            </div>
          </div>
          <BarChart data={horizontalBarData} height={320} horizontal />
        </div>

        <div className="card rounded-xl p-6 xl:col-span-2">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h2 className="heading-5 text-secondary-900 dark:text-white">Doughnut Chart</h2>
              <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
                Distribution breakdown.
              </p>
            </div>
            <div className="text-sm text-secondary-500 dark:text-secondary-400">
              Tip: Add legends or custom tooltips in the chart options.
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-1">
              <DoughnutChart data={doughnutData} height={280} />
            </div>
            <div className="lg:col-span-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Organic', value: '42%', color: chartColors.blue.solid },
                  { label: 'Paid', value: '28%', color: chartColors.purple.solid },
                  { label: 'Referral', value: '18%', color: chartColors.green.solid },
                  { label: 'Email', value: '12%', color: chartColors.orange.solid },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-surface-200 dark:border-surface-700 p-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">{item.label}</span>
                    </div>
                    <div className="mt-2 heading-3 text-secondary-900 dark:text-white">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChartsPage
