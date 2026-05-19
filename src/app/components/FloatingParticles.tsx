"use client";

import { useEffect, useMemo, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  color: string;
  blur: number;
}

const COLORS = [
  "var(--accent-cyan)",
  "var(--accent-purple)",
  "var(--accent-cyan)",
  "var(--accent-purple)",
];

export default function FloatingParticles() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      duration: 18 + Math.random() * 25,
      delay: Math.random() * 12,
      opacity: 0.06 + Math.random() * 0.14,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      blur: Math.random() > 0.5 ? 1 : 0,
    }));
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: p.opacity,
            backgroundColor: p.color,
            filter: p.blur ? `blur(${p.blur}px)` : undefined,
            animation: `float-particle ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}
