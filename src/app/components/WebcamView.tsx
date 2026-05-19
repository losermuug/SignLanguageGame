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
      <div className="relative rounded-xl overflow-hidden bg-cyber-surface border border-[var(--panel-border)] aspect-[4/3]">
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

        {/* Live indicator */}
        {isActive && (
          <div className="absolute top-3 left-3 z-[5] flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 backdrop-blur-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-cyber-success" />
            <span className="text-[0.65rem] font-medium uppercase tracking-wide text-white/85">
              Live
            </span>
          </div>
        )}
      </div>
    );
  }
);

export default WebcamView;
