// Auto-generated from us-mpg-to-uk-mpg-calculator-schema.json
import * as z from 'zod';

export interface Us_mpg_to_uk_mpg_calculatorInput {
  usMpg: number;
  conversionFactor: number;
  precision: number;
  referenceValue: number;
  dataConfidence?: number;
}

export const Us_mpg_to_uk_mpg_calculatorInputSchema = z.object({
  usMpg: z.number().default(25),
  conversionFactor: z.number().default(1.20095),
  precision: z.number().default(2),
  referenceValue: z.number().default(30),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Us_mpg_to_uk_mpg_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.usMpg * input.conversionFactor; results["rawUkMpg"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["rawUkMpg"] = 0; }
  try { const v = input.usMpg * input.conversionFactor; results["rawUkMpg_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["rawUkMpg_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateUs_mpg_to_uk_mpg_calculator(input: Us_mpg_to_uk_mpg_calculatorInput): Us_mpg_to_uk_mpg_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["rawUkMpg_aux"]));
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


export interface Us_mpg_to_uk_mpg_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
