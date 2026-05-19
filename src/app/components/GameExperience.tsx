"use client";

import { AnimatePresence } from "framer-motion";
import { useGameState } from "../hooks/useGameState";
import Confetti from "./Confetti";
import Header from "./Header";
import ProgressBar from "./ProgressBar";
import CameraSection from "./CameraSection";
import WordDisplay from "./WordDisplay";
import DetectionPanel from "./DetectionPanel";
import CompletionCard from "./CompletionCard";
import QuickActions from "./QuickActions";
import ComboDisplay from "./ComboDisplay";
import StatsPanel from "./StatsPanel";
import ToastContainer from "./ToastContainer";
import ASLReference from "./ASLReference";
import DifficultySelector from "./DifficultySelector";
import FloatingParticles from "./FloatingParticles";

export default function GameExperience() {
  const game = useGameState();

  const progress =
    game.activeWord.length > 0
      ? (game.completedLetters.filter(Boolean).length / game.activeWord.length) * 100
      : 0;

  return (
    <main className="relative z-10 flex min-h-screen flex-1 flex-col">
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

      <div className="px-4 pt-4 md:hidden">
        <DifficultySelector difficulty={game.difficulty} onChange={game.setDifficulty} />
      </div>

      <div className="flex flex-1 items-start justify-center px-4 py-5 lg:px-8 lg:py-7">
        <div className="grid w-full max-w-7xl grid-cols-1 gap-5 lg:gap-6 xl:grid-cols-[minmax(0,1.08fr)_390px]">
          <div className="flex flex-col gap-5">
            <CameraSection
              targetLetter={game.activeWord[game.charIndex] ?? ""}
              isCompleted={game.isCompleted}
              onPrediction={game.handlePrediction}
              onSimulate={game.simulateDetection}
            />

            <StatsPanel
              timer={game.timer}
              totalCorrect={game.totalCorrect}
              totalAttempts={game.totalAttempts}
              bestStreak={game.bestStreak}
              wordsCompleted={game.wordsCompleted}
            />
          </div>

          <div className="flex flex-col gap-5">
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
