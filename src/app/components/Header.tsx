"use client";

import { Hand, Trophy, Zap, Sparkles } from "lucide-react";
import DifficultySelector from "./DifficultySelector";
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
    <header className="w-full px-6 py-4 flex items-center justify-between border-b border-white/[0.06] backdrop-blur-md bg-cyber-bg/60">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyber-cyan/20 to-cyber-purple/20 border border-cyber-cyan/20 flex items-center justify-center">
          <Hand className="w-4.5 h-4.5 text-cyber-cyan" />
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight text-cyber-text">
            Sign<span className="text-cyber-cyan">Lang</span>
          </h1>
          <p className="text-[0.65rem] text-cyber-text-muted tracking-wider uppercase">
            Alphabet Game
          </p>
        </div>
      </div>

      {/* Center: Difficulty */}
      <div className="hidden md:block">
        <DifficultySelector difficulty={difficulty} onChange={onDifficultyChange} />
      </div>

      {/* Stats */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2 text-sm" title="Score">
          <Trophy className="w-4 h-4 text-cyber-warning" />
          <span className="font-mono font-bold text-cyber-text">{score}</span>
        </div>
        <div className="flex items-center gap-2 text-sm" title="Streak">
          <Zap className="w-4 h-4 text-cyber-cyan" />
          <span className="font-mono font-bold text-cyber-text">{streak}</span>
        </div>
        <div className="flex items-center gap-2 text-sm" title="Words completed">
          <Sparkles className="w-4 h-4 text-cyber-purple" />
          <span className="font-mono font-bold text-cyber-text">{wordsCompleted}</span>
        </div>
      </div>
    </header>
  );
}
