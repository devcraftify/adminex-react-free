import { Icon } from '@iconify/react';
import { useLocale } from '@/i18n';
import { TaskSchedulerDashboard } from '../../features/task-scheduler';

/**
 * Task Scheduler Page
 *
 * Task scheduling system with dependencies,
 * Gantt charts, and critical path analysis.
 */
export function TaskSchedulerPage() {
  const { t } = useLocale();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
              <Icon icon="solar:calendar-bold" className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('features.task_scheduler.title')}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('features.task_scheduler.subtitle')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Description */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
          {t('features.task_scheduler.advanced_complex_logic')}
        </h3>
        <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
          {t('features.task_scheduler.description')}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-200">
            <Icon icon="solar:chart-2-bold" className="w-4 h-4" />
            <span>{t('features.task_scheduler.gantt_charts')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-200">
            <Icon icon="solar:link-bold" className="w-4 h-4" />
            <span>{t('features.task_scheduler.dependencies')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-200">
            <Icon icon="solar:route-bold" className="w-4 h-4" />
            <span>{t('features.task_scheduler.critical_path')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-200">
            <Icon icon="solar:calendar-mark-bold" className="w-4 h-4" />
            <span>{t('features.task_scheduler.calendar_view')}</span>
          </div>
        </div>
      </div>

      {/* Task Scheduler Dashboard Component */}
      <TaskSchedulerDashboard />
    </div>
  );
}

export default TaskSchedulerPage;
