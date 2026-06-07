// Instance Timeline Component
// Phase 2 - Display state machine instance history

import React from 'react';
import { Icon } from '@/components/common';
import type { StateMachineInstance, StateMachine, StateHistoryEntry } from '../types';

interface InstanceTimelineProps {
  instance: StateMachineInstance;
  machine: StateMachine;
  onTransitionClick?: (entry: StateHistoryEntry) => void;
}

export const InstanceTimeline: React.FC<InstanceTimelineProps> = ({
  instance,
  machine,
  onTransitionClick,
}) => {
  const getState = (stateId: string) => machine.states.find(s => s.id === stateId);
  const currentState = getState(instance.currentState);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date(date));
  };

  const formatDuration = (start: Date, end: Date) => {
    const diff = new Date(end).getTime() - new Date(start).getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
            <Icon icon="solar:timeline-bold" className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">Instance Timeline</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {machine.name} • #{instance.id.slice(-8)}
            </p>
          </div>
        </div>

        {/* Status badge */}
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            instance.status === 'completed'
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
              : instance.status === 'active'
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
              : instance.status === 'suspended'
              ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
          }`}
        >
          {instance.status.charAt(0).toUpperCase() + instance.status.slice(1)}
        </span>
      </div>

      {/* Current State */}
      <div className="mb-6 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${currentState?.metadata.color}20` }}
          >
            <Icon
              icon={currentState?.metadata.icon || 'solar:record-circle-bold'}
              className="w-6 h-6"
              style={{ color: currentState?.metadata.color }}
            />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Current State</p>
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              {currentState?.name || 'Unknown'}
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />

        {/* Created event */}
        <div className="relative flex gap-4 pb-6">
          <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 ring-4 ring-white dark:ring-slate-800">
            <Icon icon="solar:play-circle-bold" className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1 pt-1">
            <div className="flex items-center justify-between">
              <p className="font-medium text-slate-800 dark:text-slate-200">Instance Created</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {formatDate(instance.createdAt)}
              </p>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Started in{' '}
              <span className="font-medium">
                {machine.states.find(s => s.id === machine.initialState)?.name || 'Initial State'}
              </span>
            </p>
          </div>
        </div>

        {/* State transitions */}
        {instance.previousStates.map((entry, index) => {
          const fromState = getState(entry.fromState);
          const toState = getState(entry.toState);
          const nextEntry = instance.previousStates[index + 1];
          const duration = nextEntry
            ? formatDuration(entry.timestamp, nextEntry.timestamp)
            : formatDuration(entry.timestamp, instance.updatedAt);

          return (
            <div
              key={entry.id}
              className="relative flex gap-4 pb-6 cursor-pointer group"
              onClick={() => onTransitionClick?.(entry)}
            >
              <div
                className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full ring-4 ring-white dark:ring-slate-800 transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${toState?.metadata.color}20` }}
              >
                <Icon
                  icon={toState?.metadata.icon || 'solar:arrow-right-bold'}
                  className="w-5 h-5"
                  style={{ color: toState?.metadata.color }}
                />
              </div>
              <div className="flex-1 pt-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {entry.transitionName}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {formatDate(entry.timestamp)}
                  </p>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  <span className="font-medium" style={{ color: fromState?.metadata.color }}>
                    {fromState?.name}
                  </span>
                  <Icon icon="solar:arrow-right-linear" className="w-4 h-4 mx-1 inline" />
                  <span className="font-medium" style={{ color: toState?.metadata.color }}>
                    {toState?.name}
                  </span>
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Icon icon="solar:user-bold" className="w-3.5 h-3.5" />
                    {entry.triggeredBy}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon icon="solar:clock-circle-bold" className="w-3.5 h-3.5" />
                    {duration} in state
                  </span>
                </div>
                {entry.comments && (
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 italic">
                    "{entry.comments}"
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {/* Completed event */}
        {instance.completedAt && (
          <div className="relative flex gap-4">
            <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 ring-4 ring-white dark:ring-slate-800">
              <Icon icon="solar:check-circle-bold" className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1 pt-1">
              <div className="flex items-center justify-between">
                <p className="font-medium text-green-600 dark:text-green-400">Completed</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {formatDate(instance.completedAt)}
                </p>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Total duration:{' '}
                <span className="font-medium">
                  {formatDuration(instance.createdAt, instance.completedAt)}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Pending Approvals */}
      {instance.pendingApprovals.filter(a => a.status === 'pending').length > 0 && (
        <div className="mt-6 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-2 mb-2">
            <Icon icon="solar:clock-circle-bold" className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span className="font-medium text-amber-800 dark:text-amber-200">
              Pending Approvals
            </span>
          </div>
          <div className="space-y-2">
            {instance.pendingApprovals
              .filter(a => a.status === 'pending')
              .map(approval => {
                const transition = machine.transitions.find(t => t.id === approval.transitionId);
                return (
                  <div
                    key={approval.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-amber-700 dark:text-amber-300">
                      {transition?.name || 'Unknown transition'}
                    </span>
                    <span className="text-amber-600 dark:text-amber-400">
                      {approval.approvers.filter(a => a.status === 'approved').length}/
                      {approval.approvers.length} approved
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};
