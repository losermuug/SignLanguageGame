"use client";

import { motion } from "framer-motion";
import { Flame, Zap } from "lucide-react";

interface ComboDisplayProps {
  streak: number;
  comboMultiplier: number;
}

export default function ComboDisplay({ streak, comboMultiplier }: ComboDisplayProps) {
  if (streak < 2) return null;

  const fireColors = [
    "from-yellow-500 to-orange-500",
    "from-orange-500 to-red-500",
    "from-red-500 to-pink-500",
    "from-pink-500 to-purple-500",
  ];
  const colorIdx = Math.min(comboMultiplier - 1, fireColors.length - 1);

  return (
    <motion.div
      className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Fire icon with pulse */}
      <motion.div
        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${fireColors[colorIdx]} flex items-center justify-center`}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.8 }}
      >
        <Flame className="w-5 h-5 text-white" />
      </motion.div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyber-text-muted">
            Combo
          </span>
          <motion.span
            key={comboMultiplier}
            className={`text-sm font-extrabold font-mono bg-gradient-to-r ${fireColors[colorIdx]} bg-clip-text text-transparent`}
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {comboMultiplier}x
          </motion.span>
        </div>

        {/* Streak bar */}
        <div className="flex items-center gap-1 mt-1">
          {Array.from({ length: Math.min(streak, 15) }, (_, i) => (
            <motion.div
              key={i}
              className={`w-1.5 h-3 rounded-full bg-gradient-to-t ${fireColors[colorIdx]}`}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ delay: i * 0.03 }}
            />
          ))}
          <span className="text-xs font-mono font-bold text-cyber-text-secondary ml-1">
            {streak}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
