import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface ChecklistItem {
  label: string;
  status: 'idle' | 'active' | 'done';
}

interface ExecutorLog {
  type: 'cmd' | 'text' | 'success' | 'err' | 'steer';
  content: string;
}

interface SimulationStep {
  plannerChecklist: ChecklistItem[];
  executorLogs: ExecutorLog[];
  loopNumber: number;
}

const SIM_STEPS: SimulationStep[] = [
  {
    loopNumber: 1,
    plannerChecklist: [
      { label: 'Read src/utils/math.ts', status: 'active' },
      { label: 'Locate division-by-zero risk', status: 'idle' },
      { label: 'Patch division function', status: 'idle' },
      { label: 'Verify all tests pass', status: 'idle' }
    ],
    executorLogs: [
      { type: 'cmd', content: 'nimicode read_file src/utils/math.ts' },
      { type: 'text', content: 'reading 42 lines...' },
      { type: 'success', content: '✓ read successful. Planner analysis started.' }
    ]
  },
  {
    loopNumber: 1,
    plannerChecklist: [
      { label: 'Read src/utils/math.ts', status: 'done' },
      { label: 'Locate division-by-zero risk', status: 'active' },
      { label: 'Patch division function', status: 'idle' },
      { label: 'Verify all tests pass', status: 'idle' }
    ],
    executorLogs: [
      { type: 'cmd', content: 'bun test' },
      { type: 'text', content: 'running test suite...' },
      { type: 'err', content: '✖ 1 test failed: test/math.test.ts (divide_by_zero)' },
      { type: 'text', content: 'Error: Cannot divide by zero at divide (math.ts:12)' }
    ]
  },
  {
    loopNumber: 2,
    plannerChecklist: [
      { label: 'Read src/utils/math.ts', status: 'done' },
      { label: 'Locate division-by-zero risk', status: 'done' },
      { label: 'Patch division function', status: 'active' },
      { label: 'Verify all tests pass', status: 'idle' }
    ],
    executorLogs: [
      { type: 'cmd', content: 'nimicode write_file src/utils/math.ts' },
      { type: 'text', content: 'applying guard clause to division function...' },
      { type: 'success', content: '✓ math.ts successfully updated locally.' }
    ]
  },
  {
    loopNumber: 2,
    plannerChecklist: [
      { label: 'Read src/utils/math.ts', status: 'done' },
      { label: 'Locate division-by-zero risk', status: 'done' },
      { label: 'Patch division function', status: 'done' },
      { label: 'Verify all tests pass', status: 'active' }
    ],
    executorLogs: [
      { type: 'cmd', content: 'bun test' },
      { type: 'text', content: 'running verification tests...' },
      { type: 'success', content: '✓ 12 tests passed, 0 failed.' }
    ]
  },
  {
    loopNumber: 2,
    plannerChecklist: [
      { label: 'Read src/utils/math.ts', status: 'done' },
      { label: 'Locate division-by-zero risk', status: 'done' },
      { label: 'Patch division function', status: 'done' },
      { label: 'Verify all tests pass', status: 'done' }
    ],
    executorLogs: [
      { type: 'text', content: 'Git-Diff Watchdog: reviewing changes...' },
      { type: 'success', content: '✓ clean diff verified: no console logs found' },
      { type: 'steer', content: 'Executor paused. Accept change? [y/n/s]: s' },
      { type: 'text', content: 'Steering Executor: "don\'t use Axios, use standard fetch"' }
    ]
  }
];

export default function TerminalDemo() {
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      timer.current = setTimeout(() => {
        setStepIndex((prev) => (prev + 1) % SIM_STEPS.length);
      }, 3800);
    }
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [stepIndex, isPlaying]);

  const currentStep = SIM_STEPS[stepIndex];

  return (
    <div className="w-full flex flex-col font-mono text-[11px] sm:text-xs">
      
      {/* TUI Container */}
      <div className="w-full bg-[#030712] border border-border rounded-lg shadow-2xl flex flex-col min-h-[360px] overflow-hidden select-none">
        
        {/* TUI Titlebar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-black/40 text-text-muted">
          <div className="flex items-center gap-1.5 font-bold">
            <span>[ nimicode ]</span>
          </div>
          <span className="text-[10px] text-text-muted/60">
            Planner-Executor Loop v0.1.0
          </span>
          <span className="text-[10px] text-accent">
            Loop: {currentStep.loopNumber}
          </span>
        </div>

        {/* Panes Area */}
        <div className="flex flex-col md:flex-row flex-grow divide-y md:divide-y-0 md:divide-x divide-border">
          
          {/* Planner Pane (Left) */}
          <div className="w-full md:w-[45%] p-4 flex flex-col gap-3">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
              ┌── Planner (Architect) ───────────────
            </span>
            <ul className="space-y-2 flex-grow">
              {currentStep.plannerChecklist.map((item, idx) => {
                const isActive = item.status === 'active';
                const isDone = item.status === 'done';
                return (
                  <li
                    key={idx}
                    className={`flex items-start gap-2.5 transition-colors ${
                      isActive ? 'text-accent font-semibold' : isDone ? 'text-text-muted/50' : 'text-text-muted/70'
                    }`}
                  >
                    <span>
                      {isDone ? '●' : isActive ? '⠋' : '○'}
                    </span>
                    <span className="leading-none">{item.label}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Executor Pane (Right) */}
          <div className="w-full md:w-[55%] p-4 flex flex-col gap-3">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
              ┌── Executor (Builder) ────────────────
            </span>
            <div className="flex-grow flex flex-col justify-between min-h-[160px]">
              <div className="space-y-2">
                {currentStep.executorLogs.map((log, idx) => {
                  if (log.type === 'cmd') {
                    return (
                      <div key={idx} className="flex items-start gap-1.5 text-text">
                        <span className="text-text-muted/50 font-bold">$</span>
                        <span className="font-medium break-all">{log.content}</span>
                      </div>
                    );
                  } else if (log.type === 'err') {
                    return (
                      <div key={idx} className="text-red-400 font-semibold break-all pl-3">
                        {log.content}
                      </div>
                    );
                  } else if (log.type === 'success') {
                    return (
                      <div key={idx} className="text-emerald-400 font-semibold pl-3">
                        {log.content}
                      </div>
                    );
                  } else if (log.type === 'steer') {
                    return (
                      <div key={idx} className="text-accent font-bold pl-3 animate-pulse">
                        {log.content}
                      </div>
                    );
                  } else {
                    return (
                      <div key={idx} className="text-text-muted/75 pl-3">
                        {log.content}
                      </div>
                    );
                  }
                })}
              </div>

              {/* Cursor indicator */}
              {isPlaying && stepIndex !== SIM_STEPS.length - 1 && (
                <div className="flex items-center gap-1.5 text-text-muted/30">
                  <span className="animate-blink block w-1.5 h-3 bg-text-muted/50" />
                  <span className="text-[9px] uppercase tracking-wider">compiling...</span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* TUI Status Bar (Controls inside) */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-black/40 text-[10px] text-text-muted/65 select-none font-sans">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1 hover:text-text transition-colors"
            >
              {isPlaying ? <Pause size={10} /> : <Play size={10} />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            <button
              onClick={() => {
                setStepIndex(0);
                setIsPlaying(false);
              }}
              className="flex items-center gap-1 hover:text-text transition-colors"
            >
              <RotateCcw size={10} />
              <span>Reset</span>
            </button>
          </div>
          <div className="flex items-center gap-3 font-mono">
            <span>[Step: {stepIndex + 1}/{SIM_STEPS.length}]</span>
            <div className="flex gap-1">
              {SIM_STEPS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsPlaying(false);
                    setStepIndex(idx);
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === stepIndex ? 'bg-accent' : 'bg-white/10 hover:bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
