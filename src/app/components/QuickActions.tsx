"use client";

import { RotateCcw, ChevronRight } from "lucide-react";

interface QuickActionsProps {
  onReset: () => void;
  onSkip: () => void;
}

export default function QuickActions({ onReset, onSkip }: QuickActionsProps) {
  return (
    <div className="flex gap-3">
      <button
        onClick={onReset}
        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-cyber-elevated border border-white/[0.08] text-cyber-text-secondary hover:border-white/[0.15] hover:text-cyber-text transition-all duration-300 cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Reset
      </button>
      <button
        onClick={onSkip}
        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-cyber-elevated border border-white/[0.08] text-cyber-text-secondary hover:border-white/[0.15] hover:text-cyber-text transition-all duration-300 cursor-pointer"
      >
        Skip Word
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
