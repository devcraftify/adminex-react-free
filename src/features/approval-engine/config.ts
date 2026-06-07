// Approval Engine Configuration
// Phase 2 - Pre-built state machine templates and configuration

import type { StateMachineTemplate, State, Transition } from './types';
import { generateId } from './engine';

// ============================================================================
// Helper to create states with IDs
// ============================================================================

function createTemplateState(
  name: string,
  options: Partial<State['metadata']> = {}
): State {
  return {
    id: generateId(),
    name,
    metadata: {
      color: options.color || '#6366f1',
      icon: options.icon || 'solar:record-circle-bold',
      description: options.description || '',
      isInitial: options.isInitial || false,
      isFinal: options.isFinal || false,
      allowedRoles: options.allowedRoles,
      timeLimit: options.timeLimit,
      escalationState: options.escalationState,
    },
  };
}

function createTemplateTransition(
  name: string,
  fromState: string,
  toState: string,
  options: Partial<Transition> = {}
): Transition {
  return {
    id: generateId(),
    name,
    fromState,
    toState,
    conditions: options.conditions || [],
    actions: options.actions || [],
    requiresApproval: options.requiresApproval || false,
    approvalConfig: options.approvalConfig,
    metadata: {
      icon: options.metadata?.icon || 'solar:arrow-right-bold',
      color: options.metadata?.color || '#6366f1',
      description: options.metadata?.description || '',
      priority: options.metadata?.priority || 0,
    },
  };
}

// ============================================================================
// State Machine Templates
// ============================================================================

export const stateMachineTemplates: StateMachineTemplate[] = [
  // Document Approval Workflow
  (() => {
    const draft = createTemplateState('Draft', {
      color: '#94a3b8',
      icon: 'solar:document-bold',
      description: 'Document is being drafted',
      isInitial: true,
    });
    const pendingReview = createTemplateState('Pending Review', {
      color: '#f59e0b',
      icon: 'solar:clock-circle-bold',
      description: 'Awaiting reviewer approval',
      timeLimit: 1440, // 24 hours
    });
    const underReview = createTemplateState('Under Review', {
      color: '#3b82f6',
      icon: 'solar:eye-bold',
      description: 'Currently being reviewed',
      allowedRoles: ['reviewer', 'admin'],
    });
    const approved = createTemplateState('Approved', {
      color: '#10b981',
      icon: 'solar:check-circle-bold',
      description: 'Document approved',
      isFinal: true,
    });
    const rejected = createTemplateState('Rejected', {
      color: '#ef4444',
      icon: 'solar:close-circle-bold',
      description: 'Document rejected',
      isFinal: true,
    });
    const archived = createTemplateState('Archived', {
      color: '#6b7280',
      icon: 'solar:archive-bold',
      description: 'Document archived',
      isFinal: true,
    });

    return {
      id: 'template-document-approval',
      name: 'Document Approval',
      description: 'Standard document review and approval workflow with multiple stages',
      category: 'Business',
      icon: 'solar:document-text-bold',
      machine: {
        name: 'Document Approval',
        description: 'Review and approve documents with multi-stage approval process',
        version: '1.0.0',
        states: [draft, pendingReview, underReview, approved, rejected, archived],
        transitions: [
          createTemplateTransition('Submit for Review', draft.id, pendingReview.id, {
            metadata: { icon: 'solar:send-bold', color: '#3b82f6' },
            actions: [{ id: generateId(), type: 'notify', config: { to: 'reviewers' } }],
          }),
          createTemplateTransition('Start Review', pendingReview.id, underReview.id, {
            metadata: { icon: 'solar:eye-bold', color: '#8b5cf6' },
          }),
          createTemplateTransition('Approve', underReview.id, approved.id, {
            requiresApproval: true,
            approvalConfig: {
              type: 'single',
              approvers: [{ id: 'reviewer', type: 'role', value: 'Reviewer' }],
              timeoutMinutes: 2880,
            },
            metadata: { icon: 'solar:check-circle-bold', color: '#10b981' },
            actions: [{ id: generateId(), type: 'notify', config: { to: 'author' } }],
          }),
          createTemplateTransition('Reject', underReview.id, rejected.id, {
            metadata: { icon: 'solar:close-circle-bold', color: '#ef4444' },
            actions: [{ id: generateId(), type: 'notify', config: { to: 'author' } }],
          }),
          createTemplateTransition('Request Changes', underReview.id, draft.id, {
            metadata: { icon: 'solar:refresh-bold', color: '#f59e0b' },
          }),
          createTemplateTransition('Archive', approved.id, archived.id, {
            metadata: { icon: 'solar:archive-bold', color: '#6b7280' },
          }),
        ],
        initialState: draft.id,
      },
    };
  })(),

  // Purchase Order Approval
  (() => {
    const newOrder = createTemplateState('New', {
      color: '#3b82f6',
      icon: 'solar:cart-bold',
      description: 'New purchase order created',
      isInitial: true,
    });
    const managerApproval = createTemplateState('Manager Approval', {
      color: '#f59e0b',
      icon: 'solar:user-check-bold',
      description: 'Awaiting manager approval',
      timeLimit: 480,
    });
    const financeApproval = createTemplateState('Finance Approval', {
      color: '#8b5cf6',
      icon: 'solar:wallet-bold',
      description: 'Awaiting finance approval',
      timeLimit: 480,
    });
    const ceoApproval = createTemplateState('CEO Approval', {
      color: '#ec4899',
      icon: 'solar:crown-bold',
      description: 'Awaiting CEO approval for high-value orders',
      timeLimit: 1440,
    });
    const approved = createTemplateState('Approved', {
      color: '#10b981',
      icon: 'solar:check-circle-bold',
      description: 'Order approved',
    });
    const processing = createTemplateState('Processing', {
      color: '#06b6d4',
      icon: 'solar:box-bold',
      description: 'Order being processed',
    });
    const completed = createTemplateState('Completed', {
      color: '#10b981',
      icon: 'solar:check-read-bold',
      description: 'Order completed',
      isFinal: true,
    });
    const cancelled = createTemplateState('Cancelled', {
      color: '#ef4444',
      icon: 'solar:close-square-bold',
      description: 'Order cancelled',
      isFinal: true,
    });

    return {
      id: 'template-purchase-order',
      name: 'Purchase Order Approval',
      description: 'Multi-level approval workflow for purchase orders with amount-based routing',
      category: 'Finance',
      icon: 'solar:cart-large-bold',
      machine: {
        name: 'Purchase Order Approval',
        description: 'Approve purchase orders with manager, finance, and optional CEO approval',
        version: '1.0.0',
        states: [
          newOrder,
          managerApproval,
          financeApproval,
          ceoApproval,
          approved,
          processing,
          completed,
          cancelled,
        ],
        transitions: [
          createTemplateTransition('Submit', newOrder.id, managerApproval.id, {
            metadata: { icon: 'solar:send-bold', color: '#3b82f6' },
          }),
          createTemplateTransition('Manager Approve', managerApproval.id, financeApproval.id, {
            requiresApproval: true,
            approvalConfig: {
              type: 'single',
              approvers: [{ id: 'manager', type: 'role', value: 'Manager' }],
              timeoutMinutes: 480,
            },
            metadata: { icon: 'solar:check-bold', color: '#10b981' },
          }),
          createTemplateTransition('Finance Approve (Low)', financeApproval.id, approved.id, {
            requiresApproval: true,
            approvalConfig: {
              type: 'single',
              approvers: [{ id: 'finance', type: 'role', value: 'Finance' }],
            },
            conditions: [
              { id: generateId(), type: 'field_value', config: { field: 'amount', operator: 'less_than', value: 10000 } },
            ],
            metadata: { icon: 'solar:check-bold', color: '#10b981' },
          }),
          createTemplateTransition('Finance Approve (High)', financeApproval.id, ceoApproval.id, {
            requiresApproval: true,
            approvalConfig: {
              type: 'single',
              approvers: [{ id: 'finance', type: 'role', value: 'Finance' }],
            },
            conditions: [
              { id: generateId(), type: 'field_value', config: { field: 'amount', operator: 'greater_than', value: 10000 } },
            ],
            metadata: { icon: 'solar:arrow-up-bold', color: '#8b5cf6' },
          }),
          createTemplateTransition('CEO Approve', ceoApproval.id, approved.id, {
            requiresApproval: true,
            approvalConfig: {
              type: 'single',
              approvers: [{ id: 'ceo', type: 'role', value: 'CEO' }],
              timeoutMinutes: 1440,
            },
            metadata: { icon: 'solar:crown-bold', color: '#ec4899' },
          }),
          createTemplateTransition('Process', approved.id, processing.id, {
            metadata: { icon: 'solar:box-bold', color: '#06b6d4' },
          }),
          createTemplateTransition('Complete', processing.id, completed.id, {
            metadata: { icon: 'solar:check-read-bold', color: '#10b981' },
          }),
          createTemplateTransition('Cancel', newOrder.id, cancelled.id, {
            metadata: { icon: 'solar:close-bold', color: '#ef4444' },
          }),
          createTemplateTransition('Reject', managerApproval.id, cancelled.id, {
            metadata: { icon: 'solar:close-bold', color: '#ef4444' },
          }),
          createTemplateTransition('Reject', financeApproval.id, cancelled.id, {
            metadata: { icon: 'solar:close-bold', color: '#ef4444' },
          }),
        ],
        initialState: newOrder.id,
      },
    };
  })(),

  // Leave Request Workflow
  (() => {
    const draft = createTemplateState('Draft', {
      color: '#94a3b8',
      icon: 'solar:calendar-bold',
      description: 'Leave request being drafted',
      isInitial: true,
    });
    const submitted = createTemplateState('Submitted', {
      color: '#3b82f6',
      icon: 'solar:send-bold',
      description: 'Request submitted',
    });
    const managerReview = createTemplateState('Manager Review', {
      color: '#f59e0b',
      icon: 'solar:user-check-bold',
      description: 'Awaiting manager approval',
      timeLimit: 240,
    });
    const hrReview = createTemplateState('HR Review', {
      color: '#8b5cf6',
      icon: 'solar:users-group-rounded-bold',
      description: 'HR reviewing extended leave',
      timeLimit: 480,
    });
    const approved = createTemplateState('Approved', {
      color: '#10b981',
      icon: 'solar:check-circle-bold',
      description: 'Leave approved',
      isFinal: true,
    });
    const rejected = createTemplateState('Rejected', {
      color: '#ef4444',
      icon: 'solar:close-circle-bold',
      description: 'Leave rejected',
      isFinal: true,
    });
    const cancelled = createTemplateState('Cancelled', {
      color: '#6b7280',
      icon: 'solar:minus-circle-bold',
      description: 'Request cancelled by employee',
      isFinal: true,
    });

    return {
      id: 'template-leave-request',
      name: 'Leave Request',
      description: 'Employee leave request workflow with manager and optional HR approval',
      category: 'HR',
      icon: 'solar:calendar-mark-bold',
      machine: {
        name: 'Leave Request',
        description: 'Process employee leave requests with appropriate approvals',
        version: '1.0.0',
        states: [draft, submitted, managerReview, hrReview, approved, rejected, cancelled],
        transitions: [
          createTemplateTransition('Submit Request', draft.id, submitted.id, {
            metadata: { icon: 'solar:send-bold', color: '#3b82f6' },
          }),
          createTemplateTransition('Send to Manager', submitted.id, managerReview.id, {
            metadata: { icon: 'solar:user-bold', color: '#f59e0b' },
            actions: [{ id: generateId(), type: 'notify', config: { to: 'manager' } }],
          }),
          createTemplateTransition('Manager Approve (Short)', managerReview.id, approved.id, {
            requiresApproval: true,
            approvalConfig: {
              type: 'single',
              approvers: [{ id: 'manager', type: 'role', value: 'Manager' }],
            },
            conditions: [
              { id: generateId(), type: 'field_value', config: { field: 'days', operator: 'less_than', value: 5 } },
            ],
            metadata: { icon: 'solar:check-bold', color: '#10b981' },
          }),
          createTemplateTransition('Manager Approve (Long)', managerReview.id, hrReview.id, {
            requiresApproval: true,
            approvalConfig: {
              type: 'single',
              approvers: [{ id: 'manager', type: 'role', value: 'Manager' }],
            },
            conditions: [
              { id: generateId(), type: 'field_value', config: { field: 'days', operator: 'greater_than', value: 5 } },
            ],
            metadata: { icon: 'solar:arrow-right-bold', color: '#8b5cf6' },
          }),
          createTemplateTransition('HR Approve', hrReview.id, approved.id, {
            requiresApproval: true,
            approvalConfig: {
              type: 'single',
              approvers: [{ id: 'hr', type: 'role', value: 'HR' }],
            },
            metadata: { icon: 'solar:check-bold', color: '#10b981' },
          }),
          createTemplateTransition('Reject', managerReview.id, rejected.id, {
            metadata: { icon: 'solar:close-bold', color: '#ef4444' },
          }),
          createTemplateTransition('HR Reject', hrReview.id, rejected.id, {
            metadata: { icon: 'solar:close-bold', color: '#ef4444' },
          }),
          createTemplateTransition('Cancel', draft.id, cancelled.id, {
            metadata: { icon: 'solar:minus-bold', color: '#6b7280' },
          }),
          createTemplateTransition('Cancel', submitted.id, cancelled.id, {
            metadata: { icon: 'solar:minus-bold', color: '#6b7280' },
          }),
        ],
        initialState: draft.id,
      },
    };
  })(),

  // Bug/Issue Tracking
  (() => {
    const newIssue = createTemplateState('New', {
      color: '#3b82f6',
      icon: 'solar:bug-bold',
      description: 'New issue reported',
      isInitial: true,
    });
    const triaged = createTemplateState('Triaged', {
      color: '#8b5cf6',
      icon: 'solar:sort-bold',
      description: 'Issue triaged and prioritized',
    });
    const inProgress = createTemplateState('In Progress', {
      color: '#f59e0b',
      icon: 'solar:code-bold',
      description: 'Issue being worked on',
    });
    const codeReview = createTemplateState('Code Review', {
      color: '#06b6d4',
      icon: 'solar:eye-bold',
      description: 'Fix awaiting code review',
    });
    const testing = createTemplateState('Testing', {
      color: '#ec4899',
      icon: 'solar:test-tube-bold',
      description: 'Fix being tested',
    });
    const resolved = createTemplateState('Resolved', {
      color: '#10b981',
      icon: 'solar:check-circle-bold',
      description: 'Issue resolved',
      isFinal: true,
    });
    const closed = createTemplateState('Closed', {
      color: '#6b7280',
      icon: 'solar:close-square-bold',
      description: 'Issue closed',
      isFinal: true,
    });
    const reopened = createTemplateState('Reopened', {
      color: '#ef4444',
      icon: 'solar:refresh-bold',
      description: 'Issue reopened',
    });

    return {
      id: 'template-bug-tracking',
      name: 'Bug/Issue Tracking',
      description: 'Track bugs and issues through development lifecycle',
      category: 'Development',
      icon: 'solar:bug-bold',
      machine: {
        name: 'Bug Tracking',
        description: 'Track bugs from creation to resolution',
        version: '1.0.0',
        states: [newIssue, triaged, inProgress, codeReview, testing, resolved, closed, reopened],
        transitions: [
          createTemplateTransition('Triage', newIssue.id, triaged.id, {
            metadata: { icon: 'solar:sort-bold', color: '#8b5cf6' },
          }),
          createTemplateTransition('Start Work', triaged.id, inProgress.id, {
            metadata: { icon: 'solar:play-bold', color: '#f59e0b' },
          }),
          createTemplateTransition('Submit for Review', inProgress.id, codeReview.id, {
            metadata: { icon: 'solar:code-scan-bold', color: '#06b6d4' },
          }),
          createTemplateTransition('Approve Code', codeReview.id, testing.id, {
            requiresApproval: true,
            approvalConfig: {
              type: 'single',
              approvers: [{ id: 'reviewer', type: 'role', value: 'Code Reviewer' }],
            },
            metadata: { icon: 'solar:check-bold', color: '#10b981' },
          }),
          createTemplateTransition('Request Changes', codeReview.id, inProgress.id, {
            metadata: { icon: 'solar:refresh-bold', color: '#f59e0b' },
          }),
          createTemplateTransition('Pass Testing', testing.id, resolved.id, {
            metadata: { icon: 'solar:check-circle-bold', color: '#10b981' },
          }),
          createTemplateTransition('Fail Testing', testing.id, inProgress.id, {
            metadata: { icon: 'solar:close-bold', color: '#ef4444' },
          }),
          createTemplateTransition('Close', resolved.id, closed.id, {
            metadata: { icon: 'solar:close-square-bold', color: '#6b7280' },
          }),
          createTemplateTransition('Reopen', closed.id, reopened.id, {
            metadata: { icon: 'solar:refresh-bold', color: '#ef4444' },
          }),
          createTemplateTransition('Start Fix', reopened.id, inProgress.id, {
            metadata: { icon: 'solar:play-bold', color: '#f59e0b' },
          }),
          createTemplateTransition('Close as Won\'t Fix', triaged.id, closed.id, {
            metadata: { icon: 'solar:close-bold', color: '#6b7280' },
          }),
        ],
        initialState: newIssue.id,
      },
    };
  })(),

  // Content Publishing
  (() => {
    const idea = createTemplateState('Idea', {
      color: '#f59e0b',
      icon: 'solar:lightbulb-bold',
      description: 'Content idea',
      isInitial: true,
    });
    const drafting = createTemplateState('Drafting', {
      color: '#3b82f6',
      icon: 'solar:pen-bold',
      description: 'Content being written',
    });
    const editing = createTemplateState('Editing', {
      color: '#8b5cf6',
      icon: 'solar:document-text-bold',
      description: 'Content being edited',
    });
    const review = createTemplateState('Review', {
      color: '#06b6d4',
      icon: 'solar:eye-bold',
      description: 'Final review',
      timeLimit: 240,
    });
    const scheduled = createTemplateState('Scheduled', {
      color: '#ec4899',
      icon: 'solar:calendar-bold',
      description: 'Scheduled for publishing',
    });
    const published = createTemplateState('Published', {
      color: '#10b981',
      icon: 'solar:check-read-bold',
      description: 'Content published',
      isFinal: true,
    });
    const archived = createTemplateState('Archived', {
      color: '#6b7280',
      icon: 'solar:archive-bold',
      description: 'Content archived',
      isFinal: true,
    });

    return {
      id: 'template-content-publishing',
      name: 'Content Publishing',
      description: 'Content creation and publishing workflow',
      category: 'Marketing',
      icon: 'solar:document-add-bold',
      machine: {
        name: 'Content Publishing',
        description: 'Manage content from idea to publication',
        version: '1.0.0',
        states: [idea, drafting, editing, review, scheduled, published, archived],
        transitions: [
          createTemplateTransition('Start Draft', idea.id, drafting.id, {
            metadata: { icon: 'solar:pen-bold', color: '#3b82f6' },
          }),
          createTemplateTransition('Submit for Edit', drafting.id, editing.id, {
            metadata: { icon: 'solar:send-bold', color: '#8b5cf6' },
          }),
          createTemplateTransition('Send to Review', editing.id, review.id, {
            metadata: { icon: 'solar:eye-bold', color: '#06b6d4' },
          }),
          createTemplateTransition('Request Revisions', editing.id, drafting.id, {
            metadata: { icon: 'solar:refresh-bold', color: '#f59e0b' },
          }),
          createTemplateTransition('Approve', review.id, scheduled.id, {
            requiresApproval: true,
            approvalConfig: {
              type: 'single',
              approvers: [{ id: 'editor', type: 'role', value: 'Editor' }],
            },
            metadata: { icon: 'solar:check-bold', color: '#10b981' },
          }),
          createTemplateTransition('Request Changes', review.id, editing.id, {
            metadata: { icon: 'solar:refresh-bold', color: '#f59e0b' },
          }),
          createTemplateTransition('Publish', scheduled.id, published.id, {
            metadata: { icon: 'solar:upload-bold', color: '#10b981' },
          }),
          createTemplateTransition('Archive', published.id, archived.id, {
            metadata: { icon: 'solar:archive-bold', color: '#6b7280' },
          }),
          createTemplateTransition('Cancel', idea.id, archived.id, {
            metadata: { icon: 'solar:close-bold', color: '#6b7280' },
          }),
        ],
        initialState: idea.id,
      },
    };
  })(),

  // Employee Onboarding
  (() => {
    const hired = createTemplateState('Hired', {
      color: '#10b981',
      icon: 'solar:user-plus-bold',
      description: 'New employee hired',
      isInitial: true,
    });
    const paperwork = createTemplateState('Paperwork', {
      color: '#3b82f6',
      icon: 'solar:document-bold',
      description: 'HR paperwork in progress',
      timeLimit: 2880,
    });
    const itSetup = createTemplateState('IT Setup', {
      color: '#8b5cf6',
      icon: 'solar:laptop-bold',
      description: 'IT setting up accounts',
      timeLimit: 1440,
    });
    const training = createTemplateState('Training', {
      color: '#f59e0b',
      icon: 'solar:book-bold',
      description: 'Employee in training',
    });
    const probation = createTemplateState('Probation', {
      color: '#06b6d4',
      icon: 'solar:clock-circle-bold',
      description: 'Probation period',
    });
    const active = createTemplateState('Active', {
      color: '#10b981',
      icon: 'solar:user-check-bold',
      description: 'Fully onboarded',
      isFinal: true,
    });
    const terminated = createTemplateState('Terminated', {
      color: '#ef4444',
      icon: 'solar:user-minus-bold',
      description: 'Employment terminated',
      isFinal: true,
    });

    return {
      id: 'template-employee-onboarding',
      name: 'Employee Onboarding',
      description: 'New employee onboarding process',
      category: 'HR',
      icon: 'solar:user-plus-rounded-bold',
      machine: {
        name: 'Employee Onboarding',
        description: 'Guide new employees through the onboarding process',
        version: '1.0.0',
        states: [hired, paperwork, itSetup, training, probation, active, terminated],
        transitions: [
          createTemplateTransition('Start Paperwork', hired.id, paperwork.id, {
            metadata: { icon: 'solar:document-bold', color: '#3b82f6' },
            actions: [{ id: generateId(), type: 'notify', config: { to: 'hr' } }],
          }),
          createTemplateTransition('Complete Paperwork', paperwork.id, itSetup.id, {
            requiresApproval: true,
            approvalConfig: {
              type: 'single',
              approvers: [{ id: 'hr', type: 'role', value: 'HR' }],
            },
            metadata: { icon: 'solar:check-bold', color: '#10b981' },
          }),
          createTemplateTransition('Setup Complete', itSetup.id, training.id, {
            metadata: { icon: 'solar:laptop-bold', color: '#8b5cf6' },
          }),
          createTemplateTransition('Complete Training', training.id, probation.id, {
            metadata: { icon: 'solar:book-bold', color: '#f59e0b' },
          }),
          createTemplateTransition('Pass Probation', probation.id, active.id, {
            requiresApproval: true,
            approvalConfig: {
              type: 'parallel',
              approvers: [
                { id: 'manager', type: 'role', value: 'Manager' },
                { id: 'hr', type: 'role', value: 'HR' },
              ],
            },
            metadata: { icon: 'solar:check-circle-bold', color: '#10b981' },
          }),
          createTemplateTransition('Fail Probation', probation.id, terminated.id, {
            metadata: { icon: 'solar:close-bold', color: '#ef4444' },
          }),
          createTemplateTransition('Terminate', paperwork.id, terminated.id, {
            metadata: { icon: 'solar:close-bold', color: '#ef4444' },
          }),
        ],
        initialState: hired.id,
      },
    };
  })(),
];

// ============================================================================
// Approval Type Options
// ============================================================================

export const approvalTypes = [
  {
    id: 'single',
    name: 'Single Approval',
    description: 'Any one approver can approve or reject',
    icon: 'solar:user-check-bold',
  },
  {
    id: 'sequential',
    name: 'Sequential Approval',
    description: 'Approvers must approve in order',
    icon: 'solar:sort-vertical-bold',
  },
  {
    id: 'parallel',
    name: 'Parallel Approval',
    description: 'All approvers must approve (any order)',
    icon: 'solar:users-group-rounded-bold',
  },
  {
    id: 'quorum',
    name: 'Quorum Approval',
    description: 'Minimum number of approvals required',
    icon: 'solar:chart-bold',
  },
];

// ============================================================================
// State Colors
// ============================================================================

export const stateColors = [
  { value: '#10b981', name: 'Green', category: 'Success' },
  { value: '#3b82f6', name: 'Blue', category: 'Primary' },
  { value: '#8b5cf6', name: 'Purple', category: 'Secondary' },
  { value: '#f59e0b', name: 'Amber', category: 'Warning' },
  { value: '#ef4444', name: 'Red', category: 'Danger' },
  { value: '#06b6d4', name: 'Cyan', category: 'Info' },
  { value: '#ec4899', name: 'Pink', category: 'Accent' },
  { value: '#84cc16', name: 'Lime', category: 'Success' },
  { value: '#6b7280', name: 'Gray', category: 'Neutral' },
  { value: '#94a3b8', name: 'Slate', category: 'Neutral' },
];

// ============================================================================
// Action Types
// ============================================================================

export const actionTypes = [
  {
    id: 'notify',
    name: 'Send Notification',
    description: 'Send a notification to specified users or roles',
    icon: 'solar:bell-bold',
    configFields: ['to', 'message', 'channel'],
  },
  {
    id: 'email',
    name: 'Send Email',
    description: 'Send an email to specified recipients',
    icon: 'solar:letter-bold',
    configFields: ['to', 'subject', 'body', 'template'],
  },
  {
    id: 'assign',
    name: 'Assign Task',
    description: 'Assign the item to a user or role',
    icon: 'solar:user-plus-bold',
    configFields: ['assignee', 'assigneeType'],
  },
  {
    id: 'update_field',
    name: 'Update Field',
    description: 'Update a field value on the item',
    icon: 'solar:pen-bold',
    configFields: ['field', 'value'],
  },
  {
    id: 'webhook',
    name: 'Call Webhook',
    description: 'Send data to an external webhook',
    icon: 'solar:link-bold',
    configFields: ['url', 'method', 'headers', 'body'],
  },
  {
    id: 'log',
    name: 'Log Event',
    description: 'Log an event for auditing',
    icon: 'solar:clipboard-text-bold',
    configFields: ['message', 'level'],
  },
];

// ============================================================================
// Condition Types
// ============================================================================

export const conditionTypes = [
  {
    id: 'field_value',
    name: 'Field Value',
    description: 'Check a field value condition',
    icon: 'solar:text-field-bold',
    operators: ['equals', 'not_equals', 'greater_than', 'less_than', 'contains', 'is_empty', 'is_not_empty'],
  },
  {
    id: 'approval_count',
    name: 'Approval Count',
    description: 'Check number of approvals received',
    icon: 'solar:check-circle-bold',
    operators: ['greater_than', 'equals'],
  },
  {
    id: 'role_check',
    name: 'Role Check',
    description: 'Check if user has a specific role',
    icon: 'solar:shield-user-bold',
    operators: ['has_role', 'does_not_have_role'],
  },
  {
    id: 'time_elapsed',
    name: 'Time Elapsed',
    description: 'Check time since last state change',
    icon: 'solar:clock-circle-bold',
    operators: ['greater_than', 'less_than'],
  },
];
