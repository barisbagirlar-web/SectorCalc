// Auto-generated from cat-age-calculator-schema.json
import * as z from 'zod';

export interface Cat_age_calculatorInput {
  cat_years: number;
  cat_months: number;
  lifestyle_factor: number;
  diet_factor: number;
  neuter_factor: number;
  dataConfidence?: number;
}

export const Cat_age_calculatorInputSchema = z.object({
  cat_years: z.number().default(1),
  cat_months: z.number().default(0),
  lifestyle_factor: z.number().default(1),
  diet_factor: z.number().default(1),
  neuter_factor: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cat_age_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cat_years * 12 + input.cat_months; results["total_months"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total_months"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["total_months"])) <= 12 ? 15 * ((toNumericFormulaValue(results["total_months"])) / 12) : (toNumericFormulaValue(results["total_months"])) <= 24 ? 15 + 9 * ((toNumericFormulaValue(results["total_months"])) / 12 - 1) : 24 + 4 * ((toNumericFormulaValue(results["total_months"])) / 12 - 2); results["base_human_age"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["base_human_age"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["base_human_age"])) * input.lifestyle_factor * input.diet_factor * input.neuter_factor; results["adjusted_human_age"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjusted_human_age"] = Number.NaN; }
  return results;
}


export function calculateCat_age_calculator(input: Cat_age_calculatorInput): Cat_age_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["adjusted_human_age"]);
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


export interface Cat_age_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
