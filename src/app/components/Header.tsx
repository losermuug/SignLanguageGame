"use client";

import { motion } from "framer-motion";
import { Hand, Trophy, Zap } from "lucide-react";
import DifficultySelector from "./DifficultySelector";
import ThemeToggle from "./ThemeToggle";
import type { Difficulty } from "../hooks/useGameState";

interface HeaderProps {
  score: number;
  streak: number;
  wordsCompleted: number;
  difficulty: Difficulty;
  onDifficultyChange: (d: Difficulty) => void;
}

export default function Header({
  score,
  streak,
  wordsCompleted,
  difficulty,
  onDifficultyChange,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 w-full px-4 py-3 lg:px-8 flex items-center justify-between border-b border-[var(--panel-border)] bg-[var(--bg-glass)] backdrop-blur-2xl">
      {/* Logo */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyber-cyan/20 to-cyber-purple/10 border border-cyber-cyan/25 flex items-center justify-center shadow-[var(--glow-cyan)]">
          <Hand className="w-5 h-5 text-cyber-cyan" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight leading-tight gradient-text-animated">
            Дохио Тоглоом
          </h1>
          <p className="text-xs text-cyber-text-secondary">
            Үсгийн дохио давтах
          </p>
        </div>
      </div>

      {/* Center: Difficulty */}
      <div className="hidden md:block">
        <DifficultySelector difficulty={difficulty} onChange={onDifficultyChange} />
      </div>

      {/* Stats + Theme Toggle */}
      <div className="flex items-center gap-2.5">
        <div className="hidden sm:flex items-center gap-2">
          <motion.div
            key={score}
            className="flex items-center gap-2 rounded-full border border-[var(--panel-border)] bg-[var(--panel-bg)] backdrop-blur-xl px-3.5 py-1.5 text-sm"
            title="Оноо"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 0.3 }}
          >
            <Trophy className="w-4 h-4 text-cyber-warning" />
            <span className="font-mono font-bold text-cyber-text tabular-nums">{score}</span>
          </motion.div>
          <motion.div
            key={`streak-${streak}`}
            className="flex items-center gap-2 rounded-full border border-[var(--panel-border)] bg-[var(--panel-bg)] backdrop-blur-xl px-3.5 py-1.5 text-sm"
            title="Дараалал"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 0.3 }}
          >
            <Zap className="w-4 h-4 text-cyber-cyan" />
            <span className="font-mono font-bold text-cyber-text tabular-nums">{streak}</span>
          </motion.div>
          <span className="rounded-full border border-[var(--panel-border)] bg-[var(--panel-bg)] backdrop-blur-xl px-3.5 py-1.5 text-sm text-cyber-text-secondary font-medium tabular-nums">{wordsCompleted} үг</span>
        </div>

        {/* Theme toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
}
