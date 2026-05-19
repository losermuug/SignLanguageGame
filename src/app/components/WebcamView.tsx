"use client";

import { useRef, forwardRef, useImperativeHandle } from "react";
import Webcam from "react-webcam";

export interface WebcamViewHandle {
  getVideo: () => HTMLVideoElement | null;
  getCanvas: () => HTMLCanvasElement | null;
}

interface WebcamViewProps {
  isActive: boolean;
}

const WebcamView = forwardRef<WebcamViewHandle, WebcamViewProps>(
  function WebcamView({ isActive }, ref) {
    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useImperativeHandle(ref, () => ({
      getVideo: () => webcamRef.current?.video ?? null,
      getCanvas: () => canvasRef.current,
    }));

    const videoConstraints = {
      width: 640,
      height: 480,
      facingMode: "user",
    };

    return (
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[var(--panel-border)] bg-cyber-surface shadow-[inset_0_0_0_1px_rgba(255,255,255,0.025)]">
        {/* Webcam or placeholder */}
        {isActive ? (
          <Webcam
            ref={webcamRef}
            audio={false}
            mirrored={true}
            videoConstraints={videoConstraints}
            className="w-full h-full object-cover block"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-cyber-surface">
            <div className="w-14 h-14 rounded-full bg-cyber-elevated border border-[var(--panel-border)] flex items-center justify-center">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-cyber-text-muted"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>
            <span className="text-cyber-text-muted text-sm font-medium">
              Камер унтраалттай
            </span>
          </div>
        )}

        {/* Canvas overlay for MediaPipe hand landmarks */}
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="absolute inset-0 w-full h-full z-[2] pointer-events-none"
        />

        <div className="pointer-events-none absolute inset-3 z-[3] rounded-xl border border-white/10" />
        <div className="pointer-events-none absolute left-3 top-3 z-[4] h-8 w-8 corner-bracket-tl opacity-80" />
        <div className="pointer-events-none absolute right-3 top-3 z-[4] h-8 w-8 corner-bracket-tr opacity-80" />
        <div className="pointer-events-none absolute bottom-3 left-3 z-[4] h-8 w-8 corner-bracket-bl opacity-80" />
        <div className="pointer-events-none absolute bottom-3 right-3 z-[4] h-8 w-8 corner-bracket-br opacity-80" />

        {/* Live indicator */}
        {isActive && (
          <div className="absolute top-4 left-4 z-[5] flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-cyber-success" />
            <span className="text-[0.65rem] font-medium uppercase tracking-wide text-white/85">
              Шууд
            </span>
          </div>
        )}
      </div>
    );
  }
);

export default WebcamView;
