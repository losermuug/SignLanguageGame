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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
    >
      <motion.div
        className={`relative flex items-center justify-center w-12 h-14 rounded-xl text-xl font-semibold font-mono uppercase border transition-colors
          ${isDone
            ? "text-cyber-success border-cyber-success/30 bg-cyber-success/[0.08]"
            : isActive
              ? "text-cyber-text border-cyber-cyan/50 bg-cyber-cyan/[0.12]"
              : "text-cyber-text-secondary border-[var(--panel-border)] bg-cyber-surface"
          }`}
        animate={
          isDone ? { scale: [1, 1.2, 1], transition: { duration: 0.4 } } : {}
        }
      >
        {letter}

        {/* Checkmark badge */}
        {isDone && (
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyber-success flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
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
