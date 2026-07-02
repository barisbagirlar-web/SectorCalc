/**
 * Trust Trace wrapper for generated calculator results.
 * Adds a verification hash to every calculation result.
 * Uses synchronous hash computation to avoid async propagation.
 */

import type { GeneratedToolResult } from "@/lib/features/generated-tools/types";

const VERIFICATION_BASE_URL = "https://sectorcalc.com/verify";

/**
 * Simple synchronous hash function that produces a stable hex digest
 * for a given payload. This mirrors the async SHA-256 from hash.ts
 * but works synchronously for client-side calculation pipelines.
 */
function syncHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  // Convert to hex string, pad to 8 hex chars
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function canonicalize(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return "[" + value.map(canonicalize).join(",") + "]";
  const keys = Object.keys(value as Record<string, unknown>).sort();
  return "{" + keys.map((k) => JSON.stringify(k) + ":" + canonicalize((value as Record<string, unknown>)[k])).join(",") + "}";
}

export function wrapWithTrustTrace(result: GeneratedToolResult): GeneratedToolResult {
  try {
    const canonicalPayload = {
      breakdown: result.breakdown,
      hiddenLossDrivers: result.hiddenLossDrivers,
      suggestedActions: result.suggestedActions,
      dataConfidenceAdjusted: result.dataConfidenceAdjusted,
    };
    const canonical = canonicalize(canonicalPayload);
    const hash = syncHash(canonical);
    const timestamp = new Date().toISOString();

    return {
      ...result,
      trustTrace: {
        hash,
        verificationUrl: `${VERIFICATION_BASE_URL}?hash=${hash}`,
        timestamp,
      },
    };
  } catch {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[TrustTrace] Hash computation failed - returning result without trust trace");
    }
    return result;
  }
}
