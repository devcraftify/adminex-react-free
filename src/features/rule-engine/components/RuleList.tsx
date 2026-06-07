/**
 * Rule List Component
 * Displays all rules with management actions
 */

import { useState } from 'react'
import { Icon } from '@/components/common'
import type { Rule } from '../types'
import { ruleTemplates } from '../config'

interface RuleListProps {
  rules: Rule[]
  selectedRuleId: string | null
  onSelect: (id: string) => void
  onToggle: (id: string) => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
  onCreateNew: () => void
  onCreateFromTemplate: (templateId: string) => void
}

export function RuleList({
  rules,
  selectedRuleId,
  onSelect,
  onToggle,
  onDuplicate,
  onDelete,
  onCreateNew,
  onCreateFromTemplate,
}: RuleListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTag, setFilterTag] = useState<string | null>(null)
  const [showTemplates, setShowTemplates] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  // Get all unique tags
  const allTags = Array.from(new Set(rules.flatMap((r) => r.tags)))

  // Filter rules
  const filteredRules = rules.filter((rule) => {
    const matchesSearch =
      rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTag = !filterTag || rule.tags.includes(filterTag)
    return matchesSearch && matchesTag
  })

  // Sort by priority (high to low)
  const sortedRules = [...filteredRules].sort((a, b) => b.priority - a.priority)

  return (
    <div className="bg-white dark:bg-surface-900 rounded-2xl shadow-lg border border-surface-200 dark:border-surface-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-surface-200 dark:border-surface-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl">
              <Icon icon="solar:code-linear" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-secondary-900 dark:text-white">
                Rule Engine
              </h2>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">
                {rules.length} rule{rules.length !== 1 ? 's' : ''} configured
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-secondary-700 dark:text-secondary-300 bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 rounded-lg transition-colors"
            >
              <Icon icon="solar:document-linear" className="w-4 h-4" />
              Templates
            </button>
            <button
              onClick={onCreateNew}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-primary-500/25"
            >
              <Icon icon="solar:add-circle-linear" className="w-4 h-4" />
              Create Rule
            </button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Icon
              icon="solar:magnifer-linear"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rules..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
          </div>

          {allTags.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setFilterTag(null)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
                  !filterTag
                    ? 'bg-primary-500 text-white'
                    : 'bg-surface-100 dark:bg-surface-800 text-secondary-600 dark:text-secondary-400 hover:bg-surface-200 dark:hover:bg-surface-700'
                }`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setFilterTag(tag)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
                    filterTag === tag
                      ? 'bg-primary-500 text-white'
                      : 'bg-surface-100 dark:bg-surface-800 text-secondary-600 dark:text-secondary-400 hover:bg-surface-200 dark:hover:bg-surface-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Templates Panel */}
      {showTemplates && (
        <div className="px-6 py-4 bg-gradient-to-r from-accent-50 to-primary-50 dark:from-accent-900/20 dark:to-primary-900/20 border-b border-surface-200 dark:border-surface-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-secondary-900 dark:text-white">
              Quick Start Templates
            </h3>
            <button
              onClick={() => setShowTemplates(false)}
              className="p-1 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300"
            >
              <Icon icon="solar:close-circle-linear" className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ruleTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => {
                  onCreateFromTemplate(template.id)
                  setShowTemplates(false)
                }}
                className="flex items-start gap-3 p-3 bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all text-left group"
              >
                <div className="p-2 bg-surface-100 dark:bg-surface-700 rounded-lg group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors">
                  <Icon
                    icon={template.icon}
                    className="w-5 h-5 text-secondary-500 dark:text-secondary-400 group-hover:text-primary-600 dark:group-hover:text-primary-400"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-secondary-900 dark:text-white truncate">
                    {template.name}
                  </p>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400 line-clamp-2">
                    {template.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Rules List */}
      <div className="divide-y divide-surface-100 dark:divide-surface-800 max-h-[600px] overflow-y-auto">
        {sortedRules.map((rule) => (
          <div
            key={rule.id}
            onClick={() => onSelect(rule.id)}
            className={`px-6 py-4 cursor-pointer transition-all hover:bg-surface-50 dark:hover:bg-surface-800/50 ${
              selectedRuleId === rule.id
                ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-l-primary-500'
                : ''
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                {/* Status Indicator */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggle(rule.id)
                  }}
                  className={`mt-1 p-1.5 rounded-lg transition-colors ${
                    rule.enabled
                      ? 'bg-success-100 dark:bg-success-900/30'
                      : 'bg-surface-100 dark:bg-surface-800'
                  }`}
                  title={rule.enabled ? 'Disable rule' : 'Enable rule'}
                >
                  <Icon
                    icon={rule.enabled ? 'solar:check-circle-bold' : 'solar:close-circle-linear'}
                    className={`w-4 h-4 ${
                      rule.enabled
                        ? 'text-success-600 dark:text-success-400'
                        : 'text-secondary-400 dark:text-secondary-500'
                    }`}
                  />
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-secondary-900 dark:text-white truncate">
                      {rule.name || 'Untitled Rule'}
                    </h4>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                        rule.priority >= 8
                          ? 'bg-danger-100 text-danger-700 dark:bg-danger-900/50 dark:text-danger-300'
                          : rule.priority >= 5
                          ? 'bg-warning-100 text-warning-700 dark:bg-warning-900/50 dark:text-warning-300'
                          : 'bg-surface-100 text-secondary-600 dark:bg-surface-700 dark:text-secondary-400'
                      }`}
                    >
                      P{rule.priority}
                    </span>
                  </div>

                  <p className="text-xs text-secondary-500 dark:text-secondary-400 truncate mb-2">
                    {rule.description || 'No description'}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-secondary-400 dark:text-secondary-500">
                    <span className="flex items-center gap-1">
                      <Icon icon="solar:filter-linear" className="w-3.5 h-3.5" />
                      {rule.conditionGroup.conditions.length} conditions
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon icon="solar:bolt-linear" className="w-3.5 h-3.5" />
                      {rule.actions.length} actions
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon icon="solar:graph-up-linear" className="w-3.5 h-3.5" />
                      {rule.triggerCount} triggers
                    </span>
                  </div>

                  {rule.tags.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-2">
                      {rule.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-[10px] font-medium bg-surface-100 dark:bg-surface-700 text-secondary-600 dark:text-secondary-400 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {rule.tags.length > 3 && (
                        <span className="text-[10px] text-secondary-400">
                          +{rule.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDuplicate(rule.id)
                  }}
                  className="p-2 text-secondary-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-all"
                  title="Duplicate rule"
                >
                  <Icon icon="solar:copy-linear" className="w-4 h-4" />
                </button>
                
                {deleteConfirmId === rule.id ? (
                  <div className="flex items-center gap-1 px-2 py-1 bg-danger-50 dark:bg-danger-900/30 rounded-lg">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(rule.id)
                        setDeleteConfirmId(null)
                      }}
                      className="text-xs font-medium text-danger-600 dark:text-danger-400 hover:underline"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteConfirmId(null)
                      }}
                      className="text-xs text-secondary-500 hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setDeleteConfirmId(rule.id)
                    }}
                    className="p-2 text-secondary-400 hover:text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/30 rounded-lg transition-all"
                    title="Delete rule"
                  >
                    <Icon icon="solar:trash-bin-2-linear" className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {sortedRules.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="p-4 bg-surface-100 dark:bg-surface-800 rounded-full mb-4">
              <Icon
                icon="solar:code-linear"
                className="w-10 h-10 text-secondary-300 dark:text-secondary-600"
              />
            </div>
            <h3 className="text-lg font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
              {searchQuery || filterTag ? 'No rules found' : 'No rules yet'}
            </h3>
            <p className="text-sm text-secondary-500 dark:text-secondary-400 text-center max-w-sm">
              {searchQuery || filterTag
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first rule to start automating your workflow'}
            </p>
            {!searchQuery && !filterTag && (
              <button
                onClick={onCreateNew}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Icon icon="solar:add-circle-linear" className="w-4 h-4" />
                Create First Rule
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
