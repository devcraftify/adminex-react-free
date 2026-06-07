/**
 * Notification Pipeline Engine
 * Phase 2 - Core functions for notification processing
 */

import type {
  Notification,
  NotificationId,
  NotificationType,
  NotificationPriority,
  NotificationStatus,
  DeliveryChannel,
  DeliveryResult,
  NotificationAction,
  NotificationTemplate,
  NotificationRule,
  NotificationPreferences,
  NotificationAnalytics,
  NotificationValidationResult,
  NotificationError,
  NotificationWarning,
  NotificationChannel,
  ChannelAnalytics,
  TypeAnalytics,
} from './types';

// ============================================================================
// ID Generation
// ============================================================================

export function generateId(): NotificationId {
  return `ntf_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

// ============================================================================
// Notification Creation
// ============================================================================

export function createNotification(
  options: {
    type: NotificationType;
    priority: NotificationPriority;
    title: string;
    message: string;
    userId: string;
    channels?: DeliveryChannel[];
    actions?: NotificationAction[];
    category?: string;
    tags?: string[];
    metadata?: Record<string, unknown>;
    scheduledAt?: Date;
    expiresAt?: Date;
    templateId?: string;
    icon?: string;
    actionUrl?: string;
    dismissable?: boolean;
  }
): Notification {
  const now = new Date();
  
  return {
    id: generateId(),
    type: options.type,
    priority: options.priority,
    status: options.scheduledAt && options.scheduledAt > now ? 'pending' : 'pending',
    
    title: options.title,
    message: options.message,
    icon: options.icon,
    
    userId: options.userId,
    
    channels: options.channels || ['in_app'],
    deliveryResults: [],
    scheduledAt: options.scheduledAt,
    expiresAt: options.expiresAt,
    
    actions: options.actions || [],
    actionUrl: options.actionUrl,
    dismissable: options.dismissable ?? true,
    
    category: options.category || 'general',
    tags: options.tags || [],
    metadata: options.metadata || {},
    templateId: options.templateId,
    
    createdAt: now,
    updatedAt: now,
  };
}

// ============================================================================
// Template Processing
// ============================================================================

export function processTemplate(
  template: NotificationTemplate,
  variables: Record<string, unknown>
): { title: string; message: string } {
  let title = template.titleTemplate;
  let message = template.messageTemplate;
  
  // Replace variables
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    const replacement = formatValue(value);
    title = title.replace(regex, replacement);
    message = message.replace(regex, replacement);
  }
  
  // Handle missing required variables
  template.variables.forEach(v => {
    if (v.required && variables[v.name] === undefined) {
      const defaultVal = v.defaultValue !== undefined ? formatValue(v.defaultValue) : `[${v.name}]`;
      const regex = new RegExp(`{{\\s*${v.name}\\s*}}`, 'g');
      title = title.replace(regex, defaultVal);
      message = message.replace(regex, defaultVal);
    }
  });
  
  return { title, message };
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) return value.toLocaleDateString();
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

export function createFromTemplate(
  template: NotificationTemplate,
  userId: string,
  variables: Record<string, unknown>,
  overrides?: Partial<Notification>
): Notification {
  const { title, message } = processTemplate(template, variables);
  
  return createNotification({
    type: template.type,
    priority: template.priority,
    title,
    message,
    userId,
    channels: template.defaultChannels,
    actions: template.defaultActions,
    category: template.category,
    icon: template.icon,
    templateId: template.id,
    ...overrides,
  });
}

// ============================================================================
// Delivery Processing
// ============================================================================

export function sendNotification(
  notification: Notification,
  channels: NotificationChannel[]
): Notification {
  const now = new Date();
  const deliveryResults: DeliveryResult[] = [];
  
  notification.channels.forEach(channelType => {
    const channel = channels.find(c => c.type === channelType && c.enabled);
    
    if (!channel) {
      deliveryResults.push({
        channel: channelType,
        status: 'failed',
        error: 'Channel not configured or disabled',
      });
      return;
    }
    
    // Simulate sending (in real app, would call actual delivery service)
    deliveryResults.push({
      channel: channelType,
      status: 'sent',
      sentAt: now,
      externalId: `ext_${generateId()}`,
    });
  });
  
  const allSent = deliveryResults.every(r => r.status === 'sent' || r.status === 'delivered');
  const anyFailed = deliveryResults.some(r => r.status === 'failed');
  
  return {
    ...notification,
    status: allSent ? 'sent' : anyFailed ? 'failed' : 'pending',
    deliveryResults,
    sentAt: now,
    updatedAt: now,
  };
}

export function markDelivered(
  notification: Notification,
  channel: DeliveryChannel
): Notification {
  const now = new Date();
  const deliveryResults = notification.deliveryResults.map(r => {
    if (r.channel === channel && r.status === 'sent') {
      return { ...r, status: 'delivered' as const, deliveredAt: now };
    }
    return r;
  });
  
  const allDelivered = deliveryResults.every(r => r.status === 'delivered');
  
  return {
    ...notification,
    status: allDelivered ? 'delivered' : notification.status,
    deliveryResults,
    deliveredAt: allDelivered ? now : notification.deliveredAt,
    updatedAt: now,
  };
}

export function markRead(notification: Notification): Notification {
  const now = new Date();
  return {
    ...notification,
    status: 'read',
    readAt: now,
    updatedAt: now,
  };
}

export function dismissNotification(notification: Notification): Notification {
  return {
    ...notification,
    status: 'dismissed',
    updatedAt: new Date(),
  };
}

// ============================================================================
// Validation
// ============================================================================

export function validateNotification(
  notification: Partial<Notification>,
  preferences?: NotificationPreferences
): NotificationValidationResult {
  const errors: NotificationError[] = [];
  const warnings: NotificationWarning[] = [];
  
  // Required fields
  if (!notification.title) {
    errors.push({ type: 'missing_field', message: 'Title is required', field: 'title' });
  }
  if (!notification.message) {
    errors.push({ type: 'missing_field', message: 'Message is required', field: 'message' });
  }
  if (!notification.userId) {
    errors.push({ type: 'invalid_recipient', message: 'User ID is required', field: 'userId' });
  }
  if (!notification.channels || notification.channels.length === 0) {
    errors.push({ type: 'channel_disabled', message: 'At least one channel must be specified', field: 'channels' });
  }
  
  // Check preferences
  if (preferences) {
    // Check global enabled
    if (!preferences.globalEnabled) {
      warnings.push({ 
        type: 'user_preference', 
        message: 'User has disabled all notifications' 
      });
    }
    
    // Check quiet hours
    if (preferences.quietHours?.enabled) {
      const now = new Date();
      const hour = now.getHours();
      if (
        hour >= preferences.quietHours.startHour || 
        hour < preferences.quietHours.endHour
      ) {
        if (notification.priority !== 'urgent' && notification.priority !== 'critical') {
          warnings.push({
            type: 'quiet_hours',
            message: 'User is in quiet hours - notification may be delayed',
          });
        } else if (!preferences.quietHours.allowUrgent) {
          warnings.push({
            type: 'quiet_hours',
            message: 'User is in quiet hours and does not allow urgent notifications',
          });
        }
      }
    }
    
    // Check channel preferences
    notification.channels?.forEach(channel => {
      const channelPref = preferences.channels.find(c => c.channel === channel);
      if (channelPref && !channelPref.enabled) {
        warnings.push({
          type: 'user_preference',
          message: `User has disabled ${channel} notifications`,
        });
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export function validateTemplate(template: Partial<NotificationTemplate>): NotificationValidationResult {
  const errors: NotificationError[] = [];
  const warnings: NotificationWarning[] = [];
  
  if (!template.name) {
    errors.push({ type: 'missing_field', message: 'Template name is required', field: 'name' });
  }
  if (!template.titleTemplate) {
    errors.push({ type: 'invalid_template', message: 'Title template is required', field: 'titleTemplate' });
  }
  if (!template.messageTemplate) {
    errors.push({ type: 'invalid_template', message: 'Message template is required', field: 'messageTemplate' });
  }
  
  // Check for undefined variables in templates
  const variablePattern = /\{\{\s*(\w+)\s*\}\}/g;
  const definedVars = new Set(template.variables?.map(v => v.name) || []);
  
  const titleVars = [...(template.titleTemplate?.matchAll(variablePattern) || [])];
  const messageVars = [...(template.messageTemplate?.matchAll(variablePattern) || [])];
  
  [...titleVars, ...messageVars].forEach(match => {
    if (!definedVars.has(match[1])) {
      warnings.push({
        type: 'low_deliverability',
        message: `Variable {{${match[1]}}} is used but not defined`,
      });
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// Rule Processing
// ============================================================================

export function evaluateRule(
  rule: NotificationRule,
  context: Record<string, unknown>
): boolean {
  if (!rule.enabled) return false;
  
  // Check cooldown (would need last execution time in real implementation)
  
  // Evaluate conditions
  const results = rule.conditions.map(condition => {
    const fieldValue = getNestedValue(context, condition.field);
    return evaluateCondition(fieldValue, condition.operator, condition.value);
  });
  
  if (rule.conditionLogic === 'and') {
    return results.every(r => r);
  } else {
    return results.some(r => r);
  }
}

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce((acc: unknown, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

function evaluateCondition(
  fieldValue: unknown,
  operator: string,
  value: unknown
): boolean {
  switch (operator) {
    case 'equals':
      return fieldValue === value;
    case 'not_equals':
      return fieldValue !== value;
    case 'contains':
      return String(fieldValue).includes(String(value));
    case 'not_contains':
      return !String(fieldValue).includes(String(value));
    case 'greater':
      return Number(fieldValue) > Number(value);
    case 'less':
      return Number(fieldValue) < Number(value);
    case 'in':
      return Array.isArray(value) && value.includes(fieldValue);
    case 'not_in':
      return Array.isArray(value) && !value.includes(fieldValue);
    case 'exists':
      return fieldValue !== undefined && fieldValue !== null;
    case 'regex':
      return new RegExp(String(value)).test(String(fieldValue));
    default:
      return false;
  }
}

// ============================================================================
// Analytics
// ============================================================================

export function calculateAnalytics(notifications: Notification[]): NotificationAnalytics {
  const totalSent = notifications.filter(n => 
    ['sent', 'delivered', 'read'].includes(n.status)
  ).length;
  const totalDelivered = notifications.filter(n => 
    ['delivered', 'read'].includes(n.status)
  ).length;
  const totalRead = notifications.filter(n => n.status === 'read').length;
  const totalFailed = notifications.filter(n => n.status === 'failed').length;
  
  const deliveryRate = totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0;
  const readRate = totalDelivered > 0 ? (totalRead / totalDelivered) * 100 : 0;
  
  // Calculate click rate (actions performed)
  const clickedActions = notifications.filter(n => 
    n.metadata['actionClicked'] === true
  ).length;
  const clickRate = totalDelivered > 0 ? (clickedActions / totalDelivered) * 100 : 0;
  
  // By channel
  const byChannel: Record<DeliveryChannel, ChannelAnalytics> = {
    in_app: calculateChannelAnalytics(notifications, 'in_app'),
    email: calculateChannelAnalytics(notifications, 'email'),
    sms: calculateChannelAnalytics(notifications, 'sms'),
    push: calculateChannelAnalytics(notifications, 'push'),
    slack: calculateChannelAnalytics(notifications, 'slack'),
    webhook: calculateChannelAnalytics(notifications, 'webhook'),
  };
  
  // By type
  const types: NotificationType[] = ['info', 'success', 'warning', 'error', 'alert', 'reminder', 'system'];
  const byType: Record<NotificationType, TypeAnalytics> = {} as Record<NotificationType, TypeAnalytics>;
  types.forEach(type => {
    const typeNotifications = notifications.filter(n => n.type === type);
    byType[type] = {
      sent: typeNotifications.filter(n => ['sent', 'delivered', 'read'].includes(n.status)).length,
      read: typeNotifications.filter(n => n.status === 'read').length,
      clickedActions: typeNotifications.filter(n => n.metadata['actionClicked'] === true).length,
    };
  });
  
  // By priority
  const priorities: NotificationPriority[] = ['low', 'medium', 'high', 'urgent', 'critical'];
  const byPriority: Record<NotificationPriority, number> = {} as Record<NotificationPriority, number>;
  priorities.forEach(p => {
    byPriority[p] = notifications.filter(n => n.priority === p).length;
  });
  
  // By category
  const byCategory: Record<string, number> = {};
  notifications.forEach(n => {
    byCategory[n.category] = (byCategory[n.category] || 0) + 1;
  });
  
  // Hourly distribution
  const hourlyDistribution = new Array(24).fill(0);
  notifications.forEach(n => {
    const hour = n.createdAt.getHours();
    hourlyDistribution[hour]++;
  });
  
  // Daily trend (last 7 days)
  const dailyTrend = calculateDailyTrend(notifications, 7);
  
  // Average times
  const avgDeliveryTime = calculateAvgDeliveryTime(notifications);
  const avgReadTime = calculateAvgReadTime(notifications);
  
  return {
    totalSent,
    totalDelivered,
    totalRead,
    totalFailed,
    deliveryRate,
    readRate,
    clickRate,
    byChannel,
    byType,
    byPriority,
    byCategory,
    hourlyDistribution,
    dailyTrend,
    avgDeliveryTime,
    avgReadTime,
  };
}

function calculateChannelAnalytics(
  notifications: Notification[],
  channel: DeliveryChannel
): ChannelAnalytics {
  const channelNotifications = notifications.filter(n => n.channels.includes(channel));
  
  let sent = 0;
  let delivered = 0;
  let failed = 0;
  let totalDeliveryTime = 0;
  let deliveredCount = 0;
  
  channelNotifications.forEach(n => {
    const result = n.deliveryResults.find(r => r.channel === channel);
    if (result) {
      if (result.status === 'sent' || result.status === 'delivered') sent++;
      if (result.status === 'delivered') {
        delivered++;
        if (result.sentAt && result.deliveredAt) {
          totalDeliveryTime += result.deliveredAt.getTime() - result.sentAt.getTime();
          deliveredCount++;
        }
      }
      if (result.status === 'failed') failed++;
    }
  });
  
  return {
    sent,
    delivered,
    failed,
    deliveryRate: sent > 0 ? (delivered / sent) * 100 : 0,
    avgDeliveryTime: deliveredCount > 0 ? totalDeliveryTime / deliveredCount / 1000 : 0, // seconds
  };
}

function calculateDailyTrend(
  notifications: Notification[],
  days: number
): NotificationAnalytics['dailyTrend'] {
  const trend: NotificationAnalytics['dailyTrend'] = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    
    const dayNotifications = notifications.filter(n => {
      const created = new Date(n.createdAt);
      return created >= date && created < nextDate;
    });
    
    trend.push({
      date: new Date(date),
      sent: dayNotifications.filter(n => ['sent', 'delivered', 'read'].includes(n.status)).length,
      delivered: dayNotifications.filter(n => ['delivered', 'read'].includes(n.status)).length,
      read: dayNotifications.filter(n => n.status === 'read').length,
      failed: dayNotifications.filter(n => n.status === 'failed').length,
    });
  }
  
  return trend;
}

function calculateAvgDeliveryTime(notifications: Notification[]): number {
  const delivered = notifications.filter(n => n.sentAt && n.deliveredAt);
  if (delivered.length === 0) return 0;
  
  const totalTime = delivered.reduce((acc, n) => {
    return acc + (n.deliveredAt!.getTime() - n.sentAt!.getTime());
  }, 0);
  
  return totalTime / delivered.length / 1000; // seconds
}

function calculateAvgReadTime(notifications: Notification[]): number {
  const read = notifications.filter(n => n.deliveredAt && n.readAt);
  if (read.length === 0) return 0;
  
  const totalTime = read.reduce((acc, n) => {
    return acc + (n.readAt!.getTime() - n.deliveredAt!.getTime());
  }, 0);
  
  return totalTime / read.length / 1000; // seconds
}

// ============================================================================
// Filtering & Searching
// ============================================================================

export function filterNotifications(
  notifications: Notification[],
  filters: {
    status?: NotificationStatus[];
    type?: NotificationType[];
    priority?: NotificationPriority[];
    channel?: DeliveryChannel[];
    category?: string[];
    userId?: string;
    dateRange?: { start: Date; end: Date };
    search?: string;
  }
): Notification[] {
  return notifications.filter(n => {
    if (filters.status && !filters.status.includes(n.status)) return false;
    if (filters.type && !filters.type.includes(n.type)) return false;
    if (filters.priority && !filters.priority.includes(n.priority)) return false;
    if (filters.channel && !n.channels.some(c => filters.channel!.includes(c))) return false;
    if (filters.category && !filters.category.includes(n.category)) return false;
    if (filters.userId && n.userId !== filters.userId) return false;
    if (filters.dateRange) {
      if (n.createdAt < filters.dateRange.start || n.createdAt > filters.dateRange.end) return false;
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (
        !n.title.toLowerCase().includes(searchLower) &&
        !n.message.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }
    return true;
  });
}

// ============================================================================
// Export/Import
// ============================================================================

export function exportNotifications(notifications: Notification[]): string {
  return JSON.stringify(notifications, null, 2);
}

export function importNotifications(json: string): Notification[] | null {
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return null;
    
    return parsed.map(n => ({
      ...n,
      createdAt: new Date(n.createdAt),
      updatedAt: new Date(n.updatedAt),
      scheduledAt: n.scheduledAt ? new Date(n.scheduledAt) : undefined,
      sentAt: n.sentAt ? new Date(n.sentAt) : undefined,
      deliveredAt: n.deliveredAt ? new Date(n.deliveredAt) : undefined,
      readAt: n.readAt ? new Date(n.readAt) : undefined,
      expiresAt: n.expiresAt ? new Date(n.expiresAt) : undefined,
    }));
  } catch {
    return null;
  }
}
