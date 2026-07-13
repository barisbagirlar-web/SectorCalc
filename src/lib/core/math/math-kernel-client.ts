/**
 * SectorCalc — Math Kernel Client
 *
 * Client for communicating with the Python interval arithmetic engine.
 * Wraps the kernel API and provides typed TypeScript methods.
 *
 * The kernel is optional — if unavailable, the system falls back to
 * the existing TypeScript calculation engine (without interval bounds).
 */

import type {
  BoundedMetric,
  MathKernelHealth,
  MathKernelResponse,
  MmsRunResponse,
  NpvBoundedOutput,
} from "./bounded-result-types";

// ── Configuration ─────────────────────────────────────────────────────────

const KERNEL_BASE_URL = process.env.MATH_KERNEL_URL ?? "http://127.0.0.1:8081";
const KERNEL_TIMEOUT_MS = 30_000; // 30 seconds

// ── Internal helpers ──────────────────────────────────────────────────────

function kernelUrl(path: string): string {
  return `${KERNEL_BASE_URL}${path}`;
}

async function kernelFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<MathKernelResponse<T>> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), KERNEL_TIMEOUT_MS);

    const response = await fetch(kernelUrl(path), {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      return {
        success: false,
        error: `Kernel HTTP ${response.status}: ${body.slice(0, 200)}`,
        kernel_available: true,
      };
    }

    const data = (await response.json()) as T;
    return { success: true, data, kernel_available: true };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.name === "AbortError"
          ? "Kernel request timed out"
          : err.message
        : "Unknown kernel error";
    return { success: false, error: message, kernel_available: false };
  }
}

// ── Public API ────────────────────────────────────────────────────────────

/**
 * Check if the math kernel is available and healthy.
 */
export async function checkKernelHealth(): Promise<MathKernelResponse<MathKernelHealth>> {
  return kernelFetch<MathKernelHealth>("/health");
}

/**
 * Calculate NPV with verified interval bounds via the Python kernel.
 *
 * @param inputs - NPV input parameters
 * @returns Bounded NPV output or error
 */
export async function calculateNpvBounded(inputs: {
  I: number;
  CF: number;
  r: number;
  n: number;
  RV: number;
  max_interval_width?: number;
}): Promise<MathKernelResponse<NpvBoundedOutput>> {
  return kernelFetch<NpvBoundedOutput>("/calculate/npv", {
    method: "POST",
    body: JSON.stringify(inputs),
  });
}

/**
 * Run batch sensitivity analysis.
 */
export async function calculateNpvBatch(
  base: {
    I: number;
    CF: number;
    r: number;
    n: number;
    RV: number;
  },
  scenarios: Array<Partial<{
    I: number;
    CF: number;
    r: number;
    n: number;
    RV: number;
  }>>,
): Promise<MathKernelResponse<NpvBoundedOutput[]>> {
  return kernelFetch<NpvBoundedOutput[]>("/calculate/batch", {
    method: "POST",
    body: JSON.stringify({ base, scenarios }),
  });
}

/**
 * Run the full MMS test suite against the kernel and return results.
 */
export async function runMmsSuite(): Promise<MathKernelResponse<MmsRunResponse>> {
  return kernelFetch<MmsRunResponse>("/mms/run");
}

/**
 * Determine if the kernel-style bounded display should be used.
 * Returns false if kernel is unavailable (falls back to standard display).
 */
export async function shouldUseBoundedDisplay(): Promise<boolean> {
  const health = await checkKernelHealth();
  return health.success;
}

/**
 * Create a fallback BoundedMetric from a bare float when the kernel is unavailable.
 * This ensures the UI contract is never broken even without the Python kernel.
 */
export function createFallbackBoundedMetric(
  value: number,
  estimatedErrorMargin: number = 0,
): BoundedMetric {
  const halfWidth = Math.abs(value * estimatedErrorMargin);
  return {
    value,
    lower_bound: value - halfWidth,
    upper_bound: value + halfWidth,
    ulp_error_margin: halfWidth,
    status: estimatedErrorMargin > 0 ? "FALLBACK_ESTIMATE" : "FALLBACK_EXACT",
  };
}
