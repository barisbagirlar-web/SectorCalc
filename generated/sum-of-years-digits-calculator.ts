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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Sum_of_years_digits_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.life * (input.life + 1) / 2; results["sum_of_years"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sum_of_years"] = Number.NaN; }
  try { const v = input.cost - input.salvage; results["depreciable_base"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["depreciable_base"] = Number.NaN; }
  try { const v = input.life - input.year + 1; results["remaining_life"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["remaining_life"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["remaining_life"])) / (toNumericFormulaValue(results["sum_of_years"])); results["depreciation_fraction"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["depreciation_fraction"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["depreciable_base"])) * (toNumericFormulaValue(results["depreciation_fraction"])); results["depreciation_expense"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["depreciation_expense"] = Number.NaN; }
  return results;
}


export function calculateSum_of_years_digits_calculator(input: Sum_of_years_digits_calculatorInput): Sum_of_years_digits_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["depreciation_expense"]);
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


export interface Sum_of_years_digits_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
