import { useState } from 'react'
import { Icon, Icons } from '@/components/common'
import { useLocale } from '@/i18n'
import { 
  useRuleEngine, 
  RuleList, 
  RuleEditor, 
  RuleTester,
  ruleTemplates,
  type Rule
} from '../../features/rule-engine'

/**
 * Rule Engine Page
 * 
 * Visual rule builder with IF/AND/OR/THEN logic,
 * condition building, and real-time rule evaluation.
 */
export function RuleEnginePage() {
  const [activeTab, setActiveTab] = useState<'list' | 'editor' | 'tester'>('list')
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null)
  const [isNewRule, setIsNewRule] = useState(false)
  const { t } = useLocale()

  const {
    rules,
    addRule,
    updateRule,
    deleteRule,
    toggleRule,
    duplicateRule,
    createFromTemplate,
  } = useRuleEngine()

  const selectedRule = rules.find(r => r.id === selectedRuleId) || null

  const handleSelectRule = (id: string) => {
    setSelectedRuleId(id)
    setIsNewRule(false)
    setActiveTab('editor')
  }

  const handleNewRule = () => {
    setSelectedRuleId(null)
    setIsNewRule(true)
    setActiveTab('editor')
  }

  const handleSaveRule = (rule: Rule) => {
    if (selectedRuleId && rules.find(r => r.id === selectedRuleId)) {
      updateRule(rule.id, rule)
    } else {
      addRule(rule)
    }
    setActiveTab('list')
    setSelectedRuleId(null)
    setIsNewRule(false)
  }

  const handleCancelEdit = () => {
    setActiveTab('list')
    setSelectedRuleId(null)
    setIsNewRule(false)
  }

  const handleCreateFromTemplate = (templateId: string) => {
    createFromTemplate(templateId)
  }

  const tabs = [
    { id: 'list', label: t('features.rule_engine.tab_rules'), icon: Icons.list },
    { id: 'editor', label: t('features.rule_engine.tab_editor'), icon: Icons.edit },
    { id: 'tester', label: t('features.rule_engine.tab_tester'), icon: Icons.bolt },
  ] as const

  // Stats calculations
  const activeRules = rules.filter(r => r.enabled).length
  const disabledRules = rules.filter(r => !r.enabled).length
  const totalConditions = rules.reduce((acc, r) => {
    const countConditions = (group: Rule['conditionGroup']): number => {
      let count = 0
      for (const item of group.conditions) {
        if ('field' in item) {
          count++
        } else {
          count += countConditions(item)
        }
      }
      return count
    }
    return acc + countConditions(r.conditionGroup)
  }, 0)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
              <Icon icon={Icons.ruleEngine} className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="heading-2 text-secondary-900 dark:text-white">{t('features.rule_engine.title')}</h1>
              <p className="text-body-sm text-secondary-500 dark:text-secondary-400 mt-0.5">
                {t('features.rule_engine.subtitle')}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleNewRule}
            className="flex items-center gap-2 px-4 py-2 bg-theme-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Icon icon={Icons.plus} className="w-4 h-4" />
            {t('features.rule_engine.new_rule')}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
              <Icon icon={Icons.list} className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <p className="text-sm text-secondary-500 dark:text-secondary-400 font-medium">{t('features.rule_engine.total_rules')}</p>
          <p className="heading-3 text-secondary-900 dark:text-white mt-1">{rules.length}</p>
        </div>

        <div className="card rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-xl bg-success-100 dark:bg-success-900/40 flex items-center justify-center">
              <Icon icon={Icons.circleCheck} className="w-5 h-5 text-success-600 dark:text-success-400" />
            </div>
          </div>
          <p className="text-sm text-secondary-500 dark:text-secondary-400 font-medium">{t('features.rule_engine.active_rules')}</p>
          <p className="heading-3 text-secondary-900 dark:text-white mt-1">{activeRules}</p>
        </div>

        <div className="card rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-xl bg-warning-100 dark:bg-warning-900/40 flex items-center justify-center">
              <Icon icon={Icons.clock} className="w-5 h-5 text-warning-600 dark:text-warning-400" />
            </div>
          </div>
          <p className="text-sm text-secondary-500 dark:text-secondary-400 font-medium">{t('features.rule_engine.disabled_rules')}</p>
          <p className="heading-3 text-secondary-900 dark:text-white mt-1">{disabledRules}</p>
        </div>

        <div className="card rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-xl bg-info-100 dark:bg-info-900/40 flex items-center justify-center">
              <Icon icon={Icons.layoutGrid} className="w-5 h-5 text-info-600 dark:text-info-400" />
            </div>
          </div>
          <p className="text-sm text-secondary-500 dark:text-secondary-400 font-medium">{t('features.rule_engine.total_conditions')}</p>
          <p className="heading-3 text-secondary-900 dark:text-white mt-1">{totalConditions}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="card rounded-xl p-1.5">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-theme-primary text-white'
                  : 'text-secondary-600 dark:text-secondary-400 hover:bg-surface-100 dark:hover:bg-surface-800'
              }`}
            >
              <Icon icon={tab.icon} className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'list' && (
        <RuleList
          rules={rules}
          selectedRuleId={selectedRuleId}
          onSelect={handleSelectRule}
          onToggle={toggleRule}
          onDuplicate={duplicateRule}
          onDelete={deleteRule}
          onCreateNew={handleNewRule}
          onCreateFromTemplate={handleCreateFromTemplate}
        />
      )}

      {activeTab === 'editor' && (
        <RuleEditor
          rule={selectedRule}
          onSave={handleSaveRule}
          onCancel={handleCancelEdit}
          isNew={isNewRule}
        />
      )}

      {activeTab === 'tester' && (
        <RuleTester
          rules={rules.filter(r => r.enabled)}
        />
      )}

      {/* Feature Highlights - Show when no rules */}
      {activeTab === 'list' && rules.length === 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card rounded-xl p-6">
              <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center mb-4">
                <Icon icon={Icons.ruleEngine} className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">{t('features.rule_engine.visual_builder')}</h3>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">
                {t('features.rule_engine.visual_builder_desc')}
              </p>
            </div>

            <div className="card rounded-xl p-6">
              <div className="w-12 h-12 rounded-xl bg-success-100 dark:bg-success-900/40 flex items-center justify-center mb-4">
                <Icon icon={Icons.bolt} className="w-6 h-6 text-success-600 dark:text-success-400" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">{t('features.rule_engine.realtime_testing')}</h3>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">
                {t('features.rule_engine.realtime_testing_desc')}
              </p>
            </div>

            <div className="card rounded-xl p-6">
              <div className="w-12 h-12 rounded-xl bg-warning-100 dark:bg-warning-900/40 flex items-center justify-center mb-4">
                <Icon icon={Icons.bookmark} className="w-6 h-6 text-warning-600 dark:text-warning-400" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">{t('features.rule_engine.templates')}</h3>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">
                {t('features.rule_engine.templates_desc')}
              </p>
            </div>
          </div>

          {/* Templates */}
          <div className="card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">{t('features.rule_engine.available_templates')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {ruleTemplates.slice(0, 6).map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleCreateFromTemplate(template.id)}
                  className="p-4 rounded-xl border border-surface-200 dark:border-surface-700 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-surface-50 dark:hover:bg-surface-800 transition-all text-left"
                >
                  <div className="font-medium text-secondary-900 dark:text-white text-sm">{template.name}</div>
                  <div className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">{template.description}</div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
