"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="w-full h-1 bg-cyber-elevated">
      <motion.div
        className="h-full bg-cyber-cyan rounded-r-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
      />
    </div>
  );
}
