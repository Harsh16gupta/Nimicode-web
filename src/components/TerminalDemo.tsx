import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DemoTab {
  name: string;
  prompt: string;
  steps: {
    type: 'tool' | 'success' | 'failure';
    content: string;
  }[];
  summary: string;
}

const DEMO_DATA: DemoTab[] = [
  {
    name: "refactor fs.ts",
    prompt: "refactor src/tools/fs.ts to use async/await",
    steps: [
      { type: 'tool', content: 'read_file  src/tools/fs.ts' },
      { type: 'success', content: 'read 42 lines' },
      { type: 'tool', content: 'write_file  src/tools/fs.ts' },
      { type: 'success', content: 'file updated' }
    ],
    summary: "Refactored fs.ts to use async/await. All 3 exported functions updated, no breaking changes."
  },
  {
    name: "generate readme",
    prompt: "generate a README.md for this workspace",
    steps: [
      { type: 'tool', content: 'read_dir  .' },
      { type: 'success', content: 'found 12 files' },
      { type: 'tool', content: 'write_file  README.md' },
      { type: 'success', content: 'README.md created' }
    ],
    summary: "Created README.md with project description, installation steps, and code examples based on files in the workspace."
  },
  {
    name: "fix failing test",
    prompt: "run tests and fix any failures",
    steps: [
      { type: 'tool', content: 'run_command  bun test' },
      { type: 'failure', content: '1 test failed: test/math.test.ts' },
      { type: 'tool', content: 'write_file  src/math.ts' },
      { type: 'success', content: 'math.ts fixed' },
      { type: 'tool', content: 'run_command  bun test' },
      { type: 'success', content: '12 tests passed' }
    ],
    summary: "Ran tests, identified math.ts division-by-zero error, corrected the function, and verified all tests pass."
  }
];

const SPINNER_CHARS = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

export default function TerminalDemo() {
  const [activeTab, setActiveTab] = useState(0);
  const [phase, setPhase] = useState<'typing-prompt' | 'thinking' | 'showing-steps' | 'typing-summary' | 'completed'>('typing-prompt');
  
  const [typedPrompt, setTypedPrompt] = useState('');
  const [typedSummary, setTypedSummary] = useState('');
  const [visibleStepsCount, setVisibleStepsCount] = useState(0);
  const [spinnerIndex, setSpinnerIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  
  const tabData = DEMO_DATA[activeTab];
  
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const intervalsRef = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimers = () => {
    timersRef.current.forEach(clearTimeout);
    intervalsRef.current.forEach(clearInterval);
    timersRef.current = [];
    intervalsRef.current = [];
  };

  // Run terminal sequence
  useEffect(() => {
    clearAllTimers();
    
    // 1. Reset state for current tab
    setPhase('typing-prompt');
    setTypedPrompt('');
    setTypedSummary('');
    setVisibleStepsCount(0);
    
    // Typewriter effect for prompt
    let charIdx = 0;
    const fullPrompt = `nimicode agent -p "${tabData.prompt}"`;
    
    const promptInterval = setInterval(() => {
      if (charIdx < fullPrompt.length) {
        setTypedPrompt(fullPrompt.slice(0, charIdx + 1));
        charIdx++;
      } else {
        clearInterval(promptInterval);
        
        // 2. Transition to Thinking phase
        const t1 = setTimeout(() => {
          setPhase('thinking');
          
          // Spinner animation
          const spinnerInt = setInterval(() => {
            setSpinnerIndex((prev) => (prev + 1) % SPINNER_CHARS.length);
          }, 80);
          intervalsRef.current.push(spinnerInt);
          
          // 3. Transition to Tool calls
          const t2 = setTimeout(() => {
            clearInterval(spinnerInt);
            setPhase('showing-steps');
            
            // Incrementally reveal tool calls and successes
            let stepIdx = 0;
            const revealNextStep = () => {
              if (stepIdx < tabData.steps.length) {
                setVisibleStepsCount(stepIdx + 1);
                stepIdx++;
                const stepDelay = tabData.steps[stepIdx - 1].type === 'tool' ? 600 : 800;
                const tStep = setTimeout(revealNextStep, stepDelay);
                timersRef.current.push(tStep);
              } else {
                // 4. Transition to Typing Summary
                const tSummaryStart = setTimeout(() => {
                  setPhase('typing-summary');
                  
                  let summaryCharIdx = 0;
                  const summaryInterval = setInterval(() => {
                    if (summaryCharIdx < tabData.summary.length) {
                      setTypedSummary(tabData.summary.slice(0, summaryCharIdx + 1));
                      summaryCharIdx++;
                    } else {
                      clearInterval(summaryInterval);
                      
                      // 5. Sequence Completed
                      setPhase('completed');
                      
                      // 6. Hold and cycle to next if autoplay
                      if (isAutoplay) {
                        const tNext = setTimeout(() => {
                          setActiveTab((prev) => (prev + 1) % DEMO_DATA.length);
                        }, 2500);
                        timersRef.current.push(tNext);
                      }
                    }
                  }, 25);
                  intervalsRef.current.push(summaryInterval);
                }, 400);
                timersRef.current.push(tSummaryStart);
              }
            };
            
            revealNextStep();
          }, 1200);
          timersRef.current.push(t2);
        }, 300);
        timersRef.current.push(t1);
      }
    }, 35);
    
    intervalsRef.current.push(promptInterval);

    return () => clearAllTimers();
  }, [activeTab, isAutoplay]);

  // Tab click handler
  const handleTabClick = (idx: number) => {
    setIsAutoplay(false);
    setActiveTab(idx);
  };

  const containerVariants = {
    hidden: { opacity: 0, x: 24 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { delay: 0.20, duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full flex flex-col"
    >
      {/* 3 tabs above the terminal window */}
      <div className="flex flex-wrap gap-2 mb-3">
        {DEMO_DATA.map((tab, idx) => {
          const isActive = idx === activeTab;
          return (
            <button
              key={idx}
              onClick={() => handleTabClick(idx)}
              className={`text-xs font-mono px-3 py-1.5 rounded-full border transition-all duration-200 ${
                isActive
                  ? 'bg-accent-soft border-accent/20 text-accent font-medium shadow-sm'
                  : 'bg-white/80 border-border text-text-muted hover:text-text hover:bg-white'
              }`}
            >
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Terminal window frame */}
      <div className="w-full bg-terminal-bg rounded-xl border border-terminal-border shadow-[0_24px_64px_rgba(20,22,26,0.16)] flex flex-col overflow-hidden max-w-[560px]">
        {/* Titlebar chrome */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-terminal-border bg-terminal-bg select-none">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57] hover:brightness-75 transition-all" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E] hover:brightness-75 transition-all" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28C840] hover:brightness-75 transition-all" />
          </div>
          <span className="font-mono text-xs text-terminal-text/40 font-medium">
            nimicode — agent
          </span>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Terminal Body */}
        <div className="p-5 font-mono text-[13px] leading-relaxed text-terminal-text min-h-[290px] flex flex-col justify-between">
          <div className="space-y-2.5 flex-grow">
            {/* Prompt typewriter input line */}
            <div className="flex items-start gap-2">
              <span className="text-accent select-none font-bold">$</span>
              <span className="break-all whitespace-pre-wrap">{typedPrompt}</span>
              {phase === 'typing-prompt' && (
                <span className="inline-block w-1.5 h-4 bg-terminal-text/80 animate-blink" />
              )}
            </div>

            {/* Spinner loader section */}
            {(phase === 'thinking' || phase === 'showing-steps' || phase === 'typing-summary' || phase === 'completed') && (
              <AnimatePresence>
                {phase === 'thinking' && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-terminal-text/50 flex items-center gap-2 select-none"
                  >
                    <span>{SPINNER_CHARS[spinnerIndex]}</span>
                    <span className="animate-pulse">thinking...</span>
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {/* Staggered execution logs list */}
            {(phase === 'showing-steps' || phase === 'typing-summary' || phase === 'completed') && (
              <div className="space-y-1.5">
                {tabData.steps.slice(0, visibleStepsCount).map((step, sIdx) => {
                  if (step.type === 'tool') {
                    return (
                      <motion.div
                        key={sIdx}
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-l-2 border-accent pl-3 my-2 text-terminal-text/80"
                      >
                        <span className="text-accent select-none">→</span> {step.content}
                      </motion.div>
                    );
                  } else {
                    const isFailure = step.type === 'failure';
                    return (
                      <motion.div
                        key={sIdx}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className={`pl-4 text-xs font-semibold ${isFailure ? 'text-red-400' : 'text-[#4ADE80]'}`}
                      >
                        {step.content}
                      </motion.div>
                    );
                  }
                })}
              </div>
            )}

            {/* streaming agent final summary markdown output */}
            {(phase === 'typing-summary' || phase === 'completed') && (
              <div className="border-t border-terminal-border/40 mt-4 pt-3 flex items-start gap-2 text-terminal-text/90">
                <p className="whitespace-pre-wrap select-text">
                  {typedSummary}
                  {phase === 'typing-summary' && (
                    <span className="inline-block w-1.5 h-4 bg-accent animate-blink ml-0.5" />
                  )}
                  {phase === 'completed' && (
                    <span className="inline-block w-1.5 h-4 bg-terminal-text/50 animate-blink ml-0.5" />
                  )}
                </p>
              </div>
            )}
          </div>
          
          {/* Loop/Autoplay badge indicator at the bottom edge */}
          <div className="mt-4 pt-2 border-t border-terminal-border/20 flex items-center justify-between text-[10px] text-terminal-text/30 select-none">
            <span>LLM: DeepSeek-Coder-V3</span>
            {isAutoplay ? (
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span>autoplay looping</span>
              </span>
            ) : (
              <button 
                onClick={() => setIsAutoplay(true)} 
                className="hover:text-accent transition-colors"
                title="Resume autoplay cycle"
              >
                ▶ click to resume loop
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
