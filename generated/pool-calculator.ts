// Auto-generated from pool-calculator-schema.json
import * as z from 'zod';

export interface Pool_calculatorInput {
  length: number;
  width: number;
  shallowDepth: number;
  deepDepth: number;
  dataConfidence?: number;
}

export const Pool_calculatorInputSchema = z.object({
  length: z.number().default(10),
  width: z.number().default(5),
  shallowDepth: z.number().default(1),
  deepDepth: z.number().default(2.5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pool_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.shallowDepth + input.deepDepth) / 2; results["averageDepth"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["averageDepth"] = 0; }
  try { const v = input.length * input.width; results["surfaceArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["surfaceArea"] = 0; }
  try { const v = (asFormulaNumber(results["surfaceArea"])) * (asFormulaNumber(results["averageDepth"])); results["volume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["volume"] = 0; }
  try { const v = (asFormulaNumber(results["volume"])) * 1000; results["volumeLiters"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["volumeLiters"] = 0; }
  try { const v = (asFormulaNumber(results["volume"])) * 264.172; results["volumeGallons"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["volumeGallons"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePool_calculator(input: Pool_calculatorInput): Pool_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["volume"]));
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


export interface Pool_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
