// Auto-generated from karvonen-formula-schema.json
import * as z from 'zod';

export interface Karvonen_formulaInput {
  age: number;
  resting_hr: number;
  max_hr: number;
  intensity_min: number;
  intensity_max: number;
}

export const Karvonen_formulaInputSchema = z.object({
  age: z.number().default(30),
  resting_hr: z.number().default(70),
  max_hr: z.number().default(190),
  intensity_min: z.number().default(60),
  intensity_max: z.number().default(80),
});

function evaluateAllFormulas(input: Karvonen_formulaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.max_hr - input.resting_hr; results["heartRateReserve"] = Number.isFinite(v) ? v : 0; } catch { results["heartRateReserve"] = 0; }
  try { const v = Math.round(input.resting_hr + (results["heartRateReserve"] ?? 0) * (input.intensity_min / 100)); results["targetHRMin"] = Number.isFinite(v) ? v : 0; } catch { results["targetHRMin"] = 0; }
  try { const v = Math.round(input.resting_hr + (results["heartRateReserve"] ?? 0) * (input.intensity_max / 100)); results["targetHRMax"] = Number.isFinite(v) ? v : 0; } catch { results["targetHRMax"] = 0; }
  results["heartRateReserve_bpm"] = 0;
  results["targetHRMin___targetHRMax_bpm"] = 0;
  results["result"] = 0;
  return results;
}


export function calculateKarvonen_formula(input: Karvonen_formulaInput): Karvonen_formulaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
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


export interface Karvonen_formulaOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
