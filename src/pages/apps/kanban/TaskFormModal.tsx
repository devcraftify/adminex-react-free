import { useState, useEffect } from 'react'
import { Icon, Icons } from '@/components/common'
import { type KanbanTask } from '@/data/kanban'
import { useLocale } from '@/i18n'

interface TaskFormModalProps {
  isOpen: boolean
  isEditMode: boolean
  task: KanbanTask | null
  onClose: () => void
  onSubmit: (taskData: Partial<KanbanTask>) => void
}

const emptyFormData = {
  title: '',
  description: '',
  priority: 'medium' as 'low' | 'medium' | 'high',
  tags: '',
  dueDate: '',
}

export default function TaskFormModal({ isOpen, isEditMode, task, onClose, onSubmit }: TaskFormModalProps) {
  const { t } = useLocale()
  const [formData, setFormData] = useState(emptyFormData)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Sync form data when task/mode changes
  useEffect(() => {
    if (task && isEditMode) {
      setFormData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        tags: task.tags.join(', '),
        dueDate: task.dueDate || '',
      })
    } else {
      setFormData(emptyFormData)
    }
    setFormErrors({})
  }, [task, isEditMode, isOpen])

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.title.trim()) {
      errors.title = t('kanban.validation.title_required')
    }

    if (!formData.description.trim()) {
      errors.description = t('kanban.validation.description_required')
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const taskData: Partial<KanbanTask> = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      tags: formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
      dueDate: formData.dueDate || undefined,
      assignees: task?.assignees || [],
    }

    onSubmit(taskData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white dark:bg-surface-900 rounded-2xl shadow-2xl animate-fade-in overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-surface-900 px-6 py-4 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold text-secondary-900 dark:text-white">
            {isEditMode ? t('kanban.edit_task') : t('kanban.new_task')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg text-secondary-500 transition-colors"
          >
            <Icon icon={Icons.x} width="20px" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">
                {t('kanban.task_title')} <span className="text-danger-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full px-4 py-2.5 bg-surface-50 dark:bg-surface-800 border rounded-xl text-sm text-secondary-900 dark:text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-theme-primary/20 focus:border-theme-primary transition-all ${
                  formErrors.title
                    ? 'border-danger-500'
                    : 'border-surface-200 dark:border-surface-700'
                }`}
                placeholder={t('kanban.task_title_placeholder')}
              />
              {formErrors.title && <p className="mt-1 text-xs text-danger-500">{formErrors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">
                {t('kanban.task_description')} <span className="text-danger-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className={`w-full px-4 py-2.5 bg-surface-50 dark:bg-surface-800 border rounded-xl text-sm text-secondary-900 dark:text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-theme-primary/20 focus:border-theme-primary transition-all resize-none ${
                  formErrors.description
                    ? 'border-danger-500'
                    : 'border-surface-200 dark:border-surface-700'
                }`}
                placeholder={t('kanban.description_placeholder')}
              />
              {formErrors.description && (
                <p className="mt-1 text-xs text-danger-500">{formErrors.description}</p>
              )}
            </div>

            {/* Priority & Due Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">
                  {t('kanban.priority')}
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })
                  }
                  className="w-full px-4 py-2.5 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-sm text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-theme-primary/20 focus:border-theme-primary transition-all appearance-none cursor-pointer"
                >
                  <option value="low">{t('kanban.low')}</option>
                  <option value="medium">{t('kanban.medium')}</option>
                  <option value="high">{t('kanban.high')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5 flex items-center gap-1">
                  <Icon icon={Icons.calendar} width="16px" />
                  {t('kanban.due_date')}
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-2.5 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-sm text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-theme-primary/20 focus:border-theme-primary transition-all"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5 flex items-center gap-1">
                <Icon icon={Icons.tag} width="16px" />
                {t('kanban.tags')}
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-4 py-2.5 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-sm text-secondary-900 dark:text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-theme-primary/20 focus:border-theme-primary transition-all"
                placeholder={t('kanban.tags_placeholder')}
              />
              <p className="mt-1 text-xs text-secondary-500 dark:text-secondary-400">
                {t('common.separate_with_commas')}
              </p>
            </div>

            {/* Assignees Info */}
            {isEditMode && task?.assignees && task.assignees.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2 flex items-center gap-1">
                  <Icon icon={Icons.users} width="16px" />
                  {t('kanban.assignees')}
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {task.assignees.map((assignee) => (
                    <div
                      key={assignee.id}
                      className="flex items-center gap-2 px-3 py-2 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg"
                    >
                      <img
                        src={assignee.avatar}
                        alt={assignee.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm text-secondary-700 dark:text-secondary-300">
                        {assignee.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-surface-200 dark:border-surface-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 text-secondary-700 dark:text-secondary-300 rounded-xl font-medium transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-theme-primary hover:bg-theme-primary-dark text-white rounded-xl font-medium transition-colors"
            >
              {isEditMode ? t('kanban.update_task') : t('kanban.add_task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
