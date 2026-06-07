// Approval & State Machine Engine - Phase 2
// Visual state machine builder with approval workflows

// Types
export * from './types';

// Engine
export {
  generateId,
  generateShortId,
  createEmptyStateMachine,
  createState,
  createTransition,
  createInstance,
  getInstanceState,
  validateStateMachine,
  getAvailableTransitions,
  executeTransition,
  respondToApproval,
  simulateWorkflow,
  calculateAnalytics,
  exportStateMachine,
  importStateMachine,
  cloneStateMachine,
} from './engine';

// Configuration
export {
  stateMachineTemplates,
  approvalTypes,
  stateColors,
  actionTypes,
  conditionTypes,
} from './config';

// Hook
export { useApprovalEngine } from './useApprovalEngine';

// Components
export {
  StateMachineCanvas,
  ApprovalQueue,
  InstanceTimeline,
  ApprovalDashboard,
} from './components';
