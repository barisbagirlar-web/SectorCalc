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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Interior_paint_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 2 * (input.length + input.width); results["wallPerimeter"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["wallPerimeter"] = 0; }
  try { const v = (asFormulaNumber(results["wallPerimeter"])) * input.height; results["wallArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["wallArea"] = 0; }
  try { const v = input.numberDoors * 2; results["doorDeduction"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["doorDeduction"] = 0; }
  try { const v = input.numberWindows * 1.5; results["windowDeduction"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["windowDeduction"] = 0; }
  try { const v = (asFormulaNumber(results["doorDeduction"])) + (asFormulaNumber(results["windowDeduction"])); results["deductionArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["deductionArea"] = 0; }
  try { const v = input.ceilingIncluded * input.length * input.width; results["ceilingArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ceilingArea"] = 0; }
  try { const v = (asFormulaNumber(results["wallArea"])) - (asFormulaNumber(results["deductionArea"])) + (asFormulaNumber(results["ceilingArea"])); results["totalPaintableArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalPaintableArea"] = 0; }
  try { const v = ((asFormulaNumber(results["totalPaintableArea"])) * input.coats) / input.paintCoverage; results["paintLiters"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["paintLiters"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
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
