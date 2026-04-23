"use client";

import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className="relative w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300 cursor-pointer
        border-[var(--panel-border)] bg-[var(--bg-elevated)]
        hover:border-[var(--panel-hover-border)]"
      title={isDark ? "Light горим" : "Dark горим"}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-cyber-warning" />
        ) : (
          <Moon className="w-4 h-4 text-cyber-purple" />
        )}
      </motion.div>
    </button>
  );
}
