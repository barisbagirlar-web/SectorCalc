// @ts-nocheck
// Auto-generated from us-shoe-size-to-eu-calculator-schema.json
import * as z from 'zod';

export interface Us_shoe_size_to_eu_calculatorInput {
  usSize: number;
  footLengthCm: number;
  gender: number;
  userAdjustment: number;
}

export const Us_shoe_size_to_eu_calculatorInputSchema = z.object({
  usSize: z.number().default(0),
  footLengthCm: z.number().default(0),
  gender: z.number().default(0),
  userAdjustment: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Us_shoe_size_to_eu_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = Number(input.usSize) > 0 ? (Number(input.gender) === 0 ? Number(input.usSize) + 33 : Number(input.gender) === 1 ? Number(input.usSize) + 31 : Number(input.usSize) + 16) : (Number(input.footLengthCm) > 0 ? 1.5 * (Number(input.footLengthCm) + 1.5) : 0); results["rawEurSize"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["rawEurSize"] = 0; }
  try { const v = Number((asFormulaNumber(results["rawEurSize"]))) + Number(input.userAdjustment); results["eurSize"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["eurSize"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateUs_shoe_size_to_eu_calculator(input: Us_shoe_size_to_eu_calculatorInput): Us_shoe_size_to_eu_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["eurSize"]);
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


export interface Us_shoe_size_to_eu_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
