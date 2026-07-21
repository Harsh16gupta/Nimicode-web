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
      }}
      transition={{ 
        opacity: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        y: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      }}
      className="mt-14 bg-[#0B0B0D] border border-border hover:border-zinc-700 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors duration-150"
    >
      {/* Left Column: Details */}
      <div className="flex flex-col gap-2.5 items-start">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold text-accent select-none">
            [LIVE]
          </span>
          <h3 className="font-heading text-lg font-bold text-text">
            DeepSeek
          </h3>
        </div>
        <p className="text-text-muted text-xs leading-relaxed">
          OpenAI-compatible API · <code className="font-mono text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-text font-medium">deepseek-chat</code> / <code className="font-mono text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-text font-medium">deepseek-coder</code>
        </p>
      </div>

      {/* Right Column: Code Pill */}
      <div className="flex items-center">
        <div className="bg-black text-zinc-300 font-mono text-xs rounded-lg px-4 py-2 flex items-center justify-between gap-3 border border-border select-all w-full md:w-auto">
          <span className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-text-muted/40 select-none font-bold">$</span>
            <span>{command}</span>
          </span>
          <button
            onClick={handleCopy}
            className="text-text-muted hover:text-text transition-colors p-1 rounded hover:bg-white/5 shrink-0"
            title="Copy command to clipboard"
            aria-label="Copy set provider command"
          >
            {copied ? (
              <Check size={12} className="text-accent" />
            ) : (
              <Copy size={12} />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
