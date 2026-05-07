"use client";

import { useMemo } from "react";

const COLORS = ["#00f0ff", "#a855f7", "#f472b6", "#34d399", "#fbbf24"];

function seededUnit(seed: number) {
  const x = Math.sin(seed * 999) * 10000;
  return x - Math.floor(x);
}

export default function Confetti() {
  const pieces = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: `${seededUnit(i + 1) * 100}%`,
      delay: `${seededUnit(i + 41) * 2}s`,
      color: COLORS[Math.floor(seededUnit(i + 81) * COLORS.length)],
      size: 6 + seededUnit(i + 121) * 6,
      rotation: seededUnit(i + 161) * 360,
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
