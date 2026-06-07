// Approval Engine Dashboard Component
// Phase 2 - Main dashboard combining all approval engine components

import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@/components/common';
import { useApprovalEngine } from '../useApprovalEngine';
import { StateMachineCanvas } from './StateMachineCanvas';
import { ApprovalQueue } from './ApprovalQueue';
import { InstanceTimeline } from './InstanceTimeline';
import type { State, Transition } from '../types';

type ViewMode = 'designer' | 'instances' | 'approvals' | 'analytics';

export const ApprovalDashboard: React.FC = () => {
  const {
    machines,
    selectedMachine,
    instances,
    selectedInstance,
    validationResult,
    analytics,
    createMachine,
    createMachineFromTemplate,
    selectMachine,
    deleteMachine,
    duplicateMachine,
    addState,
    updateState,
    deleteState,
    addTransition,
    deleteTransition,
    createNewInstance,
    selectInstance,
    getInstanceTransitions,
    executeInstanceTransition,
    getPendingApprovals,
    respondToApprovalRequest,
    validateCurrentMachine,
    refreshAnalytics,
    templates,
  } = useApprovalEngine();

  const [viewMode, setViewMode] = useState<ViewMode>('designer');
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);
  const [selectedTransitionId, setSelectedTransitionId] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAddState, setShowAddState] = useState(false);
  const [newStateName, setNewStateName] = useState('');

  // Current user (simulated)
  const currentUserId = 'user-1';

  // Get pending approvals
  const pendingApprovals = useMemo(() => getPendingApprovals(), [getPendingApprovals]);

  // Selected state/transition
  const selectedState = selectedMachine?.states.find(s => s.id === selectedStateId);
  const selectedTransition = selectedMachine?.transitions.find(t => t.id === selectedTransitionId);

  // Machine instances
  const machineInstances = useMemo(
    () => instances.filter(i => i.machineId === selectedMachine?.id),
    [instances, selectedMachine]
  );

  // Handle state selection
  const handleStateSelect = (state: State | null) => {
    setSelectedStateId(state?.id || null);
    setSelectedTransitionId(null);
  };

  // Handle transition selection
  const handleTransitionSelect = (transition: Transition | null) => {
    setSelectedTransitionId(transition?.id || null);
    setSelectedStateId(null);
  };

  // Handle add state
  const handleAddState = () => {
    if (newStateName.trim()) {
      addState(newStateName.trim());
      setNewStateName('');
      setShowAddState(false);
    }
  };

  // Handle add transition
  const handleAddTransition = (fromState: string, toState: string) => {
    const from = selectedMachine?.states.find(s => s.id === fromState);
    const to = selectedMachine?.states.find(s => s.id === toState);
    if (from && to) {
      addTransition(`${from.name} → ${to.name}`, fromState, toState);
    }
  };

  // Handle approval response
  const handleApprove = (instanceId: string, approvalId: string, comment?: string) => {
    respondToApprovalRequest(instanceId, approvalId, currentUserId, 'approved', comment);
  };

  const handleReject = (instanceId: string, approvalId: string, comment?: string) => {
    respondToApprovalRequest(instanceId, approvalId, currentUserId, 'rejected', comment);
  };

  return (
    <div className="flex flex-col h-full min-h-[700px]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
              <Icon icon="solar:diagram-down-bold" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 dark:text-white">
                State Machine & Approvals
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Design workflows and manage approvals
              </p>
            </div>
          </div>
        </div>

        {/* View mode tabs */}
        <div className="flex rounded-lg bg-slate-100 dark:bg-slate-700 p-1">
          {(['designer', 'instances', 'approvals', 'analytics'] as ViewMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => {
                setViewMode(mode);
                if (mode === 'analytics') refreshAnalytics();
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                viewMode === mode
                  ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <Icon
                icon={
                  mode === 'designer'
                    ? 'solar:pen-new-square-bold'
                    : mode === 'instances'
                    ? 'solar:layers-bold'
                    : mode === 'approvals'
                    ? 'solar:clipboard-check-bold'
                    : 'solar:chart-bold'
                }
                className="w-4 h-4"
              />
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
              {mode === 'approvals' && pendingApprovals.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-xs">
                  {pendingApprovals.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Machine List */}
        <div className="w-64 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">State Machines</h2>
              <div className="flex gap-1">
                <button
                  onClick={() => setShowTemplates(true)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-colors"
                  title="From template"
                >
                  <Icon icon="solar:copy-bold" className="w-4 h-4" />
                </button>
                <button
                  onClick={() => createMachine()}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-colors"
                  title="New machine"
                >
                  <Icon icon="solar:add-circle-bold" className="w-4 h-4" />
                </button>
              </div>
            </div>

            {machines.length === 0 ? (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <Icon icon="solar:diagram-down-bold" className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No state machines yet</p>
                <button
                  onClick={() => setShowTemplates(true)}
                  className="mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Start from template
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {machines.map(machine => (
                  <button
                    key={machine.id}
                    onClick={() => selectMachine(machine.id)}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      selectedMachine?.id === machine.id
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon icon="solar:diagram-down-bold" className="w-4 h-4 text-indigo-600" />
                      <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                        {machine.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span>{machine.states.length} states</span>
                      <span>{machine.transitions.length} transitions</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {viewMode === 'designer' && (
            <>
              {/* Canvas */}
              <div className="flex-1 relative">
                {selectedMachine ? (
                  <>
                    {/* Toolbar */}
                    <div className="absolute top-4 left-4 z-10 flex gap-2">
                      <button
                        onClick={() => setShowAddState(true)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-slate-800 shadow-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <Icon icon="solar:add-circle-bold" className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Add State
                        </span>
                      </button>
                      <button
                        onClick={() => validateCurrentMachine()}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-slate-800 shadow-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <Icon icon="solar:check-circle-bold" className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Validate
                        </span>
                      </button>
                      <button
                        onClick={() => duplicateMachine(selectedMachine.id)}
                        className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        title="Duplicate"
                      >
                        <Icon icon="solar:copy-bold" className="w-4 h-4 text-slate-600" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Delete this state machine?')) {
                            deleteMachine(selectedMachine.id);
                          }
                        }}
                        className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title="Delete"
                      >
                        <Icon icon="solar:trash-bin-trash-bold" className="w-4 h-4 text-red-600" />
                      </button>
                    </div>

                    {/* Validation results */}
                    {validationResult && (
                      <div className="absolute top-16 left-4 z-10 max-w-md">
                        <div
                          className={`p-3 rounded-lg ${
                            validationResult.isValid
                              ? 'bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800'
                              : 'bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Icon
                              icon={validationResult.isValid ? 'solar:check-circle-bold' : 'solar:danger-triangle-bold'}
                              className={`w-5 h-5 ${validationResult.isValid ? 'text-green-600' : 'text-red-600'}`}
                            />
                            <span className={`font-medium ${validationResult.isValid ? 'text-green-700' : 'text-red-700'}`}>
                              {validationResult.isValid ? 'Valid' : `${validationResult.errors.length} Error(s)`}
                            </span>
                          </div>
                          {validationResult.errors.length > 0 && (
                            <ul className="text-sm text-red-600 dark:text-red-400 space-y-1">
                              {validationResult.errors.map((err, idx) => (
                                <li key={idx}>• {err.message}</li>
                              ))}
                            </ul>
                          )}
                          {validationResult.warnings.length > 0 && (
                            <ul className="text-sm text-amber-600 dark:text-amber-400 space-y-1 mt-2">
                              {validationResult.warnings.map((warn, idx) => (
                                <li key={idx}>• {warn.message}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    )}

                    <StateMachineCanvas
                      machine={selectedMachine}
                      onStateSelect={handleStateSelect}
                      onTransitionSelect={handleTransitionSelect}
                      onAddTransition={handleAddTransition}
                      selectedStateId={selectedStateId}
                      selectedTransitionId={selectedTransitionId}
                    />
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
                    <div className="text-center">
                      <Icon icon="solar:diagram-down-bold" className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="text-base font-medium">Select a state machine</p>
                      <p className="text-sm">Or create a new one to get started</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Properties Panel */}
              {(selectedState || selectedTransition) && (
                <div className="w-80 border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-y-auto">
                  <div className="p-4">
                    {selectedState && (
                      <>
                        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4">
                          State Properties
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                              Name
                            </label>
                            <input
                              type="text"
                              value={selectedState.name}
                              onChange={e => updateState(selectedState.id, { name: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                              Color
                            </label>
                            <input
                              type="color"
                              value={selectedState.metadata.color}
                              onChange={e =>
                                updateState(selectedState.id, {
                                  metadata: { ...selectedState.metadata, color: e.target.value },
                                })
                              }
                              className="w-full h-10 rounded-lg cursor-pointer"
                            />
                          </div>
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={selectedState.metadata.isInitial}
                                onChange={e =>
                                  updateState(selectedState.id, {
                                    metadata: { ...selectedState.metadata, isInitial: e.target.checked },
                                  })
                                }
                                className="rounded border-slate-300"
                              />
                              <span className="text-sm text-slate-700 dark:text-slate-300">Initial</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={selectedState.metadata.isFinal}
                                onChange={e =>
                                  updateState(selectedState.id, {
                                    metadata: { ...selectedState.metadata, isFinal: e.target.checked },
                                  })
                                }
                                className="rounded border-slate-300"
                              />
                              <span className="text-sm text-slate-700 dark:text-slate-300">Final</span>
                            </label>
                          </div>
                          <button
                            onClick={() => {
                              deleteState(selectedState.id);
                              setSelectedStateId(null);
                            }}
                            className="w-full mt-4 px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                          >
                            Delete State
                          </button>
                        </div>
                      </>
                    )}

                    {selectedTransition && (
                      <>
                        <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">
                          Transition Properties
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                              Name
                            </label>
                            <p className="text-slate-800 dark:text-slate-200">{selectedTransition.name}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                              From → To
                            </label>
                            <p className="text-slate-800 dark:text-slate-200">
                              {selectedMachine?.states.find(s => s.id === selectedTransition.fromState)?.name} →{' '}
                              {selectedMachine?.states.find(s => s.id === selectedTransition.toState)?.name}
                            </p>
                          </div>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selectedTransition.requiresApproval}
                              onChange={() => {}}
                              className="rounded border-slate-300"
                            />
                            <span className="text-sm text-slate-700 dark:text-slate-300">Requires Approval</span>
                          </label>
                          <button
                            onClick={() => {
                              deleteTransition(selectedTransition.id);
                              setSelectedTransitionId(null);
                            }}
                            className="w-full mt-4 px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                          >
                            Delete Transition
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {viewMode === 'instances' && selectedMachine && (
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                  Instances of {selectedMachine.name}
                </h2>
                <button
                  onClick={() => createNewInstance(selectedMachine.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                >
                  <Icon icon="solar:add-circle-bold" className="w-5 h-5" />
                  New Instance
                </button>
              </div>

              {machineInstances.length === 0 ? (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                  <Icon icon="solar:layers-bold" className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No instances yet</p>
                  <button
                    onClick={() => createNewInstance(selectedMachine.id)}
                    className="mt-2 text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Create first instance
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Instance List */}
                  <div className="space-y-3">
                    {machineInstances.map(instance => {
                      const currentState = selectedMachine.states.find(
                        s => s.id === instance.currentState
                      );
                      const transitions = getInstanceTransitions(instance.id);

                      return (
                        <div
                          key={instance.id}
                          onClick={() => selectInstance(instance.id)}
                          className={`p-4 rounded-lg border cursor-pointer transition-all ${
                            selectedInstance?.id === instance.id
                              ? 'border-indigo-300 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-slate-800 dark:text-slate-200">
                              #{instance.id.slice(-8)}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                instance.status === 'completed'
                                  ? 'bg-green-100 text-green-700'
                                  : instance.status === 'active'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {instance.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: currentState?.metadata.color }}
                            />
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              {currentState?.name}
                            </span>
                          </div>

                          {/* Available transitions */}
                          {transitions.filter(t => t.canExecute).length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {transitions
                                .filter(t => t.canExecute)
                                .map(t => (
                                  <button
                                    key={t.transition.id}
                                    onClick={e => {
                                      e.stopPropagation();
                                      executeInstanceTransition(
                                        instance.id,
                                        t.transition.id,
                                        currentUserId
                                      );
                                    }}
                                    className="px-2 py-1 rounded text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 transition-colors"
                                  >
                                    {t.transition.name}
                                  </button>
                                ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Instance Timeline */}
                  {selectedInstance && (
                    <InstanceTimeline instance={selectedInstance} machine={selectedMachine} />
                  )}
                </div>
              )}
            </div>
          )}

          {viewMode === 'approvals' && (
            <div className="flex-1 p-6">
              <ApprovalQueue
                pendingApprovals={pendingApprovals}
                instances={instances}
                machines={machines}
                currentUserId={currentUserId}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            </div>
          )}

          {viewMode === 'analytics' && selectedMachine && analytics && (
            <div className="flex-1 p-6 overflow-y-auto">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-6">
                Analytics for {selectedMachine.name}
              </h2>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <Icon icon="solar:layers-bold" className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-800 dark:text-white">
                        {analytics.totalInstances}
                      </p>
                      <p className="text-sm text-slate-500">Total Instances</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                      <Icon icon="solar:clock-circle-bold" className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-800 dark:text-white">
                        {analytics.activeInstances}
                      </p>
                      <p className="text-sm text-slate-500">Active</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                      <Icon icon="solar:check-circle-bold" className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-800 dark:text-white">
                        {analytics.completedInstances}
                      </p>
                      <p className="text-sm text-slate-500">Completed</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                      <Icon icon="solar:clipboard-check-bold" className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-800 dark:text-white">
                        {analytics.approvalMetrics.pending}
                      </p>
                      <p className="text-sm text-slate-500">Pending Approvals</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* State Distribution */}
              <div className="p-6 rounded-xl bg-white dark:bg-slate-800 shadow-sm mb-6">
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">
                  State Distribution
                </h3>
                <div className="space-y-3">
                  {Object.entries(analytics.stateDistribution).map(([stateId, count]) => {
                    const state = selectedMachine.states.find(s => s.id === stateId);
                    const percentage = (count / analytics.totalInstances) * 100;
                    return (
                      <div key={stateId}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-slate-700 dark:text-slate-300">
                            {state?.name || 'Unknown'}
                          </span>
                          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                            {count} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: state?.metadata.color || '#6366f1',
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Template Modal */}
      {showTemplates &&
        createPortal(
          <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowTemplates(false)}
            />
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                Choose a Template
              </h3>
              <button
                onClick={() => setShowTemplates(false)}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <Icon icon="solar:close-circle-bold" className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-2 gap-4">
                {templates.map(template => (
                  <button
                    key={template.id}
                    onClick={() => {
                      createMachineFromTemplate(template.id);
                      setShowTemplates(false);
                    }}
                    className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 text-left transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                        <Icon icon={template.icon} className="w-5 h-5 text-indigo-600" />
                      </div>
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {template.name}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {template.description}
                    </p>
                    <div className="mt-2 text-xs text-slate-400">
                      {template.machine.states.length} states • {template.machine.transitions.length} transitions
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>,
          document.body
        )}

      {/* Add State Modal */}
      {showAddState &&
        createPortal(
          <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowAddState(false)}
            />
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-96 p-6 animate-fade-in">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">Add New State</h3>
            <input
              type="text"
              value={newStateName}
              onChange={e => setNewStateName(e.target.value)}
              placeholder="State name..."
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 mb-4"
              autoFocus
              onKeyDown={e => {
                if (e.key === 'Enter') handleAddState();
                if (e.key === 'Escape') setShowAddState(false);
              }}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddState(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAddState}
                className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Add State
              </button>
            </div>
          </div>
        </div>,
          document.body
        )}
    </div>
  );
};
