"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { Toast } from "../hooks/useGameState";

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}

const bgColors: Record<Toast["type"], string> = {
  success: "from-cyber-success/20 to-cyber-success/5 border-cyber-success/30",
  info: "from-cyber-cyan/20 to-cyber-cyan/5 border-cyber-cyan/30",
  fire: "from-orange-500/20 to-red-500/5 border-orange-500/30",
};

const textColors: Record<Toast["type"], string> = {
  success: "text-cyber-success",
  info: "text-cyber-cyan",
  fire: "text-orange-400",
};

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed top-20 right-4 z-[998] flex flex-col gap-2 max-w-xs">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl bg-gradient-to-r ${bgColors[toast.type]}`}
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <span className={`text-sm font-semibold ${textColors[toast.type]} flex-1`}>
              {toast.message}
            </span>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-white/30 hover:text-white/60 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
