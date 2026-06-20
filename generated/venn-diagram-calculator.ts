// Auto-generated from venn-diagram-calculator-schema.json
import * as z from 'zod';

export interface Venn_diagram_calculatorInput {
  sizeA: number;
  sizeB: number;
  sizeC: number;
  intersectAB: number;
  intersectAC: number;
  intersectBC: number;
  intersectABC: number;
  universal: number;
  dataConfidence?: number;
}

export const Venn_diagram_calculatorInputSchema = z.object({
  sizeA: z.number().default(0),
  sizeB: z.number().default(0),
  sizeC: z.number().default(0),
  intersectAB: z.number().default(0),
  intersectAC: z.number().default(0),
  intersectBC: z.number().default(0),
  intersectABC: z.number().default(0),
  universal: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Venn_diagram_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sizeA + input.sizeB + input.sizeC - input.intersectAB - input.intersectAC - input.intersectBC + input.intersectABC; results["unionSize"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["unionSize"] = Number.NaN; }
  try { const v = input.sizeA - input.intersectAB - input.intersectAC + input.intersectABC; results["onlyA"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["onlyA"] = Number.NaN; }
  try { const v = input.sizeB - input.intersectAB - input.intersectBC + input.intersectABC; results["onlyB"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["onlyB"] = Number.NaN; }
  try { const v = input.sizeC - input.intersectAC - input.intersectBC + input.intersectABC; results["onlyC"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["onlyC"] = Number.NaN; }
  try { const v = input.intersectAB + input.intersectAC + input.intersectBC - 3 * input.intersectABC; results["exactlyTwo"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["exactlyTwo"] = Number.NaN; }
  try { const v = input.intersectABC; results["allThree"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["allThree"] = Number.NaN; }
  try { const v = input.universal - (input.sizeA + input.sizeB + input.sizeC - input.intersectAB - input.intersectAC - input.intersectBC + input.intersectABC); results["none"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["none"] = Number.NaN; }
  return results;
}


export function calculateVenn_diagram_calculator(input: Venn_diagram_calculatorInput): Venn_diagram_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["unionSize"]);
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


export interface Venn_diagram_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
