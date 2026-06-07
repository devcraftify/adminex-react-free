import { Icon, Icons } from '@/components/common'
import { useLocale } from '@/i18n'
import { InsightsDashboard } from '../../features/smart-insights'

/**
 * Smart Insights Page
 * 
 * Smart insights engine with heuristic analysis,
 * trend detection, anomaly alerts, and AI-powered recommendations.
 */
export function InsightsPage() {
  const { t } = useLocale()

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-100 dark:bg-accent-900/40 flex items-center justify-center">
              <Icon icon={Icons.insights} className="w-5 h-5 text-accent-600 dark:text-accent-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="heading-2 text-secondary-900 dark:text-white">{t('features.insights.title')}</h1>
                <span className="flex items-center gap-1 text-xs font-medium text-accent-600 bg-accent-100 dark:bg-accent-900/30 px-2 py-0.5 rounded-full">
                  <Icon icon={Icons.sparkles} className="w-3 h-3" />
                  {t('features.insights.ai_analysis')}
                </span>
              </div>
              <p className="text-body-sm text-secondary-500 dark:text-secondary-400 mt-0.5">
                {t('features.insights.subtitle')}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-surface-100 dark:bg-surface-800 text-xs font-medium text-secondary-600 dark:text-secondary-400">
            {t('features.insights.trend_detection')}
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-surface-100 dark:bg-surface-800 text-xs font-medium text-secondary-600 dark:text-secondary-400">
            {t('features.insights.anomaly_alerts')}
          </span>
        </div>
      </div>

      {/* Main Content - Insights Dashboard */}
      <InsightsDashboard />

      {/* Insight Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-info-100 dark:bg-info-900/40 flex items-center justify-center">
              <Icon icon={Icons.trendingUp} className="w-5 h-5 text-info-600 dark:text-info-400" />
            </div>
            <div className="font-semibold text-secondary-900 dark:text-white">{t('features.insights.trends')}</div>
          </div>
          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            {t('features.insights.trends_desc')}
          </p>
        </div>

        <div className="card rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-danger-100 dark:bg-danger-900/40 flex items-center justify-center">
              <Icon icon={Icons.alertTriangle} className="w-5 h-5 text-danger-600 dark:text-danger-400" />
            </div>
            <div className="font-semibold text-secondary-900 dark:text-white">{t('features.insights.anomalies')}</div>
          </div>
          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            {t('features.insights.anomalies_desc')}
          </p>
        </div>

        <div className="card rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-success-100 dark:bg-success-900/40 flex items-center justify-center">
              <Icon icon={Icons.star} className="w-5 h-5 text-success-600 dark:text-success-400" />
            </div>
            <div className="font-semibold text-secondary-900 dark:text-white">{t('features.insights.opportunities')}</div>
          </div>
          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            {t('features.insights.opportunities_desc')}
          </p>
        </div>

        <div className="card rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
              <Icon icon={Icons.chartLine} className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="font-semibold text-secondary-900 dark:text-white">{t('features.insights.forecasts')}</div>
          </div>
          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            {t('features.insights.forecasts_desc')}
          </p>
        </div>
      </div>

      {/* Analysis Methods */}
      <div className="card rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-surface-200 dark:border-surface-700">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white flex items-center gap-2">
            <Icon icon={Icons.cpu} className="w-5 h-5 text-secondary-500" />
            {t('features.insights.analysis_algorithms')}
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-secondary-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-info-100 dark:bg-info-900/50 flex items-center justify-center text-xs font-bold text-info-600 dark:text-info-400">1</span>
                {t('features.insights.trend_analysis')}
              </h4>
              <ul className="space-y-2 text-sm text-secondary-600 dark:text-secondary-400">
                <li className="flex items-start gap-2">
                  <Icon icon={Icons.chevronRight} className="w-4 h-4 mt-0.5 text-info-500" />
                  {t('features.insights.trend_linear_regression')}
                </li>
                <li className="flex items-start gap-2">
                  <Icon icon={Icons.chevronRight} className="w-4 h-4 mt-0.5 text-info-500" />
                  {t('features.insights.trend_percentage_change')}
                </li>
                <li className="flex items-start gap-2">
                  <Icon icon={Icons.chevronRight} className="w-4 h-4 mt-0.5 text-info-500" />
                  {t('features.insights.trend_volatility')}
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-secondary-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-warning-100 dark:bg-warning-900/50 flex items-center justify-center text-xs font-bold text-warning-600 dark:text-warning-400">2</span>
                {t('features.insights.anomaly_detection_title')}
              </h4>
              <ul className="space-y-2 text-sm text-secondary-600 dark:text-secondary-400">
                <li className="flex items-start gap-2">
                  <Icon icon={Icons.chevronRight} className="w-4 h-4 mt-0.5 text-warning-500" />
                  {t('features.insights.anomaly_zscore')}
                </li>
                <li className="flex items-start gap-2">
                  <Icon icon={Icons.chevronRight} className="w-4 h-4 mt-0.5 text-warning-500" />
                  {t('features.insights.anomaly_iqr')}
                </li>
                <li className="flex items-start gap-2">
                  <Icon icon={Icons.chevronRight} className="w-4 h-4 mt-0.5 text-warning-500" />
                  {t('features.insights.anomaly_spike_drop')}
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-secondary-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-xs font-bold text-primary-600 dark:text-primary-400">3</span>
                {t('features.insights.forecasting')}
              </h4>
              <ul className="space-y-2 text-sm text-secondary-600 dark:text-secondary-400">
                <li className="flex items-start gap-2">
                  <Icon icon={Icons.chevronRight} className="w-4 h-4 mt-0.5 text-primary-500" />
                  {t('features.insights.forecast_moving_avg')}
                </li>
                <li className="flex items-start gap-2">
                  <Icon icon={Icons.chevronRight} className="w-4 h-4 mt-0.5 text-primary-500" />
                  {t('features.insights.forecast_trend_projection')}
                </li>
                <li className="flex items-start gap-2">
                  <Icon icon={Icons.chevronRight} className="w-4 h-4 mt-0.5 text-primary-500" />
                  {t('features.insights.forecast_confidence')}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card rounded-xl p-6">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4 flex items-center gap-2">
            <Icon icon={Icons.shopping} className="w-5 h-5 text-accent-600 dark:text-accent-400" />
            {t('features.insights.ecommerce_analytics')}
          </h3>
          <ul className="space-y-2 text-sm text-secondary-600 dark:text-secondary-400">
            <li>• {t('features.insights.ecommerce_revenue')}</li>
            <li>• {t('features.insights.ecommerce_conversion')}</li>
            <li>• {t('features.insights.ecommerce_cart')}</li>
            <li>• {t('features.insights.ecommerce_product')}</li>
          </ul>
        </div>

        <div className="card rounded-xl p-6">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4 flex items-center gap-2">
            <Icon icon={Icons.deviceDesktop} className="w-5 h-5 text-info-600 dark:text-info-400" />
            {t('features.insights.system_monitoring')}
          </h3>
          <ul className="space-y-2 text-sm text-secondary-600 dark:text-secondary-400">
            <li>• {t('features.insights.system_cpu')}</li>
            <li>• {t('features.insights.system_performance')}</li>
            <li>• {t('features.insights.system_resource')}</li>
            <li>• {t('features.insights.system_capacity')}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
