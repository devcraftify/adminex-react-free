// Approval Engine Hook
// Phase 2 - React hook for state machine and approval management

import { useState, useCallback, useEffect } from 'react';
import type {
  StateMachine,
  StateMachineInstance,
  StateId,
  TransitionId,
  ApprovalRequest,
  AvailableTransition,
  ValidationResult,
  StateMachineAnalytics,
  SimulationResult,
} from './types';
import {
  generateId,
  createEmptyStateMachine,
  createState,
  createTransition,
  createInstance,
  validateStateMachine,
  getAvailableTransitions,
  executeTransition,
  respondToApproval,
  simulateWorkflow,
  calculateAnalytics,
  cloneStateMachine,
  exportStateMachine,
  importStateMachine,
} from './engine';
import { stateMachineTemplates } from './config';

const STORAGE_KEY = 'adminex_state_machines';
const INSTANCES_KEY = 'adminex_state_machine_instances';

export interface UseApprovalEngineReturn {
  // State Machines
  machines: StateMachine[];
  selectedMachine: StateMachine | null;
  
  // Instances
  instances: StateMachineInstance[];
  selectedInstance: StateMachineInstance | null;
  
  // UI State
  isSimulating: boolean;
  simulationResult: SimulationResult | null;
  validationResult: ValidationResult | null;
  analytics: StateMachineAnalytics | null;
  
  // Machine CRUD
  createMachine: (name?: string) => StateMachine;
  createMachineFromTemplate: (templateId: string) => StateMachine | null;
  selectMachine: (machineId: string | null) => void;
  updateMachine: (machine: StateMachine) => void;
  deleteMachine: (machineId: string) => void;
  duplicateMachine: (machineId: string) => StateMachine | null;
  
  // State Management
  addState: (name: string, options?: Parameters<typeof createState>[1]) => void;
  updateState: (stateId: StateId, updates: Partial<StateMachine['states'][0]>) => void;
  deleteState: (stateId: StateId) => void;
  
  // Transition Management
  addTransition: (
    name: string,
    fromState: StateId,
    toState: StateId,
    options?: Parameters<typeof createTransition>[3]
  ) => void;
  updateTransition: (transitionId: TransitionId, updates: Partial<StateMachine['transitions'][0]>) => void;
  deleteTransition: (transitionId: TransitionId) => void;
  
  // Instance Management
  createNewInstance: (machineId: string, data?: Record<string, unknown>) => StateMachineInstance | null;
  selectInstance: (instanceId: string | null) => void;
  getInstanceTransitions: (instanceId: string) => AvailableTransition[];
  executeInstanceTransition: (
    instanceId: string,
    transitionId: TransitionId,
    userId: string,
    comment?: string
  ) => { success: boolean; error?: string };
  
  // Approval Management
  getPendingApprovals: () => ApprovalRequest[];
  respondToApprovalRequest: (
    instanceId: string,
    approvalId: string,
    approverId: string,
    response: 'approved' | 'rejected',
    comment?: string
  ) => { success: boolean };
  
  // Validation & Simulation
  validateCurrentMachine: () => ValidationResult | null;
  simulateCurrentMachine: (steps: TransitionId[], initialData?: Record<string, unknown>) => SimulationResult | null;
  clearSimulation: () => void;
  
  // Analytics
  refreshAnalytics: () => void;
  
  // Export/Import
  exportCurrentMachine: () => string | null;
  importMachine: (json: string) => boolean;
  
  // Templates
  templates: typeof stateMachineTemplates;
}

export function useApprovalEngine(): UseApprovalEngineReturn {
  // State
  const [machines, setMachines] = useState<StateMachine[]>([]);
  const [instances, setInstances] = useState<StateMachineInstance[]>([]);
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(null);
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [analytics, setAnalytics] = useState<StateMachineAnalytics | null>(null);

  // Derived state
  const selectedMachine = machines.find(m => m.id === selectedMachineId) || null;
  const selectedInstance = instances.find(i => i.id === selectedInstanceId) || null;

  // Load from localStorage
  useEffect(() => {
    try {
      const savedMachines = localStorage.getItem(STORAGE_KEY);
      if (savedMachines) {
        const parsed = JSON.parse(savedMachines);
        setMachines(parsed.map((m: StateMachine) => ({
          ...m,
          metadata: {
            ...m.metadata,
            createdAt: new Date(m.metadata.createdAt),
            updatedAt: new Date(m.metadata.updatedAt),
          },
        })));
      }

      const savedInstances = localStorage.getItem(INSTANCES_KEY);
      if (savedInstances) {
        const parsed = JSON.parse(savedInstances);
        setInstances(parsed.map((i: StateMachineInstance) => ({
          ...i,
          createdAt: new Date(i.createdAt),
          updatedAt: new Date(i.updatedAt),
          completedAt: i.completedAt ? new Date(i.completedAt) : undefined,
          pendingApprovals: i.pendingApprovals.map((a: ApprovalRequest) => ({
            ...a,
            requestedAt: new Date(a.requestedAt),
            dueDate: a.dueDate ? new Date(a.dueDate) : undefined,
          })),
        })));
      }
    } catch (error) {
      console.error('Failed to load state machines:', error);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(machines));
    } catch (error) {
      console.error('Failed to save state machines:', error);
    }
  }, [machines]);

  useEffect(() => {
    try {
      localStorage.setItem(INSTANCES_KEY, JSON.stringify(instances));
    } catch (error) {
      console.error('Failed to save instances:', error);
    }
  }, [instances]);

  // Machine CRUD
  const createMachine = useCallback((name?: string): StateMachine => {
    const machine = createEmptyStateMachine(name);
    setMachines(prev => [...prev, machine]);
    setSelectedMachineId(machine.id);
    return machine;
  }, []);

  const createMachineFromTemplate = useCallback((templateId: string): StateMachine | null => {
    const template = stateMachineTemplates.find(t => t.id === templateId);
    if (!template) return null;

    const machine: StateMachine = {
      id: generateId(),
      name: template.machine.name,
      description: template.machine.description,
      version: template.machine.version,
      states: template.machine.states,
      transitions: template.machine.transitions,
      initialState: template.machine.initialState,
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system',
        category: template.category,
      },
    };

    setMachines(prev => [...prev, machine]);
    setSelectedMachineId(machine.id);
    return machine;
  }, []);

  const selectMachine = useCallback((machineId: string | null) => {
    setSelectedMachineId(machineId);
    setValidationResult(null);
    setSimulationResult(null);
  }, []);

  const updateMachine = useCallback((machine: StateMachine) => {
    setMachines(prev =>
      prev.map(m =>
        m.id === machine.id
          ? { ...machine, metadata: { ...machine.metadata, updatedAt: new Date() } }
          : m
      )
    );
  }, []);

  const deleteMachine = useCallback((machineId: string) => {
    setMachines(prev => prev.filter(m => m.id !== machineId));
    setInstances(prev => prev.filter(i => i.machineId !== machineId));
    if (selectedMachineId === machineId) {
      setSelectedMachineId(null);
    }
  }, [selectedMachineId]);

  const duplicateMachine = useCallback((machineId: string): StateMachine | null => {
    const machine = machines.find(m => m.id === machineId);
    if (!machine) return null;

    const cloned = cloneStateMachine(machine);
    setMachines(prev => [...prev, cloned]);
    setSelectedMachineId(cloned.id);
    return cloned;
  }, [machines]);

  // State Management
  const addState = useCallback(
    (name: string, options?: Parameters<typeof createState>[1]) => {
      if (!selectedMachine) return;

      const state = createState(name, options);
      updateMachine({
        ...selectedMachine,
        states: [...selectedMachine.states, state],
      });
    },
    [selectedMachine, updateMachine]
  );

  const updateState = useCallback(
    (stateId: StateId, updates: Partial<StateMachine['states'][0]>) => {
      if (!selectedMachine) return;

      updateMachine({
        ...selectedMachine,
        states: selectedMachine.states.map(s =>
          s.id === stateId ? { ...s, ...updates, metadata: { ...s.metadata, ...updates.metadata } } : s
        ),
      });
    },
    [selectedMachine, updateMachine]
  );

  const deleteState = useCallback(
    (stateId: StateId) => {
      if (!selectedMachine) return;

      // Remove state and all related transitions
      updateMachine({
        ...selectedMachine,
        states: selectedMachine.states.filter(s => s.id !== stateId),
        transitions: selectedMachine.transitions.filter(
          t => t.fromState !== stateId && t.toState !== stateId
        ),
        initialState: selectedMachine.initialState === stateId
          ? selectedMachine.states.find(s => s.id !== stateId)?.id || ''
          : selectedMachine.initialState,
      });
    },
    [selectedMachine, updateMachine]
  );

  // Transition Management
  const addTransition = useCallback(
    (
      name: string,
      fromState: StateId,
      toState: StateId,
      options?: Parameters<typeof createTransition>[3]
    ) => {
      if (!selectedMachine) return;

      const transition = createTransition(name, fromState, toState, options);
      updateMachine({
        ...selectedMachine,
        transitions: [...selectedMachine.transitions, transition],
      });
    },
    [selectedMachine, updateMachine]
  );

  const updateTransition = useCallback(
    (transitionId: TransitionId, updates: Partial<StateMachine['transitions'][0]>) => {
      if (!selectedMachine) return;

      updateMachine({
        ...selectedMachine,
        transitions: selectedMachine.transitions.map(t =>
          t.id === transitionId
            ? { ...t, ...updates, metadata: { ...t.metadata, ...updates.metadata } }
            : t
        ),
      });
    },
    [selectedMachine, updateMachine]
  );

  const deleteTransition = useCallback(
    (transitionId: TransitionId) => {
      if (!selectedMachine) return;

      updateMachine({
        ...selectedMachine,
        transitions: selectedMachine.transitions.filter(t => t.id !== transitionId),
      });
    },
    [selectedMachine, updateMachine]
  );

  // Instance Management
  const createNewInstance = useCallback(
    (machineId: string, data?: Record<string, unknown>): StateMachineInstance | null => {
      const machine = machines.find(m => m.id === machineId);
      if (!machine) return null;

      const instance = createInstance(machine, data);
      setInstances(prev => [...prev, instance]);
      return instance;
    },
    [machines]
  );

  const selectInstance = useCallback((instanceId: string | null) => {
    setSelectedInstanceId(instanceId);
  }, []);

  const getInstanceTransitions = useCallback(
    (instanceId: string): AvailableTransition[] => {
      const instance = instances.find(i => i.id === instanceId);
      if (!instance) return [];

      const machine = machines.find(m => m.id === instance.machineId);
      if (!machine) return [];

      return getAvailableTransitions(machine, instance);
    },
    [instances, machines]
  );

  const executeInstanceTransition = useCallback(
    (
      instanceId: string,
      transitionId: TransitionId,
      userId: string,
      comment?: string
    ): { success: boolean; error?: string } => {
      const instance = instances.find(i => i.id === instanceId);
      if (!instance) return { success: false, error: 'Instance not found' };

      const machine = machines.find(m => m.id === instance.machineId);
      if (!machine) return { success: false, error: 'Machine not found' };

      const result = executeTransition(machine, instance, transitionId, userId, comment);

      if (result.success) {
        setInstances(prev =>
          prev.map(i => (i.id === instanceId ? result.instance : i))
        );
      }

      return { success: result.success, error: result.error };
    },
    [instances, machines]
  );

  // Approval Management
  const getPendingApprovals = useCallback((): ApprovalRequest[] => {
    return instances.flatMap(i =>
      i.pendingApprovals.filter(a => a.status === 'pending')
    );
  }, [instances]);

  const respondToApprovalRequest = useCallback(
    (
      instanceId: string,
      approvalId: string,
      approverId: string,
      response: 'approved' | 'rejected',
      comment?: string
    ): { success: boolean } => {
      const instance = instances.find(i => i.id === instanceId);
      if (!instance) return { success: false };

      const machine = machines.find(m => m.id === instance.machineId);
      if (!machine) return { success: false };

      const result = respondToApproval(instance, machine, approvalId, approverId, response, comment);

      if (result.success) {
        let updatedInstance = result.instance;

        // If should transition, execute the transition
        if (result.shouldTransition) {
          const approval = updatedInstance.pendingApprovals.find(a => a.id === approvalId);
          if (approval) {
            const transition = machine.transitions.find(t => t.id === approval.transitionId);
            if (transition) {
              const transitionResult = executeTransition(
                machine,
                { ...updatedInstance, pendingApprovals: [] }, // Clear pending to allow transition
                transition.id,
                approverId
              );
              if (transitionResult.success) {
                updatedInstance = {
                  ...transitionResult.instance,
                  pendingApprovals: updatedInstance.pendingApprovals.filter(
                    a => a.id !== approvalId
                  ),
                };
              }
            }
          }
        }

        setInstances(prev =>
          prev.map(i => (i.id === instanceId ? updatedInstance : i))
        );
      }

      return { success: result.success };
    },
    [instances, machines]
  );

  // Validation & Simulation
  const validateCurrentMachine = useCallback((): ValidationResult | null => {
    if (!selectedMachine) return null;
    const result = validateStateMachine(selectedMachine);
    setValidationResult(result);
    return result;
  }, [selectedMachine]);

  const simulateCurrentMachine = useCallback(
    (steps: TransitionId[], initialData?: Record<string, unknown>): SimulationResult | null => {
      if (!selectedMachine) return null;
      setIsSimulating(true);
      const result = simulateWorkflow(selectedMachine, steps, initialData);
      setSimulationResult(result);
      setIsSimulating(false);
      return result;
    },
    [selectedMachine]
  );

  const clearSimulation = useCallback(() => {
    setSimulationResult(null);
    setIsSimulating(false);
  }, []);

  // Analytics
  const refreshAnalytics = useCallback(() => {
    if (!selectedMachine) {
      setAnalytics(null);
      return;
    }

    const machineInstances = instances.filter(i => i.machineId === selectedMachine.id);
    const analyticsData = calculateAnalytics(selectedMachine, machineInstances);
    setAnalytics(analyticsData);
  }, [selectedMachine, instances]);

  // Export/Import
  const exportCurrentMachine = useCallback((): string | null => {
    if (!selectedMachine) return null;
    return exportStateMachine(selectedMachine);
  }, [selectedMachine]);

  const importMachineFromJson = useCallback((json: string): boolean => {
    const machine = importStateMachine(json);
    if (!machine) return false;

    // Generate new ID to avoid conflicts
    const newMachine: StateMachine = {
      ...machine,
      id: generateId(),
      name: `${machine.name} (Imported)`,
      metadata: {
        ...machine.metadata,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    setMachines(prev => [...prev, newMachine]);
    setSelectedMachineId(newMachine.id);
    return true;
  }, []);

  return {
    // State Machines
    machines,
    selectedMachine,
    
    // Instances
    instances,
    selectedInstance,
    
    // UI State
    isSimulating,
    simulationResult,
    validationResult,
    analytics,
    
    // Machine CRUD
    createMachine,
    createMachineFromTemplate,
    selectMachine,
    updateMachine,
    deleteMachine,
    duplicateMachine,
    
    // State Management
    addState,
    updateState,
    deleteState,
    
    // Transition Management
    addTransition,
    updateTransition,
    deleteTransition,
    
    // Instance Management
    createNewInstance,
    selectInstance,
    getInstanceTransitions,
    executeInstanceTransition,
    
    // Approval Management
    getPendingApprovals,
    respondToApprovalRequest,
    
    // Validation & Simulation
    validateCurrentMachine,
    simulateCurrentMachine,
    clearSimulation,
    
    // Analytics
    refreshAnalytics,
    
    // Export/Import
    exportCurrentMachine,
    importMachine: importMachineFromJson,
    
    // Templates
    templates: stateMachineTemplates,
  };
}
