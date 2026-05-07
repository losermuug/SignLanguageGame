interface Landmark {
  x: number;
  y: number;
}

export interface ClassificationResult {
  letter: string;
  confidence: number;
}

export interface GesturePrediction {
  letter: string | null;
  confidence: number;
  handDetected: boolean;
  top5: ClassificationResult[];
  landmarks: Landmark[];
}

interface GestureApiAlternative {
  label?: string;
  letter?: string;
  confidence?: number;
}

interface GestureApiResponse {
  letter?: string | null;
  confidence?: number;
  hand_detected?: boolean;
  top5?: GestureApiAlternative[];
  landmarks?: Landmark[];
  error?: string;
}

export const GESTURE_API_BASE_URL =
  process.env.NEXT_PUBLIC_GESTURE_API_URL ?? "http://localhost:5001";

const CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [5, 6], [6, 7], [7, 8],
  [9, 10], [10, 11], [11, 12],
  [13, 14], [14, 15], [15, 16],
  [17, 18], [18, 19], [19, 20],
  [0, 5], [5, 9], [9, 13], [13, 17], [0, 17],
];

const DISTANCE_PAIRS: [number, number][] = [
  [20, 0],
  [16, 0],
  [12, 0],
  [8, 0],
  [4, 0],
  [20, 16],
  [16, 12],
  [12, 8],
  [8, 4],
];

function normalizeTop5(top5: GestureApiAlternative[] = []): ClassificationResult[] {
  return top5
    .map((item) => ({
      letter: (item.letter ?? item.label ?? "").toUpperCase(),
      confidence: item.confidence ?? 0,
    }))
    .filter((item) => item.letter.length > 0);
}

function frameToDataUrl(video: HTMLVideoElement): string {
  const width = video.videoWidth || video.clientWidth;
  const height = video.videoHeight || video.clientHeight;
  const canvas = document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")?.drawImage(video, 0, 0, width, height);

  return canvas.toDataURL("image/jpeg", 0.82);
}

export async function checkGestureApiHealth(
  apiBaseUrl = GESTURE_API_BASE_URL
): Promise<boolean> {
  try {
    const response = await fetch(`${apiBaseUrl}/health`, { cache: "no-store" });
    return response.ok;
  } catch {
    return false;
  }
}

export async function classifyASLLetter(
  video: HTMLVideoElement,
  apiBaseUrl = GESTURE_API_BASE_URL
): Promise<GesturePrediction> {
  const image = frameToDataUrl(video);
  const response = await fetch(`${apiBaseUrl}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image }),
  });

  const payload = (await response.json()) as GestureApiResponse;

  if (!response.ok || payload.error) {
    throw new Error(payload.error ?? "Gesture API prediction failed");
  }

  const top5 = normalizeTop5(payload.top5);
  const letter = payload.letter ? payload.letter.toUpperCase() : null;

  return {
    letter,
    confidence: payload.confidence ?? top5[0]?.confidence ?? 0,
    handDetected: payload.hand_detected ?? Boolean(letter),
    top5,
    landmarks: payload.landmarks ?? [],
  };
}

export function drawHandLandmarks(
  ctx: CanvasRenderingContext2D,
  landmarks: Landmark[],
  width: number,
  height: number
) {
  ctx.clearRect(0, 0, width, height);
  if (landmarks.length < 21) return;

  ctx.shadowColor = "rgba(0, 240, 255, 0.3)";
  ctx.shadowBlur = 6;
  ctx.strokeStyle = "rgba(0, 240, 255, 0.6)";
  ctx.lineWidth = 2.5;

  for (const [i, j] of CONNECTIONS) {
    ctx.beginPath();
    ctx.moveTo(landmarks[i].x * width, landmarks[i].y * height);
    ctx.lineTo(landmarks[j].x * width, landmarks[j].y * height);
    ctx.stroke();
  }

  ctx.shadowBlur = 0;

  for (let i = 0; i < landmarks.length; i++) {
    const x = landmarks[i].x * width;
    const y = landmarks[i].y * height;
    const isTip = [0, 4, 8, 12, 16, 20].includes(i);

    ctx.beginPath();
    ctx.arc(x, y, isTip ? 5 : 3, 0, Math.PI * 2);
    ctx.fillStyle = isTip ? "rgba(0, 240, 255, 1)" : "rgba(0, 240, 255, 0.7)";
    ctx.shadowColor = "rgba(0, 240, 255, 0.8)";
    ctx.shadowBlur = isTip ? 12 : 0;
    ctx.fill();
  }

  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(168, 85, 247, 0.2)";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);

  for (const [i, j] of DISTANCE_PAIRS) {
    ctx.beginPath();
    ctx.moveTo(landmarks[i].x * width, landmarks[i].y * height);
    ctx.lineTo(landmarks[j].x * width, landmarks[j].y * height);
    ctx.stroke();
  }

  ctx.setLineDash([]);
}
