// State Machine Canvas Component
// Phase 2 - Visual editor for state machine states and transitions

import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Icon } from '@/components/common';
import type { StateMachine, State, Transition, StateId } from '../types';

interface StateMachineCanvasProps {
  machine: StateMachine;
  onStateSelect?: (state: State | null) => void;
  onTransitionSelect?: (transition: Transition | null) => void;
  onStateMove?: (stateId: StateId, position: { x: number; y: number }) => void;
  onAddTransition?: (fromState: StateId, toState: StateId) => void;
  selectedStateId?: StateId | null;
  selectedTransitionId?: string | null;
  readOnly?: boolean;
}

interface StatePosition {
  id: StateId;
  x: number;
  y: number;
}

const STATE_WIDTH = 160;
const STATE_HEIGHT = 80;
const CANVAS_PADDING = 50;

export const StateMachineCanvas: React.FC<StateMachineCanvasProps> = ({
  machine,
  onStateSelect,
  onTransitionSelect,
  onStateMove,
  onAddTransition,
  selectedStateId,
  selectedTransitionId,
  readOnly = false,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [draggingState, setDraggingState] = useState<StateId | null>(null);
  const [connectingFrom, setConnectingFrom] = useState<StateId | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Calculate state positions in a circular layout
  const statePositions = useMemo((): StatePosition[] => {
    const positions: StatePosition[] = [];
    const stateCount = machine.states.length;
    
    if (stateCount === 0) return positions;
    
    if (stateCount === 1) {
      positions.push({ id: machine.states[0].id, x: 400, y: 200 });
      return positions;
    }

    // Arrange states in a circle or grid
    const centerX = 500;
    const centerY = 350;
    const radius = Math.max(180, stateCount * 40);

    machine.states.forEach((state, index) => {
      const angle = (index / stateCount) * 2 * Math.PI - Math.PI / 2;
      positions.push({
        id: state.id,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
      });
    });

    return positions;
  }, [machine.states]);

  const getStatePosition = useCallback(
    (stateId: StateId): StatePosition | undefined => {
      return statePositions.find(p => p.id === stateId);
    },
    [statePositions]
  );

  // SVG coordinate conversion
  const getSvgPoint = useCallback(
    (clientX: number, clientY: number): { x: number; y: number } => {
      if (!svgRef.current) return { x: 0, y: 0 };
      const rect = svgRef.current.getBoundingClientRect();
      return {
        x: (clientX - rect.left - pan.x) / zoom,
        y: (clientY - rect.top - pan.y) / zoom,
      };
    },
    [pan, zoom]
  );

  // Event handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button === 1 || (e.button === 0 && e.altKey)) {
        setIsPanning(true);
        setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      }
    },
    [pan]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const svgPoint = getSvgPoint(e.clientX, e.clientY);
      setMousePos(svgPoint);

      if (isPanning) {
        setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
      } else if (draggingState && onStateMove && !readOnly) {
        onStateMove(draggingState, svgPoint);
      }
    },
    [isPanning, panStart, draggingState, onStateMove, readOnly, getSvgPoint]
  );

  const handleMouseUp = useCallback(() => {
    if (connectingFrom && !readOnly) {
      setConnectingFrom(null);
    }
    setIsPanning(false);
    setDraggingState(null);
  }, [connectingFrom, readOnly]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(z => Math.max(0.3, Math.min(2, z * delta)));
  }, []);

  const handleStateMouseDown = useCallback(
    (e: React.MouseEvent, stateId: StateId) => {
      e.stopPropagation();
      if (e.button === 0 && !readOnly) {
        setDraggingState(stateId);
      }
    },
    [readOnly]
  );

  const handleStateClick = useCallback(
    (state: State) => {
      if (connectingFrom && connectingFrom !== state.id && onAddTransition) {
        onAddTransition(connectingFrom, state.id);
        setConnectingFrom(null);
      } else {
        onStateSelect?.(state);
      }
    },
    [connectingFrom, onAddTransition, onStateSelect]
  );

  const handleStartConnection = useCallback(
    (e: React.MouseEvent, stateId: StateId) => {
      e.stopPropagation();
      if (!readOnly) {
        setConnectingFrom(stateId);
      }
    },
    [readOnly]
  );

  // Render transition arrow
  const renderTransition = (transition: Transition) => {
    const from = getStatePosition(transition.fromState);
    const to = getStatePosition(transition.toState);
    if (!from || !to) return null;

    const isSelected = selectedTransitionId === transition.id;
    
    // Calculate edge points
    const fromCenterX = from.x;
    const fromCenterY = from.y;
    const toCenterX = to.x;
    const toCenterY = to.y;

    // Calculate angle
    const angle = Math.atan2(toCenterY - fromCenterY, toCenterX - fromCenterX);
    
    // Calculate start and end points on state boundaries
    const startX = fromCenterX + Math.cos(angle) * (STATE_WIDTH / 2);
    const startY = fromCenterY + Math.sin(angle) * (STATE_HEIGHT / 2);
    const endX = toCenterX - Math.cos(angle) * (STATE_WIDTH / 2 + 10);
    const endY = toCenterY - Math.sin(angle) * (STATE_HEIGHT / 2 + 10);

    // Self-loop handling
    if (transition.fromState === transition.toState) {
      const loopX = fromCenterX;
      const loopY = fromCenterY - STATE_HEIGHT / 2 - 40;
      return (
        <g
          key={transition.id}
          onClick={() => onTransitionSelect?.(transition)}
          className="cursor-pointer"
        >
          <path
            d={`M ${fromCenterX - 20} ${fromCenterY - STATE_HEIGHT / 2} 
                Q ${loopX - 40} ${loopY}, ${loopX} ${loopY} 
                Q ${loopX + 40} ${loopY}, ${fromCenterX + 20} ${fromCenterY - STATE_HEIGHT / 2}`}
            fill="none"
            stroke={isSelected ? '#6366f1' : transition.metadata.color || '#94a3b8'}
            strokeWidth={isSelected ? 3 : 2}
            markerEnd="url(#arrowhead)"
          />
          <text
            x={loopX}
            y={loopY - 10}
            textAnchor="middle"
            className="text-xs fill-slate-600 dark:fill-slate-400"
          >
            {transition.name}
          </text>
        </g>
      );
    }

    // Calculate curve control point
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;
    const curveOffset = 20;
    const perpX = -Math.sin(angle) * curveOffset;
    const perpY = Math.cos(angle) * curveOffset;

    return (
      <g
        key={transition.id}
        onClick={() => onTransitionSelect?.(transition)}
        className="cursor-pointer group"
      >
        <path
          d={`M ${startX} ${startY} Q ${midX + perpX} ${midY + perpY}, ${endX} ${endY}`}
          fill="none"
          stroke={isSelected ? '#6366f1' : transition.metadata.color || '#94a3b8'}
          strokeWidth={isSelected ? 3 : 2}
          markerEnd="url(#arrowhead)"
          className="transition-all duration-200 group-hover:stroke-indigo-500"
        />
        {/* Clickable area */}
        <path
          d={`M ${startX} ${startY} Q ${midX + perpX} ${midY + perpY}, ${endX} ${endY}`}
          fill="none"
          stroke="transparent"
          strokeWidth={15}
        />
        {/* Label */}
        <text
          x={midX + perpX}
          y={midY + perpY - 8}
          textAnchor="middle"
          className="text-xs fill-slate-600 dark:fill-slate-400 pointer-events-none"
        >
          {transition.name}
        </text>
        {/* Approval indicator */}
        {transition.requiresApproval && (
          <g transform={`translate(${midX + perpX + 40}, ${midY + perpY - 12})`}>
            <circle r="8" fill="#f59e0b" />
            <text
              textAnchor="middle"
              dominantBaseline="central"
              className="text-[8px] fill-white font-bold"
            >
              ✓
            </text>
          </g>
        )}
      </g>
    );
  };

  // Render state node
  const renderState = (state: State) => {
    const pos = getStatePosition(state.id);
    if (!pos) return null;

    const isSelected = selectedStateId === state.id;
    const isInitial = state.metadata.isInitial;
    const isFinal = state.metadata.isFinal;

    return (
      <g
        key={state.id}
        transform={`translate(${pos.x - STATE_WIDTH / 2}, ${pos.y - STATE_HEIGHT / 2})`}
        onMouseDown={e => handleStateMouseDown(e, state.id)}
        onClick={() => handleStateClick(state)}
        className="cursor-pointer"
      >
        {/* Initial state marker */}
        {isInitial && (
          <g transform={`translate(-20, ${STATE_HEIGHT / 2})`}>
            <circle r="6" fill="#10b981" />
            <line x1="6" y1="0" x2="15" y2="0" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowhead-green)" />
          </g>
        )}

        {/* State rectangle */}
        <rect
          x="0"
          y="0"
          width={STATE_WIDTH}
          height={STATE_HEIGHT}
          rx="8"
          fill={state.metadata.color || '#6366f1'}
          fillOpacity="0.1"
          stroke={isSelected ? '#6366f1' : state.metadata.color || '#6366f1'}
          strokeWidth={isSelected ? 3 : 2}
          className="transition-all duration-200"
        />

        {/* Final state indicator (double border) */}
        {isFinal && (
          <rect
            x="4"
            y="4"
            width={STATE_WIDTH - 8}
            height={STATE_HEIGHT - 8}
            rx="6"
            fill="none"
            stroke={state.metadata.color || '#6366f1'}
            strokeWidth="1"
            strokeDasharray="4"
          />
        )}

        {/* Icon */}
        <foreignObject x="10" y="10" width="24" height="24">
          <div className="flex items-center justify-center">
            <Icon
              icon={state.metadata.icon || 'solar:record-circle-bold'}
              className="w-5 h-5"
              style={{ color: state.metadata.color }}
            />
          </div>
        </foreignObject>

        {/* State name */}
        <text
          x={STATE_WIDTH / 2}
          y={STATE_HEIGHT / 2 + 5}
          textAnchor="middle"
          className="text-sm font-medium fill-slate-800 dark:fill-slate-200"
        >
          {state.name}
        </text>

        {/* Connection handle */}
        {!readOnly && (
          <g
            transform={`translate(${STATE_WIDTH}, ${STATE_HEIGHT / 2})`}
            onMouseDown={e => handleStartConnection(e, state.id)}
            className="cursor-crosshair opacity-0 group-hover:opacity-100 hover:!opacity-100"
          >
            <circle r="8" fill="#6366f1" className="transition-opacity" />
            <circle r="4" fill="white" />
          </g>
        )}
      </g>
    );
  };

  return (
    <div className="relative w-full h-full min-h-[600px] bg-slate-50 dark:bg-slate-900 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={() => setZoom(z => Math.min(2, z + 0.1))}
          className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          title="Zoom in"
        >
          <Icon icon="solar:magnifer-zoom-in-bold" className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>
        <button
          onClick={() => setZoom(z => Math.max(0.3, z - 0.1))}
          className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          title="Zoom out"
        >
          <Icon icon="solar:magnifer-zoom-out-bold" className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>
        <button
          onClick={() => {
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
          className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          title="Reset view"
        >
          <Icon icon="solar:restart-bold" className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>
      </div>

      {/* Zoom indicator */}
      <div className="absolute bottom-4 left-4 z-10 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-md text-sm text-slate-600 dark:text-slate-400">
        {Math.round(zoom * 100)}%
      </div>

      {/* SVG Canvas */}
      <svg
        ref={svgRef}
        className="w-full h-full"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <defs>
          {/* Arrow markers */}
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
          </marker>
          <marker
            id="arrowhead-green"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" />
          </marker>
          
          {/* Grid pattern */}
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-slate-200 dark:text-slate-700"
            />
          </pattern>
        </defs>

        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* Background grid */}
          <rect
            x={-CANVAS_PADDING}
            y={-CANVAS_PADDING}
            width={2000 + CANVAS_PADDING * 2}
            height={1200 + CANVAS_PADDING * 2}
            fill="url(#grid)"
          />

          {/* Transitions */}
          <g className="transitions">
            {machine.transitions.map(renderTransition)}
          </g>

          {/* Connection line being drawn */}
          {connectingFrom && (
            <line
              x1={getStatePosition(connectingFrom)?.x || 0}
              y1={getStatePosition(connectingFrom)?.y || 0}
              x2={mousePos.x}
              y2={mousePos.y}
              stroke="#6366f1"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          )}

          {/* States */}
          <g className="states">
            {machine.states.map(renderState)}
          </g>
        </g>
      </svg>

      {/* Empty state */}
      {machine.states.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-slate-500 dark:text-slate-400">
            <Icon icon="solar:diagram-down-bold" className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-base font-medium">Select a state machine</p>
            <p className="text-sm">Or create a new one to get started</p>
          </div>
        </div>
      )}
    </div>
  );
};
