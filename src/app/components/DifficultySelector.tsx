"use client";

import type { Difficulty } from "../hooks/useGameState";

interface DifficultySelectorProps {
  difficulty: Difficulty;
  onChange: (d: Difficulty) => void;
}

const levels: { key: Difficulty; label: string }[] = [
  { key: "easy", label: "Хялбар" },
  { key: "medium", label: "Дунд" },
  { key: "hard", label: "Хүнд" },
];

export default function DifficultySelector({ difficulty, onChange }: DifficultySelectorProps) {
  return (
    <div className="flex w-full md:w-auto items-center gap-1 rounded-xl bg-cyber-elevated/90 border border-[var(--panel-border)] p-1">
      {levels.map((lvl) => (
        <button
          key={lvl.key}
          onClick={() => onChange(lvl.key)}
          className={`flex-1 md:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border
            ${difficulty === lvl.key
              ? "bg-cyber-cyan/12 border-cyber-cyan/30 text-cyber-text shadow-[inset_0_0_0_1px_rgba(45,212,191,0.08)]"
              : "border-transparent text-cyber-text-muted hover:text-cyber-text-secondary"
            }`}
        >
          {lvl.label}
        </button>
      ))}
    </div>
  );
}
