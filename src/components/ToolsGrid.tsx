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
            className="bg-surface border border-border rounded-2xl p-6 flex flex-col justify-between hover:border-accent hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
          >
            <div>
              {/* Top row */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent-soft flex items-center justify-center text-accent">
                  <IconComponent size={20} />
                </div>
                <span className="font-mono text-lg font-semibold text-text">
                  {tool.name}
                </span>
              </div>

              {/* Description */}
              <p className="text-text-muted text-sm mt-3 leading-relaxed">
                {tool.description}
              </p>
            </div>

            {/* Terminal snippet */}
            <div className="bg-terminal-bg rounded-lg p-3 mt-5 font-mono text-xs text-terminal-text border border-terminal-border select-text">
              <div className="flex items-center gap-1.5 mb-1 text-terminal-text/80">
                <span className="text-accent select-none font-semibold">→</span>
                <span>{tool.snippet.command}</span>
              </div>
              <div className="text-[#4ADE80] font-semibold pl-3">
                {tool.snippet.result}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
