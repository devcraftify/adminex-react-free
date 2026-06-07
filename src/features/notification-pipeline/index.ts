/**
 * Notification Pipeline Feature
 * Phase 2 - Notification management and delivery system
 *
 * This feature provides:
 * - Multi-channel notification delivery (in-app, email, SMS, push, Slack, webhook)
 * - Notification templates with variable substitution
 * - Automated notification rules with triggers and conditions
 * - User preferences and quiet hours management
 * - Notification analytics and delivery tracking
 * - Batch notification processing
 */

// Types
export type {
  NotificationId,
  ChannelId,
  TemplateId,
  RuleId,
  NotificationType,
  NotificationPriority,
  NotificationStatus,
  DeliveryChannel,
  Notification,
  NotificationAction,
  DeliveryResult,
  NotificationChannel,
  ChannelConfig,
  InAppConfig,
  EmailConfig,
  SmsConfig,
  PushConfig,
  SlackConfig,
  WebhookConfig,
  RateLimitConfig,
  NotificationTemplate,
  ChannelContent,
  TemplateVariable,
  NotificationRule,
  NotificationTrigger,
  EventTrigger,
  TimeTrigger,
  ThresholdTrigger,
  StatusChangeTrigger,
  NotificationCondition,
  NotificationSchedule,
  NotificationPreferences,
  ChannelPreference,
  CategoryPreference,
  QuietHours,
  DigestSettings,
  NotificationQueue,
  NotificationQueueItem,
  NotificationAnalytics,
  ChannelAnalytics,
  TypeAnalytics,
  DailyTrendItem,
  NotificationValidationResult,
  NotificationError,
  NotificationWarning,
  NotificationDemo,
} from './types';

// Engine Functions
export {
  generateId,
  createNotification,
  processTemplate,
  createFromTemplate,
  sendNotification,
  markDelivered,
  markRead,
  dismissNotification,
  validateNotification,
  validateTemplate,
  evaluateRule,
  calculateAnalytics,
  filterNotifications,
  exportNotifications,
  importNotifications,
} from './engine';

// Configuration
export {
  notificationTypeConfig,
  priorityConfig,
  channelConfig,
  defaultChannels,
  notificationTemplates,
  sampleRules,
  categoryConfig,
  generateSampleNotifications,
} from './config';

// Hook
export { useNotificationPipeline } from './useNotificationPipeline';

// Components
export {
  NotificationCenter,
  PreferencesPanel,
  RulesEditor,
  NotificationDashboard,
} from './components';
