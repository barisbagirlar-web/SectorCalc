// Auto-generated from enerji-icecegi-hesaplayici-calculator-schema.json
import * as z from 'zod';

export interface Enerji_icecegi_hesaplayici_calculatorInput {
  servings: number;
  caffeinePerServing: number;
  sugarPerServing: number;
  costPerCan: number;
  servingsPerCan: number;
  dataConfidence?: number;
}

export const Enerji_icecegi_hesaplayici_calculatorInputSchema = z.object({
  servings: z.number().default(1),
  caffeinePerServing: z.number().default(80),
  sugarPerServing: z.number().default(27),
  costPerCan: z.number().default(2.5),
  servingsPerCan: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Enerji_icecegi_hesaplayici_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.servings * input.caffeinePerServing; results["totalCaffeine"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCaffeine"] = 0; }
  try { const v = input.servings * input.sugarPerServing; results["totalSugar"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalSugar"] = 0; }
  try { const v = input.costPerCan / input.servingsPerCan; results["costPerServing"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["costPerServing"] = 0; }
  try { const v = (asFormulaNumber(results["totalCaffeine"])) / input.costPerCan; results["caffeinePerCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["caffeinePerCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateEnerji_icecegi_hesaplayici_calculator(input: Enerji_icecegi_hesaplayici_calculatorInput): Enerji_icecegi_hesaplayici_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCaffeine"]);
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


export interface Enerji_icecegi_hesaplayici_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
