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
    <div className="bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-xl p-5">
      <h2 className="text-sm font-semibold text-cyber-text mb-3">
        Detected
      </h2>

      {/* Detection display */}
      <div className="flex flex-col items-center justify-center gap-2 py-5 rounded-xl border border-[var(--panel-border)] bg-cyber-surface min-h-[120px]">
        <AnimatePresence mode="wait">
          {detectedLetter ? (
            <motion.span
              key={detectedLetter + charIndex}
              className="text-6xl font-semibold font-mono text-cyber-text"
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
              <Hand className="w-8 h-8 text-cyber-text-muted/70" />
              <span className="text-xs text-cyber-text-secondary font-medium">
                Waiting for sign
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Target hint */}
      {!isCompleted && (
        <div className="mt-3 flex items-center justify-center gap-2 text-sm text-cyber-text-secondary">
          <span>Target</span>
          <span className="font-mono font-semibold text-base text-cyber-text px-2 py-0.5 rounded-md bg-cyber-elevated border border-[var(--panel-border)]">
            {activeWord[charIndex]}
          </span>
        </div>
      )}
    </div>
  );
}
