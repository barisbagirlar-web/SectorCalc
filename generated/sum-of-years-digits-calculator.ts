// Auto-generated from sum-of-years-digits-calculator-schema.json
import * as z from 'zod';

export interface Sum_of_years_digits_calculatorInput {
  cost: number;
  salvage: number;
  life: number;
  year: number;
  dataConfidence?: number;
}

export const Sum_of_years_digits_calculatorInputSchema = z.object({
  cost: z.number().default(10000),
  salvage: z.number().default(1000),
  life: z.number().default(5),
  year: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Sum_of_years_digits_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.life * (input.life + 1) / 2; results["sum_of_years"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["sum_of_years"] = 0; }
  try { const v = input.cost - input.salvage; results["depreciable_base"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["depreciable_base"] = 0; }
  try { const v = input.life - input.year + 1; results["remaining_life"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["remaining_life"] = 0; }
  try { const v = (asFormulaNumber(results["remaining_life"])) / (asFormulaNumber(results["sum_of_years"])); results["depreciation_fraction"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["depreciation_fraction"] = 0; }
  try { const v = (asFormulaNumber(results["depreciable_base"])) * (asFormulaNumber(results["depreciation_fraction"])); results["depreciation_expense"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["depreciation_expense"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSum_of_years_digits_calculator(input: Sum_of_years_digits_calculatorInput): Sum_of_years_digits_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["depreciation_expense"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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


export interface Sum_of_years_digits_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
