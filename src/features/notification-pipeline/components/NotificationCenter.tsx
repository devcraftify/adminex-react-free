/**
 * Notification Center Component
 *
 * Displays notifications in a list/inbox format with filtering,
 * actions, and real-time updates.
 */

import React, { useState, useMemo } from 'react';
import { Icon } from '@iconify/react';
import type {
  Notification,
  NotificationId,
  NotificationType,
  NotificationPriority,
  NotificationStatus,
} from '../types';
import {
  notificationTypeConfig,
  priorityConfig,
} from '../config';

// ============================================================================
// Types
// ============================================================================

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (id: NotificationId) => void;
  onDismiss: (id: NotificationId) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onNotificationClick?: (notification: Notification) => void;
  unreadCount: number;
  maxVisible?: number;
}

type FilterTab = 'all' | 'unread' | NotificationType;

// ============================================================================
// Component
// ============================================================================

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAsRead,
  onDismiss,
  onMarkAllAsRead,
  onClearAll,
  onNotificationClick,
  unreadCount,
  maxVisible = 50,
}) => {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [expandedId, setExpandedId] = useState<NotificationId | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // ============================================================================
  // Filtered Notifications
  // ============================================================================

  const filteredNotifications = useMemo(() => {
    let result = notifications;

    // Filter by tab
    if (activeTab === 'unread') {
      result = result.filter((n) => n.status !== 'read' && n.status !== 'dismissed');
    } else if (activeTab !== 'all') {
      result = result.filter((n) => n.type === activeTab);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(query) ||
          n.message.toLowerCase().includes(query)
      );
    }

    return result.slice(0, maxVisible);
  }, [notifications, activeTab, searchQuery, maxVisible]);

  // ============================================================================
  // Helpers
  // ============================================================================

  const formatTime = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const getTypeStyle = (type: NotificationType) => {
    const config = notificationTypeConfig[type];
    return {
      color: config.color,
      backgroundColor: config.bgColor,
    };
  };

  const getPriorityIndicator = (priority: NotificationPriority) => {
    const config = priorityConfig[priority];
    return (
      <span
        className="notification-priority"
        style={{ color: config.color }}
        title={config.label}
      >
        <Icon icon={config.icon} width={12} />
      </span>
    );
  };

  const getStatusIcon = (status: NotificationStatus) => {
    switch (status) {
      case 'pending':
        return <Icon icon="solar:clock-circle-linear" width={14} />;
      case 'sent':
        return <Icon icon="solar:check-read-linear" width={14} />;
      case 'delivered':
        return <Icon icon="solar:check-read-bold" width={14} />;
      case 'read':
        return <Icon icon="solar:eye-bold" width={14} />;
      case 'failed':
        return <Icon icon="solar:close-circle-bold" width={14} style={{ color: '#ef4444' }} />;
      case 'dismissed':
        return <Icon icon="solar:minus-circle-bold" width={14} />;
      default:
        return null;
    }
  };

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className="notification-center">
      {/* Header */}
      <div className="notification-header">
        <div className="notification-header-left">
          <h3>Notifications</h3>
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount}</span>
          )}
        </div>
        <div className="notification-header-actions">
          <button
            onClick={onMarkAllAsRead}
            className="notification-action-btn"
            title="Mark all as read"
            disabled={unreadCount === 0}
          >
            <Icon icon="solar:check-read-bold" width={18} />
          </button>
          <button
            onClick={onClearAll}
            className="notification-action-btn"
            title="Clear all"
            disabled={notifications.length === 0}
          >
            <Icon icon="solar:trash-bin-2-bold" width={18} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="notification-search">
        <Icon icon="solar:magnifer-linear" width={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search notifications..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="clear-search">
            <Icon icon="solar:close-circle-bold" width={16} />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="notification-tabs">
        <button
          className={`tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All
        </button>
        <button
          className={`tab ${activeTab === 'unread' ? 'active' : ''}`}
          onClick={() => setActiveTab('unread')}
        >
          Unread
          {unreadCount > 0 && <span className="tab-count">{unreadCount}</span>}
        </button>
        {Object.entries(notificationTypeConfig).slice(0, 4).map(([type, config]) => (
          <button
            key={type}
            className={`tab ${activeTab === type ? 'active' : ''}`}
            onClick={() => setActiveTab(type as NotificationType)}
          >
            <Icon icon={config.icon} width={14} />
            <span>{config.label}</span>
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="notification-list">
        {filteredNotifications.length === 0 ? (
          <div className="notification-empty">
            <Icon icon="solar:bell-off-linear" width={48} />
            <p>No notifications</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const typeConfig = notificationTypeConfig[notification.type];
            const isExpanded = expandedId === notification.id;
            const isUnread = notification.status !== 'read' && notification.status !== 'dismissed';

            return (
              <div
                key={notification.id}
                className={`notification-item ${isUnread ? 'unread' : ''} ${isExpanded ? 'expanded' : ''}`}
                onClick={() => {
                  if (isUnread) onMarkAsRead(notification.id);
                  onNotificationClick?.(notification);
                }}
              >
                {/* Type Icon */}
                <div
                  className="notification-icon"
                  style={getTypeStyle(notification.type)}
                >
                  <Icon icon={notification.icon || typeConfig.icon} width={20} />
                </div>

                {/* Content */}
                <div className="notification-content">
                  <div className="notification-title-row">
                    <span className="notification-title">{notification.title}</span>
                    {getPriorityIndicator(notification.priority)}
                  </div>
                  <p className={`notification-message ${isExpanded ? '' : 'truncated'}`}>
                    {notification.message}
                  </p>
                  
                  {/* Actions (if any) */}
                  {notification.actions.length > 0 && isExpanded && (
                    <div className="notification-actions">
                      {notification.actions.map((action) => (
                        <button
                          key={action.id}
                          className={`action-btn action-${action.type}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (action.url) {
                              window.open(action.url, '_blank');
                            }
                          }}
                        >
                          {action.icon && <Icon icon={action.icon} width={14} />}
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="notification-footer">
                    <span className="notification-time">
                      {formatTime(notification.createdAt)}
                    </span>
                    <span className="notification-status">
                      {getStatusIcon(notification.status)}
                    </span>
                    <span className="notification-category">{notification.category}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="notification-item-actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedId(isExpanded ? null : notification.id);
                    }}
                    className="item-action-btn"
                    title={isExpanded ? 'Collapse' : 'Expand'}
                  >
                    <Icon
                      icon={isExpanded ? 'solar:alt-arrow-up-linear' : 'solar:alt-arrow-down-linear'}
                      width={16}
                    />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDismiss(notification.id);
                    }}
                    className="item-action-btn dismiss"
                    title="Dismiss"
                  >
                    <Icon icon="solar:close-circle-linear" width={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {filteredNotifications.length > 0 && filteredNotifications.length < notifications.length && (
        <div className="notification-footer-info">
          Showing {filteredNotifications.length} of {notifications.length} notifications
        </div>
      )}

      <style>{`
        .notification-center {
          display: flex;
          flex-direction: column;
          background: var(--card-bg, #fff);
          border-radius: 12px;
          border: 1px solid var(--border-color, #e5e7eb);
          overflow: hidden;
          height: 100%;
        }

        .notification-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          border-bottom: 1px solid var(--border-color, #e5e7eb);
        }

        .notification-header-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .notification-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }

        .unread-badge {
          background: #ef4444;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .notification-header-actions {
          display: flex;
          gap: 4px;
        }

        .notification-action-btn {
          padding: 8px;
          border: none;
          background: transparent;
          cursor: pointer;
          color: var(--text-secondary, #6b7280);
          border-radius: 8px;
          transition: all 0.2s;
        }

        .notification-action-btn:hover:not(:disabled) {
          background: var(--hover-bg, #f3f4f6);
          color: var(--primary-color, #3b82f6);
        }

        .notification-action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .notification-search {
          position: relative;
          padding: 12px 16px;
          border-bottom: 1px solid var(--border-color, #e5e7eb);
        }

        .notification-search input {
          width: 100%;
          padding: 8px 12px 8px 36px;
          border: 1px solid var(--border-color, #e5e7eb);
          border-radius: 8px;
          font-size: 14px;
          outline: none;
        }

        .notification-search input:focus {
          border-color: var(--primary-color, #3b82f6);
        }

        .search-icon {
          position: absolute;
          left: 28px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-secondary, #6b7280);
        }

        .clear-search {
          position: absolute;
          right: 28px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          cursor: pointer;
          color: var(--text-secondary, #6b7280);
          padding: 2px;
        }

        .notification-tabs {
          display: flex;
          gap: 4px;
          padding: 8px 16px;
          border-bottom: 1px solid var(--border-color, #e5e7eb);
          overflow-x: auto;
        }

        .notification-tabs .tab {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 12px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 13px;
          color: var(--text-secondary, #6b7280);
          border-radius: 6px;
          white-space: nowrap;
          transition: all 0.2s;
        }

        .notification-tabs .tab:hover {
          background: var(--hover-bg, #f3f4f6);
        }

        .notification-tabs .tab.active {
          background: var(--primary-color, #3b82f6);
          color: white;
        }

        .tab-count {
          background: rgba(255, 255, 255, 0.2);
          padding: 1px 6px;
          border-radius: 10px;
          font-size: 11px;
        }

        .notification-list {
          flex: 1;
          overflow-y: auto;
        }

        .notification-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px;
          color: var(--text-secondary, #6b7280);
        }

        .notification-empty p {
          margin-top: 12px;
        }

        .notification-item {
          display: flex;
          gap: 12px;
          padding: 12px 16px;
          border-bottom: 1px solid var(--border-color, #e5e7eb);
          cursor: pointer;
          transition: background 0.2s;
        }

        .notification-item:hover {
          background: var(--hover-bg, #f9fafb);
        }

        .notification-item.unread {
          background: var(--unread-bg, #eff6ff);
        }

        .notification-item.unread:hover {
          background: var(--unread-hover-bg, #dbeafe);
        }

        .notification-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .notification-content {
          flex: 1;
          min-width: 0;
        }

        .notification-title-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .notification-title {
          font-weight: 600;
          font-size: 14px;
          color: var(--text-primary, #111827);
        }

        .notification-priority {
          display: flex;
          align-items: center;
        }

        .notification-message {
          margin: 4px 0;
          font-size: 13px;
          color: var(--text-secondary, #6b7280);
          line-height: 1.5;
        }

        .notification-message.truncated {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .notification-actions {
          display: flex;
          gap: 8px;
          margin-top: 8px;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn.action-primary {
          background: var(--primary-color, #3b82f6);
          color: white;
        }

        .action-btn.action-secondary {
          background: var(--secondary-bg, #f3f4f6);
          color: var(--text-primary, #111827);
        }

        .action-btn.action-danger {
          background: #fee2e2;
          color: #dc2626;
        }

        .action-btn.action-link {
          background: transparent;
          color: var(--primary-color, #3b82f6);
        }

        .notification-footer {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
          font-size: 11px;
          color: var(--text-tertiary, #9ca3af);
        }

        .notification-status {
          display: flex;
          align-items: center;
        }

        .notification-category {
          padding: 2px 6px;
          background: var(--category-bg, #f3f4f6);
          border-radius: 4px;
        }

        .notification-item-actions {
          display: flex;
          flex-direction: column;
          gap: 4px;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .notification-item:hover .notification-item-actions {
          opacity: 1;
        }

        .item-action-btn {
          padding: 4px;
          border: none;
          background: transparent;
          cursor: pointer;
          color: var(--text-secondary, #6b7280);
          border-radius: 4px;
          transition: all 0.2s;
        }

        .item-action-btn:hover {
          background: var(--hover-bg, #f3f4f6);
        }

        .item-action-btn.dismiss:hover {
          color: #ef4444;
        }

        .notification-footer-info {
          padding: 12px;
          text-align: center;
          font-size: 12px;
          color: var(--text-secondary, #6b7280);
          border-top: 1px solid var(--border-color, #e5e7eb);
        }
      `}</style>
    </div>
  );
};

export default NotificationCenter;
