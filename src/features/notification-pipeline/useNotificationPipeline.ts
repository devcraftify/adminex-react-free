/**
 * Notification Pipeline Hook
 *
 * React hook for managing notifications, channels, and delivery preferences.
 * Provides comprehensive notification management with filtering, batching, and scheduling.
 */

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import type {
  Notification,
  NotificationId,
  NotificationType,
  NotificationPriority,
  NotificationStatus,
  DeliveryChannel,
  NotificationChannel,
  NotificationPreferences,
  NotificationRule,
  NotificationTemplate,
  NotificationAnalytics,
  ChannelPreference,
  CategoryPreference,
  QuietHours,
} from './types';
import {
  generateId,
  createNotification,
  createFromTemplate,
  sendNotification,
  markDelivered,
  markRead,
  dismissNotification,
  validateNotification,
  evaluateRule,
  calculateAnalytics,
  filterNotifications as engineFilterNotifications,
  exportNotifications as engineExportNotifications,
  importNotifications as engineImportNotifications,
} from './engine';
import {
  notificationTemplates,
  defaultChannels,
  sampleRules,
  priorityConfig,
  notificationTypeConfig,
  channelConfig,
  generateSampleNotifications,
} from './config';

// ============================================================================
// Types
// ============================================================================

interface NotificationPipelineState {
  notifications: Notification[];
  channels: NotificationChannel[];
  rules: NotificationRule[];
  templates: NotificationTemplate[];
  preferences: NotificationPreferences;
}

interface NotificationPipelineOptions {
  initialNotifications?: Notification[];
  userId?: string;
  maxNotifications?: number;
  enableAutoCleanup?: boolean;
  cleanupIntervalMs?: number;
  retentionPeriodMs?: number;
}

interface NotificationFilterOptions {
  types?: NotificationType[];
  priorities?: NotificationPriority[];
  statuses?: NotificationStatus[];
  channels?: DeliveryChannel[];
  startDate?: Date;
  endDate?: Date;
  search?: string;
  category?: string[];
}

interface UseNotificationPipelineReturn {
  // State
  notifications: Notification[];
  unreadNotifications: Notification[];
  readNotifications: Notification[];
  channels: NotificationChannel[];
  rules: NotificationRule[];
  templates: NotificationTemplate[];
  preferences: NotificationPreferences;
  analytics: NotificationAnalytics;

  // Notification Actions
  addNotification: (options: {
    type: NotificationType;
    priority: NotificationPriority;
    title: string;
    message: string;
    channels?: DeliveryChannel[];
    category?: string;
    tags?: string[];
    metadata?: Record<string, unknown>;
    scheduledAt?: Date;
    expiresAt?: Date;
  }) => Notification;
  removeNotification: (id: NotificationId) => void;
  updateNotification: (id: NotificationId, updates: Partial<Notification>) => void;
  markNotificationAsRead: (id: NotificationId) => void;
  markNotificationAsDelivered: (id: NotificationId, channel: DeliveryChannel) => void;
  dismissNotificationById: (id: NotificationId) => void;
  markAllAsRead: () => void;
  clearAll: () => void;

  // Template Operations
  sendFromTemplate: (
    templateId: string,
    variables: Record<string, unknown>,
    overrides?: Partial<Notification>
  ) => Notification | null;
  addTemplate: (template: Omit<NotificationTemplate, 'id' | 'createdAt' | 'updatedAt'>) => NotificationTemplate;
  removeTemplate: (templateId: string) => void;

  // Channel Management
  enableChannel: (channelId: string) => void;
  disableChannel: (channelId: string) => void;
  updateChannelConfig: (channelId: string, updates: Partial<NotificationChannel>) => void;

  // Preference Management
  updatePreferences: (updates: Partial<NotificationPreferences>) => void;
  updateChannelPreference: (channel: DeliveryChannel, updates: Partial<ChannelPreference>) => void;
  updateCategoryPreference: (category: string, updates: Partial<CategoryPreference>) => void;
  setQuietHours: (quietHours: QuietHours) => void;
  toggleGlobalNotifications: (enabled: boolean) => void;

  // Rule Management
  addRule: (rule: Omit<NotificationRule, 'id' | 'createdAt' | 'updatedAt'>) => NotificationRule;
  removeRule: (ruleId: string) => void;
  updateRule: (ruleId: string, updates: Partial<NotificationRule>) => void;
  toggleRule: (ruleId: string) => void;
  evaluateNotificationRule: (ruleId: string, context: Record<string, unknown>) => boolean;

  // Filtering & Search
  filterByType: (type: NotificationType) => Notification[];
  filterByPriority: (priority: NotificationPriority) => Notification[];
  filterByStatus: (status: NotificationStatus) => Notification[];
  filterByChannel: (channel: DeliveryChannel) => Notification[];
  filterNotifications: (options: NotificationFilterOptions) => Notification[];
  searchNotifications: (query: string) => Notification[];

  // Delivery
  sendNotificationToChannels: (notification: Notification) => Notification;
  retryFailedDelivery: (id: NotificationId) => void;

  // Utilities
  getNotificationById: (id: NotificationId) => Notification | undefined;
  getNotificationCount: () => number;
  getUnreadCount: () => number;
  hasUnread: () => boolean;
  exportAllNotifications: () => string;
  importNotificationsFromJson: (json: string) => boolean;
  loadSampleNotifications: () => void;

  // Config References
  priorityConfig: typeof priorityConfig;
  typeConfig: typeof notificationTypeConfig;
  channelConfigRef: typeof channelConfig;
}

// ============================================================================
// Default Preferences
// ============================================================================

const createDefaultPreferences = (userId: string): NotificationPreferences => ({
  userId,
  channels: [
    { channel: 'in_app', enabled: true, types: ['info', 'success', 'warning', 'error', 'alert', 'reminder', 'system'], minPriority: 'low' },
    { channel: 'email', enabled: true, types: ['alert', 'reminder', 'system'], minPriority: 'medium' },
    { channel: 'push', enabled: false, types: ['alert', 'error'], minPriority: 'high' },
    { channel: 'slack', enabled: false, types: ['system'], minPriority: 'urgent' },
    { channel: 'sms', enabled: false, types: ['alert'], minPriority: 'critical' },
    { channel: 'webhook', enabled: false, types: [], minPriority: 'low' },
  ],
  categories: [
    { category: 'general', enabled: true, channels: ['in_app'] },
    { category: 'system', enabled: true, channels: ['in_app', 'email'] },
    { category: 'tasks', enabled: true, channels: ['in_app', 'email'] },
    { category: 'approvals', enabled: true, channels: ['in_app', 'email', 'push'] },
    { category: 'reminders', enabled: true, channels: ['in_app', 'email'] },
  ],
  quietHours: {
    enabled: false,
    startHour: 22,
    endHour: 7,
    timezone: 'UTC',
    allowUrgent: true,
  },
  digestSettings: {
    enabled: false,
    frequency: 'daily',
    deliveryHour: 9,
    categories: [],
  },
  globalEnabled: true,
  updatedAt: new Date(),
});

// ============================================================================
// Hook Implementation
// ============================================================================

export function useNotificationPipeline(
  options: NotificationPipelineOptions = {}
): UseNotificationPipelineReturn {
  const {
    initialNotifications = [],
    userId = 'user-1',
    maxNotifications = 500,
    enableAutoCleanup = true,
    cleanupIntervalMs = 60000,
    retentionPeriodMs = 7 * 24 * 60 * 60 * 1000,
  } = options;

  // ============================================================================
  // State
  // ============================================================================

  const [state, setState] = useState<NotificationPipelineState>(() => ({
    notifications: initialNotifications,
    channels: [...defaultChannels],
    rules: [...sampleRules],
    templates: [...notificationTemplates],
    preferences: createDefaultPreferences(userId),
  }));

  const cleanupTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ============================================================================
  // Auto Cleanup Effect
  // ============================================================================

  useEffect(() => {
    if (!enableAutoCleanup) return;

    cleanupTimerRef.current = setInterval(() => {
      const now = Date.now();
      setState((prev) => ({
        ...prev,
        notifications: prev.notifications.filter((n) => {
          // Keep unread notifications
          if (n.status === 'pending' || n.status === 'sent' || n.status === 'delivered') return true;
          // Keep recent notifications
          const notificationAge = now - new Date(n.createdAt).getTime();
          return notificationAge < retentionPeriodMs;
        }),
      }));
    }, cleanupIntervalMs);

    return () => {
      if (cleanupTimerRef.current) {
        clearInterval(cleanupTimerRef.current);
      }
    };
  }, [enableAutoCleanup, cleanupIntervalMs, retentionPeriodMs]);

  // ============================================================================
  // Computed Values
  // ============================================================================

  const unreadNotifications = useMemo(
    () => state.notifications.filter((n) => n.status !== 'read' && n.status !== 'dismissed'),
    [state.notifications]
  );

  const readNotifications = useMemo(
    () => state.notifications.filter((n) => n.status === 'read'),
    [state.notifications]
  );

  const analytics = useMemo(
    () => calculateAnalytics(state.notifications),
    [state.notifications]
  );

  // ============================================================================
  // Notification Actions
  // ============================================================================

  const addNotification = useCallback(
    (notificationOptions: {
      type: NotificationType;
      priority: NotificationPriority;
      title: string;
      message: string;
      channels?: DeliveryChannel[];
      category?: string;
      tags?: string[];
      metadata?: Record<string, unknown>;
      scheduledAt?: Date;
      expiresAt?: Date;
    }): Notification => {
      const notification = createNotification({
        ...notificationOptions,
        userId,
        channels: notificationOptions.channels || ['in_app'],
      });

      setState((prev) => {
        let notifications = [notification, ...prev.notifications];

        // Enforce max notifications limit
        if (notifications.length > maxNotifications) {
          notifications = notifications.slice(0, maxNotifications);
        }

        return { ...prev, notifications };
      });

      return notification;
    },
    [userId, maxNotifications]
  );

  const removeNotification = useCallback((id: NotificationId) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.filter((n) => n.id !== id),
    }));
  }, []);

  const updateNotification = useCallback(
    (id: NotificationId, updates: Partial<Notification>) => {
      setState((prev) => ({
        ...prev,
        notifications: prev.notifications.map((n) =>
          n.id === id ? { ...n, ...updates, updatedAt: new Date() } : n
        ),
      }));
    },
    []
  );

  const markNotificationAsRead = useCallback((id: NotificationId) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.id === id ? markRead(n) : n
      ),
    }));
  }, []);

  const markNotificationAsDelivered = useCallback((id: NotificationId, channel: DeliveryChannel) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.id === id ? markDelivered(n, channel) : n
      ),
    }));
  }, []);

  const dismissNotificationById = useCallback((id: NotificationId) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.id === id ? dismissNotification(n) : n
      ),
    }));
  }, []);

  const markAllAsRead = useCallback(() => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.status !== 'read' && n.status !== 'dismissed' ? markRead(n) : n
      ),
    }));
  }, []);

  const clearAll = useCallback(() => {
    setState((prev) => ({
      ...prev,
      notifications: [],
    }));
  }, []);

  // ============================================================================
  // Template Operations
  // ============================================================================

  const sendFromTemplateHandler = useCallback(
    (
      templateId: string,
      variables: Record<string, unknown>,
      overrides?: Partial<Notification>
    ): Notification | null => {
      const template = state.templates.find((t) => t.id === templateId);
      if (!template) return null;

      const notification = createFromTemplate(template, userId, variables, overrides);

      setState((prev) => ({
        ...prev,
        notifications: [notification, ...prev.notifications],
      }));

      return notification;
    },
    [state.templates, userId]
  );

  const addTemplate = useCallback(
    (templateData: Omit<NotificationTemplate, 'id' | 'createdAt' | 'updatedAt'>): NotificationTemplate => {
      const template: NotificationTemplate = {
        ...templateData,
        id: `template-${generateId()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setState((prev) => ({
        ...prev,
        templates: [...prev.templates, template],
      }));

      return template;
    },
    []
  );

  const removeTemplate = useCallback((templateId: string) => {
    setState((prev) => ({
      ...prev,
      templates: prev.templates.filter((t) => t.id !== templateId),
    }));
  }, []);

  // ============================================================================
  // Channel Management
  // ============================================================================

  const enableChannel = useCallback((channelId: string) => {
    setState((prev) => ({
      ...prev,
      channels: prev.channels.map((c) =>
        c.id === channelId ? { ...c, enabled: true } : c
      ),
    }));
  }, []);

  const disableChannel = useCallback((channelId: string) => {
    setState((prev) => ({
      ...prev,
      channels: prev.channels.map((c) =>
        c.id === channelId ? { ...c, enabled: false } : c
      ),
    }));
  }, []);

  const updateChannelConfig = useCallback(
    (channelId: string, updates: Partial<NotificationChannel>) => {
      setState((prev) => ({
        ...prev,
        channels: prev.channels.map((c) =>
          c.id === channelId ? { ...c, ...updates } : c
        ),
      }));
    },
    []
  );

  // ============================================================================
  // Preference Management
  // ============================================================================

  const updatePreferences = useCallback(
    (updates: Partial<NotificationPreferences>) => {
      setState((prev) => ({
        ...prev,
        preferences: { ...prev.preferences, ...updates, updatedAt: new Date() },
      }));
    },
    []
  );

  const updateChannelPreference = useCallback(
    (channel: DeliveryChannel, updates: Partial<ChannelPreference>) => {
      setState((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          channels: prev.preferences.channels.map((cp) =>
            cp.channel === channel ? { ...cp, ...updates } : cp
          ),
          updatedAt: new Date(),
        },
      }));
    },
    []
  );

  const updateCategoryPreference = useCallback(
    (category: string, updates: Partial<CategoryPreference>) => {
      setState((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          categories: prev.preferences.categories.map((cp) =>
            cp.category === category ? { ...cp, ...updates } : cp
          ),
          updatedAt: new Date(),
        },
      }));
    },
    []
  );

  const setQuietHours = useCallback((quietHours: QuietHours) => {
    setState((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        quietHours,
        updatedAt: new Date(),
      },
    }));
  }, []);

  const toggleGlobalNotifications = useCallback((enabled: boolean) => {
    setState((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        globalEnabled: enabled,
        updatedAt: new Date(),
      },
    }));
  }, []);

  // ============================================================================
  // Rule Management
  // ============================================================================

  const addRule = useCallback(
    (ruleData: Omit<NotificationRule, 'id' | 'createdAt' | 'updatedAt'>): NotificationRule => {
      const rule: NotificationRule = {
        ...ruleData,
        id: `rule-${generateId()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setState((prev) => ({
        ...prev,
        rules: [...prev.rules, rule],
      }));

      return rule;
    },
    []
  );

  const removeRule = useCallback((ruleId: string) => {
    setState((prev) => ({
      ...prev,
      rules: prev.rules.filter((r) => r.id !== ruleId),
    }));
  }, []);

  const updateRuleHandler = useCallback(
    (ruleId: string, updates: Partial<NotificationRule>) => {
      setState((prev) => ({
        ...prev,
        rules: prev.rules.map((r) =>
          r.id === ruleId ? { ...r, ...updates, updatedAt: new Date() } : r
        ),
      }));
    },
    []
  );

  const toggleRule = useCallback((ruleId: string) => {
    setState((prev) => ({
      ...prev,
      rules: prev.rules.map((r) =>
        r.id === ruleId ? { ...r, enabled: !r.enabled, updatedAt: new Date() } : r
      ),
    }));
  }, []);

  const evaluateNotificationRule = useCallback(
    (ruleId: string, context: Record<string, unknown>): boolean => {
      const rule = state.rules.find((r) => r.id === ruleId);
      if (!rule || !rule.enabled) return false;
      return evaluateRule(rule, context);
    },
    [state.rules]
  );

  // ============================================================================
  // Filtering & Search
  // ============================================================================

  const filterByType = useCallback(
    (type: NotificationType): Notification[] => {
      return state.notifications.filter((n) => n.type === type);
    },
    [state.notifications]
  );

  const filterByPriority = useCallback(
    (priority: NotificationPriority): Notification[] => {
      return state.notifications.filter((n) => n.priority === priority);
    },
    [state.notifications]
  );

  const filterByStatus = useCallback(
    (status: NotificationStatus): Notification[] => {
      return state.notifications.filter((n) => n.status === status);
    },
    [state.notifications]
  );

  const filterByChannel = useCallback(
    (channel: DeliveryChannel): Notification[] => {
      return state.notifications.filter((n) => n.channels.includes(channel));
    },
    [state.notifications]
  );

  const filterNotificationsHandler = useCallback(
    (filterOptions: NotificationFilterOptions): Notification[] => {
      return engineFilterNotifications(state.notifications, filterOptions);
    },
    [state.notifications]
  );

  const searchNotifications = useCallback(
    (query: string): Notification[] => {
      if (!query.trim()) return state.notifications;

      const queryLower = query.toLowerCase();
      return state.notifications.filter(
        (n) =>
          n.title.toLowerCase().includes(queryLower) ||
          n.message.toLowerCase().includes(queryLower) ||
          n.category.toLowerCase().includes(queryLower) ||
          n.tags.some((t) => t.toLowerCase().includes(queryLower))
      );
    },
    [state.notifications]
  );

  // ============================================================================
  // Delivery
  // ============================================================================

  const sendNotificationToChannels = useCallback(
    (notification: Notification): Notification => {
      const updated = sendNotification(notification, state.channels);
      
      setState((prev) => ({
        ...prev,
        notifications: prev.notifications.map((n) =>
          n.id === notification.id ? updated : n
        ),
      }));

      return updated;
    },
    [state.channels]
  );

  const retryFailedDelivery = useCallback(
    (id: NotificationId) => {
      const notification = state.notifications.find((n) => n.id === id);
      if (!notification) return;

      const updated = sendNotification(notification, state.channels);
      
      setState((prev) => ({
        ...prev,
        notifications: prev.notifications.map((n) =>
          n.id === id ? updated : n
        ),
      }));
    },
    [state.notifications, state.channels]
  );

  // ============================================================================
  // Utilities
  // ============================================================================

  const getNotificationById = useCallback(
    (id: NotificationId): Notification | undefined => {
      return state.notifications.find((n) => n.id === id);
    },
    [state.notifications]
  );

  const getNotificationCount = useCallback((): number => {
    return state.notifications.length;
  }, [state.notifications]);

  const getUnreadCount = useCallback((): number => {
    return unreadNotifications.length;
  }, [unreadNotifications]);

  const hasUnread = useCallback((): boolean => {
    return unreadNotifications.length > 0;
  }, [unreadNotifications]);

  const exportAllNotifications = useCallback((): string => {
    return engineExportNotifications(state.notifications);
  }, [state.notifications]);

  const importNotificationsFromJson = useCallback((json: string): boolean => {
    const imported = engineImportNotifications(json);
    if (!imported) return false;

    setState((prev) => ({
      ...prev,
      notifications: [...imported, ...prev.notifications],
    }));

    return true;
  }, []);

  const loadSampleNotifications = useCallback(() => {
    const samples = generateSampleNotifications();
    setState((prev) => ({
      ...prev,
      notifications: [...samples, ...prev.notifications],
    }));
  }, []);

  // ============================================================================
  // Validation wrapper
  // ============================================================================

  // Expose validate for external use
  const _validateNotification = useCallback(
    (notification: Partial<Notification>) => {
      return validateNotification(notification, state.preferences);
    },
    [state.preferences]
  );

  // Keep typescript happy - use the variable
  void _validateNotification;

  // ============================================================================
  // Return
  // ============================================================================

  return {
    // State
    notifications: state.notifications,
    unreadNotifications,
    readNotifications,
    channels: state.channels,
    rules: state.rules,
    templates: state.templates,
    preferences: state.preferences,
    analytics,

    // Notification Actions
    addNotification,
    removeNotification,
    updateNotification,
    markNotificationAsRead,
    markNotificationAsDelivered,
    dismissNotificationById,
    markAllAsRead,
    clearAll,

    // Template Operations
    sendFromTemplate: sendFromTemplateHandler,
    addTemplate,
    removeTemplate,

    // Channel Management
    enableChannel,
    disableChannel,
    updateChannelConfig,

    // Preference Management
    updatePreferences,
    updateChannelPreference,
    updateCategoryPreference,
    setQuietHours,
    toggleGlobalNotifications,

    // Rule Management
    addRule,
    removeRule,
    updateRule: updateRuleHandler,
    toggleRule,
    evaluateNotificationRule,

    // Filtering & Search
    filterByType,
    filterByPriority,
    filterByStatus,
    filterByChannel,
    filterNotifications: filterNotificationsHandler,
    searchNotifications,

    // Delivery
    sendNotificationToChannels,
    retryFailedDelivery,

    // Utilities
    getNotificationById,
    getNotificationCount,
    getUnreadCount,
    hasUnread,
    exportAllNotifications,
    importNotificationsFromJson,
    loadSampleNotifications,

    // Config References
    priorityConfig,
    typeConfig: notificationTypeConfig,
    channelConfigRef: channelConfig,
  };
}

// ============================================================================
// Exports
// ============================================================================

export { priorityConfig, notificationTypeConfig, channelConfig };
