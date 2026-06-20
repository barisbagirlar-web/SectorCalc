// Auto-generated from interior-paint-calculator-schema.json
import * as z from 'zod';

export interface Interior_paint_calculatorInput {
  length: number;
  width: number;
  height: number;
  numberDoors: number;
  numberWindows: number;
  paintCoverage: number;
  coats: number;
  ceilingIncluded: number;
  dataConfidence?: number;
}

export const Interior_paint_calculatorInputSchema = z.object({
  length: z.number().default(4),
  width: z.number().default(3),
  height: z.number().default(2.5),
  numberDoors: z.number().default(1),
  numberWindows: z.number().default(1),
  paintCoverage: z.number().default(10),
  coats: z.number().default(2),
  ceilingIncluded: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Interior_paint_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 2 * (input.length + input.width); results["wallPerimeter"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wallPerimeter"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["wallPerimeter"])) * input.height; results["wallArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wallArea"] = Number.NaN; }
  try { const v = input.numberDoors * 2; results["doorDeduction"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["doorDeduction"] = Number.NaN; }
  try { const v = input.numberWindows * 1.5; results["windowDeduction"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["windowDeduction"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["doorDeduction"])) + (toNumericFormulaValue(results["windowDeduction"])); results["deductionArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["deductionArea"] = Number.NaN; }
  try { const v = input.ceilingIncluded * input.length * input.width; results["ceilingArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ceilingArea"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["wallArea"])) - (toNumericFormulaValue(results["deductionArea"])) + (toNumericFormulaValue(results["ceilingArea"])); results["totalPaintableArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalPaintableArea"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["totalPaintableArea"])) * input.coats) / input.paintCoverage; results["paintLiters"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["paintLiters"] = Number.NaN; }
  return results;
}


export function calculateInterior_paint_calculator(input: Interior_paint_calculatorInput): Interior_paint_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["paintLiters"]);
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


export interface Interior_paint_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
