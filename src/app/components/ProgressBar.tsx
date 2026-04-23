"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="w-full h-1.5 bg-white/[0.04]">
      <motion.div
        className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple rounded-r-full relative progress-shimmer"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
      />
    </div>
  );
}
