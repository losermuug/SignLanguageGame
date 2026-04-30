"use client";

import { motion } from "framer-motion";
import { Award, CheckCircle2, Target } from "lucide-react";

const lessonProgress = {
  completedLessons: 2,
  totalLessons: 3,
  xp: 120,
};

export default function ProgressSection() {
  const completionPercent = Math.round(
    (lessonProgress.completedLessons / lessonProgress.totalLessons) * 100,
  );

  return (
    <motion.section
      className="backdrop-blur-xl bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-2xl p-5 overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-cyber-text-muted">
            Progress
          </h2>
          <p className="text-sm text-cyber-text-secondary mt-1">
            Keep track of lesson completion at a glance.
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-cyber-success/10 border border-cyber-success/20 flex items-center justify-center shrink-0">
          <Target className="w-4.5 h-4.5 text-cyber-success" />
        </div>
      </div>

      <div className="rounded-xl border border-[var(--panel-border)] bg-cyber-elevated p-4">
        <div className="flex items-end justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold font-mono text-cyber-text">
                {completionPercent}%
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-cyber-text-muted">
                Complete
              </span>
            </div>
            <p className="text-xs text-cyber-text-secondary mt-1">
              {lessonProgress.completedLessons} of {lessonProgress.totalLessons} lessons finished
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-cyber-warning/20 bg-cyber-warning/10 px-3 py-1.5">
            <Award className="w-3.5 h-3.5 text-cyber-warning" />
            <span className="text-xs font-semibold text-cyber-text">
              {lessonProgress.xp} XP
            </span>
          </div>
        </div>

        <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-purple"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercent}%` }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="rounded-xl border border-[var(--panel-border)] bg-white/[0.02] px-3 py-2.5">
            <p className="text-[0.62rem] uppercase tracking-wider text-cyber-text-muted">
              Completed
            </p>
            <div className="flex items-center gap-2 mt-1">
              <CheckCircle2 className="w-4 h-4 text-cyber-success" />
              <span className="text-sm font-bold text-cyber-text">
                {lessonProgress.completedLessons}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--panel-border)] bg-white/[0.02] px-3 py-2.5">
            <p className="text-[0.62rem] uppercase tracking-wider text-cyber-text-muted">
              Progress
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Target className="w-4 h-4 text-cyber-cyan" />
              <span className="text-sm font-bold text-cyber-text">
                {completionPercent}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}