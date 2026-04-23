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
    <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-cyber-text-muted mb-1">
            Target Word
          </h2>
          <p className="text-sm text-cyber-text-secondary">
            Sign each letter in order
          </p>
        </div>

        {/* Status badge */}
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.7rem] font-semibold tracking-wider uppercase border
            ${isCompleted
              ? "bg-cyber-success/10 text-cyber-success border-cyber-success/20"
              : charIndex > 0
                ? "bg-cyber-cyan/10 text-cyber-cyan border-cyber-cyan/20"
                : "bg-white/[0.05] text-cyber-text-muted border-white/[0.08]"
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
