import { Icon } from '@iconify/react';
import { useLocale } from '@/i18n';
import { WorkflowDashboard } from '../../features/workflow-builder';

/**
 * Workflow Builder Page
 *
 * Visual workflow builder with drag-and-drop nodes,
 * connections, and workflow execution capabilities.
 */
export function WorkflowBuilderPage() {
  const { t } = useLocale();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
              <Icon icon="solar:code-scan-bold" className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('features.workflow.title')}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('features.workflow.subtitle')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Description */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
        <h3 className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-1">
          {t('features.workflow.advanced_complex_logic')}
        </h3>
        <p className="text-sm text-purple-700 dark:text-purple-300 mb-4">
          {t('features.workflow.description')}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2 text-sm text-purple-800 dark:text-purple-200">
            <Icon icon="solar:box-bold" className="w-4 h-4" />
            <span>{t('features.workflow.drag_drop_nodes')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-purple-800 dark:text-purple-200">
            <Icon icon="solar:link-bold" className="w-4 h-4" />
            <span>{t('features.workflow.visual_connections')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-purple-800 dark:text-purple-200">
            <Icon icon="solar:play-bold" className="w-4 h-4" />
            <span>{t('features.workflow.workflow_execution')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-purple-800 dark:text-purple-200">
            <Icon icon="solar:check-circle-bold" className="w-4 h-4" />
            <span>{t('features.workflow.realtime_validation')}</span>
          </div>
        </div>
      </div>

      {/* Workflow Dashboard Component */}
      <WorkflowDashboard />
    </div>
  );
}

export default WorkflowBuilderPage;
