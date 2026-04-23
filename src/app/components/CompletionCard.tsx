"use client";

import { motion } from "framer-motion";
import { Trophy, ChevronRight, RotateCcw } from "lucide-react";

interface CompletionCardProps {
  onNextWord: () => void;
  onRetry: () => void;
}

export default function CompletionCard({
  onNextWord,
  onRetry,
}: CompletionCardProps) {
  return (
    <motion.div
      className="backdrop-blur-xl bg-cyber-success/[0.05] border border-cyber-success/20 rounded-2xl p-6 text-center"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-cyber-success/10 border border-cyber-success/20 flex items-center justify-center">
          <Trophy className="w-7 h-7 text-cyber-success" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-cyber-success">
            Word Complete!
          </h3>
          <p className="text-sm text-cyber-text-secondary mt-1">
            +50 bonus points
          </p>
        </div>
        <div className="flex gap-3 mt-2">
          <button
            onClick={onNextWord}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
              bg-gradient-to-r from-cyber-cyan/15 to-cyber-purple/10
              border border-cyber-cyan/30 text-cyber-cyan
              hover:from-cyber-cyan/25 hover:to-cyber-purple/15 hover:border-cyber-cyan/50
              transition-all duration-300 cursor-pointer"
          >
            Next Word
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
              bg-cyber-elevated border border-[var(--panel-border)] text-cyber-text-secondary
              hover:border-[var(--panel-hover-border)] hover:text-cyber-text
              transition-all duration-300 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    </motion.div>
  );
}
