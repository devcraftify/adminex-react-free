/**
 * Preferences Panel Component
 *
 * Manages user notification preferences including channels,
 * categories, quiet hours, and digest settings.
 */

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import type {
  NotificationPreferences,
  ChannelPreference,
  CategoryPreference,
  QuietHours,
  DeliveryChannel,
  NotificationType,
  NotificationPriority,
} from '../types';
import {
  notificationTypeConfig,
  priorityConfig,
  channelConfig,
} from '../config';

// ============================================================================
// Types
// ============================================================================

interface PreferencesPanelProps {
  preferences: NotificationPreferences;
  onUpdatePreferences: (updates: Partial<NotificationPreferences>) => void;
  onUpdateChannelPreference: (channel: DeliveryChannel, updates: Partial<ChannelPreference>) => void;
  onUpdateCategoryPreference: (category: string, updates: Partial<CategoryPreference>) => void;
  onSetQuietHours: (quietHours: QuietHours) => void;
  onToggleGlobal: (enabled: boolean) => void;
}

type PreferenceTab = 'channels' | 'categories' | 'quiet-hours' | 'digest';

// ============================================================================
// Component
// ============================================================================

export const PreferencesPanel: React.FC<PreferencesPanelProps> = ({
  preferences,
  onUpdatePreferences,
  onUpdateChannelPreference,
  onUpdateCategoryPreference,
  onSetQuietHours,
  onToggleGlobal,
}) => {
  const [activeTab, setActiveTab] = useState<PreferenceTab>('channels');

  // ============================================================================
  // Handlers
  // ============================================================================

  const handleChannelToggle = (channel: DeliveryChannel) => {
    const pref = preferences.channels.find((c) => c.channel === channel);
    if (pref) {
      onUpdateChannelPreference(channel, { enabled: !pref.enabled });
    }
  };

  const handleChannelTypeToggle = (channel: DeliveryChannel, type: NotificationType) => {
    const pref = preferences.channels.find((c) => c.channel === channel);
    if (pref) {
      const types = pref.types.includes(type)
        ? pref.types.filter((t) => t !== type)
        : [...pref.types, type];
      onUpdateChannelPreference(channel, { types });
    }
  };

  const handleChannelPriorityChange = (channel: DeliveryChannel, priority: NotificationPriority) => {
    onUpdateChannelPreference(channel, { minPriority: priority });
  };

  const handleCategoryToggle = (category: string) => {
    const pref = preferences.categories.find((c) => c.category === category);
    if (pref) {
      onUpdateCategoryPreference(category, { enabled: !pref.enabled });
    }
  };

  const handleQuietHoursChange = (field: keyof QuietHours, value: unknown) => {
    onSetQuietHours({
      ...preferences.quietHours!,
      [field]: value,
    });
  };

  const handleDigestChange = (field: string, value: unknown) => {
    onUpdatePreferences({
      digestSettings: {
        ...preferences.digestSettings!,
        [field]: value,
      },
    });
  };

  // ============================================================================
  // Render Tabs
  // ============================================================================

  const renderChannelsTab = () => (
    <div className="preferences-section">
      <p className="section-description">
        Choose which channels you want to receive notifications on.
      </p>

      <div className="channel-list">
        {preferences.channels.map((channelPref) => {
          const config = channelConfig[channelPref.channel];
          
          return (
            <div key={channelPref.channel} className="channel-card">
              <div className="channel-header">
                <div className="channel-info">
                  <div
                    className="channel-icon"
                    style={{ backgroundColor: `${config.color}15`, color: config.color }}
                  >
                    <Icon icon={config.icon} width={20} />
                  </div>
                  <div className="channel-details">
                    <span className="channel-name">{config.label}</span>
                    <span className="channel-desc">{config.description}</span>
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={channelPref.enabled}
                    onChange={() => handleChannelToggle(channelPref.channel)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              {channelPref.enabled && (
                <div className="channel-options">
                  <div className="option-group">
                    <label className="option-label">Notification Types</label>
                    <div className="type-checkboxes">
                      {Object.entries(notificationTypeConfig).map(([type, typeConfig]) => (
                        <label key={type} className="checkbox-item">
                          <input
                            type="checkbox"
                            checked={channelPref.types.includes(type as NotificationType)}
                            onChange={() => handleChannelTypeToggle(channelPref.channel, type as NotificationType)}
                          />
                          <span className="checkbox-label">
                            <Icon icon={typeConfig.icon} width={14} style={{ color: typeConfig.color }} />
                            {typeConfig.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="option-group">
                    <label className="option-label">Minimum Priority</label>
                    <select
                      value={channelPref.minPriority}
                      onChange={(e) => handleChannelPriorityChange(channelPref.channel, e.target.value as NotificationPriority)}
                      className="priority-select"
                    >
                      {Object.entries(priorityConfig).map(([priority, pConfig]) => (
                        <option key={priority} value={priority}>
                          {pConfig.label} and above
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderCategoriesTab = () => (
    <div className="preferences-section">
      <p className="section-description">
        Enable or disable notifications for specific categories.
      </p>

      <div className="category-list">
        {preferences.categories.map((catPref) => (
          <div key={catPref.category} className="category-item">
            <div className="category-info">
              <span className="category-name">{catPref.category}</span>
              <span className="category-channels">
                {catPref.channels.length} channel{catPref.channels.length !== 1 ? 's' : ''}
              </span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={catPref.enabled}
                onChange={() => handleCategoryToggle(catPref.category)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderQuietHoursTab = () => {
    const qh = preferences.quietHours!;
    
    return (
      <div className="preferences-section">
        <p className="section-description">
          Set times when you don't want to receive notifications.
        </p>

        <div className="quiet-hours-settings">
          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-label">Enable Quiet Hours</span>
              <span className="setting-desc">Silence notifications during specified hours</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={qh.enabled}
                onChange={(e) => handleQuietHoursChange('enabled', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          {qh.enabled && (
            <>
              <div className="time-range">
                <div className="time-input">
                  <label>Start Time</label>
                  <select
                    value={qh.startHour}
                    onChange={(e) => handleQuietHoursChange('startHour', parseInt(e.target.value))}
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>
                        {i.toString().padStart(2, '0')}:00
                      </option>
                    ))}
                  </select>
                </div>
                <span className="time-separator">to</span>
                <div className="time-input">
                  <label>End Time</label>
                  <select
                    value={qh.endHour}
                    onChange={(e) => handleQuietHoursChange('endHour', parseInt(e.target.value))}
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>
                        {i.toString().padStart(2, '0')}:00
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="setting-row">
                <div className="setting-info">
                  <span className="setting-label">Allow Urgent Notifications</span>
                  <span className="setting-desc">Still receive urgent and critical notifications</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={qh.allowUrgent}
                    onChange={(e) => handleQuietHoursChange('allowUrgent', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-row">
                <label className="setting-label">Timezone</label>
                <input
                  type="text"
                  value={qh.timezone}
                  onChange={(e) => handleQuietHoursChange('timezone', e.target.value)}
                  className="timezone-input"
                  placeholder="UTC"
                />
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderDigestTab = () => {
    const digest = preferences.digestSettings!;
    
    return (
      <div className="preferences-section">
        <p className="section-description">
          Receive a summary of notifications instead of individual alerts.
        </p>

        <div className="digest-settings">
          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-label">Enable Digest</span>
              <span className="setting-desc">Bundle notifications into periodic digests</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={digest.enabled}
                onChange={(e) => handleDigestChange('enabled', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          {digest.enabled && (
            <>
              <div className="setting-row">
                <label className="setting-label">Frequency</label>
                <select
                  value={digest.frequency}
                  onChange={(e) => handleDigestChange('frequency', e.target.value)}
                  className="frequency-select"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              <div className="setting-row">
                <label className="setting-label">Delivery Hour</label>
                <select
                  value={digest.deliveryHour}
                  onChange={(e) => handleDigestChange('deliveryHour', parseInt(e.target.value))}
                  className="hour-select"
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>
                      {i.toString().padStart(2, '0')}:00
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className="preferences-panel">
      {/* Header */}
      <div className="preferences-header">
        <h3>Notification Preferences</h3>
        <div className="global-toggle">
          <span>All Notifications</span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={preferences.globalEnabled}
              onChange={(e) => onToggleGlobal(e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      {preferences.globalEnabled ? (
        <>
          {/* Tabs */}
          <div className="preferences-tabs">
            <button
              className={`pref-tab ${activeTab === 'channels' ? 'active' : ''}`}
              onClick={() => setActiveTab('channels')}
            >
              <Icon icon="solar:widget-bold" width={18} />
              Channels
            </button>
            <button
              className={`pref-tab ${activeTab === 'categories' ? 'active' : ''}`}
              onClick={() => setActiveTab('categories')}
            >
              <Icon icon="solar:folder-bold" width={18} />
              Categories
            </button>
            <button
              className={`pref-tab ${activeTab === 'quiet-hours' ? 'active' : ''}`}
              onClick={() => setActiveTab('quiet-hours')}
            >
              <Icon icon="solar:moon-bold" width={18} />
              Quiet Hours
            </button>
            <button
              className={`pref-tab ${activeTab === 'digest' ? 'active' : ''}`}
              onClick={() => setActiveTab('digest')}
            >
              <Icon icon="solar:layers-bold" width={18} />
              Digest
            </button>
          </div>

          {/* Tab Content */}
          <div className="preferences-content">
            {activeTab === 'channels' && renderChannelsTab()}
            {activeTab === 'categories' && renderCategoriesTab()}
            {activeTab === 'quiet-hours' && renderQuietHoursTab()}
            {activeTab === 'digest' && renderDigestTab()}
          </div>
        </>
      ) : (
        <div className="notifications-disabled">
          <Icon icon="solar:bell-off-bold" width={48} />
          <p>Notifications are disabled</p>
          <span>Enable the toggle above to manage your preferences</span>
        </div>
      )}

      <style>{`
        .preferences-panel {
          background: var(--card-bg, #fff);
          border-radius: 12px;
          border: 1px solid var(--border-color, #e5e7eb);
          overflow: hidden;
        }

        .preferences-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          border-bottom: 1px solid var(--border-color, #e5e7eb);
        }

        .preferences-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }

        .global-toggle {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
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

        .preferences-tabs {
          display: flex;
          border-bottom: 1px solid var(--border-color, #e5e7eb);
          padding: 0 16px;
        }

        .pref-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 14px;
          color: var(--text-secondary, #6b7280);
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
        }

        .pref-tab:hover {
          color: var(--primary-color, #3b82f6);
        }

        .pref-tab.active {
          color: var(--primary-color, #3b82f6);
          border-bottom-color: var(--primary-color, #3b82f6);
        }

        .preferences-content {
          padding: 16px;
          max-height: 500px;
          overflow-y: auto;
        }

        .preferences-section {
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .section-description {
          margin: 0 0 16px;
          font-size: 14px;
          color: var(--text-secondary, #6b7280);
        }

        .channel-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .channel-card {
          border: 1px solid var(--border-color, #e5e7eb);
          border-radius: 10px;
          overflow: hidden;
        }

        .channel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px;
        }

        .channel-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .channel-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .channel-details {
          display: flex;
          flex-direction: column;
        }

        .channel-name {
          font-weight: 600;
          font-size: 14px;
        }

        .channel-desc {
          font-size: 12px;
          color: var(--text-secondary, #6b7280);
        }

        .channel-options {
          padding: 12px;
          background: var(--bg-secondary, #f9fafb);
          border-top: 1px solid var(--border-color, #e5e7eb);
        }

        .option-group {
          margin-bottom: 12px;
        }

        .option-group:last-child {
          margin-bottom: 0;
        }

        .option-label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary, #6b7280);
          margin-bottom: 8px;
        }

        .type-checkboxes {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .checkbox-item {
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
        }

        .priority-select,
        .frequency-select,
        .hour-select,
        .timezone-input {
          padding: 8px 12px;
          border: 1px solid var(--border-color, #e5e7eb);
          border-radius: 6px;
          font-size: 14px;
          min-width: 150px;
        }

        .category-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .category-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px;
          border: 1px solid var(--border-color, #e5e7eb);
          border-radius: 8px;
        }

        .category-info {
          display: flex;
          flex-direction: column;
        }

        .category-name {
          font-weight: 600;
          font-size: 14px;
          text-transform: capitalize;
        }

        .category-channels {
          font-size: 12px;
          color: var(--text-secondary, #6b7280);
        }

        .quiet-hours-settings,
        .digest-settings {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .setting-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .setting-info {
          display: flex;
          flex-direction: column;
        }

        .setting-label {
          font-weight: 600;
          font-size: 14px;
        }

        .setting-desc {
          font-size: 12px;
          color: var(--text-secondary, #6b7280);
        }

        .time-range {
          display: flex;
          align-items: flex-end;
          gap: 12px;
        }

        .time-input {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .time-input label {
          font-size: 12px;
          color: var(--text-secondary, #6b7280);
        }

        .time-input select {
          padding: 8px 12px;
          border: 1px solid var(--border-color, #e5e7eb);
          border-radius: 6px;
        }

        .time-separator {
          padding: 8px 0;
          color: var(--text-secondary, #6b7280);
        }

        .notifications-disabled {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px;
          color: var(--text-secondary, #6b7280);
        }

        .notifications-disabled p {
          margin: 16px 0 8px;
          font-size: 16px;
          font-weight: 600;
        }

        .notifications-disabled span {
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default PreferencesPanel;
