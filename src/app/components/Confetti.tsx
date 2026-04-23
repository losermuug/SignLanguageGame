"use client";

import { useMemo } from "react";

const COLORS = ["#00f0ff", "#a855f7", "#f472b6", "#34d399", "#fbbf24"];

export default function Confetti() {
  const pieces = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 6 + Math.random() * 6,
      rotation: Math.random() * 360,
    }));
  }, []);

  return (
    <div className="fixed inset-0 z-[999] pointer-events-none">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece rounded-sm"
          style={{
            left: p.left,
            animationDelay: p.delay,
            backgroundColor: p.color,
            width: p.size,
            height: p.size,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}
