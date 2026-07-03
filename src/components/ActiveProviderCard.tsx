import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';

export default function ActiveProviderCard() {
  const [copied, setCopied] = useState(false);
  const command = 'nimicode providers set deepseek/deepseek-chat';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        boxShadow: [
          '0 0 0 0 rgba(22, 163, 74, 0)',
          '0 0 0 8px rgba(22, 163, 74, 0.15)',
          '0 0 0 16px rgba(22, 163, 74, 0)'
        ]
      }}
      transition={{ 
        opacity: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        y: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        boxShadow: { duration: 1.2, times: [0, 0.5, 1], ease: 'easeInOut' }
      }}
      className="mt-14 bg-surface border-2 border-accent rounded-2xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
    >
      {/* Left Column: Details */}
      <div className="flex flex-col gap-2.5 items-start">
        <div className="flex items-center gap-3">
          <span className="bg-accent text-white text-[10px] font-mono font-bold rounded-full px-2 py-0.5 tracking-wide select-none">
            LIVE
          </span>
          <h3 className="font-heading text-xl font-semibold text-text">
            DeepSeek
          </h3>
        </div>
        <p className="text-text-muted text-sm leading-relaxed">
          OpenAI-compatible API · <code className="font-mono text-xs bg-black/5 px-1.5 py-0.5 rounded text-text font-medium">deepseek-chat</code> / <code className="font-mono text-xs bg-black/5 px-1.5 py-0.5 rounded text-text font-medium">deepseek-coder</code>
        </p>
      </div>

      {/* Right Column: Code Pill */}
      <div className="flex items-center">
        <div className="bg-terminal-bg text-terminal-text font-mono text-xs rounded-lg px-4 py-2.5 inline-flex items-center justify-between gap-3 border border-terminal-border select-all w-full md:w-auto">
          <span className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-accent/60 select-none">$</span>
            <span>{command}</span>
          </span>
          <button
            onClick={handleCopy}
            className="text-terminal-text/50 hover:text-terminal-text transition-colors p-1 rounded hover:bg-white/10 shrink-0"
            title="Copy command to clipboard"
            aria-label="Copy set provider command"
          >
            {copied ? (
              <Check size={14} className="text-accent" />
            ) : (
              <Copy size={14} />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
