"use client";

import { useMemo } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

function seededUnit(seed: number) {
  const x = Math.sin(seed * 997) * 10000;
  return x - Math.floor(x);
}

export default function FloatingParticles() {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: seededUnit(i + 1) * 100,
      y: seededUnit(i + 21) * 100,
      size: 2 + seededUnit(i + 41) * 3,
      duration: 15 + seededUnit(i + 61) * 20,
      delay: seededUnit(i + 81) * 10,
      opacity: 0.1 + seededUnit(i + 101) * 0.2,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-cyber-cyan"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: p.opacity,
            animation: `float-particle ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}
