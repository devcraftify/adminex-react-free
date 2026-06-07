import { useMemo } from 'react'
import { CandlestickChart } from '@/components/charts'
import { useLocale } from '@/i18n'
import type { ChartData, ChartOptions, TooltipItem } from 'chart.js'

// Type for candlestick data point (OHLC)
interface OHLCDataPoint {
  x: number
  o: number
  h: number
  l: number
  c: number
}

export function CandlestickChartsPage() {
  const { locale, t } = useLocale()

  const labels = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(locale, { weekday: 'short' })
    const base = new Date(2024, 0, 1) // Monday
    return Array.from({ length: 5 }, (_, i) => fmt.format(new Date(2024, 0, base.getDate() + i)))
  }, [locale])

  const data = useMemo(
    () => ({
      datasets: [
        {
          label: 'AAPL (Demo)',
          data: [
            { x: 0, o: 185, h: 192, l: 182, c: 190 },
            { x: 1, o: 190, h: 195, l: 188, c: 191 },
            { x: 2, o: 191, h: 193, l: 186, c: 187 },
            { x: 3, o: 187, h: 189, l: 180, c: 183 },
            { x: 4, o: 183, h: 188, l: 181, c: 186 },
          ],
          borderColors: {
            up: '#16a34a',
            down: '#dc2626',
            unchanged: '#64748b',
          },
          backgroundColors: {
            up: 'rgba(34, 197, 94, 0.35)',
            down: 'rgba(239, 68, 68, 0.35)',
            unchanged: 'rgba(100, 116, 139, 0.25)',
          },
        },
      ],
    }),
    [],
  )

  const options = useMemo(
    () => ({
      scales: {
        x: {
          type: 'linear' as const,
          ticks: {
            callback: (value: string | number) => labels[Number(value)] ?? '',
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: (ctx: TooltipItem<'candlestick'>) => {
              const v = ctx.raw as OHLCDataPoint
              return t('charts.candlestick.tooltip_ohlc', { o: v.o, h: v.h, l: v.l, c: v.c })
            },
          },
        },
      },
    }),
    [labels, t],
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-2 text-secondary-900 dark:text-white">{t('charts.candlestick_chart')}</h1>
        <p className="text-body-sm mt-1 text-secondary-500 dark:text-secondary-400">{t('charts.candlestick.subtitle')}</p>
      </div>

      <div className="card rounded-xl p-6">
        <h2 className="heading-5 text-secondary-900 dark:text-white">{t('charts.candlestick.demo_title')}</h2>
        <p className="text-body-sm text-secondary-500 dark:text-secondary-400 mt-1">{t('charts.candlestick.demo_desc')}</p>
        <div className="mt-4">
          <CandlestickChart data={data as ChartData<'candlestick'>} options={options as ChartOptions<'candlestick'>} height={420} />
        </div>
      </div>
    </div>
  )
}

export default CandlestickChartsPage
