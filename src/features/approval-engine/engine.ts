// Approval & State Machine Engine
// Phase 2 - Core engine for state machine operations and approval workflows

import type {
  StateMachine,
  StateMachineInstance,
  State,
  Transition,
  StateId,
  TransitionId,
  ApprovalRequest,
  ApproverResponse,
  ApprovalComment,
  ValidationResult,
  ValidationError,
  AvailableTransition,
  SimulationResult,
  SimulationStep,
  StateHistoryEntry,
  StateMachineAnalytics,
} from './types';

// ============================================================================
// Utility Functions
// ============================================================================

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function generateShortId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// ============================================================================
// State Machine Creation
// ============================================================================

export function createEmptyStateMachine(name: string = 'New State Machine'): StateMachine {
  const initialState: State = {
    id: generateId(),
    name: 'Initial',
    metadata: {
      color: '#10b981',
      icon: 'solar:play-circle-bold',
      description: 'Starting state',
      isInitial: true,
      isFinal: false,
    },
  };

  return {
    id: generateId(),
    name,
    description: '',
    version: '1.0.0',
    states: [initialState],
    transitions: [],
    initialState: initialState.id,
    metadata: {
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'system',
      tags: [],
      category: 'custom',
    },
  };
}

export function createState(
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

export function createTransition(
  name: string,
  fromState: StateId,
  toState: StateId,
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
// Instance Management
// ============================================================================

export function createInstance(
  machine: StateMachine,
  data: Record<string, unknown> = {}
): StateMachineInstance {
  return {
    id: generateId(),
    machineId: machine.id,
    machineName: machine.name,
    currentState: machine.initialState,
    previousStates: [],
    data,
    pendingApprovals: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'active',
    metadata: {},
  };
}

export function getInstanceState(
  instance: StateMachineInstance,
  machine: StateMachine
): State | undefined {
  return machine.states.find(s => s.id === instance.currentState);
}

// ============================================================================
// Validation
// ============================================================================

export function validateStateMachine(machine: StateMachine): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Check for empty name
  if (!machine.name.trim()) {
    errors.push({
      type: 'error',
      code: 'EMPTY_NAME',
      message: 'State machine name is required',
    });
  }

  // Check for at least one state
  if (machine.states.length === 0) {
    errors.push({
      type: 'error',
      code: 'NO_STATES',
      message: 'State machine must have at least one state',
    });
  }

  // Check initial state exists
  const initialStateExists = machine.states.some(s => s.id === machine.initialState);
  if (!initialStateExists) {
    errors.push({
      type: 'error',
      code: 'INVALID_INITIAL_STATE',
      message: 'Initial state does not exist in the state machine',
    });
  }

  // Check for at least one initial state marked
  const hasInitialState = machine.states.some(s => s.metadata.isInitial);
  if (!hasInitialState && machine.states.length > 0) {
    warnings.push({
      type: 'warning',
      code: 'NO_INITIAL_STATE_MARKED',
      message: 'No state is marked as initial',
    });
  }

  // Check for at least one final state
  const hasFinalState = machine.states.some(s => s.metadata.isFinal);
  if (!hasFinalState && machine.states.length > 0) {
    warnings.push({
      type: 'warning',
      code: 'NO_FINAL_STATE',
      message: 'No state is marked as final - the workflow may never complete',
    });
  }

  // Check for orphan states (no incoming or outgoing transitions)
  const statesWithIncoming = new Set(machine.transitions.map(t => t.toState));
  const statesWithOutgoing = new Set(machine.transitions.map(t => t.fromState));

  machine.states.forEach(state => {
    if (!state.metadata.isInitial && !statesWithIncoming.has(state.id)) {
      warnings.push({
        type: 'warning',
        code: 'ORPHAN_STATE',
        message: `State "${state.name}" has no incoming transitions`,
        nodeId: state.id,
      });
    }
    if (!state.metadata.isFinal && !statesWithOutgoing.has(state.id)) {
      warnings.push({
        type: 'warning',
        code: 'DEAD_END_STATE',
        message: `State "${state.name}" has no outgoing transitions`,
        nodeId: state.id,
      });
    }
  });

  // Check for duplicate state names
  const stateNames = new Set<string>();
  machine.states.forEach(state => {
    if (stateNames.has(state.name.toLowerCase())) {
      warnings.push({
        type: 'warning',
        code: 'DUPLICATE_STATE_NAME',
        message: `Duplicate state name: "${state.name}"`,
        nodeId: state.id,
      });
    }
    stateNames.add(state.name.toLowerCase());
  });

  // Check transition validity
  machine.transitions.forEach(transition => {
    const fromExists = machine.states.some(s => s.id === transition.fromState);
    const toExists = machine.states.some(s => s.id === transition.toState);

    if (!fromExists) {
      errors.push({
        type: 'error',
        code: 'INVALID_TRANSITION_FROM',
        message: `Transition "${transition.name}" has invalid source state`,
        nodeId: transition.id,
      });
    }

    if (!toExists) {
      errors.push({
        type: 'error',
        code: 'INVALID_TRANSITION_TO',
        message: `Transition "${transition.name}" has invalid target state`,
        nodeId: transition.id,
      });
    }

    // Check approval config if required
    if (transition.requiresApproval && !transition.approvalConfig) {
      errors.push({
        type: 'error',
        code: 'MISSING_APPROVAL_CONFIG',
        message: `Transition "${transition.name}" requires approval but has no approval config`,
        nodeId: transition.id,
      });
    }

    if (transition.requiresApproval && transition.approvalConfig) {
      if (transition.approvalConfig.approvers.length === 0) {
        errors.push({
          type: 'error',
          code: 'NO_APPROVERS',
          message: `Transition "${transition.name}" has no approvers configured`,
          nodeId: transition.id,
        });
      }

      if (transition.approvalConfig.type === 'quorum' && !transition.approvalConfig.minApprovals) {
        errors.push({
          type: 'error',
          code: 'INVALID_QUORUM',
          message: `Quorum approval for "${transition.name}" requires minimum approvals count`,
          nodeId: transition.id,
        });
      }
    }
  });

  // Check for unreachable final states
  const reachableStates = findReachableStates(machine, machine.initialState);
  const finalStates = machine.states.filter(s => s.metadata.isFinal);
  finalStates.forEach(finalState => {
    if (!reachableStates.has(finalState.id)) {
      warnings.push({
        type: 'warning',
        code: 'UNREACHABLE_FINAL_STATE',
        message: `Final state "${finalState.name}" is not reachable from initial state`,
        nodeId: finalState.id,
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

function findReachableStates(machine: StateMachine, startState: StateId): Set<StateId> {
  const reachable = new Set<StateId>();
  const queue: StateId[] = [startState];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (reachable.has(current)) continue;
    reachable.add(current);

    const outgoing = machine.transitions.filter(t => t.fromState === current);
    outgoing.forEach(t => {
      if (!reachable.has(t.toState)) {
        queue.push(t.toState);
      }
    });
  }

  return reachable;
}

// ============================================================================
// Transition Operations
// ============================================================================

export function getAvailableTransitions(
  machine: StateMachine,
  instance: StateMachineInstance,
  userRoles: string[] = []
): AvailableTransition[] {
  const currentState = machine.states.find(s => s.id === instance.currentState);
  if (!currentState) return [];

  const transitions = machine.transitions.filter(t => t.fromState === instance.currentState);

  return transitions.map(transition => {
    const targetState = machine.states.find(s => s.id === transition.toState);
    
    // Check role permissions
    const roleAllowed = !targetState?.metadata.allowedRoles || 
      targetState.metadata.allowedRoles.length === 0 ||
      targetState.metadata.allowedRoles.some(role => userRoles.includes(role));

    // Check pending approvals
    const hasPendingApproval = instance.pendingApprovals.some(
      a => a.transitionId === transition.id && a.status === 'pending'
    );

    let canExecute = true;
    let blockedReason: string | undefined;

    if (!roleAllowed) {
      canExecute = false;
      blockedReason = 'Insufficient permissions';
    } else if (hasPendingApproval) {
      canExecute = false;
      blockedReason = 'Awaiting approval';
    } else if (instance.status !== 'active') {
      canExecute = false;
      blockedReason = `Instance is ${instance.status}`;
    }

    // Evaluate conditions
    const conditionsResult = evaluateConditions(transition, instance);
    if (!conditionsResult.passed) {
      canExecute = false;
      blockedReason = blockedReason || conditionsResult.reason;
    }

    return {
      transition,
      canExecute,
      blockedReason,
      requiresApproval: transition.requiresApproval,
      estimatedTime: targetState?.metadata.timeLimit,
    };
  });
}

function evaluateConditions(
  transition: Transition,
  instance: StateMachineInstance
): { passed: boolean; reason?: string } {
  for (const condition of transition.conditions) {
    switch (condition.type) {
      case 'field_value': {
        const { field, operator, value } = condition.config as {
          field: string;
          operator: string;
          value: unknown;
        };
        const fieldValue = instance.data[field];
        
        let passed = false;
        switch (operator) {
          case 'equals':
            passed = fieldValue === value;
            break;
          case 'not_equals':
            passed = fieldValue !== value;
            break;
          case 'greater_than':
            passed = (fieldValue as number) > (value as number);
            break;
          case 'less_than':
            passed = (fieldValue as number) < (value as number);
            break;
          case 'contains':
            passed = String(fieldValue).includes(String(value));
            break;
          case 'is_empty':
            passed = !fieldValue || fieldValue === '';
            break;
          case 'is_not_empty':
            passed = !!fieldValue && fieldValue !== '';
            break;
        }
        
        if (!passed) {
          return { passed: false, reason: `Condition not met: ${field} ${operator} ${value}` };
        }
        break;
      }
      
      case 'approval_count': {
        const { minApprovals } = condition.config as { minApprovals: number };
        const approvedCount = instance.pendingApprovals
          .filter(a => a.transitionId === transition.id)
          .flatMap(a => a.approvers)
          .filter(a => a.status === 'approved')
          .length;
        
        if (approvedCount < minApprovals) {
          return { passed: false, reason: `Requires ${minApprovals} approvals, has ${approvedCount}` };
        }
        break;
      }
      
      case 'time_elapsed': {
        const { minutes } = condition.config as { minutes: number };
        const elapsed = (Date.now() - instance.updatedAt.getTime()) / 1000 / 60;
        
        if (elapsed < minutes) {
          return { passed: false, reason: `Must wait ${minutes - Math.floor(elapsed)} more minutes` };
        }
        break;
      }
    }
  }
  
  return { passed: true };
}

export function executeTransition(
  machine: StateMachine,
  instance: StateMachineInstance,
  transitionId: TransitionId,
  userId: string,
  comment?: string
): { success: boolean; instance: StateMachineInstance; error?: string } {
  const transition = machine.transitions.find(t => t.id === transitionId);
  if (!transition) {
    return { success: false, instance, error: 'Transition not found' };
  }

  if (transition.fromState !== instance.currentState) {
    return { success: false, instance, error: 'Invalid transition for current state' };
  }

  // If requires approval, create approval request instead
  if (transition.requiresApproval && transition.approvalConfig) {
    const approvalRequest = createApprovalRequest(transition, instance.id, userId);
    return {
      success: true,
      instance: {
        ...instance,
        pendingApprovals: [...instance.pendingApprovals, approvalRequest],
        updatedAt: new Date(),
      },
    };
  }

  // Execute the transition
  const historyEntry: StateHistoryEntry = {
    id: generateId(),
    fromState: instance.currentState,
    toState: transition.toState,
    transitionId: transition.id,
    transitionName: transition.name,
    timestamp: new Date(),
    triggeredBy: userId,
    comments: comment,
  };

  const targetState = machine.states.find(s => s.id === transition.toState);
  const newStatus = targetState?.metadata.isFinal ? 'completed' : instance.status;

  return {
    success: true,
    instance: {
      ...instance,
      currentState: transition.toState,
      previousStates: [...instance.previousStates, historyEntry],
      updatedAt: new Date(),
      completedAt: newStatus === 'completed' ? new Date() : undefined,
      status: newStatus,
    },
  };
}

// ============================================================================
// Approval Management
// ============================================================================

function createApprovalRequest(
  transition: Transition,
  instanceId: string,
  requestedBy: string
): ApprovalRequest {
  const config = transition.approvalConfig!;
  
  return {
    id: generateId(),
    transitionId: transition.id,
    instanceId,
    requestedBy,
    requestedAt: new Date(),
    status: 'pending',
    approvers: config.approvers.map(a => ({
      approverId: a.id,
      approverName: a.value,
      status: 'pending' as const,
    })),
    comments: [],
    dueDate: config.timeoutMinutes
      ? new Date(Date.now() + config.timeoutMinutes * 60 * 1000)
      : undefined,
    metadata: {},
  };
}

export function respondToApproval(
  instance: StateMachineInstance,
  machine: StateMachine,
  approvalId: string,
  approverId: string,
  response: 'approved' | 'rejected',
  comment?: string
): { success: boolean; instance: StateMachineInstance; shouldTransition: boolean } {
  const approvalIndex = instance.pendingApprovals.findIndex(a => a.id === approvalId);
  if (approvalIndex === -1) {
    return { success: false, instance, shouldTransition: false };
  }

  const approval = instance.pendingApprovals[approvalIndex];
  const transition = machine.transitions.find(t => t.id === approval.transitionId);
  if (!transition) {
    return { success: false, instance, shouldTransition: false };
  }

  // Update approver response
  const updatedApprovers: ApproverResponse[] = approval.approvers.map(a =>
    a.approverId === approverId
      ? { ...a, status: response, respondedAt: new Date(), comment }
      : a
  );

  // Add comment if provided
  const updatedComments: ApprovalComment[] = comment
    ? [
        ...approval.comments,
        {
          id: generateId(),
          authorId: approverId,
          authorName: approverId,
          content: comment,
          createdAt: new Date(),
        },
      ]
    : approval.comments;

  // Determine approval status based on config
  const config = transition.approvalConfig!;
  let newStatus: ApprovalRequest['status'] = 'pending';
  let shouldTransition = false;

  const approvedCount = updatedApprovers.filter(a => a.status === 'approved').length;
  const rejectedCount = updatedApprovers.filter(a => a.status === 'rejected').length;
  const totalApprovers = updatedApprovers.length;

  switch (config.type) {
    case 'single':
      if (response === 'approved') {
        newStatus = 'approved';
        shouldTransition = true;
      } else if (response === 'rejected') {
        newStatus = 'rejected';
      }
      break;

    case 'sequential':
      // All must approve in order
      if (rejectedCount > 0) {
        newStatus = 'rejected';
      } else if (approvedCount === totalApprovers) {
        newStatus = 'approved';
        shouldTransition = true;
      }
      break;

    case 'parallel':
      // All must approve (any order)
      if (rejectedCount > 0) {
        newStatus = 'rejected';
      } else if (approvedCount === totalApprovers) {
        newStatus = 'approved';
        shouldTransition = true;
      }
      break;

    case 'quorum':
      const minRequired = config.minApprovals || Math.ceil(totalApprovers / 2);
      if (approvedCount >= minRequired) {
        newStatus = 'approved';
        shouldTransition = true;
      } else if (totalApprovers - rejectedCount < minRequired) {
        // Not enough remaining approvers to reach quorum
        newStatus = 'rejected';
      }
      break;
  }

  const updatedApproval: ApprovalRequest = {
    ...approval,
    status: newStatus,
    approvers: updatedApprovers,
    comments: updatedComments,
  };

  const updatedPendingApprovals = [...instance.pendingApprovals];
  updatedPendingApprovals[approvalIndex] = updatedApproval;

  return {
    success: true,
    instance: {
      ...instance,
      pendingApprovals: updatedPendingApprovals,
      updatedAt: new Date(),
    },
    shouldTransition,
  };
}

// ============================================================================
// Simulation
// ============================================================================

export function simulateWorkflow(
  machine: StateMachine,
  steps: TransitionId[],
  initialData: Record<string, unknown> = {}
): SimulationResult {
  const result: SimulationResult = {
    id: generateId(),
    machineId: machine.id,
    startState: machine.initialState,
    endState: machine.initialState,
    steps: [],
    totalDuration: 0,
    success: true,
    completedAt: new Date(),
    errors: [],
  };

  let currentInstance = createInstance(machine, initialData);
  let stepNumber = 0;

  for (const transitionId of steps) {
    stepNumber++;
    const transition = machine.transitions.find(t => t.id === transitionId);
    if (!transition) {
      result.success = false;
      result.errors.push(`Step ${stepNumber}: Transition not found`);
      break;
    }

    const fromState = machine.states.find(s => s.id === currentInstance.currentState);
    const toState = machine.states.find(s => s.id === transition.toState);

    if (!fromState || !toState) {
      result.success = false;
      result.errors.push(`Step ${stepNumber}: Invalid states`);
      break;
    }

    if (transition.fromState !== currentInstance.currentState) {
      result.success = false;
      result.errors.push(
        `Step ${stepNumber}: Cannot execute "${transition.name}" from "${fromState.name}"`
      );
      break;
    }

    const stepDuration = Math.random() * 1000 + 500; // Simulated duration

    const simStep: SimulationStep = {
      id: generateId(),
      instanceId: currentInstance.id,
      fromState,
      toState,
      transition,
      timestamp: new Date(),
      status: transition.requiresApproval ? 'pending_approval' : 'success',
      message: transition.requiresApproval
        ? `Awaiting approval for "${transition.name}"`
        : `Transitioned from "${fromState.name}" to "${toState.name}"`,
      duration: stepDuration,
    };

    result.steps.push(simStep);
    result.totalDuration += stepDuration;

    // Update instance state
    currentInstance = {
      ...currentInstance,
      currentState: transition.toState,
      updatedAt: new Date(),
    };
  }

  result.endState = currentInstance.currentState;
  return result;
}

// ============================================================================
// Analytics
// ============================================================================

export function calculateAnalytics(
  machine: StateMachine,
  instances: StateMachineInstance[]
): StateMachineAnalytics {
  const activeInstances = instances.filter(i => i.status === 'active');
  const completedInstances = instances.filter(i => i.status === 'completed');

  // Calculate average completion time
  const completionTimes = completedInstances
    .filter(i => i.completedAt)
    .map(i => i.completedAt!.getTime() - i.createdAt.getTime());
  const averageCompletionTime =
    completionTimes.length > 0
      ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length
      : 0;

  // Calculate state distribution
  const stateDistribution: Record<string, number> = {};
  instances.forEach(instance => {
    stateDistribution[instance.currentState] =
      (stateDistribution[instance.currentState] || 0) + 1;
  });

  // Calculate transition counts
  const transitionCounts: Record<string, number> = {};
  instances.forEach(instance => {
    instance.previousStates.forEach(entry => {
      transitionCounts[entry.transitionId] =
        (transitionCounts[entry.transitionId] || 0) + 1;
    });
  });

  // Calculate approval metrics
  const allApprovals = instances.flatMap(i => i.pendingApprovals);
  const approvalMetrics = {
    totalRequests: allApprovals.length,
    approved: allApprovals.filter(a => a.status === 'approved').length,
    rejected: allApprovals.filter(a => a.status === 'rejected').length,
    pending: allApprovals.filter(a => a.status === 'pending').length,
    averageResponseTime: 0, // Would need response timestamps to calculate
  };

  // Find bottleneck states (states where instances spend the most time)
  const stateTimings: Record<string, { totalTime: number; count: number }> = {};
  instances.forEach(instance => {
    for (let i = 0; i < instance.previousStates.length; i++) {
      const entry = instance.previousStates[i];
      const nextEntry = instance.previousStates[i + 1];
      const endTime = nextEntry
        ? nextEntry.timestamp.getTime()
        : instance.updatedAt.getTime();
      const duration = endTime - entry.timestamp.getTime();

      if (!stateTimings[entry.toState]) {
        stateTimings[entry.toState] = { totalTime: 0, count: 0 };
      }
      stateTimings[entry.toState].totalTime += duration;
      stateTimings[entry.toState].count += 1;
    }
  });

  const bottleneckStates = Object.entries(stateTimings)
    .map(([stateId, { totalTime, count }]) => ({
      stateId,
      averageTime: totalTime / count,
      instanceCount: count,
    }))
    .sort((a, b) => b.averageTime - a.averageTime)
    .slice(0, 5);

  return {
    machineId: machine.id,
    totalInstances: instances.length,
    activeInstances: activeInstances.length,
    completedInstances: completedInstances.length,
    averageCompletionTime,
    stateDistribution,
    transitionCounts,
    approvalMetrics,
    bottleneckStates,
  };
}

// ============================================================================
// Export/Import
// ============================================================================

export function exportStateMachine(machine: StateMachine): string {
  return JSON.stringify(machine, null, 2);
}

export function importStateMachine(json: string): StateMachine | null {
  try {
    const data = JSON.parse(json);
    // Validate basic structure
    if (!data.id || !data.name || !data.states || !data.transitions) {
      return null;
    }
    return {
      ...data,
      metadata: {
        ...data.metadata,
        createdAt: new Date(data.metadata?.createdAt || Date.now()),
        updatedAt: new Date(),
      },
    };
  } catch {
    return null;
  }
}

export function cloneStateMachine(machine: StateMachine): StateMachine {
  const idMap = new Map<string, string>();
  
  // Generate new IDs for all states
  machine.states.forEach(state => {
    idMap.set(state.id, generateId());
  });
  
  // Generate new IDs for all transitions
  machine.transitions.forEach(transition => {
    idMap.set(transition.id, generateId());
  });
  
  const newMachineId = generateId();
  
  return {
    id: newMachineId,
    name: `${machine.name} (Copy)`,
    description: machine.description,
    version: machine.version,
    states: machine.states.map(state => ({
      ...state,
      id: idMap.get(state.id)!,
      metadata: {
        ...state.metadata,
        escalationState: state.metadata.escalationState
          ? idMap.get(state.metadata.escalationState)
          : undefined,
      },
    })),
    transitions: machine.transitions.map(transition => ({
      ...transition,
      id: idMap.get(transition.id)!,
      fromState: idMap.get(transition.fromState)!,
      toState: idMap.get(transition.toState)!,
    })),
    initialState: idMap.get(machine.initialState)!,
    metadata: {
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: machine.metadata.createdBy,
      tags: [...(machine.metadata.tags || [])],
      category: machine.metadata.category,
    },
  };
}
