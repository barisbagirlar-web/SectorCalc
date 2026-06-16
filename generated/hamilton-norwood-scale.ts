// Auto-generated from hamilton-norwood-scale-schema.json
import * as z from 'zod';

export interface Hamilton_norwood_scaleInput {
  age: number;
  frontal_recession_mm: number;
  vertex_thinning_percent: number;
  temporal_thinning_percent: number;
  family_history_score: number;
  duration_years: number;
}

export const Hamilton_norwood_scaleInputSchema = z.object({
  age: z.number().default(30),
  frontal_recession_mm: z.number().default(10),
  vertex_thinning_percent: z.number().default(20),
  temporal_thinning_percent: z.number().default(10),
  family_history_score: z.number().default(1),
  duration_years: z.number().default(5),
});

function evaluateAllFormulas(input: Hamilton_norwood_scaleInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.min(3, Math.floor(input.frontal_recession_mm / 10)); results["frontal_score"] = Number.isFinite(v) ? v : 0; } catch { results["frontal_score"] = 0; }
  try { const v = Math.min(3, Math.floor(input.vertex_thinning_percent / 25)); results["vertex_score"] = Number.isFinite(v) ? v : 0; } catch { results["vertex_score"] = 0; }
  try { const v = Math.min(2, Math.floor(input.temporal_thinning_percent / 20)); results["temporal_score"] = Number.isFinite(v) ? v : 0; } catch { results["temporal_score"] = 0; }
  try { const v = input.family_history_score; results["family_score"] = Number.isFinite(v) ? v : 0; } catch { results["family_score"] = 0; }
  try { const v = Math.min(2, Math.floor(input.duration_years / 5)); results["duration_score"] = Number.isFinite(v) ? v : 0; } catch { results["duration_score"] = 0; }
  try { const v = Math.min(2, Math.floor((input.age - 20) / 10)); results["age_score"] = Number.isFinite(v) ? v : 0; } catch { results["age_score"] = 0; }
  try { const v = (results["frontal_score"] ?? 0) + (results["vertex_score"] ?? 0) + (results["temporal_score"] ?? 0) + (results["family_score"] ?? 0) + (results["duration_score"] ?? 0) + (results["age_score"] ?? 0); results["raw_score"] = Number.isFinite(v) ? v : 0; } catch { results["raw_score"] = 0; }
  try { const v = Math.min(7, Math.max(1, Math.round((results["raw_score"] ?? 0) / 2))); results["norwood_stage"] = Number.isFinite(v) ? v : 0; } catch { results["norwood_stage"] = 0; }
  try { const v = (results["raw_score"] ?? 0) > 10 ? 'High' : ((results["raw_score"] ?? 0) > 6 ? 'Moderate' : 'Low'); results["progression_risk"] = Number.isFinite(v) ? v : 0; } catch { results["progression_risk"] = 0; }
  return results;
}


export function calculateHamilton_norwood_scale(input: Hamilton_norwood_scaleInput): Hamilton_norwood_scaleOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Norwood"] ?? 0;
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


export interface Hamilton_norwood_scaleOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
