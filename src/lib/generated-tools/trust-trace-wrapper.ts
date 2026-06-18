/**
 * Trust Trace wrapper for generated calculator results.
 * Adds a verification hash to every calculation result.
 */

import { createCalculationHash } from "@/lib/trust-trace/hash";
import type { GeneratedToolResult } from "@/lib/generated-tools/types";

const VERIFICATION_BASE_URL = "https://sectorcalc.com/verify";

export async function wrapWithTrustTrace(
  result: GeneratedToolResult,
): Promise<GeneratedToolResult> {
  try {
    // Core payload for hashing: exclude transient metadata
    const canonicalPayload = {
      breakdown: result.breakdown,
      hiddenLossDrivers: result.hiddenLossDrivers,
      suggestedActions: result.suggestedActions,
      dataConfidenceAdjusted: result.dataConfidenceAdjusted,
    };
    const hash = await createCalculationHash(canonicalPayload);
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
    // Trust Trace failure is non-blocking — return result without trace
    return result;
  }
}
