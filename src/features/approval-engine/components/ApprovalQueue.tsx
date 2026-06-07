// Approval Queue Component
// Phase 2 - Display and manage pending approvals

import React, { useState } from 'react';
import { Icon } from '@/components/common';
import type { ApprovalRequest, StateMachineInstance, StateMachine } from '../types';

interface ApprovalQueueProps {
  pendingApprovals: ApprovalRequest[];
  instances: StateMachineInstance[];
  machines: StateMachine[];
  currentUserId: string;
  onApprove: (instanceId: string, approvalId: string, comment?: string) => void;
  onReject: (instanceId: string, approvalId: string, comment?: string) => void;
}

export const ApprovalQueue: React.FC<ApprovalQueueProps> = ({
  pendingApprovals,
  instances,
  machines,
  currentUserId,
  onApprove,
  onReject,
}) => {
  const [selectedApproval, setSelectedApproval] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [filter, setFilter] = useState<'all' | 'mine'>('all');

  // Get instance and machine for an approval
  const getApprovalContext = (approval: ApprovalRequest) => {
    const instance = instances.find(i =>
      i.pendingApprovals.some(a => a.id === approval.id)
    );
    const machine = instance ? machines.find(m => m.id === instance.machineId) : null;
    const transition = machine?.transitions.find(t => t.id === approval.transitionId);
    return { instance, machine, transition };
  };

  // Filter approvals
  const filteredApprovals = pendingApprovals.filter(approval => {
    if (filter === 'mine') {
      return approval.approvers.some(
        a => a.approverId === currentUserId && a.status === 'pending'
      );
    }
    return true;
  });

  const handleApprove = (approval: ApprovalRequest) => {
    const { instance } = getApprovalContext(approval);
    if (instance) {
      onApprove(instance.id, approval.id, comment);
      setComment('');
      setSelectedApproval(null);
    }
  };

  const handleReject = (approval: ApprovalRequest) => {
    const { instance } = getApprovalContext(approval);
    if (instance) {
      onReject(instance.id, approval.id, comment);
      setComment('');
      setSelectedApproval(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-500';
      case 'rejected':
        return 'text-red-500';
      case 'pending':
        return 'text-amber-500';
      default:
        return 'text-slate-500';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const getTimeRemaining = (dueDate?: Date) => {
    if (!dueDate) return null;
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due.getTime() - now.getTime();
    
    if (diff < 0) return 'Overdue';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      return `${Math.floor(hours / 24)}d ${hours % 24}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
            <Icon icon="solar:clipboard-check-bold" className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">Approval Queue</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {filteredApprovals.length} pending approval{filteredApprovals.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex rounded-lg bg-slate-100 dark:bg-slate-700 p-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('mine')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              filter === 'mine'
                ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            Mine
          </button>
        </div>
      </div>

      {/* Approval List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredApprovals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500 dark:text-slate-400">
            <Icon icon="solar:check-circle-bold" className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm">No pending approvals</p>
          </div>
        ) : (
          filteredApprovals.map(approval => {
            const { instance, machine, transition } = getApprovalContext(approval);
            const isExpanded = selectedApproval === approval.id;
            const timeRemaining = getTimeRemaining(approval.dueDate);
            const isOverdue = timeRemaining === 'Overdue';

            return (
              <div
                key={approval.id}
                className={`rounded-lg border transition-all ${
                  isExpanded
                    ? 'border-indigo-300 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                {/* Summary Row */}
                <button
                  onClick={() => setSelectedApproval(isExpanded ? null : approval.id)}
                  className="w-full p-4 text-left"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {transition?.name || 'Unknown Transition'}
                        </span>
                        {isOverdue && (
                          <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium">
                            Overdue
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {machine?.name} • Instance #{instance?.id.slice(-6)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {formatDate(approval.requestedAt)}
                      </p>
                      {timeRemaining && !isOverdue && (
                        <p className="text-xs text-amber-600 dark:text-amber-400">
                          {timeRemaining} remaining
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Approvers summary */}
                  <div className="flex items-center gap-2 mt-3">
                    {approval.approvers.map((approver, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                          approver.status === 'approved'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : approver.status === 'rejected'
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <Icon
                          icon={
                            approver.status === 'approved'
                              ? 'solar:check-circle-bold'
                              : approver.status === 'rejected'
                              ? 'solar:close-circle-bold'
                              : 'solar:clock-circle-bold'
                          }
                          className={`w-3.5 h-3.5 ${getStatusColor(approver.status)}`}
                        />
                        <span>{approver.approverName}</span>
                      </div>
                    ))}
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-slate-200 dark:border-slate-700">
                    {/* Comments */}
                    {approval.comments.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Comments
                        </h4>
                        <div className="space-y-2">
                          {approval.comments.map(c => (
                            <div
                              key={c.id}
                              className="p-2 rounded bg-white dark:bg-slate-700/50 text-sm"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-slate-700 dark:text-slate-300">
                                  {c.authorName}
                                </span>
                                <span className="text-xs text-slate-500">
                                  {formatDate(c.createdAt)}
                                </span>
                              </div>
                              <p className="text-slate-600 dark:text-slate-400">{c.content}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Comment Input */}
                    <div className="mb-4">
                      <textarea
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        placeholder="Add a comment (optional)..."
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 text-sm resize-none"
                        rows={2}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApprove(approval)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-colors"
                      >
                        <Icon icon="solar:check-circle-bold" className="w-5 h-5" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(approval)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
                      >
                        <Icon icon="solar:close-circle-bold" className="w-5 h-5" />
                        Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
