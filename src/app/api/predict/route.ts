import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

interface PredictRequest {
  features?: number[];
}

interface PredictResponse {
  letter: string | null;
  confidence: number;
  top?: Array<{ letter: string; confidence: number }>;
  source?: string;
  error?: string;
}

interface WorkerResponse extends PredictResponse {
  id?: number;
  ready?: boolean;
}

interface PendingRequest {
  resolve: (response: PredictResponse) => void;
  reject: (error: Error) => void;
  timeoutId: ReturnType<typeof setTimeout>;
}

let worker: ChildProcessWithoutNullStreams | null = null;
let stdoutBuffer = "";
let stderrBuffer = "";
let requestId = 0;
const pendingRequests = new Map<number, PendingRequest>();

function startWorker() {
  if (worker && !worker.killed) return worker;

  const scriptPath = "backend/asl_model/predict.py";
  const pythonBin = process.env.ASL_PYTHON_BIN ?? "python3";
  worker = spawn(pythonBin, [scriptPath, "--server"], {
    env: process.env,
    stdio: ["pipe", "pipe", "pipe"],
  });

  worker.stdout.on("data", (chunk: Buffer) => {
    stdoutBuffer += chunk.toString();
    const lines = stdoutBuffer.split("\n");
    stdoutBuffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.trim()) continue;

      let message: WorkerResponse;
      try {
        message = JSON.parse(line) as WorkerResponse;
      } catch {
        continue;
      }

      if (message.ready) continue;
      if (typeof message.id !== "number") continue;

      const pending = pendingRequests.get(message.id);
      if (!pending) continue;

      pendingRequests.delete(message.id);
      clearTimeout(pending.timeoutId);
      pending.resolve({
        letter: message.letter,
        confidence: message.confidence,
        top: message.top,
        source: message.source,
        error: message.error,
      });
    }
  });

  worker.stderr.on("data", (chunk: Buffer) => {
    stderrBuffer = (stderrBuffer + chunk.toString()).slice(-4000);
  });

  worker.on("close", (code) => {
    const error = new Error(stderrBuffer.trim() || `predict.py exited with code ${code}`);
    for (const pending of pendingRequests.values()) {
      clearTimeout(pending.timeoutId);
      pending.reject(error);
    }
    pendingRequests.clear();
    worker = null;
    stdoutBuffer = "";
    stderrBuffer = "";
  });

  worker.on("error", (error) => {
    for (const pending of pendingRequests.values()) {
      clearTimeout(pending.timeoutId);
      pending.reject(error);
    }
    pendingRequests.clear();
    worker = null;
  });

  return worker;
}

function runPythonPredictor(payload: PredictRequest): Promise<PredictResponse> {
  return new Promise((resolve, reject) => {
    const currentWorker = startWorker();
    const id = ++requestId;
    const timeoutId = setTimeout(() => {
      pendingRequests.delete(id);
      reject(new Error("Prediction timed out"));
    }, 4000);

    pendingRequests.set(id, { resolve, reject, timeoutId });
    currentWorker.stdin.write(`${JSON.stringify({ id, ...payload })}\n`);
  });
}

export async function POST(request: NextRequest) {
  let body: PredictRequest;

  try {
    body = (await request.json()) as PredictRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (body.features) {
    if (
      body.features.length !== 156 ||
      body.features.some((value) => typeof value !== "number" || !Number.isFinite(value))
    ) {
      return NextResponse.json({ error: "Expected 156 numeric landmark features" }, { status: 400 });
    }
  } else {
    return NextResponse.json(
      { error: "Expected 156 numeric landmark features" },
      { status: 400 }
    );
  }

  try {
    const prediction = await runPythonPredictor({ features: body.features });
    if (prediction.error) {
      return NextResponse.json(prediction, { status: 503 });
    }
    return NextResponse.json(prediction);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Prediction failed";
    return NextResponse.json(
      {
        letter: null,
        confidence: 0,
        error: message,
      },
      { status: 503 }
    );
  }
}
