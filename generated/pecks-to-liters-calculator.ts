// @ts-nocheck
// Auto-generated from pecks-to-liters-calculator-schema.json
import * as z from 'zod';

export interface Pecks_to_liters_calculatorInput {
  peckType: number;
  peckQuantity: number;
  decimalPlaces: number;
  uncertaintyMargin: number;
  roundingMode: number;
  temperature: number;
}

export const Pecks_to_liters_calculatorInputSchema = z.object({
  peckType: z.number().default(0),
  peckQuantity: z.number().default(1),
  decimalPlaces: z.number().default(2),
  uncertaintyMargin: z.number().default(0),
  roundingMode: z.number().default(0),
  temperature: z.number().default(20),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pecks_to_liters_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.peckType == 0 ? 8.80977 : 9.09218; results["conversionFactor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["conversionFactor"] = 0; }
  try { const v = input.peckQuantity * (asFormulaNumber(results["conversionFactor"])); results["liters"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["liters"] = 0; }
  try { const v = (asFormulaNumber(results["liters"])) * input.uncertaintyMargin / 100; results["uncertaintyLiters"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["uncertaintyLiters"] = 0; }
  try { const v = (asFormulaNumber(results["liters"])) + (asFormulaNumber(results["uncertaintyLiters"])); results["finalLiters"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["finalLiters"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePecks_to_liters_calculator(input: Pecks_to_liters_calculatorInput): Pecks_to_liters_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["finalLiters"]);
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


export interface Pecks_to_liters_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
