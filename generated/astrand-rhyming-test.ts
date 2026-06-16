// Auto-generated from astrand-rhyming-test-schema.json
import * as z from 'zod';

export interface Astrand_rhyming_testInput {
  age: number;
  weight: number;
  heartRate: number;
  workload: number;
  gender: number;
}

export const Astrand_rhyming_testInputSchema = z.object({
  age: z.number().default(30),
  weight: z.number().default(70),
  heartRate: z.number().default(130),
  workload: z.number().default(100),
  gender: z.number().default(1),
});

function evaluateAllFormulas(input: Astrand_rhyming_testInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.workload * 10.8 / (input.heartRate - 60) + (input.gender === 1 ? 7.0 : 0.0); results["vo2max"] = Number.isFinite(v) ? v : 0; } catch { results["vo2max"] = 0; }
  try { const v = (results["vo2max"] ?? 0) / input.weight; results["vo2maxRelative"] = Number.isFinite(v) ? v : 0; } catch { results["vo2maxRelative"] = 0; }
  try { const v = (results["vo2maxRelative"] ?? 0) >= 40 ? 'Good' : 'Below Average'; results["classification"] = Number.isFinite(v) ? v : 0; } catch { results["classification"] = 0; }
  return results;
}


export function calculateAstrand_rhyming_test(input: Astrand_rhyming_testInput): Astrand_rhyming_testOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["vo2maxRelative"] ?? 0;
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


export interface Astrand_rhyming_testOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
