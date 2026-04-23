"use client";

import { AnimatePresence } from "framer-motion";
import { useGameState } from "./hooks/useGameState";
import Confetti from "./components/Confetti";
import Header from "./components/Header";
import ProgressBar from "./components/ProgressBar";
import CameraSection from "./components/CameraSection";
import WordDisplay from "./components/WordDisplay";
import DetectionPanel from "./components/DetectionPanel";
import CompletionCard from "./components/CompletionCard";
import QuickActions from "./components/QuickActions";
import ComboDisplay from "./components/ComboDisplay";
import StatsPanel from "./components/StatsPanel";
import ToastContainer from "./components/ToastContainer";
import ASLReference from "./components/ASLReference";
import FloatingParticles from "./components/FloatingParticles";

export default function GamePage() {
  const game = useGameState();

  const progress =
    game.activeWord.length > 0
      ? (game.completedLetters.filter(Boolean).length / game.activeWord.length) * 100
      : 0;

  return (
    <main className="relative z-10 flex-1 flex flex-col min-h-screen">
      {game.showConfetti && <Confetti />}
      <FloatingParticles />
      <ToastContainer toasts={game.toasts} onDismiss={game.dismissToast} />

      <Header
        score={game.score}
        streak={game.streak}
        wordsCompleted={game.wordsCompleted}
        difficulty={game.difficulty}
        onDifficultyChange={game.setDifficulty}
      />

      <ProgressBar progress={progress} />

      {/* Main content grid */}
      <div className="flex-1 flex items-start justify-center px-4 py-6 lg:px-8 lg:py-8">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          {/* Left: Camera + Stats */}
          <div className="flex flex-col gap-5">
            <CameraSection
              isCompleted={game.isCompleted}
              onSimulate={game.simulateDetection}
            />

            {/* Stats row */}
            <StatsPanel
              timer={game.timer}
              totalCorrect={game.totalCorrect}
              totalAttempts={game.totalAttempts}
              bestStreak={game.bestStreak}
              wordsCompleted={game.wordsCompleted}
            />
          </div>

          {/* Right: Dashboard */}
          <div className="flex flex-col gap-5">
            {/* Combo display */}
            <ComboDisplay
              streak={game.streak}
              comboMultiplier={game.comboMultiplier}
            />

            <WordDisplay
              activeWord={game.activeWord}
              charIndex={game.charIndex}
              completedLetters={game.completedLetters}
              isCompleted={game.isCompleted}
            />

            <DetectionPanel
              detectedLetter={game.detectedLetter}
              charIndex={game.charIndex}
              activeWord={game.activeWord}
              isCompleted={game.isCompleted}
            />

            {/* ASL hint for current letter */}
            {!game.isCompleted && (
              <ASLReference letter={game.activeWord[game.charIndex]} />
            )}

            <AnimatePresence>
              {game.isCompleted && (
                <CompletionCard
                  onNextWord={game.nextWord}
                  onRetry={game.resetGame}
                />
              )}
            </AnimatePresence>

            {!game.isCompleted && (
              <QuickActions
                onReset={game.resetGame}
                onSkip={game.nextWord}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
