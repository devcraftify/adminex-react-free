/**
 * Rules Editor Component
 *
 * Visual editor for creating and managing notification rules
 * with conditions, triggers, and actions.
 */

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import type {
  NotificationRule,
  NotificationPriority,
  DeliveryChannel,
  NotificationCondition,
} from '../types';
import {
  priorityConfig,
  channelConfig,
} from '../config';

// ============================================================================
// Types
// ============================================================================

interface RulesEditorProps {
  rules: NotificationRule[];
  onAddRule: (rule: Omit<NotificationRule, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateRule: (ruleId: string, updates: Partial<NotificationRule>) => void;
  onRemoveRule: (ruleId: string) => void;
  onToggleRule: (ruleId: string) => void;
}

interface NewRuleForm {
  name: string;
  description: string;
  enabled: boolean;
  triggerType: 'event' | 'time' | 'threshold' | 'status_change';
  triggerConfig: Record<string, unknown>;
  conditions: NotificationCondition[];
  conditionLogic: 'and' | 'or';
  templateId: string;
  channelOverrides: DeliveryChannel[];
  priorityOverride?: NotificationPriority;
  category: string;
  tags: string[];
}

// ============================================================================
// Constants
// ============================================================================

const CONDITION_OPERATORS = [
  { value: 'equals', label: 'Equals' },
  { value: 'not_equals', label: 'Not Equals' },
  { value: 'contains', label: 'Contains' },
  { value: 'not_contains', label: 'Does Not Contain' },
  { value: 'greater', label: 'Greater Than' },
  { value: 'less', label: 'Less Than' },
  { value: 'in', label: 'In List' },
  { value: 'not_in', label: 'Not In List' },
  { value: 'exists', label: 'Exists' },
  { value: 'regex', label: 'Matches Regex' },
];

const TRIGGER_TYPES = [
  { value: 'event', label: 'Event', icon: 'solar:flash-bold' },
  { value: 'time', label: 'Scheduled', icon: 'solar:clock-circle-bold' },
  { value: 'threshold', label: 'Threshold', icon: 'solar:chart-bold' },
  { value: 'status_change', label: 'Status Change', icon: 'solar:refresh-bold' },
];

const defaultNewRule: NewRuleForm = {
  name: '',
  description: '',
  enabled: true,
  triggerType: 'event',
  triggerConfig: { eventType: '', eventSource: '' },
  conditions: [],
  conditionLogic: 'and',
  templateId: '',
  channelOverrides: [],
  priorityOverride: undefined,
  category: 'general',
  tags: [],
};

// ============================================================================
// Component
// ============================================================================

export const RulesEditor: React.FC<RulesEditorProps> = ({
  rules,
  onAddRule,
  onUpdateRule,
  onRemoveRule,
  onToggleRule,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newRule, setNewRule] = useState<NewRuleForm>(defaultNewRule);
  const [newTag, setNewTag] = useState('');

  // ============================================================================
  // Handlers
  // ============================================================================

  const handleCreateRule = () => {
    if (!newRule.name.trim()) return;

    const trigger = buildTrigger(newRule.triggerType, newRule.triggerConfig);

    onAddRule({
      name: newRule.name,
      description: newRule.description,
      enabled: newRule.enabled,
      trigger,
      conditions: newRule.conditions,
      conditionLogic: newRule.conditionLogic,
      templateId: newRule.templateId,
      channelOverrides: newRule.channelOverrides.length > 0 ? newRule.channelOverrides : undefined,
      priorityOverride: newRule.priorityOverride,
      category: newRule.category,
      tags: newRule.tags,
    });

    setNewRule(defaultNewRule);
    setIsCreating(false);
  };

  const buildTrigger = (type: string, config: Record<string, unknown>) => {
    switch (type) {
      case 'event':
        return {
          type: 'event' as const,
          eventType: (config.eventType as string) || '',
          eventSource: (config.eventSource as string) || '',
        };
      case 'time':
        return {
          type: 'time' as const,
          schedule: (config.schedule as string) || '0 * * * *',
          timezone: (config.timezone as string) || 'UTC',
        };
      case 'threshold':
        return {
          type: 'threshold' as const,
          metric: (config.metric as string) || '',
          operator: (config.operator as '>' | '<' | '>=' | '<=' | '==' | '!=') || '>',
          value: (config.value as number) || 0,
          duration: config.duration as number | undefined,
        };
      case 'status_change':
        return {
          type: 'status_change' as const,
          entity: (config.entity as string) || '',
          fromStatus: config.fromStatus as string | undefined,
          toStatus: (config.toStatus as string) || '',
        };
      default:
        return { type: 'event' as const, eventType: '', eventSource: '' };
    }
  };

  const handleAddCondition = () => {
    setNewRule((prev) => ({
      ...prev,
      conditions: [
        ...prev.conditions,
        { field: '', operator: 'equals', value: '' },
      ],
    }));
  };

  const handleUpdateCondition = (index: number, updates: Partial<NotificationCondition>) => {
    setNewRule((prev) => ({
      ...prev,
      conditions: prev.conditions.map((c, i) =>
        i === index ? { ...c, ...updates } : c
      ),
    }));
  };

  const handleRemoveCondition = (index: number) => {
    setNewRule((prev) => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index),
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !newRule.tags.includes(newTag.trim())) {
      setNewRule((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setNewRule((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleChannelToggle = (channel: DeliveryChannel) => {
    setNewRule((prev) => ({
      ...prev,
      channelOverrides: prev.channelOverrides.includes(channel)
        ? prev.channelOverrides.filter((c) => c !== channel)
        : [...prev.channelOverrides, channel],
    }));
  };

  const getTriggerLabel = (rule: NotificationRule): string => {
    switch (rule.trigger.type) {
      case 'event':
        return `Event: ${rule.trigger.eventType}`;
      case 'time':
        return `Schedule: ${rule.trigger.schedule}`;
      case 'threshold':
        return `${rule.trigger.metric} ${rule.trigger.operator} ${rule.trigger.value}`;
      case 'status_change':
        return `${rule.trigger.entity}: ${rule.trigger.fromStatus || '*'} → ${rule.trigger.toStatus}`;
      default:
        return 'Unknown trigger';
    }
  };

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className="rules-editor">
      {/* Header */}
      <div className="rules-header">
        <div className="rules-header-left">
          <h3>Notification Rules</h3>
          <span className="rules-count">{rules.length} rules</span>
        </div>
        <button
          className="create-rule-btn"
          onClick={() => setIsCreating(true)}
          disabled={isCreating}
        >
          <Icon icon="solar:add-circle-bold" width={18} />
          Create Rule
        </button>
      </div>

      {/* Create New Rule Form */}
      {isCreating && (
        <div className="rule-form">
          <div className="form-header">
            <h4>Create New Rule</h4>
            <button onClick={() => setIsCreating(false)} className="close-btn">
              <Icon icon="solar:close-circle-bold" width={20} />
            </button>
          </div>

          <div className="form-grid">
            {/* Basic Info */}
            <div className="form-section">
              <label className="form-label">Rule Name *</label>
              <input
                type="text"
                value={newRule.name}
                onChange={(e) => setNewRule((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter rule name"
                className="form-input"
              />
            </div>

            <div className="form-section">
              <label className="form-label">Description</label>
              <textarea
                value={newRule.description}
                onChange={(e) => setNewRule((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this rule does"
                className="form-textarea"
                rows={2}
              />
            </div>

            {/* Trigger Type */}
            <div className="form-section full-width">
              <label className="form-label">Trigger Type</label>
              <div className="trigger-types">
                {TRIGGER_TYPES.map((trigger) => (
                  <button
                    key={trigger.value}
                    className={`trigger-type-btn ${newRule.triggerType === trigger.value ? 'active' : ''}`}
                    onClick={() => setNewRule((prev) => ({
                      ...prev,
                      triggerType: trigger.value as NewRuleForm['triggerType'],
                      triggerConfig: {},
                    }))}
                  >
                    <Icon icon={trigger.icon} width={20} />
                    <span>{trigger.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Trigger Config based on type */}
            <div className="form-section full-width">
              <label className="form-label">Trigger Configuration</label>
              {newRule.triggerType === 'event' && (
                <div className="trigger-config">
                  <input
                    type="text"
                    placeholder="Event Type"
                    value={(newRule.triggerConfig.eventType as string) || ''}
                    onChange={(e) => setNewRule((prev) => ({
                      ...prev,
                      triggerConfig: { ...prev.triggerConfig, eventType: e.target.value },
                    }))}
                    className="form-input"
                  />
                  <input
                    type="text"
                    placeholder="Event Source"
                    value={(newRule.triggerConfig.eventSource as string) || ''}
                    onChange={(e) => setNewRule((prev) => ({
                      ...prev,
                      triggerConfig: { ...prev.triggerConfig, eventSource: e.target.value },
                    }))}
                    className="form-input"
                  />
                </div>
              )}
              {newRule.triggerType === 'time' && (
                <div className="trigger-config">
                  <input
                    type="text"
                    placeholder="Cron Expression (e.g., 0 9 * * *)"
                    value={(newRule.triggerConfig.schedule as string) || ''}
                    onChange={(e) => setNewRule((prev) => ({
                      ...prev,
                      triggerConfig: { ...prev.triggerConfig, schedule: e.target.value },
                    }))}
                    className="form-input"
                  />
                  <input
                    type="text"
                    placeholder="Timezone"
                    value={(newRule.triggerConfig.timezone as string) || 'UTC'}
                    onChange={(e) => setNewRule((prev) => ({
                      ...prev,
                      triggerConfig: { ...prev.triggerConfig, timezone: e.target.value },
                    }))}
                    className="form-input"
                  />
                </div>
              )}
              {newRule.triggerType === 'threshold' && (
                <div className="trigger-config">
                  <input
                    type="text"
                    placeholder="Metric name"
                    value={(newRule.triggerConfig.metric as string) || ''}
                    onChange={(e) => setNewRule((prev) => ({
                      ...prev,
                      triggerConfig: { ...prev.triggerConfig, metric: e.target.value },
                    }))}
                    className="form-input"
                  />
                  <select
                    value={(newRule.triggerConfig.operator as string) || '>'}
                    onChange={(e) => setNewRule((prev) => ({
                      ...prev,
                      triggerConfig: { ...prev.triggerConfig, operator: e.target.value },
                    }))}
                    className="form-select"
                  >
                    <option value=">">{'>'}</option>
                    <option value="<">{'<'}</option>
                    <option value=">=">{'>='}</option>
                    <option value="<=">{'<='}</option>
                    <option value="==">{'=='}</option>
                    <option value="!=">{'!='}</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Value"
                    value={(newRule.triggerConfig.value as number) || ''}
                    onChange={(e) => setNewRule((prev) => ({
                      ...prev,
                      triggerConfig: { ...prev.triggerConfig, value: parseFloat(e.target.value) },
                    }))}
                    className="form-input"
                  />
                </div>
              )}
              {newRule.triggerType === 'status_change' && (
                <div className="trigger-config">
                  <input
                    type="text"
                    placeholder="Entity type"
                    value={(newRule.triggerConfig.entity as string) || ''}
                    onChange={(e) => setNewRule((prev) => ({
                      ...prev,
                      triggerConfig: { ...prev.triggerConfig, entity: e.target.value },
                    }))}
                    className="form-input"
                  />
                  <input
                    type="text"
                    placeholder="From Status (optional)"
                    value={(newRule.triggerConfig.fromStatus as string) || ''}
                    onChange={(e) => setNewRule((prev) => ({
                      ...prev,
                      triggerConfig: { ...prev.triggerConfig, fromStatus: e.target.value },
                    }))}
                    className="form-input"
                  />
                  <input
                    type="text"
                    placeholder="To Status"
                    value={(newRule.triggerConfig.toStatus as string) || ''}
                    onChange={(e) => setNewRule((prev) => ({
                      ...prev,
                      triggerConfig: { ...prev.triggerConfig, toStatus: e.target.value },
                    }))}
                    className="form-input"
                  />
                </div>
              )}
            </div>

            {/* Conditions */}
            <div className="form-section full-width">
              <div className="section-header">
                <label className="form-label">Conditions</label>
                <div className="condition-logic">
                  <button
                    className={newRule.conditionLogic === 'and' ? 'active' : ''}
                    onClick={() => setNewRule((prev) => ({ ...prev, conditionLogic: 'and' }))}
                  >
                    AND
                  </button>
                  <button
                    className={newRule.conditionLogic === 'or' ? 'active' : ''}
                    onClick={() => setNewRule((prev) => ({ ...prev, conditionLogic: 'or' }))}
                  >
                    OR
                  </button>
                </div>
              </div>
              <div className="conditions-list">
                {newRule.conditions.map((condition, index) => (
                  <div key={index} className="condition-row">
                    <input
                      type="text"
                      placeholder="Field"
                      value={condition.field}
                      onChange={(e) => handleUpdateCondition(index, { field: e.target.value })}
                      className="form-input"
                    />
                    <select
                      value={condition.operator}
                      onChange={(e) => handleUpdateCondition(index, { operator: e.target.value as NotificationCondition['operator'] })}
                      className="form-select"
                    >
                      {CONDITION_OPERATORS.map((op) => (
                        <option key={op.value} value={op.value}>{op.label}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Value"
                      value={condition.value as string}
                      onChange={(e) => handleUpdateCondition(index, { value: e.target.value })}
                      className="form-input"
                    />
                    <button onClick={() => handleRemoveCondition(index)} className="remove-condition-btn">
                      <Icon icon="solar:trash-bin-2-bold" width={16} />
                    </button>
                  </div>
                ))}
                <button onClick={handleAddCondition} className="add-condition-btn">
                  <Icon icon="solar:add-circle-linear" width={16} />
                  Add Condition
                </button>
              </div>
            </div>

            {/* Channel Overrides */}
            <div className="form-section">
              <label className="form-label">Channel Overrides</label>
              <div className="channel-checkboxes">
                {Object.entries(channelConfig).map(([channel, config]) => (
                  <label key={channel} className="channel-checkbox">
                    <input
                      type="checkbox"
                      checked={newRule.channelOverrides.includes(channel as DeliveryChannel)}
                      onChange={() => handleChannelToggle(channel as DeliveryChannel)}
                    />
                    <Icon icon={config.icon} width={14} />
                    <span>{config.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Priority Override */}
            <div className="form-section">
              <label className="form-label">Priority Override</label>
              <select
                value={newRule.priorityOverride || ''}
                onChange={(e) => setNewRule((prev) => ({
                  ...prev,
                  priorityOverride: e.target.value as NotificationPriority || undefined,
                }))}
                className="form-select"
              >
                <option value="">No override</option>
                {Object.entries(priorityConfig).map(([priority, config]) => (
                  <option key={priority} value={priority}>{config.label}</option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div className="form-section">
              <label className="form-label">Category</label>
              <input
                type="text"
                value={newRule.category}
                onChange={(e) => setNewRule((prev) => ({ ...prev, category: e.target.value }))}
                placeholder="general"
                className="form-input"
              />
            </div>

            {/* Tags */}
            <div className="form-section">
              <label className="form-label">Tags</label>
              <div className="tags-input">
                <div className="tags-list">
                  {newRule.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                      <button onClick={() => handleRemoveTag(tag)}>
                        <Icon icon="solar:close-circle-bold" width={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="tag-input-row">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag"
                    className="form-input"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  />
                  <button onClick={handleAddTag} className="add-tag-btn">
                    <Icon icon="solar:add-circle-bold" width={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button onClick={() => setIsCreating(false)} className="cancel-btn">
              Cancel
            </button>
            <button
              onClick={handleCreateRule}
              className="save-btn"
              disabled={!newRule.name.trim()}
            >
              Create Rule
            </button>
          </div>
        </div>
      )}

      {/* Rules List */}
      <div className="rules-list">
        {rules.length === 0 && !isCreating ? (
          <div className="rules-empty">
            <Icon icon="solar:document-medicine-bold" width={48} />
            <p>No rules configured</p>
            <span>Create a rule to automate notification delivery</span>
          </div>
        ) : (
          rules.map((rule) => (
            <div key={rule.id} className={`rule-card ${rule.enabled ? '' : 'disabled'}`}>
              <div className="rule-header">
                <div className="rule-info">
                  <span className="rule-name">{rule.name}</span>
                  <span className="rule-trigger">{getTriggerLabel(rule)}</span>
                </div>
                <div className="rule-actions">
                  <label className="toggle-switch small">
                    <input
                      type="checkbox"
                      checked={rule.enabled}
                      onChange={() => onToggleRule(rule.id)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                  <button
                    onClick={() => setEditingId(editingId === rule.id ? null : rule.id)}
                    className="rule-action-btn"
                  >
                    <Icon icon={editingId === rule.id ? 'solar:alt-arrow-up-linear' : 'solar:pen-bold'} width={16} />
                  </button>
                  <button onClick={() => onRemoveRule(rule.id)} className="rule-action-btn delete">
                    <Icon icon="solar:trash-bin-2-bold" width={16} />
                  </button>
                </div>
              </div>

              {rule.description && (
                <p className="rule-description">{rule.description}</p>
              )}

              <div className="rule-meta">
                {rule.conditions.length > 0 && (
                  <span className="meta-item">
                    <Icon icon="solar:filter-bold" width={12} />
                    {rule.conditions.length} condition{rule.conditions.length !== 1 ? 's' : ''}
                  </span>
                )}
                {rule.channelOverrides && rule.channelOverrides.length > 0 && (
                  <span className="meta-item">
                    <Icon icon="solar:widget-bold" width={12} />
                    {rule.channelOverrides.length} channel{rule.channelOverrides.length !== 1 ? 's' : ''}
                  </span>
                )}
                {rule.priorityOverride && (
                  <span className="meta-item" style={{ color: priorityConfig[rule.priorityOverride].color }}>
                    <Icon icon={priorityConfig[rule.priorityOverride].icon} width={12} />
                    {priorityConfig[rule.priorityOverride].label}
                  </span>
                )}
                <span className="meta-item">
                  <Icon icon="solar:folder-bold" width={12} />
                  {rule.category}
                </span>
              </div>

              {rule.tags.length > 0 && (
                <div className="rule-tags">
                  {rule.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              )}

              {editingId === rule.id && (
                <div className="rule-edit-section">
                  <div className="edit-row">
                    <label>Name</label>
                    <input
                      type="text"
                      value={rule.name}
                      onChange={(e) => onUpdateRule(rule.id, { name: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="edit-row">
                    <label>Description</label>
                    <textarea
                      value={rule.description}
                      onChange={(e) => onUpdateRule(rule.id, { description: e.target.value })}
                      className="form-textarea"
                      rows={2}
                    />
                  </div>
                  <div className="edit-row">
                    <label>Category</label>
                    <input
                      type="text"
                      value={rule.category}
                      onChange={(e) => onUpdateRule(rule.id, { category: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <style>{`
        .rules-editor {
          background: var(--card-bg, #fff);
          border-radius: 12px;
          border: 1px solid var(--border-color, #e5e7eb);
          overflow: hidden;
        }

        .rules-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          border-bottom: 1px solid var(--border-color, #e5e7eb);
        }

        .rules-header-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .rules-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }

        .rules-count {
          padding: 2px 8px;
          background: var(--bg-secondary, #f3f4f6);
          border-radius: 12px;
          font-size: 12px;
          color: var(--text-secondary, #6b7280);
        }

        .create-rule-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: var(--primary-color, #3b82f6);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .create-rule-btn:hover:not(:disabled) {
          background: var(--primary-hover, #2563eb);
        }

        .create-rule-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .rule-form {
          padding: 16px;
          background: var(--bg-secondary, #f9fafb);
          border-bottom: 1px solid var(--border-color, #e5e7eb);
        }

        .form-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .form-header h4 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        .close-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          color: var(--text-secondary, #6b7280);
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .form-section {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-section.full-width {
          grid-column: 1 / -1;
        }

        .form-label {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-secondary, #6b7280);
        }

        .form-input,
        .form-textarea,
        .form-select {
          padding: 8px 12px;
          border: 1px solid var(--border-color, #e5e7eb);
          border-radius: 6px;
          font-size: 14px;
          background: white;
        }

        .form-input:focus,
        .form-textarea:focus,
        .form-select:focus {
          outline: none;
          border-color: var(--primary-color, #3b82f6);
        }

        .trigger-types {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .trigger-type-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          border: 1px solid var(--border-color, #e5e7eb);
          border-radius: 8px;
          background: white;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s;
        }

        .trigger-type-btn:hover {
          border-color: var(--primary-color, #3b82f6);
        }

        .trigger-type-btn.active {
          border-color: var(--primary-color, #3b82f6);
          background: var(--primary-bg, #eff6ff);
          color: var(--primary-color, #3b82f6);
        }

        .trigger-config {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .trigger-config .form-input,
        .trigger-config .form-select {
          flex: 1;
          min-width: 150px;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .condition-logic {
          display: flex;
          gap: 4px;
        }

        .condition-logic button {
          padding: 4px 12px;
          border: 1px solid var(--border-color, #e5e7eb);
          background: white;
          cursor: pointer;
          font-size: 11px;
          border-radius: 4px;
        }

        .condition-logic button.active {
          background: var(--primary-color, #3b82f6);
          color: white;
          border-color: var(--primary-color, #3b82f6);
        }

        .conditions-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .condition-row {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .condition-row .form-input,
        .condition-row .form-select {
          flex: 1;
        }

        .remove-condition-btn {
          padding: 6px;
          border: none;
          background: transparent;
          cursor: pointer;
          color: #ef4444;
          border-radius: 4px;
        }

        .remove-condition-btn:hover {
          background: #fee2e2;
        }

        .add-condition-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border: 1px dashed var(--border-color, #e5e7eb);
          background: transparent;
          cursor: pointer;
          font-size: 13px;
          color: var(--text-secondary, #6b7280);
          border-radius: 6px;
          width: fit-content;
        }

        .add-condition-btn:hover {
          border-color: var(--primary-color, #3b82f6);
          color: var(--primary-color, #3b82f6);
        }

        .channel-checkboxes {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .channel-checkbox {
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          font-size: 13px;
        }

        .tags-input {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }

        .tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          background: var(--bg-secondary, #f3f4f6);
          border-radius: 4px;
          font-size: 12px;
        }

        .tag button {
          display: flex;
          align-items: center;
          background: transparent;
          border: none;
          cursor: pointer;
          color: var(--text-secondary, #6b7280);
          padding: 0;
        }

        .tag-input-row {
          display: flex;
          gap: 8px;
        }

        .tag-input-row .form-input {
          flex: 1;
        }

        .add-tag-btn {
          padding: 8px;
          border: 1px solid var(--border-color, #e5e7eb);
          background: white;
          cursor: pointer;
          border-radius: 6px;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          margin-top: 16px;
        }

        .cancel-btn {
          padding: 8px 16px;
          border: 1px solid var(--border-color, #e5e7eb);
          background: white;
          cursor: pointer;
          border-radius: 6px;
          font-size: 14px;
        }

        .save-btn {
          padding: 8px 16px;
          background: var(--primary-color, #3b82f6);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
        }

        .save-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .rules-list {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 400px;
          overflow-y: auto;
        }

        .rules-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 48px;
          color: var(--text-secondary, #6b7280);
        }

        .rules-empty p {
          margin: 16px 0 4px;
          font-size: 16px;
          font-weight: 600;
        }

        .rule-card {
          border: 1px solid var(--border-color, #e5e7eb);
          border-radius: 10px;
          padding: 12px;
        }

        .rule-card.disabled {
          opacity: 0.6;
        }

        .rule-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .rule-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .rule-name {
          font-weight: 600;
          font-size: 14px;
        }

        .rule-trigger {
          font-size: 12px;
          color: var(--text-secondary, #6b7280);
        }

        .rule-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .rule-action-btn {
          padding: 6px;
          border: none;
          background: transparent;
          cursor: pointer;
          color: var(--text-secondary, #6b7280);
          border-radius: 4px;
        }

        .rule-action-btn:hover {
          background: var(--hover-bg, #f3f4f6);
        }

        .rule-action-btn.delete:hover {
          color: #ef4444;
          background: #fee2e2;
        }

        .toggle-switch.small {
          width: 36px;
          height: 20px;
        }

        .toggle-switch.small .toggle-slider:before {
          height: 14px;
          width: 14px;
        }

        .toggle-switch.small input:checked + .toggle-slider:before {
          transform: translateX(16px);
        }

        .rule-description {
          margin: 8px 0;
          font-size: 13px;
          color: var(--text-secondary, #6b7280);
        }

        .rule-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 8px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: var(--text-secondary, #6b7280);
        }

        .rule-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-top: 8px;
        }

        .rule-edit-section {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid var(--border-color, #e5e7eb);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .edit-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .edit-row label {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary, #6b7280);
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: 0.3s;
          border-radius: 24px;
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.3s;
          border-radius: 50%;
        }

        input:checked + .toggle-slider {
          background-color: var(--primary-color, #3b82f6);
        }

        input:checked + .toggle-slider:before {
          transform: translateX(20px);
        }
      `}</style>
    </div>
  );
};

export default RulesEditor;
