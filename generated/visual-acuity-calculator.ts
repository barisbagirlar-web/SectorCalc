// Auto-generated from visual-acuity-calculator-schema.json
import * as z from 'zod';

export interface Visual_acuity_calculatorInput {
  distance: number;
  letterHeight: number;
  snellenNumerator: number;
  overrideDenom: number;
}

export const Visual_acuity_calculatorInputSchema = z.object({
  distance: z.number().default(20),
  letterHeight: z.number().default(8.87),
  snellenNumerator: z.number().default(20),
  overrideDenom: z.number().default(0),
});

function evaluateAllFormulas(input: Visual_acuity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.letterHeight / 304.8; results["H_ft"] = Number.isFinite(v) ? v : 0; } catch { results["H_ft"] = 0; }
  try { const v = 2 * Math.atan((results["H_ft"] ?? 0) / (2 * input.distance)); results["alpha_rad"] = Number.isFinite(v) ? v : 0; } catch { results["alpha_rad"] = 0; }
  try { const v = (results["alpha_rad"] ?? 0) * (180 / Math.PI) * 60; results["alpha_min"] = Number.isFinite(v) ? v : 0; } catch { results["alpha_min"] = 0; }
  try { const v = (input.overrideDenom > 0) ? input.overrideDenom : (input.distance * ((results["alpha_min"] ?? 0) / 5)); results["denominator"] = Number.isFinite(v) ? v : 0; } catch { results["denominator"] = 0; }
  try { const v = input.snellenNumerator / (results["denominator"] ?? 0); results["decimalAcuity"] = Number.isFinite(v) ? v : 0; } catch { results["decimalAcuity"] = 0; }
  try { const v = -Math.log10((results["decimalAcuity"] ?? 0)); results["logMAR"] = Number.isFinite(v) ? v : 0; } catch { results["logMAR"] = 0; }
  return results;
}


export function calculateVisual_acuity_calculator(input: Visual_acuity_calculatorInput): Visual_acuity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["logMAR"] ?? 0;
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


export interface Visual_acuity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
