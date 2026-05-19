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
    <header className="sticky top-0 z-30 w-full px-4 py-3 lg:px-8 flex items-center justify-between border-b border-[var(--panel-border)] bg-[var(--bg-glass)] backdrop-blur-xl">
      {/* Logo */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl border border-cyber-cyan/25 bg-cyber-cyan/10 flex items-center justify-center shadow-[0_0_28px_rgba(45,212,191,0.16)]">
          <Hand className="w-5 h-5 text-cyber-cyan" />
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-cyber-text leading-tight">
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
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-full border border-[var(--panel-border)] bg-cyber-elevated px-3 py-1.5 text-sm" title="Оноо">
            <Trophy className="w-4 h-4 text-cyber-warning" />
            <span className="font-mono font-semibold text-cyber-text">{score}</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[var(--panel-border)] bg-cyber-elevated px-3 py-1.5 text-sm" title="Дараалал">
            <Zap className="w-4 h-4 text-cyber-cyan" />
            <span className="font-mono font-semibold text-cyber-text">{streak}</span>
          </div>
          <span className="rounded-full border border-[var(--panel-border)] bg-cyber-elevated px-3 py-1.5 text-sm text-cyber-text-secondary">{wordsCompleted} үг</span>
        </div>

        {/* Theme toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
}
