"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

/* Descriptions for every ASL letter */
const ASL_HINTS: Record<string, string> = {
  A: "Fist with thumb beside index finger",
  B: "Flat hand, fingers up, thumb across palm",
  C: "Curved hand like holding a ball",
  D: "Index up, other fingers touch thumb",
  E: "Fingers curled down, thumb tucked",
  F: "OK sign — thumb & index touch, others up",
  G: "Fist, index & thumb point sideways",
  H: "Index & middle point sideways together",
  I: "Fist with pinky raised",
  J: "Pinky raised, trace J shape in air",
  K: "Index & middle up, thumb between them",
  L: "L-shape — index up, thumb out",
  M: "Thumb under three fingers",
  N: "Thumb under two fingers",
  O: "All fingertips touch thumb — O shape",
  P: "Like K, but pointed downward",
  Q: "Like G, but pointed downward",
  R: "Cross index & middle fingers",
  S: "Fist with thumb over fingers",
  T: "Thumb between index & middle",
  U: "Index & middle up together",
  V: "Peace sign — index & middle spread",
  W: "Three fingers up — index, middle, ring",
  X: "Index finger hooked/bent",
  Y: "Thumb & pinky out — hang loose",
  Z: "Index finger traces Z shape in air",
};

/* Letters that have generated images in /asl/ */
const LETTERS_WITH_IMAGES = new Set([
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
]);

interface ASLReferenceProps {
  letter: string;
}

export default function ASLReference({ letter }: ASLReferenceProps) {
  const upperLetter = letter.toUpperCase();
  const hint = ASL_HINTS[upperLetter] || "No hint available";
  const hasImage = LETTERS_WITH_IMAGES.has(upperLetter);
  const [imgError, setImgError] = useState(false);

  const letterColor = useMemo(() => {
    const hue = ((upperLetter.charCodeAt(0) - 65) / 26) * 360;
    return `hsl(${hue}, 70%, 60%)`;
  }, [upperLetter]);

  return (
    <motion.div
      className="backdrop-blur-xl bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-2xl p-5 overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xs font-semibold uppercase tracking-widest text-cyber-text-muted mb-3">
        ASL Reference
      </h2>

      <div className="flex gap-4">
        {/* Left: info */}
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          {/* Letter badge + label */}
          <div className="flex items-center gap-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={upperLetter}
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-extrabold font-mono border-2 shrink-0"
                style={{
                  color: letterColor,
                  borderColor: `${letterColor}40`,
                  backgroundColor: `${letterColor}10`,
                }}
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {upperLetter}
              </motion.div>
            </AnimatePresence>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-cyber-text">
                  Sign for &quot;{upperLetter}&quot;
                </span>
                <span className="text-[0.6rem] px-1.5 py-0.5 rounded-md bg-cyber-purple/10 border border-cyber-purple/20 text-cyber-purple font-semibold uppercase tracking-wider">
                  ASL
                </span>
              </div>
              <p className="text-xs text-cyber-text-secondary leading-relaxed mt-0.5">
                {hint}
              </p>
            </div>
          </div>

          {/* Tip */}
          <div className="flex items-center gap-2 pt-2 border-t border-white/[0.04]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-cyber-text-muted shrink-0">
              <path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[0.65rem] text-cyber-text-muted font-medium">
              Hold the sign steady for detection
            </span>
          </div>
        </div>

        {/* Right: Hand illustration */}
        <AnimatePresence mode="wait">
          <motion.div
            key={upperLetter}
            className="w-28 h-28 rounded-xl overflow-hidden border border-[var(--panel-border)] bg-cyber-surface shrink-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
          >
            {hasImage && !imgError ? (
              <Image
                src={`/asl/${upperLetter.toLowerCase()}.png`}
                alt={`ASL sign for letter ${upperLetter}`}
                width={112}
                height={112}
                className="w-full h-full object-cover"
                priority
                onError={() => setImgError(true)}
              />
            ) : (
              /* Fallback: styled letter with hand emoji */
              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl">🤟</span>
                <span
                  className="text-xl font-extrabold font-mono"
                  style={{ color: letterColor }}
                >
                  {upperLetter}
                </span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
