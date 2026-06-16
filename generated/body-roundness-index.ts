// Auto-generated from body-roundness-index-schema.json
import * as z from 'zod';

export interface Body_roundness_indexInput {
  waistCircumference: number;
  height: number;
}

export const Body_roundness_indexInputSchema = z.object({
  waistCircumference: z.number().default(80),
  height: z.number().default(170),
});

function evaluateAllFormulas(input: Body_roundness_indexInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.waistCircumference / 100; results["waistM"] = Number.isFinite(v) ? v : 0; } catch { results["waistM"] = 0; }
  try { const v = input.height / 100; results["heightM"] = Number.isFinite(v) ? v : 0; } catch { results["heightM"] = 0; }
  try { const v = (results["waistM"] ?? 0) / (2 * Math.PI); results["waistRadius"] = Number.isFinite(v) ? v : 0; } catch { results["waistRadius"] = 0; }
  try { const v = (results["heightM"] ?? 0) / 2; results["halfHeight"] = Number.isFinite(v) ? v : 0; } catch { results["halfHeight"] = 0; }
  try { const v = 1 - Math.pow((results["waistRadius"] ?? 0) / (results["halfHeight"] ?? 0), 2); results["innerTerm"] = Number.isFinite(v) ? v : 0; } catch { results["innerTerm"] = 0; }
  try { const v = Math.sqrt(Math.max(0, (results["innerTerm"] ?? 0))); results["sqrtTerm"] = Number.isFinite(v) ? v : 0; } catch { results["sqrtTerm"] = 0; }
  try { const v = 364.2 - 365.5 * (results["sqrtTerm"] ?? 0); results["bri"] = Number.isFinite(v) ? v : 0; } catch { results["bri"] = 0; }
  return results;
}


export function calculateBody_roundness_index(input: Body_roundness_indexInput): Body_roundness_indexOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["bri"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Body_roundness_indexOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
