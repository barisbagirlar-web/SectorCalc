// Auto-generated from effective-dose-calculator-schema.json
import * as z from 'zod';

export interface Effective_dose_calculatorInput {
  absorbedDose: number;
  numExposures: number;
  wR: number;
  wT: number;
  convFactor: number;
}

export const Effective_dose_calculatorInputSchema = z.object({
  absorbedDose: z.number().default(10),
  numExposures: z.number().default(1),
  wR: z.number().default(1),
  wT: z.number().default(0.12),
  convFactor: z.number().default(1),
});

function evaluateAllFormulas(input: Effective_dose_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.absorbedDose * input.numExposures * input.wR * input.convFactor; results["equivalentDose_mSv"] = Number.isFinite(v) ? v : 0; } catch { results["equivalentDose_mSv"] = 0; }
  try { const v = (results["equivalentDose_mSv"] ?? 0) * input.wT; results["effectiveDose_mSv"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveDose_mSv"] = 0; }
  return results;
}


export function calculateEffective_dose_calculator(input: Effective_dose_calculatorInput): Effective_dose_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["effectiveDose_mSv"] ?? 0;
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


export interface Effective_dose_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
