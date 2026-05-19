"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, CameraOff, Loader2, Radio, Target } from "lucide-react";
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
  const [statusText, setStatusText] = useState("Камер хүлээж байна");

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
          setStatusText("Гарын цэг танигдсангүй");
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
            setStatusText("Гараа харуулна уу");
          }
          return;
        }

        if (landmarkInput && targetLetter.toUpperCase() === landmarkInput.heuristicLetter) {
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
          setStatusText(result.error ?? "Танилт амжилтгүй");
          return;
        }

        setModelStatus("ready");
        setStatusText(
          result.letter
            ? `${result.letter} · ${(result.confidence * 100).toFixed(0)}%`
            : "Итгэлтэй дохио алга"
        );

        if (result.letter) {
          onPrediction(result.letter, result.confidence);
        }
      } catch {
        if (!cancelled) {
          setModelStatus("error");
          setStatusText("Таних сервер унтарсан");
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
    <section className="app-card flex flex-col gap-4 rounded-2xl p-4 lg:p-5">
      {/* Camera toggle header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyber-cyan/25 bg-cyber-cyan/10">
            <Camera className="h-5 w-5 text-cyber-cyan" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-cyber-text">Камерын дадлага</h2>
            <p className="text-xs text-cyber-text-muted">Зорилтот үсэг: <span className="font-mono text-cyber-text">{targetLetter || "-"}</span></p>
          </div>
        </div>
        <button
          onClick={() => setCameraOn((v) => !v)}
          className="flex items-center gap-2 rounded-xl border border-[var(--panel-border)] bg-cyber-elevated px-3 py-2 text-xs font-semibold text-cyber-text-secondary transition-colors hover:border-[var(--panel-hover-border)] hover:text-cyber-text cursor-pointer"
        >
          {cameraOn ? (
            <><CameraOff className="w-3.5 h-3.5" /> Унтраах</>
          ) : (
            <><Camera className="w-3.5 h-3.5" /> Асаах</>
          )}
        </button>
      </div>

      {/* Webcam */}
      <WebcamView ref={webcamRef} isActive={cameraOn} />

      <div className="flex items-center justify-between gap-3 rounded-xl border border-[var(--panel-border)] bg-cyber-elevated px-3 py-3 text-xs text-cyber-text-secondary">
        <span className="flex items-center gap-2 font-semibold">
          <Radio className="h-3.5 w-3.5 text-cyber-cyan" />
          Модель
        </span>
        <span className="flex min-w-0 items-center gap-2 font-semibold">
          {isPredicting && <Loader2 className="h-3.5 w-3.5 animate-spin text-cyber-cyan" />}
          <span
            className={`truncate ${
              modelStatus === "ready"
                ? "text-cyber-success"
                : modelStatus === "error"
                  ? "text-cyber-pink"
                  : "text-cyber-text-muted"
            }`}
          >
            {statusText}
          </span>
        </span>
      </div>

      {/* Simulate button */}
      <button
        onClick={onSimulate}
        disabled={isCompleted}
        className="w-full rounded-xl border border-cyber-cyan/25 bg-cyber-cyan/10 py-3 text-sm font-semibold text-cyber-text transition-colors hover:border-cyber-cyan/45 hover:bg-cyber-cyan/15 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        <span className="flex items-center justify-center gap-2">
          <Target className="w-4 h-4" />
          Дохио танилтыг турших
        </span>
      </button>
    </section>
  );
}
