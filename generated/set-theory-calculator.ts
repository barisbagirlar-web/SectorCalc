// Auto-generated from set-theory-calculator-schema.json
import * as z from 'zod';

export interface Set_theory_calculatorInput {
  sizeA: number;
  sizeB: number;
  sizeC: number;
  intersectAB: number;
  intersectAC: number;
  intersectBC: number;
  intersectABC: number;
  dataConfidence?: number;
}

export const Set_theory_calculatorInputSchema = z.object({
  sizeA: z.number().default(0),
  sizeB: z.number().default(0),
  sizeC: z.number().default(0),
  intersectAB: z.number().default(0),
  intersectAC: z.number().default(0),
  intersectBC: z.number().default(0),
  intersectABC: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Set_theory_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sizeA + input.sizeB - input.intersectAB; results["unionAB"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["unionAB"] = 0; }
  try { const v = input.sizeA + input.sizeB + input.sizeC - input.intersectAB - input.intersectAC - input.intersectBC + input.intersectABC; results["unionABC"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["unionABC"] = 0; }
  try { const v = input.intersectAB; results["intersectionAB"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["intersectionAB"] = 0; }
  try { const v = input.intersectABC; results["intersectionABC"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["intersectionABC"] = 0; }
  try { const v = input.sizeA - input.intersectAB - input.intersectAC + input.intersectABC; results["aOnly"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["aOnly"] = 0; }
  try { const v = input.sizeB - input.intersectAB - input.intersectBC + input.intersectABC; results["bOnly"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["bOnly"] = 0; }
  try { const v = input.sizeC - input.intersectAC - input.intersectBC + input.intersectABC; results["cOnly"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["cOnly"] = 0; }
  try { const v = input.sizeA + input.sizeB - 2 * input.intersectAB; results["symmetricDifferenceAB"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["symmetricDifferenceAB"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSet_theory_calculator(input: Set_theory_calculatorInput): Set_theory_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["unionABC"]);
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


export interface Set_theory_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
