"use client";

import { useRef, useState } from "react";
import { Camera, CameraOff, Target } from "lucide-react";
import WebcamView, { type WebcamViewHandle } from "./WebcamView";

interface CameraSectionProps {
  isCompleted: boolean;
  onSimulate: () => void;
}

export default function CameraSection({ isCompleted, onSimulate }: CameraSectionProps) {
  const webcamRef = useRef<WebcamViewHandle>(null);
  const [cameraOn, setCameraOn] = useState(true);

  return (
    <div className="flex flex-col gap-5">
      {/* Camera toggle header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-cyber-text-secondary" />
          <span className="text-sm font-medium text-cyber-text-secondary">Camera Feed</span>
        </div>
        <button
          onClick={() => setCameraOn((v) => !v)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border border-[var(--panel-border)] bg-cyber-elevated text-cyber-text-secondary hover:border-[var(--panel-hover-border)] hover:text-cyber-text transition-all duration-300 cursor-pointer"
        >
          {cameraOn ? (
            <><CameraOff className="w-3.5 h-3.5" /> Turn Off</>
          ) : (
            <><Camera className="w-3.5 h-3.5" /> Turn On</>
          )}
        </button>
      </div>

      {/* Webcam */}
      <WebcamView ref={webcamRef} isActive={cameraOn} />

      {/* Simulate button */}
      <button
        onClick={onSimulate}
        disabled={isCompleted}
        className="w-full py-3 rounded-2xl text-sm font-semibold tracking-wide border bg-gradient-to-r from-cyber-cyan/[0.12] to-cyber-purple/[0.08] border-cyber-cyan/30 text-cyber-cyan hover:from-cyber-cyan/20 hover:to-cyber-purple/15 hover:border-cyber-cyan/50 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all duration-300 cursor-pointer"
        style={{ boxShadow: isCompleted ? "none" : "var(--glow-cyan)" }}
      >
        <span className="flex items-center justify-center gap-2">
          <Target className="w-4 h-4" />
          Simulate Sign Detection
        </span>
      </button>
    </div>
  );
}
