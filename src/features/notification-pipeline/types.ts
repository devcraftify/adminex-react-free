/**
 * Notification Pipeline Types
 * Phase 2 - Notification management and delivery system
 */

export type NotificationId = string;
export type ChannelId = string;
export type TemplateId = string;
export type RuleId = string;

// Notification Types
export type NotificationType = 
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'alert'
  | 'reminder'
  | 'system';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent' | 'critical';
export type NotificationStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed' | 'dismissed';
export type DeliveryChannel = 'in_app' | 'email' | 'sms' | 'push' | 'slack' | 'webhook';

// Core Notification Interface
export interface Notification {
  id: NotificationId;
  type: NotificationType;
  priority: NotificationPriority;
  status: NotificationStatus;
  
  // Content
  title: string;
  message: string;
  icon?: string;
  imageUrl?: string;
  
  // Targeting
  userId: string;
  userEmail?: string;
  userName?: string;
  groupId?: string;
  
  // Delivery
  channels: DeliveryChannel[];
  deliveryResults: DeliveryResult[];
  scheduledAt?: Date;
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  expiresAt?: Date;
  
  // Actions
  actions: NotificationAction[];
  actionUrl?: string;
  dismissable: boolean;
  
  // Metadata
  category: string;
  tags: string[];
  metadata: Record<string, unknown>;
  templateId?: TemplateId;
  
  // Tracking
  createdAt: Date;
  updatedAt: Date;
  sourceId?: string;
  sourceType?: string;
}

export interface NotificationAction {
  id: string;
  label: string;
  type: 'primary' | 'secondary' | 'danger' | 'link';
  url?: string;
  action?: string;
  icon?: string;
}

export interface DeliveryResult {
  channel: DeliveryChannel;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  sentAt?: Date;
  deliveredAt?: Date;
  error?: string;
  externalId?: string;
}

// Channel Configuration
export interface NotificationChannel {
  id: ChannelId;
  type: DeliveryChannel;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  config: ChannelConfig;
  priority: number;
  rateLimit?: RateLimitConfig;
}

export type ChannelConfig = 
  | InAppConfig
  | EmailConfig
  | SmsConfig
  | PushConfig
  | SlackConfig
  | WebhookConfig;

export interface InAppConfig {
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  duration: number;
  maxVisible: number;
  groupSimilar: boolean;
  playSound: boolean;
  soundUrl?: string;
}

export interface EmailConfig {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
  replyTo?: string;
  useTls: boolean;
}

export interface SmsConfig {
  provider: 'twilio' | 'nexmo' | 'custom';
  apiKey: string;
  apiSecret: string;
  fromNumber: string;
}

export interface PushConfig {
  provider: 'firebase' | 'onesignal' | 'custom';
  apiKey: string;
  appId: string;
  icon?: string;
  badge?: string;
}

export interface SlackConfig {
  webhookUrl: string;
  channel: string;
  username: string;
  iconEmoji?: string;
}

export interface WebhookConfig {
  url: string;
  method: 'POST' | 'PUT';
  headers: Record<string, string>;
  authType?: 'none' | 'basic' | 'bearer' | 'api_key';
  authValue?: string;
  retryCount: number;
  timeout: number;
}

export interface RateLimitConfig {
  maxPerMinute: number;
  maxPerHour: number;
  maxPerDay: number;
  cooldownMinutes: number;
}

// Templates
export interface NotificationTemplate {
  id: TemplateId;
  name: string;
  description: string;
  category: string;
  type: NotificationType;
  priority: NotificationPriority;
  
  // Content templates (supports variables like {{userName}})
  titleTemplate: string;
  messageTemplate: string;
  
  // Channel-specific content
  channelContent: Partial<Record<DeliveryChannel, ChannelContent>>;
  
  // Default settings
  defaultChannels: DeliveryChannel[];
  defaultActions: NotificationAction[];
  icon?: string;
  color?: string;
  
  // Metadata
  variables: TemplateVariable[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChannelContent {
  title?: string;
  message?: string;
  htmlContent?: string;
  customData?: Record<string, unknown>;
}

export interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object';
  required: boolean;
  defaultValue?: unknown;
  description: string;
}

// Notification Rules (for automated notifications)
export interface NotificationRule {
  id: RuleId;
  name: string;
  description: string;
  enabled: boolean;
  
  // Trigger
  trigger: NotificationTrigger;
  
  // Conditions
  conditions: NotificationCondition[];
  conditionLogic: 'and' | 'or';
  
  // Action
  templateId: TemplateId;
  channelOverrides?: DeliveryChannel[];
  priorityOverride?: NotificationPriority;
  
  // Scheduling
  schedule?: NotificationSchedule;
  cooldown?: number; // minutes
  
  // Metadata
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type NotificationTrigger = 
  | EventTrigger
  | TimeTrigger
  | ThresholdTrigger
  | StatusChangeTrigger;

export interface EventTrigger {
  type: 'event';
  eventType: string;
  eventSource: string;
}

export interface TimeTrigger {
  type: 'time';
  schedule: string; // cron expression
  timezone: string;
}

export interface ThresholdTrigger {
  type: 'threshold';
  metric: string;
  operator: '>' | '<' | '>=' | '<=' | '==' | '!=';
  value: number;
  duration?: number; // minutes the condition must be true
}

export interface StatusChangeTrigger {
  type: 'status_change';
  entity: string;
  fromStatus?: string;
  toStatus: string;
}

export interface NotificationCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater' | 'less' | 'in' | 'not_in' | 'exists' | 'regex';
  value: unknown;
}

export interface NotificationSchedule {
  type: 'immediate' | 'delayed' | 'scheduled' | 'recurring';
  delayMinutes?: number;
  scheduledTime?: Date;
  recurringPattern?: string; // cron
  timezone?: string;
}

// Subscription & Preferences
export interface NotificationPreferences {
  userId: string;
  channels: ChannelPreference[];
  categories: CategoryPreference[];
  quietHours?: QuietHours;
  digestSettings?: DigestSettings;
  globalEnabled: boolean;
  updatedAt: Date;
}

export interface ChannelPreference {
  channel: DeliveryChannel;
  enabled: boolean;
  types: NotificationType[];
  minPriority: NotificationPriority;
}

export interface CategoryPreference {
  category: string;
  enabled: boolean;
  channels: DeliveryChannel[];
}

export interface QuietHours {
  enabled: boolean;
  startHour: number;
  endHour: number;
  timezone: string;
  allowUrgent: boolean;
}

export interface DigestSettings {
  enabled: boolean;
  frequency: 'hourly' | 'daily' | 'weekly';
  deliveryHour: number;
  categories: string[];
}

// Queue & Processing
export interface NotificationQueue {
  pending: NotificationQueueItem[];
  processing: NotificationQueueItem[];
  completed: NotificationQueueItem[];
  failed: NotificationQueueItem[];
}

export interface NotificationQueueItem {
  id: string;
  notificationId: NotificationId;
  channel: DeliveryChannel;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  attempts: number;
  maxAttempts: number;
  nextAttempt?: Date;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Analytics
export interface NotificationAnalytics {
  totalSent: number;
  totalDelivered: number;
  totalRead: number;
  totalFailed: number;
  
  deliveryRate: number;
  readRate: number;
  clickRate: number;
  
  byChannel: Record<DeliveryChannel, ChannelAnalytics>;
  byType: Record<NotificationType, TypeAnalytics>;
  byPriority: Record<NotificationPriority, number>;
  byCategory: Record<string, number>;
  
  hourlyDistribution: number[];
  dailyTrend: DailyTrendItem[];
  
  avgDeliveryTime: number;
  avgReadTime: number;
}

export interface ChannelAnalytics {
  sent: number;
  delivered: number;
  failed: number;
  deliveryRate: number;
  avgDeliveryTime: number;
}

export interface TypeAnalytics {
  sent: number;
  read: number;
  clickedActions: number;
}

export interface DailyTrendItem {
  date: Date;
  sent: number;
  delivered: number;
  read: number;
  failed: number;
}

// Validation
export interface NotificationValidationResult {
  isValid: boolean;
  errors: NotificationError[];
  warnings: NotificationWarning[];
}

export interface NotificationError {
  type: 'missing_field' | 'invalid_template' | 'channel_disabled' | 'rate_limited' | 'invalid_recipient';
  message: string;
  field?: string;
}

export interface NotificationWarning {
  type: 'low_deliverability' | 'quiet_hours' | 'user_preference' | 'high_volume';
  message: string;
}

// Demo/Test Types
export interface NotificationDemo {
  id: string;
  name: string;
  description: string;
  notification: Partial<Notification>;
}
