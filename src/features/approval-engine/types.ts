// Approval & State Machine Engine Types
// Phase 2 - Advanced state management with approval workflows

// State Machine Types
export type StateId = string;
export type TransitionId = string;
export type ActionId = string;

export interface StateMetadata {
  color: string;
  icon: string;
  description: string;
  isInitial?: boolean;
  isFinal?: boolean;
  allowedRoles?: string[];
  timeLimit?: number; // in minutes
  escalationState?: StateId;
}

export interface State {
  id: StateId;
  name: string;
  metadata: StateMetadata;
}

export interface TransitionCondition {
  id: string;
  type: 'approval_count' | 'role_check' | 'field_value' | 'time_elapsed' | 'custom';
  config: Record<string, unknown>;
}

export interface TransitionAction {
  id: ActionId;
  type: 'notify' | 'assign' | 'update_field' | 'webhook' | 'email' | 'log' | 'custom';
  config: Record<string, unknown>;
}

export interface Transition {
  id: TransitionId;
  name: string;
  fromState: StateId;
  toState: StateId;
  conditions: TransitionCondition[];
  actions: TransitionAction[];
  requiresApproval: boolean;
  approvalConfig?: ApprovalConfig;
  metadata: {
    icon?: string;
    color?: string;
    description?: string;
    priority?: number;
  };
}

export interface ApprovalConfig {
  type: 'single' | 'sequential' | 'parallel' | 'quorum';
  approvers: Approver[];
  minApprovals?: number; // For quorum type
  timeoutMinutes?: number;
  escalationPath?: StateId[];
  reminderIntervalMinutes?: number;
}

export interface Approver {
  id: string;
  type: 'user' | 'role' | 'department' | 'dynamic';
  value: string;
  order?: number; // For sequential approval
}

export interface ApprovalRequest {
  id: string;
  transitionId: TransitionId;
  instanceId: string;
  requestedBy: string;
  requestedAt: Date;
  status: 'pending' | 'approved' | 'rejected' | 'escalated' | 'expired';
  approvers: ApproverResponse[];
  comments: ApprovalComment[];
  dueDate?: Date;
  metadata: Record<string, unknown>;
}

export interface ApproverResponse {
  approverId: string;
  approverName: string;
  status: 'pending' | 'approved' | 'rejected';
  respondedAt?: Date;
  comment?: string;
}

export interface ApprovalComment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
  attachments?: string[];
}

// State Machine Definition
export interface StateMachine {
  id: string;
  name: string;
  description: string;
  version: string;
  states: State[];
  transitions: Transition[];
  initialState: StateId;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    tags?: string[];
    category?: string;
  };
}

// Instance tracking
export interface StateMachineInstance {
  id: string;
  machineId: string;
  machineName: string;
  currentState: StateId;
  previousStates: StateHistoryEntry[];
  data: Record<string, unknown>;
  pendingApprovals: ApprovalRequest[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  status: 'active' | 'completed' | 'suspended' | 'cancelled';
  metadata: Record<string, unknown>;
}

export interface StateHistoryEntry {
  id: string;
  fromState: StateId;
  toState: StateId;
  transitionId: TransitionId;
  transitionName: string;
  timestamp: Date;
  triggeredBy: string;
  comments?: string;
  metadata?: Record<string, unknown>;
}

// Validation and Error types
export interface ValidationError {
  type: 'error' | 'warning';
  code: string;
  message: string;
  path?: string;
  nodeId?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

// Transition availability
export interface AvailableTransition {
  transition: Transition;
  canExecute: boolean;
  blockedReason?: string;
  requiresApproval: boolean;
  estimatedTime?: number;
}

// Simulation types
export interface SimulationStep {
  id: string;
  instanceId: string;
  fromState: State;
  toState: State;
  transition: Transition;
  timestamp: Date;
  status: 'success' | 'pending_approval' | 'blocked' | 'error';
  message: string;
  duration: number;
}

export interface SimulationResult {
  id: string;
  machineId: string;
  startState: StateId;
  endState: StateId;
  steps: SimulationStep[];
  totalDuration: number;
  success: boolean;
  completedAt: Date;
  errors: string[];
}

// Template types
export interface StateMachineTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  machine: Omit<StateMachine, 'id' | 'metadata'>;
  previewImage?: string;
}

// Event types for real-time updates
export type StateMachineEvent = 
  | { type: 'STATE_CHANGED'; payload: { instanceId: string; fromState: StateId; toState: StateId } }
  | { type: 'APPROVAL_REQUESTED'; payload: { instanceId: string; approvalId: string } }
  | { type: 'APPROVAL_RESPONDED'; payload: { instanceId: string; approvalId: string; response: 'approved' | 'rejected' } }
  | { type: 'INSTANCE_COMPLETED'; payload: { instanceId: string; finalState: StateId } }
  | { type: 'INSTANCE_SUSPENDED'; payload: { instanceId: string; reason: string } }
  | { type: 'ESCALATION_TRIGGERED'; payload: { instanceId: string; fromState: StateId; toState: StateId } };

// Dashboard analytics types
export interface StateMachineAnalytics {
  machineId: string;
  totalInstances: number;
  activeInstances: number;
  completedInstances: number;
  averageCompletionTime: number;
  stateDistribution: Record<StateId, number>;
  transitionCounts: Record<TransitionId, number>;
  approvalMetrics: {
    totalRequests: number;
    approved: number;
    rejected: number;
    pending: number;
    averageResponseTime: number;
  };
  bottleneckStates: Array<{
    stateId: StateId;
    averageTime: number;
    instanceCount: number;
  }>;
}
