import { useState, useCallback } from 'react'
import { Icon, Icons } from '@/components/common'
import { useLocale } from '@/i18n'
import { 
  useQueryBuilder,
  QueryBuilder,
  queryPresets,
  queryFields,
} from '../../features/query-builder'

// Sample data for execution
const sampleData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', age: 28, role: 'admin', createdAt: '2024-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'active', age: 34, role: 'user', createdAt: '2024-02-20' },
  { id: 3, name: 'Bob Wilson', email: 'bob@example.com', status: 'inactive', age: 45, role: 'user', createdAt: '2024-01-10' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', status: 'active', age: 29, role: 'moderator', createdAt: '2024-03-05' },
  { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', status: 'pending', age: 52, role: 'user', createdAt: '2024-02-28' },
  { id: 6, name: 'Diana Evans', email: 'diana@example.com', status: 'active', age: 31, role: 'admin', createdAt: '2024-01-22' },
  { id: 7, name: 'Edward Foster', email: 'edward@example.com', status: 'inactive', age: 38, role: 'user', createdAt: '2024-03-10' },
  { id: 8, name: 'Fiona Green', email: 'fiona@example.com', status: 'active', age: 26, role: 'user', createdAt: '2024-02-14' },
]

/**
 * Query Builder Page
 * 
 * Advanced query builder with nested filter groups,
 * multiple operators, and SQL/JSON export capabilities.
 */
export function QueryBuilderPage() {
  const [showPresets, setShowPresets] = useState(false)
  const { t } = useLocale()

  const {
    query,
    setQuery,
    result,
    isExecuting,
    lastExecutedAt,
    execute,
    exportAs,
    exportedData,
    loadPreset,
    resetQuery,
  } = useQueryBuilder()

  const handleExecute = useCallback(() => {
    execute(sampleData)
  }, [execute])

  const handleLoadPreset = (presetId: string) => {
    loadPreset(presetId)
    setShowPresets(false)
  }

  const handleCopyExport = (format: 'json' | 'sql') => {
    exportAs(format)
    if (exportedData) {
      navigator.clipboard.writeText(exportedData)
    }
  }

  // Count all filters recursively
  const countFilters = (group: typeof query.filterGroup): number => {
    let count = 0
    for (const item of group.filters) {
      if ('field' in item) {
        count++
      } else {
        count += countFilters(item)
      }
    }
    return count
  }

  const totalFilters = countFilters(query.filterGroup)
  const fieldCategories = Array.from(new Set(queryFields.map(f => f.category)))

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-info-100 dark:bg-info-900/40 flex items-center justify-center">
              <Icon icon={Icons.queryBuilder} className="w-5 h-5 text-info-600 dark:text-info-400" />
            </div>
            <div>
              <h1 className="heading-2 text-secondary-900 dark:text-white">{t('features.query_builder.title')}</h1>
              <p className="text-body-sm text-secondary-500 dark:text-secondary-400 mt-0.5">
                {t('features.query_builder.subtitle')}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Presets Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowPresets(!showPresets)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg text-sm font-medium text-secondary-700 dark:text-secondary-300 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
            >
              <Icon icon={Icons.bookmark} className="w-4 h-4" />
              {t('features.query_builder.presets')}
            </button>
            {showPresets && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-surface-800 rounded-xl shadow-xl border border-surface-200 dark:border-surface-700 z-50 overflow-hidden">
                <div className="p-3 border-b border-surface-200 dark:border-surface-700">
                  <h4 className="font-semibold text-secondary-900 dark:text-white mb-2">{t('features.query_builder.query_presets')}</h4>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400">{t('features.query_builder.prebuilt_templates')}</p>
                </div>
                <div className="max-h-80 overflow-y-auto p-2">
                  {queryPresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleLoadPreset(preset.id)}
                      className="w-full p-3 rounded-lg text-left hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                    >
                      <div className="font-medium text-secondary-900 dark:text-white text-sm">{preset.name}</div>
                      <div className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">{preset.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => handleCopyExport('json')}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg text-sm font-medium text-secondary-700 dark:text-secondary-300 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
          >
            <Icon icon={Icons.code} className="w-4 h-4" />
            JSON
          </button>

          <button
            onClick={() => handleCopyExport('sql')}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg text-sm font-medium text-secondary-700 dark:text-secondary-300 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
          >
            <Icon icon={Icons.database} className="w-4 h-4" />
            SQL
          </button>

          <button
            onClick={resetQuery}
            className="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors text-secondary-500"
          >
            <Icon icon={Icons.trash} className="w-5 h-5" />
          </button>

          <button
            onClick={handleExecute}
            disabled={isExecuting}
            className="flex items-center gap-2 px-4 py-2 bg-theme-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isExecuting ? (
              <Icon icon={Icons.refresh} className="w-4 h-4 animate-spin" />
            ) : (
              <Icon icon={Icons.bolt} className="w-4 h-4" />
            )}
            {t('features.query_builder.execute')}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-xl bg-info-100 dark:bg-info-900/40 flex items-center justify-center">
              <Icon icon={Icons.filter} className="w-5 h-5 text-info-600 dark:text-info-400" />
            </div>
          </div>
          <p className="text-sm text-secondary-500 dark:text-secondary-400 font-medium">{t('features.query_builder.filters')}</p>
          <p className="heading-3 text-secondary-900 dark:text-white mt-1">{totalFilters}</p>
        </div>

        <div className="card rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-xl bg-accent-100 dark:bg-accent-900/40 flex items-center justify-center">
              <Icon icon={Icons.layoutGrid} className="w-5 h-5 text-accent-600 dark:text-accent-400" />
            </div>
          </div>
          <p className="text-sm text-secondary-500 dark:text-secondary-400 font-medium">{t('features.query_builder.categories')}</p>
          <p className="heading-3 text-secondary-900 dark:text-white mt-1">{fieldCategories.length}</p>
        </div>

        <div className="card rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-xl bg-success-100 dark:bg-success-900/40 flex items-center justify-center">
              <Icon icon={Icons.circleCheck} className="w-5 h-5 text-success-600 dark:text-success-400" />
            </div>
          </div>
          <p className="text-sm text-secondary-500 dark:text-secondary-400 font-medium">{t('features.query_builder.results')}</p>
          <p className="heading-3 text-secondary-900 dark:text-white mt-1">{result?.filtered ?? 0}</p>
        </div>

        <div className="card rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
              <Icon icon={Icons.clock} className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <p className="text-sm text-secondary-500 dark:text-secondary-400 font-medium">{t('features.query_builder.last_run')}</p>
          <p className="text-lg font-semibold text-secondary-900 dark:text-white mt-1">
            {lastExecutedAt ? new Date(lastExecutedAt).toLocaleTimeString() : t('features.query_builder.never')}
          </p>
        </div>
      </div>

      {/* Query Builder Component */}
      <QueryBuilder
        query={query}
        onChange={setQuery}
        onExecute={() => handleExecute()}
      />

      {/* Results Section */}
      {result && result.data.length > 0 && (
        <div className="card rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon icon={Icons.list} className="w-5 h-5 text-secondary-500" />
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">{t('features.query_builder.query_results')}</h3>
              <span className="px-2 py-0.5 rounded-full bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400 text-xs font-medium">
                {result.filtered} of {result.total} matches
              </span>
              <span className="text-xs text-secondary-500">
                ({result.executionTime.toFixed(2)}ms)
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-50 dark:bg-surface-800">
                <tr>
                  {Object.keys(result.data[0] as Record<string, unknown>).map((key) => (
                    <th key={key} className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
                {result.data.slice(0, 10).map((row, idx) => (
                  <tr key={idx} className="hover:bg-surface-50 dark:hover:bg-surface-800/50">
                    {Object.values(row as Record<string, unknown>).map((value, cellIdx) => (
                      <td key={cellIdx} className="px-4 py-3 text-sm text-secondary-900 dark:text-secondary-100">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {result.data.length > 10 && (
              <div className="px-6 py-4 bg-surface-50 dark:bg-surface-800 text-center">
                <span className="text-sm text-secondary-500">
                  Showing 10 of {result.data.length} results
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Feature Highlights - Show when no filters */}
      {totalFilters === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card rounded-xl p-6">
            <div className="w-12 h-12 rounded-xl bg-info-100 dark:bg-info-900/40 flex items-center justify-center mb-4">
              <Icon icon={Icons.layoutGrid} className="w-6 h-6 text-info-600 dark:text-info-400" />
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">{t('features.query_builder.nested_filters')}</h3>
            <p className="text-sm text-secondary-500 dark:text-secondary-400">
              {t('features.query_builder.nested_filters_desc')}
            </p>
          </div>

          <div className="card rounded-xl p-6">
            <div className="w-12 h-12 rounded-xl bg-accent-100 dark:bg-accent-900/40 flex items-center justify-center mb-4">
              <Icon icon={Icons.code} className="w-6 h-6 text-accent-600 dark:text-accent-400" />
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">{t('features.query_builder.export_options')}</h3>
            <p className="text-sm text-secondary-500 dark:text-secondary-400">
              {t('features.query_builder.export_options_desc')}
            </p>
          </div>

          <div className="card rounded-xl p-6">
            <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center mb-4">
              <Icon icon={Icons.bolt} className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">{t('features.query_builder.live_execution')}</h3>
            <p className="text-sm text-secondary-500 dark:text-secondary-400">
              {t('features.query_builder.live_execution_desc')}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
