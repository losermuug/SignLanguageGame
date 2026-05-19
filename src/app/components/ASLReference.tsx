"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

/* Descriptions for every ASL letter */
const ASL_HINTS: Record<string, string> = {
  A: "Эрхий хуруугаа долооворын хажууд тавьсан атгасан гар",
  B: "Хуруунууд дээш шулуун, эрхий алганы дээгүүр",
  C: "Бөмбөг барьж байгаа мэт муруй гар",
  D: "Долоовор дээш, бусад хуруу эрхийтэй нийлнэ",
  E: "Хуруунууд дотогш нугарч, эрхий далд байрлана",
  F: "OK хэлбэр, эрхий ба долоовор нийлнэ",
  G: "Долоовор ба эрхий хажуу тийш чиглэнэ",
  H: "Долоовор, дунд хуруу хамт хажуу тийш",
  I: "Чигчий хуруу дээш гарсан атгасан гар",
  J: "Чигчийгээр агаарт J хэлбэр зурна",
  K: "Долоовор, дунд хуруу дээш, эрхий дунд нь",
  L: "L хэлбэр, долоовор дээш, эрхий хажуу тийш",
  M: "Эрхий гурван хурууны доор",
  N: "Эрхий хоёр хурууны доор",
  O: "Бүх хурууны үзүүр эрхийтэй нийлж O хэлбэр үүсгэнэ",
  P: "K-тэй төстэй, доош чиглэсэн",
  Q: "G-тэй төстэй, доош чиглэсэн",
  R: "Долоовор ба дунд хурууг зөрүүлнэ",
  S: "Эрхий хурууны дээр байрласан атгасан гар",
  T: "Эрхий долоовор ба дунд хурууны завсар",
  U: "Долоовор ба дунд хуруу хамт дээш",
  V: "Долоовор, дунд хуруу салж V хэлбэр үүсгэнэ",
  W: "Гурван хуруу дээш",
  X: "Долоовор хуруу дэгээ шиг нугарна",
  Y: "Эрхий ба чигчий хоёр хажуу тийш",
  Z: "Долоовор хуруугаар агаарт Z зурна",
};

/* Letters that have cropped guide images in /asl/ */
const LETTERS_WITH_IMAGES = new Set([
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
  "M", "N", "O", "P", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
]);

interface ASLReferenceProps {
  letter: string;
}

export default function ASLReference({ letter }: ASLReferenceProps) {
  const upperLetter = letter.toUpperCase();
  const hint = ASL_HINTS[upperLetter] || "Тайлбар байхгүй";
  const hasImage = LETTERS_WITH_IMAGES.has(upperLetter);
  const [failedImageLetter, setFailedImageLetter] = useState<string | null>(null);
  const showImage = hasImage && failedImageLetter !== upperLetter;

  return (
    <motion.section
      className="app-card rounded-2xl p-5 overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-sm font-semibold text-cyber-text mb-3">
        Заавар
      </h2>

      <div className="flex gap-4">
        {/* Left: info */}
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          {/* Letter badge + label */}
          <div className="flex items-center gap-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={upperLetter}
                className="w-11 h-11 rounded-lg flex items-center justify-center text-xl font-semibold font-mono border border-[var(--panel-border)] bg-cyber-elevated text-cyber-text shrink-0"
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
                <span className="text-sm font-semibold text-cyber-text">{upperLetter} үсэг</span>
              </div>
              <p className="text-xs text-cyber-text-secondary leading-relaxed mt-1">
                {hint}
              </p>
            </div>
          </div>

          {/* Tip */}
          <div className="flex items-center gap-2 pt-2 border-t border-[var(--panel-border)]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-cyber-text-secondary shrink-0">
              <path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[0.68rem] text-cyber-text-secondary font-medium">
              Үсэг танигдтал гараа тогтвортой барина уу
            </span>
          </div>
        </div>

        {/* Right: Hand illustration */}
        <AnimatePresence mode="wait">
          <motion.div
            key={upperLetter}
            className="w-28 h-28 rounded-2xl overflow-hidden border border-[var(--panel-border)] bg-cyber-surface shrink-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
          >
            {showImage ? (
              <Image
                src={`/asl/${upperLetter.toLowerCase()}.webp`}
                alt={`${upperLetter} үсгийн дохионы зураг`}
                width={112}
                height={112}
                className="w-full h-full object-cover"
                priority
                onError={() => setFailedImageLetter(upperLetter)}
              />
            ) : (
              /* Fallback: styled letter with hand emoji */
              <div className="flex flex-col items-center gap-1">
                <span className="text-xl font-semibold font-mono text-cyber-text">
                  {upperLetter}
                </span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
