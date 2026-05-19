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
    <section className="app-card rounded-2xl p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-cyber-text">
          Танилт
        </h2>
        {!isCompleted && (
          <span className="rounded-full border border-[var(--panel-border)] bg-cyber-elevated px-2.5 py-1 text-xs font-mono font-semibold text-cyber-text">
            {activeWord[charIndex]}
          </span>
        )}
      </div>

      {/* Detection display */}
      <div className="flex min-h-[132px] flex-col items-center justify-center gap-2 rounded-2xl border border-[var(--panel-border)] bg-cyber-surface/80 py-5">
        <AnimatePresence mode="wait">
          {detectedLetter ? (
            <motion.span
              key={detectedLetter + charIndex}
              className="text-7xl font-semibold font-mono text-cyber-text"
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
                Дохио хүлээж байна
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Target hint */}
    </section>
  );
}
