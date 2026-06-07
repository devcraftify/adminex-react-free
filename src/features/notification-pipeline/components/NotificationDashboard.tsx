/**
 * Notification Dashboard Component
 *
 * Main dashboard for the notification pipeline feature showing
 * analytics, recent notifications, and quick actions.
 */

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';
import { NotificationCenter } from './NotificationCenter';
import { PreferencesPanel } from './PreferencesPanel';
import { RulesEditor } from './RulesEditor';
import { useNotificationPipeline } from '../useNotificationPipeline';
import type { NotificationType, NotificationPriority } from '../types';

// ============================================================================
// Types
// ============================================================================

type DashboardTab = 'overview' | 'notifications' | 'preferences' | 'rules';

// ============================================================================
// Component
// ============================================================================

export const NotificationDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Notification form state
  const [newNotification, setNewNotification] = useState({
    type: 'info' as NotificationType,
    priority: 'medium' as NotificationPriority,
    title: '',
    message: '',
    category: 'general',
  });

  const {
    // State
    notifications,
    unreadNotifications,
    channels,
    rules,
    preferences,
    analytics,

    // Notification Actions
    addNotification,
    markNotificationAsRead,
    dismissNotificationById,
    markAllAsRead,
    clearAll,
    loadSampleNotifications,

    // Preference Management
    updatePreferences,
    updateChannelPreference,
    updateCategoryPreference,
    setQuietHours,
    toggleGlobalNotifications,

    // Rule Management
    addRule,
    removeRule,
    updateRule,
    toggleRule,

    // Config
    typeConfig,
    priorityConfig: pConfig,
    channelConfigRef,
  } = useNotificationPipeline();

  // ============================================================================
  // Handlers
  // ============================================================================

  const handleCreateNotification = () => {
    if (!newNotification.title.trim() || !newNotification.message.trim()) return;

    addNotification({
      type: newNotification.type,
      priority: newNotification.priority,
      title: newNotification.title,
      message: newNotification.message,
      category: newNotification.category,
      channels: ['in_app'],
    });

    setNewNotification({
      type: 'info',
      priority: 'medium',
      title: '',
      message: '',
      category: 'general',
    });
    setShowCreateModal(false);
  };

  // ============================================================================
  // Render Overview Tab
  // ============================================================================

  const renderOverview = () => (
    <div className="dashboard-overview">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#dbeafe', color: '#3b82f6' }}>
            <Icon icon="solar:bell-bold" width={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{analytics.totalSent}</span>
            <span className="stat-label">Total Sent</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#d1fae5', color: '#10b981' }}>
            <Icon icon="solar:check-read-bold" width={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{analytics.totalDelivered}</span>
            <span className="stat-label">Delivered</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fef3c7', color: '#f59e0b' }}>
            <Icon icon="solar:eye-bold" width={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{analytics.totalRead}</span>
            <span className="stat-label">Read</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fee2e2', color: '#ef4444' }}>
            <Icon icon="solar:close-circle-bold" width={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{analytics.totalFailed}</span>
            <span className="stat-label">Failed</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h4>Quick Actions</h4>
        <div className="action-buttons">
          <button onClick={() => setShowCreateModal(true)} className="action-btn primary">
            <Icon icon="solar:add-circle-bold" width={20} />
            Create Notification
          </button>
          <button onClick={loadSampleNotifications} className="action-btn">
            <Icon icon="solar:database-bold" width={20} />
            Load Samples
          </button>
          <button onClick={markAllAsRead} className="action-btn">
            <Icon icon="solar:check-read-bold" width={20} />
            Mark All Read
          </button>
          <button onClick={clearAll} className="action-btn danger">
            <Icon icon="solar:trash-bin-2-bold" width={20} />
            Clear All
          </button>
        </div>
      </div>

      {/* Channel Status */}
      <div className="channels-status">
        <h4>Channel Status</h4>
        <div className="channels-grid">
          {channels.map((channel) => {
            const config = channelConfigRef[channel.type];
            const channelAnalytics = analytics.byChannel[channel.type];
            
            return (
              <div key={channel.id} className={`channel-status-card ${channel.enabled ? '' : 'disabled'}`}>
                <div className="channel-header">
                  <div
                    className="channel-icon"
                    style={{ backgroundColor: `${config.color}15`, color: config.color }}
                  >
                    <Icon icon={config.icon} width={20} />
                  </div>
                  <div className="channel-info">
                    <span className="channel-name">{config.label}</span>
                    <span className={`channel-badge ${channel.enabled ? 'active' : 'inactive'}`}>
                      {channel.enabled ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                {channelAnalytics && (
                  <div className="channel-stats">
                    <div className="mini-stat">
                      <span>{channelAnalytics.sent}</span>
                      <label>Sent</label>
                    </div>
                    <div className="mini-stat">
                      <span>{channelAnalytics.delivered}</span>
                      <label>Delivered</label>
                    </div>
                    <div className="mini-stat">
                      <span>{Math.round(channelAnalytics.deliveryRate * 100)}%</span>
                      <label>Rate</label>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="recent-notifications">
        <div className="section-header">
          <h4>Recent Notifications</h4>
          <button onClick={() => setActiveTab('notifications')} className="view-all-btn">
            View All <Icon icon="solar:arrow-right-linear" width={16} />
          </button>
        </div>
        <div className="notifications-preview">
          {notifications.slice(0, 5).map((notification) => {
            const tConfig = typeConfig[notification.type];
            return (
              <div key={notification.id} className="notification-preview-item">
                <div
                  className="preview-icon"
                  style={{ backgroundColor: tConfig.bgColor, color: tConfig.color }}
                >
                  <Icon icon={notification.icon || tConfig.icon} width={16} />
                </div>
                <div className="preview-content">
                  <span className="preview-title">{notification.title}</span>
                  <span className="preview-time">
                    {formatTimeAgo(notification.createdAt)}
                  </span>
                </div>
                <span
                  className="preview-priority"
                  style={{ color: pConfig[notification.priority].color }}
                >
                  <Icon icon={pConfig[notification.priority].icon} width={14} />
                </span>
              </div>
            );
          })}
          {notifications.length === 0 && (
            <div className="empty-preview">
              <Icon icon="solar:bell-off-linear" width={32} />
              <p>No notifications yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Rules Overview */}
      <div className="rules-overview">
        <div className="section-header">
          <h4>Active Rules</h4>
          <button onClick={() => setActiveTab('rules')} className="view-all-btn">
            Manage Rules <Icon icon="solar:arrow-right-linear" width={16} />
          </button>
        </div>
        <div className="rules-preview">
          {rules.filter((r) => r.enabled).slice(0, 3).map((rule) => (
            <div key={rule.id} className="rule-preview-item">
              <Icon icon="solar:document-medicine-bold" width={16} />
              <span className="rule-name">{rule.name}</span>
              <span className="rule-category">{rule.category}</span>
            </div>
          ))}
          {rules.filter((r) => r.enabled).length === 0 && (
            <div className="empty-preview small">
              <p>No active rules</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // ============================================================================
  // Helper Functions
  // ============================================================================

  function formatTimeAgo(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className="notification-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <h2>Notification Pipeline</h2>
          <p>Manage notifications, channels, and delivery rules</p>
        </div>
        <div className="header-right">
          {unreadNotifications.length > 0 && (
            <div className="unread-indicator">
              <Icon icon="solar:bell-bold" width={20} />
              <span className="unread-count">{unreadNotifications.length}</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Icon icon="solar:chart-2-bold" width={18} />
          Overview
        </button>
        <button
          className={`tab ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          <Icon icon="solar:bell-bold" width={18} />
          Notifications
          {unreadNotifications.length > 0 && (
            <span className="tab-badge">{unreadNotifications.length}</span>
          )}
        </button>
        <button
          className={`tab ${activeTab === 'preferences' ? 'active' : ''}`}
          onClick={() => setActiveTab('preferences')}
        >
          <Icon icon="solar:settings-bold" width={18} />
          Preferences
        </button>
        <button
          className={`tab ${activeTab === 'rules' ? 'active' : ''}`}
          onClick={() => setActiveTab('rules')}
        >
          <Icon icon="solar:document-medicine-bold" width={18} />
          Rules
          <span className="tab-badge secondary">{rules.length}</span>
        </button>
      </div>

      {/* Content */}
      <div className="dashboard-content">
        {activeTab === 'overview' && renderOverview()}
        
        {activeTab === 'notifications' && (
          <NotificationCenter
            notifications={notifications}
            onMarkAsRead={markNotificationAsRead}
            onDismiss={dismissNotificationById}
            onMarkAllAsRead={markAllAsRead}
            onClearAll={clearAll}
            unreadCount={unreadNotifications.length}
          />
        )}
        
        {activeTab === 'preferences' && (
          <PreferencesPanel
            preferences={preferences}
            onUpdatePreferences={updatePreferences}
            onUpdateChannelPreference={updateChannelPreference}
            onUpdateCategoryPreference={updateCategoryPreference}
            onSetQuietHours={setQuietHours}
            onToggleGlobal={toggleGlobalNotifications}
          />
        )}
        
        {activeTab === 'rules' && (
          <RulesEditor
            rules={rules}
            onAddRule={addRule}
            onUpdateRule={updateRule}
            onRemoveRule={removeRule}
            onToggleRule={toggleRule}
          />
        )}
      </div>

      {/* Create Notification Modal */}
      {showCreateModal &&
        createPortal(
          <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create Notification</h3>
              <button onClick={() => setShowCreateModal(false)} className="close-btn">
                <Icon icon="solar:close-circle-bold" width={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Type</label>
                <select
                  value={newNotification.type}
                  onChange={(e) => setNewNotification((prev) => ({ ...prev, type: e.target.value as NotificationType }))}
                >
                  {Object.entries(typeConfig).map(([type, config]) => (
                    <option key={type} value={type}>{config.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select
                  value={newNotification.priority}
                  onChange={(e) => setNewNotification((prev) => ({ ...prev, priority: e.target.value as NotificationPriority }))}
                >
                  {Object.entries(pConfig).map(([priority, config]) => (
                    <option key={priority} value={priority}>{config.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Notification title"
                />
              </div>
              <div className="form-group">
                <label>Message *</label>
                <textarea
                  value={newNotification.message}
                  onChange={(e) => setNewNotification((prev) => ({ ...prev, message: e.target.value }))}
                  placeholder="Notification message"
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  value={newNotification.category}
                  onChange={(e) => setNewNotification((prev) => ({ ...prev, category: e.target.value }))}
                  placeholder="general"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowCreateModal(false)} className="cancel-btn">
                Cancel
              </button>
              <button
                onClick={handleCreateNotification}
                className="create-btn"
                disabled={!newNotification.title.trim() || !newNotification.message.trim()}
              >
                Create
              </button>
            </div>
            </div>
          </div>,
          document.body
        )}

      <style>{`
        .notification-dashboard {
          padding: 24px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }

        .header-left h2 {
          margin: 0 0 4px;
          font-size: 24px;
          font-weight: 700;
        }

        .header-left p {
          margin: 0;
          color: var(--text-secondary, #6b7280);
          font-size: 14px;
        }

        .unread-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: var(--primary-bg, #eff6ff);
          color: var(--primary-color, #3b82f6);
          border-radius: 20px;
        }

        .unread-count {
          font-weight: 600;
        }

        .dashboard-tabs {
          display: flex;
          gap: 4px;
          margin-bottom: 24px;
          border-bottom: 1px solid var(--border-color, #e5e7eb);
          padding-bottom: 12px;
        }

        .dashboard-tabs .tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 14px;
          color: var(--text-secondary, #6b7280);
          border-radius: 8px;
          transition: all 0.2s;
        }

        .dashboard-tabs .tab:hover {
          background: var(--hover-bg, #f3f4f6);
        }

        .dashboard-tabs .tab.active {
          background: var(--primary-color, #3b82f6);
          color: white;
        }

        .tab-badge {
          padding: 2px 8px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          font-size: 11px;
        }

        .tab-badge.secondary {
          background: var(--bg-secondary, #f3f4f6);
          color: var(--text-secondary, #6b7280);
        }

        .tab.active .tab-badge.secondary {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .dashboard-content {
          min-height: 500px;
        }

        /* Overview Styles */
        .dashboard-overview {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        .stats-grid {
          grid-column: 1 / -1;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: var(--card-bg, #fff);
          border-radius: 12px;
          border: 1px solid var(--border-color, #e5e7eb);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-content {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
        }

        .stat-label {
          font-size: 13px;
          color: var(--text-secondary, #6b7280);
        }

        .quick-actions {
          grid-column: 1 / -1;
          background: var(--card-bg, #fff);
          border-radius: 12px;
          border: 1px solid var(--border-color, #e5e7eb);
          padding: 20px;
        }

        .quick-actions h4 {
          margin: 0 0 16px;
          font-size: 16px;
          font-weight: 600;
        }

        .action-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border: 1px solid var(--border-color, #e5e7eb);
          background: white;
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn:hover {
          border-color: var(--primary-color, #3b82f6);
          color: var(--primary-color, #3b82f6);
        }

        .action-btn.primary {
          background: var(--primary-color, #3b82f6);
          color: white;
          border-color: var(--primary-color, #3b82f6);
        }

        .action-btn.primary:hover {
          background: var(--primary-hover, #2563eb);
        }

        .action-btn.danger:hover {
          border-color: #ef4444;
          color: #ef4444;
        }

        .channels-status {
          background: var(--card-bg, #fff);
          border-radius: 12px;
          border: 1px solid var(--border-color, #e5e7eb);
          padding: 20px;
        }

        .channels-status h4 {
          margin: 0 0 16px;
          font-size: 16px;
          font-weight: 600;
        }

        .channels-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .channel-status-card {
          padding: 12px;
          border: 1px solid var(--border-color, #e5e7eb);
          border-radius: 10px;
        }

        .channel-status-card.disabled {
          opacity: 0.6;
        }

        .channel-header {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .channel-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .channel-info {
          display: flex;
          flex-direction: column;
        }

        .channel-name {
          font-weight: 600;
          font-size: 13px;
        }

        .channel-badge {
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 4px;
          width: fit-content;
        }

        .channel-badge.active {
          background: #d1fae5;
          color: #059669;
        }

        .channel-badge.inactive {
          background: #f3f4f6;
          color: #6b7280;
        }

        .channel-stats {
          display: flex;
          gap: 12px;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid var(--border-color, #e5e7eb);
        }

        .mini-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .mini-stat span {
          font-weight: 600;
          font-size: 14px;
        }

        .mini-stat label {
          font-size: 10px;
          color: var(--text-secondary, #6b7280);
        }

        .recent-notifications,
        .rules-overview {
          background: var(--card-bg, #fff);
          border-radius: 12px;
          border: 1px solid var(--border-color, #e5e7eb);
          padding: 20px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .section-header h4 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        .view-all-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          background: transparent;
          border: none;
          color: var(--primary-color, #3b82f6);
          cursor: pointer;
          font-size: 13px;
        }

        .notifications-preview {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .notification-preview-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px;
          border-radius: 8px;
          transition: background 0.2s;
        }

        .notification-preview-item:hover {
          background: var(--hover-bg, #f3f4f6);
        }

        .preview-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .preview-content {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }

        .preview-title {
          font-size: 13px;
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .preview-time {
          font-size: 11px;
          color: var(--text-secondary, #6b7280);
        }

        .preview-priority {
          display: flex;
          align-items: center;
        }

        .empty-preview {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 24px;
          color: var(--text-secondary, #6b7280);
        }

        .empty-preview p {
          margin: 8px 0 0;
          font-size: 13px;
        }

        .empty-preview.small {
          padding: 16px;
        }

        .rules-preview {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .rule-preview-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          border-radius: 8px;
          font-size: 13px;
        }

        .rule-preview-item:hover {
          background: var(--hover-bg, #f3f4f6);
        }

        .rule-name {
          flex: 1;
          font-weight: 500;
        }

        .rule-category {
          padding: 2px 8px;
          background: var(--bg-secondary, #f3f4f6);
          border-radius: 4px;
          font-size: 11px;
          color: var(--text-secondary, #6b7280);
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1050;
        }

        .modal {
          background: var(--card-bg, #fff);
          border-radius: 16px;
          width: 100%;
          max-width: 480px;
          max-height: 90vh;
          overflow: hidden;
          position: relative;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          animation: fadeIn 0.2s ease-out;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px;
          border-bottom: 1px solid var(--border-color, #e5e7eb);
        }

        .modal-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }

        .close-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          color: var(--text-secondary, #6b7280);
        }

        .modal-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-secondary, #6b7280);
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
          padding: 10px 12px;
          border: 1px solid var(--border-color, #e5e7eb);
          border-radius: 8px;
          font-size: 14px;
        }

        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
          outline: none;
          border-color: var(--primary-color, #3b82f6);
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding: 16px 20px;
          border-top: 1px solid var(--border-color, #e5e7eb);
        }

        .cancel-btn {
          padding: 10px 20px;
          border: 1px solid var(--border-color, #e5e7eb);
          background: white;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
        }

        .create-btn {
          padding: 10px 20px;
          background: var(--primary-color, #3b82f6);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
        }

        .create-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 1024px) {
          .dashboard-overview {
            grid-template-columns: 1fr;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .channels-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationDashboard;
