"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Hand } from "lucide-react";

interface DetectionPanelProps {
  detectedLetter: string | null;
  charIndex: number;
  activeWord: string;
  isCompleted: boolean;
}

export default function DetectionPanel({
  detectedLetter,
  charIndex,
  activeWord,
  isCompleted,
}: DetectionPanelProps) {
  return (
    <div className="backdrop-blur-xl bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-2xl p-6">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-cyber-text-muted mb-4">
        Current Sign
      </h2>

      {/* Detection display */}
      <div className="flex flex-col items-center justify-center gap-2 py-6 rounded-xl border border-cyber-cyan/25 bg-cyber-cyan/[0.04] min-h-[140px]">
        <AnimatePresence mode="wait">
          {detectedLetter ? (
            <motion.span
              key={detectedLetter + charIndex}
              className="text-7xl font-extrabold font-mono text-cyber-cyan"
              style={{ textShadow: "0 0 30px rgba(0,240,255,0.4)" }}
              initial={{ scale: 0.5, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              {detectedLetter}
            </motion.span>
          ) : (
            <motion.div
              key="placeholder"
              className="flex flex-col items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Hand className="w-10 h-10 text-cyber-cyan/30" />
              <span className="text-xs text-cyber-text-muted font-medium">
                Waiting for sign...
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Target hint */}
      {!isCompleted && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-cyber-text-secondary">
          <span>Sign the letter</span>
          <span className="font-mono font-bold text-lg text-cyber-cyan px-2 py-0.5 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/20">
            {activeWord[charIndex]}
          </span>
        </div>
      )}
    </div>
  );
}
