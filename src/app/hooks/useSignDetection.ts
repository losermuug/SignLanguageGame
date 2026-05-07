"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  checkGestureApiHealth,
  classifyASLLetter,
  drawHandLandmarks,
  type ClassificationResult,
  type GesturePrediction,
} from "../lib/aslClassifier";

export interface PredictionResult {
  letter: string;
  confidence: number;
  top5: ClassificationResult[];
}

interface UseSignDetectionOptions {
  getVideo: () => HTMLVideoElement | null;
  getCanvas: () => HTMLCanvasElement | null;
  enabled: boolean;
  confidenceThreshold?: number;
  requiredConsecutive?: number;
  predictionIntervalMs?: number;
  onDetection?: (letter: string, confidence: number) => void;
}

export function useSignDetection({
  getVideo,
  getCanvas,
  enabled,
  confidenceThreshold = 0.45,
  requiredConsecutive = 4,
  predictionIntervalMs = 180,
  onDetection,
}: UseSignDetectionOptions) {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isModelReady, setIsModelReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [handDetected, setHandDetected] = useState(false);

  const onDetectionRef = useRef(onDetection);
  const requestRef = useRef<number | null>(null);
  const lastPredictionAtRef = useRef(0);
  const inFlightRef = useRef(false);
  const consecutiveRef = useRef<{ letter: string; count: number }>({
    letter: "",
    count: 0,
  });
  const lastConfirmedRef = useRef("");

  onDetectionRef.current = onDetection;

  const clearCanvas = useCallback(() => {
    const canvas = getCanvas();
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [getCanvas]);

  const resetTracking = useCallback(() => {
    setHandDetected(false);
    consecutiveRef.current = { letter: "", count: 0 };
    lastConfirmedRef.current = "";
    clearCanvas();
  }, [clearCanvas]);

  useEffect(() => {
    let cancelled = false;

    async function verifyApi() {
      if (!enabled) return;
      const ok = await checkGestureApiHealth();

      if (cancelled) return;
      setIsModelReady(ok);
      setError(ok ? null : "Gesture API is not running on http://localhost:5001.");
    }

    verifyApi();
    const timer = window.setInterval(verifyApi, 3000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [enabled]);

  const applyPrediction = useCallback(
    (result: GesturePrediction, video: HTMLVideoElement, canvas: HTMLCanvasElement) => {
      const ctx = canvas.getContext("2d");
      canvas.width = video.videoWidth || canvas.width;
      canvas.height = video.videoHeight || canvas.height;

      if (!result.handDetected || !result.letter) {
        setPrediction(null);
        resetTracking();
        return;
      }

      setHandDetected(true);
      if (ctx) {
        drawHandLandmarks(ctx, result.landmarks, canvas.width, canvas.height);
      }

      const top5 = result.top5.length
        ? result.top5
        : [{ letter: result.letter, confidence: result.confidence }];
      const top = top5[0];

      setPrediction({
        letter: top.letter,
        confidence: top.confidence,
        top5,
      });

      if (top.confidence < confidenceThreshold) {
        consecutiveRef.current = { letter: "", count: 0 };
        return;
      }

      const previous = consecutiveRef.current;
      if (previous.letter === top.letter) {
        previous.count += 1;
      } else {
        consecutiveRef.current = { letter: top.letter, count: 1 };
      }

      if (
        consecutiveRef.current.count >= requiredConsecutive &&
        lastConfirmedRef.current !== top.letter
      ) {
        lastConfirmedRef.current = top.letter;
        onDetectionRef.current?.(top.letter, top.confidence);
        consecutiveRef.current = { letter: "", count: 0 };
      }
    },
    [confidenceThreshold, requiredConsecutive, resetTracking]
  );

  const detectFrame = useCallback(async () => {
    if (!enabled) return;

    const video = getVideo();
    const canvas = getCanvas();
    const now = performance.now();

    if (
      isModelReady &&
      video &&
      canvas &&
      video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
      !inFlightRef.current &&
      now - lastPredictionAtRef.current >= predictionIntervalMs
    ) {
      lastPredictionAtRef.current = now;
      inFlightRef.current = true;
      setIsProcessing(true);

      try {
        const result = await classifyASLLetter(video);
        setError(null);
        applyPrediction(result, video, canvas);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Gesture detection failed.";
        setError(message);
      } finally {
        inFlightRef.current = false;
        setIsProcessing(false);
      }
    }

    requestRef.current = requestAnimationFrame(detectFrame);
  }, [
    enabled,
    getVideo,
    getCanvas,
    isModelReady,
    predictionIntervalMs,
    applyPrediction,
  ]);

  useEffect(() => {
    if (enabled) {
      requestRef.current = requestAnimationFrame(detectFrame);
    } else {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
      setPrediction(null);
      resetTracking();
    }

    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [enabled, detectFrame, resetTracking]);

  return {
    prediction,
    isModelReady,
    isProcessing,
    handDetected,
    error,
  };
}
