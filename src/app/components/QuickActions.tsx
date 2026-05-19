"use client";

import { RotateCcw, ChevronRight } from "lucide-react";

interface QuickActionsProps {
  onReset: () => void;
  onSkip: () => void;
}

export default function QuickActions({ onReset, onSkip }: QuickActionsProps) {
  return (
    <div className="flex gap-2.5">
      <button
        onClick={onReset}
        className="btn-shine flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold bg-[var(--panel-bg)] border border-[var(--panel-border)] text-cyber-text-secondary hover:border-[var(--panel-hover-border)] hover:text-cyber-text transition-all duration-300 cursor-pointer backdrop-blur-xl"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Дахин эхлэх
      </button>
      <button
        onClick={onSkip}
        className="btn-shine flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyber-cyan/8 to-cyber-purple/5 border border-cyber-cyan/15 text-cyber-text-secondary hover:from-cyber-cyan/14 hover:to-cyber-purple/10 hover:border-cyber-cyan/30 hover:text-cyber-text transition-all duration-300 cursor-pointer"
      >
        Үг алгасах
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
