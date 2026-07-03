import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function InstallCommand() {
  const [copied, setCopied] = useState(false);
  const command = 'bun add -g nimicode';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="bg-terminal-bg text-terminal-text font-mono text-sm rounded-lg px-4 py-2.5 inline-flex items-center justify-between gap-3 mt-4 border border-terminal-border select-all">
      <span className="flex items-center gap-2">
        <span className="text-accent/60 select-none">$</span>
        <span>{command}</span>
      </span>
      <button
        onClick={handleCopy}
        className="text-terminal-text/50 hover:text-terminal-text transition-colors p-1 rounded hover:bg-white/10"
        title="Copy to clipboard"
        aria-label="Copy install command"
      >
        {copied ? (
          <Check size={14} className="text-accent" />
        ) : (
          <Copy size={14} />
        )}
      </button>
    </div>
  );
}
