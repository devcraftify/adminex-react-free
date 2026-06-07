import { Icon } from '@iconify/react';
import { useLocale } from '@/i18n';
import { ApprovalDashboard } from '../../features/approval-engine';

/**
 * Approval Engine Page
 *
 * State machine-based approval workflow system
 * with multi-level approvals and audit trails.
 */
export function ApprovalEnginePage() {
  const { t } = useLocale();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
              <Icon icon="solar:check-square-bold" className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('features.approval.title')}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('features.approval.subtitle')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Description */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800">
        <h3 className="text-sm font-semibold text-emerald-900 dark:text-emerald-100 mb-1">
          {t('features.approval.advanced_complex_logic')}
        </h3>
        <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-4">
          {t('features.approval.description')}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2 text-sm text-emerald-800 dark:text-emerald-200">
            <Icon icon="solar:users-group-rounded-bold" className="w-4 h-4" />
            <span>{t('features.approval.multi_level_approvals')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-emerald-800 dark:text-emerald-200">
            <Icon icon="solar:branching-paths-up-bold" className="w-4 h-4" />
            <span>{t('features.approval.conditional_routing')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-emerald-800 dark:text-emerald-200">
            <Icon icon="solar:history-bold" className="w-4 h-4" />
            <span>{t('features.approval.audit_trail')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-emerald-800 dark:text-emerald-200">
            <Icon icon="solar:alarm-bold" className="w-4 h-4" />
            <span>{t('features.approval.auto_escalation')}</span>
          </div>
        </div>
      </div>

      {/* Approval Dashboard Component */}
      <ApprovalDashboard />
    </div>
  );
}

export default ApprovalEnginePage;
