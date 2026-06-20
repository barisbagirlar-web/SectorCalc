// Auto-generated from basal-metabolic-rate-schema.json
import * as z from 'zod';

export interface Basal_metabolic_rateInput {
  weight: number;
  height: number;
  age: number;
  gender: number;
  dataConfidence?: number;
}

export const Basal_metabolic_rateInputSchema = z.object({
  weight: z.number().default(70),
  height: z.number().default(170),
  age: z.number().default(30),
  gender: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Basal_metabolic_rateInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 10 * input.weight + 6.25 * input.height - 5 * input.age; results["base"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["base"] = Number.NaN; }
  try { const v = input.gender == 1 ? 5 : -161; results["gender_adjustment"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["gender_adjustment"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["base"])) + (toNumericFormulaValue(results["gender_adjustment"])); results["bmr"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bmr"] = Number.NaN; }
  return results;
}


export function calculateBasal_metabolic_rate(input: Basal_metabolic_rateInput): Basal_metabolic_rateOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["bmr"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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


export interface Basal_metabolic_rateOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
