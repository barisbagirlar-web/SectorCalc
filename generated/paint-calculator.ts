// Auto-generated from paint-calculator-schema.json
import * as z from 'zod';

export interface Paint_calculatorInput {
  area: number;
  coverage: number;
  coats: number;
  wastage: number;
  dataConfidence?: number;
}

export const Paint_calculatorInputSchema = z.object({
  area: z.number().default(100),
  coverage: z.number().default(10),
  coats: z.number().default(2),
  wastage: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Paint_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.area * input.coats) / input.coverage; results["netPaint"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netPaint"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["netPaint"])) * (input.wastage / 100); results["wastagePaint"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wastagePaint"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["netPaint"])) + (toNumericFormulaValue(results["wastagePaint"])); results["totalPaint"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalPaint"] = Number.NaN; }
  return results;
}


export function calculatePaint_calculator(input: Paint_calculatorInput): Paint_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalPaint"]);
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


export interface Paint_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
