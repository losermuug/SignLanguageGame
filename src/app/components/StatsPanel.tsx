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
    <div className="grid grid-cols-4 gap-2">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl bg-white/[0.03] border border-white/[0.06]"
        >
          <stat.icon className={`w-4 h-4 ${stat.color}`} />
          <span className="text-base font-bold font-mono text-cyber-text">
            {stat.value}
          </span>
          <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-cyber-text-muted">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
