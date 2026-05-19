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

const iconStyles = [
  "stat-icon-cyan",
  "stat-icon-green",
  "stat-icon-amber",
  "stat-icon-purple",
];

export default function StatsPanel({
  timer,
  totalCorrect,
  totalAttempts,
  bestStreak,
  wordsCompleted,
}: StatsPanelProps) {
  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  const stats = [
    { icon: Clock, label: "Хугацаа", value: formatTime(timer), color: "text-cyber-cyan" },
    { icon: Target, label: "Нарийвчлал", value: `${accuracy}%`, color: "text-cyber-success" },
    { icon: TrendingUp, label: "Шилдэг", value: `${bestStreak}`, color: "text-cyber-warning" },
    { icon: Trophy, label: "Үг", value: `${wordsCompleted}`, color: "text-cyber-purple" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="app-card flex items-center gap-3 rounded-2xl px-3.5 py-3.5"
        >
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconStyles[i]}`}>
            <stat.icon className={`w-4 h-4 ${stat.color}`} />
          </div>
          <div className="min-w-0">
            <span className="block text-sm font-bold font-mono text-cyber-text tabular-nums">{stat.value}</span>
            <span className="block text-[0.65rem] text-cyber-text-muted font-medium">{stat.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
