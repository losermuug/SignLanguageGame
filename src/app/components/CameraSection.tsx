"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, CameraOff, Loader2, Target } from "lucide-react";
import WebcamView, { type WebcamViewHandle } from "./WebcamView";
import {
  createLandmarkDetectors,
  getLandmarkPredictionInput,
  type LandmarkPredictionInput,
  type LandmarkDetectors,
} from "../lib/aslLandmarks";

interface CameraSectionProps {
  targetLetter: string;
  isCompleted: boolean;
  onPrediction: (letter: string, confidence?: number) => void;
  onSimulate: () => void;
}

interface PredictionResult {
  letter: string | null;
  confidence: number;
  source?: string;
  error?: string;
}

const LANDMARK_INTERVAL_MS = 85;
const PREDICTION_INTERVAL_MS = 450;

export default function CameraSection({
  targetLetter,
  isCompleted,
  onPrediction,
  onSimulate,
}: CameraSectionProps) {
  const webcamRef = useRef<WebcamViewHandle>(null);
  const detectorsRef = useRef<Promise<LandmarkDetectors> | null>(null);
  const latestLandmarksRef = useRef<LandmarkPredictionInput | null>(null);
  const [cameraOn, setCameraOn] = useState(true);
  const [isPredicting, setIsPredicting] = useState(false);
  const [modelStatus, setModelStatus] = useState<"idle" | "ready" | "error">("idle");
  const [statusText, setStatusText] = useState("Model waiting for camera");

  const getFeatures = useCallback(async () => {
    const video = webcamRef.current?.getVideo();
    const canvas = webcamRef.current?.getCanvas();
    if (!video || !canvas || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      return null;
    }

    detectorsRef.current ??= createLandmarkDetectors();
    const detectors = await detectorsRef.current;
    return getLandmarkPredictionInput(video, detectors, canvas);
  }, []);

  useEffect(() => {
    if (!cameraOn || isCompleted) {
      latestLandmarksRef.current = null;
      return;
    }

    let cancelled = false;
    let timerId: number | null = null;

    const updateLandmarks = async () => {
      try {
        latestLandmarksRef.current = await getFeatures();
      } catch {
        if (!cancelled) {
          setModelStatus("error");
          setStatusText("Landmark model failed");
        }
      } finally {
        if (!cancelled) {
          timerId = window.setTimeout(updateLandmarks, LANDMARK_INTERVAL_MS);
        }
      }
    };

    void updateLandmarks();

    return () => {
      cancelled = true;
      if (timerId !== null) window.clearTimeout(timerId);
    };
  }, [cameraOn, getFeatures, isCompleted]);

  useEffect(() => {
    if (!cameraOn || isCompleted) {
      setIsPredicting(false);
      return;
    }

    let cancelled = false;
    let inFlight = false;

    const predict = async () => {
      if (inFlight) return;

      inFlight = true;
      setIsPredicting(true);

      try {
        const landmarkInput = latestLandmarksRef.current;
        if (!landmarkInput) {
          if (!cancelled) {
            setModelStatus("idle");
            setStatusText("Show your hand");
          }
          return;
        }

        if (targetLetter.toUpperCase() === landmarkInput.heuristicLetter) {
          setModelStatus("ready");
          setStatusText(
            `${landmarkInput.heuristicLetter} · ${(landmarkInput.heuristicConfidence * 100).toFixed(0)}%`
          );
          onPrediction(landmarkInput.heuristicLetter, landmarkInput.heuristicConfidence);
          return;
        }

        const response = await fetch("/api/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ features: landmarkInput.features }),
        });
        const result = (await response.json()) as PredictionResult;
        if (cancelled) return;

        if (!response.ok || result.error) {
          setModelStatus("error");
          setStatusText(result.error ?? "Prediction failed");
          return;
        }

        setModelStatus("ready");
        setStatusText(
          result.letter
            ? `${result.letter} · ${(result.confidence * 100).toFixed(0)}%`
            : "No confident sign"
        );

        if (result.letter) {
          onPrediction(result.letter, result.confidence);
        }
      } catch {
        if (!cancelled) {
          setModelStatus("error");
          setStatusText("Backend offline");
        }
      } finally {
        inFlight = false;
        if (!cancelled) setIsPredicting(false);
      }
    };

    const intervalId = window.setInterval(predict, PREDICTION_INTERVAL_MS);
    void predict();

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [cameraOn, isCompleted, onPrediction, targetLetter]);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[var(--panel-border)] bg-[var(--panel-bg)] p-4">
      {/* Camera toggle header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-cyber-text-secondary" />
          <span className="text-sm font-medium text-cyber-text-secondary">Camera</span>
        </div>
        <button
          onClick={() => setCameraOn((v) => !v)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border border-[var(--panel-border)] bg-cyber-elevated text-cyber-text-secondary hover:border-[var(--panel-hover-border)] hover:text-cyber-text transition-colors cursor-pointer"
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

      <div className="flex items-center justify-between rounded-lg border border-[var(--panel-border)] bg-cyber-elevated px-3 py-2.5 text-xs text-cyber-text-secondary">
        <span className="font-medium">
          Model
        </span>
        <span className="flex items-center gap-2 font-medium">
          {isPredicting && <Loader2 className="h-3.5 w-3.5 animate-spin text-cyber-cyan" />}
          <span
            className={
              modelStatus === "ready"
                ? "text-cyber-success"
                : modelStatus === "error"
                  ? "text-cyber-pink"
                  : "text-cyber-text-muted"
            }
          >
            {statusText}
          </span>
        </span>
      </div>

      {/* Simulate button */}
      <button
        onClick={onSimulate}
        disabled={isCompleted}
        className="w-full py-2.5 rounded-lg text-sm font-medium border bg-cyber-elevated border-[var(--panel-border)] text-cyber-text-secondary hover:border-[var(--panel-hover-border)] hover:text-cyber-text disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        <span className="flex items-center justify-center gap-2">
          <Target className="w-4 h-4" />
          Simulate Sign Detection
        </span>
      </button>
    </div>
  );
}
