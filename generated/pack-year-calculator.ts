// Auto-generated from pack-year-calculator-schema.json
import * as z from 'zod';

export interface Pack_year_calculatorInput {
  start_age: number;
  end_age: number;
  cigarettes_per_day: number;
  cigarettes_per_pack: number;
  dataConfidence?: number;
}

export const Pack_year_calculatorInputSchema = z.object({
  start_age: z.number().default(20),
  end_age: z.number().default(50),
  cigarettes_per_day: z.number().default(20),
  cigarettes_per_pack: z.number().default(20),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Pack_year_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.end_age - input.start_age; results["years_smoked"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["years_smoked"] = Number.NaN; }
  try { const v = (input.cigarettes_per_day / input.cigarettes_per_pack) * (toNumericFormulaValue(results["years_smoked"])); results["pack_years"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pack_years"] = Number.NaN; }
  return results;
}


export function calculatePack_year_calculator(input: Pack_year_calculatorInput): Pack_year_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["pack_years"]);
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


export interface Pack_year_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
