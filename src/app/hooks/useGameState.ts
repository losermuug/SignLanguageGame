"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/* ============================================
   WORD BANKS BY DIFFICULTY
   ============================================ */
const WORDS: Record<string, string[]> = {
  easy: ["HI", "CAT", "DOG", "SUN", "CUP", "RED", "BOX", "PEN"],
  medium: ["HELLO", "APPLE", "WORLD", "LEARN", "GAME", "SIGN", "HAND", "CODE"],
  hard: ["GESTURE", "LANGUAGE", "ALPHABET", "PRACTICE", "PREDICT", "CAPTURE"],
};

export type Difficulty = "easy" | "medium" | "hard";

/* ============================================
   TOAST SYSTEM
   ============================================ */
export interface Toast {
  id: number;
  message: string;
  type: "success" | "info" | "fire";
}

/* ============================================
   GAME STATE INTERFACE
   ============================================ */
export interface GameState {
  activeWord: string;
  charIndex: number;
  isCompleted: boolean;
  detectedLetter: string | null;
  score: number;
  streak: number;
  bestStreak: number;
  completedLetters: boolean[];
  showConfetti: boolean;
  wordsCompleted: number;
  difficulty: Difficulty;
  timer: number;
  totalCorrect: number;
  totalAttempts: number;
  toasts: Toast[];
  comboMultiplier: number;
}

export interface GameActions {
  advanceLetter: (predicted: string) => void;
  nextWord: () => void;
  resetGame: () => void;
  simulateDetection: () => void;
  setDifficulty: (d: Difficulty) => void;
  dismissToast: (id: number) => void;
}

let toastIdCounter = 0;

export function useGameState(): GameState & GameActions {
  const [difficulty, setDifficultyState] = useState<Difficulty>("medium");
  const [activeWord, setActiveWord] = useState("HELLO");
  const [charIndex, setCharIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [detectedLetter, setDetectedLetter] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [completedLetters, setCompletedLetters] = useState<boolean[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [timer, setTimer] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [comboMultiplier, setComboMultiplier] = useState(1);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // --- Timer ---
  useEffect(() => {
    if (!isCompleted) {
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isCompleted, activeWord]);

  // --- Reset on word change ---
  useEffect(() => {
    setCompletedLetters(new Array(activeWord.length).fill(false));
    setCharIndex(0);
    setIsCompleted(false);
    setDetectedLetter(null);
    setTimer(0);
  }, [activeWord]);

  // --- Update combo multiplier from streak ---
  useEffect(() => {
    if (streak >= 10) setComboMultiplier(4);
    else if (streak >= 7) setComboMultiplier(3);
    else if (streak >= 4) setComboMultiplier(2);
    else setComboMultiplier(1);
  }, [streak]);

  // --- Toast helper ---
  const addToast = useCallback((message: string, type: Toast["type"]) => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // --- Core game logic ---
  const advanceLetter = useCallback(
    (predicted: string) => {
      if (isCompleted) return;

      setTotalAttempts((a) => a + 1);
      const target = activeWord[charIndex];

      if (predicted.toUpperCase() === target) {
        setDetectedLetter(predicted.toUpperCase());
        setTotalCorrect((c) => c + 1);

        const updated = [...completedLetters];
        updated[charIndex] = true;
        setCompletedLetters(updated);

        const newStreak = streak + 1;
        setStreak(newStreak);
        if (newStreak > bestStreak) setBestStreak(newStreak);

        // Points: base + streak bonus * combo
        const points = (10 + newStreak * 2) * comboMultiplier;
        setScore((s) => s + points);

        // Streak milestones
        if (newStreak === 5) addToast("🔥 5 Streak! Keep going!", "fire");
        if (newStreak === 10) addToast("⚡ 10 Streak! Unstoppable!", "fire");
        if (newStreak === 15) addToast("🌟 15 Streak! Legendary!", "fire");

        if (charIndex + 1 >= activeWord.length) {
          // Word completed!
          setIsCompleted(true);
          setShowConfetti(true);
          setWordsCompleted((w) => w + 1);

          // Speed bonus: under 10s = +100, under 20s = +50, under 30s = +25
          let speedBonus = 0;
          if (timer < 10) { speedBonus = 100; addToast("⚡ Speed Demon! +100", "success"); }
          else if (timer < 20) { speedBonus = 50; addToast("🚀 Quick! +50", "success"); }
          else if (timer < 30) { speedBonus = 25; addToast("✨ Nice pace! +25", "info"); }

          // Difficulty bonus
          const diffBonus = difficulty === "hard" ? 100 : difficulty === "medium" ? 50 : 25;

          setScore((s) => s + 50 + speedBonus + diffBonus);
          addToast(`🏆 Word Complete! +${50 + speedBonus + diffBonus}`, "success");

          setTimeout(() => setShowConfetti(false), 3000);
        } else {
          setCharIndex((i) => i + 1);
        }
      } else {
        setDetectedLetter(predicted.toUpperCase());
        setStreak(0);
        setComboMultiplier(1);
        if (streak >= 3) addToast("💔 Streak lost!", "info");
      }
    },
    [charIndex, activeWord, isCompleted, completedLetters, streak, bestStreak, comboMultiplier, timer, difficulty, addToast]
  );

  const nextWord = useCallback(() => {
    const bank = WORDS[difficulty];
    const remaining = bank.filter((w) => w !== activeWord);
    const next = remaining[Math.floor(Math.random() * remaining.length)];
    setActiveWord(next);
  }, [activeWord, difficulty]);

  const resetGame = useCallback(() => {
    setCharIndex(0);
    setIsCompleted(false);
    setDetectedLetter(null);
    setCompletedLetters(new Array(activeWord.length).fill(false));
    setStreak(0);
    setComboMultiplier(1);
    setTimer(0);
  }, [activeWord]);

  const simulateDetection = useCallback(() => {
    if (isCompleted) return;
    advanceLetter(activeWord[charIndex]);
  }, [charIndex, activeWord, isCompleted, advanceLetter]);

  const setDifficulty = useCallback((d: Difficulty) => {
    setDifficultyState(d);
    const bank = WORDS[d];
    setActiveWord(bank[Math.floor(Math.random() * bank.length)]);
    setStreak(0);
    setComboMultiplier(1);
  }, []);

  return {
    activeWord, charIndex, isCompleted, detectedLetter,
    score, streak, bestStreak, completedLetters,
    showConfetti, wordsCompleted, difficulty, timer,
    totalCorrect, totalAttempts, toasts, comboMultiplier,
    advanceLetter, nextWord, resetGame, simulateDetection,
    setDifficulty, dismissToast,
  };
}
