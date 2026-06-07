/**
 * Notification Pipeline Configuration
 * Phase 2 - Templates, channels, and default configurations
 */

import type {
  NotificationTemplate,
  NotificationChannel,
  NotificationRule,
  NotificationType,
  NotificationPriority,
  DeliveryChannel,
  Notification,
  InAppConfig,
} from './types';
import { createNotification } from './engine';

// ============================================================================
// Type Configurations
// ============================================================================

export const notificationTypeConfig: Record<NotificationType, {
  label: string;
  icon: string;
  color: string;
  bgColor: string;
}> = {
  info: {
    label: 'Information',
    icon: 'solar:info-circle-bold',
    color: '#3b82f6',
    bgColor: '#dbeafe',
  },
  success: {
    label: 'Success',
    icon: 'solar:check-circle-bold',
    color: '#10b981',
    bgColor: '#d1fae5',
  },
  warning: {
    label: 'Warning',
    icon: 'solar:danger-triangle-bold',
    color: '#f59e0b',
    bgColor: '#fef3c7',
  },
  error: {
    label: 'Error',
    icon: 'solar:close-circle-bold',
    color: '#ef4444',
    bgColor: '#fee2e2',
  },
  alert: {
    label: 'Alert',
    icon: 'solar:bell-bold',
    color: '#8b5cf6',
    bgColor: '#ede9fe',
  },
  reminder: {
    label: 'Reminder',
    icon: 'solar:alarm-bold',
    color: '#06b6d4',
    bgColor: '#cffafe',
  },
  system: {
    label: 'System',
    icon: 'solar:settings-bold',
    color: '#6b7280',
    bgColor: '#f3f4f6',
  },
};

export const priorityConfig: Record<NotificationPriority, {
  label: string;
  icon: string;
  color: string;
  order: number;
}> = {
  low: {
    label: 'Low',
    icon: 'solar:arrow-down-linear',
    color: '#10b981',
    order: 1,
  },
  medium: {
    label: 'Medium',
    icon: 'solar:minus-linear',
    color: '#3b82f6',
    order: 2,
  },
  high: {
    label: 'High',
    icon: 'solar:arrow-up-linear',
    color: '#f59e0b',
    order: 3,
  },
  urgent: {
    label: 'Urgent',
    icon: 'solar:double-alt-arrow-up-linear',
    color: '#ef4444',
    order: 4,
  },
  critical: {
    label: 'Critical',
    icon: 'solar:danger-triangle-bold',
    color: '#dc2626',
    order: 5,
  },
};

export const channelConfig: Record<DeliveryChannel, {
  label: string;
  icon: string;
  description: string;
  color: string;
}> = {
  in_app: {
    label: 'In-App',
    icon: 'solar:widget-bold',
    description: 'Show notification in the application',
    color: '#3b82f6',
  },
  email: {
    label: 'Email',
    icon: 'solar:letter-bold',
    description: 'Send notification via email',
    color: '#10b981',
  },
  sms: {
    label: 'SMS',
    icon: 'solar:phone-bold',
    description: 'Send notification via SMS',
    color: '#8b5cf6',
  },
  push: {
    label: 'Push',
    icon: 'solar:bell-bold',
    description: 'Send push notification to device',
    color: '#f59e0b',
  },
  slack: {
    label: 'Slack',
    icon: 'solar:chat-round-bold',
    description: 'Send notification to Slack',
    color: '#ec4899',
  },
  webhook: {
    label: 'Webhook',
    icon: 'solar:link-bold',
    description: 'Send notification to webhook URL',
    color: '#6b7280',
  },
};

// ============================================================================
// Default Channels
// ============================================================================

export const defaultChannels: NotificationChannel[] = [
  {
    id: 'channel-in-app',
    type: 'in_app',
    name: 'In-App Notifications',
    description: 'Display notifications within the application',
    icon: 'solar:widget-bold',
    enabled: true,
    priority: 1,
    config: {
      position: 'top-right',
      duration: 5000,
      maxVisible: 5,
      groupSimilar: true,
      playSound: true,
    } as InAppConfig,
    rateLimit: {
      maxPerMinute: 10,
      maxPerHour: 100,
      maxPerDay: 500,
      cooldownMinutes: 0,
    },
  },
  {
    id: 'channel-email',
    type: 'email',
    name: 'Email Notifications',
    description: 'Send notifications via email',
    icon: 'solar:letter-bold',
    enabled: true,
    priority: 2,
    config: {
      smtpHost: 'smtp.example.com',
      smtpPort: 587,
      smtpUser: '',
      smtpPassword: '',
      fromEmail: 'notifications@example.com',
      fromName: 'AdminEx',
      useTls: true,
    },
    rateLimit: {
      maxPerMinute: 5,
      maxPerHour: 50,
      maxPerDay: 200,
      cooldownMinutes: 1,
    },
  },
  {
    id: 'channel-push',
    type: 'push',
    name: 'Push Notifications',
    description: 'Send push notifications to devices',
    icon: 'solar:bell-bold',
    enabled: false,
    priority: 3,
    config: {
      provider: 'firebase',
      apiKey: '',
      appId: '',
    },
  },
  {
    id: 'channel-slack',
    type: 'slack',
    name: 'Slack Notifications',
    description: 'Send notifications to Slack channels',
    icon: 'solar:chat-round-bold',
    enabled: false,
    priority: 4,
    config: {
      webhookUrl: '',
      channel: '#notifications',
      username: 'AdminEx Bot',
      iconEmoji: ':bell:',
    },
  },
];

// ============================================================================
// Notification Templates
// ============================================================================

export const notificationTemplates: NotificationTemplate[] = [
  {
    id: 'template-welcome',
    name: 'Welcome',
    description: 'Welcome message for new users',
    category: 'onboarding',
    type: 'info',
    priority: 'medium',
    titleTemplate: 'Welcome to AdminEx, {{userName}}!',
    messageTemplate: 'We\'re glad to have you on board. Start by exploring the dashboard and setting up your preferences.',
    channelContent: {
      email: {
        title: 'Welcome to AdminEx!',
        htmlContent: '<h1>Welcome, {{userName}}!</h1><p>We\'re excited to have you join us.</p>',
      },
    },
    defaultChannels: ['in_app', 'email'],
    defaultActions: [
      { id: 'action-1', label: 'Get Started', type: 'primary', action: 'navigate', url: '/dashboard' },
      { id: 'action-2', label: 'View Guide', type: 'secondary', action: 'navigate', url: '/docs' },
    ],
    icon: 'solar:hand-shake-bold',
    color: '#3b82f6',
    variables: [
      { name: 'userName', type: 'string', required: true, description: 'User\'s display name' },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'template-task-assigned',
    name: 'Task Assigned',
    description: 'Notification when a task is assigned',
    category: 'tasks',
    type: 'info',
    priority: 'medium',
    titleTemplate: 'New task assigned: {{taskName}}',
    messageTemplate: 'You have been assigned a new task by {{assignedBy}}. Due date: {{dueDate}}.',
    channelContent: {},
    defaultChannels: ['in_app', 'email'],
    defaultActions: [
      { id: 'action-1', label: 'View Task', type: 'primary', action: 'navigate' },
    ],
    icon: 'solar:clipboard-list-bold',
    color: '#8b5cf6',
    variables: [
      { name: 'taskName', type: 'string', required: true, description: 'Name of the task' },
      { name: 'assignedBy', type: 'string', required: true, description: 'Person who assigned the task' },
      { name: 'dueDate', type: 'date', required: false, description: 'Task due date' },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'template-approval-required',
    name: 'Approval Required',
    description: 'Request for approval',
    category: 'approvals',
    type: 'alert',
    priority: 'high',
    titleTemplate: 'Approval Required: {{requestTitle}}',
    messageTemplate: '{{requesterName}} has submitted {{requestType}} for your approval. Please review and respond.',
    channelContent: {},
    defaultChannels: ['in_app', 'email', 'push'],
    defaultActions: [
      { id: 'action-1', label: 'Approve', type: 'primary', action: 'approve' },
      { id: 'action-2', label: 'Reject', type: 'danger', action: 'reject' },
      { id: 'action-3', label: 'View Details', type: 'secondary', action: 'navigate' },
    ],
    icon: 'solar:check-square-bold',
    color: '#f59e0b',
    variables: [
      { name: 'requestTitle', type: 'string', required: true, description: 'Title of the request' },
      { name: 'requesterName', type: 'string', required: true, description: 'Name of the requester' },
      { name: 'requestType', type: 'string', required: true, description: 'Type of request' },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'template-deadline-reminder',
    name: 'Deadline Reminder',
    description: 'Reminder for upcoming deadlines',
    category: 'reminders',
    type: 'reminder',
    priority: 'high',
    titleTemplate: 'Deadline approaching: {{itemName}}',
    messageTemplate: 'The deadline for "{{itemName}}" is {{deadline}}. {{daysRemaining}} days remaining.',
    channelContent: {},
    defaultChannels: ['in_app', 'email'],
    defaultActions: [
      { id: 'action-1', label: 'View Item', type: 'primary', action: 'navigate' },
    ],
    icon: 'solar:alarm-bold',
    color: '#ef4444',
    variables: [
      { name: 'itemName', type: 'string', required: true, description: 'Name of the item' },
      { name: 'deadline', type: 'date', required: true, description: 'Deadline date' },
      { name: 'daysRemaining', type: 'number', required: true, description: 'Days until deadline' },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'template-system-alert',
    name: 'System Alert',
    description: 'Important system notifications',
    category: 'system',
    type: 'warning',
    priority: 'urgent',
    titleTemplate: 'System Alert: {{alertType}}',
    messageTemplate: '{{alertMessage}}',
    channelContent: {},
    defaultChannels: ['in_app', 'email', 'push'],
    defaultActions: [
      { id: 'action-1', label: 'View Details', type: 'primary', action: 'navigate' },
    ],
    icon: 'solar:shield-warning-bold',
    color: '#dc2626',
    variables: [
      { name: 'alertType', type: 'string', required: true, description: 'Type of alert' },
      { name: 'alertMessage', type: 'string', required: true, description: 'Alert message' },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'template-success',
    name: 'Action Success',
    description: 'Confirmation of successful action',
    category: 'general',
    type: 'success',
    priority: 'low',
    titleTemplate: '{{actionName}} completed successfully',
    messageTemplate: '{{actionDescription}}',
    channelContent: {},
    defaultChannels: ['in_app'],
    defaultActions: [],
    icon: 'solar:check-circle-bold',
    color: '#10b981',
    variables: [
      { name: 'actionName', type: 'string', required: true, description: 'Name of the action' },
      { name: 'actionDescription', type: 'string', required: false, description: 'Description of what was done' },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// ============================================================================
// Sample Notification Rules
// ============================================================================

export const sampleRules: NotificationRule[] = [
  {
    id: 'rule-task-overdue',
    name: 'Task Overdue Alert',
    description: 'Send alert when a task becomes overdue',
    enabled: true,
    trigger: {
      type: 'status_change',
      entity: 'task',
      toStatus: 'overdue',
    },
    conditions: [
      { field: 'priority', operator: 'in', value: ['high', 'urgent', 'critical'] },
    ],
    conditionLogic: 'and',
    templateId: 'template-deadline-reminder',
    priorityOverride: 'urgent',
    category: 'tasks',
    tags: ['overdue', 'deadline'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'rule-approval-pending',
    name: 'Pending Approval Reminder',
    description: 'Remind approvers of pending approvals after 24 hours',
    enabled: true,
    trigger: {
      type: 'time',
      schedule: '0 9 * * *', // Daily at 9 AM
      timezone: 'UTC',
    },
    conditions: [
      { field: 'status', operator: 'equals', value: 'pending' },
      { field: 'createdAt', operator: 'less', value: 'now-24h' },
    ],
    conditionLogic: 'and',
    templateId: 'template-approval-required',
    cooldown: 1440, // 24 hours
    category: 'approvals',
    tags: ['reminder', 'approval'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// ============================================================================
// Category Configurations
// ============================================================================

export const categoryConfig: Record<string, {
  label: string;
  icon: string;
  color: string;
  description: string;
}> = {
  general: {
    label: 'General',
    icon: 'solar:bell-bold',
    color: '#6b7280',
    description: 'General notifications',
  },
  tasks: {
    label: 'Tasks',
    icon: 'solar:checklist-bold',
    color: '#3b82f6',
    description: 'Task-related notifications',
  },
  approvals: {
    label: 'Approvals',
    icon: 'solar:check-square-bold',
    color: '#f59e0b',
    description: 'Approval workflow notifications',
  },
  reminders: {
    label: 'Reminders',
    icon: 'solar:alarm-bold',
    color: '#8b5cf6',
    description: 'Scheduled reminders',
  },
  system: {
    label: 'System',
    icon: 'solar:settings-bold',
    color: '#ef4444',
    description: 'System alerts and updates',
  },
  onboarding: {
    label: 'Onboarding',
    icon: 'solar:hand-shake-bold',
    color: '#10b981',
    description: 'Welcome and onboarding messages',
  },
  workflow: {
    label: 'Workflow',
    icon: 'solar:routing-2-bold',
    color: '#06b6d4',
    description: 'Workflow execution notifications',
  },
};

// ============================================================================
// Sample Notifications Generator
// ============================================================================

export function generateSampleNotifications(): Notification[] {
  const now = new Date();
  const notifications: Notification[] = [];
  
  // Welcome notification
  notifications.push(createNotification({
    type: 'info',
    priority: 'medium',
    title: 'Welcome to AdminEx!',
    message: 'We\'re glad to have you on board. Start by exploring the dashboard.',
    userId: 'user-1',
    channels: ['in_app'],
    category: 'onboarding',
    icon: 'solar:hand-shake-bold',
    actions: [
      { id: 'a1', label: 'Get Started', type: 'primary', url: '/dashboard' },
    ],
  }));
  
  // Task assigned
  notifications.push(createNotification({
    type: 'info',
    priority: 'medium',
    title: 'New task assigned: Update Documentation',
    message: 'John assigned you a new task. Due date: Tomorrow.',
    userId: 'user-1',
    channels: ['in_app', 'email'],
    category: 'tasks',
    icon: 'solar:clipboard-list-bold',
    actions: [
      { id: 'a1', label: 'View Task', type: 'primary', url: '/tasks/1' },
    ],
  }));
  
  // Approval required (high priority)
  notifications.push(createNotification({
    type: 'alert',
    priority: 'high',
    title: 'Approval Required: Budget Request',
    message: 'Sarah has submitted a budget request for Q2 Marketing. Please review.',
    userId: 'user-1',
    channels: ['in_app', 'email', 'push'],
    category: 'approvals',
    icon: 'solar:check-square-bold',
    actions: [
      { id: 'a1', label: 'Approve', type: 'primary', action: 'approve' },
      { id: 'a2', label: 'Reject', type: 'danger', action: 'reject' },
    ],
  }));
  
  // Deadline reminder (urgent)
  notifications.push(createNotification({
    type: 'reminder',
    priority: 'urgent',
    title: 'Deadline approaching: Project Milestone',
    message: 'The deadline for "Phase 1 Completion" is in 2 days.',
    userId: 'user-1',
    channels: ['in_app', 'email'],
    category: 'reminders',
    icon: 'solar:alarm-bold',
    expiresAt: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
  }));
  
  // Success notification
  notifications.push(createNotification({
    type: 'success',
    priority: 'low',
    title: 'Report generated successfully',
    message: 'Your monthly analytics report is ready for download.',
    userId: 'user-1',
    channels: ['in_app'],
    category: 'general',
    icon: 'solar:check-circle-bold',
    actions: [
      { id: 'a1', label: 'Download', type: 'primary', url: '/reports/download' },
    ],
  }));
  
  // Warning notification
  notifications.push(createNotification({
    type: 'warning',
    priority: 'high',
    title: 'Storage limit approaching',
    message: 'You have used 85% of your storage quota. Consider upgrading.',
    userId: 'user-1',
    channels: ['in_app'],
    category: 'system',
    icon: 'solar:danger-triangle-bold',
    actions: [
      { id: 'a1', label: 'Upgrade', type: 'primary', url: '/settings/billing' },
      { id: 'a2', label: 'Manage Storage', type: 'secondary', url: '/settings/storage' },
    ],
  }));
  
  // Error notification
  notifications.push(createNotification({
    type: 'error',
    priority: 'critical',
    title: 'Sync failed',
    message: 'Failed to sync data with external service. Retrying in 5 minutes.',
    userId: 'user-1',
    channels: ['in_app', 'email'],
    category: 'system',
    icon: 'solar:close-circle-bold',
  }));
  
  // System maintenance
  notifications.push(createNotification({
    type: 'system',
    priority: 'medium',
    title: 'Scheduled maintenance',
    message: 'System maintenance scheduled for Sunday, 2:00 AM - 4:00 AM UTC.',
    userId: 'user-1',
    channels: ['in_app'],
    category: 'system',
    icon: 'solar:settings-bold',
    scheduledAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
  }));
  
  return notifications;
}
