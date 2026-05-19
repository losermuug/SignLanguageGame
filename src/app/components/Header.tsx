"use client";

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
    <header className="w-full px-4 py-3 lg:px-8 flex items-center justify-between border-b border-[var(--panel-border)] bg-[var(--bg-glass)]">
      {/* Logo */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-lg bg-cyber-elevated border border-[var(--panel-border)] flex items-center justify-center">
          <Hand className="w-4.5 h-4.5 text-cyber-cyan" />
        </div>
        <div>
          <h1 className="text-base font-semibold tracking-tight text-cyber-text">
            SignLang
          </h1>
          <p className="text-xs text-cyber-text-muted">
            ASL alphabet practice
          </p>
        </div>
      </div>

      {/* Center: Difficulty */}
      <div className="hidden md:block">
        <DifficultySelector difficulty={difficulty} onChange={onDifficultyChange} />
      </div>

      {/* Stats + Theme Toggle */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm" title="Score">
            <Trophy className="w-4 h-4 text-cyber-text-muted" />
            <span className="font-mono font-semibold text-cyber-text">{score}</span>
          </div>
          <div className="flex items-center gap-2 text-sm" title="Streak">
            <Zap className="w-4 h-4 text-cyber-text-muted" />
            <span className="font-mono font-semibold text-cyber-text">{streak}</span>
          </div>
          <span className="text-sm text-cyber-text-muted">{wordsCompleted} words</span>
        </div>

        {/* Theme toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
}
