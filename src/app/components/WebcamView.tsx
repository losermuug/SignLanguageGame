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
      <div className="relative rounded-2xl overflow-hidden bg-cyber-surface border border-[var(--panel-border)] aspect-[4/3]">
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
            <div className="w-16 h-16 rounded-full bg-cyber-cyan/[0.08] border border-cyber-cyan/15 flex items-center justify-center">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-cyber-cyan"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>
            <span className="text-cyber-text-muted text-sm font-medium">
              Camera inactive
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

        {/* Scan line overlay */}
        <div className="webcam-scanline absolute inset-0 z-[3] pointer-events-none" />

        {/* Corner brackets */}
        <div className="absolute inset-3 z-[4] pointer-events-none">
          <div className="corner-bracket-tl absolute top-0 left-0 w-5 h-5 opacity-50" />
          <div className="corner-bracket-tr absolute top-0 right-0 w-5 h-5 opacity-50" />
          <div className="corner-bracket-bl absolute bottom-0 left-0 w-5 h-5 opacity-50" />
          <div className="corner-bracket-br absolute bottom-0 right-0 w-5 h-5 opacity-50" />
        </div>

        {/* Live indicator */}
        {isActive && (
          <div className="absolute top-4 left-4 z-[5] flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full bg-cyber-success"
              style={{
                boxShadow: "0 0 8px rgba(52,211,153,0.5)",
                animation: "glow-pulse 2s ease-in-out infinite",
              }}
            />
            <span className="text-[0.7rem] font-semibold tracking-wider uppercase text-cyber-success/80">
              Live
            </span>
          </div>
        )}
      </div>
    );
  }
);

export default WebcamView;
