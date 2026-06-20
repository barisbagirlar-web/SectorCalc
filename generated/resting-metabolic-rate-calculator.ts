// Auto-generated from resting-metabolic-rate-calculator-schema.json
import * as z from 'zod';

export interface Resting_metabolic_rate_calculatorInput {
  genderCode: number;
  age: number;
  weight: number;
  height: number;
  dataConfidence?: number;
}

export const Resting_metabolic_rate_calculatorInputSchema = z.object({
  genderCode: z.number().default(1),
  age: z.number().default(30),
  weight: z.number().default(70),
  height: z.number().default(170),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Resting_metabolic_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 10 * input.weight; results["weightContribution"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["weightContribution"] = Number.NaN; }
  try { const v = 6.25 * input.height; results["heightContribution"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["heightContribution"] = Number.NaN; }
  try { const v = -5 * input.age; results["ageContribution"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ageContribution"] = Number.NaN; }
  try { const v = 166 * input.genderCode - 161; results["genderOffset"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["genderOffset"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["weightContribution"])) + (toNumericFormulaValue(results["heightContribution"])) + (toNumericFormulaValue(results["ageContribution"])) + (toNumericFormulaValue(results["genderOffset"])); results["restingMetabolicRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["restingMetabolicRate"] = Number.NaN; }
  return results;
}


export function calculateResting_metabolic_rate_calculator(input: Resting_metabolic_rate_calculatorInput): Resting_metabolic_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["restingMetabolicRate"]);
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


export interface Resting_metabolic_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
