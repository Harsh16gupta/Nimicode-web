import React from 'react';
import { motion } from 'framer-motion';
import { FileText, FilePlus2, SquareTerminal } from 'lucide-react';

interface ToolCard {
  name: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  description: string;
  snippet: {
    command: string;
    result: string;
  };
}

const TOOLS: ToolCard[] = [
  {
    name: 'read_file',
    icon: FileText,
    description: 'Reads the full contents of any file in your workspace before the agent reasons about changes.',
    snippet: {
      command: 'read_file  src/tools/fs.ts',
      result: '✓ read 42 lines'
    }
  },
  {
    name: 'write_file',
    icon: FilePlus2,
    description: 'Writes or creates files, making parent directories automatically. Agent output, applied directly.',
    snippet: {
      command: 'write_file  README.md',
      result: '✓ file created (1.2kb)'
    }
  },
  {
    name: 'execute_command',
    icon: SquareTerminal,
    description: 'Runs shell commands with a 30-second timeout — tests, builds, git, anything your shell can do.',
    snippet: {
      command: 'execute_command  bun test',
      result: '✓ 14 passed, 0 failed'
    }
  }
];

const cardVariants = {
  hidden: { opacity: 0, y: 26 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  })
};

export default function ToolsGrid() {
  return (
    <div className="grid md:grid-cols-3 gap-5 mt-14">
      {TOOLS.map((tool, i) => {
        const IconComponent = tool.icon;
        return (
          <motion.div
            key={tool.name}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="bg-[#0B0B0D] border border-border rounded-xl p-5 flex flex-col justify-between hover:border-zinc-700 transition-colors duration-150"
          >
            <div>
              {/* Top row */}
              <div className="flex items-center gap-2 text-text-muted mb-3">
                <IconComponent size={15} />
                <span className="font-mono text-sm font-bold text-text">
                  {tool.name}
                </span>
              </div>

              {/* Description */}
              <p className="text-text-muted text-xs leading-relaxed font-sans">
                {tool.description}
              </p>
            </div>

            {/* Terminal snippet */}
            <div className="bg-black rounded-lg p-3 mt-5 font-mono text-[11px] text-terminal-text border border-border select-text">
              <div className="flex items-center gap-1.5 mb-1 text-text-muted">
                <span className="text-text-muted/50 select-none font-semibold">→</span>
                <span>{tool.snippet.command}</span>
              </div>
              <div className="text-emerald-400 font-semibold pl-3">
                {tool.snippet.result}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
