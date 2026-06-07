import { useMemo, useState } from 'react'
import { Icon, Icons } from '@/components/common'
import { useLocale } from '@/i18n'

type Status = 'Active' | 'Invited' | 'Suspended'

type Row = {
  id: string
  name: string
  email: string
  team: string
  status: Status
  createdAt: string
}

type FormValues = {
  name: string
  email: string
  team: string
  status: Status
}

const inputClassName =
  'w-full px-4 py-2.5 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-sm text-secondary-900 dark:text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-theme-primary/20 focus:border-theme-primary transition-all'

const labelClassName = 'block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1'

const tableHeadClass =
  'text-left text-xs font-semibold uppercase tracking-wide text-secondary-500 dark:text-secondary-400'

const cellClass = 'py-3 px-4 text-sm text-secondary-800 dark:text-secondary-200'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const seedRows: Row[] = [
  { id: 'U-2001', name: 'Ava Johnson', email: 'ava@example.com', team: 'Operations', status: 'Active', createdAt: '2025-11-12' },
  { id: 'U-2002', name: 'Noah Smith', email: 'noah@example.com', team: 'Sales', status: 'Active', createdAt: '2025-10-03' },
  { id: 'U-2003', name: 'Mia Chen', email: 'mia@example.com', team: 'Marketing', status: 'Invited', createdAt: '2025-12-01' },
  { id: 'U-2004', name: 'Liam Brown', email: 'liam@example.com', team: 'Support', status: 'Suspended', createdAt: '2025-08-20' },
]

function statusPill(status: Status) {
  if (status === 'Active') {
    return 'bg-success-50 text-success-700 border-success-200 dark:bg-success-900/20 dark:text-success-200 dark:border-success-800'
  }
  if (status === 'Invited') {
    return 'bg-surface-50 text-secondary-700 border-surface-200 dark:bg-surface-900/30 dark:text-secondary-200 dark:border-surface-700'
  }
  return 'bg-danger-50 text-danger-700 border-danger-200 dark:bg-danger-900/20 dark:text-danger-200 dark:border-danger-800'
}

function todayISO() {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function makeId() {
  const uuid = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : null
  return uuid ? `U-${uuid.slice(0, 4).toUpperCase()}` : `U-${Date.now().toString().slice(-4)}`
}

export function CrudTablePage() {
  const { t } = useLocale()
  const [rows, setRows] = useState<Row[]>(seedRows)
  const [query, setQuery] = useState('')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [formValues, setFormValues] = useState<FormValues>({
    name: '',
    email: '',
    team: '',
    status: 'Active',
  })
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormValues, string>>>({})

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((r) => {
      return (
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.team.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
      )
    })
  }, [query, rows])

  const rowToDelete = useMemo(() => {
    if (!deleteId) return null
    return rows.find((r) => r.id === deleteId) ?? null
  }, [deleteId, rows])

  const openCreate = () => {
    setIsEditMode(false)
    setEditingId(null)
    setFormValues({ name: '', email: '', team: '', status: 'Active' })
    setFormErrors({})
    setIsModalOpen(true)
  }

  const openEdit = (row: Row) => {
    setIsEditMode(true)
    setEditingId(row.id)
    setFormValues({ name: row.name, email: row.email, team: row.team, status: row.status })
    setFormErrors({})
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setIsEditMode(false)
    setEditingId(null)
  }

  const validate = (values: FormValues) => {
    const errors: Partial<Record<keyof FormValues, string>> = {}

    if (!values.name.trim()) errors.name = t('tables.validation.name_required')
    if (!values.email.trim()) errors.email = t('tables.validation.email_required')
    else if (!emailRegex.test(values.email)) errors.email = t('tables.validation.email_invalid')
    if (!values.team.trim()) errors.team = t('tables.validation.team_required')

    return errors
  }

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault()

    const errors = validate(formValues)
    setFormErrors(errors)

    if (Object.keys(errors).length > 0) return

    if (isEditMode && editingId) {
      setRows((prev) =>
        prev.map((r) =>
          r.id === editingId
            ? { ...r, name: formValues.name, email: formValues.email, team: formValues.team, status: formValues.status }
            : r,
        ),
      )
      closeModal()
      return
    }

    const newRow: Row = {
      id: makeId(),
      name: formValues.name,
      email: formValues.email,
      team: formValues.team,
      status: formValues.status,
      createdAt: todayISO(),
    }

    setRows((prev) => [newRow, ...prev])
    closeModal()
  }

  const requestDelete = (id: string) => {
    setDeleteId(id)
    setIsDeleteOpen(true)
  }

  const confirmDelete = () => {
    if (!deleteId) return
    setRows((prev) => prev.filter((r) => r.id !== deleteId))
    setIsDeleteOpen(false)
    setDeleteId(null)
  }

  const cancelDelete = () => {
    setIsDeleteOpen(false)
    setDeleteId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="heading-2 text-secondary-900 dark:text-white">
            {t('tables.crud_table')}
          </h1>
          <p className="text-body-sm mt-1 text-secondary-500 dark:text-secondary-400">
            {t('tables.crud_table_desc')}
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-theme-primary hover:bg-theme-primary/90 text-white rounded-xl font-medium transition-colors"
        >
          <Icon icon={Icons.plus} width={18} height={18} />
          {t('tables.add_row')}
        </button>
      </div>

      <div className="card rounded-xl p-6">
        <div className="relative max-w-xl">
          <Icon icon={Icons.search} className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`pl-10 ${inputClassName}`}
            placeholder={t('tables.search_by_fields')}
          />
        </div>

        <div className="mt-5 rounded-xl overflow-hidden border border-surface-200 dark:border-surface-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-50 dark:bg-surface-900/30">
                <tr>
                  <th className={`${tableHeadClass} py-3 px-4`}>{t('tables.column.id')}</th>
                  <th className={`${tableHeadClass} py-3 px-4`}>{t('tables.column.name')}</th>
                  <th className={`${tableHeadClass} py-3 px-4`}>{t('tables.column.email')}</th>
                  <th className={`${tableHeadClass} py-3 px-4`}>{t('tables.column.team')}</th>
                  <th className={`${tableHeadClass} py-3 px-4`}>{t('tables.column.created')}</th>
                  <th className={`${tableHeadClass} py-3 px-4`}>{t('tables.column.status')}</th>
                  <th className={`${tableHeadClass} py-3 px-4 text-right`}>{t('tables.column.actions')}</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-surface-50 dark:hover:bg-surface-900/20 transition-colors">
                    <td className={cellClass}>{r.id}</td>
                    <td className={cellClass}>
                      <div className="font-medium text-secondary-900 dark:text-white">{r.name}</div>
                    </td>
                    <td className={cellClass}>{r.email}</td>
                    <td className={cellClass}>{r.team}</td>
                    <td className={cellClass}>{r.createdAt}</td>
                    <td className={cellClass}>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusPill(r.status)}`}>
                        {r.status === 'Active'
                          ? t('tables.status.active')
                          : r.status === 'Invited'
                            ? t('tables.status.invited')
                            : t('tables.status.suspended')}
                      </span>
                    </td>
                    <td className={`${cellClass} text-right`}>
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(r)}
                          className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                          aria-label={t('tables.aria.edit_row')}
                        >
                          <Icon icon={Icons.edit} width={18} height={18} className="text-secondary-600 dark:text-secondary-300" />
                        </button>
                        <button
                          type="button"
                          onClick={() => requestDelete(r.id)}
                          className="p-2 rounded-lg hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-colors"
                          aria-label={t('tables.aria.delete_row')}
                        >
                          <Icon icon={Icons.trash} width={18} height={18} className="text-danger-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-10 px-4 text-center text-sm text-secondary-500 dark:text-secondary-400">
                      {t('tables.no_results')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          />

          <div className="relative w-full max-w-2xl bg-white dark:bg-surface-900 rounded-2xl shadow-2xl animate-fade-in overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-surface-900 px-6 py-4 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between z-10">
              <h2 className="heading-5 text-secondary-900 dark:text-white">
                {isEditMode ? t('tables.edit_row') : t('tables.add_new_row')}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg text-secondary-500 transition-colors"
                aria-label={t('common.close')}
              >
                <Icon icon={Icons.x} width={20} height={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={submitForm} className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClassName} htmlFor="crud_name">
                      {t('tables.field.name')} <span className="text-danger-500">*</span>
                    </label>
                    <input
                      id="crud_name"
                      value={formValues.name}
                      onChange={(e) => setFormValues((v) => ({ ...v, name: e.target.value }))}
                      className={`${inputClassName} ${formErrors.name ? 'border-danger-500 focus:ring-danger-500/20 focus:border-danger-500' : ''}`}
                      placeholder={t('tables.placeholder.name')}
                    />
                    {formErrors.name && <p className="mt-1 text-xs text-danger-500">{formErrors.name}</p>}
                  </div>

                  <div>
                    <label className={labelClassName} htmlFor="crud_email">
                      {t('tables.field.email')} <span className="text-danger-500">*</span>
                    </label>
                    <input
                      id="crud_email"
                      type="email"
                      value={formValues.email}
                      onChange={(e) => setFormValues((v) => ({ ...v, email: e.target.value }))}
                      className={`${inputClassName} ${formErrors.email ? 'border-danger-500 focus:ring-danger-500/20 focus:border-danger-500' : ''}`}
                      placeholder={t('tables.placeholder.email')}
                    />
                    {formErrors.email && <p className="mt-1 text-xs text-danger-500">{formErrors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClassName} htmlFor="crud_team">
                      {t('tables.field.team')} <span className="text-danger-500">*</span>
                    </label>
                    <input
                      id="crud_team"
                      value={formValues.team}
                      onChange={(e) => setFormValues((v) => ({ ...v, team: e.target.value }))}
                      className={`${inputClassName} ${formErrors.team ? 'border-danger-500 focus:ring-danger-500/20 focus:border-danger-500' : ''}`}
                      placeholder={t('tables.placeholder.team')}
                    />
                    {formErrors.team && <p className="mt-1 text-xs text-danger-500">{formErrors.team}</p>}
                  </div>

                  <div>
                    <label className={labelClassName} htmlFor="crud_status">{t('tables.field.status')}</label>
                    <select
                      id="crud_status"
                      value={formValues.status}
                      onChange={(e) => setFormValues((v) => ({ ...v, status: e.target.value as Status }))}
                      className={inputClassName}
                    >
                      <option value="Active">{t('tables.status.active')}</option>
                      <option value="Invited">{t('tables.status.invited')}</option>
                      <option value="Suspended">{t('tables.status.suspended')}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-surface-200 dark:border-surface-700">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 bg-surface-100 dark:bg-surface-800 text-secondary-700 dark:text-secondary-300 rounded-xl text-sm font-medium hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-theme-primary text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  {isEditMode ? t('common.save') : t('create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteOpen && rowToDelete && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={cancelDelete}
          />

          <div className="relative w-full max-w-md bg-white dark:bg-surface-900 rounded-2xl shadow-2xl animate-fade-in p-6">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-danger-100 dark:bg-danger-900/30 flex items-center justify-center">
              <Icon icon={Icons.alertTriangle} className="w-7 h-7 text-danger-600 dark:text-danger-400" />
            </div>

            <h3 className="heading-5 text-secondary-900 dark:text-white text-center mb-2">
              {t('tables.delete_row')}
            </h3>

            <p className="text-sm text-secondary-500 dark:text-secondary-400 text-center mb-6">
              {t('tables.delete_confirm_name', { name: rowToDelete.name })}
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={cancelDelete}
                className="flex-1 px-4 py-2.5 bg-surface-100 dark:bg-surface-800 text-secondary-700 dark:text-secondary-300 rounded-xl text-sm font-medium hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 bg-danger-600 text-white rounded-xl text-sm font-medium hover:bg-danger-700 transition-colors"
              >
                {t('common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CrudTablePage
