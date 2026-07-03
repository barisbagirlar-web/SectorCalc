// SectorCalc V5.3.1 — Premium Hook Builder
// Server-side only. Attaches monetization context to server execution response.

import "server-only";

import { B2B_MONETIZATION_REGISTRY } from "./monetization-registry";
import { calculateServerImpact } from "./server-impact-engine";
import type { PremiumHookPublic, ServerImpactInput } from "./monetization-types";

export function buildPremiumHook(
  input: ServerImpactInput,
): PremiumHookPublic | null {
  const config = B2B_MONETIZATION_REGISTRY[input.toolKey];
  if (!config) return null;

  const impact = calculateServerImpact(input);
  if (!impact) return null;

  return {
    free_output_key: config.freeOutputKey,
    pain_metric_key: config.painMetricKey,
    pain_metric: {
      value: impact.value,
      unit: impact.unit,
      display_currency: impact.displayCurrency,
      confidence: impact.confidence,
      status: impact.status,
      label: impact.publicLabel,
      explanation: impact.publicExplanation,
      safety_note: impact.safetyNote,
    },
    cta: {
      label: config.ctaLabel,
      subtext: config.ctaSubtext,
      unlock_type: config.premiumUnlockType,
      checkout_intent: "FREE_TOOL_PREMIUM_UPSELL",
      price_lookup_key: config.priceLookupKey,
    },
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
