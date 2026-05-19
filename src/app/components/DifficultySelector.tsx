"use client";

import type { Difficulty } from "../hooks/useGameState";

interface DifficultySelectorProps {
  difficulty: Difficulty;
  onChange: (d: Difficulty) => void;
}

const levels: { key: Difficulty; label: string }[] = [
  { key: "easy", label: "Easy" },
  { key: "medium", label: "Medium" },
  { key: "hard", label: "Hard" },
];

export default function DifficultySelector({ difficulty, onChange }: DifficultySelectorProps) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-cyber-elevated border border-[var(--panel-border)]">
      {levels.map((lvl) => (
        <button
          key={lvl.key}
          onClick={() => onChange(lvl.key)}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer border
            ${difficulty === lvl.key
              ? "bg-cyber-surface border-[var(--panel-hover-border)] text-cyber-text"
              : "border-transparent text-cyber-text-muted hover:text-cyber-text-secondary"
            }`}
        >
          {lvl.label}
        </button>
      ))}
    </div>
  );
}
