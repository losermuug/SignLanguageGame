"use client";

import { Clock, Target, Trophy, TrendingUp } from "lucide-react";

interface StatsPanelProps {
  timer: number;
  totalCorrect: number;
  totalAttempts: number;
  bestStreak: number;
  wordsCompleted: number;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function StatsPanel({
  timer,
  totalCorrect,
  totalAttempts,
  bestStreak,
  wordsCompleted,
}: StatsPanelProps) {
  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  const stats = [
    { icon: Clock, label: "Time", value: formatTime(timer), color: "text-cyber-cyan" },
    { icon: Target, label: "Accuracy", value: `${accuracy}%`, color: "text-cyber-success" },
    { icon: TrendingUp, label: "Best Streak", value: `${bestStreak}`, color: "text-cyber-warning" },
    { icon: Trophy, label: "Words", value: `${wordsCompleted}`, color: "text-cyber-purple" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-3 rounded-xl bg-[var(--panel-bg)] border border-[var(--panel-border)] px-3 py-3"
        >
          <stat.icon className={`w-4 h-4 shrink-0 ${stat.color}`} />
          <div className="min-w-0">
            <span className="block text-sm font-semibold font-mono text-cyber-text">{stat.value}</span>
            <span className="block text-[0.68rem] text-cyber-text-muted">{stat.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
