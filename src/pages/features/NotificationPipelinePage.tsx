import { Icon } from '@iconify/react';
import { useLocale } from '@/i18n';
import { NotificationDashboard } from '../../features/notification-pipeline';

/**
 * Notification Pipeline Page
 *
 * Multi-channel notification system with
 * templates, rules, and delivery analytics.
 */
export function NotificationPipelinePage() {
  const { t } = useLocale();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
              <Icon icon="solar:bell-bold" className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('features.notification.title')}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('features.notification.subtitle')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Description */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
        <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-1">
          {t('features.notification.advanced_complex_logic')}
        </h3>
        <p className="text-sm text-amber-700 dark:text-amber-300 mb-4">
          {t('features.notification.description')}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2 text-sm text-amber-800 dark:text-amber-200">
            <Icon icon="solar:widget-bold" className="w-4 h-4" />
            <span>{t('features.notification.multi_channel')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-amber-800 dark:text-amber-200">
            <Icon icon="solar:document-text-bold" className="w-4 h-4" />
            <span>{t('features.notification.templates')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-amber-800 dark:text-amber-200">
            <Icon icon="solar:settings-bold" className="w-4 h-4" />
            <span>{t('features.notification.preferences')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-amber-800 dark:text-amber-200">
            <Icon icon="solar:chart-2-bold" className="w-4 h-4" />
            <span>{t('features.notification.analytics')}</span>
          </div>
        </div>
      </div>

      {/* Notification Dashboard Component */}
      <NotificationDashboard />
    </div>
  );
}

export default NotificationPipelinePage;
