import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function InstallCommand() {
  const [copied, setCopied] = useState(false);
  const command = 'bun create nimicode';

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
    <div className="bg-white/[0.02] text-zinc-300 font-mono text-xs rounded-lg px-4 py-2.5 inline-flex items-center justify-between gap-4 mt-6 border border-border select-all w-full sm:w-auto">
      <span className="flex items-center gap-2">
        <span className="text-text-muted/40 select-none font-bold">$</span>
        <span>{command}</span>
      </span>
      <button
        onClick={handleCopy}
        className="text-text-muted hover:text-text transition-colors p-1 rounded hover:bg-white/5"
        title="Copy to clipboard"
        aria-label="Copy install command"
      >
        {copied ? (
          <Check size={12} className="text-accent" />
        ) : (
          <Copy size={12} />
        )}
      </button>
    </div>
  );
}
