// Auto-generated from age-in-days-calculator-schema.json
import * as z from 'zod';

export interface Age_in_days_calculatorInput {
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  refYear: number;
  refMonth: number;
  refDay: number;
  dataConfidence?: number;
}

export const Age_in_days_calculatorInputSchema = z.object({
  birthYear: z.number().default(1990),
  birthMonth: z.number().default(1),
  birthDay: z.number().default(1),
  refYear: z.number().default(2025),
  refMonth: z.number().default(1),
  refDay: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Age_in_days_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.birthYear * input.birthMonth * input.birthDay * input.refYear; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.birthYear * input.birthMonth * input.birthDay * input.refYear * (input.refMonth * input.refDay); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.refMonth * input.refDay; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateAge_in_days_calculator(input: Age_in_days_calculatorInput): Age_in_days_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Age_in_days_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
