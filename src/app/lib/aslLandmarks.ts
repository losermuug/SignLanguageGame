"use client";

import {
  FilesetResolver,
  HandLandmarker,
  PoseLandmarker,
  type HandLandmarkerResult,
  type NormalizedLandmark,
  type PoseLandmarkerResult,
} from "@mediapipe/tasks-vision";

const TASKS_VERSION = "0.10.35";
const WASM_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${TASKS_VERSION}/wasm`;
const HAND_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";
const POSE_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task";

const HAND_LANDMARK_COUNT = 21;
const POSE_COLUMNS = [13, 15, 17, 19, 21, 14, 16, 18, 20, 22];
const SMOOTHING_ALPHA = 0.42;
const DRAW_MIRRORED = true;
const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [0, 9], [9, 10], [10, 11], [11, 12],
  [0, 13], [13, 14], [14, 15], [15, 16],
  [0, 17], [17, 18], [18, 19], [19, 20],
] as const;
const POSE_CONNECTIONS = [
  [13, 15], [15, 17], [17, 19], [19, 21],
  [14, 16], [16, 18], [18, 20], [20, 22],
] as const;

let smoothedRightHand: NormalizedLandmark[] = [];
let smoothedLeftHand: NormalizedLandmark[] = [];
let smoothedPose: NormalizedLandmark[] = [];

export interface LandmarkDetectors {
  hands: HandLandmarker;
  pose: PoseLandmarker;
}

export interface LandmarkPredictionInput {
  features: number[];
  handsDetected: number;
  poseDetected: boolean;
  heuristicLetter: string | null;
  heuristicConfidence: number;
}

export async function createLandmarkDetectors(): Promise<LandmarkDetectors> {
  const vision = await FilesetResolver.forVisionTasks(WASM_URL);
  const [hands, pose] = await Promise.all([
    HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: HAND_MODEL_URL,
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      numHands: 2,
      minHandDetectionConfidence: 0.45,
      minHandPresenceConfidence: 0.45,
      minTrackingConfidence: 0.45,
    }),
    PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: POSE_MODEL_URL,
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      numPoses: 1,
      minPoseDetectionConfidence: 0.45,
      minPosePresenceConfidence: 0.45,
      minTrackingConfidence: 0.45,
    }),
  ]);

  return { hands, pose };
}

export function getLandmarkPredictionInput(
  video: HTMLVideoElement,
  detectors: LandmarkDetectors,
  canvas: HTMLCanvasElement | null
): LandmarkPredictionInput | null {
  const timestamp = performance.now();
  const handResult = detectors.hands.detectForVideo(video, timestamp);
  const poseResult = detectors.pose.detectForVideo(video, timestamp);

  const hands = pickHands(handResult);
  smoothedRightHand = smoothLandmarks(smoothedRightHand, hands.right);
  smoothedLeftHand = smoothLandmarks(smoothedLeftHand, hands.left);
  smoothedPose = smoothLandmarks(smoothedPose, poseResult.landmarks[0] ?? []);

  drawLandmarks(canvas, smoothedRightHand, smoothedLeftHand, smoothedPose);

  const features = [
    ...axisValues("x", smoothedRightHand, smoothedLeftHand, smoothedPose),
    ...axisValues("y", smoothedRightHand, smoothedLeftHand, smoothedPose),
    ...axisValues("z", smoothedRightHand, smoothedLeftHand, smoothedPose),
  ];

  if (features.every((value) => value === 0)) {
    return null;
  }

  return {
    features,
    handsDetected: handResult.landmarks.length,
    poseDetected: smoothedPose.length > 0,
    ...detectHeuristicLetter(smoothedRightHand, smoothedLeftHand),
  };
}

function pickHands(result: HandLandmarkerResult) {
  let right: NormalizedLandmark[] = [];
  let left: NormalizedLandmark[] = [];

  result.landmarks.forEach((landmarks, index) => {
    const label = result.handedness[index]?.[0]?.categoryName;
    if (label === "Right") {
      right = landmarks;
    } else if (label === "Left") {
      left = landmarks;
    }
  });

  if (!right.length && !left.length && result.landmarks[0]) {
    right = result.landmarks[0];
  }

  return { right, left };
}

function axisValues(
  axis: "x" | "y" | "z",
  rightHand: NormalizedLandmark[],
  leftHand: NormalizedLandmark[],
  pose: NormalizedLandmark[]
) {
  const values: number[] = [];

  for (let index = 0; index < HAND_LANDMARK_COUNT; index += 1) {
    values.push(readLandmarkValue(rightHand[index], axis));
  }
  for (let index = 0; index < HAND_LANDMARK_COUNT; index += 1) {
    values.push(readLandmarkValue(leftHand[index], axis));
  }
  for (const index of POSE_COLUMNS) {
    values.push(readLandmarkValue(pose[index], axis));
  }

  return values;
}

function readLandmarkValue(landmark: NormalizedLandmark | undefined, axis: "x" | "y" | "z") {
  const value = landmark?.[axis];
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function detectHeuristicLetter(rightHand: NormalizedLandmark[], leftHand: NormalizedLandmark[]) {
  const hands = [rightHand, leftHand].filter((hand) => hand.length >= HAND_LANDMARK_COUNT);
  const bestOScore = Math.max(0, ...hands.map(getOShapeScore));
  const bestDScore = Math.max(0, ...hands.map(getDShapeScore));

  if (bestDScore >= 0.9) {
    return { heuristicLetter: "D", heuristicConfidence: 0.9 };
  }

  if (bestOScore >= 0.72) {
    return { heuristicLetter: "O", heuristicConfidence: Math.min(0.95, bestOScore) };
  }

  return { heuristicLetter: null, heuristicConfidence: 0 };
}

function getDShapeScore(hand: NormalizedLandmark[]) {
  if (hand.length < HAND_LANDMARK_COUNT) return 0;

  const scale = distance(hand[0], hand[9]);
  if (scale <= 0.001) return 0;

  const indexExtension = distance(hand[8], hand[5]) / scale;
  const middleCurl = distance(hand[12], hand[9]) / scale;
  const ringCurl = distance(hand[16], hand[13]) / scale;
  const pinkyCurl = distance(hand[20], hand[17]) / scale;
  const thumbToMiddle = distance(hand[4], hand[12]) / scale;
  const thumbToRing = distance(hand[4], hand[16]) / scale;
  const indexTipAbovePip = hand[8].y < hand[6].y;

  return Number(
    indexExtension > 1.05 &&
    indexTipAbovePip &&
    middleCurl < 1.05 &&
    ringCurl < 1.05 &&
    pinkyCurl < 1.05 &&
    Math.min(thumbToMiddle, thumbToRing) < 0.72
  );
}

function getOShapeScore(hand: NormalizedLandmark[]) {
  if (hand.length < HAND_LANDMARK_COUNT) return 0;

  const scale = Math.max(distance(hand[0], hand[9]), distance(hand[5], hand[17]));
  if (scale <= 0.001) return 0;

  const thumbTip = hand[4];
  const indexTip = hand[8];
  const middleTip = hand[12];
  const ringTip = hand[16];
  const pinkyTip = hand[20];
  const tipCluster =
    (distance(indexTip, middleTip) + distance(middleTip, ringTip) + distance(ringTip, pinkyTip)) /
    scale;
  const thumbToCluster =
    Math.min(
      distance(thumbTip, indexTip),
      distance(thumbTip, middleTip),
      distance(thumbTip, ringTip),
      distance(thumbTip, pinkyTip)
    ) / scale;
  const averageTipToPalm =
    (distance(indexTip, hand[0]) +
      distance(middleTip, hand[0]) +
      distance(ringTip, hand[0]) +
      distance(pinkyTip, hand[0])) /
    (4 * scale);
  const indexExtension = distance(indexTip, hand[5]) / scale;
  const middleExtension = distance(middleTip, hand[9]) / scale;
  const ringExtension = distance(ringTip, hand[13]) / scale;
  const pinkyExtension = distance(pinkyTip, hand[17]) / scale;
  const extendedPenalty = Math.max(indexExtension, middleExtension, ringExtension, pinkyExtension);

  const clusterScore = clamp01((2.15 - tipCluster) / 1.55);
  const thumbScore = clamp01((1.15 - thumbToCluster) / 0.85);
  const palmScore = clamp01((1.85 - averageTipToPalm) / 1.15);
  const curlScore = clamp01((1.7 - extendedPenalty) / 1.1);

  return clusterScore * 0.34 + thumbScore * 0.26 + palmScore * 0.2 + curlScore * 0.2;
}

function distance(a: NormalizedLandmark, b: NormalizedLandmark) {
  return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function smoothLandmarks(previous: NormalizedLandmark[], current: NormalizedLandmark[]) {
  if (!current.length) return [];
  if (!previous.length || previous.length !== current.length) {
    return current.map((landmark) => ({ ...landmark }));
  }

  return current.map((landmark, index) => ({
    x: previous[index].x + (landmark.x - previous[index].x) * SMOOTHING_ALPHA,
    y: previous[index].y + (landmark.y - previous[index].y) * SMOOTHING_ALPHA,
    z: previous[index].z + (landmark.z - previous[index].z) * SMOOTHING_ALPHA,
    visibility:
      previous[index].visibility +
      ((landmark.visibility ?? 1) - previous[index].visibility) * SMOOTHING_ALPHA,
  }));
}

function drawLandmarks(
  canvas: HTMLCanvasElement | null,
  rightHand: NormalizedLandmark[],
  leftHand: NormalizedLandmark[],
  pose: NormalizedLandmark[]
) {
  if (!canvas) return;

  const context = canvas.getContext("2d");
  if (!context) return;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.lineCap = "round";
  context.lineJoin = "round";

  drawConnectedPoints(context, rightHand, HAND_CONNECTIONS, canvas.width, canvas.height, {
    line: "rgba(0, 240, 255, 0.45)",
    point: "rgba(0, 240, 255, 0.95)",
    radius: 3,
  });
  drawConnectedPoints(context, leftHand, HAND_CONNECTIONS, canvas.width, canvas.height, {
    line: "rgba(52, 211, 153, 0.42)",
    point: "rgba(52, 211, 153, 0.9)",
    radius: 3,
  });
  drawConnectedPoints(context, pose, POSE_CONNECTIONS, canvas.width, canvas.height, {
    line: "rgba(167, 139, 250, 0.32)",
    point: "rgba(167, 139, 250, 0.82)",
    radius: 4,
  });
}

function drawConnectedPoints(
  context: CanvasRenderingContext2D,
  landmarks: NormalizedLandmark[],
  connections: readonly (readonly [number, number])[],
  width: number,
  height: number,
  style: { line: string; point: string; radius: number }
) {
  if (!landmarks.length) return;

  context.strokeStyle = style.line;
  context.lineWidth = 2;
  for (const [start, end] of connections) {
    const from = landmarks[start];
    const to = landmarks[end];
    if (!from || !to) continue;

    context.beginPath();
    context.moveTo(drawX(from.x, width), from.y * height);
    context.lineTo(drawX(to.x, width), to.y * height);
    context.stroke();
  }

  context.fillStyle = style.point;
  for (const landmark of landmarks) {
    context.beginPath();
    context.arc(drawX(landmark.x, width), landmark.y * height, style.radius, 0, Math.PI * 2);
    context.fill();
  }
}

function drawX(x: number, width: number) {
  return (DRAW_MIRRORED ? 1 - x : x) * width;
}
