"use client";

import { useRef, useState, useCallback } from "react";
import { Camera, CameraOff, Zap, ZapOff, Activity, Hand } from "lucide-react";
import WebcamView, { type WebcamViewHandle } from "./WebcamView";
import { useSignDetection } from "../hooks/useSignDetection";

interface CameraSectionProps {
  isCompleted: boolean;
  onDetection: (letter: string) => void;
}

export default function CameraSection({ isCompleted, onDetection }: CameraSectionProps) {
  const webcamRef = useRef<WebcamViewHandle>(null);
  const [cameraOn, setCameraOn] = useState(true);
  const [autoDetect, setAutoDetect] = useState(true);

  const getVideo = useCallback(() => {
    return webcamRef.current?.getVideo() ?? null;
  }, []);

  const getCanvas = useCallback(() => {
    return webcamRef.current?.getCanvas() ?? null;
  }, []);

  const handleDetection = useCallback(
    (letter: string) => {
      if (!isCompleted) {
        onDetection(letter);
      }
    },
    [isCompleted, onDetection]
  );

  const { prediction, isModelReady, isProcessing, handDetected, error } =
    useSignDetection({
      getVideo,
      getCanvas,
      enabled: cameraOn && autoDetect && !isCompleted,
      confidenceThreshold: 0.5,
      requiredConsecutive: 3,
      onDetection: handleDetection,
    });

  return (
    <div className="flex flex-col gap-4">
      {/* Camera toggle header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-cyber-text-secondary" />
          <span className="text-sm font-medium text-cyber-text-secondary">
            Camera Feed
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Auto-detect toggle */}
          <button
            onClick={() => setAutoDetect((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-300 cursor-pointer ${
              autoDetect
                ? "border-cyber-cyan/40 bg-cyber-cyan/10 text-cyber-cyan"
                : "border-[var(--panel-border)] bg-cyber-elevated text-cyber-text-secondary hover:border-[var(--panel-hover-border)] hover:text-cyber-text"
            }`}
          >
            {autoDetect ? (
              <>
                <Zap className="w-3.5 h-3.5" /> AI асаалттай
              </>
            ) : (
              <>
                <ZapOff className="w-3.5 h-3.5" /> AI унтраасан
              </>
            )}
          </button>

          {/* Camera toggle */}
          <button
            onClick={() => setCameraOn((v) => !v)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border border-[var(--panel-border)] bg-cyber-elevated text-cyber-text-secondary hover:border-[var(--panel-hover-border)] hover:text-cyber-text transition-all duration-300 cursor-pointer"
          >
            {cameraOn ? (
              <>
                <CameraOff className="w-3.5 h-3.5" /> Унтраах
              </>
            ) : (
              <>
                <Camera className="w-3.5 h-3.5" /> Асаах
              </>
            )}
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs">
          <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
          <span>{error}</span>
        </div>
      )}

      {/* Webcam */}
      <div className="relative">
        <WebcamView ref={webcamRef} isActive={cameraOn} />

        {/* Model & Hand Status Badges */}
        {cameraOn && (
          <div className="absolute top-4 right-4 z-[5] flex flex-col gap-1.5 items-end">
            {/* Model status */}
            {isModelReady ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-cyber-cyan/20">
                <Activity
                  className={`w-3 h-3 ${
                    isProcessing
                      ? "text-cyber-cyan animate-pulse"
                      : "text-cyber-cyan/60"
                  }`}
                />
                <span className="text-[0.65rem] font-semibold tracking-wider uppercase text-cyber-cyan/80">
                  API Ready
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-yellow-500/20">
                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                <span className="text-[0.65rem] font-semibold tracking-wider uppercase text-yellow-400/80">
                  Loading...
                </span>
              </div>
            )}

            {/* Hand detection status */}
            {isModelReady && autoDetect && (
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm border ${
                  handDetected
                    ? "border-emerald-500/30"
                    : "border-white/10"
                }`}
              >
                <Hand
                  className={`w-3 h-3 ${
                    handDetected
                      ? "text-emerald-400"
                      : "text-white/30"
                  }`}
                />
                <span
                  className={`text-[0.65rem] font-semibold tracking-wider uppercase ${
                    handDetected
                      ? "text-emerald-400/80"
                      : "text-white/30"
                  }`}
                >
                  {handDetected ? "Гар илэрсэн" : "Гар олдсонгүй"}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Real-time prediction overlay */}
        {cameraOn && autoDetect && prediction && handDetected && (
          <div className="absolute bottom-4 left-4 right-4 z-[5]">
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-black/60 backdrop-blur-md border border-cyber-cyan/20">
              <div className="flex items-center gap-3">
                <span
                  className="text-3xl font-extrabold font-mono text-cyber-cyan"
                  style={{ textShadow: "0 0 20px rgba(0,240,255,0.4)" }}
                >
                  {prediction.letter}
                </span>
                <div className="flex flex-col">
                  <span className="text-[0.65rem] text-cyber-text-muted uppercase tracking-wider">
                    Confidence
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${prediction.confidence * 100}%`,
                          background:
                            prediction.confidence > 0.8
                              ? "linear-gradient(90deg, #00f0ff, #34d399)"
                              : prediction.confidence > 0.5
                                ? "linear-gradient(90deg, #f59e0b, #eab308)"
                                : "linear-gradient(90deg, #ef4444, #f87171)",
                        }}
                      />
                    </div>
                    <span className="text-xs font-bold text-cyber-text-secondary">
                      {(prediction.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Top alternatives */}
              <div className="hidden sm:flex items-center gap-1.5">
                {prediction.top5.slice(1, 4).map((p) => (
                  <div
                    key={p.letter}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10"
                  >
                    <span className="text-xs font-mono font-bold text-cyber-text-secondary">
                      {p.letter}
                    </span>
                    <span className="text-[0.6rem] text-cyber-text-muted">
                      {(p.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Hand not detected message */}
        {cameraOn && autoDetect && isModelReady && !handDetected && (
          <div className="absolute bottom-4 left-4 right-4 z-[5]">
            <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-black/40 backdrop-blur-md border border-white/10">
              <Hand className="w-4 h-4 text-white/40" />
              <span className="text-sm text-white/40 font-medium">
                Камерын өмнө гараа харуулна уу
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
