"use client";

import LetterTile from "./LetterTile";

interface WordDisplayProps {
  activeWord: string;
  charIndex: number;
  completedLetters: boolean[];
  isCompleted: boolean;
}

export default function WordDisplay({
  activeWord,
  charIndex,
  completedLetters,
  isCompleted,
}: WordDisplayProps) {
  const doneCount = completedLetters.filter(Boolean).length;

  return (
    <section className="app-card rounded-2xl p-5">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-cyber-text">
            Дадлага үг
          </h2>
          <p className="text-xs text-cyber-text-muted font-mono tabular-nums">
            {doneCount} / {activeWord.length}
          </p>
        </div>

        {/* Status badge */}
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.7rem] font-medium border transition-all duration-300
            ${isCompleted
              ? "bg-cyber-success/10 text-cyber-success border-cyber-success/20 shadow-[0_0_12px_rgba(52,211,153,0.1)]"
              : charIndex > 0
                ? "bg-cyber-cyan/10 text-cyber-cyan border-cyber-cyan/20"
                : "bg-[var(--panel-bg)] text-cyber-text-muted border-[var(--panel-border)]"
            }`}
        >
          <div
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
              isCompleted
                ? "bg-cyber-success live-dot"
                : charIndex > 0
                  ? "bg-cyber-cyan live-dot"
                  : "bg-cyber-text-muted"
            }`}
          />
          {isCompleted ? "Дууссан" : charIndex > 0 ? "Дохиж байна" : "Бэлэн"}
        </span>
      </div>

      {/* Letter tiles */}
      <div className="flex items-center justify-center gap-3 flex-wrap rounded-2xl border border-[var(--panel-border)] bg-gradient-to-b from-[var(--bg-secondary)] to-[var(--bg-elevated)] p-5">
        {activeWord.split("").map((letter, idx) => (
          <LetterTile
            key={`${activeWord}-${idx}`}
            letter={letter}
            index={idx}
            isDone={completedLetters[idx]}
            isActive={idx === charIndex && !isCompleted}
            wordKey={activeWord}
          />
        ))}
      </div>
    </section>
  );
}
