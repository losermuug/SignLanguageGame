"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="w-full h-[5px] bg-cyber-elevated relative">
      <motion.div
        className="h-full bg-gradient-to-r from-cyber-cyan via-cyber-success to-cyber-warning rounded-r-full progress-shimmer relative"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
      />
      {/* Glow under progress */}
      {progress > 0 && (
        <motion.div
          className="absolute top-full left-0 h-4 rounded-b-full bg-gradient-to-r from-cyber-cyan/20 via-cyber-success/15 to-transparent blur-md"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        />
      )}
    </div>
  );
}
