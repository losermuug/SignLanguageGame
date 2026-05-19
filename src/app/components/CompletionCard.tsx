"use client";

import { motion } from "framer-motion";
import { Trophy, ChevronRight, RotateCcw, Sparkles } from "lucide-react";

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
      className="relative overflow-hidden backdrop-blur-2xl bg-gradient-to-br from-cyber-success/[0.08] via-cyber-success/[0.03] to-transparent border border-cyber-success/20 rounded-2xl p-6 text-center"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {/* Decorative sparkle */}
      <motion.div
        className="absolute top-3 right-4 text-cyber-warning/60"
        animate={{ rotate: [0, 180, 360], scale: [1, 1.2, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Sparkles className="w-5 h-5" />
      </motion.div>

      <div className="flex flex-col items-center gap-4">
        <motion.div
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyber-success/20 to-emerald-500/10 border border-cyber-success/25 flex items-center justify-center shadow-[var(--glow-success)]"
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Trophy className="w-8 h-8 text-cyber-success" />
        </motion.div>
        <div>
          <h3 className="text-xl font-bold text-cyber-success">
            Үг дууслаа! 🎉
          </h3>
          <p className="text-sm text-cyber-text-secondary mt-1.5">
            +50 нэмэлт оноо
          </p>
        </div>
        <div className="flex gap-3 mt-1">
          <button
            onClick={onNextWord}
            className="btn-shine flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold
              bg-gradient-to-r from-cyber-cyan/15 to-cyber-purple/10
              border border-cyber-cyan/30 text-cyber-cyan
              hover:from-cyber-cyan/25 hover:to-cyber-purple/15 hover:border-cyber-cyan/50
              hover:shadow-[var(--glow-cyan)]
              transition-all duration-300 cursor-pointer"
          >
            Дараагийн үг
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold
              bg-[var(--panel-bg)] border border-[var(--panel-border)] text-cyber-text-secondary
              hover:border-[var(--panel-hover-border)] hover:text-cyber-text
              transition-all duration-300 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Дахин
          </button>
        </div>
      </div>
    </motion.div>
  );
}
