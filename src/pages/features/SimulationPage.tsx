import { Icon, Icons } from '@/components/common'
import { useLocale } from '@/i18n'
import { SimulationDashboard } from '../../features/real-time-simulation'

/**
 * Real-Time Simulation Page
 * 
 * Real-time data simulation engine with live streaming,
 * anomaly detection, and statistical analysis.
 */
export function SimulationPage() {
  const { t } = useLocale()

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success-100 dark:bg-success-900/40 flex items-center justify-center">
              <Icon icon={Icons.simulation} className="w-5 h-5 text-success-600 dark:text-success-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="heading-2 text-secondary-900 dark:text-white">{t('features.simulation.title')}</h1>
                <span className="flex items-center gap-1 text-xs font-medium text-success-600 bg-success-100 dark:bg-success-900/30 px-2 py-0.5 rounded-full">
                  <Icon icon={Icons.circleFilled} className="w-1.5 h-1.5 animate-pulse" />
                  {t('features.simulation.live')}
                </span>
              </div>
              <p className="text-body-sm text-secondary-500 dark:text-secondary-400 mt-0.5">
                {t('features.simulation.subtitle')}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-surface-100 dark:bg-surface-800 text-xs font-medium text-secondary-600 dark:text-secondary-400">
            {t('features.simulation.anomaly_detection')}
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-surface-100 dark:bg-surface-800 text-xs font-medium text-secondary-600 dark:text-secondary-400">
            {t('features.simulation.statistics')}
          </span>
        </div>
      </div>

      {/* Main Content - Simulation Dashboard */}
      <SimulationDashboard />

      {/* Feature Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card rounded-xl p-6">
          <div className="w-12 h-12 rounded-xl bg-success-100 dark:bg-success-900/40 flex items-center justify-center mb-4">
            <Icon icon={Icons.activity} className="w-6 h-6 text-success-600 dark:text-success-400" />
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">{t('features.simulation.live_data_streams')}</h3>
          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            {t('features.simulation.live_data_streams_desc')}
          </p>
        </div>

        <div className="card rounded-xl p-6">
          <div className="w-12 h-12 rounded-xl bg-warning-100 dark:bg-warning-900/40 flex items-center justify-center mb-4">
            <Icon icon={Icons.alertTriangle} className="w-6 h-6 text-warning-600 dark:text-warning-400" />
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">{t('features.simulation.anomaly_detection')}</h3>
          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            {t('features.simulation.anomaly_detection_desc')}
          </p>
        </div>

        <div className="card rounded-xl p-6">
          <div className="w-12 h-12 rounded-xl bg-info-100 dark:bg-info-900/40 flex items-center justify-center mb-4">
            <Icon icon={Icons.chartLine} className="w-6 h-6 text-info-600 dark:text-info-400" />
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">{t('features.simulation.statistical_analysis')}</h3>
          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            {t('features.simulation.statistical_analysis_desc')}
          </p>
        </div>

        <div className="card rounded-xl p-6">
          <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center mb-4">
            <Icon icon={Icons.settings} className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">{t('features.simulation.stream_presets')}</h3>
          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            {t('features.simulation.stream_presets_desc')}
          </p>
        </div>
      </div>

      {/* Technical Details */}
      <div className="card rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-surface-200 dark:border-surface-700">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white flex items-center gap-2">
            <Icon icon={Icons.code} className="w-5 h-5 text-secondary-500" />
            {t('features.simulation.technical_implementation')}
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-secondary-900 dark:text-white mb-3">{t('features.simulation.data_generation')}</h4>
              <ul className="space-y-2 text-sm text-secondary-600 dark:text-secondary-400">
                <li className="flex items-center gap-2">
                  <Icon icon={Icons.circleCheck} className="w-4 h-4 text-success-500" />
                  {t('features.simulation.data_gen_interval')}
                </li>
                <li className="flex items-center gap-2">
                  <Icon icon={Icons.circleCheck} className="w-4 h-4 text-success-500" />
                  {t('features.simulation.data_gen_base_value')}
                </li>
                <li className="flex items-center gap-2">
                  <Icon icon={Icons.circleCheck} className="w-4 h-4 text-success-500" />
                  {t('features.simulation.data_gen_trend')}
                </li>
                <li className="flex items-center gap-2">
                  <Icon icon={Icons.circleCheck} className="w-4 h-4 text-success-500" />
                  {t('features.simulation.data_gen_bounds')}
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-secondary-900 dark:text-white mb-3">{t('features.simulation.analysis_features')}</h4>
              <ul className="space-y-2 text-sm text-secondary-600 dark:text-secondary-400">
                <li className="flex items-center gap-2">
                  <Icon icon={Icons.circleCheck} className="w-4 h-4 text-info-500" />
                  {t('features.simulation.analysis_moving_avg')}
                </li>
                <li className="flex items-center gap-2">
                  <Icon icon={Icons.circleCheck} className="w-4 h-4 text-info-500" />
                  {t('features.simulation.analysis_bollinger')}
                </li>
                <li className="flex items-center gap-2">
                  <Icon icon={Icons.circleCheck} className="w-4 h-4 text-info-500" />
                  {t('features.simulation.analysis_std_dev')}
                </li>
                <li className="flex items-center gap-2">
                  <Icon icon={Icons.circleCheck} className="w-4 h-4 text-info-500" />
                  {t('features.simulation.analysis_zscore')}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
