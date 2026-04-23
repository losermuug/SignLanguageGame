"use client";

import type { Difficulty } from "../hooks/useGameState";

interface DifficultySelectorProps {
  difficulty: Difficulty;
  onChange: (d: Difficulty) => void;
}

const levels: { key: Difficulty; label: string; color: string; activeColor: string }[] = [
  { key: "easy", label: "Easy", color: "text-cyber-success", activeColor: "bg-cyber-success/15 border-cyber-success/30 text-cyber-success" },
  { key: "medium", label: "Medium", color: "text-cyber-warning", activeColor: "bg-cyber-warning/15 border-cyber-warning/30 text-cyber-warning" },
  { key: "hard", label: "Hard", color: "text-cyber-danger", activeColor: "bg-cyber-danger/15 border-cyber-danger/30 text-cyber-danger" },
];

export default function DifficultySelector({ difficulty, onChange }: DifficultySelectorProps) {
  return (
    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
      {levels.map((lvl) => (
        <button
          key={lvl.key}
          onClick={() => onChange(lvl.key)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer border
            ${difficulty === lvl.key
              ? lvl.activeColor
              : "border-transparent text-cyber-text-muted hover:text-cyber-text-secondary"
            }`}
        >
          {lvl.label}
        </button>
      ))}
    </div>
  );
}
