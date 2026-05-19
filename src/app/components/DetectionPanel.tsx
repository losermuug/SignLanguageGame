"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Hand, Sparkles } from "lucide-react";

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
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyber-purple" />
          <h2 className="text-sm font-semibold text-cyber-text">
            Танилт
          </h2>
        </div>
        {!isCompleted && (
          <span className="rounded-full border border-cyber-cyan/20 bg-cyber-cyan/10 px-3 py-1 text-xs font-mono font-bold text-cyber-cyan">
            {activeWord[charIndex]}
          </span>
        )}
      </div>

      {/* Detection display */}
      <div className="relative flex min-h-[140px] flex-col items-center justify-center gap-2 rounded-2xl border border-[var(--panel-border)] bg-gradient-to-b from-[var(--bg-secondary)] to-[var(--bg-elevated)] py-5 overflow-hidden">
        {/* Spotlight effect when letter detected */}
        <AnimatePresence>
          {detectedLetter && (
            <motion.div
              className="absolute inset-0 bg-radial-[at_50%_40%] from-cyber-cyan/10 via-transparent to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {detectedLetter ? (
            <motion.div
              key={detectedLetter + charIndex}
              className="flex flex-col items-center gap-1"
              initial={{ scale: 0.3, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
            >
              <span className="text-7xl font-bold font-mono gradient-text">
                {detectedLetter}
              </span>
              <motion.div
                className="mt-1 h-0.5 w-10 rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-purple"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.15, duration: 0.3 }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              className="flex flex-col items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Hand className="w-9 h-9 text-cyber-text-muted/50" />
              </motion.div>
              <span className="text-xs text-cyber-text-muted font-medium">
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
