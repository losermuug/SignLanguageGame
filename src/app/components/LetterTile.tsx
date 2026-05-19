"use client";

import { motion } from "framer-motion";

interface LetterTileProps {
  letter: string;
  index: number;
  isDone: boolean;
  isActive: boolean;
  wordKey: string;
}

export default function LetterTile({
  letter,
  index,
  isDone,
  isActive,
  wordKey,
}: LetterTileProps) {
  return (
    <motion.div
      key={`${wordKey}-${index}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.45, ease: "easeOut" }}
    >
      <motion.div
        className={`relative flex h-14 w-12 items-center justify-center rounded-xl border-2 text-xl font-bold font-mono uppercase transition-all duration-300
          ${isDone
            ? "text-cyber-success border-cyber-success/40 bg-gradient-to-b from-cyber-success/15 to-cyber-success/5 shadow-[0_0_20px_rgba(52,211,153,0.12)]"
            : isActive
              ? "text-cyber-text border-cyber-cyan/50 bg-gradient-to-b from-cyber-cyan/15 to-cyber-cyan/5 shadow-[0_0_28px_rgba(45,212,191,0.2)]"
              : "text-cyber-text-muted border-[var(--panel-border)] bg-[var(--panel-bg)]"
          }`}
        whileHover={{ y: -3, scale: 1.04 }}
        animate={
          isDone
            ? { scale: [1, 1.18, 1], transition: { duration: 0.4 } }
            : isActive
              ? { y: [0, -4, 0], transition: { duration: 1.4, repeat: Infinity, ease: "easeInOut" } }
              : {}
        }
      >
        {letter}

        {/* Active glow ring */}
        {isActive && (
          <motion.div
            className="absolute inset-[-3px] rounded-xl border border-cyber-cyan/30"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        {/* Checkmark badge */}
        {isDone && (
          <motion.div
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-br from-cyber-success to-emerald-600 flex items-center justify-center shadow-[0_0_10px_rgba(52,211,153,0.3)]"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
