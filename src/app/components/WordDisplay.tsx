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
  return (
    <div className="bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-xl p-5">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-cyber-text">
            Word
          </h2>
          <p className="text-xs text-cyber-text-muted">
            Sign the highlighted letter
          </p>
        </div>

        {/* Status badge */}
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.7rem] font-medium border
            ${isCompleted
              ? "bg-cyber-success/10 text-cyber-success border-cyber-success/20"
              : charIndex > 0
                ? "bg-cyber-cyan/10 text-cyber-cyan border-cyber-cyan/20"
                : "bg-[var(--panel-bg)] text-cyber-text-muted border-[var(--panel-border)]"
            }`}
        >
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              isCompleted
                ? "bg-cyber-success"
                : charIndex > 0
                  ? "bg-cyber-cyan"
                  : "bg-cyber-text-muted"
            }`}
          />
          {isCompleted ? "Complete" : charIndex > 0 ? "Signing" : "Ready"}
        </span>
      </div>

      {/* Letter tiles */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
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
    </div>
  );
}
