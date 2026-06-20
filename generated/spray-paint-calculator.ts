// Auto-generated from spray-paint-calculator-schema.json
import * as z from 'zod';

export interface Spray_paint_calculatorInput {
  area: number;
  coverage: number;
  coats: number;
  wasteFactor: number;
  canVolume: number;
  dataConfidence?: number;
}

export const Spray_paint_calculatorInputSchema = z.object({
  area: z.number().default(10),
  coverage: z.number().default(10),
  coats: z.number().default(1),
  wasteFactor: z.number().default(10),
  canVolume: z.number().default(0.4),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Spray_paint_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.coverage * (1 - input.wasteFactor / 100); results["effectiveCoverage"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["effectiveCoverage"] = Number.NaN; }
  try { const v = (input.area * input.coats) / (toNumericFormulaValue(results["effectiveCoverage"])); results["totalPaintVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalPaintVolume"] = Number.NaN; }
  return results;
}


export function calculateSpray_paint_calculator(input: Spray_paint_calculatorInput): Spray_paint_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalPaintVolume"]);
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


export interface Spray_paint_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
