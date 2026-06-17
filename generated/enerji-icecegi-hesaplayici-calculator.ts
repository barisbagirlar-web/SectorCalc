// @ts-nocheck
// Auto-generated from enerji-icecegi-hesaplayici-calculator-schema.json
import * as z from 'zod';

export interface Enerji_icecegi_hesaplayici_calculatorInput {
  servings: number;
  caffeinePerServing: number;
  sugarPerServing: number;
  costPerCan: number;
  servingsPerCan: number;
}

export const Enerji_icecegi_hesaplayici_calculatorInputSchema = z.object({
  servings: z.number().default(1),
  caffeinePerServing: z.number().default(80),
  sugarPerServing: z.number().default(27),
  costPerCan: z.number().default(2.5),
  servingsPerCan: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Enerji_icecegi_hesaplayici_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.servings * input.caffeinePerServing; results["totalCaffeine"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCaffeine"] = 0; }
  try { const v = input.servings * input.sugarPerServing; results["totalSugar"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalSugar"] = 0; }
  try { const v = input.costPerCan / input.servingsPerCan; results["costPerServing"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["costPerServing"] = 0; }
  try { const v = (asFormulaNumber(results["totalCaffeine"])) / input.costPerCan; results["caffeinePerCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["caffeinePerCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateEnerji_icecegi_hesaplayici_calculator(input: Enerji_icecegi_hesaplayici_calculatorInput): Enerji_icecegi_hesaplayici_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCaffeine"]);
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


export interface Enerji_icecegi_hesaplayici_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
