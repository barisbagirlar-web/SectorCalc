// SectorCalc — Math Kernel Proxy Route (Elite Resilience Layer)
// Circuit Breaker + 3s timeout + Internal Auth Secret + Keep-Alive
// Fail closed: no client-side estimate is returned when the kernel is unavailable.
// https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 10;

// ── Configuration ──────────────────────────────────────────────────────────

const KERNEL_URL = process.env.MATH_KERNEL_URL ?? "http://127.0.0.1:8081";
const TIMEOUT_MS = 3_000; // Mathematical kernel must respond within 3 seconds
const CIRCUIT_BREAKER_THRESHOLD = 5; // 5 consecutive failures → open circuit
const RESET_TIMEOUT_MS = 30_000; // 30 seconds before half-open retry
const KERNEL_AUTH_SECRET = process.env.KERNEL_AUTH_SECRET ?? "";
const MATH_KERNEL_PROXY_ENABLED = process.env.MATH_KERNEL_PROXY_ENABLED === "true";

function configurationError(): NextResponse | null {
  if (!MATH_KERNEL_PROXY_ENABLED) {
    return NextResponse.json(
      { error: "Math Kernel proxy is disabled.", kernel_available: false, fallback: false },
      { status: 503 },
    );
  }
  if (!KERNEL_AUTH_SECRET) {
    return NextResponse.json(
      { error: "Math Kernel authentication is not configured.", kernel_available: false, fallback: false },
      { status: 503 },
    );
  }
  return null;
}

// ── Circuit Breaker State (in-memory, per-instance) ────────────────────────

let failureCount = 0;
let isCircuitOpen = false;
let lastFailureTime = 0;

function resetCircuitIfTimedOut(): void {
  if (!isCircuitOpen) return;
  const now = Date.now();
  if (now - lastFailureTime > RESET_TIMEOUT_MS) {
    isCircuitOpen = false;
    failureCount = 0;
  }
}

function recordFailure(): void {
  failureCount++;
  lastFailureTime = Date.now();
  if (failureCount >= CIRCUIT_BREAKER_THRESHOLD) {
    isCircuitOpen = true;
    console.error(
      `[MATH KERNEL] Circuit Breaker OPENED after ${failureCount} consecutive failures. ` +
      `Retry in ${RESET_TIMEOUT_MS / 1000}s.`
    );
  }
}

function recordSuccess(): void {
  failureCount = 0;
  isCircuitOpen = false;
}

// ── POST /api/math-kernel/calculate ────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
  const configError = configurationError();
  if (configError) return configError;

  // 1. Circuit Breaker Check
  resetCircuitIfTimedOut();
  if (isCircuitOpen) {
    console.warn("[MATH KERNEL] Request blocked — circuit open.");
    return NextResponse.json(
      {
        error:
          "Math Kernel is currently unavailable (Circuit Open). Calculation blocked.",
        kernel_available: false,
        fallback: false,
        circuit_open: true,
        retry_after_ms: lastFailureTime + RESET_TIMEOUT_MS - Date.now(),
      },
      { status: 503 },
    );
  }

  // 2. Parse & validate request body
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body", kernel_available: false },
      { status: 400 },
    );
  }

  const requiredFields = ["I", "CF", "r", "n", "RV"] as const;
  for (const field of requiredFields) {
    if (typeof payload[field] !== "number" || !Number.isFinite(payload[field])) {
      return NextResponse.json(
        { error: `Field ${field} must be a finite number.`, kernel_available: false },
        { status: 400 },
      );
    }
  }

  // 3. Proxy to Python kernel with circuit breaker + timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(`${KERNEL_URL}/calculate/npv`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Secret": KERNEL_AUTH_SECRET,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
      keepalive: true, // Prevent TCP handshake delay on pooled connections
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      recordFailure();
      const errorBody = await response.text().catch(() => "");
      return NextResponse.json(
        {
          error: `Kernel responded with HTTP ${response.status}: ${errorBody.slice(0, 300)}`,
          kernel_available: true,
          fallback: false,
        },
        { status: 502 },
      );
    }

    const data = await response.json();
    recordSuccess();

    return NextResponse.json({ success: true, data, kernel_available: true });
  } catch (err: unknown) {
    recordFailure();

    const isTimeout =
      err instanceof Error && err.name === "AbortError";
    const statusCode = isTimeout ? 504 : 503;
    const message = isTimeout
      ? "Kernel request timed out (>3s). Calculation blocked."
      : "Kernel unreachable. Calculation blocked.";

    console.error(
      `[MATH KERNEL] ${isTimeout ? "Timeout" : "Unreachable"} — ` +
      `failureCount=${failureCount}/${CIRCUIT_BREAKER_THRESHOLD}`
    );

    return NextResponse.json(
      { error: message, kernel_available: false, fallback: false, circuit_open: isCircuitOpen },
      { status: statusCode },
    );
  }
}

// ── GET /api/math-kernel/health ────────────────────────────────────────────

export async function GET(): Promise<NextResponse> {
  const configError = configurationError();
  if (configError) return configError;

  resetCircuitIfTimedOut();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(`${KERNEL_URL}/health`, {
      headers: { "X-Internal-Secret": KERNEL_AUTH_SECRET },
      signal: controller.signal,
      keepalive: true,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: `Kernel unhealthy: HTTP ${response.status}`,
        kernel_available: false,
        circuit_open: isCircuitOpen,
      });
    }

    const data = await response.json();
    recordSuccess();

    return NextResponse.json({
      success: true,
      data,
      kernel_available: true,
      circuit_state: isCircuitOpen ? "open" : "closed",
      failure_count: failureCount,
    });
  } catch {
    return NextResponse.json({
      success: false,
      error: "Kernel unreachable",
      kernel_available: false,
      circuit_open: isCircuitOpen,
    });
  }
}
