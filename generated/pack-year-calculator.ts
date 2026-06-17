// @ts-nocheck
// Auto-generated from pack-year-calculator-schema.json
import * as z from 'zod';

export interface Pack_year_calculatorInput {
  start_age: number;
  end_age: number;
  cigarettes_per_day: number;
  cigarettes_per_pack: number;
}

export const Pack_year_calculatorInputSchema = z.object({
  start_age: z.number().default(20),
  end_age: z.number().default(50),
  cigarettes_per_day: z.number().default(20),
  cigarettes_per_pack: z.number().default(20),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pack_year_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.end_age - input.start_age; results["years_smoked"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["years_smoked"] = 0; }
  try { const v = (input.cigarettes_per_day / input.cigarettes_per_pack) * (asFormulaNumber(results["years_smoked"])); results["pack_years"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["pack_years"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePack_year_calculator(input: Pack_year_calculatorInput): Pack_year_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["pack_years"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
